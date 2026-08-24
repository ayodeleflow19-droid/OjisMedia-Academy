import { StudentEnrollment, UserAccount, ContactInquiry } from '../types';

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
};

