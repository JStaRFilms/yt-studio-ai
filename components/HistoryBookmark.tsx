import React, { useState } from 'react';
import { ChatMessage } from '../utils/db';
import ChatHistoryViewer from './ChatHistoryViewer';

interface HistoryBookmarkProps {
  historySlice: ChatMessage[];
  context: 'brainstorm' | 'assistant';
}

const HistoryBookmark: React.FC<HistoryBookmarkProps> = ({ historySlice, context }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!historySlice || historySlice.length === 0) {
    return null;
  }

  const contextName = context === 'brainstorm' ? 'Brainstorm' : 'Editor';
  const messageCount = historySlice.length;

  return (
    <div className="text-center my-2 py-2">
      <button onClick={() => setIsOpen(!isOpen)} className="text-xs text-slate-500 hover:text-slate-800 transition-colors w-full py-1 border-y border-dashed border-slate-300">
        --- {isOpen ? `Hide ${contextName} History` : `View ${messageCount} message${messageCount > 1 ? 's' : ''} from ${contextName}`} ---
      </button>
      {isOpen && (
        <div className="mt-2 p-3 bg-slate-100/70 border border-slate-200 rounded-lg max-h-60 overflow-y-auto text-left">
          <ChatHistoryViewer history={historySlice} />
        </div>
      )}
    </div>
  );
};

export default HistoryBookmark;