import { useState } from 'react';

type Props = {
  loading: boolean;
  onSubmit: (input: { resume: string; jobDescription: string }) => void;
};

export function AnalyzerForm({ loading, onSubmit }: Props) {
  const [resume, setResume] = useState('');
  const [jd, setJd] = useState('');

  const resumeChars = resume.length;
  const jdChars = jd.length;
  const canSubmit = resumeChars >= 200 && jdChars >= 80 && !loading;

  return (
    <section id="analyze" className="container-narrow pb-16">
      <div className="card overflow-hidden">
        <div className="grid grid-cols-1 gap-px bg-ink-100 md:grid-cols-2">
          <FieldBlock
            label="Your resume"
            hint="Paste plain text from your CV or LinkedIn 'About + Experience' sections."
            count={resumeChars}
            min={200}
          >
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Senior Product Designer with 6 years building tools for fintech…&#10;&#10;Experience&#10;• Led the redesign of …&#10;• Shipped …&#10;• Owned …"
              rows={14}
              className="input-area h-full min-h-[280px] border-0 bg-white"
            />
          </FieldBlock>
          <FieldBlock
            label="Job description"
            hint="Paste the full posting — requirements, responsibilities, nice-to-haves."
            count={jdChars}
            min={80}
          >
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="We're looking for a Senior Product Designer to lead our payments surface…&#10;&#10;Requirements&#10;• 5+ years …&#10;• Strong systems thinking …"
              rows={14}
              className="input-area h-full min-h-[280px] border-0 bg-white"
            />
          </FieldBlock>
        </div>
        <div className="flex flex-col items-stretch gap-4 border-t border-ink-100 bg-ink-50/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            We run a single AI pass and never store your text past 24h.
          </p>
          <button
            onClick={() => canSubmit && onSubmit({ resume, jobDescription: jd })}
            disabled={!canSubmit}
            className="btn-primary"
          >
            {loading ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                Analyzing…
              </>
            ) : (
              <>
                Analyze compatibility
                <span aria-hidden>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

function FieldBlock({
  label,
  hint,
  count,
  min,
  children,
}: {
  label: string;
  hint: string;
  count: number;
  min: number;
  children: React.ReactNode;
}) {
  const ok = count >= min;
  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-baseline justify-between px-6 pt-5">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-ink-900">{label}</h3>
          <p className="mt-0.5 text-xs text-ink-400">{hint}</p>
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-wider ${ok ? 'text-indigo-600' : 'text-ink-300'}`}>
          {count} chars
        </span>
      </div>
      <div className="flex-1 px-3 pb-3 pt-3">{children}</div>
    </div>
  );
}
