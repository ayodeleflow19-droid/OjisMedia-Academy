import { CategoryItem } from '../types';

export const CATEGORIES_STORAGE_KEY = 'ojis_media_categories';
export const CATEGORIES_UPDATED_EVENT = 'ojis_categories_updated';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'filmmaking',
    name: 'Video Production & Cinematography',
    shortLabel: 'Video & Film',
    description: 'Master camera rigs, cinematic 3-point lighting, narrative directing & real-world set execution.',
    icon: 'Film',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'photography',
    name: 'Professional Photography & Studio Lighting',
    shortLabel: 'Photography',
    description: 'Studio strobe lighting, editorial portraiture, fashion shoots, documentary & Adobe Lightroom retouching.',
    icon: 'Camera',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'editing',
    name: 'Video Editing & Color Grading Mastery',
    shortLabel: 'Video Editing',
    description: 'Premiere Pro & DaVinci Resolve workflows, pacing, multi-cam assembly, audio sweetening & cinematic color science.',
    icon: 'Scissors',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'design',
    name: 'Graphic Design & UI/UX Product Design',
    shortLabel: 'Design & UI',
    description: 'Brand identity systems, typography, Figma UI/UX prototyping, visual hierarchy & design system creation.',
    icon: 'Palette',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'content',
    name: 'Content Creation & Digital Media Strategy',
    shortLabel: 'Content Creation',
    description: 'Short-form viral content (Reels/TikTok/Shorts), storytelling, YouTube channel growth & personal branding.',
    icon: 'Smartphone',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'motion',
    name: 'Motion Graphics & Visual Effects (VFX)',
    shortLabel: 'Motion Graphics',
    description: 'Adobe After Effects motion design, title animations, 3D elements, logo stings, and broadcast packaging.',
    icon: 'Sparkles',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'audio',
    name: 'Audio Engineering & Podcast Production',
    shortLabel: 'Audio & Podcast',
    description: 'Studio microphone techniques, live broadcast switching, Rodecaster console engineering & podcast syndication.',
    icon: 'Mic',
    status: 'active',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
];

/**
 * Retrieve all categories from storage or seed defaults
 */
export function getStoredCategories(): CategoryItem[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading categories from localStorage:', err);
  }

  // Seed default categories
  setStoredCategories(INITIAL_CATEGORIES);
  return INITIAL_CATEGORIES;
}

/**
 * Save categories array to storage and emit update event
 */
export function setStoredCategories(categories: CategoryItem[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CATEGORIES_UPDATED_EVENT, { detail: categories }));
    }
  } catch (err) {
    console.error('Error saving categories to localStorage:', err);
  }
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): CategoryItem | undefined {
  const all = getStoredCategories();
  return all.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

/**
 * Create a new Category (Master Admin power)
 */
export function createStoredCategory(category: CategoryItem): CategoryItem {
  const all = getStoredCategories();
  
  // Format slug id if needed
  const cleanId = (category.id || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).toLowerCase();
  
  const newCat: CategoryItem = {
    ...category,
    id: cleanId,
    status: category.status || 'active',
    createdAt: category.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = all.findIndex((c) => c.id === cleanId);
  if (existingIndex >= 0) {
    all[existingIndex] = newCat;
  } else {
    all.push(newCat);
  }

  setStoredCategories(all);
  return newCat;
}

/**
 * Update an existing Category (Master Admin power)
 */
export function updateStoredCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
  const all = getStoredCategories();
  const index = all.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
  
  if (index === -1) return null;

  const updated: CategoryItem = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  all[index] = updated;
  setStoredCategories(all);
  return updated;
}

/**
 * Suspend or Activate Category (Master Admin power)
 */
export function setCategoryStatus(id: string, status: 'active' | 'suspended'): CategoryItem | null {
  return updateStoredCategory(id, { status });
}

/**
 * Delete a Category (Master Admin power)
 */
export function deleteStoredCategory(id: string): boolean {
  const all = getStoredCategories();
  const filtered = all.filter((c) => c.id.toLowerCase() !== id.toLowerCase());
  
  if (filtered.length !== all.length) {
    setStoredCategories(filtered);
    return true;
  }
  return false;
}
