import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
    <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow-soft transition-transform duration-500 group-hover:scale-110">
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10" />
        <circle cx="12" cy="11" r="1.5" fill="currentColor" />
      </svg>
      <span className="absolute inset-0 rounded-xl bg-primary/50 blur-xl opacity-70 animate-breathe -z-10" />
    </span>
    <span className="font-display text-xl tracking-tight">
      Fem<span className="text-gradient font-medium">Care</span>
      <span className="ml-1 text-xs font-sans font-semibold tracking-[0.18em] text-muted-foreground align-middle">AI</span>
    </span>
  </Link>
);
