import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Crown,
  GraduationCap,
  BookOpen,
  Edit3,
  Trash2,
  Send,
  Lock,
  Unlock,
  Mail,
  MailCheck,
  Phone,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  RefreshCw,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Check,
  Clock,
  Layers,
  Award,
  Zap,
  Copy,
  ExternalLink
} from 'lucide-react';
import { UserAccount, UserRole, UserStatus, LearningMode, UserDirectMessage } from '../types';
import { 
  getRegisteredUsers, 
  saveRegisteredUser, 
  updateRegisteredUser, 
  deleteRegisteredUser, 
  toggleUserSuspension, 
  sendDirectMessageToUser,
  MASTER_ADMIN_ACCOUNT
} from '../data/authDemoData';
import { api } from '../lib/api';
import { COURSES_DATA } from '../data/coursesData';

interface MasterUserManagementProps {
  currentUser: UserAccount;
  onUserListChanged?: () => void;
}

export function MasterUserManagement({ currentUser, onUserListChanged }: MasterUserManagementProps) {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [messagingUser, setMessagingUser] = useState<UserAccount | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);
  const [suspendingUser, setSuspendingUser] = useState<UserAccount | null>(null);
  const [viewingDetailsUser, setViewingDetailsUser] = useState<UserAccount | null>(null);

  // Form state - Direct Message
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgPriority, setMsgPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Form state - Suspend Reason
  const [suspendReason, setSuspendReason] = useState('');

  // Email Diagnostics & Testing State
  const [showEmailConsole, setShowEmailConsole] = useState(false);
  const [emailConfigStatus, setEmailConfigStatus] = useState<any>(null);
  const [isCheckingEmailConfig, setIsCheckingEmailConfig] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('ayodeleflow19@gmail.com');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<any>(null);
  const [resendingEmailUserId, setResendingEmailUserId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Form state - Create / Edit User
  const [formRole, setFormRole] = useState<UserRole>('student');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<UserStatus>('Active');
  const [formBio, setFormBio] = useState('');
  const [formPassword, setFormPassword] = useState('');

  // Student specific form fields
  const [formCourseId, setFormCourseId] = useState(COURSES_DATA[0].id);
  const [formCohort, setFormCohort] = useState('April 2026 Cohort (Starts Apr 6)');
  const [formLearningMode, setFormLearningMode] = useState<LearningMode>('Physical');
  const [formTuitionStatus, setFormTuitionStatus] = useState<'Paid in Full' | 'Partially Paid' | 'Scholarship Clearance'>('Paid in Full');
  const [formInstructorName, setFormInstructorName] = useState('Adekunle Alabi');
  const [formAttendance, setFormAttendance] = useState(90);

  // Instructor specific form fields
  const [formTitle, setFormTitle] = useState('Senior Cinematography Mentor');
  const [formDept, setFormDept] = useState('Filmmaking & Cinematography');
  const [formSpecialization, setFormSpecialization] = useState('Anamorphic Cinema & Lighting');
  const [formExperience, setFormExperience] = useState(8);
  const [formRating, setFormRating] = useState(4.9);
  const [formOfficeHours, setFormOfficeHours] = useState('Mon & Wed, 2:00 PM - 5:00 PM');
  const [formCanCreateCourses, setFormCanCreateCourses] = useState(false);

  // Admin specific form fields
  const [formAdminDept, setFormAdminDept] = useState<'Admissions' | 'Academic Board' | 'Studio Operations' | 'Finance & Registrar'>('Admissions');
  const [formClearanceLevel, setFormClearanceLevel] = useState<'Super Admin' | 'Dean / Director' | 'Operations Lead' | 'Admissions Officer'>('Operations Lead');

  // Load all users from LocalStore + Backend Sync
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // First load local storage
      const localUsers = getRegisteredUsers();
      setUsers(localUsers);

      // Attempt API sync
      const res = await api.getAllUsers();
      if (res.success && res.users && res.users.length > 0) {
        // Merge with local users ensuring Master Admin is present
        const mergedMap = new Map<string, UserAccount>();
        localUsers.forEach(u => mergedMap.set(u.id, u));
        res.users.forEach((u: UserAccount) => mergedMap.set(u.id, u));
        mergedMap.set(MASTER_ADMIN_ACCOUNT.id, MASTER_ADMIN_ACCOUNT);
        const merged = Array.from(mergedMap.values());
        setUsers(merged);
      }
    } catch (e) {
      console.warn('User load notice:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedbackNotice({ type, message });
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4500);
  };

  // Open Edit Modal with user data
  const handleOpenEdit = (target: UserAccount) => {
    setEditingUser(target);
    setFormRole(target.role);
    setFormName(target.name);
    setFormEmail(target.email);
    setFormPhone(target.phone || '');
    setFormStatus(target.status);
    setFormBio(target.bio || '');

    if (target.role === 'student' && target.studentDetails) {
      setFormCourseId(target.studentDetails.enrolledCourseId);
      setFormCohort(target.studentDetails.cohort);
      setFormLearningMode(target.studentDetails.learningMode);
      setFormTuitionStatus(target.studentDetails.tuitionStatus);
      setFormInstructorName(target.studentDetails.assignedInstructor);
      setFormAttendance(target.studentDetails.attendancePercentage);
    } else if (target.role === 'instructor' && target.instructorDetails) {
      setFormTitle(target.instructorDetails.title);
      setFormDept(target.instructorDetails.department);
      setFormSpecialization(target.instructorDetails.specialization);
      setFormExperience(target.instructorDetails.yearsOfExperience);
      setFormRating(target.instructorDetails.rating);
      setFormOfficeHours(target.instructorDetails.officeHours);
      setFormCanCreateCourses(Boolean(target.instructorDetails.canCreateCourses));
    } else if (target.role === 'admin' && target.adminDetails) {
      setFormAdminDept(target.adminDetails.department);
      setFormClearanceLevel((target.adminDetails.clearanceLevel as any) || 'Operations Lead');
    }
  };

  // Open Create Modal
  const handleOpenCreate = (initialRole: UserRole = 'student') => {
    setFormRole(initialRole);
    setFormName('');
    setFormEmail('');
    setFormPhone('+234 ');
    setFormStatus('Active');
    setFormBio('');
    setFormPassword('ojis2026');
    setFormCanCreateCourses(false);
    setEditingUser(null);
    setIsCreateModalOpen(true);
  };

  // Direct toggle for Instructor Course Creation Clearance (Admin & Master Chancellor)
  const handleToggleInstructorCoursePermission = async (instructor: UserAccount) => {
    const currentVal = Boolean(instructor.instructorDetails?.canCreateCourses);
    const newVal = !currentVal;
    const updated: UserAccount = {
      ...instructor,
      instructorDetails: {
        ...(instructor.instructorDetails || {
          title: 'Faculty Mentor',
          department: 'Filmmaking',
          specialization: 'Production',
          yearsOfExperience: 5,
          portfolioUrl: '',
          activeBatches: [],
          assignedStudentsCount: 0,
          rating: 5.0,
          officeHours: 'Mon-Fri',
        }),
        canCreateCourses: newVal,
      },
    };

    updateRegisteredUser(instructor.id, updated);
    await api.setInstructorCourseCreationPermission(instructor.id, newVal);
    loadUsers();
    if (onUserListChanged) onUserListChanged();
    showNotification(
      'success',
      `${instructor.name} course creation permission is now ${newVal ? 'GRANTED (Can create and author courses)' : 'REVOKED'}.`
    );
  };

  // Save User (Create or Update)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      showNotification('error', 'Name and Email are required.');
      return;
    }

    const selectedCourse = COURSES_DATA.find(c => c.id === formCourseId) || COURSES_DATA[0];

    const userData: UserAccount = {
      id: editingUser ? editingUser.id : `usr_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      role: formRole,
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      phone: formPhone.trim(),
      avatar: editingUser?.avatar || (
        formRole === 'instructor'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
          : formRole === 'admin'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
      ),
      identifierCode: editingUser?.identifierCode || (
        formRole === 'student'
          ? `OJIS-STD-2026-${Math.floor(100 + Math.random() * 900)}`
          : formRole === 'instructor'
          ? `OJIS-FAC-${Math.floor(10 + Math.random() * 90)}`
          : `OJIS-ADM-${Math.floor(10 + Math.random() * 90)}`
      ),
      joinedDate: editingUser?.joinedDate || `${new Date().toLocaleString('default', { month: 'long' })} 2026`,
      status: formStatus,
      bio: formBio.trim(),
      directMessages: editingUser?.directMessages || [],

      // Student specific
      ...(formRole === 'student' ? {
        studentDetails: {
          enrolledCourseId: selectedCourse.id,
          enrolledCourseTitle: selectedCourse.title,
          cohort: formCohort,
          learningMode: formLearningMode,
          attendancePercentage: Number(formAttendance) || 90,
          completedModules: editingUser?.studentDetails?.completedModules ?? 2,
          totalModules: selectedCourse.curriculum?.length || 12,
          assignedInstructor: formInstructorName,
          nextClassDate: 'Upcoming Class on Schedule',
          tuitionStatus: formTuitionStatus,
        }
      } : {}),

      // Instructor specific
      ...(formRole === 'instructor' ? {
        instructorDetails: {
          title: formTitle,
          department: formDept,
          specialization: formSpecialization,
          yearsOfExperience: Number(formExperience) || 5,
          portfolioUrl: editingUser?.instructorDetails?.portfolioUrl || 'https://vimeo.com/ojis-mentor',
          activeBatches: editingUser?.instructorDetails?.activeBatches || ['April 2026 Morning Batch'],
          assignedStudentsCount: editingUser?.instructorDetails?.assignedStudentsCount || 24,
          rating: Number(formRating) || 4.9,
          officeHours: formOfficeHours,
          canCreateCourses: formCanCreateCourses,
        }
      } : {}),

      // Admin specific
      ...(formRole === 'admin' ? {
        adminDetails: {
          department: formAdminDept,
          clearanceLevel: editingUser?.id === MASTER_ADMIN_ACCOUNT.id ? 'Master Executive Director & Chancellor' : formClearanceLevel,
          authorizedLocations: editingUser?.adminDetails?.authorizedLocations || ['Lagos Ikeja Main Studio', 'Online Cloud Campus'],
        }
      } : {}),
    };

    try {
      if (editingUser) {
        updateRegisteredUser(userData.id, userData);
        const res = await api.updateAdminUser(userData.id, userData);
        if (!res.success) {
          showNotification('error', res.error || 'Failed to update user in MongoDB.');
          return;
        }
        showNotification('success', `User "${userData.name}" profile updated successfully in MongoDB.`);
      } else {
        saveRegisteredUser(userData);
        const res = await api.createAdminUser({ ...userData, password: formPassword || 'ojis2026' });
        if (!res.success) {
          showNotification('error', res.error || 'Failed to create user in MongoDB.');
          return;
        }
        showNotification('success', `New ${userData.role} "${userData.name}" created in MongoDB with ID: ${userData.identifierCode}`);
      }

      await loadUsers();
      setIsCreateModalOpen(false);
      setEditingUser(null);
      if (onUserListChanged) onUserListChanged();
    } catch (err: any) {
      showNotification('error', `Failed to save user: ${err?.message}`);
    }
  };

  // Delete User Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    if (deletingUser.id === MASTER_ADMIN_ACCOUNT.id) {
      showNotification('error', 'Master Chancellor account is system-protected and cannot be deleted.');
      setDeletingUser(null);
      return;
    }

    try {
      deleteRegisteredUser(deletingUser.id);
      await api.deleteAdminUser(deletingUser.id);
      showNotification('success', `User "${deletingUser.name}" (${deletingUser.identifierCode}) was removed from the academy database.`);
      setDeletingUser(null);
      await loadUsers();
      if (onUserListChanged) onUserListChanged();
    } catch (e: any) {
      showNotification('error', `Failed to delete user: ${e?.message}`);
    }
  };

  // Toggle Suspension Action
  const handleConfirmSuspend = async () => {
    if (!suspendingUser) return;
    if (suspendingUser.id === MASTER_ADMIN_ACCOUNT.id) {
      showNotification('error', 'Master Chancellor account cannot be suspended.');
      setSuspendingUser(null);
      return;
    }

    try {
      const isCurrentlySuspended = suspendingUser.status === 'Suspended';
      const updatedUser = toggleUserSuspension(suspendingUser.id, suspendReason);
      await api.updateUserStatus(suspendingUser.id, isCurrentlySuspended ? 'Active' : 'Suspended', suspendReason);
      
      showNotification(
        'info', 
        isCurrentlySuspended 
          ? `User "${suspendingUser.name}" access has been fully restored to Active status.` 
          : `User "${suspendingUser.name}" has been SUSPENDED.`
      );
      setSuspendingUser(null);
      setSuspendReason('');
      await loadUsers();
      if (onUserListChanged) onUserListChanged();
    } catch (e: any) {
      showNotification('error', `Failed to update suspension status: ${e?.message}`);
    }
  };

  // Send Direct Message
  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagingUser || !msgSubject.trim() || !msgBody.trim()) {
      showNotification('error', 'Please provide a subject and message body.');
      return;
    }

    setIsSendingMsg(true);
    try {
      sendDirectMessageToUser(messagingUser.id, {
        subject: msgSubject.trim(),
        message: msgBody.trim(),
        senderName: `${currentUser.name} (Chancellor)`,
        senderRole: 'Academic Board & Master Chancellor',
        senderId: currentUser.id,
        priority: msgPriority,
      });

      await api.sendDirectMessage(messagingUser.id, {
        subject: msgSubject.trim(),
        message: msgBody.trim(),
        senderName: `${currentUser.name} (Chancellor)`,
        senderRole: 'Academic Board & Master Chancellor',
        senderId: currentUser.id,
        priority: msgPriority,
      });

      showNotification('success', `Direct Alert dispatched to ${messagingUser.name} (${messagingUser.email}).`);
      setMessagingUser(null);
      setMsgSubject('');
      setMsgBody('');
      setMsgPriority('normal');
      await loadUsers();
    } catch (e: any) {
      showNotification('error', `Failed to send direct message: ${e?.message}`);
    } finally {
      setIsSendingMsg(false);
    }
  };

  // Check email system status
  const checkEmailConfiguration = async () => {
    setIsCheckingEmailConfig(true);
    try {
      const res = await api.getEmailStatus();
      if (res) {
        setEmailConfigStatus(res);
      }
    } catch (e: any) {
      console.warn('Failed to fetch email status', e);
    } finally {
      setIsCheckingEmailConfig(false);
    }
  };

  // Send diagnostic test activation email
  const handleSendTestActivationEmail = async () => {
    if (!testEmailAddress.trim()) {
      showNotification('error', 'Please enter a destination email address.');
      return;
    }
    setIsSendingTestEmail(true);
    setEmailTestResult(null);

    try {
      const res = await api.sendDiagnosticTestEmail(testEmailAddress.trim());
      setEmailTestResult(res);
      if (res.success) {
        showNotification('success', res.message || `Test activation email successfully dispatched to ${testEmailAddress}!`);
      } else {
        showNotification('error', res.error || 'Failed to dispatch test activation email.');
      }
    } catch (e: any) {
      showNotification('error', `Test dispatch error: ${e?.message}`);
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  // Resend Activation for a user in the list
  const handleResendUserActivation = async (targetUser: UserAccount) => {
    setResendingEmailUserId(targetUser.id);
    try {
      const res = await api.resendActivation(targetUser.email);
      if (res.success) {
        showNotification('success', `Activation link dispatched to ${targetUser.name} (${targetUser.email})`);
      } else {
        showNotification('error', res.error || `Failed to send activation email to ${targetUser.email}`);
      }
    } catch (e: any) {
      showNotification('error', `Resend error: ${e?.message}`);
    } finally {
      setResendingEmailUserId(null);
    }
  };

  // Load email configuration on mount
  useEffect(() => {
    checkEmailConfiguration();
  }, []);

  // Filtering users
  const filteredUsers = users.filter(u => {
    // Role filter
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    // Status filter
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchCode = u.identifierCode.toLowerCase().includes(q);
      const matchPhone = u.phone?.toLowerCase().includes(q) || false;
      const matchCourse = u.studentDetails?.enrolledCourseTitle.toLowerCase().includes(q) || false;
      const matchDept = u.instructorDetails?.department.toLowerCase().includes(q) || u.adminDetails?.department.toLowerCase().includes(q) || false;
      return matchName || matchEmail || matchCode || matchPhone || matchCourse || matchDept;
    }
    return true;
  });

  const studentCount = users.filter(u => u.role === 'student').length;
  const instructorCount = users.filter(u => u.role === 'instructor').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const suspendedCount = users.filter(u => u.status === 'Suspended').length;

  return (
    <div className="space-y-5">
      {/* Top Banner Notice */}
      {feedbackNotice && (
        <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all animate-in fade-in ${
          feedbackNotice.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
          feedbackNotice.type === 'error' ? 'bg-red-50 text-red-900 border-red-300' :
          'bg-blue-50 text-blue-900 border-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {feedbackNotice.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
            {feedbackNotice.type === 'info' && <Shield className="w-4 h-4 text-blue-600" />}
            <span>{feedbackNotice.message}</span>
          </div>
          <button onClick={() => setFeedbackNotice(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => { setRoleFilter('all'); setStatusFilter('all'); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            roleFilter === 'all' && statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">Total Registry</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-extrabold">{users.length} Users</span>
            <Users className="w-4 h-4 opacity-75" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setRoleFilter('student'); setStatusFilter('all'); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            roleFilter === 'student'
              ? 'bg-blue-900 text-white border-blue-800 shadow-sm'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">Students Enrolled</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-extrabold">{studentCount} Creatives</span>
            <GraduationCap className="w-4 h-4 opacity-75" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setRoleFilter('instructor'); setStatusFilter('all'); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            roleFilter === 'instructor'
              ? 'bg-amber-900 text-white border-amber-800 shadow-sm'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">Faculty & Mentors</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-extrabold">{instructorCount} Instructors</span>
            <BookOpen className="w-4 h-4 opacity-75" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setRoleFilter('all'); setStatusFilter('Suspended'); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === 'Suspended'
              ? 'bg-red-950 text-red-100 border-red-800 shadow-sm'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">Suspended / Audits</span>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xl font-extrabold ${suspendedCount > 0 ? 'text-red-600' : ''}`}>{suspendedCount} Accounts</span>
            <ShieldAlert className="w-4 h-4 opacity-75" />
          </div>
        </button>
      </div>

      {/* Control Header & Master Actions */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, ID code (e.g. OJIS-STD), course or department..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Master User Creation Trigger & Email Console Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmailConsole(!showEmailConsole)}
              title="Email Activation & Dispatch Console"
              className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                showEmailConsole
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MailCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Email Service</span>
              {showEmailConsole ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={loadUsers}
              disabled={isLoading}
              title="Refresh Directory"
              className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => handleOpenCreate('student')}
              className="py-2 px-3.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create User</span>
            </button>
          </div>
        </div>

        {/* Email Activation Dispatch Diagnostic Console */}
        {showEmailConsole && (
          <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-xl text-white border border-blue-800/60 space-y-3.5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <MailCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    Live Email Activation & Dispatch System
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      FREE TIER READY
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Sends real verification links for new student and instructor registrations.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={checkEmailConfiguration}
                disabled={isCheckingEmailConfig}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isCheckingEmailConfig ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
            </div>

            {/* Provider Status Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium block">Gmail SMTP (Free)</span>
                <div className="flex items-center gap-1.5">
                  {emailConfigStatus?.providers?.gmail ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Configured ({emailConfigStatus.providers.gmailUser})
                    </span>
                  ) : (
                    <span className="text-amber-300 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Add GMAIL_USER & GMAIL_APP_PASSWORD
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium block">Resend API (Free 3,000/mo)</span>
                <div className="flex items-center gap-1.5">
                  {emailConfigStatus?.providers?.resend ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="text-amber-300 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Add RESEND_API_KEY
                    </span>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 font-medium block">Live Token Security</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 24-Hour Expiry Active
                  </span>
                </div>
              </div>
            </div>

            {/* Test Activation Email Dispatcher */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                Send Test Activation Email to Inbox:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="Enter email e.g. ayodeleflow19@gmail.com"
                  className="flex-1 px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono"
                />
                <button
                  type="button"
                  onClick={handleSendTestActivationEmail}
                  disabled={isSendingTestEmail}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSendingTestEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Test...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Activation Email</span>
                    </>
                  )}
                </button>
              </div>

              {emailTestResult && (
                <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  emailTestResult.success 
                    ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200'
                    : 'bg-red-950/60 border-red-600/60 text-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {emailTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {emailTestResult.message || (emailTestResult.success ? 'Activation Email Dispatched!' : 'Dispatch Notice')}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/40">
                      Provider: {emailTestResult.provider || 'Active'}
                    </span>
                  </div>

                  {emailTestResult.activationUrl && (
                    <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono truncate text-slate-300">
                        {emailTestResult.activationUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (emailTestResult.activationUrl) {
                            navigator.clipboard.writeText(emailTestResult.activationUrl);
                            setCopiedUrl(true);
                            setTimeout(() => setCopiedUrl(false), 3000);
                          }
                        }}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl ? 'Copied' : 'Copy Link'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              <span>Role:</span>
            </span>
            {(['all', 'student', 'instructor', 'admin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer capitalize ${
                  roleFilter === r
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r === 'all' ? 'All Roles' : `${r}s`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Status:</span>
            {(['all', 'Active', 'Verified', 'Under Review', 'Suspended'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-2 py-0.8 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-slate-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s === 'all' ? 'All Statuses' : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users List Table / Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> academy accounts</span>
          <span className="text-[11px]">Authorized by Master Executive Clearance</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No users match your active search filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setRoleFilter('all'); setStatusFilter('all'); }}
              className="text-xs text-blue-900 font-semibold underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredUsers.map((userItem) => {
            const isMaster = userItem.id === MASTER_ADMIN_ACCOUNT.id || userItem.identifierCode === 'OJIS-MASTER-ADM-001';
            const isSuspended = userItem.status === 'Suspended';

            return (
              <div
                key={userItem.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isSuspended
                    ? 'bg-red-50/40 border-red-200 shadow-xs'
                    : isMaster
                    ? 'bg-gradient-to-r from-amber-50/50 via-white to-amber-50/20 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  
                  {/* Left Identity Details */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={userItem.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                        alt={userItem.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                      <span className={`w-3 h-3 rounded-full border-2 border-white absolute -bottom-1 -right-1 ${
                        isSuspended ? 'bg-red-500' : userItem.status === 'Verified' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`} />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {userItem.name}
                        </h4>

                        {/* Role Badge */}
                        {isMaster ? (
                          <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                            CHANCELLOR
                          </span>
                        ) : userItem.role === 'admin' ? (
                          <span className="px-2 py-0.2 rounded bg-slate-900 text-white text-[10px] font-semibold">
                            Admin Staff
                          </span>
                        ) : userItem.role === 'instructor' ? (
                          <span className="px-2 py-0.2 rounded bg-blue-100 text-blue-900 text-[10px] font-semibold">
                            Faculty / Mentor
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            Student
                          </span>
                        )}

                        {/* Status Badge */}
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          isSuspended ? 'bg-red-100 text-red-800 border border-red-300' :
                          userItem.status === 'Verified' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                          userItem.status === 'Under Review' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {userItem.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-500">
                        <span className="font-mono text-blue-900 font-semibold">{userItem.identifierCode}</span>
                        <span>•</span>
                        <span className="truncate">{userItem.email}</span>
                        {userItem.phone && (
                          <>
                            <span>•</span>
                            <span>{userItem.phone}</span>
                          </>
                        )}
                      </div>

                      {/* Role Specific Highlight */}
                      <p className="text-[11px] text-slate-600 pt-0.5">
                        {userItem.role === 'student' && userItem.studentDetails && (
                          <span>Track: <strong className="text-slate-800">{userItem.studentDetails.enrolledCourseTitle}</strong> ({userItem.studentDetails.learningMode}) • Tuition: <span className="font-semibold text-emerald-700">{userItem.studentDetails.tuitionStatus}</span></span>
                        )}
                        {userItem.role === 'instructor' && userItem.instructorDetails && (
                          <span>{userItem.instructorDetails.title} • Dept: <strong className="text-slate-800">{userItem.instructorDetails.department}</strong> • {userItem.instructorDetails.yearsOfExperience} yrs exp</span>
                        )}
                        {userItem.role === 'admin' && userItem.adminDetails && (
                          <span>Clearance: <strong className="text-slate-800">{userItem.adminDetails.clearanceLevel}</strong> • {userItem.adminDetails.department}</span>
                        )}
                      </p>

                      {/* Instructor Course Authoring Badge */}
                      {userItem.role === 'instructor' && (
                        <div className="mt-1 flex items-center gap-2">
                          {userItem.instructorDetails?.canCreateCourses ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Course Authoring: Active / Authorized
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                              Course Authoring: Not Assigned
                            </span>
                          )}
                        </div>
                      )}

                      {isSuspended && userItem.statusReason && (
                        <div className="mt-1 p-1.5 rounded bg-red-100/70 border border-red-200 text-[10px] text-red-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-red-600 flex-shrink-0" />
                          <span>Suspension Reason: {userItem.statusReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Action Control Center */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                    
                    {/* Resend Activation Email Button */}
                    {!isMaster && (
                      <button
                        type="button"
                        onClick={() => handleResendUserActivation(userItem)}
                        disabled={resendingEmailUserId === userItem.id}
                        title="Resend Activation / Welcome Email"
                        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {resendingEmailUserId === userItem.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <MailCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span className="hidden sm:inline">Email Link</span>
                      </button>
                    )}

                    {/* Direct Message Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setMessagingUser(userItem);
                        setMsgSubject(`Executive Chancellor Notice - ${userItem.name}`);
                        setMsgBody('');
                      }}
                      title="Send Direct Message / Emergency Notice"
                      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Message</span>
                    </button>

                    {/* Instructor Course Authoring Quick Permission Toggle */}
                    {userItem.role === 'instructor' && (
                      <button
                        type="button"
                        onClick={() => handleToggleInstructorCoursePermission(userItem)}
                        title={
                          userItem.instructorDetails?.canCreateCourses
                            ? 'Revoke Course Authoring Clearance'
                            : 'Assign Course Authoring Clearance to this Instructor'
                        }
                        className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
                          userItem.instructorDetails?.canCreateCourses
                            ? 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                        <span className="hidden md:inline">
                          {userItem.instructorDetails?.canCreateCourses ? 'Course Auth: ON' : 'Grant Course Auth'}
                        </span>
                      </button>
                    )}

                    {/* Edit Profile Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(userItem)}
                      title="Edit User Profile & Permissions"
                      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {/* Suspend / Restore Toggle Button */}
                    {!isMaster && (
                      <button
                        type="button"
                        onClick={() => {
                          setSuspendingUser(userItem);
                          setSuspendReason(userItem.statusReason || '');
                        }}
                        title={isSuspended ? 'Restore Active Access' : 'Suspend User Account'}
                        className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
                          isSuspended
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline">Unsuspend</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-700" />
                            <span className="hidden sm:inline">Suspend</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Delete User Button */}
                    {!isMaster && (
                      <button
                        type="button"
                        onClick={() => setDeletingUser(userItem)}
                        title="Delete User Permanently"
                        className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT USER MODAL                                          */}
      {/* ========================================================================= */}
      {(isCreateModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
            
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  {editingUser ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {editingUser ? `Edit User: ${editingUser.name}` : 'Create Academy User'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {editingUser ? `ID: ${editingUser.identifierCode}` : 'Grant academic, faculty, or student clearance'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsCreateModalOpen(false); setEditingUser(null); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Role Picker (if creating new) */}
              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Academy Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: 'student', label: 'Student', icon: GraduationCap },
                      { role: 'instructor', label: 'Instructor', icon: BookOpen },
                      { role: 'admin', label: 'Admin Staff', icon: ShieldCheck },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => setFormRole(item.role as UserRole)}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            formRole === item.role
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Samuel Adeleke"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. samuel.a@ojismedia.student"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as UserStatus)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  >
                    <option value="Active">Active (Full Studio Access)</option>
                    <option value="Verified">Verified (Accredited)</option>
                    <option value="Under Review">Under Review (Admissions)</option>
                    <option value="Suspended">Suspended (Locked Out)</option>
                  </select>
                </div>
              </div>

              {/* STUDENT SPECIFIC SECTION */}
              {formRole === 'student' && (
                <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">Student Curriculum & Tuition</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Enrolled Course Track</label>
                      <select
                        value={formCourseId}
                        onChange={(e) => setFormCourseId(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      >
                        {COURSES_DATA.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Learning Mode</label>
                      <select
                        value={formLearningMode}
                        onChange={(e) => setFormLearningMode(e.target.value as LearningMode)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      >
                        <option value="Physical">Physical (Ikeja Soundstage & Labs)</option>
                        <option value="Hybrid">Hybrid (Hands-on + Cloud LMS)</option>
                        <option value="Online">Online (Virtual Live Stream)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tuition Clearance</label>
                      <select
                        value={formTuitionStatus}
                        onChange={(e) => setFormTuitionStatus(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      >
                        <option value="Paid in Full">Paid in Full</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Scholarship Clearance">Scholarship Clearance (Full Grant)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assigned Lead Mentor</label>
                      <input
                        type="text"
                        value={formInstructorName}
                        onChange={(e) => setFormInstructorName(e.target.value)}
                        placeholder="e.g. Adekunle Alabi"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* INSTRUCTOR SPECIFIC SECTION */}
              {formRole === 'instructor' && (
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">Faculty Designation & Experience</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Faculty Title</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Principal Cinematography Instructor"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value)}
                        placeholder="e.g. Video Editing & Color Grading"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Years of Industry Experience</label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        value={formExperience}
                        onChange={(e) => setFormExperience(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mentorship Office Hours</label>
                      <input
                        type="text"
                        value={formOfficeHours}
                        onChange={(e) => setFormOfficeHours(e.target.value)}
                        placeholder="e.g. Tues & Thurs, 2:00 PM - 5:00 PM"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Course Creation Clearance Delegation Toggle */}
                  <div className="p-3 bg-white rounded-xl border border-amber-300 shadow-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formCanCreateCourses}
                        onChange={(e) => setFormCanCreateCourses(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-blue-900 border-slate-300 rounded focus:ring-blue-900 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Delegate Course Creation Authority (`canCreateCourses`)</span>
                        </span>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Allow this instructor to access the Curriculum & Course Studio to create, design, and submit new academy courses and syllabus modules.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* ADMIN SPECIFIC SECTION */}
              {formRole === 'admin' && (
                <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-300 space-y-3">
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">Admin Department & Clearance</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department Division</label>
                      <select
                        value={formAdminDept}
                        onChange={(e) => setFormAdminDept(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      >
                        <option value="Academic Board">Academic Board & Executive</option>
                        <option value="Admissions">Admissions & Candidate Review</option>
                        <option value="Studio Operations">Studio Operations & Soundstages</option>
                        <option value="Finance & Registrar">Finance & Registrar Ledger</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Clearance Level</label>
                      <select
                        value={formClearanceLevel}
                        onChange={(e) => setFormClearanceLevel(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Dean / Director">Dean / Director</option>
                        <option value="Operations Lead">Operations Lead</option>
                        <option value="Admissions Officer">Admissions Officer</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Notes / Bio</label>
                <textarea
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  placeholder="Creative focus, equipment qualifications, or admissions background..."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); setEditingUser(null); }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingUser ? 'Update Profile' : 'Create & Authorize'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DIRECT MESSAGE / ALERT MODAL                                      */}
      {/* ========================================================================= */}
      {messagingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
            
            <div className="bg-blue-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Direct Alert to {messagingUser.name}</h3>
                  <p className="text-[11px] text-blue-300 font-mono">{messagingUser.identifierCode} • {messagingUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMessagingUser(null)}
                className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendDirectMessage} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Standard Notice', badge: 'bg-slate-100 text-slate-700' },
                    { id: 'high', label: 'High Priority', badge: 'bg-amber-100 text-amber-900' },
                    { id: 'urgent', label: 'Urgent Executive Alert', badge: 'bg-red-100 text-red-900' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setMsgPriority(p.id as any)}
                      className={`p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        msgPriority === p.id 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Header *</label>
                <input
                  type="text"
                  required
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  placeholder="e.g. Soundstage Access Clearance Approval"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message Body *</label>
                <textarea
                  required
                  rows={4}
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  placeholder="Write your official directive, studio reservation notice, or performance review..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900 resize-none"
                />
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] text-blue-950 space-y-1">
                <span className="font-bold block">Chancellor Direct Dispatch:</span>
                <p>This message will appear instantly in {messagingUser.name}'s active session portal with official Master Executive clearance.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMessagingUser(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingMsg}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingMsg ? 'Dispatching Alert...' : 'Send Direct Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SUSPEND / UNSUSPEND CONFIRMATION MODAL                            */}
      {/* ========================================================================= */}
      {suspendingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
            <div className={`p-4 text-white flex items-center justify-between ${
              suspendingUser.status === 'Suspended' ? 'bg-emerald-900' : 'bg-red-950'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm sm:text-base font-bold">
                  {suspendingUser.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Academy Account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSuspendingUser(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs text-slate-700 space-y-2">
                <p>
                  Target Account: <strong className="text-slate-900">{suspendingUser.name}</strong> ({suspendingUser.identifierCode})
                </p>
                <p className="text-slate-500 leading-relaxed">
                  {suspendingUser.status === 'Suspended'
                    ? 'Reactivating will restore full studio logins, course access, and lab clearances for this user immediately.'
                    : 'Suspending will revoke access to studio soundstages, online syllabus, and lab equipment checkouts.'}
                </p>
              </div>

              {suspendingUser.status !== 'Suspended' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Suspension Reason (Audited in Record)
                  </label>
                  <textarea
                    rows={2}
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder="e.g. Lab equipment check pending return of cinema camera kit."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-red-900 resize-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSuspendingUser(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSuspend}
                  className={`px-5 py-2 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    suspendingUser.status === 'Suspended'
                      ? 'bg-emerald-700 hover:bg-emerald-600'
                      : 'bg-red-700 hover:bg-red-600'
                  }`}
                >
                  {suspendingUser.status === 'Suspended' ? 'Confirm Reactivation' : 'Execute Suspension'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE USER CONFIRMATION MODAL                                    */}
      {/* ========================================================================= */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
            <div className="bg-red-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold">Permanently Delete User</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <p className="text-xs text-slate-700 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-slate-900">{deletingUser.name}</strong> ({deletingUser.identifierCode}) from the academy database?
              </p>
              <p className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                This action cannot be undone. All attendance records and project logs associated with this ID will be removed.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
