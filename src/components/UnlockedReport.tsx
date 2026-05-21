import type { Analysis } from '../types';
import { ScoreDial } from './ScoreDial';
import { downloadAnalysisPdf } from '../lib/pdf';

export function UnlockedReport({ analysis }: { analysis: Analysis }) {
  return (
    <section className="container-narrow py-12 animate-fade-up">
      <div className="card overflow-hidden">
        <div className="border-b border-ink-100 bg-ink-900 px-8 py-10 text-ink-50 md:px-12">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="pill bg-indigo-500/20 text-indigo-100">Payment confirmed · Full report unlocked</span>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-balance md:text-5xl">
                Your detailed match against this role.
              </h2>
              <p className="mt-3 max-w-xl text-ink-300">"{analysis.oneLineVerdict}"</p>
            </div>
            <ScoreDial score={analysis.score} />
          </div>
          <button onClick={() => downloadAnalysisPdf(analysis)} className="btn-primary mt-8 bg-indigo-500 hover:bg-indigo-400">
            Download PDF
            <span aria-hidden>↓</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-px bg-ink-100 md:grid-cols-2">
          <Section title="Strengths" items={analysis.strengths} tone="positive" />
          <Section title="Gaps to close" items={analysis.gaps} tone="warning" />
        </div>

        <div className="border-t border-ink-100 p-8 md:p-12">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">ATS keywords missing in your resume</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.atsKeywords.map((k) => (
              <span key={k} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 font-mono text-xs text-indigo-700">
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-ink-100 p-8 md:p-12">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Bullet rewrites</h3>
          <div className="mt-6 space-y-6">
            {analysis.bulletRewrites.map((b, i) => (
              <div key={i} className="grid gap-3 rounded-2xl border border-ink-100 p-5 md:grid-cols-2">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400">Original</div>
                  <p className="mt-1.5 text-sm text-ink-500 line-through decoration-ink-300">{b.original}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-600">Improved</div>
                  <p className="mt-1.5 text-sm text-ink-800">{b.improved}</p>
                  <p className="mt-2 text-xs italic text-ink-400">{b.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-ink-100 bg-ink-50 p-8 md:p-12">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Cover letter hook</h3>
          <p className="mt-4 font-serif text-xl italic leading-relaxed text-ink-800">"{analysis.coverLetterHook}"</p>
        </div>

        <div className="border-t border-ink-100 p-8 md:p-12">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Do these this week</h3>
          <ol className="mt-4 space-y-3">
            {analysis.nextSteps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-900 font-mono text-xs text-indigo-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="pt-1.5 text-ink-700">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Section({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'positive' | 'warning';
}) {
  return (
    <div className="bg-white p-8 md:p-12">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${tone === 'positive' ? 'bg-emerald-500' : 'bg-amber-500'}`}
        />
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3 text-ink-700">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-300" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
