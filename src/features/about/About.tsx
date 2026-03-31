import { Fragment } from 'react';
import StaggerInView from '@/shared/components/StaggerInView';
import heroWaveOrbLeft from '@/assets/about-hero-wave-orb-left.svg';
import heroGlassBlobCenter from '@/assets/about-hero-glass-blob-center.svg';
import heroWaveOrbRight from '@/assets/about-hero-wave-orb-right.svg';

const skills = [
  'React',
  'TypeScript',
  'PWA',
  'TanStack Query',
  'Zustand',
  'OAuth 2.0',
  '에러 모니터링 (Sentry)',
  '성능 지표 개선 (Lighthouse)',
  '모노레포 (JS/TS)',
  '협업 프로세스 (PR/Wiki)',
];

export default function About() {
  return (
    <AboutMain />
  );
}

/* ── About Main Page ────────────────────────────────── */

function AboutMain() {
  return (
    <div className='pb-20 w-full max-w-5xl mx-auto'>
      {/* ── HERO ─────────────────────────────── */}
      <section className='pt-8 mb-16'>
        <StaggerInView className='flex flex-col gap-4 md:gap-5' stagger={0.2} y={20} amount={0.15}>
          <h2 className='theme-section-label text-sm font-medium tracking-[0.2em] uppercase'>
            Welcome to my universe
          </h2>

          <div className='relative mb-0 isolate'>
            {/* Decorative 3D vector assets */}
            <div className='about-hero-orb about-hero-orb--right absolute -top-16 -right-14 z-0'>
              <img
                src={heroWaveOrbRight}
                alt=''
                aria-hidden='true'
                className='pointer-events-none select-none w-[180px] md:w-[250px] lg:w-[290px] opacity-40 md:opacity-50 blur-[0.3px] rotate-[-7deg]'
              />
            </div>
            <div className='about-hero-orb about-hero-orb--left absolute -bottom-16 -left-16 z-0'>
              <img
                src={heroWaveOrbLeft}
                alt=''
                aria-hidden='true'
                className='pointer-events-none select-none w-[220px] md:w-[320px] lg:w-[370px] opacity-20 md:opacity-30 blur-[0.5px] rotate-6'
              />
            </div>
            <div className='about-hero-orb about-hero-orb--center absolute -top-8 left-1/2 z-0'>
              <img
                src={heroGlassBlobCenter}
                alt=''
                aria-hidden='true'
                className='pointer-events-none select-none -translate-x-1/2 w-[160px] md:w-[220px] lg:w-[260px] opacity-15 md:opacity-20 blur-[1.1px]'
              />
            </div>

            {/* 배경 그라데이션: 범위를 조금 더 넓히고 중심을 텍스트 쪽으로 이동 */}
            <div
              className='absolute -inset-10 rounded-full pointer-events-none opacity-50'
              style={{
                background:
                  'radial-gradient(circle at 30% 50%, rgba(236,72,153,0.15), transparent 70%)',
              }}
            />

            {/* 제목: 자간을 좁히고(tighter) 행간을 더 붙여서 단단한 느낌을 줌 */}
            <h1 className='theme-heading relative z-10 text-4xl md:text-7xl font-extrabold tracking-tighter leading-[1.2]'>
              프론트엔드 개발자, <br />
              <span className='gradient-text whitespace-nowrap'>
                홍민정입니다.
              </span>
            </h1>
          </div>

          <p className='text-xl md:text-2xl text-white/90 font-semibold max-w-2xl leading-[snug]'>
            <span className='text-pink-400/90'>상황에 맞는 선택</span>을
            설계하는 개발을 이어나갑니다.
          </p>

          <p className='text-base md:text-lg text-white/60 max-w-lg md:max-w-xl leading-relaxed border-l-2 border-white/10 pl-5'>
            {/* 본문의 너비를 살짝 줄여서 가독성을 높이고, 왼쪽에 얇은 선으로 포인트를 줌 */}
            프론트엔드 개발을 중심으로, 백엔드 영역까지 학습하며 더 넓은 시야로
            문제를 바라보려 하고 있습니다.{' '}
            <strong className='text-white/80 font-medium'>
              {' '}
              React와 TypeScript
            </strong>
            를 사용해, 확장성과 단순함 사이에서 균형 잡힌 구조를 만드는 것을
            중요하게 생각합니다. 여러 선택지를 비교하며 맥락에 맞는 결정을
            고민하고, 경험에서 느낀 불편을 개선하며 더 나은 방향으로 발전해
            나갑니다.
          </p>

          {/* Stack chips */}
          <div className='flex flex-wrap items-center gap-2'>
            {skills.map((skill) => (
              <Fragment key={skill}>
                <span className='glass px-2.5 py-1 rounded-full text-[11px] text-white/60 cursor-default hover:text-white/85 hover:bg-white/10 transition-colors'>
                  {skill}
                </span>
                {/* 줄바꿈 요소 삽입 */}
                {skill === 'OAuth 2.0' && <div className='w-full h-0' />}
              </Fragment>
            ))}
          </div>
        </StaggerInView>
      </section>
    </div>
  );
}
