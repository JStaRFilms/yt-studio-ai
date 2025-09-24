import React from 'react';

interface UserMessageProps {
  children: React.ReactNode;
}

const UserMessage: React.FC<UserMessageProps> = ({ children }) => {
  return <div className="p-4 bg-indigo-600 text-white rounded-lg max-w-prose ml-auto">{children}</div>;
};

export default UserMessage;
