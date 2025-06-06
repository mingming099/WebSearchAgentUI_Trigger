"use client";

import { useState } from "react";
import { useWebSearch } from "@/hooks/useWebSearch";
import { useAuth } from "@/hooks/useAuth";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useTaskRecovery } from "@/hooks/useTaskRecovery";
import SearchForm from "@/components/SearchForm";
import ProgressView from "@/components/ProgressView";
import ResultView from "@/components/ResultView";
import ErrorBoundary from "@/components/ErrorBoundary";
import PasswordAuth from "@/components/PasswordAuth";
import ThemeToggle from "@/components/ThemeToggle";
import HistoryToggle from "@/components/HistoryToggle";
import SearchHistory from "@/components/SearchHistory";
import TaskRecoveryNotification from "@/components/TaskRecoveryNotification";
import { SearchHistoryEntry } from "@/types/websearch";

export default function Home() {
  const { isAuthenticated, isLoading, authenticate } = useAuth();
  
  // History state and functionality
  const historyHook = useSearchHistory();
  const { entries, entryCount, deleteEntry, clearAllHistory, addToHistory } = historyHook;

  // Task recovery functionality
  const { 
    recoverableTasks, 
    isChecking
  } = useTaskRecovery();

  const {
    stage,
    query,
    progress,
    result,
    error,
    isLoading: searchLoading,
    isComplete,
    hasError,
    isIdle,
    triggerSearch,
    resetSearch,
    retrySearch,
  } = useWebSearch(addToHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<SearchHistoryEntry | null>(null);



  // Handle search submission with model parameters
  const handleSearch = (query: string, model?: string, writeModel?: string) => {
    // Clear any selected history entry when starting a new search
    setSelectedHistoryEntry(null);
    triggerSearch(query, model, writeModel);
  };

  // History handlers
  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleSelectHistoryEntry = (entry: SearchHistoryEntry) => {
    setSelectedHistoryEntry(entry);
    setShowHistory(false); // Close history panel
  };

  const handleDeleteHistoryEntry = (id: string) => {
    deleteEntry(id);
  };

  const handleClearHistory = () => {
    clearAllHistory();
  };

  const handleBackToCurrentResult = () => {
    setSelectedHistoryEntry(null);
  };

  const handleResumeTask = (runId: string, publicAccessToken?: string) => {
    // TODO: Implement task resumption logic
    // This would involve setting up the real-time monitoring again
    console.log('Resuming task:', runId, publicAccessToken);
    // For now, just close history and show a message
    setShowHistory(false);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-transition" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div style={{ color: 'var(--color-text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  // If not authenticated, show password screen
  if (!isAuthenticated) {
    return <PasswordAuth onAuthenticated={authenticate} />;
  }

  // Main content when authenticated
  return (
    <ErrorBoundary>
      <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--color-surface)' }}>
        {/* Header */}
        <header className="theme-transition" style={{ 
          backgroundColor: 'var(--color-header-bg)', 
          borderBottomColor: 'var(--color-header-border)',
          borderBottomWidth: '1px'
        }}>
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {/* Left side - History Toggle */}
              <div className="flex items-center gap-3">
                <HistoryToggle
                  onClick={handleToggleHistory}
                  historyCount={entryCount}
                  isOpen={showHistory}
                />
              </div>
              
              {/* Center - Title */}
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                  Web Search Agent
                </h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Powered by Trigger.dev - Ask anything and get comprehensive answers from the web
                </p>
              </div>
              
              {/* Right side - Theme Toggle */}
              <div className="flex items-center gap-3">
                <ThemeToggle size="md" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-8">
            
            {/* Task Recovery Notification */}
            <TaskRecoveryNotification
              recoverableTasks={recoverableTasks}
              isChecking={isChecking}
              onViewHistory={() => setShowHistory(true)}
            />
            
            {/* Search Form - Always visible but disabled during processing */}
            {(isIdle || hasError) && (
              <div className="space-y-4">
                <SearchForm
                  onSubmit={handleSearch}
                  isLoading={searchLoading}
                  disabled={searchLoading}
                />
                
                {/* Error Display */}
                {hasError && error && (
                  <div className="rounded-lg p-4 theme-transition" style={{ 
                    backgroundColor: 'var(--color-error-bg)', 
                    borderColor: 'var(--color-error)',
                    borderWidth: '1px'
                  }}>
                    <div className="flex items-start gap-3">
                      <svg 
                        className="w-5 h-5 mt-0.5 flex-shrink-0" 
                        style={{ color: 'var(--color-error)' }}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--color-error)' }}>
                          Search Failed
                        </h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--color-error)' }}>
                          {error}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={retrySearch}
                            className="px-3 py-1.5 text-sm rounded transition-colors theme-transition"
                            style={{ 
                              backgroundColor: 'var(--color-error)',
                              color: 'var(--color-text-inverse)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = '0.9';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '1';
                            }}
                          >
                            Retry Search
                          </button>
                          <button
                            onClick={resetSearch}
                            className="px-3 py-1.5 text-sm rounded transition-colors theme-transition"
                            style={{ 
                              backgroundColor: 'var(--color-surface-hover)',
                              color: 'var(--color-text)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                            }}
                          >
                            New Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress View - Shown during processing */}
            <ProgressView
              metadata={progress}
              isVisible={stage === 'processing'}
            />

            {/* Result View - Shown when complete or viewing history */}
            {selectedHistoryEntry && selectedHistoryEntry.result ? (
              <ResultView
                result={selectedHistoryEntry.result}
                onNewSearch={handleBackToCurrentResult}
                isVisible={true}
              />
            ) : result && isComplete ? (
              <ResultView
                result={result}
                onNewSearch={resetSearch}
                isVisible={isComplete}
              />
            ) : null}

            {/* Current Query Display - Shown during processing and completion */}
            {(stage === 'processing' || stage === 'complete') && query && (
              <div className="rounded-lg p-4 theme-transition" style={{ 
                backgroundColor: 'var(--color-info-bg)', 
                borderColor: 'var(--color-info)',
                borderWidth: '1px'
              }}>
                <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--color-info)' }}>
                  Current Search Query
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-info)' }}>
                  &ldquo;{query}&rdquo;
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 theme-transition" style={{ 
          backgroundColor: 'var(--color-footer-bg)', 
          borderTopColor: 'var(--color-footer-border)',
          borderTopWidth: '1px'
        }}>
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <p>
                Built with{" "}
                <a 
                  href="https://trigger.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline transition-colors theme-transition"
                  style={{ color: 'var(--color-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                >
                  Trigger.dev
                </a>
                {" "}and{" "}
                <a 
                  href="https://nextjs.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline transition-colors theme-transition"
                  style={{ color: 'var(--color-primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                >
                  Next.js
                </a>
              </p>
            </div>
          </div>
        </footer>

        {/* Search History Panel */}
        <SearchHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          entries={entries}
          onSelectEntry={handleSelectHistoryEntry}
          onDeleteEntry={handleDeleteHistoryEntry}
          onClearHistory={handleClearHistory}
          onResumeTask={handleResumeTask}
        />
      </div>
    </ErrorBoundary>
  );
}
