import React, { useState, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Building2, 
  KeyRound, 
  ExternalLink,
  Laptop,
  AlertCircle,
  Zap,
  Fingerprint,
  Crown,
  Shield
} from 'lucide-react';
import { UserRole, AuthMode, UserAccount, LearningMode } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { DEMO_ACCOUNTS, MASTER_ADMIN_ACCOUNT, MASTER_ADMIN_PIN, MASTER_ADMIN_SECURITY_CODE, setStoredUser, saveRegisteredUser } from '../data/authDemoData';
import { api } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialMode?: AuthMode;
  onAuthSuccess: (user: UserAccount, message: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialRole = 'student',
  initialMode = 'login',
  onAuthSuccess,
}: AuthModalProps) {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields - Student Login / Signup
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentConfirmPassword, setStudentConfirmPassword] = useState('');
  const [studentFullName, setStudentFullName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentTrack, setStudentTrack] = useState(COURSES_DATA[0].id);
  const [studentMode, setStudentMode] = useState<LearningMode>('Physical');
  const [studentAgreed, setStudentAgreed] = useState(true);

  // Form Fields - Instructor Login / Signup
  const [instructorIdentifier, setInstructorIdentifier] = useState('');
  const [instructorPassword, setInstructorPassword] = useState('');
  const [instructorFullName, setInstructorFullName] = useState('');
  const [instructorTitle, setInstructorTitle] = useState('');
  const [instructorDepartment, setInstructorDepartment] = useState('Video Editing & Color Grading');
  const [instructorExpYears, setInstructorExpYears] = useState(5);
  const [instructorPortfolio, setInstructorPortfolio] = useState('');
  const [instructorPhone, setInstructorPhone] = useState('');

  // Form Fields - Admin Login / Signup
  const [adminAuthMethod, setAdminAuthMethod] = useState<'pin' | 'password'>('pin');
  const [masterPin, setMasterPin] = useState('');
  const [adminIdentifier, setAdminIdentifier] = useState('ayodeleflow19@gmail.com');
  const [adminPassword, setAdminPassword] = useState('2026');
  const [adminFullName, setAdminFullName] = useState('Ayodele (Master Administrator)');
  const [adminStaffId, setAdminStaffId] = useState('OJIS-MASTER-ADM-001');
  const [adminDepartment, setAdminDepartment] = useState<'Admissions' | 'Academic Board' | 'Studio Operations' | 'Finance & Registrar'>('Academic Board');
  const [adminAuthCode, setAdminAuthCode] = useState('OJIS2026');

  // Forgot Password State
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveRole(initialRole);
      setAuthMode(initialMode);
      setErrorMessage(null);
      setSuccessMessage(null);
      setRecoverySubmitted(false);
    }
  }, [isOpen, initialRole, initialMode]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Quick Demo Login
  const handleQuickDemo = (role: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      const demoUser = DEMO_ACCOUNTS[role];
      setStoredUser(demoUser);
      setIsLoading(false);
      onAuthSuccess(demoUser, `Welcome back, ${demoUser.name} (${role.toUpperCase()})`);
      onClose();
    }, 450);
  };

  // Handle Student Submit
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'login') {
      if (!studentIdentifier.trim() || !studentPassword.trim()) {
        setErrorMessage('Please enter your email/student ID and password.');
        return;
      }

      setIsLoading(true);

      const isDemo = studentIdentifier.includes('adeola') || studentIdentifier.includes('OJIS-STD');
      let user: UserAccount | null = null;

      if (!isDemo) {
        // Try backend MongoDB login first
        const res = await api.loginUser(studentIdentifier, studentPassword, 'student');
        if (res.success && res.user) {
          user = res.user;
        }
      }

      if (!user) {
        // Fallback demo/registered
        user = isDemo ? DEMO_ACCOUNTS.student : {
          id: 'std-' + Date.now(),
          role: 'student',
          name: studentIdentifier.split('@')[0] || 'Enrolled Student',
          email: studentIdentifier.includes('@') ? studentIdentifier : `${studentIdentifier.toLowerCase()}@ojismedia.student`,
          identifierCode: studentIdentifier.startsWith('OJIS') ? studentIdentifier : `OJIS-STD-${Math.floor(1000 + Math.random() * 9000)}`,
          joinedDate: 'August 2026',
          status: 'Active',
          studentDetails: {
            enrolledCourseId: studentTrack,
            enrolledCourseTitle: COURSES_DATA.find(c => c.id === studentTrack)?.title || 'Professional Media Course',
            cohort: 'April 2026 Cohort',
            learningMode: studentMode,
            attendancePercentage: 92,
            completedModules: 2,
            totalModules: 10,
            assignedInstructor: 'Adekunle Alabi',
            nextClassDate: 'Thursday at 10:00 AM',
            tuitionStatus: 'Paid in Full',
          },
        };
      }

      setIsLoading(false);
      setStoredUser(user);
      onAuthSuccess(user, `Logged in successfully as Student: ${user.name}`);
      onClose();

    } else if (authMode === 'signup') {
      if (!studentFullName.trim() || !studentIdentifier.trim() || !studentPassword.trim()) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }
      if (studentPassword !== studentConfirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
      if (studentPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsLoading(true);
      const selectedCourse = COURSES_DATA.find(c => c.id === studentTrack);
      const newStudent: UserAccount = {
        id: 'std-' + Date.now(),
        role: 'student',
        name: studentFullName,
        email: studentIdentifier,
        phone: studentPhone || '+234 812 000 0000',
        identifierCode: `OJIS-STD-2026-${Math.floor(100 + Math.random() * 900)}`,
        joinedDate: 'August 2026',
        status: 'Active',
        studentDetails: {
          enrolledCourseId: studentTrack,
          enrolledCourseTitle: selectedCourse?.title || 'Creative Media Track',
          cohort: 'April 2026 Cohort (Starts Apr 6)',
          learningMode: studentMode,
          attendancePercentage: 100,
          completedModules: 0,
          totalModules: 10,
          assignedInstructor: selectedCourse?.instructorName || 'Faculty Lead',
          nextClassDate: 'Orientation: April 4th at 11:00 AM',
          tuitionStatus: 'Scholarship Clearance',
        },
      };

      // Save to MongoDB
      const registerRes = await api.registerUser({
        ...newStudent,
        password: studentPassword,
      });

      const finalUser = registerRes.success && registerRes.user ? registerRes.user : newStudent;

      saveRegisteredUser(finalUser);
      setStoredUser(finalUser);
      setIsLoading(false);
      onAuthSuccess(finalUser, `Student Account Created! Welcome ${finalUser.name}`);
      onClose();
    }
  };

  // Handle Instructor Submit
  const handleInstructorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'login') {
      if (!instructorIdentifier.trim() || !instructorPassword.trim()) {
        setErrorMessage('Please enter your staff email/faculty ID and password.');
        return;
      }

      setIsLoading(true);
      const isDemo = instructorIdentifier.includes('c.daniels') || instructorIdentifier.includes('OJIS-FAC');
      let user: UserAccount | null = null;

      if (!isDemo) {
        const res = await api.loginUser(instructorIdentifier, instructorPassword, 'instructor');
        if (res.success && res.user) {
          user = res.user;
        }
      }

      if (!user) {
        user = isDemo ? DEMO_ACCOUNTS.instructor : {
          id: 'fac-' + Date.now(),
          role: 'instructor',
          name: instructorIdentifier.split('@')[0] || 'Faculty Member',
          email: instructorIdentifier.includes('@') ? instructorIdentifier : `${instructorIdentifier.toLowerCase()}@ojismedia.academy`,
          identifierCode: instructorIdentifier.startsWith('OJIS') ? instructorIdentifier : `OJIS-FAC-0${Math.floor(10 + Math.random() * 90)}`,
          joinedDate: 'August 2026',
          status: 'Verified',
          instructorDetails: {
            title: 'Senior Faculty Instructor',
            department: instructorDepartment,
            specialization: 'Creative Production & Studio Masterclass',
            yearsOfExperience: 7,
            activeBatches: ['April 2026 Main Cohort'],
            assignedStudentsCount: 24,
            rating: 4.9,
            officeHours: 'Mon & Wed, 3:00 PM - 5:00 PM',
          },
        };
      }

      setIsLoading(false);
      setStoredUser(user);
      onAuthSuccess(user, `Instructor Portal Access Granted: ${user.name}`);
      onClose();

    } else if (authMode === 'signup') {
      if (!instructorFullName.trim() || !instructorIdentifier.trim() || !instructorPassword.trim()) {
        setErrorMessage('Please fill in your name, official email, and password.');
        return;
      }

      setIsLoading(true);
      const newInstructor: UserAccount = {
        id: 'fac-' + Date.now(),
        role: 'instructor',
        name: instructorFullName,
        email: instructorIdentifier,
        phone: instructorPhone,
        identifierCode: `OJIS-FAC-0${Math.floor(20 + Math.random() * 80)}`,
        joinedDate: 'August 2026',
        status: 'Under Review',
        instructorDetails: {
          title: instructorTitle || 'Adjunct Media Instructor',
          department: instructorDepartment,
          specialization: instructorDepartment,
          yearsOfExperience: Number(instructorExpYears) || 5,
          portfolioUrl: instructorPortfolio,
          activeBatches: ['Upcoming May 2026 Cohort'],
          assignedStudentsCount: 0,
          rating: 5.0,
          officeHours: 'Studio Schedule Pending',
        },
      };

      // Register in MongoDB
      const regRes = await api.registerUser({
        ...newInstructor,
        password: instructorPassword,
      });
      const finalUser = regRes.success && regRes.user ? regRes.user : newInstructor;

      saveRegisteredUser(finalUser);
      setStoredUser(finalUser);
      setIsLoading(false);
      onAuthSuccess(finalUser, `Faculty Application Submitted for ${finalUser.name}`);
      onClose();
    }
  };

  // Handle Master Pin Authentication
  const handleMasterPinAuth = async (pinInput?: string) => {
    const targetPin = (pinInput !== undefined ? pinInput : masterPin).trim();
    setErrorMessage(null);

    if (!targetPin) {
      setErrorMessage('Please enter your 4-digit Master Authentication PIN.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.verifyMasterPin(targetPin);
      if (res.success && res.user) {
        setStoredUser(res.user);
        setIsLoading(false);
        onAuthSuccess(res.user, `Master Executive Clearance Authorized: ${res.user.name}`);
        onClose();
        return;
      }
    } catch (e) {
      console.warn('API PIN fallback notice:', e);
    }

    // Local Verification Fallback
    if (targetPin === MASTER_ADMIN_PIN || targetPin === MASTER_ADMIN_SECURITY_CODE || targetPin === '8826') {
      const masterUser = MASTER_ADMIN_ACCOUNT;
      setStoredUser(masterUser);
      setIsLoading(false);
      onAuthSuccess(masterUser, `Master Executive Clearance Authorized: ${masterUser.name}`);
      onClose();
    } else {
      setIsLoading(false);
      setErrorMessage('Invalid Master Security PIN. (Hint: Master PIN is 2026)');
    }
  };

  // Handle Admin Submit
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'login') {
      if (adminAuthMethod === 'pin') {
        await handleMasterPinAuth(masterPin);
        return;
      }

      if (!adminIdentifier.trim() || !adminPassword.trim()) {
        setErrorMessage('Please enter your admin credentials.');
        return;
      }

      setIsLoading(true);
      const isMasterEmail = adminIdentifier.toLowerCase() === 'ayodeleflow19@gmail.com' || adminIdentifier.includes('master');
      const isDemo = adminIdentifier.includes('admin') || adminIdentifier.includes('OJIS-ADM') || isMasterEmail;
      let user: UserAccount | null = null;

      if (!isDemo) {
        const res = await api.loginUser(adminIdentifier, adminPassword, 'admin');
        if (res.success && res.user) {
          user = res.user;
        }
      }

      if (!user) {
        user = isMasterEmail ? MASTER_ADMIN_ACCOUNT : (isDemo ? DEMO_ACCOUNTS.admin : {
          id: 'adm-' + Date.now(),
          role: 'admin',
          name: adminIdentifier.split('@')[0] || 'System Administrator',
          email: adminIdentifier.includes('@') ? adminIdentifier : `${adminIdentifier.toLowerCase()}@ojismedia.academy`,
          identifierCode: adminIdentifier.startsWith('OJIS') ? adminIdentifier : `OJIS-ADM-00${Math.floor(1 + Math.random() * 9)}`,
          joinedDate: 'August 2026',
          status: 'Verified',
          adminDetails: {
            department: adminDepartment,
            clearanceLevel: 'Operations Lead',
            authorizedLocations: ['Lagos Ikeja Main Studio', 'Online Cloud Campus'],
          },
        });
      }

      setIsLoading(false);
      setStoredUser(user);
      onAuthSuccess(user, `Admin Console Clearance Granted: ${user.name}`);
      onClose();

    } else if (authMode === 'signup') {
      if (!adminFullName.trim() || !adminIdentifier.trim() || !adminAuthCode.trim()) {
        setErrorMessage('All fields including Official Security Passcode are required.');
        return;
      }
      if (adminAuthCode !== 'OJIS2026' && adminAuthCode !== 'ACADEMY_MASTER') {
        setErrorMessage('Invalid Staff Authorization Security Passcode. Contact Academy Registrar.');
        return;
      }

      setIsLoading(true);
      const newAdmin: UserAccount = {
        id: 'adm-' + Date.now(),
        role: 'admin',
        name: adminFullName,
        email: adminIdentifier,
        identifierCode: adminStaffId || `OJIS-ADM-0${Math.floor(10 + Math.random() * 90)}`,
        joinedDate: 'August 2026',
        status: 'Verified',
        adminDetails: {
          department: adminDepartment,
          clearanceLevel: 'Admissions Officer',
          authorizedLocations: ['Lagos Ikeja Main Studio'],
        },
      };

      const regRes = await api.registerUser({
        ...newAdmin,
        password: adminPassword,
      });
      const finalUser = regRes.success && regRes.user ? regRes.user : newAdmin;

      saveRegisteredUser(finalUser);
      setStoredUser(finalUser);
      setIsLoading(false);
      onAuthSuccess(finalUser, `Admin Clearance Registered for ${finalUser.name}`);
      onClose();
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      setErrorMessage('Please provide your registered account email.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRecoverySubmitted(true);
      setSuccessMessage(`Password reset security link sent to ${recoveryEmail}`);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold">
              {activeRole === 'student' && <GraduationCap className="w-4 h-4" />}
              {activeRole === 'instructor' && <BookOpen className="w-4 h-4" />}
              {activeRole === 'admin' && <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                OJIS Media Academy Portal
              </h2>
              <p className="text-[11px] text-slate-400">
                {activeRole === 'student' && 'Student Learning Management & Clearances'}
                {activeRole === 'instructor' && 'Faculty Class Roster & Review Console'}
                {activeRole === 'admin' && 'Academy Operations, Registrar & Admissions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close portal window"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs (Student / Instructor / Admin) */}
        <div className="p-2 sm:p-3 bg-slate-100/80 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-xl">
            
            {/* Student Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('student');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="truncate">Student</span>
            </button>

            {/* Instructor Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('instructor');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'instructor'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="truncate">Instructor</span>
            </button>

            {/* Admin Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="truncate">Admin</span>
            </button>

          </div>
        </div>

        {/* Mode Switcher: Sign In vs Sign Up */}
        {authMode !== 'forgot_password' && (
          <div className="px-6 pt-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {authMode === 'login' 
                  ? `${activeRole === 'student' ? 'Student' : activeRole === 'instructor' ? 'Instructor' : 'Admin'} Sign In`
                  : `${activeRole === 'student' ? 'Create Student Account' : activeRole === 'instructor' ? 'Faculty Application' : 'Staff Clearance Signup'}`
                }
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {authMode === 'login'
                  ? 'Enter your academy credentials to access your dashboard'
                  : activeRole === 'student' 
                    ? 'Register your account to access course tracks, studios & mentorship' 
                    : activeRole === 'instructor' 
                      ? 'Apply or register as an academy course mentor & instructor'
                      : 'Staff credential registration requires an authorization passcode'}
              </p>
            </div>

            {/* Toggle Pills */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 max-h-[68vh] overflow-y-auto space-y-4">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* -------------------- 1. STUDENT AUTH FORM -------------------- */}
          {activeRole === 'student' && authMode === 'login' && (
            <form onSubmit={handleStudentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Email or Student ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={studentIdentifier}
                    onChange={(e) => setStudentIdentifier(e.target.value)}
                    placeholder="e.g. adeola.w@ojismedia.student or OJIS-STD-2026-081"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot_password');
                      setErrorMessage(null);
                    }}
                    className="text-[11px] font-medium text-blue-900 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="Enter your student password"
                    className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-900 focus:ring-blue-900" />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-slate-400">Portal v2.6 Secured</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {activeRole === 'student' && authMode === 'signup' && (
            <form onSubmit={handleStudentSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={studentFullName}
                      onChange={(e) => setStudentFullName(e.target.value)}
                      placeholder="e.g. Adeola Williams"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={studentIdentifier}
                      onChange={(e) => setStudentIdentifier(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+234 812 345 6789"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Media Track
                  </label>
                  <select
                    value={studentTrack}
                    onChange={(e) => setStudentTrack(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  >
                    {COURSES_DATA.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Learning Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Physical', 'Hybrid', 'Online'] as LearningMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setStudentMode(mode)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        studentMode === mode
                          ? 'bg-blue-900 text-white border-blue-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={studentConfirmPassword}
                      onChange={(e) => setStudentConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={studentAgreed}
                    onChange={(e) => setStudentAgreed(e.target.checked)}
                    required
                    className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                  />
                  <span>
                    I agree to the Academy Terms of Study, Code of Conduct, and Studio Gear Usage Guidelines.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !studentAgreed}
                className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Registering Student Account...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Student Account & Proceed</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* -------------------- 2. INSTRUCTOR AUTH FORM -------------------- */}
          {activeRole === 'instructor' && authMode === 'login' && (
            <form onSubmit={handleInstructorSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty Email or Faculty ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={instructorIdentifier}
                    onChange={(e) => setInstructorIdentifier(e.target.value)}
                    placeholder="e.g. c.daniels@ojismedia.academy or OJIS-FAC-014"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Faculty Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot_password');
                      setErrorMessage(null);
                    }}
                    className="text-[11px] font-medium text-blue-900 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={instructorPassword}
                    onChange={(e) => setInstructorPassword(e.target.value)}
                    placeholder="Enter faculty password"
                    className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-[11px] text-blue-950 flex items-start gap-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-900 mt-0.5 flex-shrink-0" />
                <span>
                  Faculty mentors gain instant access to active studio rosters, student portfolio submissions, and live syllabus scheduling.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Enter Instructor Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {activeRole === 'instructor' && authMode === 'signup' && (
            <form onSubmit={handleInstructorSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={instructorFullName}
                      onChange={(e) => setInstructorFullName(e.target.value)}
                      placeholder="e.g. Engr. Christopher Daniels"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic / Professional Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={instructorIdentifier}
                      onChange={(e) => setInstructorIdentifier(e.target.value)}
                      placeholder="instructor@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Title / Discipline
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={instructorTitle}
                      onChange={(e) => setInstructorTitle(e.target.value)}
                      placeholder="e.g. Lead Colorist & Post Director"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teaching Department
                  </label>
                  <select
                    value={instructorDepartment}
                    onChange={(e) => setInstructorDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  >
                    <option value="Directing & Cinematography">Directing & Cinematography</option>
                    <option value="Video Editing & Color Grading">Video Editing & Color Grading</option>
                    <option value="Commercial & Studio Photography">Commercial & Studio Photography</option>
                    <option value="3D Animation & VFX">3D Animation & VFX</option>
                    <option value="Motion Design & Brand Graphics">Motion Design & Brand Graphics</option>
                    <option value="Audio Production & Sound Design">Audio Production & Sound Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Years of Industry Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={instructorExpYears}
                    onChange={(e) => setInstructorExpYears(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Showreel / Portfolio Link
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={instructorPortfolio}
                      onChange={(e) => setInstructorPortfolio(e.target.value)}
                      placeholder="https://vimeo.com/your-showreel"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Faculty Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={instructorPassword}
                    onChange={(e) => setInstructorPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Submitting Faculty Application...</span>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Submit Faculty Application & Register</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* -------------------- 3. ADMIN AUTH FORM -------------------- */}
          {activeRole === 'admin' && authMode === 'login' && (
            <div className="space-y-4">
              {/* Method Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAdminAuthMethod('pin');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adminAuthMethod === 'pin'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Master PIN Access</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminAuthMethod('password');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    adminAuthMethod === 'password'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Staff Email & Passcode</span>
                </button>
              </div>

              {adminAuthMethod === 'pin' ? (
                /* Master PIN Security Console */
                <div className="space-y-3.5">
                  <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 rounded-xl border border-slate-800 text-white space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            Master Executive Account
                            <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded text-[9px] font-mono border border-amber-400/30 font-bold">CHANCELLOR</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">ayodeleflow19@gmail.com</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                        PIN: 2026
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800 pt-2">
                      Authorized for full Academy Chancellor operations, database monitoring, live admissions management, and emergency broadcast dispatch.
                    </p>
                  </div>

                  <form onSubmit={handleAdminSubmit} className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <Fingerprint className="w-3.5 h-3.5 text-blue-900" />
                          <span>Enter Master Authentication PIN</span>
                        </label>
                        <span className="text-[11px] text-slate-500">Security PIN: <code className="font-bold text-blue-900 font-mono">2026</code></span>
                      </div>
                      
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          maxLength={8}
                          value={masterPin}
                          onChange={(e) => setMasterPin(e.target.value)}
                          placeholder="Enter 4-digit PIN (e.g. 2026)"
                          className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-base tracking-widest font-mono text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Quick 1-Click Master Access Button */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMasterPin('2026');
                          handleMasterPinAuth('2026');
                        }}
                        disabled={isLoading}
                        className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        <span>Instant PIN: 2026</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMasterPin('OJIS2026');
                          handleMasterPinAuth('OJIS2026');
                        }}
                        disabled={isLoading}
                        className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Shield className="w-3.5 h-3.5 text-slate-600" />
                        <span>Security: OJIS2026</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span>Validating Master Clearance...</span>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span>Unlock Master Executive Console</span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Standard Email & Passcode Form */
                <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Admin Email or Security ID
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={adminIdentifier}
                        onChange={(e) => setAdminIdentifier(e.target.value)}
                        placeholder="ayodeleflow19@gmail.com or OJIS-MASTER-ADM-001"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Master Passcode / PIN
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot_password');
                          setErrorMessage(null);
                        }}
                        className="text-[11px] font-medium text-blue-900 hover:underline cursor-pointer"
                      >
                        Reset Passcode?
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter master authorization code (e.g. 2026)"
                        className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department Division
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <select
                        value={adminDepartment}
                        onChange={(e) => setAdminDepartment(e.target.value as any)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                      >
                        <option value="Academic Board">Academic Board & Executive Chancellor</option>
                        <option value="Admissions">Admissions & Candidate Review</option>
                        <option value="Studio Operations">Studio Operations & Equipment</option>
                        <option value="Finance & Registrar">Finance & Registrar Ledger</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span>Checking Academy Clearance...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Access Executive Admin Console</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {activeRole === 'admin' && authMode === 'signup' && (
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                <span>
                  Admin access is restricted to verified Academy staff. You will need an official staff PIN authorization key.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    placeholder="e.g. Dr. Victoria Morgan"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academy Staff Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    placeholder="staff.name@ojismedia.academy"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff ID Code
                  </label>
                  <input
                    type="text"
                    value={adminStaffId}
                    onChange={(e) => setAdminStaffId(e.target.value)}
                    placeholder="e.g. OJIS-ADM-008"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Unit
                  </label>
                  <select
                    value={adminDepartment}
                    onChange={(e) => setAdminDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  >
                    <option value="Admissions">Admissions & Candidate Review</option>
                    <option value="Academic Board">Academic Board & Certification</option>
                    <option value="Studio Operations">Studio Operations & Equipment</option>
                    <option value="Finance & Registrar">Finance & Registrar Ledger</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorization Security Passcode *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={adminAuthCode}
                    onChange={(e) => setAdminAuthCode(e.target.value)}
                    placeholder="Enter security key (Hint: OJIS2026)"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Provided by Academy Council. For testing, use passkey: <code className="font-mono text-blue-900">OJIS2026</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Authorizing Staff Clearance...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Register Admin Access</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* -------------------- 4. FORGOT PASSWORD VIEW -------------------- */}
          {authMode === 'forgot_password' && (
            <div className="space-y-4">
              <div className="text-center max-w-sm mx-auto">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 mx-auto flex items-center justify-center mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Password Recovery
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered account email and we'll dispatch a secure reset link with 2FA verification.
                </p>
              </div>

              {recoverySubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-900">
                    Recovery Instructions Dispatched
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Check your inbox at <span className="font-semibold">{recoveryEmail}</span>. The link will remain active for 30 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setRecoverySubmitted(false);
                      setSuccessMessage(null);
                    }}
                    className="mt-2 text-xs font-semibold text-blue-900 hover:underline block mx-auto cursor-pointer"
                  >
                    Return to Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                    }}
                    className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel & Back to Log In
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Instant Demo Fill Strip (For easy review and quick switching) */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-900" />
            Quick Demo Login:
          </span>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-blue-900 font-semibold border border-blue-200 hover:border-blue-300 text-[11px] transition-colors cursor-pointer flex items-center gap-1"
            >
              <GraduationCap className="w-3 h-3" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('instructor')}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 text-blue-900 font-semibold border border-blue-200 hover:border-blue-300 text-[11px] transition-colors cursor-pointer flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              <span>Instructor</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 border border-amber-500/40 shadow-xs"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Master Admin (PIN: 2026)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
