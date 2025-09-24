import React from 'react';

interface Tag {
    text: string;
}

interface Action {
    text: string;
    icon: React.ReactNode;
    onClick: () => void;
    mobileOnly?: boolean;
}

interface PageHeaderProps {
  title: string;
  tags: Tag[];
  actions: Action[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, tags, actions }) => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <div className="mt-1 sm:mt-0 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded-full">{tag.text}</span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          {actions.map((action, index) => (
              <button 
                key={index} 
                onClick={action.onClick} 
                className={`flex items-center px-3 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 ${action.mobileOnly ? 'sm:hidden' : ''}`}
              >
                {action.icon}
                {action.text}
              </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
