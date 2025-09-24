import React from 'react';

interface AIMessageProps {
  children: React.ReactNode;
}

const AIMessage: React.FC<AIMessageProps> = ({ children }) => {
  return <div className="p-4 bg-slate-100 rounded-lg max-w-prose">{children}</div>;
};

export default AIMessage;
