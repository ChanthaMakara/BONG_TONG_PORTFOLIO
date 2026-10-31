import React, { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { projects } from '../../data/projects';
import { FadeIn } from '../motion/FadeIn';
import { CoverflowCarousel } from './CoverflowCarousel';
import { ProjectVideoModal } from './ProjectVideoModal';

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // orb parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const y1 = useTransform(smooth, [0, 1], [-100, 140]);
  const y2 = useTransform(smooth, [0, 1], [120, -140]);

  return (
    <section
      id="work"
      ref={ref}
      className="relative overflow-hidden bg-bg py-16 md:py-24"
      aria-label="Selected work"
    >
      {/* ambient orbs */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y1 }}
        className="pointer-events-none absolute -left-32 top-10 h-[440px] w-[440px] rounded-full bg-amber-500/25 blur-[130px]"
      />
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: y2 }}
        className="pointer-events-none absolute -right-32 bottom-10 h-[480px] w-[480px] rounded-full bg-teal-500/20 blur-[130px]"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-[110px]"
        />
      )}

      {/* subtle grid (neutral gray works in both themes) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(128,128,128,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 70%)',
        }}
      />

      <div className="relative">
        <FadeIn className="mb-4 flex justify-center md:mb-6">
          <p className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-bg/40 px-4 py-1.5 text-sm font-medium text-ink/70 backdrop-blur-xl">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            Selected work
          </p>
        </FadeIn>

        <CoverflowCarousel projects={projects} onSelect={setOpen} paused={open !== null} />
      </div>

      <ProjectVideoModal project={open === null ? null : projects[open]} onClose={() => setOpen(null)} />
    </section>
  );
}