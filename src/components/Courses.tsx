import React, { useState, useEffect, useMemo } from 'react';
import { getStoredCourses, COURSES_UPDATED_EVENT } from '../data/coursesData';
import { getStoredCategories, CATEGORIES_UPDATED_EVENT } from '../data/categoriesData';
import { getStudentProgressForCourse, STUDENT_PROGRESS_UPDATED_EVENT } from '../data/studentProgress';
import { Course, CourseCategory, LearningMode, CategoryItem, UserAccount } from '../types';
import { CourseCard } from './CourseCard';
import { api } from '../lib/api';
import { 
  Search, 
  BookOpen, 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  Layers, 
  Film, 
  Camera, 
  Scissors, 
  Palette, 
  Smartphone, 
  Sparkles, 
  Mic, 
  Tv, 
  GraduationCap,
  Award,
  ChevronRight
} from 'lucide-react';

interface CoursesProps {
  onViewCourseDetails: (course: Course) => void;
  onEnrollCourse: (courseId?: string) => void;
  currentUser?: UserAccount | null;
  onOpenPortal?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Film,
  Camera,
  Scissors,
  Palette,
  Smartphone,
  Sparkles,
  Mic,
  Tv,
  GraduationCap,
  Layers,
};

export const Courses: React.FC<CoursesProps> = ({ 
  onViewCourseDetails, 
  onEnrollCourse, 
  currentUser,
  onOpenPortal
}) => {
  const [courses, setCourses] = useState<Course[]>(() => getStoredCourses());
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => getStoredCategories());
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [selectedMode, setSelectedMode] = useState<LearningMode | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyEnrolled, setShowOnlyEnrolled] = useState(false);
  const [progressVersion, setProgressVersion] = useState(0);

  // Initial load and listeners for dynamic updates
  useEffect(() => {
    const refreshData = () => {
      setCourses(getStoredCourses());
      setCategoriesList(getStoredCategories());
      setProgressVersion(v => v + 1);
    };

    // Load from backend if available
    const syncFromBackend = async () => {
      try {
        const [courseRes, catRes] = await Promise.allSettled([
          api.getCourses(),
          api.getCategories(),
        ]);
        if (courseRes.status === 'fulfilled' && courseRes.value.success && courseRes.value.courses) {
          setCourses(courseRes.value.courses);
        }
        if (catRes.status === 'fulfilled' && catRes.value.success && catRes.value.categories) {
          setCategoriesList(catRes.value.categories);
        }
      } catch (err) {
        console.warn('Backend sync notice in Courses component:', err);
      }
    };

    refreshData();
    syncFromBackend();

    window.addEventListener(COURSES_UPDATED_EVENT, refreshData);
    window.addEventListener(CATEGORIES_UPDATED_EVENT, refreshData);
    window.addEventListener(STUDENT_PROGRESS_UPDATED_EVENT, refreshData);

    return () => {
      window.removeEventListener(COURSES_UPDATED_EVENT, refreshData);
      window.removeEventListener(CATEGORIES_UPDATED_EVENT, refreshData);
      window.removeEventListener(STUDENT_PROGRESS_UPDATED_EVENT, refreshData);
    };
  }, []);

  // Filter out suspended courses for public view
  const activeCourses = useMemo(() => {
    return courses.filter((c) => c.status !== 'suspended');
  }, [courses]);

  // Compute total enrolled courses for active student
  const enrolledCoursesCount = useMemo(() => {
    return activeCourses.filter(c => !!getStudentProgressForCourse(c.id, currentUser)).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCourses, currentUser, progressVersion]);

  // Dynamic categories with live counts from active courses
  const categories = useMemo(() => {
    const activeCats = categoriesList.filter((c) => c.status !== 'suspended');

    const items: {
      id: CourseCategory;
      label: string;
      shortLabel: string;
      count: number;
      icon: React.ElementType;
    }[] = [
      {
        id: 'all',
        label: 'All Tracks',
        shortLabel: 'All Tracks',
        count: activeCourses.length,
        icon: Layers,
      },
    ];

    activeCats.forEach((cat) => {
      const IconComp = ICON_MAP[cat.icon] || Layers;
      const count = activeCourses.filter((c) => c.category === cat.id).length;
      items.push({
        id: cat.id as CourseCategory,
        label: cat.name,
        shortLabel: cat.shortLabel || cat.name,
        count,
        icon: IconComp,
      });
    });

    return items;
  }, [categoriesList, activeCourses]);

  const isFiltered = selectedCategory !== 'all' || selectedMode !== 'All' || searchQuery.trim().length > 0 || showOnlyEnrolled;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMode('All');
    setSearchQuery('');
    setShowOnlyEnrolled(false);
  };

  const filteredCourses = useMemo(() => {
    return activeCourses.filter((course) => {
      const courseProgress = getStudentProgressForCourse(course.id, currentUser);
      if (showOnlyEnrolled && !courseProgress) {
        return false;
      }

      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesMode = selectedMode === 'All' || course.mode === selectedMode || course.mode === 'Hybrid';
      const title = (course.title || '').toLowerCase();
      const shortDesc = (course.shortDescription || course.fullDescription || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        !query ||
        title.includes(query) ||
        shortDesc.includes(query) ||
        (Array.isArray(course.tools) && course.tools.some(t => (t || '').toLowerCase().includes(query))) ||
        (Array.isArray(course.outcomes) && course.outcomes.some(o => (o || '').toLowerCase().includes(query)));

      return matchesCategory && matchesMode && matchesSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCourses, selectedCategory, selectedMode, searchQuery, showOnlyEnrolled, currentUser, progressVersion]);

  return (
    <section id="courses" className="py-12 sm:py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                Academy Programs
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                {activeCourses.length} Curricula Available
              </span>
              {enrolledCoursesCount > 0 && (
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold shadow-2xs flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{enrolledCoursesCount} Enrolled {enrolledCoursesCount === 1 ? 'Track' : 'Tracks'}</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Professional Media Disciplines
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1.5">
              Hands-on, studio-based training crafted by industry directors, cinematographers, sound designers, and motion artists.
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-600 font-medium">
            <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-2xs">
              Showing <strong className="text-slate-900 font-bold">{filteredCourses.length}</strong> of <strong className="text-slate-900 font-bold">{activeCourses.length}</strong> courses
            </span>
          </div>
        </div>

        {/* ENROLLED STUDENT ACTIVE BANNER & QUICK FILTER */}
        {enrolledCoursesCount > 0 && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                    Student Progress Active
                  </span>
                  <span className="text-[10px] bg-emerald-500/30 px-2 py-0.2 rounded-full font-extrabold text-emerald-300">
                    Live Status
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                  {currentUser?.name ? `Welcome back, ${currentUser.name}.` : 'Student account connected.'}{' '}
                  Your courses feature live progress bars, module milestones, and class completion metrics below.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
              <button
                onClick={() => setShowOnlyEnrolled(!showOnlyEnrolled)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-initial whitespace-nowrap active:scale-98 ${
                  showOnlyEnrolled
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{showOnlyEnrolled ? 'Showing My Courses' : `Filter My Enrolled (${enrolledCoursesCount})`}</span>
              </button>

              {onOpenPortal && (
                <button
                  onClick={onOpenPortal}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 flex-1 sm:flex-initial whitespace-nowrap active:scale-98 shadow-xs"
                >
                  <span>Student Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter & Discipline Navigator Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs mb-8 p-4 sm:p-5 lg:p-6 space-y-4">
          
          {/* Top Search & Mode Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses, software (Premiere, DaVinci, FX3...), or outcomes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-9 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/10 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded-full hover:bg-slate-200/60 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mode Select */}
            <div className="w-full sm:w-60 sm:flex-shrink-0">
              <div className="relative">
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as any)}
                  className="w-full h-11 py-2.5 pl-3.5 pr-9 bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/10 appearance-none cursor-pointer shadow-2xs transition-all"
                >
                  <option value="All">All Learning Modes</option>
                  <option value="Physical">Physical Studio (In-Person)</option>
                  <option value="Hybrid">Hybrid (Studio + Remote)</option>
                  <option value="Online">Online Cohort</option>
                </select>
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Discipline Track Tabs Navigation - Fully wrapped & aligned without any sliding/scrollbar */}
          <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Layers className="w-3.5 h-3.5 text-blue-900" />
                <span>Filter by Discipline</span>
              </div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs font-semibold text-blue-900 hover:text-blue-700 cursor-pointer transition-colors"
                >
                  Show All Tracks ({activeCourses.length})
                </button>
              )}
            </div>

            {/* Responsive Tabs: Structured 2-Col Grid on Mobile, Fluid Inline Pills on Tablet & Desktop */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-2.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const IconComponent = cat.icon;
                const isMasterTrack = cat.id === 'all';
                
                return (
                  <button
                    key={cat.id}
                    id={`track-tab-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3 sm:px-3.5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                      isMasterTrack ? 'col-span-2 sm:col-span-1' : 'col-span-1'
                    } ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs border border-blue-900 ring-2 ring-blue-900/10'
                        : 'bg-slate-50 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <IconComponent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isActive ? 'text-blue-200' : 'text-slate-500'}`} />
                      <span className="text-[11.5px] sm:text-xs md:text-sm truncate sm:overflow-visible sm:whitespace-nowrap font-semibold">
                        {cat.shortLabel}
                      </span>
                    </div>
                    
                    <span className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white text-slate-600 border border-slate-200/80 shadow-2xs'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Helper Strip */}
          {isFiltered && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
                {showOnlyEnrolled && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200">
                    <span>Enrolled Only</span>
                    <button 
                      onClick={() => setShowOnlyEnrolled(false)} 
                      className="hover:text-emerald-950 cursor-pointer p-0.5 rounded hover:bg-emerald-200 transition-colors" 
                      aria-label="Remove enrolled filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200/80">
                    <span>Track: {categories.find(c => c.id === selectedCategory)?.shortLabel}</span>
                    <button 
                      onClick={() => setSelectedCategory('all')} 
                      className="hover:text-blue-950 cursor-pointer p-0.5 rounded hover:bg-blue-200/50 transition-colors" 
                      aria-label="Remove category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedMode !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                    <span>Mode: {selectedMode}</span>
                    <button 
                      onClick={() => setSelectedMode('All')} 
                      className="hover:text-slate-950 cursor-pointer p-0.5 rounded hover:bg-slate-200 transition-colors" 
                      aria-label="Remove mode filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                    <span>"{searchQuery}"</span>
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="hover:text-slate-950 cursor-pointer p-0.5 rounded hover:bg-slate-200 transition-colors" 
                      aria-label="Clear query filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-blue-900 hover:text-blue-700 font-bold cursor-pointer text-xs py-1 px-2.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredCourses.map((course) => {
              const progress = getStudentProgressForCourse(course.id, currentUser);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={onViewCourseDetails}
                  onEnroll={onEnrollCourse}
                  progress={progress}
                  onOpenPortal={onOpenPortal}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              No matching courses found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              We couldn't find any courses matching your filter criteria. Try clearing your search query or selecting "All Tracks".
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All {activeCourses.length} Courses</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

