import { getStore } from '@netlify/blobs';
import type { Analysis } from '../../src/types';

export type StoredAnalysis = {
  id: string;
  createdAt: string;
  paid: boolean;
  analysis: Analysis;
  resumePreview: string;
  jobTitleGuess: string;
};

export function analysisStore() {
  return getStore({ name: 'resume-ai-analyses', consistency: 'strong' });
}

export async function saveAnalysis(record: StoredAnalysis): Promise<void> {
  const store = analysisStore();
  await store.setJSON(record.id, record);
}

export async function getAnalysis(id: string): Promise<StoredAnalysis | null> {
  const store = analysisStore();
  return (await store.get(id, { type: 'json' })) as StoredAnalysis | null;
}

export async function markPaid(id: string): Promise<void> {
  const store = analysisStore();
  const existing = (await store.get(id, { type: 'json' })) as StoredAnalysis | null;
  if (!existing) return;
  existing.paid = true;
  await store.setJSON(id, existing);
}

export function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export function errorResponse(status: number, error: string): Response {
  return jsonResponse(status, { error });
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}
