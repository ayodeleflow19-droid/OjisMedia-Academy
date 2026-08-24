import React, { useState, useEffect, useMemo } from 'react';
import { getStoredCourses, COURSES_UPDATED_EVENT } from '../data/coursesData';
import { getStoredCategories, CATEGORIES_UPDATED_EVENT } from '../data/categoriesData';
import { Course, CourseCategory, LearningMode, CategoryItem } from '../types';
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
  GraduationCap
} from 'lucide-react';

interface CoursesProps {
  onViewCourseDetails: (course: Course) => void;
  onEnrollCourse: (courseId?: string) => void;
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

export const Courses: React.FC<CoursesProps> = ({ onViewCourseDetails, onEnrollCourse }) => {
  const [courses, setCourses] = useState<Course[]>(() => getStoredCourses());
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(() => getStoredCategories());
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [selectedMode, setSelectedMode] = useState<LearningMode | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load and listeners for dynamic updates
  useEffect(() => {
    const refreshData = () => {
      setCourses(getStoredCourses());
      setCategoriesList(getStoredCategories());
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

    return () => {
      window.removeEventListener(COURSES_UPDATED_EVENT, refreshData);
      window.removeEventListener(CATEGORIES_UPDATED_EVENT, refreshData);
    };
  }, []);

  // Filter out suspended courses for public view
  const activeCourses = useMemo(() => {
    return courses.filter((c) => c.status !== 'suspended');
  }, [courses]);

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

  const isFiltered = selectedCategory !== 'all' || selectedMode !== 'All' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMode('All');
    setSearchQuery('');
  };

  const filteredCourses = useMemo(() => {
    return activeCourses.filter((course) => {
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
  }, [activeCourses, selectedCategory, selectedMode, searchQuery]);

  return (
    <section id="courses" className="py-12 sm:py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
                Course Tracks
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
                {activeCourses.length} Available Programs
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Professional Media Tracks
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1">
              Practical curricula designed for commercial film sets, creative studios, and freelance mastery.
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-500 font-medium">
            <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
              Showing <strong className="text-slate-900 font-bold">{filteredCourses.length}</strong> of <strong className="text-slate-900 font-bold">{activeCourses.length}</strong> courses
            </span>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          
          {/* Top Row: Search & Learning Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
            
            {/* Search Input */}
            <div className="relative sm:col-span-8 lg:col-span-9">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses, gear, software, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/10 transition-all shadow-2xs"
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
            <div className="sm:col-span-4 lg:col-span-3">
              <div className="relative">
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as any)}
                  className="w-full py-2.5 pl-3.5 pr-9 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/10 appearance-none cursor-pointer shadow-2xs transition-all"
                >
                  <option value="All">All Learning Modes</option>
                  <option value="Physical">Physical Studio</option>
                  <option value="Hybrid">Hybrid (Studio + Online)</option>
                  <option value="Online">Online Cohort</option>
                </select>
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Discipline Track Tabs */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Layers className="w-3.5 h-3.5 text-blue-900" />
                <span>Filter by Discipline</span>
              </div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[11px] font-semibold text-blue-900 hover:text-blue-700 cursor-pointer transition-colors"
                >
                  View All ({activeCourses.length})
                </button>
              )}
            </div>

            {/* Symmetrical, Fluid Grid for Perfectly Balanced Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const isAll = cat.id === 'all';
                const IconComponent = cat.icon;
                
                return (
                  <button
                    key={cat.id}
                    id={`track-tab-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                      isAll && categories.length % 2 !== 0 ? 'col-span-2 sm:col-span-1' : ''
                    } ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs border border-blue-900'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <IconComponent className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-blue-200' : 'text-slate-500'}`} />
                      <span className="truncate text-[11px] sm:text-xs">{cat.shortLabel}</span>
                    </div>
                    
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold flex-shrink-0 ml-1 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Helper Banner */}
          {isFiltered && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-medium text-slate-400">Active:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 text-[11px] font-semibold border border-blue-200/70">
                    Track: {categories.find(c => c.id === selectedCategory)?.shortLabel}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-blue-950 cursor-pointer ml-1" aria-label="Remove category filter">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedMode !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                    Mode: {selectedMode}
                    <button onClick={() => setSelectedMode('All')} className="hover:text-slate-950 cursor-pointer ml-1" aria-label="Remove mode filter">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-slate-950 cursor-pointer ml-1" aria-label="Clear query filter">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-blue-900 hover:text-blue-800 font-bold cursor-pointer text-xs py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All ({activeCourses.length})</span>
              </button>
            </div>
          )}

        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={onViewCourseDetails}
                onEnroll={onEnrollCourse}
              />
            ))}
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
