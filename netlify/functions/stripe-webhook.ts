import Stripe from 'stripe';
import { markPaid, jsonResponse, errorResponse, requireEnv } from './_shared';

export const config = { path: '/api/stripe-webhook' };

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return errorResponse(405, 'Method not allowed');

  const signature = req.headers.get('stripe-signature');
  if (!signature) return errorResponse(400, 'Missing stripe-signature header.');

  const rawBody = await req.text();
  const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), { apiVersion: '2024-11-20.acacia' as any });
  const secret = requireEnv('STRIPE_WEBHOOK_SECRET');

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, secret);
  } catch (e: any) {
    console.error('Webhook signature verification failed:', e?.message);
    return errorResponse(400, `Invalid signature: ${e?.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const analysisId =
      (session.metadata?.analysisId as string | undefined) ??
      (session.client_reference_id as string | undefined);
    if (!analysisId) {
      console.warn('checkout.session.completed without analysisId, ignoring.');
      return jsonResponse(200, { received: true, note: 'no analysisId' });
    }
    try {
      await markPaid(analysisId);
      console.log('Marked paid:', analysisId);
    } catch (e: any) {
      console.error('markPaid failure:', e?.message);
      return errorResponse(500, 'Could not mark analysis paid.');
    }
  }

  return jsonResponse(200, { received: true });
};
