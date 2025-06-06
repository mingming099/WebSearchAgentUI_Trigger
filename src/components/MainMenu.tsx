"use client";

import { useRouter } from 'next/navigation';

interface MainMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSearch: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export default function MainMenu({
  isOpen,
  onClose,
  onNewSearch,
  onOpenHistory,
  historyCount,
}: MainMenuProps) {
  const router = useRouter();

  // Close panel when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOpenMarkdownViewer = () => {
    router.push('/markdown-viewer');
    onClose();
  };

  const menuItems = [
    {
      id: 'new-search',
      label: 'New Search',
      icon: (
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
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
      onClick: () => {
        onNewSearch();
        onClose();
      },
      badge: null,
    },
    {
      id: 'history',
      label: 'History',
      icon: (
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
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l4 2" />
        </svg>
      ),
      onClick: () => {
        onOpenHistory();
        onClose();
      },
      badge: historyCount > 0 ? historyCount : null,
    },
    {
      id: 'markdown-viewer',
      label: 'Markdown Viewer',
      icon: (
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      ),
      onClick: handleOpenMarkdownViewer,
      badge: null,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-out theme-transition ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--color-background)',
          borderRightColor: 'var(--color-border)',
          borderRightWidth: '1px',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 theme-transition"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderBottomColor: 'var(--color-border)',
            borderBottomWidth: '1px',
          }}
        >
          <h2
            className="text-lg font-semibold theme-transition"
            style={{ color: 'var(--color-text)' }}
          >
            Menu
          </h2>
          
          {/* Close button */}
          <button
            onClick={onClose}
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
            aria-label="Close menu"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors theme-transition text-left"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.icon}
                </div>
                
                <span className="flex-1 font-medium">
                  {item.label}
                </span>
                
                {item.badge && (
                  <span
                    className="min-w-[20px] h-[20px] text-xs font-medium rounded-full flex items-center justify-center theme-transition"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-text-inverse)',
                      fontSize: '10px',
                    }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 text-center theme-transition"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderTopColor: 'var(--color-border)',
            borderTopWidth: '1px',
          }}
        >
          <p
            className="text-sm theme-transition"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Web Search Agent
          </p>
        </div>
      </div>
    </>
  );
} 