import { SrsItemData, SrsRating, UserStats, LessonProgress } from '../types/kana';
import { HIRAGANA_DATA } from '../data/hiraganaData';

const STORAGE_KEY = 'lundkana_user_stats_v1';

export const INITIAL_USER_STATS: UserStats = {
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  kanaProgress: {},
  learningProgress: {},
  highScores: {
    kanaDrop: 0,
    speedQuiz: 0,
    wordScramble: 0
  },
  unlockedBadges: []
};

// Initialize all kana items in progress table if not present
export function initializeKanaProgress(existing: Record<string, SrsItemData>): Record<string, SrsItemData> {
  const result: Record<string, SrsItemData> = { ...existing };
  
  HIRAGANA_DATA.forEach(k => {
    if (!result[k.id]) {
      result[k.id] = {
        id: k.id,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: Date.now(), // due immediately for new items
        status: 'new',
        consecutiveCorrect: 0,
        totalReviews: 0,
        totalErrors: 0
      };
    }
  });

  return result;
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const init = { ...INITIAL_USER_STATS };
      init.kanaProgress = initializeKanaProgress({});
      init.learningProgress = {};
      saveUserStats(init);
      return init;
    }

    const parsed: UserStats = JSON.parse(raw);
    parsed.kanaProgress = initializeKanaProgress(parsed.kanaProgress || {});
    parsed.learningProgress = parsed.learningProgress || {};
    
    // Check and update daily streak
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      const last = new Date(parsed.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        parsed.streakDays += 1;
      } else if (diffDays > 1) {
        parsed.streakDays = 1;
      }
      parsed.lastActiveDate = today;
      saveUserStats(parsed);
    }

    return parsed;
  } catch (e) {
    console.error('Failed to load user stats from localStorage', e);
    const fallback = { ...INITIAL_USER_STATS };
    fallback.kanaProgress = initializeKanaProgress({});
    return fallback;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 * Ratings:
 * 'again' -> Fail (Quality 0-1): reset interval, review soon
 * 'hard'  -> Difficult (Quality 2-3): small interval increase
 * 'good'  -> Normal (Quality 4): standard interval increase
 * 'easy'  -> Very easy (Quality 5): larger interval increase & bonus EF
 */
export function calculateSrsReview(item: SrsItemData, rating: SrsRating): SrsItemData {
  const updated: SrsItemData = { ...item };
  const now = Date.now();
  updated.lastReviewedDate = now;
  updated.totalReviews += 1;

  let quality = 4;
  if (rating === 'again') quality = 1;
  else if (rating === 'hard') quality = 3;
  else if (rating === 'good') quality = 4;
  else if (rating === 'easy') quality = 5;

  if (quality < 3) {
    // Incorrect / Again
    updated.consecutiveCorrect = 0;
    updated.repetitions = 0;
    updated.interval = 0.1; // ~6 minutes in hours/day fraction (review in current session)
    updated.nextReviewDate = now + (6 * 60 * 1000); // 6 min
    updated.status = 'learning';
    updated.totalErrors += 1;
  } else {
    // Correct
    updated.consecutiveCorrect += 1;
    
    if (updated.repetitions === 0) {
      updated.interval = 1; // 1 day
    } else if (updated.repetitions === 1) {
      updated.interval = 3; // 3 days
    } else {
      updated.interval = Math.round(updated.interval * updated.easeFactor);
    }
    
    updated.repetitions += 1;
    
    // Adjust Ease Factor (SM-2 formula)
    let newEf = updated.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEf < 1.3) newEf = 1.3;
    if (newEf > 3.0) newEf = 3.0;
    updated.easeFactor = newEf;

    // Set next review in days
    updated.nextReviewDate = now + (updated.interval * 24 * 60 * 60 * 1000);

    if (updated.repetitions >= 4 && updated.consecutiveCorrect >= 3) {
      updated.status = 'mastered';
    } else {
      updated.status = 'review';
    }
  }

  return updated;
}

export function calculateXpAndLevel(currentXp: number, earnedXp: number): { newXp: number; newLevel: number; leveledUp: boolean } {
  const newXp = currentXp + earnedXp;
  // Level threshold formula: level = floor(sqrt(XP / 50)) + 1
  const oldLevel = Math.floor(Math.sqrt(currentXp / 50)) + 1;
  const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1;
  return {
    newXp,
    newLevel,
    leveledUp: newLevel > oldLevel
  };
}

export function getXpForNextLevel(level: number): { currentLevelXp: number; nextLevelXp: number } {
  const currentLevelXp = Math.pow(level - 1, 2) * 50;
  const nextLevelXp = Math.pow(level, 2) * 50;
  return { currentLevelXp, nextLevelXp };
}

export function getDueItems(kanaProgress: Record<string, SrsItemData>): string[] {
  const now = Date.now();
  return Object.values(kanaProgress)
    .filter(item => item.nextReviewDate <= now || item.status === 'new')
    .map(item => item.id);
}

/**
 * Calculates stars based on percentage score (0-100)
 */
export function calculateLessonStars(score: number): number {
  if (score >= 100) return 3;
  if (score >= 90) return 2;
  if (score >= 80) return 1;
  return 0;
}

/**
 * Record completion of a learning chapter or checkpoint
 */
export function recordLessonCompletion(
  currentStats: UserStats,
  chapterId: string,
  score: number,
  baseXp: number,
  mistakesKanaIds: string[] = []
): { updatedStats: UserStats; earnedXp: number; leveledUp: boolean; isPassed: boolean; stars: number } {
  const isPassed = score >= 80;
  const stars = calculateLessonStars(score);
  const existing = currentStats.learningProgress?.[chapterId];
  
  let earnedXp = 0;
  if (isPassed) {
    if (!existing || !existing.completed) {
      // First time completion
      earnedXp = baseXp + Math.round(score * 0.5);
    } else if (score > existing.bestScore) {
      // Improved score bonus
      earnedXp = Math.round((score - existing.bestScore) * 0.5) + 15;
    } else {
      // Repeat practice bonus
      earnedXp = 10;
    }
  } else {
    earnedXp = 5; // Small consolation XP for trying
  }

  const { newXp, newLevel, leveledUp } = calculateXpAndLevel(currentStats.xp, earnedXp);

  const updatedProgress: Record<string, LessonProgress> = {
    ...(currentStats.learningProgress || {})
  };

  const currentRecord: LessonProgress = {
    chapterId,
    completed: isPassed || (existing?.completed ?? false),
    score,
    bestScore: Math.max(score, existing?.bestScore || 0),
    stars: Math.max(stars, existing?.stars || 0),
    lastCompletedDate: isPassed ? new Date().toISOString() : existing?.lastCompletedDate,
    mistakesKanaIds
  };

  updatedProgress[chapterId] = currentRecord;

  const updatedStats: UserStats = {
    ...currentStats,
    xp: newXp,
    level: newLevel,
    learningProgress: updatedProgress
  };

  saveUserStats(updatedStats);

  return {
    updatedStats,
    earnedXp,
    leveledUp,
    isPassed,
    stars
  };
}
