import React, { useState, useEffect, useMemo } from 'react';
import { CategoryItem, CategoryStatus, UserAccount } from '../types';
import { api } from '../lib/api';
import {
  getStoredCategories,
  createStoredCategory,
  updateStoredCategory,
  setCategoryStatus as setLocalCategoryStatus,
  deleteStoredCategory,
  CATEGORIES_UPDATED_EVENT,
} from '../data/categoriesData';
import { getStoredCourses, COURSES_UPDATED_EVENT } from '../data/coursesData';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Power,
  Search,
  Check,
  X,
  AlertTriangle,
  Film,
  Camera,
  Scissors,
  Palette,
  Smartphone,
  Sparkles,
  Mic,
  Music,
  Tv,
  Radio,
  Video,
  Headphones,
  Lightbulb,
  Award,
  Flame,
  ShieldCheck,
  FolderTree,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface MasterCategoryManagementProps {
  currentUser: UserAccount;
  onNavigateToCourses?: (categorySlug?: string) => void;
}

const AVAILABLE_ICONS = [
  { name: 'Film', icon: Film, label: 'Film & Cinema' },
  { name: 'Camera', icon: Camera, label: 'Photography' },
  { name: 'Scissors', icon: Scissors, label: 'Video Editing' },
  { name: 'Palette', icon: Palette, label: 'Design & UI' },
  { name: 'Smartphone', icon: Smartphone, label: 'Content Creation' },
  { name: 'Sparkles', icon: Sparkles, label: 'Motion & VFX' },
  { name: 'Mic', icon: Mic, label: 'Audio & Podcast' },
  { name: 'Music', icon: Music, label: 'Music & Sound' },
  { name: 'Video', icon: Video, label: 'Studio Video' },
  { name: 'Tv', icon: Tv, label: 'Broadcasting' },
  { name: 'Radio', icon: Radio, label: 'Radio Production' },
  { name: 'Headphones', icon: Headphones, label: 'Sound Engineering' },
  { name: 'Layers', icon: Layers, label: 'Multi-Discipline' },
  { name: 'Lightbulb', icon: Lightbulb, label: 'Creative Direction' },
  { name: 'Award', icon: Award, label: 'Masterclasses' },
  { name: 'Flame', icon: Flame, label: 'Fast Track Bootcamp' },
];

export function getCategoryIconComponent(iconName: string): React.ElementType {
  const match = AVAILABLE_ICONS.find((i) => i.name.toLowerCase() === (iconName || '').toLowerCase());
  return match ? match.icon : Layers;
}

export const MasterCategoryManagement: React.FC<MasterCategoryManagementProps> = ({
  currentUser,
  onNavigateToCourses,
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [courses, setCourses] = useState(getStoredCourses());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formShortLabel, setFormShortLabel] = useState('');
  const [formId, setFormId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState('Layers');
  const [formStatus, setFormStatus] = useState<CategoryStatus>('active');
  const [formError, setFormError] = useState('');

  // Delete Confirmation Modal
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

  const loadData = async () => {
    const localCats = getStoredCategories();
    setCategories(localCats);
    setCourses(getStoredCourses());

    // Also sync from backend
    try {
      const res = await api.getCategories();
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    loadData();

    const handleCatsUpdated = (e: any) => {
      if (e.detail) setCategories(e.detail);
      else loadData();
    };

    const handleCoursesUpdated = (e: any) => {
      if (e.detail) setCourses(e.detail);
      else setCourses(getStoredCourses());
    };

    window.addEventListener(CATEGORIES_UPDATED_EVENT, handleCatsUpdated);
    window.addEventListener(COURSES_UPDATED_EVENT, handleCoursesUpdated);

    return () => {
      window.removeEventListener(CATEGORIES_UPDATED_EVENT, handleCatsUpdated);
      window.removeEventListener(COURSES_UPDATED_EVENT, handleCoursesUpdated);
    };
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName('');
    setFormShortLabel('');
    setFormId('');
    setFormDescription('');
    setFormIcon('Film');
    setFormStatus('active');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormShortLabel(cat.shortLabel);
    setFormId(cat.id);
    setFormDescription(cat.description || '');
    setFormIcon(cat.icon || 'Layers');
    setFormStatus(cat.status || 'active');
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Form Submission
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Category Title is required.');
      return;
    }

    const cleanSlug = (formId.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase();
    if (!cleanSlug) {
      setFormError('A valid slug ID is required.');
      return;
    }

    const payload: CategoryItem = {
      id: cleanSlug,
      name: formName.trim(),
      shortLabel: formShortLabel.trim() || formName.trim(),
      description: formDescription.trim(),
      icon: formIcon,
      status: formStatus,
      createdBy: currentUser.name,
      updatedAt: new Date().toISOString(),
    };

    if (editingCategory) {
      // Modify
      updateStoredCategory(editingCategory.id, payload);
      await api.updateCategory(editingCategory.id, payload);
      showToast('success', `Category "${payload.name}" updated successfully.`);
    } else {
      // Create
      payload.createdAt = new Date().toISOString();
      createStoredCategory(payload);
      await api.createCategory(payload);
      showToast('success', `Category "${payload.name}" created successfully.`);
    }

    loadData();
    setIsModalOpen(false);
  };

  // Suspend / Activate Toggle
  const handleToggleStatus = async (cat: CategoryItem) => {
    const newStatus: CategoryStatus = cat.status === 'active' ? 'suspended' : 'active';
    setLocalCategoryStatus(cat.id, newStatus);
    await api.setCategoryStatus(cat.id, newStatus);
    loadData();
    showToast(
      newStatus === 'suspended' ? 'info' : 'success',
      `Category "${cat.name}" is now ${newStatus.toUpperCase()}.${
        newStatus === 'suspended' ? ' It is temporarily hidden from the public catalog.' : ' It is now live in the course tracks.'
      }`
    );
  };

  // Delete Category
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    const catId = deletingCategory.id;
    deleteStoredCategory(catId);
    await api.deleteCategory(catId);
    loadData();
    showToast('error', `Category "${deletingCategory.name}" has been permanently deleted.`);
    setDeletingCategory(null);
  };

  // Filtered List
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesStatus = statusFilter === 'all' || cat.status === statusFilter;
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [categories, statusFilter, searchQuery]);

  const activeCount = categories.filter((c) => c.status === 'active').length;
  const suspendedCount = categories.filter((c) => c.status === 'suspended').length;

  return (
    <div className="space-y-6" id="master-category-governance-panel">
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

      {/* Top Banner / Clearance Authority */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl border border-blue-900/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Master Category Governance & Taxonomy Suite
                </h3>
                <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 text-[10px] font-bold border border-blue-400/40">
                  Supreme Master Authority
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Create, modify, suspend, and delete academic course categories. Suspended categories immediately hide all child tracks from public enrollment.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            id="btn-create-new-category"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-all hover:scale-[1.02] flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Category</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Categories</span>
            <strong className="text-base sm:text-lg font-bold text-white">{categories.length} Tracks</strong>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Live / Active</span>
            <strong className="text-base sm:text-lg font-bold text-emerald-300">{activeCount} Published</strong>
          </div>
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300 uppercase font-semibold block">Suspended</span>
            <strong className="text-base sm:text-lg font-bold text-amber-300">{suspendedCount} Hidden</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name, slug or description..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex-shrink-0">Status:</span>
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
              {st === 'all' ? `All (${categories.length})` : st === 'active' ? `Active (${activeCount})` : `Suspended (${suspendedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategories.map((cat) => {
          const IconComp = getCategoryIconComponent(cat.icon);
          const categoryCourses = courses.filter((c) => c.category?.toLowerCase() === cat.id.toLowerCase());
          const isSuspended = cat.status === 'suspended';

          return (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              className={`p-4 rounded-2xl border transition-all relative ${
                isSuspended
                  ? 'bg-slate-50 border-amber-300/80 opacity-90 shadow-sm'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Top Row: Icon + Title + Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0 ${
                      isSuspended ? 'bg-amber-600' : 'bg-blue-900'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{cat.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-[10px] text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        slug: {cat.id}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        Short: {cat.shortLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isSuspended ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                      <Power className="w-3 h-3 text-amber-700" />
                      Suspended
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-300">
                      <Check className="w-3 h-3 text-emerald-700" />
                      Active Live
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 min-h-[32px]">
                {cat.description || 'No description provided for this academic category.'}
              </p>

              {/* Linked Courses Indicator */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <BookOpen className="w-3.5 h-3.5 text-blue-900" />
                  <span className="font-semibold">{categoryCourses.length} Courses Linked</span>
                </div>

                {isSuspended && (
                  <span className="text-[10px] text-amber-700 font-semibold italic">
                    Hidden from public portal
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    id={`btn-edit-category-${cat.id}`}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Modify</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(cat)}
                    id={`btn-suspend-category-${cat.id}`}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      isSuspended
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isSuspended ? 'Reactivate' : 'Suspend'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setDeletingCategory(cat)}
                  id={`btn-delete-category-${cat.id}`}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Delete</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
            <Layers className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <strong className="text-slate-800 text-sm block">No Categories Found</strong>
            <p className="mt-1">Try adjusting your search query or create a new category.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-3 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Category</span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CREATE / EDIT CATEGORY MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                  {editingCategory ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingCategory ? `Modify Category: ${editingCategory.name}` : 'Create New Academic Category'}
                  </h3>
                  <span className="text-[10px] text-blue-200">Master Chancellor Governance</span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Category Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editingCategory) {
                        setFormId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                        setFormShortLabel(e.target.value.split(' ')[0] || '');
                      }
                    }}
                    placeholder="e.g. Video Production & Cinematography"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Short Tab Label <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formShortLabel}
                      onChange={(e) => setFormShortLabel(e.target.value)}
                      placeholder="e.g. Video & Film"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Category Identifier Slug <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formId}
                      onChange={(e) => setFormId(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                      disabled={Boolean(editingCategory)}
                      placeholder="e.g. filmmaking"
                      className={`w-full p-2.5 border rounded-xl text-xs font-mono focus:outline-none ${
                        editingCategory
                          ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                          : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Outline the core disciplines, studio tools, and career pathways in this category..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-900 resize-none"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Category Visual Icon</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {AVAILABLE_ICONS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = formIcon.toLowerCase() === item.name.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => setFormIcon(item.name)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] font-medium leading-none text-center truncate w-full">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Governance Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormStatus('active')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formStatus === 'active'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active (Public Catalog)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStatus('suspended')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formStatus === 'suspended'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 text-amber-600" />
                    <span>Suspended (Hidden)</span>
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-category-submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingCategory ? 'Update Category' : 'Publish Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Category</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to permanently delete{' '}
                <strong className="text-slate-900">"{deletingCategory.name}"</strong>?
              </p>

              {courses.filter((c) => c.category?.toLowerCase() === deletingCategory.id.toLowerCase()).length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>
                    Warning: There are{' '}
                    <strong>
                      {courses.filter((c) => c.category?.toLowerCase() === deletingCategory.id.toLowerCase()).length} courses
                    </strong>{' '}
                    associated with this category. Deleting it will leave those courses without a parent category.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md transition-colors"
              >
                Yes, Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
