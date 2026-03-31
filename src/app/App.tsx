import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/widgets/sidebar/Sidebar';
import CursorGlow from '@/widgets/cursor-glow/CursorGlow';
import WindowChrome from '@/widgets/window-chrome/WindowChrome';
import About from '@/features/about/About';
import Projects from '@/features/projects/Projects';
import ProjectDetail from '@/features/projects/ProjectDetail';
import Study from '@/features/study/Study';
import EasterEgg from '@/features/easter-egg/EasterEgg';
import DevPhilosophy from '@/features/dev-philosophy/DevPhilosophy';
import bgImage from '@/assets/image.png';
import type { Project } from '@/features/projects/model/types';
import { WINDOW_TITLES } from '@/config/window-titles';
import {
  APP_SECTIONS,
  pathnameForSection,
  sectionFromPathname,
  type AppSection,
} from '@/app/pathSync';

function readRoute(): { section: AppSection; notFound: boolean } {
  const s = sectionFromPathname(window.location.pathname);
  if (s !== null) return { section: s, notFound: false };
  return { section: 'about', notFound: true };
}

const initialRoute = readRoute();

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(
    initialRoute.section,
  );
  const [pathNotFound, setPathNotFound] = useState(initialRoute.notFound);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [easterEggType, setEasterEggType] = useState<
    'behind-scenes' | 'dev-philosophy' | null
  >(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Background parallax — RAF lerp, no re-renders
  useEffect(() => {
    let raf: number;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const MAX = 14;

    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.07) translate(${current.x * MAX}px, ${current.y * MAX}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const s = sectionFromPathname(window.location.pathname);
      setSelectedProject(null);
      setEasterEggType(null);
      setIsMinimized(false);
      if (s === null) {
        setPathNotFound(true);
        setActiveSection('about');
      } else {
        setPathNotFound(false);
        setActiveSection(s);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 상세/이스터에그 진입 시 이전 스크롤 위치를 물려받지 않도록 항상 상단으로 복귀
  useEffect(() => {
    if (!selectedProject && !easterEggType) return;
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [selectedProject?.id, easterEggType]);

  const handleSectionChange = (section: string) => {
    if (!(APP_SECTIONS as readonly string[]).includes(section)) return;
    const s = section as AppSection;
    setSelectedProject(null);
    setActiveSection(s);
    setIsMinimized(false);
    setEasterEggType(null);
    setPathNotFound(false);
    window.history.pushState({ section: s }, '', pathnameForSection(s));
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsMinimized(false);
    setEasterEggType(null);
  };

  const contentKey = selectedProject
    ? `project-detail-${selectedProject.id}`
    : pathNotFound
      ? 'path-not-found'
      : activeSection;

  const windowTitle =
    pathNotFound && !selectedProject && !easterEggType
      ? 'not.found'
      : easterEggType === 'behind-scenes'
        ? 'easter.egg'
        : easterEggType === 'dev-philosophy'
          ? 'dev.philosophy'
          : selectedProject
            ? selectedProject.title
            : (WINDOW_TITLES[activeSection] ?? activeSection);

  return (
    <div className='relative min-h-screen w-full overflow-hidden text-slate-800 font-sans selection:bg-sky-300/40'>
      {/* Background Image — parallax via ref */}
      <div
        ref={bgRef}
        className='fixed inset-0 z-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url(${bgImage})`,
          opacity: 1,
          transform: 'scale(1.07)',
          willChange: 'transform',
        }}
      />

      {/* Cursor-following glow */}
      <CursorGlow />


      {/* Main Layout */}
      <div className='relative z-10 flex flex-col md:flex-row h-screen w-full p-4 md:p-6 lg:p-8 gap-6 overflow-hidden'>
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <main className='flex-1 h-full w-full min-w-0'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={contentKey}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full w-full rounded-3xl flex flex-col overflow-hidden ${
                selectedProject
                  ? 'glass border border-white/50'
                  : 'glass'
              }`}
            >
              {/* ── Window Chrome ── */}
              <WindowChrome
                title={windowTitle}
                isMinimized={isMinimized}
                onMinimize={() => setIsMinimized(true)}
                onExpand={() => {
                  setIsMinimized(false);
                  setEasterEggType(null);
                }}
                onShiftMinimize={() => {
                  setIsMinimized(false);
                  setEasterEggType('behind-scenes');
                }}
                onShiftExpand={() => {
                  setIsMinimized(false);
                  setEasterEggType('dev-philosophy');
                }}
              />

              {/* ── Content Area ── */}
              <div className='flex-1 min-h-0 relative overflow-hidden'>
                {/* Minimized placeholder — fades in behind sliding content */}
                <motion.div
                  animate={{ opacity: isMinimized ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: isMinimized ? 0.18 : 0 }}
                  className='absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none'
                  style={{ pointerEvents: isMinimized ? 'auto' : 'none' }}
                >
                  <div className='flex flex-col items-center gap-3'>
                    <div className='w-10 h-px bg-slate-400/40' />
                    <p className='text-[11px] text-slate-500 tracking-[0.22em] uppercase font-medium'>
                      패널 최소화됨
                    </p>
                    <div className='w-10 h-px bg-slate-400/40' />
                  </div>
                  <button
                    onClick={() => setIsMinimized(false)}
                    className='mt-2 flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-slate-600 hover:text-slate-800 hover:bg-white/65 transition-all duration-200 tracking-widest uppercase pointer-events-auto'
                  >
                    <span className='text-[10px]'>▲</span> 복원
                  </button>
                </motion.div>

                {/* Scrollable content — slides up like a window shade on minimize */}
                <motion.div
                  ref={contentScrollRef}
                  animate={{
                    y: isMinimized ? '-100%' : '0%',
                    opacity: isMinimized ? 0.2 : 1,
                  }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full overflow-y-auto custom-scrollbar ${
                    selectedProject
                      ? 'snap-y snap-proximity scroll-smooth p-0'
                      : 'p-6 md:p-10'
                  }`}
                >
                  <AnimatePresence mode='wait'>
                    {easterEggType === 'behind-scenes' ? (
                      <motion.div
                        key='easter-egg'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <EasterEgg onClose={() => setEasterEggType(null)} />
                      </motion.div>
                    ) : easterEggType === 'dev-philosophy' ? (
                      <motion.div
                        key='dev-philosophy'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <DevPhilosophy onClose={() => setEasterEggType(null)} />
                      </motion.div>
                    ) : selectedProject ? (
                      <motion.div
                        key={`project-${selectedProject.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ProjectDetail
                          project={selectedProject}
                          onBack={() => setSelectedProject(null)}
                        />
                      </motion.div>
                    ) : pathNotFound ? (
                      <motion.div
                        key='path-not-found'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className='flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center px-6'
                      >
                        <p className='text-4xl font-light text-slate-500 tracking-tight'>
                          404
                        </p>
                        <p className='text-sm text-slate-600 max-w-sm'>
                          이 주소는 사이트에 없습니다. 사이드바에서 섹션을
                          선택하거나 홈으로 이동해 주세요.
                        </p>
                        <button
                          type='button'
                          onClick={() => handleSectionChange('about')}
                          className='mt-2 px-5 py-2 rounded-full glass text-xs text-slate-700 hover:text-slate-900 hover:bg-white/65 transition-colors tracking-widest uppercase'
                        >
                          홈으로
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={activeSection}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {activeSection === 'about' && <About />}
                        {activeSection === 'projects' && (
                          <Projects onSelectProject={handleProjectSelect} />
                        )}
                        {activeSection === 'study' && <Study />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.24);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(51, 65, 85, 0.34);
        }
      `}</style>
    </div>
  );
}
