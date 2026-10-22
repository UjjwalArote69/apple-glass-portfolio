import { useState, useEffect } from 'react';

export type Theme = 'daylight' | 'night';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apple_portfolio_theme') as Theme | null;
      if (saved === 'daylight' || saved === 'night') return saved;
      // Default to Daylight as per specification, or check system preference
      return 'daylight';
    }
    return 'daylight';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'night') {
      root.setAttribute('data-theme', 'night');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('apple_portfolio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'daylight' ? 'night' : 'daylight'));
  };

  return { theme, toggleTheme, isNight: theme === 'night' };
}
