import React from 'react';
import { HomeIcon, FileIcon, UserIcon } from './icons';

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
          <ul>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg">
                <HomeIcon className="h-5 w-5 mr-3" />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                <FileIcon className="h-5 w-5 mr-3" />
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                <UserIcon className="h-5 w-5 mr-3" />
                Profile
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
