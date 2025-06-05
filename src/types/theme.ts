export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface ThemeConfig {
  storageKey: string;
  defaultTheme: Theme;
  enableTransitions: boolean;
}

export interface SystemThemePreference {
  matches: boolean;
  addEventListener: (type: string, listener: (e: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: string, listener: (e: MediaQueryListEvent) => void) => void;
} 