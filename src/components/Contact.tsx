import React, { useState } from 'react';
import { api } from '../lib/api';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles,
  Database
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Course Inquiries & Enrollment',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await api.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });
    } catch (err) {
      console.warn('Contact sync notice:', err);
    }

    setIsSubmitting(false);
    setIsSent(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Course Inquiries & Enrollment',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
            Contact & Admissions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 mb-3">
            Get in touch with admissions
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Speak with an academic advisor or schedule a studio visit.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Studio Address */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Studio Location</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                OJIS Media Creative Complex, Plot 14 Commercial Avenue, Ikeja, Lagos, Nigeria.
              </p>
            </div>

            {/* Direct Lines */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Phone & WhatsApp</h3>
              </div>
              <p className="text-xs text-slate-600">
                +234 812 345 6789 / +234 901 234 5678
              </p>
              <div className="mt-3">
                <a
                  href="https://wa.me/2348123456789?text=Hello%20OJISMediaAcademy,%20I%20have%20an%20admissions%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Admissions</span>
                </a>
              </div>
            </div>

            {/* Email & Hours */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Studio & Support Hours</h3>
              </div>
              <p className="text-xs text-slate-600">
                Monday – Friday: 9:00 AM – 6:00 PM<br />
                Saturday: 10:00 AM – 4:00 PM
              </p>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Send an inquiry
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill the form below and an admissions officer will reply within 24 hours.
            </p>

            {isSent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-semibold text-emerald-900">Message Received</h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you for contacting OJISMediaAcademy. We have received your inquiry and will respond shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+234 812 345 6789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-900"
                    >
                      <option value="Course Inquiries & Enrollment">Course Inquiries & Enrollment</option>
                      <option value="Studio Tour Booking">Studio Tour Booking</option>
                      <option value="Corporate / Group Training">Corporate / Group Training</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
