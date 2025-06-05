"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeContextType } from '@/types/theme';
import {
  getStoredTheme,
  setStoredTheme,
  createSystemThemeListener,
  resolveActualTheme,
  applyTheme,
  getNextTheme
} from '@/lib/theme-utils';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'auto' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    const initialTheme = storedTheme || defaultTheme;
    const resolvedTheme = resolveActualTheme(initialTheme);
    
    setThemeState(initialTheme);
    setActualTheme(resolvedTheme);
    applyTheme(resolvedTheme);
    setIsInitialized(true);
  }, [defaultTheme]);

  // Listen for system theme changes when theme is 'auto'
  useEffect(() => {
    if (!isInitialized) return;

    const cleanup = createSystemThemeListener((systemTheme) => {
      if (theme === 'auto') {
        setActualTheme(systemTheme);
        applyTheme(systemTheme);
      }
    });

    return cleanup || undefined;
  }, [theme, isInitialized]);

  // Update actual theme when theme preference changes
  useEffect(() => {
    if (!isInitialized) return;

    const resolvedTheme = resolveActualTheme(theme);
    setActualTheme(resolvedTheme);
    applyTheme(resolvedTheme);
  }, [theme, isInitialized]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = getNextTheme(theme);
    setTheme(nextTheme);
  };

  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
} 