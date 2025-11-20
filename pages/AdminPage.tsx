
import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import AdminSchoolManagement from '../components/AdminSchoolManagement';
import AdminUserManagement from '../components/AdminUserManagement';
import AdminReviewManagement from '../components/AdminReviewManagement';
import { ChartBarIcon, CogIcon, UsersIcon, StarIcon } from '../components/icons';

type AdminView = 'dashboard' | 'schools' | 'users' | 'reviews';

const AdminPage: React.FC = () => {
  const [view, setView] = useState<AdminView>('dashboard');

  const navButtonClasses = (v: AdminView) => 
    `flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-colors font-semibold text-sm ${
        view === v 
        ? 'bg-brand-red text-white' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="md:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 sticky top-[90px]">
            <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-white px-2">Admin Panel</h2>
            <nav className="space-y-1">
                <button onClick={() => setView('dashboard')} className={navButtonClasses('dashboard')}>
                    <ChartBarIcon className="h-5 w-5" />
                    <span>Dashboard</span>
                </button>
                <button onClick={() => setView('schools')} className={navButtonClasses('schools')}>
                    <CogIcon className="h-5 w-5" />
                    <span>Manage Schools</span>
                </button>
                <button onClick={() => setView('users')} className={navButtonClasses('users')}>
                    <UsersIcon className="h-5 w-5" />
                    <span>Manage Users</span>
                </button>
                <button onClick={() => setView('reviews')} className={navButtonClasses('reviews')}>
                    <StarIcon className="h-5 w-5" />
                    <span>Manage Reviews</span>
                </button>
            </nav>
        </div>
      </aside>
      <div className="flex-1">
        {view === 'dashboard' && <AdminDashboard />}
        {view === 'schools' && <AdminSchoolManagement />}
        {view === 'users' && <AdminUserManagement />}
        {view === 'reviews' && <AdminReviewManagement />}
      </div>
    </div>
  );
};

export default AdminPage;
