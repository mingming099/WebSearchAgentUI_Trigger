"use client";

import MarkdownRenderer from "./MarkdownRenderer";

const demoMarkdown = `# Markdown Rendering Demo

This is a demonstration of the enhanced markdown rendering capabilities.

## Features Supported

### 1. Code Blocks with Syntax Highlighting

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to our app, \${name}\`;
}

const user = "Alice";
greet(user);
\`\`\`

\`\`\`python
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Generate first 10 fibonacci numbers
for i in range(10):
    print(f"F({i}) = {calculate_fibonacci(i)}")
\`\`\`

### 2. Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Markdown Rendering | ✅ Complete | High |
| Code Highlighting | ✅ Complete | High |
| Mermaid Diagrams | ✅ Complete | Medium |
| Table Support | ✅ Complete | Medium |

### 3. Mermaid Diagrams

\`\`\`mermaid
graph TD
    A[User Query] --> B[Search API]
    B --> C{Process Results}
    C -->|Success| D[Render Markdown]
    C -->|Error| E[Show Error]
    D --> F[Display to User]
    E --> F
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant S as Search Engine
    
    U->>F: Submit Query
    F->>A: POST /api/search
    A->>S: Search Request
    S-->>A: Search Results
    A-->>F: Formatted Response
    F-->>U: Display Results
\`\`\`

### 4. Lists and Formatting

**Unordered List:**
- ✨ Beautiful markdown rendering
- 🎨 Syntax highlighted code blocks
- 📊 Responsive tables
- 📈 Interactive mermaid diagrams
- 🔗 Clickable links

**Ordered List:**
1. First, install the required packages
2. Then, create the MarkdownRenderer component
3. Finally, integrate it into your ResultView
4. Test with various markdown content

### 5. Blockquotes

> "The best way to predict the future is to create it."
> 
> This is an example of a blockquote with multiple paragraphs.

### 6. Inline Code and Links

You can use \`inline code\` within paragraphs, and create [links to external resources](https://github.com/remarkjs/react-markdown).

### 7. Text Formatting

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ~~Strikethrough text~~ for corrections
- \`code snippets\` for technical terms

---

This demo showcases the comprehensive markdown rendering capabilities of our updated ResultView component!`;

export default function MarkdownDemo() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div 
        className="border rounded-lg shadow-sm" 
        style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderColor: 'var(--color-border)' 
        }}
      >
        <div className="p-6">
          <h2 
            className="text-xl font-semibold mb-4 flex items-center gap-2"
            style={{ color: 'var(--color-text)' }}
          >
            <svg 
              className="w-5 h-5" 
              style={{ color: 'var(--color-primary)' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            Markdown Rendering Demo
          </h2>
          <MarkdownRenderer content={demoMarkdown} />
        </div>
      </div>
    </div>
  );
} 