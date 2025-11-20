
import React, { useState, useCallback, useMemo } from 'react';
import SchoolCard from '../components/SchoolCard';
import SearchBar from '../components/SearchBar';
import useLocalStorage from '../hooks/useLocalStorage';
import { useData } from '../context/DataContext';
import { SearchIcon } from '../components/icons';

const HomePage: React.FC = () => {
  const { schools } = useData();
  const [savedSchoolIds, setSavedSchoolIds] = useLocalStorage<string[]>('savedSchoolIds', []);
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: '',
    courseType: '',
    schedule: '',
  });

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const filteredSchools = useMemo(() => {
    let result = schools;

    if (filters.searchTerm) {
      const lowercasedTerm = filters.searchTerm.toLowerCase();
      result = result.filter(school =>
        school.name.toLowerCase().includes(lowercasedTerm) ||
        (school.tokuteiCourses || []).some(c => c.toLowerCase().includes(lowercasedTerm))
      );
    }
    if (filters.location) {
      result = result.filter(school => school.city === filters.location);
    }
    if (filters.courseType) {
      result = result.filter(school => school.courseTypes.includes(filters.courseType as any));
    }
    if (filters.schedule) {
      result = result.filter(school => school.schedule.includes(filters.schedule as any));
    }

    return result;
  }, [schools, filters]);

  const handleToggleSave = (schoolId: string) => {
    setSavedSchoolIds(prev =>
      prev.includes(schoolId)
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  return (
    <div>
      <SearchBar onFilterChange={handleFilterChange} />
      {filteredSchools.length > 0 ? (
        <>
          <div className="mb-4 text-slate-600 dark:text-slate-400 font-medium">
            Found {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchools.map(school => (
              <SchoolCard 
                key={school.id} 
                school={school} 
                isSaved={savedSchoolIds.includes(school.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
            <div className="mx-auto h-16 w-16 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full">
                <SearchIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">No schools found</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;