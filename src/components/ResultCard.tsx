import { useState } from 'react';
import type { AnalyzeResponse } from '../types';
import { ScoreDial } from './ScoreDial';
import { createCheckout } from '../lib/api';

type Props = {
  result: AnalyzeResponse;
};

export function ResultCard({ result }: Props) {
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const startCheckout = async () => {
    setPaying(true);
    setErr(null);
    try {
      const { url } = await createCheckout(result.id);
      window.location.href = url;
    } catch (e: any) {
      setErr(e.message ?? 'Payment could not start. Try again.');
      setPaying(false);
    }
  };

  return (
    <section id="result" className="container-narrow pb-20 animate-fade-up">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
        <div className="card flex flex-col items-center justify-center p-8 text-center">
          <span className="pill mb-4">Compatibility</span>
          <ScoreDial score={result.score} />
          <p className="mt-6 font-serif text-lg italic leading-snug text-ink-700">"{result.oneLineVerdict}"</p>
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-ink-100 border-b border-ink-100 sm:grid-cols-4">
            <Stat label="Strengths" value={result.strengthsCount} />
            <Stat label="Gaps" value={result.gapsCount} />
            <Stat label="ATS keywords" value={result.atsKeywordsCount} />
            <Stat label="Bullet rewrites" value={result.bulletRewritesCount} />
          </div>

          <div className="relative p-8">
            <div className="locked space-y-5">
              <LockedRow title="What's working in your resume" lines={3} />
              <LockedRow title="The gaps blocking you" lines={3} />
              <LockedRow title="ATS keywords missing" lines={2} />
              <LockedRow title="Bullets rewritten for impact" lines={3} />
            </div>

            <div className="pointer-events-auto relative -mt-24 flex flex-col items-center text-center">
              <div className="rounded-full bg-ink-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-indigo-400">
                Unlock the full report
              </div>
              <h3 className="mt-4 font-serif text-3xl text-ink-900">
                $5 · one payment · keep the PDF forever
              </h3>
              <p className="mt-2 max-w-md text-sm text-ink-500">
                Strengths, gaps, ATS keywords, rewritten bullets, a cover-letter hook and a 3-step action plan — all in a downloadable PDF.
              </p>
              <button onClick={startCheckout} disabled={paying} className="btn-primary mt-6">
                {paying ? 'Opening Stripe…' : 'Unlock for $5'}
                <span aria-hidden>→</span>
              </button>
              {err && <p className="mt-3 text-xs text-red-600">{err}</p>}
              <p className="mt-3 text-xs text-ink-400">Stripe Checkout · test card 4242 4242 4242 4242</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-5 text-center">
      <div className="font-serif text-3xl font-bold text-ink-900 tabular-nums">{value}</div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">{label}</div>
    </div>
  );
}

function LockedRow({ title, lines }: { title: string; lines: number }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">{title}</h4>
      <div className="mt-2 space-y-1.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 rounded-full bg-ink-100" style={{ width: `${80 - i * 12}%` }} />
        ))}
      </div>
    </div>
  );
}
