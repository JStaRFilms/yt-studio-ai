import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import { PlusIcon } from '../components/icons';

const projects = [
  { title: 'Tech Review: The Innovate X Phone', lastEdited: '2 hours ago', status: 'In Progress' as const },
  { title: 'My Trip to Japan - A Travel Vlog', lastEdited: '1 day ago', status: 'Draft' as const },
  { title: 'How to Bake the Perfect Sourdough', lastEdited: '3 days ago', status: 'Complete' as const },
  { title: 'Unboxing the new console', lastEdited: '1 week ago', status: 'Draft' as const },
];

const Dashboard: React.FC = () => {
  const hasProjects = projects.length > 0;

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 sm:p-6 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">My Projects</h2>
            <a
              href="/setup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
              New Project
            </a>
          </div>
          {hasProjects ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
