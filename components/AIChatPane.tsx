import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import SuggestionPill from './SuggestionPill';
import { SparklesIcon } from './icons';
import { startChatSession } from '../utils/gemini';
import { ChatMessage, Project } from '../utils/db';
import UnifiedChatHistory from './UnifiedChatHistory';

interface AIChatPaneProps {
  selectedText: string;
  project: Project;
  onHistoryUpdate: (newHistory: ChatMessage[]) => Promise<void>;
  onSourceSelect: (text: string) => void;
  onShowModal: (title: string, message: string) => void;
}

const AIChatPane: React.FC<AIChatPaneProps> = ({ selectedText, project, onHistoryUpdate, onSourceSelect, onShowModal }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const newChat = startChatSession(project.chatHistory);
    setChat(newChat);
  }, [project.chatHistory]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [project.chatHistory, isLoading]);

  useEffect(() => {
    if (selectedText) {
      textareaRef.current?.focus();
    }
  }, [selectedText]);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || userInput;
    if (!messageToSend.trim() || !chat || isLoading) return;

    let contextualMessage = messageToSend;
    if (selectedText) {
      contextualMessage = `Given the following selected text from the script:\n\n---\n${selectedText}\n---\n\nMy request is: ${messageToSend}`;
    }

    const currentHistory = project.chatHistory || [];
    const newUserMessage: ChatMessage = { 
        role: 'user', 
        parts: [{ text: contextualMessage }],
        context: 'assistant',
        timestamp: Date.now()
    };
    
    // Optimistically update UI
    onHistoryUpdate([...currentHistory, newUserMessage]);
    setIsLoading(true);
    setUserInput('');

    try {
        const result = await chat.sendMessageStream({ message: contextualMessage });
        let responseText = '';
        
        const tempAIMessage: ChatMessage = { role: 'model', parts: [{ text: '...' }], context: 'assistant', timestamp: Date.now() + 1 };
        onHistoryUpdate([...currentHistory, newUserMessage, tempAIMessage]);

        for await (const chunk of result) {
            responseText += chunk.text;
            const updatedHistory = [...currentHistory, newUserMessage];
            updatedHistory[updatedHistory.length] = { ...tempAIMessage, parts: [{ text: responseText }]};
            onHistoryUpdate(updatedHistory);
        }

        const finalAIMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }], context: 'assistant', timestamp: Date.now() };
        await onHistoryUpdate([...currentHistory, newUserMessage, finalAIMessage]);
        
    } catch (error) {
        console.error('Error sending message to AI:', error);
        onShowModal('AI Communication Error', 'There was an error communicating with the AI. Please try again.');
        await onHistoryUpdate(currentHistory); // Revert
    } finally {
        setIsLoading(false);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = ['Make this more engaging', 'Suggest 3 alternatives', 'Check for clarity'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden h-full flex flex-col">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
        {(project.chatHistory || []).length === 0 && !isLoading && (
            <div className="text-center text-slate-500 p-8">
                <SparklesIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="font-medium text-slate-800">AI Assistant</h3>
                <p className="text-sm mt-1">Select text in the editor or ask me anything about your script.</p>
            </div>
        )}
        <UnifiedChatHistory 
          history={project.chatHistory || []} 
          currentContext="assistant" 
          isLoading={isLoading}
          onTextSelect={onSourceSelect}
        />
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        {selectedText && (
          <div className="mb-3 p-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-800">
            <p className="font-semibold">Context from script:</p>
            <p className="line-clamp-2">"{selectedText}"</p>
          </div>
        )}
        <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-2 -mx-4 px-4">
          {suggestions.map((s, i) => <SuggestionPill key={i} suggestion={s} onClick={() => handleSendMessage(s)} />)}
        </div>
        <div className="relative">
          <textarea ref={textareaRef} value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={selectedText ? 'e.g., "make this funnier"' : 'Ask me anything...'} className="w-full p-3 pr-12 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" rows={2} disabled={isLoading} />
          <button onClick={() => handleSendMessage()} disabled={isLoading || !userInput.trim()} className="absolute right-3 top-3 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPane;