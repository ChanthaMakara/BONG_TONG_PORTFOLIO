import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { photoGroups, totalPhotos } from '../../data/photos';
import { RevealText } from '../motion/RevealText';
import { SeriesCard } from '../photography/SeriesCard';
import { PhotoLightbox } from '../photography/PhotoLightbox';

export function Photography() {
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!photoGroups.length) return null;

  const group = activeGroup !== null ? photoGroups[activeGroup] : null;

  const handleOpenSeries = (groupIndex: number) => {
    setActiveGroup(groupIndex);
    setLightboxIndex(0);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    setActiveGroup(null);
  };

  return (
    <section
      id="photoshoot"
      className="relative overflow-hidden bg-bg py-24 md:py-36"
      aria-labelledby="photoshoot-title"
    >
      {/* Ambient lights */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-teal-500/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-10 h-[480px] w-[480px] rounded-full bg-amber-500/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Header */}
        <div className="mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-sm font-medium tracking-widest text-muted uppercase">
              Photography
            </p>
          </motion.div>

          <h2 id="photoshoot-title" className="sr-only">
            Photoshoot
          </h2>

          <RevealText
            as="p"
            text="Photoshoot"
            className="block font-display text-[clamp(2.8rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.04em]"
            wordClassName="bg-gradient-to-r from-ink via-amber-500 to-teal-500 bg-clip-text text-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-muted"
          >
            {totalPhotos} frames across {photoGroups.length} series.
            Click a series to explore.
          </motion.p>
        </div>

        {/* Series Cards - Horizontal Scroll */}
        <div className="relative -mx-5 md:-mx-10">
          <motion.div
            className="flex gap-5 overflow-x-auto px-5 pb-6 pt-2 md:gap-6 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {photoGroups.map((g, i) => (
              <motion.div
                key={g.id}
                className="w-[260px] shrink-0 sm:w-[280px] md:w-[300px]"
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.96 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                <SeriesCard
                  group={g}
                  isActive={activeGroup === i}
                  onClick={() => handleOpenSeries(i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {group && (
        <PhotoLightbox
          photos={group.photos}
          title={group.title}
          description={group.description}
          index={lightboxIndex}
          onClose={handleCloseLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}