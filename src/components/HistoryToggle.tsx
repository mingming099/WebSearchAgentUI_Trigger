"use client";

import { HistoryToggleProps } from '@/types/websearch';

export default function HistoryToggle({ onClick, historyCount, isOpen }: HistoryToggleProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg transition-all duration-200 theme-transition"
      style={{
        backgroundColor: isOpen ? 'var(--color-primary)' : 'var(--color-surface-hover)',
        color: isOpen ? 'var(--color-text-inverse)' : 'var(--color-text)',
        borderColor: 'var(--color-border)',
        borderWidth: '1px',
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isOpen) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
        }
      }}
      aria-label={`${isOpen ? 'Close' : 'Open'} search history (${historyCount} entries)`}
      title={`Search History (${historyCount} entries)`}
    >
      {/* History Icon */}
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
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>

      {/* Badge for history count */}
      {historyCount > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs font-medium rounded-full flex items-center justify-center theme-transition"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-text-inverse)',
            fontSize: '10px',
          }}
        >
          {historyCount > 99 ? '99+' : historyCount}
        </span>
      )}
    </button>
  );
} 