import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../utils/motion';

type MaskRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: 'bottom' | 'left';
};

/** Reveals its content through an expanding clip-path mask when scrolled into view. */
export function MaskReveal({ children, className = '', delay = 0, from = 'bottom' }: MaskRevealProps) {
  const reduce = useReducedMotion();
  const hidden = from === 'bottom' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)';
  const slide = from === 'bottom' ? { y: 24 } : { x: -24 };

  return (
    // The observer lives on this wrapper, which is never clipped,
    // so whileInView always fires (a fully clipped element has zero visible area).
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="h-full w-full"
        variants={{
          hidden: { clipPath: hidden, opacity: 0, filter: 'blur(8px)', ...slide },
          show: {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            filter: 'blur(0px)',
            x: 0,
            y: 0,
            transition: { duration: 0.9, ease: EASE_OUT, delay },
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}