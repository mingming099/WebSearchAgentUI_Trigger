"use client";

import { useState } from 'react';
import { SearchHistoryProps } from '@/types/websearch';
import HistoryEntry from './HistoryEntry';
import ProcessingTaskItem from './ProcessingTaskItem';

export default function SearchHistory({
  isOpen,
  onClose,
  entries,
  onSelectEntry,
  onDeleteEntry,
  onClearHistory,
  onResumeTask,
}: SearchHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'processing' | 'complete' | 'failed' | 'canceled'>('all');

  // Filter entries based on search term and status
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Separate processing and completed entries for better organization
  const processingEntries = filteredEntries.filter(entry => entry.status === 'processing');
  const completedEntries = filteredEntries.filter(entry => entry.status !== 'processing');

  const handleClearHistory = () => {
    if (showClearConfirm) {
      onClearHistory();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  const handleCancelClear = () => {
    setShowClearConfirm(false);
  };

  // Close panel when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-500 ease-out theme-transition ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--color-background)',
          borderRightColor: 'var(--color-border)',
          borderRightWidth: '1px',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 theme-transition"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderBottomColor: 'var(--color-border)',
            borderBottomWidth: '1px',
          }}
        >
          <h2
            className="text-lg font-semibold theme-transition"
            style={{ color: 'var(--color-text)' }}
          >
            Search History
          </h2>
          
          <div className="flex items-center gap-2">
            {/* Clear all button */}
            {entries.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-3 py-1.5 text-sm rounded transition-colors theme-transition"
                style={{
                  backgroundColor: showClearConfirm ? 'var(--color-error)' : 'var(--color-surface-hover)',
                  color: showClearConfirm ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (!showClearConfirm) {
                    e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showClearConfirm) {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                  }
                }}
                title={showClearConfirm ? 'Click again to confirm' : 'Clear all history'}
              >
                {showClearConfirm ? 'Confirm Clear' : 'Clear All'}
              </button>
            )}

            {/* Cancel clear button */}
            {showClearConfirm && (
              <button
                onClick={handleCancelClear}
                className="px-3 py-1.5 text-sm rounded transition-colors theme-transition"
                style={{
                  backgroundColor: 'var(--color-surface-hover)',
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                }}
              >
                Cancel
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors theme-transition"
              style={{
                backgroundColor: 'var(--color-surface-hover)',
                color: 'var(--color-text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              }}
              aria-label="Close history panel"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Filter bar */}
        {entries.length > 0 && (
          <div className="p-4 space-y-3">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg transition-colors theme-transition"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  borderWidth: '1px',
                  color: 'var(--color-text)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            {/* Status filter */}
            <div className="flex gap-2 overflow-x-auto">
              {(['all', 'processing', 'complete', 'failed', 'canceled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors theme-transition"
                  style={{
                    backgroundColor: statusFilter === status ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: statusFilter === status ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                    borderColor: statusFilter === status ? 'var(--color-primary)' : 'var(--color-border)',
                    borderWidth: '1px'
                  }}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {entries.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M12 7v5l4 2" />
              </svg>
              <h3
                className="text-lg font-medium mb-2 theme-transition"
                style={{ color: 'var(--color-text)' }}
              >
                No Search History
              </h3>
              <p
                className="text-sm theme-transition"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Your search results will appear here after you perform searches.
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            // No search results
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <h3
                className="text-lg font-medium mb-2 theme-transition"
                style={{ color: 'var(--color-text)' }}
              >
                No Results Found
              </h3>
              <p
                className="text-sm theme-transition"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                No search history matches &ldquo;{searchTerm}&rdquo;.
              </p>
            </div>
          ) : (
            // History entries
            <div className="space-y-4">
              {/* Processing tasks section */}
              {processingEntries.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    Running Tasks ({processingEntries.length})
                  </h3>
                  <div className="space-y-3">
                    {processingEntries.map((entry) => (
                      <ProcessingTaskItem
                        key={entry.id}
                        entry={entry}
                        onResume={onResumeTask}
                        onViewResult={onSelectEntry}
                        onDelete={onDeleteEntry}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed tasks section */}
              {completedEntries.length > 0 && (
                <div>
                  {processingEntries.length > 0 && (
                    <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      Completed Tasks ({completedEntries.length})
                    </h3>
                  )}
                  <div className="space-y-3">
                    {completedEntries.map((entry) => (
                      <HistoryEntry
                        key={entry.id}
                        entry={entry}
                        onSelect={() => onSelectEntry(entry)}
                        onDelete={() => onDeleteEntry(entry.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with entry count */}
        {entries.length > 0 && (
          <div
            className="p-4 text-center theme-transition"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderTopColor: 'var(--color-border)',
              borderTopWidth: '1px',
            }}
          >
            <p
              className="text-sm theme-transition"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {filteredEntries.length} of {entries.length} searches
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </>
  );
} 