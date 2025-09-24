

import React, { useState, useEffect, useRef } from 'react';
import { generateRewrite, generateImage } from '../utils/gemini';
import { CheckIcon, MediaIcon, SparklesIcon } from './icons';

interface Message {
    type: 'ai' | 'user';
    text?: string;
    suggestions?: string[];
    rewrite?: string;
    context?: string;
    isLoading?: boolean;
    error?: string;
    isInserted?: boolean;
    imageUrl?: string;
    imagePrompt?: string;
}

interface AIChatPaneProps {
  selectedText: string;
}

const SuggestionPill: React.FC<{ text: string, onSelect: (text: string) => void }> = React.memo(({ text, onSelect }) => (
    <button onClick={() => onSelect(text)} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-slate-200 transition whitespace-nowrap">
        {text}
    </button>
));

const AIChatPane: React.FC<AIChatPaneProps> = ({ selectedText }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([
            {
                type: 'ai',
                text: "Hi! I'm your script assistant. I can help you write, rewrite, or improve any part of your script. Try selecting text in the editor and asking me to improve it.",
                suggestions: ["Make this more engaging", "Shorten this section", "/generate image of..."]
            }
        ]);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        const messageText = inputValue.trim();
        if (!messageText) return;

        // Image generation command
        if (messageText.toLowerCase().startsWith('/generate image')) {
            const imagePrompt = messageText.replace(/\/generate image/i, '').trim();
            if (!imagePrompt) {
                setMessages(prev => [...prev, { type: 'ai', error: 'Please provide a prompt for the image.' }]);
                return;
            }
    
            const userMessage: Message = { type: 'user', text: messageText };
            const loadingMessage: Message = { type: 'ai', isLoading: true };
    
            setMessages(prev => [...prev, userMessage, loadingMessage]);
            setInputValue('');
    
            try {
                const base64Image = await generateImage(imagePrompt);
                const imageUrl = `data:image/jpeg;base64,${base64Image}`;
                const imageResponse: Message = { type: 'ai', imageUrl, imagePrompt };
                setMessages(prev => [...prev.slice(0, -1), imageResponse]);
            } catch (error) {
                console.error(error);
                const errorMessage: Message = { type: 'ai', error: 'Sorry, I could not generate the image.' };
                setMessages(prev => [...prev.slice(0, -1), errorMessage]);
            }
            return;
        }

        // Text rewrite command
        if (!selectedText) {
             setMessages(prev => [...prev, { type: 'ai', error: 'Please select a piece of text from the editor to rewrite.' }]);
             return;
        }
        
        const userMessage: Message = { type: 'user', text: messageText, context: selectedText };
        const loadingMessage: Message = { type: 'ai', isLoading: true };

        setMessages(prev => [...prev, userMessage, loadingMessage]);
        setInputValue('');

        try {
            const rewrite = await generateRewrite(messageText, selectedText);
            const aiResponse: Message = { type: 'ai', rewrite };
            setMessages(prev => [...prev.slice(0, -1), aiResponse]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = { type: 'ai', error: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
    };
    
    const handleInsert = (index: number) => {
        setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, isInserted: true } : msg));
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full">
            <div role="log" aria-live="polite" className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3.5 ${msg.type === 'user' ? 'bg-slate-50 text-slate-800' : 'bg-indigo-50 text-slate-800'}`}>
                            {msg.isLoading && (
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse mr-2"></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse delay-75 mr-2"></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse delay-150"></div>
                                </div>
                            )}
                            {msg.text && <p>{msg.text}</p>}
                            {msg.context && (
                                <div className="mt-2 bg-white p-2 rounded-lg text-sm">
                                    <p className="text-slate-600 text-xs uppercase tracking-wider mb-1">Selected text:</p>
                                    <p className="line-clamp-2">{msg.context}</p>
                                </div>
                            )}
                            {msg.rewrite && (
                                <>
                                    <p className="font-medium mb-2">Here's a suggested rewrite:</p>
                                    <blockquote className="border-l-2 border-indigo-600 pl-3 text-sm">
                                        {msg.rewrite}
                                    </blockquote>
                                    <div className="mt-3">
                                        <button 
                                            onClick={() => handleInsert(index)} 
                                            disabled={msg.isInserted}
                                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition flex items-center disabled:bg-indigo-300"
                                        >
                                            {msg.isInserted ? 'Inserted' : 'Insert Rewrite'}
                                            {msg.isInserted && <CheckIcon className="h-3 w-3 inline ml-1" />}
                                        </button>
                                    </div>
                                </>
                            )}
                             {msg.imageUrl && (
                                <>
                                    <p className="font-medium mb-2">Generated Image:</p>
                                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-200">
                                        <img src={msg.imageUrl} alt={msg.imagePrompt || 'Generated image'} className="w-full h-auto" />
                                        {msg.imagePrompt && (
                                            <div className="bg-slate-50 p-2 text-center text-xs text-slate-500">
                                                {msg.imagePrompt}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 flex space-x-2">
                                        <button className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition">
                                            Use in Thumbnail
                                        </button>
                                    </div>
                                </>
                            )}
                            {msg.suggestions && (
                                 <div className="mt-2 flex flex-wrap gap-1.5">
                                    {msg.suggestions.map((s, i) => <SuggestionPill key={i} text={s} onSelect={handleSuggestionClick} />)}
                                 </div>
                            )}
                            {msg.error && <p className="text-red-600 text-sm">{msg.error}</p>}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="border-t border-slate-200 p-4 bg-white">
                <div className="relative">
                    <label htmlFor="chatInput" className="sr-only">Ask me to rewrite, generate, or help...</label>
                    <input
                        id="chatInput"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask me to rewrite, generate, or help..."
                        className="border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 w-full pr-24"
                    />
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <button onClick={handleSendMessage} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition" aria-label="Send message">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0_0_24_24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
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