'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemePref = 'light' | 'dark' | 'system';
export const THEME_KEY = 'ch-theme';

interface ThemeCtx {
  theme: ThemePref;
  resolved: 'light' | 'dark';
  setTheme: (t: ThemePref) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function systemDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function apply(theme: ThemePref): 'light' | 'dark' {
  const dark = theme === 'dark' || (theme === 'system' && systemDark());
  document.documentElement.classList.toggle('dark', dark);
  return dark ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePref>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    let stored: ThemePref = 'system';
    try {
      const v = localStorage.getItem(THEME_KEY);
      if (v === 'light' || v === 'dark' || v === 'system') stored = v;
    } catch {
      // storage unavailable
    }
    setThemeState(stored);
    setResolved(apply(stored));
  }, []);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolved(apply('system'));
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((t: ThemePref) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      // storage unavailable
    }
    setResolved(apply(t));
  }, []);

  const toggle = useCallback(() => setTheme(resolved === 'dark' ? 'light' : 'dark'), [resolved, setTheme]);

  const value = useMemo(() => ({ theme, resolved, setTheme, toggle }), [theme, resolved, setTheme, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme must be used inside ThemeProvider');
  return c;
}
