import React, { useState } from 'react';
import ProjectSidebar from '../components/ProjectSidebar';
import PageHeader from '../components/PageHeader';
import WorkflowStage from '../components/WorkflowStage';
import { BackIcon, BrollIcon, LightningIcon, SparklesIcon, WorkflowIcon } from '../components/icons';

const ProcessingWorkflow: React.FC = () => {
    const [openStage, setOpenStage] = useState(1);

    const handleToggleStage = (stageNumber: number) => {
        setOpenStage(openStage === stageNumber ? -1 : stageNumber);
    };

    const headerActions = [
        { text: 'Run All Steps', icon: <LightningIcon className="h-4 w-4 mr-2" />, onClick: () => console.log('Run all') },
        { text: 'Back to Editor', icon: <BackIcon className="h-4 w-4 mr-2" />, onClick: () => window.history.back() },
    ];
    
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <ProjectSidebar projectName="Tech Review Script" projectStep="Processing Workflow" />
            <main className="flex-1 md:ml-64 pb-24 md:pb-0">
                <PageHeader
                    title="Processing Workflow"
                    tags={[{ text: 'AI-Powered' }, { text: 'Automated Steps' }]}
                    actions={headerActions}
                />

                <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4" aria-hidden="true">
                                <WorkflowIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-slate-800">Automate Your Production</h3>
                                <p className="text-slate-600">Run these AI-powered steps to automatically generate assets for your video.</p>
                            </div>
                        </div>
                    </div>

                    <WorkflowStage
                        stageNumber={1}
                        title="Analyze Script"
                        status="complete"
                        isInitiallyOpen={openStage === 1}
                        onToggle={handleToggleStage}
                    >
                        <div className="prose prose-sm max-w-none text-slate-600">
                            <p>The script has been analyzed to identify key scenes, topics, and keywords. This information will be used in subsequent steps to generate relevant assets.</p>
                            <h4 className="font-medium text-slate-700">Key Topics Identified:</h4>
                            <ul>
                                <li>Innovate X Phone</li>
                                <li>Titanium Frame</li>
                                <li>5x Optical Zoom Camera</li>
                                <li>A17 Pro Chip Performance</li>
                                <li>Battery Life</li>
                                <li>USB-C Port</li>
                            </ul>
                        </div>
                    </WorkflowStage>

                    <WorkflowStage
                        stageNumber={2}
                        title="Generate B-Roll Suggestions"
                        status="processing"
                        isInitiallyOpen={openStage === 2}
                        onToggle={handleToggleStage}
                    >
                        <div className="prose prose-sm max-w-none text-slate-600">
                            <p>AI is generating a list of suggested B-roll shots based on the scenes identified in your script. This helps you plan your filming and ensures you have enough coverage.</p>
                            <a href="/broll" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 no-underline mt-2">
                               <BrollIcon className="h-5 w-5 mr-2" />
                               View B-Roll List
                            </a>
                        </div>
                    </WorkflowStage>

                    <WorkflowStage
                        stageNumber={3}
                        title="Generate Thumbnails"
                        status="pending"
                        isInitiallyOpen={openStage === 3}
                        onToggle={handleToggleStage}
                    >
                         <div className="prose prose-sm max-w-none text-slate-600">
                           <p>Generate multiple high-quality thumbnail options for your video. The AI will use your video title and script content to create eye-catching designs.</p>
                           <a href="/thumbnail" className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 no-underline mt-2">
                               <SparklesIcon className="h-5 w-5 mr-2" />
                               Go to Thumbnail Generator
                           </a>
                        </div>
                    </WorkflowStage>
                </div>
            </main>
        </div>
    );
};

export default ProcessingWorkflow;
