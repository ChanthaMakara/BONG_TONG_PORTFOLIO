import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { navLinks } from '../../data/navigation';
import { useActiveSection } from '../../hooks/useActiveSection';
import { EASE_OUT } from '../../utils/motion';
import { ThemeToggle } from './ThemeToggle';

const sectionIds = navLinks.map((l) => l.id);

export function Navigation() {
  const active = useActiveSection(sectionIds);
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // glass gets a bit stronger once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:pt-5">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -24, opacity: 0, filter: 'blur(8px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
        className={`relative mx-auto flex w-full max-w-5xl items-center justify-between gap-3 overflow-hidden rounded-full border py-2 pl-3 pr-2 backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled
            ? 'border-ink/15 bg-bg/60 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]'
            : 'border-ink/10 bg-bg/35 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.3)]'
        }`}
      >
        {/* top highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-ink/30 to-transparent"
        />

        {/* brand: logo image + name */}
        <a
          href="#top"
          aria-label="Maratong, back to top"
          className="group flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver"
        >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink/20 bg-ink/5 ring-2 ring-transparent transition-[box-shadow] duration-500 group-hover:ring-amber-500/50">
          <img
            src="/images/Logo.PNG"
            alt=""
            width={44}
            height={44}
            className="h-full w-full origin-[50%_10%] scale-[1.5] object-cover object-top transition-transform duration-500 group-hover:scale-[1.65]"
          />
          </span>
          <span className="font-display text-sm font-medium tracking-[0.2em]">MARATONG</span>
        </a>

        <ul className="hidden items-center rounded-full border border-ink/10 bg-ink/[0.04] p-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative block rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full border border-ink/15 bg-bg/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_20px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                      />
                    </motion.span>
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className="group/cta relative hidden items-center overflow-hidden whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-[13px] font-semibold text-bg transition-transform duration-200 active:scale-[0.97] md:inline-flex"
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-400 to-teal-500 opacity-0 transition-opacity duration-500 group-hover/cta:opacity-100"
            />
            <span className="relative transition-colors duration-300 group-hover/cta:text-white">Get in Touch</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-ink/5 backdrop-blur-md transition-[transform,border-color] duration-200 hover:border-amber-500/50 active:scale-95 lg:hidden"
          >
            {open ? <XIcon size={16} /> : <MenuIcon size={16} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="relative mx-auto mt-2 max-w-5xl origin-top overflow-hidden rounded-[28px] border border-ink/10 bg-bg/60 p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:hidden"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ink/30 to-transparent"
            />
            <ul className="relative">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 + i * 0.04 }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 font-display text-2xl tracking-tight transition-colors duration-200 ${
                      active === link.id
                        ? 'border-ink/10 bg-ink/10 text-ink'
                        : 'border-transparent text-ink/80 hover:bg-ink/5'
                    }`}
                  >
                    {link.label}
                    {active === link.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-amber-500 to-teal-500" aria-hidden />
                    )}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}