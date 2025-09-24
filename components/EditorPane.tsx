import React, { useState, useEffect } from 'react';
import { CheckIcon } from './icons';
import { parseAndSanitizeMarkdown } from '../utils/markdown';

interface EditorPaneProps {
  initialContent: string;
  onTextSelect: (text: string) => void;
  onScriptUpdate: (newContent: string) => Promise<void>;
  onSelectionChange: (selection: { start: number; end: number } | null) => void;
  onFocusChange: (isFocused: boolean) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({ initialContent, onTextSelect, onScriptUpdate, onSelectionChange, onFocusChange }) => {
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    // Un-escape newline and tab characters that might come from JSON strings
    const unescapedContent = initialContent ? initialContent.replace(/\\n/g, '\n').replace(/\\t/g, '\t') : '';
    setContent(unescapedContent);
    setSaveStatus('idle');
    setIsEditing(false); // Default to view mode when content loads
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (saveStatus === 'saved') {
      setSaveStatus('idle');
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const selection = target.value.substring(target.selectionStart, target.selectionEnd);
    onTextSelect(selection.trim());
    onSelectionChange({ start: target.selectionStart, end: target.selectionEnd });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    onSelectionChange({ start: target.selectionStart, end: target.selectionEnd });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await onScriptUpdate(content);
      setSaveStatus('saved');
      setIsEditing(false); // Switch back to view mode
      setTimeout(() => {
        setSaveStatus(prevStatus => prevStatus === 'saved' ? 'idle' : prevStatus);
      }, 2000);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save script.");
      setSaveStatus('idle');
    }
  };
  
  const handleBlur = () => {
      onFocusChange(false);
      // A small delay allows a click on the contextual toolbar to register before we clear the selection
      setTimeout(() => onSelectionChange(null), 100);
  }

  const saveButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        );
      case 'saved':
        return (
          <>
            <CheckIcon className="-ml-1 mr-2 h-4 w-4" />
            Saved
          </>
        );
      default:
        return 'Save';
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-2 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
        <span className="text-xs text-slate-500 px-2">{content.split(/\s+/).filter(Boolean).length} words</span>
        {isEditing ? (
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || initialContent === content}
            className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center transition-colors ${
              saveStatus === 'saved'
                ? 'bg-green-100 text-green-800'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed'
            }`}
          >
            {saveButtonContent()}
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 text-xs font-medium rounded-md flex items-center transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <textarea
          value={content}
          onChange={handleChange}
          onSelect={handleSelect}
          onMouseUp={handleMouseUp}
          onFocus={() => onFocusChange(true)}
          onBlur={handleBlur}
          placeholder="Your script will appear here..."
          className="w-full h-full flex-1 p-4 overflow-y-auto resize-none bg-slate-50 focus:outline-none leading-relaxed"
          aria-label="Script editor"
          autoFocus
        />
      ) : (
        <div
          className="w-full h-full flex-1 p-4 overflow-y-auto leading-relaxed markdown-content prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parseAndSanitizeMarkdown(content) }}
        />
      )}
    </div>
  );
};

export default EditorPane;
