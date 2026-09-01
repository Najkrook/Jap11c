/**
 * Audio & Speech Module - Core Type Definitions
 * 
 * Defines domain types, hardware ports, settings, and service contracts
 * for Web Audio SFX, SpeechSynthesis, and SpeechRecognition in HiraganaSkolan.
 */

export type SfxEffect =
  | 'click'
  | 'correct'
  | 'catch'
  | 'wrong'
  | 'miss'
  | 'levelUp'
  | 'gameOver'
  | 'trainChime'
  | 'trainWhistle'
  | 'doorChime'
  | 'doorPneumatic'
  | 'swordSlash'
  | 'magicCast'
  | 'monsterHit'
  | 'coin'
  | 'heal';

export interface SfxOptions {
  /** Combo streak count used for dynamic pitch escalation */
  combo?: number;
  /** Relative volume modifier (0.0 to 1.0) */
  volume?: number;
}

export interface SpeechSynthesisOptions {
  /** Speaking rate (default 0.9 for crystal clear beginner learning) */
  rate?: number;
  /** Voice pitch multiplier (default 1.0) */
  pitch?: number;
  /** Language tag (default 'ja-JP') */
  lang?: string;
  /** Volume multiplier (0.0 to 1.0) */
  volume?: number;
  /** Preferred voice name or SpeechSynthesisVoice object */
  voice?: SpeechSynthesisVoice | string;
  /** Maximum duration before forced resolution in milliseconds (default 8000ms) */
  timeoutMs?: number;
}

export interface SpeechRecognitionRequest {
  /** Target Japanese Kana character or word (e.g. 'あ', 'ねこ') */
  targetKana: string;
  /** Target Romaji equivalent (e.g. 'a', 'neko') */
  targetRomaji: string;
  /** Language tag (default 'ja-JP') */
  lang?: string;
  /** Maximum listening timeout in milliseconds (default 7000ms) */
  timeoutMs?: number;
}

export type SpeechRecognitionErrorType =
  | 'permission_denied'
  | 'no_speech'
  | 'network_error'
  | 'timeout'
  | 'unsupported'
  | 'aborted'
  | 'unknown';

export interface SpeechRecognitionError {
  type: SpeechRecognitionErrorType;
  message: string;
  originalError?: unknown;
}

export interface SpeechRecognitionResult {
  /** The recognized transcript text */
  transcript: string;
  /** Confidence score between 0.0 and 1.0 */
  confidence: number;
  /** Whether the transcript phonetically matches targetKana or targetRomaji */
  isMatch: boolean;
  /** Expected target kana */
  targetExpected: string;
  /** Alternative recognized transcripts if provided by the engine */
  alternatives?: string[];
}

export interface AudioSettings {
  /** Whether synthesized sound effects are enabled */
  soundEnabled: boolean;
  /** Whether speech synthesis playback is enabled */
  speechEnabled: boolean;
  /** Master volume multiplier for SFX (0.0 to 1.0) */
  sfxVolume: number;
  /** Master volume multiplier for Speech (0.0 to 1.0) */
  speechVolume: number;
  /** Default speech rate for Japanese utterances */
  speechRate: number;
}

/**
 * Deep module interface for Audio & Speech management across HiraganaSkolan.
 */
export interface AudioSpeechService {
  /** Synthesizes and plays a procedural game sound effect */
  playSfx(effect: SfxEffect, options?: SfxOptions): void;

  /** Pronounces Japanese text using SpeechSynthesis (ja-JP) */
  speakJapanese(text: string, options?: SpeechSynthesisOptions): Promise<void>;

  /** Immediately stops any ongoing speech playback */
  stopSpeech(): void;

  /** Listens to user microphone input and scores pronunciation against target kana */
  listenPronunciation(request: SpeechRecognitionRequest): Promise<SpeechRecognitionResult>;

  /** Stops active speech recognition listening */
  stopListening(): void;

  /** Checks if the user's browser supports SpeechRecognition */
  isRecognitionSupported(): boolean;

  /** Gets an immutable snapshot of the current audio settings */
  getSettings(): Readonly<AudioSettings>;

  /** Updates audio settings and persists changes */
  updateSettings(partial: Partial<AudioSettings>): void;

  /** Subscribes to audio settings changes */
  subscribeSettings(listener: (settings: Readonly<AudioSettings>) => void): () => void;
}
