import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { degree } from '../../data/education';
import { EASE_OUT } from '../../utils/motion';
import { PillButton } from '../ui/PillButton';
import { HeroBackdrop } from './HeroBackdrop';
import { ProfilePortrait } from './ProfilePortrait';

const meta = [
  { label: 'Based in', value: profile.location },
  { label: 'Focus', value: 'TV commercials & short films' },
  { label: 'Education', value: `${degree.school}, ${degree.period}` },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const nameX = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -100]);

  return (
    <section id="top" ref={ref} className="relative w-full overflow-hidden bg-bg">
      <HeroBackdrop y={bgY} />

      {/* ambient orbs */}
      <motion.div
        aria-hidden
        style={{ y: orbY1 }}
        className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-amber-500/20 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={{ y: orbY2 }}
        className="pointer-events-none absolute -right-32 bottom-20 h-[460px] w-[460px] rounded-full bg-teal-500/15 blur-[130px]"
      />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-5 pb-10 pt-24 md:px-10 md:pt-32"
      >
        {/* Top pills - desktop only */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
          className="mb-6 hidden items-center justify-between text-xs text-muted md:flex"
        >
          <span className="rounded-full border border-ink/10 bg-bg/40 px-4 py-2 backdrop-blur-xl">
            Portfolio — {new Date().getFullYear()}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-bg/40 px-4 py-2 backdrop-blur-xl">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            Director of Photography · TV, drama & feature film
          </span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={reduce ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
          className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-ink/10 bg-bg/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-silver backdrop-blur-xl md:mb-8 md:text-xs"
        >
          <span className="h-px w-8 bg-silver/70" aria-hidden />
          {profile.title}
        </motion.p>

        {/* Name + Portrait Area */}
        <div className="relative flex flex-1 flex-col justify-center py-6 md:py-10">
          
          {/* Portrait */}
          <div className="relative z-20 mb-6 ml-auto w-[55%] max-w-[280px] sm:w-[48%] md:absolute md:right-[2%] md:top-1/2 md:mb-0 md:w-[clamp(240px,26vw,360px)] md:max-w-none md:-translate-y-1/2 lg:right-[4%]">
            <motion.div style={{ y: portraitY }}>
              <div className="relative rounded-[26px] border border-ink/10 bg-bg/30 p-1.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-2xl md:rounded-[32px] md:p-2">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-0 z-30 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
                <div className="relative overflow-hidden rounded-[20px] md:rounded-[26px]">
                  <ProfilePortrait className="aspect-[4/5] w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-[#0b1020]/10 mix-blend-multiply" />
                  <ViewfinderCorners />

                  {/* DoP chip */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full border border-white/25 bg-black/35 px-3.5 py-2 text-[10px] font-medium text-white backdrop-blur-xl md:bottom-4 md:left-4 md:right-4 md:text-[11px]">
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        {!reduce && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                        )}
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                      </span>
                      DoP
                    </span>
                    <span className="text-white/75">Phnom Penh</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* NAME - higher z-index so it stays visible */}
          <motion.h1
            style={{ x: nameX }}
            aria-label={`${profile.firstName} ${profile.lastName}`}
            className="relative z-30 font-display text-[clamp(3.1rem,13vw,13rem)] font-medium uppercase leading-[0.86] tracking-[-0.045em]"
          >
            <SplitLine text={profile.firstName} delay={0.15} />
            <SplitLine text={profile.lastName} delay={0.28} className="md:pl-[4vw]" />
          </motion.h1>
        </div>

        {/* Bottom content */}
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.55 }}
            className="md:col-span-7 lg:col-span-5"
          >
            <p className="max-w-md font-display text-[1.25rem] leading-[1.3] tracking-[-0.01em] text-ink md:text-[1.55rem]">
              {profile.headline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PillButton href="#work" icon={<ArrowDownRightIcon size={15} />}>
                Explore My Work
              </PillButton>
              <PillButton href="#contact" variant="glass" icon={<ArrowUpRightIcon size={15} />}>
                Get in Touch
              </PillButton>
            </div>
          </motion.div>

          {/* Meta tiles - desktop only */}
          <motion.dl
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } } }}
            className="hidden gap-3 md:col-span-5 md:grid md:grid-cols-3 lg:col-span-5 lg:col-start-8"
          >
            {meta.map((m) => (
              <motion.div
                key={m.label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                }}
                className="rounded-2xl border border-ink/10 bg-bg/40 p-4 backdrop-blur-xl"
              >
                <dt className="text-[11px] text-muted">{m.label}</dt>
                <dd className="mt-1 text-[13px] font-medium leading-snug text-ink">{m.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  );
}

function SplitLine({ text, delay, className = '' }: { text: string; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block overflow-hidden pb-[0.04em] ${className}`}>
      <motion.span
        className="inline-block"
        initial={reduce ? false : 'hidden'}
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: delay } } }}
      >
        {text.split('').map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 0.7, ease: EASE_OUT } },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
}

function ViewfinderCorners() {
  const corner = 'absolute h-4 w-4 border-white/75';
  return (
    <div className="pointer-events-none absolute inset-3 md:inset-4" aria-hidden>
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-12 left-0 border-b border-l`} />
      <span className={`${corner} bottom-12 right-0 border-b border-r`} />
    </div>
  );
}