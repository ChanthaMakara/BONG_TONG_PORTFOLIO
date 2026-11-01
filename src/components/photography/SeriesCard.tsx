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
      aria-label={`Open ${group.title}`}
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

      {/* Very light gradient at the bottom so the dots stay readable */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Small photo number */}
      {group.photos.length > 1 && (
        <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] tabular-nums text-white backdrop-blur-xl">
          {String(current + 1).padStart(2, '0')} / {String(group.photos.length).padStart(2, '0')}
        </span>
      )}

    </motion.button>
  );
}