import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import { PlusIcon } from '../components/icons';
import { getAllProjects, Project } from '../utils/db';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getAllProjects();
        setProjects(allProjects);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);
  
  const hasProjects = projects.length > 0;

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="My Projects" />
        <main className="p-4 sm:p-6 flex-1">
          <div className="flex justify-end items-center mb-6">
            <a
              href="/setup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2 -ml-1" />
              New Project
            </a>
          </div>
          {loading ? (
             <div className="text-center text-slate-500">Loading projects...</div>
          ) : hasProjects ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
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