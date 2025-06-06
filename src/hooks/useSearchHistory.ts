import { useState, useEffect, useCallback } from 'react';
import { SearchHistory, SearchHistoryEntry, WebSearchOutput } from '@/types/websearch';
import {
  loadSearchHistory,
  addHistoryEntry,
  deleteHistoryEntry,
  clearHistory,
  generateHistoryId,
  getProcessingEntries,
  getHistoryEntryByRunId,
} from '@/lib/localStorage';

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistory>(() => loadSearchHistory());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manual refresh function
  const refreshHistory = useCallback(() => {
    try {
      const loadedHistory = loadSearchHistory();
      setHistory(loadedHistory);
    } catch (err) {
      console.error('Failed to refresh search history:', err);
      setError('Failed to refresh search history');
    }
  }, []);

  // Load history on mount and when localStorage changes
  useEffect(() => {
    try {
      const loadedHistory = loadSearchHistory();
      setHistory(loadedHistory);
    } catch (err) {
      console.error('Failed to load search history:', err);
      setError('Failed to load search history');
    }
  }, []);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'websearch-history') {
        try {
          const loadedHistory = loadSearchHistory();
          setHistory(loadedHistory);
        } catch (err) {
          console.error('Failed to sync history from storage:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom events to refresh history in same tab
  useEffect(() => {
    const handleHistoryUpdate = () => {
      refreshHistory();
    };

    window.addEventListener('websearch-history-updated', handleHistoryUpdate);
    return () => window.removeEventListener('websearch-history-updated', handleHistoryUpdate);
  }, [refreshHistory]);

  // Add new search result to history (legacy function - now mostly replaced by immediate saving)
  const addToHistory = useCallback((
    query: string,
    result: WebSearchOutput,
    model?: string,
    writeModel?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const entry: SearchHistoryEntry = {
        id: generateHistoryId(),
        query,
        runId: `legacy-${generateHistoryId()}`, // Generate a placeholder runId for legacy entries
        status: 'complete',
        result,
        timestamp: Date.now(),
        completedAt: Date.now(),
        model,
        writeModel,
      };

      const newHistory = addHistoryEntry(entry);
      
      // Update state with the new history
      setHistory(newHistory);
      
      return entry;
    } catch (err) {
      console.error('Failed to add to history:', err);
      setError('Failed to save search to history');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove dependency to prevent recreation

  // Delete entry from history
  const deleteEntry = useCallback((id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const newHistory = deleteHistoryEntry(id);
      setHistory(newHistory);
    } catch (err) {
      console.error('Failed to delete history entry:', err);
      setError('Failed to delete history entry');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear all history
  const clearAllHistory = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      const newHistory = clearHistory();
      setHistory(newHistory);
    } catch (err) {
      console.error('Failed to clear history:', err);
      setError('Failed to clear history');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get entry by ID
  const getEntry = useCallback((id: string): SearchHistoryEntry | undefined => {
    return history.entries.find(entry => entry.id === id);
  }, [history.entries]);

  // Get recent entries (last N entries)
  const getRecentEntries = useCallback((count: number = 5): SearchHistoryEntry[] => {
    return history.entries.slice(0, count);
  }, [history.entries]);

  // Search entries by query text
  const searchEntries = useCallback((searchTerm: string): SearchHistoryEntry[] => {
    if (!searchTerm.trim()) {
      return history.entries;
    }

    const term = searchTerm.toLowerCase();
    return history.entries.filter(entry =>
      entry.query.toLowerCase().includes(term)
    );
  }, [history.entries]);

  // Get processing entries
  const getProcessingHistory = useCallback((): SearchHistoryEntry[] => {
    return getProcessingEntries();
  }, []);

  // Get entry by runId
  const getEntryByRunId = useCallback((runId: string): SearchHistoryEntry | undefined => {
    return getHistoryEntryByRunId(runId);
  }, []);

  // Filter entries by status
  const getEntriesByStatus = useCallback((status: 'processing' | 'complete' | 'failed' | 'canceled'): SearchHistoryEntry[] => {
    return history.entries.filter(entry => entry.status === status);
  }, [history.entries]);

  return {
    // State
    history,
    entries: history.entries,
    entryCount: history.entries.length,
    isLoading,
    error,
    
    // Actions
    addToHistory,
    deleteEntry,
    clearAllHistory,
    refreshHistory,
    
    // Utilities
    getEntry,
    getRecentEntries,
    searchEntries,
    getProcessingHistory,
    getEntryByRunId,
    getEntriesByStatus,
  };
} 