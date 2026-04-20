import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useLocation, useRoute } from 'wouter';
import { AboutParallax } from '@/components/AboutParallax';
import { AboutStatic } from '@/components/AboutStatic';

import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { JokaDetail } from '@/components/JokaDetail';
import { LocusDetail } from '@/components/LocusDetail';
import { MintDetail } from '@/components/MintDetail';
import { MiniGitDetail } from '@/components/MiniGitDetail';
import { HanzawaKanjiDetail } from '@/components/HanzawaKanjiDetail';
import { ActivitiesCarousel } from '@/components/ActivitiesCarousel';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { PortfolioFooter } from '@/components/layout/PortfolioFooter';
import { useIsPointerCoarse } from '@/hooks/use-mobile';

import assetGradient from '@assets/about/gradient-pastel.jpg';
import assetClouds from '@assets/about/clouds.png';
import assetMoon from '@assets/about/moon.png';

const TABS = ['About', 'Projects', 'Activities'] as const;
type Tab = (typeof TABS)[number];

// ─── Route mapping ───────────────────────────────────────────────────────────

const TAB_PATH: Record<Tab, string> = {
  About: '/',
  Projects: '/projects',
  Activities: '/activities',
};

function pathToTab(path: string): Tab {
  if (path.startsWith('/projects')) {
    return 'Projects';
  }
  if (path.startsWith('/activities')) {
    return 'Activities';
  }
  return 'About';
}

// ─── Tilt interaction constants ──────────────────────────────────────────────

const TILT_STRENGTH = 5;
const TILT_SPRING_CONFIG = { stiffness: 100, damping: 30, mass: 1 };

// ─── Data ────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 'locus',
    title: 'Locus',
    oneliner: '공간 기반 기록 서비스',
    period: '2025.12 - 2026.02',
    tags: ['React', 'TypeScript', 'PWA'],
    accentColor: '#C4B5FD',
    isMain: true,
    github: 'https://github.com/boostcampwm2025/web06-locus',
    link: undefined as string | undefined,
    problemStatement:
      '특정 장소를 방문할 때마다 남기고 싶은 기록을 직관적으로 저장하고, 지도 위에서 시각적으로 탐색할 수 있는 경험이 부재했습니다.',
    highlights: [
      {
        label: '핵심 과제',
        content: '지도와 기록이 유기적으로 연결되는 인터랙션 설계',
      },
      {
        label: '문제',
        content: '좌표 기반 데이터와 UX의 연결 지점에서 발생하는 성능 저하',
      },
      {
        label: '해결',
        content:
          '클러스터링 알고리즘과 viewport 기반 lazy rendering으로 최적화',
      },
    ],
  },
  {
    id: 'joka',
    title: 'Joka',
    oneliner: '가족 중심 사진 아카이브 PWA',
    period: '2026.01 - 현재',
    tags: ['PWA', 'React', 'Zustand'],
    accentColor: '#93C5FD',
    isMain: false,
    github: 'https://github.com/mindjuk/joka',
    link: undefined as string | undefined,
    problemStatement:
      '가족 단위 사진 아카이브 앱은 사생활 보호와 공유 편의성 사이의 균형이 어렵습니다.',
    highlights: [
      { label: '핵심 과제', content: '비공개 앨범과 선택적 공유 기능의 설계' },
      { label: '문제', content: '오프라인 환경에서의 이미지 캐싱 및 동기화' },
      {
        label: '해결',
        content: 'Service Worker + IndexedDB 기반 오프라인 퍼스트 아키텍처',
      },
    ],
  },
  {
    id: 'mini-git',
    title: 'mini-git',
    oneliner: 'Git 학습용 CLI',
    period: '2025.03 - 2025.06',
    tags: ['Node.js', 'CLI'],
    accentColor: '#A7F3D0',
    isMain: false,
    github: 'https://github.com/mindaaaa/mini-git',
    link: undefined as string | undefined,
    problemStatement:
      'Git의 내부 동작 원리를 이해하지 못한 채 명령어를 외워 사용하는 패턴을 개선하고자 했습니다.',
    highlights: [
      {
        label: '핵심 과제',
        content: 'Git 핵심 명령어를 직접 구현하며 내부 원리 체득',
      },
      {
        label: '문제',
        content: 'Content-addressable storage 구조 재현의 복잡성',
      },
      {
        label: '해결',
        content: 'SHA-1 해싱 기반 객체 저장소와 ref 시스템 직접 구현',
      },
    ],
  },
  {
    id: 'mint',
    title: 'mint',
    oneliner: '커스텀 스크립트 언어 인터프리터',
    period: '2025.11',
    tags: ['TypeScript', '언어 설계'],
    accentColor: '#FBCFE8',
    isMain: false,
    github: 'https://github.com/mindaaaa/mint',
    link: undefined as string | undefined,
    problemStatement:
      '프로그래밍 언어가 어떻게 동작하는지를 직접 구현해보며 이해하고자 했습니다.',
    highlights: [
      {
        label: '핵심 과제',
        content: 'Lexer → Parser → Evaluator 파이프라인 설계',
      },
      { label: '문제', content: 'AST 노드 타입 정의와 재귀적 평가의 복잡성' },
      {
        label: '해결',
        content: 'Visitor 패턴 기반 트리 순회로 확장 가능한 구조 확보',
      },
    ],
  },
  {
    id: 'hanzawa-kanji',
    title: 'hanzawa-kanji',
    oneliner: '일본 상용한자 학습',
    period: '2025.03 - 2025.04',
    tags: ['React', '학습'],
    accentColor: '#FDE68A',
    isMain: false,
    github: 'https://github.com/mindaaaa/hanzawa-kanji-web',
    link: undefined as string | undefined,
    problemStatement:
      '일본 상용한자 2136자를 효율적으로 학습할 수 있는 반복 학습 시스템이 필요했습니다.',
    highlights: [
      { label: '핵심 과제', content: '망각 곡선 기반 스케줄링 알고리즘 설계' },
      { label: '문제', content: '한자별 복습 주기와 학습 진도 상태의 영속성' },
      {
        label: '해결',
        content: 'SM-2 알고리즘 구현 + localStorage 기반 오프라인 상태 유지',
      },
    ],
  },
] as const;

type Project = (typeof PROJECTS)[number];

// ─── Main Portfolio ───────────────────────────────────────────────────────────

export default function Portfolio() {
  const [location, setLocation] = useLocation();
  const activeTab = pathToTab(location);
  const isPointerCoarse = useIsPointerCoarse();

  const containerRef = useRef<HTMLDivElement>(null);
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const springRotateX = useSpring(rotateXValue, TILT_SPRING_CONFIG);
  const springRotateY = useSpring(rotateYValue, TILT_SPRING_CONFIG);

  useEffect(() => {
    if (isPointerCoarse) {
      return;
    }

    let pending = false;
    let lastEvent: MouseEvent | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      lastEvent = e;
      if (pending) {
        return;
      }
      pending = true;
      requestAnimationFrame(() => {
        if (lastEvent) {
          const { innerWidth, innerHeight } = window;
          const x = (lastEvent.clientX / innerWidth - 0.5) * TILT_STRENGTH;
          const y = (lastEvent.clientY / innerHeight - 0.5) * -TILT_STRENGTH;
          rotateYValue.set(x);
          rotateXValue.set(y);
        }
        pending = false;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rotateXValue, rotateYValue, isPointerCoarse]);

  return (
    <div className='min-h-screen w-full relative font-sans text-[#1a1a2e]'>
      <BackgroundBlobs />

      <main
        className='w-full min-h-screen flex items-start justify-center p-0 sm:p-6 md:p-10 sm:py-6'
        style={{
          position: 'relative',
          zIndex: 1,
          perspective: isPointerCoarse ? undefined : '2000px',
        }}
      >
        <motion.div
          ref={containerRef}
          className='glass-effect w-full max-w-6xl h-[100dvh] sm:h-[92dvh] lg:h-[88vh] rounded-none sm:rounded-[24px] lg:rounded-[36px] flex flex-col relative shadow-2xl overflow-hidden'
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: isPointerCoarse ? undefined : 'preserve-3d',
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.55)',
            boxShadow:
              'inset 1px 1px 0 rgba(255,255,255,0.7), 0 32px 64px rgba(31,38,135,0.12)',
          }}
        >
          {/* ── Header / Nav ─────────────────────────────────────────────── */}
          <header className='w-full px-4 py-3 sm:px-6 sm:py-5 md:px-10 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 border-b border-white/25 shrink-0'>
            <div className='flex items-center' style={{ gap: 20 }}>
              <div
                className='font-bold text-xl tracking-tight shrink-0'
                style={{ color: '#1a1a2e' }}
              >
                Portfolio.
              </div>
              <SocialLinks />
            </div>

            <nav
              className='glass-effect flex items-center gap-1 p-1.5 rounded-full'
              style={{
                background: 'rgba(255,255,255,0.45)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.7)',
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLocation(TAB_PATH[tab])}
                  data-testid={`tab-${tab.toLowerCase()}`}
                  className={`relative px-4 py-1 text-xs sm:px-5 sm:py-1.5 sm:text-sm rounded-full font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId='active-pill'
                      className='glass-effect absolute inset-0 rounded-full'
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(255,255,255,0.8)',
                        zIndex: 0,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className='relative' style={{ zIndex: 1 }}>
                    {tab}
                  </span>
                </button>
              ))}
            </nav>
          </header>

          {/* ── Content ──────────────────────────────────────────────────── */}
          <div
            className='flex-1 relative overflow-y-auto overflow-x-hidden'
            style={{ minHeight: 0 }}
          >
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={
                  activeTab === 'Projects'
                    ? 'p-4 sm:p-6 md:p-10 relative'
                    : ''
                }
                style={
                  activeTab === 'About' || activeTab === 'Activities'
                    ? { height: '100%', overflow: 'hidden' }
                    : undefined
                }
              >
                {activeTab === 'About' &&
                  (isPointerCoarse ? <AboutStatic /> : <AboutParallax />)}
                {activeTab === 'Projects' && <ProjectsSection />}
                {activeTab === 'Activities' && <ActivitiesCarousel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────

function ProjectsBg({ sticky = false }: { sticky?: boolean }) {
  const content = (
    <>
      <img
        src={assetGradient}
        alt=''
        style={{
          position: 'absolute',
          inset: '-20px',
          width: 'calc(100% + 40px)',
          height: 'calc(100% + 40px)',
          objectFit: 'cover',
          opacity: 0.35,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <img
        src={assetClouds}
        alt=''
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140%',
          opacity: 0.25,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <img
        src={assetMoon}
        alt=''
        style={{
          position: 'absolute',
          top: 'clamp(10px, 3vw, 20px)',
          right: 'clamp(16px, 4vw, 40px)',
          width: 'clamp(48px, 10vw, 80px)',
          opacity: 0.18,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </>
  );

  if (sticky) {
    return (
      <div
        className='-mx-4 -mt-4 sm:-mx-6 sm:-mt-6 md:-mx-10 md:-mt-10'
        style={{
          position: 'sticky',
          top: 0,
          height: 0,
          overflow: 'visible',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          className='w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-[calc(100%+5rem)]'
          style={{
            position: 'relative',
            height: 'calc(88vh - 5rem)',
            overflow: 'hidden',
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
}

function ProjectsSection() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>('/projects/:id');
  const selectedId = params?.id ?? null;
  const selected = selectedId
    ? (PROJECTS.find((p) => p.id === selectedId) ?? null)
    : null;

  const onSelect = (project: Project) => setLocation(`/projects/${project.id}`);
  const onBack = () => setLocation('/projects');

  const renderDetail = (project: Project) => {
    switch (project.id) {
      case 'locus':
        return <LocusDetail onBack={onBack} />;
      case 'joka':
        return <JokaDetail onBack={onBack} />;
      case 'mint':
        return <MintDetail onBack={onBack} />;
      case 'mini-git':
        return <MiniGitDetail onBack={onBack} />;
      case 'hanzawa-kanji':
        return <HanzawaKanjiDetail onBack={onBack} />;
      default:
        return <ProjectDetail project={project} onBack={onBack} />;
    }
  };

  return (
    <LayoutGroup>
      <AnimatePresence mode='popLayout' initial={false}>
        {selected ? (
          <motion.div
            key={`detail-${selected.id}`}
            layoutId={`card-${selected.id}`}
            style={{
              position: 'relative',
              zIndex: 2,
              background: 'var(--doc-bg)',
              borderRadius: '16px',
              margin: '-24px -24px 0',
              padding: '0',
              minHeight: 'calc(100% + 24px)',
              overflow: 'clip',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
            transition={{
              layout: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            {/* Content appears after card expansion */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.18, ease: 'easeOut' },
              }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
            >
              {renderDetail(selected)}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key='grid'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <ProjectsBg />
            <BentoGrid onSelect={onSelect} />
            <PortfolioFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

function BentoGrid({ onSelect }: { onSelect: (p: Project) => void }) {
  return (
    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[clamp(160px,28vw,200px)]'>
      {/* Locus — mobile: 2 rows tall, tablet: full-width row, desktop: 2x2 */}
      <ProjectCard
        project={PROJECTS[0]}
        onSelect={onSelect}
        className='row-span-2 sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-2'
        isBig
      />
      {/* Joka — implicit placement */}
      <ProjectCard project={PROJECTS[1]} onSelect={onSelect} />
      {/* mini-git — implicit placement */}
      <ProjectCard project={PROJECTS[2]} onSelect={onSelect} />
      {/* hanzawa-kanji — tablet/desktop: col-span-2 */}
      <ProjectCard
        project={PROJECTS[4]}
        onSelect={onSelect}
        className='sm:col-span-2'
        isWide
      />
      {/* mint — tablet: full-width, desktop: single col */}
      <ProjectCard
        project={PROJECTS[3]}
        onSelect={onSelect}
        className='sm:col-span-2 lg:col-span-1'
      />
    </div>
  );
}

// ─── Quick-action icon SVGs ───────────────────────────────────────────────────

function IconGithub() {
  return (
    <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6' />
      <polyline points='15 3 21 3 21 9' />
      <line x1='10' y1='14' x2='21' y2='3' />
    </svg>
  );
}

function ProjectCard({
  project,
  onSelect,
  className = '',
  isBig = false,
  isWide = false,
}: {
  project: Project;
  onSelect: (p: Project) => void;
  className?: string;
  isBig?: boolean;
  isWide?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isPointerCoarse = useIsPointerCoarse();
  const iconVisible = hovered || isPointerCoarse;
  const iconOpacity = hovered ? 1 : isPointerCoarse ? 0.7 : 0;

  return (
    <motion.button
      layoutId={`card-${project.id}`}
      data-testid={`card-project-${project.id}`}
      data-cursor-label='VIEW'
      onClick={() => onSelect(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      className={`glass-effect relative overflow-hidden rounded-[20px] text-left w-full h-full group ${className}`}
      style={{
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.55)',
        boxShadow:
          'inset 1px 1px 0 rgba(255,255,255,0.6), 0 4px 20px rgba(31,38,135,0.07)',
        cursor: 'pointer',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      {/* Accent glow on hover */}
      <div
        className='absolute -bottom-16 -right-16 rounded-full blur-[50px] opacity-0 group-hover:opacity-40 transition-opacity duration-500'
        style={{
          width: '220px',
          height: '220px',
          backgroundColor: project.accentColor,
        }}
      />
      {/* Border highlight on hover */}
      <motion.div
        className='absolute inset-0 rounded-[20px] pointer-events-none'
        style={{
          border: '1px solid rgba(255,255,255,0.0)',
          boxShadow: 'inset 0 0 0 0px rgba(255,255,255,0)',
        }}
        whileHover={{
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.8), 0 0 20px ${project.accentColor}44`,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* ── Quick action icons (top-right, appear on hover) ── */}
      <div
        className='absolute z-20'
        style={{ top: '12px', right: '12px', display: 'flex', gap: '6px' }}
      >
        {project.github && (
          <motion.a
            href={project.github}
            aria-label='GitHub 저장소'
            data-testid={`card-github-${project.id}`}
            data-cursor='pill'
            data-cursor-label='GITHUB'
            onClick={(e) => {
              e.stopPropagation();
            }}
            initial={false}
            animate={{
              opacity: iconOpacity,
              scale: iconVisible ? 1 : 0.72,
              y: iconVisible ? 0 : -5,
            }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.58)',
              border: '1px solid rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a1a2e',
              textDecoration: 'none',
              pointerEvents: iconVisible ? 'auto' : 'none',
            }}
          >
            <IconGithub />
          </motion.a>
        )}
        {project.link && (
          <motion.a
            href={project.link}
            aria-label='외부 링크'
            data-testid={`card-link-${project.id}`}
            data-cursor='pill'
            data-cursor-label='OPEN'
            onClick={(e) => {
              e.stopPropagation();
            }}
            initial={false}
            animate={{
              opacity: iconOpacity,
              scale: iconVisible ? 1 : 0.72,
              y: iconVisible ? 0 : -5,
            }}
            transition={{
              duration: 0.2,
              delay: 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.58)',
              border: '1px solid rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1a1a2e',
              textDecoration: 'none',
              pointerEvents: iconVisible ? 'auto' : 'none',
            }}
          >
            <IconExternalLink />
          </motion.a>
        )}
      </div>

      <div className='relative z-10 h-full flex flex-col justify-between p-5 md:p-6'>
        {/* Tags */}
        <div className='flex gap-1.5 flex-wrap'>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className='glass-effect px-2.5 py-1 rounded-full text-xs font-medium'
              style={{
                background: 'rgba(255,255,255,0.45)',
                border: '1px solid rgba(255,255,255,0.65)',
                color: '#3d3470',
                backdropFilter: 'blur(8px)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title + oneliner */}
        <div>
          <p
            className='text-xs font-medium mb-1'
            style={{ color: 'rgba(26,26,46,0.45)', letterSpacing: '0.01em' }}
          >
            {project.period}
          </p>
          <h3
            className='font-bold tracking-tight leading-tight'
            style={{
              fontSize: isBig
                ? 'clamp(1.7rem, 3vw, 2.4rem)'
                : isWide
                  ? '1.3rem'
                  : '1.1rem',
              color: '#1a1a2e',
            }}
          >
            {project.title}
          </h3>
          <p
            className='mt-1 font-medium'
            style={{
              fontSize: isBig ? '1rem' : '0.82rem',
              color: 'rgba(26,26,46,0.55)',
              letterSpacing: '-0.01em',
            }}
          >
            {project.oneliner}
          </p>
        </div>
      </div>

      {/* Arrow on hover */}
      <motion.div
        className='absolute bottom-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center'
        style={{
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.7)',
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          width='14'
          height='14'
          viewBox='0 0 14 14'
          fill='none'
          stroke='#1a1a2e'
          strokeWidth='1.8'
        >
          <path
            d='M2.5 7h9M7.5 3l4 4-4 4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}

// ─── Project Detail ───────────────────────────────────────────────────────────

function ProjectDetail({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  return (
    <div className='max-w-3xl mx-auto' data-testid={`detail-${project.id}`}>
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className='glass-effect flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium transition-all'
        style={{
          background: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.65)',
          color: '#3d3470',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{ scale: 1.03, x: -2 }}
        whileTap={{ scale: 0.98 }}
        data-testid='detail-back'
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
        >
          <path
            d='M10 3L5 8l5 5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        Projects
      </motion.button>

      {/* Hero */}
      <div className='mb-10'>
        <div className='flex flex-wrap gap-2 mb-4'>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className='glass-effect px-3 py-1 rounded-full text-xs font-medium'
              style={{
                background: 'rgba(255,255,255,0.45)',
                border: '1px solid rgba(255,255,255,0.65)',
                color: '#3d3470',
                backdropFilter: 'blur(8px)',
              }}
            >
              {tag}
            </span>
          ))}
          <span
            className='glass-effect px-3 py-1 rounded-full text-xs font-medium'
            style={{
              background: `${project.accentColor}33`,
              border: `1px solid ${project.accentColor}66`,
              color: '#3d3470',
            }}
          >
            {project.period}
          </span>
        </div>

        <h2
          className='font-bold mb-3'
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            letterSpacing: '-0.03em',
            color: '#1a1a2e',
            lineHeight: 1.2,
          }}
        >
          {project.title}
        </h2>
        <p
          className='text-base'
          style={{
            color: 'rgba(26,26,46,0.65)',
            lineHeight: 1.7,
            letterSpacing: '-0.01em',
          }}
        >
          {project.oneliner}
        </p>
      </div>

      {/* Problem Statement */}
      <div
        className='glass-effect rounded-[20px] p-6 md:p-8 mb-6'
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.25) 0%, ${project.accentColor}18 100%)`,
          border: '1px solid rgba(255,255,255,0.55)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <p
          className='text-xs font-bold uppercase tracking-widest mb-3'
          style={{ color: project.accentColor, letterSpacing: '0.16em' }}
        >
          핵심 문제 해결 과제
        </p>
        <p
          className='text-base leading-relaxed'
          style={{
            color: '#1a1a2e',
            lineHeight: 1.75,
            letterSpacing: '-0.01em',
          }}
        >
          {project.problemStatement}
        </p>
      </div>

      {/* Problem / Thinking / Solution grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        {project.highlights.map((h, i) => (
          <motion.div
            key={h.label}
            className='glass-effect rounded-[18px] p-5'
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.5)',
              backdropFilter: 'blur(14px)',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.08,
              duration: 0.36,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p
              className='text-xs font-bold uppercase tracking-widest mb-2'
              style={{
                color: 'rgba(130,100,240,0.7)',
                letterSpacing: '0.12em',
              }}
            >
              {h.label}
            </p>
            <p
              className='text-sm leading-relaxed'
              style={{ color: 'rgba(26,26,46,0.7)', lineHeight: 1.7 }}
            >
              {h.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
