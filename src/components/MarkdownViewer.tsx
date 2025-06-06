"use client";

import React, { useState, useEffect, useRef } from 'react';
import MarkdownEditor from './MarkdownEditor';
import MarkdownRenderer from './MarkdownRenderer';
import ExportDropdown from './ExportDropdown';

type ViewMode = 'edit' | 'preview';

export default function MarkdownViewer() {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<ViewMode>('edit');
  const markdownRendererRef = useRef<HTMLDivElement>(null);

  // Load content from localStorage on mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('markdown-viewer-content');
      if (savedContent) {
        setContent(savedContent);
      }
    } catch (error) {
      console.warn('Failed to load content from localStorage:', error);
    }
  }, []);

  // Save content to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('markdown-viewer-content', content);
    } catch (error) {
      console.warn('Failed to save content to localStorage:', error);
    }
  }, [content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleModeToggle = (newMode: ViewMode) => {
    setMode(newMode);
  };

  const handleClearContent = () => {
    if (window.confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
      setContent('');
    }
  };

  return (
    <div className="w-full max-w-none">
      {/* Mode Toggle and Actions */}
      <div 
        className="flex items-center justify-between p-4 mb-4 rounded-lg theme-transition"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px'
        }}
      >
        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleModeToggle('edit')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 theme-transition ${
              mode === 'edit' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: mode === 'edit' ? 'var(--color-primary)' : 'var(--color-surface-hover)',
              color: mode === 'edit' ? 'var(--color-text-inverse)' : 'var(--color-text)',
              borderColor: 'var(--color-border)',
              borderWidth: '1px'
            }}
            onMouseEnter={(e) => {
              if (mode !== 'edit') {
                e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (mode !== 'edit') {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              }
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
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </div>
          </button>
          
          <button
            onClick={() => handleModeToggle('preview')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 theme-transition ${
              mode === 'preview' ? 'shadow-sm' : ''
            }`}
            style={{
              backgroundColor: mode === 'preview' ? 'var(--color-primary)' : 'var(--color-surface-hover)',
              color: mode === 'preview' ? 'var(--color-text-inverse)' : 'var(--color-text)',
              borderColor: 'var(--color-border)',
              borderWidth: '1px'
            }}
            onMouseEnter={(e) => {
              if (mode !== 'preview') {
                e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (mode !== 'preview') {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              }
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
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Content Stats */}
          <div className="text-sm theme-transition" style={{ color: 'var(--color-text-secondary)' }}>
            {content.length} characters
          </div>
          
          {/* Export Dropdown - only show in preview mode with content */}
          {mode === 'preview' && content && (
            <ExportDropdown 
              contentRef={markdownRendererRef}
              disabled={!content}
            />
          )}
          
          {/* Clear Button */}
          <button
            onClick={handleClearContent}
            disabled={!content}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors theme-transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-surface-hover)',
              color: 'var(--color-text-secondary)',
              borderColor: 'var(--color-border)',
              borderWidth: '1px'
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              }
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div 
        className="rounded-lg theme-transition"
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)',
          borderWidth: '1px',
          minHeight: '500px'
        }}
      >
        {mode === 'edit' ? (
          <MarkdownEditor
            content={content}
            onChange={handleContentChange}
            placeholder="# Welcome to Markdown Viewer

Start typing your markdown content here...

## Features
- **Live Preview**: Switch to preview mode to see rendered output
- **Syntax Highlighting**: Code blocks with language-specific highlighting
- **Mermaid Diagrams**: Create flowcharts, sequence diagrams, and more
- **Theme Support**: Automatically adapts to your theme preference
- **Auto-save**: Your content is automatically saved locally

## Example Code Block
```javascript
function hello() {
  console.log('Hello, Markdown!');
}
```

## Example Mermaid Diagram
```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
```

Happy writing! 🚀"
          />
        ) : (
          <div className="p-4">
            {content ? (
              <MarkdownRenderer ref={markdownRendererRef} content={content} />
            ) : (
              <div 
                className="text-center py-12 theme-transition"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <svg
                  className="mx-auto mb-4"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
                <p className="text-lg mb-2">No content to preview</p>
                <p>Switch to Edit mode to start writing markdown content</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 