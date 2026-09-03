import { describe, expect, it, vi } from 'vitest';
import { getDashboardRecommendation, navigateFromDashboard } from '../dashboardLogic';

describe('HeroDashboard recommendation', () => {
  it('starts a new learner on the next lesson even when new SRS cards exist', () => {
    const recommendation = getDashboardRecommendation({
      completedLessons: 0,
      totalLessons: 10,
      dueReviews: 85,
      nextLessonTitle: 'Kapitel 1: Vokalerna',
      scriptName: 'hiragana'
    });

    expect(recommendation.tab).toBe('learning');
    expect(recommendation.actionLabel).toBe('Starta första lektionen');
  });

  it('prioritizes learned cards that are due for review', () => {
    const recommendation = getDashboardRecommendation({
      completedLessons: 2,
      totalLessons: 10,
      dueReviews: 4,
      nextLessonTitle: 'Kapitel 3',
      scriptName: 'hiragana'
    });

    expect(recommendation.tab).toBe('srs');
    expect(recommendation.title).toBe('Repetera 4 kort');
  });
});

describe('HeroDashboard navigation', () => {
  it('uses the supplied navigation callback exactly once', () => {
    const onNavigate = vi.fn();
    const navigate = vi.fn();

    navigateFromDashboard('learning', onNavigate, navigate);

    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledWith('learning');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('falls back to the matching route when no callback is supplied', () => {
    const navigate = vi.fn();

    navigateFromDashboard('guide', undefined, navigate);

    expect(navigate).toHaveBeenCalledWith('/guide');
  });
});
