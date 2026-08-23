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
  Server
} from 'lucide-react';
import { UserAccount } from '../types';
import { api, DatabaseHealthResponse } from '../lib/api';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'submissions' | 'id_card' | 'admissions' | 'analytics'>('overview');
  const [dbHealth, setDbHealth] = useState<DatabaseHealthResponse | null>(null);
  const [attendanceMarked, setAttendanceMarked] = useState<Record<string, boolean>>({
    'std-1': true,
    'std-2': true,
    'std-3': false,
    'std-4': true,
  });
  const [gradedProjects, setGradedProjects] = useState<Record<string, { score: number; feedback: string }>>({
    'proj-1': { score: 95, feedback: 'Superb 3-point lighting setup and color grading depth.' }
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
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top App Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-xs">
              {user.role === 'student' && <GraduationCap className="w-5 h-5" />}
              {user.role === 'instructor' && <BookOpen className="w-5 h-5" />}
              {user.role === 'admin' && <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {user.name}
                </h2>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] uppercase font-bold tracking-wider">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>ID: {user.identifierCode}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Session Active</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchRole}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer hidden sm:inline-flex"
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

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Dashboard Overview
          </button>

          {user.role === 'student' && (
            <>
              <button
                onClick={() => setActiveTab('classes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'classes'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Schedule & Syllabus
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'submissions'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Project Submissions
              </button>
              <button
                onClick={() => setActiveTab('id_card')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'id_card'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Digital Student ID
              </button>
            </>
          )}

          {user.role === 'instructor' && (
            <>
              <button
                onClick={() => setActiveTab('classes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'classes'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Cohort Roster & Attendance
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'submissions'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Grade Student Works
              </button>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('admissions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'admissions'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Admissions Approval Desk
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                Studio Operations & Broadcast
              </button>
            </>
          )}

        </div>

        {/* Content Container */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto">
          
          {/* ======================= 1. OVERVIEW TAB ======================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Student Overview Header Card */}
              {user.role === 'student' && user.studentDetails && (
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                          Active Enrolled Track
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                          {user.studentDetails.enrolledCourseTitle}
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                        {user.studentDetails.tuitionStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/10 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Cohort Schedule</span>
                        <span className="font-semibold">{user.studentDetails.cohort}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Learning Mode</span>
                        <span className="font-semibold">{user.studentDetails.learningMode} Studio</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Studio Attendance</span>
                        <span className="font-semibold text-emerald-400">{user.studentDetails.attendancePercentage}% Verified</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Curriculum Milestone</span>
                        <span className="font-semibold">{user.studentDetails.completedModules} of {user.studentDetails.totalModules} Modules</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructor Overview Header Card */}
              {user.role === 'instructor' && user.instructorDetails && (
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                        {user.instructorDetails.department}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                        {user.instructorDetails.title}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" />
                      <span>{user.instructorDetails.rating} Faculty Score</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Assigned Students</span>
                      <span className="font-semibold">{user.instructorDetails.assignedStudentsCount} Active Creatives</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Industry Track Record</span>
                      <span className="font-semibold">{user.instructorDetails.yearsOfExperience} Years Commercial Experience</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Active Batches</span>
                      <span className="font-semibold">{user.instructorDetails.activeBatches.length} Cohorts Assigned</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Office & Mentorship Hours</span>
                      <span className="font-semibold">{user.instructorDetails.officeHours}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Overview Header Card */}
              {user.role === 'admin' && user.adminDetails && (
                <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                        {user.adminDetails.clearanceLevel} Clearance
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                        {user.adminDetails.department} Control Center
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                      Master Authorization Enabled
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Admissions Queue</span>
                      <span className="font-semibold text-emerald-400">18 Applications Pending</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Active Students</span>
                      <span className="font-semibold">248 Enrolled</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Soundstages in Use</span>
                      <span className="font-semibold">Studio A & Editing Suite B</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Authorized Hubs</span>
                      <span className="font-semibold">{user.adminDetails.authorizedLocations.length} Campus Facilities</span>
                    </div>
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
          {activeTab === 'classes' && user.role === 'student' && (
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

          {activeTab === 'classes' && user.role === 'instructor' && (
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
                    {user.role === 'student' ? 'My Creative Project Uploads' : 'Student Capstone Reviews & Grading'}
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
          {activeTab === 'id_card' && user.role === 'student' && (
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
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/30 flex-shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <h4 className="text-base font-bold text-white leading-tight">{user.name}</h4>
                    <p className="text-blue-300 font-mono text-[11px]">{user.identifierCode}</p>
                    <p className="text-slate-300 text-[11px]">{user.studentDetails?.enrolledCourseTitle}</p>
                    <span className="inline-block px-2 py-0.5 bg-white/10 rounded text-[10px] font-semibold text-slate-200">
                      {user.studentDetails?.learningMode} Campus Track
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
          {activeTab === 'admissions' && user.role === 'admin' && (
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
          {activeTab === 'analytics' && user.role === 'admin' && (
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
                  <span className="text-[11px] text-slate-500">Audience: 248 Students, 14 Faculty Members</span>
                  <button
                    type="button"
                    onClick={async () => {
                      if (broadcastMessage.trim()) {
                        setBroadcastSent(true);
                        await api.sendBroadcast({
                          message: broadcastMessage.trim(),
                          sender: `${user.name} (Admin Operations)`
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
            Connected as <strong className="text-slate-800">{user.email}</strong>
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
