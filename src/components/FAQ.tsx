const faqs = [
  {
    q: 'How is this different from rewriting my resume in ChatGPT?',
    a: 'ChatGPT will rewrite. Resume-AI scores. The number forces the model to take a position — it can\'t hide behind generic feedback. You also get only the bullets that actually need rewriting, not a fresh CV from scratch.',
  },
  {
    q: 'Do you store my resume?',
    a: 'The analysis JSON lives in Netlify Blobs for up to 24h so we can serve the PDF after payment. The raw resume text is not stored after the analysis finishes. We don\'t collect emails for the free score.',
  },
  {
    q: 'What if the score is wrong?',
    a: 'It\'s a model output, not a verdict. Read the gaps and bullet rewrites — those are the actionable parts. The number is a wedge to force prioritisation.',
  },
  {
    q: 'Why $5? Why not free?',
    a: 'The free score answers "is it worth applying". The $5 buys the writing work — the rewrites and the cover-letter hook. That\'s the part that takes you from "applied" to "interview".',
  },
  {
    q: 'Does this beat real ATS systems like Workday or Greenhouse?',
    a: 'No tool guarantees an ATS pass. What it does: surfaces the exact JD keywords missing from your resume, which is the #1 reason ATS systems filter candidates out.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="container-narrow py-20 md:py-28">
      <div className="mb-12 max-w-2xl">
        <span className="pill">FAQ</span>
        <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-ink-900 md:text-5xl">
          The honest answers.
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {faqs.map((f) => (
          <details key={f.q} className="group card p-6 transition hover:shadow-lift">
            <summary className="flex cursor-pointer items-center justify-between gap-4">
              <h3 className="font-serif text-xl text-ink-900">{f.q}</h3>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-500 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-ink-500">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
