import React from 'react';
import { HomeIcon, PlusIcon } from './icons';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="p-4">
        <div className="flex items-center mb-8">
            <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SF</span>
            </div>
            <h1 className="ml-2 text-lg font-semibold text-slate-800">ScriptFlow</h1>
        </div>
        <nav>
          <ul className="space-y-1">
            <li>
              <a href="/" className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg font-medium">
                <HomeIcon className="h-5 w-5 mr-3" />
                Projects
              </a>
            </li>
            <li>
              <a href="/setup" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                <PlusIcon className="h-5 w-5 mr-3" />
                New Project
              </a>
            </li>
            {/* Future links can be added here, e.g., Profile */}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;