"use client";

import { useState } from 'react';
import { TaskRecoveryInfo } from '@/types/websearch';

interface TaskRecoveryNotificationProps {
  recoverableTasks: TaskRecoveryInfo[];
  isChecking: boolean;
  onViewHistory: () => void;
  onDismiss?: () => void;
}

export default function TaskRecoveryNotification({
  recoverableTasks,
  isChecking,
  onViewHistory,
  onDismiss
}: TaskRecoveryNotificationProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || (!isChecking && recoverableTasks.length === 0)) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="rounded-lg p-4 theme-transition" style={{ 
      backgroundColor: 'var(--color-warning-bg)', 
      borderColor: 'var(--color-warning)',
      borderWidth: '1px'
    }}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          {isChecking ? (
            <svg 
              className="w-5 h-5 mt-0.5 animate-spin" 
              style={{ color: 'var(--color-warning)' }}
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
          ) : (
            <svg 
              className="w-5 h-5 mt-0.5" 
              style={{ color: 'var(--color-warning)' }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--color-warning)' }}>
            {isChecking ? 'Checking for Running Tasks...' : 'Running Tasks Found'}
          </h3>
          
          {isChecking ? (
            <p className="text-sm" style={{ color: 'var(--color-warning)' }}>
              Checking if you have any tasks that are still running...
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm" style={{ color: 'var(--color-warning)' }}>
                Found {recoverableTasks.length} task{recoverableTasks.length > 1 ? 's' : ''} that may still be running:
              </p>
              
              {/* Task List */}
              <div className="space-y-1">
                {recoverableTasks.slice(0, 3).map((task) => (
                  <div 
                    key={task.runId}
                    className="text-xs p-2 rounded theme-transition"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      borderWidth: '1px'
                    }}
                  >
                    <div className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                      &ldquo;{task.query}&rdquo;
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      Started {formatTimeAgo(task.timestamp)}
                    </div>
                  </div>
                ))}
                
                {recoverableTasks.length > 3 && (
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    +{recoverableTasks.length - 3} more task{recoverableTasks.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-start gap-2">
          {!isChecking && (
            <button
              onClick={onViewHistory}
              className="px-3 py-1.5 text-sm rounded transition-colors theme-transition"
              style={{ 
                backgroundColor: 'var(--color-warning)',
                color: 'var(--color-text-inverse)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              View History
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="p-1 rounded transition-colors theme-transition"
            style={{ 
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 