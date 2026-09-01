import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShinkansenEngine } from '../ShinkansenEngine';
import { SHINKANSEN_STATIONS } from '../stations';
import { generatePassengerTask } from '../distractors';
import type { GameEvent } from '../types';

describe('ShinkansenEngine', () => {
  let engine: ShinkansenEngine;

  beforeEach(() => {
    engine = new ShinkansenEngine({ initialStationIndex: 0, mode: 'rush' });
  });

  describe('Initial State', () => {
    it('initializes with default station_select state', () => {
      const state = engine.getState();
      expect(state.status).toBe('station_select');
      expect(state.currentStationIndex).toBe(0);
      expect(state.currentStation.nameKanji).toBe('東京');
      expect(state.score).toBe(0);
      expect(state.combo).toBe(0);
      expect(state.lives).toBe(3);
      expect(state.currentTask).toBeNull();
    });
  });

  describe('Game Lifecycle & Spawning', () => {
    it('starts playing at selected station and spawns a valid task', () => {
      const events: GameEvent[] = [];
      engine.onEvent((e) => events.push(e));

      engine.startStation(1, 'rush'); // Nagoya
      const state = engine.getState();

      expect(state.status).toBe('playing');
      expect(state.currentStationIndex).toBe(1);
      expect(state.currentStation.nameRomaji).toBe('Nagoya');
      expect(state.currentTask).not.toBeNull();
      expect(state.currentTask?.tracks.length).toBe(3);
      expect(state.currentTask?.tracks.filter(t => t.isCorrect).length).toBe(1);

      expect(events).toContainEqual(
        expect.objectContaining({ type: 'TASK_SPAWNED' })
      );
    });
  });

  describe('Track Selection & Scoring', () => {
    it('increases score and combo on correct track selection', () => {
      const events: GameEvent[] = [];
      engine.onEvent((e) => events.push(e));

      engine.startStation(0, 'rush');
      const task = engine.getState().currentTask!;
      const correctTrack = task.tracks.find(t => t.isCorrect)!;

      const result = engine.selectTrack(correctTrack.trackNumber);
      expect(result).toBe(true);

      const state = engine.getState();
      expect(state.score).toBeGreaterThan(0);
      expect(state.combo).toBe(1);
      expect(state.maxCombo).toBe(1);
      expect(state.correctCount).toBe(1);
      expect(state.passengersServed).toBe(1);
      expect(state.feedback).toBe('correct');

      expect(events).toContainEqual(
        expect.objectContaining({
          type: 'CORRECT_SELECTION',
          trackNumber: correctTrack.trackNumber,
          combo: 1
        })
      );
    });

    it('resets combo and decreases lives on wrong track selection in rush mode', () => {
      const events: GameEvent[] = [];
      engine.onEvent((e) => events.push(e));

      engine.startStation(0, 'rush');
      const task = engine.getState().currentTask!;
      const wrongTrack = task.tracks.find(t => !t.isCorrect)!;

      const result = engine.selectTrack(wrongTrack.trackNumber);
      expect(result).toBe(false);

      const state = engine.getState();
      expect(state.combo).toBe(0);
      expect(state.lives).toBe(2);
      expect(state.feedback).toBe('wrong');

      expect(events).toContainEqual(
        expect.objectContaining({
          type: 'WRONG_SELECTION',
          trackNumber: wrongTrack.trackNumber,
          livesRemaining: 2
        })
      );
    });

    it('triggers game over when lives reach 0', () => {
      const events: GameEvent[] = [];
      engine.onEvent((e) => events.push(e));

      engine.startStation(0, 'rush');

      // 3 wrong answers
      for (let i = 0; i < 3; i++) {
        const task = engine.getState().currentTask!;
        const wrongTrack = task.tracks.find(t => !t.isCorrect)!;
        engine.selectTrack(wrongTrack.trackNumber);
        if (i < 2) {
          engine.nextPassenger();
        }
      }

      const state = engine.getState();
      expect(state.lives).toBe(0);
      expect(state.status).toBe('gameover');

      expect(events).toContainEqual(
        expect.objectContaining({
          type: 'GAME_OVER'
        })
      );
    });
  });

  describe('Timer & Tick Mechanics', () => {
    it('decreases remaining time on tick and emits door closing warning', () => {
      const events: GameEvent[] = [];
      engine.onEvent((e) => events.push(e));

      engine.startStation(0, 'rush');
      const initialTime = engine.getState().timeRemainingMs;

      // Tick 1000ms
      engine.tick(1000);
      expect(engine.getState().timeRemainingMs).toBe(initialTime - 1000);

      // Fast forward to < 35% time
      const almostOutTime = initialTime * 0.7;
      engine.tick(almostOutTime);

      expect(events).toContainEqual(
        expect.objectContaining({
          type: 'DOOR_CLOSING_WARNING'
        })
      );
    });

    it('triggers timeout when timer runs out', () => {
      const events: GameEvent[] = [];
      engine.onEvent((e) => events.push(e));

      engine.startStation(0, 'rush');
      const totalTime = engine.getState().timeRemainingMs;

      engine.tick(totalTime + 100);

      const state = engine.getState();
      expect(state.feedback).toBe('timeout');
      expect(state.lives).toBe(2);
      expect(state.combo).toBe(0);

      expect(events).toContainEqual(
        expect.objectContaining({
          type: 'TIMEOUT',
          livesRemaining: 2
        })
      );
    });
  });

  describe('Zen Mode Mechanics', () => {
    it('does not lose lives on wrong answers or timeouts in zen mode', () => {
      const zenEngine = new ShinkansenEngine({ mode: 'zen' });
      zenEngine.startStation(0, 'zen');

      const task = zenEngine.getState().currentTask!;
      const wrongTrack = task.tracks.find(t => !t.isCorrect)!;

      zenEngine.selectTrack(wrongTrack.trackNumber);
      expect(zenEngine.getState().lives).toBe(99);
      expect(zenEngine.getState().status).toBe('playing');

      zenEngine.nextPassenger();
      zenEngine.tick(20000); // Trigger timeout
      expect(zenEngine.getState().lives).toBe(99);
      expect(zenEngine.getState().status).not.toBe('gameover');
    });
  });

  describe('Station Progression & Clearance', () => {
    it('detects when station passenger goal is reached and completes station', () => {
      const events: GameEvent[] = [];
      engine.onEvent((e) => events.push(e));

      engine.startStation(0, 'rush');
      const target = engine.getState().currentStation.passengersTarget;

      for (let i = 0; i < target; i++) {
        const task = engine.getState().currentTask!;
        const correctTrack = task.tracks.find(t => t.isCorrect)!;
        engine.selectTrack(correctTrack.trackNumber);
        if (i < target - 1) {
          engine.nextPassenger();
        }
      }

      expect(engine.isStationGoalReached()).toBe(true);

      engine.completeStation();
      expect(engine.getState().status).toBe('station_cleared');

      expect(events).toContainEqual(
        expect.objectContaining({
          type: 'STATION_CLEARED',
          station: expect.objectContaining({ id: 1 })
        })
      );

      // Advance to next station
      engine.advanceStation();
      expect(engine.getState().currentStationIndex).toBe(1);
      expect(engine.getState().status).toBe('playing');
    });
  });

  describe('Distractor & Twin Pair Logic', () => {
    it('generates twin pair distractor when configured for station', () => {
      const nagoyaStation = SHINKANSEN_STATIONS[1]; // Nagoya has twin pairs shi/tsu, chi/sa
      const task = generatePassengerTask(nagoyaStation, {
        forceKanaId: 'shi',
        forceIsWord: false
      });

      expect(task.correctKana).toBe('し');
      const trackKanas = task.tracks.map(t => t.kana);
      expect(trackKanas).toContain('し'); // correct
      expect(trackKanas).toContain('つ'); // twin distractor!
    });
  });
});
