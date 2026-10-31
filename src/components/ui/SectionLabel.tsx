import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../utils/motion';

type SectionLabelProps = {
  children: string;
  className?: string;
};

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  const reduce = useReducedMotion();

  return (
    <motion.p
      initial={reduce ? false : { opacity: 0, x: -12, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className={`relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full border border-ink/10 bg-bg/40 px-4 py-1.5 text-sm font-medium text-ink/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl ${className}`}
    >
      {/* top highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-ink/30 to-transparent"
      />

      {/* gradient accent line + dot */}
      <span className="relative flex items-center gap-2" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      </span>

      <span className="relative">{children}</span>
    </motion.p>
  );
}