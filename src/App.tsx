import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { About } from './components/About';
import { Courses } from './components/Courses';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HowItWorks } from './components/HowItWorks';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { Instructors } from './components/Instructors';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { CTASection } from './components/CTASection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CourseModal } from './components/CourseModal';
import { EnrollmentModal } from './components/EnrollmentModal';
import { MyRegistrationsModal } from './components/MyRegistrationsModal';
import { AuthModal } from './components/AuthModal';
import { PortalModal } from './components/PortalModal';
import { Course, StudentEnrollment, UserAccount, UserRole, AuthMode } from './types';
import { getStoredUser, setStoredUser, clearStoredUser } from './data/authDemoData';
import { MessageSquare, Sparkles, CheckCircle2, X } from 'lucide-react';

export default function App() {
  // Modal States
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollInitialCourseId, setEnrollInitialCourseId] = useState<string | undefined>(undefined);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
  const [savedApplicationsCount, setSavedApplicationsCount] = useState(0);

  // Authentication & Portals State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('student');
  const [authInitialMode, setAuthInitialMode] = useState<AuthMode>('login');
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  
  // Notification Toast for recent actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const updateApplicationsCount = () => {
    try {
      const stored = localStorage.getItem('ojis_media_enrollments');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedApplicationsCount(Array.isArray(parsed) ? parsed.length : 0);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    updateApplicationsCount();
    // Load persisted user session if exists
    const existingUser = getStoredUser();
    if (existingUser) {
      setCurrentUser(existingUser);
    }
  }, []);

  const handleOpenEnrollment = (courseId?: unknown) => {
    // If opened from course details modal, close it
    setSelectedCourseDetail(null);
    const validCourseId = typeof courseId === 'string' ? courseId : undefined;
    setEnrollInitialCourseId(validCourseId);
    setIsEnrollModalOpen(true);
  };

  const handleViewCourseDetails = (course: Course) => {
    setSelectedCourseDetail(course);
  };

  const handleEnrollmentComplete = (enrollment: StudentEnrollment) => {
    updateApplicationsCount();
    setToastMessage(`Registration ${enrollment.referenceNumber} received for ${enrollment.fullName}!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleOpenAuth = (role: UserRole = 'student', mode: AuthMode = 'login') => {
    setAuthInitialRole(role);
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setStoredUser(user);
    setToastMessage(`Welcome back, ${user.name}! Connected to ${user.role.toUpperCase()} Portal.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleLogout = () => {
    clearStoredUser();
    setCurrentUser(null);
    setIsPortalModalOpen(false);
    setToastMessage('Signed out successfully.');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSwitchRole = () => {
    setIsPortalModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const scrollToCourses = () => {
    const el = document.getElementById('courses');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-900 selection:text-white relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-slate-900 border border-slate-700 text-white shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar 
        onOpenEnrollment={handleOpenEnrollment}
        onOpenMyApplications={() => setIsRegistrationsModalOpen(true)}
        savedApplicationsCount={savedApplicationsCount}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenPortal={() => setIsPortalModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <Hero 
        onOpenEnrollment={() => handleOpenEnrollment()}
        onExploreCourses={scrollToCourses}
        onOpenAuth={handleOpenAuth}
      />

      {/* Stats Counter Bar */}
      <Stats />

      {/* About The Academy & Methodology */}
      <About 
        onOpenEnrollment={() => handleOpenEnrollment()} 
        onExploreCourses={scrollToCourses}
      />

      {/* Courses Catalog Section with Filters */}
      <Courses 
        onViewCourseDetails={handleViewCourseDetails}
        onEnrollCourse={handleOpenEnrollment}
      />

      {/* Why Choose Us (6 Features) */}
      <WhyChooseUs onOpenEnrollment={() => handleOpenEnrollment()} />

      {/* How It Works (4 Steps) */}
      <HowItWorks onOpenEnrollment={() => handleOpenEnrollment()} />

      {/* Student Creative Showcase Gallery with Lightbox */}
      <ProjectsShowcase />

      {/* Meet Our Instructors */}
      <Instructors />

      {/* Student Testimonials */}
      <Testimonials />

      {/* Frequently Asked Questions Accordion */}
      <FAQ />

      {/* Final Call to Action Section */}
      <CTASection 
        onOpenEnrollment={() => handleOpenEnrollment()}
        onExploreCourses={scrollToCourses}
      />

      {/* Contact Section & Inquiry Form */}
      <Contact />

      {/* Footer */}
      <Footer 
        onOpenEnrollment={handleOpenEnrollment}
        onExploreCourses={scrollToCourses}
        onOpenAuth={handleOpenAuth}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/2348123456789?text=Hello%20OJISMediaAcademy,%20I%20am%20interested%20in%20learning%20more%20about%20your%20media%20courses."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Admissions on WhatsApp"
        className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-2xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 text-slate-950 fill-current" />
        <span className="hidden sm:inline text-xs font-extrabold pr-1 text-slate-950">
          WhatsApp Admissions
        </span>
      </a>

      {/* Modals */}
      
      {/* 1. Course Details / Syllabus Modal */}
      <CourseModal
        course={selectedCourseDetail}
        isOpen={!!selectedCourseDetail}
        onClose={() => setSelectedCourseDetail(null)}
        onEnroll={(courseId) => handleOpenEnrollment(courseId)}
      />

      {/* 2. Streamlined Fast Enrollment Application Modal */}
      <EnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        initialCourseId={enrollInitialCourseId}
        onEnrollmentComplete={handleEnrollmentComplete}
      />

      {/* 3. My Applications / Reference Code Lookup Modal */}
      <MyRegistrationsModal
        isOpen={isRegistrationsModalOpen}
        onClose={() => setIsRegistrationsModalOpen(false)}
        onNewEnrollment={() => handleOpenEnrollment()}
      />

      {/* 4. Student, Instructor & Admin Signup and Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authInitialRole}
        initialMode={authInitialMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 5. User Portal Dashboard Modal */}
      <PortalModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

    </div>
  );
}
