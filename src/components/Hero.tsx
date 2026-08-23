import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  Camera, 
  Video, 
  Layers,
  Award,
  GraduationCap,
  BookOpen,
  LogIn
} from 'lucide-react';
import { UserRole, AuthMode } from '../types';

interface HeroProps {
  onOpenEnrollment: () => void;
  onExploreCourses: () => void;
  onOpenAuth?: (role?: UserRole, mode?: AuthMode) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnrollment, onExploreCourses, onOpenAuth }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag / Cohort Status */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold max-w-full">
              <span className="w-2 h-2 rounded-full bg-blue-700 flex-shrink-0" />
              <span className="truncate sm:whitespace-normal">April 2026 Cohort Registration Now Open</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.18]">
                Master Practical Media & Creative Production
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                Hands-on training in video production, photography, editing, graphic design, and content creation with modern studio gear and real-world projects.
              </p>
            </div>

            {/* Quick Guarantees / Value Chips */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs sm:text-sm font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0" />
                <span className="whitespace-nowrap">100% Practical Studios</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0" />
                <span className="whitespace-nowrap">Industry Mentorship</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-900 flex-shrink-0" />
                <span className="whitespace-nowrap">Certificate of Completion</span>
              </div>
            </div>

            {/* Call to Actions - Perfectly aligned & full-width on mobile, inline on desktop */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onOpenEnrollment}
                  id="hero-enroll-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer h-12"
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>Enroll in Next Cohort</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>

                <button
                  onClick={onExploreCourses}
                  id="hero-explore-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-semibold text-sm border border-slate-200 transition-all cursor-pointer h-12"
                >
                  <Layers className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <span>View All Courses</span>
                </button>
              </div>

              {/* Direct Portal Quick Access Bar */}
              {onOpenAuth && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <LogIn className="w-3 h-3 text-blue-900" />
                    Already registered?
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenAuth('student', 'login')}
                      className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-blue-50 border border-slate-200 text-blue-900 font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      Student Login
                    </button>
                    <button
                      onClick={() => onOpenAuth('instructor', 'login')}
                      className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      Instructor Portal
                    </button>
                    <button
                      onClick={() => onOpenAuth('admin', 'login')}
                      className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      Admin Access
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Footnote */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>No upfront fee to apply</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-900 flex-shrink-0" />
                <span>Installment plans available</span>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Studio Media Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs">
              
              {/* Media Image */}
              <div className="relative aspect-[4/3] bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                  alt="Nigerian media students collaborating in modern studio"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/85 via-transparent to-transparent" />
                
                {/* Floating Studio Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-950/90 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>Live Studio Practical</span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">Facility Spotlight</span>
                  <p className="text-xs font-medium text-slate-200 mt-0.5">
                    Sony FX Cinema Line & Blackmagic 6K Pro Lab
                  </p>
                </div>
              </div>

              {/* Quick Feature Grid Below Image */}
              <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50 text-xs border-t border-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Real Gear</strong>
                    <span className="text-[11px] text-slate-500">Provided in studio</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Portfolio Ready</strong>
                    <span className="text-[11px] text-slate-500">Graduate with work</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
