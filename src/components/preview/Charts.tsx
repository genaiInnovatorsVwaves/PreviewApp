const PALETTE = ["#2a78d6", "#1baf7a", "#eda100", "#008300", "#4a3aa7", "#e34948", "#e87ba4", "#eb6834"];

export function BarChart({ data, height = 220 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = 300 / data.length;
  const barW = Math.min(slot * 0.5, 40);
  return (
    <svg viewBox="0 0 300 210" className="w-full" style={{ height }} role="img" aria-label="Bar chart">
      <line x1="0" y1="170" x2="300" y2="170" stroke="#e1e0d9" strokeWidth="1" />
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" y1={170 - f * 150} x2="300" y2={170 - f * 150} stroke="#e1e0d9" strokeWidth="1" strokeDasharray="3,3" />
      ))}
      {data.map((d, i) => {
        const cx = i * slot + slot / 2;
        const x = cx - barW / 2;
        const h = (d.value / max) * 150;
        const y = 170 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx="3" fill={PALETTE[i % PALETTE.length]} />
            <text x={cx} y={y - 6} textAnchor="middle" fontSize="10" fill="#52514e">
              {d.value}
            </text>
            <text x={cx} y="185" textAnchor="middle" fontSize="9" fill="#898781">
              {d.label.length > 12 ? d.label.slice(0, 11) + "…" : d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ data, height = 220 }: { data: { label: string; value: number }[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let angle = -90;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const arcs = data.map((d, i) => {
    const frac = d.value / total;
    const start = angle;
    const sweep = frac * 360;
    angle += sweep;
    const end = angle;
    const large = sweep > 180 ? 1 : 0;
    const toXY = (deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    };
    const [x1, y1] = toXY(start);
    const [x2, y2] = toXY(end);
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: PALETTE[i % PALETTE.length] };
  });
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" style={{ height, width: height }} role="img" aria-label="Donut chart">
        {arcs.map((a, i) => (
          <path key={i} d={a.d} fill={a.color} stroke="#fcfcfb" strokeWidth="2" />
        ))}
        <circle cx={cx} cy={cy} r={38} fill="#ffffff" />
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
            <span className="text-foreground">{d.label}</span>
            <span className="text-muted-foreground">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({
  seriesA,
  seriesB,
  labelA,
  labelB,
  height = 220,
}: {
  seriesA: { label: string; value: number }[];
  seriesB: { label: string; value: number }[];
  labelA: string;
  labelB: string;
  height?: number;
}) {
  const max = Math.max(...seriesA.map((d) => d.value), ...seriesB.map((d) => d.value), 1);
  const n = seriesA.length;
  const toPoints = (series: { value: number }[]) =>
    series.map((d, i) => {
      const x = (i / (n - 1)) * 280 + 10;
      const y = 170 - (d.value / max) * 150;
      return `${x},${y}`;
    });
  return (
    <div>
      <svg viewBox="0 0 300 195" className="w-full" style={{ height }} role="img" aria-label="Line chart">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="10" y1={170 - f * 150} x2="290" y2={170 - f * 150} stroke="#e1e0d9" strokeWidth="1" strokeDasharray="3,3" />
        ))}
        <polyline points={toPoints(seriesA).join(" ")} fill="none" stroke={PALETTE[0]} strokeWidth="2" />
        <polyline points={toPoints(seriesB).join(" ")} fill="none" stroke={PALETTE[1]} strokeWidth="2" />
        {toPoints(seriesA).map((p, i) => (
          <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r="3" fill={PALETTE[0]} />
        ))}
        {toPoints(seriesB).map((p, i) => (
          <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r="3" fill={PALETTE[1]} />
        ))}
        {seriesA.map((d, i) => {
          const x = (i / (n - 1)) * 280 + 10;
          return (
            <text key={i} x={x} y="187" textAnchor="middle" fontSize="9" fill="#898781">
              {d.label}
            </text>
          );
        })}
      </svg>
      <div className="mt-1 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ backgroundColor: PALETTE[0] }} />{labelA}</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ backgroundColor: PALETTE[1] }} />{labelB}</span>
      </div>
    </div>
  );
}
