import React, { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { experience } from '../../data/experience';
import { FadeIn } from '../motion/FadeIn';
import { RevealText } from '../motion/RevealText';
import { SectionLabel } from '../ui/SectionLabel';
import { EASE_OUT } from '../../utils/motion';
import { BehindTheScenes } from './BehindTheScenes';

/* ---------- Reusable glass card with mouse-follow spotlight + optional video ---------- */
function GlassCard({
  children,
  className = '',
  delay = 0,
  video,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  video?: string;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(cardRef, { amount: 0.3 });

  // play the background video only while the card is on screen
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}px ${my}px, rgba(245,158,11,0.18), transparent 65%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <motion.div
      ref={cardRef}
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

      {/* background video */}
      {video && !reduce && (
        <>
          <video
            ref={videoRef}
            aria-hidden
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-50"
          />
          {/* keeps text readable */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/40 to-transparent"
          />
        </>
      )}

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

/* ---------- Section ---------- */
export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y1 = useTransform(smooth, [0, 1], [-100, 140]);
  const y2 = useTransform(smooth, [0, 1], [120, -140]);

  return (
    <section
      id="experience"
      ref={ref}
      className="relative overflow-hidden bg-bg py-24 md:py-40"
      aria-labelledby="experience-title"
    >
      {/* ambient orbs */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y1 }}
        className="pointer-events-none absolute -right-32 top-16 h-[440px] w-[440px] rounded-full bg-amber-500/25 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y2 }}
        className="pointer-events-none absolute -left-32 bottom-16 h-[460px] w-[460px] rounded-full bg-teal-500/20 blur-[130px]"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-violet-500/15 blur-[110px]"
        />
      )}

      <div className="relative mx-auto grid max-w-[1600px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        {/* ---------- Left: sticky intro ---------- */}
        <div className="self-start lg:sticky lg:top-32 lg:col-span-4">
          <SectionLabel>Professional experience</SectionLabel>
          <h2 id="experience-title" className="sr-only">
            Professional experience
          </h2>
          <RevealText
            as="p"
            text="On set"
            className="mt-5 block bg-gradient-to-r from-ink via-amber-500 to-teal-500 bg-clip-text font-display text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.045em] text-transparent"
          />
          <FadeIn delay={0.1}>
            <p className="mt-6 max-w-sm rounded-2xl border border-ink/10 bg-bg/40 p-5 text-[15px] leading-relaxed text-muted backdrop-blur-xl md:text-base">
              From film school commercials to production houses — leading camera as Director of Photography since 2023.
            </p>
          </FadeIn>
        </div>

        {/* ---------- Right: grouped experience ---------- */}
        <ol className="space-y-12 lg:col-span-8">
          {experience.map((group) => (
            <li key={group.period} className="grid grid-cols-1 gap-5 sm:grid-cols-[9rem_1fr]">
              <FadeIn>
                <p className="inline-flex rounded-full border border-ink/10 bg-bg/40 px-4 py-2 font-display text-2xl font-medium tracking-[-0.03em] text-ink/80 backdrop-blur-xl sm:sticky sm:top-32 md:text-3xl">
                  {group.period}
                </p>
              </FadeIn>

              <ul className="space-y-4">
                {group.items.map((item, i) => {
                  const isDoP = item.role === 'Director of Photography';
                  return (
                    <li key={item.title}>
                      <GlassCard delay={i * 0.06} className="p-6 md:p-8" video={item.video}>
                        <h3 className="font-display text-2xl font-medium leading-tight tracking-[-0.02em] md:text-[2rem]">
                          {item.title}
                        </h3>
                        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium backdrop-blur-md ${
                              isDoP
                                ? 'bg-ink text-bg'
                                : 'border border-ink/20 bg-ink/5 text-ink'
                            }`}
                          >
                            {isDoP && (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
                            )}
                            {item.role}
                          </span>
                          {item.detail && <span className="text-muted">{item.detail}</span>}
                        </p>
                      </GlassCard>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
      <BehindTheScenes />
    </section>
  );
}