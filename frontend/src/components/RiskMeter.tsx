import { useEffect, useState } from "react";

interface Props {
  value: number;
  color: string;
  label: string;
  subLabel?: string;
}

export const RiskMeter = ({ value, color, label, subLabel }: Props) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(value), 250);
    return () => clearTimeout(t);
  }, [value]);

  const size = 260;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const sweep = 0.78;
  const len = c * sweep;
  const offset = len * (1 - v / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative grid place-items-center">
        <svg width={size} height={size} className="overflow-visible -rotate-[140deg]">
          <defs>
            <linearGradient id="meter-g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="60%" stopColor={color} />
              <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
            </linearGradient>
            <filter id="meter-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          <circle cx={size/2} cy={size/2} r={r} stroke="hsl(var(--border))" strokeWidth={stroke} fill="none"
            strokeLinecap="round" strokeDasharray={`${len} ${c}`} opacity={0.5} />
          <circle cx={size/2} cy={size/2} r={r} stroke="url(#meter-g)" strokeWidth={stroke} fill="none"
            strokeLinecap="round" strokeDasharray={`${len} ${c}`} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1)", filter: "url(#meter-glow)", opacity: 0.6 }} />
          <circle cx={size/2} cy={size/2} r={r} stroke="url(#meter-g)" strokeWidth={stroke} fill="none"
            strokeLinecap="round" strokeDasharray={`${len} ${c}`} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.22,1,0.36,1)" }} />
          {Array.from({ length: 11 }).map((_, i) => {
            const a = (i / 10) * sweep * 2 * Math.PI;
            const x1 = size/2 + (r - stroke/2 - 6) * Math.cos(a);
            const y1 = size/2 + (r - stroke/2 - 6) * Math.sin(a);
            const x2 = size/2 + (r - stroke/2 - 1) * Math.cos(a);
            const y2 = size/2 + (r - stroke/2 - 1) * Math.sin(a);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--foreground) / 0.2)" strokeWidth="1.2" strokeLinecap="round" />;
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">AI risk score</div>
            <div className="mt-1 font-display text-6xl leading-none tracking-tight" style={{ color }}>{Math.round(v)}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">/ 100</div>
          </div>
        </div>
      </div>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold" style={{ background: `${color}1a`, color }}>
        {label}
      </div>
      {subLabel && <div className="mt-2 max-w-[240px] text-center text-[11px] leading-relaxed text-muted-foreground">{subLabel}</div>}
    </div>
  );
};
