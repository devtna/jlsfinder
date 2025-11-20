
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, PencilIcon } from '../components/icons';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
            // Resize logic
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 200;
            const MAX_HEIGHT = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setAvatarUrl(compressedDataUrl);
            setIsProcessing(false);
        };
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsProcessing(true);

    try {
        const updates: any = {};
        
        if (username !== user?.username) updates.username = username;
        if (avatarUrl !== user?.avatarUrl) updates.avatarUrl = avatarUrl;
        
        if (password) {
            if (password !== confirmPassword) {
                setMessage({ text: "Passwords do not match.", type: 'error' });
                setIsProcessing(false);
                return;
            }
            if (password.length < 8) {
                setMessage({ text: "Password must be at least 8 characters.", type: 'error' });
                setIsProcessing(false);
                return;
            }
            updates.password = password;
        }

        if (Object.keys(updates).length > 0) {
            await updateProfile(updates);
            setMessage({ text: "Profile updated successfully!", type: 'success' });
            setPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ text: "No changes to save.", type: 'error' });
        }
    } catch (error) {
        console.error(error);
        setMessage({ text: "Failed to update profile.", type: 'error' });
    } finally {
        setIsProcessing(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Profile Settings</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 shadow-md relative">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                <UserCircleIcon className="h-20 w-20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PencilIcon className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-brand-red text-white p-2 rounded-full shadow-sm">
                        <PencilIcon className="h-4 w-4" />
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400">Click image to upload new photo</p>
            </div>

            {/* Main Info */}
            <div className="grid gap-6 md:grid-cols-2">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input 
                        type="email" 
                        value={user?.email} 
                        disabled 
                        className="w-full px-4 py-2.5 border rounded-lg bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Display name"
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white transition"
                    />
                </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Change Password</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white transition"
                        />
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-end">
                <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="bg-brand-red text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                    {isProcessing ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
