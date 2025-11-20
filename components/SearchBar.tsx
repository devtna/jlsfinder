
import React, { useState, useEffect, useRef } from 'react';
import { CourseType, Schedule } from '../types';
import { useData } from '../context/DataContext';
import { SearchIcon, LocationMarkerIcon, ClockIcon, BookOpenIcon, XIcon, MenuIcon } from './icons';

interface SearchBarProps {
  onFilterChange: (filters: {
    searchTerm: string;
    location: string;
    courseType: string;
    schedule: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [courseType, setCourseType] = useState('');
  const [schedule, setSchedule] = useState('');
  const { schools } = useData();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const uniqueLocations = React.useMemo(() => Array.from(new Set(schools.map(s => s.city))), [schools]);

  useEffect(() => {
    onFilterChange({ searchTerm, location, courseType, schedule });
  }, [searchTerm, location, courseType, schedule, onFilterChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasActiveFilters = searchTerm || location || courseType || schedule;
  const activeFilterCount = [location, courseType, schedule].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setCourseType('');
    setSchedule('');
    setIsExpanded(false);
  };

  const iconClasses = "absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500 pointer-events-none";
  const inputClasses = "w-full pl-11 pr-4 py-2.5 border-0 rounded-xl focus:ring-2 focus:ring-brand-red bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition appearance-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600";
  
  const FilterSelects = () => (
      <>
        <div className="relative w-full group">
          <LocationMarkerIcon className={iconClasses} />
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            className={inputClasses}
            aria-label="Filter by location"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>
        <div className="relative w-full group">
          <BookOpenIcon className={iconClasses} />
          <select 
            value={courseType} 
            onChange={(e) => setCourseType(e.target.value)} 
            className={inputClasses}
            aria-label="Filter by course type"
          >
            <option value="">All Courses</option>
            {Object.values(CourseType).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="relative w-full group">
          <ClockIcon className={iconClasses} />
          <select 
            value={schedule} 
            onChange={(e) => setSchedule(e.target.value)} 
            className={inputClasses}
            aria-label="Filter by schedule"
          >
            <option value="">All Schedules</option>
            {Object.values(Schedule).map(time => <option key={time} value={time}>{time}</option>)}
          </select>
        </div>
      </>
  );

  return (
    <div className="sticky top-20 z-30 mb-8 transition-all duration-300 ease-in-out" ref={containerRef}>
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg p-4 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-white/20 dark:border-white/10 relative ring-1 ring-black/5">
            
            {/* Top Bar: Search + Toggle */}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <SearchIcon className={iconClasses} />
                  <input
                    type="text"
                    placeholder="Search school or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-10 py-2.5 border-0 rounded-xl focus:ring-2 focus:ring-brand-red bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition appearance-none shadow-inner"
                  />
                  {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        aria-label="Clear search"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Desktop Filters (Visible lg+) */}
                <div className="hidden lg:flex gap-3 flex-[2]">
                    <FilterSelects />
                </div>

                {/* Mobile Toggle Button (Visible < lg) */}
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className={`lg:hidden flex items-center justify-center h-[44px] w-[44px] rounded-xl border transition-all duration-200 relative flex-shrink-0 ${
                        isExpanded || activeFilterCount > 0 
                        ? 'bg-brand-red text-white border-brand-red shadow-md shadow-red-200 dark:shadow-none' 
                        : 'bg-slate-100 border-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                    aria-label="Toggle filters"
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    {!isExpanded && activeFilterCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Clear All Button (Visible if filters active on desktop) */}
                {hasActiveFilters && (
                    <button 
                        onClick={clearFilters}
                        className="hidden lg:flex items-center justify-center h-[44px] w-[44px] bg-slate-100 hover:bg-red-100 dark:bg-slate-700 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-xl transition-colors"
                        title="Clear all filters"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Mobile Collapsible Dropdown */}
            <div 
              className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
                 <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                     <div className="flex justify-between items-center px-1">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filters</p>
                        {hasActiveFilters && (
                             <button 
                                onClick={clearFilters}
                                className="text-xs font-bold text-brand-red hover:text-red-700 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                     </div>
                     <div className="grid gap-3">
                        <FilterSelects />
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default SearchBar;
