import React, { useRef } from 'react';
import { CheckIcon } from './icons';

type StageStatus = 'pending' | 'processing' | 'complete';

interface WorkflowStageProps {
  stageNumber: number;
  title: string;
  status: StageStatus;
  isInitiallyOpen: boolean;
  onToggle: (stageNumber: number) => void;
  children: React.ReactNode;
}

const statusConfig = {
  pending: {
    text: 'Pending',
    numberBg: 'bg-slate-200 text-slate-700',
    statusBg: 'bg-slate-100 text-slate-700',
  },
  processing: {
    text: 'Processing',
    numberBg: 'bg-indigo-600 text-white',
    statusBg: 'bg-indigo-600/10 text-indigo-600',
  },
  complete: {
    text: 'Complete',
    numberBg: 'bg-indigo-600 text-white',
    statusBg: 'bg-indigo-600/10 text-indigo-600',
  },
};

const WorkflowStage: React.FC<WorkflowStageProps> = ({
  stageNumber,
  title,
  status,
  isInitiallyOpen,
  onToggle,
  children,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    onToggle(stageNumber);
  };

  const currentStatus = statusConfig[status];
  const stageButtonId = `stage-button-${stageNumber}`;
  const stageContentId = `stage-content-${stageNumber}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl mb-6">
      <h3 className="m-0">
        <button
          type="button"
          id={stageButtonId}
          className="flex items-center justify-between p-5 w-full text-left"
          onClick={handleToggle}
          aria-expanded={isInitiallyOpen}
          aria-controls={stageContentId}
        >
          <span className="flex items-center">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 font-medium transition-colors shrink-0 ${currentStatus.numberBg}`}
              aria-hidden="true"
            >
              {status === 'complete' ? <CheckIcon className="w-4 h-4" /> : stageNumber}
            </span>
            <span className="font-medium text-slate-800 flex items-center">{title}</span>
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full transition-colors ${currentStatus.statusBg}`}
          >
            {currentStatus.text}
          </span>
        </button>
      </h3>
      <div
        ref={contentRef}
        id={stageContentId}
        role="region"
        aria-labelledby={stageButtonId}
        className="transition-all duration-300 overflow-hidden"
        style={{
          maxHeight: isInitiallyOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        }}
      >
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
};

export default WorkflowStage;