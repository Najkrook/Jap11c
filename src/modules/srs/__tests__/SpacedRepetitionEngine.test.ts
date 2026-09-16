import { describe, it, expect } from 'vitest';
import { SpacedRepetitionEngine } from '../SpacedRepetitionEngine';
import type { CardRef } from '../types';

describe('SpacedRepetitionEngine', () => {
  const cardRef: CardRef = { deckId: 'kana', cardId: 'a' };
  const mockNow = 1700000000000;

  it('creates initial unreviewed progress correctly', () => {
    const init = SpacedRepetitionEngine.createInitialProgress(cardRef, mockNow);
    expect(init.cardRef).toEqual(cardRef);
    expect(init.repetitions).toBe(0);
    expect(init.easeFactor).toBe(2.5);
    expect(init.status).toBe('new');
    expect(init.nextReviewDate).toBe(mockNow);
    expect(SpacedRepetitionEngine.isDue(init, mockNow)).toBe(true);
  });

  it('handles first review with "good" rating', () => {
    const { nextProgress, earnedXp } = SpacedRepetitionEngine.calculateReview(
      undefined,
      cardRef,
      'good',
      mockNow
    );

    expect(earnedXp).toBe(15);
    expect(nextProgress.repetitions).toBe(1);
    expect(nextProgress.interval).toBe(1);
    expect(nextProgress.status).toBe('review');
    expect(nextProgress.nextReviewDate).toBe(mockNow + 24 * 60 * 60 * 1000);
    expect(nextProgress.consecutiveCorrect).toBe(1);
  });

  it('handles "again" lapse correctly on previously learned card', () => {
    const init = SpacedRepetitionEngine.createInitialProgress(cardRef, mockNow);
    init.status = 'review';
    init.repetitions = 3;
    init.interval = 10;
    init.easeFactor = 2.5;

    const { nextProgress, earnedXp, quality } = SpacedRepetitionEngine.calculateReview(
      init,
      cardRef,
      'again',
      mockNow
    );

    expect(quality).toBe(1);
    expect(earnedXp).toBe(5);
    expect(nextProgress.repetitions).toBe(0);
    expect(nextProgress.consecutiveCorrect).toBe(0);
    expect(nextProgress.lapses).toBe(1);
    expect(nextProgress.totalErrors).toBe(1);
    expect(nextProgress.status).toBe('learning');
    // Due in 10 minutes
    expect(nextProgress.nextReviewDate).toBe(mockNow + 10 * 60 * 1000);
    expect(nextProgress.easeFactor).toBe(2.3);
  });

  it('advances to mastered after 4 repetitions and 3 consecutive correct', () => {
    let progress = SpacedRepetitionEngine.createInitialProgress(cardRef, mockNow);
    for (let i = 0; i < 4; i++) {
      const result = SpacedRepetitionEngine.calculateReview(progress, cardRef, 'good', mockNow);
      progress = result.nextProgress;
    }

    expect(progress.repetitions).toBe(4);
    expect(progress.consecutiveCorrect).toBe(4);
    expect(progress.status).toBe('mastered');
  });

  it('filters and sorts due cards with oldest overdue first', () => {
    const ref1: CardRef = { deckId: 'kana', cardId: 'a' };
    const ref2: CardRef = { deckId: 'kana', cardId: 'i' };
    const ref3: CardRef = { deckId: 'kana', cardId: 'u' };

    const map = {
      'kana:a': {
        ...SpacedRepetitionEngine.createInitialProgress(ref1, mockNow),
        nextReviewDate: mockNow - 5000 // 5 sec overdue
      },
      'kana:i': {
        ...SpacedRepetitionEngine.createInitialProgress(ref2, mockNow),
        nextReviewDate: mockNow + 10000 // not due
      },
      'kana:u': {
        ...SpacedRepetitionEngine.createInitialProgress(ref3, mockNow),
        nextReviewDate: mockNow - 20000 // 20 sec overdue (most urgent)
      }
    };

    const due = SpacedRepetitionEngine.filterDueCards(map, [ref1, ref2, ref3], mockNow);
    expect(due).toEqual([ref3, ref1]);
  });
});