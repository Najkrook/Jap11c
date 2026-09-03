import { createContext, useContext } from 'react';
import type {
  AudioSettings,
  AudioSpeechService,
  SfxEffect,
  SfxOptions,
  SpeechRecognitionRequest,
  SpeechRecognitionResult,
  SpeechSynthesisOptions
} from '../types';

export interface AudioContextValue {
  service: AudioSpeechService;
  settings: Readonly<AudioSettings>;
  soundEnabled: boolean;
  speechEnabled: boolean;
  sfxVolume: number;
  speechVolume: number;
  speechRate: number;
  setSoundEnabled: (enabled: boolean) => void;
  setSpeechEnabled: (enabled: boolean) => void;
  setSfxVolume: (volume: number) => void;
  setSpeechVolume: (volume: number) => void;
  setSpeechRate: (rate: number) => void;
  updateSettings: (partial: Partial<AudioSettings>) => void;
  playSfx: (effect: SfxEffect, options?: SfxOptions) => void;
  speakJapanese: (text: string, options?: SpeechSynthesisOptions) => Promise<void>;
  stopSpeech: () => void;
  listenPronunciation: (request: SpeechRecognitionRequest) => Promise<SpeechRecognitionResult>;
  stopListening: () => void;
  isRecognitionSupported: () => boolean;
}

export const AudioContext = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
