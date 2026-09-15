import { describe, it, expect } from 'vitest';
import {
  getActiveTabFromPath,
  TAB_ROUTES,
  calculateVisibleNavCount,
  getInitialVisibleNavCount
} from '../navigation';

describe('Navbar routing helpers', () => {
  it('correctly maps URL paths to active tabs', () => {
    expect(getActiveTabFromPath('/')).toBe('home');
    expect(getActiveTabFromPath('/learn')).toBe('learning');
    expect(getActiveTabFromPath('/exam')).toBe('exam');
    expect(getActiveTabFromPath('/chart')).toBe('chart');
    expect(getActiveTabFromPath('/flashcards')).toBe('anki');
    expect(getActiveTabFromPath('/srs')).toBe('anki');
    expect(getActiveTabFromPath('/game')).toBe('game');
    expect(getActiveTabFromPath('/practice')).toBe('practice');
    expect(getActiveTabFromPath('/pronunciation')).toBe('pronunciation');
    expect(getActiveTabFromPath('/experimental')).toBe('experimental');
    expect(getActiveTabFromPath('/guide')).toBe('guide');
    expect(getActiveTabFromPath('/grammar')).toBe('grammar');
    expect(getActiveTabFromPath('/unknown-path')).toBe('home');
  });

  it('correctly maps active tabs to destination paths', () => {
    expect(TAB_ROUTES.home).toBe('/');
    expect(TAB_ROUTES.learning).toBe('/learn');
    expect(TAB_ROUTES.exam).toBe('/exam');
    expect(TAB_ROUTES.chart).toBe('/chart');
    expect(TAB_ROUTES.srs).toBe('/flashcards?category=kana');
    expect(TAB_ROUTES.game).toBe('/game');
    expect(TAB_ROUTES.practice).toBe('/practice');
    expect(TAB_ROUTES.pronunciation).toBe('/pronunciation');
    expect(TAB_ROUTES.experimental).toBe('/experimental');
    expect(TAB_ROUTES.guide).toBe('/guide');
    expect(TAB_ROUTES.anki).toBe('/flashcards');
    expect(TAB_ROUTES.grammar).toBe('/grammar');
  });
});

describe('Navbar responsive priority navigation', () => {
  const itemWidths = [90, 85, 110, 70, 95, 130, 105, 135, 100, 105, 120]; // 11 items
  const totalItemsCount = 11;
  const moreButtonWidth = 80;
  const gap = 8;

  it('shows all 11 items and no Mer button when screen has plenty of real estate', () => {
    // Total needed is ~1145px + 80px gap = ~1225px
    const count = calculateVisibleNavCount({
      totalItemsCount,
      navWidth: 1400, // Wide screen / desktop
      itemWidths,
      moreButtonWidth,
      gap,
      minCount: 4
    });

    expect(count).toBe(11);
  });

  it('calculates partial items and reserves space for Mer button when space is constrained', () => {
    // With 700px available, not all 11 items fit
    const count = calculateVisibleNavCount({
      totalItemsCount,
      navWidth: 700,
      itemWidths,
      moreButtonWidth,
      gap,
      minCount: 4
    });

    // Should fit more than 4 items but less than 11
    expect(count).toBeGreaterThanOrEqual(4);
    expect(count).toBeLessThan(11);
  });

  it('respects minCount on small screens (mobile)', () => {
    const count = calculateVisibleNavCount({
      totalItemsCount,
      navWidth: 360,
      itemWidths,
      moreButtonWidth,
      gap: 4,
      minCount: 4
    });

    expect(count).toBe(4);
  });

  it('provides sensible initial visible counts based on screen width', () => {
    expect(getInitialVisibleNavCount(1920, 11)).toBe(11); // Full desktop (no Mer needed)
    expect(getInitialVisibleNavCount(1280, 11)).toBe(11); // XL desktop
    expect(getInitialVisibleNavCount(1024, 11)).toBe(8);  // Large tablet/laptop
    expect(getInitialVisibleNavCount(768, 11)).toBe(6);   // Tablet
    expect(getInitialVisibleNavCount(375, 11)).toBe(4);   // Mobile phone
  });
});

