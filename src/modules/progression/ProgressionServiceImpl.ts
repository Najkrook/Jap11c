import type { 
  ProgressionService, 
  ProgressionActivity, 
  ActivityResult, 
  ProgressionSummary,
  GameId
} from './types';
import type { StorageAdapter } from './storage/StorageAdapter';
import type { UserStats, SrsItemData, LessonProgress, Badge } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { INITIAL_BADGES } from '../../data/badgesData';
import { CURRENT_STORAGE_KEY } from './storage/LocalStorageAdapter';

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_USER_STATS: UserStats = {
  xp: 0,
  level: 1,
  streakDays: 1,
  lastActiveDate: getLocalDateString(),
  kanaProgress: {},
  learningProgress: {},
  highScores: {
    kanaDrop: 0,
    speedQuiz: 0,
    wordScramble: 0,
    shinkansenRush: 0,
    dojoRoguelike: 0
  },
  unlockedBadges: []
};

export class ProgressionServiceImpl implements ProgressionService {
  private storage: StorageAdapter;
  private stats: UserStats;
  private listeners: Set<(stats: Readonly<UserStats>, result?: ActivityResult) => void> = new Set();
  private storageKey = CURRENT_STORAGE_KEY;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
    this.stats = this.loadAndInitialize();
  }

  private loadAndInitialize(): UserStats {
    const raw = this.storage.getItem(this.storageKey);
    let loaded: UserStats;
    if (!raw) {
      loaded = { ...INITIAL_USER_STATS };
    } else {
      try {
        loaded = JSON.parse(raw);
      } catch {
        loaded = { ...INITIAL_USER_STATS };
      }
    }

    loaded.kanaProgress = this.initializeKanaProgress(loaded.kanaProgress || {});
    loaded.learningProgress = loaded.learningProgress || {};
    loaded.highScores = {
      kanaDrop: loaded.highScores?.kanaDrop || 0,
      speedQuiz: loaded.highScores?.speedQuiz || 0,
      wordScramble: loaded.highScores?.wordScramble || 0,
      shinkansenRush: loaded.highScores?.shinkansenRush || 0,
      dojoRoguelike: loaded.highScores?.dojoRoguelike || 0
    };
    loaded.unlockedBadges = loaded.unlockedBadges || [];

    // Local timezone streak calculation on initial load
    this.updateStreak(loaded, false);

    return loaded;
  }

  private initializeKanaProgress(existing: Record<string, SrsItemData>): Record<string, SrsItemData> {
    const result: Record<string, SrsItemData> = { ...existing };
    for (const k of HIRAGANA_DATA) {
      if (!result[k.id]) {
        result[k.id] = {
          id: k.id,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewDate: Date.now(),
          status: 'new',
          consecutiveCorrect: 0,
          totalReviews: 0,
          totalErrors: 0
        };
      }
    }
    return result;
  }

  private updateStreak(stats: UserStats, isUserAction: boolean): boolean {
    const today = getLocalDateString();
    if (!stats.lastActiveDate) {
      stats.lastActiveDate = today;
      stats.streakDays = 1;
      return false;
    }

    if (stats.lastActiveDate === today) {
      return false;
    }

    const last = new Date(stats.lastActiveDate);
    const now = new Date(today);
    const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));

    let streakIncremented = false;
    if (diffDays === 1) {
      if (isUserAction) {
        stats.streakDays += 1;
        streakIncremented = true;
      }
    } else if (diffDays > 1) {
      stats.streakDays = 1;
    }

    stats.lastActiveDate = today;
    return streakIncremented;
  }

  private calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 50)) + 1;
  }

  public recordActivity(activity: ProgressionActivity): ActivityResult {
    const prevXp = this.stats.xp;
    const prevLevel = this.stats.level;
    let earnedXp = 0;
    let isNewHighScore = false;

    // 1. Update streak
    const streakIncremented = this.updateStreak(this.stats, true);

    // 2. Process specific activity rules
    switch (activity.type) {
      case 'srs_review': {
        const item = this.stats.kanaProgress[activity.kanaId] || {
          id: activity.kanaId,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewDate: Date.now(),
          status: 'new',
          consecutiveCorrect: 0,
          totalReviews: 0,
          totalErrors: 0
        };

        const now = Date.now();
        item.lastReviewedDate = now;
        item.totalReviews += 1;

        let quality = 4;
        if (activity.rating === 'again') { quality = 1; earnedXp = 5; }
        else if (activity.rating === 'hard') { quality = 3; earnedXp = 10; }
        else if (activity.rating === 'good') { quality = 4; earnedXp = 15; }
        else if (activity.rating === 'easy') { quality = 5; earnedXp = 25; }

        if (quality < 3) {
          item.consecutiveCorrect = 0;
          item.repetitions = 0;
          item.interval = 0.1; // ~6 minutes
          item.nextReviewDate = now + (6 * 60 * 1000);
          item.status = 'learning';
          item.totalErrors += 1;
        } else {
          item.consecutiveCorrect += 1;
          if (item.repetitions === 0) item.interval = 1;
          else if (item.repetitions === 1) item.interval = 3;
          else item.interval = Math.round(item.interval * item.easeFactor);

          item.repetitions += 1;

          let newEf = item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
          item.easeFactor = Math.min(Math.max(newEf, 1.3), 3.0);
          item.nextReviewDate = now + (item.interval * 24 * 60 * 60 * 1000);

          if (item.repetitions >= 4 && item.consecutiveCorrect >= 3) {
            item.status = 'mastered';
          } else {
            item.status = 'review';
          }
        }

        this.stats.kanaProgress[activity.kanaId] = item;
        break;
      }

      case 'lesson_completed': {
        const isPassed = activity.score >= 80;
        const stars = activity.score >= 100 ? 3 : activity.score >= 90 ? 2 : activity.score >= 80 ? 1 : 0;
        const existing = this.stats.learningProgress?.[activity.chapterId];

        if (isPassed) {
          if (!existing || !existing.completed) {
            earnedXp = 100 + Math.round(activity.score * 0.5);
          } else if (activity.score > existing.bestScore) {
            earnedXp = Math.round((activity.score - existing.bestScore) * 0.5) + 20;
          } else {
            earnedXp = 10;
          }
        } else {
          earnedXp = 5;
        }

        const currentRecord: LessonProgress = {
          chapterId: activity.chapterId,
          completed: isPassed || (existing?.completed ?? false),
          score: activity.score,
          bestScore: Math.max(activity.score, existing?.bestScore || 0),
          stars: Math.max(stars, existing?.stars || 0),
          lastCompletedDate: isPassed ? new Date().toISOString() : existing?.lastCompletedDate,
          mistakesKanaIds: activity.mistakesKanaIds || []
        };

        if (!this.stats.learningProgress) this.stats.learningProgress = {};
        this.stats.learningProgress[activity.chapterId] = currentRecord;
        break;
      }

      case 'game_finished': {
        const prevHigh = this.stats.highScores[activity.gameId] || 0;
        if (activity.score > prevHigh) {
          this.stats.highScores[activity.gameId] = activity.score;
          isNewHighScore = true;
        }
        earnedXp = Math.max(15, Math.floor(activity.score / 25));
        break;
      }

      case 'pronunciation_attempt': {
        earnedXp = activity.isMatch ? 20 : 2;
        break;
      }

      case 'practice_completed': {
        earnedXp = Math.max(10, Math.round(activity.score * 0.8));
        break;
      }

      case 'intensive_exam_completed': {
        earnedXp = activity.score * 15;
        break;
      }
    }

    // 3. Apply XP and calculate Level
    this.stats.xp += earnedXp;
    this.stats.level = this.calculateLevel(this.stats.xp);
    const leveledUp = this.stats.level > prevLevel;

    // 4. Evaluate badges automatically
    const newlyUnlockedBadges = this.evaluateBadges(activity);

    // 5. Persist to storage
    this.persist();

    const result: ActivityResult = {
      earnedXp,
      previousXp: prevXp,
      newXp: this.stats.xp,
      previousLevel: prevLevel,
      newLevel: this.stats.level,
      leveledUp,
      streak: this.stats.streakDays,
      streakIncremented,
      newlyUnlockedBadges,
      isNewHighScore,
      currentStats: this.getStats()
    };

    // 6. Notify subscribers
    this.notify(result);

    return result;
  }

  private evaluateBadges(activity: ProgressionActivity): Badge[] {
    const newlyUnlocked: Badge[] = [];
    const unlockedSet = new Set(this.stats.unlockedBadges || []);

    const checkAndUnlock = (badgeId: string) => {
      if (!unlockedSet.has(badgeId)) {
        const badgeDef = INITIAL_BADGES.find(b => b.id === badgeId);
        if (badgeDef) {
          const unlockedBadge: Badge = { ...badgeDef, unlockedAt: new Date().toISOString() };
          unlockedSet.add(badgeId);
          this.stats.unlockedBadges.push(badgeId);
          newlyUnlocked.push(unlockedBadge);
        }
      }
    };

    // Rule 1: first_five (a, i, u, e, o reviewed)
    const vowels = ['a', 'i', 'u', 'e', 'o'];
    if (vowels.every(id => (this.stats.kanaProgress[id]?.repetitions || 0) >= 1)) {
      checkAndUnlock('first_five');
    }

    // Rule 2: streak_3
    if (this.stats.streakDays >= 3) {
      checkAndUnlock('streak_3');
    }

    // Rule 3: game_master_1000
    if ((this.stats.highScores.shinkansenRush || 0) >= 1000 || (this.stats.highScores.kanaDrop || 0) >= 1000) {
      checkAndUnlock('game_master_1000');
    }

    // Rule 4: combo_king
    if (activity.type === 'game_finished' && (activity.maxCombo || 0) >= 15) {
      checkAndUnlock('combo_king');
    }

    // Rule 5: dakuten_pro
    const dakutenKana = HIRAGANA_DATA.filter(k => k.group === 'dakuon' || k.group === 'handakuon');
    if (dakutenKana.length > 0 && dakutenKana.every(k => {
      const status = this.stats.kanaProgress[k.id]?.status;
      return status === 'review' || status === 'mastered';
    })) {
      checkAndUnlock('dakuten_pro');
    }

    // Rule 6: voice_virtuoso
    if (activity.type === 'pronunciation_attempt' && activity.isMatch) {
      checkAndUnlock('voice_virtuoso');
    }

    // Rule 7: speed_demon
    if (activity.type === 'practice_completed' && activity.practiceType === 'speed60s' && activity.score >= 20) {
      checkAndUnlock('speed_demon');
    }

    // Rule 8: lund_ready (all 46 basic kana mastered)
    const basic46 = HIRAGANA_DATA.filter(k => k.group === 'gojuon');
    if (basic46.every(k => this.stats.kanaProgress[k.id]?.status === 'mastered')) {
      checkAndUnlock('lund_ready');
    }

    return newlyUnlocked;
  }

  private persist(): void {
    this.storage.setItem(this.storageKey, JSON.stringify(this.stats));
  }

  private notify(result?: ActivityResult): void {
    const statsCopy = this.getStats();
    this.listeners.forEach(fn => fn(statsCopy, result));
  }

  public getStats(): Readonly<UserStats> {
    return JSON.parse(JSON.stringify(this.stats));
  }

  public getDueCards(): string[] {
    const now = Date.now();
    return Object.values(this.stats.kanaProgress)
      .filter(item => item.nextReviewDate <= now || item.status === 'new')
      .map(item => item.id);
  }

  public getSummary(): ProgressionSummary {
    const progressList = Object.values(this.stats.kanaProgress);
    const totalMastered = progressList.filter(p => p.status === 'mastered').length;
    const totalLearning = progressList.filter(p => p.status === 'learning' || p.status === 'review').length;
    const totalDue = this.getDueCards().length;

    const level = this.stats.level;
    const currentLevelXp = Math.pow(level - 1, 2) * 50;
    const nextLevelXp = Math.pow(level, 2) * 50;
    const levelRange = Math.max(nextLevelXp - currentLevelXp, 1);
    const progressPercent = Math.min(Math.max(((this.stats.xp - currentLevelXp) / levelRange) * 100, 0), 100);

    const lessons = Object.values(this.stats.learningProgress || {});
    const completedLessons = lessons.filter(l => l.completed).length;
    const totalStars = lessons.reduce((acc, l) => acc + (l.stars || 0), 0);

    return {
      totalMasteredKana: totalMastered,
      totalLearningKana: totalLearning,
      totalDueReviews: totalDue,
      currentLevel: level,
      currentLevelXp,
      nextLevelXp,
      levelProgressPercent: Math.round(progressPercent),
      currentStreak: this.stats.streakDays,
      completedLessonsCount: completedLessons,
      totalStars
    };
  }

  public subscribe(listener: (stats: Readonly<UserStats>, result?: ActivityResult) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public exportData(): string {
    return JSON.stringify(this.stats, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const parsed = JSON.parse(jsonData);
      if (typeof parsed.xp === 'number' && parsed.kanaProgress) {
        this.stats = { ...INITIAL_USER_STATS, ...parsed };
        this.persist();
        this.notify();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public resetStats(): void {
    this.stats = { ...INITIAL_USER_STATS };
    this.stats.kanaProgress = this.initializeKanaProgress({});
    this.persist();
    this.notify();
  }
}
