import type { KanaCharacter } from '../../types/kana';

export type GameMode = 'rush' | 'zen';

export type GameStatus = 
  | 'station_select'
  | 'playing'
  | 'station_cleared'
  | 'gameover';

export interface StationConfig {
  id: number;
  nameJp: string;
  nameKanji: string;
  nameRomaji: string;
  nameSv: string;
  line: string;
  nextStationKanji: string;
  nextStationRomaji: string;
  prevStationKanji: string;
  prevStationRomaji: string;
  trainName: string;
  trainCode: string;
  trainModel: string;
  themeGradient: string;
  accentColor: string;
  badgeBg: string;
  liveryColor: string; // Shinkansen stripe color
  doorTrimColor: string;
  description: string;
  learningFocus: string;
  kanaIds: string[];
  twinPairs?: [string, string][]; // Pairs of commonly confused kana for tricky distractors
  baseTimeSeconds: number;
  passengersTarget: number;
  allowWords?: boolean;
}

export interface MnemonicPersona {
  emoji: string;
  nameSv: string;
  cueSv: string;
  quoteHappy: string;
  quoteStress: string;
}

export interface PassengerPersona {
  id: string;
  name: string;
  titleSv: string;
  avatar: string;
  happyQuote: string;
  stressQuote: string;
}

export interface TrackData {
  trackNumber: 1 | 2 | 3;
  kana: string;
  id: string;
  isCorrect: boolean;
}

export interface PassengerTask {
  id: string;
  isWord: boolean;
  ticketDisplay: string; // Romaji text on ticket, e.g. "TSU" or "SUSHI"
  ticketMeaningSv?: string; // e.g. "✋ Hand (Te)" or "🍣 Sushi"
  correctKana: string; // "つ" or "すし"
  correctId: string;
  characterInfo?: KanaCharacter;
  tracks: TrackData[];
  persona: PassengerPersona;
  timeLimitMs: number;
}

export interface ShinkansenState {
  status: GameStatus;
  mode: GameMode;
  currentStationIndex: number;
  currentStation: StationConfig;
  score: number;
  combo: number;
  maxCombo: number;
  lives: number;
  maxLives: number;
  passengersServed: number;
  stationPassengersServed: number;
  correctCount: number;
  totalAttempts: number;
  sessionXpEarned: number;
  currentTask: PassengerTask | null;
  timeRemainingMs: number;
  selectedTrack: 1 | 2 | 3 | null;
  feedback: 'correct' | 'wrong' | 'timeout' | null;
  feedbackInfo: { kana: string; romaji: string } | null;
  departingTrack: number | null;
  upcomingQueue: PassengerPersona[];
}

export type GameEvent =
  | {
      type: 'CORRECT_SELECTION';
      trackNumber: 1 | 2 | 3;
      combo: number;
      pointsEarned: number;
      earnedXp: number;
      correctKana: string;
      ticketDisplay: string;
      isMilestoneCombo: boolean;
    }
  | {
      type: 'WRONG_SELECTION';
      trackNumber: 1 | 2 | 3;
      correctKana: string;
      ticketDisplay: string;
      livesRemaining: number;
    }
  | {
      type: 'TIMEOUT';
      correctKana: string;
      ticketDisplay: string;
      livesRemaining: number;
    }
  | {
      type: 'DOOR_CLOSING_WARNING';
      timeRemainingMs: number;
    }
  | {
      type: 'STATION_CLEARED';
      station: StationConfig;
      finalScore: number;
      maxCombo: number;
      totalPassengers: number;
      earnedXp: number;
      isFinalStation: boolean;
    }
  | {
      type: 'GAME_OVER';
      station: StationConfig;
      score: number;
      maxCombo: number;
      passengersServed: number;
    }
  | {
      type: 'TASK_SPAWNED';
      task: PassengerTask;
    };
