"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { person } from "@/content/site";
import { Toast, scrollToId } from "./chrome";
import { ArrowUpRight, Magnetic, Reveal, Scramble } from "./primitives";

function LocalTime() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: person.timeZone, timeZoneName: "short" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now ?? "--:--:--"}</span>;
}

export function Contact() {
  const [toast, setToast] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["10%", "0%"]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setToast("Email copied to clipboard");
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden border-t border-line pt-28 sm:pt-40">
      <div aria-hidden className="pointer-events-none absolute -bottom-72 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <p className="flex items-center gap-3 font-mono text-xs text-faint">
          <span className="text-accent">05</span>
          <span className="h-px w-8 bg-line-strong" />
          <Scramble text="decision → contact" />
        </p>

        <motion.h2 style={{ x }} className="mt-8 whitespace-nowrap font-display text-[clamp(3.5rem,13vw,12rem)] leading-[0.85] tracking-[-0.04em]">
          Let&apos;s <em className="text-accent">talk</em> data.
        </motion.h2>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <p className="max-w-xl text-lg leading-relaxed text-muted text-pretty">
              Whether it&apos;s a role, a project, or a data problem you&apos;d like a second pair of eyes on, my inbox is open.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href={`mailto:${person.email}`} className="group inline-flex h-14 items-center gap-3 rounded-full bg-accent-fill px-7 text-base font-medium text-accent-ink transition-transform active:scale-[0.97]">
                  {person.email}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={copy}
                className="inline-flex h-14 items-center gap-2 rounded-full border border-line-strong px-5 font-mono text-xs text-muted transition-colors hover:text-fg"
                aria-label="Copy email address"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                  <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5H5" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                copy
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-5">
            <dl className="divide-y divide-line border-y border-line font-mono text-sm">
              <div className="flex justify-between py-4">
                <dt className="text-faint">linkedin</dt>
                <dd>
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 hover:text-accent">
                    /in/david-centeno-pedrido
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </dd>
              </div>
              <div className="flex justify-between py-4">
                <dt className="text-faint">based in</dt>
                <dd>{person.location}</dd>
              </div>
              <div className="flex justify-between py-4">
                <dt className="text-faint">local time</dt>
                <dd>
                  <LocalTime />
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>

      <footer className="relative mx-auto mt-28 flex max-w-7xl flex-col gap-4 border-t border-line px-4 py-8 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p>© {new Date().getFullYear()} {person.name}</p>
        <p>Built with Next.js, Motion & hand-drawn SVG.</p>
        <button type="button" onClick={() => scrollToId("top")} className="self-start hover:text-fg sm:self-auto">
          back to top ↑
        </button>
      </footer>
      <Toast message={toast} />
    </section>
  );
}
