import { useEffect, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { AnalyzerForm } from './components/AnalyzerForm';
import { ResultCard } from './components/ResultCard';
import { UnlockedReport } from './components/UnlockedReport';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { analyze, getReport } from './lib/api';
import type { Analysis, AnalyzeResponse } from './types';

type Phase =
  | { kind: 'idle' }
  | { kind: 'analyzing' }
  | { kind: 'teaser'; result: AnalyzeResponse }
  | { kind: 'unlocking' }
  | { kind: 'unlocked'; analysis: Analysis }
  | { kind: 'error'; message: string };

export function App() {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });

  // If returning from Stripe success: ?session_id=cs_test_...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const cancelled = params.get('cancelled');

    if (cancelled) {
      setPhase({ kind: 'error', message: 'Payment was cancelled. Run the analysis again to try.' });
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    if (!sessionId) return;

    setPhase({ kind: 'unlocking' });
    let cancel = false;
    const attempt = async (tries = 0) => {
      try {
        const r = await getReport(sessionId);
        if (cancel) return;
        if (r.paid) {
          setPhase({ kind: 'unlocked', analysis: r.analysis });
          // Clean URL but keep state
          window.history.replaceState({}, '', window.location.pathname);
        } else if (tries < 8) {
          setTimeout(() => attempt(tries + 1), 1500);
        } else {
          setPhase({ kind: 'error', message: r.reason || 'Could not verify payment yet. Refresh in a few seconds.' });
        }
      } catch (e: any) {
        if (cancel) return;
        if (tries < 5) {
          setTimeout(() => attempt(tries + 1), 1500);
        } else {
          setPhase({ kind: 'error', message: e.message ?? 'Could not load your report.' });
        }
      }
    };
    attempt();
    return () => {
      cancel = true;
    };
  }, []);

  const handleAnalyze = async (input: { resume: string; jobDescription: string }) => {
    setPhase({ kind: 'analyzing' });
    try {
      const result = await analyze(input);
      setPhase({ kind: 'teaser', result });
      requestAnimationFrame(() => {
        document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (e: any) {
      setPhase({ kind: 'error', message: e.message ?? 'Something went wrong analyzing your inputs.' });
    }
  };

  return (
    <div className="min-h-screen">
      <Nav />
      {phase.kind === 'unlocking' && <UnlockingBanner />}
      {phase.kind === 'unlocked' ? (
        <>
          <UnlockedReport analysis={phase.analysis} />
          <div className="container-narrow pb-16">
            <a href={window.location.pathname} className="btn-ghost">Run another analysis →</a>
          </div>
        </>
      ) : (
        <>
          <Hero />
          <AnalyzerForm loading={phase.kind === 'analyzing'} onSubmit={handleAnalyze} />
          {phase.kind === 'error' && <ErrorBanner message={phase.message} />}
          {phase.kind === 'teaser' && <ResultCard result={phase.result} />}
          <Features />
          <Pricing />
          <FAQ />
        </>
      )}
      <Footer />
    </div>
  );
}

function UnlockingBanner() {
  return (
    <section className="container-narrow py-20 text-center animate-fade-in">
      <span className="pill">Verifying payment</span>
      <h2 className="mt-4 font-serif text-3xl text-ink-900">Unlocking your full report…</h2>
      <p className="mt-2 text-ink-500">This usually takes 2–5 seconds.</p>
      <div className="mx-auto mt-8 h-1 w-40 overflow-hidden rounded-full bg-ink-100">
        <div className="h-full w-1/3 animate-pulse-soft rounded-full bg-indigo-500" />
      </div>
    </section>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="container-narrow pb-8">
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
        {message}
      </div>
    </div>
  );
}
