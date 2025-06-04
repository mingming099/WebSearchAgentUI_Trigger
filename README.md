# Trigger.dev Frontend - Web Search Agent

A Next.js frontend application that interfaces with the Trigger.dev Web Search Agent, featuring beautiful markdown rendering with syntax highlighting, tables, and mermaid diagrams.

## Features

- **Advanced Web Search**: Powered by Trigger.dev's WebSearch Agent
- **Real-time Progress Tracking**: Live updates during search execution
- **Rich Markdown Rendering**: 
  - Syntax-highlighted code blocks
  - Responsive tables
  - Interactive Mermaid diagrams
  - Styled headings, lists, and blockquotes
- **Customizable AI Models**: Configure search and writing models
- **Error Handling**: Comprehensive error boundaries and user feedback

## Model Configuration

The application supports customizable AI models through the advanced options panel:

### Default Models
- **Search Model**: Configurable via `NEXT_PUBLIC_DEFAULT_MODEL` - Used for search and analysis tasks
- **Writing Model**: Configurable via `NEXT_PUBLIC_DEFAULT_WRITE_MODEL` - Used for generating the final answer

### Supported Models
- `openai/gpt-4.1-mini` (default, fast and efficient)
- `openai/gpt-4o` (more capable, higher cost)
- `anthropic/claude-3-sonnet` (alternative provider)
- `anthropic/claude-3-haiku` (fast alternative)

### Usage
1. Click "Advanced Options" in the search form
2. Modify the model fields as needed
3. Use "Reset to defaults" to restore default values

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp example.env.local .env.local
   ```
4. Configure your environment variables in `.env.local`
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_TRIGGER_API_URL=https://api.trigger.dev
TRIGGER_SECRET_KEY=your_trigger_secret_key
NEXT_PUBLIC_DEFAULT_MODEL=openai/gpt-4.1-mini
NEXT_PUBLIC_DEFAULT_WRITE_MODEL=openai/gpt-4.1-mini
```

### Environment Variable Descriptions

- `NEXT_PUBLIC_TRIGGER_API_URL`: The Trigger.dev API URL (default: https://api.trigger.dev)
- `TRIGGER_SECRET_KEY`: Your Trigger.dev secret key for authentication
- `NEXT_PUBLIC_DEFAULT_MODEL`: Default model for search and analysis tasks (default: openai/gpt-4.1-mini)
- `NEXT_PUBLIC_DEFAULT_WRITE_MODEL`: Default model for generating final answers (default: openai/gpt-4.1-mini)

## Components

### MarkdownRenderer
Renders markdown content with:
- GitHub Flavored Markdown support
- Syntax highlighting for code blocks
- Responsive table styling
- Mermaid diagram rendering
- Custom styling for all markdown elements

### SearchForm
- Query input with validation
- Advanced options panel for model configuration
- Real-time character counting
- Loading states and error handling

### ProgressView
- Real-time progress tracking
- Action history display
- Current action status
- Iteration counters

### ResultView
- Beautiful markdown-rendered results
- Copy-to-clipboard functionality
- New search button
- Conversation history (optional)

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Real-time**: Trigger.dev React Hooks
- **Markdown**: react-markdown with remark-gfm
- **Syntax Highlighting**: rehype-highlight + highlight.js
- **Diagrams**: Mermaid
- **TypeScript**: Full type safety

## Build

```bash
npm run build
npm start
```

## Development

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
