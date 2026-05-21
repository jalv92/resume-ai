import Stripe from 'stripe';
import { getAnalysis, jsonResponse, errorResponse, requireEnv } from './_shared';

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return errorResponse(405, 'Method not allowed');

  let payload: { analysisId?: string };
  try {
    payload = (await req.json()) as any;
  } catch {
    return errorResponse(400, 'Invalid JSON body');
  }
  const analysisId = (payload.analysisId ?? '').trim();
  if (!analysisId) return errorResponse(400, 'Missing analysisId');

  const stored = await getAnalysis(analysisId);
  if (!stored) return errorResponse(404, 'Analysis not found or expired.');
  if (stored.paid) return errorResponse(409, 'Already paid.');

  const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), { apiVersion: '2024-11-20.acacia' as any });
  const priceId = requireEnv('STRIPE_PRICE_ID');
  const origin = new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?cancelled=1`,
        client_reference_id: analysisId,
        metadata: {
          analysisId,
          score: String(stored.analysis.score),
          jobTitleGuess: stored.jobTitleGuess,
        },
        payment_intent_data: {
          metadata: { analysisId },
        },
        automatic_tax: { enabled: false },
      },
      { idempotencyKey: `checkout-${analysisId}` }
    );

    if (!session.url) return errorResponse(500, 'Stripe did not return a checkout URL.');
    return jsonResponse(200, { url: session.url });
  } catch (e: any) {
    console.error('Stripe checkout failure:', e?.message);
    return errorResponse(502, `Stripe error: ${e?.message ?? 'unknown'}`);
  }
};
