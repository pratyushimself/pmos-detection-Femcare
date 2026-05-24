import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.985, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.99, y: -6 }}
    transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.9 }}
    style={{ willChange: "transform, opacity" }}
  >
    {children}
  </motion.div>
);
