"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { projects, type Project } from "@/content/site";
import { EASE } from "@/lib/motion";
import { ArrowUpRight, Magnetic, Reveal, RevealGroup, RevealItem, SectionHeading, Tag } from "./primitives";

/* ---------------- Architecture diagram ---------------- */

function ArchDiagram({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const { nodes, edges } = project.arch;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const W = 128, H = 48;

  // Clip each edge to the node rectangles so arrows start/end at borders.
  const clipTo = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x, dy = to.y - from.y;
    const t = Math.min(Math.abs((W / 2 + 6) / (dx || 1e-6)), Math.abs((H / 2 + 6) / (dy || 1e-6)));
    return { x: from.x + dx * t, y: from.y + dy * t };
  };

  return (
    <svg viewBox="0 0 520 325" className="h-full w-full" role="img" aria-label={`${project.name} architecture: ${edges.map(([a, b]) => `${byId[a].label} to ${byId[b].label}`).join(", ")}`}>
      <defs>
        <marker id={`arrow-${project.slug}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 8 4 0 8z" fill={project.accent} />
        </marker>
      </defs>
      {edges.map(([a, b, label], i) => {
        const p1 = clipTo(byId[a], byId[b]);
        const p2 = clipTo(byId[b], byId[a]);
        return (
          <g key={i}>
            <motion.line
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={project.accent}
              strokeOpacity="0.8"
              strokeWidth="1.25"
              className={reduce ? "" : "dash-flow"}
              markerEnd={`url(#arrow-${project.slug})`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.08 }}
            />
            {label && (
              <g>
                <rect x={(p1.x + p2.x) / 2 - label.length * 3.2 - 6} y={(p1.y + p2.y) / 2 - 9} width={label.length * 6.4 + 12} height="18" rx="9" fill="var(--bg-sunken)" stroke="var(--line)" />
                <text x={(p1.x + p2.x) / 2} y={(p1.y + p2.y) / 2 + 3.5} textAnchor="middle" fontSize="10" className="font-mono" fill="var(--fg-muted)">
                  {label}
                </text>
              </g>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => (
        <motion.g key={n.id} initial={reduce ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }} style={{ transformOrigin: `${n.x}px ${n.y}px` }}>
          <rect x={n.x - W / 2} y={n.y - H / 2} width={W} height={H} rx="10" fill="var(--bg-raised)" stroke="var(--line-strong)" />
          <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--fg)">{n.label}</text>
          <text x={n.x} y={n.y + 13} textAnchor="middle" fontSize="9.5" className="font-mono" fill="var(--fg-faint)">{n.sub}</text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ---------------- Stage (screens / architecture) ---------------- */

function Stage({ project, view }: { project: Project; view: "product" | "architecture" }) {
  const reduce = useReducedMotion();
  const [shot, setShot] = useState<"desktop" | "secondary">("desktop");
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 20 });
  const sry = useSpring(ry, { stiffness: 150, damping: 20 });
  const phoneY = useTransform(srx, [-6, 6], [14, -14]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="relative [perspective:1400px]" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }} className="relative">
        {/* browser frame */}
        <div className="hairline overflow-hidden rounded-xl" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
              <span className="size-2.5 rounded-full bg-line-strong" />
            </div>
            <div className="mx-auto flex max-w-[60%] flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-sunken px-3 py-1 font-mono text-[11px] text-faint">
              <svg viewBox="0 0 12 12" className="size-3 shrink-0" fill="none" aria-hidden>
                <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke="currentColor" />
                <path d="M4 5.5V4a2 2 0 1 1 4 0v1.5" stroke="currentColor" />
              </svg>
              {view === "architecture" ? `${project.slug}/architecture.svg` : project.urlLabel}
            </div>
            <span className="w-10" aria-hidden />
          </div>

          <div className="relative aspect-[16/10] bg-sunken">
            <AnimatePresence mode="popLayout" initial={false}>
              {view === "product" ? (
                <motion.div key={`p-${shot}`} className="absolute inset-0" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                  <Image src={project.screens[shot]} alt={project.screens.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-top" />
                </motion.div>
              ) : (
                <motion.div key="arch" className="bg-grid absolute inset-0 p-4 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                  <ArchDiagram project={project} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* phone */}
        <motion.div
          aria-hidden
          style={{ y: phoneY, translateZ: 60 }}
          className={`absolute -bottom-10 -right-3 hidden w-[22%] overflow-hidden rounded-[1.4rem] border-[5px] border-[#1c1c1a] bg-[#1c1c1a] shadow-2xl transition-opacity duration-500 sm:block lg:-right-8 ${view === "architecture" ? "opacity-0" : "opacity-100"}`}
        >
          <div className="relative aspect-[390/844] overflow-hidden rounded-[1rem]">
            <Image src={project.screens.mobile} alt="" fill sizes="15vw" className="object-cover object-top" />
          </div>
        </motion.div>
      </motion.div>

      <div className={`mt-5 flex gap-2 ${view === "product" ? "" : "invisible"}`} role="tablist" aria-label={`${project.name} screenshots`}>
        {(["desktop", "secondary"] as const).map((s, i) => (
          <button
            key={s}
            role="tab"
            aria-selected={shot === s}
            aria-label={`Screenshot ${i + 1}`}
            onClick={() => setShot(s)}
            className="group flex items-center gap-2 py-2 font-mono text-[11px] text-faint"
          >
            <span className={`h-px transition-all duration-500 ${shot === s ? "w-10 bg-accent" : "w-5 bg-line-strong group-hover:w-8"}`} />
            <span className={shot === s ? "text-fg" : ""}>0{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Project block ---------------- */

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const [view, setView] = useState<"product" | "architecture">("product");
  const flip = index % 2 === 1;

  return (
    <article className="relative py-16 sm:py-24" aria-labelledby={`${project.slug}-title`}>
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <Stage project={project} view={view} />
          </Reveal>
        </div>

        <div className={`order-first lg:col-span-5 ${flip ? "lg:order-first" : "lg:order-last"}`}>
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-xs text-faint">
              <span className="text-accent">0{index + 1}</span>
              <span className="h-px w-8 bg-line-strong" />
              <span>live · personal project</span>
            </p>
            <h3 id={`${project.slug}-title`} className="mt-5 font-display text-6xl leading-none tracking-tight sm:text-7xl">
              {project.name}
            </h3>
            <p className="mt-4 text-xl leading-snug text-pretty">{project.tagline}</p>
            <p className="mt-4 leading-relaxed text-muted text-pretty">{project.description}</p>
          </Reveal>

          <RevealGroup className="mt-8 space-y-2.5">
            {project.highlights.map((h) => (
              <RevealItem key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span className="mt-2 h-px w-3 shrink-0 bg-accent" aria-hidden />
                <span>{h}</span>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-bg transition-transform active:scale-[0.97]"
              >
                Visit {project.urlLabel}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <div className="relative inline-flex rounded-full border border-line p-1" role="group" aria-label="Stage view">
              {(["product", "architecture"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`relative rounded-full px-3.5 py-1.5 font-mono text-[11px] capitalize transition-colors ${view === v ? "text-fg" : "text-faint hover:text-muted"}`}
                >
                  {view === v && <motion.span layoutId={`view-${project.slug}`} className="absolute inset-0 rounded-full bg-fg/[0.08]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">{v}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative border-t border-line py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          index="03"
          model="mart_projects"
          title={
            <>
              Things I&apos;ve built <em className="text-muted">and shipped.</em>
            </>
          }
          kicker="Two live products where LLMs do real work: one as a careful editor that can't invent facts, one as a semantic judge. Designed, built, deployed and measured end to end."
        />
        <div className="divide-y divide-line">
          {projects.map((p, i) => (
            <ProjectBlock key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
