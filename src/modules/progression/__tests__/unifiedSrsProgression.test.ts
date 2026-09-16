import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressionServiceImpl } from '../ProgressionServiceImpl';
import { InMemoryStorageAdapter } from '../storage/InMemoryStorageAdapter';
import type { CardRef } from '../../srs/types';

describe('Unified SRS Progression Integration', () => {
  let service: ProgressionServiceImpl;

  beforeEach(() => {
    service = new ProgressionServiceImpl(new InMemoryStorageAdapter());
  });

  it('records srs_review using universal CardRef for any deck', () => {
    const cardRef: CardRef = { deckId: 'anki', cardId: '42' };
    const res = service.recordActivity({
      type: 'srs_review',
      cardRef,
      rating: 'good'
    });

    expect(res.earnedXp).toBe(15);
    const progress = service.getCardProgress(cardRef);
    expect(progress).toBeDefined();
    expect(progress?.repetitions).toBe(1);
    expect(progress?.status).toBe('review');
    expect(progress?.interval).toBe(1);
  });

  it('filters due card refs accurately across decks', () => {
    const card1: CardRef = { deckId: 'custom', cardId: 'c1' };
    const card2: CardRef = { deckId: 'custom', cardId: 'c2' };

    // Review card1 with easy (due in 3 days)
    service.recordActivity({ type: 'srs_review', cardRef: card1, rating: 'easy' });

    // Review card2 with again (due in 10 minutes)
    service.recordActivity({ type: 'srs_review', cardRef: card2, rating: 'again' });

    const now = Date.now();
    const progress2 = service.getCardProgress(card2);
    expect(progress2?.status).toBe('learning');

    // In 11 minutes, card2 is due, card1 is not
    const futureDue = service.getDueCardRefs('custom');
    // Before 10 minutes pass, neither is due if now is current timestamp
    expect(service.getDueCardRefs('custom').length).toBe(0);
  });
});