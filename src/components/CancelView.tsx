"use client";

import { SearchHistoryEntry } from "@/types/websearch";

interface CancelViewProps {
  entry: SearchHistoryEntry;
  onRetry: (query: string) => void;
  onNewSearch: () => void;
  isVisible: boolean;
}

export default function CancelView({ entry, onRetry, onNewSearch, isVisible }: CancelViewProps) {
  if (!isVisible || !entry) return null;

  const handleRetry = () => {
    onRetry(entry.query);
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Cancel Header */}
      <div className="text-center">
        <div 
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 theme-transition"
          style={{ backgroundColor: 'var(--color-warning-bg)' }}
        >
          <svg 
            className="w-6 h-6" 
            style={{ color: 'var(--color-warning)' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 theme-transition" style={{ color: 'var(--color-text)' }}>
          Search Canceled
        </h2>
        <p className="theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
          This search was canceled before completion
        </p>
      </div>

      {/* Original Query Card */}
      <div 
        className="rounded-lg shadow-sm theme-transition" 
        style={{ 
          backgroundColor: 'var(--color-card)', 
          borderColor: 'var(--color-border)',
          borderWidth: '1px'
        }}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 theme-transition" style={{ color: 'var(--color-text)' }}>
            <svg 
              className="w-5 h-5" 
              style={{ color: 'var(--color-primary)' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            Original Search Query
          </h3>
          <div 
            className="p-4 rounded-lg theme-transition"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              borderWidth: '1px'
            }}
          >
            <p className="text-lg theme-transition" style={{ color: 'var(--color-text)' }}>
              &ldquo;{entry.query}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Task Details */}
      <div 
        className="rounded-lg shadow-sm theme-transition" 
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderColor: 'var(--color-border)',
          borderWidth: '1px'
        }}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 theme-transition" style={{ color: 'var(--color-text)' }}>
            <svg 
              className="w-5 h-5" 
              style={{ color: 'var(--color-text-secondary)' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Task Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
                Status:
              </span>
              <div className="mt-1 flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: 'var(--color-warning)' }}
                />
                <span className="theme-transition" style={{ color: 'var(--color-text)' }}>
                  Canceled
                </span>
              </div>
            </div>
            
            <div>
              <span className="font-medium theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
                Started:
              </span>
              <div className="mt-1 theme-transition" style={{ color: 'var(--color-text)' }}>
                {formatTimestamp(entry.timestamp)}
              </div>
            </div>
            
            {entry.completedAt && (
              <div>
                <span className="font-medium theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
                  Canceled:
                </span>
                <div className="mt-1 theme-transition" style={{ color: 'var(--color-text)' }}>
                  {formatTimestamp(entry.completedAt)}
                </div>
              </div>
            )}
            
            <div>
              <span className="font-medium theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
                Run ID:
              </span>
              <div className="mt-1 font-mono text-xs theme-transition" style={{ color: 'var(--color-text)' }}>
                {entry.runId}
              </div>
            </div>
            
            {(entry.model || entry.writeModel) && (
              <div className="md:col-span-2">
                <span className="font-medium theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
                  Models Used:
                </span>
                <div className="mt-1 space-y-1">
                  {entry.model && (
                    <div className="theme-transition" style={{ color: 'var(--color-text)' }}>
                      Search Model: {entry.model}
                    </div>
                  )}
                  {entry.writeModel && (
                    <div className="theme-transition" style={{ color: 'var(--color-text)' }}>
                      Write Model: {entry.writeModel}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {entry.error && (
            <div className="mt-4 p-3 rounded-lg theme-transition" style={{ 
              backgroundColor: 'var(--color-error-bg)',
              borderColor: 'var(--color-error)',
              borderWidth: '1px'
            }}>
              <div className="flex items-start gap-2">
                <svg 
                  className="w-4 h-4 mt-0.5 flex-shrink-0" 
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
                <div>
                  <div className="font-medium text-sm theme-transition" style={{ color: 'var(--color-error)' }}>
                    Cancellation Reason
                  </div>
                  <div className="text-sm mt-1 theme-transition" style={{ color: 'var(--color-error)' }}>
                    {entry.error}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleRetry}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 theme-transition"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          Retry This Search
        </button>
        
        <button
          onClick={onNewSearch}
          className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 theme-transition"
          style={{
            backgroundColor: 'var(--color-surface-hover)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
            borderWidth: '1px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
          }}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          New Search
        </button>
      </div>
    </div>
  );
} 