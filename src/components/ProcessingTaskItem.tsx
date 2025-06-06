"use client";

import { useState } from 'react';
import { SearchHistoryEntry } from '@/types/websearch';
import { useTaskReconnection } from '@/hooks/useTaskReconnection';
import { updateHistoryEntryStatus } from '@/lib/localStorage';
import TaskStatusBadge from './TaskStatusBadge';
import ProcessingIndicator from './ProcessingIndicator';

interface ProcessingTaskItemProps {
  entry: SearchHistoryEntry;
  onResume?: (runId: string, publicAccessToken?: string) => void;
  onViewResult?: (entry: SearchHistoryEntry) => void;
  onDelete?: (id: string) => void;
}

export default function ProcessingTaskItem({
  entry,
  onResume,
  onViewResult,
  onDelete
}: ProcessingTaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { reconnectToTask, isReconnecting, error } = useTaskReconnection();

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleResume = async () => {
    if (!onResume || isReconnecting) return;

    try {
      const reconnection = await reconnectToTask(entry.runId);
      
      if (reconnection.canReconnect && reconnection.publicAccessToken) {
        // Task is still running - resume monitoring
        onResume(entry.runId, reconnection.publicAccessToken);
      } else {
        // Task completed - update localStorage and show result if available
        const status = reconnection.currentStatus.status === 'COMPLETED' ? 'complete' : 
                      reconnection.currentStatus.status === 'FAILED' ? 'failed' : 'canceled';
        
        // Update localStorage which will trigger UI refresh
        updateHistoryEntryStatus(
          entry.runId, 
          status,
          reconnection.currentStatus.output,
          reconnection.currentStatus.error
        );
        
        if (reconnection.currentStatus.output && onViewResult) {
          const updatedEntry: SearchHistoryEntry = {
            ...entry,
            status,
            result: reconnection.currentStatus.output,
            completedAt: Date.now()
          };
          onViewResult(updatedEntry);
        }
      }
    } catch (error) {
      console.error('Failed to resume task:', error);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(entry.id);
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Show different UI based on status
  if (entry.status === 'processing') {
    return (
      <ProcessingIndicator
        runId={entry.runId}
        query={entry.query}
        timestamp={entry.timestamp}
        onResume={handleResume}
        isResuming={isReconnecting}
      />
    );
  }

  // For completed/failed/canceled tasks
  return (
    <div className="rounded-lg p-4 theme-transition" style={{ 
      backgroundColor: 'var(--color-surface)', 
      borderColor: 'var(--color-border)',
      borderWidth: '1px'
    }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <TaskStatusBadge status={entry.status} size="sm" />
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {formatTimeAgo(entry.timestamp)}
            </span>
          </div>
          
          <h3 className="text-sm font-medium truncate mb-1" style={{ color: 'var(--color-text)' }}>
            &ldquo;{entry.query}&rdquo;
          </h3>
          
          {entry.error && (
            <p className="text-xs" style={{ color: 'var(--color-error)' }}>
              {entry.error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {entry.result && onViewResult && (
            <button
              onClick={() => onViewResult(entry)}
              className="px-2 py-1 text-xs rounded transition-colors theme-transition"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-inverse)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              View Result
            </button>
          )}
          
          <button
            onClick={handleToggleExpanded}
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
            title={isExpanded ? 'Show less' : 'Show more'}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
          
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1 rounded transition-colors theme-transition"
              style={{ 
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-error-bg)';
                e.currentTarget.style.color = 'var(--color-error)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              title="Delete entry"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path 
                  fillRule="evenodd" 
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="pt-3 border-t theme-transition" style={{ borderColor: 'var(--color-border)' }}>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Run ID:
              </span>
              <div className="font-mono mt-1" style={{ color: 'var(--color-text)' }}>
                {entry.runId}
              </div>
            </div>
            
            <div>
              <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Started:
              </span>
              <div className="mt-1" style={{ color: 'var(--color-text)' }}>
                {formatTimestamp(entry.timestamp)}
              </div>
            </div>
            
            {entry.completedAt && (
              <div>
                <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Completed:
                </span>
                <div className="mt-1" style={{ color: 'var(--color-text)' }}>
                  {formatTimestamp(entry.completedAt)}
                </div>
              </div>
            )}
            
            {(entry.model || entry.writeModel) && (
              <div>
                <span className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Models:
                </span>
                <div className="mt-1" style={{ color: 'var(--color-text)' }}>
                  {entry.model && <div>Search: {entry.model}</div>}
                  {entry.writeModel && <div>Write: {entry.writeModel}</div>}
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-3 p-2 rounded" style={{ 
              backgroundColor: 'var(--color-error-bg)',
              borderColor: 'var(--color-error)',
              borderWidth: '1px'
            }}>
              <div className="text-xs font-medium" style={{ color: 'var(--color-error)' }}>
                Reconnection Error:
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
                {error}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 