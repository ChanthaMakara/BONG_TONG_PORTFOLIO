import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { MaximizeIcon, PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { media } from '../../data/media';
import { EASE_OUT } from '../../utils/motion';
import { RevealText } from '../motion/RevealText';

type Status = 'checking' | 'ready' | 'missing';

export function Showreel() {
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number>();

  const [status, setStatus] = useState<Status>('checking');
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.6, 1]);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  const wake = () => {
    setUiVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setUiVisible(false), 2800);
  };

  const toggle = async () => {
    const v = videoRef.current;
    if (!v || status !== 'ready') return;

    if (v.paused) {
      if (v.ended) v.currentTime = 0;
      try {
        await v.play();
      } catch { /* empty */ }
    } else {
      v.pause();
    }
    wake();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const fullscreen = () => {
    const v: any = videoRef.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (boxRef.current?.requestFullscreen) boxRef.current.requestFullscreen();
    else v?.webkitEnterFullscreen?.();
  };

  const showUi = started && (!playing || uiVisible);
  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <section
      id="showreel"
      className="relative overflow-hidden bg-bg py-24 md:py-32"
      aria-label="Showreel"
    >
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Title */}
        <div className="mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-medium tracking-widest text-muted uppercase"
          >
            In Motion
          </motion.p>

          <h2 className="sr-only">Showreel</h2>
          <RevealText
            as="p"
            text="Showreel"
            className="block font-display text-[clamp(2.8rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.04em]"
            wordClassName="bg-gradient-to-r from-ink via-amber-500 to-teal-500 bg-clip-text text-transparent"
          />
        </div>

        {/* Video */}
        <div ref={frameRef}>
          <motion.div
            style={{ scale, opacity }}
            className="relative"
          >
            {/* Soft glow when playing */}
            <div
              className={`pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-r from-amber-500/20 via-orange-400/10 to-teal-500/20 blur-2xl transition-opacity duration-1000 ${
                playing ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div className="relative overflow-hidden rounded-[24px] border border-ink/10 bg-black shadow-2xl md:rounded-[28px]">
              <div
                ref={boxRef}
                className="relative aspect-video overflow-hidden"
                onMouseMove={wake}
                onTouchStart={wake}
              >
                <video
                  ref={videoRef}
                  src={media.showreel}
                  preload="metadata"
                  playsInline
                  onClick={toggle}
                  onLoadedMetadata={(e) => {
                    setStatus('ready');
                    setDuration(e.currentTarget.duration);
                  }}
                  onError={() => setStatus('missing')}
                  onPlay={() => {
                    setStarted(true);
                    setPlaying(true);
                    wake();
                  }}
                  onPause={() => setPlaying(false)}
                  onEnded={() => {
                    setPlaying(false);
                    setStarted(false);
                  }}
                  onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                  className="absolute inset-0 h-full w-full cursor-pointer object-cover"
                />

                {/* Poster */}
                <AnimatePresence>
                  {!started && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={media.showreelPoster}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />

                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                        <button
                          type="button"
                          onClick={toggle}
                          disabled={status !== 'ready'}
                          className="group relative flex h-20 w-20 items-center justify-center rounded-full text-white transition-transform md:h-24 md:w-24"
                        >
                          {status === 'ready' && !reduce && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-white/20" style={{ animationDuration: '2.2s' }} />
                          )}
                          <span className="absolute inset-0 rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-110" />
                          <PlayIcon size={28} fill="currentColor" className="relative ml-1" />
                        </button>

                        <p className="rounded-full border border-white/15 bg-black/40 px-5 py-1.5 text-sm text-white/90 backdrop-blur-md">
                          {status === 'ready' && 'Play showreel'}
                          {status === 'checking' && 'Loading…'}
                          {status === 'missing' && 'Coming soon'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controls */}
                <div
                  className={`absolute inset-x-4 bottom-4 transition-all duration-300 md:inset-x-6 md:bottom-6 ${
                    showUi ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/55 px-4 py-2.5 text-white backdrop-blur-xl md:gap-4">
                    <button onClick={toggle} className="shrink-0 transition hover:scale-110">
                      {playing ? (
                        <PauseIcon size={18} fill="currentColor" />
                      ) : (
                        <PlayIcon size={18} fill="currentColor" />
                      )}
                    </button>

                    <span className="w-10 text-xs tabular-nums text-white/70">{fmt(time)}</span>

                    <div className="relative flex h-5 min-w-0 flex-1 items-center">
                      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-teal-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={time}
                        onChange={(e) => {
                          const v = videoRef.current;
                          if (v) v.currentTime = Number(e.target.value);
                          setTime(Number(e.target.value));
                        }}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </div>

                    <span className="hidden w-10 text-xs tabular-nums text-white/70 sm:block">
                      {fmt(duration)}
                    </span>

                    <button onClick={toggleMute} className="shrink-0 transition hover:scale-110">
                      {muted ? <VolumeXIcon size={18} /> : <Volume2Icon size={18} />}
                    </button>

                    <button onClick={fullscreen} className="shrink-0 transition hover:scale-110">
                      <MaximizeIcon size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function fmt(seconds: number) {
  if (!seconds || !Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}