"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { earlier, roles, teaching, type Role } from "@/content/site";
import { EASE } from "@/lib/motion";
import { Reveal, RevealGroup, RevealItem, SectionHeading, Spotlight, Tag } from "./primitives";

function PromotionPath({ path }: { path: string[] }) {
  const reduce = useReducedMotion();
  return (
    <motion.ol
      className="relative mt-6 space-y-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-20% 0px" }}
      aria-label={path.length > 1 ? "Promotion path" : "Title"}
    >
      {path.length > 1 && (
        <motion.span
          aria-hidden
          className="absolute left-[4.5px] top-2 w-px origin-top bg-accent/60"
          style={{ height: `calc(100% - 1rem)` }}
          variants={{ hidden: { scaleY: reduce ? 1 : 0 }, show: { scaleY: 1, transition: { duration: 0.5 * path.length, ease: EASE, delay: 0.2 } } }}
        />
      )}
      {path.map((t, i) => {
        const last = i === path.length - 1;
        return (
          <motion.li
            key={t}
            className="relative flex items-center gap-3 text-sm"
            variants={{ hidden: { opacity: reduce ? 1 : 0 }, show: { opacity: 1, transition: { delay: 0.2 + i * 0.45, duration: 0.4 } } }}
          >
            <span className={`relative z-10 size-2.5 shrink-0 rounded-full border ${last ? "border-accent bg-accent" : "border-line-strong bg-bg"}`} />
            <span className={last ? "text-fg" : "text-muted"}>{t}</span>
            {i > 0 && <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">{/interim/i.test(t) ? "stepped up" : "promoted"}</span>}
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

function RoleBlock({ role }: { role: Role }) {
  return (
    <article className="relative grid gap-8 py-16 md:grid-cols-12 md:gap-10 md:py-24">
      {/* timeline node */}
      <span aria-hidden className="absolute -left-[53.5px] top-[4.6rem] hidden size-[11px] rounded-full border border-accent bg-bg md:top-[6.6rem] lg:block" />

      <header className="md:col-span-4">
        <div className="md:sticky md:top-28">
          <Reveal>
            <p className="font-mono text-xs text-accent">{role.period}</p>
            <h3 className="mt-3 font-display text-5xl leading-none tracking-tight sm:text-6xl">{role.company}</h3>
            <p className="mt-3 text-sm text-muted">{role.domain}</p>
          </Reveal>
          <PromotionPath path={role.path} />
        </div>
      </header>

      <div className="md:col-span-8">
        <Reveal>
          <p className="text-lg leading-relaxed text-pretty sm:text-xl">{role.summary}</p>
        </Reveal>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">What I built</p>
        <RevealGroup className="mt-4 grid gap-3 sm:grid-cols-2">
          {role.built.map((b) => (
            <RevealItem key={b.title}>
              <Spotlight className="hairline h-full rounded-xl p-5 transition-transform duration-500 hover:-translate-y-0.5">
                <p className="font-medium tracking-tight">{b.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.detail}</p>
              </Spotlight>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">Impact</p>
        <RevealGroup className="mt-4 space-y-3">
          {role.impact.map((i) => (
            <RevealItem key={i} className="flex gap-3 text-muted">
              <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-accent" fill="none" aria-hidden>
                <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{i}</span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-8 flex flex-wrap gap-2">
          {role.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </Reveal>
      </div>
    </article>
  );
}

export function Experience() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="relative border-t border-line py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          index="02"
          model="fct_experience"
          title={
            <>
              A decade of shipping, <em className="text-muted">and stepping up.</em>
            </>
          }
          kicker="Senior IC by choice, leader when the team needs it. Promoted into leadership at both Barkibu and Gelato, and trusted to run a data function through a leadership gap."
        />

        <div ref={listRef} className="relative lg:pl-12">
          <div aria-hidden className="absolute bottom-0 left-0 top-0 hidden w-px bg-line lg:block">
            <motion.div className="h-full w-full origin-top bg-gradient-to-b from-accent/0 via-accent to-accent" style={{ scaleY }} />
          </div>
          <div className="divide-y divide-line">
            {roles.map((r) => (
              <RoleBlock key={r.company} role={r} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-t border-line pt-16 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-5">
            <Spotlight className="hairline h-full rounded-2xl p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">Teaching · {teaching.period}</p>
              <h3 className="mt-4 font-display text-3xl leading-tight">{teaching.institution}</h3>
              <p className="mt-1 text-sm text-accent">{teaching.role}</p>
              <ul className="mt-6 space-y-4">
                {teaching.subjects.map((s) => (
                  <li key={s.name}>
                    <p className="leading-snug">{s.name}</p>
                    <p className="mt-1 text-sm text-muted">{s.program}</p>
                  </li>
                ))}
              </ul>
            </Spotlight>
          </Reveal>

          <div className="md:col-span-7">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">Earlier · 2015–2019</p>
            </Reveal>
            <RevealGroup className="mt-4 divide-y divide-line border-y border-line">
              {earlier.map((e) => (
                <RevealItem key={e.company} className="group grid gap-1 py-5 sm:grid-cols-[7.5rem_1fr]">
                  <p className="font-mono text-xs text-faint">{e.period}</p>
                  <div>
                    <p className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-medium transition-colors group-hover:text-accent">{e.company}</span>
                      <span className="text-sm text-muted">{e.role}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{e.note}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
