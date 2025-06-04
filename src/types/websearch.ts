// Type definitions for WebSearch Agent integration

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