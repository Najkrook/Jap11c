import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressionServiceImpl } from '../ProgressionServiceImpl';
import { InMemoryStorageAdapter } from '../storage/InMemoryStorageAdapter';
import { mergeUserStats } from '../sync/mergeUserStats';
import type { UserStats } from '../../../types/kana';
import type { CustomFlashcard } from '../../../types/anki';

describe('Custom Cards in Progression and Sync', () => {
  let service: ProgressionServiceImpl;

  beforeEach(() => {
    service = new ProgressionServiceImpl(new InMemoryStorageAdapter());
  });

  it('adds a custom flashcard and calculates due cards', () => {
    const res = service.addCustomCard({
      kanji: '学校',
      hiragana: 'がっこう',
      romaji: 'gakkou',
      meaning: 'skola',
      source: 'iPhone-skanning'
    });

    expect(res.earnedXp).toBeGreaterThan(0);
    const stats = service.getStats();
    expect(stats.customCards?.length).toBe(1);
    expect(stats.customCards?.[0].kanji).toBe('学校');
    expect(stats.customCards?.[0].hiragana).toBe('がっこう');

    const due = service.getDueCustomCards();
    expect(due.length).toBe(1);
    expect(due[0]).toBe(stats.customCards?.[0].id);
  });

  it('reviews a custom flashcard with SM-2 intervals', () => {
    service.addCustomCard({
      kanji: '猫',
      hiragana: 'ねこ',
      romaji: 'neko',
      meaning: 'katt',
      source: 'iPhone-skanning'
    });

    const cardId = service.getStats().customCards![0].id;

    // Review as 'good'
    service.reviewCustomCard(cardId, 'good');
    let progress = service.getStats().customCardProgress![cardId];
    expect(progress.repetitions).toBe(1);
    expect(progress.consecutiveCorrect).toBe(1);

    // Review again as 'good'
    service.reviewCustomCard(cardId, 'good');
    progress = service.getStats().customCardProgress![cardId];
    expect(progress.repetitions).toBe(2);
    expect(progress.interval).toBeGreaterThanOrEqual(2);
  });

  it('deletes a custom flashcard', () => {
    service.addCustomCard({
      kanji: '犬',
      hiragana: 'いぬ',
      romaji: 'inu',
      meaning: 'hund',
      source: 'iPhone-skanning'
    });

    const cardId = service.getStats().customCards![0].id;
    expect(service.getStats().customCards?.length).toBe(1);

    service.deleteCustomCard(cardId);
    expect(service.getStats().customCards?.length).toBe(0);
    expect(service.getStats().customCardProgress?.[cardId]).toBeUndefined();
  });

  it('merges custom cards between local and cloud', () => {
    const localCard: CustomFlashcard = {
      id: 'custom_1',
      kanji: '水',
      hiragana: 'みず',
      romaji: 'mizu',
      meaning: 'vatten',
      source: 'iPhone',
      createdAt: 1000
    };

    const cloudCard: CustomFlashcard = {
      id: 'custom_2',
      kanji: '火',
      hiragana: 'ひ',
      romaji: 'hi',
      meaning: 'eld',
      source: 'Webb',
      createdAt: 2000
    };

    const localStats: UserStats = {
      ...service.getStats(),
      customCards: [localCard],
      customCardProgress: {
        custom_1: {
          cardIndex: 0,
          easeFactor: 2.5,
          interval: 1,
          repetitions: 1,
          nextReviewDate: Date.now() + 86400000,
          status: 'learning',
          consecutiveCorrect: 1,
          totalReviews: 1,
          totalErrors: 0,
          lapses: 0
        }
      }
    };

    const cloudStats: UserStats = {
      ...service.getStats(),
      customCards: [cloudCard],
      customCardProgress: {
        custom_2: {
          cardIndex: 0,
          easeFactor: 2.5,
          interval: 3,
          repetitions: 2,
          nextReviewDate: Date.now() + 259200000,
          status: 'review',
          consecutiveCorrect: 2,
          totalReviews: 2,
          totalErrors: 0,
          lapses: 0
        }
      }
    };

    const merged = mergeUserStats(localStats, cloudStats);
    expect(merged.customCards?.length).toBe(2);
    expect(merged.customCards?.map(c => c.id)).toContain('custom_1');
    expect(merged.customCards?.map(c => c.id)).toContain('custom_2');
    expect(merged.customCardProgress?.custom_1).toBeDefined();
    expect(merged.customCardProgress?.custom_2).toBeDefined();
  });
});
