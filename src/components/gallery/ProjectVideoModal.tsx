import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PlayIcon, XIcon } from 'lucide-react';

/**
 * Data each project can have (all optional):
 *   video:  '/videos/trailer.mp4'  (or a YouTube link)
 *   images: ['/images/a.jpg', '/images/b.jpg', ...]
 *   poster: '/images/poster.jpg'   (thumbnail for the video; defaults to the first image)
 */
type Item = { type: 'video' | 'image'; src: string };

function buildItems(p: any): Item[] {
  const video: string | undefined = p?.video ?? p?.videoUrl ?? p?.media?.video;
  const images: string[] = p?.images ?? p?.media?.images ?? p?.gallery ?? (p?.cover ? [p.cover] : []);
  const list: Item[] = [
    ...(video ? [{ type: 'video' as const, src: video }] : []),
    ...images.map((src) => ({ type: 'image' as const, src })),
  ];
  if (list.length) return list;
  // TEMP placeholders so the popup is never empty. Replace by adding `images` / `video` to the project.
  const seed = encodeURIComponent(String(p?.id ?? p?.title ?? 'project'));
  return [1, 2, 3].map((n) => ({ type: 'image' as const, src: `https://picsum.photos/seed/${seed}-${n}/1600/900` }));
}

function youtubeEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` : null;
}

type Props = { project: any | null; onClose: () => void };

export function ProjectVideoModal({ project, onClose }: Props) {
  const reduce = useReducedMotion();
  const items = useMemo(() => (project ? buildItems(project) : []), [project]);
  const [sel, setSel] = useState(0);

  useEffect(() => setSel(0), [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setSel((s) => Math.min(items.length - 1, s + 1));
      if (e.key === 'ArrowLeft') setSel((s) => Math.max(0, s - 1));
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [project, onClose, items.length]);

  if (typeof document === 'undefined') return null;

  const item = items[sel];
  const poster: string | undefined = project?.poster ?? items.find((i) => i.type === 'image')?.src;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#05060a]/80 p-4 backdrop-blur-xl md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          {/* ambient orbs behind the glass */}
          <div
            aria-hidden
            className="pointer-events-none fixed -left-32 top-0 h-[460px] w-[460px] rounded-full bg-amber-500/25 blur-[130px]"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-teal-500/20 blur-[130px]"
          />
          {!reduce && (
            <motion.div
              aria-hidden
              animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.12, 0.96, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none fixed left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-[110px]"
            />
          )}

          {/* On small screens the card gets extra top padding (pt-14) so the close
              button sits in its own strip above the video instead of covering it. */}
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.06] p-2 pt-14 text-white shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:rounded-[36px] md:p-3"
            initial={{ scale: 0.92, y: 24, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* top highlight */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-12 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />

            {/* close button: top strip on mobile, over the video corner on desktop */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-2.5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl transition-[transform,background-color,border-color] duration-200 hover:scale-105 hover:border-amber-400/60 hover:bg-black/45 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:right-6 md:top-6"
            >
              <XIcon size={18} />
            </button>

            {/* main viewer: shows the selected video or image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[22px] bg-black md:rounded-[28px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sel}-${item?.src}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {!item ? (
                    <div className="flex h-full items-center justify-center text-sm text-white/60">
                      Media coming soon
                    </div>
                  ) : item.type === 'image' ? (
                    <>
                      <img
                        src={item.src}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                      />
                      <img
                        src={item.src}
                        alt={`${project.title} ${sel + 1}`}
                        className="relative h-full w-full object-contain"
                      />
                    </>
                  ) : youtubeEmbed(item.src) ? (
                    <iframe
                      src={youtubeEmbed(item.src)!}
                      title={project.title}
                      allow="autoplay; encrypted-media; fullscreen"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  ) : (
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* counter chip */}
              {items.length > 1 && (
                <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] tabular-nums text-white/85 backdrop-blur-xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
                  {String(sel + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
              )}
            </div>

            {/* thumbnails: click to switch between trailer and images */}
            {items.length > 1 && (
              <div
                className="flex gap-2 overflow-x-auto px-3 pb-1 pt-4 md:px-5"
                role="tablist"
                aria-label="Project media"
              >
                {items.map((it, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === sel}
                    aria-label={it.type === 'video' ? 'Watch trailer' : `Image ${i}`}
                    onClick={() => setSel(i)}
                    className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-2xl border bg-white/5 backdrop-blur-md transition-all duration-300 md:h-20 md:w-36 ${
                      i === sel
                        ? 'scale-[1.03] border-amber-400/80 shadow-[0_0_24px_-4px_rgba(245,158,11,0.6)]'
                        : 'border-white/15 opacity-60 hover:border-white/40 hover:opacity-100'
                    }`}
                  >
                    {(it.type === 'image' || poster) && (
                      <img
                        src={it.type === 'image' ? it.src : poster}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                    {it.type === 'video' && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md">
                          <PlayIcon size={14} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* info bar */}
            <div className="mt-3 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-5 md:flex-row md:items-end md:justify-between md:p-7">
              <div>
                <h3 className="mt-3 bg-gradient-to-r from-white via-amber-200 to-teal-200 bg-clip-text font-display text-2xl font-medium tracking-[-0.03em] text-transparent md:text-4xl">
                  {project.title}
                </h3>
              </div>
              <p className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[13px] text-white/80 backdrop-blur-md">
                {project.role}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}