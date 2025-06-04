"use client";

import { ProgressViewProps } from "@/types/websearch";
import { formatRelativeTime } from "@/lib/utils";

export default function ProgressView({ metadata, isVisible }: ProgressViewProps) {
  if (!isVisible) return null;

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
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Searching the Web
        </h2>
        <p className="text-sm text-gray-600">
          Iteration {currentIteration} of {totalIterations}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      </div>

      {/* Current Action */}
      {currentAction && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg 
                className="animate-spin w-5 h-5 text-blue-600" 
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
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Current Action
              </h3>
              <p className="text-sm text-blue-700">{currentAction}</p>
              {lastUpdated && (
                <p className="text-xs text-blue-600 mt-1">
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
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="space-y-3">
              {actionHistory.map((action, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="flex-shrink-0 mt-1">
                    {index === actionHistory.length - 1 ? (
                      // Current/latest action
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    ) : (
                      // Completed action
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`
                      ${index === actionHistory.length - 1 
                        ? 'text-gray-800 font-medium' 
                        : 'text-gray-600'
                      }
                    `}>
                      {action}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        <span>Processing your search request...</span>
      </div>
    </div>
  );
} 