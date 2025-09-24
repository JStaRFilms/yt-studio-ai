import React from 'react';
import { UploadIcon, SearchIcon } from './icons';

interface ProjectWorkspaceHeaderProps {
  onUpload: () => void;
}

const ProjectWorkspaceHeader: React.FC<ProjectWorkspaceHeaderProps> = ({ onUpload }) => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Tech Review Script</h2>
          <div className="mt-1 sm:mt-0 flex flex-wrap gap-2">
            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">Transcript</span>
            <span className="text-xs text-slate-500">Edited 2 hours ago</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <button onClick={onUpload} className="flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
            <UploadIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            Upload Transcript
          </button>
          <div className="relative">
            <label htmlFor="search-script" className="sr-only">Search script</label>
            <input 
              id="search-script"
              type="text" 
              placeholder="Search script..." 
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-40 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <SearchIcon className="h-5 w-5 absolute left-3 top-2.5 text-slate-400" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProjectWorkspaceHeader;