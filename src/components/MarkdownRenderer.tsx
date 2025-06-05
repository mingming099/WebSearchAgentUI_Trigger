"use client";

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import type { Components } from 'react-markdown';
import { useTheme } from '@/hooks/useTheme';

// Import highlight.js styles - we'll handle theme switching dynamically

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Mermaid component for rendering diagrams
const MermaidDiagram: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { actualTheme } = useTheme();

  useEffect(() => {
    if (ref.current) {
      // Initialize mermaid with theme based on current mode
      mermaid.initialize({
        startOnLoad: false,
        theme: actualTheme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis',
          padding: 20
        },
        sequence: {
          useMaxWidth: false,
          wrap: true,
          width: 150
        },
        gantt: {
          useMaxWidth: false
        },
        journey: {
          useMaxWidth: false
        },
        timeline: {
          useMaxWidth: false
        },
        gitGraph: {
          useMaxWidth: false
        },
        themeVariables: actualTheme === 'dark' ? {
          primaryColor: '#60a5fa',
          primaryTextColor: '#f9fafb',
          primaryBorderColor: '#374151',
          lineColor: '#9ca3af',
          sectionBkgColor: '#1f2937',
          altSectionBkgColor: '#111827',
          gridColor: '#374151',
          secondaryColor: '#1f2937',
          tertiaryColor: '#374151',
          background: '#0a0a0a',
          mainBkg: '#1a1a1a',
          secondBkg: '#1f2937',
          tertiaryBkg: '#374151'
        } : {
          primaryColor: '#3b82f6',
          primaryTextColor: '#111827',
          primaryBorderColor: '#e5e7eb',
          lineColor: '#6b7280',
          sectionBkgColor: '#f9fafb',
          altSectionBkgColor: '#f3f4f6',
          gridColor: '#e5e7eb',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#e5e7eb'
        }
      });

      // Clear previous content
      ref.current.innerHTML = '';

      // Render the diagram
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid.render(id, chart).then((result) => {
        if (ref.current) {
          ref.current.innerHTML = result.svg;
          
          // Fix SVG sizing and text issues
          const svg = ref.current.querySelector('svg');
          if (svg) {
            // Get original dimensions
            const originalWidth = svg.getAttribute('width');
            const originalHeight = svg.getAttribute('height');
            const viewBox = svg.getAttribute('viewBox');
            
            // Set responsive sizing with proper scaling
            svg.style.width = '100%'; // Make diagrams smaller by default
            svg.style.maxWidth = '800px'; // Reduce maximum width
            svg.style.maxHeight = '800px'; // Reduce maximum width
            svg.style.height = 'auto';
            svg.style.display = 'block';
            svg.style.margin = '0 auto';
            
            // Ensure viewBox is set for proper scaling
            if (!viewBox && originalWidth && originalHeight) {
              svg.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
            }
            
            // Fix text rendering issues
            const textElements = svg.querySelectorAll('text');
            textElements.forEach((text) => {
              text.style.fontFamily = 'inherit';
              text.style.fontSize = '13px';
              text.style.fontWeight = '500';
              
              // Ensure text is properly positioned and visible
              const textContent = text.textContent || '';
              if (textContent.trim()) {
                // Add some padding to text elements
                const bbox = text.getBBox();
                const padding = 4;
                
                // Create a background rect for better text visibility
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', (bbox.x - padding).toString());
                rect.setAttribute('y', (bbox.y - padding).toString());
                rect.setAttribute('width', (bbox.width + padding * 2).toString());
                rect.setAttribute('height', (bbox.height + padding * 2).toString());
                rect.setAttribute('fill', 'transparent');
                rect.setAttribute('stroke', 'none');
                
                // Insert rect before text
                text.parentNode?.insertBefore(rect, text);
              }
            });
            
            // Fix foreignObject text issues (for HTML labels)
            const foreignObjects = svg.querySelectorAll('foreignObject');
            foreignObjects.forEach((fo) => {
              const div = fo.querySelector('div');
              if (div) {
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.justifyContent = 'center';
                div.style.width = '100%';
                div.style.height = '100%';
                div.style.fontSize = '13px';
                div.style.fontFamily = 'inherit';
                div.style.fontWeight = '500';
                div.style.textAlign = 'center';
                div.style.overflow = 'visible';
                div.style.whiteSpace = 'nowrap';
                div.style.padding = '4px 8px';
                div.style.boxSizing = 'border-box';
              }
            });
            
            // Fix rect elements (node backgrounds) to ensure proper sizing
            const rectElements = svg.querySelectorAll('rect');
            rectElements.forEach((rect) => {
              const width = parseFloat(rect.getAttribute('width') || '0');
              const height = parseFloat(rect.getAttribute('height') || '0');
              
              // Ensure minimum size for text containers but keep them compact
              if (width > 0 && width < 100) {
                rect.setAttribute('width', '100');
              }
              if (height > 0 && height < 35) {
                rect.setAttribute('height', '35');
              }
            });
          }
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
        if (ref.current) {
          ref.current.innerHTML = `<div style="color: var(--color-error); padding: 1rem; border: 1px solid var(--color-error); border-radius: 0.5rem; background-color: var(--color-error-bg);">Error rendering diagram: ${error.message}</div>`;
        }
      });
    }
  }, [chart, actualTheme]);

  return (
    <div 
      ref={ref} 
      className="my-4 overflow-x-auto flex justify-center" 
      style={{ 
        minHeight: '200px',
        maxWidth: '100%'
      }} 
    />
  );
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const { actualTheme } = useTheme();

  // Dynamic highlight.js theme loading
  useEffect(() => {
    // Remove existing highlight.js stylesheets
    const existingLinks = document.querySelectorAll('link[data-highlight-theme]');
    existingLinks.forEach(link => link.remove());
    
    // Add appropriate theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute('data-highlight-theme', 'true');
    
    if (actualTheme === 'dark') {
      // Load dark theme
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
    } else {
      // Load light theme
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
    }
    
    document.head.appendChild(link);
    
    // Cleanup function
    return () => {
      const linkToRemove = document.querySelector('link[data-highlight-theme]');
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [actualTheme]);

  const components: Components = {
    // Custom code block renderer
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      // Check if this is a block-level code element (has language class)
      const isBlock = className && className.includes('language-');
      
      if (isBlock && language === 'mermaid') {
        return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
      }
      
      if (isBlock) {
        return (
          <div className="relative">
            <div 
              className="absolute top-2 right-2 text-xs px-2 py-1 rounded"
              style={{ 
                color: 'var(--color-text-muted)', 
                backgroundColor: 'var(--color-surface-hover)' 
              }}
            >
              {language || 'code'}
            </div>
            <pre className="overflow-x-auto" style={{ backgroundColor: 'var(--color-code-bg)' }}>
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          </div>
        );
      }
      
      return (
        <code 
          className="px-1 py-0.5 rounded text-sm" 
          style={{ 
            backgroundColor: 'var(--color-code-bg)', 
            color: 'var(--color-text)' 
          }} 
          {...props}
        >
          {children}
        </code>
      );
    },
    
    // Custom table renderer
    table({ children, ...props }) {
      return (
        <div className="overflow-x-auto my-4">
          <table 
            className="min-w-full border-collapse border" 
            style={{ borderColor: 'var(--color-border)' }} 
            {...props}
          >
            {children}
          </table>
        </div>
      );
    },
    
    th({ children, ...props }) {
      return (
        <th className="border px-4 py-2 text-left font-semibold" style={{ backgroundColor: 'var(--color-surface-hover)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} {...props}>
          {children}
        </th>
      );
    },
    
    td({ children, ...props }) {
      return (
        <td className="border px-4 py-2" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} {...props}>
          {children}
        </td>
      );
    },
    
    // Custom blockquote renderer
    blockquote({ children, ...props }) {
      return (
        <blockquote className="border-l-4 pl-4 py-2 my-4 italic" style={{ backgroundColor: 'var(--color-info-bg)', borderColor: 'var(--color-info)', color: 'var(--color-text-secondary)' }} {...props}>
          {children}
        </blockquote>
      );
    },
    
    // Custom heading renderers
    h1({ children, ...props }) {
      return (
        <h1 className="text-2xl font-bold mt-6 mb-4 border-b pb-2" style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }} {...props}>
          {children}
        </h1>
      );
    },
    
    h2({ children, ...props }) {
      return (
        <h2 className="text-xl font-semibold mt-5 mb-3" style={{ color: 'var(--color-text)' }} {...props}>
          {children}
        </h2>
      );
    },
    
    h3({ children, ...props }) {
      return (
        <h3 className="text-lg font-medium mt-4 mb-2" style={{ color: 'var(--color-text)' }} {...props}>
          {children}
        </h3>
      );
    },
    
    // Custom list renderers
    ul({ children, ...props }) {
      return (
        <ul className="list-disc list-inside my-4 space-y-1" {...props}>
          {children}
        </ul>
      );
    },
    
    ol({ children, ...props }) {
      return (
        <ol className="list-decimal list-inside my-4 space-y-1" {...props}>
          {children}
        </ol>
      );
    },
    
    li({ children, ...props }) {
      return (
        <li style={{ color: 'var(--color-text)' }} {...props}>
          {children}
        </li>
      );
    },
    
    // Custom link renderer
    a({ children, href, ...props }) {
      return (
        <a 
          href={href} 
          className="underline" 
          style={{ color: 'var(--color-primary)', transition: 'color 0.2s ease' }}
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
          {...props}
        >
          {children}
        </a>
      );
    },
    
    // Custom paragraph renderer
    p({ children, ...props }) {
      return (
        <p className="leading-relaxed my-3" style={{ color: 'var(--color-text)' }} {...props}>
          {children}
        </p>
      );
    },
  };

  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 