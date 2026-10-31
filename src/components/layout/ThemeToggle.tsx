import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Light mode"
      onClick={toggleTheme}
      className={`group relative flex h-9 w-[60px] items-center overflow-hidden rounded-full border border-ink/15 bg-ink/5 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl transition-[border-color,transform] duration-300 hover:border-amber-500/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver ${
        isLight ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* track tint: warm in light mode, cool in dark mode */}
      <span
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? 'bg-gradient-to-r from-amber-500/25 to-orange-400/20 opacity-100' : 'opacity-0'
        }`}
      />
      <span
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLight ? 'opacity-0' : 'bg-gradient-to-r from-teal-500/20 to-violet-500/25 opacity-100'
        }`}
      />

      {/* top highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-ink/30 to-transparent"
      />

      {/* knob */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 520, damping: 36 }}
        className="relative flex h-7 w-7 items-center justify-center rounded-full bg-ink text-bg shadow-[0_4px_14px_-2px_rgba(0,0,0,0.45)]"
      >
        {/* glow behind the knob */}
        <span
          aria-hidden
          className={`absolute inset-0 -z-10 rounded-full blur-md transition-colors duration-500 ${
            isLight ? 'bg-amber-400/60' : 'bg-teal-400/50'
          }`}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="flex"
          >
            {isLight ? <SunIcon size={14} strokeWidth={2.2} /> : <MoonIcon size={14} strokeWidth={2.2} />}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </button>
  );
}