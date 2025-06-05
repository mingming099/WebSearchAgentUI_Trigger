import { useThemeContext } from '@/contexts/ThemeContext';
import { Theme } from '@/types/theme';

/**
 * Hook for consuming theme context
 * Provides theme state and control functions
 */
export function useTheme() {
  const context = useThemeContext();
  
  return {
    /** Current theme preference (light/dark/auto) */
    theme: context.theme,
    
    /** Actual resolved theme (light/dark) */
    actualTheme: context.actualTheme,
    
    /** Set theme preference */
    setTheme: context.setTheme,
    
    /** Toggle through themes (light -> dark -> auto -> light) */
    toggleTheme: context.toggleTheme,
    
    /** Check if current theme is light */
    isLight: context.actualTheme === 'light',
    
    /** Check if current theme is dark */
    isDark: context.actualTheme === 'dark',
    
    /** Check if theme preference is set to auto */
    isAuto: context.theme === 'auto',
  };
}

/**
 * Type guard to check if a value is a valid theme
 */
export function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && ['light', 'dark', 'auto'].includes(value);
} 