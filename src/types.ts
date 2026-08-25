export type CourseCategory = string;

export type CategoryStatus = 'active' | 'suspended';

export interface CategoryItem {
  id: string; // slug identifier e.g. 'filmmaking'
  name: string; // e.g. 'Video & Cinematography'
  shortLabel: string; // e.g. 'Video & Film'
  description?: string;
  icon: string; // 'Film', 'Camera', 'Scissors', 'Palette', 'Smartphone', 'Sparkles', 'Mic', 'Music', 'Tv', 'Layers', etc.
  status: CategoryStatus;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export type LearningMode = 'Physical' | 'Hybrid' | 'Online';

export type SkillLevel = 'Beginner' | 'Beginner → Intermediate' | 'Intermediate' | 'Intermediate → Advanced' | 'All Levels';

export type CourseStatus = 'active' | 'suspended' | 'draft';

export interface CourseModule {
  week: number;
  title: string;
  topics: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: string; // matches CategoryItem.id
  status?: CourseStatus; // 'active' | 'suspended' | 'draft' (default 'active')
  shortDescription: string;
  fullDescription: string;
  image: string;
  duration: string;
  level: SkillLevel;
  mode: LearningMode;
  price: number; // in NGN (Nigerian Naira)
  formattedPrice: string;
  popular?: boolean;
  featured?: boolean;
  upcomingCohort: string;
  schedule: string;
  tools: string[];
  prerequisites: string;
  curriculum: CourseModule[];
  outcomes: string[];
  instructorName: string;
  instructorRole: string;
  instructorAvatar: string;
  createdBy?: {
    userId: string;
    role: UserRole;
    name: string;
  };
}

export interface StudentCourseProgress {
  courseId: string;
  enrolledCourseTitle?: string;
  cohort?: string;
  completedModules: number;
  totalModules: number;
  progressPercentage: number;
  status: 'In Progress' | 'Completed' | 'Enrolled' | 'Under Review';
  attendancePercentage?: number;
  nextLesson?: string;
  lastActiveDate?: string;
  grade?: string;
}

export interface StudentEnrollment {
  id: string;
  referenceNumber: string;
  registrationDate: string;
  status: 'Pending Review' | 'Accepted' | 'Orientation Scheduled';
  
  // Step 1: Course selection
  selectedCourseId: string;
  selectedCourseTitle: string;
  coursePrice: number;
  learningMode: LearningMode;
  preferredCohort: string;
  preferredSchedule: 'Weekday Morning' | 'Weekday Evening' | 'Weekend Masterclass';
  
  // Step 2: Personal Information
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  location: string;
  
  // Step 3: Education & Experience
  occupation: string;
  educationLevel: string;
  previousExperience: 'No previous experience' | 'Beginner / Self-taught' | 'Intermediate hobbyist' | 'Working professional';
  reasonForJoining: string;
  hasLaptopOrGear: 'Yes' | 'Partially' | 'Need Academy Studio Gear';
  
  // Step 4: Special notes
  specialRequests?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  course: string;
  avatar: string;
  rating: number;
  quote: string;
  cohort: string;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  category: 'photography' | 'video' | 'design' | 'branding' | 'content' | 'motion';
  categoryLabel: string;
  studentName: string;
  course: string;
  image: string;
  description: string;
  toolsUsed: string[];
  featured?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  image: string;
  coursesTaught: string[];
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface FaqItem {
  id: string;
  category: 'Admissions' | 'Courses & Gear' | 'Payment & Schedules' | 'Careers & Certificate';
  question: string;
  answer: string;
}

export interface StatItem {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  description: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export type UserRole = 'student' | 'instructor' | 'admin';

export type UserStatus = 'Active' | 'Pending Activation' | 'Under Review' | 'Verified' | 'Suspended' | 'Inactive';

export type AuthMode = 'login' | 'signup' | 'forgot_password';

export interface UserDirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: 'normal' | 'high' | 'urgent';
}

export interface UserAccount {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  identifierCode: string; // e.g. OJIS-STD-2026-081, OJIS-FAC-014, OJIS-ADM-002, OJIS-MASTER-ADM-001
  joinedDate: string;
  status: UserStatus;
  isVerified?: boolean;
  activationCode?: string;
  verificationToken?: string;
  statusReason?: string;
  bio?: string;
  directMessages?: UserDirectMessage[];
  
  // Student Specific
  studentDetails?: {
    enrolledCourseId: string;
    enrolledCourseTitle: string;
    cohort: string;
    learningMode: LearningMode;
    attendancePercentage: number;
    completedModules: number;
    totalModules: number;
    assignedInstructor: string;
    nextClassDate: string;
    tuitionStatus: 'Paid in Full' | 'Partially Paid' | 'Scholarship Clearance';
  };
  
  // Instructor Specific
  instructorDetails?: {
    title: string;
    department: string;
    specialization: string;
    yearsOfExperience: number;
    portfolioUrl?: string;
    activeBatches: string[];
    assignedStudentsCount: number;
    rating: number;
    officeHours: string;
    canCreateCourses?: boolean; // Granted by Admin or Master Chancellor
  };
  
  // Admin Specific
  adminDetails?: {
    department: 'Admissions' | 'Academic Board' | 'Studio Operations' | 'Finance & Registrar';
    clearanceLevel: 'Master Executive Director & Chancellor' | 'Super Admin' | 'Dean / Director' | 'Operations Lead' | 'Admissions Officer';
    authorizedLocations: string[];
  };
}

