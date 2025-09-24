import React from 'react';
import { Project } from '../utils/db';

interface ProjectCardProps {
  project: Project;
}

const timeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
};


const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <a href={`/project/${project.id}`} className="block bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md hover:border-indigo-500 transition group">
      <div>
        <h3 className="font-medium text-slate-800 truncate group-hover:text-indigo-600">{project.title}</h3>
        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{project.script ? project.script.substring(0, 100) + '...' : 'No script yet.'}</p>
      </div>
      <div className="mt-4">
        <span className="text-xs text-slate-400">
          Edited {timeAgo(new Date(project.updatedAt))}
        </span>
      </div>
    </a>
  );
};

export default ProjectCard;