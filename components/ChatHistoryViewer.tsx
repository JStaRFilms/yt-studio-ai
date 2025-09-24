import React from 'react';
import { Content } from '@google/genai';
import AIMessage from './AIMessage';
import UserMessage from './UserMessage';
import { parseAndSanitizeMarkdown } from '../utils/markdown';

interface ChatHistoryViewerProps {
  history: Content[];
  isLoading?: boolean;
}

const ChatHistoryViewer: React.FC<ChatHistoryViewerProps> = ({ history, isLoading }) => {
  return (
    <div className="space-y-6">
      {history.map((message, index) => {
        const messageText = message.parts.map(part => part.text || '').join('');
        const sanitizedHtml = parseAndSanitizeMarkdown(messageText);
        // FIX: Use a more stable key to prevent re-rendering issues during streaming.
        const key = `msg-${index}-${message.role}-${messageText.length}`;

        if (message.role === 'user') {
          return (
            <UserMessage key={key}>
              <div className="prose prose-sm prose-invert max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            </UserMessage>
          );
        }
        return (
          <AIMessage key={key}>
            <div className="prose prose-sm max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </AIMessage>
        );
      })}
      {isLoading && (
        <AIMessage>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </AIMessage>
      )}
    </div>
  );
};

export default ChatHistoryViewer;