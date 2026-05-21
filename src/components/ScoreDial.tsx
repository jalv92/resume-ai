import { useEffect, useState } from 'react';

export function ScoreDial({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 900;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;
  const color = score >= 75 ? '#4348d8' : score >= 50 ? '#5b62f4' : score >= 30 ? '#a8a596' : '#6e6c61';
  const verdict = score >= 75 ? 'Strong fit' : score >= 50 ? 'Decent fit' : score >= 30 ? 'Weak fit' : 'Mismatch';

  return (
    <div className="relative grid h-56 w-56 place-items-center">
      <svg className="-rotate-90" width="208" height="208" viewBox="0 0 208 208">
        <circle cx="104" cy="104" r={radius} fill="none" stroke="#ecebe4" strokeWidth="12" />
        <circle
          cx="104"
          cy="104"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke 600ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-serif text-6xl font-bold leading-none tracking-tight text-ink-900 tabular-nums">
            {displayed}
            <span className="text-2xl text-ink-300">/100</span>
          </div>
          <div className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-400">{verdict}</div>
        </div>
      </div>
    </div>
  );
}
