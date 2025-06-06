/**
 * Export format types
 */
export type ExportFormat = 'html';

/**
 * Export options interface
 */
export interface ExportOptions {
  /** The format to export to */
  format: ExportFormat;
  /** The filename for the exported file (without extension) */
  filename?: string;
  /** Whether to include theme-specific styling */
  includeTheme?: boolean;

  /** HTML-specific options */
  html?: {
    /** Whether to include external CSS links */
    includeExternalCSS?: boolean;
    /** Whether to inline all styles */
    inlineStyles?: boolean;
  };
}

/**
 * Export result interface
 */
export interface ExportResult {
  /** Whether the export was successful */
  success: boolean;
  /** Error message if export failed */
  error?: string;
  /** The exported content (for HTML exports) */
  content?: string;
  /** The filename that was used */
  filename?: string;
  /** Export metadata */
  metadata?: {
    /** Size of the exported content in bytes */
    size: number;
    /** Export timestamp */
    timestamp: Date;
    /** Export format used */
    format: ExportFormat;
  };
}

/**
 * Export progress callback type
 */
export type ExportProgressCallback = (progress: number, message?: string) => void;

/**
 * Export configuration interface
 */
export interface ExportConfig {
  /** Default export options */
  defaultOptions: Partial<ExportOptions>;
  /** Maximum file size in bytes (for validation) */
  maxFileSize?: number;
  /** Timeout for export operations in milliseconds */
  timeout?: number;
} 