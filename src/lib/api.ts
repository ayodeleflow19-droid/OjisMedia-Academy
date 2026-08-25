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

/**
 * Safely parses any HTTP response without throwing "Unexpected token 'T'... is not valid JSON"
 */
async function safeJsonFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    if (!text || text.trim() === '') {
      return {
        ok: res.ok,
        status: res.status,
        error: res.ok ? undefined : `Request failed with status ${res.status}`,
      };
    }

    // Try parsing JSON if content type hints it or text looks like JSON
    if (contentType.includes('application/json') || text.startsWith('{') || text.startsWith('[')) {
      try {
        const json = JSON.parse(text);
        return {
          ok: res.ok,
          status: res.status,
          data: json,
          error: json?.error || (res.ok ? undefined : json?.message || `Request failed (${res.status})`),
        };
      } catch (parseErr) {
        console.warn(`JSON parse error from ${url}:`, parseErr, text.slice(0, 100));
      }
    }

    // If server returned non-JSON (e.g. during server startup or HTML 502/504)
    if (res.status === 502 || res.status === 503 || res.status === 504) {
      return {
        ok: false,
        status: res.status,
        error: 'Backend service is starting up. Please retry in a moment.',
      };
    }

    if (res.status === 404) {
      return {
        ok: false,
        status: res.status,
        error: 'Requested service endpoint was not found (404).',
      };
    }

    return {
      ok: res.ok,
      status: res.status,
      error: res.ok ? undefined : `Server response error (${res.status}).`,
    };
  } catch (netErr: any) {
    console.warn(`Network error fetching ${url}:`, netErr);
    return {
      ok: false,
      status: 0,
      error: netErr?.message || 'Network connection error. Please check your internet or retry.',
    };
  }
}

export const api = {
  /**
   * Check backend server & MongoDB cluster connection status
   */
  async checkHealth(): Promise<DatabaseHealthResponse | null> {
    const res = await safeJsonFetch<DatabaseHealthResponse>('/api/health');
    return res.ok && res.data ? res.data : null;
  },

  /**
   * Submit enrollment application to MongoDB
   */
  async submitEnrollment(enrollment: StudentEnrollment): Promise<{ success: boolean; data: StudentEnrollment }> {
    try {
      const res = await safeJsonFetch<{ success: boolean; data?: StudentEnrollment }>('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollment),
      });
      if (res.ok && res.data?.data) {
        return { success: true, data: res.data.data };
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
      const res = await safeJsonFetch<{ success: boolean; data?: StudentEnrollment }>(
        `/api/enrollments/${encodeURIComponent(reference)}`
      );
      if (res.ok && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('Server lookup error:', e);
    }
    return null;
  },

  /**
   * Register new user account in MongoDB and trigger activation email
   */
  async registerUser(
    userData: Partial<UserAccount> & { password?: string }
  ): Promise<{
    success: boolean;
    user?: UserAccount;
    emailStatus?: { sent: boolean; provider: string; activationUrl?: string; message?: string; error?: string };
    error?: string;
  }> {
    const res = await safeJsonFetch<{
      success: boolean;
      user?: UserAccount;
      emailStatus?: { sent: boolean; provider: string; activationUrl?: string; message?: string; error?: string };
      error?: string;
    }>('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (res.ok && res.data?.user) {
      return {
        success: true,
        user: res.data.user,
        emailStatus: res.data.emailStatus,
      };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to create user account. Please try again.',
    };
  },

  /**
   * Activate user account via verification token or email
   */
  async activateAccount(
    token?: string,
    email?: string
  ): Promise<{ success: boolean; message?: string; user?: UserAccount; error?: string }> {
    const query = new URLSearchParams();
    if (token) query.set('token', token);
    if (email) query.set('email', email);

    const res = await safeJsonFetch<{ success: boolean; message?: string; user?: UserAccount; error?: string }>(
      `/api/auth/activate?${query.toString()}`
    );

    if (res.ok && res.data?.success) {
      return {
        success: true,
        message: res.data.message || 'Account activated successfully!',
        user: res.data.user,
      };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to activate account. The link may have expired.',
    };
  },

  /**
   * Resend activation email
   */
  async resendActivation(
    email: string
  ): Promise<{ success: boolean; message?: string; emailStatus?: any; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; message?: string; emailStatus?: any; error?: string }>(
      '/api/auth/resend-activation',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );

    if (res.ok && res.data?.success) {
      return res.data;
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to re-send activation email.',
    };
  },

  /**
   * Get email service configuration status
   */
  async getEmailStatus(): Promise<{
    isConfigured: boolean;
    provider: string;
    fromEmail: string;
    message: string;
  } | null> {
    const res = await safeJsonFetch<{
      success: boolean;
      emailService: {
        isConfigured: boolean;
        provider: string;
        fromEmail: string;
        message: string;
      };
    }>('/api/email/status');

    return res.ok && res.data?.emailService ? res.data.emailService : null;
  },

  /**
   * Send diagnostic test email
   */
  async sendDiagnosticTestEmail(email?: string): Promise<{ success: boolean; message: string; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; message: string; error?: string }>('/api/email/test-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok && res.data) {
      return res.data;
    }

    return {
      success: false,
      message: res.error || 'Failed to send test email',
      error: res.error,
    };
  },

  /**
   * Login user via MongoDB
   */
  async loginUser(identifier: string, password?: string, role?: string, pin?: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; user?: UserAccount; error?: string }>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, role, pin }),
    });

    if (res.ok && res.data?.user) {
      return { success: true, user: res.data.user };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Invalid identifier or credentials.',
    };
  },

  /**
   * Instant Master Admin PIN Authentication
   */
  async verifyMasterPin(pin: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; user?: UserAccount; error?: string }>('/api/auth/master-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    if (res.ok && res.data?.user) {
      return { success: true, user: res.data.user };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Invalid Master Security PIN.',
    };
  },

  /**
   * Record studio attendance in MongoDB
   */
  async recordAttendance(data: { studentId: string; studentName: string; course?: string; status?: string }) {
    try {
      const res = await safeJsonFetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.data || { success: true };
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
      const res = await safeJsonFetch('/api/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.data || { success: true };
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
      const res = await safeJsonFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.data || { success: true };
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
      const res = await safeJsonFetch<{ success: boolean; users?: UserAccount[] }>('/api/admin/users');
      if (res.ok && res.data?.users && Array.isArray(res.data.users)) {
        return { success: true, users: res.data.users };
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
    const res = await safeJsonFetch<{ success: boolean; user?: UserAccount; error?: string }>('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (res.ok && res.data?.user) {
      return { success: true, user: res.data.user };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to create user.',
    };
  },

  /**
   * Update an existing user
   */
  async updateAdminUser(id: string, updates: Partial<UserAccount>): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; user?: UserAccount; error?: string }>(
      `/api/admin/users/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );

    if (res.ok && res.data?.user) {
      return { success: true, user: res.data.user };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to update user.',
    };
  },

  /**
   * Delete a user
   */
  async deleteAdminUser(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; error?: string }>(
      `/api/admin/users/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok && res.data?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to delete user.',
    };
  },

  /**
   * Suspend, Activate or change user status
   */
  async updateUserStatus(id: string, status: string, reason?: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; user?: UserAccount; error?: string }>(
      `/api/admin/users/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      }
    );

    if (res.ok && res.data?.user) {
      return { success: true, user: res.data.user };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to update user status.',
    };
  },

  /**
   * Send a direct message / alert to an individual user
   */
  async sendDirectMessage(
    targetUserId: string,
    messageData: { subject: string; message: string; senderName: string; senderRole: string; senderId: string; priority?: 'normal' | 'high' | 'urgent' }
  ): Promise<{ success: boolean; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; error?: string }>(
      `/api/admin/users/${encodeURIComponent(targetUserId)}/message`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      }
    );

    if (res.ok && res.data?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to send message.',
    };
  },

  /**
   * Assign or toggle Instructor Course Creation Privilege (Admin & Master Chancellor)
   */
  async setInstructorCourseCreationPermission(
    instructorId: string,
    canCreateCourses: boolean
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; user?: UserAccount; error?: string }>(
      `/api/admin/instructors/${encodeURIComponent(instructorId)}/permission`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canCreateCourses }),
      }
    );

    if (res.ok && res.data?.user) {
      return { success: true, user: res.data.user };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to update course creation permission.',
    };
  },

  // ============================================
  // MASTER ADMIN CATEGORIES GOVERNANCE APIS
  // ============================================

  /**
   * Fetch all Course Categories
   */
  async getCategories(): Promise<{ success: boolean; categories: CategoryItem[] }> {
    try {
      const res = await safeJsonFetch<{ success: boolean; categories?: CategoryItem[] }>('/api/categories');
      if (res.ok && res.data?.categories && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
        setStoredCategories(res.data.categories);
        return { success: true, categories: res.data.categories };
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
    const res = await safeJsonFetch<{ success: boolean; category?: CategoryItem; error?: string }>('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok && res.data?.category) {
      return { success: true, category: res.data.category };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to create category.',
    };
  },

  /**
   * Modify existing Category (Master Admin)
   */
  async updateCategory(id: string, updates: Partial<CategoryItem>): Promise<{ success: boolean; category?: CategoryItem; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; category?: CategoryItem; error?: string }>(
      `/api/admin/categories/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );

    if (res.ok && res.data?.category) {
      return { success: true, category: res.data.category };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to update category.',
    };
  },

  /**
   * Suspend or Activate Category (Master Admin)
   */
  async setCategoryStatus(id: string, status: 'active' | 'suspended'): Promise<{ success: boolean; category?: CategoryItem; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; category?: CategoryItem; error?: string }>(
      `/api/admin/categories/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }
    );

    if (res.ok && res.data?.category) {
      return { success: true, category: res.data.category };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to change category status.',
    };
  },

  /**
   * Delete Category (Master Admin)
   */
  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; error?: string }>(
      `/api/admin/categories/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok && res.data?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to delete category.',
    };
  },

  // ============================================
  // ADMIN & MASTER COURSES CURRICULUM APIS
  // ============================================

  /**
   * Fetch all courses
   */
  async getCourses(): Promise<{ success: boolean; courses: Course[] }> {
    try {
      const res = await safeJsonFetch<{ success: boolean; courses?: Course[] }>('/api/courses');
      if (res.ok && res.data?.courses && Array.isArray(res.data.courses) && res.data.courses.length > 0) {
        setStoredCourses(res.data.courses);
        return { success: true, courses: res.data.courses };
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
    const res = await safeJsonFetch<{ success: boolean; course?: Course; error?: string }>('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok && res.data?.course) {
      return { success: true, course: res.data.course };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to create course.',
    };
  },

  /**
   * Modify existing course (Admin & Master Admin)
   */
  async updateCourse(id: string, updates: Partial<Course>): Promise<{ success: boolean; course?: Course; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; course?: Course; error?: string }>(
      `/api/admin/courses/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );

    if (res.ok && res.data?.course) {
      return { success: true, course: res.data.course };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to update course.',
    };
  },

  /**
   * Suspend or Activate course (Admin & Master Admin)
   */
  async setCourseStatus(id: string, status: 'active' | 'suspended' | 'draft'): Promise<{ success: boolean; course?: Course; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; course?: Course; error?: string }>(
      `/api/admin/courses/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }
    );

    if (res.ok && res.data?.course) {
      return { success: true, course: res.data.course };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to update course status.',
    };
  },

  /**
   * Delete course (Admin & Master Admin)
   */
  async deleteCourse(id: string): Promise<{ success: boolean; error?: string }> {
    const res = await safeJsonFetch<{ success: boolean; error?: string }>(
      `/api/admin/courses/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok && res.data?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: res.data?.error || res.error || 'Failed to delete course.',
    };
  },
};

