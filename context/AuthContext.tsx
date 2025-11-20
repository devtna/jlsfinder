
import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { useData } from './DataContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { mockUsers } from '../data/mockUsers';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => User | null;
  logout: () => void;
  signUp: (email: string, pass: string, username: string) => User | string;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('authUser', null);
  const { users, addUser, updateUser } = useData();
  const navigate = useNavigate();

  const login = (email: string, pass: string): User | null => {
    // 1. Check against the current users list (from DB or LocalStorage)
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Check if user exists and the provided password matches the stored one.
    if (foundUser && foundUser.password === pass) {
      setUser(foundUser);
      return foundUser;
    }
    
    // 2. Fallback: Check against default Admin credentials
    // This prevents lockout if the DB has other users but is missing the admin account (common during initial setup)
    // We only allow this if the user was NOT found in the DB list (to avoid bypassing a changed password)
    if (!foundUser) {
        const defaultAdmin = mockUsers.find(u => u.role === UserRole.Admin);
        if (defaultAdmin && 
            defaultAdmin.email.toLowerCase() === email.toLowerCase() && 
            defaultAdmin.password === pass) {
            setUser(defaultAdmin);
            return defaultAdmin;
        }
    }
    
    return null;
  };

  const signUp = (email: string, pass: string, username: string): User | string => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return "An account with this email already exists.";
    }

    // In a real app, you would hash the password here.
    const newUser: Omit<User, 'id'> = {
        email,
        password: pass, // Save the password
        role: UserRole.User,
        username,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=BC002D&color=fff`,
        createdAt: new Date().toISOString(),
    };
    
    const createdUser = addUser(newUser);
    setUser(createdUser);
    return createdUser;
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    // Update in DB/Storage
    await updateUser(user.id, data);
    
    // Update local session state
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === UserRole.Admin;

  const value = { user, login, logout, signUp, updateProfile, isAuthenticated, isAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
