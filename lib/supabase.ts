import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in various environments (Vite, CRA, etc.)
const getEnv = (key: string) => {
  // Check for Vite's import.meta.env
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // Ignore errors accessing import.meta
  }

  // Check for standard process.env
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }

  return undefined;
};

// Use environment variables if available, otherwise fall back to the provided credentials
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://pbyktnkgyukwgjnfpsut.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBieWt0bmtneXVrd2dqbmZwc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTg2ODksImV4cCI6MjA3OTE5NDY4OX0.lclSbQRN9M5mcSP9DK8Fas2oagkHaO8rMN4QsgY4O50';

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const isCloudEnabled = !!supabase;
