import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
  steps: string[];
  current: number;
}

export const Stepper = ({ steps, current }: Props) => {
  const pct = (current / Math.max(1, steps.length - 1)) * 100;
  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute left-0 right-0 top-5 mx-6 h-[3px] rounded-full bg-border/60" />
        <motion.div
          className="absolute left-0 top-5 mx-6 h-[3px] rounded-full bg-gradient-primary"
          style={{ boxShadow: "0 0 18px hsl(var(--primary) / 0.6)" }}
          initial={false}
          animate={{ width: `calc(${pct}% - 3rem * ${pct / 100})` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <ol className="relative flex items-start justify-between gap-1">
          {steps.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={label} className="flex flex-1 flex-col items-center gap-2 text-center">
                <motion.div
                  initial={false}
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className={[
                    "relative grid h-10 w-10 place-items-center rounded-full text-sm font-medium transition-all duration-500",
                    done
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : active
                      ? "bg-white text-primary ring-2 ring-primary shadow-glow"
                      : "bg-white/70 text-muted-foreground border border-border",
                  ].join(" ")}
                >
                  {done ? <Check className="h-5 w-5" /> : i + 1}
                  {active && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-primary/30 blur-md -z-10 animate-breathe" />
                      <span
                        className="absolute inset-0 rounded-full border border-primary/50 -z-10"
                        style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
                      />
                    </>
                  )}
                </motion.div>
                <span className={`hidden text-xs font-medium sm:block ${active || done ? "text-foreground" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
