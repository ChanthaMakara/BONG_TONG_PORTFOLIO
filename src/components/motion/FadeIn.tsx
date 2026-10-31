import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../utils/motion';

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li';
};

export function FadeIn({ children, className = '', delay = 0, as = 'div' }: FadeInProps) {
  const reduce = useReducedMotion();
  const Component = as === 'li' ? motion.li : motion.div;
  return (
    <Component
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}