// Type definitions for WebSearch Agent integration

// Search history entry - Updated to support task persistence
export interface SearchHistoryEntry {
  id: string;                    // Unique identifier (timestamp-based)
  query: string;                 // Original search query
  runId: string;                 // NEW: Trigger.dev run identifier
  status: 'processing' | 'complete' | 'failed' | 'canceled'; // NEW: Task status
  result?: WebSearchOutput;      // Updated: Optional until completed
  error?: string;                // NEW: Error message if failed
  timestamp: number;             // When task was triggered (not completed)
  completedAt?: number;          // NEW: When task completed
  model?: string;                // Model used for search
  writeModel?: string;           // Write model used
}

// History management
export interface SearchHistory {
  entries: SearchHistoryEntry[];
  maxEntries: number;            // Limit to prevent localStorage bloat
}

// NEW: Task recovery types
export interface TaskRecoveryInfo {
  runId: string;
  query: string;
  status: 'processing' | 'complete' | 'failed' | 'canceled';
  timestamp: number;
  model?: string;
  writeModel?: string;
}

export interface TaskStatusResponse {
  runId: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELED' | 'QUEUED' | 'TIMED_OUT' | 'WAITING_FOR_DEPLOY' | 'REATTEMPTING' | 'FROZEN' | 'CRASHED' | 'INTERRUPTED' | 'SYSTEM_FAILURE' | 'DELAYED' | 'EXPIRED';
  metadata?: WebSearchMetadata;
  output?: WebSearchOutput;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicTokenResponse {
  publicAccessToken: string;
  runId: string;
  expiresAt?: string;
}

// Application state management
export interface AppState {
  // Current stage of the process
  stage: 'idle' | 'processing' | 'complete' | 'error';
  
  // Search query
  query: string;
  
  // Task execution data
  runId?: string;
  publicAccessToken?: string;
  
  // Progress data from metadata
  progress: WebSearchMetadata;
  
  // Final result
  result?: WebSearchOutput;
  
  // Error handling
  error?: string;
  
  // History state
  showHistory: boolean;          // Toggle history panel visibility
  selectedHistoryEntry?: SearchHistoryEntry; // Currently viewing history entry
}

// Input for websearch-agent task
export interface WebSearchInput {
  query: string;
  searchParams?: {
    searchDepth?: "basic" | "advanced";
    topic?: "general" | "news";
    maxResults?: number;
    includeImages?: boolean;
    includeImageDescriptions?: boolean;
    includeAnswer?: boolean;
    timeRange?: "day" | "week" | "month" | "year";
    days?: number;
  };
  extractParams?: {
    includeImages?: boolean;
    extractDepth?: "basic" | "advanced";
    timeout?: number;
  };
  model?: string;
  writeModel?: string;
  summarize?: boolean;
  maxIterations?: number;
}

// Metadata structure from websearch-agent task
export interface WebSearchMetadata {
  progress: number;
  actionHistory: string[];
  currentAction?: string;
  totalIterations: number;
  currentIteration: number;
  lastUpdated: string;
}

// Output from websearch-agent task
export interface WebSearchOutput {
  answer: string | null;
  conversation: Array<{
    role: string;
    content: string | null;
    tool_calls?: Array<{
      id?: string;
      type?: string;
      function?: {
        name?: string;
        arguments?: string;
      };
    }>;
    tool_call_id?: string;
  }>;
}

// UI Component Props
export interface SearchFormProps {
  onSubmit: (query: string, model?: string, writeModel?: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export interface ProgressViewProps {
  metadata: WebSearchMetadata;
  isVisible: boolean;
  onCancel?: () => void;        // Cancel button handler
  isCanceling?: boolean;        // Cancel loading state
}

export interface ResultViewProps {
  result: WebSearchOutput;
  onNewSearch: () => void;
  isVisible: boolean;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export interface HistoryToggleProps {
  onClick: () => void;
  historyCount: number;
  isOpen: boolean;
}

export interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  entries: SearchHistoryEntry[];
  onSelectEntry: (entry: SearchHistoryEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClearHistory: () => void;
  onResumeTask?: (runId: string, publicAccessToken?: string) => void;
}

export interface HistoryEntryProps {
  entry: SearchHistoryEntry;
  onSelect: () => void;
  onDelete: () => void;
}

// Trigger.dev related types
export interface TriggerHandle {
  id: string;
  publicAccessToken: string;
}

export interface RunStatus {
  id: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  output?: WebSearchOutput;
  metadata?: WebSearchMetadata;
}

// Cancel API types
export interface CancelTaskRequest {
  runId: string;
}

export interface CancelTaskResponse {
  success: boolean;
  message: string;
}