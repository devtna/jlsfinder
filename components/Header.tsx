
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookmarkIcon, UserCircleIcon } from './icons';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  const navLinkClasses = (path: string) => 
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-slate-100 dark:bg-slate-800 text-brand-red'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <nav className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-3xl">🏫</span>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">
            School Finder
          </h1>
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <Link to="/" className={navLinkClasses('/')}>
            <HomeIcon className="h-5 w-5" />
            <span className="hidden md:inline">Home</span>
          </Link>
          
          {!isAdmin && (
            <Link to="/saved" className={navLinkClasses('/saved')}>
              <BookmarkIcon className="h-5 w-5" />
              <span className="hidden md:inline">Saved</span>
            </Link>
          )}
          
          {isAdmin && (
            <Link to="/admin" className={navLinkClasses('/admin')}>
              <UserCircleIcon className="h-5 w-5" />
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}
          
          <ThemeToggle />

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 mr-2 group" title="Edit Profile">
                 {user?.avatarUrl ? (
                     <img src={user.avatarUrl} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-600 group-hover:border-brand-red transition-colors" />
                 ) : (
                     <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:text-brand-red transition-colors">
                        <UserCircleIcon className="h-6 w-6" />
                     </div>
                 )}
              </Link>
              <button onClick={logout} className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-red hover:bg-red-700 transition-colors">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
