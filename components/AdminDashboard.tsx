
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { CogIcon, UsersIcon, BookOpenIcon, MapIcon, StarIcon } from './icons';

const AdminDashboard: React.FC = () => {
  const { schools, users, reviews, isCloudStorage, generateExportCode, seedDatabase, dbError } = useData();
  const { theme } = useTheme();
  const [copySuccess, setCopySuccess] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const totalSchools = schools.length;
  const totalUsers = users.length;
  const totalReviews = reviews.length;

  const schoolsByCity = schools.reduce((acc, school) => {
    acc[school.city] = (acc[school.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(schoolsByCity).map(city => ({
    name: city,
    schools: schoolsByCity[city],
  }));

  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334152' : '#e2e8f0';
  const tooltipBackgroundColor = theme === 'dark' ? '#1e293b' : '#ffffff';
  const tooltipBorderColor = theme === 'dark' ? '#334152' : '#e2e8f0';

  const handleCopyExport = () => {
      const code = generateExportCode();
      navigator.clipboard.writeText(code).then(() => {
          setCopySuccess('Code copied! Paste into data/mockSchools.ts');
          setTimeout(() => setCopySuccess(''), 3000);
      });
  };

  const handleSeed = async () => {
      if (window.confirm("This will populate the database with default data. Continue?")) {
          setIsSeeding(true);
          await seedDatabase();
          setIsSeeding(false);
      }
  };

  // Detect if the error is due to missing tables in Supabase
  const isTableMissing = dbError ? (
    (dbError.includes("relation") && dbError.includes("does not exist")) ||
    dbError.includes("Could not find the table") ||
    dbError.includes("schema cache")
  ) : false;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h2>

      {/* Database Error & Setup Helper */}
      {isCloudStorage && (dbError || isTableMissing) && (
        <div className="p-6 rounded-xl border bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
           <h3 className="text-lg font-bold text-red-800 dark:text-red-100 flex items-center gap-2">
             <span className="text-xl">⚠️</span> Database Setup Required
           </h3>
           <p className="mt-2 text-red-700 dark:text-red-200">
             {isTableMissing
               ? "The tables 'schools', 'users', or 'reviews' do not exist in your Supabase project yet." 
               : `Error: ${dbError}`}
           </p>
           
           <div className="mt-4">
             <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
               Go to Supabase SQL Editor and run this code to fix it:
             </p>
             <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto select-all whitespace-pre-wrap">
{`-- Setup Tables and Policies (Safe to run multiple times)
-- Run this in the Supabase SQL Editor

-- 1. Schools Table
create table if not exists public.schools (
  id text primary key,
  name text,
  address text,
  city text,
  phone text[],
  "googleMapsUrl" text,
  lat float8,
  lng float8,
  schedule text[],
  "courseTypes" text[],
  "tokuteiCourses" text[],
  images text[],
  description text
);

-- 2. Users Table
create table if not exists public.users (
  id text primary key,
  email text,
  password text,
  role text,
  username text,
  "avatarUrl" text,
  "createdAt" text
);

-- 3. Reviews Table
create table if not exists public.reviews (
  id text primary key,
  "schoolId" text,
  "userId" text,
  "userName" text,
  rating int,
  comment text,
  "createdAt" text
);

-- 4. Enable RLS (Row Level Security)
-- These statements are safe even if RLS is already enabled
alter table public.schools enable row level security;
alter table public.users enable row level security;
alter table public.reviews enable row level security;

-- 5. Create Policies (Drop existing to avoid conflicts)
drop policy if exists "Enable all access for schools" on public.schools;
create policy "Enable all access for schools" on public.schools for all using (true) with check (true);

drop policy if exists "Enable all access for users" on public.users;
create policy "Enable all access for users" on public.users for all using (true) with check (true);

drop policy if exists "Enable all access for reviews" on public.reviews;
create policy "Enable all access for reviews" on public.reviews for all using (true) with check (true);`}
             </pre>
           </div>
        </div>
      )}

      {/* Storage Status Banner */}
      <div className={`p-6 rounded-xl border ${isCloudStorage ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'}`}>
        <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${isCloudStorage ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-100' : 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-100'}`}>
                 {isCloudStorage ? <MapIcon className="h-6 w-6" /> : <CogIcon className="h-6 w-6" />}
            </div>
            <div className="flex-1">
                <h3 className={`text-lg font-bold ${isCloudStorage ? 'text-green-800 dark:text-green-100' : 'text-amber-800 dark:text-amber-100'}`}>
                    Storage Mode: {isCloudStorage ? 'Cloud Database (Live)' : 'Local Browser Storage'}
                </h3>
                <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
                    {isCloudStorage 
                        ? "Your application is connected to Supabase. Changes are synced in real-time to all users." 
                        : "You are currently editing data locally. Visitors on Netlify cannot see these changes because they don't have access to your browser's storage."}
                </p>
                
                {isCloudStorage && !dbError && (
                    <div className="mt-4">
                         <p className="text-sm text-green-800 dark:text-green-100 mb-2">
                             {schools.length === 0 ? "Your database is connected but empty." : "Database connected successfully."}
                         </p>
                         <button 
                            onClick={handleSeed}
                            disabled={isSeeding}
                            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <CogIcon className="h-4 w-4" />
                            {isSeeding ? 'Seeding...' : 'Seed Database with Default Data'}
                        </button>
                    </div>
                )}

                {!isCloudStorage && (
                    <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white mb-2">To update the live website:</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={handleCopyExport}
                                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                                <BookOpenIcon className="h-4 w-4" />
                                Copy Data for Production
                            </button>
                            {copySuccess && <span className="text-green-600 text-sm flex items-center font-medium">{copySuccess}</span>}
                        </div>
                        <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
                            Click above, then paste the code into your project's <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">data/mockSchools.ts</code> file and redeploy.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 dark:text-slate-400 font-semibold">Total Schools</h3>
            <CogIcon className="h-6 w-6 text-slate-400 dark:text-slate-500"/>
          </div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">{totalSchools}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 dark:text-slate-400 font-semibold">Total Users</h3>
            <UsersIcon className="h-6 w-6 text-slate-400 dark:text-slate-500"/>
          </div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-500 dark:text-slate-400 font-semibold">Total Reviews</h3>
            <StarIcon className="h-6 w-6 text-slate-400 dark:text-slate-500"/>
          </div>
          <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">{totalReviews}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Schools per City</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
              <XAxis dataKey="name" stroke={axisColor} fontSize={12} />
              <YAxis allowDecimals={false} stroke={axisColor} fontSize={12} />
              <Tooltip 
                cursor={{ fill: theme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(241, 245, 249, 0.5)' }}
                contentStyle={{ 
                    backgroundColor: tooltipBackgroundColor, 
                    borderColor: tooltipBorderColor, 
                    color: axisColor,
                    borderRadius: '0.75rem'
                }}
              />
              <Legend wrapperStyle={{ color: axisColor, fontSize: '14px' }} />
              <Bar dataKey="schools" fill="#BC002D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
