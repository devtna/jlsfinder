
export enum CourseType {
  JLPT_N5 = 'JLPT N5',
  JLPT_N4 = 'JLPT N4',
  JLPT_N3 = 'JLPT N3',
  JLPT_N2 = 'JLPT N2',
  JLPT_N1 = 'JLPT N1',
}

export enum Schedule {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
  FullDay = 'Full-day',
}

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string[];
  googleMapsUrl: string;
  lat?: number;
  lng?: number;
  schedule: Schedule[];
  courseTypes: CourseType[];
  tokuteiCourses: string[];
  images: string[];
  description?: string;
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  id: string;
  email: string;
  password?: string; // In a real app, this would be a hash.
  role: UserRole;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
