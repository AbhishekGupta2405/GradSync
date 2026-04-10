import { User } from '@/contexts/AuthContext';

export const mockAlumni: User[] = [
  {
    id: '1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@google.com',
    batchYear: '2020',
    branch: 'Computer Science Engineering',
    rollNumber: '20CS001',
    currentCompany: 'Google',
    position: 'Senior Software Engineer',
    location: 'San Francisco, USA',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    role: 'alumni',
    isVerified: true,
    joinedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    firstName: 'Rahul',
    lastName: 'Patel',
    email: 'rahul.patel@microsoft.com',
    batchYear: '2019',
    branch: 'Computer Science Engineering',
    rollNumber: '19CS015',
    currentCompany: 'Microsoft',
    position: 'Product Manager',
    location: 'Seattle, USA',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    role: 'alumni',
    isVerified: true,
    joinedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    firstName: 'Anita',
    lastName: 'Desai',
    email: 'anita.desai@goldmansachs.com',
    batchYear: '2018',
    branch: 'Electronics & Communication Engineering',
    rollNumber: '18EC023',
    currentCompany: 'Goldman Sachs',
    position: 'Vice President',
    location: 'New York, USA',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    role: 'alumni',
    isVerified: true,
    joinedAt: new Date('2024-02-01')
  }
]
