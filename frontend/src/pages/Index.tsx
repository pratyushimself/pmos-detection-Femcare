import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Activity, HeartPulse, BrainCircuit,
  LineChart, ShieldCheck, Stars, Lock, Zap,
} from "lucide-react";
import { AmbientBackground } from "@/components/AmbientBackground";

const features = [
  { icon: Sparkles, title: "Intelligent Assessment", body: "An app-like flow that adapts to your answers and surfaces meaningful patterns in real time." },
  { icon: HeartPulse, title: "Hormonal Pattern Analysis", body: "Synthesizes androgen and insulin-related signals into a clear, weighted hormonal profile." },
  { icon: Activity, title: "Cycle Intelligence", body: "Reads regularity and length to map your cycle's signal strength against population baselines." },
  { icon: BrainCircuit, title: "Symptom Mapping", body: "Connects acne, hair, skin and metabolic signals into one coherent intelligence layer." },
  { icon: LineChart, title: "Personalized Insights", body: "Risk and contributors are computed live from your inputs — never generic, never random." },
  { icon: ShieldCheck, title: "Preventive Guidance", body: "Calm, targeted next steps for nutrition, movement, lifestyle and clinical follow-up." },
];

const fadeUp = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7, ease: [0.22,1,0.36,1] as [number,number,number,number] } };

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />

      {/* Hero */}
      <section className="relative pt-40 pb-28 sm:pt-52 sm:pb-36">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 chip"
          >
            <Stars className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">AI-powered hormonal intelligence · for women, by design</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22,1,0.36,1] }}
            className="h-refined mt-7 text-[2.75rem] sm:text-[3.75rem] md:text-[4rem]"
          >
            Understand your hormones.<br />
            <span className="text-gradient font-display italic font-normal">Reclaim your rhythm.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            FemCare AI is an intelligent assessment platform that turns your cycle, body and lifestyle into a clear, personalized hormonal health snapshot — including PMOS likelihood.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/assessment" className="glow-button">
              Begin your assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="ghost-button">See how it works</a>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="chip"><Lock className="h-3 w-3" /> No account required</span>
            <span className="chip"><Zap className="h-3 w-3" /> 90-second analysis</span>
            <span className="chip"><ShieldCheck className="h-3 w-3" /> Educational use</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-28">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">What you get</div>
            <h2 className="mt-3 h-refined text-3xl sm:text-5xl">
              A clinical-grade lens, in a calming interface.
            </h2>
          </motion.div>
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="glass hover-lift group rounded-3xl p-7"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-28">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">How it works</div>
            <h2 className="mt-3 h-refined text-3xl sm:text-5xl">Three calm steps.</h2>
          </motion.div>
          <div className="relative mt-20 grid gap-12 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
            {[
              { n: "01", t: "Share your story", b: "Six light, animated steps gather your body, cycle and lifestyle context." },
              { n: "02", t: "AI synthesis", b: "Inputs are weighted across hormonal, cycle, metabolic and lifestyle axes." },
              { n: "03", t: "Your dashboard", b: "A live, color-adaptive view of your risk, drivers and personalized next steps." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative text-center"
              >
                <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-white shadow-glow-soft ring-1 ring-primary/20">
                  <span className="font-display text-xl text-gradient">{s.n}</span>
                  <span className="absolute inset-0 rounded-full bg-primary/30 blur-xl opacity-50 -z-10 animate-breathe" />
                </div>
                <h3 className="mt-6 font-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="science" className="relative py-28">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            {...fadeUp}
            className="glass-strong relative overflow-hidden rounded-[2.5rem] p-12 sm:p-20 text-center"
          >
            <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blush blur-3xl opacity-80 animate-blob" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-lavender blur-3xl opacity-80 animate-blob" style={{ animationDelay: "-8s" }} />
            <div className="relative">
              <h2 className="h-refined text-3xl sm:text-5xl">
                Ready to listen to <span className="text-gradient font-display italic font-normal">your body</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Two thoughtful minutes. A lifetime of clarity.
              </p>
              <Link to="/assessment" className="glow-button mt-10">
                Start free assessment <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative py-12 text-center">
        <div className="container mx-auto max-w-3xl">
          <p className="text-xs text-muted-foreground mb-2">
            PMOS, formerly known as PCOS, reflects a broader understanding of hormonal and metabolic health patterns.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FemCare AI · Educational tool — not a medical diagnosis. Always consult a qualified healthcare provider.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
