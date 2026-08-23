import React, { useState } from 'react';
import { 
  Camera, 
  Users, 
  Video, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AboutProps {
  onOpenEnrollment: () => void;
  onExploreCourses: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenEnrollment, onExploreCourses }) => {
  const [activeTab, setActiveTab] = useState<'practical' | 'mentors' | 'projects' | 'career'>('practical');

  const pillars = [
    {
      id: 'practical' as const,
      label: 'Practical First',
      icon: Camera,
      title: 'Real Studio Gear & Workstations',
      description: 'Media skills are developed through hands-on practice. From your first week, you will operate cinema cameras, studio lighting grids, wireless audio systems, and color-calibrated editing suites.',
      points: [
        'Live studio sets with industry cinema cameras & strobes',
        'Daily supervised shooting & post-production exercises',
        'Small cohort sizes with direct instructor guidance'
      ]
    },
    {
      id: 'mentors' as const,
      label: 'Working Mentors',
      icon: Users,
      title: 'Taught by Active Industry Practitioners',
      description: 'Our instructors are active directors, cinematographers, post-production supervisors, and brand creative leads with commercial project experience.',
      points: [
        'Standard workflows used in commercial productions',
        'Direct feedback on every cut, photograph, and graphic layout',
        'Industry networking and creative referral opportunities'
      ]
    },
    {
      id: 'projects' as const,
      label: 'Portfolio Ready',
      icon: Video,
      title: 'Graduate with a Verified Showreel',
      description: 'You will graduate with finished, client-ready work and case studies that demonstrate your capabilities to prospective clients and studios.',
      points: [
        'Commercial spec projects and narrative short films',
        'Editorial fashion lookbooks and product photography',
        'Brand identity guidelines and motion graphic reels'
      ]
    },
    {
      id: 'career' as const,
      label: 'Career & Business',
      icon: Briefcase,
      title: 'Monetize Your Creative Skills',
      description: 'We teach you how to price your services, pitch corporate clients, structure contracts, and launch your freelance career or media studio.',
      points: [
        'Freelancing frameworks for local and international clients',
        'Standard rate cards for photo, video, and design deliverables',
        'Alumni network access for job postings and collaborations'
      ]
    }
  ];

  const currentPillar = pillars.find(p => p.id === activeTab) || pillars[0];
  const CurrentIcon = currentPillar.icon;

  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            About the Academy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 mb-3">
            Practical media training built for real-world production
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            OJISMediaAcademy prepares aspiring filmmakers, photographers, editors, and digital creators with modern equipment and hands-on studio mentorship.
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Pillar Tabs */}
          <div className="lg:col-span-5 space-y-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isActive = activeTab === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveTab(pillar.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                        {pillar.label}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">
                        {pillar.title}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold ${isActive ? 'text-blue-900' : 'text-slate-400'}`}>
                    →
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Pillar Details Card */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
                <CurrentIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-blue-900">
                  Core Methodology
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {currentPillar.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {currentPillar.description}
            </p>

            <div className="space-y-2.5 pt-2 border-t border-slate-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Key Benefits:
              </span>
              {currentPillar.points.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenEnrollment}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer h-11"
              >
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Join Next Cohort</span>
              </button>

              <button
                onClick={onExploreCourses}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition-all cursor-pointer h-11"
              >
                Browse Curriculum
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
