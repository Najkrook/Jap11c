import type { LessonProgress, SrsItemData, UserStats } from '../../../types/kana';

export function mergeUserStats(local: UserStats, cloud: UserStats): UserStats {
  const mergedKanaProgress: Record<string, SrsItemData> = {};
  const allKanaIds = new Set([
    ...Object.keys(local.kanaProgress || {}),
    ...Object.keys(cloud.kanaProgress || {})
  ]);

  allKanaIds.forEach((id) => {
    const localItem = local.kanaProgress?.[id];
    const cloudItem = cloud.kanaProgress?.[id];

    if (localItem && !cloudItem) {
      mergedKanaProgress[id] = { ...localItem };
      return;
    }
    if (!localItem && cloudItem) {
      mergedKanaProgress[id] = { ...cloudItem };
      return;
    }
    if (!localItem || !cloudItem) return;

    const isMastered = localItem.status === 'mastered' || cloudItem.status === 'mastered';
    const bestStatus = isMastered
      ? 'mastered'
      : localItem.status === 'review' || cloudItem.status === 'review'
        ? 'review'
        : localItem.status === 'learning' || cloudItem.status === 'learning'
          ? 'learning'
          : 'new';

    mergedKanaProgress[id] = {
      id,
      easeFactor: Math.max(localItem.easeFactor || 2.5, cloudItem.easeFactor || 2.5),
      interval: Math.max(localItem.interval || 0, cloudItem.interval || 0),
      repetitions: Math.max(localItem.repetitions || 0, cloudItem.repetitions || 0),
      nextReviewDate: Math.min(localItem.nextReviewDate, cloudItem.nextReviewDate),
      lastReviewedDate: Math.max(localItem.lastReviewedDate || 0, cloudItem.lastReviewedDate || 0) || undefined,
      status: bestStatus,
      consecutiveCorrect: Math.max(localItem.consecutiveCorrect || 0, cloudItem.consecutiveCorrect || 0),
      totalReviews: Math.max(localItem.totalReviews || 0, cloudItem.totalReviews || 0),
      totalErrors: Math.max(localItem.totalErrors || 0, cloudItem.totalErrors || 0)
    };
  });

  const mergedLearningProgress: Record<string, LessonProgress> = {};
  const allChapterKeys = new Set([
    ...Object.keys(local.learningProgress || {}),
    ...Object.keys(cloud.learningProgress || {})
  ]);

  allChapterKeys.forEach((key) => {
    const localLesson = local.learningProgress?.[key];
    const cloudLesson = cloud.learningProgress?.[key];

    if (localLesson && !cloudLesson) {
      mergedLearningProgress[key] = { ...localLesson };
    } else if (!localLesson && cloudLesson) {
      mergedLearningProgress[key] = { ...cloudLesson };
    } else if (localLesson && cloudLesson) {
      const latestDate = localLesson.lastCompletedDate && cloudLesson.lastCompletedDate
        ? (new Date(localLesson.lastCompletedDate) > new Date(cloudLesson.lastCompletedDate)
            ? localLesson.lastCompletedDate
            : cloudLesson.lastCompletedDate)
        : (localLesson.lastCompletedDate || cloudLesson.lastCompletedDate);

      mergedLearningProgress[key] = {
        chapterId: key,
        completed: localLesson.completed || cloudLesson.completed,
        score: Math.max(localLesson.score, cloudLesson.score),
        bestScore: Math.max(localLesson.bestScore || 0, cloudLesson.bestScore || 0),
        stars: Math.max(localLesson.stars || 0, cloudLesson.stars || 0),
        lastCompletedDate: latestDate,
        mistakesKanaIds: Array.from(new Set([
          ...(localLesson.mistakesKanaIds || []),
          ...(cloudLesson.mistakesKanaIds || [])
        ]))
      };
    }
  });

  const mergedHighScores = {
    kanaDrop: Math.max(local.highScores?.kanaDrop || 0, cloud.highScores?.kanaDrop || 0),
    speedQuiz: Math.max(local.highScores?.speedQuiz || 0, cloud.highScores?.speedQuiz || 0),
    wordScramble: Math.max(local.highScores?.wordScramble || 0, cloud.highScores?.wordScramble || 0),
    shinkansenRush: Math.max(local.highScores?.shinkansenRush || 0, cloud.highScores?.shinkansenRush || 0),
    dojoRoguelike: Math.max(local.highScores?.dojoRoguelike || 0, cloud.highScores?.dojoRoguelike || 0)
  };

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

  const xp = Math.max(local.xp || 0, cloud.xp || 0);

  return {
    xp,
    level: Math.max(local.level || 1, cloud.level || 1, Math.floor(Math.sqrt(xp / 50)) + 1),
    streakDays,
    lastActiveDate,
    kanaProgress: mergedKanaProgress,
    learningProgress: mergedLearningProgress,
    highScores: mergedHighScores,
    unlockedBadges: Array.from(new Set([
      ...(local.unlockedBadges || []),
      ...(cloud.unlockedBadges || [])
    ].map((id) => id === 'lund_ready' ? 'hiragana_master' : id)))
  };
}
