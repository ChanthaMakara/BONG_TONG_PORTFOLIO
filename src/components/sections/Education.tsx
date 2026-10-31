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
import { GraduationCapIcon } from 'lucide-react';
import { degree, training } from '../../data/education';
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

/* ---------- Section ---------- */
export function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  // orb parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y1 = useTransform(smooth, [0, 1], [-100, 140]);
  const y2 = useTransform(smooth, [0, 1], [120, -140]);

  // timeline line draws as you scroll through the list
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ['start 75%', 'end 60%'],
  });
  const lineScale = useSpring(listProgress, { stiffness: 90, damping: 24 });

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative overflow-hidden bg-bg py-24 md:py-40"
      aria-labelledby="education-title"
    >
      {/* ambient orbs */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y1 }}
        className="pointer-events-none absolute -left-32 top-16 h-[440px] w-[440px] rounded-full bg-teal-500/20 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y2 }}
        className="pointer-events-none absolute -right-32 bottom-16 h-[460px] w-[460px] rounded-full bg-amber-500/25 blur-[130px]"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] rounded-full bg-violet-500/15 blur-[110px]"
        />
      )}

      <div className="relative mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        {/* ---------- Left: degree ---------- */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionLabel>Education & training</SectionLabel>
            <h2 id="education-title" className="sr-only">
              Education and training
            </h2>

            <GlassCard className="mt-8 p-6 md:p-10">
              <div
                className="font-display font-medium leading-[0.85] tracking-[-0.06em]"
                aria-hidden
              >
                <RevealText text={degree.start} className="block text-[clamp(4rem,9vw,8.5rem)]" />
                <RevealText
                  text={degree.end}
                  delay={0.08}
                  className="block pl-[0.6em] text-[clamp(4rem,9vw,8.5rem)] text-outline"
                />
              </div>

              <div className="mt-10 flex items-start gap-4 border-t border-ink/10 pt-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-ink/5 text-amber-500 backdrop-blur-md">
                  <GraduationCapIcon size={20} />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-[-0.02em] md:text-3xl">
                    {degree.title}
                  </h3>
                  <p className="mt-2 text-muted">
                    {degree.school} · {degree.period}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ---------- Right: training timeline ---------- */}
        <div className="lg:col-span-6 lg:col-start-7">
          <FadeIn>
            <h3 className="font-display text-xl font-medium tracking-tight">Training & workshops</h3>
          </FadeIn>

          <ul ref={listRef} className="relative mt-8 space-y-4 pl-8 md:pl-10">
            {/* track */}
            <span
              aria-hidden
              className="absolute bottom-0 left-[7px] top-0 w-px bg-ink/10"
            />
            {/* animated fill */}
            <motion.span
              aria-hidden
              style={{ scaleY: reduce ? 1 : lineScale, originY: 0 }}
              className="absolute bottom-0 left-[6px] top-0 w-[3px] rounded-full bg-gradient-to-b from-amber-500 via-orange-400 to-teal-500"
            />

            {training.map((t, i) => (
              <li key={`${t.date}-${t.title}`} className="relative">
                {/* dot */}
                <motion.span
                  aria-hidden
                  initial={reduce ? false : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
                  className="absolute -left-8 top-7 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-amber-500/60 bg-bg md:-left-10"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                </motion.span>

                <GlassCard delay={i * 0.05} className="p-5 md:p-6">
                  <div className="grid grid-cols-[6rem_1fr] gap-4 md:grid-cols-[8rem_1fr]">
                    <span className="pt-0.5 text-sm tabular-nums text-muted">{t.date}</span>
                    <div>
                      <p className="text-base font-semibold leading-snug md:text-lg">{t.title}</p>
                      {t.detail && <p className="mt-1 text-sm text-muted">{t.detail}</p>}
                    </div>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}