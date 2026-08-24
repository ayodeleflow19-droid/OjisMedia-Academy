import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COURSES_DATA } from '../data/coursesData';
import { Course, LearningMode, StudentEnrollment } from '../types';
import { api } from '../lib/api';
import { 
  X, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  MessageSquare, 
  Printer, 
  Copy, 
  ArrowRight,
  ShieldCheck,
  Database
} from 'lucide-react';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  onEnrollmentComplete: (enrollment: StudentEnrollment) => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  initialCourseId,
  onEnrollmentComplete
}) => {
  const getSafeInitialId = (id?: unknown) => {
    if (typeof id === 'string' && COURSES_DATA.some(c => c.id === id)) {
      return id;
    }
    return COURSES_DATA[0].id;
  };

  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => 
    getSafeInitialId(initialCourseId)
  );
  const [learningMode, setLearningMode] = useState<LearningMode>('Physical');
  const [preferredCohort, setPreferredCohort] = useState<string>('April 2026 Cohort');

  // Contact Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Lagos, Nigeria');

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<StudentEnrollment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  // Sync initialCourseId
  useEffect(() => {
    if (initialCourseId && typeof initialCourseId === 'string') {
      setSelectedCourseId(initialCourseId);
    }
  }, [initialCourseId]);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setSubmittedData(null);
      setErrorMessage('');
      setCopiedRef(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCourse = COURSES_DATA.find(c => c.id === selectedCourseId) || COURSES_DATA[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please provide your full legal name.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please provide a valid phone / WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const refNum = `OJIS-2026-${randomDigits}`;

    const newEnrollment: StudentEnrollment = {
      id: `enroll-${Date.now()}`,
      referenceNumber: refNum,
      registrationDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: 'Pending Review',
      selectedCourseId: currentCourse.id,
      selectedCourseTitle: currentCourse.title,
      coursePrice: currentCourse.price,
      learningMode,
      preferredCohort,
      preferredSchedule: 'Weekday Morning',
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: phone.trim(),
      dateOfBirth: 'Not specified',
      gender: 'Prefer not to say',
      location: location.trim() || 'Nigeria',
      occupation: 'Applicant',
      educationLevel: 'Higher Education',
      previousExperience: 'Beginner / Self-taught',
      reasonForJoining: 'Skill acquisition & career building',
      hasLaptopOrGear: 'Yes'
    };

    try {
      // Sync with MongoDB backend API
      const res = await api.submitEnrollment(newEnrollment);
      const finalEnrollment = (res && res.data) ? res.data : newEnrollment;

      // Local optimistic cache
      const stored = localStorage.getItem('ojis_media_enrollments');
      const list: StudentEnrollment[] = stored ? JSON.parse(stored) : [];
      list.unshift(finalEnrollment);
      localStorage.setItem('ojis_media_enrollments', JSON.stringify(list));

      setIsSubmitting(false);
      setSubmittedData(finalEnrollment);
      onEnrollmentComplete(finalEnrollment);
    } catch (err) {
      console.error('Storage/Sync error:', err);
      setIsSubmitting(false);
      setSubmittedData(newEnrollment);
      onEnrollmentComplete(newEnrollment);
    }
  };

  const handleCopyRef = () => {
    if (submittedData) {
      try {
        navigator.clipboard.writeText(submittedData.referenceNumber);
        setCopiedRef(true);
        setTimeout(() => setCopiedRef(false), 2000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print not supported in iframe environment');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="enrollment-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
          onClick={onClose}
        >
          <motion.div 
            key="enrollment-modal-panel"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ 
              type: 'spring', 
              damping: 26, 
              stiffness: 340,
              mass: 0.8
            }}
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
              {submittedData ? 'Registration Confirmed' : 'Quick Course Enrollment'}
            </span>
          </div>
          
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          
          {submittedData ? (
            /* SUCCESS CONFIRMATION SLIP */
            <div className="space-y-4 animate-in zoom-in-95 duration-150">
              
              <div className="text-center py-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Enrollment Slip Issued
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-0.5">
                  Your registration has been received. Your admissions advisor will connect with you via WhatsApp.
                </p>
              </div>

              {/* Official Admission Slip */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200 pb-2.5">
                  <div>
                    <span className="text-[10px] text-blue-900 uppercase font-semibold block">Official Reference ID</span>
                    <span className="font-mono text-base font-bold text-blue-900">
                      {submittedData.referenceNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyRef}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-blue-200 text-blue-900 text-xs font-medium hover:bg-blue-100/50 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Student Name</span>
                    <strong className="text-slate-900 font-semibold">{submittedData.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Enrolled Course</span>
                    <strong className="text-slate-900 font-semibold truncate block">{submittedData.selectedCourseTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Cohort & Mode</span>
                    <span className="text-slate-800">{submittedData.preferredCohort} • {submittedData.learningMode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Phone</span>
                    <span className="text-slate-800">{submittedData.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tuition Fee</span>
                    <span className="text-blue-900 font-bold">{currentCourse.formattedPrice}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Status</span>
                    <span className="text-emerald-700 font-semibold">
                      {submittedData.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Next Actions */}
              <div className="space-y-2 pt-1">
                <a
                  href={`https://wa.me/2348123456789?text=Hello%20OJISMediaAcademy,%20I%20just%20completed%20my%20enrollment%20for%20${encodeURIComponent(submittedData.selectedCourseTitle)}.%20My%20Reference%20ID%20is%20${submittedData.referenceNumber}%20(${encodeURIComponent(submittedData.fullName)}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Confirm on WhatsApp Admissions</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="flex items-center justify-center py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    <span>Done</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* MINIMAL ENROLLMENT FORM */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* 1. Track Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selected Course Track *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  {COURSES_DATA.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} — {course.formattedPrice} ({course.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning Mode & Cohort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Learning Mode
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-medium text-center">
                    {(['Physical', 'Hybrid', 'Online'] as LearningMode[]).map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => setLearningMode(mode)}
                        className={`py-1 rounded transition-all cursor-pointer ${
                          learningMode === mode
                            ? 'bg-blue-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Cohort
                  </label>
                  <select
                    value={preferredCohort}
                    onChange={(e) => setPreferredCohort(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-900"
                  >
                    <option value="April 2026 Cohort">April 2026 Cohort (Starts Apr 6)</option>
                    <option value="May 2026 Cohort">May 2026 Cohort (Starts May 4)</option>
                    <option value="Weekend Masterclass Track">Weekend Saturday Intensive</option>
                  </select>
                </div>
              </div>

              {/* 2. Applicant Details */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Samuel Ade"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+234 812 345 6789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current City
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Lagos, Nigeria"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tuition Summary */}
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Total Tuition:</span>
                  <div className="text-base font-bold text-slate-900">
                    {currentCourse.formattedPrice}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    50% Installment Supported
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <span>Complete Registration & Get ID</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No upfront payment required to register.</span>
                </p>
              </div>

            </form>
          )}

        </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
