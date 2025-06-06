import { SearchHistory, SearchHistoryEntry, WebSearchOutput } from '@/types/websearch';

const STORAGE_KEY = 'websearch-history';
const MAX_ENTRIES = 50;

// Default empty history
const defaultHistory: SearchHistory = {
  entries: [],
  maxEntries: MAX_ENTRIES,
};

// Helper function to dispatch custom event for UI refresh
function dispatchHistoryUpdateEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('websearch-history-updated'));
  }
}

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

// Validate history data structure - Updated for new schema
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
    
    // Check required fields for new schema
    const hasRequiredFields = (
      typeof entryObj.id === 'string' &&
      typeof entryObj.query === 'string' &&
      typeof entryObj.runId === 'string' &&
      typeof entryObj.status === 'string' &&
      typeof entryObj.timestamp === 'number'
    );
    
    // Check valid status values
    const validStatuses = ['processing', 'complete', 'failed', 'canceled'];
    const hasValidStatus = validStatuses.includes(entryObj.status as string);
    
    return hasRequiredFields && hasValidStatus;
  });
}

// Migrate old history entries to new schema
function migrateHistoryEntry(oldEntry: Record<string, unknown>): SearchHistoryEntry | null {
  try {
    // Check if it's already in new format
    if (oldEntry.runId && oldEntry.status) {
      return oldEntry as unknown as SearchHistoryEntry;
    }
    
    // Migrate old format to new format
    if (oldEntry.result && typeof oldEntry.result === 'object' && 
        typeof oldEntry.id === 'string' &&
        typeof oldEntry.query === 'string' &&
        typeof oldEntry.timestamp === 'number') {
      return {
        id: oldEntry.id,
        query: oldEntry.query,
        runId: `migrated-${oldEntry.id}`, // Generate a placeholder runId
        status: 'complete' as const,
        result: oldEntry.result as WebSearchOutput,
        timestamp: oldEntry.timestamp,
        completedAt: oldEntry.timestamp,
        model: typeof oldEntry.model === 'string' ? oldEntry.model : undefined,
        writeModel: typeof oldEntry.writeModel === 'string' ? oldEntry.writeModel : undefined,
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to migrate history entry:', error);
    return null;
  }
}

// Load search history from localStorage with migration support
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
    
    // Try to validate with new schema first
    if (validateHistoryData(parsed)) {
      return parsed;
    }
    
    // If validation fails, try to migrate old entries
    console.log('Migrating old history format to new schema...');
    if (parsed && Array.isArray(parsed.entries)) {
      const migratedEntries = parsed.entries
        .map((entry: unknown) => migrateHistoryEntry(entry as Record<string, unknown>))
        .filter((entry: SearchHistoryEntry | null): entry is SearchHistoryEntry => entry !== null);
      
      const migratedHistory: SearchHistory = {
        entries: migratedEntries,
        maxEntries: parsed.maxEntries || MAX_ENTRIES,
      };
      
      // Save migrated history
      saveSearchHistory(migratedHistory);
      return migratedHistory;
    }
    
    console.warn('Could not migrate history data, using default');
    return defaultHistory;
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
    dispatchHistoryUpdateEvent();
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
        dispatchHistoryUpdateEvent();
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

// NEW: Add processing entry immediately when task is triggered
export function addProcessingEntry(
  query: string, 
  runId: string, 
  model?: string, 
  writeModel?: string
): SearchHistoryEntry {
  const entry: SearchHistoryEntry = {
    id: generateHistoryId(),
    query: query.trim(),
    runId,
    status: 'processing',
    timestamp: Date.now(),
    model,
    writeModel,
  };

  const currentHistory = loadSearchHistory();
  
  // Remove any existing entry with the same runId to prevent duplicates
  const filteredEntries = currentHistory.entries.filter(e => e.runId !== runId);
  
  // Add new entry at the beginning (most recent first)
  const newEntries = [entry, ...filteredEntries];
  
  // Trim to max entries
  const trimmedEntries = newEntries.slice(0, currentHistory.maxEntries);
  
  const newHistory: SearchHistory = {
    ...currentHistory,
    entries: trimmedEntries,
  };
  
  saveSearchHistory(newHistory);
  
  return entry;
}

// NEW: Update history entry status (for task completion/failure)
export function updateHistoryEntryStatus(
  runId: string, 
  status: 'complete' | 'failed' | 'canceled',
  result?: WebSearchOutput,
  error?: string
): SearchHistory {
  const currentHistory = loadSearchHistory();
  
  const updatedEntries = currentHistory.entries.map(entry => {
    if (entry.runId === runId) {
      return {
        ...entry,
        status,
        result,
        error,
        completedAt: Date.now(),
      };
    }
    return entry;
  });
  
  const newHistory: SearchHistory = {
    ...currentHistory,
    entries: updatedEntries,
  };
  
  saveSearchHistory(newHistory);
  
  return newHistory;
}

// NEW: Get all processing entries
export function getProcessingEntries(): SearchHistoryEntry[] {
  const history = loadSearchHistory();
  return history.entries.filter(entry => entry.status === 'processing');
}

// NEW: Get entry by runId
export function getHistoryEntryByRunId(runId: string): SearchHistoryEntry | undefined {
  const history = loadSearchHistory();
  return history.entries.find(entry => entry.runId === runId);
}

// Add new entry to history (updated for new schema)
export function addHistoryEntry(entry: SearchHistoryEntry): SearchHistory {
  const currentHistory = loadSearchHistory();
  
  // Remove any existing entry with the same runId to prevent duplicates
  const filteredEntries = currentHistory.entries.filter(e => e.runId !== entry.runId);
  
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