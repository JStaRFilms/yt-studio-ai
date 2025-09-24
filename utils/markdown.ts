// This utility relies on `marked` and `DOMPurify` being available in the global scope (from index.html).
declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
        };
        DOMPurify: {
            sanitize: (html: string) => string;
        };
    }
}

/**
 * Parses a Markdown string and sanitizes the resulting HTML.
 * @param markdown - The Markdown text to parse.
 * @returns A sanitized HTML string.
 */
export const parseAndSanitizeMarkdown = (markdown: string): string => {
    if (typeof window.marked === 'undefined' || typeof window.DOMPurify === 'undefined') {
        console.warn('marked or DOMPurify not loaded. Returning plain text.');
        // Basic escaping as a fallback
        return markdown
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const rawHtml = window.marked.parse(markdown);
    const sanitizedHtml = window.DOMPurify.sanitize(rawHtml);
    
    return sanitizedHtml;
};
