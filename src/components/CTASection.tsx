import React from 'react';
import { Sparkles, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

interface CTASectionProps {
  onOpenEnrollment: () => void;
  onExploreCourses: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenEnrollment, onExploreCourses }) => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="bg-blue-950 text-white rounded-2xl p-8 sm:p-12 border border-blue-900 shadow-sm relative overflow-hidden">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-800 text-blue-200 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Next Cohort Begins April 2026</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 max-w-2xl mx-auto">
            Ready to build real creative production skills?
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Join OJISMediaAcademy to master cameras, software workflows, and portfolio creation with industry mentors.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto mb-8 w-full sm:w-auto">
            <button
              onClick={onOpenEnrollment}
              id="cta-enroll-now-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer h-12"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Apply for Next Cohort</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </button>

            <button
              onClick={onExploreCourses}
              id="cta-explore-courses-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-blue-100 font-semibold text-sm border border-blue-800 transition-all cursor-pointer h-12"
            >
              <Layers className="w-4 h-4 text-blue-300 flex-shrink-0" />
              <span>View Curriculum</span>
            </button>
          </div>

          {/* Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-blue-200/80 border-t border-blue-900 pt-6">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Admission Slip</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Installment Plans Supported</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Physical Studio Access</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
