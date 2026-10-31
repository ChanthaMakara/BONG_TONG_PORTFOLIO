import React, { useState } from 'react';
import { motion, MotionValue, useReducedMotion } from 'framer-motion';
import { media } from '../../data/media';

type HeroBackdropProps = {
  y: MotionValue<string>;
};

/** Image fallback with an optional looping video layered on top once it can play. */
export function HeroBackdrop({ y }: HeroBackdropProps) {
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className="absolute inset-0" aria-hidden>
      <motion.div style={{ y }} className="absolute inset-x-0 -top-[6%] h-[118%]">
        <img
          src={media.heroFallback}
          alt=""
          className="hero-still h-full w-full object-cover object-[70%_center]"
        />
        {!reduce && (
          <video
            src={media.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
            className={`hero-still absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </motion.div>

      {/* theme fades (unchanged) */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/10" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/70 to-transparent" />

      {/* soft warm/cool color wash: gives the glass elements a tint to blur over */}
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 78% 22%, rgba(245,158,11,0.35), transparent 55%), radial-gradient(ellipse at 20% 85%, rgba(20,184,166,0.28), transparent 55%)',
        }}
      />

      {/* light vignette to keep the edges calm */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgb(var(--c-bg, 0 0 0) / 0.35) 100%)',
        }}
      />
    </div>
  );
}