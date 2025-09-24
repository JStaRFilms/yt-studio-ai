import React from 'react';
import { PlusIcon } from './icons'; // Assuming a generic 'replace' icon for now

// A simple icon for replace action
const ReplaceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l3.181-3.183a8.25 8.25 0 00-11.664 0l3.181 3.183" />
    </svg>
);


interface ContextualToolbarProps {
  editorSelection: { start: number; end: number };
  onReplace: () => void;
  onAppend: () => void;
}

const ContextualToolbar: React.FC<ContextualToolbarProps> = ({ editorSelection, onReplace, onAppend }) => {
  const hasSelection = editorSelection.start !== editorSelection.end;

  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-slate-800 text-white rounded-lg shadow-lg px-3 py-2 flex items-center space-x-2"
      role="toolbar"
    >
      {hasSelection && (
        <button
          onClick={onReplace}
          className="flex items-center text-xs font-medium hover:bg-slate-700 px-2 py-1 rounded"
        >
          <ReplaceIcon className="w-4 h-4 mr-1" />
          Replace
        </button>
      )}
      <button
        onClick={onAppend}
        className="flex items-center text-xs font-medium hover:bg-slate-700 px-2 py-1 rounded"
      >
        <PlusIcon className="w-4 h-4 mr-1" />
        Append
      </button>
    </div>
  );
};

export default ContextualToolbar;
