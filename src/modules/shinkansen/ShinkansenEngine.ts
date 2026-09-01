import type {
  GameMode,
  GameStatus,
  StationConfig,
  ShinkansenState,
  GameEvent,
  PassengerTask,
  TrackData
} from './types';
import { SHINKANSEN_STATIONS } from './stations';
import { generatePassengerTask, generateUpcomingQueue } from './distractors';

export interface EngineOptions {
  initialStationIndex?: number;
  mode?: GameMode;
  randomFn?: () => number;
}

export class ShinkansenEngine {
  private state: ShinkansenState;
  private stateListeners: Set<(state: Readonly<ShinkansenState>) => void> = new Set();
  private eventListeners: Set<(event: GameEvent) => void> = new Set();
  private doorWarningEmittedForTask: boolean = false;
  private randomFn: () => number;

  constructor(options: EngineOptions = {}) {
    this.randomFn = options.randomFn || Math.random;
    const initialStationIndex = Math.max(0, Math.min(SHINKANSEN_STATIONS.length - 1, options.initialStationIndex ?? 0));
    const mode = options.mode || 'rush';
    const station = SHINKANSEN_STATIONS[initialStationIndex];

    this.state = {
      status: 'station_select',
      mode,
      currentStationIndex: initialStationIndex,
      currentStation: station,
      score: 0,
      combo: 0,
      maxCombo: 0,
      lives: mode === 'rush' ? 3 : 99,
      maxLives: 3,
      passengersServed: 0,
      stationPassengersServed: 0,
      correctCount: 0,
      totalAttempts: 0,
      sessionXpEarned: 0,
      currentTask: null,
      timeRemainingMs: station.baseTimeSeconds * 1000,
      selectedTrack: null,
      feedback: null,
      feedbackInfo: null,
      departingTrack: null,
      upcomingQueue: generateUpcomingQueue(station, 3, this.randomFn)
    };
  }

  public getState(): Readonly<ShinkansenState> {
    return this.state;
  }

  public subscribe(listener: (state: Readonly<ShinkansenState>) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  public onEvent(listener: (event: GameEvent) => void): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  private notifyStateChange(): void {
    const readonlyState = Object.freeze({ ...this.state });
    this.stateListeners.forEach(listener => listener(readonlyState));
  }

  private emitEvent(event: GameEvent): void {
    this.eventListeners.forEach(listener => listener(event));
  }

  /**
   * Starts a new game at the specified station index and mode
   */
  public startStation(stationIndex: number = 0, mode: GameMode = 'rush'): void {
    const validIndex = Math.max(0, Math.min(SHINKANSEN_STATIONS.length - 1, stationIndex));
    const station = SHINKANSEN_STATIONS[validIndex];
    const initialTask = generatePassengerTask(station, { randomFn: this.randomFn });

    this.doorWarningEmittedForTask = false;
    this.state = {
      ...this.state,
      status: 'playing',
      mode,
      currentStationIndex: validIndex,
      currentStation: station,
      score: 0,
      combo: 0,
      maxCombo: 0,
      lives: mode === 'rush' ? 3 : 99,
      maxLives: 3,
      passengersServed: 0,
      stationPassengersServed: 0,
      correctCount: 0,
      totalAttempts: 0,
      sessionXpEarned: 0,
      currentTask: initialTask,
      timeRemainingMs: initialTask.timeLimitMs,
      selectedTrack: null,
      feedback: null,
      feedbackInfo: null,
      departingTrack: null,
      upcomingQueue: generateUpcomingQueue(station, 3, this.randomFn)
    };

    this.notifyStateChange();
    this.emitEvent({ type: 'TASK_SPAWNED', task: initialTask });
  }

  /**
   * Game timer tick
   */
  public tick(deltaMs: number): void {
    if (this.state.status !== 'playing' || !this.state.currentTask || this.state.feedback !== null) {
      return;
    }

    const actualDelta = this.state.mode === 'zen' ? deltaMs * 0.6 : deltaMs;
    const nextTime = Math.max(0, this.state.timeRemainingMs - actualDelta);
    const timeRatio = nextTime / this.state.currentTask.timeLimitMs;

    // Check door warning threshold (< 35% time left)
    if (timeRatio < 0.35 && !this.doorWarningEmittedForTask) {
      this.doorWarningEmittedForTask = true;
      this.emitEvent({
        type: 'DOOR_CLOSING_WARNING',
        timeRemainingMs: nextTime
      });
    }

    if (nextTime <= 0) {
      this.handleTimeout();
      return;
    }

    this.state = {
      ...this.state,
      timeRemainingMs: nextTime
    };
    this.notifyStateChange();
  }

  /**
   * Internal timeout handler when timer reaches 0
   */
  private handleTimeout(): void {
    const task = this.state.currentTask;
    if (!task) return;

    const nextAttempts = this.state.totalAttempts + 1;
    let nextLives = this.state.lives;
    let isGameOver = false;

    if (this.state.mode === 'rush') {
      nextLives = Math.max(0, this.state.lives - 1);
      if (nextLives <= 0) {
        isGameOver = true;
      }
    }

    this.state = {
      ...this.state,
      timeRemainingMs: 0,
      combo: 0,
      totalAttempts: nextAttempts,
      lives: nextLives,
      feedback: 'timeout',
      feedbackInfo: {
        kana: task.correctKana,
        romaji: task.ticketDisplay
      },
      status: isGameOver ? 'gameover' : this.state.status
    };

    this.notifyStateChange();

    this.emitEvent({
      type: 'TIMEOUT',
      correctKana: task.correctKana,
      ticketDisplay: task.ticketDisplay,
      livesRemaining: nextLives
    });

    if (isGameOver) {
      this.emitEvent({
        type: 'GAME_OVER',
        station: this.state.currentStation,
        score: this.state.score,
        maxCombo: this.state.maxCombo,
        passengersServed: this.state.passengersServed
      });
    }
  }

  /**
   * Action: player chooses track 1, 2, or 3
   */
  public selectTrack(trackNumber: 1 | 2 | 3): boolean {
    if (this.state.status !== 'playing' || !this.state.currentTask || this.state.feedback !== null) {
      return false;
    }

    const task = this.state.currentTask;
    const chosenTrack = task.tracks.find(t => t.trackNumber === trackNumber);
    if (!chosenTrack) return false;

    const isCorrect = chosenTrack.isCorrect;
    const nextAttempts = this.state.totalAttempts + 1;

    if (isCorrect) {
      const nextCombo = this.state.combo + 1;
      const nextMaxCombo = Math.max(this.state.maxCombo, nextCombo);
      const nextCorrectCount = this.state.correctCount + 1;
      const nextPassengers = this.state.passengersServed + 1;
      const nextStationPassengers = this.state.stationPassengersServed + 1;

      // Speed bonus & combo multiplier calculation
      const speedRatio = Math.max(0, this.state.timeRemainingMs / task.timeLimitMs);
      const speedBonus = Math.round(speedRatio * 50);
      const comboMultiplier = 1 + Math.min(nextCombo * 0.2, 2.5);
      const pointsEarned = Math.round((100 + speedBonus) * comboMultiplier);
      const nextScore = this.state.score + pointsEarned;
      const earnedXp = Math.round(pointsEarned * 0.12);
      const nextSessionXp = this.state.sessionXpEarned + earnedXp;

      this.state = {
        ...this.state,
        score: nextScore,
        combo: nextCombo,
        maxCombo: nextMaxCombo,
        correctCount: nextCorrectCount,
        passengersServed: nextPassengers,
        stationPassengersServed: nextStationPassengers,
        totalAttempts: nextAttempts,
        sessionXpEarned: nextSessionXp,
        selectedTrack: trackNumber,
        departingTrack: trackNumber,
        feedback: 'correct',
        feedbackInfo: {
          kana: task.correctKana,
          romaji: task.ticketDisplay
        }
      };

      this.notifyStateChange();

      this.emitEvent({
        type: 'CORRECT_SELECTION',
        trackNumber,
        combo: nextCombo,
        pointsEarned,
        earnedXp,
        correctKana: task.correctKana,
        ticketDisplay: task.ticketDisplay,
        isMilestoneCombo: nextCombo > 0 && nextCombo % 5 === 0
      });

      return true;
    } else {
      // Wrong choice
      let nextLives = this.state.lives;
      let isGameOver = false;

      if (this.state.mode === 'rush') {
        nextLives = Math.max(0, this.state.lives - 1);
        if (nextLives <= 0) {
          isGameOver = true;
        }
      }

      this.state = {
        ...this.state,
        combo: 0,
        lives: nextLives,
        totalAttempts: nextAttempts,
        selectedTrack: trackNumber,
        feedback: 'wrong',
        feedbackInfo: {
          kana: task.correctKana,
          romaji: task.ticketDisplay
        },
        status: isGameOver ? 'gameover' : this.state.status
      };

      this.notifyStateChange();

      this.emitEvent({
        type: 'WRONG_SELECTION',
        trackNumber,
        correctKana: task.correctKana,
        ticketDisplay: task.ticketDisplay,
        livesRemaining: nextLives
      });

      if (isGameOver) {
        this.emitEvent({
          type: 'GAME_OVER',
          station: this.state.currentStation,
          score: this.state.score,
          maxCombo: this.state.maxCombo,
          passengersServed: this.state.passengersServed
        });
      }

      return false;
    }
  }

  /**
   * Check if station clearance condition is satisfied
   */
  public isStationGoalReached(): boolean {
    return (
      this.state.mode === 'rush' &&
      this.state.stationPassengersServed >= this.state.currentStation.passengersTarget
    );
  }

  /**
   * Transitions state to station_cleared
   */
  public completeStation(): void {
    const isFinalStation = this.state.currentStationIndex === SHINKANSEN_STATIONS.length - 1;
    this.state = {
      ...this.state,
      status: 'station_cleared',
      feedback: null,
      feedbackInfo: null,
      selectedTrack: null,
      departingTrack: null
    };

    this.notifyStateChange();

    this.emitEvent({
      type: 'STATION_CLEARED',
      station: this.state.currentStation,
      finalScore: this.state.score,
      maxCombo: this.state.maxCombo,
      totalPassengers: this.state.passengersServed,
      earnedXp: this.state.sessionXpEarned,
      isFinalStation
    });
  }

  /**
   * Advances to next passenger within current station
   */
  public nextPassenger(): void {
    if (this.state.status !== 'playing') return;

    const station = this.state.currentStation;
    const task = generatePassengerTask(station, { randomFn: this.randomFn });
    this.doorWarningEmittedForTask = false;

    this.state = {
      ...this.state,
      currentTask: task,
      timeRemainingMs: task.timeLimitMs,
      selectedTrack: null,
      feedback: null,
      feedbackInfo: null,
      departingTrack: null,
      upcomingQueue: generateUpcomingQueue(station, 3, this.randomFn)
    };

    this.notifyStateChange();
    this.emitEvent({ type: 'TASK_SPAWNED', task });
  }

  /**
   * Advances station to next progressive stop
   */
  public advanceStation(): void {
    const nextIdx = this.state.currentStationIndex + 1;
    if (nextIdx < SHINKANSEN_STATIONS.length) {
      this.startStation(nextIdx, this.state.mode);
    } else {
      this.startStation(0, this.state.mode);
    }
  }

  /**
   * Return to station map selector
   */
  public returnToStationSelect(): void {
    this.state = {
      ...this.state,
      status: 'station_select',
      feedback: null,
      feedbackInfo: null,
      selectedTrack: null,
      departingTrack: null
    };
    this.notifyStateChange();
  }
}
