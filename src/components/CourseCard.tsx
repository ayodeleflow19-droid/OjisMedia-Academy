import React from 'react';
import { Course, StudentCourseProgress } from '../types';
import { 
  ArrowRight, 
  Check, 
  BookOpen, 
  Calendar,
  GraduationCap,
  Award,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
  onEnroll: (courseId: string) => void;
  progress?: StudentCourseProgress | null;
  onOpenPortal?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onViewDetails,
  onEnroll,
  progress,
  onOpenPortal
}) => {
  const isEnrolled = !!progress;
  const isCompleted = progress && progress.progressPercentage >= 100;
  const progressPercent = progress ? Math.min(100, Math.max(0, progress.progressPercentage)) : 0;

  return (
    <div className={`bg-white rounded-xl border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
      isEnrolled 
        ? 'border-emerald-300 ring-2 ring-emerald-500/15 hover:border-emerald-400' 
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      
      {/* Top Media Image (Clickable for easy syllabus viewing on mobile) */}
      <div 
        onClick={() => onViewDetails(course)}
        className="relative aspect-[16/9] bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Category & Mode Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-bold shadow-2xs">
            {course.duration}
          </span>
          <span className="px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-bold shadow-2xs">
            {course.mode}
          </span>
        </div>

        {/* Top Right: Enrolled / Featured Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {isEnrolled ? (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm flex items-center gap-1 backdrop-blur-xs ${
              isCompleted
                ? 'bg-purple-600 text-white border border-purple-400/40'
                : 'bg-emerald-600 text-white border border-emerald-400/40'
            }`}>
              {isCompleted ? (
                <>
                  <Award className="w-3 h-3 text-amber-300" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3 h-3 text-emerald-200" />
                  <span>Enrolled Student</span>
                </>
              )}
            </span>
          ) : course.featured ? (
            <div className="px-2 py-0.5 rounded bg-blue-900 text-white text-[10px] font-bold shadow-xs">
              Featured Track
            </div>
          ) : null}
        </div>

        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white/90 text-[11px] font-medium z-10">
          <span className="flex items-center gap-1 drop-shadow-xs">
            <Calendar className="w-3 h-3 text-blue-300" />
            {course.upcomingCohort}
          </span>
          <span className="text-[10px] bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded text-slate-200">
            Tap for syllabus
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide">
              {course.category} Track
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
              {course.formattedPrice}
            </span>
          </div>

          <h3 
            onClick={() => onViewDetails(course)}
            className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem] flex items-center cursor-pointer hover:text-blue-900 transition-colors"
          >
            {course.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {course.shortDescription}
          </p>
        </div>

        {/* VISUAL PROGRESS INDICATOR SECTION FOR ENROLLED STUDENTS */}
        {isEnrolled && (
          <div className="bg-slate-50/90 rounded-xl p-3 border border-emerald-200/90 shadow-2xs space-y-2">
            {/* Header: Status and percentage */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="text-[11px] font-bold text-slate-900 truncate">
                  {isCompleted ? 'Curriculum Completed' : 'Your Learning Progress'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold flex-shrink-0 ${
                isCompleted 
                  ? 'bg-purple-100 text-purple-900 border border-purple-200'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300/80'
              }`}>
                {progressPercent}% Complete
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden border border-slate-200">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                    : 'bg-gradient-to-r from-blue-900 via-blue-700 to-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Progress Metadata details */}
            <div className="flex items-center justify-between text-[10.5px] text-slate-600 pt-0.5">
              <span className="font-semibold text-slate-800">
                {progress.completedModules} of {progress.totalModules} Modules
              </span>
              {progress.attendancePercentage !== undefined && (
                <span className="text-emerald-700 font-bold">
                  {progress.attendancePercentage}% Attendance
                </span>
              )}
            </div>

            {progress.nextLesson && (
              <div className="text-[10px] text-slate-500 truncate pt-0.5 border-t border-slate-200/60">
                <span className="text-slate-400">Current Focus:</span>{' '}
                <span className="font-medium text-slate-700">{progress.nextLesson}</span>
              </div>
            )}
          </div>
        )}

        {/* Outcomes Checklist (Shown if not enrolled or if space allows) */}
        {!isEnrolled && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
            {(course.outcomes || []).slice(0, 3).map((outcome, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{outcome}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions (Touch-friendly minimum 42px height on mobile) */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onViewDetails(course)}
            className="w-full py-2.5 sm:py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-98"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Syllabus</span>
          </button>

          {isEnrolled ? (
            <button
              onClick={() => {
                if (onOpenPortal) {
                  onOpenPortal();
                } else {
                  onViewDetails(course);
                }
              }}
              className="w-full py-2.5 sm:py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1 active:scale-98"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Resume Track</span>
            </button>
          ) : (
            <button
              onClick={() => onEnroll(course.id)}
              className="w-full py-2.5 sm:py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1 active:scale-98"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

