import { describe, it, expect } from 'vitest';
import { getActiveTabFromPath, TAB_ROUTES } from '../navigation';

describe('Navbar routing helpers', () => {
  it('correctly maps URL paths to active tabs', () => {
    expect(getActiveTabFromPath('/')).toBe('home');
    expect(getActiveTabFromPath('/learn')).toBe('learning');
    expect(getActiveTabFromPath('/exam')).toBe('exam');
    expect(getActiveTabFromPath('/chart')).toBe('chart');
    expect(getActiveTabFromPath('/srs')).toBe('srs');
    expect(getActiveTabFromPath('/game')).toBe('game');
    expect(getActiveTabFromPath('/practice')).toBe('practice');
    expect(getActiveTabFromPath('/pronunciation')).toBe('pronunciation');
    expect(getActiveTabFromPath('/experimental')).toBe('experimental');
    expect(getActiveTabFromPath('/guide')).toBe('guide');
    expect(getActiveTabFromPath('/unknown-path')).toBe('home');
  });

  it('correctly maps active tabs to destination paths', () => {
    expect(TAB_ROUTES.home).toBe('/');
    expect(TAB_ROUTES.learning).toBe('/learn');
    expect(TAB_ROUTES.exam).toBe('/exam');
    expect(TAB_ROUTES.chart).toBe('/chart');
    expect(TAB_ROUTES.srs).toBe('/srs');
    expect(TAB_ROUTES.game).toBe('/game');
    expect(TAB_ROUTES.practice).toBe('/practice');
    expect(TAB_ROUTES.pronunciation).toBe('/pronunciation');
    expect(TAB_ROUTES.experimental).toBe('/experimental');
    expect(TAB_ROUTES.guide).toBe('/guide');
  });
});
