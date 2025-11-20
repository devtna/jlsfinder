
import React from 'react';
import { Link } from 'react-router-dom';
import { School } from '../types';
import { BookmarkIcon, LocationMarkerIcon } from './icons';

interface SchoolCardProps {
  school: School;
  isSaved: boolean;
  onToggleSave: (schoolId: string) => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, isSaved, onToggleSave }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave(school.id);
  };
  
  const allCourses = [...school.courseTypes, ...(school.tokuteiCourses || [])];

  return (
    <Link 
      to={`/school/${school.id}`} 
      className="group block bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-slate-200/80 dark:hover:shadow-black/40 transform transition-all duration-300 hover:-translate-y-1.5 overflow-hidden h-full flex flex-col border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
    >
      <div className="relative h-52 shrink-0 overflow-hidden">
        <img 
          src={school.images[0]} 
          alt={school.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
        
        <button 
          onClick={handleSaveClick} 
          className={`absolute top-3 right-3 h-10 w-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red active:scale-90 ${
            isSaved 
              ? 'bg-brand-red text-white scale-105 ring-2 ring-white/20' 
              : 'bg-white/90 backdrop-blur-sm hover:bg-white text-slate-400 hover:text-brand-red hover:scale-110'
          }`}
          aria-label={isSaved ? 'Unsave school' : 'Save school'}
          title={isSaved ? 'Remove from favorites' : 'Add to favorites'}
        >
          <BookmarkIcon className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-brand-red transition-colors mb-2 line-clamp-1 leading-tight">{school.name}</h3>
        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
            <LocationMarkerIcon className="h-4 w-4 mr-1.5 flex-shrink-0 text-slate-400 dark:text-slate-500"/>
            <span className="truncate">{school.city}, {school.address}</span>
        </div>
        
        <div className="mt-auto flex flex-wrap gap-2">
          {allCourses.slice(0, 3).map(type => (
            <span key={type} className="text-xs font-medium bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-600/50">{type}</span>
          ))}
          {allCourses.length > 3 && (
            <span className="text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700">+{allCourses.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SchoolCard;
