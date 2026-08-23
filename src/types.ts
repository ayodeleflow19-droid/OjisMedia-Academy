export type CourseCategory = 
  | 'all'
  | 'filmmaking'
  | 'photography'
  | 'editing'
  | 'design'
  | 'content'
  | 'motion';

export type LearningMode = 'Physical' | 'Hybrid' | 'Online';

export type SkillLevel = 'Beginner' | 'Beginner → Intermediate' | 'Intermediate' | 'Intermediate → Advanced' | 'All Levels';

export interface CourseModule {
  week: number;
  title: string;
  topics: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: CourseCategory;
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

export type AuthMode = 'login' | 'signup' | 'forgot_password';

export interface UserAccount {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  identifierCode: string; // e.g. OJIS-STD-2026-081, OJIS-FAC-014, OJIS-ADM-002
  joinedDate: string;
  status: 'Active' | 'Under Review' | 'Verified';
  
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
  };
  
  // Admin Specific
  adminDetails?: {
    department: 'Admissions' | 'Academic Board' | 'Studio Operations' | 'Finance & Registrar';
    clearanceLevel: 'Super Admin' | 'Dean / Director' | 'Operations Lead' | 'Admissions Officer';
    authorizedLocations: string[];
  };
}

