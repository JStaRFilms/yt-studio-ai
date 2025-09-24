import React from 'react';
import AIMessage from './AIMessage';
import UserMessage from './UserMessage';
import SuggestionPill from './SuggestionPill';

const Chat: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* FIX: Pass content as `text` prop instead of children to match AIMessageProps. Converted JSX to markdown string. */}
        <AIMessage text={"**Hello!**\n\nHow can I help you with your video script today? You can ask me to brainstorm ideas, write a hook, or even generate a full draft."} />
        {/* FIX: Pass content as `text` prop instead of children to match UserMessageProps. */}
        <UserMessage text={"I'm making a tech review video for the new \"Innovate X\" phone. I need some ideas for a catchy intro."} />
        {/* FIX: Pass content as `text` prop instead of children to match AIMessageProps. Converted JSX to markdown string. */}
         <AIMessage text={"**Great topic! Here are a few intro hooks for your \"Innovate X\" review:**\n\n- \"Is this the phone that finally makes your wallet obsolete? The Innovate X says yes, and here's why.\"\n- \"They promised a revolution. Did Innovate X deliver? Let's find out.\"\n- \"Forget everything you thought you knew about smartphones. The Innovate X is here to change the game.\""} />
      </div>
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-2">
            <SuggestionPill suggestion="Suggest a video title" onClick={() => {}} />
            <SuggestionPill suggestion="Write an outro script" onClick={() => {}} />
            <SuggestionPill suggestion="Brainstorm B-roll shots" onClick={() => {}} />
        </div>
        <div className="relative">
            <textarea
              placeholder="Ask me anything about your script..."
              className="w-full p-3 pr-12 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={1}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
