"use client";

import React from 'react';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({ 
  content, 
  onChange, 
  placeholder = "Enter your markdown content here...",
  className = "" 
}: MarkdownEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-full min-h-[500px] p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all duration-200 theme-transition"
        style={{
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        aria-label="Markdown content editor"
        role="textbox"
        aria-multiline="true"
        spellCheck="false"
      />
    </div>
  );
} 