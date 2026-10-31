import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { EASE_OUT } from '../../utils/motion';
import { ProjectMedia } from './ProjectMedia';

type ProjectModalProps = {
  projects: Project[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function ProjectModal({ projects, index, onClose, onNavigate }: ProjectModalProps) {
  const project = index === null ? null : projects[index];
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (index === null) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && index < projects.length - 1) onNavigate(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) onNavigate(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, onClose, onNavigate, projects.length]);

  useEffect(() => {
    if (index === null && lastFocus.current) {
      lastFocus.current.focus();
      lastFocus.current = null;
    }
  }, [index]);

  return (
    <AnimatePresence>
      {project && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-[#05060a]/90 text-[#f3efe8] backdrop-blur-2xl"
        >
          {/* ambient orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-0 h-[460px] w-[460px] rounded-full bg-amber-500/25 blur-[130px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-teal-500/20 blur-[130px]"
          />
          {!reduce && (
            <motion.div
              aria-hidden
              animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.12, 0.96, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-[110px]"
            />
          )}

          {/* top bar */}
          <div className="relative flex items-center justify-between px-5 py-5 md:px-10">
            <p className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-display text-sm tabular-nums text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
              <span className="text-white">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-white/40">/</span>
              {String(projects.length).padStart(2, '0')}
            </p>

            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label="Close preview"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl transition-[transform,background-color,border-color] duration-200 hover:scale-105 hover:border-amber-400/60 hover:bg-white/15 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <XIcon size={18} />
            </button>
          </div>

          <div className="relative grid flex-1 items-center gap-8 overflow-y-auto px-5 pb-8 md:px-10 lg:grid-cols-12 lg:gap-12">
            {/* media in a glass frame */}
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.97, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="relative w-full rounded-[24px] border border-white/15 bg-white/[0.06] p-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:rounded-[32px] md:p-3 lg:col-span-8"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
              <div className="relative aspect-video w-full overflow-hidden rounded-[18px] bg-[#0b1020] md:rounded-[24px]">
                <ProjectMedia project={project} mode="modal" />
              </div>
            </motion.div>

            {/* details glass card */}
            <motion.div
              key={`${project.id}-details`}
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
              className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:p-8 lg:col-span-4"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />

              <h2
                id="project-modal-title"
                className="mt-4 bg-gradient-to-r from-white via-amber-200 to-teal-200 bg-clip-text font-display text-4xl font-medium leading-[1] tracking-[-0.03em] text-transparent md:text-5xl"
              >
                {project.title}
              </h2>

              <dl className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <dt className="text-xs text-white/50">Role</dt>
                  <dd className="mt-1 text-sm font-medium">{project.role}</dd>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <dt className="text-xs text-white/50">Year</dt>
                </div>
              </dl>

              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/70">
                {project.description}
              </p>

              {/* progress dots */}
              <div className="mt-8 flex items-center gap-1.5" aria-hidden>
                {projects.map((p, i) => (
                  <span
                    key={p.id}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === index ? 'w-6 bg-gradient-to-r from-amber-400 to-teal-400' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate(index - 1)}
                  disabled={index === 0}
                  className="flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-sm backdrop-blur-xl transition-[border-color,background-color,opacity,transform] duration-200 hover:border-white/40 hover:bg-white/15 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowLeftIcon size={15} /> Previous
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(index + 1)}
                  disabled={index === projects.length - 1}
                  className="group/next relative flex h-12 items-center gap-2 overflow-hidden rounded-full bg-white px-5 text-sm font-semibold text-black transition-[opacity,transform] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-30"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-300 to-teal-300 opacity-0 transition-opacity duration-500 group-hover/next:opacity-100"
                  />
                  <span className="relative flex items-center gap-2">
                    Next <ArrowRightIcon size={15} />
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}