import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface EditorPaneProps {
  content: string;
  onTextSelect: (text: string) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({ content, onTextSelect }) => {
  const paragraphs = useMemo(() => content.split('\n').filter(p => p.trim() !== ''), [content]);
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);
  
  useEffect(() => {
    if (selectedIndex !== null && paragraphs[selectedIndex]) {
      onTextSelect(paragraphs[selectedIndex]);
    } else {
      onTextSelect('');
    }
  }, [selectedIndex, onTextSelect, paragraphs]);

  useEffect(() => {
    setSelectedIndex(null);
  }, [content]);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex space-x-1">
          {/* Editor tools can be added here */}
        </div>
        <div className="text-xs text-slate-500">{`${content.split(' ').length} words`}</div>
      </div>
      <div className="p-4 overflow-y-auto flex-1" style={{ minHeight: '400px' }}>
        <div className="prose max-w-none">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, index) => (
             <p 
              key={index} 
              onClick={() => handleSelect(index)}
              className={`mb-4 cursor-pointer transition-colors rounded p-2 ${selectedIndex === index ? 'bg-amber-100/50 ring-1 ring-amber-300' : 'hover:bg-slate-100'}`}
             >
              {p}
            </p>
            ))
          ) : (
            <p className="text-slate-500 italic">No content to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPane;