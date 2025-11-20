
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { User, UserRole } from '../types';
import { TrashIcon, UserCircleIcon } from './icons';
import Modal from './Modal';

const AdminUserManagement: React.FC = () => {
  const { users, deleteUser, updateUserRole } = useData();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };
  
  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUserRole(userId, role);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Manage Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">User</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Email</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Role</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Joined On</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.username} className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-600" />
                          ) : (
                              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                  <UserCircleIcon className="h-5 w-5" />
                              </div>
                          )}
                          <span className="font-medium text-slate-800 dark:text-slate-200">{user.username || 'No Name'}</span>
                      </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{user.email}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="p-1.5 border rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 text-sm focus:ring-2 focus:ring-brand-red focus:border-brand-red"
                      disabled={user.role === UserRole.Admin && users.filter(u => u.role === UserRole.Admin).length <= 1}
                    >
                      <option value={UserRole.Admin}>Admin</option>
                      <option value={UserRole.User}>User</option>
                    </select>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(user)} 
                      className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-red-500 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:cursor-not-allowed rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                      aria-label="Delete"
                      disabled={user.role === UserRole.Admin}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
              <p className="text-center py-8 text-slate-500 dark:text-slate-400">No users found.</p>
          )}
        </div>
      </div>

      <Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Confirm Deletion">
        {userToDelete && (
            <div>
                <p className="text-slate-600 dark:text-slate-300">Are you sure you want to delete the user "{userToDelete.username || userToDelete.email}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={() => setUserToDelete(null)} className="px-4 py-2 rounded-lg font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                      Cancel
                    </button>
                    <button type="button" onClick={handleConfirmDelete} className="bg-brand-red text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700">
                      Delete
                    </button>
                </div>
            </div>
        )}
      </Modal>
    </>
  );
};

export default AdminUserManagement;
