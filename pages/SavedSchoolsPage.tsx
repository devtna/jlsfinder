import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import SchoolCard from '../components/SchoolCard';
import { BookmarkIcon } from '../components/icons';
import { useData } from '../context/DataContext';

const SavedSchoolsPage: React.FC = () => {
  const [savedSchoolIds, setSavedSchoolIds] = useLocalStorage<string[]>('savedSchoolIds', []);
  const { schools } = useData();
  const savedSchools = schools.filter(school => savedSchoolIds.includes(school.id));

  const handleToggleSave = (schoolId: string) => {
    setSavedSchoolIds(prev =>
      prev.filter(id => id !== schoolId)
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <BookmarkIcon className="h-8 w-8 text-brand-red" />
          Saved Schools
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Your bookmarked schools for future reference.</p>
      </div>
      
      {savedSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedSchools.map(school => (
            <SchoolCard
              key={school.id}
              school={school}
              isSaved={true}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
            <div className="mx-auto h-16 w-16 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full">
                <BookmarkIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">No saved schools yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Browse schools and click the bookmark icon to save them here.</p>
        </div>
      )}
    </div>
  );
};

export default SavedSchoolsPage;