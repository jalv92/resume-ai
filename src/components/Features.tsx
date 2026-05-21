const items = [
  {
    n: '01',
    title: 'Paste, don\'t upload',
    body: 'No file parsers, no formatting noise. The model reads exactly what you give it — same as a recruiter would.',
  },
  {
    n: '02',
    title: 'Free score, real signal',
    body: 'The compatibility score uses the same prompt as the full report. If it says 47, the gap is real.',
  },
  {
    n: '03',
    title: 'ATS-grade keywords',
    body: 'We surface the exact terms the JD repeats that your resume is missing. Drop them into your bullets verbatim.',
  },
  {
    n: '04',
    title: 'Bullet rewrites, not platitudes',
    body: 'Each rewrite replaces one of your bullets with a sharper version + the reason it lands harder.',
  },
];

export function Features() {
  return (
    <section id="how" className="container-narrow py-20 md:py-28">
      <div className="mb-12 max-w-2xl">
        <span className="pill">How it works</span>
        <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-ink-900 md:text-5xl">
          One prompt does the work of a $400 resume consultant.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.n} className="card group p-8 transition hover:-translate-y-1 hover:shadow-lift">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-indigo-500">{it.n}</span>
              <h3 className="font-serif text-2xl text-ink-900">{it.title}</h3>
            </div>
            <p className="mt-3 leading-relaxed text-ink-500">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
