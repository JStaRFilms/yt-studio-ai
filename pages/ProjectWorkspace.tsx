import React, { useState, useCallback, useRef, useEffect } from 'react';
import ProjectSidebar from '../components/ProjectSidebar';
import ProjectWorkspaceHeader from '../components/ProjectWorkspaceHeader';
import EditorPane from '../components/EditorPane';
import AIChatPane from '../components/AIChatPane';
import ProjectMobileNav from '../components/ProjectMobileNav';
import { UploadCloudIcon } from '../components/icons';
import { getProject, updateProjectScript, Project } from '../utils/db';

interface ProjectWorkspaceProps {
    projectId: number;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const fetchedProject = await getProject(projectId);
        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          console.error(`Project with ID ${projectId} not found.`);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleScriptSave = async (newScript: string) => {
    if (project) {
        try {
            await updateProjectScript(project.id!, newScript);
            setProject(prev => prev ? { ...prev, script: newScript, updatedAt: new Date() } : null);
        } catch (error) {
            console.error("Failed to save script:", error);
            // Re-throw to allow the child component to handle UI feedback
            throw error;
        }
    }
  };

  const processFile = async (file: File) => {
    if (file && (file.type === 'text/plain' || file.name.endsWith('.srt'))) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        try {
          await updateProjectScript(projectId, content);
          setProject(prev => prev ? { ...prev, script: content, updatedAt: new Date() } : null);
        } catch (error) {
          console.error("Failed to save script:", error);
          alert("Error saving script. Please try again.");
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .txt or .srt file.');
    }
  };

  const handleHeaderUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  
  const handleUploaderClick = () => fileInputRef.current?.click();

  const handleTextSelection = useCallback((text: string) => {
    setSelectedText(text);
  }, []);

  const TranscriptUploader = (
    <div
      onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
      onClick={handleUploaderClick}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors h-full flex flex-col justify-center ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 hover:border-indigo-600'}`}
      role="button" tabIndex={0} aria-label="Upload transcript"
    >
      <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-2 text-sm font-medium text-slate-900">
        <span className="text-indigo-600">Click to upload</span> or drag and drop
      </h3>
      <p className="mt-1 text-xs text-slate-500">TXT or SRT files</p>
    </div>
  );
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading project...</div>;
  }
  
  if (!project) {
    return <div className="flex h-screen w-full items-center justify-center">Project not found.</div>;
  }

  return (
    <div className="flex">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.srt" />
      <ProjectSidebar projectName={project.title} projectStep="Script Editing" />
      <ProjectMobileNav />

      <main className="flex-1 md:ml-64 pb-24 md:pb-0 min-h-screen flex flex-col">
        <ProjectWorkspaceHeader onUpload={handleHeaderUploadClick} />
        
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex-1">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div className="lg:w-3/5 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-slate-800">Script Editor</h3>
              </div>
              <div className="flex-1">
                {project.script ? (
                  <EditorPane 
                    initialContent={project.script} 
                    onTextSelect={handleTextSelection}
                    onSave={handleScriptSave}
                  />
                ) : (
                  TranscriptUploader
                )}
              </div>
            </div>

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