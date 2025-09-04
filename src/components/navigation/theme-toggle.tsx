'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Sun;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200 border border-border/50 hover:border-border group"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="h-4 w-4 text-muted-foreground group-hover:text-card-foreground transition-colors" />
        <span className="text-sm font-medium text-muted-foreground group-hover:text-card-foreground transition-colors capitalize">
          {currentTheme?.label}
        </span>
        <svg
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 z-50 w-48 bg-card/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-2 animate-scale-in">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.value;
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value as any);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'hover:bg-muted/50 text-card-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${
                    isSelected 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${
                      isSelected ? 'text-emerald-700 dark:text-emerald-300' : ''
                    }`}>
                      {themeOption.label}
                    </div>
                    {themeOption.value === 'system' && (
                      <div className="text-xs text-muted-foreground">
                        Currently: {resolvedTheme}
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}