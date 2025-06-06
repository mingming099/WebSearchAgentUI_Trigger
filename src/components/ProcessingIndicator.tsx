"use client";

import { useState } from 'react';

interface ProcessingIndicatorProps {
  runId: string;
  query: string;
  timestamp: number;
  onResume?: (runId: string) => void;
  isResuming?: boolean;
}

export default function ProcessingIndicator({
  runId,
  query,
  timestamp,
  onResume,
  isResuming = false
}: ProcessingIndicatorProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  const handleResume = () => {
    if (onResume && !isResuming) {
      onResume(runId);
    }
  };

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg theme-transition cursor-pointer"
      style={{ 
        backgroundColor: isHovered ? 'var(--color-surface-hover)' : 'var(--color-surface)',
        borderColor: 'var(--color-primary)',
        borderWidth: '1px',
        borderStyle: 'dashed'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleResume}
    >
      {/* Animated Processing Icon */}
      <div className="flex-shrink-0">
        <div className="relative">
          {/* Spinning outer ring */}
          <svg 
            className="w-6 h-6 animate-spin" 
            style={{ color: 'var(--color-primary)' }}
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
          
          {/* Pulsing center dot */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
          >
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            Processing...
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="text-sm truncate mb-1" style={{ color: 'var(--color-text)' }}>
          &ldquo;{query}&rdquo;
        </div>
        
        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Started {formatTimeAgo(timestamp)}
        </div>
      </div>

      {/* Resume Button */}
      <div className="flex-shrink-0">
        {onResume && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResume();
            }}
            disabled={isResuming}
            className="px-3 py-1.5 text-sm rounded transition-all theme-transition"
            style={{ 
              backgroundColor: isResuming ? 'var(--color-surface)' : 'var(--color-primary)',
              color: isResuming ? 'var(--color-text-secondary)' : 'var(--color-text-inverse)',
              opacity: isResuming ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isResuming) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              if (!isResuming) {
                e.currentTarget.style.opacity = '1';
              }
            }}
          >
            {isResuming ? (
              <div className="flex items-center gap-2">
                <svg 
                  className="w-3 h-3 animate-spin" 
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
                Resuming...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Resume
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
} 