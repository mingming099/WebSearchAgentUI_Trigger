"use client";

import { useState, useEffect } from "react";
import { SearchFormProps } from "@/types/websearch";
import { validateSearchQuery, getDefaultModel, getDefaultWriteModel, loadModelSettings, saveModelSettings, clearModelSettings } from "@/lib/utils";

export default function SearchForm({ onSubmit, isLoading, disabled = false }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [model, setModel] = useState("");
  const [writeModel, setWriteModel] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize models after component mounts to avoid SSR issues
  useEffect(() => {
    const savedSettings = loadModelSettings();
    setModel(savedSettings.searchModel);
    setWriteModel(savedSettings.writeModel);
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
    const newModel = e.target.value;
    setModel(newModel);
    // Save to localStorage immediately when user changes the model
    saveModelSettings(newModel, writeModel);
  };

  const handleWriteModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWriteModel = e.target.value;
    setWriteModel(newWriteModel);
    // Save to localStorage immediately when user changes the write model
    saveModelSettings(model, newWriteModel);
  };

  const resetToDefaults = () => {
    const defaultModel = getDefaultModel();
    const defaultWriteModel = getDefaultWriteModel();
    setModel(defaultModel);
    setWriteModel(defaultWriteModel);
    // Clear saved settings and save the defaults
    clearModelSettings();
    saveModelSettings(defaultModel, defaultWriteModel);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="search-query" 
            className="block text-sm font-medium theme-transition"
            style={{ color: 'var(--color-text)' }}
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
              className="w-full px-4 py-3 rounded-lg shadow-sm transition-all duration-200 theme-transition"
              style={{
                backgroundColor: disabled ? 'var(--color-input-disabled)' : 'var(--color-input)',
                borderColor: error ? 'var(--color-error)' : 'var(--color-input-border)',
                borderWidth: '1px',
                color: disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
                cursor: disabled ? 'not-allowed' : 'text'
              }}
              onFocus={(e) => {
                if (!disabled) {
                  e.target.style.borderColor = 'var(--color-input-focus)';
                  e.target.style.boxShadow = '0 0 0 2px var(--color-input-focus)';
                  e.target.style.outline = 'none';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-input-border)';
                e.target.style.boxShadow = 'none';
              }}
              maxLength={50000}
              autoComplete="off"
              autoFocus
            />
            {query.length > 0 && (
              <div 
                className="absolute right-3 top-3 text-xs theme-transition"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {query.length}/50000
              </div>
            )}
          </div>
          {error && (
            <p className="text-sm flex items-center gap-1 theme-transition" style={{ color: 'var(--color-error)' }}>
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
        <div className="pt-4 theme-transition" style={{ borderTopColor: 'var(--color-border)', borderTopWidth: '1px' }}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm transition-colors theme-transition"
            style={{ 
              color: 'var(--color-text-secondary)',
              cursor: (isLoading || disabled) ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isLoading && !disabled) {
                e.currentTarget.style.color = 'var(--color-text)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
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
          <div 
            className="rounded-lg p-4 space-y-4 theme-transition" 
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-border)',
              borderWidth: '1px'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium theme-transition" style={{ color: 'var(--color-text)' }}>
                Model Configuration
              </h3>
              <button
                type="button"
                onClick={resetToDefaults}
                className="text-xs underline transition-colors theme-transition"
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                disabled={isLoading || disabled}
              >
                Reset to defaults
              </button>
            </div>

            {/* Model Input */}
            <div className="space-y-2">
              <label 
                htmlFor="model" 
                className="block text-sm font-medium theme-transition"
                style={{ color: 'var(--color-text)' }}
              >
                Search Model
              </label>
              <input
                id="model"
                type="text"
                value={model}
                onChange={handleModelChange}
                placeholder="SearchModel"
                disabled={isLoading || disabled}
                className="w-full px-3 py-2 rounded-md shadow-sm text-sm transition-all duration-200 theme-transition"
                style={{
                  backgroundColor: disabled ? 'var(--color-input-disabled)' : 'var(--color-input)',
                  borderColor: 'var(--color-input-border)',
                  borderWidth: '1px',
                  color: disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
                  cursor: disabled ? 'not-allowed' : 'text'
                }}
                onFocus={(e) => {
                  if (!disabled) {
                    e.target.style.borderColor = 'var(--color-input-focus)';
                    e.target.style.boxShadow = '0 0 0 2px var(--color-input-focus)';
                    e.target.style.outline = 'none';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-input-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs theme-transition" style={{ color: 'var(--color-text-muted)' }}>
                Model used for search and analysis tasks
              </p>
            </div>

            {/* Write Model Input */}
            <div className="space-y-2">
              <label 
                htmlFor="write-model" 
                className="block text-sm font-medium theme-transition"
                style={{ color: 'var(--color-text)' }}
              >
                Writing Model
              </label>
              <input
                id="write-model"
                type="text"
                value={writeModel}
                onChange={handleWriteModelChange}
                placeholder="WriteModel"
                disabled={isLoading || disabled}
                className="w-full px-3 py-2 rounded-md shadow-sm text-sm transition-all duration-200 theme-transition"
                style={{
                  backgroundColor: disabled ? 'var(--color-input-disabled)' : 'var(--color-input)',
                  borderColor: 'var(--color-input-border)',
                  borderWidth: '1px',
                  color: disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
                  cursor: disabled ? 'not-allowed' : 'text'
                }}
                onFocus={(e) => {
                  if (!disabled) {
                    e.target.style.borderColor = 'var(--color-input-focus)';
                    e.target.style.boxShadow = '0 0 0 2px var(--color-input-focus)';
                    e.target.style.outline = 'none';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-input-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p className="text-xs theme-transition" style={{ color: 'var(--color-text-muted)' }}>
                Model used for generating the final answer
              </p>
            </div>

            {/* Model Examples */}
            <div className="text-xs space-y-1 theme-transition" style={{ color: 'var(--color-text-muted)' }}>
              <p className="font-medium">Common models:</p>
              <ul className="space-y-0.5 ml-4">
                <li>• openai/gpt-4.1-mini (default, fast and efficient)</li>
                <li>• google/gemini-2.5-flash-preview-05-20</li>
                <li>• anthropic/claude-sonnet-4</li>
                <li>• google/gemini-2.5-pro-preview</li>
              </ul>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || disabled || !query.trim()}
          className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 theme-transition"
          style={{
            backgroundColor: (isLoading || disabled || !query.trim()) 
              ? 'var(--color-text-muted)' 
              : 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
            cursor: (isLoading || disabled || !query.trim()) ? 'not-allowed' : 'pointer',
            boxShadow: (isLoading || disabled || !query.trim()) ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            if (!isLoading && !disabled && query.trim()) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !disabled && query.trim()) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }
          }}
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
              Search
            </>
          )}
        </button>
      </form>
      
      {/* Search Tips */}
      <div 
        className="mt-6 p-4 rounded-lg theme-transition"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h3 
          className="text-sm font-medium mb-2 theme-transition"
          style={{ color: 'var(--color-text)' }}
        >
          Search Tips:
        </h3>
        <ul 
          className="text-sm space-y-1 theme-transition"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <li>• Be specific with your query for better results</li>
          <li>• Ask questions about current events, research topics, or general information</li>
          <li>• The search will find and analyze relevant web content for you</li>
          <li>• Use advanced options to customize the AI models used</li>
        </ul>
      </div>
    </div>
  );
} 