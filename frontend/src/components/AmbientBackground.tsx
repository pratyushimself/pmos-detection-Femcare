interface Props {
  variant?: "default" | "calm" | "warm" | "alert";
}

export const AmbientBackground = ({ variant = "default" }: Props) => {
  const accentClass = {
    default: ["bg-blush", "bg-lavender", "bg-rose/50"],
    calm: ["bg-lavender", "bg-blush", "bg-rose/40"],
    warm: ["bg-rose/60", "bg-blush", "bg-lavender"],
    alert: ["bg-rose/70", "bg-magenta/30", "bg-blush"],
  }[variant];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Aurora wash with slow breathing */}
      <div className="absolute inset-0 bg-gradient-aurora animate-bg-breathe" />

      {/* Slow rotating mesh */}
      <div className="absolute -inset-[20%] opacity-50 animate-mesh blur-3xl" style={{ background: "var(--gradient-mesh)" }} />

      {/* Drifting bloom blobs */}
      <div className={`absolute -top-48 -left-32 h-[640px] w-[640px] rounded-full blur-[120px] opacity-70 animate-blob ${accentClass[0]}`} />
      <div className={`absolute top-1/4 -right-48 h-[720px] w-[720px] rounded-full blur-[140px] opacity-60 animate-blob ${accentClass[1]}`} style={{ animationDelay: "-8s" }} />
      <div className={`absolute -bottom-56 left-1/4 h-[680px] w-[680px] rounded-full blur-[140px] opacity-55 animate-blob ${accentClass[2]}`} style={{ animationDelay: "-16s" }} />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 bg-grid-soft opacity-30 mask-fade-b" />

      {/* Medical ECG flow line */}
      <svg className="absolute left-0 right-0 top-1/2 w-full opacity-[0.06]" viewBox="0 0 1600 80" fill="none" preserveAspectRatio="none">
        <path
          d="M0 40 L260 40 L290 18 L320 62 L350 8 L380 72 L410 40 L780 40 L810 22 L840 58 L870 12 L900 68 L930 40 L1600 40"
          stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" className="animate-draw"
        />
      </svg>

      {/* Mandala — Indian-inspired wellness motif */}
      <svg className="absolute -right-24 top-16 w-[560px] opacity-[0.07] animate-spin-slow" viewBox="0 0 400 400" fill="none">
        <g stroke="hsl(var(--primary))" strokeWidth="0.6">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <line key={`r${i}`} x1="200" y1="200" x2={200 + 180 * Math.cos(a)} y2={200 + 180 * Math.sin(a)} />;
          })}
          {[40, 80, 120, 160].map((r) => <circle key={r} cx="200" cy="200" r={r} />)}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const cx = 200 + 110 * Math.cos(a);
            const cy = 200 + 110 * Math.sin(a);
            return <ellipse key={`p${i}`} cx={cx} cy={cy} rx="36" ry="14" transform={`rotate(${(i * 30)} ${cx} ${cy})`} stroke="hsl(var(--magenta))" />;
          })}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <circle key={`d${i}`} cx={200 + 165 * Math.cos(a)} cy={200 + 165 * Math.sin(a)} r="3" fill="hsl(var(--primary))" stroke="none" />;
          })}
        </g>
      </svg>

      {/* Counter-rotating secondary mandala — parallax depth */}
      <svg className="absolute -left-32 top-1/3 w-[420px] opacity-[0.05] animate-spin-reverse" viewBox="0 0 400 400" fill="none">
        <g stroke="hsl(var(--magenta))" strokeWidth="0.5">
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <line key={i} x1="200" y1="200" x2={200 + 160 * Math.cos(a)} y2={200 + 160 * Math.sin(a)} />;
          })}
          {[60, 110, 160].map((r) => <circle key={r} cx="200" cy="200" r={r} />)}
        </g>
      </svg>

      {/* Lotus silhouette — bottom-left */}
      <svg className="absolute -bottom-10 -left-10 w-[420px] opacity-[0.05]" viewBox="0 0 200 200" fill="none">
        <g stroke="hsl(var(--magenta))" strokeWidth="0.8">
          {Array.from({ length: 9 }).map((_, i) => {
            const a = (-Math.PI / 2) + ((i - 4) / 9) * Math.PI;
            return <ellipse key={i} cx="100" cy="160" rx="18" ry="70" transform={`rotate(${(a * 180) / Math.PI} 100 160)`} />;
          })}
        </g>
      </svg>

      {/* Filmic noise */}
      <div className="absolute inset-0 bg-noise opacity-[0.25] mix-blend-overlay" />
    </div>
  );
};
