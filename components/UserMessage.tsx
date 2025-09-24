import React from 'react';
import { parseAndSanitizeMarkdown } from '../utils/markdown';

interface UserMessageProps {
  text: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ text }) => {
  const sanitizedHtml = parseAndSanitizeMarkdown(text);
  return (
    <div className="p-4 bg-indigo-600 text-white rounded-lg max-w-prose ml-auto">
      <div className="prose prose-sm prose-invert max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
};

export default UserMessage;
