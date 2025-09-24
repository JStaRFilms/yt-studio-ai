import React, { useState, useCallback } from 'react';
import ProjectSidebar from '../components/ProjectSidebar';
import ProjectWorkspaceHeader from '../components/ProjectWorkspaceHeader';
import EditorPane from '../components/EditorPane';
import AIChatPane from '../components/AIChatPane';
import ProjectMobileNav from '../components/ProjectMobileNav';

const ProjectWorkspace: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');

  const handleUpload = () => {
    // This can be connected to a state management solution later
    console.log("Upload triggered");
  };

  const handleTextSelection = useCallback((text: string) => {
    setSelectedText(text);
  }, []);

  return (
    <div className="flex">
      <ProjectSidebar projectName="Tech Review Script" projectStep="Script Editing" />
      <ProjectMobileNav />

      <main className="flex-1 md:ml-64 pb-24 md:pb-0 min-h-screen flex flex-col">
        <ProjectWorkspaceHeader onUpload={handleUpload} />
        
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex-1">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left Pane: Script Editor */}
            <div className="lg:w-3/5 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-slate-800">Script Editor</h3>
              </div>
              <div className="flex-1">
                <EditorPane onTextSelect={handleTextSelection} />
              </div>
            </div>

            {/* Right Pane: AI Chat */}
            <div className="lg:w-2/5 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-slate-800">AI Assistant</h3>
                 <span className="inline-flex items-center px-2 py-1 bg-indigo-600/10 text-indigo-600 text-xs rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                  Active
                </span>
              </div>
               <div className="flex-1 min-h-[500px] lg:min-h-0">
                <AIChatPane selectedText={selectedText} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectWorkspace;