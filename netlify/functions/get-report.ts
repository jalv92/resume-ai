import Stripe from 'stripe';
import { getAnalysis, markPaid, jsonResponse, errorResponse, requireEnv } from './_shared';

export default async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) return errorResponse(400, 'Missing session_id');

  const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), { apiVersion: '2024-11-20.acacia' as any });

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (e: any) {
    return errorResponse(404, `Checkout session not found: ${e?.message ?? ''}`);
  }

  const analysisId =
    (session.metadata?.analysisId as string | undefined) ??
    (session.client_reference_id as string | undefined);

  if (!analysisId) return errorResponse(400, 'Session has no analysisId metadata.');

  const stored = await getAnalysis(analysisId);
  if (!stored) return errorResponse(404, 'Analysis expired or missing.');

  // Mark paid based on Stripe truth (webhook may not have fired yet)
  if (session.payment_status === 'paid' && !stored.paid) {
    await markPaid(analysisId);
    stored.paid = true;
  }

  if (!stored.paid) {
    return jsonResponse(200, { paid: false, reason: 'Payment not confirmed yet.' });
  }

  return jsonResponse(200, { paid: true, analysis: stored.analysis });
};
