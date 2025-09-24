import React, { useRef } from 'react';
import { ChatMessage } from '../utils/db';
import AIMessage from './AIMessage';
import UserMessage from './UserMessage';
import HistoryBookmark from './HistoryBookmark';
import { htmlToMarkdown } from '../utils/markdown';

interface UnifiedChatHistoryProps {
  history: ChatMessage[];
  currentContext: 'brainstorm' | 'assistant';
  isLoading: boolean;
  onTextSelect?: (text: string) => void;
}

const UnifiedChatHistory: React.FC<UnifiedChatHistoryProps> = ({ history, currentContext, isLoading, onTextSelect }) => {
  const renderedElements: React.ReactElement[] = [];
  let lastContext = currentContext;
  let historySlice: ChatMessage[] = [];
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    if (!onTextSelect) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;

    // Ensure selection occurs within this chat container
    const container = containerRef.current;
    const anchorNode = sel.anchorNode;
    const focusNode = sel.focusNode;
    const isWithin = !!(container && anchorNode && focusNode && container.contains(anchorNode) && container.contains(focusNode));
    if (!isWithin) return;

    const range = sel.getRangeAt(0).cloneRange();
    const tmp = document.createElement('div');
    tmp.appendChild(range.cloneContents());
    const html = tmp.innerHTML.trim();

    const markdown = html ? htmlToMarkdown(html) : sel.toString().trim();
    if (markdown) onTextSelect(markdown);
  };

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
      const messageText = message.parts.map(p => p.text).join('\n');

      if (message.role === 'user') {
        renderedElements.push(
          <UserMessage key={key} text={messageText} />
        );
      } else {
        renderedElements.push(
          <AIMessage
            key={key}
            text={messageText}
          />
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
    <div ref={containerRef} className="space-y-6" onMouseUp={handleMouseUp}>
      {renderedElements}
      {isLoading && (
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

export default UnifiedChatHistory;