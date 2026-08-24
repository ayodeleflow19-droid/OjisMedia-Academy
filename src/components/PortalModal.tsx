import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  User, 
  LogOut, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Award, 
  Camera, 
  Video, 
  Users, 
  QrCode, 
  Laptop, 
  Bell, 
  Send,
  Star,
  Check,
  Database,
  Server,
  Crown,
  Zap,
  UserPlus,
  Shield,
  MessageSquare,
  AlertTriangle,
  LayoutDashboard
} from 'lucide-react';
import { UserAccount, UserDirectMessage } from '../types';
import { api, DatabaseHealthResponse } from '../lib/api';
import { MasterUserManagement } from './MasterUserManagement';
import { MasterCategoryManagement } from './MasterCategoryManagement';
import { AdminCourseManagement } from './AdminCourseManagement';
import { getStoredUser, setStoredUser, getRegisteredUsers } from '../data/authDemoData';

interface PortalModalProps {
  user: UserAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export function PortalModal({
  user,
  isOpen,
  onClose,
  onLogout,
  onSwitchRole,
}: PortalModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'categories' | 'courses' | 'classes' | 'submissions' | 'id_card' | 'admissions' | 'analytics'>('overview');
  const [dbHealth, setDbHealth] = useState<DatabaseHealthResponse | null>(null);
  const [currentUserData, setCurrentUserData] = useState<UserAccount | null>(user);
  const [attendanceMarked, setAttendanceMarked] = useState<Record<string, boolean>>({
    'std-1': true,
    'std-2': true,
    'std-3': false,
    'std-4': true,
  });
  const [approvedAdmissions, setApprovedAdmissions] = useState<Record<string, boolean>>({
    'adm-101': true,
    'adm-102': false,
    'adm-103': true,
  });
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      api.checkHealth().then(data => {
        if (data) setDbHealth(data);
      });

      // Refresh current user data from storage to pick up new direct messages / updates
      if (user) {
        const freshUser = getStoredUser() || user;
        const all = getRegisteredUsers();
        const found = all.find(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
        setCurrentUserData(found || freshUser);
      }
    }
  }, [isOpen, user]);

  if (!isOpen || !currentUserData) return null;

  const isMasterChancellor = currentUserData.role === 'admin' && (
    currentUserData.adminDetails?.clearanceLevel === 'Master Executive Director & Chancellor' ||
    currentUserData.identifierCode === 'OJIS-MASTER-ADM-001' ||
    currentUserData.email === 'ayodeleflow19@gmail.com'
  );

  const directMessages: UserDirectMessage[] = currentUserData.directMessages || [];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top App Bar */}
        <div className={`text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b ${
          isMasterChancellor 
            ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border-amber-500/30' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-xs ${
              isMasterChancellor
                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-slate-950 border border-amber-300 shadow-md ring-2 ring-amber-400/30'
                : currentUserData.role === 'admin' 
                ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-amber-100 border border-amber-400/40' 
                : 'bg-blue-900'
            }`}>
              {currentUserData.role === 'student' && <GraduationCap className="w-5 h-5" />}
              {currentUserData.role === 'instructor' && <BookOpen className="w-5 h-5" />}
              {currentUserData.role === 'admin' && <Crown className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {currentUserData.name}
                </h2>
                {isMasterChancellor ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] uppercase font-extrabold tracking-wider flex items-center gap-1 shadow-xs">
                    <Crown className="w-3 h-3 fill-slate-950" />
                    MASTER CHANCELLOR
                  </span>
                ) : currentUserData.role === 'admin' ? (
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    Admin Staff
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] uppercase font-bold tracking-wider">
                    {currentUserData.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 flex flex-wrap items-center gap-2">
                <span className="font-mono text-amber-300/90 font-medium">ID: {currentUserData.identifierCode}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Full Master Clearance
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchRole}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer hidden sm:inline-flex"
            >
              Switch Role
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-medium border border-red-800/40 transition-colors cursor-pointer flex items-center gap-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation - Fully Responsive & Professionally Aligned */}
        <div className="bg-slate-100/90 border-b border-slate-200 p-2 sm:p-2.5">
          <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 opacity-85" />
              <span className="truncate">Executive Dashboard</span>
            </button>

            {currentUserData.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'users'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white hover:bg-blue-50/60 text-slate-800 hover:text-blue-950 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Users className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${activeTab === 'users' ? 'text-blue-200' : 'text-blue-900'}`} />
                    <span className="truncate">User Directory</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold flex-shrink-0 ${
                    activeTab === 'users'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-amber-100 text-amber-900 border border-amber-300/80'
                  }`}>
                    Master Power
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'categories'
                      ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                      : 'bg-white hover:bg-amber-50/60 text-slate-800 hover:text-amber-950 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Crown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${activeTab === 'categories' ? 'text-slate-950' : 'text-amber-700'}`} />
                    <span className="truncate">Categories</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold flex-shrink-0 ${
                    activeTab === 'categories'
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-amber-200/80 text-amber-950 border border-amber-300'
                  }`}>
                    Master
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'courses'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <BookOpen className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${activeTab === 'courses' ? 'text-blue-200' : 'text-blue-900'}`} />
                    <span className="truncate">Courses</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold flex-shrink-0 ${
                    activeTab === 'courses'
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}>
                    Admin
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('admissions')}
                  className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'admissions'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 opacity-85" />
                  <span className="truncate">Admissions Review</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'analytics'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 opacity-85" />
                  <span className="truncate">Studio Ops</span>
                </button>
              </>
            )}

            {currentUserData.role === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('classes')}
                  className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'classes'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 opacity-85" />
                  <span className="truncate">Schedule & Syllabus</span>
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'submissions'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 opacity-85" />
                  <span className="truncate">Project Submissions</span>
                </button>
                <button
                  onClick={() => setActiveTab('id_card')}
                  className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'id_card'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 opacity-85" />
                  <span className="truncate">Digital Student ID</span>
                </button>
              </>
            )}

            {currentUserData.role === 'instructor' && (
              <>
                <button
                  onClick={() => setActiveTab('classes')}
                  className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'classes'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 opacity-85" />
                  <span className="truncate">Cohort Roster</span>
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                    activeTab === 'submissions'
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 opacity-85" />
                  <span className="truncate">Grade Works</span>
                </button>

                {/* Authorized Instructor Course Creation Tab */}
                {currentUserData.instructorDetails?.canCreateCourses && (
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                      activeTab === 'courses'
                        ? 'bg-purple-900 text-white shadow-xs'
                        : 'bg-white hover:bg-purple-50/60 text-purple-950 border border-purple-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${activeTab === 'courses' ? 'text-purple-200' : 'text-purple-600'}`} />
                      <span className="truncate">Author Courses</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold flex-shrink-0 ${
                      activeTab === 'courses'
                        ? 'bg-purple-200 text-purple-950'
                        : 'bg-purple-100 text-purple-900 border border-purple-300'
                    }`}>
                      Authorized
                    </span>
                  </button>
                )}
              </>
            )}

          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 sm:p-6 max-h-[68vh] overflow-y-auto">
          
          {/* ======================= 0A. MASTER USER & FACULTY MANAGEMENT TAB ======================= */}
          {activeTab === 'users' && currentUserData.role === 'admin' && (
            <MasterUserManagement 
              currentUser={currentUserData}
              onUserListChanged={() => {
                const fresh = getStoredUser();
                if (fresh) setCurrentUserData(fresh);
              }}
            />
          )}

          {/* ======================= 0B. MASTER CATEGORY MANAGEMENT TAB ======================= */}
          {activeTab === 'categories' && (currentUserData.role === 'admin' || isMasterChancellor) && (
            <MasterCategoryManagement 
              currentUser={currentUserData}
              onCategoryListChanged={() => {
                const fresh = getStoredUser();
                if (fresh) setCurrentUserData(fresh);
              }}
            />
          )}

          {/* ======================= 0C. ADMIN & INSTRUCTOR COURSE MANAGEMENT TAB ======================= */}
          {activeTab === 'courses' && (currentUserData.role === 'admin' || currentUserData.instructorDetails?.canCreateCourses) && (
            <AdminCourseManagement 
              currentUser={currentUserData}
              onCourseListChanged={() => {
                const fresh = getStoredUser();
                if (fresh) setCurrentUserData(fresh);
              }}
            />
          )}

          {/* ======================= 1. OVERVIEW TAB ======================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Student Overview Header Card */}
              {currentUserData.role === 'student' && currentUserData.studentDetails && (
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                          Active Enrolled Track
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                          {currentUserData.studentDetails.enrolledCourseTitle}
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                        {currentUserData.studentDetails.tuitionStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Cohort Schedule</span>
                        <span className="font-semibold">{currentUserData.studentDetails.cohort}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Learning Mode</span>
                        <span className="font-semibold">{currentUserData.studentDetails.learningMode} Studio</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Studio Attendance</span>
                        <span className="font-semibold text-emerald-400">{currentUserData.studentDetails.attendancePercentage}% Verified</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Curriculum Milestone</span>
                        <span className="font-semibold">{currentUserData.studentDetails.completedModules} of {currentUserData.studentDetails.totalModules} Modules</span>
                      </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">Overall Track Completion</span>
                        <span className="text-emerald-400 font-bold">
                          {Math.round(((currentUserData.studentDetails.completedModules || 0) / (currentUserData.studentDetails.totalModules || 8)) * 100)}% Complete
                        </span>
                      </div>
                      <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, Math.round(((currentUserData.studentDetails.completedModules || 0) / (currentUserData.studentDetails.totalModules || 8)) * 100))}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructor Overview Header Card */}
              {currentUserData.role === 'instructor' && currentUserData.instructorDetails && (
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                        {currentUserData.instructorDetails.department}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                        {currentUserData.instructorDetails.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>{currentUserData.instructorDetails.rating} Faculty Score</span>
                      </span>
                      {currentUserData.instructorDetails.canCreateCourses && (
                        <button
                          onClick={() => setActiveTab('courses')}
                          className="px-3 py-1 rounded-full bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 border border-purple-400/50 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-purple-300" />
                          <span>Author Courses</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Assigned Students</span>
                      <span className="font-semibold">{currentUserData.instructorDetails.assignedStudentsCount} Active Creatives</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Industry Track Record</span>
                      <span className="font-semibold">{currentUserData.instructorDetails.yearsOfExperience} Years Commercial Experience</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Active Batches</span>
                      <span className="font-semibold">{currentUserData.instructorDetails.activeBatches.length} Cohorts Assigned</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Office & Mentorship Hours</span>
                      <span className="font-semibold">{currentUserData.instructorDetails.officeHours}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Master Admin Overview Header Card */}
              {currentUserData.role === 'admin' && currentUserData.adminDetails && (
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-amber-500/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{currentUserData.adminDetails.clearanceLevel}</span>
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1">
                        Academy Executive Governance Suite
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setActiveTab('users')}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Users & Faculty</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('categories')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Discipline Categories</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('courses')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Courses Catalog</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-amber-500/20 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Authority Level</span>
                      <span className="font-semibold text-amber-300">Supreme Academic Clearance</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">User Control</span>
                      <span className="font-semibold text-emerald-400">Full CRUD & Suspension</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Direct Alert Network</span>
                      <span className="font-semibold text-blue-300">Targeted Messaging Live</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Campus Hubs</span>
                      <span className="font-semibold">{currentUserData.adminDetails.authorizedLocations.length} Facilities Monitored</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Messages & Executive Directives Inbox (For all roles) */}
              {directMessages.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-amber-600" />
                      <span>Direct Executive Alerts & Directives ({directMessages.length})</span>
                    </h4>
                    <span className="text-[10px] text-amber-900 font-semibold bg-amber-200/70 px-2 py-0.5 rounded">
                      Chancellor Dispatch
                    </span>
                  </div>

                  <div className="space-y-2">
                    {directMessages.map((msg) => (
                      <div key={msg.id} className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              msg.priority === 'urgent' ? 'bg-red-100 text-red-900 border border-red-200' :
                              msg.priority === 'high' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                              'bg-blue-100 text-blue-900'
                            }`}>
                              {msg.priority === 'urgent' ? 'URGENT EXECUTIVE' : msg.priority === 'high' ? 'HIGH PRIORITY' : 'DIRECT NOTICE'}
                            </span>
                            <strong className="text-xs font-bold text-slate-900">{msg.subject}</strong>
                          </div>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed pt-1">
                          {msg.message}
                        </p>
                        <span className="text-[10px] text-blue-900 font-semibold block pt-0.5">
                          From: {msg.senderName} ({msg.senderRole})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions & Live Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Column 1: Studio Schedule / Live Notice */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-900" />
                      <span>Upcoming Academy Sessions</span>
                    </h4>
                    <span className="text-[10px] text-blue-900 font-semibold bg-blue-100 px-2 py-0.5 rounded">Live Schedule</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start justify-between gap-2">
                      <div>
                        <strong className="text-slate-900 block text-xs">Soundstage Masterclass: Lighting & Gimbals</strong>
                        <span className="text-slate-500 text-[11px]">Physical Main Studio A • Instructor Adekunle Alabi</span>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-900 whitespace-nowrap">Tomorrow, 10 AM</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start justify-between gap-2">
                      <div>
                        <strong className="text-slate-900 block text-xs">DaVinci Resolve Color Grade Peer Review</strong>
                        <span className="text-slate-500 text-[11px]">Computer Lab 2 / Virtual Stream • Engr. Daniels</span>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-900 whitespace-nowrap">Friday, 2 PM</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Studio Status & Workstation Pass */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-blue-900" />
                      <span>Studio Equipment & Lab Clearance</span>
                    </h4>
                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">Authorized</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-semibold text-slate-900 block">Sony FX3 & Cinema Primes</span>
                          <span className="text-[10px] text-slate-500">Camera Rig Bay #04</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium">Ready</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-semibold text-slate-900 block">Mac Studio M2 Max Workstation</span>
                          <span className="text-[10px] text-slate-500">Editing Suite #09</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium">Reserved</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================= 2. CLASSES / ROSTER TAB ======================= */}
          {activeTab === 'classes' && currentUserData.role === 'student' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Curriculum Syllabus & Weekly Milestones</h3>
                  <p className="text-xs text-slate-500">Track your weekly modules, class attendance, and practical projects</p>
                </div>
                <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  4 of 12 Modules Completed
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { week: 'Week 1-2', title: 'Camera Fundamentals, Sensor Science & Exposure Triangle', status: 'Completed', grade: '94%' },
                  { week: 'Week 3-4', title: 'Visual Composition, 3-Point Lighting & Grips Setup', status: 'Completed', grade: '98%' },
                  { week: 'Week 5-6', title: 'Cinematography in Motion: Gimbals, Dollys & Focus Pulling', status: 'In Progress (Active)', grade: 'Pending Review' },
                  { week: 'Week 7-8', title: 'Audio Capture, Boom Operation & Wireless Lavalier Systems', status: 'Upcoming', grade: '-' },
                  { week: 'Week 9-10', title: 'NLE Video Editing Workflow & Assembly Cuts', status: 'Upcoming', grade: '-' },
                  { week: 'Week 11-12', title: 'Graduation Capstone Short Film & Showreel Master', status: 'Upcoming', grade: '-' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase text-slate-500">{item.week}</span>
                          {item.status.includes('Completed') && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Passed</span>
                          )}
                          {item.status.includes('Active') && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 text-[10px] font-bold">In Session</span>
                          )}
                        </div>
                        <strong className="text-slate-900 block text-xs sm:text-sm">{item.title}</strong>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-slate-500 block">Grade</span>
                      <strong className="text-blue-900 font-semibold">{item.grade}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'classes' && currentUserData.role === 'instructor' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Today's Class Attendance & Studio Register</h3>
                  <p className="text-xs text-slate-500">April 2026 Morning Batch • Post-Production & Color Studio</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Live Attendance Logger
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'std-1', name: 'Adeola Williams', email: 'adeola.w@ojismedia.student', track: 'Cinematography', gearCheck: 'Sony FX3 checked out' },
                  { id: 'std-2', name: 'Tunde Bakare', email: 'tunde.b@ojismedia.student', track: 'Video Editing', gearCheck: 'Mac Studio #03' },
                  { id: 'std-3', name: 'Ngozi Okonjo', email: 'ngozi.o@ojismedia.student', track: 'Commercial Photo', gearCheck: 'Canon R5 + Profoto Bay' },
                  { id: 'std-4', name: 'Chukwuma David', email: 'c.david@ojismedia.student', track: 'Motion Design', gearCheck: 'Wacom Cintiq Pro #01' },
                ].map((student) => {
                  const isPresent = attendanceMarked[student.id] ?? false;
                  return (
                    <div key={student.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-slate-900 block text-xs">{student.name}</strong>
                          <span className="text-[11px] text-slate-500">{student.track} • {student.gearCheck}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAttendanceMarked({ ...attendanceMarked, [student.id]: !isPresent })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isPresent 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {isPresent ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isPresent ? 'Marked Present' : 'Mark Absent'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= 3. SUBMISSIONS TAB ======================= */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {currentUserData.role === 'student' ? 'My Creative Project Uploads' : 'Student Capstone Reviews & Grading'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showreel submissions, color grading passes, and photography portfolios
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-blue-900 uppercase">Assignment #03</span>
                    <h4 className="text-sm font-bold text-slate-900">Commercial 60s Spec Ad Color Grade</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Submitted via Vimeo & DaVinci XML by Adeola Williams</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Score: 95/100
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Mentor Feedback</span>
                  <p className="text-slate-700 italic">
                    "Superb 3-point lighting setup and color grading depth. Skin tones are properly isolated in Rec.709 space with natural roll-off."
                  </p>
                  <span className="text-[10px] text-blue-900 font-semibold block pt-1">— Engr. Christopher Daniels (Lead Instructor)</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================= 4. DIGITAL STUDENT ID CARD TAB ======================= */}
          {activeTab === 'id_card' && currentUserData.role === 'student' && (
            <div className="space-y-4">
              <div className="text-center max-w-sm mx-auto">
                <h3 className="text-sm font-bold text-slate-900">Official Student Identity Pass</h3>
                <p className="text-xs text-slate-500">Authorized for studio entry, equipment checkout & lab workstations</p>
              </div>

              {/* Digital Pass Card */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-2xl border border-blue-700/40 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block leading-none">OJIS MEDIA ACADEMY</span>
                      <span className="text-[9px] text-blue-300">STUDENT IDENTITY PASS</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded font-bold">
                    ACTIVE 2026
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={currentUserData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                    alt={currentUserData.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/30 flex-shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <h4 className="text-base font-bold text-white leading-tight">{currentUserData.name}</h4>
                    <p className="text-blue-300 font-mono text-[11px]">{currentUserData.identifierCode}</p>
                    <p className="text-slate-300 text-[11px]">{currentUserData.studentDetails?.enrolledCourseTitle}</p>
                    <span className="inline-block px-2 py-0.5 bg-white/10 rounded text-[10px] font-semibold text-slate-200">
                      {currentUserData.studentDetails?.learningMode} Campus Track
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Issued: March 2026</span>
                  <span>Valid: Main Soundstages & Labs</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================= 5. ADMIN ADMISSIONS DESK TAB ======================= */}
          {activeTab === 'admissions' && currentUserData.role === 'admin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student Admissions & Enrollment Approval</h3>
                  <p className="text-xs text-slate-500">Review incoming student enrollment requests and generate official admission clearance</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'adm-101', name: 'Emeka Nwosu', email: 'emeka.n@gmail.com', course: 'Filmmaking & Cinematography', mode: 'Physical', ref: 'OJIS-2026-8812' },
                  { id: 'adm-102', name: 'Amina Bello', email: 'amina.b@yahoo.com', course: 'Commercial Photography', mode: 'Hybrid', ref: 'OJIS-2026-8813' },
                  { id: 'adm-103', name: 'Babajide Fashola', email: 'jide.f@gmail.com', course: 'Motion Design & VFX', mode: 'Online', ref: 'OJIS-2026-8814' },
                ].map((item) => {
                  const isApproved = approvedAdmissions[item.id] ?? false;
                  return (
                    <div key={item.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-blue-900 font-bold">{item.ref}</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold">{item.mode}</span>
                        </div>
                        <strong className="text-slate-900 text-sm block mt-0.5">{item.name}</strong>
                        <span className="text-slate-500 text-[11px]">{item.course} • {item.email}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setApprovedAdmissions({ ...approvedAdmissions, [item.id]: !isApproved })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isApproved 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-blue-900 text-white hover:bg-blue-800'
                        }`}
                      >
                        {isApproved ? 'Admitted & Cleared' : 'Approve Admission'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================= 6. ADMIN OPERATIONS & BROADCAST ======================= */}
          {activeTab === 'analytics' && currentUserData.role === 'admin' && (
            <div className="space-y-4">
              {/* Database & Infrastructure Status */}
              <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Database Engine: MongoDB</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                    dbHealth?.database.connected 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {dbHealth?.database.connected ? 'Cluster Connected' : 'Ready (URI Configured)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Database</span>
                    <span className="font-mono text-slate-200 font-semibold">{dbHealth?.database.databaseName || 'ojis_media_academy'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Active Collections</span>
                    <span className="text-slate-200 font-semibold">{dbHealth?.database.collections?.length || 6} Collections</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Persistence</span>
                    <span className="text-emerald-300 font-semibold">MongoDB Atlas / Cloud</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">Academy Broadcast & Emergency Announcement</h3>
                <p className="text-xs text-slate-500">Dispatch instant notifications to all active students, instructors, and studio labs</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Masterclass with Guest Director scheduled for Saturday 11:00 AM on Main Soundstage A..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900 resize-none h-24"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Audience: All Academy Students, Faculty & Staff</span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (broadcastMessage.trim()) {
                        setBroadcastSent(true);
                        await api.sendBroadcast({
                          message: broadcastMessage.trim(),
                          sender: `${currentUserData.name} (Admin Operations)`
                        });
                        setTimeout(() => {
                          setBroadcastSent(false);
                          setBroadcastMessage('');
                        }, 3000);
                      }
                    }}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{broadcastSent ? 'Announcement Dispatched!' : 'Broadcast to Academy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Connected as <strong className="text-slate-800">{currentUserData.email}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
