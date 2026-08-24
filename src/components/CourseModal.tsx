import React, { useState } from 'react';
import { Course } from '../types';
import { 
  X, 
  Clock, 
  BarChart, 
  Monitor, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ChevronDown
} from 'lucide-react';

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ 
  course, 
  isOpen, 
  onClose, 
  onEnroll 
}) => {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  if (!isOpen || !course) return null;

  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
              Syllabus & Course Details
            </span>
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
                  return (
                    <div 
                      key={item.week}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                    >
                      <button
                        onClick={() => toggleWeek(item.week)}
                        className="w-full flex items-center justify-between p-3.5 text-left bg-slate-50/70 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">
                            {item.week}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-900">
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-blue-900' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="p-3.5 text-xs text-slate-600 space-y-2 border-t border-slate-100 bg-white">
                          <div className="space-y-1.5">
                            {(item.topics || []).map((topic, i) => (
                              <div key={i} className="flex items-start gap-2 text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
        </div>

      </div>
    </div>
  );
};
