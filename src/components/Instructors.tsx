import React from 'react';
import { INSTRUCTORS_DATA } from '../data/statsData';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

export const Instructors: React.FC = () => {
  return (
    <section id="instructors" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            Faculty & Mentors
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 mb-3">
            Learn from working media directors
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Active industry practitioners, certified colorists, and brand designers guiding your studio projects.
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSTRUCTORS_DATA.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img 
                    src={instructor.image} 
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[11px] font-medium text-blue-300 block">
                      {instructor.specialty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {instructor.name}
                    </h3>
                    <p className="text-xs font-medium text-blue-900">
                      {instructor.role}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {instructor.bio}
                  </p>

                  <div className="pt-1">
                    {instructor.coursesTaught.map((c, i) => (
                      <span key={i} className="inline-block text-[10px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded mr-1 mb-1">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Instructor</span>
                <div className="flex items-center gap-2 text-slate-400">
                  {instructor.socialLinks?.instagram && (
                    <a href={instructor.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-blue-900 transition-colors">
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {instructor.socialLinks?.linkedin && (
                    <a href={instructor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-blue-900 transition-colors">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {instructor.socialLinks?.twitter && (
                    <a href={instructor.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-blue-900 transition-colors">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
