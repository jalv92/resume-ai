import { saveAnalysis, jsonResponse, errorResponse, requireEnv } from './_shared';
import type { Analysis } from '../../src/types';

const SYSTEM_PROMPT = `You are an expert technical recruiter and resume coach. You score how well a candidate's resume matches a job description, then write specific, actionable advice.

Rules:
- Be honest, not generous. A 95+ is rare. Most decent matches are 55-75.
- Quote phrases from the JD verbatim when extracting ATS keywords.
- Bullet rewrites must transform a specific line from the resume — never invent achievements.
- Tone: direct, no fluff, no emojis, no "elevator pitch" clichés.
- Output ONLY valid JSON matching the schema. No prose, no markdown fences.`;

const SCHEMA_GUIDE = `Schema (strict):
{
  "score": number 0-100,
  "oneLineVerdict": string (max 110 chars, sharp, opinionated),
  "strengths": string[] (3 to 5 items, each <= 180 chars),
  "gaps": string[] (3 to 5 items),
  "atsKeywords": string[] (4 to 8 items, exact phrases from the JD missing in the resume),
  "bulletRewrites": [
    { "original": string, "improved": string, "reason": string }
  ] (3 to 5 items; "original" must be a real-ish bullet derived from the resume input),
  "coverLetterHook": string (1-2 sentences for the opening of a cover letter),
  "nextSteps": string[] (exactly 3 items, concrete, do-this-week actions)
}`;

function buildPrompt(resume: string, jd: string): string {
  return `${SYSTEM_PROMPT}

${SCHEMA_GUIDE}

---
RESUME:
"""
${resume.slice(0, 12000)}
"""

JOB DESCRIPTION:
"""
${jd.slice(0, 8000)}
"""

Return only the JSON object.`;
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = requireEnv('GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 500)}`);
  }
  const data = (await res.json()) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no content');
  return text;
}

function tryParseAnalysis(raw: string): Analysis {
  // Strip code fences if model ignored mime type
  const cleaned = raw
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
  const parsed = JSON.parse(cleaned);

  const a: Analysis = {
    score: Math.max(0, Math.min(100, Math.round(Number(parsed.score)))),
    oneLineVerdict: String(parsed.oneLineVerdict ?? '').slice(0, 220),
    strengths: arr(parsed.strengths, 3, 5),
    gaps: arr(parsed.gaps, 3, 5),
    atsKeywords: arr(parsed.atsKeywords, 3, 10),
    bulletRewrites: (Array.isArray(parsed.bulletRewrites) ? parsed.bulletRewrites : [])
      .slice(0, 5)
      .map((b: any) => ({
        original: String(b?.original ?? '').slice(0, 400),
        improved: String(b?.improved ?? '').slice(0, 400),
        reason: String(b?.reason ?? '').slice(0, 280),
      }))
      .filter((b: any) => b.original && b.improved),
    coverLetterHook: String(parsed.coverLetterHook ?? '').slice(0, 600),
    nextSteps: arr(parsed.nextSteps, 3, 3),
  };

  if (!a.oneLineVerdict || a.strengths.length < 3 || a.gaps.length < 3 || a.bulletRewrites.length < 2) {
    throw new Error('Gemini response missing required fields');
  }
  return a;
}

function arr(x: unknown, min: number, max: number): string[] {
  const arrRaw = Array.isArray(x) ? x : [];
  const cleaned = arrRaw.map((v) => String(v ?? '').trim()).filter(Boolean).slice(0, max);
  if (cleaned.length < min) {
    // Pad to min so downstream UI doesn't break; the validator above flags real failures.
  }
  return cleaned;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return errorResponse(405, 'Method not allowed');

  let payload: { resume?: string; jobDescription?: string };
  try {
    payload = (await req.json()) as any;
  } catch {
    return errorResponse(400, 'Invalid JSON body');
  }

  const resume = (payload.resume ?? '').trim();
  const jd = (payload.jobDescription ?? '').trim();
  if (resume.length < 200) return errorResponse(400, 'Resume is too short (min 200 chars).');
  if (jd.length < 80) return errorResponse(400, 'Job description is too short (min 80 chars).');

  let analysis: Analysis;
  try {
    const raw = await callGemini(buildPrompt(resume, jd));
    analysis = tryParseAnalysis(raw);
  } catch (e: any) {
    console.error('Gemini failure:', e?.message);
    return errorResponse(502, `AI analysis failed: ${e?.message ?? 'unknown error'}`);
  }

  const id = crypto.randomUUID();
  const jobTitleGuess = (jd.split('\n')[0] || 'Untitled role').slice(0, 80);
  try {
    await saveAnalysis({
      id,
      createdAt: new Date().toISOString(),
      paid: false,
      analysis,
      resumePreview: resume.slice(0, 200),
      jobTitleGuess,
    });
  } catch (e: any) {
    console.error('Blob save failure:', e?.message);
    return errorResponse(500, 'Could not save analysis. Try again.');
  }

  return jsonResponse(200, {
    id,
    score: analysis.score,
    oneLineVerdict: analysis.oneLineVerdict,
    strengthsCount: analysis.strengths.length,
    gapsCount: analysis.gaps.length,
    atsKeywordsCount: analysis.atsKeywords.length,
    bulletRewritesCount: analysis.bulletRewrites.length,
  });
};
