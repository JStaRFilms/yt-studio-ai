import React from 'react';

const ProjectHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-800">Tech Review Script</h2>
        <div className="flex items-center space-x-4">
          <button className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Open menu">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg transition text-sm">
            Export
          </button>
          <div className="w-8 h-8 bg-slate-200 rounded-full" aria-label="User profile"></div>
        </div>
      </div>
    </header>
  );
};

export default ProjectHeader;
