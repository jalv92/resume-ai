export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 font-serif text-lg font-bold text-indigo-400">
        R
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight text-ink-900">Resume-AI</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-ink-400">ATS analyzer</span>
      </div>
    </div>
  );
}
