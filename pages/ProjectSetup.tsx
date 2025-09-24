import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { getProject, addProject, updateProject, Project, ChatMessage } from '../utils/db';
import { startChatSession, generateScriptFromChat, ProjectData } from '../utils/gemini';
import ProjectSidebar from '../components/ProjectSidebar';
import SuggestionPill from '../components/SuggestionPill';
import { LightningIcon, ChatIcon } from '../components/icons';
import UnifiedChatHistory from '../components/UnifiedChatHistory';

interface ProjectSetupProps {
  projectId?: number;
}

const ProjectSetup: React.FC<ProjectSetupProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        setIsLoading(true);
        try {
          const fetchedProject = await getProject(projectId);
          if (fetchedProject) {
            setProject(fetchedProject);
          } else {
            console.error(`Project with ID ${projectId} not found.`);
          }
        } catch (error) {
          console.error("Failed to load project:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProject();
  }, [projectId]);

  useEffect(() => {
    const chatSession = startChatSession(project?.chatHistory);
    setChat(chatSession);
  }, [project]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [project?.chatHistory, isLoading]);
  
  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || userInput;
    if (!messageToSend.trim() || !chat || isLoading || isGenerating) return;

    const currentHistory = project?.chatHistory || [];
    const newUserMessage: ChatMessage = { 
        role: 'user', 
        parts: [{ text: messageToSend }],
        context: 'brainstorm',
        timestamp: Date.now()
    };
    
    setProject(prev => prev ? {...prev, chatHistory: [...(prev.chatHistory || []), newUserMessage]} : null);
    setIsLoading(true);
    setUserInput('');

    try {
        const result = await chat.sendMessageStream({ message: messageToSend });
        let responseText = '';
        
        const tempAIMessage: ChatMessage = { role: 'model', parts: [{ text: '...' }], context: 'brainstorm', timestamp: Date.now() + 1 };
        setProject(prev => prev ? {...prev, chatHistory: [...(prev.chatHistory || []), tempAIMessage]} : null);

        for await (const chunk of result) {
            responseText += chunk.text;
            setProject(prev => {
                if (!prev) return null;
                const updatedHistory = [...(prev.chatHistory || [])];
                updatedHistory[updatedHistory.length - 1] = { ...updatedHistory[updatedHistory.length - 1], parts: [{ text: responseText }]};
                return {...prev, chatHistory: updatedHistory};
            });
        }
        
        const finalAIMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }], context: 'brainstorm', timestamp: Date.now() };
        const finalHistory = [...currentHistory, newUserMessage, finalAIMessage];
        
        if (project) {
          await updateProject(project.id!, { chatHistory: finalHistory });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setProject(prev => prev ? {...prev, chatHistory: currentHistory} : null);
        alert('There was an error communicating with the AI. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleGenerateProject = async () => {
    const history = project?.chatHistory || [];
    if (history.length < 2) {
      alert('Please have a short conversation with the AI to generate a project.');
      return;
    }
    setIsGenerating(true);
    try {
      const chatHistoryForGeneration = await chat?.getHistory() ?? history;
      const projectData: ProjectData = await generateScriptFromChat(chatHistoryForGeneration);
      const finalHistory = await chat?.getHistory() ?? history;
      const chatMessagesForDb = finalHistory.map((c, i) => ({...c, context: history[i]?.context || 'brainstorm', timestamp: history[i]?.timestamp || Date.now() } as ChatMessage));

      if (project) {
        await updateProject(project.id!, {
          title: projectData.title,
          script: projectData.script,
          chatHistory: chatMessagesForDb,
        });
        window.location.href = `/project/${project.id}`;
      } else {
        const newProjectId = await addProject({
          title: projectData.title,
          script: projectData.script,
          chatHistory: chatMessagesForDb,
        });
        window.location.href = `/project/${newProjectId}`;
      }
    } catch (error) {
      console.error('Failed to generate project:', error);
      alert('There was an error generating the project from your conversation. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const suggestions = [ "I want to make a video about...", "Help me brainstorm a topic", "What's a good format for a tutorial?" ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <ProjectSidebar
        projectName={project?.title || "New Project"}
        projectStep="Brainstorming"
        projectId={project?.id || 0}
        activePage="brainstorm"
      />
      <main className="flex-1 md:ml-64 flex flex-col h-screen">
        <header className="bg-white border-b border-slate-200 p-4 sm:px-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-slate-800">Brainstorm with AI</h1>
            <button 
                onClick={handleGenerateProject}
                disabled={isGenerating || (project?.chatHistory || []).length < 2}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm inline-flex items-center disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
                {isGenerating ? 'Generating...' : <><LightningIcon className="h-4 w-4 mr-2 -ml-1" />Generate Project</>}
            </button>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
                 {(project?.chatHistory || []).length === 0 && !isLoading && (
                    <div className="text-center text-slate-500 p-8 flex flex-col items-center">
                        <ChatIcon className="h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="font-medium text-slate-800">Let's Brainstorm Your Next Video</h3>
                        <p className="text-sm mt-1 max-w-md">Start by telling me your idea, or use one of the suggestions below to get the conversation going.</p>
                    </div>
                )}
                <UnifiedChatHistory history={project?.chatHistory || []} currentContext="brainstorm" isLoading={isLoading} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-2 -mx-4 px-4">
                    {suggestions.map((s, i) => <SuggestionPill key={i} suggestion={s} onClick={() => setUserInput(s)} />)}
                </div>
                <div className="relative">
                    <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Let's start with a topic or an idea..." className="w-full p-3 pr-12 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" rows={2} disabled={isLoading || isGenerating} />
                    <button onClick={() => handleSendMessage()} disabled={isLoading || isGenerating || !userInput.trim()} className="absolute right-3 top-3 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectSetup;