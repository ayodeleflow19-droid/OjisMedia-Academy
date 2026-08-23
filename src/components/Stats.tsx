import React from 'react';
import { Users, Video, Briefcase, Award } from 'lucide-react';

export const Stats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '2,500+',
      label: 'Graduates Trained',
      description: 'Across physical and hybrid tracks'
    },
    {
      icon: Video,
      value: '100%',
      label: 'Practical Learning',
      description: 'Hands-on studio production'
    },
    {
      icon: Briefcase,
      value: '88%',
      label: 'Career Transition Rate',
      description: 'Employment & freelance clients'
    },
    {
      icon: Award,
      value: '4.9 / 5',
      label: 'Student Rating',
      description: 'Based on 400+ reviews'
    }
  ];

  return (
    <section className="py-8 sm:py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
