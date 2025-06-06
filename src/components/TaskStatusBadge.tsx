"use client";

interface TaskStatusBadgeProps {
  status: 'processing' | 'complete' | 'failed' | 'canceled';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function TaskStatusBadge({
  status,
  size = 'md',
  showIcon = true
}: TaskStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          label: 'Processing',
          color: 'var(--color-primary)',
          bgColor: 'var(--color-primary-bg)',
          icon: (
            <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
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
          )
        };
      case 'complete':
        return {
          label: 'Complete',
          color: 'var(--color-success)',
          bgColor: 'var(--color-success-bg)',
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
          )
        };
      case 'failed':
        return {
          label: 'Failed',
          color: 'var(--color-error)',
          bgColor: 'var(--color-error-bg)',
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
          )
        };
      case 'canceled':
        return {
          label: 'Canceled',
          color: 'var(--color-warning)',
          bgColor: 'var(--color-warning-bg)',
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" 
                clipRule="evenodd" 
              />
            </svg>
          )
        };
      default:
        return {
          label: 'Unknown',
          color: 'var(--color-text-secondary)',
          bgColor: 'var(--color-surface)',
          icon: (
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" 
                clipRule="evenodd" 
              />
            </svg>
          )
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'px-2 py-1',
          textSize: 'text-xs',
          iconSize: 'w-3 h-3'
        };
      case 'lg':
        return {
          padding: 'px-4 py-2',
          textSize: 'text-base',
          iconSize: 'w-5 h-5'
        };
      default: // md
        return {
          padding: 'px-3 py-1.5',
          textSize: 'text-sm',
          iconSize: 'w-4 h-4'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const sizeConfig = getSizeConfig();

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-medium theme-transition ${sizeConfig.padding} ${sizeConfig.textSize}`}
      style={{ 
        color: statusConfig.color,
        backgroundColor: statusConfig.bgColor,
        borderColor: statusConfig.color,
        borderWidth: '1px'
      }}
    >
      {showIcon && (
        <span 
          className={`flex-shrink-0 ${sizeConfig.iconSize}`}
          style={{ color: statusConfig.color }}
        >
          {statusConfig.icon}
        </span>
      )}
      <span>{statusConfig.label}</span>
    </span>
  );
} 