# Trigger.dev Task Flow in WebSearch Agent Frontend

## Overview
This document explains how the WebSearch Agent frontend handles Trigger.dev task execution, persistence, and recovery. The application supports seamless task resumption across page refreshes and browser restarts.

## Task Execution Flow

### 1. Task Triggering
```typescript
// User submits search → useWebSearch.triggerSearch()
const triggerSearch = async (query: string, model?: string, writeModel?: string) => {
  // 1. Immediately save to localStorage as "processing"
  const processingEntry = addProcessingEntry(query.trim(), Date.now().toString(), model, writeModel);

  // 2. Call server API to trigger websearch-agent task
  const handle = await triggerWebSearchAgent(searchInput);
  
  // 3. Update localStorage with real runId and set component state
  updateProcessingEntryWithRunId(processingEntry.id, handle.id);
  setState({
    runId: handle.id,
    publicAccessToken: handle.publicAccessToken,
    stage: 'processing'
  });
};
```

### 2. Real-time Progress Monitoring
```typescript
// useRealtimeRun hook monitors task progress
const { run } = useRealtimeRun(state.runId, {
  accessToken: state.publicAccessToken,
  enabled: !!(state.runId && state.publicAccessToken && state.stage === 'processing'),
});

// Handle status updates
useEffect(() => {
  if (run?.metadata) {
    setState(prev => ({ ...prev, progress: run.metadata }));
  }
  
  if (run?.status === 'COMPLETED') {
    setState(prev => ({ ...prev, stage: 'complete', result: run.output }));
    updateHistoryEntryStatus(state.runId, 'complete', run.output);
  }
  
  if (run?.status === 'FAILED') {
    setState(prev => ({ ...prev, stage: 'error', error: 'Task failed' }));
    updateHistoryEntryStatus(state.runId, 'failed', undefined, 'Task execution failed');
  }
}, [run]);
```

## Task Persistence & Recovery

### Data Structure
```typescript
interface SearchHistoryEntry {
  id: string;
  query: string;
  runId: string;
  status: 'processing' | 'complete' | 'failed' | 'canceled';
  result?: WebSearchOutput;
  error?: string;
  timestamp: number;
  completedAt?: number;
  model?: string;
  writeModel?: string;
}
```

### Recovery Process
```
App Load → useTaskRecovery hook
    ↓
Check localStorage for processing entries
    ↓
For each processing task:
    ↓
GET /api/task-status/{runId}
    ↓
├─ PENDING/EXECUTING → Show in recovery notification
├─ COMPLETED → Update localStorage to 'complete'
├─ FAILED → Update localStorage to 'failed'
└─ NOT_FOUND → Update localStorage to 'failed'
```

### Task Reconnection
```typescript
// User clicks "Resume" → useTaskReconnection.reconnectToTask()
const reconnectToTask = async (runId: string) => {
  // 1. Check current status
  const statusResponse = await fetch(`/api/task-status/${runId}`);
  const currentStatus = await statusResponse.json();

  if (currentStatus.status === 'PENDING' || currentStatus.status === 'EXECUTING') {
    // 2. Generate new publicAccessToken
    const tokenResponse = await fetch('/api/generate-token', {
      method: 'POST',
      body: JSON.stringify({ runId }),
    });
    const { publicAccessToken } = await tokenResponse.json();
    
    return { canReconnect: true, publicAccessToken, currentStatus };
  }
  
  return { canReconnect: false, currentStatus };
};
```

## Server-Side APIs

### Task Status Endpoint
```typescript
// GET /api/task-status/[runId]
export async function GET(request, { params }) {
  const { runId } = await params;
  const run = await runs.retrieve(runId); // Using Trigger.dev SDK

  return NextResponse.json({
    runId: run.id,
    status: run.status, // PENDING | EXECUTING | COMPLETED | FAILED | CANCELED
    metadata: run.metadata,
    output: run.output,
    error: run.status === 'FAILED' ? 'Task execution failed' : undefined,
  });
}
```

### Token Generation Endpoint
```typescript
// POST /api/generate-token
export async function POST(request) {
  const { runId } = await request.json();
  
  const publicToken = await auth.createPublicToken({
    scopes: { read: { runs: [runId] } },
    expirationTime: "24h",
  });

  return NextResponse.json({
    publicAccessToken: publicToken,
    runId: runId,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
}
```

## Authentication & Token Management

### Environment Variables
- **TRIGGER_SECRET_KEY**: Server-side secret for all Trigger.dev operations
- **NEXT_PUBLIC_TRIGGER_API_URL**: Optional custom API URL

### Token Types
1. **TRIGGER_SECRET_KEY** (Server-side only)
   - Used for `tasks.trigger()`, `runs.retrieve()`, `auth.createPublicToken()`
   - Never exposed to client

2. **publicAccessToken** (Client-side)
   - Generated during task trigger or recovery
   - Scoped to specific runId, expires in 24 hours
   - Used for real-time subscription via `useRealtimeRun`
   - Stored only in component state, never in localStorage

## Task Metadata Structure
```typescript
interface WebSearchMetadata {
  progress: number;              // 0-100 percentage
  actionHistory: string[];       // Array of completed actions
  currentAction?: string;        // Current operation description
  totalIterations: number;       // Expected total iterations
  currentIteration: number;      // Current iteration number
  lastUpdated: string;          // ISO timestamp
}
```

## UI Components

### Recovery Notification
- Displays on app load if processing tasks are found
- Shows task count and basic info
- Provides access to history panel for recovery actions

### Processing Task Item
- Shows individual recoverable task details
- "Resume Monitoring" button to reconnect
- Handles both reconnection and completed task display

### History Panel
- Status-aware display with badges (processing, complete, failed, canceled)
- Resume functionality for processing tasks
- Delete and clear options

## Error Handling

### Common Scenarios
- **Token Expiration**: Automatic regeneration during recovery
- **Task Not Found**: Mark as failed in localStorage
- **Network Failures**: Graceful degradation with retry logic
- **Multiple Concurrent Tasks**: Support for simultaneous recovery

### Recovery Strategies
```typescript
// Handle different error types during recovery
if (error.message.includes('404')) {
  updateHistoryEntryStatus(runId, 'failed', undefined, 'Task not found on server');
} else if (error.message.includes('401')) {
  console.error('Server authentication error - check TRIGGER_SECRET_KEY');
} else {
  console.error('Recovery failed, will retry:', error);
}
```

## Key Benefits

### Persistence
- Tasks saved immediately when triggered, not when completed
- Survives page refreshes, browser restarts, and network interruptions
- Complete task history with status tracking

### Recovery
- Automatic detection of interrupted tasks
- Seamless reconnection with new tokens
- Server-side validation of task status

### Security
- Tokens scoped to specific runId
- 24-hour expiration with regeneration capability
- Server-side validation for all operations

This architecture ensures no task progress or results are lost due to user actions or technical interruptions.
