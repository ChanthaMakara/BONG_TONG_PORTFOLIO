import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { profile } from '../../data/profile';
import { FadeIn } from '../motion/FadeIn';
import { RevealText } from '../motion/RevealText';
import { SectionLabel } from '../ui/SectionLabel';
import { EASE_OUT } from '../../utils/motion';

/* ---------- Reusable glass card with mouse-follow spotlight ---------- */
function GlassCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, rgba(245,158,11,0.18), transparent 65%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      whileHover={reduce ? undefined : { y: -4 }}
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-3xl border border-ink/10 bg-bg/40 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-ink/10 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[120%] group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/* Map a language level label to a bar width */
function levelToWidth(level: string): number {
  const l = level.toLowerCase();
  if (/(native|mother)/.test(l)) return 1;
  if (/(fluent|advanced|proficient)/.test(l)) return 0.85;
  if (/(intermediate|good|conversational)/.test(l)) return 0.6;
  if (/(basic|beginner|elementary)/.test(l)) return 0.35;
  return 0.7;
}

export function About() {
  const [lead, ...rest] = profile.bio;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y1 = useTransform(smooth, [0, 1], [-100, 140]);
  const y2 = useTransform(smooth, [0, 1], [120, -140]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden bg-navy py-24 md:py-40"
      aria-labelledby="about-title"
    >
      {/* ambient orbs for the glass to blur over */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y1 }}
        className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-amber-500/25 blur-[120px]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y2 }}
        className="pointer-events-none absolute -left-32 bottom-20 h-[460px] w-[460px] rounded-full bg-teal-500/20 blur-[130px]"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/3 top-1/2 h-[280px] w-[280px] rounded-full bg-violet-500/15 blur-[110px]"
        />
      )}

      <div className="relative mx-auto grid max-w-[1600px] gap-y-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-x-10">
        {/* ---------- Left: identity card ---------- */}
        <div className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <GlassCard className="p-6 md:p-7">
              <SectionLabel>About me</SectionLabel>
              <h2
                id="about-title"
                className="mt-5 bg-gradient-to-r from-ink via-amber-500 to-teal-500 bg-[length:200%_100%] bg-clip-text font-display text-3xl font-medium tracking-tight text-transparent"
                style={reduce ? undefined : { animation: 'about-shimmer 6s linear infinite' }}
              >
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="mt-2 text-sm text-muted">{profile.title}</p>

              <div className="mt-6 flex items-center gap-2 rounded-full border border-ink/10 bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink/80 backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Open to new projects
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ---------- Right: content ---------- */}
        <div className="lg:col-span-9">
          <RevealText
            as="p"
            text={lead}
            stagger={0.018}
            className="block font-display text-[clamp(1.9rem,4.2vw,4rem)] font-normal leading-[1.08] tracking-[-0.025em]"
          />

          {/* bio paragraphs */}
          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
            {rest.map((p, i) => (
              <GlassCard key={p} delay={i * 0.1} className="p-6 md:p-8">
                <p className="text-base leading-relaxed text-muted md:text-lg">{p}</p>
              </GlassCard>
            ))}
          </div>

          {/* stats row */}
          <div className="mt-5 grid gap-5 md:grid-cols-[1.5fr_1fr_1fr]">
            {/* experience */}
            <GlassCard className="p-6 md:p-8" delay={0.05}>
              <p className="bg-gradient-to-br from-ink via-amber-500 to-orange-500 bg-clip-text font-display text-7xl font-medium leading-none tracking-[-0.05em] text-transparent md:text-8xl">
                3
                <span className="ml-2 text-3xl text-muted md:text-4xl [-webkit-text-fill-color:currentColor]">
                  yrs
                </span>
              </p>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                As Director of Photography for TV shows, dramas and feature films.
              </p>
            </GlassCard>

            {/* languages */}
            <GlassCard className="p-6 md:p-8" delay={0.15}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Languages</p>
              <ul className="mt-4 space-y-4">
                {profile.languages.map((l, i) => (
                  <li key={l.name}>
                    <div className="flex items-baseline justify-between gap-4 text-sm">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-muted">{l.level}</span>
                    </div>
                    <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
                      <motion.div
                        initial={reduce ? false : { scaleX: 0 }}
                        whileInView={{ scaleX: levelToWidth(l.level) }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.3 + i * 0.12 }}
                        style={{ originX: 0 }}
                        className="h-full w-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-teal-500"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* interests */}
            <GlassCard className="p-6 md:p-8" delay={0.25}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Interests</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {profile.interests.map((i, idx) => (
                  <motion.li
                    key={i}
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.4 + idx * 0.06 }}
                    whileHover={reduce ? undefined : { y: -3, scale: 1.05 }}
                    className="cursor-default rounded-full border border-ink/15 bg-ink/5 px-3 py-1.5 text-[13px] backdrop-blur-md transition-colors hover:border-amber-500/50 hover:bg-amber-500/10"
                  >
                    {i}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes about-shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  );
}