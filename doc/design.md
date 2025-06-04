# WebSearch Agent Frontend Design

## Overview
A minimal Next.js frontend to trigger the `websearch-agent` Trigger.dev task, monitor progress in real-time, and display results.

## Requirements

### Functional Requirements
1. **Task Triggering**
   - Simple form to input search query
   - Trigger the `websearch-agent` task
   - Handle authentication with Trigger.dev

2. **Progress Monitoring**
   - Real-time progress updates via Trigger.dev Realtime
   - Display current action and progress percentage
   - Show action history timeline

3. **Result Display**
   - Display final response/answer
   - Show conversation history if needed
   - Handle error states gracefully

### Non-Functional Requirements
- Minimal UI with maximum usability
- Real-time updates without polling
- Accessible and responsive design
- Fast loading and interaction

## Utilities & Dependencies

### Core Dependencies
```json
{
  "@trigger.dev/sdk": "^3.x",
  "@trigger.dev/react-hooks": "^3.x",
  "next": "^14.x",
  "react": "^18.x",
  "tailwindcss": "^3.x",
  "zod": "^3.x"
}
```

### Utility Functions
1. **Trigger Service** (`lib/trigger.ts`)
   - Initialize Trigger.dev client
   - Trigger websearch-agent task
   - Handle authentication tokens

2. **Type Definitions** (`types/websearch.ts`)
   - WebSearch agent input/output types
   - Metadata schema types
   - UI state types

3. **Hooks** (`hooks/useWebSearch.ts`)
   - Custom hook for task triggering
   - Real-time progress subscription
   - State management

## UI Design

### Layout Structure
```
┌─────────────────────────────────────┐
│ Header: "Web Search Agent"          │
├─────────────────────────────────────┤
│                                     │
│ Main Content Area:                  │
│ ┌─────────────────────────────────┐ │
│ │ Search Form / Progress / Result │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Component Hierarchy
- **Page**: `/` (Home)
  - **SearchForm**: Input query and trigger
  - **ProgressView**: Real-time progress display
  - **ResultView**: Final answer display

### States & Views
1. **Initial State**: Show search form
2. **Processing State**: Show progress with timeline
3. **Complete State**: Show result with option to search again
4. **Error State**: Show error with retry option

### Design System
- **Colors**: 
  - Primary: Blue-600 for actions
  - Success: Green-500 for completion
  - Warning: Amber-500 for progress
  - Error: Red-500 for failures
  - Gray scale for text hierarchy

- **Typography**:
  - Heading: text-2xl font-bold
  - Body: text-base
  - Caption: text-sm text-gray-600

- **Spacing**: Consistent 4px grid (4, 8, 16, 24, 32px)

## Data Structure

### Application State
```typescript
interface AppState {
  // Current stage of the process
  stage: 'idle' | 'processing' | 'complete' | 'error';
  
  // Search query
  query: string;
  
  // Task execution data
  runId?: string;
  publicAccessToken?: string;
  
  // Progress data from metadata
  progress: {
    percentage: number;
    currentAction: string;
    actionHistory: string[];
    currentIteration: number;
    totalIterations: number;
  };
  
  // Final result
  result?: {
    answer: string;
    conversation: Array<{
      role: string;
      content: string;
    }>;
  };
  
  // Error handling
  error?: string;
}
```

### Trigger.dev Integration Types
```typescript
// Input for websearch-agent task
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

// Metadata structure from task
interface WebSearchMetadata {
  progress: number;
  actionHistory: string[];
  currentAction?: string;
  totalIterations: number;
  currentIteration: number;
  lastUpdated: string;
}

// Output from websearch-agent task
interface WebSearchOutput {
  answer: string | null;
  conversation: Array<{
    role: string;
    content: string | null;
    tool_calls?: any[];
    tool_call_id?: string;
  }>;
}
```

## File Structure
```
trigger-dev-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main search page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── SearchForm.tsx        # Query input form
│   │   ├── ProgressView.tsx      # Real-time progress
│   │   ├── ResultView.tsx        # Final result display
│   │   └── ErrorBoundary.tsx     # Error handling
│   ├── hooks/
│   │   └── useWebSearch.ts       # Custom search hook
│   ├── lib/
│   │   ├── trigger.ts            # Trigger.dev client
│   │   └── utils.ts              # Utility functions
│   └── types/
│       └── websearch.ts          # Type definitions
└── package.json
```

## User Flow
1. User enters search query in form
2. Form submission triggers websearch-agent task
3. UI switches to progress view showing:
   - Progress bar (0-100%)
   - Current action text
   - Action history timeline
4. Real-time updates via Trigger.dev Realtime
5. On completion, show final answer
6. Provide option to perform new search

## Technical Considerations
- Use Server Components where possible for better performance
- Client Components only for interactive elements
- Implement proper error boundaries
- Handle WebSocket connection issues gracefully
- Optimize for mobile responsiveness
- Ensure accessibility compliance (WCAG 2.1 AA)

## Authentication Strategy
- Generate public access tokens for each search session
- Scope tokens to specific run IDs only
- Handle token expiration gracefully
- Store tokens securely (memory only, not localStorage)
