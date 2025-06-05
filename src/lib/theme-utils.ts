import { Theme } from '@/types/theme';

const THEME_STORAGE_KEY = 'websearch-agent-theme';

/**
 * Get the stored theme preference from localStorage
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isValidTheme(stored)) {
      return stored as Theme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  
  return null;
}

/**
 * Store theme preference in localStorage
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to store theme in localStorage:', error);
  }
}

/**
 * Get system theme preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    console.warn('Failed to detect system theme:', error);
    return 'light';
  }
}

/**
 * Create system theme media query listener
 */
export function createSystemThemeListener(callback: (theme: 'light' | 'dark') => void) {
  if (typeof window === 'undefined') return null;
  
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', listener);
    
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  } catch (error) {
    console.warn('Failed to create system theme listener:', error);
    return null;
  }
}

/**
 * Validate if a string is a valid theme
 */
export function isValidTheme(theme: string): theme is Theme {
  return ['light', 'dark', 'auto'].includes(theme);
}

/**
 * Resolve actual theme from theme preference
 */
export function resolveActualTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'auto') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  
  try {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Also update the class for compatibility
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  } catch (error) {
    console.warn('Failed to apply theme to document:', error);
  }
}

/**
 * Get next theme in cycle (light -> dark -> auto -> light)
 */
export function getNextTheme(currentTheme: Theme): Theme {
  switch (currentTheme) {
    case 'light':
      return 'dark';
    case 'dark':
      return 'auto';
    case 'auto':
      return 'light';
    default:
      return 'light';
  }
} 