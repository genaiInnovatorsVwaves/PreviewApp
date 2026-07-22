import { useLayoutEffect, useRef, useState } from "react";
import { Minus, Plus, Maximize2 } from "lucide-react";
import type { AppData, DataDictionaryEntity } from "../../data/types";
import { cn } from "../../lib/utils";

const BOX_WIDTH = 250;
const COL_GAP = 96;
const ROW_GAP = 112;

interface LinePos {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  midX: number;
  midY: number;
  label: string;
}

function rectBoundaryPoint(cx: number, cy: number, w: number, h: number, tx: number, ty: number) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const halfW = w / 2;
  const halfH = h / 2;
  const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

function EntityBox({ table, innerRef }: { table: DataDictionaryEntity; innerRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={innerRef}
      style={{
        width: BOX_WIDTH,
        overflow: "hidden",
        borderRadius: "var(--vw-radius-xs)",
        border: "1px solid var(--vw-color-slate-700)",
        background: "var(--vw-color-slate-900)",
        boxShadow: "0 8px 16px -4px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid var(--vw-color-slate-700)",
          background: "var(--vw-color-slate-800)",
          padding: "8px 12px",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.01em",
          color: "var(--vw-color-slate-100)",
        }}
      >
        {table.name}
      </div>
      <div className="divide-y" style={{ borderColor: "var(--vw-color-slate-800)" }}>
        {table.fields.map((f, i) => (
          <div key={i} className="flex items-center justify-between gap-2" style={{ padding: "6px 12px", fontSize: "10px" }}>
            <span
              className="truncate font-mono"
              style={{
                fontWeight: f.modifier === "PK" ? 500 : 400,
                color: f.modifier === "PK" ? "var(--vw-color-red-400)" : f.modifier === "FK" ? "var(--vw-color-blue-400)" : "var(--vw-color-slate-300)",
              }}
            >
              {f.modifier ? `${f.modifier} ` : ""}
              {f.name}
            </span>
            <span className="shrink-0" style={{ color: "var(--vw-color-slate-500)" }}>{f.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramCanvas({ data, zoom }: { data: AppData; zoom: number }) {
  const model = data.createData.dataModel;
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<LinePos[]>([]);

  useLayoutEffect(() => {
    function compute() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const next: LinePos[] = [];
      model.relationships.forEach((rel, i) => {
        const a = boxRefs.current[rel.from];
        const b = boxRefs.current[rel.to];
        if (!a || !b) return;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const ax = (ra.left + ra.width / 2 - containerRect.left) / zoom;
        const ay = (ra.top + ra.height / 2 - containerRect.top) / zoom;
        const bx = (rb.left + rb.width / 2 - containerRect.left) / zoom;
        const by = (rb.top + rb.height / 2 - containerRect.top) / zoom;
        const aw = ra.width / zoom;
        const ah = ra.height / zoom;
        const bw = rb.width / zoom;
        const bh = rb.height / zoom;
        const start = rectBoundaryPoint(ax, ay, aw, ah, bx, by);
        const end = rectBoundaryPoint(bx, by, bw, bh, ax, ay);
        next.push({
          key: `${rel.from}-${rel.to}-${i}`,
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          midX: (start.x + end.x) / 2,
          midY: (start.y + end.y) / 2,
          label: rel.label,
        });
      });
      setLines(next);
    }
    // Run once immediately, then again after layout/fonts settle.
    compute();
    const raf1 = requestAnimationFrame(() => {
      compute();
      requestAnimationFrame(compute);
    });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("resize", compute);
      cancelAnimationFrame(raf1);
    };
  }, [zoom, model]);

  const maxCol = Math.max(...Object.values(model.positions).map((p) => p.col), 0);

  return (
    <div ref={containerRef} className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: "max-content" }}>
      <svg className="pointer-events-none absolute left-0 top-0 overflow-visible">
        {lines.map((l) => (
          <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--vw-color-blue-500)" strokeWidth={1.5} strokeOpacity={0.55} />
        ))}
      </svg>
      {lines.map((l) => (
        <div
          key={l.key}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
          style={{
            left: l.midX,
            top: l.midY,
            borderRadius: "var(--vw-radius-xs)",
            border: "1px solid var(--vw-color-slate-700)",
            background: "var(--vw-color-slate-900)",
            padding: "2px 6px",
            fontSize: "9px",
            fontWeight: 500,
            color: "var(--vw-color-blue-300)",
          }}
        >
          {l.label}
        </div>
      ))}
      <div
        className="grid p-10"
        style={{ gridTemplateColumns: `repeat(${maxCol + 1}, ${BOX_WIDTH}px)`, columnGap: COL_GAP, rowGap: ROW_GAP }}
      >
        {model.tables.map((t) => {
          const pos = model.positions[t.name] ?? { col: 0, row: 0 };
          return (
            <div key={t.name} style={{ gridColumn: pos.col + 1, gridRow: pos.row + 1 }}>
              <EntityBox table={t} innerRef={(el) => (boxRefs.current[t.name] = el)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ERDiagram({ data }: { data: AppData }) {
  const [zoom, setZoom] = useState(0.85);
  const [fullscreen, setFullscreen] = useState(false);

  const controls = (
    <div className="flex items-center gap-2">
      <span className="w-10 text-right" style={{ fontSize: "var(--vw-font-label-sm)", color: "var(--vw-color-gray-500)" }}>
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        title="Zoom out"
        onClick={() => setZoom((z) => Math.max(0.3, Math.round((z - 0.1) * 100) / 100))}
        className="nst-btn nst-btn--filled nst-btn--icon nst-btn--sm"
      >
        <Minus className="size-3.5" />
      </button>
      <button
        type="button"
        title="Zoom in"
        onClick={() => setZoom((z) => Math.min(1.5, Math.round((z + 0.1) * 100) / 100))}
        className="nst-btn nst-btn--filled nst-btn--icon nst-btn--sm"
      >
        <Plus className="size-3.5" />
      </button>
      <button
        type="button"
        title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
        onClick={() => setFullscreen((f) => !f)}
        className="nst-btn nst-btn--filled nst-btn--icon nst-btn--sm"
      >
        <Maximize2 className="size-3.5" />
      </button>
    </div>
  );

  const canvas = (
    <div
      className={cn("overflow-auto", fullscreen ? "h-[calc(100vh-9rem)]" : "h-[640px]")}
      style={{ borderRadius: "var(--vw-radius-sm)", background: "var(--vw-color-slate-950)" }}
    >
      <DiagramCanvas data={data} zoom={zoom} />
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-4 z-50 flex flex-col overflow-hidden p-4"
        style={{ borderRadius: "var(--vw-radius-lg)", background: "var(--vw-color-white)", boxShadow: "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="vw-card-title-sm">Entity Relationship Diagram</h2>
          {controls}
        </div>
        {canvas}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-end">{controls}</div>
      {canvas}
    </div>
  );
}
