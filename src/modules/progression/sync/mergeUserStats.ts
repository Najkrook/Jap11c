import type { LessonProgress, SrsItemData, UserStats } from '../../../types/kana';
import type { AnkiCardProgress, GenkiCardProgress, CustomFlashcard } from '../../../types/anki';

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

    const localNext = typeof localItem.nextReviewDate === 'number' && !isNaN(localItem.nextReviewDate)
      ? localItem.nextReviewDate
      : Date.now();
    const cloudNext = typeof cloudItem.nextReviewDate === 'number' && !isNaN(cloudItem.nextReviewDate)
      ? cloudItem.nextReviewDate
      : Date.now();
    const lastReviewed = Math.max(localItem.lastReviewedDate || 0, cloudItem.lastReviewedDate || 0);

    mergedKanaProgress[id] = {
      id,
      easeFactor: Math.max(localItem.easeFactor || 2.5, cloudItem.easeFactor || 2.5),
      interval: Math.max(localItem.interval || 0, cloudItem.interval || 0),
      repetitions: Math.max(localItem.repetitions || 0, cloudItem.repetitions || 0),
      nextReviewDate: Math.min(localNext, cloudNext),
      ...(lastReviewed > 0 ? { lastReviewedDate: lastReviewed } : {}),
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

  const mergedAnkiProgress: Record<string, number[]> = {};
  const allAnkiModes = new Set([
    ...Object.keys(local.ankiProgress || {}),
    ...Object.keys(cloud.ankiProgress || {})
  ]);

  allAnkiModes.forEach((mode) => {
    const localChapters = local.ankiProgress?.[mode] || [];
    const cloudChapters = cloud.ankiProgress?.[mode] || [];
    mergedAnkiProgress[mode] = Array.from(new Set([...localChapters, ...cloudChapters])).sort((a, b) => a - b);
  });

  const mergedAnkiCardProgress: Record<number, AnkiCardProgress> = {};
  const allCardIndices = new Set([
    ...Object.keys(local.ankiCardProgress || {}).map(Number),
    ...Object.keys(cloud.ankiCardProgress || {}).map(Number)
  ]);

  allCardIndices.forEach((idx) => {
    const localCard = local.ankiCardProgress?.[idx];
    const cloudCard = cloud.ankiCardProgress?.[idx];

    if (localCard && !cloudCard) {
      mergedAnkiCardProgress[idx] = { ...localCard };
      return;
    }
    if (!localCard && cloudCard) {
      mergedAnkiCardProgress[idx] = { ...cloudCard };
      return;
    }
    if (!localCard || !cloudCard) return;

    const isMastered = localCard.status === 'mastered' || cloudCard.status === 'mastered';
    const bestStatus = isMastered
      ? 'mastered'
      : localCard.status === 'review' || cloudCard.status === 'review'
        ? 'review'
        : localCard.status === 'learning' || cloudCard.status === 'learning'
          ? 'learning'
          : 'new';

    const localNext = typeof localCard.nextReviewDate === 'number' && !isNaN(localCard.nextReviewDate)
      ? localCard.nextReviewDate
      : Date.now();
    const cloudNext = typeof cloudCard.nextReviewDate === 'number' && !isNaN(cloudCard.nextReviewDate)
      ? cloudCard.nextReviewDate
      : Date.now();
    const lastReviewed = Math.max(localCard.lastReviewedDate || 0, cloudCard.lastReviewedDate || 0);

    mergedAnkiCardProgress[idx] = {
      cardIndex: idx,
      status: bestStatus,
      easeFactor: Math.max(localCard.easeFactor || 2.5, cloudCard.easeFactor || 2.5),
      interval: Math.max(localCard.interval || 0, cloudCard.interval || 0),
      repetitions: Math.max(localCard.repetitions || 0, cloudCard.repetitions || 0),
      nextReviewDate: Math.min(localNext, cloudNext),
      ...(lastReviewed > 0 ? { lastReviewedDate: lastReviewed } : {}),
      consecutiveCorrect: Math.max(localCard.consecutiveCorrect || 0, cloudCard.consecutiveCorrect || 0),
      totalReviews: Math.max(localCard.totalReviews || 0, cloudCard.totalReviews || 0),
      totalErrors: Math.max(localCard.totalErrors || 0, cloudCard.totalErrors || 0),
      lapses: Math.max(localCard.lapses || 0, cloudCard.lapses || 0)
    };
  });

  const mergedGenkiCardProgress: Record<number, GenkiCardProgress> = {};
  const allGenkiCardIndices = new Set([
    ...Object.keys(local.genkiCardProgress || {}).map(Number),
    ...Object.keys(cloud.genkiCardProgress || {}).map(Number)
  ]);

  allGenkiCardIndices.forEach((idx) => {
    const localCard = local.genkiCardProgress?.[idx];
    const cloudCard = cloud.genkiCardProgress?.[idx];

    if (localCard && !cloudCard) {
      mergedGenkiCardProgress[idx] = { ...localCard };
      return;
    }
    if (!localCard && cloudCard) {
      mergedGenkiCardProgress[idx] = { ...cloudCard };
      return;
    }
    if (!localCard || !cloudCard) return;

    const localLast = localCard.lastReviewedDate || 0;
    const cloudLast = cloudCard.lastReviewedDate || 0;
    const mostRecent = localLast >= cloudLast ? localCard : cloudCard;

    const isMastered = localCard.status === 'mastered' || cloudCard.status === 'mastered';
    const bestStatus = isMastered
      ? 'mastered'
      : localCard.status === 'review' || cloudCard.status === 'review'
        ? 'review'
        : localCard.status === 'learning' || cloudCard.status === 'learning'
          ? 'learning'
          : 'new';

    const lastReviewed = Math.max(localLast, cloudLast);

    mergedGenkiCardProgress[idx] = {
      cardIndex: idx,
      status: bestStatus,
      easeFactor: mostRecent.easeFactor ?? 2.5,
      intervalHours: mostRecent.intervalHours ?? 0,
      repetitions: Math.max(localCard.repetitions || 0, cloudCard.repetitions || 0),
      nextReviewDate: mostRecent.nextReviewDate,
      ...(lastReviewed > 0 ? { lastReviewedDate: lastReviewed } : {}),
      consecutiveCorrect: Math.max(localCard.consecutiveCorrect || 0, cloudCard.consecutiveCorrect || 0),
      totalReviews: Math.max(localCard.totalReviews || 0, cloudCard.totalReviews || 0),
      totalErrors: Math.max(localCard.totalErrors || 0, cloudCard.totalErrors || 0),
      lapses: Math.max(localCard.lapses || 0, cloudCard.lapses || 0)
    };
  });

  const xp = Math.max(local.xp || 0, cloud.xp || 0);

  const mergedGrammarProgress = Array.from(new Set([
    ...(local.grammarProgress || []),
    ...(cloud.grammarProgress || [])
  ]));

  const mergedAnkiBookmarks = Array.from(new Set([
    ...(local.ankiBookmarks || []),
    ...(cloud.ankiBookmarks || [])
  ])).sort((a, b) => a - b);

  const mergedStudyGuideTasks: Record<string, boolean> = {};
  const allStudyKeys = new Set([
    ...Object.keys(local.studyGuideTasks || {}),
    ...Object.keys(cloud.studyGuideTasks || {})
  ]);
  allStudyKeys.forEach((key) => {
    mergedStudyGuideTasks[key] = Boolean(local.studyGuideTasks?.[key] || cloud.studyGuideTasks?.[key]);
  });

  const mergedIntensiveTasks: Record<string, boolean> = {};
  const allIntensiveKeys = new Set([
    ...Object.keys(local.intensiveTasks || {}),
    ...Object.keys(cloud.intensiveTasks || {})
  ]);
  allIntensiveKeys.forEach((key) => {
    mergedIntensiveTasks[key] = Boolean(local.intensiveTasks?.[key] || cloud.intensiveTasks?.[key]);
  });

  const cardMap = new Map<string, CustomFlashcard>();
  (cloud.customCards || []).forEach((c) => cardMap.set(c.id, c));
  (local.customCards || []).forEach((c) => cardMap.set(c.id, c));
  const mergedCustomCards = Array.from(cardMap.values()).sort((a, b) => a.createdAt - b.createdAt);

  const mergedCustomCardProgress: Record<string, AnkiCardProgress> = {};
  const allCustomCardIds = new Set([
    ...Object.keys(local.customCardProgress || {}),
    ...Object.keys(cloud.customCardProgress || {})
  ]);

  allCustomCardIds.forEach((id) => {
    const localProgress = local.customCardProgress?.[id];
    const cloudProgress = cloud.customCardProgress?.[id];
    if (localProgress && !cloudProgress) {
      mergedCustomCardProgress[id] = { ...localProgress };
    } else if (!localProgress && cloudProgress) {
      mergedCustomCardProgress[id] = { ...cloudProgress };
    } else if (localProgress && cloudProgress) {
      const localLast = localProgress.lastReviewedDate || 0;
      const cloudLast = cloudProgress.lastReviewedDate || 0;
      const mostRecent = localLast >= cloudLast ? localProgress : cloudProgress;
      mergedCustomCardProgress[id] = {
        ...mostRecent,
        repetitions: Math.max(localProgress.repetitions, cloudProgress.repetitions),
        totalReviews: Math.max(localProgress.totalReviews, cloudProgress.totalReviews),
        totalErrors: Math.max(localProgress.totalErrors, cloudProgress.totalErrors)
      };
    }
  });

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
    ].map((id) => id === 'lund_ready' ? 'hiragana_master' : id))),
    ankiProgress: mergedAnkiProgress,
    ankiCardProgress: mergedAnkiCardProgress,
    genkiCardProgress: mergedGenkiCardProgress,
    grammarProgress: mergedGrammarProgress,
    ankiBookmarks: mergedAnkiBookmarks,
    studyGuideTasks: mergedStudyGuideTasks,
    intensiveTasks: mergedIntensiveTasks,
    customCards: mergedCustomCards,
    customCardProgress: mergedCustomCardProgress
  };
}
