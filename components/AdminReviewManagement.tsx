
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Review } from '../types';
import { TrashIcon, StarIcon } from './icons';
import Modal from './Modal';

const AdminReviewManagement: React.FC = () => {
  const { reviews, schools, deleteReview } = useData();
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // Create a map for quick school name lookup
  const schoolMap = schools.reduce((acc, school) => {
    acc[school.id] = school.name;
    return acc;
  }, {} as Record<string, string>);

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
  };
  
  const handleConfirmDelete = async () => {
    if (reviewToDelete) {
      await deleteReview(reviewToDelete.id);
      setReviewToDelete(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manage Reviews</h2>
            <span className="text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
                Total: {reviews.length}
            </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">School</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">User</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Rating</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Comment</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Date</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-800 dark:text-slate-200 font-medium max-w-xs truncate" title={schoolMap[review.schoolId] || 'Unknown School'}>
                    {schoolMap[review.schoolId] || <span className="text-red-500 italic">Unknown School (ID: {review.schoolId})</span>}
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {review.userName.split('@')[0]}
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'}`} />
                        ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 max-w-xs truncate" title={review.comment}>
                    {review.comment}
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(review)} 
                      className="p-2 text-slate-500 dark:text-slate-400 hover:text-brand-red dark:hover:text-red-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                      aria-label="Delete review"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                  <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                          No reviews found.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!reviewToDelete} onClose={() => setReviewToDelete(null)} title="Confirm Deletion">
        {reviewToDelete && (
            <div>
                <p className="text-slate-600 dark:text-slate-300">Are you sure you want to delete this review by <b>{reviewToDelete.userName}</b>?</p>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg mt-4 mb-6 text-sm border border-slate-200 dark:border-slate-600">
                    <p className="italic text-slate-600 dark:text-slate-300">"{reviewToDelete.comment}"</p>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => setReviewToDelete(null)} className="px-4 py-2 rounded-lg font-semibold bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
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

export default AdminReviewManagement;
