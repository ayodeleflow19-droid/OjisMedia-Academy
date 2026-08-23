import React, { useState } from 'react';
import { PROJECTS_DATA } from '../data/projectsData';
import { ProjectShowcase } from '../types';
import { 
  Eye, 
  X, 
  Layers
} from 'lucide-react';

export const ProjectsShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectShowcase | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'photography', label: 'Photography' },
    { id: 'video', label: 'Video & Film' },
    { id: 'design', label: 'Graphic Design' },
    { id: 'branding', label: 'Brand Identity' },
    { id: 'content', label: 'Social Media' },
    { id: 'motion', label: 'Motion Graphics' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
              Student Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1.5 mb-2">
              Work produced in our studios
            </h2>
            <p className="text-sm text-slate-600">
              Commercial projects, editorial photography, and brand designs created by students.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProjectModal(project)}
              className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-end aspect-[4/5]"
            >
              {/* Main Image */}
              <img 
                src={project.image} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Category Tag */}
              <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                {project.categoryLabel}
              </div>

              {/* Bottom Content */}
              <div className="relative p-3.5 sm:p-4 z-10 space-y-1">
                <h3 className="font-semibold text-white text-sm line-clamp-1">
                  {project.title}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                  <span className="truncate">By {project.studentName}</span>
                  <span className="text-blue-300 font-medium">View →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Inspection Modal */}
        {activeProjectModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setActiveProjectModal(null)}
          >
            <div 
              className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/9] bg-slate-950">
                <img 
                  src={activeProjectModal.image} 
                  alt={activeProjectModal.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveProjectModal(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-semibold text-blue-900">
                      {activeProjectModal.categoryLabel}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeProjectModal.title}
                    </h3>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-500 block text-[10px]">Student Creator</span>
                    <strong className="text-slate-900 font-semibold">{activeProjectModal.studentName}</strong>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeProjectModal.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeProjectModal.toolsUsed.map((tool, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
