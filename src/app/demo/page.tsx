"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import ProgressView from "@/components/ProgressView";
import ResultView from "@/components/ResultView";
import ErrorBoundary from "@/components/ErrorBoundary";
import PasswordAuth from "@/components/PasswordAuth";
import ThemeToggle, { ThemeToggleCompact } from "@/components/ThemeToggle";
import MarkdownDemo from "@/components/MarkdownDemo";

// Mock data for demonstrations
const mockProgressMetadata = {
  progress: 65,
  currentAction: "Analyzing search results from multiple sources...",
  actionHistory: [
    "Initiated web search for user query",
    "Retrieved 15 relevant articles from news sources",
    "Analyzing content from academic papers",
    "Cross-referencing information from multiple sources",
    "Generating comprehensive summary"
  ],
  currentIteration: 2,
  totalIterations: 3,
  lastUpdated: new Date(Date.now() - 30000).toISOString() // 30 seconds ago
};

const mockResult = {
  answer: `# Search Results Summary

Based on my analysis of multiple sources, here's what I found:

## Key Findings

**Artificial Intelligence** continues to evolve rapidly across multiple domains:

### Recent Developments
- **Machine Learning**: New transformer architectures showing 40% improvement in efficiency
- **Computer Vision**: Real-time object detection reaching 99.2% accuracy
- **Natural Language Processing**: Large language models demonstrating emergent reasoning capabilities

### Code Example
\`\`\`python
def ai_breakthrough(model, data):
    """Example of modern AI processing"""
    processed = model.preprocess(data)
    results = model.inference(processed)
    return model.postprocess(results)

# Usage
model = TransformerModel("gpt-4-turbo")
output = ai_breakthrough(model, user_input)
\`\`\`

### Data Visualization
\`\`\`mermaid
graph TD
    A[User Query] --> B[Data Collection]
    B --> C[AI Processing]
    C --> D[Result Analysis]
    D --> E[Response Generation]
    E --> F[User Display]
\`\`\`

### Performance Metrics

| Model | Accuracy | Speed | Memory |
|-------|----------|-------|---------|
| GPT-4 | 94.2% | 1.2s | 8GB |
| Claude | 93.8% | 0.9s | 6GB |
| Gemini | 92.1% | 1.5s | 7GB |

> "The future of AI lies not just in making machines smarter, but in making them more helpful and aligned with human values." - Leading AI Researcher

## Conclusion

The field continues to advance with **breakthrough innovations** happening monthly. Key areas to watch include:

1. **Multimodal AI** - Integration of text, image, and audio processing
2. **Edge Computing** - Running AI models on mobile devices
3. **Ethical AI** - Ensuring responsible development and deployment

For more detailed information, refer to the latest research papers and industry reports.`,
  conversation: [
    {
      role: "user",
      content: "What are the latest developments in artificial intelligence?"
    },
    {
      role: "assistant", 
      content: "I'll search for the latest AI developments and provide you with a comprehensive overview.",
      tool_calls: [
        {
          function: {
            name: "web_search",
            arguments: '{"query": "latest artificial intelligence developments 2024"}'
          }
        }
      ]
    },
    {
      role: "tool",
      content: "Found 25 relevant articles about recent AI developments..."
    },
    {
      role: "assistant",
      content: "Based on my search results, here are the key developments in AI..."
    }
  ]
};

export default function DemoPage() {
  const [demoState, setDemoState] = useState<'idle' | 'processing' | 'complete' | 'error'>('idle');
  const [showPasswordDemo, setShowPasswordDemo] = useState(false);
  const [showMarkdownDemo, setShowMarkdownDemo] = useState(false);

  const handleDemoSearch = (query: string, model?: string, writeModel?: string) => {
    console.log('Demo search:', { query, model, writeModel });
    setDemoState('processing');
    
    // Simulate processing
    setTimeout(() => {
      setDemoState('complete');
    }, 3000);
  };

  const resetDemo = () => {
    setDemoState('idle');
  };

  const triggerError = () => {
    setDemoState('error');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--color-surface)' }}>
        {/* Header */}
        <header className="theme-transition" style={{ 
          backgroundColor: 'var(--color-header-bg)', 
          borderBottomColor: 'var(--color-header-border)',
          borderBottomWidth: '1px'
        }}>
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                  Component Demo
                </h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Test all components in light and dark modes
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggleCompact />
                <ThemeToggle size="md" />
                <ThemeToggle size="lg" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-12">
            
            {/* Demo Controls */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Demo Controls
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setDemoState('idle')}
                  className="px-4 py-2 rounded-lg transition-colors theme-transition"
                  style={{
                    backgroundColor: demoState === 'idle' ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                    color: demoState === 'idle' ? 'var(--color-text-inverse)' : 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    borderWidth: '1px'
                  }}
                >
                  Idle State
                </button>
                <button
                  onClick={() => setDemoState('processing')}
                  className="px-4 py-2 rounded-lg transition-colors theme-transition"
                  style={{
                    backgroundColor: demoState === 'processing' ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                    color: demoState === 'processing' ? 'var(--color-text-inverse)' : 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    borderWidth: '1px'
                  }}
                >
                  Processing State
                </button>
                <button
                  onClick={() => setDemoState('complete')}
                  className="px-4 py-2 rounded-lg transition-colors theme-transition"
                  style={{
                    backgroundColor: demoState === 'complete' ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                    color: demoState === 'complete' ? 'var(--color-text-inverse)' : 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    borderWidth: '1px'
                  }}
                >
                  Complete State
                </button>
                <button
                  onClick={triggerError}
                  className="px-4 py-2 rounded-lg transition-colors theme-transition"
                  style={{
                    backgroundColor: demoState === 'error' ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                    color: demoState === 'error' ? 'var(--color-text-inverse)' : 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    borderWidth: '1px'
                  }}
                >
                  Error State
                </button>
                <button
                  onClick={() => setShowPasswordDemo(!showPasswordDemo)}
                  className="px-4 py-2 rounded-lg transition-colors theme-transition"
                  style={{
                    backgroundColor: showPasswordDemo ? 'var(--color-accent)' : 'var(--color-surface-hover)',
                    color: showPasswordDemo ? 'var(--color-text-inverse)' : 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    borderWidth: '1px'
                  }}
                >
                  {showPasswordDemo ? 'Hide' : 'Show'} Password Demo
                </button>
                <button
                  onClick={() => setShowMarkdownDemo(!showMarkdownDemo)}
                  className="px-4 py-2 rounded-lg transition-colors theme-transition"
                  style={{
                    backgroundColor: showMarkdownDemo ? 'var(--color-accent)' : 'var(--color-surface-hover)',
                    color: showMarkdownDemo ? 'var(--color-text-inverse)' : 'var(--color-text)',
                    borderColor: 'var(--color-border)',
                    borderWidth: '1px'
                  }}
                >
                  {showMarkdownDemo ? 'Hide' : 'Show'} Markdown Demo
                </button>
              </div>
            </section>

            {/* Password Auth Demo */}
            {showPasswordDemo && (
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  Password Authentication
                </h2>
                <div className="rounded-lg p-6" style={{ 
                  backgroundColor: 'var(--color-card)', 
                  borderColor: 'var(--color-border)',
                  borderWidth: '1px'
                }}>
                  <PasswordAuth onAuthenticated={() => console.log('Demo auth')} />
                </div>
              </section>
            )}

            {/* Search Form Demo */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Search Form
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                    Normal State
                  </h3>
                  <SearchForm
                    onSubmit={handleDemoSearch}
                    isLoading={false}
                    disabled={false}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                    Loading State
                  </h3>
                  <SearchForm
                    onSubmit={handleDemoSearch}
                    isLoading={true}
                    disabled={false}
                  />
                </div>
              </div>
            </section>

            {/* Progress View Demo */}
            {demoState === 'processing' && (
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  Progress View
                </h2>
                <ProgressView
                  metadata={mockProgressMetadata}
                  isVisible={true}
                />
              </section>
            )}

            {/* Result View Demo */}
            {demoState === 'complete' && (
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  Result View
                </h2>
                <ResultView
                  result={mockResult}
                  onNewSearch={resetDemo}
                  isVisible={true}
                />
              </section>
            )}

            {/* Error State Demo */}
            {demoState === 'error' && (
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  Error State
                </h2>
                <div className="rounded-lg p-4 theme-transition" style={{ 
                  backgroundColor: 'var(--color-error-bg)', 
                  borderColor: 'var(--color-error)',
                  borderWidth: '1px'
                }}>
                  <div className="flex items-start gap-3">
                    <svg 
                      className="w-5 h-5 mt-0.5 flex-shrink-0" 
                      style={{ color: 'var(--color-error)' }}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--color-error)' }}>
                        Demo Error State
                      </h3>
                      <p className="text-sm mb-3" style={{ color: 'var(--color-error)' }}>
                        This is a demonstration of how errors are displayed in the application.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={resetDemo}
                          className="px-3 py-1.5 text-sm rounded transition-colors theme-transition"
                          style={{ 
                            backgroundColor: 'var(--color-error)',
                            color: 'var(--color-text-inverse)'
                          }}
                        >
                          Reset Demo
                        </button>
                        <button
                          onClick={() => setDemoState('idle')}
                          className="px-3 py-1.5 text-sm rounded transition-colors theme-transition"
                          style={{ 
                            backgroundColor: 'var(--color-surface-hover)',
                            color: 'var(--color-text)'
                          }}
                        >
                          Back to Idle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Status Cards Demo */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Status Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Success Card */}
                <div className="rounded-lg p-4 theme-transition" style={{ 
                  backgroundColor: 'var(--color-success-bg)', 
                  borderColor: 'var(--color-success)',
                  borderWidth: '1px'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" style={{ color: 'var(--color-success)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-medium" style={{ color: 'var(--color-success)' }}>Success</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-success)' }}>Operation completed successfully</p>
                </div>

                {/* Warning Card */}
                <div className="rounded-lg p-4 theme-transition" style={{ 
                  backgroundColor: 'var(--color-warning-bg)', 
                  borderColor: 'var(--color-warning)',
                  borderWidth: '1px'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" style={{ color: 'var(--color-warning)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-medium" style={{ color: 'var(--color-warning)' }}>Warning</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-warning)' }}>Please review this information</p>
                </div>

                {/* Error Card */}
                <div className="rounded-lg p-4 theme-transition" style={{ 
                  backgroundColor: 'var(--color-error-bg)', 
                  borderColor: 'var(--color-error)',
                  borderWidth: '1px'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" style={{ color: 'var(--color-error)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-medium" style={{ color: 'var(--color-error)' }}>Error</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-error)' }}>Something went wrong</p>
                </div>

                {/* Info Card */}
                <div className="rounded-lg p-4 theme-transition" style={{ 
                  backgroundColor: 'var(--color-info-bg)', 
                  borderColor: 'var(--color-info)',
                  borderWidth: '1px'
                }}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" style={{ color: 'var(--color-info)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h3 className="font-medium" style={{ color: 'var(--color-info)' }}>Info</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--color-info)' }}>Here&apos;s some helpful information</p>
                </div>
              </div>
            </section>

            {/* Markdown Demo */}
            {showMarkdownDemo && (
              <section>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                  Markdown Rendering
                </h2>
                <MarkdownDemo />
              </section>
            )}

            {/* Color Palette Demo */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                Color Palette
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Primary', bg: 'var(--color-primary)', text: 'var(--color-text-inverse)' },
                  { name: 'Secondary', bg: 'var(--color-secondary)', text: 'var(--color-text-inverse)' },
                  { name: 'Accent', bg: 'var(--color-accent)', text: 'var(--color-text-inverse)' },
                  { name: 'Success', bg: 'var(--color-success)', text: 'var(--color-text-inverse)' },
                  { name: 'Warning', bg: 'var(--color-warning)', text: 'var(--color-text-inverse)' },
                  { name: 'Error', bg: 'var(--color-error)', text: 'var(--color-text-inverse)' },
                  { name: 'Surface', bg: 'var(--color-surface)', text: 'var(--color-text)', border: 'var(--color-border)' },
                  { name: 'Card', bg: 'var(--color-card)', text: 'var(--color-text)', border: 'var(--color-border)' },
                ].map((color) => (
                  <div
                    key={color.name}
                    className="rounded-lg p-4 text-center theme-transition"
                    style={{
                      backgroundColor: color.bg,
                      color: color.text,
                      borderColor: color.border,
                      borderWidth: color.border ? '1px' : '0'
                    }}
                  >
                    <div className="font-medium text-sm">{color.name}</div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 theme-transition" style={{ 
          backgroundColor: 'var(--color-footer-bg)', 
          borderTopColor: 'var(--color-footer-border)',
          borderTopWidth: '1px'
        }}>
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <p>Component Demo Page - Test all components in light and dark modes</p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
} 