import React from 'react';
import { motion } from 'framer-motion';
import { MaximizeIcon } from 'lucide-react';
import type { Photo } from '../../data/photos';
import { EASE_OUT } from '../../utils/motion';

type Span = 'big' | 'wide' | '';
const LAYOUTS: Record<number, Span[]> = {
  8: ['big', '', '', '', 'wide', 'wide', '', ''],
  7: ['big', '', '', '', '', 'wide', 'wide'],
  6: ['big', '', '', 'wide', 'wide', 'wide'],
  5: ['big', '', '', 'wide', ''],
};

const SPAN_CLASS: Record<Span, string> = {
  big: 'col-span-2 row-span-2',
  wide: 'col-span-2',
  '': '',
};

interface Props {
  photos: Photo[];
  onOpen: (index: number) => void;
}

export function PhotoGrid({ photos, onOpen }: Props) {
  const layout = LAYOUTS[photos.length] || [];

  return (
    <ul className="grid auto-rows-[140px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[170px] md:auto-rows-[200px] md:grid-cols-4 md:gap-4">
      {photos.map((photo, i) => (
        <motion.li
          key={photo.src}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: EASE_OUT }}
          className={SPAN_CLASS[layout[i] || '']}
        >
          <button
            type="button"
            onClick={() => onOpen(i)}
            className="group relative block h-full w-full overflow-hidden rounded-2xl border border-ink/10 bg-bg/40 p-1.5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-amber-500/40"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[14px]">
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                <MaximizeIcon size={14} />
              </div>
            </div>
          </button>
        </motion.li>
      ))}
    </ul>
  );
}