"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import PasswordAuth from "@/components/PasswordAuth";
import ThemeToggle from "@/components/ThemeToggle";
import MarkdownViewer from "@/components/MarkdownViewer";

export default function MarkdownViewerPage() {
  const { isAuthenticated, isLoading, authenticate } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-transition" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div style={{ color: 'var(--color-text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  // If not authenticated, show password screen
  if (!isAuthenticated) {
    return <PasswordAuth onAuthenticated={authenticate} />;
  }

  // Handle back navigation
  const handleBack = () => {
    router.push('/');
  };

  // Main content when authenticated
  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Header */}
      <header className="theme-transition" style={{ 
        backgroundColor: 'var(--color-header-bg)', 
        borderBottomColor: 'var(--color-header-border)',
        borderBottomWidth: '1px'
      }}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left side - Back Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg transition-colors theme-transition"
                style={{
                  backgroundColor: 'var(--color-surface-hover)',
                  color: 'var(--color-text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                }}
                aria-label="Back to main app"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            {/* Center - Title */}
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Markdown Viewer
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Edit and preview markdown content with live rendering
              </p>
            </div>
            
            {/* Right side - Theme Toggle */}
            <div className="flex items-center gap-3">
              <ThemeToggle size="md" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <MarkdownViewer />
      </main>
    </div>
  );
} 