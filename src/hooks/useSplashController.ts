import { useState, useEffect, useRef, useCallback } from "react";

const SPLASH_STORAGE_KEY = "portfolio-splash-shown";
const DEFAULT_EXIT_TRIGGER_PERCENT = 0.8;
const DEFAULT_FREEZE_PROGRESS_PERCENT = 50;

export type DevSplashMode = "freeze" | "replay" | null;

export function getDevSplashMode(): DevSplashMode {
  if (!import.meta.env.DEV) {
    return null;
  }
  const mode = new URLSearchParams(window.location.search).get("splash");
  if (mode === "freeze" || mode === "replay") {
    return mode;
  }
  return null;
}

function defaultEasing(t: number): number {
  if (t < 0.5) {
    return 2 * t * t;
  }
  return 1 - (-2 * t + 2) ** 2 / 2;
}

interface SplashOptions {
  durationMs: number;
  exitTriggerPercent?: number;
  freezePercent?: number;
  onTick?: (progress: number, percent: number) => void;
  easing?: (t: number) => number;
}

export function useSplashController(options: SplashOptions) {
  const {
    durationMs,
    exitTriggerPercent = DEFAULT_EXIT_TRIGGER_PERCENT,
    freezePercent = DEFAULT_FREEZE_PROGRESS_PERCENT,
    onTick,
    easing = defaultEasing,
  } = options;

  const devSplashModeRef = useRef<DevSplashMode>(getDevSplashMode());

  const [showLoading] = useState(() => {
    const mode = devSplashModeRef.current;
    if (mode === "replay") {
      sessionStorage.removeItem(SPLASH_STORAGE_KEY);
      return true;
    }
    if (mode === "freeze") {
      return true;
    }
    return !sessionStorage.getItem(SPLASH_STORAGE_KEY);
  });

  const [isExiting, setIsExiting] = useState(false);
  const [isBgFading, setIsBgFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const hasTriggeredExit = useRef(false);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const tick = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current;
    const rawProgress = Math.min(elapsed / durationMs, 1);
    const eased = easing(rawProgress);
    const percent = Math.round(eased * 100);

    onTickRef.current?.(eased, percent);

    if (eased >= exitTriggerPercent && !hasTriggeredExit.current) {
      hasTriggeredExit.current = true;
      setIsExiting(true);
    }

    if (rawProgress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [durationMs, exitTriggerPercent, easing]);

  useEffect(() => {
    if (!showLoading) {
      return;
    }

    if (devSplashModeRef.current === "freeze") {
      const frozenProgress = freezePercent / 100;
      onTickRef.current?.(frozenProgress, freezePercent);
      return;
    }

    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [showLoading, tick, freezePercent]);

  const onExitComplete = useCallback(() => {
    setIsBgFading(true);
  }, []);

  const onBgFadeComplete = useCallback(() => {
    if (isBgFading) {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
      setIsDone(true);
    }
  }, [isBgFading]);

  return {
    showLoading,
    isExiting,
    isBgFading,
    isDone,
    devMode: devSplashModeRef.current,
    onExitComplete,
    onBgFadeComplete,
  };
}
