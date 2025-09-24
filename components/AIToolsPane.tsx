import React, { useState } from 'react';
import { LightningIcon } from './icons';
import { generateCleanup, generateContentPackage, ContentPackage } from '../utils/gemini';
import { parseAndSanitizeMarkdown } from '../utils/markdown';

interface AIToolsPaneProps {
  script: string;
  onApplyChanges: (newScript: string) => void;
}

const AIToolsPane: React.FC<AIToolsPaneProps> = ({ script, onApplyChanges }) => {
  const [cleanupStatus, setCleanupStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [cleanedScript, setCleanedScript] = useState('');
  const [originalScript, setOriginalScript] = useState('');
  const [view, setView] = useState<'cleaned' | 'original'>('cleaned');

  const [packageStatus, setPackageStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [contentPackage, setContentPackage] = useState<ContentPackage | null>(null);

  const handleAiEdit = async () => {
    if (!script || script.trim() === '') {
      alert("Script is empty. There's nothing to clean up.");
      return;
    }
    setOriginalScript(script);
    setCleanupStatus('loading');
    try {
      const result = await generateCleanup(script);
      setCleanedScript(result);
      setCleanupStatus('complete');
      setView('cleaned');
    } catch (error) {
      console.error(error);
      setCleanupStatus('idle');
      setOriginalScript('');
      alert('Failed to clean up script. Please try again.');
    }
  };

  const handleApplyCleanup = () => {
    onApplyChanges(cleanedScript);
    resetCleanupState();
  };

  const resetCleanupState = () => {
    setCleanupStatus('idle');
    setCleanedScript('');
    setOriginalScript('');
    setView('cleaned');
  };

  const toggleView = () => {
    setView(prev => (prev === 'cleaned' ? 'original' : 'cleaned'));
  };

  const handleGeneratePackage = async () => {
    if (!script || script.trim() === '') {
      alert("Script is empty. Cannot generate content package.");
      return;
    }
    setPackageStatus('loading');
    try {
        const result = await generateContentPackage(script);
        setContentPackage(result);
        setPackageStatus('complete');
    } catch (error) {
        console.error(error);
        setPackageStatus('idle');
        alert('Failed to generate content package. Please try again.');
    }
  };


  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Transcript Cleanup Module */}
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-medium text-slate-800 mb-2">Transcript Cleanup</h4>
          <p className="text-sm text-slate-600 mb-3">Remove filler words and tighten your script for better pacing.</p>
          
          {cleanupStatus === 'idle' && (
            <button onClick={handleAiEdit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center">
              <LightningIcon className="h-4 w-4 mr-2" />
              AI Edit
            </button>
          )}

          {cleanupStatus === 'loading' && (
            <button disabled className="w-full bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center cursor-not-allowed">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
            </button>
          )}

          {cleanupStatus === 'complete' && (
            <div className="bg-slate-50 rounded-lg p-4 mt-3 text-sm">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h5 className="font-medium text-slate-800">
                    {view === 'cleaned' ? 'Cleaned Script' : 'Original Script'}
                  </h5>
                  {view === 'cleaned' && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1 inline-block">
                      Improved readability
                    </span>
                  )}
                </div>
                <button
                  onClick={toggleView}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  {view === 'cleaned' ? 'Show Original' : 'Show Cleaned Version'}
                </button>
              </div>
              <div
                className="text-slate-700 text-sm leading-relaxed mb-3 max-h-40 overflow-y-auto border border-slate-200 bg-white rounded-md p-2 font-mono markdown-content"
                dangerouslySetInnerHTML={{ __html: parseAndSanitizeMarkdown(view === 'cleaned' ? cleanedScript : originalScript) }}
              />
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleApplyCleanup}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1.5 rounded disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  disabled={view === 'original'}
                >
                  Apply Changes
                </button>
                <button
                  onClick={resetCleanupState}
                  className="flex-1 border border-slate-300 text-slate-700 text-sm py-1.5 rounded hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Content Packaging Module */}
        <div className="p-4">
            <h4 className="font-medium text-slate-800 mb-2">Content Packaging</h4>
            <p className="text-sm text-slate-600 mb-3">Generate compelling metadata to increase your video's visibility.</p>

            {packageStatus !== 'loading' && (
                <button onClick={handleGeneratePackage} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    {packageStatus === 'complete' ? 'Regenerate Package' : 'Generate Package'}
                </button>
            )}

            {packageStatus === 'loading' && (
                <button disabled className="w-full bg-slate-200 text-slate-600 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center cursor-not-allowed">
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating...
                </button>
            )}

            {packageStatus === 'complete' && contentPackage && (
                <div className="bg-slate-50 rounded-lg p-4 mt-3 text-sm">
                    <h5 className="font-medium text-slate-800 mb-3">Generated Metadata</h5>
                    
                    <div className="mb-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Titles</p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            {contentPackage.titles.map((title, i) => <li key={i}>{title}</li>)}
                        </ul>
                    </div>
                    
                    <div className="mb-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Description</p>
                        <div className="text-slate-700 markdown-content" dangerouslySetInnerHTML={{ __html: parseAndSanitizeMarkdown(contentPackage.description) }} />
                    </div>
                    
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Tags</p>
                        <div className="flex flex-wrap gap-1">
                            {contentPackage.tags.map((tag, i) => (
                                <span key={i} className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIToolsPane;