import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, UserAccount } from '../types';
import { getStudentProgressForCourse } from '../data/studentProgress';
import { fetchCourseInstructor, InstructorFullProfile } from '../data/instructorsData';
import { 
  X, 
  Clock, 
  BarChart, 
  Monitor, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ChevronDown,
  GraduationCap,
  Award,
  PlayCircle,
  ShieldCheck,
  Star,
  ExternalLink,
  Linkedin,
  Instagram,
  Twitter,
  Briefcase,
  BookOpen,
  UserCheck
} from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  currentUser?: UserAccount | null;
  onOpenPortal?: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ 
  course, 
  isOpen, 
  onClose, 
  onEnroll,
  currentUser,
  onOpenPortal
}) => {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [instructor, setInstructor] = useState<InstructorFullProfile | null>(null);
  const [isLoadingInstructor, setIsLoadingInstructor] = useState(false);

  // Fetch lead teacher bio and credentials whenever the course modal is opened
  useEffect(() => {
    let isMounted = true;
    if (isOpen && course) {
      setIsLoadingInstructor(true);
      fetchCourseInstructor(course)
        .then((profile) => {
          if (isMounted) {
            setInstructor(profile);
            setIsLoadingInstructor(false);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch instructor profile:', err);
          if (isMounted) {
            setIsLoadingInstructor(false);
          }
        });
    } else {
      setInstructor(null);
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, course]);

  const progress = course ? getStudentProgressForCourse(course.id, currentUser) : null;
  const isEnrolled = !!progress;
  const isCompleted = progress && progress.progressPercentage >= 100;

  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  return (
    <AnimatePresence>
      {isOpen && course && (
        <motion.div 
          key="course-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div 
            key="course-modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ 
              type: 'spring', 
              damping: 26, 
              stiffness: 340,
              mass: 0.8
            }}
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
              Syllabus & Course Details
            </span>
            {isEnrolled && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-300">
                <GraduationCap className="w-3 h-3" />
                <span>Enrolled</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Active Enrollment Milestone Header */}
          {isEnrolled && progress && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-extrabold text-emerald-950">
                    {isCompleted ? 'Program Completed' : 'Your Live Academic Progress'}
                  </span>
                </div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                  {progress.progressPercentage}% Complete
                </span>
              </div>
              <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden border border-emerald-300/60">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progress.progressPercentage}%` }} 
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-900 pt-0.5 font-medium">
                <span>Completed: <strong>{progress.completedModules}</strong> of <strong>{progress.totalModules}</strong> modules</span>
                {progress.attendancePercentage && <span>Attendance: <strong>{progress.attendancePercentage}%</strong></span>}
              </div>
            </div>
          )}

          {/* Top Info Banner */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-semibold capitalize">
                {course.category} Track
              </span>
              <span className="text-base font-bold text-slate-900">
                {course.formattedPrice}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {course.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {course.fullDescription}
            </p>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Duration</span>
                <strong className="text-slate-900 flex items-center gap-1 mt-0.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-900" /> {course.duration}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Level</span>
                <strong className="text-slate-900 flex items-center gap-1 mt-0.5 font-medium">
                  <BarChart className="w-3.5 h-3.5 text-blue-900" /> {course.level}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Format</span>
                <strong className="text-slate-900 flex items-center gap-1 mt-0.5 font-medium">
                  <Monitor className="w-3.5 h-3.5 text-blue-900" /> {course.mode}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Next Cohort</span>
                <strong className="text-blue-900 flex items-center gap-1 mt-0.5 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> {course.upcomingCohort}
                </strong>
              </div>
            </div>
          </div>

          {/* Meet the Instructor Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-900" />
                <span>Meet the Lead Instructor</span>
              </h3>
              <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Lead Teacher
              </span>
            </div>

            {isLoadingInstructor ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-200" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-4/5" />
              </div>
            ) : instructor ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200 shadow-2xs space-y-3.5">
                {/* Instructor Top Profile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={instructor.image || course.instructorAvatar} 
                        alt={instructor.name} 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-white shadow-xs"
                        loading="lazy"
                      />
                      <span 
                        className="absolute -bottom-1 -right-1 p-0.5 bg-blue-900 text-white rounded-full shadow-xs" 
                        title="Verified Academy Faculty"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          {instructor.name}
                        </h4>
                        {instructor.rating && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {instructor.rating.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-blue-900 mt-0.5">
                        {instructor.role}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {instructor.department} • {instructor.yearsOfExperience} Years Experience
                      </p>
                    </div>
                  </div>

                  {/* Social / Portfolio Links */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    {instructor.socialLinks?.linkedin && (
                      <a 
                        href={instructor.socialLinks.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-900 hover:border-blue-300 transition-colors shadow-2xs"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {instructor.socialLinks?.instagram && (
                      <a 
                        href={instructor.socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs"
                        title="Instagram Profile"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {instructor.socialLinks?.twitter && (
                      <a 
                        href={instructor.socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-500 hover:border-blue-300 transition-colors shadow-2xs"
                        title="Twitter / X"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {instructor.portfolioUrl && (
                      <a 
                        href={instructor.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:text-blue-900 hover:border-blue-300 transition-colors shadow-2xs"
                      >
                        <span>Portfolio</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs text-slate-700 leading-relaxed">
                  {instructor.detailedBio || instructor.bio}
                </p>

                {/* Credentials & Accreditations */}
                {instructor.credentials && instructor.credentials.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Credentials & Industry Accreditations
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {instructor.credentials.map((cred, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-900 flex-shrink-0 mt-0.5" />
                          <span>{cred}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Past Clients or Commercial Credits */}
                {instructor.pastClients && instructor.pastClients.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-500" />
                      Notable Credits:
                    </span>
                    {instructor.pastClients.map((client, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-medium text-[10px]">
                        {client}
                      </span>
                    ))}
                  </div>
                )}

                {/* Office Hours / Mentorship note */}
                {instructor.officeHours && (
                  <div className="p-2.5 rounded-lg bg-blue-900/5 border border-blue-900/10 flex items-center justify-between text-[11px]">
                    <span className="text-blue-950 font-medium flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                      <strong>Mentorship Support:</strong> {instructor.officeHours}
                    </span>
                    <span className="text-blue-900 font-semibold hidden sm:inline-block">
                      1-on-1 Reviews Included
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                <img 
                  src={course.instructorAvatar} 
                  alt={course.instructorName} 
                  className="w-12 h-12 rounded-lg object-cover" 
                />
                <div>
                  <h4 className="font-bold text-slate-900">{course.instructorName}</h4>
                  <p className="text-blue-900 font-medium">{course.instructorRole}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tools & Software Covered */}
          {Array.isArray(course.tools) && course.tools.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Gear & Tools Covered
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(course.tools || []).map((tool, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Curriculum Accordions */}
          {Array.isArray(course.curriculum) && course.curriculum.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Weekly Curriculum Outline
              </h3>
              <div className="space-y-2">
                {(course.curriculum || []).map((item) => {
                  const isOpen = expandedWeek === item.week;
                  const isWeekCompleted = progress ? item.week <= progress.completedModules : false;

                  return (
                    <div 
                      key={item.week}
                      className={`border rounded-xl overflow-hidden bg-white transition-colors ${
                        isWeekCompleted ? 'border-emerald-200' : 'border-slate-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleWeek(item.week)}
                        className={`w-full flex items-center justify-between p-3.5 text-left transition-colors cursor-pointer ${
                          isWeekCompleted ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'bg-slate-50/70 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-6 h-6 rounded text-[11px] font-bold flex items-center justify-center ${
                            isWeekCompleted ? 'bg-emerald-600 text-white' : 'bg-blue-900 text-white'
                          }`}>
                            {item.week}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-900">
                            {item.title}
                          </span>
                          {isWeekCompleted && (
                            <span className="hidden sm:inline-flex text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-blue-900' : ''}`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div 
                            key={`curriculum-week-${item.week}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="p-3.5 text-xs text-slate-600 space-y-2 border-t border-slate-100 bg-white">
                              <div className="space-y-1.5">
                                {(item.topics || []).map((topic, i) => (
                                  <div key={i} className="flex items-start gap-2 text-slate-700">
                                    <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
                                      isWeekCompleted ? 'text-emerald-600' : 'text-slate-400'
                                    }`} />
                                    <span>{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Tuition</span>
            <span className="text-sm font-bold text-slate-900">{course.formattedPrice}</span>
          </div>

          {isEnrolled ? (
            <button
              onClick={() => {
                onClose();
                if (onOpenPortal) onOpenPortal();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Go to Student Portal</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onEnroll(course.id);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enroll in This Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

