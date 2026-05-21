import { Logo } from './Logo';

export function Nav() {
  return (
    <header className="container-narrow flex items-center justify-between py-6">
      <Logo />
      <nav className="hidden items-center gap-8 text-sm text-ink-500 md:flex">
        <a href="#how" className="transition hover:text-ink-900">How it works</a>
        <a href="#pricing" className="transition hover:text-ink-900">Pricing</a>
        <a href="#faq" className="transition hover:text-ink-900">FAQ</a>
      </nav>
      <a href="#analyze" className="btn-ghost text-xs">
        Get started
        <span aria-hidden>→</span>
      </a>
    </header>
  );
}
