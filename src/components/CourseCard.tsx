import React from 'react';
import { Course } from '../types';
import { 
  ArrowRight, 
  Check,
  BookOpen,
  Calendar
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
  onEnroll: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onViewDetails,
  onEnroll
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      
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
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />

        {/* Category & Mode Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-xs text-white text-[10px] font-bold shadow-2xs">
            {course.duration}
          </span>
          <span className="px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-bold shadow-2xs">
            {course.mode}
          </span>
        </div>

        {course.featured && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-blue-900 text-white text-[10px] font-bold shadow-xs z-10">
            Featured Track
          </div>
        )}

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

        {/* Outcomes Checklist */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
          {(course.outcomes || []).slice(0, 3).map((outcome, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{outcome}</span>
            </div>
          ))}
        </div>

        {/* Actions (Touch-friendly minimum 42px height on mobile) */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onViewDetails(course)}
            className="w-full py-2.5 sm:py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-98"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Syllabus</span>
          </button>

          <button
            onClick={() => onEnroll(course.id)}
            className="w-full py-2.5 sm:py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1 active:scale-98"
          >
            <span>Enroll Now</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
};
