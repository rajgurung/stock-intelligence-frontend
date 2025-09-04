'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('stock-app-theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  // Update resolved theme when theme or system preference changes
  useEffect(() => {
    const updateResolvedTheme = () => {
      const newResolvedTheme = theme === 'system' ? getSystemTheme() : theme;
      setResolvedTheme(newResolvedTheme);
      
      // Apply theme to document
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);
      
      // Update CSS variables for smooth transitions
      if (newResolvedTheme === 'dark') {
        root.style.setProperty('--background', '#0f172a');
        root.style.setProperty('--foreground', '#f8fafc');
        root.style.setProperty('--card', '#1e293b');
        root.style.setProperty('--card-foreground', '#f8fafc');
        root.style.setProperty('--muted', '#334155');
        root.style.setProperty('--muted-foreground', '#cbd5e1');
        root.style.setProperty('--border', '#334155');
      } else {
        root.style.setProperty('--background', '#ffffff');
        root.style.setProperty('--foreground', '#171717');
        root.style.setProperty('--card', '#ffffff');
        root.style.setProperty('--card-foreground', '#171717');
        root.style.setProperty('--muted', '#f1f5f9');
        root.style.setProperty('--muted-foreground', '#64748b');
        root.style.setProperty('--border', '#e2e8f0');
      }
    };

    if (mounted) {
      updateResolvedTheme();
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Save theme preference
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('stock-app-theme', newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}