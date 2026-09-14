/**
 * Audio & Speech React Context & Provider
 * 
 * Provides reactive access to audio settings, sound effects playback,
 * speech synthesis, and recognition across the React component hierarchy.
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import type {
  AudioSpeechService,
  AudioSettings,
  SfxEffect,
  SfxOptions,
  SpeechSynthesisOptions,
  SpeechRecognitionRequest,
} from '../types';
import { webAudioSpeechAdapter } from '../adapters/webAudioSpeechAdapter';
import { AudioContext, type AudioContextValue } from './audioState';

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
    // oxlint-disable-next-line react/set-state-in-effect -- A replaced external audio service has its own settings snapshot.
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
      service.updateSettings({ soundEnabled: enabled, speechEnabled: enabled });
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
