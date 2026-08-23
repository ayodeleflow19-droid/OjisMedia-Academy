import React, { useState, useMemo } from 'react';
import { COURSES_DATA } from '../data/coursesData';
import { Course, CourseCategory, LearningMode } from '../types';
import { CourseCard } from './CourseCard';
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
  Sparkles
} from 'lucide-react';

interface CoursesProps {
  onViewCourseDetails: (course: Course) => void;
  onEnrollCourse: (courseId?: string) => void;
}

export const Courses: React.FC<CoursesProps> = ({ onViewCourseDetails, onEnrollCourse }) => {
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [selectedMode, setSelectedMode] = useState<LearningMode | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { 
    id: CourseCategory; 
    label: string; 
    shortLabel: string; 
    count: number; 
    icon: React.ElementType;
  }[] = useMemo(() => [
    { 
      id: 'all', 
      label: 'All Tracks', 
      shortLabel: 'All Tracks',
      count: COURSES_DATA.length,
      icon: Layers
    },
    { 
      id: 'filmmaking', 
      label: 'Video & Cinematography', 
      shortLabel: 'Video & Film',
      count: COURSES_DATA.filter(c => c.category === 'filmmaking').length,
      icon: Film
    },
    { 
      id: 'photography', 
      label: 'Photography & Lighting', 
      shortLabel: 'Photography',
      count: COURSES_DATA.filter(c => c.category === 'photography').length,
      icon: Camera
    },
    { 
      id: 'editing', 
      label: 'Video Editing & Grading', 
      shortLabel: 'Video Editing',
      count: COURSES_DATA.filter(c => c.category === 'editing').length,
      icon: Scissors
    },
    { 
      id: 'design', 
      label: 'Design & Product UI/UX', 
      shortLabel: 'Design & UI',
      count: COURSES_DATA.filter(c => c.category === 'design').length,
      icon: Palette
    },
    { 
      id: 'content', 
      label: 'Content Creation & Media', 
      shortLabel: 'Content Creation',
      count: COURSES_DATA.filter(c => c.category === 'content').length,
      icon: Smartphone
    },
    { 
      id: 'motion', 
      label: 'Motion Graphics & VFX', 
      shortLabel: 'Motion Graphics',
      count: COURSES_DATA.filter(c => c.category === 'motion').length,
      icon: Sparkles
    }
  ], []);

  const isFiltered = selectedCategory !== 'all' || selectedMode !== 'All' || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedMode('All');
    setSearchQuery('');
  };

  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesMode = selectedMode === 'All' || course.mode === selectedMode || course.mode === 'Hybrid';
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        course.outcomes.some(o => o.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesMode && matchesSearch;
    });
  }, [selectedCategory, selectedMode, searchQuery]);

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
                {COURSES_DATA.length} Available Programs
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
              Showing <strong className="text-slate-900 font-bold">{filteredCourses.length}</strong> of <strong className="text-slate-900 font-bold">{COURSES_DATA.length}</strong> courses
            </span>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
          
          {/* Top Row: Search & Learning Mode Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
            
            {/* Search Input */}
            <div className="relative sm:col-span-8">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses, gear, or software..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded-full hover:bg-slate-200/60"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mode Select */}
            <div className="sm:col-span-4">
              <div className="relative">
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as any)}
                  className="w-full py-2.5 pl-3.5 pr-9 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-900/10 appearance-none cursor-pointer"
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

          {/* Discipline Track Tabs: Perfectly Symmetrical 2-Col Grid on Mobile, Flex on Desktop */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Layers className="w-3.5 h-3.5 text-blue-900" />
                <span>Filter by Discipline</span>
              </div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[11px] font-semibold text-blue-900 hover:text-blue-800 cursor-pointer"
                >
                  View All ({COURSES_DATA.length})
                </button>
              )}
            </div>

            {/* Symmetrical Grid for Mobile & Fluid Wrap for Tablet/Desktop */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const isAll = cat.id === 'all';
                const IconComponent = cat.icon;
                
                return (
                  <button
                    key={cat.id}
                    id={`track-tab-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center justify-between sm:justify-start gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none active:scale-[0.98] ${
                      isAll ? 'col-span-2 sm:col-span-1' : ''
                    } ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-sm ring-2 ring-blue-900/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <IconComponent className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{cat.shortLabel}</span>
                    </div>
                    
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ml-1.5 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-200/80 text-slate-600'
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
                <span>Reset All ({COURSES_DATA.length})</span>
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
              <span>Show All {COURSES_DATA.length} Courses</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
