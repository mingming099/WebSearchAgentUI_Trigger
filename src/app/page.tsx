"use client";

import { useWebSearch } from "@/hooks/useWebSearch";
import { useAuth } from "@/hooks/useAuth";
import SearchForm from "@/components/SearchForm";
import ProgressView from "@/components/ProgressView";
import ResultView from "@/components/ResultView";
import ErrorBoundary from "@/components/ErrorBoundary";
import PasswordAuth from "@/components/PasswordAuth";

export default function Home() {
  const { isAuthenticated, isLoading, authenticate } = useAuth();
  
  const {
    stage,
    query,
    progress,
    result,
    error,
    isLoading: searchLoading,
    isComplete,
    hasError,
    isIdle,
    triggerSearch,
    resetSearch,
    retrySearch,
  } = useWebSearch();

  // Handle search submission with model parameters
  const handleSearch = (query: string, model?: string, writeModel?: string) => {
    triggerSearch(query, model, writeModel);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show password screen
  if (!isAuthenticated) {
    return <PasswordAuth onAuthenticated={authenticate} />;
  }

  // Main content when authenticated
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Web Search Agent
              </h1>
              <p className="text-gray-600">
                Powered by Trigger.dev - Ask anything and get comprehensive answers from the web
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-8">
            
            {/* Search Form - Always visible but disabled during processing */}
            {(isIdle || hasError) && (
              <div className="space-y-4">
                <SearchForm
                  onSubmit={handleSearch}
                  isLoading={searchLoading}
                  disabled={searchLoading}
                />
                
                {/* Error Display */}
                {hasError && error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg 
                        className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" 
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
                        <h3 className="text-sm font-medium text-red-800 mb-1">
                          Search Failed
                        </h3>
                        <p className="text-sm text-red-700 mb-3">
                          {error}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={retrySearch}
                            className="
                              px-3 py-1.5 bg-red-600 text-white text-sm rounded
                              hover:bg-red-700 transition-colors
                            "
                          >
                            Retry Search
                          </button>
                          <button
                            onClick={resetSearch}
                            className="
                              px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded
                              hover:bg-gray-200 transition-colors
                            "
                          >
                            New Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress View - Shown during processing */}
            <ProgressView
              metadata={progress}
              isVisible={stage === 'processing'}
            />

            {/* Result View - Shown when complete */}
            {result && isComplete && (
              <ResultView
                result={result}
                onNewSearch={resetSearch}
                isVisible={isComplete}
              />
            )}

            {/* Current Query Display - Shown during processing and completion */}
            {(stage === 'processing' || stage === 'complete') && query && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-1">
                  Current Search Query
                </h3>
                <p className="text-sm text-blue-700">
                  &ldquo;{query}&rdquo;
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>
                Built with{" "}
                <a 
                  href="https://trigger.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Trigger.dev
                </a>
                {" "}and{" "}
                <a 
                  href="https://nextjs.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Next.js
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
