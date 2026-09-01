/**
 * Audio & Speech Module Index
 * 
 * Central export point for all audio capabilities:
 * - Domain Types
 * - Hardware Ports & Adapters
 * - Procedural SFX & Speech Engines
 * - Phonetic Matcher
 * - React Context & Hooks
 */

// Domain Types
export type {
  SfxEffect,
  SfxOptions,
  SpeechSynthesisOptions,
  SpeechRecognitionRequest,
  SpeechRecognitionResult,
  SpeechRecognitionError,
  SpeechRecognitionErrorType,
  AudioSettings,
  AudioSpeechService
} from './types';

// Ports & Adapters
export type { AudioSpeechPort } from './adapters/audioPort';
export { WebAudioSpeechAdapter, webAudioSpeechAdapter } from './adapters/webAudioSpeechAdapter';
export { MockAudioSpeechAdapter } from './adapters/mockAudioSpeechAdapter';

// Engines
export { SfxEngine } from './engines/sfxEngine';
export { SpeechSynthesisEngine } from './engines/speechSynthesisEngine';
export { SpeechRecognitionEngine } from './engines/speechRecognitionEngine';

// Phonetic Matcher Utilities
export {
  checkPhoneticMatch,
  katakanaToHiragana,
  normalizeRomaji,
  normalizeTranscript,
  stripPunctuationAndWhitespace
} from './utils/phoneticMatcher';
export type { MatchResult } from './utils/phoneticMatcher';

// React Context & Hooks
export { AudioProvider, useAudio } from './react/AudioContext';
export type { AudioContextValue, AudioProviderProps } from './react/AudioContext';
export { usePronunciation } from './react/usePronunciation';
export type { PronunciationFeedback, UsePronunciationReturn } from './react/usePronunciation';
