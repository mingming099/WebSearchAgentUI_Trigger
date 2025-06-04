"use client";

import React from "react";
import { ErrorBoundaryProps } from "@/types/websearch";
import { formatErrorMessage } from "@/lib/utils";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Default error fallback component
function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-700 mb-4">
              {formatErrorMessage(error)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetError}
                className="
                  px-4 py-2 bg-red-600 text-white rounded-lg font-medium
                  hover:bg-red-700 active:bg-red-800 
                  transition-colors duration-200
                  flex items-center justify-center gap-2
                "
              >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="
                  px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium
                  hover:bg-gray-200 active:bg-gray-300 
                  transition-colors duration-200
                  flex items-center justify-center gap-2
                  border border-gray-300
                "
              >
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Reload Page
              </button>
            </div>
            
            {/* Error details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  Show error details
                </summary>
                <pre className="mt-2 p-3 bg-red-100 rounded text-xs text-red-800 overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // You could send error to monitoring service here
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback component if provided, otherwise use default
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
} 