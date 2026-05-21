export function Hero() {
  return (
    <section className="container-narrow pt-12 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-3xl">
        <span className="pill bg-indigo-50 text-indigo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse-soft" />
          Live · Gemini-powered analysis
        </span>
        <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-ink-900 text-balance md:text-7xl">
          Beat the <em className="italic text-indigo-600">ATS</em> in 20 seconds.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500 md:text-xl">
          Paste your resume and the job description. Get an instant compatibility score, the keywords the ATS is hunting for, and the exact bullets to rewrite.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-ink-400">
          <Badge>Free score, instantly</Badge>
          <Badge>$5 for the full report</Badge>
          <Badge>No account · No email</Badge>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/70 px-4 py-1.5 backdrop-blur">
      <span className="h-1 w-1 rounded-full bg-ink-400" />
      {children}
    </span>
  );
}
