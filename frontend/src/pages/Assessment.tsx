import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Stepper } from "@/components/Stepper";
import { type AssessmentInput, type Frequency, type YesNo } from "@/lib/scoring";
import { predictionService } from "@/services";

const STEPS = ["Profile", "Body", "Cycle", "Signals", "Lifestyle", "Synthesis"];

const initial: AssessmentInput = {
  age: 25,
  weightKg: 60,
  heightCm: 165,
  irregularCycle: "no",
  cycleLength: 28,
  hipCm: 95,
  waistCm: 75,
  whr: 75 / 95,
  weightGain: "no",
  hairGrowth: "no",
  skinDarkening: "no",
  hairLoss: "no",
  acne: "no",
  fastFood: "rare",
  exercise: "sometimes",
};

type FieldErr = Partial<Record<keyof AssessmentInput, string>>;

const Field = ({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-foreground/90">{label}</span>
    {children}
    {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
  </label>
);

const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <motion.button type="button" onClick={onClick} data-active={active}
    whileTap={{ scale: 0.96 }} whileHover={{ y: -2 }}
    className="pill-toggle">
    {children}
  </motion.button>
);

const YesNoToggle = ({ value, onChange }: { value: YesNo; onChange: (v: YesNo) => void }) => (
  <div className="flex gap-2.5">
    <Pill active={value === "no"} onClick={() => onChange("no")}>No</Pill>
    <Pill active={value === "yes"} onClick={() => onChange("yes")}>Yes</Pill>
  </div>
);

const FREQS: Frequency[] = ["never", "rare", "sometimes", "often", "daily"];
const FreqToggle = ({ value, onChange }: { value: Frequency; onChange: (v: Frequency) => void }) => (
  <div className="flex flex-wrap gap-2.5">
    {FREQS.map((f) => (
      <Pill key={f} active={value === f} onClick={() => onChange(f)}>
        <span className="capitalize">{f}</span>
      </Pill>
    ))}
  </div>
);

const Assessment = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentInput>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const set = <K extends keyof AssessmentInput>(k: K, v: AssessmentInput[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  // Auto-compute WHR
  useEffect(() => {
    if (data.hipCm > 0) {
      const next = +(data.waistCm / data.hipCm).toFixed(2);
      if (next !== data.whr) setData((d) => ({ ...d, whr: next }));
    }
  }, [data.waistCm, data.hipCm]);

  const errors: FieldErr = useMemo(() => {
    const e: FieldErr = {};
    if (step === 0) {
      if (data.age < 10 || data.age > 80) e.age = "Age must be 10–80.";
    }
    if (step === 1) {
      if (data.heightCm < 120 || data.heightCm > 220) e.heightCm = "Height should be 120–220 cm.";
      if (data.weightKg < 30 || data.weightKg > 200) e.weightKg = "Weight should be 30–200 kg.";
      if (data.hipCm < 50 || data.hipCm > 180) e.hipCm = "Hip should be 50–180 cm.";
      if (data.waistCm < 40 || data.waistCm > 180) e.waistCm = "Waist should be 40–180 cm.";
    }
    if (step === 2) {
      if (data.cycleLength < 15 || data.cycleLength > 90) e.cycleLength = "Cycle length should be 15–90 days.";
    }
    return e;
  }, [step, data]);

  const stepValid = Object.keys(errors).length === 0;

  const next = async () => {
    if (!stepValid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    const result = await predictionService.predict(data);
    setTimeout(() => nav("/results", { state: { input: data, result } }), 700);
  };
  const back = () => step > 0 && setStep((s) => s - 1);

  const titles = [
    "Let's get to know you",
    "Your body composition",
    "Your cycle rhythm",
    "Hormonal signals",
    "Lifestyle context",
    "AI synthesis",
  ];
  const subtitles = [
    "Just one detail to start.",
    "Used to compute BMI and waist-to-hip ratio.",
    "Cycle patterns are the strongest single signal.",
    "Visible signs of androgen and insulin activity.",
    "Daily habits that shape hormonal balance.",
    "We're ready to synthesize your snapshot.",
  ];

  return (
    <div className="relative min-h-screen pb-24">
      <AmbientBackground />
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

      <div className="container mx-auto max-w-3xl pt-32">
        <motion.div
          key={`hd-${step}`}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="mb-8"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Step {step + 1} of {STEPS.length}
          </div>
          <h1 className="mt-1 h-refined text-3xl sm:text-4xl">{titles[step]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitles[step]}</p>
        </motion.div>

        <div className="mb-10">
          <Stepper steps={STEPS} current={step} />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}
              className="glass-strong rounded-3xl p-6 sm:p-10"
            >
              {step === 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Age" hint="Years" error={errors.age}>
                    <input type="number" min={0} max={500} className="input-glass" value={data.age}
                      onChange={(e) => set("age", Math.min(500, Math.max(0, Number(e.target.value))))} />
                  </Field>
                  <div className="rounded-2xl bg-white/50 p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Why we ask</div>
                    <p className="mt-2 text-sm leading-relaxed">
                      PMOS prevalence and presentation shift across reproductive years. Your age helps the model contextualize cycle and metabolic signals.
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-7">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Height" hint="cm" error={errors.heightCm}>
  <input
    type="number"
    min={0}
    max={500}
    className="input-glass"
    value={data.heightCm}
    onChange={(e) =>
      set("heightCm", Math.min(500, Math.max(0, Number(e.target.value))))
    }
  />
</Field>
                    <Field label="Weight" hint="kg" error={errors.weightKg}>
  <input
    type="number"
    min={0}
    max={500}
    className="input-glass"
    value={data.weightKg}
    onChange={(e) =>
      set("weightKg", Math.min(500, Math.max(0, Number(e.target.value))))
    }
  />
</Field>
                    <Field label="Waist" hint="cm" error={errors.waistCm}>
  <input
    type="number"
    min={0}
    max={500}
    className="input-glass"
    value={data.waistCm}
    onChange={(e) =>
      set("waistCm", Math.min(500, Math.max(0, Number(e.target.value))))
    }
  />
</Field>
                    <Field label="Hip" hint="cm" error={errors.hipCm}>
  <input
    type="number"
    min={0}
    max={500}
    className="input-glass"
    value={data.hipCm}
    onChange={(e) =>
      set("hipCm", Math.min(500, Math.max(0, Number(e.target.value))))
    }
  />
</Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/50 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">BMI (live)</div>
                      <div className="mt-1 font-display text-3xl">
                        {data.heightCm > 0 ? (data.weightKg / Math.pow(data.heightCm/100, 2)).toFixed(1) : "—"}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/50 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Waist-to-Hip Ratio</div>
                      <div className="mt-1 font-display text-3xl">{data.whr.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-7">
                  <div>
                    <div className="mb-3 text-sm font-medium">Are your cycles irregular?</div>
                    <YesNoToggle value={data.irregularCycle} onChange={(v) => set("irregularCycle", v)} />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Average cycle length" hint="days between periods" error={errors.cycleLength}>
                      <input type="number" min={0} max={500} className="input-glass" value={data.cycleLength}
                        onChange={(e) => set("cycleLength", Math.min(500, Math.max(0, Number(e.target.value))))} />
                    </Field>
                    <div className="rounded-2xl bg-white/50 p-5">
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reference</div>
                      <p className="mt-2 text-sm leading-relaxed">A typical cycle is 21–35 days. Lengths beyond that window are one of the most informative signals for the model.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {([
                    ["weightGain", "Recent unexplained weight gain"],
                    ["hairGrowth", "Excess hair growth (face, chest, back)"],
                    ["hairLoss", "Scalp hair thinning or loss"],
                    ["acne", "Persistent acne or pimples"],
                    ["skinDarkening", "Dark skin patches (neck, underarms)"],
                  ] as const).map(([k, label]) => (
                    <div key={k} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/40 px-4 py-3">
                      <div className="text-sm font-medium">{label}</div>
                      <YesNoToggle value={data[k] as YesNo} onChange={(v) => set(k, v as any)} />
                    </div>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-7">
                  <div>
                    <div className="mb-3 text-sm font-medium">Fast food consumption</div>
                    <FreqToggle value={data.fastFood} onChange={(v) => set("fastFood", v)} />
                  </div>
                  <div>
                    <div className="mb-3 text-sm font-medium">Exercise / workout habit</div>
                    <FreqToggle value={data.exercise} onChange={(v) => set("exercise", v)} />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Review your inputs. When you're ready, FemCare AI will synthesize a hormonal health snapshot tailored to you.
                  </p>
                  <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {[
                      ["Age", `${data.age} yrs`],
                      ["Body", `${data.heightCm}cm · ${data.weightKg}kg`],
                      ["Waist / Hip", `${data.waistCm} / ${data.hipCm} cm`],
                      ["WHR", data.whr.toFixed(2)],
                      ["Cycle", `${data.irregularCycle === "yes" ? "Irregular" : "Regular"} · ${data.cycleLength}d`],
                      ["Weight gain", data.weightGain],
                      ["Hair growth", data.hairGrowth],
                      ["Hair loss", data.hairLoss],
                      ["Acne", data.acne],
                      ["Skin darkening", data.skinDarkening],
                      ["Fast food", data.fastFood],
                      ["Exercise", data.exercise],
                    ].map(([k, v]) => (
                      <div key={k as string} className="flex items-center justify-between rounded-xl bg-white/60 px-4 py-3 text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium capitalize">{v as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {submitting && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 grid place-items-center rounded-3xl bg-white/70 backdrop-blur-xl"
            >
              <div className="text-center">
                <div className="relative mx-auto h-16 w-16">
                  <div className="absolute inset-0 rounded-full bg-gradient-primary blur-xl opacity-60 animate-breathe" />
                  <Loader2 className="relative h-16 w-16 animate-spin text-primary" />
                </div>
                <div className="mt-4 font-display text-xl">Synthesizing your hormonal snapshot…</div>
                <div className="mt-1 text-sm text-muted-foreground">Weighting cycle, hormonal, metabolic and lifestyle signals.</div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button type="button" onClick={back} disabled={step === 0 || submitting}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <motion.button type="button" onClick={next} disabled={submitting}
            whileHover={{ scale: stepValid ? 1.02 : 1 }} whileTap={{ scale: 0.98 }}
            animate={shake ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`glow-button ${!stepValid ? "opacity-60" : ""} disabled:cursor-not-allowed`}>
            {step === STEPS.length - 1 ? (<><Sparkles className="h-4 w-4" /> Generate insights</>) : (<>Continue <ArrowRight className="h-4 w-4" /></>)}
          </motion.button>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          FemCare AI is an educational tool — not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default Assessment;
