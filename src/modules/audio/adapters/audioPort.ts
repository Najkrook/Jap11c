/**
 * Audio Port Interface
 * 
 * Hardware-independent port defining audio and speech capabilities.
 * Allows decoupling application domain and React components from Web Audio/Speech APIs.
 */

import type {
  SfxEffect,
  SfxOptions,
  SpeechSynthesisOptions,
  SpeechRecognitionRequest,
  SpeechRecognitionResult,
  AudioSettings
} from '../types';

export interface AudioSpeechPort {
  /** Plays a synthesized game / UI sound effect */
  playSfx(effect: SfxEffect, options?: SfxOptions): void;

  /** Speaks Japanese text */
  speakJapanese(text: string, options?: SpeechSynthesisOptions): Promise<void>;

  /** Stops any currently playing speech */
  stopSpeech(): void;

  /** Listens to speech input from microphone and grades pronunciation */
  listenPronunciation(request: SpeechRecognitionRequest): Promise<SpeechRecognitionResult>;

  /** Stops speech recognition */
  stopListening(): void;

  /** Checks if speech recognition is available */
  isRecognitionSupported(): boolean;

  /** Returns active audio settings */
  getSettings(): Readonly<AudioSettings>;

  /** Updates audio settings */
  updateSettings(partial: Partial<AudioSettings>): void;

  /** Subscribes to settings modifications */
  subscribeSettings(listener: (settings: Readonly<AudioSettings>) => void): () => void;
}
