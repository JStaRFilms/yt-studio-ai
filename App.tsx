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
  if (path.startsWith('/project') || path.startsWith('/workspace')) {
    return <ProjectWorkspace />;
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
