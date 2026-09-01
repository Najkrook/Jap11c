import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { UserStats, SrsItemData, LessonProgress } from '../../../types/kana';
import { HIRAGANA_DATA } from '../../../data/hiraganaData';

export function mergeUserStats(local: UserStats, cloud: UserStats): UserStats {
  // Merge Kana Progress
  const mergedKanaProgress: Record<string, SrsItemData> = {};
  
  // Start with all possible kana IDs
  HIRAGANA_DATA.forEach(k => {
    const localItem = local.kanaProgress?.[k.id];
    const cloudItem = cloud.kanaProgress?.[k.id];

    if (!localItem && !cloudItem) {
      return;
    }
    if (localItem && !cloudItem) {
      mergedKanaProgress[k.id] = { ...localItem };
      return;
    }
    if (!localItem && cloudItem) {
      mergedKanaProgress[k.id] = { ...cloudItem };
      return;
    }

    // Both exist: prefer mastered status, higher repetitions, or higher reviews
    if (localItem && cloudItem) {
      const isMastered = localItem.status === 'mastered' || cloudItem.status === 'mastered';
      const bestStatus = isMastered ? 'mastered' : (localItem.status === 'review' || cloudItem.status === 'review') ? 'review' : (localItem.status === 'learning' || cloudItem.status === 'learning') ? 'learning' : 'new';
      
      const maxRepetitions = Math.max(localItem.repetitions || 0, cloudItem.repetitions || 0);
      const maxReviews = Math.max(localItem.totalReviews || 0, cloudItem.totalReviews || 0);
      const maxErrors = Math.max(localItem.totalErrors || 0, cloudItem.totalErrors || 0);
      const maxConsecutive = Math.max(localItem.consecutiveCorrect || 0, cloudItem.consecutiveCorrect || 0);
      const lastReviewed = Math.max(localItem.lastReviewedDate || 0, cloudItem.lastReviewedDate || 0) || undefined;
      const easeFactor = Math.max(localItem.easeFactor || 2.5, cloudItem.easeFactor || 2.5);
      const interval = Math.max(localItem.interval || 0, cloudItem.interval || 0);
      const nextReviewDate = Math.min(localItem.nextReviewDate || Date.now(), cloudItem.nextReviewDate || Date.now());

      mergedKanaProgress[k.id] = {
        id: k.id,
        easeFactor,
        interval,
        repetitions: maxRepetitions,
        nextReviewDate,
        lastReviewedDate: lastReviewed,
        status: bestStatus,
        consecutiveCorrect: maxConsecutive,
        totalReviews: maxReviews,
        totalErrors: maxErrors
      };
    }
  });

  // Merge Learning Path Chapters
  const mergedLearningProgress: Record<string, LessonProgress> = {};
  const allChapterKeys = Array.from(new Set([
    ...Object.keys(local.learningProgress || {}),
    ...Object.keys(cloud.learningProgress || {})
  ]));

  allChapterKeys.forEach(key => {
    const l = local.learningProgress?.[key];
    const c = cloud.learningProgress?.[key];

    if (l && !c) {
      mergedLearningProgress[key] = { ...l };
    } else if (!l && c) {
      mergedLearningProgress[key] = { ...c };
    } else if (l && c) {
      mergedLearningProgress[key] = {
        chapterId: key,
        completed: l.completed || c.completed,
        score: Math.max(l.score, c.score),
        bestScore: Math.max(l.bestScore || 0, c.bestScore || 0),
        stars: Math.max(l.stars || 0, c.stars || 0),
        lastCompletedDate: (l.lastCompletedDate && c.lastCompletedDate)
          ? (new Date(l.lastCompletedDate) > new Date(c.lastCompletedDate) ? l.lastCompletedDate : c.lastCompletedDate)
          : (l.lastCompletedDate || c.lastCompletedDate),
        mistakesKanaIds: Array.from(new Set([...(l.mistakesKanaIds || []), ...(c.mistakesKanaIds || [])]))
      };
    }
  });

  // Merge High Scores
  const mergedHighScores = {
    kanaDrop: Math.max(local.highScores?.kanaDrop || 0, cloud.highScores?.kanaDrop || 0),
    speedQuiz: Math.max(local.highScores?.speedQuiz || 0, cloud.highScores?.speedQuiz || 0),
    wordScramble: Math.max(local.highScores?.wordScramble || 0, cloud.highScores?.wordScramble || 0),
    shinkansenRush: Math.max(local.highScores?.shinkansenRush || 0, cloud.highScores?.shinkansenRush || 0),
    dojoRoguelike: Math.max(local.highScores?.dojoRoguelike || 0, cloud.highScores?.dojoRoguelike || 0)
  };

  // Merge Badges (union)
  const mergedBadges = Array.from(new Set([
    ...(local.unlockedBadges || []),
    ...(cloud.unlockedBadges || [])
  ]));

  // Date and streak
  let streakDays = Math.max(local.streakDays || 1, cloud.streakDays || 1);
  let lastActiveDate = local.lastActiveDate || cloud.lastActiveDate || new Date().toISOString().split('T')[0];
  if (local.lastActiveDate && cloud.lastActiveDate) {
    if (new Date(local.lastActiveDate) > new Date(cloud.lastActiveDate)) {
      lastActiveDate = local.lastActiveDate;
      streakDays = local.streakDays;
    } else if (new Date(cloud.lastActiveDate) > new Date(local.lastActiveDate)) {
      lastActiveDate = cloud.lastActiveDate;
      streakDays = cloud.streakDays;
    }
  }

  const mergedXp = Math.max(local.xp || 0, cloud.xp || 0);
  const mergedLevel = Math.max(local.level || 1, cloud.level || 1, Math.floor(Math.sqrt(mergedXp / 50)) + 1);

  return {
    xp: mergedXp,
    level: mergedLevel,
    streakDays,
    lastActiveDate,
    kanaProgress: mergedKanaProgress,
    learningProgress: mergedLearningProgress,
    highScores: mergedHighScores,
    unlockedBadges: mergedBadges
  };
}

export async function fetchUserStatsFromFirestore(userId: string): Promise<UserStats | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.stats) {
        return data.stats as UserStats;
      }
    }
    return null;
  } catch (err) {
    console.error('Error fetching stats from Firestore:', err);
    return null;
  }
}

export async function saveUserStatsToFirestore(userId: string, stats: UserStats, userProfile?: { displayName?: string | null; email?: string | null; photoURL?: string | null }): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      stats,
      profile: userProfile || null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving stats to Firestore:', err);
    return false;
  }
}
