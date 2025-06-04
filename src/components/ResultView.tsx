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
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <svg 
            className="w-6 h-6 text-green-600" 
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Search Complete
        </h2>
        <p className="text-gray-600">
          Here&apos;s what I found for your query
        </p>
      </div>

      {/* Main Answer */}
      {answer && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-blue-600" 
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
        <details className="bg-gray-50 border border-gray-200 rounded-lg">
          <summary className="p-4 cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="font-medium text-gray-700">
              View Search Process ({conversation.length - 1} steps)
            </span>
          </summary>
          <div className="border-t border-gray-200 p-4 space-y-4 max-h-96 overflow-y-auto">
            {conversation
              .filter(msg => msg.role !== 'system') // Filter out system messages
              .map((message, index) => (
                <div 
                  key={index} 
                  className={`
                    p-3 rounded-lg text-sm
                    ${message.role === 'user' 
                      ? 'bg-blue-50 border-l-4 border-blue-400' 
                      : message.role === 'assistant'
                      ? 'bg-green-50 border-l-4 border-green-400'
                      : 'bg-gray-100 border-l-4 border-gray-400'
                    }
                  `}
                >
                  <div className="font-medium text-xs uppercase tracking-wide text-gray-500 mb-1">
                    {message.role === 'user' ? 'Query' : 
                     message.role === 'assistant' ? 'Assistant' : 
                     message.role === 'tool' ? 'Tool Response' : message.role}
                  </div>
                  <div className="text-gray-700">
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
                      <span className="text-gray-400 italic">No content</span>
                    )}
                  </div>
                  {message.tool_calls && message.tool_calls.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
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
          className="
            px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
            hover:bg-blue-700 active:bg-blue-800 
            transition-colors duration-200
            flex items-center justify-center gap-2
            shadow-sm hover:shadow-md
          "
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
          className="
            px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium
            hover:bg-gray-200 active:bg-gray-300 
            transition-colors duration-200
            flex items-center justify-center gap-2
            border border-gray-300
          "
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
      <div className="text-center text-sm text-gray-500">
        <p>Search powered by Trigger.dev WebSearch Agent</p>
      </div>
    </div>
  );
} 