/**
 * Audio & Speech React Context & Provider
 * 
 * Provides reactive access to audio settings, sound effects playback,
 * speech synthesis, and recognition across the React component hierarchy.
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type {
  AudioSpeechService,
  AudioSettings,
  SfxEffect,
  SfxOptions,
  SpeechSynthesisOptions,
  SpeechRecognitionRequest,
  SpeechRecognitionResult
} from '../types';
import { webAudioSpeechAdapter } from '../adapters/webAudioSpeechAdapter';

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

const AudioContext = createContext<AudioContextValue | null>(null);

export interface AudioProviderProps {
  children: React.ReactNode;
  customService?: AudioSpeechService;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  customService
}) => {
  const service = useMemo(() => customService || webAudioSpeechAdapter, [customService]);
  const [settings, setSettings] = useState<Readonly<AudioSettings>>(() => service.getSettings());

  useEffect(() => {
    setSettings(service.getSettings());
    const unsubscribe = service.subscribeSettings((newSettings) => {
      setSettings(newSettings);
    });
    return unsubscribe;
  }, [service]);

  const updateSettings = useCallback(
    (partial: Partial<AudioSettings>) => {
      service.updateSettings(partial);
    },
    [service]
  );

  const setSoundEnabled = useCallback(
    (enabled: boolean) => {
      service.updateSettings({ soundEnabled: enabled });
    },
    [service]
  );

  const setSpeechEnabled = useCallback(
    (enabled: boolean) => {
      service.updateSettings({ speechEnabled: enabled });
    },
    [service]
  );

  const setSfxVolume = useCallback(
    (volume: number) => {
      service.updateSettings({ sfxVolume: volume });
    },
    [service]
  );

  const setSpeechVolume = useCallback(
    (volume: number) => {
      service.updateSettings({ speechVolume: volume });
    },
    [service]
  );

  const setSpeechRate = useCallback(
    (rate: number) => {
      service.updateSettings({ speechRate: rate });
    },
    [service]
  );

  const playSfx = useCallback(
    (effect: SfxEffect, options?: SfxOptions) => {
      service.playSfx(effect, options);
    },
    [service]
  );

  const speakJapanese = useCallback(
    (text: string, options?: SpeechSynthesisOptions) => {
      return service.speakJapanese(text, options);
    },
    [service]
  );

  const stopSpeech = useCallback(() => {
    service.stopSpeech();
  }, [service]);

  const listenPronunciation = useCallback(
    (request: SpeechRecognitionRequest) => {
      return service.listenPronunciation(request);
    },
    [service]
  );

  const stopListening = useCallback(() => {
    service.stopListening();
  }, [service]);

  const isRecognitionSupported = useCallback(() => {
    return service.isRecognitionSupported();
  }, [service]);

  const value: AudioContextValue = useMemo(
    () => ({
      service,
      settings,
      soundEnabled: settings.soundEnabled,
      speechEnabled: settings.speechEnabled,
      sfxVolume: settings.sfxVolume,
      speechVolume: settings.speechVolume,
      speechRate: settings.speechRate,
      setSoundEnabled,
      setSpeechEnabled,
      setSfxVolume,
      setSpeechVolume,
      setSpeechRate,
      updateSettings,
      playSfx,
      speakJapanese,
      stopSpeech,
      listenPronunciation,
      stopListening,
      isRecognitionSupported
    }),
    [
      service,
      settings,
      setSoundEnabled,
      setSpeechEnabled,
      setSfxVolume,
      setSpeechVolume,
      setSpeechRate,
      updateSettings,
      playSfx,
      speakJapanese,
      stopSpeech,
      listenPronunciation,
      stopListening,
      isRecognitionSupported
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

/**
 * Hook to access audio service and reactive settings.
 */
export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
