'use client';

import { useState, useCallback, useEffect } from 'react';

export interface ModuleProgress {
  challengeComplete: boolean;
  scenarioCorrect: boolean;
}

type ProgressMap = Record<string, ModuleProgress>;

const STORAGE_KEY = 'bc-challenge-progress';

function loadProgress(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(map: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

export function useChallengeProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const markChallengeComplete = useCallback((slug: string) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        [slug]: { ...prev[slug], challengeComplete: true, scenarioCorrect: prev[slug]?.scenarioCorrect ?? false },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const markScenarioCorrect = useCallback((slug: string) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        [slug]: { ...prev[slug], scenarioCorrect: true, challengeComplete: prev[slug]?.challengeComplete ?? false },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const getModuleScore = useCallback(
    (slug: string): number => {
      const p = progress[slug];
      if (!p) return 0;
      return (p.challengeComplete ? 1 : 0) + (p.scenarioCorrect ? 1 : 0);
    },
    [progress]
  );

  const getTotalScore = useCallback((): { earned: number; total: number } => {
    const slugs = Object.keys(progress);
    const earned = slugs.reduce((sum, s) => sum + getModuleScore(s), 0);
    return { earned, total: earned };
  }, [progress, getModuleScore]);

  const resetProgress = useCallback(() => {
    saveProgress({});
    setProgress({});
  }, []);

  return { progress, markChallengeComplete, markScenarioCorrect, getModuleScore, getTotalScore, resetProgress };
}
