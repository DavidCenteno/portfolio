"use client";

import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { nav, person, projects } from "@/content/site";
import { EASE } from "@/lib/motion";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function scrollToId(id: string) {
  const target = id === "top" ? 0 : `#${id}`;
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: id === "top" ? 0 : -72, duration: 1.4 });
  else if (id === "top") window.scrollTo({ top: 0 });
  else document.getElementById(id)?.scrollIntoView({ block: "start" });
}

/* ---------------- Smooth scroll ---------------- */

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -72 } });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent" style={{ scaleX }} />;
}

/* ---------------- Theme ---------------- */

type Theme = "dark" | "light";

// The <html data-theme> attribute is the source of truth; subscribe to it so every consumer stays in sync.
function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const noopSubscribe = () => () => {};
const getIsMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "dark" as Theme);

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) return apply();

    const x = origin?.x ?? window.innerWidth - 40;
    const y = origin?.y ?? 32;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }, []);

  return { theme, toggle };
}

function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: (o?: { x: number; y: number }) => void }) {
  return (
    <button
      type="button"
      onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
      className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.g key="moon" initial={{ rotate: -40, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 40, opacity: 0 }} transition={{ duration: 0.3 }} style={{ originX: "50%", originY: "50%" }}>
              <path d="M16 12.5A6.5 6.5 0 0 1 7.5 4a6.5 6.5 0 1 0 8.5 8.5Z" strokeLinejoin="round" />
            </motion.g>
          ) : (
            <motion.g key="sun" initial={{ rotate: -40, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 40, opacity: 0 }} transition={{ duration: 0.3 }} style={{ originX: "50%", originY: "50%" }}>
              <circle cx="10" cy="10" r="3.25" />
              <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1.1 1.1M14.6 14.6l1.1 1.1M4.3 15.7l1.1-1.1M14.6 5.4l1.1-1.1" strokeLinecap="round" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </button>
  );
}

/* ---------------- Nav ---------------- */

function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

const openPalette = () => window.dispatchEvent(new Event("palette:open"));

export function Nav() {
  const active = useActiveSection();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMac = useSyncExternalStore(noopSubscribe, getIsMac, () => true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || menuOpen ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10" aria-label="Main">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("top");
            }}
            className="group flex items-center gap-3"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-fg font-display text-lg italic leading-none text-bg transition-transform duration-500 group-hover:rotate-[-8deg]">
              dc
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:inline">{person.shortName}</span>
          </a>

          <ul className="hidden items-center gap-1 rounded-full border border-line bg-raised/40 p-1 backdrop-blur md:flex">
            {nav.map((n) => (
              <li key={n.id} className="relative">
                {active === n.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-fg/[0.07]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <a
                  href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(n.id);
                  }}
                  className={`relative block rounded-full px-4 py-1.5 text-sm transition-colors ${active === n.id ? "text-fg" : "text-muted hover:text-fg"}`}
                  aria-current={active === n.id ? "true" : undefined}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              className="hidden h-9 items-center gap-2 rounded-full border border-line px-3 font-mono text-[11px] text-muted transition-colors hover:border-line-strong hover:text-fg sm:flex"
              aria-label="Open command palette"
            >
              <span>{isMac ? "⌘" : "Ctrl"}</span>
              <span>K</span>
            </button>
            <ThemeToggle theme={theme} toggle={toggle} />
            <button
              type="button"
              className="grid size-9 place-items-center rounded-full border border-line md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="relative block h-3 w-4" aria-hidden>
                <span className={`absolute left-0 h-px w-4 bg-fg transition-all duration-300 ${menuOpen ? "top-1.5 rotate-45" : "top-0.5"}`} />
                <span className={`absolute left-0 h-px w-4 bg-fg transition-all duration-300 ${menuOpen ? "top-1.5 -rotate-45" : "top-2.5"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-bg/95 px-6 pt-24 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="space-y-2">
              {nav.map((n, i) => (
                <motion.li key={n.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i, duration: 0.5, ease: EASE }}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(n.id);
                    }}
                    className="flex items-baseline justify-between border-b border-line py-4"
                  >
                    <span className="font-display text-4xl">{n.label}</span>
                    <span className="font-mono text-xs text-faint">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-10 font-mono text-xs text-faint">{person.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- Command palette ---------------- */

type Cmd = { id: string; label: string; hint: string; group: string; run: () => void };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    window.__lenis?.start();
    lastFocus.current?.focus();
  }, []);

  const commands = useMemo<Cmd[]>(
    () => [
      ...nav.map((n) => ({ id: `go-${n.id}`, label: `Go to ${n.label}`, hint: `#${n.id}`, group: "Navigate", run: () => scrollToId(n.id) })),
      {
        id: "copy-email",
        label: "Copy email address",
        hint: person.email,
        group: "Actions",
        run: () => {
          navigator.clipboard?.writeText(person.email);
          setToast("Email copied");
        },
      },
      { id: "email", label: "Send an email", hint: "mailto", group: "Actions", run: () => (window.location.href = `mailto:${person.email}`) },
      { id: "linkedin", label: "Open LinkedIn", hint: "linkedin.com", group: "Actions", run: () => window.open(person.linkedin, "_blank", "noopener") },
      {
        id: "theme",
        label: "Toggle theme",
        hint: "light / dark",
        group: "Actions",
        run: () => (document.querySelector('[aria-label^="Switch to"]') as HTMLButtonElement | null)?.click(),
      },
      ...projects.map((p) => ({ id: `p-${p.slug}`, label: `Visit ${p.name}`, hint: p.urlLabel, group: "Projects", run: () => window.open(p.url, "_blank", "noopener") })),
    ],
    [],
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? commands.filter((c) => `${c.label} ${c.hint} ${c.group}`.toLowerCase().includes(s)) : commands;
  }, [q, commands]);

  const show = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement;
    setQ("");
    setIdx(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (document.querySelector('[aria-label="Command palette"]')) close();
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, [show, close]);

  useEffect(() => {
    if (open) {
      window.__lenis?.stop();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const run = (c: Cmd) => {
    close();
    setTimeout(c.run, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter" && filtered[idx]) run(filtered[idx]);
    else if (e.key === "Tab") e.preventDefault();
  };

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <div className="absolute inset-0 bg-bg/60 backdrop-blur-sm" onClick={close} aria-hidden />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              className="hairline relative w-full max-w-lg overflow-hidden rounded-2xl"
              style={{ boxShadow: "var(--shadow-card)" }}
              initial={reduce ? false : { opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              onKeyDown={onKeyDown}
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <span className="font-mono text-sm text-accent" aria-hidden>›</span>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setIdx(0);
                  }}
                  placeholder="Type a command or search…"
                  className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-faint focus-visible:outline-none"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[idx] ? `cmd-${filtered[idx].id}` : undefined}
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">esc</kbd>
              </div>
              <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
                {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-faint">No results for “{q}”</li>}
                {filtered.map((c, i) => {
                  const header = c.group !== lastGroup ? (lastGroup = c.group) : null;
                  return (
                    <li key={c.id} role="presentation">
                      {header && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{header}</p>}
                      <button
                        id={`cmd-${c.id}`}
                        role="option"
                        aria-selected={i === idx}
                        onMouseMove={() => setIdx(i)}
                        onClick={() => run(c)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${i === idx ? "bg-fg/[0.06] text-fg" : "text-muted"}`}
                      >
                        <span>{c.label}</span>
                        <span className="truncate pl-4 font-mono text-[11px] text-faint">{c.hint}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] text-faint">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span className="ml-auto">⌘K / Ctrl K</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toast message={toast} />
    </>
  );
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            className="rounded-full bg-fg px-4 py-2 font-mono text-xs text-bg"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
