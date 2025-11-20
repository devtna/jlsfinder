
import { User, UserRole } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'adminsakura@gmail.com',
    password: 'Sakura123',
    role: UserRole.Admin,
    username: 'Admin Sakura',
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin+Sakura&background=BC002D&color=fff',
    createdAt: '2023-10-26T10:00:00Z',
  },
  {
    id: '2',
    email: 'kenji.tanaka@example.com',
    password: 'password123',
    role: UserRole.User,
    username: 'Kenji T.',
    createdAt: '2023-10-25T11:30:00Z',
  },
  {
    id: '3',
    email: 'yuki.sato@example.com',
    password: 'password123',
    role: UserRole.User,
    username: 'Yuki Sato',
    createdAt: '2023-10-24T15:20:00Z',
  },
];
