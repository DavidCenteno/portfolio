"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { skills } from "@/content/site";
import { EASE } from "@/lib/motion";
import { SectionHeading } from "./primitives";

const QUERY = `select domain, array_agg(tool) as tools
from david.skills
where used_in_production
group by domain
order by depth desc;`;

const KEYWORDS = /\b(select|from|where|group|by|order|desc|as)\b/g;
const FUNCS = /\b(array_agg)\b/g;

function highlight(src: string) {
  // Tokenise the visible prefix so partially-typed words are still coloured correctly.
  const parts: { t: string; c: string }[] = [];
  const re = new RegExp(`${KEYWORDS.source}|${FUNCS.source}|(;)`, "g");
  let last = 0;
  for (const m of src.matchAll(re)) {
    if (m.index! > last) parts.push({ t: src.slice(last, m.index), c: "text-fg" });
    parts.push({ t: m[0], c: m[1] ? "text-accent" : m[2] ? "text-[#1d6fb8] dark:text-[#8fd0ff]" : "text-faint" });
    last = m.index! + m[0].length;
  }
  if (last < src.length) parts.push({ t: src.slice(last), c: "text-fg" });
  return parts;
}

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });
  const reduce = useReducedMotion();
  const [progress, setTyped] = useState(0);
  const typed = reduce && inView ? QUERY.length : progress;
  const done = typed >= QUERY.length;

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const n = Math.min(QUERY.length, Math.floor((now - start) / 16));
      setTyped(n);
      if (n < QUERY.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  const lines = QUERY.split("\n").length;
  const rows = skills.reduce((n, s) => n + s.tools.length, 0);

  return (
    <section id="skills" className="relative border-t border-line py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          index="04"
          model="dim_skills"
          title={
            <>
              The toolkit, <em className="text-muted">queried.</em>
            </>
          }
          kicker="Modern data stack, statistics and ML, BI, and applied AI, plus the stakeholder work that makes any of it matter."
        />

        <div ref={ref} className="hairline overflow-hidden rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[11px] text-faint">
            <div className="flex items-center gap-4">
              <span className="text-fg">skills.sql</span>
              <span className="hidden sm:inline">warehouse: career</span>
            </div>
            <span className={`flex items-center gap-2 ${done ? "text-accent" : ""}`}>
              <span className={`size-1.5 rounded-full ${done ? "bg-accent" : "bg-line-strong"}`} />
              {done ? "succeeded" : inView ? "running…" : "idle"}
            </span>
          </div>

          <div className="grid grid-cols-[2.5rem_1fr] overflow-x-auto py-5 font-mono text-[13px] leading-7 sm:text-sm" aria-label={QUERY} role="img">
            <div className="select-none pr-3 text-right text-faint" aria-hidden>
              {Array.from({ length: lines }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="whitespace-pre pr-4" aria-hidden>
              {highlight(QUERY.slice(0, typed)).map((p, i) => (
                <span key={i} className={p.c}>{p.t}</span>
              ))}
              {!done && <span className="caret ml-px inline-block h-4 w-2 translate-y-0.5 bg-accent" />}
            </pre>
          </div>

          <div className="border-t border-line">
            <div className="grid grid-cols-[minmax(9rem,14rem)_1fr] border-b border-line bg-sunken/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
              <span>domain</span>
              <span>tools</span>
            </div>
            <motion.ul initial="hidden" animate={done ? "show" : "hidden"} variants={{ show: { transition: { staggerChildren: 0.09 } } }} className="divide-y divide-line">
              {skills.map((s) => (
                <motion.li
                  key={s.domain}
                  variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } } }}
                  className="grid gap-3 px-4 py-4 transition-colors hover:bg-fg/[0.025] sm:grid-cols-[minmax(9rem,14rem)_1fr]"
                >
                  <span className="font-mono text-sm text-accent">{s.domain}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {s.tools.map((t) => (
                      <span key={t} className="rounded-md border border-line bg-bg/40 px-2 py-1 text-[13px] text-muted">
                        {t}
                      </span>
                    ))}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
            <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-faint">
              {done ? `${skills.length} rows · ${rows} values · returned in 0.04s` : " "}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
