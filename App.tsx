import React from 'react';
import Dashboard from './pages/Dashboard';
import ProjectSetup from './pages/ProjectSetup';
import ProjectWorkspace from './pages/ProjectWorkspace';
import ProcessingWorkflow from './pages/ProcessingWorkflow';
import BrollGenerator from './pages/BrollGenerator';
import ThumbnailGenerator from './pages/ThumbnailGenerator';

const App: React.FC = () => {
  const path = window.location.pathname;

  if (path.startsWith('/setup')) {
    return <ProjectSetup />;
  }

  const projectMatch = path.match(/^\/project\/(\d+)/);
  if (projectMatch) {
    const projectId = parseInt(projectMatch[1], 10);
    return <ProjectWorkspace projectId={projectId} />;
  }
  
  // Legacy /workspace URLs redirect to /project/
  if (path.startsWith('/workspace')) {
      const idMatch = path.match(/^\/workspace\/(\d+)/);
      if (idMatch) {
          window.location.pathname = `/project/${idMatch[1]}`;
      } else {
          window.location.pathname = '/';
      }
      return null; // Render nothing while redirecting
  }

  if (path.startsWith('/workflow')) {
    return <ProcessingWorkflow />;
  }
  if (path.startsWith('/broll')) {
    return <BrollGenerator />;
  }
  if (path.startsWith('/thumbnail')) {
    return <ThumbnailGenerator />;
  }
  
  return <Dashboard />;
};

export default App;