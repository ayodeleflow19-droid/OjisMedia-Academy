import { UserAccount, UserDirectMessage, UserRole, UserStatus } from '../types';

export const MASTER_ADMIN_PIN = '2026';
export const MASTER_ADMIN_SECURITY_CODE = 'OJIS2026';

export const MASTER_ADMIN_ACCOUNT: UserAccount = {
  id: 'usr-master-adm-001',
  role: 'admin',
  name: 'Ayodele (Master Administrator)',
  email: 'ayodeleflow19@gmail.com',
  phone: '+234 800 000 2026',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  identifierCode: 'OJIS-MASTER-ADM-001',
  joinedDate: 'Academy Founding Council 2026',
  status: 'Verified',
  bio: 'Master Executive Director & Chancellor of OJIS Media Academy. Full authority across all academic departments, student registries, and facility operations.',
  adminDetails: {
    department: 'Academic Board',
    clearanceLevel: 'Master Executive Director & Chancellor',
    authorizedLocations: ['Lagos Ikeja Main Studio', 'Lekki Annex Hub', 'Online Cloud Campus', 'Executive Studio Soundstage'],
  },
  directMessages: [
    {
      id: 'msg-init-01',
      senderId: 'sys-001',
      senderName: 'Academy Security Node',
      senderRole: 'Security Core',
      subject: 'Master Executive Clearance Active',
      message: 'Master Chancellor clearance is fully active. You have full authority to create, edit, suspend, and message all users.',
      timestamp: 'Today, 08:00 AM',
      read: true,
      priority: 'high'
    }
  ]
};

export const INITIAL_ACADEMY_USERS: UserAccount[] = [
  MASTER_ADMIN_ACCOUNT,
  
  // Staff Admins
  {
    id: 'usr-adm-002',
    role: 'admin',
    name: 'Dr. Victoria Morgan',
    email: 'admin.morgan@ojismedia.academy',
    phone: '+234 803 123 4567',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-ADM-002',
    joinedDate: 'February 2025',
    status: 'Verified',
    bio: 'Dean of Admissions & Candidate Review. Overseeing portfolio screenings and physical audition interviews.',
    adminDetails: {
      department: 'Admissions',
      clearanceLevel: 'Dean / Director',
      authorizedLocations: ['Lagos Ikeja Main Studio', 'Online Cloud Campus'],
    },
    directMessages: []
  },
  {
    id: 'usr-adm-003',
    role: 'admin',
    name: 'Engr. Tayo Adeleke',
    email: 'tayo.ops@ojismedia.academy',
    phone: '+234 809 987 6543',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-ADM-003',
    joinedDate: 'September 2025',
    status: 'Active',
    bio: 'Studio Operations Lead. Managing RED & Sony cinema equipment bays and soundstage reservations.',
    adminDetails: {
      department: 'Studio Operations',
      clearanceLevel: 'Operations Lead',
      authorizedLocations: ['Lagos Ikeja Main Studio', 'Executive Studio Soundstage'],
    },
    directMessages: []
  },
  {
    id: 'usr-adm-004',
    role: 'admin',
    name: 'Grace Okafor',
    email: 'grace.finance@ojismedia.academy',
    phone: '+234 813 445 6677',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-ADM-004',
    joinedDate: 'November 2025',
    status: 'Active',
    bio: 'Registrar & Tuition Officer. Validates scholarship disbursements and installment schedules.',
    adminDetails: {
      department: 'Finance & Registrar',
      clearanceLevel: 'Admissions Officer',
      authorizedLocations: ['Lagos Ikeja Main Studio'],
    },
    directMessages: []
  },

  // Faculty / Instructors
  {
    id: 'usr-fac-001',
    role: 'instructor',
    name: 'Engr. Christopher Daniels',
    email: 'c.daniels@ojismedia.academy',
    phone: '+234 812 770 1928',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-FAC-014',
    joinedDate: 'January 2024',
    status: 'Verified',
    bio: 'Lead Post-Production Director & Colorist. 11+ years commercial filmmaking experience with Netflix & Showmax credits.',
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
    directMessages: []
  },
  {
    id: 'usr-fac-002',
    role: 'instructor',
    name: 'Adekunle Alabi',
    email: 'adekunle.alabi@ojismedia.academy',
    phone: '+234 802 334 5566',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-FAC-019',
    joinedDate: 'March 2024',
    status: 'Active',
    bio: 'Director of Photography and Cinematography Master. Specialist in anamorphic lenses and dramatic low-key lighting setups.',
    instructorDetails: {
      title: 'Principal Cinematography Instructor',
      department: 'Filmmaking & Cinematography',
      specialization: 'Sony Cinema Line, ARRI Alexa & Gaffer Operations',
      yearsOfExperience: 9,
      portfolioUrl: 'https://youtube.com/c/adekunledop',
      activeBatches: ['April 2026 Cohort (Starts Apr 6)', 'Weekend Intensive'],
      assignedStudentsCount: 42,
      rating: 4.9,
      officeHours: 'Mon & Wed, 10:00 AM - 1:00 PM',
    },
    directMessages: []
  },
  {
    id: 'usr-fac-003',
    role: 'instructor',
    name: 'Folake Davies',
    email: 'folake.photo@ojismedia.academy',
    phone: '+234 816 778 9900',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-FAC-025',
    joinedDate: 'July 2024',
    status: 'Active',
    bio: 'Commercial Portrait & Editorial Fashion Photographer. Profoto lighting ambassador with global brand campaigns.',
    instructorDetails: {
      title: 'Lead Commercial Photography Mentor',
      department: 'Commercial Photography',
      specialization: 'High-End Retouching, Strobe Lighting & Studio Directing',
      yearsOfExperience: 8,
      portfolioUrl: 'https://folakedavies.photo',
      activeBatches: ['April 2026 Morning Batch'],
      assignedStudentsCount: 29,
      rating: 4.88,
      officeHours: 'Fridays, 1:00 PM - 4:00 PM',
    },
    directMessages: []
  },
  {
    id: 'usr-fac-004',
    role: 'instructor',
    name: 'Segun Oladipo',
    email: 'segun.vfx@ojismedia.academy',
    phone: '+234 805 112 2334',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-FAC-031',
    joinedDate: 'October 2024',
    status: 'Active',
    bio: '3D VFX & Motion Graphics Director. After Effects, Blender & Unreal Engine virtual production artist.',
    instructorDetails: {
      title: 'Senior Motion Design Specialist',
      department: 'Motion Graphics & 3D VFX',
      specialization: 'Blender 3D, After Effects & Virtual Production',
      yearsOfExperience: 7,
      portfolioUrl: 'https://artstation.com/segunvfx',
      activeBatches: ['Evening Fast-Track Cohort'],
      assignedStudentsCount: 31,
      rating: 4.92,
      officeHours: 'Wed & Fri, 3:00 PM - 6:00 PM',
    },
    directMessages: []
  },

  // Students
  {
    id: 'usr-std-001',
    role: 'student',
    name: 'Adeola Williams',
    email: 'adeola.w@ojismedia.student',
    phone: '+234 802 918 3491',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-STD-2026-081',
    joinedDate: 'March 2026',
    status: 'Active',
    bio: 'Aspiring documentary cinematographer. Passionate about West African cultural stories and color grading.',
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
    directMessages: []
  },
  {
    id: 'usr-std-002',
    role: 'student',
    name: 'Tunde Bakare',
    email: 'tunde.b@ojismedia.student',
    phone: '+234 803 765 4321',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-STD-2026-082',
    joinedDate: 'March 2026',
    status: 'Active',
    bio: 'Music video editor and sound design enthusiast working with DaVinci Resolve.',
    studentDetails: {
      enrolledCourseId: 'video-editing-color',
      enrolledCourseTitle: 'Advanced Video Editing & Color Grading',
      cohort: 'April 2026 Morning Batch',
      learningMode: 'Physical',
      attendancePercentage: 98,
      completedModules: 5,
      totalModules: 12,
      assignedInstructor: 'Engr. Christopher Daniels',
      nextClassDate: 'Thursday at 2:00 PM (Lab 2)',
      tuitionStatus: 'Paid in Full',
    },
    directMessages: []
  },
  {
    id: 'usr-std-003',
    role: 'student',
    name: 'Ngozi Okonjo',
    email: 'ngozi.o@ojismedia.student',
    phone: '+234 818 901 2345',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-STD-2026-083',
    joinedDate: 'March 2026',
    status: 'Active',
    bio: 'Beauty and editorial photographer building a fashion portfolio in Ikeja studio.',
    studentDetails: {
      enrolledCourseId: 'photography-mastery',
      enrolledCourseTitle: 'Commercial & Studio Photography',
      cohort: 'April 2026 Morning Batch',
      learningMode: 'Hybrid',
      attendancePercentage: 88,
      completedModules: 3,
      totalModules: 10,
      assignedInstructor: 'Folake Davies',
      nextClassDate: 'Friday at 1:00 PM (Studio Bay 3)',
      tuitionStatus: 'Partially Paid',
    },
    directMessages: []
  },
  {
    id: 'usr-std-004',
    role: 'student',
    name: 'Chukwuma David',
    email: 'c.david@ojismedia.student',
    phone: '+234 811 223 3445',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-STD-2026-084',
    joinedDate: 'March 2026',
    status: 'Active',
    bio: 'Graphic artist transitioning into 3D motion design for commercial advertisements.',
    studentDetails: {
      enrolledCourseId: 'motion-graphics-3d',
      enrolledCourseTitle: 'Motion Graphics & 3D Animation',
      cohort: 'Evening Fast-Track Cohort',
      learningMode: 'Online',
      attendancePercentage: 92,
      completedModules: 6,
      totalModules: 12,
      assignedInstructor: 'Segun Oladipo',
      nextClassDate: 'Wednesday at 6:00 PM (Virtual Stream)',
      tuitionStatus: 'Scholarship Clearance',
    },
    directMessages: []
  },
  {
    id: 'usr-std-005',
    role: 'student',
    name: 'Kemi Adeleke',
    email: 'kemi.adeleke@gmail.com',
    phone: '+234 814 556 7788',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-STD-2026-095',
    joinedDate: 'April 2026',
    status: 'Under Review',
    bio: 'Applicant for Directing track. Awaiting final portfolio audit.',
    studentDetails: {
      enrolledCourseId: 'cinematography-filmmaking',
      enrolledCourseTitle: 'Professional Filmmaking & Cinematography',
      cohort: 'May 2026 Cohort',
      learningMode: 'Physical',
      attendancePercentage: 0,
      completedModules: 0,
      totalModules: 12,
      assignedInstructor: 'Adekunle Alabi',
      nextClassDate: 'Orientation: May 4',
      tuitionStatus: 'Partially Paid',
    },
    directMessages: []
  },
  {
    id: 'usr-std-006',
    role: 'student',
    name: 'Femi Johnson',
    email: 'femi.j@ojismedia.student',
    phone: '+234 807 665 4433',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    identifierCode: 'OJIS-STD-2026-068',
    joinedDate: 'January 2026',
    status: 'Suspended',
    statusReason: 'Lab equipment clearance pending return of Sony A7IV kit.',
    bio: 'Sound engineer and video editor. Temporarily suspended pending equipment audit.',
    studentDetails: {
      enrolledCourseId: 'audio-production',
      enrolledCourseTitle: 'Sound Engineering & Music Production',
      cohort: 'Q1 Batch',
      learningMode: 'Physical',
      attendancePercentage: 72,
      completedModules: 2,
      totalModules: 10,
      assignedInstructor: 'Engr. Christopher Daniels',
      nextClassDate: 'Studio Access Locked',
      tuitionStatus: 'Partially Paid',
    },
    directMessages: []
  }
];

export const DEMO_ACCOUNTS: Record<'student' | 'instructor' | 'admin', UserAccount> = {
  student: INITIAL_ACADEMY_USERS.find(u => u.id === 'usr-std-001') || INITIAL_ACADEMY_USERS[4],
  instructor: INITIAL_ACADEMY_USERS.find(u => u.id === 'usr-fac-001') || INITIAL_ACADEMY_USERS[3],
  admin: MASTER_ADMIN_ACCOUNT,
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
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse registered users', e);
  }
  // Initialize with initial list
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_ACADEMY_USERS));
  } catch (e) {
    console.error('Failed to set initial registered users', e);
  }
  return INITIAL_ACADEMY_USERS;
}

export function saveRegisteredUser(user: UserAccount): void {
  try {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered user', e);
  }
}

export function updateRegisteredUser(id: string, updates: Partial<UserAccount>): UserAccount | null {
  try {
    const users = getRegisteredUsers();
    const index = users.findIndex(u => u.id === id);
    if (index >= 0) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      
      // If updating current active user, sync auth state
      const current = getStoredUser();
      if (current && current.id === id) {
        setStoredUser(users[index]);
      }
      return users[index];
    }
  } catch (e) {
    console.error('Failed to update registered user', e);
  }
  return null;
}

export function deleteRegisteredUser(id: string): boolean {
  try {
    const users = getRegisteredUsers();
    // Do not delete master admin
    if (id === MASTER_ADMIN_ACCOUNT.id) return false;
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete registered user', e);
    return false;
  }
}

export function toggleUserSuspension(id: string, reason?: string): UserAccount | null {
  try {
    const users = getRegisteredUsers();
    const user = users.find(u => u.id === id);
    if (user) {
      if (user.id === MASTER_ADMIN_ACCOUNT.id) return user; // Cannot suspend Master Admin
      const newStatus: UserStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
      const updatedReason = newStatus === 'Suspended' ? (reason || 'Account suspended by Master Chancellor') : undefined;
      return updateRegisteredUser(id, { status: newStatus, statusReason: updatedReason });
    }
  } catch (e) {
    console.error('Failed to toggle suspension', e);
  }
  return null;
}

export function sendDirectMessageToUser(
  targetUserId: string, 
  msg: { subject: string; message: string; senderName: string; senderRole: string; senderId: string; priority?: 'normal' | 'high' | 'urgent' }
): boolean {
  try {
    const users = getRegisteredUsers();
    const user = users.find(u => u.id === targetUserId);
    if (user) {
      const newMsg: UserDirectMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole,
        subject: msg.subject,
        message: msg.message,
        timestamp: 'Just now',
        read: false,
        priority: msg.priority || 'normal',
      };
      const messages = user.directMessages || [];
      messages.unshift(newMsg);
      updateRegisteredUser(targetUserId, { directMessages: messages });
      return true;
    }
  } catch (e) {
    console.error('Failed to send direct message', e);
  }
  return false;
}
