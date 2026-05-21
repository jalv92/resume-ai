import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="container-narrow flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <Logo />
        <p className="text-xs text-ink-400">
          © {new Date().getFullYear()} Resume-AI · Built with care.
          <span className="mx-2 text-ink-200">·</span>
          <a href="#faq" className="hover:text-ink-700">FAQ</a>
          <span className="mx-2 text-ink-200">·</span>
          <a href="https://stripe.com/" target="_blank" rel="noreferrer" className="hover:text-ink-700">Payments by Stripe</a>
        </p>
      </div>
    </footer>
  );
}
