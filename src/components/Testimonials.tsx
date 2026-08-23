import React from 'react';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            Student Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 mb-3">
            What our graduates say
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Reviews from students who completed practical studio tracks at OJISMediaAcademy.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-9 h-9 rounded-full object-cover border border-slate-300"
                  loading="lazy"
                />
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-blue-900 font-medium">{item.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
