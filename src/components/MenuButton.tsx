"use client";

interface MenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function MenuButton({ onClick, isOpen }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg transition-all duration-200 theme-transition"
      style={{
        backgroundColor: isOpen ? 'var(--color-primary)' : 'var(--color-surface-hover)',
        color: isOpen ? 'var(--color-text-inverse)' : 'var(--color-text)',
        borderColor: 'var(--color-border)',
        borderWidth: '1px',
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.currentTarget.style.backgroundColor = 'var(--color-border-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isOpen) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
        }
      }}
      aria-label={`${isOpen ? 'Close' : 'Open'} menu`}
      title="Menu"
    >
      {/* Hamburger Menu Icon */}
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
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
} 