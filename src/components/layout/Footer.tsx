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
import { ArrowUpIcon } from 'lucide-react';
import { navLinks } from '../../data/navigation';
import { profile } from '../../data/profile';
import { FadeIn } from '../motion/FadeIn';
import { EASE_OUT } from '../../utils/motion';

/* ---------- Small glass panel with mouse-follow spotlight ---------- */
function GlassPanel({
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
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, rgba(245,158,11,0.16), transparent 65%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
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
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y1 = useTransform(smooth, [0, 1], [-80, 60]);
  const y2 = useTransform(smooth, [0, 1], [80, -40]);
  const wordY = useTransform(smooth, [0, 1], [40, 0]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-ink/10 bg-bg pt-16">
      {/* ambient orbs */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y1 }}
        className="pointer-events-none absolute -left-32 top-0 h-[380px] w-[380px] rounded-full bg-amber-500/20 blur-[120px]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y2 }}
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-teal-500/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-5 md:grid-cols-12">
          {/* identity */}
          <GlassPanel className="p-6 md:col-span-4 md:p-7">
            <p className="font-display text-xl font-medium tracking-tight">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="mt-1 text-sm text-muted">
              {profile.title} · {profile.location}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink/80 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                {!reduce && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Available for new projects
            </div>
          </GlassPanel>

          {/* links */}
          <GlassPanel delay={0.08} className="p-6 md:col-span-5 md:p-7">
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-2 text-sm">
                {navLinks.map((l) => (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      className="inline-flex rounded-full border border-ink/10 bg-ink/5 px-4 py-2 text-muted backdrop-blur-md transition-[color,border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </GlassPanel>

          {/* back to top */}
          <FadeIn delay={0.16} className="flex md:col-span-3 md:items-stretch md:justify-end">
            <a
              href="#top"
              className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-3xl border border-ink/10 bg-bg/40 p-6 text-sm shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-amber-500/50 md:p-7"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent"
              />
              <span className="relative font-medium">Back to top</span>
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink text-bg transition-transform duration-300 group-hover:-translate-y-1">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500 to-teal-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <ArrowUpIcon size={16} className="relative group-hover:text-white" />
              </span>
            </a>
          </FadeIn>
        </div>
      </div>

      {/* big wordmark */}
      <motion.p
        aria-hidden
        style={reduce ? undefined : { y: wordY }}
        className="relative mt-14 select-none whitespace-nowrap bg-gradient-to-b from-ink/30 to-transparent bg-clip-text text-center font-display text-[17.5vw] font-medium leading-[0.78] tracking-[-0.06em] text-transparent"
      >
        MARATONG
      </motion.p>

      {/* bottom bar */}
      <div className="relative mx-auto max-w-[1600px] px-5 pb-6 md:px-10">
        <div className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-bg/40 px-5 py-4 text-xs text-muted backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {profile.firstName} {profile.lastName}. All rights reserved.
          </span>
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-ink">
            {profile.email}
          </a>
        </div>
      </div>
    </footer>
  );
}