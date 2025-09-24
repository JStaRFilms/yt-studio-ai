import React, { useState, useEffect, useCallback } from 'react';

const initialParagraphs = [
  "Today we're diving into the new iPhone 15 Pro Max. I've been testing it for two weeks now, and I have to say... it's incredible. The titanium frame makes it so much lighter than the previous model, which is a huge improvement.",
  "The camera system is where this phone really shines. The new 5x optical zoom is game-changing for mobile photography. I took some shots at the park yesterday, and the detail was astonishing. You can see individual leaves on trees from 50 feet away.",
  "Now let's talk about performance. The A17 Pro chip is... well, it's fast. Like, really fast. I ran some benchmarks against the 14 Pro, and the difference is noticeable even in everyday tasks. Scrolling is smoother, apps launch quicker, and multitasking is a breeze.",
  "One thing I wasn't expecting was the battery life. Apple claims 20 hours of video playback, but in real-world use, I'm getting about 15 hours with mixed usage. That's still better than most Android flagships, but not quite as good as I hoped.",
  "The USB-C port is finally here! It's about time. File transfers are much faster now, and I don't need to carry multiple cables anymore. However, the charging speed still lags behind Android competitors. You'll need the 27W adapter for full speed, which costs extra."
];

interface EditorPaneProps {
  onTextSelect: (text: string) => void;
}

const EditorPane: React.FC<EditorPaneProps> = ({ onTextSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(2);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);
  
  useEffect(() => {
    if (selectedIndex !== null) {
      onTextSelect(initialParagraphs[selectedIndex]);
    } else {
      onTextSelect('');
    }
  }, [selectedIndex, onTextSelect]);


  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex space-x-1">
          {/* Editor tools can be added here */}
        </div>
        <div className="text-xs text-slate-500">1,248 words • 12 min read</div>
      </div>
      <div className="p-4 overflow-y-auto flex-1" style={{ minHeight: '400px' }}>
        <div className="prose max-w-none">
          {initialParagraphs.map((p, index) => (
             <p 
              key={index} 
              onClick={() => handleSelect(index)}
              className={`mb-4 cursor-pointer transition-colors rounded p-2 ${selectedIndex === index ? 'bg-amber-100/50 ring-1 ring-amber-300' : 'hover:bg-slate-100'}`}
             >
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorPane;