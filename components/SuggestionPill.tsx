import React from 'react';

interface SuggestionPillProps {
  suggestion: string;
  onClick: () => void;
}

const SuggestionPill: React.FC<SuggestionPillProps> = ({ suggestion, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-slate-200 transition whitespace-nowrap"
    >
      {suggestion}
    </button>
  );
};

export default SuggestionPill;
