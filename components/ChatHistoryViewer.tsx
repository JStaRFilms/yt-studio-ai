import React, { useState } from 'react';
import type { Content } from '@google/genai';
import { ChatIcon } from './icons';

interface ChatHistoryViewerProps {
  history: Content[];
  title: string;
}

const ChatHistoryViewer: React.FC<ChatHistoryViewerProps> = ({ history, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg text-sm mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-2 text-slate-600 hover:text-slate-800"
        aria-expanded={isOpen}
      >
        <span className="flex items-center font-medium">
          <ChatIcon className="w-4 h-4 mr-2" />
          {title}
        </span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-3 border-t border-slate-200 max-h-48 overflow-y-auto">
          {history.map((item, index) => (
            <div key={index} className={`mb-2 last:mb-0 p-2 rounded-md ${item.role === 'user' ? 'bg-slate-100' : 'bg-indigo-50/50'}`}>
              <p className="font-semibold text-xs text-slate-500 capitalize">{item.role}</p>
              <p className="text-slate-700 whitespace-pre-wrap">{item.parts.map(p => p.text).join('')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryViewer;