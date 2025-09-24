import React from 'react';
import { ChatMessage } from '../utils/db';
import AIMessage from './AIMessage';
import UserMessage from './UserMessage';
import HistoryBookmark from './HistoryBookmark';
import { parseAndSanitizeMarkdown } from '../utils/markdown';

interface UnifiedChatHistoryProps {
  history: ChatMessage[];
  currentContext: 'brainstorm' | 'assistant';
  isLoading: boolean;
}

const UnifiedChatHistory: React.FC<UnifiedChatHistoryProps> = ({ history, currentContext, isLoading }) => {
  const renderedElements: JSX.Element[] = [];
  let lastContext = currentContext;
  let historySlice: ChatMessage[] = [];

  history.forEach((message, index) => {
    // If context is the same as the current view, render the message.
    if (message.context === currentContext) {
      // If there's a pending history slice from another context, render the bookmark first.
      if (historySlice.length > 0) {
        renderedElements.push(
          <HistoryBookmark
            key={`bookmark-${index}`}
            historySlice={historySlice}
            context={lastContext}
          />
        );
        historySlice = []; // Clear the slice
      }
      
      const key = `msg-${message.timestamp}-${index}`;
      const sanitizedHtml = parseAndSanitizeMarkdown(message.parts.map(p => p.text).join('\n'));

      if (message.role === 'user') {
        renderedElements.push(
          <UserMessage key={key}>
            <div className="prose prose-sm prose-invert max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </UserMessage>
        );
      } else {
        renderedElements.push(
          <AIMessage key={key}>
            <div className="prose prose-sm max-w-none markdown-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          </AIMessage>
        );
      }
      lastContext = message.context;
    } 
    // If context is different, add it to the slice to be bookmarked.
    else {
      // If we switch from one foreign context to another (unlikely), bookmark the previous slice.
      if (message.context !== lastContext && historySlice.length > 0) {
         renderedElements.push(
          <HistoryBookmark
            key={`bookmark-${index}`}
            historySlice={historySlice}
            context={lastContext}
          />
        );
        historySlice = [];
      }
      historySlice.push(message);
      lastContext = message.context;
    }
  });
  
  // If there's a remaining slice at the end, render the bookmark.
  if (historySlice.length > 0) {
      renderedElements.push(
          <HistoryBookmark
            key="bookmark-final"
            historySlice={historySlice}
            context={lastContext}
          />
      );
  }

  return (
    <div className="space-y-6">
      {renderedElements}
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

export default UnifiedChatHistory;