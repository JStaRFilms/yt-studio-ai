import React, { useState, useEffect, useRef } from 'react';
import ProjectSidebar from '../components/ProjectSidebar';
import { CheckIcon } from '../components/icons';
import { addProject } from '../utils/db';
import { startChatSession, generateScriptFromChat } from '../utils/gemini';
import type { Chat } from '@google/genai';

interface Message {
    id: number;
    type: 'ai' | 'user';
    content: React.ReactNode;
    suggestions?: { text: string; suggestion: string }[];
    isLoading?: boolean;
}

const SuggestionPill: React.FC<{ text: string, suggestion: string, onSelect: (suggestion: string) => void }> = ({ text, suggestion, onSelect }) => (
    <button
        onClick={() => onSelect(suggestion)}
        className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-slate-200 transition"
    >
        {text}
    </button>
);

const ProjectSetup: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const messageCounter = useRef(0);

    useEffect(() => {
        setChatSession(startChatSession());
        setMessages([
            {
                id: messageCounter.current++,
                type: 'ai',
                content: (
                    <>
                        <p className="font-medium">Hi there! I'm your video brainstorming assistant. 👋</p>
                        <p className="mt-2 text-sm">Let's create something great together. What's on your mind?</p>
                    </>
                ),
                suggestions: [
                    { text: 'Sustainable fashion ideas', suggestion: 'What video topics should I cover about sustainable fashion?' },
                    { text: 'Tokyo travel vlog outline', suggestion: 'Help me outline a travel vlog for Tokyo' },
                    { text: 'Cooking tutorial titles', suggestion: 'Brainstorm YouTube titles for a cooking tutorial' }
                ]
            }
        ]);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        const messageText = text.trim();
        if (!messageText || !chatSession) return;

        const userMessage: Message = { id: messageCounter.current++, type: 'user', content: <p>{messageText}</p> };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        const loadingMessageId = messageCounter.current++;
        const loadingMessage: Message = { id: loadingMessageId, type: 'ai', content: null, isLoading: true };
        setMessages(prev => [...prev, loadingMessage]);

        try {
            const responseStream = await chatSession.sendMessageStream({ message: messageText });
            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                setMessages(prev => prev.map(msg =>
                    msg.id === loadingMessageId
                        ? { ...msg, content: <p>{chunkText}</p>, isLoading: false }
                        : msg
                ));
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => prev.map(msg =>
                msg.id === loadingMessageId
                    ? { ...msg, content: <p className="text-red-500">Sorry, I encountered an error. Please try again.</p>, isLoading: false }
                    : msg
            ));
        }
    };

    // Fix: Replace usage of private property 'history' with the public 'getHistory()' method.
    const handleConvertToScript = async () => {
        if (!chatSession) {
            alert("Let's brainstorm a bit first before creating the script!");
            return;
        }
        setIsConverting(true);
        try {
            const history = await chatSession.getHistory();
            if (history.length < 1) {
                alert("Let's brainstorm a bit first before creating the script!");
                setIsConverting(false);
                return;
            }

            const projectData = await generateScriptFromChat(history);
            const newProjectId = await addProject({
                title: projectData.title || 'Untitled Project',
                script: projectData.script || 'No script generated.',
            });
            window.location.href = `/project/${newProjectId}`;
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Could not create a new project. Please try again.");
            setIsConverting(false);
        }
    };

    const handleSuggestionSelect = (suggestion: string) => {
        handleSendMessage(suggestion);
    };

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <ProjectSidebar projectName="New Video Idea" projectStep="Ideation phase" />
            <main className="flex-1 md:ml-64 flex flex-col h-screen max-h-screen">
                <header className="bg-white border-b border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Brainstorm Session</h2>
                            <div className="mt-1 sm:mt-0 flex flex-wrap gap-2">
                                <span className="text-xs bg-indigo-600/10 text-indigo-600 px-2 py-1 rounded-full">Ideation Phase</span>
                                <span className="text-xs text-slate-500">Session active</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3.5 ${msg.type === 'ai' ? 'bg-indigo-50 text-slate-800' : 'bg-slate-100 text-slate-800'}`}>
                                {msg.isLoading && (
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                )}
                                {msg.content}
                                {msg.suggestions && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {msg.suggestions.map((s) => <SuggestionPill key={s.text} text={s.text} suggestion={s.suggestion} onSelect={handleSuggestionSelect} />)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="border-t border-slate-200 p-4 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                            placeholder="Type your message..."
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                        />
                        <button onClick={() => handleSendMessage(inputValue)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition">
                            Send
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-slate-200">
                    {isConverting ? (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
                            <svg className="animate-spin h-6 w-6 mx-auto text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <p className="text-slate-700 font-medium">Generating title & script...</p>
                            <p className="text-sm text-slate-500 mt-1">Preparing your project for editing</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-slate-800">Ready to start scripting?</h3>
                                    <p className="text-sm text-slate-600 mt-1">Convert your brainstorm session into a project.</p>
                                </div>
                                <button onClick={handleConvertToScript} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium text-sm transition whitespace-nowrap">
                                    Convert to Script
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProjectSetup;
