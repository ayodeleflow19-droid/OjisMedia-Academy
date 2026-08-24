import React, { useState, useEffect, useMemo } from 'react';
import { Course, CourseStatus, CategoryItem, UserAccount } from '../types';
import { api } from '../lib/api';
import {
  getStoredCourses,
  createStoredCourse,
  updateStoredCourse,
  setCourseStatus as setLocalCourseStatus,
  deleteStoredCourse,
  COURSES_UPDATED_EVENT,
} from '../data/coursesData';
import { getStoredCategories, CATEGORIES_UPDATED_EVENT } from '../data/categoriesData';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Power,
  Search,
  Check,
  X,
  AlertTriangle,
  Clock,
  Award,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  User,
  Wrench,
  GraduationCap,
  ListPlus,
  Tag,
  Eye,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminCourseManagementProps {
  currentUser: UserAccount;
  onViewCourseDetail?: (course: Course) => void;
}

const STOCK_STUDIO_IMAGES = [
  {
    name: 'Cinema Camera Rig',
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Video Editing Suite',
    url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Graphic Design Studio',
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Studio Photography',
    url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Podcast Microphone Set',
    url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sound Mixing Console',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
  },
];

export const AdminCourseManagement: React.FC<AdminCourseManagementProps> = ({
  currentUser,
  onViewCourseDetail,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'draft'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Delete State
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  // Course Form States
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFullDescription, setFormFullDescription] = useState('');
  const [formImage, setFormImage] = useState(STOCK_STUDIO_IMAGES[0].url);
  const [formDuration, setFormDuration] = useState('8 Weeks');
  const [formLevel, setFormLevel] = useState<'Beginner' | 'Beginner → Intermediate' | 'Intermediate' | 'Intermediate → Advanced' | 'All Levels'>('Beginner → Intermediate');
  const [formMode, setFormMode] = useState<'Physical' | 'Hybrid' | 'Online'>('Physical');
  const [formPrice, setFormPrice] = useState<number>(120000);
  const [formCohortDate, setFormCohortDate] = useState('March 15, 2026');
  const [formSchedule, setFormSchedule] = useState('Saturdays: 10:00 AM – 3:00 PM');
  const [formPrerequisites, setFormPrerequisites] = useState('Basic computer literacy and passion for creative media.');
  const [formStatus, setFormStatus] = useState<CourseStatus>('active');

  // Dynamic Array Fields
  const [formTools, setFormTools] = useState<string[]>(['Adobe Premiere Pro', 'DaVinci Resolve']);
  const [newToolInput, setNewToolInput] = useState('');

  const [formOutcomes, setFormOutcomes] = useState<string[]>([
    'Master practical industry-standard studio workflows',
    'Produce a professional portfolio piece ready for clients',
  ]);
  const [newOutcomeInput, setNewOutcomeInput] = useState('');

  // Curriculum Modules State
  const [formCurriculum, setFormCurriculum] = useState<Array<{ week: number; title: string; topics: string[] }>>([
    { week: 1, title: 'Introduction & Studio Orientation', topics: ['Safety protocols, hardware overview, gear handling'] },
    { week: 2, title: 'Core Technical Execution', topics: ['Practical hands-on exercises, live recording & capture'] },
  ]);
  const [newWeekTitle, setNewWeekTitle] = useState('');
  const [newWeekTopics, setNewWeekTopics] = useState('');

  // Instructor Info
  const [formInstructorName, setFormInstructorName] = useState(currentUser.name || 'Lead Instructor');
  const [formInstructorRole, setFormInstructorRole] = useState('Senior Media Specialist');
  const [formInstructorAvatar, setFormInstructorAvatar] = useState(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  const [formError, setFormError] = useState('');

  const loadData = async () => {
    const localCourses = getStoredCourses();
    const localCats = getStoredCategories();
    setCourses(localCourses);
    setCategories(localCats);

    // Sync from server
    try {
      const cRes = await api.getCourses();
      if (cRes.success && cRes.courses) setCourses(cRes.courses);

      const catRes = await api.getCategories();
      if (catRes.success && catRes.categories) setCategories(catRes.categories);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadData();

    const handleCoursesUpdated = (e: any) => {
      if (e.detail) setCourses(e.detail);
      else loadData();
    };

    const handleCatsUpdated = (e: any) => {
      if (e.detail) setCategories(e.detail);
      else setCategories(getStoredCategories());
    };

    window.addEventListener(COURSES_UPDATED_EVENT, handleCoursesUpdated);
    window.addEventListener(CATEGORIES_UPDATED_EVENT, handleCatsUpdated);

    return () => {
      window.removeEventListener(COURSES_UPDATED_EVENT, handleCoursesUpdated);
      window.removeEventListener(CATEGORIES_UPDATED_EVENT, handleCatsUpdated);
    };
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    const defaultCat = categories.find((c) => c.status === 'active')?.id || 'video-editing';
    setEditingCourse(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory(defaultCat);
    setFormDescription('');
    setFormFullDescription('');
    setFormImage(STOCK_STUDIO_IMAGES[0].url);
    setFormDuration('8 Weeks');
    setFormLevel('Beginner → Intermediate');
    setFormMode('Physical');
    setFormPrice(120000);
    setFormCohortDate('March 15, 2026');
    setFormSchedule('Saturdays: 10:00 AM – 3:00 PM');
    setFormPrerequisites('Basic computer literacy.');
    setFormStatus('active');
    setFormTools(['Adobe Premiere Pro', 'DaVinci Resolve']);
    setFormOutcomes(['Produce 3 industry portfolio projects', 'Master real-time multi-track editing']);
    setFormCurriculum([
      { week: 1, title: 'Foundations & Studio Workspace Setup', topics: ['Workspace optimization, file management, codec mastery'] },
      { week: 2, title: 'Hands-on Production & Live Recording', topics: ['Lighting setup, audio sync, multi-camera switching'] },
    ]);
    setFormInstructorName(currentUser.name || 'Lead Instructor');
    setFormInstructorRole('Senior Faculty Instructor');
    setFormInstructorAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormSlug(course.slug || course.id);
    setFormCategory(course.category);
    setFormDescription(course.shortDescription || '');
    setFormFullDescription(course.fullDescription || course.shortDescription || '');
    setFormImage(course.image);
    setFormDuration(course.duration);
    setFormLevel(course.level as any);
    setFormMode(course.mode || 'Physical');
    setFormPrice(course.price || 0);
    setFormCohortDate(course.upcomingCohort || 'Open Enrollment');
    setFormSchedule(course.schedule || 'Weekdays: 10:00 AM – 1:00 PM');
    setFormPrerequisites(course.prerequisites || 'Basic computer knowledge.');
    setFormStatus(course.status || 'active');
    setFormTools(Array.isArray(course.tools) ? [...course.tools] : []);
    setFormOutcomes(Array.isArray(course.outcomes) ? [...course.outcomes] : []);
    setFormCurriculum(Array.isArray(course.curriculum) ? [...course.curriculum] : []);
    setFormInstructorName(course.instructorName || 'Lead Instructor');
    setFormInstructorRole(course.instructorRole || 'Media Faculty');
    setFormInstructorAvatar(course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setFormError('');
    setIsModalOpen(true);
  };

  // Add Tool Tag
  const handleAddTool = () => {
    if (newToolInput.trim() && !formTools.includes(newToolInput.trim())) {
      setFormTools([...formTools, newToolInput.trim()]);
      setNewToolInput('');
    }
  };

  const handleRemoveTool = (tool: string) => {
    setFormTools(formTools.filter((t) => t !== tool));
  };

  // Add Outcome Item
  const handleAddOutcome = () => {
    if (newOutcomeInput.trim()) {
      setFormOutcomes([...formOutcomes, newOutcomeInput.trim()]);
      setNewOutcomeInput('');
    }
  };

  const handleRemoveOutcome = (index: number) => {
    setFormOutcomes(formOutcomes.filter((_, i) => i !== index));
  };

  // Add Curriculum Module
  const handleAddCurriculumWeek = () => {
    if (newWeekTitle.trim()) {
      const weekNumber = formCurriculum.length + 1;
      const topics = newWeekTopics
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      setFormCurriculum([
        ...formCurriculum,
        {
          week: weekNumber,
          title: newWeekTitle.trim(),
          topics: topics.length > 0 ? topics : ['Core practical exercises and studio assignment'],
        },
      ]);
      setNewWeekTitle('');
      setNewWeekTopics('');
    }
  };

  const handleRemoveCurriculumWeek = (weekNumber: number) => {
    const updated = formCurriculum
      .filter((c) => c.week !== weekNumber)
      .map((c, idx) => ({ ...c, week: idx + 1 }));
    setFormCurriculum(updated);
  };

  // Save Course (Create / Edit)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Course Title is required.');
      return;
    }
    if (!formCategory) {
      setFormError('Please assign an Academic Category.');
      return;
    }

    const cleanSlug = (formSlug.trim() || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase();
    const formattedPrice = `₦${Number(formPrice || 0).toLocaleString()}`;

    const payload: Course = {
      id: cleanSlug,
      slug: cleanSlug,
      title: formTitle.trim(),
      category: formCategory,
      shortDescription: formDescription.trim() || formTitle.trim(),
      fullDescription: formFullDescription.trim() || formDescription.trim(),
      image: formImage,
      duration: formDuration,
      level: formLevel,
      mode: formMode,
      price: Number(formPrice) || 0,
      formattedPrice,
      upcomingCohort: formCohortDate,
      schedule: formSchedule,
      prerequisites: formPrerequisites,
      tools: formTools,
      outcomes: formOutcomes,
      curriculum: formCurriculum,
      instructorName: formInstructorName,
      instructorRole: formInstructorRole,
      instructorAvatar: formInstructorAvatar,
      status: formStatus,
    };

    if (editingCourse) {
      // Modify
      updateStoredCourse(editingCourse.id, payload);
      await api.updateCourse(editingCourse.id, payload);
      showToast('success', `Course "${payload.title}" updated successfully.`);
    } else {
      // Create
      createStoredCourse(payload);
      await api.createCourse(payload);
      showToast('success', `Course "${payload.title}" published successfully.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  // Suspend / Reactivate Quick Toggle
  const handleToggleStatus = async (course: Course) => {
    const newStatus: CourseStatus = course.status === 'active' ? 'suspended' : 'active';
    setLocalCourseStatus(course.id, newStatus);
    await api.setCourseStatus(course.id, newStatus);
    loadData();
    showToast(
      newStatus === 'suspended' ? 'info' : 'success',
      `Course "${course.title}" is now ${newStatus.toUpperCase()}.${
        newStatus === 'suspended' ? ' It is temporarily hidden from active enrollment.' : ' It is now open for enrollment.'
      }`
    );
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCourse) return;
    const courseId = deletingCourse.id;
    deleteStoredCourse(courseId);
    await api.deleteCourse(courseId);
    loadData();
    showToast('error', `Course "${deletingCourse.title}" deleted.`);
    setDeletingCourse(null);
  };

  // Filtered List
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCat = selectedCategory === 'all' || c.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesStatus = statusFilter === 'all' || (c.status || 'active') === statusFilter;
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.instructorName || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [courses, selectedCategory, statusFilter, searchQuery]);

  const activeCount = courses.filter((c) => c.status === 'active' || !c.status).length;
  const suspendedCount = courses.filter((c) => c.status === 'suspended').length;
  const draftCount = courses.filter((c) => c.status === 'draft').length;

  const isMasterAdmin = currentUser.role === 'admin' && (currentUser.email === 'ayodeleflow19@gmail.com' || (currentUser as any).isMasterAdmin);
  const isInstructor = currentUser.role === 'instructor';

  return (
    <div className="space-y-6" id="admin-course-governance-panel">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-md ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : notification.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <Check className="w-4 h-4 text-emerald-600" />}
            {notification.type === 'error' && <Trash2 className="w-4 h-4 text-rose-600" />}
            {notification.type === 'info' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/5 rounded-lg text-slate-500 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner / Executive Authority */}
      <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-blue-800/40 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {isInstructor ? 'Faculty Course Authoring Studio' : 'Curriculum & Courses Management Studio'}
                </h3>
                <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 text-[10px] font-bold border border-blue-400/40">
                  {isMasterAdmin ? 'Master Executive Control' : isInstructor ? 'Authorized Faculty Author' : 'Executive Admin Authority'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {isInstructor
                  ? 'Author and configure high-caliber media courses and curriculum modules for Academy review and publication.'
                  : 'Create, modify, suspend, and delete academy courses. Suspended courses are immediately preserved but hidden from public enrollment.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            id="btn-admin-create-course"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 pt-3 border-t border-blue-900/60 text-xs">
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Catalog</span>
            <strong className="text-base sm:text-lg font-bold text-white">{courses.length} Courses</strong>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Active & Enrolling</span>
            <strong className="text-base sm:text-lg font-bold text-emerald-300">{activeCount} Published</strong>
          </div>
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300 uppercase font-semibold block">Suspended</span>
            <strong className="text-base sm:text-lg font-bold text-amber-300">{suspendedCount} Hidden</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title, tool, instructor..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} {cat.status === 'suspended' ? '(Suspended Cat)' : ''}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            {(['all', 'active', 'suspended'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer flex-shrink-0 ${
                  statusFilter === st
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? `All (${courses.length})` : st === 'active' ? `Active (${activeCount})` : `Suspended (${suspendedCount})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => {
          const isSuspended = course.status === 'suspended';
          const isDraft = course.status === 'draft';
          const matchedCategory = categories.find((c) => c.id.toLowerCase() === course.category?.toLowerCase());

          return (
            <div
              key={course.id}
              id={`admin-course-card-${course.id}`}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                isSuspended
                  ? 'bg-slate-50 border-amber-300/80 opacity-90 shadow-sm'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                      {matchedCategory?.name || course.category}
                    </span>

                    <div>
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold shadow-sm">
                          <Power className="w-2.5 h-2.5" />
                          Suspended
                        </span>
                      ) : isDraft ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-400 text-white text-[10px] font-bold shadow-sm">
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                          <Check className="w-2.5 h-2.5" />
                          Live Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <Clock className="w-3.5 h-3.5 text-blue-300" />
                      <span>{course.duration}</span>
                    </div>
                    <span className="font-extrabold text-blue-300">{course.formattedPrice}</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 space-y-2.5">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">{course.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{course.description}</p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-slate-600 pt-1">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                      {course.level}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                      {course.learningMode || 'Physical'}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                      {course.curriculum?.length || 0} Modules
                    </span>
                  </div>

                  {/* Instructor preview */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-900" />
                      <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                        {course.instructorName || 'Academy Faculty'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{course.upcomingCohort}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(course)}
                    id={`btn-edit-course-${course.id}`}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(course)}
                    id={`btn-suspend-course-${course.id}`}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      isSuspended
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isSuspended ? 'Activate' : 'Suspend'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {onViewCourseDetail && (
                    <button
                      onClick={() => onViewCourseDetail(course)}
                      className="p-1.5 text-blue-900 hover:bg-blue-50 rounded-lg text-xs cursor-pointer"
                      title="View public curriculum page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => setDeletingCourse(course)}
                    id={`btn-delete-course-${course.id}`}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs cursor-pointer transition-colors"
                    title="Delete course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <strong className="text-slate-800 text-sm block">No Courses Found</strong>
            <p className="mt-1">Try adjusting your filters or create a new course.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-3 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Course</span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CREATE / EDIT COURSE MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                  {editingCourse ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingCourse ? `Edit Course: ${editingCourse.title}` : 'Create New Academy Course'}
                  </h3>
                  <span className="text-[10px] text-blue-200">
                    {isMasterAdmin ? 'Supreme Chancellor & Admin Control' : 'Executive Curriculum Studio'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* SECTION 1: Core Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                  <span>1. Core Identity & Category</span>
                </h4>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Course Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (!editingCourse) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                      }
                    }}
                    placeholder="e.g. Advanced Cinema Color Grading & HDR Delivery"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Academic Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.status === 'suspended' ? '(Suspended)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Course Slug / ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                      placeholder="e.g. color-grading-hdr"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Short Description (Catalog Summary)</label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief 1-2 sentence overview shown in course cards..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Curriculum Overview</label>
                  <textarea
                    value={formFullDescription}
                    onChange={(e) => setFormFullDescription(e.target.value)}
                    rows={3}
                    placeholder="Detailed course description, career pathways, studio equipment involved..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900 resize-none"
                  />
                </div>
              </div>

              {/* SECTION 2: Image Preset / Custom URL */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-blue-900" />
                  <span>2. Cover Image & Media</span>
                </h4>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Curated Studio Photography Presets</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {STOCK_STUDIO_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img.name}
                        onClick={() => setFormImage(img.url)}
                        className={`relative rounded-lg overflow-hidden border-2 h-14 cursor-pointer transition-all ${
                          formImage === img.url ? 'border-blue-900 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[8px] font-bold p-0.5 text-center truncate">
                          {img.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Or Custom Image URL</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              {/* SECTION 3: Duration, Price, Schedule, Mode */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <DollarSign className="w-3.5 h-3.5 text-blue-900" />
                  <span>3. Pricing, Format & Schedule</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tuition Fee (NGN) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block font-semibold">
                      Auto: ₦{Number(formPrice || 0).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Duration</label>
                    <select
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    >
                      <option value="4 Weeks">4 Weeks (Crash Course)</option>
                      <option value="6 Weeks">6 Weeks (Foundation)</option>
                      <option value="8 Weeks">8 Weeks (Standard Specialization)</option>
                      <option value="12 Weeks">12 Weeks (Comprehensive Diploma)</option>
                      <option value="16 Weeks">16 Weeks (Masterclass Academy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Learning Mode</label>
                    <select
                      value={formMode}
                      onChange={(e) => setFormMode(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    >
                      <option value="Physical">Physical (Studio-Based)</option>
                      <option value="Hybrid">Hybrid (Studio + Online)</option>
                      <option value="Online">Online Live Interactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Skill Level</label>
                    <select
                      value={formLevel}
                      onChange={(e) => setFormLevel(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Beginner → Intermediate">Beginner → Intermediate</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Intermediate → Advanced">Intermediate → Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Upcoming Cohort</label>
                    <input
                      type="text"
                      value={formCohortDate}
                      onChange={(e) => setFormCohortDate(e.target.value)}
                      placeholder="e.g. March 15, 2026"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Class Schedule</label>
                    <input
                      type="text"
                      value={formSchedule}
                      onChange={(e) => setFormSchedule(e.target.value)}
                      placeholder="e.g. Saturdays: 10:00 AM – 3:00 PM"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Tools & Learning Outcomes */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Wrench className="w-3.5 h-3.5 text-blue-900" />
                  <span>4. Software Tools & Learning Outcomes</span>
                </h4>

                {/* Software Tools Tag Adder */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Software & Equipment Mastered</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={newToolInput}
                      onChange={(e) => setNewToolInput(e.target.value)}
                      placeholder="e.g. DaVinci Resolve, Sony FX3, Blackmagic ATEM"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTool();
                        }
                      }}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTool}
                      className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                    >
                      Add Tool
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {formTools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold"
                      >
                        {tool}
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(tool)}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Outcomes List Adder */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Key Learning Outcomes & Takeaways</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={newOutcomeInput}
                      onChange={(e) => setNewOutcomeInput(e.target.value)}
                      placeholder="e.g. Build an end-to-end commercial portfolio video"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOutcome();
                        }
                      }}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddOutcome}
                      className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                    >
                      Add Outcome
                    </button>
                  </div>

                  <div className="space-y-1">
                    {formOutcomes.map((outcome, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{outcome}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveOutcome(idx)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 5: Week-by-Week Curriculum Builder */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <ListPlus className="w-3.5 h-3.5 text-blue-900" />
                  <span>5. Curriculum Syllabus ({formCurriculum.length} Modules)</span>
                </h4>

                {/* Module Adder */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">Add Curriculum Week / Module</span>
                  <input
                    type="text"
                    value={newWeekTitle}
                    onChange={(e) => setNewWeekTitle(e.target.value)}
                    placeholder="Week Module Title (e.g. Multi-Camera Studio Lighting & ATEM Switching)"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newWeekTopics}
                    onChange={(e) => setNewWeekTopics(e.target.value)}
                    placeholder="Topics covered (comma separated: Key light setup, ISO recording, Audio sync)"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCurriculumWeek}
                    className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    + Add Week Module
                  </button>
                </div>

                {/* Module List */}
                <div className="space-y-2">
                  {formCurriculum.map((mod) => (
                    <div
                      key={mod.week}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-900 text-white text-[10px] font-bold rounded">
                            Week {mod.week}
                          </span>
                          <strong className="text-xs text-slate-900">{mod.title}</strong>
                        </div>
                        <ul className="mt-1.5 space-y-0.5 pl-4 list-disc text-[11px] text-slate-600">
                          {mod.topics.map((t, tidx) => (
                            <li key={tidx}>{t}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCurriculumWeek(mod.week)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove Module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: Instructor & Status */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-blue-900" />
                  <span>6. Lead Instructor & Status</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lead Instructor Name</label>
                    <input
                      type="text"
                      value={formInstructorName}
                      onChange={(e) => setFormInstructorName(e.target.value)}
                      placeholder="e.g. Master Ayodele / Victor Adeleke"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Instructor Role / Title</label>
                    <input
                      type="text"
                      value={formInstructorRole}
                      onChange={(e) => setFormInstructorRole(e.target.value)}
                      placeholder="e.g. Principal Media Producer & Director"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Publication Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStatus('active')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        formStatus === 'active'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Active (Live)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormStatus('suspended')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        formStatus === 'suspended'
                          ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5 text-amber-600" />
                      <span>Suspended (Hidden)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormStatus('draft')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        formStatus === 'draft'
                          ? 'bg-slate-200 border-slate-400 text-slate-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>Draft Mode</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-save-course"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingCourse ? 'Save Course Changes' : 'Publish Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE COURSE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Course Permanently</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-900">"{deletingCourse.title}"</strong>? This will remove its curriculum, pricing, and enrollments link.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-colors"
              >
                Yes, Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
