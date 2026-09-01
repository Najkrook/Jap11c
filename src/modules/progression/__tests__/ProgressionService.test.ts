import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressionServiceImpl } from '../ProgressionServiceImpl';
import { InMemoryStorageAdapter } from '../storage/InMemoryStorageAdapter';

describe('ProgressionService', () => {
  let storage: InMemoryStorageAdapter;
  let service: ProgressionServiceImpl;

  beforeEach(() => {
    storage = new InMemoryStorageAdapter();
    service = new ProgressionServiceImpl(storage);
  });

  it('initializes default stats correctly', () => {
    const stats = service.getStats();
    expect(stats.xp).toBe(0);
    expect(stats.level).toBe(1);
    expect(stats.streakDays).toBe(1);
    expect(Object.keys(stats.kanaProgress).length).toBeGreaterThan(0);
  });

  it('awards XP on SRS review', () => {
    const res1 = service.recordActivity({ type: 'srs_review', kanaId: 'a', rating: 'good' });
    expect(res1.earnedXp).toBe(15);
    expect(res1.newXp).toBe(15);
    expect(res1.leveledUp).toBe(false);
  });

  it('calculates level ups deterministically', () => {
    service.recordActivity({ type: 'srs_review', kanaId: 'i', rating: 'easy' }); // +25 -> 25 XP
    service.recordActivity({ type: 'srs_review', kanaId: 'a', rating: 'good' }); // +15 -> 40 XP
    const resLevelUp = service.recordActivity({ type: 'srs_review', kanaId: 'u', rating: 'good' }); // +15 -> 55 XP (Level 2 threshold is 50 XP)

    expect(resLevelUp.newXp).toBe(55);
    expect(resLevelUp.newLevel).toBe(2);
    expect(resLevelUp.leveledUp).toBe(true);
  });

  it('automatically unlocks badges like first_five', () => {
    service.recordActivity({ type: 'srs_review', kanaId: 'a', rating: 'good' });
    service.recordActivity({ type: 'srs_review', kanaId: 'i', rating: 'good' });
    service.recordActivity({ type: 'srs_review', kanaId: 'u', rating: 'good' });
    service.recordActivity({ type: 'srs_review', kanaId: 'e', rating: 'good' });
    const resVowels = service.recordActivity({ type: 'srs_review', kanaId: 'o', rating: 'good' });

    const firstFive = resVowels.newlyUnlockedBadges.find(b => b.id === 'first_five');
    expect(firstFive).toBeDefined();
  });

  it('records game activity and updates high scores and combo badges', () => {
    const resGame = service.recordActivity({
      type: 'game_finished',
      gameId: 'shinkansenRush',
      score: 1500,
      maxCombo: 18
    });

    expect(resGame.isNewHighScore).toBe(true);
    expect(resGame.currentStats.highScores.shinkansenRush).toBe(1500);

    const gameMasterBadge = resGame.newlyUnlockedBadges.find(b => b.id === 'game_master_1000');
    const comboKingBadge = resGame.newlyUnlockedBadges.find(b => b.id === 'combo_king');
    expect(gameMasterBadge).toBeDefined();
    expect(comboKingBadge).toBeDefined();
  });

  it('persists data and reloads cleanly from StorageAdapter', () => {
    service.recordActivity({ type: 'srs_review', kanaId: 'ka', rating: 'good' });
    const exported = service.exportData();

    const newStorage = new InMemoryStorageAdapter();
    const newService = new ProgressionServiceImpl(newStorage);
    const imported = newService.importData(exported);

    expect(imported).toBe(true);
    expect(newService.getStats().kanaProgress['ka'].status).not.toBe('new');
  });

  it('computes progression summary correctly', () => {
    const summary = service.getSummary();
    expect(summary.currentLevel).toBe(1);
    expect(summary.totalMasteredKana).toBe(0);
    expect(summary.currentStreak).toBe(1);
  });
});
