import React, { useState } from 'react';
import { MenuIcon, SearchIcon, UserIcon } from './icons';
import MobileNav from './MobileNav';

const Header: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 text-slate-500 hover:text-slate-700"
            onClick={() => setMobileNavOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block relative">
            <SearchIcon className="h-5 w-5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="search"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>
          <UserIcon className="h-8 w-8 text-slate-500" />
        </div>
      </div>
      {mobileNavOpen && <MobileNav onClose={() => setMobileNavOpen(false)} />}
    </header>
  );
};

export default Header;
