import { UserAccount } from '../types';

export const DEMO_ACCOUNTS: Record<'student' | 'instructor' | 'admin', UserAccount> = {
  student: {
    id: 'usr-std-001',
    role: 'student',
    name: 'Adeola Williams',
    email: 'adeola.w@ojismedia.student',
    phone: '+234 802 918 3491',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-STD-2026-081',
    joinedDate: 'March 2026',
    status: 'Active',
    studentDetails: {
      enrolledCourseId: 'cinematography-filmmaking',
      enrolledCourseTitle: 'Professional Filmmaking & Cinematography',
      cohort: 'April 2026 Cohort (Starts Apr 6)',
      learningMode: 'Physical',
      attendancePercentage: 94,
      completedModules: 4,
      totalModules: 12,
      assignedInstructor: 'Adekunle Alabi',
      nextClassDate: 'Tomorrow at 10:00 AM (Main Soundstage A)',
      tuitionStatus: 'Paid in Full',
    },
  },
  instructor: {
    id: 'usr-fac-001',
    role: 'instructor',
    name: 'Engr. Christopher Daniels',
    email: 'c.daniels@ojismedia.academy',
    phone: '+234 812 770 1928',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-FAC-014',
    joinedDate: 'January 2024',
    status: 'Verified',
    instructorDetails: {
      title: 'Lead Post-Production Director & Colorist',
      department: 'Video Editing & Color Grading',
      specialization: 'DaVinci Resolve Studio & Premiere Pro Workflow',
      yearsOfExperience: 11,
      portfolioUrl: 'https://vimeo.com/cdaniels-color',
      activeBatches: ['April 2026 Morning Batch', 'Weekend Masterclass Batch B'],
      assignedStudentsCount: 38,
      rating: 4.95,
      officeHours: 'Tues & Thurs, 2:00 PM - 5:00 PM',
    },
  },
  admin: {
    id: 'usr-adm-001',
    role: 'admin',
    name: 'Dr. Victoria Morgan',
    email: 'admin.morgan@ojismedia.academy',
    phone: '+234 803 551 2290',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-ADM-002',
    joinedDate: 'September 2022',
    status: 'Verified',
    adminDetails: {
      department: 'Admissions',
      clearanceLevel: 'Dean / Director',
      authorizedLocations: ['Lagos Ikeja Main Studio', 'Lekki Annex Hub', 'Online Cloud Campus'],
    },
  },
};

export const AUTH_STORAGE_KEY = 'ojis_media_current_user';
export const REGISTERED_USERS_KEY = 'ojis_media_registered_users';

export function getStoredUser(): UserAccount | null {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse current user', e);
  }
  return null;
}

export function setStoredUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to update stored user', e);
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear stored user', e);
  }
}

export function getRegisteredUsers(): UserAccount[] {
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse registered users', e);
  }
  return [];
}

export function saveRegisteredUser(user: UserAccount): void {
  try {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered user', e);
  }
}
