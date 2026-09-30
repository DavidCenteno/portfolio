"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { about, education, person } from "@/content/site";
import { EASE } from "@/lib/motion";
import { Reveal, RevealGroup, RevealItem, SectionHeading } from "./primitives";

function Portrait() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const sx = useSpring(mx, { stiffness: 200, damping: 25 });
  const sy = useSpring(my, { stiffness: 200, damping: 25 });
  const radius = useSpring(0, { stiffness: 160, damping: 22 });
  const clip = useTransform([sx, sy, radius], ([x, y, r]) => `circle(${r}% at ${x}% ${y}%)`);

  useEffect(() => {
    radius.set(hover ? 34 : 0);
  }, [hover, radius]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <figure>
      <div
        className="hairline group relative aspect-[4/5] overflow-hidden rounded-2xl"
        onPointerMove={onMove}
        onPointerEnter={() => !reduce && setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <Image src="/images/david-mono.webp" alt={`Portrait of ${person.name}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover opacity-90 contrast-[1.05]" priority={false} />
        <div aria-hidden className="absolute inset-0 bg-accent-fill mix-blend-color opacity-[0.12]" />
        <motion.div aria-hidden className="absolute inset-0" style={{ clipPath: clip }}>
          <Image src="/images/david.webp" alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </motion.div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/70 to-transparent" />
        <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fg/80 [@media(hover:none)]:hidden">
          {reduce ? "" : "hover for colour"}
        </span>
      </div>
      <figcaption className="mt-3 flex justify-between font-mono text-[11px] text-faint">
        <span>fig. 01</span>
        <span>{person.location}</span>
      </figcaption>
    </figure>
  );
}

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);
  const [n, setN] = useState(match && !reduce ? 0 : null);

  useEffect(() => {
    if (!match || !inView || reduce) return;
    const controls = animate(0, Number(match[1]), { duration: 1.4, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className="tabular-nums">
      {match && n !== null ? `${n}${match[2]}` : value}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <SectionHeading
          index="01"
          model="stg_about"
          title={
            <>
              Deep foundations, <em className="text-muted">practical</em> output.
            </>
          }
        />

        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-4">
            <Portrait />
          </Reveal>

          <div className="md:col-span-8 md:pl-6 lg:pl-12">
            <div className="space-y-6 text-xl leading-relaxed text-pretty sm:text-2xl sm:leading-[1.5]">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className={i === 0 ? "text-fg" : "text-muted"}>{p}</p>
                </Reveal>
              ))}
            </div>

            <RevealGroup className="mt-14 grid grid-cols-2 border-t border-line sm:grid-cols-4">
              {about.facts.map((f, i) => (
                <RevealItem key={f.label} className={`py-6 ${i % 2 ? "pl-5" : ""} sm:pl-5 ${i === 0 ? "sm:pl-0" : ""} ${i > 0 ? "sm:border-l" : ""} ${i % 2 ? "border-l" : ""} border-line`}>
                  <p className="font-display text-5xl leading-none tracking-tight">
                    <CountUp value={f.value} />
                  </p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">{f.label}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-4 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">Education</p>
                <p className="mt-2">{education.degree}</p>
                <p className="text-sm text-muted">
                  {education.institution} · {education.period}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">Languages</p>
                <ul className="mt-2 space-y-0.5 text-sm text-muted">
                  {about.languages.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
