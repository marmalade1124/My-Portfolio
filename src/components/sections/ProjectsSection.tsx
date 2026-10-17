import { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Github, ExternalLink, ArrowUpRight, Maximize2, Layers, Play, LayoutGrid, List, ChevronDown, ChevronUp } from 'lucide-react';
import { PROJECTS, type Project } from '@/lib/data';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GridContainer } from '@/components/layout/GridContainer';
import { ImageLightboxModal } from '@/components/ui/ImageLightboxModal';

type FilterType = 'all' | 'software' | 'cad' | 'media' | 'hardware' | 'devtools';
type ViewMode = 'grid' | 'index';

const CATEGORIES: { label: string; value: FilterType }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'SOFTWARE & WEB', value: 'software' },
  { label: '3D CAD BLUEPRINTS', value: 'cad' },
  { label: 'VIDEOGRAPHY & MEDIA', value: 'media' },
  { label: 'HARDWARE & IOT', value: 'hardware' },
  { label: 'DEV TOOLS', value: 'devtools' },
];

const INITIAL_GRID_LIMIT = 6;

export function ProjectsSection() {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(0);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.tag === activeCategory);
  }, [activeCategory]);

  const displayedGridProjects = useMemo(() => {
    if (activeCategory !== 'all' || isExpanded) {
      return filteredProjects;
    }
    return filteredProjects.slice(0, INITIAL_GRID_LIMIT);
  }, [activeCategory, filteredProjects, isExpanded]);

  const handleOpenLightbox = (project: Project, index: number = 0) => {
    setLightboxProject(project);
    setLightboxImageIndex(index);
  };

  const handleCategoryChange = (cat: FilterType) => {
    setActiveCategory(cat);
    // Keep expanded state false on category reset
    if (cat !== 'all') {
      setIsExpanded(false);
    }
  };

  return (
    <section id="work" className="py-24 border-b border-zinc-200 bg-transparent">
      <GridContainer>
        {/* Section Header with Category Tabs & View Switcher */}
        <div className="flex flex-col gap-6 pb-8 border-b border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeading number="01" title="Selected Works & Systems" className="border-b-0 pb-0" />

            {/* View Mode Switcher (Grid vs Index) */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100/80 border border-zinc-200 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-black text-white font-medium'
                    : 'text-zinc-500 hover:text-black hover:bg-white/60'
                }`}
                title="Cards Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid size={13} />
                <span>Cards</span>
              </button>
              <button
                onClick={() => setViewMode('index')}
                className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 transition-colors cursor-pointer ${
                  viewMode === 'index'
                    ? 'bg-black text-white font-medium'
                    : 'text-zinc-500 hover:text-black hover:bg-white/60'
                }`}
                title="Compact Index Table View"
                aria-label="Index View"
              >
                <List size={13} />
                <span>Index Table</span>
              </button>
            </div>
          </div>

          {/* Clean Segmented Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100/80 border border-zinc-200">
            {CATEGORIES.map((cat) => {
              const count =
                cat.value === 'all'
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.tag === cat.value).length;
              const isActive = activeCategory === cat.value;

              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-black text-white font-medium shadow-xs'
                      : 'text-zinc-500 hover:text-black hover:bg-white/60'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- VIEW MODE 1: VISUAL EDITORIAL CARDS --- */}
        {viewMode === 'grid' && (
          <>
            <motion.div
              layout
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {displayedGridProjects.map((project: Project) => {
                  const hasImages = Boolean(project.coverImage || (project.images && project.images.length > 0));
                  const imageCount = project.images ? project.images.length : (project.coverImage ? 1 : 0);

                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={reduceMotion ? false : { opacity: 0, transform: 'translateY(24px)' }}
                      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
                      viewport={{ once: true, amount: 0.1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="group relative flex flex-col justify-between p-6 sm:p-8 bg-transparent border border-zinc-300 hover:border-black transition-colors duration-200"
                    >
                      {/* Card Top: Index Number + Category + Year */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between font-mono text-xs text-zinc-400 pb-4 border-b border-zinc-100">
                          <span className="font-semibold text-black">({project.num})</span>
                          <span className="uppercase tracking-widest text-[11px] text-zinc-500">
                            {project.category}
                          </span>
                          <span>{project.year}</span>
                        </div>

                        {/* Project Title */}
                        <div className="mt-5 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-['Montserrat',sans-serif] text-xl sm:text-2xl font-bold uppercase tracking-tight text-black group-hover:text-zinc-700 transition-colors">
                              {project.title}
                            </h3>
                            <div className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                              {project.role}
                            </div>
                          </div>

                          {hasImages && (
                            <button
                              onClick={() => handleOpenLightbox(project, 0)}
                              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 hover:bg-black hover:text-white text-zinc-700 border border-zinc-200 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                              title="View project screenshot gallery"
                            >
                              <Layers size={11} />
                              <span>{imageCount} {imageCount === 1 ? (project.tag === 'media' ? 'Still' : 'Photo') : 'Photos'}</span>
                            </button>
                          )}
                        </div>

                        {/* Rich Screenshot Preview if available */}
                        {hasImages && project.coverImage && (
                          <div
                            onClick={() => handleOpenLightbox(project, 0)}
                            className="relative mt-5 w-full aspect-[16/9] overflow-hidden border border-zinc-200 bg-zinc-950 cursor-pointer group/img"
                          >
                            <img
                              src={project.coverImage}
                              alt={`${project.title} preview`}
                              className="w-full h-full object-cover object-top opacity-90 group-hover/img:opacity-100 group-hover/img:scale-103 transition-all duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors" />

                            {/* Top-Right Expand Prompt Badge */}
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] uppercase tracking-wider opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-xs">
                              <Maximize2 size={10} />
                              <span>Expand</span>
                            </div>

                            {/* Multi-Photo Dots Indicator if > 1 images */}
                            {imageCount > 1 && (
                              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] uppercase tracking-wider backdrop-blur-xs">
                                <Layers size={10} />
                                <span>1 of {imageCount}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        <p className="mt-4 text-sm text-zinc-600 font-sans leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Card Bottom: Tech Pills + Action Links */}
                      <div className="relative z-10 mt-8 pt-6 border-t border-zinc-100 flex flex-col gap-4">
                        {/* Tech Stack Chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[11px] px-2 py-0.5 border border-zinc-200 bg-zinc-50 text-zinc-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Quick Action Links */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-black font-semibold hover:underline underline-offset-4"
                            >
                              <ExternalLink size={12} />
                              Live Demo
                              <ArrowUpRight size={12} />
                            </a>
                          )}

                          {project.videoUrl && (
                            <a
                              href={project.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-black font-semibold hover:underline underline-offset-4"
                            >
                              <Play size={11} className="fill-current" />
                              Watch Stream
                              <ArrowUpRight size={12} />
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-zinc-600 hover:text-black font-medium transition-colors"
                            >
                              <Github size={12} />
                              Repository
                              <ArrowUpRight size={12} />
                            </a>
                          )}

                          {hasImages && (
                            <button
                              onClick={() => handleOpenLightbox(project, 0)}
                              className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-black font-medium transition-colors cursor-pointer ml-auto"
                            >
                              <Maximize2 size={11} />
                              {project.tag === 'media' ? 'Inspect Still' : project.tag === 'cad' ? 'Inspect Blueprint' : 'Inspect Gallery'}
                            </button>
                          )}

                          {!project.githubUrl && !project.liveUrl && !project.videoUrl && !hasImages && (
                            <span className="font-mono text-xs text-zinc-400 italic">
                              Hardware / Engineering Build
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Expand / Collapse Action Bar when in ALL category and > INITIAL_GRID_LIMIT */}
            {activeCategory === 'all' && filteredProjects.length > INITIAL_GRID_LIMIT && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group inline-flex items-center gap-3 px-8 py-3.5 bg-black hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>
                    {isExpanded
                      ? `Show Featured (${INITIAL_GRID_LIMIT})`
                      : `View All ${filteredProjects.length} Works (+${filteredProjects.length - INITIAL_GRID_LIMIT})`}
                  </span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            )}
          </>
        )}

        {/* --- VIEW MODE 2: COMPACT SWISS INDEX TABLE --- */}
        {viewMode === 'index' && (
          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="border-b-2 border-black text-zinc-500 uppercase tracking-widest text-[10px]">
                  <th className="py-3 px-4 w-14">NO.</th>
                  <th className="py-3 px-4">PROJECT & ROLE</th>
                  <th className="py-3 px-4 hidden md:table-cell">CATEGORY</th>
                  <th className="py-3 px-4 hidden lg:table-cell">STACK</th>
                  <th className="py-3 px-4 w-20 text-center">YEAR</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredProjects.map((project: Project) => {
                  const hasImages = Boolean(project.coverImage || (project.images && project.images.length > 0));

                  return (
                    <tr
                      key={project.id}
                      className="group hover:bg-zinc-100/60 transition-colors"
                    >
                      {/* Num */}
                      <td className="py-3.5 px-4 font-semibold text-black">
                        ({project.num})
                      </td>

                      {/* Title & Role */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-['Montserrat',sans-serif] font-bold text-sm text-black group-hover:text-zinc-700">
                            {project.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {project.role}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-zinc-600 uppercase text-[11px]">
                        {project.category}
                      </td>

                      {/* Tech Stack */}
                      <td className="py-3.5 px-4 hidden lg:table-cell text-zinc-500 text-[11px]">
                        {project.techStack.slice(0, 3).join(' · ')}
                      </td>

                      {/* Year */}
                      <td className="py-3.5 px-4 text-center text-zinc-500">
                        {project.year}
                      </td>

                      {/* Actions & Links */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-3">
                          {hasImages && (
                            <button
                              onClick={() => handleOpenLightbox(project, 0)}
                              className="text-zinc-600 hover:text-black font-semibold uppercase text-[11px] inline-flex items-center gap-1 cursor-pointer"
                              title="Inspect Image"
                            >
                              <Maximize2 size={11} />
                              <span>Photo</span>
                            </button>
                          )}

                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black font-semibold hover:underline text-[11px] inline-flex items-center gap-1"
                            >
                              <span>Demo</span>
                              <ArrowUpRight size={11} />
                            </a>
                          )}

                          {project.videoUrl && (
                            <a
                              href={project.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black font-semibold hover:underline text-[11px] inline-flex items-center gap-1"
                            >
                              <Play size={10} className="fill-current" />
                              <span>Stream</span>
                              <ArrowUpRight size={11} />
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-500 hover:text-black text-[11px] inline-flex items-center gap-1"
                            >
                              <Github size={11} />
                              <ArrowUpRight size={11} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GridContainer>

      {/* Fullscreen Image Lightbox Modal */}
      <ImageLightboxModal
        project={lightboxProject}
        currentImageIndex={lightboxImageIndex}
        isOpen={Boolean(lightboxProject)}
        onClose={() => setLightboxProject(null)}
        onSelectImage={(idx) => setLightboxImageIndex(idx)}
      />
    </section>
  );
}

