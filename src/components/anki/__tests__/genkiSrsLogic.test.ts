import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateGenkiNextIntervals, 
  getDueGenkiCardIndices, 
  getGenkiDeckStats, 
  getGenkiSessionQueue 
} from '../ankiLogic';
import type { GenkiCardProgress } from '../../../types/anki';
import { ProgressionServiceImpl } from '../../../modules/progression/ProgressionServiceImpl';
import { InMemoryStorageAdapter } from '../../../modules/progression/storage/InMemoryStorageAdapter';

describe('genkiSrsLogic', () => {
  describe('calculateGenkiNextIntervals', () => {
    it('returns standard introductory intervals for new cards (repetitions = 0)', () => {
      const intervals = calculateGenkiNextIntervals(undefined);

      expect(intervals.not_at_all).toEqual({ hours: 0, label: 'Nu', fullLabel: 'Repetera nu' });
      expect(intervals.barely).toEqual({ hours: 0.1667, label: '10m', fullLabel: 'Om 10 minuter' });
      expect(intervals.almost).toEqual({ hours: 5, label: '5h', fullLabel: 'Om 5 timmar' });
      expect(intervals.known).toEqual({ hours: 72, label: '3d', fullLabel: 'Om 3 dagar' });
    });

    it('returns 7 days for known rating on repetition 1', () => {
      const progress: GenkiCardProgress = {
        cardIndex: 0,
        repetitions: 1,
        intervalHours: 72,
        nextReviewDate: Date.now() + 72 * 3600 * 1000,
        easeFactor: 2.3,
        status: 'review',
        consecutiveCorrect: 1,
        totalReviews: 1,
        totalErrors: 0,
        lapses: 0,
      };

      const intervals = calculateGenkiNextIntervals(progress);
      expect(intervals.known).toEqual({ hours: 168, label: '7d', fullLabel: 'Om 7 dagar' });
      expect(intervals.not_at_all.label).toBe('Nu');
      expect(intervals.barely.label).toBe('10m');
      expect(intervals.almost.label).toBe('5h');
    });

    it('adaptively escalates intervals for repetition >= 2 with cap at 30 days', () => {
      const progress: GenkiCardProgress = {
        cardIndex: 5,
        repetitions: 2,
        intervalHours: 168, // 7 days
        nextReviewDate: Date.now() + 168 * 3600 * 1000,
        easeFactor: 2.3,
        status: 'review',
        consecutiveCorrect: 2,
        totalReviews: 2,
        totalErrors: 0,
        lapses: 0,
      };

      const intervals = calculateGenkiNextIntervals(progress);
      // 168 * 2.3 = 386.4 hours => ~16 days
      expect(intervals.known.hours).toBeGreaterThan(168);
      expect(intervals.known.label).toMatch(/^\d+d$/);
    });

    it('caps maximum interval at 30 days (720h)', () => {
      const progress: GenkiCardProgress = {
        cardIndex: 10,
        repetitions: 5,
        intervalHours: 600,
        nextReviewDate: Date.now() + 600 * 3600 * 1000,
        easeFactor: 2.5,
        status: 'mastered',
        consecutiveCorrect: 5,
        totalReviews: 5,
        totalErrors: 0,
        lapses: 0,
      };

      const intervals = calculateGenkiNextIntervals(progress);
      expect(intervals.known.hours).toBe(720);
      expect(intervals.known.label).toBe('30d');
    });
  });

  describe('getDueGenkiCardIndices', () => {
    it('returns empty array when no card progress exists', () => {
      expect(getDueGenkiCardIndices(undefined)).toEqual([]);
      expect(getDueGenkiCardIndices({})).toEqual([]);
    });

    it('returns overdue cards sorted by oldest due date first', () => {
      const now = Date.now();
      const progress: Record<number, GenkiCardProgress> = {
        1: {
          cardIndex: 1,
          repetitions: 1,
          intervalHours: 72,
          nextReviewDate: now - 5000, // overdue
          easeFactor: 2.3,
          status: 'review',
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0,
          lapses: 0,
        },
        2: {
          cardIndex: 2,
          repetitions: 2,
          intervalHours: 168,
          nextReviewDate: now + 50000, // not due
          easeFactor: 2.3,
          status: 'review',
          consecutiveCorrect: 2,
          totalReviews: 2,
          totalErrors: 0,
          lapses: 0,
        },
        3: {
          cardIndex: 3,
          repetitions: 0,
          intervalHours: 0.1667,
          nextReviewDate: now - 15000, // older overdue
          easeFactor: 2.3,
          status: 'learning',
          consecutiveCorrect: 0,
          totalReviews: 1,
          totalErrors: 1,
          lapses: 0,
        },
      };

      const due = getDueGenkiCardIndices(progress);
      expect(due).toEqual([3, 1]);
    });
  });

  describe('getGenkiSessionQueue', () => {
    it('returns new cards in sequential order 0..114 when progress is empty', () => {
      const queue10 = getGenkiSessionQueue(undefined, 10, 115);
      expect(queue10).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      const queue20 = getGenkiSessionQueue({}, 20, 115);
      expect(queue20.length).toBe(20);
      expect(queue20[0]).toBe(0);
      expect(queue20[19]).toBe(19);

      const queueAll = getGenkiSessionQueue({}, 'all', 115);
      expect(queueAll.length).toBe(115);
    });

    it('prioritizes overdue cards before unstudied new cards', () => {
      const now = Date.now();
      const progress: Record<number, GenkiCardProgress> = {
        5: {
          cardIndex: 5,
          repetitions: 1,
          intervalHours: 72,
          nextReviewDate: now - 1000,
          easeFactor: 2.3,
          status: 'review',
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0,
          lapses: 0,
        },
        12: {
          cardIndex: 12,
          repetitions: 1,
          intervalHours: 72,
          nextReviewDate: now - 5000,
          easeFactor: 2.3,
          status: 'review',
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0,
          lapses: 0,
        },
      };

      const queue = getGenkiSessionQueue(progress, 5, 20);
      // Card 12 and 5 are due (12 older than 5), then new cards starting from 0 (skipping 5 and 12)
      expect(queue[0]).toBe(12);
      expect(queue[1]).toBe(5);
      expect(queue[2]).toBe(0);
      expect(queue[3]).toBe(1);
      expect(queue[4]).toBe(2);
      expect(queue.length).toBe(5);
    });
  });

  describe('getGenkiDeckStats', () => {
    it('calculates counts correctly across statuses', () => {
      const now = Date.now();
      const progress: Record<number, GenkiCardProgress> = {
        0: {
          cardIndex: 0,
          repetitions: 1,
          intervalHours: 72,
          nextReviewDate: now - 1000, // due
          easeFactor: 2.3,
          status: 'review',
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0,
          lapses: 0,
        },
        1: {
          cardIndex: 1,
          repetitions: 1,
          intervalHours: 5,
          nextReviewDate: now + 2 * 3600 * 1000, // upcoming today (within 5 hours)
          easeFactor: 2.3,
          status: 'learning',
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0,
          lapses: 0,
        },
        2: {
          cardIndex: 2,
          repetitions: 3,
          intervalHours: 168,
          nextReviewDate: now + 7 * 24 * 3600 * 1000, // mastered / future
          easeFactor: 2.3,
          status: 'mastered',
          consecutiveCorrect: 3,
          totalReviews: 3,
          totalErrors: 0,
          lapses: 0,
        },
      };

      const stats = getGenkiDeckStats(progress, 115);
      expect(stats.total).toBe(115);
      expect(stats.due).toBe(1);
      expect(stats.upcomingToday).toBe(1);
      expect(stats.mastered).toBe(2); // card 0 (72h) and card 2 (168h, mastered)
      expect(stats.unstarted).toBe(112);
    });
  });

  describe('ProgressionService genki_card_review integration', () => {
    let service: ProgressionServiceImpl;

    beforeEach(() => {
      service = new ProgressionServiceImpl(new InMemoryStorageAdapter());
    });

    it('records "not_at_all" review by keeping status learning and setting re-due now', () => {
      const result = service.recordActivity({
        type: 'genki_card_review',
        cardIndex: 4,
        rating: 'not_at_all',
      });

      expect(result.earnedXp).toBe(5);
      const card = service.getStats().genkiCardProgress?.[4];
      expect(card).toBeDefined();
      expect(card?.status).toBe('learning');
      expect(card?.repetitions).toBe(0);
      expect(card?.intervalHours).toBe(0);
      expect(card?.totalErrors).toBe(1);
      expect(service.getDueGenkiCards()).toContain(4);
    });

    it('records "barely" review with 10-minute interval', () => {
      const before = Date.now();
      const result = service.recordActivity({
        type: 'genki_card_review',
        cardIndex: 7,
        rating: 'barely',
      });

      expect(result.earnedXp).toBe(10);
      const card = service.getStats().genkiCardProgress?.[7];
      expect(card?.intervalHours).toBeCloseTo(0.1667, 2);
      expect(card?.nextReviewDate).toBeGreaterThanOrEqual(before + 9 * 60 * 1000);
      expect(card?.totalErrors).toBe(1);
    });

    it('records "almost" review with 5-hour interval', () => {
      const before = Date.now();
      const result = service.recordActivity({
        type: 'genki_card_review',
        cardIndex: 8,
        rating: 'almost',
      });

      expect(result.earnedXp).toBe(15);
      const card = service.getStats().genkiCardProgress?.[8];
      expect(card?.intervalHours).toBe(5);
      expect(card?.nextReviewDate).toBeGreaterThanOrEqual(before + 4.9 * 3600 * 1000);
    });

    it('records "known" review with 3-day (72h) initial interval and promotes status', () => {
      const before = Date.now();
      const result = service.recordActivity({
        type: 'genki_card_review',
        cardIndex: 9,
        rating: 'known',
      });

      expect(result.earnedXp).toBe(25);
      const card = service.getStats().genkiCardProgress?.[9];
      expect(card?.repetitions).toBe(1);
      expect(card?.intervalHours).toBe(72);
      expect(card?.nextReviewDate).toBeGreaterThanOrEqual(before + 71 * 3600 * 1000);
      expect(card?.status).toBe('review');
    });

    it('escalates interval to 7 days on consecutive known rating', () => {
      service.recordActivity({ type: 'genki_card_review', cardIndex: 9, rating: 'known' });
      service.recordActivity({ type: 'genki_card_review', cardIndex: 9, rating: 'known' });

      const card = service.getStats().genkiCardProgress?.[9];
      expect(card?.repetitions).toBe(2);
      expect(card?.intervalHours).toBe(168);
    });
  });
});
