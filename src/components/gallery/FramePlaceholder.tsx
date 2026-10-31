import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FilmIcon, ImageIcon } from 'lucide-react';

type FramePlaceholderProps = {
  kind?: 'image' | 'video';
};

/** A cinematic "frame pending" slate shown until real stills or footage are added. */
export function FramePlaceholder({ kind = 'image' }: FramePlaceholderProps) {
  const reduce = useReducedMotion();
  const Icon = kind === 'video' ? FilmIcon : ImageIcon;
  const corner = 'absolute h-5 w-5 border-white/40';

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b1020] text-[#c6cbd4]">
      {/* ambient glows */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(245,158,11,0.22),transparent_55%),radial-gradient(ellipse_at_25%_80%,rgba(20,184,166,0.18),transparent_55%)]"
        aria-hidden
      />
      {!reduce && (
        <motion.div
          aria-hidden
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 20, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-[35%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[60px]"
        />
      )}

      {/* 2.39:1 letterbox guides */}
      <div className="absolute inset-x-0 top-[13%] border-t border-dashed border-white/10" aria-hidden />
      <div className="absolute inset-x-0 bottom-[13%] border-t border-dashed border-white/10" aria-hidden />

      {/* viewfinder corners */}
      <div className="absolute inset-[5%]" aria-hidden>
        <span className={`${corner} left-0 top-0 border-l border-t`} />
        <span className={`${corner} right-0 top-0 border-r border-t`} />
        <span className={`${corner} bottom-0 left-0 border-b border-l`} />
        <span className={`${corner} bottom-0 right-0 border-b border-r`} />
      </div>

      {/* slow scan line */}
      {!reduce && (
        <motion.div
          aria-hidden
          initial={{ top: '13%' }}
          animate={{ top: ['13%', '87%', '13%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-[5%] h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"
        />
      )}

      {/* glass slate */}
      <div className="absolute left-1/2 top-[40%] w-[78%] max-w-[260px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-white/20 bg-white/[0.07] px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
          <span className="relative flex h-11 w-11 items-center justify-center">
            {!reduce && (
              <span
                aria-hidden
                className="absolute inset-0 animate-ping rounded-full bg-white/15"
                style={{ animationDuration: '2.6s' }}
              />
            )}
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
              <Icon size={17} strokeWidth={1.6} />
            </span>
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/85">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
            Frame pending
          </span>
          <span className="text-[11px] text-white/55">Stills & footage coming soon</span>
        </div>
      </div>
    </div>
  );
}