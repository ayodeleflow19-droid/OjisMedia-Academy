import React from 'react';
import { Sparkles, ArrowRight, UserPlus, BookOpen, Layers, Award } from 'lucide-react';

interface HowItWorksProps {
  onOpenEnrollment: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenEnrollment }) => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Select Track & Register',
      description: 'Choose your desired media discipline and fill the quick enrollment form to reserve your seat.'
    },
    {
      number: '02',
      icon: Layers,
      title: 'Orientation & Studio Setup',
      description: 'Join the cohort orientation, receive your starter kit, and get familiar with the academy studio gear.'
    },
    {
      number: '03',
      icon: BookOpen,
      title: 'Hands-On Practical Training',
      description: 'Engage in daily supervised shooting, editing, and designing on live commercial project briefs.'
    },
    {
      number: '04',
      icon: Award,
      title: 'Graduate with Portfolio',
      description: 'Complete your final capstone project, receive your verified certificate, and access the alumni network.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            Admissions & Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 mb-3">
            How your training unfolds
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A structured 4-step framework from first registration to portfolio completion.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {step.number}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
