
import { Review } from '../types';

export const mockReviews: Review[] = [
  {
    id: '1',
    schoolId: '1',
    userId: '2',
    userName: 'kenji.tanaka@example.com',
    rating: 5,
    comment: 'Excellent teachers and a very friendly atmosphere. I learned so much in just 3 months!',
    createdAt: '2023-11-15T10:00:00Z',
  },
  {
    id: '2',
    schoolId: '1',
    userId: '3',
    userName: 'yuki.sato@example.com',
    rating: 4,
    comment: 'Great location in Shinjuku. The classes are intense but effective.',
    createdAt: '2023-12-01T14:30:00Z',
  },
  {
    id: '3',
    schoolId: '2',
    userId: '2',
    userName: 'kenji.tanaka@example.com',
    rating: 5,
    comment: 'Best school for business Japanese. Highly recommended.',
    createdAt: '2023-10-20T09:15:00Z',
  }
];
