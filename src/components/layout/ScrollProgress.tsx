import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  // the glowing tip follows the end of the bar
  const tipLeft = useTransform(scaleX, (v) => `${v * 100}%`);
  const tipOpacity = useTransform(scaleX, [0, 0.01, 0.99, 1], [0, 1, 1, 0]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      {/* faint glass track */}
      <div className="absolute inset-0 bg-ink/5 backdrop-blur-sm" />

      {/* gradient fill */}
      <motion.div
        style={{ scaleX }}
        className="absolute inset-0 origin-left bg-gradient-to-r from-amber-500 via-orange-400 to-teal-500"
      />

      {/* soft glow under the fill */}
      <motion.div
        style={{ scaleX }}
        className="absolute inset-x-0 top-0 h-[10px] origin-left bg-gradient-to-r from-amber-500/50 via-orange-400/40 to-teal-500/50 blur-md"
      />

      {/* glowing tip */}
      {!reduce && (
        <motion.span
          style={{ left: tipLeft, opacity: tipOpacity }}
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(245,158,11,0.8)]"
        />
      )}
    </div>
  );
}