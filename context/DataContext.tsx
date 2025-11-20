
import React, { createContext, useContext, useEffect, useState } from 'react';
import { School, User, UserRole, Review } from '../types';
import { mockUsers } from '../data/mockUsers';
import { mockSchools } from '../data/mockSchools';
import { mockReviews } from '../data/mockReviews';
import useLocalStorage from '../hooks/useLocalStorage';
import { supabase, isCloudEnabled } from '../lib/supabase';

interface DataContextType {
  schools: School[];
  users: User[];
  reviews: Review[];
  addSchool: (school: Omit<School, 'id'>) => void;
  updateSchool: (school: School) => void;
  deleteSchool: (schoolId: string) => void;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  deleteReview: (reviewId: string) => Promise<void>;
  isCloudStorage: boolean;
  generateExportCode: () => string;
  seedDatabase: () => Promise<void>;
  dbError: string | null;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local Storage State (Fallback)
  const [localSchools, setLocalSchools] = useLocalStorage<School[]>('schools', mockSchools);
  const [localUsers, setLocalUsers] = useLocalStorage<User[]>('users', mockUsers);
  const [localReviews, setLocalReviews] = useLocalStorage<Review[]>('reviews', mockReviews);

  // In-Memory State (Source of Truth for the UI)
  const [schools, setSchoolsState] = useState<School[]>(localSchools);
  const [users, setUsersState] = useState<User[]>(localUsers);
  const [reviews, setReviewsState] = useState<Review[]>(localReviews);
  const [dbError, setDbError] = useState<string | null>(null);

  // Fetch Data on Mount
  useEffect(() => {
    const fetchCloudData = async () => {
      if (isCloudEnabled && supabase) {
        try {
          // Fetch Schools
          const { data: schoolData, error: schoolError } = await supabase.from('schools').select('*');
          
          // Fetch Users
          const { data: userData, error: userError } = await supabase.from('users').select('*');
           
           // Fetch Reviews
           const { data: reviewData, error: reviewError } = await supabase.from('reviews').select('*');

           // Update State if data exists
           if (schoolData) setSchoolsState(schoolData as School[]);
           if (userData) setUsersState(userData as User[]);
           if (reviewData) setReviewsState(reviewData as Review[]);

           // Check for any errors (especially missing tables)
           // We prioritize finding any error so we can show the setup instructions in AdminDashboard
           const error = schoolError || userError || reviewError;
           
           if (error) {
               const msg = error.message || JSON.stringify(error);
               console.error("Supabase Data Fetch Error:", msg);
               setDbError(msg);
           } else {
               setDbError(null);
           }

        } catch (err: any) {
          console.error("Supabase connection error", err);
          setDbError(err.message || "Unexpected connection error");
        }
      } else {
        // If no cloud, ensure we are using local storage data
        setSchoolsState(localSchools);
        setUsersState(localUsers);
        setReviewsState(localReviews);
        setDbError(null);
      }
    };

    fetchCloudData();
  }, [isCloudEnabled]);

  // Realtime Subscriptions
  useEffect(() => {
    if (!isCloudEnabled || !supabase) return;

    const channel = supabase.channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'schools' }, (payload) => {
            if (payload.eventType === 'INSERT') {
                setSchoolsState(prev => {
                    if (prev.some(s => s.id === payload.new.id)) return prev;
                    return [...prev, payload.new as School];
                });
            } else if (payload.eventType === 'UPDATE') {
                setSchoolsState(prev => prev.map(s => s.id === payload.new.id ? payload.new as School : s));
            } else if (payload.eventType === 'DELETE') {
                 setSchoolsState(prev => prev.filter(s => s.id !== payload.old.id));
            }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
            if (payload.eventType === 'INSERT') {
                 setUsersState(prev => {
                    if (prev.some(u => u.id === payload.new.id)) return prev;
                    return [...prev, payload.new as User];
                 });
            } else if (payload.eventType === 'UPDATE') {
                setUsersState(prev => prev.map(u => u.id === payload.new.id ? payload.new as User : u));
            } else if (payload.eventType === 'DELETE') {
                setUsersState(prev => prev.filter(u => u.id !== payload.old.id));
            }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (payload) => {
            if (payload.eventType === 'INSERT') {
                 setReviewsState(prev => {
                    if (prev.some(r => r.id === payload.new.id)) return prev;
                    return [...prev, payload.new as Review];
                 });
            } else if (payload.eventType === 'UPDATE') {
                setReviewsState(prev => prev.map(r => r.id === payload.new.id ? payload.new as Review : r));
            } else if (payload.eventType === 'DELETE') {
                setReviewsState(prev => prev.filter(r => r.id !== payload.old.id));
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, [isCloudEnabled]);

  // Sync local changes to state if we are in local mode
  useEffect(() => {
    if (!isCloudEnabled) {
        setSchoolsState(localSchools);
        setUsersState(localUsers);
        setReviewsState(localReviews);
    }
  }, [localSchools, localUsers, localReviews]);


  const addSchool = async (schoolData: Omit<School, 'id'>) => {
    const newSchool: School = {
      id: Date.now().toString(),
      ...schoolData,
    };

    if (isCloudEnabled && supabase) {
       setSchoolsState(prev => [...prev, newSchool]);
       await supabase.from('schools').insert(newSchool);
    } else {
       setLocalSchools(prev => [...prev, newSchool]);
    }
  };

  const updateSchool = async (updatedSchool: School) => {
    if (isCloudEnabled && supabase) {
        setSchoolsState(prev => prev.map(s => s.id === updatedSchool.id ? updatedSchool : s));
        await supabase.from('schools').update(updatedSchool).eq('id', updatedSchool.id);
    } else {
        setLocalSchools(prev => prev.map(s => s.id === updatedSchool.id ? updatedSchool : s));
    }
  };

  const deleteSchool = async (schoolId: string) => {
    if (isCloudEnabled && supabase) {
        setSchoolsState(prev => prev.filter(s => s.id !== schoolId));
        await supabase.from('schools').delete().eq('id', schoolId);
    } else {
        setLocalSchools(prev => prev.filter(s => s.id !== schoolId));
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
        id: Date.now().toString(),
        ...userData,
    };
    
    if (isCloudEnabled && supabase) {
         setUsersState(prev => [...prev, newUser]);
         supabase.from('users').insert(newUser).then();
    } else {
         setLocalUsers(prev => [...prev, newUser]);
    }
    return newUser;
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    if (isCloudEnabled && supabase) {
        setUsersState(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
        await supabase.from('users').update(data).eq('id', userId);
    } else {
        setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    }
  };

  const deleteUser = async (userId: string) => {
     if (isCloudEnabled && supabase) {
        setUsersState(prev => prev.filter(u => u.id !== userId));
        await supabase.from('users').delete().eq('id', userId);
    } else {
        setLocalUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
     await updateUser(userId, { role });
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
      const newReview: Review = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...reviewData
      };

      if (isCloudEnabled && supabase) {
          setReviewsState(prev => [...prev, newReview]);
          await supabase.from('reviews').insert(newReview);
      } else {
          setLocalReviews(prev => [...prev, newReview]);
      }
  };

  const deleteReview = async (reviewId: string) => {
      if (isCloudEnabled && supabase) {
          setReviewsState(prev => prev.filter(r => r.id !== reviewId));
          await supabase.from('reviews').delete().eq('id', reviewId);
      } else {
          setLocalReviews(prev => prev.filter(r => r.id !== reviewId));
      }
  };

  const generateExportCode = () => {
    const data = isCloudEnabled ? schools : localSchools;
    const jsonString = JSON.stringify(data, null, 2);
    return `
import { School, CourseType, Schedule } from '../types';

export const mockSchools: School[] = ${jsonString};
    `.trim();
  };

  const seedDatabase = async () => {
      if (!isCloudEnabled || !supabase) return;
      
      const { error: schoolsError } = await supabase.from('schools').upsert(mockSchools);
      if (schoolsError) console.error("Error seeding schools:", schoolsError);

      const { error: usersError } = await supabase.from('users').upsert(mockUsers);
      if (usersError) console.error("Error seeding users:", usersError);

      const { error: reviewsError } = await supabase.from('reviews').upsert(mockReviews);
      if (reviewsError) console.error("Error seeding reviews:", reviewsError);

      if (!schoolsError && !usersError && !reviewsError) {
          alert("Database seeded successfully! The page will update shortly.");
      } else {
          alert("There were errors seeding the database. Check console for details.");
      }
  };

  return (
    <DataContext.Provider value={{ 
        schools: isCloudEnabled ? schools : localSchools,
        users: isCloudEnabled ? users : localUsers,
        reviews: isCloudEnabled ? reviews : localReviews,
        addSchool, 
        updateSchool, 
        deleteSchool, 
        addUser, 
        updateUser,
        deleteUser, 
        updateUserRole,
        addReview,
        deleteReview,
        isCloudStorage: isCloudEnabled,
        generateExportCode,
        seedDatabase,
        dbError
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
