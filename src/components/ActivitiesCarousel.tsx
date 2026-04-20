import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsPointerCoarse } from '@/hooks/use-mobile';

import assetGradient from '@assets/about/gradient-pastel.jpg';
import assetClouds from '@assets/about/clouds.png';
import assetMoon from '@assets/about/moon.png';
import imgModernJs from '@assets/activities/modern-js.png';
import imgBoostcamp from '@assets/activities/boostcamp.png';
import imgHttp from '@assets/activities/http.webp';
import imgMindjuk from '@assets/activities/mindjuk.webp';
import imgBoostStudy from '@assets/activities/boostStudy.png';
import imgOmnivorous from '@assets/activities/omnivorousStudy.webp';
import imgVibeCoding from '@assets/activities/vibe-coding.webp';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Activity {
  id: string;
  period: string;
  title: string;
  tag: string;
  accent: string;
  image: string;
  learn: string;
  points: string[];
  connection: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: 'js-deep-dive',
    period: '2025.04 - 2025.05',
    title: '모던 자바스크립트\nDeep Dive 스터디',
    tag: '스터디',
    accent: '#CCFF00',
    image: imgModernJs,
    learn:
      '자바스크립트의 실행 컨텍스트, 클로저, 비동기 논블로킹 I/O 등 언어의 핵심 동작 원리를 심도 있게 학습했습니다.',
    points: [
      '실행 컨텍스트와 스코프 체인 원리 이해',
      '클로저 패턴과 메모리 관리 실습',
      '이벤트 루프와 비동기 처리 모델 체득',
    ],
    connection:
      "파편화되어 있던 지식을 '언어의 설계 의도'라는 관점으로 구조화했습니다.",
  },
  {
    id: 'boostcamp',
    period: '2025.08 - 2026.02',
    title: '네이버 부스트캠프\nFull-stack 과정',
    tag: '부트캠프',
    accent: '#FFD43B',
    image: imgBoostcamp,
    learn:
      '프론트엔드부터 백엔드, 인프라에 이르는 풀스택 개발 사이클을 경험하며 데이터가 시스템 전체를 흐르는 과정을 체득했습니다.',
    points: [
      '풀스택 개발 사이클 6회 프로젝트 수행',
      '팀 협업, 문서화, 스케줄 관리 경험',
      '백엔드 이해 기반 API 예외 처리 설계',
    ],
    connection:
      '기술적 구현을 넘어 팀 협업과 스케줄 관리의 중요성을 배웠습니다.',
  },
  {
    id: 'http-guide',
    period: '2025.12 - 2026.02',
    title: 'HTTP 완벽 가이드\n& WAS 구현 스터디',
    tag: '스터디',
    accent: '#FF6B6B',
    image: imgHttp,
    learn:
      '직접 WAS를 구현하며 HTTP 패킷 구조, 헤더의 역할, 연결 유지(Keep-Alive) 메커니즘을 심층 학습했습니다.',
    points: [
      'HTTP 패킷 구조와 헤더 역할 심층 이해',
      'Keep-Alive 메커니즘 직접 구현',
      '캐싱 정책 학습 및 성능 최적화 전략 수립',
    ],
    connection:
      "API 통신 이면의 '네트워크 비용'을 인지하고 성능 최적화 시야를 확보했습니다.",
  },
  {
    id: 'mindjuk',
    period: '2026.01 - 현재',
    title: '팀 Mindjuk\n사이드 프로젝트',
    tag: '사이드 프로젝트',
    accent: '#B8A9E8',
    image: imgMindjuk,
    learn:
      '운영 안정성(로깅, 에러 핸들링, 워크플로우)을 심도 있게 탐구하기 위해 소규모 팀 프로젝트를 주도했습니다.',
    points: [
      'n8n, Docker 기반 인프라 자동화',
      'AI 활용 데이터 분석 파이프라인 구축',
      '운영 환경 로깅 및 에러 핸들링 설계',
    ],
    connection:
      '프론트엔드를 넘어 시스템 운영 효율화까지 고민의 범위를 확장했습니다.',
  },
  {
    id: 'booststudy',
    period: '2026.02 - 현재',
    title: 'BoostStudy\nCS & 기술 면접 스터디',
    tag: '스터디',
    accent: '#63E6BE',
    image: imgBoostStudy,
    learn:
      '동료들과 함께 자료구조, 알고리즘 등 컴퓨터 과학 기초를 순환 구조로 학습하며 기술적 깊이를 다졌습니다.',
    points: [
      '자료구조 & 알고리즘 순환 학습 구조',
      '기술적 개념의 명확한 언어화 훈련',
      '동료와의 지식 공유로 다양한 관점 습득',
    ],
    connection:
      '모호한 기술 개념을 명확한 언어로 설명하는 커뮤니케이션 능력을 배양했습니다.',
  },
  {
    id: 'jabsik',
    period: '2026.03 – 현재',
    title: '잡식 스터디\n인사이트 공유 그룹',
    tag: '스터디',
    accent: '#FFB366',
    image: imgOmnivorous,
    learn:
      '매주 개발 근황과 기술 트렌드를 공유하며, 전문 분야 외에도 넓은 기술적 시야를 유지하기 위해 참여했습니다.',
    points: [
      '주간 기술 트렌드 공유 및 코드 리뷰',
      '타 분야 기술 활용 사례 접목',
      '꾸준한 개발 습관 루틴화',
    ],
    connection:
      '지속적으로 성장하는 학습 습관을 루틴화하고, 유연한 사고방식을 길렀습니다.',
  },
  {
    id: 'vibe-coding',
    period: '2026.04',
    title: 'AI 바이브코딩\n대회 (4인 팀)',
    tag: '공모전',
    accent: '#A5D8FF',
    image: imgVibeCoding,
    learn:
      '4인 팀으로 AI 알고리즘 시각화 디버거(Frogger)를 1주일 안에 설계·구현하며, 팀 전체가 같은 Claude를 쓸 때의 컨텍스트 공유 방식을 구조로 합의하는 경험을 했습니다.',
    points: [
      '파이프라인 단위(실행 · AI · 렌더)로 역할 자율 분담',
      '계층형 CLAUDE.md로 레이어별 계약을 팀 공통 언어로 고정',
      '제출 후 관찰된 한계를 다음 설계 기준으로 승격시키는 회고',
    ],
    connection:
      '팀 단위 AI 협업에서 먼저 부서지는 건 기술이 아니라 "공통 문서의 신선도"라는 감각을 체득했습니다.',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_W_DESKTOP = 220;
const CARD_W_MOBILE_MAX = 260;
const CARD_W_MOBILE_INSET_PX = 64; // viewport inset so next card peeks
const CARD_GAP_DESKTOP = 16;
const CARD_GAP_MOBILE = 12;
const MOBILE_BREAKPOINT_PX = 640;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const NOW = new Date();
const TODAY_DATE = String(NOW.getDate());
const TODAY_MONTH = MONTHS[NOW.getMonth()];
const TODAY_DAY = DAYS[NOW.getDay()];
const FLIP_DURATION_S = 0.5;
const FLIP_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const HOVER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BADGE_SIZE = 26;
const BADGE_OFFSET = 14;
const BADGE_ICON_SIZE = 14;
const HOVER_ROTATE_Y_DEG = -10;
const HOVER_LIFT_PX = -4;

// ─── Flip Badge ─────────────────────────────────────────────────────────────

function FlipBadge({
  isHovered,
  isBack,
}: {
  isHovered: boolean;
  isBack?: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: BADGE_OFFSET,
        right: BADGE_OFFSET,
        width: BADGE_SIZE,
        height: BADGE_SIZE,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isHovered ? '#1A1229' : 'rgba(255, 255, 255, 0.9)',
        border: isHovered
          ? '1px solid #1A1229'
          : '1px solid rgba(255, 255, 255, 0.9)',
        transition: 'all 0.3s',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      <svg
        width={BADGE_ICON_SIZE}
        height={BADGE_ICON_SIZE}
        viewBox='0 0 24 24'
        fill='none'
        stroke={isHovered ? 'white' : 'rgba(0,0,0,0.35)'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        style={{
          transition: 'stroke 0.3s',
          transform: isBack ? 'rotate(180deg)' : 'none',
        }}
      >
        <path d='M1 4v6h6' />
        <path d='M3.51 15a9 9 0 1 0 2.13-9.36L1 10' />
      </svg>
    </div>
  );
}

// ─── Activity Card ───────────────────────────────────────────────────────────

const ENTRANCE_DELAY_S = 0.1;
const ENTRANCE_DURATION_S = 0.5;

interface ActivityCardProps {
  activity: Activity;
  index: number;
  isVisible: boolean;
  cardW: number;
  disableHover: boolean;
}

const ActivityCard = React.memo(function ActivityCard({
  activity,
  index,
  isVisible,
  cardW,
  disableHover,
}: ActivityCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const entranceDelay = index * ENTRANCE_DELAY_S;

  return (
    <motion.div
      data-activity-card
      data-cursor-label='FLIP'
      role='button'
      aria-pressed={isFlipped}
      aria-label={`${activity.title.replace(/\n/g, ' ')}, 클릭하면 학습 내용이 보입니다`}
      tabIndex={0}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: ENTRANCE_DURATION_S,
        delay: entranceDelay,
        ease: [0, 0, 0.2, 1],
      }}
      style={{
        width: cardW,
        minWidth: cardW,
        height: 440,
        perspective: '1500px',
        willChange: 'transform',
        cursor: 'pointer',
        scrollSnapAlign: 'start',
      }}
      whileHover={
        isFlipped || disableHover
          ? {}
          : { rotateY: HOVER_ROTATE_Y_DEG, y: HOVER_LIFT_PX }
      }
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: FLIP_DURATION_S, ease: FLIP_EASE }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ════ FRONT ════ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: isHovered
              ? '0 12px 32px rgba(0, 0, 0, 0.15)'
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
            transition: 'box-shadow 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FlipBadge isHovered={isHovered} />

          {/* Top: number + accent line */}
          <div style={{ padding: '24px 22px 0' }}>
            <span
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: isHovered ? activity.accent : 'rgba(0,0,0,0.08)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                display: 'block',
                transition: 'color 0.25s ease',
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div
              style={{
                width: '24px',
                height: '3px',
                borderRadius: '2px',
                background: activity.accent,
                marginTop: '10px',
              }}
            />
          </div>

          {/* Title + tag */}
          <div style={{ padding: '14px 22px 0' }}>
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                lineHeight: 1.35,
                margin: '0 0 4px 0',
                whiteSpace: 'pre-line',
              }}
            >
              {activity.title}
            </h3>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 500,
                color: 'rgba(0,0,0,0.35)',
                letterSpacing: '-0.01em',
              }}
            >
              {activity.tag} · {activity.period}
            </span>
          </div>

          {/* Image */}
          <div
            style={{
              marginTop: 'auto',
              padding: '12px 14px 14px',
            }}
          >
            <div
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                aspectRatio: '1',
                position: 'relative',
              }}
            >
              <img
                src={activity.image}
                alt={activity.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Bottom icon row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 22px 16px',
              flexShrink: 0,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', gap: '14px' }}>
              {/* Bookmark icon */}
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='rgba(0,0,0,0.22)'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
              </svg>
              {/* Heart icon */}
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='rgba(0,0,0,0.22)'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
              </svg>
            </div>
          </div>
        </div>

        {/* ════ BACK ════ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FlipBadge isHovered={isHovered} isBack />

          <div
            style={{
              flex: 1,
              padding: '22px 20px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            {/* Number + accent */}
            <div style={{ marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'rgba(0,0,0,0.08)',
                  letterSpacing: '-0.04em',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div
                style={{
                  width: '20px',
                  height: '2px',
                  borderRadius: '1px',
                  background: activity.accent,
                  marginTop: '6px',
                }}
              />
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#1a1a1a',
                lineHeight: 1.3,
                margin: '0 0 12px 0',
              }}
            >
              {activity.title.replace(/\n/g, ' ')}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: '0.68rem',
                color: 'rgba(0,0,0,0.5)',
                lineHeight: 1.65,
                margin: '0 0 14px 0',
              }}
            >
              {activity.learn}
            </p>

            {/* Points */}
            <ul
              style={{
                margin: '0 0 14px 0',
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              {activity.points.map((pt, j) => (
                <li
                  key={j}
                  style={{
                    display: 'flex',
                    gap: '7px',
                    fontSize: '0.64rem',
                    color: 'rgba(0,0,0,0.45)',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ flexShrink: 0, color: 'rgba(0,0,0,0.2)' }}>
                    —
                  </span>
                  {pt}
                </li>
              ))}
            </ul>

            {/* Divider + Insight */}
            <div
              style={{
                height: '1px',
                background: 'rgba(0,0,0,0.06)',
                margin: '0 0 10px 0',
              }}
            />
            <p
              style={{
                fontSize: '0.55rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(0,0,0,0.25)',
                marginBottom: '4px',
              }}
            >
              핵심 인사이트
            </p>
            <p
              style={{
                fontSize: '0.64rem',
                color: 'rgba(0,0,0,0.42)',
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {activity.connection}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────

const PILL_WIDTH = 80;
const PILL_HEIGHT = 24;
const DOT_SIZE = 10;
const DOT_TRAVEL = PILL_WIDTH - DOT_SIZE - 8; // 8px total padding inside pill

export function ActivitiesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isPointerCoarse = useIsPointerCoarse();
  const [cardW, setCardW] = useState(CARD_W_DESKTOP);
  const [cardGap, setCardGap] = useState(CARD_GAP_DESKTOP);

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT_PX) {
        setCardW(
          Math.min(
            CARD_W_MOBILE_MAX,
            window.innerWidth - CARD_W_MOBILE_INSET_PX,
          ),
        );
        setCardGap(CARD_GAP_MOBILE);
      } else {
        setCardW(CARD_W_DESKTOP);
        setCardGap(CARD_GAP_DESKTOP);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(el.scrollLeft / maxScroll);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        padding:
          'clamp(20px, 4vw, 32px) 0 clamp(20px, 4vw, 32px) clamp(16px, 4vw, 32px)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Background gradient (same as About) ── */}
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

      {/* ── Background assets ── */}
      <img
        src={assetClouds}
        alt=''
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '140%',
          opacity: 0.3,
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
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Header ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingRight: 'clamp(16px, 4vw, 32px)',
          marginBottom: '1.4rem',
          flexShrink: 0,
        }}
      >
        {/* Left: label + title */}
        <div>
          <p
            style={{
              fontSize: '0.69rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'rgba(0,0,0,0.32)',
              marginBottom: '6px',
            }}
          >
            Activities
          </p>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#1a1a1a',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Learning Stack
          </h2>
        </div>

        {/* Right: today's date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
            paddingTop: '4px',
          }}
        >
          <span
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#1a1a1a',
              lineHeight: 1,
            }}
          >
            {TODAY_DATE}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                color: 'rgba(0,0,0,0.4)',
                lineHeight: 1.2,
              }}
            >
              {TODAY_MONTH}
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 500,
                color: 'rgba(0,0,0,0.28)',
                lineHeight: 1.2,
              }}
            >
              {TODAY_DAY}
            </span>
          </div>
        </div>
      </div>

      {/* ── Horizontal scroll ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: `${cardGap}px`,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            paddingTop: '12px',
            paddingBottom: '12px',
            paddingRight: 'clamp(16px, 4vw, 32px)',
            width: '100%',
            cursor: isPointerCoarse ? 'default' : 'grab',
            scrollSnapType: isPointerCoarse ? 'x mandatory' : undefined,
            WebkitOverflowScrolling: 'touch',
          }}
          onMouseDown={(e) => {
            if (isPointerCoarse) {
              return;
            }
            const el = scrollRef.current;
            if (!el) {
              return;
            }
            const startX = e.pageX;
            const startScrollLeft = el.scrollLeft;
            let dragged = false;

            const onMouseMove = (ev: MouseEvent) => {
              const dx = ev.pageX - startX;
              if (Math.abs(dx) > 4) {
                dragged = true;
              }
              el.scrollLeft = startScrollLeft - dx;
            };

            const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
              el.style.cursor = 'grab';

              if (dragged) {
                const suppressClick = (ev: MouseEvent) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                };
                el.addEventListener('click', suppressClick, {
                  capture: true,
                  once: true,
                });
              }
            };

            el.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        >
          {ACTIVITIES.map((activity, i) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={i}
              isVisible={isVisible}
              cardW={cardW}
              disableHover={isPointerCoarse}
            />
          ))}
        </div>
      </div>

      {/* ── Scroll indicator pill ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: PILL_WIDTH,
            height: PILL_HEIGHT,
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 4px',
          }}
        >
          <div
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: '50%',
              background: 'rgba(160, 120, 255, 0.8)',
              transform: `translateX(${scrollProgress * DOT_TRAVEL}px)`,
              transition: 'transform 0.2s ease',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
