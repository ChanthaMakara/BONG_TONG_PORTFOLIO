import React, { useEffect, useRef, useState } from 'react';
import { motion, MotionValue, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion';
import { PlayIcon } from 'lucide-react';
import { ProjectMedia } from './ProjectMedia';

const SPEED = 0.22; // cards per second (endless rotation)
const HOVER_SLOWDOWN = 0.25; // slows (does not stop) while the mouse is over the ring, so cards are easy to click
const TILT = 46;
const DEPTH = 190;
const VISIBLE = 3;

const offsetOf = (i: number, p: number, n: number) => {
  let o = (((i - p) % n) + n) % n;
  if (o > n / 2) o -= n;
  return o;
};
const clamp = (v: number) => Math.max(-4, Math.min(4, v));

type Props = { projects: any[]; onSelect: (index: number) => void; paused?: boolean };

export function CoverflowCarousel({ projects, onSelect, paused = false }: Props) {
  const reduce = useReducedMotion();
  const n = projects.length;
  const pos = useMotionValue(0);
  const vel = useRef(SPEED);
  const dragging = useRef(false);
  const hover = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1200);
  const [active, setActive] = useState(0);

  const cardW = Math.round(Math.min(w * 0.6, 380));
  const cardH = Math.round(cardW * 1.22);
  const spacing = cardW * 0.6;

  const spacingRef = useRef(spacing);
  spacingRef.current = spacing;
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(pos, 'change', (p) => {
    const a = ((Math.round(p) % n) + n) % n;
    setActive((prev) => (prev === a ? prev : a));
  });

  // endless rotation loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (!dragging.current) {
        const base = paused || reduce ? 0 : hover.current ? SPEED * HOVER_SLOWDOWN : SPEED;
        vel.current += (base - vel.current) * Math.min(1, dt * 2.5);
        pos.set(pos.get() + vel.current * dt);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, reduce, pos]);

  // pointer handling: drag to spin, tap/click a card to open it
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    type S = { idx: number | null; dist: number; drag: boolean; lx: number; lt: number; v: number };
    let s: S | null = null;

    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const c = (e.target as Element).closest('[data-index]');
      s = { idx: c ? Number(c.getAttribute('data-index')) : null, dist: 0, drag: false, lx: e.clientX, lt: e.timeStamp, v: 0 };
    };
    const move = (e: PointerEvent) => {
      if (!s) return;
      const dx = e.clientX - s.lx;
      s.dist += Math.abs(dx);
      if (!s.drag && s.dist > 8) {
        s.drag = true;
        dragging.current = true;
        el.style.cursor = 'grabbing';
      }
      if (s.drag) {
        pos.set(pos.get() - dx / spacingRef.current);
        const dt = Math.max(1, e.timeStamp - s.lt);
        s.v = s.v * 0.6 + ((dx / dt) * 1000) * 0.4;
      }
      s.lx = e.clientX;
      s.lt = e.timeStamp;
    };
    const up = () => {
      if (!s) return;
      if (s.drag) {
        vel.current = clamp(-s.v / spacingRef.current);
        dragging.current = false;
      } else if (s.idx !== null) {
        selectRef.current(s.idx);
      }
      s = null;
      el.style.cursor = '';
    };
    const cancel = () => {
      dragging.current = false;
      s = null;
      el.style.cursor = '';
    };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
  }, [pos]);

  const current = projects[active];

  return (
    <div className="relative">
      {/* ambient light: amber + teal glows the glass sits in front of */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[30%] top-[45%] h-[55%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[70%] top-[50%] h-[55%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[22%] left-1/2 h-24 w-[60%] -translate-x-1/2 rounded-[50%] bg-ink/10 blur-3xl"
      />

      <div
        ref={stage}
        onMouseEnter={() => (hover.current = true)}
        onMouseLeave={() => (hover.current = false)}
        onWheel={(e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) vel.current = clamp(vel.current + (e.deltaX / spacing) * 0.4);
        }}
        onDragStart={(e) => e.preventDefault()}
        className="relative cursor-grab select-none"
        style={{ height: cardH + 90, perspective: 1800, touchAction: 'pan-y' }}>
        {projects.map((p, i) => (
          <Card key={p.id} project={p} i={i} n={n} pos={pos} spacing={spacing} cardW={cardW} cardH={cardH} onKey={() => onSelect(i)} />
        ))}
      </div>

      {/* glass caption of the card in front */}
      <div className="relative mx-auto mt-4 max-w-xl px-5 text-center" aria-live="polite">
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-ink/10 bg-bg/40 px-6 py-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent"
          />
          <h3 className="mt-3 font-display text-2xl font-medium tracking-[-0.03em] md:text-4xl">{current.title}</h3>
          <p className="mt-1 text-[13px] text-muted">{current.role}</p>
        </motion.div>

        {/* position dots (indicator only) */}
        <div className="mt-5 flex items-center justify-center gap-1.5" aria-hidden>
          {projects.map((p, i) => (
            <span
              key={p.id}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? 'w-6 bg-gradient-to-r from-amber-500 to-teal-500' : 'w-1.5 bg-ink/20'
              }`}
            />
          ))}
        </div>

        <p className="mx-auto mt-5 inline-flex rounded-full border border-ink/10 bg-bg/40 px-4 py-1.5 text-[12px] text-muted backdrop-blur-xl">
          Drag to spin. Select a card to watch.
        </p>
      </div>
    </div>
  );
}

function Card({ project, i, n, pos, spacing, cardW, cardH, onKey }: any) {
  const p$ = pos as MotionValue<number>;
  const transform = useTransform(p$, (p) => {
    const o = offsetOf(i, p, n);
    const a = Math.abs(o);
    const x = Math.sign(o) * (Math.min(a, 1) * spacing * 1.05 + Math.max(0, a - 1) * spacing * 0.55);
    const ry = Math.max(-62, Math.min(62, -o * TILT));
    const z = -Math.min(a, VISIBLE) * DEPTH + (a < 1 ? (1 - a) * 80 : 0);
    const s = Math.max(0.62, 1.04 - a * 0.13);
    return `translate3d(${x}px,0,${z}px) rotateY(${ry}deg) scale(${s})`;
  });
  const opacity = useTransform(p$, (p) => {
    const a = Math.abs(offsetOf(i, p, n));
    return a >= VISIBLE ? 0 : Math.max(0, 1 - a * 0.28);
  });
  const pointerEvents = useTransform(p$, (p) => (Math.abs(offsetOf(i, p, n)) >= VISIBLE - 0.2 ? 'none' : 'auto'));
  const zIndex = useTransform(p$, (p) => 100 - Math.round(Math.abs(offsetOf(i, p, n)) * 10));
  const shade = useTransform(p$, (p) => Math.min(0.55, Math.abs(offsetOf(i, p, n)) * 0.3)); // dims side cards
  const cover: string | undefined = project.cover ?? project.image ?? project.images?.[0];
  const focus = useTransform(p$, (p) => Math.max(0, 1 - Math.abs(offsetOf(i, p, n)) * 1.5)); // 1 when in front

  return (
    <motion.div
      data-index={i}
      role="button"
      tabIndex={0}
      aria-label={`Watch ${project.title}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onKey())}
      className="group absolute left-1/2 top-[40px] cursor-pointer overflow-hidden rounded-[28px] bg-[#0b1020] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      style={{
        width: cardW,
        height: cardH,
        marginLeft: -cardW / 2,
        transform,
        opacity,
        zIndex,
        pointerEvents: pointerEvents as any,
        willChange: 'transform, opacity',
        WebkitBoxReflect: 'below 8px linear-gradient(transparent 72%, rgba(255,255,255,0.16))',
      }}>
      <div className="pointer-events-none absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
        {cover ? (
          <img src={cover} alt={project.title} draggable={false} className="h-full w-full object-cover" />
        ) : (
          <ProjectMedia project={project} mode="card" />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" aria-hidden />
      <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shade }} aria-hidden />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/20 via-transparent to-transparent" aria-hidden />

      {/* glass edge: brightens on the front card */}
      <motion.div
        aria-hidden
        style={{ opacity: focus }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_0_40px_rgba(255,255,255,0.06)]"
      />

      {/* glass category chip (front card only) */}
      <motion.span
        style={{ opacity: focus }}
        className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
        {project.category}
      </motion.span>

      {/* glass play button */}
      <motion.div style={{ opacity: focus }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-16 w-16 items-center justify-center text-white">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-white/30 bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform duration-300 group-hover:scale-110"
          />
          <PlayIcon size={22} fill="currentColor" strokeWidth={0} className="relative ml-0.5" />
        </span>
      </motion.div>
    </motion.div>
  );
}