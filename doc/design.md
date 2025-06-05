# WebSearch Agent Frontend Design

## Overview
A Next.js frontend application that triggers the `websearch-agent` Trigger.dev task, monitors progress in real-time, and displays results with comprehensive theming support.

## Current Architecture

### Tech Stack
- **Framework**: Next.js 15.3.3 with React 19
- **Styling**: Tailwind CSS v4 with comprehensive dark/light theme system
- **State Management**: React Context for theme management
- **Real-time Updates**: Trigger.dev React hooks for progress monitoring
- **Authentication**: Password-based authentication with session management
- **Markdown Rendering**: React-markdown with syntax highlighting and Mermaid diagram support

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

## Features

### 1. Task Triggering & Management
- **Search Form**: Input query with configurable search parameters
- **Authentication**: Password-protected access with session persistence
- **Task Execution**: Trigger websearch-agent with real-time progress tracking
- **Error Handling**: Comprehensive error boundaries and user feedback

### 2. Real-time Progress Monitoring
- **Live Updates**: WebSocket-based progress updates via Trigger.dev Realtime
- **Progress Visualization**: Animated progress bars and status indicators
- **Action Timeline**: Historical view of search actions and iterations
- **Current Status**: Real-time display of current search operation

### 3. Result Display & Rendering
- **Markdown Support**: Full markdown rendering with GitHub Flavored Markdown
- **Syntax Highlighting**: Code blocks with language-specific highlighting
- **Mermaid Diagrams**: Interactive diagram rendering
- **Responsive Layout**: Mobile-optimized result display

### 4. Theme System
- **Multi-theme Support**: Light, dark, and auto (system preference) themes
- **Persistent Preferences**: Theme selection stored in localStorage
- **Smooth Transitions**: Animated theme switching with CSS transitions
- **Comprehensive Coverage**: All components support both themes
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios

### 5. Search History Management
- **Local Storage**: Browser-based persistence of search results
- **History Panel**: Slide-out interface for viewing past searches
- **Entry Management**: View, delete, and navigate historical results
- **Auto-save**: Automatic saving of successful search results
- **Size Limits**: Maximum 50 entries to prevent storage bloat

## Component Architecture

### Core Components
```
src/
├── app/
│   ├── layout.tsx           # Root layout with ThemeProvider
│   ├── page.tsx             # Main search interface
│   └── globals.css          # Comprehensive CSS variables system
├── components/
│   ├── SearchForm.tsx       # Query input and configuration
│   ├── ProgressView.tsx     # Real-time progress display
│   ├── ResultView.tsx       # Markdown result rendering
│   ├── PasswordAuth.tsx     # Authentication interface
│   ├── ThemeToggle.tsx      # Theme switching control
│   ├── MarkdownRenderer.tsx # Enhanced markdown rendering
│   ├── ErrorBoundary.tsx    # Error handling wrapper
│   ├── SearchHistory.tsx    # Search history panel
│   ├── HistoryEntry.tsx     # Individual history entry
│   └── HistoryToggle.tsx    # History panel toggle button
├── contexts/
│   └── ThemeContext.tsx     # Global theme state management
├── hooks/
│   ├── useWebSearch.ts      # Custom search hook
│   └── useSearchHistory.ts  # Search history management hook
├── lib/
│   ├── theme-utils.ts       # Theme utility functions
│   └── localStorage.ts      # localStorage utility functions
└── types/
    ├── websearch.ts         # Search-related types
    └── theme.ts             # Theme-related types
```

### State Management
```typescript
// Application State
interface AppState {
  stage: 'idle' | 'processing' | 'complete' | 'error';
  query: string;
  runId?: string;
  publicAccessToken?: string;
  progress: {
    percentage: number;
    currentAction: string;
    actionHistory: string[];
    currentIteration: number;
    totalIterations: number;
  };
  result?: WebSearchOutput;
  error?: string;
  // History state
  showHistory: boolean;
  selectedHistoryEntry?: SearchHistoryEntry;
}

// Search History Types
interface SearchHistoryEntry {
  id: string;
  query: string;
  result: WebSearchOutput;
  timestamp: number;
  model?: string;
  writeModel?: string;
}

interface SearchHistory {
  entries: SearchHistoryEntry[];
  maxEntries: number;
}

// Theme State
interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  actualTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;
}
```

## Data Flow

### Search Process
1. **Authentication**: User enters password to access the application
2. **Query Input**: User submits search query with optional parameters
3. **Task Trigger**: Frontend triggers websearch-agent via Trigger.dev API
4. **Progress Monitoring**: Real-time updates via WebSocket connection
5. **Result Display**: Final answer rendered with full markdown support
6. **History Saving**: Successful results automatically saved to localStorage
7. **Session Management**: Results cached for session duration

### History Management
1. **Auto-save**: Completed searches automatically saved to browser storage
2. **History Access**: Toggle button in header reveals history panel
3. **Entry Navigation**: Click entries to view previous search results
4. **Entry Management**: Delete individual entries or clear all history
5. **Storage Limits**: Automatic cleanup when exceeding 50 entries

### Theme Management
1. **Initialization**: Theme loaded from localStorage or system preference
2. **User Control**: Theme toggle allows manual theme selection
3. **System Integration**: Auto theme follows system dark/light preference
4. **Persistence**: Theme choice saved across browser sessions
5. **Application**: CSS variables dynamically updated for all components

## UI Design System

### Color Palette
```css
/* Light Theme */
--color-background: #ffffff;
--color-foreground: #171717;
--color-primary: #3b82f6;
--color-surface: #f9fafb;
--color-border: #e5e7eb;

/* Dark Theme */
--color-background: #0a0a0a;
--color-foreground: #ededed;
--color-primary: #60a5fa;
--color-surface: #1f1f1f;
--color-border: #374151;
```

### Typography
- **Primary Font**: Geist Sans (system fallback)
- **Monospace Font**: Geist Mono for code blocks
- **Hierarchy**: Consistent text sizing with semantic classes
- **Accessibility**: Proper contrast ratios in both themes

### Layout Structure
```
┌─────────────────────────────────────┐
│ Header: Logo + History + Theme      │
├─────────────────────────────────────┤
│ Main Content:                       │
│ ┌─────────────────────────────────┐ │
│ │ Auth / Search / Progress / Result│ │
│ └─────────────────────────────────┘ │
│ History Panel (slide-out)           │
└─────────────────────────────────────┘
```

## Integration Points

### Trigger.dev Integration
```typescript
// Task Input
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

### Authentication Flow
- Password-based authentication with configurable credentials
- Session persistence via secure HTTP-only approach
- Automatic session validation and renewal
- Graceful handling of authentication failures

## Performance Considerations
- **Server Components**: Used where possible for optimal performance
- **Client Components**: Limited to interactive elements only
- **Code Splitting**: Automatic Next.js code splitting
- **Theme Transitions**: Optimized CSS transitions without layout shifts
- **Real-time Updates**: Efficient WebSocket connection management
- **Markdown Rendering**: Optimized rendering with syntax highlighting caching

## Accessibility Features
- **WCAG 2.1 AA Compliance**: Proper contrast ratios and focus management
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Reduced Motion**: Respects user's motion preferences
- **High Contrast**: Enhanced contrast mode support

## Security Considerations
- **Authentication**: Secure password-based access control
- **Token Management**: Secure handling of Trigger.dev tokens
- **Session Security**: Proper session management and cleanup
- **Input Validation**: Comprehensive input sanitization
- **Error Handling**: Secure error messages without sensitive data exposure
