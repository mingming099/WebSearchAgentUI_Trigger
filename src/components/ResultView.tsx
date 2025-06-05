"use client";

import { ResultViewProps } from "@/types/websearch";
import MarkdownRenderer from "./MarkdownRenderer";

export default function ResultView({ result, onNewSearch, isVisible }: ResultViewProps) {
  if (!isVisible || !result) return null;

  const { answer, conversation } = result;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div 
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 theme-transition"
          style={{ backgroundColor: 'var(--color-success-bg)' }}
        >
          <svg 
            className="w-6 h-6" 
            style={{ color: 'var(--color-success)' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 theme-transition" style={{ color: 'var(--color-text)' }}>
          Search Complete
        </h2>
        <p className="theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
          Here&apos;s what I found for your query
        </p>
      </div>

      {/* Main Answer */}
      {answer && (
        <div 
          className="rounded-lg shadow-sm theme-transition" 
          style={{ 
            backgroundColor: 'var(--color-card)', 
            borderColor: 'var(--color-border)',
            borderWidth: '1px'
          }}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 theme-transition" style={{ color: 'var(--color-text)' }}>
              <svg 
                className="w-5 h-5" 
                style={{ color: 'var(--color-primary)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Answer
            </h3>
            <MarkdownRenderer content={answer} />
          </div>
        </div>
      )}

      {/* Conversation History (Optional) */}
      {conversation && conversation.length > 2 && (
        <details 
          className="rounded-lg theme-transition" 
          style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-border)',
            borderWidth: '1px'
          }}
        >
          <summary 
            className="p-4 cursor-pointer transition-colors theme-transition"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="font-medium theme-transition" style={{ color: 'var(--color-text)' }}>
              View Search Process ({conversation.length - 1} steps)
            </span>
          </summary>
          <div 
            className="p-4 space-y-4 max-h-96 overflow-y-auto theme-transition" 
            style={{ 
              borderTopColor: 'var(--color-border)',
              borderTopWidth: '1px'
            }}
          >
            {conversation
              .filter(msg => msg.role !== 'system') // Filter out system messages
              .map((message, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg text-sm theme-transition"
                  style={{
                    backgroundColor: message.role === 'user' 
                      ? 'var(--color-info-bg)' 
                      : message.role === 'assistant'
                      ? 'var(--color-success-bg)'
                      : 'var(--color-surface-hover)',
                    borderLeftColor: message.role === 'user' 
                      ? 'var(--color-info)' 
                      : message.role === 'assistant'
                      ? 'var(--color-success)'
                      : 'var(--color-border)',
                    borderLeftWidth: '4px'
                  }}
                >
                  <div className="font-medium text-xs uppercase tracking-wide mb-1 theme-transition" style={{ color: 'var(--color-text-muted)' }}>
                    {message.role === 'user' ? 'Query' : 
                     message.role === 'assistant' ? 'Assistant' : 
                     message.role === 'tool' ? 'Tool Response' : message.role}
                  </div>
                  <div className="theme-transition" style={{ color: 'var(--color-text)' }}>
                    {message.content ? (
                      <div className="whitespace-pre-wrap">
                        {typeof message.content === 'string' 
                          ? message.content.length > 500 
                            ? `${message.content.substring(0, 500)}...`
                            : message.content
                          : JSON.stringify(message.content, null, 2)
                        }
                      </div>
                    ) : (
                      <span className="italic theme-transition" style={{ color: 'var(--color-text-muted)' }}>No content</span>
                    )}
                  </div>
                  {message.tool_calls && message.tool_calls.length > 0 && (
                    <div className="mt-2 text-xs theme-transition" style={{ color: 'var(--color-text-muted)' }}>
                      Used tools: {message.tool_calls.map(tc => tc.function?.name).join(', ')}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </details>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onNewSearch}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 theme-transition"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
          }}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          New Search
        </button>
        
        <button
          onClick={() => {
            if (answer) {
              navigator.clipboard.writeText(answer);
              // You could add a toast notification here
            }
          }}
          className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 theme-transition"
          style={{
            backgroundColor: 'var(--color-surface-hover)',
            color: 'var(--color-text)',
            borderColor: 'var(--color-border)',
            borderWidth: '1px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
          }}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
          Copy Answer
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm theme-transition" style={{ color: 'var(--color-text-muted)' }}>
        <p>Search powered by Trigger.dev WebSearch Agent</p>
      </div>
    </div>
  );
} 