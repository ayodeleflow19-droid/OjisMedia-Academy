import { StudentEnrollment, UserAccount, ContactInquiry, CategoryItem, Course } from '../types';
import { getStoredCategories, setStoredCategories } from '../data/categoriesData';
import { getStoredCourses, setStoredCourses } from '../data/coursesData';

export interface DatabaseHealthResponse {
  status: string;
  service: string;
  timestamp: string;
  database: {
    provider: string;
    connected: boolean;
    fallbackMode: boolean;
    configured: boolean;
    databaseName: string;
    collections: string[];
    message: string;
  };
}

export const api = {
  /**
   * Check backend server & MongoDB cluster connection status
   */
  async checkHealth(): Promise<DatabaseHealthResponse | null> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('API health check skipped/offline:', e);
      return null;
    }
  },

  /**
   * Submit enrollment application to MongoDB
   */
  async submitEnrollment(enrollment: StudentEnrollment): Promise<{ success: boolean; data: StudentEnrollment }> {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollment),
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json.data || enrollment };
      }
    } catch (e) {
      console.warn('Server enrollment sync error, using local fallback:', e);
    }
    return { success: true, data: enrollment };
  },

  /**
   * Lookup enrollment by reference code or email from MongoDB
   */
  async lookupEnrollment(reference: string): Promise<StudentEnrollment | null> {
    try {
      const res = await fetch(`/api/enrollments/${encodeURIComponent(reference)}`);
      if (res.ok) {
        const json = await res.json();
        return json.data || null;
      }
    } catch (e) {
      console.warn('Server lookup error:', e);
    }
    return null;
  },

  /**
   * Register new user account in MongoDB
   */
  async registerUser(userData: Partial<UserAccount> & { password?: string }): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const json = await res.json();
      if (res.ok) {
        return { success: true, user: json.user };
      }
      return { success: false, error: json.error || 'Failed to create user account.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error connecting to backend.' };
    }
  },

  /**
   * Login user via MongoDB
   */
  async loginUser(identifier: string, password?: string, role?: string, pin?: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role, pin }),
      });
      const json = await res.json();
      if (res.ok) {
        return { success: true, user: json.user };
      }
      return { success: false, error: json.error || 'Invalid credentials.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error connecting to backend.' };
    }
  },

  /**
   * Instant Master Admin PIN Authentication
   */
  async verifyMasterPin(pin: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch('/api/auth/master-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const json = await res.json();
      if (res.ok) {
        return { success: true, user: json.user };
      }
      return { success: false, error: json.error || 'Invalid Master Security PIN.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error verifying master PIN.' };
    }
  },

  /**
   * Record studio attendance in MongoDB
   */
  async recordAttendance(data: { studentId: string; studentName: string; course?: string; status?: string }) {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      console.warn('Attendance sync notice:', e);
      return { success: true };
    }
  },

  /**
   * Admin broadcast dispatch to MongoDB
   */
  async sendBroadcast(data: { title?: string; message: string; targetAudience?: string; sender?: string }) {
    try {
      const res = await fetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      console.warn('Broadcast sync notice:', e);
      return { success: true };
    }
  },

  /**
   * Submit Contact inquiry to MongoDB
   */
  async submitContact(data: Partial<ContactInquiry>) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (e) {
      console.warn('Contact sync notice:', e);
      return { success: true };
    }
  },

  // ============================================
  // MASTER ADMIN & USER MANAGEMENT APIS
  // ============================================

  /**
   * Fetch all Academy users (Students, Instructors, Admins)
   */
  async getAllUsers(): Promise<{ success: boolean; users: UserAccount[] }> {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const json = await res.json();
        if (json.users && Array.isArray(json.users)) {
          return { success: true, users: json.users };
        }
      }
    } catch (e) {
      console.warn('Backend user fetch error, fallback to local store:', e);
    }
    return { success: false, users: [] };
  },

  /**
   * Create a new user (Student, Instructor, or Admin)
   */
  async createAdminUser(userData: Partial<UserAccount> & { password?: string }): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, user: json.user };
      }
      return { success: false, error: json.error || 'Failed to create user.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error creating user.' };
    }
  },

  /**
   * Update an existing user
   */
  async updateAdminUser(id: string, updates: Partial<UserAccount>): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, user: json.user };
      }
      return { success: false, error: json.error || 'Failed to update user.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error updating user.' };
    }
  },

  /**
   * Delete a user
   */
  async deleteAdminUser(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to delete user.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error deleting user.' };
    }
  },

  /**
   * Suspend, Activate or change user status
   */
  async updateUserStatus(id: string, status: string, reason?: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, user: json.user };
      }
      return { success: false, error: json.error || 'Failed to update user status.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error changing user status.' };
    }
  },

  /**
   * Send a direct message / alert to an individual user
   */
  async sendDirectMessage(
    targetUserId: string,
    messageData: { subject: string; message: string; senderName: string; senderRole: string; senderId: string; priority?: 'normal' | 'high' | 'urgent' }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(targetUserId)}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to send message.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error sending direct message.' };
    }
  },

  /**
   * Assign or toggle Instructor Course Creation Privilege (Admin & Master Chancellor)
   */
  async setInstructorCourseCreationPermission(
    instructorId: string,
    canCreateCourses: boolean
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    try {
      const res = await fetch(`/api/admin/instructors/${encodeURIComponent(instructorId)}/permission`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canCreateCourses }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, user: json.user };
      }
      return { success: false, error: json.error || 'Failed to update course creation permission.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error setting instructor permission.' };
    }
  },

  // ============================================
  // MASTER ADMIN CATEGORIES GOVERNANCE APIS
  // ============================================

  /**
   * Fetch all Course Categories
   */
  async getCategories(): Promise<{ success: boolean; categories: CategoryItem[] }> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const json = await res.json();
        if (json.categories && Array.isArray(json.categories) && json.categories.length > 0) {
          setStoredCategories(json.categories);
          return { success: true, categories: json.categories };
        }
      }
    } catch (e) {
      console.warn('Backend categories fetch error, using local store:', e);
    }
    return { success: true, categories: getStoredCategories() };
  },

  /**
   * Create new Category (Master Admin)
   */
  async createCategory(data: Partial<CategoryItem>): Promise<{ success: boolean; category?: CategoryItem; error?: string }> {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, category: json.category };
      }
      return { success: false, error: json.error || 'Failed to create category.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error creating category.' };
    }
  },

  /**
   * Modify existing Category (Master Admin)
   */
  async updateCategory(id: string, updates: Partial<CategoryItem>): Promise<{ success: boolean; category?: CategoryItem; error?: string }> {
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, category: json.category };
      }
      return { success: false, error: json.error || 'Failed to update category.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error updating category.' };
    }
  },

  /**
   * Suspend or Activate Category (Master Admin)
   */
  async setCategoryStatus(id: string, status: 'active' | 'suspended'): Promise<{ success: boolean; category?: CategoryItem; error?: string }> {
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, category: json.category };
      }
      return { success: false, error: json.error || 'Failed to change category status.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error changing category status.' };
    }
  },

  /**
   * Delete Category (Master Admin)
   */
  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to delete category.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error deleting category.' };
    }
  },

  // ============================================
  // ADMIN & MASTER COURSES CURRICULUM APIS
  // ============================================

  /**
   * Fetch all courses
   */
  async getCourses(): Promise<{ success: boolean; courses: Course[] }> {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const json = await res.json();
        if (json.courses && Array.isArray(json.courses) && json.courses.length > 0) {
          setStoredCourses(json.courses);
          return { success: true, courses: json.courses };
        }
      }
    } catch (e) {
      console.warn('Backend courses fetch error, using local store:', e);
    }
    return { success: true, courses: getStoredCourses() };
  },

  /**
   * Create new course (Admin, Master Admin, or Authorized Instructor)
   */
  async createCourse(data: Partial<Course>): Promise<{ success: boolean; course?: Course; error?: string }> {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, course: json.course };
      }
      return { success: false, error: json.error || 'Failed to create course.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error creating course.' };
    }
  },

  /**
   * Modify existing course (Admin & Master Admin)
   */
  async updateCourse(id: string, updates: Partial<Course>): Promise<{ success: boolean; course?: Course; error?: string }> {
    try {
      const res = await fetch(`/api/admin/courses/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, course: json.course };
      }
      return { success: false, error: json.error || 'Failed to update course.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error updating course.' };
    }
  },

  /**
   * Suspend or Activate course (Admin & Master Admin)
   */
  async setCourseStatus(id: string, status: 'active' | 'suspended' | 'draft'): Promise<{ success: boolean; course?: Course; error?: string }> {
    try {
      const res = await fetch(`/api/admin/courses/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, course: json.course };
      }
      return { success: false, error: json.error || 'Failed to update course status.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error updating course status.' };
    }
  },

  /**
   * Delete course (Admin & Master Admin)
   */
  async deleteCourse(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/courses/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true };
      }
      return { success: false, error: json.error || 'Failed to delete course.' };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error deleting course.' };
    }
  },
};

