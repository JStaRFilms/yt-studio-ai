import React, { useState } from 'react';
import { LightningIcon } from './icons';
import { generateCleanup } from '../utils/gemini';

interface AIToolsPaneProps {
  script: string;
  onApplyChanges: (newScript: string) => void;
}

const AIToolsPane: React.FC<AIToolsPaneProps> = ({ script, onApplyChanges }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [cleanedScript, setCleanedScript] = useState('');
  const [originalScript, setOriginalScript] = useState('');
  const [view, setView] = useState<'cleaned' | 'original'>('cleaned');

  const handleAiEdit = async () => {
    if (!script || script.trim() === '') {
      alert("Script is empty. There's nothing to clean up.");
      return;
    }
    setOriginalScript(script);
    setStatus('loading');
    try {
      const result = await generateCleanup(script);
      setCleanedScript(result);
      setStatus('complete');
      setView('cleaned');
    } catch (error) {
      console.error(error);
      setStatus('idle');
      setOriginalScript('');
      alert('Failed to clean up script. Please try again.');
    }
  };

  const handleApply = () => {
    onApplyChanges(cleanedScript);
    resetState();
  };

  const handleCancel = () => {
    resetState();
  };
  
  const resetState = () => {
    setStatus('idle');
    setCleanedScript('');
    setOriginalScript('');
    setView('cleaned');
  };

  const toggleView = () => {
    setView(prev => (prev === 'cleaned' ? 'original' : 'cleaned'));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Transcript Cleanup Module */}
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-medium text-slate-800 mb-2">Transcript Cleanup</h4>
          <p className="text-sm text-slate-600 mb-3">Remove filler words and tighten your script for better pacing.</p>
          
          {status === 'idle' && (
            <button onClick={handleAiEdit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center">
              <LightningIcon className="h-4 w-4 mr-2" />
              AI Edit
            </button>
          )}

          {status === 'loading' && (
            <button disabled className="w-full bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center cursor-not-allowed">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
            </button>
          )}

          {status === 'complete' && (
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
              <p className="text-slate-700 text-sm leading-relaxed mb-3 max-h-40 overflow-y-auto border border-slate-200 bg-white rounded-md p-2 font-mono">
                {view === 'cleaned' ? cleanedScript : originalScript}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1.5 rounded disabled:bg-indigo-400 disabled:cursor-not-allowed"
                  disabled={view === 'original'}
                >
                  Apply Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 border border-slate-300 text-slate-700 text-sm py-1.5 rounded hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Future tools can be added here as separate modules */}
      </div>
    </div>
  );
};

export default AIToolsPane;