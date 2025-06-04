"use client";

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import type { Components } from 'react-markdown';

// Import highlight.js styles
import 'highlight.js/styles/github.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Mermaid component for rendering diagrams
const MermaidDiagram: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Initialize mermaid
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });

      // Clear previous content
      ref.current.innerHTML = '';

      // Render the diagram
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid.render(id, chart).then((result) => {
        if (ref.current) {
          ref.current.innerHTML = result.svg;
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
        if (ref.current) {
          ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-200 rounded">Error rendering diagram: ${error.message}</div>`;
        }
      });
    }
  }, [chart]);

  return <div ref={ref} className="my-4" />;
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
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
            <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {language || 'code'}
            </div>
            <pre className="overflow-x-auto">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          </div>
        );
      }
      
      return (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
    
    // Custom table renderer
    table({ children, ...props }) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-gray-300" {...props}>
            {children}
          </table>
        </div>
      );
    },
    
    th({ children, ...props }) {
      return (
        <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold" {...props}>
          {children}
        </th>
      );
    },
    
    td({ children, ...props }) {
      return (
        <td className="border border-gray-300 px-4 py-2" {...props}>
          {children}
        </td>
      );
    },
    
    // Custom blockquote renderer
    blockquote({ children, ...props }) {
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic" {...props}>
          {children}
        </blockquote>
      );
    },
    
    // Custom heading renderers
    h1({ children, ...props }) {
      return (
        <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-800 border-b border-gray-200 pb-2" {...props}>
          {children}
        </h1>
      );
    },
    
    h2({ children, ...props }) {
      return (
        <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800" {...props}>
          {children}
        </h2>
      );
    },
    
    h3({ children, ...props }) {
      return (
        <h3 className="text-lg font-medium mt-4 mb-2 text-gray-800" {...props}>
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
        <li className="text-gray-700" {...props}>
          {children}
        </li>
      );
    },
    
    // Custom link renderer
    a({ children, href, ...props }) {
      return (
        <a 
          href={href} 
          className="text-blue-600 hover:text-blue-800 underline" 
          target="_blank" 
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
    
    // Custom paragraph renderer
    p({ children, ...props }) {
      return (
        <p className="text-gray-700 leading-relaxed my-3" {...props}>
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