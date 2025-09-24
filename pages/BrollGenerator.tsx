import React from 'react';
import ProjectSidebar from '../components/ProjectSidebar';
import PageHeader from '../components/PageHeader';
import { BackIcon, BrollIcon, RegenerateIcon } from '../components/icons';

const BrollGenerator: React.FC = () => {
    const headerActions = [
        { text: 'Regenerate All', icon: <RegenerateIcon className="h-4 w-4 mr-2" />, onClick: () => {} },
        { text: 'Back to Editor', icon: <BackIcon className="h-4 w-4 mr-2" />, onClick: () => {}, mobileOnly: true },
    ];

    const generatedBrolls = [
        { scene: 'Intro', shot: 'Close up on the "Innovate X" phone box.', timestamp: '0:05' },
        { scene: 'Unboxing', shot: 'Slow motion shot of lifting the phone from the box.', timestamp: '0:15' },
        { scene: 'Features', shot: 'Extreme close-up on the new camera lens.', timestamp: '0:45' },
        { scene: 'Performance', shot: 'Split screen showing fast app switching.', timestamp: '1:20' },
        { scene: 'Conclusion', shot: 'Shot of the phone on a clean desk next to a laptop.', timestamp: '2:30' },
    ];

    return (
        <div className="flex">
            {/* FIX: Add missing projectId and activePage props to ProjectSidebar */}
            <ProjectSidebar projectName="Tech Review Script" projectStep="B-Roll Generation" projectId={1} activePage="editor" />
            <main className="flex-1 md:ml-64 pb-24 md:pb-0">
                <PageHeader
                    title="B-Roll Generator"
                    tags={[{ text: 'AI-Powered' }, { text: 'Scene-based suggestions' }]}
                    actions={headerActions}
                />
                <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4" aria-hidden="true">
                                <BrollIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-slate-800">Generated B-Roll Shots</h3>
                                <p className="text-slate-600">Based on your script, here are some suggested B-roll shots.</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Scene</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Suggested Shot</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {generatedBrolls.map((broll, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{broll.timestamp}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{broll.scene}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{broll.shot}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BrollGenerator;