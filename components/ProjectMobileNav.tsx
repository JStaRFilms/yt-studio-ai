import React from 'react';
import { EditorIcon, AIToolsIcon, ChatIcon } from './icons';

const ProjectMobileNav: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="flex justify-around py-3 px-4">
        <button className="flex flex-col items-center text-indigo-600" aria-current="page">
          <EditorIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Editor</span>
        </button>
        <button className="flex flex-col items-center text-slate-500">
          <AIToolsIcon className="h-6 w-6" />
          <span className="text-xs mt-1">AI Tools</span>
        </button>
        <button className="flex flex-col items-center text-slate-500">
          <ChatIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectMobileNav;
