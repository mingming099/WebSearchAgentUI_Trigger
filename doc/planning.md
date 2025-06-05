# Dark Mode and Light Mode Implementation Planning

## Current State Analysis

### Existing Styling Architecture
- **Framework**: Next.js 15.3.3 with React 19
- **CSS Framework**: Tailwind CSS v4 with @tailwindcss/postcss plugin
- **Current Theme Support**: Basic system preference detection via CSS media queries
- **Styling Approach**: Utility-first with custom CSS variables and manual theme switching

### Current Theme Implementation
The project currently has minimal dark mode support:
- CSS variables defined in `globals.css` for background and foreground colors
- Media query for `prefers-color-scheme: dark` with basic color switching
- No user-controlled theme toggle mechanism
- No persistent theme preference storage
- No dynamic theme switching capability

### File Structure Analysis
```
src/
├── app/
│   ├── layout.tsx           # Root layout - needs theme provider
│   ├── globals.css          # Current CSS variables - needs expansion
│   └── page.tsx             # Main page - needs theme-aware components
├── components/
│   ├── SearchForm.tsx       # Needs dark mode styling
│   ├── ProgressView.tsx     # Needs dark mode styling
│   ├── ResultView.tsx       # Needs dark mode styling
│   ├── PasswordAuth.tsx     # Needs dark mode styling
│   └── [other components]   # All need dark mode updates
├── contexts/                # Empty - needs ThemeContext
├── hooks/                   # Needs useTheme hook
└── lib/                     # Needs theme utilities
```

## Implementation Strategy

### 1. Theme Management Architecture
**Context-Based Approach**: Implement React Context for centralized theme state management
- Create `ThemeContext` for global theme state
- Build `useTheme` hook for theme consumption
- Implement theme persistence via localStorage
- Support system preference detection and override

### 2. CSS Variable System Enhancement
**Expanded Color Palette**: Extend current CSS variables to support comprehensive theming
- Semantic color tokens (primary, secondary, accent, etc.)
- Component-specific color variables
- Dynamic variable switching based on theme
- Maintain backward compatibility with existing styles

### 3. Component-Level Theming
**Systematic Component Updates**: Update all components to use theme-aware classes
- Replace hardcoded color classes with theme-aware alternatives
- Implement consistent dark mode color schemes
- Ensure accessibility contrast ratios in both themes
- Add theme toggle UI component

### 4. Theme Toggle Implementation
**User Control Interface**: Provide intuitive theme switching mechanism
- Theme toggle button/switch component
- Visual feedback for current theme state
- Support for auto/light/dark options
- Accessible keyboard navigation

## Detailed Implementation Plan

### Phase 1: Foundation Setup
1. **Theme Context Creation**
   - Create `src/contexts/ThemeContext.tsx`
   - Implement theme state management logic
   - Add localStorage persistence
   - Support system preference detection

2. **Theme Hook Development**
   - Create `src/hooks/useTheme.ts`
   - Provide theme consumption interface
   - Handle theme switching logic
   - Manage theme preference persistence

3. **CSS Variables Enhancement**
   - Expand `src/app/globals.css` with comprehensive color tokens
   - Define semantic color variables for both themes
   - Create component-specific color variables
   - Implement dynamic CSS variable switching

### Phase 2: Core Component Updates
1. **Layout Integration**
   - Update `src/app/layout.tsx` to include ThemeProvider
   - Add theme toggle to header/navigation
   - Implement theme class application to HTML element

2. **Main Page Theming**
   - Update `src/app/page.tsx` with theme-aware classes
   - Replace hardcoded colors with theme variables
   - Ensure proper contrast and readability

3. **Component Systematic Updates**
   - SearchForm.tsx: Input styling, button colors, borders
   - ProgressView.tsx: Progress bars, background colors
   - ResultView.tsx: Content display, code highlighting
   - PasswordAuth.tsx: Form styling, authentication UI
   - ErrorBoundary.tsx: Error display styling

### Phase 3: Theme Toggle UI
1. **Toggle Component Creation**
   - Create theme toggle switch component
   - Support for three states: auto/light/dark
   - Smooth transition animations
   - Accessible implementation

2. **Header Integration**
   - Add theme toggle to main header
   - Position toggle appropriately
   - Maintain responsive design
   - Ensure mobile compatibility

### Phase 4: Advanced Features
1. **Enhanced Theme Support**
   - Custom theme creation capability
   - High contrast mode support enhancement
   - Color scheme preference management
   - Theme transition animations

2. **Accessibility Improvements**
   - Proper ARIA labels for theme controls
   - Keyboard navigation support
   - Screen reader compatibility
   - Color contrast validation

## Technical Considerations

### Data Structure Changes
```typescript
// New theme-related types
interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  actualTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleTheme: () => void;
}

// Enhanced CSS variables structure
:root {
  /* Light theme variables */
  --color-background: #ffffff;
  --color-foreground: #171717;
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-accent: #f59e0b;
  --color-surface: #f9fafb;
  --color-border: #e5e7eb;
  --color-input: #ffffff;
  --color-muted: #9ca3af;
}

[data-theme="dark"] {
  /* Dark theme variables */
  --color-background: #0a0a0a;
  --color-foreground: #ededed;
  --color-primary: #60a5fa;
  --color-secondary: #9ca3af;
  --color-accent: #fbbf24;
  --color-surface: #1f1f1f;
  --color-border: #374151;
  --color-input: #111827;
  --color-muted: #6b7280;
}
```

### File Structure Changes
```
src/
├── contexts/
│   └── ThemeContext.tsx     # NEW: Theme context provider
├── hooks/
│   └── useTheme.ts          # NEW: Theme consumption hook
├── components/
│   ├── ThemeToggle.tsx      # NEW: Theme toggle component
│   └── [existing components] # UPDATED: All with theme support
├── lib/
│   └── theme-utils.ts       # NEW: Theme utility functions
└── app/
    ├── globals.css          # UPDATED: Enhanced CSS variables
    └── layout.tsx           # UPDATED: Theme provider integration
```

### Migration Strategy
1. **Backward Compatibility**: Ensure existing functionality remains intact
2. **Progressive Enhancement**: Implement theming as additive feature
3. **Graceful Degradation**: Maintain usability if theme system fails
4. **Testing Strategy**: Test both themes across all components and states

### Performance Considerations
- Minimize CSS variable calculations
- Use CSS transitions for smooth theme switching
- Optimize theme persistence operations
- Avoid layout shifts during theme changes
- Implement efficient re-rendering strategies

## Success Criteria
1. **Functional Requirements**
   - ✅ User can toggle between light, dark, and auto themes
   - ✅ Theme preference persists across sessions
   - ✅ System preference detection works correctly
   - ✅ All components display properly in both themes

2. **Quality Requirements**
   - ✅ Accessibility standards maintained (WCAG 2.1 AA)
   - ✅ Smooth transitions between themes
   - ✅ Consistent design language across themes
   - ✅ No performance regression

3. **Technical Requirements**
   - ✅ Clean, maintainable code architecture
   - ✅ Type-safe theme implementation
   - ✅ Comprehensive component coverage
   - ✅ Proper error handling and fallbacks
