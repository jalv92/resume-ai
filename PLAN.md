# Resume-AI — Plan Completo

> Generado 2026-05-21. Producto: SaaS de bolsillo que analiza CV vs vacante, da un score gratuito y vende el informe detallado en PDF por $5 USD.

## 1. Producto

**Promesa:** "Sabe en 20 segundos si tu CV pasa el ATS de esa vacante."

**Flujo end-to-end:**

```
Landing → pegar CV + JD → POST /api/analyze (Gemini) → ver score + bullets bloqueados
   └─ click "Unlock full report $5" → POST /api/create-checkout (Stripe Checkout hosted)
        └─ pago en Stripe → webhook /api/stripe-webhook marca analysis como paid=true
              └─ redirect a /?session_id=cs_test_... → cliente hace GET /api/get-report
                   └─ render del informe completo + botón "Descargar PDF" (jsPDF cliente)
```

## 2. Stack

| Capa | Decisión | Por qué |
|------|----------|---------|
| Frontend | Vite 6 + React 19 + TypeScript 5 + Tailwind 3 | Stack del workspace, SPA pura sin SSR |
| Routing | URL `?session_id=` — sin React Router | 1 sola página, query param tras pago |
| UI | Tailwind + componentes propios minimal | Diseño tipográfico premium, sin shadcn dependency hell |
| Backend | Netlify Functions (Node 22) | Mismo deploy, sin servidor aparte |
| IA | Google Gemini 1.5 Flash | Barato, rápido, soporta JSON mode |
| Pagos | Stripe Checkout hosted (test mode) | Para un único $5 one-time, Checkout > Elements |
| Storage | Netlify Blobs | KV nativo en Functions, sin DB |
| PDF | jsPDF + jsPDF-AutoTable (cliente) | Genera PDF en navegador, sin server-side rendering |
| Hosting | Netlify (cuenta `netlify-nuevo`) | GitHub continuous deploy |
| Repo | GitHub público: `resume-ai` | Para CD desde Netlify |

## 3. Endpoints serverless

| Endpoint | Método | Función |
|----------|--------|---------|
| `/api/analyze` | POST | Recibe `{resume, jobDescription}`. Llama Gemini con JSON mode. Guarda análisis en Blob con UUID. Devuelve `{id, score, teaser}` (NO el contenido bloqueado). |
| `/api/create-checkout` | POST | Recibe `{analysisId}`. Crea Stripe Checkout Session con `metadata.analysisId`. Devuelve `{url}`. |
| `/api/stripe-webhook` | POST | Valida firma Stripe. En `checkout.session.completed`, marca el blob como `paid=true` y guarda `customer_email`. |
| `/api/get-report` | GET | Recibe `?session_id=cs_test_...`. Recupera Checkout Session de Stripe → analysisId. Si `paid=true`, devuelve análisis completo. |

## 4. Esquema del análisis (JSON que devuelve Gemini)

```ts
type Analysis = {
  score: number;            // 0-100 compatibility
  oneLineVerdict: string;   // teaser visible gratis, e.g. "Buen fit técnico, débil en métricas"
  strengths: string[];      // 3-5 puntos donde encaja
  gaps: string[];           // 3-5 skills/experiencia que faltan
  atsKeywords: string[];    // keywords del JD que el ATS busca y NO están en el CV
  bulletRewrites: { original: string; improved: string; reason: string }[]; // 3-5 bullets reescritos
  coverLetterHook: string;  // primer párrafo personalizado de cover letter
  nextSteps: string[];      // 3 acciones concretas para mejorar el match
}
```

**Gratis (gancho):** `score`, `oneLineVerdict`, conteo `strengths.length` y `gaps.length`.
**De pago:** todo el JSON completo + PDF.

## 5. Variables de entorno

| Variable | Dónde | Valor |
|----------|-------|-------|
| `GEMINI_API_KEY` | Netlify | AIzaSy… |
| `STRIPE_SECRET_KEY` | Netlify | sk_test_… |
| `STRIPE_WEBHOOK_SECRET` | Netlify | whsec_… (del endpoint configurado) |
| `STRIPE_PRICE_ID` | Netlify | price_… ($5 USD one-time) |
| `URL` | Netlify (auto) | https://*.netlify.app |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Netlify build | pk_test_… (no se usa en cliente pero queda listo) |

## 6. Diseño visual

- Paleta: indigo profundo + crema fría. Sensación editorial, no SaaS genérico.
- Tipografía: Inter para UI, serif (Source Serif) para hero. Contraste fuerte.
- Hero: titular grande + 2 textareas grandes lado a lado en desktop, apiladas en mobile.
- Resultado: dial circular con score en SVG + bullets borrosos detrás del paywall.
- Paywall: tarjeta con $5, lista de qué se desbloquea, botón Stripe verde-indigo.

## 7. Pasos de entrega

1. ✅ Scaffold + PLAN
2. Frontend completo (Vite + React + Tailwind + análisis UI)
3. Netlify Functions (4 endpoints + storage helper)
4. Generador PDF cliente
5. `npm install` + `npm run build` local OK
6. `git init` + commit + repo GitHub + push
7. Stripe MCP: crear producto + price $5 + apuntar webhook
8. Netlify MCP: crear sitio + linkear repo + env vars
9. Esperar primer deploy → smoke test URL pública

## 8. Riesgos / decisiones registradas

- **Gemini API key expuesta en este chat:** quedará SOLO en Netlify env vars, nunca en el repo. El `.env.example` lleva placeholders.
- **Test mode:** tarjetas de prueba (`4242 4242 4242 4242`), sin cobros reales.
- **Netlify Blobs:** persistencia simple, perfecto para análisis efímeros (TTL implícito por uso). Para producción seria habría que migrar a Supabase.
- **PDF en cliente:** evita coste serverless de PDF, pero el contenido viaja al navegador tras desbloqueo. Aceptable porque el usuario ya pagó.
