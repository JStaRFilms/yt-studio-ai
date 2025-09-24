import React from 'react';
import { Content } from '@google/genai';
import AIMessage from './AIMessage';
import UserMessage from './UserMessage';

interface ChatHistoryViewerProps {
  history: Content[];
  isLoading?: boolean;
}

const ChatHistoryViewer: React.FC<ChatHistoryViewerProps> = ({ history, isLoading }) => {
  return (
    <div className="space-y-6">
      {history.map((message, index) => {
        const messageText = message.parts.map(part => part.text || '').join('');
        // FIX: Use a more stable key to prevent re-rendering issues during streaming.
        const key = `msg-${index}-${message.role}-${messageText.length}`;

        if (message.role === 'user') {
          // FIX: Pass messageText as `text` prop instead of children. The component handles markdown parsing.
          return (
            <UserMessage key={key} text={messageText} />
          );
        }
        // FIX: Pass messageText as `text` prop instead of children. The component handles markdown parsing.
        return (
          <AIMessage key={key} text={messageText} />
        );
      })}
      {isLoading && (
        // FIX: The AIMessage component expects a 'text' prop and cannot render a loading indicator as a child. Replaced with a styled div.
        <div className="p-4 bg-slate-100 rounded-lg max-w-prose">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryViewer;
