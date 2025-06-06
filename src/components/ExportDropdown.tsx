"use client";

import React, { useState, useRef, useEffect } from 'react';
import { exportToHTML } from '@/lib/export-utils';
import type { ExportFormat } from '@/types/export';

interface ExportDropdownProps {
  /** The DOM element containing the rendered markdown content */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the export functionality is disabled */
  disabled?: boolean;
  /** Custom class name for styling */
  className?: string;
}

interface ExportState {
  isOpen: boolean;
  isExporting: boolean;
  exportFormat: ExportFormat | null;
  progress: number;
  progressMessage: string;
  error: string | null;
}

export default function ExportDropdown({ 
  contentRef, 
  disabled = false, 
  className = "" 
}: ExportDropdownProps) {
  const [state, setState] = useState<ExportState>({
    isOpen: false,
    isExporting: false,
    exportFormat: null,
    progress: 0,
    progressMessage: '',
    error: null
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, isOpen: false }));
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    if (!disabled && !state.isExporting) {
      setState(prev => ({ ...prev, isOpen: !prev.isOpen, error: null }));
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (!contentRef.current || state.isExporting) return;

    setState(prev => ({
      ...prev,
      isOpen: false,
      isExporting: true,
      exportFormat: format,
      progress: 0,
      progressMessage: `Starting ${format.toUpperCase()} export...`,
      error: null
    }));

    try {
      const progressCallback = (progress: number, message?: string) => {
        setState(prev => ({
          ...prev,
          progress,
          progressMessage: message || `Exporting ${format.toUpperCase()}...`
        }));
      };

      const result = await exportToHTML(contentRef.current, { format }, progressCallback);

      if (result.success) {
        setState(prev => ({
          ...prev,
          isExporting: false,
          exportFormat: null,
          progress: 100,
          progressMessage: `${format.toUpperCase()} export completed successfully!`
        }));

        // Clear success message after 3 seconds
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            progress: 0,
            progressMessage: ''
          }));
        }, 3000);
      } else {
        setState(prev => ({
          ...prev,
          isExporting: false,
          exportFormat: null,
          progress: 0,
          progressMessage: '',
          error: result.error || `Failed to export ${format.toUpperCase()}`
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isExporting: false,
        exportFormat: null,
        progress: 0,
        progressMessage: '',
        error: error instanceof Error ? error.message : `Failed to export ${format.toUpperCase()}`
      }));
    }
  };

  const handleDismissError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Export Button */}
      <button
        onClick={handleToggleDropdown}
        disabled={disabled || state.isExporting}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors theme-transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-surface-hover)',
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px'
        }}
        onMouseEnter={(e) => {
          if (!disabled && !state.isExporting) {
            e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !state.isExporting) {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
          }
        }}
        aria-label="Export options"
        aria-expanded={state.isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          {state.isExporting ? (
            <>
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${state.isOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {state.isOpen && !state.isExporting && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50 theme-transition"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            borderWidth: '1px'
          }}
        >
          <div className="py-2">
            <button
              onClick={() => handleExport('html')}
              className="w-full px-4 py-2 text-left text-sm transition-colors theme-transition"
              style={{ color: 'var(--color-text)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="flex items-center gap-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16,18 22,12 16,6" />
                  <polyline points="8,6 2,12 8,18" />
                </svg>
                <div>
                  <div className="font-medium">Export as HTML</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Standalone HTML file
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {state.isExporting && (
        <div
          className="absolute right-0 top-full mt-2 w-64 p-4 rounded-lg shadow-lg z-50 theme-transition"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            borderWidth: '1px'
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Exporting {state.exportFormat?.toUpperCase()}
              </span>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                <span>{state.progressMessage}</span>
                <span>{state.progress}%</span>
              </div>
              <div
                className="w-full h-2 rounded-full"
                style={{ backgroundColor: 'var(--color-surface-hover)' }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    width: `${state.progress}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {!state.isExporting && state.progress === 100 && state.progressMessage && (
        <div
          className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg shadow-lg z-50 theme-transition"
          style={{
            backgroundColor: 'var(--color-success-bg)',
            borderColor: 'var(--color-success)',
            borderWidth: '1px'
          }}
        >
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--color-success)' }}
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--color-success)' }}>
              {state.progressMessage}
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div
          className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg shadow-lg z-50 theme-transition"
          style={{
            backgroundColor: 'var(--color-error-bg)',
            borderColor: 'var(--color-error)',
            borderWidth: '1px'
          }}
        >
          <div className="flex items-start gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--color-error)' }}
              className="flex-shrink-0 mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <div className="flex-1">
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                {state.error}
              </p>
              <button
                onClick={handleDismissError}
                className="text-xs mt-1 underline"
                style={{ color: 'var(--color-error)' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 