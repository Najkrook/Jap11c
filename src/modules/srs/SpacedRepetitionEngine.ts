import type { CardRef, SrsRating, SrsItemProgress, SrsIntervalPreview, DeckId } from './types';
import { serializeCardRef } from './types';

export class SpacedRepetitionEngine {
  /**
   * Creates a default unreviewed item record.
   */
  public static createInitialProgress(cardRef: CardRef, now: number = Date.now()): SrsItemProgress {
    return {
      cardRef,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: now,
      status: 'new',
      consecutiveCorrect: 0,
      totalReviews: 0,
      totalErrors: 0,
      lapses: 0
    };
  }

  /**
   * Checks if an item is due for review.
   * New/unreviewed items are always considered due.
   */
  public static isDue(progress?: SrsItemProgress, now: number = Date.now()): boolean {
    if (!progress) return true;
    return progress.nextReviewDate <= now;
  }

  /**
   * Evaluates recall rating using the canonical SuperMemo-2 spaced repetition algorithm.
   */
  public static calculateReview(
    current: SrsItemProgress | undefined,
    cardRef: CardRef,
    rating: SrsRating,
    now: number = Date.now()
  ): {
    nextProgress: SrsItemProgress;
    earnedXp: number;
    quality: number;
  } {
    const base: SrsItemProgress = current ? { ...current } : this.createInitialProgress(cardRef, now);

    base.lastReviewedDate = now;
    base.totalReviews += 1;

    let quality = 4;
    let earnedXp = 15;

    switch (rating) {
      case 'again':
        quality = 1;
        earnedXp = 5;
        break;
      case 'hard':
        quality = 3;
        earnedXp = 10;
        break;
      case 'good':
        quality = 4;
        earnedXp = 15;
        break;
      case 'easy':
        quality = 5;
        earnedXp = 25;
        break;
    }

    if (quality < 3) {
      // Failed recall / lapse
      if (base.status === 'review' || base.status === 'mastered') {
        base.lapses += 1;
      }
      base.consecutiveCorrect = 0;
      base.repetitions = 0;
      base.interval = 10 / 1440; // ~10 minutes
      base.nextReviewDate = now + 10 * 60 * 1000;
      base.status = 'learning';
      base.totalErrors += 1;
      base.easeFactor = Math.max(1.3, base.easeFactor - 0.2);
    } else {
      // Successful recall
      base.consecutiveCorrect += 1;

      if (base.repetitions === 0) {
        base.interval = rating === 'easy' ? 3 : 1;
      } else if (base.repetitions === 1) {
        base.interval = rating === 'easy' ? 6 : rating === 'hard' ? 2 : 3;
      } else {
        if (rating === 'hard') {
          base.interval = Math.max(1, Math.round(base.interval * 1.2));
        } else if (rating === 'good') {
          base.interval = Math.max(1, Math.round(base.interval * base.easeFactor));
        } else {
          base.interval = Math.max(1, Math.round(base.interval * base.easeFactor * 1.3));
        }
      }

      base.repetitions += 1;

      // SM-2 Ease Factor calculation
      const newEf = base.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      base.easeFactor = Math.min(3.0, Math.max(1.3, Number(newEf.toFixed(3))));

      base.nextReviewDate = now + Math.round(base.interval * 24 * 60 * 60 * 1000);

      if (base.repetitions >= 4 && base.consecutiveCorrect >= 3) {
        base.status = 'mastered';
      } else {
        base.status = 'review';
      }
    }

    return {
      nextProgress: base,
      earnedXp,
      quality
    };
  }

  /**
   * Filters and sorts due cards in order of urgency (oldest due first).
   */
  public static filterDueCards(
    progressMap: Record<string, SrsItemProgress>,
    availableCards: CardRef[],
    now: number = Date.now()
  ): CardRef[] {
    return availableCards
      .filter((ref) => {
        const key = serializeCardRef(ref);
        const progress = progressMap[key];
        return this.isDue(progress, now);
      })
      .sort((a, b) => {
        const keyA = serializeCardRef(a);
        const keyB = serializeCardRef(b);
        const dateA = progressMap[keyA]?.nextReviewDate ?? 0;
        const dateB = progressMap[keyB]?.nextReviewDate ?? 0;
        return dateA - dateB;
      });
  }

  /**
   * Calculates next interval previews for user review buttons.
   */
  public static calculateIntervalPreviews(current?: SrsItemProgress): SrsIntervalPreview {
    if (!current || current.repetitions === 0) {
      return {
        again: { days: 0, label: '<10m' },
        hard: { days: 1, label: '1d' },
        good: { days: 1, label: '1d' },
        easy: { days: 3, label: '3d' }
      };
    }

    if (current.repetitions === 1) {
      return {
        again: { days: 0, label: '<10m' },
        hard: { days: 2, label: '2d' },
        good: { days: 3, label: '3d' },
        easy: { days: 6, label: '6d' }
      };
    }

    const hardDays = Math.max(1, Math.round(current.interval * 1.2));
    const goodDays = Math.max(1, Math.round(current.interval * (current.easeFactor || 2.5)));
    const easyDays = Math.max(1, Math.round(current.interval * (current.easeFactor || 2.5) * 1.3));

    const formatDays = (d: number) => {
      if (d >= 30) {
        const m = Math.round(d / 30);
        return `${m}mån`;
      }
      return `${d}d`;
    };

    return {
      again: { days: 0, label: '<10m' },
      hard: { days: hardDays, label: formatDays(hardDays) },
      good: { days: goodDays, label: formatDays(goodDays) },
      easy: { days: easyDays, label: formatDays(easyDays) }
    };
  }
}