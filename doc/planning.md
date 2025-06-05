# Search History Feature Planning

## Overview
Add a simple search history feature to store and manage past search results in browser localStorage. Users can view, access, and delete previous search results with a clean and minimal design.

## Requirements Analysis
- Store search results in browser localStorage after each successful search
- Provide a history list interface to view past searches
- Allow users to view previous results
- Allow users to delete individual history entries
- Maintain clean and simple design consistent with current UI
- Minimal implementation with essential features only

## Data Structure Changes

### New Types (src/types/websearch.ts)
```typescript
// Search history entry
export interface SearchHistoryEntry {
  id: string;                    // Unique identifier (timestamp-based)
  query: string;                 // Original search query
  result: WebSearchOutput;       // Search result
  timestamp: number;             // When search was completed
  model?: string;                // Model used for search
  writeModel?: string;           // Write model used
}

// History management
export interface SearchHistory {
  entries: SearchHistoryEntry[];
  maxEntries: number;            // Limit to prevent localStorage bloat
}
```

### Updated App State
```typescript
// Add to existing AppState interface
export interface AppState {
  // ... existing properties
  
  // History state
  showHistory: boolean;          // Toggle history panel visibility
  selectedHistoryEntry?: SearchHistoryEntry; // Currently viewing history entry
}
```

## File Structure Changes

### New Files to Create
```
src/
├── components/
│   ├── SearchHistory.tsx      # Main history panel component
│   ├── HistoryEntry.tsx       # Individual history entry component
│   └── HistoryToggle.tsx      # Button to show/hide history
├── hooks/
│   └── useSearchHistory.ts    # Custom hook for history management
└── lib/
    └── localStorage.ts        # Utility functions for localStorage operations
```

### Files to Modify
```
src/
├── app/
│   └── page.tsx               # Integrate history components
├── components/
│   ├── SearchForm.tsx         # Add history toggle button
│   └── ResultView.tsx         # Add "Save to History" functionality
├── hooks/
│   └── useWebSearch.ts        # Integrate history saving
└── types/
    └── websearch.ts           # Add new type definitions
```

## Implementation Strategy

### Phase 1: Core Infrastructure
1. Create localStorage utility functions
2. Define new TypeScript interfaces
3. Create useSearchHistory hook for state management
4. Update useWebSearch hook to save results automatically

### Phase 2: UI Components
1. Create HistoryToggle component (simple button in header)
2. Create SearchHistory panel component (slide-out or modal)
3. Create HistoryEntry component for individual entries
4. Integrate components into main page layout

### Phase 3: Integration & Polish
1. Connect history saving to search completion
2. Add history viewing functionality
3. Implement delete functionality
4. Add proper error handling and edge cases
5. Ensure responsive design and theme compatibility

## Design Decisions

### Storage Strategy
- **localStorage**: Simple, persistent across sessions, no server required
- **Size Limit**: Maximum 50 entries to prevent localStorage bloat
- **Data Format**: JSON serialization with compression for large results
- **Cleanup**: Automatic removal of oldest entries when limit exceeded

### UI Design
- **History Access**: Small history icon/button in header next to theme toggle
- **History Panel**: Slide-out panel from right side (mobile-friendly)
- **Entry Display**: Compact list with query, timestamp, and actions
- **Result Viewing**: Replace current result view when viewing history
- **Minimal Footprint**: No permanent UI changes, only when needed

### User Experience
- **Auto-save**: Automatically save successful searches
- **Quick Access**: One-click to view previous results
- **Clear Actions**: Obvious delete and view buttons
- **Responsive**: Works well on mobile and desktop
- **Performance**: Lazy loading and efficient rendering

## Technical Considerations

### localStorage Management
- Handle localStorage quota exceeded errors
- Implement data migration for future schema changes
- Compress large results to save space
- Validate data integrity on load

### State Management
- Use React Context or simple state for history UI
- Integrate with existing useWebSearch hook
- Maintain separation of concerns
- Handle concurrent access gracefully

### Performance
- Lazy load history entries
- Virtualize long history lists if needed
- Debounce search operations
- Minimize re-renders

### Error Handling
- Graceful degradation if localStorage unavailable
- Handle corrupted data scenarios
- Provide user feedback for errors
- Fallback to session-only storage if needed

## Success Criteria
- [ ] Users can view list of past searches
- [ ] Users can click to view previous results
- [ ] Users can delete individual history entries
- [ ] History persists across browser sessions
- [ ] UI remains clean and uncluttered
- [ ] Feature works on mobile and desktop
- [ ] No performance impact on search functionality
- [ ] Consistent with existing design system
