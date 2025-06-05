import { SearchHistory, SearchHistoryEntry } from '@/types/websearch';

const STORAGE_KEY = 'websearch-history';
const MAX_ENTRIES = 50;

// Default empty history
const defaultHistory: SearchHistory = {
  entries: [],
  maxEntries: MAX_ENTRIES,
};

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Validate history data structure
export function validateHistoryData(data: unknown): data is SearchHistory {
  if (!data || typeof data !== 'object' || data === null) {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  if (!Array.isArray(obj.entries) || typeof obj.maxEntries !== 'number') {
    return false;
  }
  
  return obj.entries.every((entry: unknown) => {
    if (!entry || typeof entry !== 'object' || entry === null) {
      return false;
    }
    
    const entryObj = entry as Record<string, unknown>;
    return (
      typeof entryObj.id === 'string' &&
      typeof entryObj.query === 'string' &&
      typeof entryObj.timestamp === 'number' &&
      entryObj.result &&
      typeof entryObj.result === 'object'
    );
  });
}

// Load search history from localStorage
export function loadSearchHistory(): SearchHistory {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, using default history');
    return defaultHistory;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultHistory;
    }

    const parsed = JSON.parse(stored);
    if (!validateHistoryData(parsed)) {
      console.warn('Invalid history data found, using default');
      return defaultHistory;
    }

    return parsed;
  } catch (error) {
    console.error('Error loading search history:', error);
    return defaultHistory;
  }
}

// Save search history to localStorage
export function saveSearchHistory(history: SearchHistory): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, cannot save history');
    return false;
  }

  try {
    // Ensure we don't exceed the maximum entries
    const trimmedHistory: SearchHistory = {
      ...history,
      entries: history.entries.slice(0, history.maxEntries),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    return true;
  } catch (error) {
    console.error('Error saving search history:', error);
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing old entries');
      try {
        // Try to save with fewer entries
        const reducedHistory: SearchHistory = {
          ...history,
          entries: history.entries.slice(0, Math.floor(history.maxEntries / 2)),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedHistory));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

// Add new entry to history
export function addHistoryEntry(entry: SearchHistoryEntry): SearchHistory {
  const currentHistory = loadSearchHistory();
  
  // Remove any existing entry with the same query to prevent duplicates
  const filteredEntries = currentHistory.entries.filter(e => e.query !== entry.query);
  
  // Add new entry at the beginning (most recent first)
  const newEntries = [entry, ...filteredEntries];
  
  // Trim to max entries
  const trimmedEntries = newEntries.slice(0, currentHistory.maxEntries);
  
  const newHistory: SearchHistory = {
    ...currentHistory,
    entries: trimmedEntries,
  };
  
  saveSearchHistory(newHistory);
  
  return newHistory;
}

// Delete entry by ID
export function deleteHistoryEntry(id: string): SearchHistory {
  const currentHistory = loadSearchHistory();
  
  const newHistory: SearchHistory = {
    ...currentHistory,
    entries: currentHistory.entries.filter(entry => entry.id !== id),
  };
  
  saveSearchHistory(newHistory);
  return newHistory;
}

// Clear all history
export function clearHistory(): SearchHistory {
  const newHistory = defaultHistory;
  saveSearchHistory(newHistory);
  return newHistory;
}

// Get entry by ID
export function getHistoryEntry(id: string): SearchHistoryEntry | undefined {
  const history = loadSearchHistory();
  return history.entries.find(entry => entry.id === id);
}

// Generate unique ID for new entries
export function generateHistoryId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
} 