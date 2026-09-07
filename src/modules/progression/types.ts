import type { UserStats, SrsRating, Badge } from '../../types/kana';

export type GameId = 'shinkansenRush' | 'dojoRoguelike' | 'kanaDrop' | 'speedQuiz' | 'wordScramble';
export type PracticeType = 'quiz' | 'speedTyping' | 'handwriting' | 'words' | 'speed60s' | 'trickyHiragana';

/**
 * Progression activity payload sent across the Progression interface seam.
 */
export type ProgressionActivity =
  | {
      type: 'srs_review';
      kanaId: string;
      rating: SrsRating;
    }
  | {
      type: 'lesson_completed';
      chapterId: string;
      score: number; // 0-100%
      mistakesKanaIds?: string[];
    }
  | {
      type: 'game_finished';
      gameId: GameId;
      score: number;
      maxCombo?: number;
      details?: Record<string, unknown>;
    }
  | {
      type: 'pronunciation_attempt';
      kanaId: string;
      isMatch: boolean;
      confidence?: number;
    }
  | {
      type: 'practice_completed';
      practiceType: PracticeType;
      score: number;
      timeSpentSeconds?: number;
    }
  | {
      type: 'intensive_exam_completed';
      score: number;
      totalQuestions: number;
    }
  | {
      type: 'anki_chapter_completed';
      mode: string;
      chapterIndex: number;
    }
  | {
      type: 'anki_card_review';
      cardIndex: number;
      rating: SrsRating;
    }
  | {
      type: 'anki_chapter_introduced';
      cardIndices: number[];
      mistakeIndices?: number[];
    };

/**
 * Deterministic outcome returned immediately to the caller.
 */
export interface ActivityResult {
  readonly earnedXp: number;
  readonly previousXp: number;
  readonly newXp: number;
  readonly previousLevel: number;
  readonly newLevel: number;
  readonly leveledUp: boolean;
  readonly streak: number;
  readonly streakIncremented: boolean;
  readonly newlyUnlockedBadges: Badge[];
  readonly isNewHighScore: boolean;
  readonly currentStats: Readonly<UserStats>;
}

export interface ProgressionSummary {
  readonly totalMasteredKana: number;
  readonly totalLearningKana: number;
  readonly totalDueReviews: number;
  readonly currentLevel: number;
  readonly currentLevelXp: number;
  readonly nextLevelXp: number;
  readonly levelProgressPercent: number;
  readonly currentStreak: number;
  readonly completedLessonsCount: number;
  readonly totalStars: number;
}

/**
 * Deep module interface for progression management.
 */
export interface ProgressionService {
  /** Records an activity, advances state, and returns the outcome */
  recordActivity(activity: ProgressionActivity): ActivityResult;

  /** Gets an immutable snapshot of user stats */
  getStats(): Readonly<UserStats>;

  /** Returns IDs of all kana cards due for SRS review */
  getDueCards(): string[];

  /** Returns computed summary metrics for dashboards and navigation bars */
  getSummary(): ProgressionSummary;

  /** Returns completed chapter indices for a given Anki deck mode */
  getAnkiProgress(mode: string): number[];

  /** Returns card indices of Anki anime cards due for review */
  getDueAnkiCards(): number[];

  /** Returns card indices of Anki anime cards that need practice / have mistakes */
  getWeakAnkiCards(): number[];

  /** Subscribes to progression state updates */
  subscribe(listener: (stats: Readonly<UserStats>, result?: ActivityResult) => void): () => void;

  /** Exports user stats as a JSON string */
  exportData(): string;

  /** Imports and validates user stats from JSON */
  importData(jsonData: string): boolean;

  /** Resets user stats to baseline */
  resetStats(): void;
  resetProgress(): void;
}
