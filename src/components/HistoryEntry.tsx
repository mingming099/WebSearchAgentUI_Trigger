"use client";

import { HistoryEntryProps } from '@/types/websearch';
import TaskStatusBadge from './TaskStatusBadge';

// Helper function to format timestamp
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Helper function to truncate query text
function truncateQuery(query: string, maxLength: number = 60): string {
  if (query.length <= maxLength) {
    return query;
  }
  return query.substring(0, maxLength) + '...';
}

export default function HistoryEntry({ entry, onSelect, onDelete }: HistoryEntryProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onSelect
    onDelete();
  };

  return (
    <div
      className="group p-3 rounded-lg cursor-pointer transition-all duration-200 theme-transition"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderWidth: '1px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface)';
      }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`View search result for: ${entry.query}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Query and metadata */}
        <div className="flex-1 min-w-0">
          <div
            className="font-medium text-sm mb-1 theme-transition"
            style={{ color: 'var(--color-text)' }}
            title={entry.query}
          >
            {truncateQuery(entry.query)}
          </div>
          
          <div className="flex items-center gap-2 text-xs mb-2">
            <TaskStatusBadge status={entry.status} size="sm" />
            <span
              className="theme-transition"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {formatTimestamp(entry.timestamp)}
            </span>
            
            {entry.model && (
              <>
                <span
                  className="theme-transition"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  •
                </span>
                <span
                  className="theme-transition"
                  style={{ color: 'var(--color-text-secondary)' }}
                  title={`Model: ${entry.model}`}
                >
                  {entry.model}
                </span>
              </>
            )}
          </div>
          
          {/* Show error message if failed */}
          {entry.error && (
            <div className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
              {entry.error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* View button */}
          <button
            onClick={onSelect}
            className="p-1.5 rounded transition-colors theme-transition"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            aria-label="View this search result"
            title="View result"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded transition-colors theme-transition"
            style={{
              backgroundColor: 'var(--color-error)',
              color: 'var(--color-text-inverse)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            aria-label="Delete this search from history"
            title="Delete from history"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 