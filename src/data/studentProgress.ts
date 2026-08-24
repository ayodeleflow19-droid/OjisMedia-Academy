import { UserAccount, StudentCourseProgress, StudentEnrollment } from '../types';
import { getStoredUser } from './authDemoData';

export const STUDENT_PROGRESS_STORAGE_KEY = 'ojis_media_student_progress';
export const STUDENT_PROGRESS_UPDATED_EVENT = 'ojis_student_progress_updated';

// Default progress presets for demo student accounts
export const DEFAULT_STUDENT_PROGRESS: Record<string, Record<string, StudentCourseProgress>> = {
  // Adeola Williams (Student 1)
  'usr-std-001': {
    'video-production': {
      courseId: 'video-production',
      enrolledCourseTitle: 'Video Production & Cinematography',
      cohort: 'April 2026 Cohort (Starts Apr 6)',
      completedModules: 4,
      totalModules: 8,
      progressPercentage: 50,
      status: 'In Progress',
      attendancePercentage: 94,
      nextLesson: 'Week 5: Pre-Production & Directing',
      grade: '96% (Distinction)'
    },
    'cinematography-filmmaking': {
      courseId: 'cinematography-filmmaking',
      enrolledCourseTitle: 'Professional Filmmaking & Cinematography',
      cohort: 'April 2026 Cohort (Starts Apr 6)',
      completedModules: 4,
      totalModules: 12,
      progressPercentage: 33,
      status: 'In Progress',
      attendancePercentage: 94,
      nextLesson: 'Week 5: Gimbals & Focus Pulling',
      grade: '94%'
    },
    'color-grading': {
      courseId: 'color-grading',
      enrolledCourseTitle: 'Color Grading & DaVinci Resolve Masterclass',
      cohort: 'May 2026 Cohort',
      completedModules: 1,
      totalModules: 4,
      progressPercentage: 25,
      status: 'In Progress',
      attendancePercentage: 100,
      nextLesson: 'Week 2: S-Log to Rec.709 Transforms',
      grade: '98%'
    }
  },

  // Tunde Bakare (Student 2)
  'usr-std-002': {
    'video-editing': {
      courseId: 'video-editing',
      enrolledCourseTitle: 'Video Editing & Post-Production',
      cohort: 'April 2026 Morning Batch',
      completedModules: 5,
      totalModules: 8,
      progressPercentage: 62,
      status: 'In Progress',
      attendancePercentage: 98,
      nextLesson: 'Week 6: Multicam & Commercial Pacing',
      grade: '98% (High Distinction)'
    },
    'video-editing-color': {
      courseId: 'video-editing-color',
      enrolledCourseTitle: 'Advanced Video Editing & Color Grading',
      cohort: 'April 2026 Morning Batch',
      completedModules: 5,
      totalModules: 12,
      progressPercentage: 42,
      status: 'In Progress',
      attendancePercentage: 98,
      nextLesson: 'Week 6: DaVinci Color Management',
      grade: '98%'
    }
  },

  // Ngozi Okonjo (Student 3)
  'usr-std-003': {
    'photography': {
      courseId: 'photography',
      enrolledCourseTitle: 'Professional Photography & Studio Lighting',
      cohort: 'April 2026 Morning Batch',
      completedModules: 3,
      totalModules: 6,
      progressPercentage: 50,
      status: 'In Progress',
      attendancePercentage: 88,
      nextLesson: 'Week 4: Beauty Dishes & Strobe Modifiers',
      grade: '91%'
    },
    'photography-mastery': {
      courseId: 'photography-mastery',
      enrolledCourseTitle: 'Commercial & Studio Photography',
      cohort: 'April 2026 Morning Batch',
      completedModules: 3,
      totalModules: 10,
      progressPercentage: 30,
      status: 'In Progress',
      attendancePercentage: 88,
      nextLesson: 'Week 4: High-End Fashion Retouching',
      grade: '90%'
    }
  },

  // Chukwuma David (Student 4)
  'usr-std-004': {
    'motion-graphics': {
      courseId: 'motion-graphics',
      enrolledCourseTitle: 'Motion Graphics & Visual Effects (VFX)',
      cohort: 'Evening Fast-Track Cohort',
      completedModules: 6,
      totalModules: 8,
      progressPercentage: 75,
      status: 'In Progress',
      attendancePercentage: 92,
      nextLesson: 'Week 7: 3D Camera Tracking in After Effects',
      grade: '95%'
    },
    'motion-graphics-3d': {
      courseId: 'motion-graphics-3d',
      enrolledCourseTitle: 'Motion Graphics & 3D Animation',
      cohort: 'Evening Fast-Track Cohort',
      completedModules: 6,
      totalModules: 12,
      progressPercentage: 50,
      status: 'In Progress',
      attendancePercentage: 92,
      nextLesson: 'Week 7: Blender Hard-Surface Physics',
      grade: '94%'
    }
  }
};

/**
 * Returns custom stored progress object from localStorage
 */
export function getCustomStoredProgress(): Record<string, StudentCourseProgress> {
  try {
    const data = localStorage.getItem(STUDENT_PROGRESS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse student progress storage', e);
  }
  return {};
}

/**
 * Saves custom progress updates
 */
export function saveStudentProgress(courseId: string, progress: StudentCourseProgress): void {
  try {
    const current = getCustomStoredProgress();
    current[courseId] = progress;
    localStorage.setItem(STUDENT_PROGRESS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(STUDENT_PROGRESS_UPDATED_EVENT, { detail: { courseId, progress } }));
  } catch (e) {
    console.error('Failed to save student progress', e);
  }
}

/**
 * Gets student course progress for a specific course and student context
 */
export function getStudentProgressForCourse(
  courseId: string, 
  user?: UserAccount | null
): StudentCourseProgress | null {
  const activeUser = user !== undefined ? user : getStoredUser();
  if (!activeUser || activeUser.role !== 'student') {
    // If not logged in as student, check if user has custom enrollment in localStorage
    return getLocalEnrollmentProgress(courseId);
  }

  // 1. Check custom override storage first
  const customStore = getCustomStoredProgress();
  if (customStore[courseId]) {
    return customStore[courseId];
  }

  // 2. Check predefined demo student progress
  const userPresets = DEFAULT_STUDENT_PROGRESS[activeUser.id];
  if (userPresets && userPresets[courseId]) {
    return userPresets[courseId];
  }

  // 3. Fallback matching through activeUser.studentDetails
  if (activeUser.studentDetails) {
    const enrolledId = activeUser.studentDetails.enrolledCourseId;
    const isDirectMatch = enrolledId === courseId;
    const isSlugMatch = isDirectMatch || 
      (courseId.includes('film') && enrolledId.includes('film')) ||
      (courseId.includes('video-prod') && enrolledId.includes('cinematography')) ||
      (courseId.includes('photo') && enrolledId.includes('photo')) ||
      (courseId.includes('edit') && enrolledId.includes('edit')) ||
      (courseId.includes('motion') && enrolledId.includes('motion')) ||
      (courseId.includes('sound') && enrolledId.includes('audio')) ||
      (courseId.includes('audio') && enrolledId.includes('audio'));

    if (isSlugMatch) {
      const completed = activeUser.studentDetails.completedModules || 0;
      const total = activeUser.studentDetails.totalModules || 8;
      const percentage = Math.min(100, Math.round((completed / (total || 1)) * 100));

      return {
        courseId,
        enrolledCourseTitle: activeUser.studentDetails.enrolledCourseTitle,
        cohort: activeUser.studentDetails.cohort,
        completedModules: completed,
        totalModules: total,
        progressPercentage: percentage,
        status: percentage >= 100 ? 'Completed' : percentage > 0 ? 'In Progress' : 'Enrolled',
        attendancePercentage: activeUser.studentDetails.attendancePercentage || 90,
        nextLesson: `Module ${completed + 1} Practical Session`,
        grade: 'Active Enrollment'
      };
    }
  }

  // 4. Check locally saved applications in localStorage ('ojis_media_enrollments')
  return getLocalEnrollmentProgress(courseId);
}

/**
 * Checks if this course has a completed application saved in local storage
 */
function getLocalEnrollmentProgress(courseId: string): StudentCourseProgress | null {
  try {
    const rawEnrollments = localStorage.getItem('ojis_media_enrollments');
    if (rawEnrollments) {
      const list: StudentEnrollment[] = JSON.parse(rawEnrollments);
      if (Array.isArray(list)) {
        const found = list.find(e => e.selectedCourseId === courseId);
        if (found) {
          return {
            courseId,
            enrolledCourseTitle: found.selectedCourseTitle,
            cohort: found.preferredCohort || 'April 2026 Cohort',
            completedModules: found.status === 'Accepted' ? 1 : 0,
            totalModules: 8,
            progressPercentage: found.status === 'Accepted' ? 12 : 0,
            status: found.status === 'Accepted' ? 'Enrolled' : 'Under Review',
            attendancePercentage: 100,
            nextLesson: found.status === 'Accepted' ? 'Orientation Session' : 'Admissions Screening',
            grade: found.status
          };
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}
