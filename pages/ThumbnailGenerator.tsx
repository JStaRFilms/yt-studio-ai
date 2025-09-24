import React from 'react';
import ProjectSidebar from '../components/ProjectSidebar';
import PageHeader from '../components/PageHeader';
import { BackIcon, RegenerateIcon, SparklesIcon } from '../components/icons';

const ThumbnailGenerator: React.FC = () => {
    const headerActions = [
        { text: 'Regenerate', icon: <RegenerateIcon className="h-4 w-4 mr-2" />, onClick: () => {} },
        { text: 'Back to Workflow', icon: <BackIcon className="h-4 w-4 mr-2" />, onClick: () => {}, mobileOnly: true },
    ];
    
    const thumbnails = [
        { src: 'https://picsum.photos/seed/thumb1/400/225', prompt: 'Close up of the new phone with a vibrant background.' },
        { src: 'https://picsum.photos/seed/thumb2/400/225', prompt: 'A surprising facial expression holding the phone.' },
        { src: 'https://picsum.photos/seed/thumb3/400/225', prompt: 'Minimalist thumbnail with the phone and a bold title.' },
        { src: 'https://picsum.photos/seed/thumb4/400/225', prompt: 'Dynamic shot of the phone in action.' },
    ];

    return (
        <div className="flex">
            <ProjectSidebar projectName="Tech Review Script" projectStep="Thumbnail Generation" />
            <main className="flex-1 md:ml-64 pb-24 md:pb-0">
                <PageHeader
                    title="Thumbnail Generator"
                    tags={[{ text: 'AI-Powered' }, { text: 'Multiple variations' }]}
                    actions={headerActions}
                />
                <div className="p-4 sm:p-6 max-w-5xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="flex items-start sm:items-center mb-6 flex-col sm:flex-row">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mb-3 sm:mb-0" aria-hidden="true">
                                <SparklesIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-medium text-slate-800">Generated Thumbnails</h3>
                                <p className="text-slate-600">Here are some AI-generated thumbnails based on your video title and script. Click to select your favorite.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {thumbnails.map((thumb, index) => (
                                <div key={index} className="group cursor-pointer">
                                    <img src={thumb.src} alt={thumb.prompt} className="rounded-lg w-full aspect-video object-cover group-hover:ring-4 group-hover:ring-indigo-500 transition" />
                                    <p className="text-xs text-slate-500 mt-2">{thumb.prompt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ThumbnailGenerator;
