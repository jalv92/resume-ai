# Resume-AI

Instant compatibility score between a resume and a job description. Free score, $5 PDF report.

**Live:** _deployed to Netlify after first push — URL added below._

## Stack

- Vite + React 19 + TypeScript + Tailwind
- Netlify Functions (Node 22)
- Gemini 1.5 Flash for analysis
- Stripe Checkout (test mode) for one-time $5 payment
- Netlify Blobs for short-lived analysis storage
- jsPDF + AutoTable for client-side PDF download

## Architecture

```
┌──────────────────┐  POST /api/analyze   ┌──────────────────────┐
│  React frontend  ├─────────────────────▶│  netlify/analyze     │
│                  │                      │  → Gemini 1.5 Flash   │
│                  │◀─────────────────────┤  → save Blob {id}     │
│                  │  {id, score, teaser} └──────────────────────┘
│                  │
│                  │  POST /api/create-checkout
│                  ├─────────────────────▶ Stripe Checkout (hosted)
│                  │                       success_url=/?session_id={CHECKOUT_SESSION_ID}
│                  │
│                  │                       Stripe → POST /api/stripe-webhook
│                  │                       (verifies signature, markPaid)
│                  │
│                  │  GET /api/get-report?session_id=…
│                  ├─────────────────────▶ retrieves Stripe session
│                  │                       returns full analysis JSON if paid
│                  │  client renders → jsPDF download
└──────────────────┘
```

## Local dev

```bash
npm install
cp .env.example .env       # fill in real keys for full local test
npm run dev                # frontend at http://localhost:5173

# For functions + frontend together, install Netlify CLI globally and run:
npx netlify dev
```

## Environment variables (set in Netlify dashboard)

| Key | Where |
|-----|-------|
| `GEMINI_API_KEY` | Build + Functions |
| `STRIPE_SECRET_KEY` | Functions |
| `STRIPE_WEBHOOK_SECRET` | Functions |
| `STRIPE_PRICE_ID` | Functions |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Build (optional, reserved for future Elements) |

## Stripe setup

1. Stripe Dashboard → **Test mode** → Products → create "Resume-AI Full Report" / $5 USD / one-time.
2. Copy the `price_…` ID into `STRIPE_PRICE_ID`.
3. Dashboard → Developers → Webhooks → add endpoint:
   - URL: `https://<your-netlify-domain>/api/stripe-webhook`
   - Event: `checkout.session.completed`
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

## Testing the paid flow

Test card: `4242 4242 4242 4242` · any future expiry · any CVC · any ZIP.

## License

Private project. © 2026.
