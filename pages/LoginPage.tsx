import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname;
  const inputClasses = "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white transition";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const loggedInUser = login(email, password);
    if (loggedInUser) {
      if (loggedInUser.role === UserRole.Admin) {
        navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true });
      } else {
        navigate(from || '/', { replace: true });
      }
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 text-sm font-medium">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red dark:focus:ring-offset-slate-800"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-red hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;