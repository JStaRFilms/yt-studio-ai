import React from 'react';
import { BackIcon } from './icons';

interface ProjectSidebarProps {
    projectName: string;
    projectStep: string;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ projectName, projectStep }) => {
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-slate-200 min-h-screen p-4 fixed top-0 left-0">
      <div className="flex items-center mb-8">
        <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">SF</span>
        </div>
        <h1 className="ml-2 text-lg font-semibold text-slate-800">ScriptFlow</h1>
      </div>
      
      <div className="mb-6">
        <a href="/" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
          <BackIcon className="h-5 w-5 mr-3" />
          Back to Projects
        </a>
      </div>
      
      <div className="mb-4">
        <h2 className="px-4 text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Project</h2>
        <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-lg p-3 mx-2">
          <h3 className="font-medium text-slate-800 truncate">{projectName}</h3>
          <p className="text-xs text-slate-500 mt-1">{projectStep}</p>
        </div>
      </div>
    </aside>
  );
};

export default ProjectSidebar;