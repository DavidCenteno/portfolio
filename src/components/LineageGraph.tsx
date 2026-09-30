"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { EASE } from "@/lib/motion";

type Kind = "source" | "staging" | "mart" | "output" | "decision";
type GNode = { id: string; label: string; kind: Kind; col: number; x: number; y: number; note: string };
type Graph = { orientation: "h" | "v"; width: number; height: number; nodeW: number; nodeH: number; nodes: GNode[]; edges: [string, string][] };

const NOTES: Record<string, string> = {
  app_events: "raw product events landing from the app",
  payments: "orders, invoices and refunds from billing",
  crm: "accounts and deals from the sales CRM",
  web: "sessions and funnels from web analytics",
  stg_orders: "typed, deduplicated, tested orders",
  stg_customers: "one clean row per customer",
  stg_events: "sessionised, conformed event stream",
  fct_revenue: "revenue by customer, product and market",
  dim_customers: "customer attributes, cohorts and value",
  fct_engagement: "activity and retention by cohort",
  pricing_model: "data-driven price recommendations",
  segments_ml: "interpretable customer segmentation",
  dashboards: "self-serve metrics people trust",
  decision: "the point of all of it: a better decision",
};

const node = (id: string, kind: Kind, col: number, x: number, y: number, label = id): GNode => ({ id, label, kind, col, x, y, note: NOTES[id] });

const DESKTOP: Graph = {
  orientation: "h",
  width: 1120,
  height: 480,
  nodeW: 164,
  nodeH: 36,
  nodes: [
    node("app_events", "source", 0, 96, 78, "src.app_events"),
    node("payments", "source", 0, 96, 184, "src.payments"),
    node("crm", "source", 0, 96, 290, "src.crm"),
    node("web", "source", 0, 96, 396, "src.web"),
    node("stg_orders", "staging", 1, 360, 130),
    node("stg_customers", "staging", 1, 360, 240),
    node("stg_events", "staging", 1, 360, 350),
    node("fct_revenue", "mart", 2, 620, 130),
    node("dim_customers", "mart", 2, 620, 240),
    node("fct_engagement", "mart", 2, 620, 350),
    node("pricing_model", "output", 3, 868, 130),
    node("segments_ml", "output", 3, 868, 240),
    node("dashboards", "output", 3, 868, 350),
    node("decision", "decision", 4, 1058, 240),
  ],
  edges: [
    ["app_events", "stg_events"], ["payments", "stg_orders"], ["crm", "stg_customers"], ["web", "stg_events"],
    ["stg_orders", "fct_revenue"], ["stg_customers", "fct_revenue"], ["stg_customers", "dim_customers"],
    ["stg_events", "dim_customers"], ["stg_events", "fct_engagement"],
    ["fct_revenue", "pricing_model"], ["fct_revenue", "dashboards"], ["dim_customers", "segments_ml"],
    ["dim_customers", "dashboards"], ["fct_engagement", "segments_ml"], ["fct_engagement", "dashboards"],
    ["pricing_model", "decision"], ["segments_ml", "decision"], ["dashboards", "decision"],
  ],
};

const MOBILE: Graph = {
  orientation: "v",
  width: 380,
  height: 470,
  nodeW: 112,
  nodeH: 34,
  nodes: [
    node("app_events", "source", 0, 66, 40, "src.events"),
    node("payments", "source", 0, 190, 40, "src.payments"),
    node("crm", "source", 0, 314, 40, "src.crm"),
    node("stg_orders", "staging", 1, 110, 150),
    node("stg_customers", "staging", 1, 270, 150, "stg_customer"),
    node("fct_revenue", "mart", 2, 110, 260),
    node("dim_customers", "mart", 2, 270, 260, "dim_customer"),
    node("pricing_model", "output", 3, 110, 350, "pricing_ml"),
    node("dashboards", "output", 3, 270, 350),
    node("decision", "decision", 4, 190, 436),
  ],
  edges: [
    ["app_events", "stg_customers"], ["payments", "stg_orders"], ["crm", "stg_customers"],
    ["stg_orders", "fct_revenue"], ["stg_customers", "fct_revenue"], ["stg_customers", "dim_customers"],
    ["fct_revenue", "pricing_model"], ["fct_revenue", "dashboards"], ["dim_customers", "dashboards"],
    ["pricing_model", "decision"], ["dashboards", "decision"],
  ],
};

function edgePath(g: Graph, a: GNode, b: GNode) {
  const hw = (n: GNode) => (n.kind === "decision" ? 56 : g.nodeW / 2);
  if (g.orientation === "h") {
    const x1 = a.x + hw(a), x2 = b.x - hw(b), mx = (x1 + x2) / 2;
    return `M${x1} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`;
  }
  const y1 = a.y + g.nodeH / 2, y2 = b.y - g.nodeH / 2, my = (y1 + y2) / 2;
  return `M${a.x} ${y1} C${a.x} ${my}, ${b.x} ${my}, ${b.x} ${y2}`;
}

/** Walks the DAG both ways from `id`, like dbt's `+model+` selector. */
function lineageOf(g: Graph, id: string) {
  const nodes = new Set([id]);
  const walk = (cur: string, dir: 0 | 1) => {
    for (const e of g.edges) {
      if (e[dir] === cur && !nodes.has(e[1 - dir])) {
        nodes.add(e[1 - dir]);
        walk(e[1 - dir], dir);
      }
    }
  };
  walk(id, 0);
  walk(id, 1);
  return nodes;
}

function GraphSvg({ g, active, setActive, idPrefix }: { g: Graph; active: string | null; setActive: (id: string | null) => void; idPrefix: string }) {
  const reduce = useReducedMotion();
  const byId = useMemo(() => Object.fromEntries(g.nodes.map((n) => [n.id, n])), [g]);
  const lit = useMemo(() => (active ? lineageOf(g, active) : null), [g, active]);
  const colDelay = (col: number) => 0.35 + col * 0.28;

  return (
    <svg viewBox={`0 0 ${g.width} ${g.height}`} className="h-auto w-full select-none" role="img" aria-label="Data lineage graph: raw sources flow through staging models and marts into ML models and dashboards, ending in a decision.">
      <defs>
        <linearGradient id={`${idPrefix}-edge`} x1="0" x2={g.orientation === "h" ? "1" : "0"} y1="0" y2={g.orientation === "v" ? "1" : "0"}>
          <stop offset="0%" stopColor="var(--fg-faint)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id={`${idPrefix}-glow`}>
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {g.edges.map(([a, b], i) => {
        const on = !lit || (lit.has(a) && lit.has(b));
        const d = edgePath(g, byId[a], byId[b]);
        const pid = `${idPrefix}-e${i}`;
        return (
          <g key={pid} style={{ opacity: on ? 1 : 0.12, transition: "opacity 300ms var(--ease-out)" }}>
            <motion.path
              id={pid}
              d={d}
              fill="none"
              stroke={`url(#${idPrefix}-edge)`}
              strokeWidth={lit && on ? 1.75 : 1.1}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: colDelay(byId[a].col) + 0.15 }}
            />
            {!reduce && (
              <circle r={g.orientation === "h" ? 2.6 : 2.4} fill="var(--accent)" opacity="0">
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${2.6 + (i % 5) * 0.35}s`} begin={`${2.2 + (i % 7) * 0.45}s`} repeatCount="indefinite" />
                <animateMotion dur={`${2.6 + (i % 5) * 0.35}s`} begin={`${2.2 + (i % 7) * 0.45}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;1" keySplines="0.45 0 0.55 1">
                  <mpath href={`#${pid}`} />
                </animateMotion>
              </circle>
            )}
          </g>
        );
      })}

      {g.nodes.map((n) => {
        const on = !lit || lit.has(n.id);
        const isDecision = n.kind === "decision";
        const w = isDecision ? 112 : g.nodeW;
        const h = isDecision ? 44 : g.nodeH;
        return (
          <motion.g
            key={n.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: on ? 1 : 0.25, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: lit ? 0 : colDelay(n.col) }}
            onPointerEnter={() => setActive(n.id)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(n.id)}
            onBlur={() => setActive(null)}
            tabIndex={0}
            role="button"
            aria-label={`${n.label}: ${n.note}`}
            className="cursor-pointer outline-none"
          >
            {isDecision && <circle cx={n.x} cy={n.y} r="70" fill={`url(#${idPrefix}-glow)`} className="pulse-glow" />}
            <rect
              x={n.x - w / 2}
              y={n.y - h / 2}
              width={w}
              height={h}
              rx={h / 2}
              fill={isDecision ? "var(--accent-fill)" : "var(--bg-raised)"}
              stroke={active === n.id ? "var(--accent)" : isDecision ? "transparent" : "var(--line-strong)"}
              strokeWidth={active === n.id ? 1.5 : 1}
            />
            {!isDecision && (
              <circle cx={n.x - w / 2 + 16} cy={n.y} r="3" fill={n.kind === "source" ? "var(--fg-faint)" : n.kind === "output" ? "var(--accent)" : "var(--fg-muted)"} />
            )}
            <text
              x={isDecision ? n.x : n.x - w / 2 + 28}
              y={n.y + 4}
              textAnchor={isDecision ? "middle" : "start"}
              className="font-mono"
              fontSize={isDecision ? 14 : g.orientation === "h" ? 12.5 : 11}
              fontWeight={isDecision ? 600 : 400}
              fill={isDecision ? "var(--accent-ink)" : "var(--fg)"}
            >
              {n.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

const LAYERS = ["sources", "staging", "marts", "models & BI", "decision"];

export function LineageGraph() {
  const [active, setActive] = useState<string | null>(null);
  const caption = active ? `${active}: ${NOTES[active]}` : "select a node to trace its lineage";

  return (
    <div className="hairline overflow-hidden rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </div>
        <p className="font-mono text-[11px] text-faint">lineage · how_i_work.yml</p>
        <span className="font-mono text-[11px] text-accent">● live</span>
      </div>

      <div className="bg-grid relative px-3 pb-2 pt-4 sm:px-6 sm:pt-6">
        <div className="mb-2 hidden grid-cols-5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint md:grid">
          {LAYERS.map((l, i) => (
            <span key={l} className={i === 4 ? "text-right" : i > 0 ? "text-center" : ""}>{l}</span>
          ))}
        </div>
        <div className="hidden md:block">
          <GraphSvg g={DESKTOP} active={active} setActive={setActive} idPrefix="lg-d" />
        </div>
        <div className="md:hidden">
          <GraphSvg g={MOBILE} active={active} setActive={setActive} idPrefix="lg-m" />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-[11px] text-muted" aria-live="polite">
        <span className="text-accent">$</span>
        <span className="truncate">{caption}</span>
        <span className="caret inline-block h-3 w-1.5 bg-accent" aria-hidden />
      </div>
    </div>
  );
}
