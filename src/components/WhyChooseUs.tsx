import React from 'react';
import { 
  Camera, 
  Users, 
  Video, 
  Briefcase, 
  Award, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

interface WhyChooseUsProps {
  onOpenEnrollment: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenEnrollment }) => {
  const reasons = [
    {
      icon: Camera,
      title: 'Industry-Grade Camera Gear',
      description: 'Work with Sony FX3/FX6, Blackmagic 6K Pro, studio lighting grids, and wireless sound rigs during class.'
    },
    {
      icon: Users,
      title: 'Working Film & Media Mentors',
      description: 'Taught by active commercial directors, cinematographers, and agency leads with commercial track records.'
    },
    {
      icon: Video,
      title: 'Project-First Methodology',
      description: 'Graduate with client-ready spec ads, short films, photography lookbooks, and brand identity cases.'
    },
    {
      icon: Briefcase,
      title: 'Creative Career & Freelance Skills',
      description: 'Learn pricing models, client pitching, contracts, and business skills to monetize your creative talents.'
    },
    {
      icon: Award,
      title: 'Verified Certificate of Completion',
      description: 'Receive an authenticated completion certificate with project verification for job applications.'
    },
    {
      icon: Clock,
      title: 'Flexible Cohort Schedules',
      description: 'Weekday morning, afternoon, and weekend intensive sessions tailored to students and working professionals.'
    }
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            Why OJISMediaAcademy
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 mb-3">
            Designed for practical mastery and industry relevance
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            We focus on tangible studio skills, real equipment, and portfolio outputs over dry theoretical lectures.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
