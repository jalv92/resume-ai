import type { AnalyzeResponse, ReportResponse } from '../types';

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let parsed: any;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { error: text };
  }
  if (!res.ok) {
    const msg = parsed?.error || parsed?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return parsed as T;
}

export async function analyze(input: { resume: string; jobDescription: string }): Promise<AnalyzeResponse> {
  return postJson<AnalyzeResponse>('/api/analyze', input);
}

export async function createCheckout(analysisId: string): Promise<{ url: string }> {
  return postJson<{ url: string }>('/api/create-checkout', { analysisId });
}

export async function getReport(sessionId: string): Promise<ReportResponse> {
  const res = await fetch(`/api/get-report?session_id=${encodeURIComponent(sessionId)}`);
  const text = await res.text();
  let parsed: any;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { error: text };
  }
  if (!res.ok) {
    const msg = parsed?.error || parsed?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return parsed as ReportResponse;
}
