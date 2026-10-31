import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from 'lucide-react';
import type { Photo } from '../../data/photos';
import { EASE_OUT } from '../../utils/motion';

const pad = (n: number) => String(n).padStart(2, '0');

interface Props {
  photos: Photo[];
  title: string;
  description?: string;
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

export function PhotoLightbox({
  photos,
  title,
  description,
  index,
  onClose,
  onNavigate,
}: Props) {
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const open = index !== null;

  // Preload only current, previous and next images
  useEffect(() => {
    if (index === null) return;

    const toPreload = [index - 1, index, index + 1].filter(
      (i) => i >= 0 && i < photos.length
    );

    toPreload.forEach((i) => {
      const img = new Image();
      img.src = photos[i].src;
      img.onload = () => {
        setLoaded((prev) => ({ ...prev, [i]: true }));
      };
    });
  }, [index, photos]);

  // Keyboard
  useEffect(() => {
    if (index === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && index < photos.length - 1) onNavigate(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) onNavigate(index - 1);
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, photos.length, onClose, onNavigate]);

  // Keep active thumbnail in view
  useEffect(() => {
    if (index === null) return;
    const el = thumbsRef.current?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [index]);

  if (typeof document === 'undefined') return null;
  const photo = open ? photos[index!] : null;

  return createPortal(
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col bg-black/90 text-white backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          {/* Top bar */}
          <div
            className="relative z-20 flex items-center justify-between px-4 py-3 md:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="truncate text-lg font-medium md:text-xl">{title}</h3>
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-xs tabular-nums text-white/70">
                  {pad(index + 1)} / {pad(photos.length)}
                </span>
              </div>
              {description && (
                <p className="mt-0.5 truncate text-sm text-white/50">{description}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <XIcon size={18} />
            </button>
          </div>

          {/* Main Image */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-16">
            {/* Prev */}
            <button
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(index - 1);
              }}
              className="absolute left-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-0 md:left-5 md:flex"
            >
              <ArrowLeftIcon size={20} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={photo.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 && index < photos.length - 1) onNavigate(index + 1);
                  if (info.offset.x > 60 && index > 0) onNavigate(index - 1);
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-full max-w-full"
              >
                {/* Loading placeholder */}
                {!loaded[index] && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  </div>
                )}

                <img
                  src={photo.src}
                  alt={photo.alt}
                  draggable={false}
                  className={`max-h-[66vh] w-auto max-w-full select-none rounded-xl object-contain transition-opacity duration-300 md:max-h-[73vh] ${
                    loaded[index] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setLoaded((prev) => ({ ...prev, [index]: true }))}
                />
              </motion.div>
            </AnimatePresence>

            {/* Next */}
            <button
              disabled={index === photos.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(index + 1);
              }}
              className="absolute right-2 z-10 hidden h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:opacity-0 md:right-5 md:flex"
            >
              <ArrowRightIcon size={20} />
            </button>
          </div>

          {/* Thumbnails - optimized */}
          <div
            ref={thumbsRef}
            className="relative z-20 flex gap-2 overflow-x-auto px-4 pb-4 pt-2 md:justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {photos.map((p, i) => (
              <button
                key={p.src}
                data-thumb={i}
                onClick={() => onNavigate(i)}
                className={`relative h-14 w-[68px] shrink-0 overflow-hidden rounded-lg transition md:h-15 md:w-20 ${
                  i === index
                    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black'
                    : 'opacity-50 hover:opacity-90'
                }`}
              >
                <img
                  src={p.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}