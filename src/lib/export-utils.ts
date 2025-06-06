import { saveAs } from 'file-saver';
import type { ExportOptions, ExportResult, ExportProgressCallback } from '@/types/export';

/**
 * Downloads a file with the given content and filename
 * @param content - The file content as string or Blob
 * @param filename - The filename to save as
 * @param mimeType - The MIME type of the file
 */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  try {
    let blob: Blob;
    
    if (content instanceof Blob) {
      blob = content;
    } else {
      blob = new Blob([content], { type: mimeType });
    }
    
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Gets computed styles for an element and resolves CSS custom properties
 * @param element - The DOM element to get styles from
 * @returns Object containing resolved CSS properties
 */
export function getComputedStyles(element: Element): Record<string, string> {
  const computedStyles = window.getComputedStyle(element);
  const resolvedStyles: Record<string, string> = {};
  
  // Get all CSS custom properties from the document root
  const rootStyles = window.getComputedStyle(document.documentElement);
  const customProperties: Record<string, string> = {};
  
  // Extract CSS custom properties (variables)
  for (let i = 0; i < rootStyles.length; i++) {
    const property = rootStyles[i];
    if (property.startsWith('--')) {
      customProperties[property] = rootStyles.getPropertyValue(property).trim();
    }
  }
  
  // Resolve important style properties
  const importantProperties = [
    'color',
    'background-color',
    'border-color',
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'margin',
    'padding',
    'border',
    'border-radius',
    'box-shadow',
    'text-decoration',
    'display',
    'width',
    'height',
    'max-width',
    'max-height',
    'overflow',
    'white-space',
    'word-wrap',
    'word-break'
  ];
  
  importantProperties.forEach(property => {
    let value = computedStyles.getPropertyValue(property);
    
    // Resolve CSS custom properties in the value
    if (value.includes('var(')) {
      value = value.replace(/var\(([^,)]+)(?:,([^)]+))?\)/g, (match, varName, fallback) => {
        const resolvedValue = customProperties[varName.trim()];
        return resolvedValue || (fallback ? fallback.trim() : match);
      });
    }
    
    if (value) {
      resolvedStyles[property] = value;
    }
  });
  
  return resolvedStyles;
}

/**
 * Clones a DOM element with all its computed styles inlined
 * @param element - The element to clone
 * @param deep - Whether to clone child elements recursively
 * @returns Cloned element with inlined styles
 */
export function cloneElementWithStyles(element: Element, deep: boolean = true): Element {
  const clone = element.cloneNode(deep) as Element;
  
  // Apply computed styles to the cloned element
  const styles = getComputedStyles(element);
  const styleString = Object.entries(styles)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');
  
  if (styleString) {
    clone.setAttribute('style', styleString);
  }
  
  // Recursively apply styles to child elements if deep cloning
  if (deep) {
    const originalChildren = Array.from(element.children);
    const clonedChildren = Array.from(clone.children);
    
    originalChildren.forEach((originalChild, index) => {
      if (clonedChildren[index]) {
        const childStyles = getComputedStyles(originalChild);
        const childStyleString = Object.entries(childStyles)
          .map(([property, value]) => `${property}: ${value}`)
          .join('; ');
        
        if (childStyleString) {
          clonedChildren[index].setAttribute('style', childStyleString);
        }
        
        // Recursively handle nested children
        if (originalChild.children.length > 0) {
          const styledChild = cloneElementWithStyles(originalChild, true);
          clonedChildren[index].replaceWith(styledChild);
        }
      }
    });
  }
  
  return clone;
}

/**
 * Generates a default filename based on current date and format
 * @param format - The export format
 * @param customName - Optional custom name
 * @returns Generated filename with extension
 */
export function generateFilename(format: 'html', customName?: string): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const baseName = customName || `markdown-export-${timestamp}`;
  const extension = 'html';
  
  return `${baseName}.${extension}`;
}

/**
 * Validates export options and provides defaults
 * @param options - Export options to validate
 * @returns Validated and normalized export options
 */
export function validateExportOptions(options: Partial<ExportOptions>): ExportOptions {
  const defaults: ExportOptions = {
    format: 'html',
    filename: generateFilename(options.format || 'html'),
    includeTheme: true,
    html: {
      includeExternalCSS: true,
      inlineStyles: true
    }
  };
  
  return {
    ...defaults,
    ...options,
    html: { ...defaults.html, ...options.html }
  };
}

/**
 * Creates a progress tracker for export operations
 * @param callback - Progress callback function
 * @returns Progress tracking functions
 */
export function createProgressTracker(callback?: ExportProgressCallback) {
  let currentProgress = 0;
  
  return {
    update: (progress: number, message?: string) => {
      currentProgress = Math.max(0, Math.min(100, progress));
      callback?.(currentProgress, message);
    },
    increment: (amount: number, message?: string) => {
      currentProgress = Math.max(0, Math.min(100, currentProgress + amount));
      callback?.(currentProgress, message);
    },
    complete: (message?: string) => {
      currentProgress = 100;
      callback?.(100, message || 'Export completed');
    },
    error: (message: string) => {
      callback?.(currentProgress, `Error: ${message}`);
    }
  };
}

/**
 * Gets all external stylesheets and font imports from the document
 * @returns Array of CSS link URLs
 */
function getExternalStylesheets(): string[] {
  const links: string[] = [];
  const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
  
  linkElements.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.startsWith('http') || href.startsWith('//'))) {
      links.push(href);
    }
  });
  
  return links;
}

/**
 * Extracts and inlines all CSS from stylesheets
 * @returns Promise resolving to inlined CSS string
 */
async function getInlinedCSS(): Promise<string> {
  const stylesheets = Array.from(document.styleSheets);
  let css = '';
  
  for (const stylesheet of stylesheets) {
    try {
      if (stylesheet.cssRules) {
        for (const rule of Array.from(stylesheet.cssRules)) {
          css += rule.cssText + '\n';
        }
      }
    } catch (error) {
      // Skip stylesheets that can't be accessed due to CORS
      console.warn('Could not access stylesheet:', error);
    }
  }
  
  return css;
}

/**
 * Processes SVG elements to ensure they're properly embedded
 * @param element - The container element containing SVGs
 * @returns Processed element with embedded SVGs
 */
function processSVGElements(element: Element): Element {
  const svgs = element.querySelectorAll('svg');
  
  svgs.forEach(svg => {
    // Ensure SVG has proper namespace
    if (!svg.getAttribute('xmlns')) {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    
    // Ensure SVG has proper dimensions
    if (!svg.getAttribute('width') && !svg.getAttribute('height')) {
      const bbox = svg.getBBox();
      if (bbox.width && bbox.height) {
        svg.setAttribute('width', bbox.width.toString());
        svg.setAttribute('height', bbox.height.toString());
      }
    }
    
    // Convert any CSS styles to inline styles for better compatibility
    const computedStyle = window.getComputedStyle(svg);
    const importantStyles = ['fill', 'stroke', 'stroke-width', 'font-family', 'font-size'];
    
    importantStyles.forEach(prop => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value !== 'none') {
        svg.style.setProperty(prop, value);
      }
    });
  });
  
  return element;
}

/**
 * Exports markdown content as HTML
 * @param element - The DOM element containing the rendered markdown
 * @param options - Export options
 * @param progressCallback - Optional progress callback
 * @returns Promise resolving to export result
 */
export async function exportToHTML(
  element: Element,
  options: Partial<ExportOptions> = {},
  progressCallback?: ExportProgressCallback
): Promise<ExportResult> {
  const progress = createProgressTracker(progressCallback);
  
  try {
    progress.update(10, 'Preparing HTML export...');
    
    const validatedOptions = validateExportOptions({ ...options, format: 'html' });
    const filename = validatedOptions.filename || generateFilename('html');
    
    progress.update(20, 'Cloning content...');
    
    // Clone the element with styles
    const clonedElement = cloneElementWithStyles(element, true);
    
    progress.update(40, 'Processing SVG elements...');
    
    // Process SVG elements for better compatibility
    processSVGElements(clonedElement);
    
    progress.update(60, 'Gathering stylesheets...');
    
    // Get CSS content
    let cssContent = '';
    if (validatedOptions.html?.inlineStyles) {
      cssContent = await getInlinedCSS();
    }
    
    progress.update(80, 'Building HTML document...');
    
    // Build the complete HTML document
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Export</title>
    <meta name="generator" content="Markdown Viewer Export">
    <meta name="export-date" content="${new Date().toISOString()}">
    
    ${validatedOptions.html?.includeExternalCSS ? 
      getExternalStylesheets().map(href => `<link rel="stylesheet" href="${href}">`).join('\n    ') : 
      ''
    }
    
    ${cssContent ? `<style>\n${cssContent}\n    </style>` : ''}
    
    <style>
        /* Export-specific styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
            background-color: #fff;
        }
        
        @media print {
            body {
                max-width: none;
                margin: 0;
                padding: 1rem;
            }
        }
        
        /* Ensure code blocks are readable */
        pre {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 1rem;
            overflow-x: auto;
        }
        
        code {
            background-color: #f5f5f5;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        /* Ensure tables are readable */
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 0.5rem;
            text-align: left;
        }
        
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        
        /* SVG styling */
        svg {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
    <div class="markdown-content">
        ${clonedElement.outerHTML}
    </div>
</body>
</html>`;
    
    progress.update(90, 'Finalizing export...');
    
    // Download the file
    downloadFile(htmlContent, filename, 'text/html');
    
    progress.complete('HTML export completed successfully');
    
    return {
      success: true,
      content: htmlContent,
      filename,
      metadata: {
        size: new Blob([htmlContent]).size,
        timestamp: new Date(),
        format: 'html'
      }
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    progress.error(errorMessage);
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

 