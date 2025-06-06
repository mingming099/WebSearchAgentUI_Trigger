
## Markdown Viewer Feature ⭐ NEW

### Overview
A standalone markdown editor and preview feature that allows users to input markdown content and preview it using the existing MarkdownRenderer component. Accessible via the main menu.

### Feature Architecture
```
src/app/markdown-viewer/
├── page.tsx                    # Main markdown viewer page

src/components/
├── MarkdownViewer.tsx          # Main viewer container
├── MarkdownEditor.tsx          # Editor textarea component
└── MarkdownRenderer.tsx        # Existing - reused for preview
```

### Component Structure
```typescript
// MarkdownViewer State
interface MarkdownViewerState {
  content: string;           // Current markdown content
  mode: 'edit' | 'preview';  // Current view mode
}

// MarkdownEditor Props
interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}
```

### UI Layout
```
┌─────────────────────────────────────┐
│ Header: Back Button + Title + Theme │
├─────────────────────────────────────┤
│ Mode Toggle: [Edit] [Preview]       │
├─────────────────────────────────────┤
│ Content Area:                       │
│ ┌─────────────────────────────────┐ │
│ │ Edit Mode: Large Textarea       │ │
│ │ OR                              │ │
│ │ Preview Mode: MarkdownRenderer  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Integration Points
- **Navigation**: Accessible from MainMenu via `/markdown-viewer` route
- **Authentication**: Uses existing `useAuth` hook for access control
- **Theme System**: Inherits from existing `ThemeProvider`
- **Markdown Rendering**: Direct reuse of `MarkdownRenderer` component
- **Styling**: Uses existing CSS variables and theme classes

### Key Features
- **Edit Mode**: Large textarea for markdown input
- **Preview Mode**: Live preview using MarkdownRenderer
- **Mode Toggle**: Switch between edit and preview modes
- **Theme Support**: Full dark/light theme compatibility
- **Responsive Design**: Mobile-optimized layout
- **Content Persistence**: Optional localStorage integration
- **Authentication**: Protected access consistent with main app

