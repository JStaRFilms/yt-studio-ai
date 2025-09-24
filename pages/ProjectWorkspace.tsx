import React, { useState, useRef, useEffect } from 'react';
import ProjectSidebar from '../components/ProjectSidebar';
import ProjectWorkspaceHeader from '../components/ProjectWorkspaceHeader';
import EditorPane from '../components/EditorPane';
import AIChatPane from '../components/AIChatPane';
import AIToolsPane from '../components/AIToolsPane';
import ProjectMobileNav from '../components/ProjectMobileNav';
import { UploadCloudIcon, ChatIcon, AIToolsIcon } from '../components/icons';
import { getProject, updateProject, Project, ChatMessage } from '../utils/db';

interface ProjectWorkspaceProps {
    projectId: number;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'tools'>('chat');

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

  const handleHistoryUpdate = async (newHistory: ChatMessage[]) => {
      if (project) {
          try {
              await updateProject(project.id!, { chatHistory: newHistory });
              setProject(prev => prev ? { ...prev, chatHistory: newHistory, updatedAt: new Date() } : null);
          } catch (error) {
              console.error("Failed to save chat history:", error);
              throw error;
          }
      }
  };

  const handleScriptUpdate = async (newScript: string) => {
    if (project) {
        try {
            await updateProject(project.id!, { script: newScript });
            setProject(prev => prev ? { ...prev, script: newScript, updatedAt: new Date() } : null);
        } catch (error) {
            console.error("Failed to save script:", error);
            throw error;
        }
    }
  };

  const processFile = async (file: File) => {
    if (file && (file.type === 'text/plain' || file.name.endsWith('.srt'))) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        await handleScriptUpdate(content);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .txt or .srt file.');
    }
  };

  const handleHeaderUploadClick = () => fileInputRef.current?.click();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processFile(files[0]);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleUploaderClick = () => fileInputRef.current?.click();

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
  
  if (loading) return <div className="flex h-screen w-full items-center justify-center">Loading project...</div>;
  if (!project) return <div className="flex h-screen w-full items-center justify-center">Project not found.</div>;

  return (
    <div className="flex">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.srt" />
      <ProjectSidebar projectName={project.title} projectStep="Script Editing" projectId={project.id!} activePage="editor" />
      <ProjectMobileNav />

      <main className="flex-1 md:ml-64 flex flex-col h-screen bg-slate-50">
        <ProjectWorkspaceHeader onUpload={handleHeaderUploadClick} />
        
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex-1 overflow-y-auto lg:overflow-hidden pb-24 md:pb-6">
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div className="lg:w-3/5 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-slate-800">Script Editor</h3>
              </div>
              <div className="flex-1">
                {project.script ? (
                  <EditorPane initialContent={project.script} onTextSelect={setSelectedText} onScriptUpdate={handleScriptUpdate} />
                ) : TranscriptUploader}
              </div>
            </div>

            <div className="lg:w-2/5 flex flex-col">
                <div className="flex border-b border-slate-200">
                    <button onClick={() => setActiveTab('chat')} className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`} aria-current={activeTab === 'chat'}>
                        <ChatIcon className="h-5 w-5 mr-2" /> AI Assistant
                    </button>
                    <button onClick={() => setActiveTab('tools')} className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tools' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`} aria-current={activeTab === 'tools'}>
                        <AIToolsIcon className="h-5 w-5 mr-2" /> AI Tools
                    </button>
                </div>
               <div className="flex-1 min-h-[500px] lg:min-h-0 pt-3">
                {activeTab === 'chat' ? (
                  <AIChatPane project={project} selectedText={selectedText} onHistoryUpdate={handleHistoryUpdate} />
                ) : (
                  <AIToolsPane script={project.script || ''} onApplyChanges={handleScriptUpdate} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectWorkspace;