export function Pricing() {
  return (
    <section id="pricing" className="container-narrow py-20 md:py-28">
      <div className="mb-12 max-w-2xl text-center mx-auto">
        <span className="pill">Pricing</span>
        <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-ink-900 md:text-5xl">
          One price. One report. No subscription.
        </h2>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        <div className="card p-8">
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-ink-400">Free</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-5xl text-ink-900">$0</span>
          </div>
          <p className="mt-2 text-sm text-ink-500">Get a real signal before you commit.</p>
          <ul className="mt-6 space-y-3 text-sm text-ink-700">
            <Check>Compatibility score 0–100</Check>
            <Check>One-line expert verdict</Check>
            <Check>Stat-line of what's hidden</Check>
            <Check className="text-ink-300 line-through" muted>Bullet rewrites</Check>
            <Check className="text-ink-300 line-through" muted>ATS keyword extraction</Check>
            <Check className="text-ink-300 line-through" muted>Downloadable PDF</Check>
          </ul>
        </div>

        <div className="card relative overflow-hidden border-2 border-ink-900 p-8">
          <div className="absolute right-0 top-0 rounded-bl-2xl bg-ink-900 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-400">
            Full report
          </div>
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-ink-400">Per analysis</h3>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-5xl text-ink-900">$5</span>
            <span className="text-sm text-ink-400">one-time</span>
          </div>
          <p className="mt-2 text-sm text-ink-500">Everything below + PDF download.</p>
          <ul className="mt-6 space-y-3 text-sm text-ink-700">
            <Check>Strengths · ranked</Check>
            <Check>Gaps blocking the offer</Check>
            <Check>ATS keywords you're missing</Check>
            <Check>3–5 bullet rewrites with reasoning</Check>
            <Check>Cover-letter opening hook</Check>
            <Check>3-step action plan</Check>
            <Check>Printable, shareable PDF</Check>
          </ul>
          <a href="#analyze" className="btn-primary mt-8 w-full">Start analysis</a>
        </div>
      </div>
    </section>
  );
}

function Check({ children, className = '', muted = false }: { children: React.ReactNode; className?: string; muted?: boolean }) {
  return (
    <li className={`flex items-start gap-3 ${className}`}>
      <svg className={`mt-0.5 h-4 w-4 shrink-0 ${muted ? 'text-ink-200' : 'text-indigo-500'}`} fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </li>
  );
}
