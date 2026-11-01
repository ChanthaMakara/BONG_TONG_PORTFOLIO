import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, Maximize2Icon, XIcon } from 'lucide-react';
import { FadeIn } from '../motion/FadeIn';
import { SectionLabel } from '../ui/SectionLabel';
import { EASE_OUT } from '../../utils/motion';

/* ---------- Config: change these to match your files ---------- */
const COUNT = 14; // how many images (bts1 ... bts14)
const EXT = 'JPG'; // file extension, lowercase recommended
const photos = Array.from({ length: COUNT }, (_, i) => ({
  src: `/images/projects/bts${i + 1}.${EXT}`,
  alt: `Behind the scenes photo ${i + 1}`,
}));

const edgeMask = {
  WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
  maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
} as React.CSSProperties;

/* ---------- One photo card ---------- */
function PhotoCard({ index, onOpen }: { index: number; onOpen: (i: number) => void }) {
  const p = photos[index];
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open photo ${index + 1} of ${photos.length}`}
      className="group/card relative shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-bg/40 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-amber-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver md:rounded-3xl"
    >
      <img
        src={p.src}
        alt={p.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-56 w-auto object-cover transition-transform duration-700 group-hover/card:scale-105 md:h-72"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
      />
      <span className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-all duration-500 group-hover/card:opacity-100 md:translate-y-2 md:group-hover/card:translate-y-0">
        <span className="rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] tabular-nums text-white backdrop-blur-xl">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-xl">
          <Maximize2Icon size={14} />
        </span>
      </span>
    </button>
  );
}

/* ---------- Auto-scrolling row ---------- */
function MarqueeRow({
  indexes,
  reverse = false,
  duration = 60,
  onOpen,
}: {
  indexes: number[];
  reverse?: boolean;
  duration?: number;
  onOpen: (i: number) => void;
}) {
  const reduce = useReducedMotion();

  // reduced motion: a normal horizontally scrollable row
  if (reduce) {
    return (
      <div className="overflow-x-auto px-5 pb-2 md:px-10">
        <div className="flex w-max gap-4">
          {indexes.map((i) => (
            <PhotoCard key={i} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden py-2" style={edgeMask}>
      <div
        className="bts-track flex w-max"
        style={{
          animation: `${reverse ? 'bts-right' : 'bts-left'} ${duration}s linear infinite`,
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-4 pr-4" aria-hidden={copy === 1}>
            {indexes.map((i) => (
              <PhotoCard key={`${copy}-${i}`} index={i} onOpen={onOpen} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Lightbox ---------- */
function Lightbox({
  index,
  onClose,
  onChange,
}: {
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const open = index !== null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + photos.length) % photos.length);
    },
    [index, onChange]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, go]);

  if (typeof document === 'undefined') return null;

  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl transition-[transform,border-color] duration-200 hover:scale-105 hover:border-amber-400/60 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col bg-[#05060a]/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Behind the scenes gallery"
        >
          {/* top bar */}
          <div
            className="flex items-center justify-between px-4 pb-2 pt-4 md:px-8 md:pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[11px] tabular-nums text-white/85 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
              {String((index ?? 0) + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={onClose} aria-label="Close" className={btn}>
              <XIcon size={18} />
            </button>
          </div>

          {/* image */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24">
            <AnimatePresence mode="wait">
              {index !== null && (
                <motion.img
                  key={index}
                  src={photos[index].src}
                  alt={photos[index].alt}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]"
                />
              )}
            </AnimatePresence>

            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className={`${btn} absolute left-3 top-1/2 -translate-y-1/2 md:left-8`}
            >
              <ChevronLeftIcon size={20} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className={`${btn} absolute right-3 top-1/2 -translate-y-1/2 md:right-8`}
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>

          {/* thumbnails */}
          <div
            className="flex gap-2 overflow-x-auto px-4 pb-4 pt-3 md:justify-center md:px-8 md:pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => onChange(i)}
                className={`h-12 w-16 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 md:h-14 md:w-20 ${
                  i === index
                    ? 'scale-105 border-amber-400/80 shadow-[0_0_20px_-4px_rgba(245,158,11,0.6)]'
                    : 'border-white/15 opacity-50 hover:opacity-100'
                }`}
              >
                <img src={p.src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ---------- Section block ---------- */
export function BehindTheScenes() {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);

  const { row1, row2 } = useMemo(() => {
    const all = photos.map((_, i) => i);
    const half = Math.ceil(all.length / 2);
    return { row1: all.slice(0, half), row2: all.slice(half) };
  }, []);

  return (
    <div className="relative mt-24 md:mt-40">
      {/* keyframes for the marquee, with pause on hover */}
      <style>{`
        @keyframes bts-left  { from { transform: translateX(0) }    to { transform: translateX(-50%) } }
        @keyframes bts-right { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        .bts-track:hover { animation-play-state: paused !important; }
      `}</style>

      <div className="mx-auto mb-10 flex max-w-[1600px] flex-col gap-5 px-5 md:mb-14 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <SectionLabel>Behind the scenes</SectionLabel>
          <FadeIn delay={0.05}>
            <h3 className="mt-5 bg-gradient-to-r from-ink via-amber-500 to-teal-500 bg-clip-text font-display text-[clamp(2.2rem,5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-transparent">
              Frames from set
            </h3>
          </FadeIn>
        </div>
        <FadeIn delay={0.1}>
          <p className="max-w-sm rounded-2xl border border-ink/10 bg-bg/40 p-4 text-[15px] leading-relaxed text-muted backdrop-blur-xl">
            Moments between the takes. Hover to pause, tap any photo to open it full size.
          </p>
        </FadeIn>
      </div>

      <div className="space-y-4">
        <MarqueeRow indexes={row1} duration={70} onOpen={setActive} />
        <MarqueeRow indexes={row2} duration={80} reverse onOpen={setActive} />
      </div>

      <Lightbox index={active} onClose={close} onChange={setActive} />
    </div>
  );
}