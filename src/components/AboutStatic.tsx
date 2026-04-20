import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { useIsPointerCoarse } from '@/hooks/use-mobile';
import { SCENES, TECH_CHIPS } from '@/data/about-scenes';
import { Label, Desc, DotIndicator } from '@/components/AboutParallax';

import assetClouds from '@assets/about/clouds.png';
import assetMoon from '@assets/about/moon.png';
import assetRocket from '@assets/about/rocket-flowers.png';
import assetSaxophone from '@assets/about/saxophone-flowers.png';
import assetSurfer from '@assets/about/surfer-collage.png';

type SceneId = 1 | 2 | 3;

const HEADLINE_FONT_SIZE = 'clamp(32px, 8vw, 64px)';
const ANIM_DURATION_SEC = 0.6;
const ANIM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function StaticHeadline({
  lines,
}: {
  lines: readonly { text: string; gradient?: string }[];
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div
      style={{
        fontSize: HEADLINE_FONT_SIZE,
        fontWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: 1.08,
        color: '#0f0a2a',
        userSelect: 'none',
      }}
    >
      {lines.map((line, i) => {
        const gradientStyle = line.gradient
          ? {
              background: line.gradient,
              WebkitBackgroundClip: 'text' as const,
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text' as const,
            }
          : undefined;

        if (!line.gradient) {
          return (
            <div key={i} style={{ overflow: 'hidden' }}>
              <span style={{ display: 'inline-block' }}>{line.text}</span>
            </div>
          );
        }
        return (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.span
              style={{ display: 'inline-block', ...gradientStyle }}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: prefersReducedMotion ? 0 : ANIM_DURATION_SEC,
                ease: ANIM_EASE,
              }}
            >
              {line.text}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}

function Scene1Assets() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 8px',
        overflow: 'hidden',
      }}
    >
      <img
        src={assetRocket}
        alt=''
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

function Scene2Assets() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gridTemplateRows: 'auto 1fr',
        padding: '24px 16px',
        overflow: 'hidden',
        gap: '12px',
      }}
    >
      <img
        src={assetMoon}
        alt=''
        style={{
          gridColumn: '2 / 3',
          gridRow: '1 / 2',
          maxWidth: '100%',
          height: 'auto',
          justifySelf: 'center',
        }}
      />
      <img
        src={assetSurfer}
        alt=''
        style={{
          gridColumn: '1 / 4',
          gridRow: '2 / 3',
          maxWidth: '85%',
          height: 'auto',
          justifySelf: 'center',
          alignSelf: 'end',
        }}
      />
    </div>
  );
}

function Scene3Assets() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        overflow: 'hidden',
      }}
    >
      <img
        src={assetSaxophone}
        alt=''
        style={{
          maxWidth: '85%',
          maxHeight: '100%',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

function SceneAssets({ sceneId }: { sceneId: SceneId }) {
  if (sceneId === 1) {
    return <Scene1Assets />;
  }
  if (sceneId === 2) {
    return <Scene2Assets />;
  }
  return <Scene3Assets />;
}

function TechChips() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginTop: '10px',
      }}
    >
      {TECH_CHIPS.map((c) => (
        <span
          key={c.label}
          style={{
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.72rem',
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
}

export function AboutStatic() {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([null, null, null]);
  const [activeScene, setActiveScene] = useState<SceneId>(1);

  const isPointerCoarse = useIsPointerCoarse();

  useEffect(() => {
    const root = stageRef.current;
    if (!root) {
      return;
    }
    const observed = sceneRefs.current.filter(
      (el): el is HTMLElement => el !== null,
    );
    if (observed.length === 0) {
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const id = Number(visible.target.getAttribute('data-scene')) as SceneId;
          setActiveScene(id);
        }
      },
      { root, threshold: [0.5] },
    );
    observed.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = SCENES.find((s) => s.id === activeScene) ?? SCENES[0];

  return (
    <div
      ref={stageRef}
      style={{
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollSnapType: 'y proximity',
        WebkitOverflowScrolling: 'touch',
        isolation: 'isolate',
        position: 'relative',
      }}
    >
      {SCENES.map((scene, i) => {
        const sceneBackground =
          scene.id === 2
            ? `url(${assetClouds}) bottom center / 120% auto no-repeat, ${scene.bg}`
            : scene.bg;
        return (
          <section
            key={scene.id}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            data-scene={scene.id}
            style={{
              minHeight: '100%',
              height: '100%',
              scrollSnapAlign: 'start',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateRows: 'minmax(0, 1fr) auto',
              position: 'relative',
              background: sceneBackground,
            }}
          >
            <SceneAssets sceneId={scene.id} />
            <div
              style={{
                padding: '24px 20px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <Label
                step={scene.step}
                label={scene.label}
                color={scene.stepColor}
              />
              <StaticHeadline lines={scene.lines} />
              <Desc text={scene.desc} color={scene.accent} />
              {scene.id === 1 && <TechChips />}
            </div>
          </section>
        );
      })}
      <DotIndicator
        activeScene={activeScene}
        accent={cur.accent}
        isMobile={isPointerCoarse}
      />
    </div>
  );
}
