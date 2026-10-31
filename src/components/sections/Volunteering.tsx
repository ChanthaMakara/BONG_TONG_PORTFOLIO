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
import { volunteering } from '../../data/education';
import { EASE_OUT } from '../../utils/motion';
import { FadeIn } from '../motion/FadeIn';
import { RevealText } from '../motion/RevealText';
import { SectionLabel } from '../ui/SectionLabel';

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
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, rgba(245,158,11,0.18), transparent 65%)`;

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
      whileHover={reduce ? undefined : { y: -5 }}
      onMouseMove={onMove}
      className={`group relative h-full overflow-hidden rounded-3xl border border-ink/10 bg-bg/40 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] backdrop-blur-2xl ${className}`}
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

/* ---------- Section ---------- */
export function Volunteering() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  // orb parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y1 = useTransform(smooth, [0, 1], [-100, 140]);
  const y2 = useTransform(smooth, [0, 1], [120, -140]);

  // timeline line draws as the list scrolls into view
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ['start 85%', 'end 60%'],
  });
  const lineProgress = useSpring(listProgress, { stiffness: 90, damping: 24 });

  return (
    <section
      id="volunteering"
      ref={sectionRef}
      className="relative overflow-hidden bg-navy py-24 md:py-36"
      aria-labelledby="volunteering-title"
    >
      {/* ambient orbs */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y1 }}
        className="pointer-events-none absolute -right-32 top-10 h-[440px] w-[440px] rounded-full bg-teal-500/20 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y2 }}
        className="pointer-events-none absolute -left-32 bottom-10 h-[460px] w-[460px] rounded-full bg-amber-500/25 blur-[130px]"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-violet-500/15 blur-[110px]"
        />
      )}

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        {/* heading */}
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel>Volunteering experience</SectionLabel>
            <h2 id="volunteering-title" className="sr-only">
              Volunteering experience: behind the scenes
            </h2>
            <RevealText
              as="p"
              text="Behind the scenes"
              className="mt-5 block bg-gradient-to-r from-ink via-amber-500 to-teal-500 bg-clip-text font-display text-[clamp(2.6rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.045em] text-transparent"
            />
          </div>
          <FadeIn delay={0.1} className="md:col-span-4 md:col-start-9">
            <p className="max-w-sm rounded-2xl border border-ink/10 bg-bg/40 p-5 text-[15px] leading-relaxed text-muted backdrop-blur-xl md:text-base">
              Festivals, ceremonies and community programs — giving time to the film community since 2022.
            </p>
          </FadeIn>
        </div>

        {/* timeline */}
        <div className="relative mt-16 md:mt-24">
          {/* desktop: horizontal track + animated fill */}
          <span
            aria-hidden
            className="absolute left-0 right-0 top-[7px] hidden h-px bg-ink/15 md:block"
          />
          <motion.span
            aria-hidden
            style={{ scaleX: reduce ? 1 : lineProgress, originX: 0 }}
            className="absolute left-0 right-0 top-[6px] hidden h-[3px] rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-teal-500 md:block"
          />

          <ol
            ref={listRef}
            className="relative grid gap-5 pl-8 md:grid-cols-4 md:gap-6 md:pl-0 md:pt-12"
          >
            {/* mobile: vertical track + animated fill */}
            <span
              aria-hidden
              className="absolute bottom-0 left-[7px] top-0 w-px bg-ink/15 md:hidden"
            />
            <motion.span
              aria-hidden
              style={{ scaleY: reduce ? 1 : lineProgress, originY: 0 }}
              className="absolute bottom-0 left-[6px] top-0 w-[3px] rounded-full bg-gradient-to-b from-amber-500 via-orange-400 to-teal-500 md:hidden"
            />

            {volunteering.map((v, i) => (
              <li key={`${v.date}-${v.title}`} className="relative">
                {/* dot: left on mobile, above the card on desktop */}
                <motion.span
                  aria-hidden
                  initial={reduce ? false : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 + i * 0.05 }}
                  className="absolute -left-8 top-7 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-amber-500/60 bg-navy md:-top-12 md:left-0"
                >
                  <span className="h-[5px] w-[5px] rounded-full bg-amber-500" />
                </motion.span>

                <GlassCard delay={0.08 + i * 0.07} className="p-6">
                  <p className="inline-flex rounded-full border border-ink/10 bg-ink/5 px-3 py-1 text-xs tabular-nums text-muted backdrop-blur-md">
                    {v.date}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-medium leading-tight tracking-[-0.02em]">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-snug text-muted">{v.detail}</p>
                </GlassCard>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}