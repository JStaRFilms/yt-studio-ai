import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 text-white rounded-lg shadow-xl w-full max-w-md" 
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white" id="modal-title">{title}</h2>
          <div className="mt-2 text-sm text-slate-300">
            {children}
          </div>
        </div>
        <div className="bg-slate-900/50 px-6 py-4 text-right rounded-b-lg">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
