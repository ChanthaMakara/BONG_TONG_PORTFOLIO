import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../../utils/motion';

type RevealTextProps = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** Classes applied to every word (use this for gradient text, see notes). */
  wordClassName?: string;
  delay?: number;
  stagger?: number;
};

/** Word-by-word mask reveal triggered on scroll. */
export function RevealText({
  text,
  as = 'span',
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.05,
}: RevealTextProps) {
  const reduce = useReducedMotion();
  const Tag = as;
  const words = text.split(' ');

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {words.map((word, i) => (
          <React.Fragment key={`${word}-${i}`}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${wordClassName}`}
                variants={{
                  hidden: { y: '108%', rotate: 4, opacity: 0, filter: 'blur(6px)' },
                  show: {
                    y: '0%',
                    rotate: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: { duration: 0.8, ease: EASE_OUT },
                  },
                }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}