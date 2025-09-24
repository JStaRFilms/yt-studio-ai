import React from 'react';
import { HomeIcon, PlusIcon } from './icons';

interface MobileNavProps {
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" onClick={onClose}></div>
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
             <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
             </div>
             <h1 className="ml-2 text-lg font-semibold text-slate-800">ScriptFlow</h1>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            <a href="/" className="bg-indigo-50 text-indigo-600 group flex items-center px-2 py-2 text-base font-medium rounded-md">
              <HomeIcon className="mr-4 flex-shrink-0 h-6 w-6" />
              Projects
            </a>
            <a href="/setup" className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 group flex items-center px-2 py-2 text-base font-medium rounded-md">
              <PlusIcon className="mr-4 flex-shrink-0 h-6 w-6" />
              New Project
            </a>
            {/* A profile link could be added later */}
          </nav>
        </div>
      </div>
      <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
    </div>
  );
};

export default MobileNav;