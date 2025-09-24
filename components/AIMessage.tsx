import React from 'react';
import { parseAndSanitizeMarkdown } from '../utils/markdown';

interface AIMessageProps {
  text: string;
}

const AIMessage: React.FC<AIMessageProps> = ({ text }) => {

  const sanitizedHtml = parseAndSanitizeMarkdown(text);

  return (
    <div className="p-4 bg-slate-100 rounded-lg max-w-prose group relative">
      <div className="prose prose-sm max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
};

export default AIMessage;