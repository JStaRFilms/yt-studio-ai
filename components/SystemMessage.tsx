import React from 'react';

interface SystemMessageProps {
  text: string;
  type: 'info' | 'error';
}

const SystemMessage: React.FC<SystemMessageProps> = ({ text, type }) => {
  const baseClasses = "text-center my-2 py-2";
  const typeClasses = {
    info: "text-xs text-blue-700 px-3 py-1 bg-blue-100/70 rounded-full",
    error: "text-xs text-red-700 px-3 py-1 bg-red-100/70 rounded-full",
  };

  return (
    <div className={baseClasses}>
      <span className={typeClasses[type]}>
        {text}
      </span>
    </div>
  );
};

export default SystemMessage;
