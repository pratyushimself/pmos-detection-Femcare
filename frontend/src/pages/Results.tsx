import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, Activity, HeartPulse,
  Sparkles, Leaf, ShieldAlert, Compass, Apple, Dumbbell, Moon,
} from "lucide-react";
import { AmbientBackground } from "@/components/AmbientBackground";
import { RiskMeter } from "@/components/RiskMeter";
import { DonutChart } from "@/components/DonutChart";
import { tierMeta, type AssessmentInput, type Recommendation, type RiskResult } from "@/lib/scoring";

interface State { input: AssessmentInput; result: RiskResult; }

const Bar = ({ label, value, color, hint }: { label: string; value: number; color: string; hint?: string }) => {
  const pct = Math.round(Math.max(0, Math.min(100, value)));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">{pct}/100</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/60">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2 }}
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 14px ${color}66`,
          }}
        />
      </div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
};

const InsightCard = ({ icon: Icon, title, children, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ duration: 0.6, delay, ease: [0.22,1,0.36,1] }}
    className="glass hover-lift rounded-3xl p-6"
  >
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-soft">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-xl">{title}</h3>
    </div>
    <div className="mt-4 text-sm leading-relaxed text-foreground/80">{children}</div>
  </motion.div>
);

const categoryMeta: Record<Recommendation["category"], { icon: any; accent: string; label: string }> = {
  do: { icon: Sparkles, accent: "hsl(var(--primary))", label: "Recommended" },
  avoid: { icon: ShieldAlert, accent: "hsl(var(--crimson))", label: "Avoid" },
  lifestyle: { icon: Leaf, accent: "hsl(var(--magenta))", label: "Lifestyle" },
  preventive: { icon: Compass, accent: "hsl(var(--accent))", label: "Preventive" },
};

const RecommendationCard = ({ rec, index }: { rec: Recommendation; index: number }) => {
  const meta = categoryMeta[rec.category];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group glass hover-lift rounded-2xl p-6 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg text-primary-foreground shadow-glow-soft"
            style={{ background: meta.accent }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium leading-snug text-sm text-foreground">{rec.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{rec.body}</p>
          </div>
        </div>
        {rec.priority === "high" && (
          <div className="mt-0.5 flex-none">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-1 rounded-lg bg-white/20" style={{ color: meta.accent }}>
              Priority
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Results = () => {
  const loc = useLocation();
  const state = loc.state as State | null;
  if (!state?.result) return <Navigate to="/assessment" replace />;
  const { input, result } = state;
  const meta = tierMeta[result.tier];
  const TierIcon = result.tier === "high" ? AlertCircle : result.tier === "moderate" ? Activity : CheckCircle2;

  const palette = ["hsl(var(--primary))", "hsl(var(--magenta))", "hsl(var(--accent))", "hsl(var(--risk-mod))"];
  const donutData = result.drivers.map((d, i) => ({
    label: d.label, value: d.weight, color: palette[i % palette.length], explain: d.detail,
  }));

  return (
    <div className="relative min-h-screen pb-24">
      <AmbientBackground variant={meta.bg} />
      <div className="fixed left-4 top-5 z-[9999] rounded-3xl border border-white/20 bg-white/10 px-3 py-2 shadow-glow-soft backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/15 sm:left-6 sm:top-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow-soft">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10" />
              <circle cx="12" cy="11" r="1.5" fill="currentColor" />
            </svg>
            <span className="absolute inset-0 rounded-2xl bg-primary/50 blur-xl opacity-70 animate-breathe -z-10" />
          </span>
          <span className="text-sm font-medium tracking-tight text-foreground">FemCare AI</span>
        </Link>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-28 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 chip" style={{ color: meta.color }}>
              <TierIcon className="h-3.5 w-3.5" /> {meta.label}
              <span className="ml-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                · {result.modelVersion}
              </span>
            </div>
            <h1 className="mt-3 h-refined text-4xl sm:text-5xl">Your hormonal snapshot</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">{meta.blurb}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="ghost-button"><ArrowLeft className="h-4 w-4" /> Home</Link>
            <Link to="/assessment" className="ghost-button"><RefreshCw className="h-4 w-4" /> Re-take</Link>
          </div>
        </motion.div>

        {/* Top row */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
            className="glass-strong rounded-3xl p-8 lg:col-span-5 grid place-items-center"
          >
            <RiskMeter value={result.total} color={meta.color} label={meta.label} subLabel={`Tier · ${result.tier.toUpperCase()} · confidence ${(result.confidence*100).toFixed(0)}%`} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass-strong rounded-3xl p-8 lg:col-span-7"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: meta.color }}>
              <Sparkles className="h-3.5 w-3.5" /> AI interpretation
            </div>
            <h2 className="mt-3 font-display text-3xl leading-snug">{result.narrative}</h2>
            <ul className="mt-5 space-y-2.5">
              {result.drivers.slice(0, 3).map((d) => (
                <li key={d.key} className="flex gap-2.5 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
                  <span><strong>{d.label} · {d.weight}%</strong> — {d.detail}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/60 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">BMI</div>
                <div className="mt-1 font-display text-3xl">{result.bmi}</div>
                <div className="text-[11px] capitalize text-muted-foreground">{result.bmiBand}</div>
              </div>
              <div className="rounded-2xl bg-white/60 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">WHR</div>
                <div className="mt-1 font-display text-3xl">{(input.whr).toFixed(2)}</div>
                <div className="text-[11px] capitalize text-muted-foreground">{result.whrBand}</div>
              </div>
              <div className="rounded-2xl bg-white/60 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Cycle</div>
                <div className="mt-1 font-display text-3xl">{input.cycleLength}d</div>
                <div className="text-[11px] capitalize text-muted-foreground">{input.irregularCycle === "yes" ? "irregular" : "regular"}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mid row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-3xl p-8 lg:col-span-7"
          >
            <h3 className="font-display text-2xl">Contribution breakdown</h3>
            <p className="mt-1 text-sm text-muted-foreground">Hover any segment to see what drove it.</p>
            <div className="mt-6"><DonutChart data={donutData} /></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glass-strong rounded-3xl p-8 lg:col-span-5"
          >
            <h3 className="font-display text-2xl">Hormonal balance</h3>
            <p className="mt-1 text-sm text-muted-foreground">Per-axis signal strength.</p>
            <div className="mt-6 space-y-5">
              <Bar label="Hormonal signals" value={result.categories.hormonal} color="hsl(var(--primary))" hint="Acne, hair growth, hair loss, skin darkening." />
              <Bar label="Cycle pattern" value={result.categories.cycle} color="hsl(var(--magenta))" hint="Regularity and length." />
              <Bar label="Metabolic" value={result.categories.metabolic} color="hsl(var(--risk-mod))" hint="BMI, waist-to-hip ratio, weight gain." />
              <Bar label="Lifestyle" value={result.categories.lifestyle} color="hsl(var(--accent))" hint="Diet and movement." />
            </div>
          </motion.div>
        </div>

        {/* Insight cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InsightCard icon={Activity} title="Cycle pattern" delay={0}>
            Your cycle is <strong>{input.irregularCycle === "yes" ? "irregular" : "regular"}</strong>, averaging <strong>{input.cycleLength} days</strong>.
            {input.cycleLength < 21 || input.cycleLength > 35
              ? " That sits outside the typical 21–35 day window, which is one of the strongest single signals the model considers."
              : " That sits within the typical 21–35 day window — a reassuring baseline."}
          </InsightCard>
          <InsightCard icon={HeartPulse} title="Hormonal signals" delay={0.05}>
            {[
              input.acne === "yes" && "persistent acne",
              input.hairGrowth === "yes" && "excess hair growth",
              input.hairLoss === "yes" && "scalp thinning",
              input.skinDarkening === "yes" && "skin darkening",
            ].filter(Boolean).join(", ") || "no androgen-related signs reported"}.
            {" "}Together they shape the <strong>hormonal axis</strong> at <strong>{Math.round(result.categories.hormonal)}/100</strong>.
          </InsightCard>
          <InsightCard icon={Compass} title="Metabolic profile" delay={0.1}>
            BMI <strong>{result.bmi}</strong> ({result.bmiBand}), WHR <strong>{input.whr.toFixed(2)}</strong> ({result.whrBand}).
            {input.weightGain === "yes" && " Recent weight gain is amplifying the metabolic signal."}
          </InsightCard>
          <InsightCard icon={Apple} title="Nutrition" delay={0.15}>
            Fast food: <strong className="capitalize">{input.fastFood}</strong>.
            {(input.fastFood === "often" || input.fastFood === "daily") && " Frequent ultra-processed intake elevates insulin and inflammation — both upstream of androgen excess."}
          </InsightCard>
          <InsightCard icon={Dumbbell} title="Movement" delay={0.2}>
            Workout cadence: <strong className="capitalize">{input.exercise}</strong>.
            {(input.exercise === "never" || input.exercise === "rare") && " Adding 2 strength sessions weekly is one of the highest-leverage changes for insulin sensitivity."}
          </InsightCard>
          <InsightCard icon={Moon} title="Wellness summary" delay={0.25}>
            {result.tier === "low" && "Your indicators are encouraging. Keep a quarterly check-in cadence and stay attentive to subtle shifts."}
            {result.tier === "moderate" && "Several signals deserve gentle, proactive support. Lifestyle changes meaningfully shift cycle and metabolic axes within 90 days."}
            {result.tier === "high" && "Your pattern strongly suggests a clinical conversation. Bring this report — it accelerates labs and personalized planning."}
          </InsightCard>
        </div>

        {/* Personalized Next Steps */}
        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-baseline justify-between gap-4 mb-8"
          >
            <div>
              <h2 className="h-refined text-2xl sm:text-3xl">Personalized guidance</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.recommendations.length} adaptive recommendations based on your unique profile
              </p>
            </div>
          </motion.div>

          {result.recommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.recommendations.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 text-center"
            >
              <p className="text-sm text-muted-foreground">Recommendations will appear here based on your assessment.</p>
            </motion.div>
          )}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          FemCare AI is an educational tool and does not provide a medical diagnosis. Please consult a qualified healthcare provider for clinical evaluation.
        </p>
      </div>
    </div>
  );
};

export default Results;
