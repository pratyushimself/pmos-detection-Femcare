import { useEffect, useState } from "react";

interface Slice { label: string; value: number; color: string; explain?: string; }
interface Props { data: Slice[]; }

export const DonutChart = ({ data }: Props) => {
  const [hover, setHover] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

  const total = Math.max(1, data.reduce((s, d) => s + d.value, 0));
  const size = 240;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
      <div className="relative overflow-visible">
        <svg width={size} height={size} className="-rotate-90 overflow-visible" style={{ overflow: "visible" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} opacity={0.35} />
          {data.map((d, i) => {
            const frac = d.value / total;
            const len = c * frac;
            const dash = animated ? `${len} ${c}` : `0 ${c}`;
            const offset = -acc;
            acc += animated ? len : 0;
            const isHover = hover === i;
            return (
              <circle key={i} cx={size/2} cy={size/2} r={r}
                fill="none" stroke={d.color}
                strokeWidth={isHover ? stroke + 6 : stroke}
                strokeDasharray={dash} strokeDashoffset={offset}
                style={{
                  transition: "stroke-dasharray 1.6s cubic-bezier(0.22,1,0.36,1), stroke-width 0.3s ease, filter 0.3s",
                  filter: isHover ? `drop-shadow(0 0 12px ${d.color})` : "none",
                  cursor: "pointer",
                  opacity: hover === null || isHover ? 1 : 0.45,
                }}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center px-6">
          {hover !== null ? (
            <div>
              <div className="font-display text-4xl" style={{ color: data[hover].color }}>
                {Math.round((data[hover].value / total) * 100)}%
              </div>
              <div className="mt-1 text-xs font-medium">{data[hover].label}</div>
              {data[hover].explain && <div className="mt-1.5 text-[11px] leading-snug text-muted-foreground max-w-[160px]">{data[hover].explain}</div>}
            </div>
          ) : (
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Contribution</div>
              <div className="mt-1 font-display text-3xl">{data.length} factors</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Hover to explore</div>
            </div>
          )}
        </div>
      </div>
      <ul className="flex-1 space-y-3">
        {data.map((d, i) => (
          <li key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            className="group flex items-start gap-3 text-sm cursor-pointer rounded-xl px-3 py-2 transition-all"
            style={{ background: hover === i ? `${d.color}10` : "transparent" }}>
            <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full" style={{ background: d.color, boxShadow: hover === i ? `0 0 10px ${d.color}` : "none" }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{d.label}</span>
                <span className="tabular-nums text-muted-foreground">{Math.round((d.value/total)*100)}%</span>
              </div>
              {d.explain && <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">{d.explain}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
