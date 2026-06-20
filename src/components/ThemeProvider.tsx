'use client';

import { useEffect } from 'react';

export const THEME_KEY = 'marketsim_theme';

export function applyTheme(theme: 'dark' | 'light') {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  window.dispatchEvent(new Event('theme-changed'));
}

export default function ThemeProvider() {
  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null) ?? 'dark';
    applyTheme(saved);
  }, []);

  return null;
}
