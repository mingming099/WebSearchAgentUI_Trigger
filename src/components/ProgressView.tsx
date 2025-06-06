"use client";

import { ProgressViewProps } from "@/types/websearch";
import { formatRelativeTime } from "@/lib/utils";

export default function ProgressView({ metadata, isVisible, onCancel, isCanceling }: ProgressViewProps) {
  if (!isVisible) return null;

  const handleCancel = () => {
    if (!onCancel || isCanceling) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to cancel this search? This action cannot be undone.'
    );
    
    if (confirmed) {
      onCancel();
    }
  };

  const { 
    progress, 
    currentAction, 
    actionHistory, 
    currentIteration, 
    totalIterations, 
    lastUpdated 
  } = metadata;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 theme-transition" style={{ color: 'var(--color-text)' }}>
          Searching the Web
        </h2>
        <p className="text-sm theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
          Iteration {currentIteration} of {totalIterations}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium theme-transition" style={{ color: 'var(--color-text)' }}>
            Progress
          </span>
          <span className="text-sm theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div 
          className="w-full rounded-full h-3 overflow-hidden theme-transition"
          style={{ backgroundColor: 'var(--color-progress-bg)' }}
        >
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              background: 'linear-gradient(to right, var(--color-progress-fill), var(--color-primary-hover))'
            }}
          />
        </div>
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <div className="flex justify-center">
          <button
            onClick={handleCancel}
            disabled={isCanceling}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 theme-transition"
            style={{
              backgroundColor: isCanceling ? 'var(--color-surface-hover)' : 'var(--color-error)',
              color: isCanceling ? 'var(--color-text-secondary)' : 'var(--color-text-inverse)',
              borderColor: 'var(--color-error)',
              borderWidth: '1px',
              cursor: isCanceling ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isCanceling) {
                e.currentTarget.style.backgroundColor = 'var(--color-error-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCanceling) {
                e.currentTarget.style.backgroundColor = 'var(--color-error)';
              }
            }}
            aria-label={isCanceling ? 'Canceling search...' : 'Cancel search'}
          >
            {isCanceling ? (
              <div className="flex items-center gap-2">
                <svg 
                  className="animate-spin w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Canceling...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
                Cancel Search
              </div>
            )}
          </button>
        </div>
      )}

      {/* Current Action */}
      {currentAction && (
        <div 
          className="rounded-lg p-4 theme-transition" 
          style={{ 
            backgroundColor: 'var(--color-info-bg)', 
            borderColor: 'var(--color-info)',
            borderWidth: '1px'
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg 
                className="animate-spin w-5 h-5" 
                style={{ color: 'var(--color-info)' }}
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-1 theme-transition" style={{ color: 'var(--color-info)' }}>
                Current Action
              </h3>
              <p className="text-sm theme-transition" style={{ color: 'var(--color-info)' }}>
                {currentAction}
              </p>
              {lastUpdated && (
                <p className="text-xs mt-1 theme-transition" style={{ color: 'var(--color-info)' }}>
                  Last updated: {formatRelativeTime(lastUpdated)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action History */}
      {actionHistory && actionHistory.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2 theme-transition" style={{ color: 'var(--color-text)' }}>
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Action History
          </h3>
          
          <div 
            className="rounded-lg p-4 max-h-64 overflow-y-auto theme-transition" 
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="space-y-3">
              {actionHistory.map((action, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="flex-shrink-0 mt-1">
                    {index === actionHistory.length - 1 ? (
                      // Current/latest action
                      <div 
                        className="w-2 h-2 rounded-full animate-pulse" 
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      />
                    ) : (
                      // Completed action
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: 'var(--color-success)' }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p 
                      className={`theme-transition ${
                        index === actionHistory.length - 1 
                          ? 'font-medium' 
                          : ''
                      }`}
                      style={{ 
                        color: index === actionHistory.length - 1 
                          ? 'var(--color-text)' 
                          : 'var(--color-text-secondary)'
                      }}
                    >
                      {action}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs theme-transition" style={{ color: 'var(--color-text-muted)' }}>
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
        <div className="flex gap-1">
          <div 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: 'var(--color-primary)',
              animationDelay: '0.2s'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-pulse" 
            style={{ 
              backgroundColor: 'var(--color-primary)',
              animationDelay: '0.4s'
            }}
          />
        </div>
        <span>Processing your search request...</span>
      </div>
    </div>
  );
} 