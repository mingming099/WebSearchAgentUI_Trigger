import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to merge Tailwind CSS classes
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formats a timestamp to a human-readable string
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string
 */
export function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch (error) {
    console.error("Failed to format timestamp:", error);
    return "Invalid time";
  }
}

/**
 * Formats a relative time from a timestamp
 * @param timestamp - ISO timestamp string
 * @returns Relative time string (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  } catch (error) {
    console.error("Failed to format relative time:", error);
    return "Unknown time";
  }
}

/**
 * Calculates progress percentage based on current and total iterations
 * @param currentIteration - Current iteration number
 * @param totalIterations - Total number of iterations
 * @param baseProgress - Base progress percentage (0-100)
 * @returns Calculated progress percentage
 */
export function calculateProgress(
  currentIteration: number,
  totalIterations: number,
  baseProgress: number = 0
): number {
  if (totalIterations <= 0) return baseProgress;
  
  const iterationProgress = (currentIteration / totalIterations) * 100;
  return Math.min(Math.max(baseProgress + iterationProgress, 0), 100);
}

/**
 * Formats an error message for display to users
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("TRIGGER_SECRET_KEY")) {
      return "Configuration error: Please check your Trigger.dev credentials";
    }
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Network error: Please check your internet connection and try again";
    }
    if (error.message.includes("timeout")) {
      return "Request timeout: The operation took too long to complete";
    }
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  return "An unexpected error occurred. Please try again.";
}

/**
 * Validates if a string is a valid search query
 * @param query - Search query string
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateSearchQuery(query: string): { isValid: boolean; error?: string } {
  if (!query || typeof query !== "string") {
    return { isValid: false, error: "Query is required" };
  }
  
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length === 0) {
    return { isValid: false, error: "Query cannot be empty" };
  }
  
  if (trimmedQuery.length < 3) {
    return { isValid: false, error: "Query must be at least 3 characters long" };
  }
  
  if (trimmedQuery.length > 500) {
    return { isValid: false, error: "Query must be less than 500 characters" };
  }
  
  return { isValid: true };
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Safely parses JSON with error handling
 * @param jsonString - JSON string to parse
 * @returns Parsed object or null if parsing fails
 */
export function safeJsonParse<T = unknown>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

/**
 * Gets the default model from environment variables
 * @returns Default model string
 */
export function getDefaultModel(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_MODEL || "openai/gpt-4.1-mini";
}

/**
 * Gets the default write model from environment variables
 * @returns Default write model string
 */
export function getDefaultWriteModel(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_WRITE_MODEL || "openai/gpt-4.1-mini";
} 