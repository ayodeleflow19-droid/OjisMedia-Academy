import React, { useState } from 'react';
import { 
  Instagram, 
  Linkedin, 
  Youtube, 
  Facebook, 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  X
} from 'lucide-react';

interface FooterProps {
  onOpenEnrollment: (courseId?: string) => void;
  onExploreCourses: () => void;
  onOpenAuth?: (role?: 'student' | 'instructor' | 'admin', mode?: 'login' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEnrollment, onExploreCourses, onOpenAuth }) => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const coursesList = [
    { label: 'Video Production & Cinematography', id: 'video-production' },
    { label: 'Professional Photography & Studio Lighting', id: 'photography' },
    { label: 'Video Editing & Post-Production', id: 'video-editing' },
    { label: 'DaVinci Resolve Color Grading', id: 'color-grading' },
    { label: 'Graphic Design & Brand Systems', id: 'graphic-design' },
    { label: 'UI/UX Design & Product Systems', id: 'ui-design' },
    { label: 'Social Media Content Creation', id: 'content-creation' },
    { label: 'Podcast & Live Broadcasting', id: 'podcast-production' },
    { label: 'Motion Graphics & VFX (After Effects)', id: 'motion-graphics' },
    { label: 'Drone Cinematography & Aerial', id: 'drone-cinematography' },
  ];

  const quickLinks = [
    { label: 'All Courses', href: '#courses' },
    { label: 'About Academy', href: '#about' },
    { label: 'Why Choose Us', href: '#why-us' },
    { label: 'Student Projects', href: '#projects' },
    { label: 'Instructors', href: '#instructors' },
    { label: 'Student Reviews', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                OJIS<span className="text-blue-400">Media</span>Academy
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Hands-on media institution empowering aspiring creators with practical video production, photography, editing, and graphic design skills.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 transition-colors">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 transition-colors">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-blue-400 transition-colors">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Course Tracks */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Media Tracks
            </h4>
            <ul className="space-y-2">
              {coursesList.map((course) => (
                <li key={course.id}>
                  <button
                    onClick={() => onOpenEnrollment(course.id)}
                    className="text-slate-400 hover:text-white transition-colors text-left text-xs cursor-pointer"
                  >
                    {course.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation & Portals */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Portals & Sign In
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenAuth?.('student', 'login')}
                  className="text-slate-400 hover:text-white transition-colors text-xs text-left cursor-pointer"
                >
                  Student Portal Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth?.('student', 'signup')}
                  className="text-slate-400 hover:text-white transition-colors text-xs text-left cursor-pointer"
                >
                  Create Student Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth?.('instructor', 'login')}
                  className="text-slate-400 hover:text-white transition-colors text-xs text-left cursor-pointer"
                >
                  Instructor Console
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth?.('admin', 'login')}
                  className="text-slate-400 hover:text-white transition-colors text-xs text-left cursor-pointer"
                >
                  Admin & Operations
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Studio & Hub
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Plot 14 Commercial Avenue, Ikeja, Lagos, Nigeria</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <a href="tel:+2348123456789" className="hover:text-white">+234 812 345 6789</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <a href="mailto:admissions@ojismedia.academy" className="hover:text-white">admissions@ojismedia.academy</a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} OJISMediaAcademy. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Enrollment
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Legal Dialog */}
      {legalModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
          onClick={() => setLegalModal(null)}
        >
          <div 
            className="bg-white text-slate-900 max-w-lg w-full rounded-xl p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Enrollment'}
              </h3>
              <button onClick={() => setLegalModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2 max-h-60 overflow-y-auto">
              <p>
                OJISMediaAcademy respects student privacy and handles personal contact information strictly for enrollment, advisory, and academic communication.
              </p>
              <p>
                Tuition payments can be made in full or via our standard 2-part installment plan (50% deposit prior to cohort start). Gear provided in physical studios remains academy property during coursework.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
