import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PhotoGroup } from '../../data/photos';

interface Props {
  group: PhotoGroup;
  isActive: boolean;
  onClick: () => void;
}

export function SeriesCard({ group, isActive, onClick }: Props) {
  const [current, setCurrent] = useState(0);

  // Auto slide every 3.5 seconds
  useEffect(() => {
    if (group.photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % group.photos.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [group.photos.length]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative aspect-[3/4] w-full overflow-hidden rounded-[28px] border text-left transition-all duration-500 ${
        isActive
          ? 'border-amber-500/70 shadow-[0_0_50px_-8px_rgba(245,158,11,0.5)]'
          : 'border-ink/10 hover:border-ink/25'
      }`}
    >
      {/* Auto-sliding images */}
      <AnimatePresence mode="wait">
        <motion.img
          key={group.photos[current].src}
          src={group.photos[current].src}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Small progress dots (optional but nice) */}
      {group.photos.length > 1 && (
        <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-1.5">
          {group.photos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === current ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Glass info at bottom */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-medium text-white md:text-2xl">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-white/70">
                {group.photos.length} photos
              </p>
            </div>

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition ${
                isActive
                  ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                  : 'border-white/30 bg-white/10 text-white'
              }`}
            >
              {isActive ? '−' : '+'}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}