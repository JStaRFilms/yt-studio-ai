import React, { useState, useEffect, useRef } from 'react';
import { startChatSession } from '../utils/gemini';
import ChatHistoryViewer from './ChatHistoryViewer';
import { parseAndSanitizeMarkdown } from '../utils/markdown';
import type { Chat, Content } from '@google/genai';

interface Message {
    id: number;
    type: 'ai' | 'user';
    rawContent: string;
    suggestions?: string[];
}

interface AIChatPaneProps {
  selectedText: string;
  assistantHistory?: Content[];
  brainstormHistory?: Content[];
  onAssistantHistoryUpdate: (newHistory: Content[]) => Promise<void>;
}

const SuggestionPill: React.FC<{ text: string, onSelect: (text: string) => void }> = React.memo(({ text, onSelect }) => (
    <button onClick={() => onSelect(text)} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-slate-200 transition whitespace-nowrap">
        {text}
    </button>
));

const AIChatPane: React.FC<AIChatPaneProps> = ({ selectedText, assistantHistory = [], brainstormHistory = [], onAssistantHistoryUpdate }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const messageCounter = useRef(0);
    
    useEffect(() => {
        const session = startChatSession(assistantHistory, brainstormHistory);
        setChatSession(session);
        
        const historyMessages = assistantHistory.map(entry => ({
            id: messageCounter.current++,
            type: entry.role === 'user' ? 'user' : 'ai',
            rawContent: entry.parts.map(p => p.text).join(''),
        }) as Message);

        if (historyMessages.length === 0) {
            setMessages([
                {
                    id: messageCounter.current++,
                    type: 'ai',
                    rawContent: "Hi! I'm your script assistant. I can help you write, rewrite, or improve any part of your script. Try selecting text in the editor and asking me to improve it.",
                    suggestions: ["Make this more engaging", "Shorten this section", "/generate image of..."]
                }
            ]);
        } else {
            setMessages(historyMessages);
        }
    }, [assistantHistory, brainstormHistory]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        const messageText = text.trim();
        if (!messageText || !chatSession) return;
        
        const fullPrompt = selectedText ? `Instruction: "${messageText}"\n\n--- Selected Text ---\n"${selectedText}"` : messageText;

        const userMessage: Message = { id: messageCounter.current++, type: 'user', rawContent: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        
        const loadingMessageId = messageCounter.current++;
        const loadingMessage: Message = { id: loadingMessageId, type: 'ai', rawContent: '...' };
        setMessages(prev => [...prev, loadingMessage]);

        try {
            const responseStream = await chatSession.sendMessageStream({ message: fullPrompt });
            let fullResponse = "";
            for await (const chunk of responseStream) {
                fullResponse += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === loadingMessageId ? { ...msg, rawContent: fullResponse } : msg
                ));
            }
            const newHistory = await chatSession.getHistory();
            await onAssistantHistoryUpdate(newHistory);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => prev.map(msg => msg.id === loadingMessageId ? { ...msg, rawContent: "**Sorry, I encountered an error.** Please try again." } : msg));
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (suggestion.includes('...')) {
            setInputValue(suggestion.replace('...', ''));
        } else {
            handleSendMessage(suggestion);
        }
    };
    
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full">
            <div role="log" aria-live="polite" className="flex-1 overflow-y-auto p-4 space-y-4">
                <ChatHistoryViewer 
                    history={brainstormHistory}
                    title="Brainstorm History"
                />
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3.5 ${msg.type === 'user' ? 'bg-slate-50 text-slate-800' : 'bg-indigo-50 text-slate-800'}`}>
                           {msg.rawContent === '...' ? (
                               <div className="flex items-center space-x-1.5"><div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div><div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div></div>
                           ) : (
                               <div className="markdown-content" dangerouslySetInnerHTML={{ __html: parseAndSanitizeMarkdown(msg.rawContent) }} />
                           )}
                           {msg.suggestions && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                   {msg.suggestions.map((s, i) => <SuggestionPill key={i} text={s} onSelect={handleSuggestionClick} />)}
                                </div>
                           )}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="border-t border-slate-200 p-4 bg-white">
                 {selectedText && (
                    <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                        <p className="font-semibold">Context: Selected Text</p>
                        <p className="line-clamp-2 mt-1 italic">"{selectedText}"</p>
                    </div>
                )}
                <div className="relative">
                    <label htmlFor="chatInput" className="sr-only">Ask me anything...</label>
                    <input
                        id="chatInput"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                        placeholder="Ask about your selected text..."
                        className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 w-full pr-14"
                    />
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
                        <button onClick={() => handleSendMessage(inputValue)} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition" aria-label="Send message">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChatPane;