
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookmarkIcon, PhoneIcon, ChevronLeftIcon, LocationMarkerIcon, ClockIcon, BookOpenIcon, StarIcon, MapIcon } from '../components/icons';
import useLocalStorage from '../hooks/useLocalStorage';
import { useData } from '../context/DataContext';
import SchoolMap from '../components/SchoolMap';
import SchoolReviews from '../components/SchoolReviews';

const SchoolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { schools, reviews } = useData();
  const school = schools.find(s => s.id === id);
  const [savedSchoolIds, setSavedSchoolIds] = useLocalStorage<string[]>('savedSchoolIds', []);

  if (!school) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold dark:text-white">School not found</h2>
        <Link to="/" className="text-brand-red hover:underline mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  const isSaved = savedSchoolIds.includes(school.id);
  const schoolReviews = reviews.filter(r => r.schoolId === school.id);
  const averageRating = schoolReviews.length > 0 
      ? schoolReviews.reduce((acc, r) => acc + r.rating, 0) / schoolReviews.length 
      : 0;

  const handleToggleSave = () => {
    setSavedSchoolIds(prev =>
      prev.includes(school.id)
        ? prev.filter(sid => sid !== school.id)
        : [...prev, school.id]
    );
  };

  const allCourses = [...school.courseTypes, ...(school.tokuteiCourses || [])];
  
  // Coordinate Extraction Logic:
  // 1. Try explicit database fields
  let displayLat: number | undefined = school.lat;
  let displayLng: number | undefined = school.lng;

  // 2. If missing, try regex extraction from Google Maps URL
  if (!displayLat || !displayLng) {
      // Match @lat,lng pattern common in Google Maps URLs
      const matchAt = school.googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      // Match ?q=lat,lng or &ll=lat,lng pattern
      const matchQ = school.googleMapsUrl.match(/[?&](?:q|ll|center)=(-?\d+\.\d+),(-?\d+\.\d+)/);

      if (matchAt) {
          displayLat = parseFloat(matchAt[1]);
          displayLng = parseFloat(matchAt[2]);
      } else if (matchQ) {
          displayLat = parseFloat(matchQ[1]);
          displayLng = parseFloat(matchQ[2]);
      }
  }
  
  // Determine if we can render the interactive Leaflet map
  const hasCoordinates = displayLat !== undefined && displayLng !== undefined && !isNaN(displayLat) && !isNaN(displayLng) && displayLat !== 0 && displayLng !== 0;
  
  // Logic for fallback Iframe
  const isEmbedUrl = school.googleMapsUrl.includes('/embed');
  // Construct a robust search query: "Address, City"
  const addressQuery = encodeURIComponent(`${school.address}${school.city ? `, ${school.city}` : ''}`);
  const iframeSrc = isEmbedUrl 
    ? school.googleMapsUrl 
    : `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden mb-12 border border-slate-100 dark:border-slate-700">
      <div className="relative">
        <img src={school.images[0]} alt={school.name} className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">{school.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-slate-200">
                         <p className="flex items-center gap-1.5 text-sm md:text-base font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                           <LocationMarkerIcon className="h-4 w-4 text-brand-red"/>
                           {school.address}
                         </p>
                         {schoolReviews.length > 0 && (
                             <div className="flex items-center gap-1 text-yellow-400 text-sm md:text-base font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                 <StarIcon className="h-4 w-4 fill-yellow-400" />
                                 <span>{averageRating.toFixed(1)}</span>
                                 <span className="text-slate-300 font-normal ml-1">({schoolReviews.length} reviews)</span>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
        <Link to="/" className="absolute top-4 left-4 h-10 w-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-all border border-white/20 group">
            <ChevronLeftIcon className="h-6 w-6 text-white group-hover:-translate-x-0.5 transition-transform"/>
        </Link>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 border-l-4 border-brand-red pl-3">About the School</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{school.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><LocationMarkerIcon className="h-6 w-6 text-brand-red"/>Location</h3>
            <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0 shadow-md bg-slate-100 dark:bg-slate-700 group">
                {hasCoordinates ? (
                  <SchoolMap lat={displayLat!} lng={displayLng!} popupText={school.name} />
                ) : (
                  <iframe
                    src={iframeSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="School Location"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  ></iframe>
                )}
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
                <a 
                    href={school.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-red-700 hover:underline transition-colors"
                >
                    <MapIcon className="h-4 w-4" />
                    <span>Open in Google Maps</span>
                </a>
                {!hasCoordinates && (
                    <span className="text-xs text-slate-400 flex items-center">
                       Note: Map preview is approximate based on address.
                    </span>
                )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <SchoolReviews schoolId={school.id} />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <button 
              onClick={handleToggleSave} 
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 font-bold transition-all duration-200 text-base shadow-sm hover:shadow-md active:scale-[0.98] ${
                  isSaved 
                  ? 'bg-brand-red text-white border-brand-red' 
                  : 'bg-white dark:bg-transparent text-brand-red border-brand-red hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
          >
              <BookmarkIcon className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved to Favorites' : 'Save to Favorites'}</span>
          </button>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><BookOpenIcon className="h-5 w-5 text-brand-red"/>Courses</h3>
              <div className="flex flex-wrap gap-2">
                  {allCourses.map(type => (
                      <span key={type} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">{type}</span>
                  ))}
              </div>

              <hr className="my-6 border-slate-200 dark:border-slate-700/50"/>

              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><ClockIcon className="h-5 w-5 text-brand-red"/>Schedules</h3>
              <div className="flex flex-wrap gap-2">
                  {school.schedule.map(time => (
                      <span key={time} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">{time}</span>
                  ))}
              </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><PhoneIcon className="h-5 w-5 text-brand-red"/>Contact</h3>
            <div className="space-y-3">
                {school.phone.map((p, index) => (
                    <a key={index} href={`tel:${p}`} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-brand-red dark:hover:border-brand-red transition-all group shadow-sm hover:shadow-md">
                        <div className="bg-slate-100 dark:bg-slate-600 p-2 rounded-lg group-hover:bg-red-50 dark:group-hover:bg-red-900/30 transition-colors">
                            <PhoneIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-brand-red" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-brand-red transition-colors">{p}</span>
                    </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetailPage;
