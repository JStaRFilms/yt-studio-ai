import React from 'react';

interface ProjectCardProps {
  title: string;
  lastEdited: string;
  status: 'Draft' | 'In Progress' | 'Complete';
}

const statusStyles = {
  Draft: 'bg-slate-100 text-slate-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Complete: 'bg-green-100 text-green-800',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, lastEdited, status }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <h3 className="font-medium text-slate-800 truncate">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">Last edited {lastEdited}</p>
      </div>
      <div className="mt-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
