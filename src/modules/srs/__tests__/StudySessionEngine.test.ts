import { describe, it, expect, vi } from 'vitest';
import { StudySessionEngine } from '../StudySessionEngine';

interface MockCard {
  id: string;
  front: string;
}

describe('StudySessionEngine', () => {
  const mockCards: MockCard[] = [
    { id: '1', front: 'A' },
    { id: '2', front: 'B' },
    { id: '3', front: 'C' }
  ];

  it('initializes in un-flipped state with first card active', () => {
    const engine = new StudySessionEngine({ initialCards: mockCards });
    const state = engine.getState();

    expect(state.currentIndex).toBe(0);
    expect(state.currentCard).toEqual(mockCards[0]);
    expect(state.isFlipped).toBe(false);
    expect(state.isCompleted).toBe(false);
    expect(state.totalCards).toBe(3);
    expect(state.queueLength).toBe(3);
  });

  it('toggles card flip state', () => {
    const engine = new StudySessionEngine({ initialCards: mockCards });
    expect(engine.getState().isFlipped).toBe(false);

    engine.flip();
    expect(engine.getState().isFlipped).toBe(true);

    engine.flip();
    expect(engine.getState().isFlipped).toBe(false);
  });

  it('advances on successful rating without reinsertion', () => {
    const onCardReviewed = vi.fn();
    const engine = new StudySessionEngine({
      initialCards: mockCards,
      onCardReviewed
    });

    const res = engine.rateCurrent('good');
    expect(res?.earnedXp).toBe(15);
    expect(onCardReviewed).toHaveBeenCalledWith(mockCards[0], 'good', 15);

    const state = engine.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.currentCard).toEqual(mockCards[1]);
    expect(state.isFlipped).toBe(false);
    expect(state.queueLength).toBe(3);
    expect(state.stats.good).toBe(1);
    expect(state.stats.reviewed).toBe(1);
    expect(state.stats.xpEarned).toBe(15);
  });

  it('reinserts failed card at end of queue when rated "again"', () => {
    const engine = new StudySessionEngine({ initialCards: mockCards });

    engine.rateCurrent('again');

    const state = engine.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.currentCard).toEqual(mockCards[1]);
    expect(state.queueLength).toBe(4); // 3 original + 1 reinserted
    expect(state.retryCount).toBe(1);
    expect(state.stats.again).toBe(1);
  });

  it('emits onCompleted callback once the final card in queue is rated', () => {
    const onCompleted = vi.fn();
    const engine = new StudySessionEngine({
      initialCards: [{ id: '1', front: 'Only' }],
      onCompleted
    });

    engine.rateCurrent('easy');

    const state = engine.getState();
    expect(state.isCompleted).toBe(true);
    expect(state.currentCard).toBeNull();
    expect(onCompleted).toHaveBeenCalledWith(expect.objectContaining({
      reviewed: 1,
      easy: 1,
      xpEarned: 25
    }));
  });

  it('handles restart correctly back to initial queue', () => {
    const engine = new StudySessionEngine({ initialCards: mockCards });
    engine.rateCurrent('again');
    engine.rateCurrent('good');

    expect(engine.getState().currentIndex).toBe(2);

    engine.restart();
    const state = engine.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.currentCard).toEqual(mockCards[0]);
    expect(state.queueLength).toBe(3);
    expect(state.retryCount).toBe(0);
    expect(state.stats.reviewed).toBe(0);
  });
});