import React from 'react';
import { useData } from '../../context/DataContext';
import Breadcrumb from '../../components/Breadcrumbs/BreadcrumbOriginal';

const SwitchChapter: React.FC = () => {
    const { allChaptersData, chapterData, switchChapter } = useData();

    return (
        <div className="max-w-lg mx-auto px-4 py-8 bg-white rounded-lg shadow">
            <Breadcrumb pageName="Switch Chapter" />
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Select a Chapter</h2>
            <div className="space-y-4">
                {allChaptersData?.map((chapter) => (
                    <button
                        key={chapter.chapterId}
                        onClick={() => switchChapter(chapter.chapterId)}
                        className={`block w-full p-4 rounded-lg border text-left transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            chapterData?.chapterId === chapter.chapterId
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-blue-50'
                        }`}
                    >
                        <div className="font-semibold text-lg">
                            {chapter.chapterName}
                        </div>
                        <div className={`text-sm ${chapterData?.chapterId === chapter.chapterId ? 'text-blue-100' : 'text-gray-500'}`}>
                            {chapter.organisationName}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SwitchChapter;
