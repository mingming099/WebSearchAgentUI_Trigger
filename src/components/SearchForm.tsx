"use client";

import { useState, useEffect } from "react";
import { SearchFormProps } from "@/types/websearch";
import { validateSearchQuery, getDefaultModel, getDefaultWriteModel } from "@/lib/utils";

export default function SearchForm({ onSubmit, isLoading, disabled = false }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [model, setModel] = useState("");
  const [writeModel, setWriteModel] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize models after component mounts to avoid SSR issues
  useEffect(() => {
    setModel(getDefaultModel());
    setWriteModel(getDefaultWriteModel());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Validate the query
    const validation = validateSearchQuery(query);
    if (!validation.isValid) {
      setError(validation.error || "Invalid query");
      return;
    }
    
    // Submit the query with model parameters, using defaults if empty
    const finalModel = model.trim() || getDefaultModel();
    const finalWriteModel = writeModel.trim() || getDefaultWriteModel();
    onSubmit(query.trim(), finalModel, finalWriteModel);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel(e.target.value);
  };

  const handleWriteModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWriteModel(e.target.value);
  };

  const resetToDefaults = () => {
    setModel(getDefaultModel());
    setWriteModel(getDefaultWriteModel());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="search-query" 
            className="block text-sm font-medium text-gray-700"
          >
            Search Query
          </label>
          <div className="relative">
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter your search query..."
              disabled={isLoading || disabled}
              className={`
                w-full px-4 py-3 border rounded-lg shadow-sm
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                ${error ? 'border-red-500' : 'border-gray-300'}
                transition-colors duration-200
              `}
              maxLength={500}
              autoComplete="off"
              autoFocus
            />
            {query.length > 0 && (
              <div className="absolute right-3 top-3 text-xs text-gray-400">
                {query.length}/500
              </div>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg 
                className="w-4 h-4" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Advanced Options Toggle */}
        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isLoading || disabled}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
            Advanced Options
          </button>
        </div>

        {/* Advanced Options Panel */}
        {showAdvanced && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Model Configuration</h3>
              <button
                type="button"
                onClick={resetToDefaults}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
                disabled={isLoading || disabled}
              >
                Reset to defaults
              </button>
            </div>

            {/* Model Input */}
            <div className="space-y-2">
              <label 
                htmlFor="model" 
                className="block text-sm font-medium text-gray-700"
              >
                Search Model
              </label>
              <input
                id="model"
                type="text"
                value={model}
                onChange={handleModelChange}
                placeholder="openai/gpt-4.1-mini"
                disabled={isLoading || disabled}
                className="
                  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                  transition-colors duration-200
                "
              />
              <p className="text-xs text-gray-500">
                Model used for search and analysis tasks
              </p>
            </div>

            {/* Write Model Input */}
            <div className="space-y-2">
              <label 
                htmlFor="write-model" 
                className="block text-sm font-medium text-gray-700"
              >
                Writing Model
              </label>
              <input
                id="write-model"
                type="text"
                value={writeModel}
                onChange={handleWriteModelChange}
                placeholder="openai/gpt-4.1-mini"
                disabled={isLoading || disabled}
                className="
                  w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                  transition-colors duration-200
                "
              />
              <p className="text-xs text-gray-500">
                Model used for generating the final answer
              </p>
            </div>

            {/* Model Examples */}
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">Common models:</p>
              <ul className="space-y-0.5 ml-4">
                <li>• openai/gpt-4.1-mini (default, fast and efficient)</li>
                <li>• google/gemini-2.5-flash-preview-05-20:thinking</li>
                <li>• anthropic/claude-sonnet-4</li>
                <li>• google/gemini-2.5-pro-preview</li>
              </ul>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || disabled || !query.trim()}
          className={`
            w-full px-6 py-3 rounded-lg font-medium text-white
            transition-all duration-200 flex items-center justify-center gap-2
            ${
              isLoading || disabled || !query.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg 
                className="animate-spin w-5 h-5" 
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
              Searching...
            </>
          ) : (
            <>
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
              Start Search
            </>
          )}
        </button>
      </form>
      
      {/* Search tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Search Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Be specific with your query for better results</li>
          <li>• Ask questions about current events, research topics, or general information</li>
          <li>• The search will find and analyze relevant web content for you</li>
          <li>• Use advanced options to customize the AI models used</li>
        </ul>
      </div>
    </div>
  );
} 