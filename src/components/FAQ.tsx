import React, { useState } from 'react';
import { FAQS_DATA } from '../data/statsData';
import { ChevronDown, MessageCircle, PhoneCall } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Admissions', 'Courses & Gear', 'Payment & Schedules', 'Careers & Certificate'];

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = selectedCategory === 'All'
    ? FAQS_DATA
    : FAQS_DATA.filter(f => f.category === selectedCategory);

  return (
    <section id="faq" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            Support & FAQs
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 mb-2">
            Frequently asked questions
          </h2>
          <p className="text-sm text-slate-600">
            Answers regarding enrollment, studio gear, schedules, and certificates.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-2.5 mb-8">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 pr-3">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-blue-900' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900">Have a specific question?</h4>
              <p className="text-[11px] text-slate-500">Admissions team is available on WhatsApp Mon–Sat.</p>
            </div>
          </div>

          <a
            href="https://wa.me/2348123456789?text=Hello%20OJISMediaAcademy,%20I%20have%20a%20question%20regarding%20course%20enrollment."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
