import { describe, it, expect } from 'vitest';
import {
  INITIAL_SRS_SESSION_STATS,
  updateSessionStats,
  calculateNextSessionStep,
  filterDueCards,
  type SrsSessionStats
} from '../srsLogic';
import type { KanaCharacter } from '../../../types/kana';
import { HIRAGANA_DATA, HIRAGANA_MAP } from '../../../data/hiraganaData';
import { KATAKANA_DATA, KATAKANA_MAP } from '../../../data/katakanaData';

describe('srsLogic', () => {
  describe('filterDueCards', () => {
    const ALL_MAP = new Map<string, KanaCharacter>([
      ...HIRAGANA_MAP.entries(),
      ...KATAKANA_MAP.entries()
    ]);

    it('falls back to 15 cards when no cards are due', () => {
      const result = filterDueCards([], false, ALL_MAP, HIRAGANA_DATA);
      expect(result).toHaveLength(15);
      expect(result[0].id).toBe(HIRAGANA_DATA[0].id);
    });

    it('returns only Hiragana cards when isKatakana is false', () => {
      const dueIds = ['a', 'i', 'kata_a', 'kata_i'];
      const result = filterDueCards(dueIds, false, ALL_MAP, HIRAGANA_DATA);
      expect(result.map(k => k.id)).toEqual(['a', 'i']);
    });

    it('returns only Katakana cards when isKatakana is true', () => {
      const dueIds = ['a', 'i', 'kata_a', 'kata_i'];
      const result = filterDueCards(dueIds, true, ALL_MAP, KATAKANA_DATA);
      expect(result.map(k => k.id)).toEqual(['kata_a', 'kata_i']);
    });
  });

  describe('updateSessionStats', () => {
    it('accurately records ratings and xp', () => {
      let stats: SrsSessionStats = { ...INITIAL_SRS_SESSION_STATS };

      stats = updateSessionStats(stats, 'good', 15);
      expect(stats.reviewed).toBe(1);
      expect(stats.good).toBe(1);
      expect(stats.again).toBe(0);
      expect(stats.xpEarned).toBe(15);

      stats = updateSessionStats(stats, 'easy', 25);
      expect(stats.reviewed).toBe(2);
      expect(stats.easy).toBe(1);
      expect(stats.xpEarned).toBe(40);

      stats = updateSessionStats(stats, 'again', 5);
      expect(stats.reviewed).toBe(3);
      expect(stats.again).toBe(1);
      expect(stats.xpEarned).toBe(45);
    });
  });

  describe('calculateNextSessionStep', () => {
    it('advances to next index on good answer when not at end of queue', () => {
      const step = calculateNextSessionStep(0, 15, 'good');
      expect(step.nextIndex).toBe(1);
      expect(step.isCompleted).toBe(false);
      expect(step.shouldReinsert).toBe(false);
    });

    it('completes session on last card with good/easy/hard answer', () => {
      const step = calculateNextSessionStep(14, 15, 'good');
      expect(step.isCompleted).toBe(true);
      expect(step.shouldReinsert).toBe(false);
    });

    it('does not prematurely complete session when again is chosen on last card', () => {
      // With 15 cards, on index 14, choosing again adds 1 card to the queue (total 16)
      const step = calculateNextSessionStep(14, 15, 'again');
      expect(step.shouldReinsert).toBe(true);
      expect(step.isCompleted).toBe(false);
      expect(step.nextIndex).toBe(15);
    });

    it('re-inserts card and advances index when again is chosen in middle of queue', () => {
      const step = calculateNextSessionStep(3, 10, 'again');
      expect(step.shouldReinsert).toBe(true);
      expect(step.isCompleted).toBe(false);
      expect(step.nextIndex).toBe(4);
    });
  });
});
