import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

export const Nav = () => (
  <motion.header
    initial={{ y: -30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="fixed inset-x-0 top-5 z-[9999] mx-auto w-full max-w-6xl px-6"
  >
    <nav className="glass flex items-center justify-between rounded-full px-6 py-3">
      {/* LEFT */}
<div className="flex items-center gap-2">
  <Logo />
</div>

{/* CENTER */}
<div className="hidden md:flex items-center gap-10 text-sm text-muted-foreground">
  <a href="/#features" className="transition-colors hover:text-foreground">
    Intelligence
  </a>

  <a href="/#how" className="transition-colors hover:text-foreground">
    How it works
  </a>

  <a href="/#science" className="transition-colors hover:text-foreground">
    Science
  </a>
</div>

{/* RIGHT */}
<Link
  to="/assessment"
  className="glow-button whitespace-nowrap !px-5 !py-2 text-sm"
>
  Begin assessment
</Link>
    </nav>
  </motion.header>
);
