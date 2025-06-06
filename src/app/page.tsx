"use client";

import { useState, useEffect } from "react";
import { useWebSearch } from "@/hooks/useWebSearch";
import { useAuth } from "@/hooks/useAuth";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useTaskRecovery } from "@/hooks/useTaskRecovery";
import SearchForm from "@/components/SearchForm";
import ProgressView from "@/components/ProgressView";
import ResultView from "@/components/ResultView";
import CancelView from "@/components/CancelView";
import ErrorBoundary from "@/components/ErrorBoundary";
import PasswordAuth from "@/components/PasswordAuth";
import ThemeToggle from "@/components/ThemeToggle";
import MenuButton from "@/components/MenuButton";
import MainMenu from "@/components/MainMenu";
import SearchHistory from "@/components/SearchHistory";
import TaskRecoveryNotification from "@/components/TaskRecoveryNotification";
import { SearchHistoryEntry } from "@/types/websearch";

// View state type for single view management
type ViewState = 'search-form' | 'progress' | 'result' | 'history-result' | 'history-cancel';

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
    hasError,
    isCanceling,
    triggerSearch,
    resetSearch,
    retrySearch,
    cancelTask,
    resumeTask,
  } = useWebSearch(addToHistory);
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<SearchHistoryEntry | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('search-form');



  // Sync currentView with computed view state
  useEffect(() => {
    // Priority 1: History viewing
    if (selectedHistoryEntry) {
      if (selectedHistoryEntry.result) {
        setCurrentView('history-result');
        return;
      }
      if (selectedHistoryEntry.status === 'canceled') {
        setCurrentView('history-cancel');
        return;
      }
    }
    
    // Priority 2: Current search states
    if (stage === 'processing') {
      setCurrentView('progress');
      return;
    }
    if (stage === 'complete' && result) {
      setCurrentView('result');
      return;
    }
    
    // Priority 3: Default
    setCurrentView('search-form');
  }, [stage, result, selectedHistoryEntry]);

  // Handle search submission with model parameters
  const handleSearch = (query: string, model?: string, writeModel?: string) => {
    // Clear any selected history entry when starting a new search
    setSelectedHistoryEntry(null);
    triggerSearch(query, model, writeModel);
  };

  // Menu handlers
  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleNewSearch = () => {
    resetSearch();
    setSelectedHistoryEntry(null);
  };

  const handleOpenHistory = () => {
    setShowHistory(true);
  };

  const handleOpenMarkdownViewer = () => {
    // TODO: Implement markdown viewer functionality
    console.log('Markdown viewer will be implemented later');
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
    if (!publicAccessToken) {
      console.error('Cannot resume task without publicAccessToken');
      return;
    }

    // Get the history entry to restore the query
    const historyEntry = entries.find(entry => entry.runId === runId);
    if (!historyEntry) {
      console.error('Cannot find history entry for runId:', runId);
      return;
    }

    // Resume the task monitoring
    resumeTask(runId, publicAccessToken, historyEntry.query);
    setShowHistory(false);
  };

  const handleCancelTask = () => {
    cancelTask();
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
              {/* Left side - Menu Button */}
              <div className="flex items-center gap-3">
                <MenuButton
                  onClick={handleToggleMenu}
                  isOpen={showMenu}
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
              onViewHistory={handleOpenHistory}
            />
            
            {/* Error Display - Always visible when there's an error */}
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
            
            {/* Single View Rendering */}
            {currentView === 'search-form' && (
              <SearchForm
                onSubmit={handleSearch}
                isLoading={searchLoading}
                disabled={searchLoading}
              />
            )}

            {currentView === 'progress' && (
              <ProgressView
                metadata={progress}
                isVisible={true}
                onCancel={handleCancelTask}
                isCanceling={isCanceling}
              />
            )}

            {currentView === 'result' && result && (
              <ResultView
                result={result}
                onNewSearch={resetSearch}
                isVisible={true}
              />
            )}

            {currentView === 'history-result' && selectedHistoryEntry?.result && (
              <ResultView
                result={selectedHistoryEntry.result}
                onNewSearch={handleBackToCurrentResult}
                isVisible={true}
              />
            )}

            {currentView === 'history-cancel' && selectedHistoryEntry && (
              <CancelView
                entry={selectedHistoryEntry}
                onRetry={handleSearch}
                onNewSearch={handleBackToCurrentResult}
                isVisible={true}
              />
            )}

            {/* Current Query Display - Only show during active searches */}
            {(currentView === 'progress' || currentView === 'result') && query && (
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

        {/* Main Menu Panel */}
        <MainMenu
          isOpen={showMenu}
          onClose={() => setShowMenu(false)}
          onNewSearch={handleNewSearch}
          onOpenHistory={handleOpenHistory}
          onOpenMarkdownViewer={handleOpenMarkdownViewer}
          historyCount={entryCount}
        />

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
