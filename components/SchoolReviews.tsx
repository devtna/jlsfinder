
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon, TrashIcon, UserCircleIcon, ChevronDownIcon, ChevronUpIcon } from './icons';
import { Link } from 'react-router-dom';

interface SchoolReviewsProps {
  schoolId: string;
}

const SchoolReviews: React.FC<SchoolReviewsProps> = ({ schoolId }) => {
  const { reviews, users, addReview, deleteReview } = useData();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  const schoolReviews = reviews.filter(r => r.schoolId === schoolId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;
    if (rating === 0) {
        alert("Please select a rating.");
        return;
    }

    setIsSubmitting(true);
    
    // We store the current snapshot of the name, but we'll try to display the live name if possible in the list
    await addReview({
        schoolId,
        userId: user.id,
        userName: user.username || user.email,
        rating,
        comment
    });
    
    setRating(0);
    setComment('');
    setIsSubmitting(false);
  };

  const handleDelete = async (reviewId: string) => {
      if (window.confirm('Are you sure you want to delete this review?')) {
          try {
            await deleteReview(reviewId);
          } catch (error) {
            console.error("Error deleting review:", error);
            alert("Failed to delete review.");
          }
      }
  };

  const displayedReviews = isExpanded ? schoolReviews : schoolReviews.slice(0, 5);

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reviews ({schoolReviews.length})</h2>
        </div>

        {/* Review Form */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-semibold text-slate-800 dark:text-white">Write a Review</h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <StarIcon 
                                        className={`h-8 w-8 transition-colors ${
                                            star <= (hoverRating || rating) 
                                            ? 'text-yellow-400' 
                                            : 'text-slate-300 dark:text-slate-600'
                                        }`} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-red"
                            placeholder="Share your experience..."
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-brand-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Post Review'}
                    </button>
                </form>
            ) : (
                <div className="text-center py-6">
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Please log in to leave a review.</p>
                    <Link to="/login" className="inline-block bg-brand-red text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Log In
                    </Link>
                </div>
            )}
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
            {schoolReviews.length > 0 ? (
                <>
                    {displayedReviews.map((review) => {
                        // Check permission: Admin or the user who wrote the review
                        const canDelete = isAdmin || (user && user.id === review.userId);
                        
                        // Find the current user info to display the latest avatar and name
                        const reviewer = users.find(u => u.id === review.userId);
                        const displayName = reviewer?.username || reviewer?.email?.split('@')[0] || review.userName;
                        const avatar = reviewer?.avatarUrl;

                        return (
                            <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 relative group">
                                {/* Delete Button - Visible on Hover for authorized users */}
                                {canDelete && (
                                    <button 
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            e.stopPropagation(); 
                                            handleDelete(review.id); 
                                        }}
                                        className="absolute top-4 right-4 p-2 z-10 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 bg-white dark:bg-slate-800 rounded-full shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                                        aria-label="Delete review"
                                        title="Delete review"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                )}

                                <div className="flex items-start gap-4 mb-2 pr-8">
                                    <div className="flex-shrink-0">
                                        {avatar ? (
                                            <img src={avatar} alt={displayName} className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                                <UserCircleIcon className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">{displayName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-2">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {schoolReviews.length > 5 && (
                        <div className="flex justify-center pt-4">
                             <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-red dark:hover:text-white transition-all shadow-sm"
                            >
                                {isExpanded ? (
                                    <>
                                        <span>Show Less</span>
                                        <ChevronUpIcon className="h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        <span>View All {schoolReviews.length} Reviews</span>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-10 italic">No reviews yet. Be the first to review!</p>
            )}
        </div>
    </div>
  );
};

export default SchoolReviews;
    