# WebSearch Agent Frontend Design

## Overview
A Next.js frontend application that triggers the `websearch-agent` Trigger.dev task with **persistent task tracking**, monitors progress in real-time, and displays results with comprehensive theming support. The application now supports task recovery and resumption across page refreshes and browser restarts.

## Current Architecture

### Tech Stack
- **Framework**: Next.js 15.3.3 with React 19
- **Styling**: Tailwind CSS v4 with comprehensive dark/light theme system
- **State Management**: React Context for theme management
- **Real-time Updates**: Trigger.dev React hooks for progress monitoring
- **Authentication**: Password-based authentication with session management
- **Markdown Rendering**: React-markdown with syntax highlighting and Mermaid diagram support
- **Task Persistence**: localStorage-based task tracking with server-side recovery APIs

### Core Dependencies
```json
{
  "@trigger.dev/sdk": "^3.0.0",
  "@trigger.dev/react-hooks": "^3.0.0",
  "next": "15.3.3",
  "react": "^19.0.0",
  "tailwindcss": "^4",
  "react-markdown": "^10.1.0",
  "highlight.js": "^11.11.1",
  "mermaid": "^11.6.0",
  "zod": "^3.22.0"
}
```

## Key Features

### 1. Persistent Task Tracking & Recovery ⭐ NEW
- **Immediate Task Persistence**: Tasks saved to localStorage when triggered, not just on completion
- **Status Tracking**: Track processing, complete, failed, and canceled task states
- **Automatic Recovery Detection**: App detects interrupted tasks on load and offers recovery
- **Server-side Status Checking**: API endpoints to verify task status via Trigger.dev SDK
- **Token Regeneration**: Generate new publicAccessTokens for resuming real-time monitoring
- **Seamless Reconnection**: Resume monitoring in-progress tasks after page refresh

### 2. Task Triggering & Management
- **Search Form**: Input query with configurable search parameters
- **Authentication**: Password-protected access with session persistence
- **Task Execution**: Trigger websearch-agent with real-time progress tracking
- **Error Handling**: Comprehensive error boundaries and user feedback

### 3. Real-time Progress Monitoring
- **Live Updates**: WebSocket-based progress updates via Trigger.dev Realtime
- **Progress Visualization**: Animated progress bars and status indicators
- **Action Timeline**: Historical view of search actions and iterations
- **Current Status**: Real-time display of current search operation
- **Reconnection Support**: Resume monitoring after interruption

### 4. Enhanced Search History Management
- **Persistent Storage**: Browser-based persistence with task status tracking
- **Status-aware History**: Display processing, complete, failed, and canceled entries
- **Recovery Interface**: Dedicated UI for resuming interrupted tasks
- **History Panel**: Slide-out interface with status indicators and resume functionality
- **Entry Management**: View, delete, and navigate historical results
- **Size Limits**: Maximum 50 entries with automatic cleanup

### 5. Result Display & Rendering
- **Markdown Support**: Full markdown rendering with GitHub Flavored Markdown
- **Syntax Highlighting**: Code blocks with language-specific highlighting
- **Mermaid Diagrams**: Interactive diagram rendering
- **Responsive Layout**: Mobile-optimized result display

### 6. Theme System
- **Multi-theme Support**: Light, dark, and auto (system preference) themes
- **Persistent Preferences**: Theme selection stored in localStorage
- **Smooth Transitions**: Animated theme switching with CSS transitions
- **Comprehensive Coverage**: All components support both themes
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios

## Component Architecture

### Core Components
```
src/
├── app/
│   ├── api/
│   │   ├── task-status/[runId]/route.ts    # Task status recovery API
│   │   ├── generate-token/route.ts         # Token regeneration API
│   │   └── trigger-search/route.ts         # Task triggering API
│   ├── layout.tsx                          # Root layout with ThemeProvider
│   ├── page.tsx                            # Main search interface
│   └── globals.css                         # Comprehensive CSS variables system
├── components/
│   ├── SearchForm.tsx                      # Query input and configuration
│   ├── ProgressView.tsx                    # Real-time progress display
│   ├── ResultView.tsx                      # Markdown result rendering
│   ├── PasswordAuth.tsx                    # Authentication interface
│   ├── ThemeToggle.tsx                     # Theme switching control
│   ├── MarkdownRenderer.tsx                # Enhanced markdown rendering
│   ├── ErrorBoundary.tsx                   # Error handling wrapper
│   ├── SearchHistory.tsx                   # Enhanced history panel
│   ├── HistoryEntry.tsx                    # Status-aware history entry
│   ├── TaskRecoveryNotification.tsx        # Recovery notification UI
│   ├── ProcessingTaskItem.tsx              # Resume task component
│   ├── ProcessingIndicator.tsx             # Processing status indicator
│   └── TaskStatusBadge.tsx                 # Status badge component
├── contexts/
│   └── ThemeContext.tsx                    # Global theme state management
├── hooks/
│   ├── useWebSearch.ts                     # Enhanced search hook with persistence
│   ├── useSearchHistory.ts                 # Status-aware history management
│   ├── useTaskRecovery.ts                  # Task recovery logic
│   └── useTaskReconnection.ts              # Task reconnection logic
├── lib/
│   ├── theme-utils.ts                      # Theme utility functions
│   └── localStorage.ts                     # Enhanced storage utilities
└── types/
    ├── websearch.ts                        # Enhanced search-related types
    └── theme.ts                            # Theme-related types
```

### State Management
```typescript
// Enhanced Application State
interface AppState {
  stage: 'idle' | 'processing' | 'complete' | 'error';
  query: string;
  runId?: string;
  publicAccessToken?: string;
  progress: WebSearchMetadata;
  result?: WebSearchOutput;
  error?: string;
  // Recovery state
  recoverableTasks: TaskRecoveryInfo[];
  isCheckingRecovery: boolean;
}

// Enhanced Search History Types
interface SearchHistoryEntry {
  id: string;                                        // Generated unique ID
  query: string;                                     # Original search query
  runId: string;                                     # Trigger.dev run identifier
  status: 'processing' | 'complete' | 'failed' | 'canceled'; # Task status
  result?: WebSearchOutput;                          # Optional until completed
  error?: string;                                    # Error message if failed
  timestamp: number;                                 # When task was triggered
  completedAt?: number;                              # When task completed
  model?: string;                                    # Model used for search
  writeModel?: string;                               # Model used for writing
}

// Task Recovery Types
interface TaskRecoveryInfo {
  runId: string;
  query: string;
  status: 'processing';
  timestamp: number;
  model?: string;
  writeModel?: string;
}

interface TaskStatusResponse {
  runId: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  metadata?: WebSearchMetadata;
  output?: WebSearchOutput;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## Data Flow

### Enhanced Search Process
1. **Authentication**: User enters password to access the application
2. **Query Input**: User submits search query with optional parameters
3. **Immediate Persistence**: Task saved to localStorage with "processing" status
4. **Task Trigger**: Frontend triggers websearch-agent via Trigger.dev API
5. **Progress Monitoring**: Real-time updates via WebSocket connection
6. **Result Display**: Final answer rendered with full markdown support
7. **Status Update**: History entry updated from "processing" to "complete"
8. **Session Management**: Results cached for session duration

### Task Recovery Flow ⭐ NEW
1. **Detection**: App checks localStorage for processing tasks on load
2. **Status Verification**: Server-side API checks current task status via `runs.retrieve()`
3. **Recovery Notification**: UI displays recoverable tasks to user
4. **Token Regeneration**: New publicAccessToken generated for real-time monitoring
5. **Reconnection**: Resume monitoring with new token or display completed results
6. **History Update**: Update localStorage entries based on current server status

### Task Interrupt & Resume Workflow ⭐ NEW
```
User Action → Page Refresh/Close
     ↓
App Load → Check localStorage for processing tasks
     ↓
Server API → runs.retrieve(runId) for each task
     ↓
Status Check → PENDING/EXECUTING → Generate new token → Resume monitoring
             → COMPLETED → Update history → Show result
             → FAILED → Update history → Show error
             → NOT_FOUND → Mark as failed → Clean up
```

## Server-Side APIs ⭐ NEW

### Task Status Endpoint
```typescript
// GET /api/task-status/[runId]
// Returns current task status, metadata, output, and error information
interface TaskStatusResponse {
  runId: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELED';
  metadata?: WebSearchMetadata;
  output?: WebSearchOutput;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Token Generation Endpoint
```typescript
// POST /api/generate-token
// Generates new publicAccessToken for specific runId
interface PublicTokenResponse {
  publicAccessToken: string;
  runId: string;
  expiresAt: string; // 24 hours from generation
}
```

## Integration Points

### Trigger.dev Integration
```typescript
// Enhanced Task Input
interface WebSearchInput {
  query: string;
  searchParams?: {
    searchDepth?: "basic" | "advanced";
    topic?: "general" | "news";
    maxResults?: number;
  };
  model?: string;
  maxIterations?: number;
}

// Progress Metadata
interface WebSearchMetadata {
  progress: number;
  actionHistory: string[];
  currentAction?: string;
  totalIterations: number;
  currentIteration: number;
  lastUpdated: string;
}

// Task Output
interface WebSearchOutput {
  answer: string | null;
  conversation: Array<{
    role: string;
    content: string | null;
    tool_calls?: any[];
  }>;
}
```

### Recovery Integration
- **Server-side Recovery**: Uses `runs.retrieve(runId)` to check task status
- **Token Management**: `auth.createPublicToken()` for new client-side tokens
- **Real-time Reconnection**: Seamless integration with existing `useRealtimeRun` hook
- **Error Handling**: Graceful handling of expired, not found, or failed tasks

## UI Design System

### Enhanced Layout Structure
```
┌─────────────────────────────────────┐
│ Header: Logo + History + Theme      │
├─────────────────────────────────────┤
│ Recovery Notification (if needed)   │ ⭐ NEW
├─────────────────────────────────────┤
│ Main Content:                       │
│ ┌─────────────────────────────────┐ │
│ │ Auth / Search / Progress / Result│ │
│ └─────────────────────────────────┘ │
│ Enhanced History Panel (slide-out)  │
│ - Processing indicators             │ ⭐ NEW
│ - Status badges                     │ ⭐ NEW
│ - Resume buttons                    │ ⭐ NEW
└─────────────────────────────────────┘
```

### Status Indicators ⭐ NEW
```css
/* Processing Status */
.status-processing { color: var(--color-warning); }
/* Complete Status */
.status-complete { color: var(--color-success); }
/* Failed Status */
.status-failed { color: var(--color-error); }
/* Canceled Status */
.status-canceled { color: var(--color-text-secondary); }
```

