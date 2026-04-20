/**
 * AboutParallax — Sticky-stage parallax with layered velocity + mouse tracking.
 *
 * LAYERS (scroll velocity):
 *   • Background  ≈ 0.1×  (gradient, barely moves)
 *   • Mid-assets  ≈ 0.8×  (collage images, moderate depth)
 *   • Text        ≈ 0.6×  (medium — heavy, authoritative)
 *   • Foreground  ≈ 1.4×  (clouds, atmospheric)
 *
 * MOUSE TRACKING:
 *   Each layer reacts to cursor position with different intensity,
 *   creating subtle depth parallax on hover.
 */

import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { useIsPointerCoarse } from '@/hooks/use-mobile';
import { SCENES, TECH_CHIPS } from '@/data/about-scenes';

// ── About assets (collage / atmospheric) ──────────────────────────────────────
import assetClouds from '@assets/about/clouds.png';
import assetGradient from '@assets/about/gradient-pastel.jpg';
import assetMoon from '@assets/about/moon.png';
import assetChrysanthemum from '@assets/about/pink-chrysanthemum.png';
import assetRocket from '@assets/about/rocket-flowers.png';
import assetSaxophone from '@assets/about/saxophone-flowers.png';
import assetSurfer from '@assets/about/surfer-collage.png';

type SpringValue = ReturnType<typeof useSpring>;

// ─── Staggered-character headline ─────────────────────────────────────────────

function Headline({
  lines,
  sceneKey,
}: {
  lines: readonly { text: string; gradient?: string }[];
  sceneKey: number;
}) {
  return (
    <div style={{ userSelect: 'none' }}>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{ overflow: 'hidden', lineHeight: 1.08, display: 'block' }}
        >
          {line.text.split('').map((char, ci) => (
            <motion.span
              key={`${sceneKey}-${li}-${ci}`}
              style={{
                display: 'inline-block',
                ...(line.gradient
                  ? {
                      background: line.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }
                  : {}),
              }}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: li * 0.14 + ci * 0.022,
                duration: 0.58,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Mouse tracking hook ──────────────────────────────────────────────────────

function useMouseParallax(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean = true,
) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (!enabled) {
      mouseX.set(0);
      mouseY.set(0);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) return; // guard against collapsed container
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set(clamp((e.clientX - cx) / (rect.width / 2)));
      mouseY.set(clamp((e.clientY - cy) / (rect.height / 2)));
    };

    const handleLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [containerRef, mouseX, mouseY, enabled]);

  const springCfg = { stiffness: 60, damping: 30, mass: 1 };
  const mx = useSpring(mouseX, springCfg);
  const my = useSpring(mouseY, springCfg);

  return { mx, my };
}

// ─── Parallax layer wrapper (applies mouse offset + optional scroll Y) ────────

function ParallaxLayer({
  children,
  mx,
  my,
  intensity,
  scrollY,
  style,
}: {
  children?: React.ReactNode;
  mx: SpringValue;
  my: SpringValue;
  intensity: number;
  scrollY?: SpringValue;
  style?: Omit<React.CSSProperties, 'x' | 'y'>;
}) {
  const mouseX = useTransform(mx, (v) => v * intensity);
  const mouseY = useTransform(my, (v) => v * intensity);
  // Combine scroll Y + mouse Y when both exist
  const combinedY = useTransform(
    scrollY ? [mouseY, scrollY] : [mouseY],
    scrollY ? ([mY, sY]: number[]) => mY + sY : ([mY]: number[]) => mY,
  );

  return (
    <motion.div
      style={{
        ...(style as any),
        x: mouseX,
        y: combinedY,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Entrance animation helper ────────────────────────────────────────────────

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function EntranceImg({
  src,
  alt = '',
  fromX = 0,
  fromY = 0,
  delay = 0,
  duration = 1.4,
  sceneKey: key,
  style,
}: {
  src: string;
  alt?: string;
  fromX?: number;
  fromY?: number;
  delay?: number;
  duration?: number;
  sceneKey: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.img
      key={key}
      src={src}
      alt={alt}
      initial={{ x: fromX, y: fromY, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration, delay, ease: EASE_OUT }}
      style={style}
    />
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function Label({
  step,
  label,
  color,
}: {
  step: string;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px',
      }}
    >
      <span
        style={{
          fontSize: '0.56rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          color,
          padding: '3px 10px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.35)',
        }}
      >
        {step}
      </span>
      <div
        style={{
          width: '28px',
          height: '1px',
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
      <span
        style={{
          fontSize: '0.58rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          color,
          opacity: 0.8,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function Desc({
  text,
  color,
}: {
  text: React.ReactNode;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'stretch' }}>
      <div
        style={{
          width: '3px',
          borderRadius: '2px',
          flexShrink: 0,
          background: `linear-gradient(180deg, ${color}88, ${color}22)`,
        }}
      />
      <p
        style={{
          fontSize: '0.84rem',
          lineHeight: 1.9,
          color: 'rgba(20,18,40,0.58)',
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        {text}
      </p>
    </div>
  );
}

// ─── Scroll hint (bottom center) ──────────────────────────────────────────────

function ScrollHint({ activeScene }: { activeScene: 1 | 2 | 3 }) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        x: '-50%',
        zIndex: 20,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* Mouse icon */}
      <svg width='22' height='36' viewBox='0 0 22 36' fill='none'>
        <rect
          x='0.75'
          y='0.75'
          width='20.5'
          height='34.5'
          rx='10.25'
          stroke='rgba(140,120,220,0.35)'
          strokeWidth='1.5'
        />
        <rect
          x='9.5'
          y='8'
          width='3'
          height='6'
          rx='1.5'
          fill='rgba(140,120,220,0.45)'
          className='animate-scroll-wheel'
        />
      </svg>
      {/* Label */}
      <span
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: 'rgba(140,120,220,0.4)',
        }}
      >
        SCROLL
      </span>
    </motion.div>
  );
}

// ─── Vertical dot indicator (bottom right) ────────────────────────────────────

export function DotIndicator({
  activeScene,
  accent,
  isMobile = false,
}: {
  activeScene: 1 | 2 | 3;
  accent: string;
  isMobile?: boolean;
}) {
  return (
    <div
      style={{
        position: isMobile ? 'fixed' : 'absolute',
        bottom: isMobile
          ? 'calc(24px + env(safe-area-inset-bottom, 0px))'
          : '24px',
        right: isMobile
          ? 'calc(20px + env(safe-area-inset-right, 0px))'
          : '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 8px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.55)',
        boxShadow:
          'inset 1px 1px 0 rgba(255,255,255,0.7), ' +
          '0 4px 16px rgba(120,100,220,0.08), ' +
          '0 1px 3px rgba(0,0,0,0.04)',
        zIndex: 20,
      }}
    >
      {SCENES.map((s) => {
        const isActive = activeScene === s.id;
        return (
          <div
            key={s.id}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
            }}
          >
            <motion.div
              animate={{
                width: isActive ? 8 : 5,
                height: isActive ? 8 : 5,
                background: isActive ? accent : 'rgba(60,50,110,0.18)',
                boxShadow: isActive ? `0 0 8px ${accent}44` : 'none',
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ borderRadius: '50%' }}
            />
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `1px solid ${accent}33`,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Headline layer (sandwiched between asset layers) ─────────────────────────

function HeadlineLayer({
  lines,
  activeScene,
  sceneKey,
  mx,
  my,
  scrollY,
  style,
}: {
  lines: readonly { text: string; gradient?: string }[];
  activeScene: 1 | 2 | 3;
  sceneKey: 1 | 2 | 3;
  mx: SpringValue;
  my: SpringValue;
  scrollY: SpringValue;
  style?: Omit<React.CSSProperties, 'x' | 'y'>;
}) {
  return (
    <ParallaxLayer
      mx={mx}
      my={my}
      intensity={5}
      scrollY={scrollY}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: 'clamp(3rem,7vw,5.5rem)',
        fontWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: 1.08,
        color: '#0f0a2a',
        ...style,
      }}
    >
      {activeScene === sceneKey && (
        <Headline lines={lines} sceneKey={sceneKey} />
      )}
    </ParallaxLayer>
  );
}

// ─── Info block (label + desc + extra, always frontmost) ──────────────────────

function InfoBlock({
  scene,
  mx,
  my,
  scrollY,
  extra,
  style,
}: {
  scene: (typeof SCENES)[number];
  mx: SpringValue;
  my: SpringValue;
  scrollY: SpringValue;
  extra?: React.ReactNode;
  style?: Omit<React.CSSProperties, 'x' | 'y'>;
}) {
  return (
    <ParallaxLayer
      mx={mx}
      my={my}
      intensity={3}
      scrollY={scrollY}
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 20,
        ...style,
      }}
    >
      <Label step={scene.step} label={scene.label} color={scene.stepColor} />
      <Desc text={scene.desc} color={scene.accent} />
      {extra}
    </ParallaxLayer>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export function AboutParallax() {
  const stageRef = useRef<HTMLDivElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const [stageH, setStageH] = useState(600);
  const [activeScene, setActiveScene] = useState<1 | 2 | 3>(1);
  const isTransitioning = useRef(false);
  const isPointerCoarse = useIsPointerCoarse();

  // ── Mouse tracking (desktop only) ───────────────────────────────────────────
  const { mx, my } = useMouseParallax(stageRef, !isPointerCoarse);

  // ── Measure scrollable ancestor height (motion.div wrapper has no explicit height) ─
  useLayoutEffect(() => {
    let el: HTMLElement | null = stageRef.current?.parentElement ?? null;
    while (el) {
      const ov = getComputedStyle(el).overflowY;
      if (ov === 'auto' || ov === 'scroll') {
        setStageH(el.clientHeight);
        break;
      }
      el = el.parentElement;
    }
  }, []);

  useEffect(() => {
    let ancestor: HTMLElement | null = stageRef.current?.parentElement ?? null;
    while (ancestor) {
      const ov = getComputedStyle(ancestor).overflowY;
      if (ov === 'auto' || ov === 'scroll') break;
      ancestor = ancestor.parentElement;
    }
    if (!ancestor) return;
    const ro = new ResizeObserver(() => setStageH(ancestor!.clientHeight));
    ro.observe(ancestor);
    return () => ro.disconnect();
  }, []);

  // ── Mobile: detect active scene via IntersectionObserver ─────────────────────
  useEffect(() => {
    if (!isPointerCoarse) {
      return;
    }
    const stageEl = stageRef.current;
    if (!stageEl) {
      return;
    }
    const sceneEls = [
      scene1Ref.current,
      scene2Ref.current,
      scene3Ref.current,
    ].filter((el): el is HTMLDivElement => el !== null);
    if (sceneEls.length === 0) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (!best) {
          return;
        }
        const sceneId = Number((best.target as HTMLElement).dataset.scene) as
          | 1
          | 2
          | 3;
        setActiveScene(sceneId);
      },
      { root: stageEl, threshold: [0.25, 0.5, 0.75] },
    );
    for (const el of sceneEls) {
      io.observe(el);
    }
    return () => io.disconnect();
  }, [isPointerCoarse]);

  // ── Snap-scroll: wheel event drives scene changes ───────────────────────────
  const targetProgress = useMotionValue(0); // 0 = scene1, 0.5 = scene2, 1 = scene3

  const goTo = useCallback(
    (scene: 1 | 2 | 3) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      setActiveScene(scene);
      const map = { 1: 0, 2: 0.5, 3: 1 } as const;
      targetProgress.set(map[scene]);
      setTimeout(() => {
        isTransitioning.current = false;
      }, 700);
    },
    [targetProgress],
  );

  // Accumulate small trackpad deltas before triggering a snap
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isPointerCoarse) {
      return;
    }
    const el = stageRef.current;
    if (!el) return;

    const THRESHOLD = 50; // accumulated px before snap triggers

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning.current) return;

      wheelAccum.current += e.deltaY;

      // Reset accumulator after inactivity
      clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        wheelAccum.current = 0;
      }, 200);

      if (Math.abs(wheelAccum.current) < THRESHOLD) return;

      const dir = wheelAccum.current > 0 ? 1 : -1;
      wheelAccum.current = 0;

      const next = (activeScene + dir) as 1 | 2 | 3;
      if (next < 1 || next > 3) return;
      goTo(next);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimer.current);
    };
  }, [activeScene, goTo, isPointerCoarse]);

  // ── Spring physics (animates between snap targets) ──────────────────────────
  const progress = useSpring(targetProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.6,
  });

  // ── Scene cross-dissolve (tuned for snap targets 0 / 0.5 / 1) ──────────────
  const s1Opacity = useTransform(progress, [0, 0.15, 0.35, 0.5], [1, 1, 0, 0]);
  const s2Opacity = useTransform(
    progress,
    [0.15, 0.35, 0.65, 0.85],
    [0, 1, 1, 0],
  );
  const s3Opacity = useTransform(progress, [0.5, 0.65, 0.85, 1], [0, 0, 1, 1]);

  // ── Background layer ────────────────────────────────────────────────────────
  const bgRaw = useTransform(progress, [0, 1], [0, -24]);
  const bgY = useSpring(bgRaw, { stiffness: 50, damping: 22 });

  // ── Asset layer (enters from below, exits up) ────────────────────────────────
  const s1AstRaw = useTransform(progress, [0, 0.5], [0, -200]);
  const s2AstRaw = useTransform(progress, [0, 0.5, 1], [200, 0, -200]);
  const s3AstRaw = useTransform(progress, [0.5, 1], [200, 0]);

  const s1AY = useSpring(s1AstRaw, { stiffness: 65, damping: 18 });
  const s2AY = useSpring(s2AstRaw, { stiffness: 65, damping: 18 });
  const s3AY = useSpring(s3AstRaw, { stiffness: 65, damping: 18 });

  // ── Text layer (slower, heavier) ────────────────────────────────────────────
  const s1TxtRaw = useTransform(progress, [0, 0.5], [0, -80]);
  const s2TxtRaw = useTransform(progress, [0, 0.5, 1], [80, 0, -80]);
  const s3TxtRaw = useTransform(progress, [0.5, 1], [80, 0]);

  const s1TY = useSpring(s1TxtRaw, { stiffness: 80, damping: 28 });
  const s2TY = useSpring(s2TxtRaw, { stiffness: 80, damping: 28 });
  const s3TY = useSpring(s3TxtRaw, { stiffness: 80, damping: 28 });

  const cur = SCENES.find((s) => s.id === activeScene)!;

  const mobileSceneStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100dvh',
    scrollSnapAlign: 'start',
    overflow: 'hidden',
    opacity: 1,
  };

  const techChips = (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
        marginTop: '14px',
      }}
    >
      {TECH_CHIPS.map((c) => (
        <span
          key={c.label}
          style={{
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.66rem',
            fontWeight: 600,
            background: c.bg,
            border: '1px solid rgba(255,255,255,0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(100,80,200,0.06)',
            color: '#2d2560',
          }}
        >
          {c.label}
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={stageRef}
      style={
        isPointerCoarse
          ? {
              height: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollSnapType: 'y proximity',
              WebkitOverflowScrolling: 'touch',
              isolation: 'isolate',
              position: 'relative',
            }
          : {
              height: stageH,
              overflow: 'hidden',
              isolation: 'isolate',
            }
      }
    >
      {/* ── Background gradient image ──────────────────────────────── */}
      <ParallaxLayer
        mx={mx}
        my={my}
        intensity={2}
        scrollY={bgY}
        style={{
          position: 'absolute',
          inset: '-20px',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <img
          src={assetGradient}
          alt=''
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.35,
            filter: 'blur(20px)',
          }}
        />
      </ParallaxLayer>

      {/* ══════════════════════════════════════════════════════════════
            SCENE 1 — ARCHITECT
            Layer order (back→front):
              BG gradient → Clouds(z:1) → Moon(z:2) → Headline(z:4)
              → Rocket(z:6) → Info+Chips(z:20)
        ══════════════════════════════════════════════════════════════ */}
      <motion.div
        ref={scene1Ref}
        data-scene='1'
        style={
          isPointerCoarse
            ? mobileSceneStyle
            : { position: 'absolute', inset: 0, opacity: s1Opacity }
        }
      >
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={2}
          scrollY={bgY}
          style={{
            position: 'absolute',
            inset: '-30px',
            background: SCENES[0].bg,
            pointerEvents: 'none',
          }}
        />

        {/* Clouds — deep background */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={12}
          style={{
            position: 'absolute',
            right: '-5%',
            bottom: '-8%',
            width: 'clamp(300px, 55%, 600px)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.7,
          }}
        >
          <EntranceImg
            src={assetClouds}
            fromX={-60}
            fromY={40}
            delay={0.2}
            sceneKey={activeScene}
            style={{ width: '100%' }}
          />
        </ParallaxLayer>

        {/* Moon — background accent */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={3}
          scrollY={s1AY}
          style={{
            position: 'absolute',
            right: '8%',
            top: '4%',
            width: '90px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.5,
          }}
        >
          <EntranceImg
            src={assetMoon}
            fromX={80}
            delay={0.12}
            sceneKey={activeScene}
            style={{ width: '100%', filter: 'blur(1px)' }}
          />
        </ParallaxLayer>

        {/* Headline — between moon and rocket */}
        <HeadlineLayer
          lines={SCENES[0].lines}
          activeScene={activeScene}
          sceneKey={1}
          mx={mx}
          my={my}
          scrollY={s1TY}
          style={{
            left: isPointerCoarse ? '16px' : '36px',
            bottom: '28%',
            right: isPointerCoarse ? '16px' : '42%',
            zIndex: 4,
          }}
        />

        {/* Rocket — in front of headline, punches through text */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={8}
          scrollY={s1AY}
          style={{
            position: 'absolute',
            right: '4%',
            top: '6%',
            width: 'clamp(240px, 42%, 440px)',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        >
          <EntranceImg
            src={assetRocket}
            fromY={120}
            delay={0}
            sceneKey={activeScene}
            style={{ width: '100%', opacity: 0.92 }}
          />
        </ParallaxLayer>

        {/* Info — always frontmost */}
        <InfoBlock
          scene={SCENES[0]}
          mx={mx}
          my={my}
          scrollY={s1TY}
          extra={techChips}
          style={{
            left: isPointerCoarse ? '16px' : '36px',
            bottom: isPointerCoarse ? '24px' : '36px',
            right: isPointerCoarse ? '16px' : '52%',
            zIndex: 20,
          }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
            SCENE 2 — PERSPECTIVE
            Layer order (back→front):
              BG → Moon(z:1) → Headline(z:4) → Surfer(z:6)
              → Clouds(z:8) → Chrysanthemum(z:9) → Info(z:20)
        ══════════════════════════════════════════════════════════════ */}
      <motion.div
        ref={scene2Ref}
        data-scene='2'
        style={
          isPointerCoarse
            ? mobileSceneStyle
            : { position: 'absolute', inset: 0, opacity: s2Opacity }
        }
      >
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={2}
          scrollY={bgY}
          style={{
            position: 'absolute',
            inset: '-30px',
            background: SCENES[1].bg,
            pointerEvents: 'none',
          }}
        />

        {/* Moon — large background, center-top */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={3}
          scrollY={s2AY}
          style={{
            position: 'absolute',
            left: '50%',
            top: '2%',
            width: 'clamp(260px, 48%, 460px)',
            pointerEvents: 'none',
            zIndex: 1,
            marginLeft: '-10%',
          }}
        >
          <EntranceImg
            src={assetMoon}
            fromY={-80}
            delay={0}
            sceneKey={activeScene}
            style={{ width: '100%', opacity: 0.85 }}
          />
        </ParallaxLayer>

        {/* Headline — overlapping the moon */}
        <HeadlineLayer
          lines={SCENES[1].lines}
          activeScene={activeScene}
          sceneKey={2}
          mx={mx}
          my={my}
          scrollY={s2TY}
          style={{
            left: isPointerCoarse ? '16px' : '36px',
            top: '30%',
            right: isPointerCoarse ? '16px' : '30%',
            zIndex: 4,
          }}
        />

        {/* Surfer — in front of text, center-bottom */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={10}
          scrollY={s2AY}
          style={{
            position: 'absolute',
            right: '12%',
            bottom: '6%',
            width: 'clamp(220px, 40%, 400px)',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        >
          <EntranceImg
            src={assetSurfer}
            fromY={120}
            delay={0.8}
            duration={2.2}
            sceneKey={activeScene}
            style={{ width: '100%', opacity: 0.95 }}
          />
        </ParallaxLayer>

        {/* Clouds — in front of surfer, bottom */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={8}
          style={{
            position: 'absolute',
            right: '-8%',
            bottom: '-8%',
            width: 'clamp(530px, 95%, 1060px)',
            pointerEvents: 'none',
            zIndex: 8,
            opacity: 0.75,
          }}
        >
          <EntranceImg
            src={assetClouds}
            fromY={60}
            delay={0.2}
            sceneKey={activeScene}
            style={{ width: '100%', transform: 'scaleX(-1)' }}
          />
        </ParallaxLayer>

        {/* Chrysanthemum — accent */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={7}
          scrollY={s2AY}
          style={{
            position: 'absolute',
            right: '40%',
            top: '28%',
            width: '85px',
            pointerEvents: 'none',
            zIndex: 9,
            opacity: 0.5,
          }}
        >
          <EntranceImg
            src={assetChrysanthemum}
            fromX={40}
            fromY={-40}
            delay={0.35}
            sceneKey={activeScene}
            style={{ width: '100%' }}
          />
        </ParallaxLayer>

        {/* Info — right of moon */}
        <InfoBlock
          scene={SCENES[1]}
          mx={mx}
          my={my}
          scrollY={s2TY}
          style={{
            right: isPointerCoarse ? '16px' : '36px',
            bottom: isPointerCoarse ? '24px' : undefined,
            top: isPointerCoarse ? undefined : '12%',
            left: isPointerCoarse ? '16px' : undefined,
            maxWidth: isPointerCoarse ? undefined : '200px',
            justifyContent: 'flex-start',
            zIndex: 20,
          }}
        />
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
            SCENE 3 — IMPROVE
            Layer order (back→front):
              BG → Moon(z:1) → Chrysanthemum-back(z:2) → Headline(z:4)
              → Saxophone(z:6) → Chrysanthemum-front(z:7) → Clouds(z:8)
              → Info(z:20)
        ══════════════════════════════════════════════════════════════ */}
      <motion.div
        ref={scene3Ref}
        data-scene='3'
        style={
          isPointerCoarse
            ? mobileSceneStyle
            : { position: 'absolute', inset: 0, opacity: s3Opacity }
        }
      >
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={2}
          scrollY={bgY}
          style={{
            position: 'absolute',
            inset: '-30px',
            background: SCENES[2].bg,
            pointerEvents: 'none',
          }}
        />

        {/* Moon — background, top-right */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={4}
          scrollY={s3AY}
          style={{
            position: 'absolute',
            right: '8%',
            top: '6%',
            width: '90px',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0.7,
          }}
        >
          <EntranceImg
            src={assetMoon}
            fromX={60}
            delay={0.15}
            sceneKey={activeScene}
            style={{ width: '100%', filter: 'blur(1px)' }}
          />
        </ParallaxLayer>

        {/* Chrysanthemum — behind headline, subtle */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={5}
          scrollY={s3AY}
          style={{
            position: 'absolute',
            left: '18%',
            top: '20%',
            width: '120px',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0.35,
          }}
        >
          <EntranceImg
            src={assetChrysanthemum}
            fromY={40}
            delay={0.2}
            sceneKey={activeScene}
            style={{ width: '100%', filter: 'blur(2px)' }}
          />
        </ParallaxLayer>

        {/* Headline — right side, between flowers and saxophone */}
        <HeadlineLayer
          lines={SCENES[2].lines}
          activeScene={activeScene}
          sceneKey={3}
          mx={mx}
          my={my}
          scrollY={s3TY}
          style={{
            right: isPointerCoarse ? '16px' : '50px',
            top: '28%',
            left: isPointerCoarse ? '16px' : '42%',
            zIndex: 4,
            textAlign: 'right' as const,
          }}
        />

        {/* Saxophone — left-center, in front of headline */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={8}
          scrollY={s3AY}
          style={{
            position: 'absolute',
            left: '4%',
            top: '8%',
            width: 'clamp(220px, 38%, 400px)',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        >
          <EntranceImg
            src={assetSaxophone}
            fromY={-120}
            delay={0.8}
            duration={2.2}
            sceneKey={activeScene}
            style={{ width: '100%', opacity: 0.92 }}
          />
        </ParallaxLayer>

        {/* Chrysanthemum — front, overlapping headline */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={6}
          scrollY={s3AY}
          style={{
            position: 'absolute',
            right: '64%',
            top: '48%',
            width: '160px',
            pointerEvents: 'none',
            zIndex: 4,
            opacity: 0.88,
          }}
        >
          <EntranceImg
            src={assetChrysanthemum}
            fromY={60}
            delay={0.5}
            sceneKey={activeScene}
            style={{ width: '100%' }}
          />
        </ParallaxLayer>

        {/* Clouds — bottom foreground */}
        <ParallaxLayer
          mx={mx}
          my={my}
          intensity={14}
          style={{
            position: 'absolute',
            right: '-4%',
            bottom: '-10%',
            width: 'clamp(260px, 48%, 520px)',
            pointerEvents: 'none',
            zIndex: 8,
            opacity: 0.6,
          }}
        >
          <EntranceImg
            src={assetClouds}
            fromY={50}
            delay={0.3}
            sceneKey={activeScene}
            style={{ width: '100%' }}
          />
        </ParallaxLayer>

        {/* Info — bottom, always frontmost */}
        <InfoBlock
          scene={SCENES[2]}
          mx={mx}
          my={my}
          scrollY={s3TY}
          style={{
            left: isPointerCoarse ? '16px' : '36px',
            bottom: isPointerCoarse ? '24px' : '36px',
            right: isPointerCoarse ? '16px' : '52%',
            zIndex: 20,
          }}
        />
      </motion.div>

      {/* ── Scroll hint (bottom center, desktop only) ──── */}
      {!isPointerCoarse && <ScrollHint activeScene={activeScene} />}

      {/* ── Dot indicator (bottom right) ─────────────────────────────── */}
      <DotIndicator
        activeScene={activeScene}
        accent={cur.accent}
        isMobile={isPointerCoarse}
      />
    </div>
  );
}
