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
import { skills } from '../../data/education';
import { FadeIn } from '../motion/FadeIn';
import { EASE_OUT } from '../../utils/motion';

const TIER_LEVEL: Record<string, number> = {
  Core: 0.95,
  Supporting: 0.7,
  Developing: 0.45,
};

/* ---------- One glass row ---------- */
function SkillRow({ name, tier, index }: { name: string; tier: string; index: number }) {
  const reduce = useReducedMotion();
  const isCore = tier === 'Core';
  const level = TIER_LEVEL[tier] ?? 0.5;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(245,158,11,0.20), transparent 65%)`;

  const onMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 56, filter: 'blur(12px)' },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: EASE_OUT,
        delay: i * 0.08,
        staggerChildren: 0.03,
        delayChildren: i * 0.08 + 0.1,
      },
    }),
  };

  const letterVariants = {
    hidden: { y: '115%', rotate: 8 },
    show: { y: '0%', rotate: 0, transition: { duration: 0.7, ease: EASE_OUT } },
  };

  return (
    <motion.li
      custom={index}
      variants={rowVariants}
      initial={reduce ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onMouseMove={onMove}
      className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-bg/40 p-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-8"
    >
      {/* top glass highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent"
      />

      {/* mouse-follow spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      {/* shine sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-ink/10 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[120%] group-hover:opacity-100"
      />

      <div className="relative flex items-center justify-between gap-4 md:gap-8">
        <div className="flex min-w-0 items-baseline gap-4 md:gap-8">
          <span className="font-mono text-xs text-ink/40 md:text-sm">
            {String(index + 1).padStart(2, '0')}
          </span>

          <h3
            aria-label={name}
            className={`flex flex-wrap overflow-hidden pb-[0.08em] font-display font-medium leading-[1.05] tracking-[-0.04em] transition-colors duration-500 text-[clamp(2rem,6.5vw,6rem)] ${
              isCore ? 'text-ink' : 'text-ink/40 group-hover:text-ink'
            }`}
          >
            {name.split('').map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span variants={letterVariants} className="inline-block" aria-hidden>
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              </span>
            ))}
          </h3>
        </div>

        {/* tier pill */}
        <span
          className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md ${
            isCore
              ? 'border-transparent bg-ink text-bg'
              : 'border-ink/20 bg-ink/5 text-ink/80'
          }`}
        >
          {tier === 'Developing' && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
          )}
          {tier}
        </span>
      </div>

      {/* animated level bar */}
      <div className="relative mt-5 h-[3px] w-full overflow-hidden rounded-full bg-ink/10 md:mt-7">
        <motion.div
          variants={{
            hidden: { scaleX: 0 },
            show: {
              scaleX: level,
              transition: { duration: 1.4, ease: EASE_OUT, delay: index * 0.08 + 0.3 },
            },
          }}
          style={{ originX: 0 }}
          className="h-full w-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-teal-500"
        />
      </div>
    </motion.li>
  );
}

/* ---------- Section ---------- */
export function Craft() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y1 = useTransform(smooth, [0, 1], [-120, 160]);
  const y2 = useTransform(smooth, [0, 1], [140, -160]);

  return (
    <section
      id="craft"
      ref={ref}
      aria-labelledby="craft-title"
      className="relative overflow-hidden bg-bg py-24 text-ink md:py-40"
    >
      {/* ambient glow orbs: these are what the glass blurs over */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y1 }}
        className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-amber-500/25 blur-[120px]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y2 }}
        className="pointer-events-none absolute -right-32 bottom-10 h-[480px] w-[480px] rounded-full bg-teal-500/20 blur-[130px]"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-[110px]"
        />
      )}

      {/* subtle grid (neutral gray works in both themes) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(128,128,128,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <FadeIn>
              <p className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-bg/40 px-4 py-1.5 text-sm font-medium text-ink/70 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
                Cinematography & lighting skills
              </p>
            </FadeIn>
            <h2
              id="craft-title"
              className="mt-6 bg-gradient-to-r from-ink via-amber-500 to-teal-500 bg-[length:200%_100%] bg-clip-text font-display text-4xl font-medium tracking-[-0.03em] text-transparent md:text-6xl"
              style={reduce ? undefined : { animation: 'craft-shimmer 6s linear infinite' }}
            >
              The craft
            </h2>
          </div>

        </div>

        <ul className="mt-14 space-y-4 md:mt-20 md:space-y-5">
          {skills.map((skill, i) => (
            <SkillRow key={skill.name} name={skill.name} tier={skill.tier} index={i} />
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes craft-shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  );
}