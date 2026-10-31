import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useScreenInit } from '../useScreenInit.js';

type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const STORAGE_KEY = 'pm-theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: {children: React.ReactNode;}) {
  const screenInit = useScreenInit();
  const [theme, setTheme] = useState<Theme>(() =>
  screenInit?.theme === 'light' || screenInit?.theme === 'dark' ? screenInit.theme : getInitialTheme()
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {

      /* storage unavailable */}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    setTheme((t) => t === 'dark' ? 'light' : 'dark');
    window.setTimeout(() => root.classList.remove('theme-transition'), 360);
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {

    /* storage unavailable */}
  return 'dark';
}