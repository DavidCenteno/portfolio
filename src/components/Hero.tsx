"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { person } from "@/content/site";
import { scrollToId } from "./chrome";
import { LineageGraph } from "./LineageGraph";
import { Magnetic } from "./primitives";

const HEADLINE: { w: string; em?: boolean }[] = [
  { w: "I" }, { w: "turn" }, { w: "raw" }, { w: "data" }, { w: "into" }, { w: "decisions.", em: true },
];

const COMPANIES = ["Roadsurfer", "Gelato", "Barkibu", "VIU", "R Cable", "NorConsulting", "OpenSistemas", "CO2 SmartTech"];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const graphY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-28 sm:pt-36">
      {/* ambient glow */}
      <motion.div
        aria-hidden
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[1100px] -translate-x-1/2 rounded-full"
      >
        <div className="size-full rounded-full" style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }} />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <p className="hero-fade inline-flex items-center gap-2.5 rounded-full border border-line bg-raised/50 py-1.5 pl-2 pr-3.5 font-mono text-[11px] text-muted backdrop-blur">
          <span className="pulse-dot size-2 rounded-full bg-accent" aria-hidden />
          <span>{person.role}</span>
          <span className="text-faint">·</span>
          <span>{person.location}</span>
        </p>

        <h1 className="mt-8 max-w-5xl font-display text-[clamp(3.25rem,10vw,8.5rem)] leading-[0.9] tracking-[-0.035em]">
          <span className="sr-only">{person.name}: </span>
          {HEADLINE.map(({ w, em }, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span className={`hero-word inline-block ${em ? "italic text-accent" : ""}`} style={{ animationDelay: `${(0.05 + i * 0.05).toFixed(2)}s` }}>
                {w}
              </span>
              {i < HEADLINE.length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid items-end gap-10 md:grid-cols-12">
          <p className="hero-fade text-lg leading-relaxed text-muted text-pretty md:col-span-7 lg:col-span-6 lg:text-xl" style={{ animationDelay: "0.3s" }}>
            I&apos;m <span className="text-fg">{person.shortName}</span>, {person.summary.replace(/^Senior data professional/, "a senior data professional")}
          </p>

          <div className="hero-fade flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end lg:col-span-6" style={{ animationDelay: "0.45s" }}>
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("projects");
                }}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent-fill px-6 text-sm font-medium text-accent-ink transition-transform active:scale-[0.97]"
              >
                See what I&apos;ve shipped
                <svg viewBox="0 0 16 16" className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" aria-hidden>
                  <path d="M8 3v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
                className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-sm font-medium transition-colors hover:bg-fg hover:text-bg"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>

        <motion.div className="mt-16 sm:mt-20" style={{ y: graphY }}>
          <div className="hero-fade" style={{ animationDelay: "0.5s", animationDuration: "1s" }}>
            <LineageGraph />
          </div>
        </motion.div>
      </div>

      {/* company strip */}
      <div className="relative mt-20 border-y border-line py-6 sm:mt-28">
        <p className="sr-only">Companies and institutions: {COMPANIES.join(", ")}</p>
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden>
          <div className="animate-marquee flex shrink-0 items-center gap-14 pr-14">
            {[...COMPANIES, ...COMPANIES].map((c, i) => (
              <span key={i} className="flex items-center gap-14 whitespace-nowrap font-display text-2xl text-faint sm:text-3xl">
                {c}
                <span className="text-sm text-accent">✳</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
