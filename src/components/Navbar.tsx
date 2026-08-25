import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  FileText,
  Phone, 
  ArrowRight,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Mail
} from 'lucide-react';
import { UserAccount, UserRole, AuthMode } from '../types';

interface NavbarProps {
  onOpenEnrollment: () => void;
  onOpenMyApplications: () => void;
  savedApplicationsCount?: number;
  currentUser: UserAccount | null;
  onOpenAuth: (role?: UserRole, mode?: AuthMode) => void;
  onOpenPortal: () => void;
  onLogout: () => void;
  onOpenWebmail?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenEnrollment, 
  onOpenMyApplications, 
  savedApplicationsCount = 0,
  currentUser,
  onOpenAuth,
  onOpenPortal,
  onLogout,
  onOpenWebmail,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Courses', href: '#courses' },
    { name: 'About', href: '#about' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Projects', href: '#projects' },
    { name: 'Instructors', href: '#instructors' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      
      {/* Top Micro Header Bar */}
      <div className="bg-blue-950 text-blue-200 text-xs py-1.5 px-4 hidden sm:block border-b border-blue-900/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Admissions Open: April 2026 Cohort
            </span>
            <span className="text-blue-800">|</span>
            <span className="text-blue-300">Physical Studio & Hybrid Tracks</span>
          </div>

          <div className="flex items-center gap-4 text-blue-200">
            
            {/* Quick Portals Links */}
            <div className="flex items-center gap-3 pr-2 border-r border-blue-900/80">
              <button
                onClick={() => onOpenAuth('student', 'login')}
                className="text-[11px] text-blue-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <GraduationCap className="w-3 h-3" />
                <span>Student Portal</span>
              </button>

              <button
                onClick={() => onOpenAuth('instructor', 'login')}
                className="text-[11px] text-blue-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                <span>Instructor</span>
              </button>

              <button
                onClick={() => onOpenAuth('admin', 'login')}
                className="text-[11px] text-blue-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </button>

              {onOpenWebmail && (
                <button
                  onClick={onOpenWebmail}
                  className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer transition-colors bg-blue-900/80 hover:bg-blue-800 px-2 py-0.5 rounded border border-amber-400/40"
                  title="View Delivered Activation Emails and Codes"
                >
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span>Webmail Inbox</span>
                </button>
              )}
            </div>

            <a href="tel:+2348123456789" className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>+234 812 345 6789</span>
            </a>

            {savedApplicationsCount > 0 && (
              <button
                onClick={onOpenMyApplications}
                className="text-blue-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>My Slip ({savedApplicationsCount})</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className={`w-full transition-all duration-200 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs' 
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-800 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  OJIS<span className="text-blue-900">Media</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mt-0.5">
                  Academy
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2.5">
              
              {/* If Logged In: User Profile Pill */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.role === 'student' && <GraduationCap className="w-3.5 h-3.5" />}
                      {currentUser.role === 'instructor' && <BookOpen className="w-3.5 h-3.5" />}
                      {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[110px]">
                        {currentUser.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-blue-900 font-semibold uppercase block leading-none">
                        {currentUser.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="p-2 border-b border-slate-100 mb-1">
                        <span className="text-xs font-bold text-slate-900 block">{currentUser.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono block">{currentUser.identifierCode}</span>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenPortal();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-blue-900" />
                        <span>Open {currentUser.role.toUpperCase()} Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAuth('student', 'login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Switch Account / Role</span>
                      </button>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* If Logged Out: Portal Login / Sign Up Trigger */
                <div className="relative">
                  <button
                    onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-900" />
                    <span>Portals Login</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Auth Dropdown Menu */}
                  {isAuthMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onMouseLeave={() => setIsAuthMenuOpen(false)}
                    >
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Select Portal
                      </div>

                      <button
                        onClick={() => {
                          setIsAuthMenuOpen(false);
                          onOpenAuth('student', 'login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        <GraduationCap className="w-4 h-4 text-blue-900" />
                        <div>
                          <strong className="block text-slate-900 text-xs">Student Portal</strong>
                          <span className="text-[10px] text-slate-500">Sign In or Create Account</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsAuthMenuOpen(false);
                          onOpenAuth('instructor', 'login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        <BookOpen className="w-4 h-4 text-blue-900" />
                        <div>
                          <strong className="block text-slate-900 text-xs">Instructor Portal</strong>
                          <span className="text-[10px] text-slate-500">Faculty Roster & Grading</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setIsAuthMenuOpen(false);
                          onOpenAuth('admin', 'login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-900" />
                        <div>
                          <strong className="block text-slate-900 text-xs">Admin Console</strong>
                          <span className="text-[10px] text-slate-500">Admissions & Operations</span>
                        </div>
                      </button>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-[11px]">
                        <span className="text-slate-500">New student?</span>
                        <button
                          onClick={() => {
                            setIsAuthMenuOpen(false);
                            onOpenAuth('student', 'signup');
                          }}
                          className="font-semibold text-blue-900 hover:underline cursor-pointer"
                        >
                          Create Account →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enroll Button */}
              <button
                onClick={() => onOpenEnrollment()}
                id="nav-enroll-btn"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enroll Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* Mobile Menu & Quick Actions (Sign In + Enroll + Menu) */}
            <div className="flex sm:hidden items-center gap-1.5">
              {currentUser ? (
                <button
                  onClick={onOpenPortal}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-900 font-semibold text-xs border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Portal</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuth('student', 'login')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-900 font-semibold text-xs border border-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <LogIn className="w-3 h-3 text-blue-900" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Enrollment Tab beside Sign In */}
              <button
                onClick={() => onOpenEnrollment()}
                id="mobile-nav-enroll-btn"
                className="px-2.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 active:scale-95 text-white font-semibold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all"
              >
                <Sparkles className="w-3 h-3 text-blue-200" />
                <span>Enroll</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 max-h-[80vh] overflow-y-auto">
            
            {/* Logged in User Bar on Mobile */}
            {currentUser && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{currentUser.name}</span>
                  <span className="text-[10px] text-blue-900 uppercase font-semibold">{currentUser.role} • {currentUser.identifierCode}</span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenPortal();
                  }}
                  className="px-3 py-1 bg-blue-900 text-white text-xs font-semibold rounded-lg"
                >
                  Dashboard
                </button>
              </div>
            )}

            {/* Navigation links */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-900 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Mobile Portal Selection */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3">
                Academy Portals (Sign In / Register)
              </span>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('student', 'login');
                  }}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-blue-900 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800 block">Student</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('instructor', 'login');
                  }}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-blue-900 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800 block">Instructor</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth('admin', 'login');
                  }}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-900 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800 block">Admin</span>
                </button>

                {onOpenWebmail && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenWebmail();
                    }}
                    className="p-2 bg-amber-50 border border-amber-300 rounded-lg text-center cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-amber-700 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-amber-900 block">Webmail</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {savedApplicationsCount > 0 && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenMyApplications();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
                >
                  <FileText className="w-4 h-4 text-blue-900" />
                  <span>View Saved Application ({savedApplicationsCount})</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenEnrollment();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-900 text-white text-xs font-semibold shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Quick Enrollment</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-red-600 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

          </div>
        )}
      </nav>
    </header>
  );
};
