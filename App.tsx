
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SchoolDetailPage from './pages/SchoolDetailPage';
import SavedSchoolsPage from './pages/SavedSchoolsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <DataProvider>
          <AuthProvider>
            <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-700 dark:text-slate-300 antialiased">
              <Header />
              <main className="container mx-auto p-4 md:p-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/school/:id" element={<SchoolDetailPage />} />
                  <Route 
                    path="/saved" 
                    element={
                      <ProtectedRoute allowAdmin={false}>
                        <SavedSchoolsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute allowAdmin={true}>
                        <AdminPage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </AuthProvider>
        </DataProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;