/**
 * Web Audio & Speech API Adapter (Production Browser Implementation)
 * 
 * Implements AudioSpeechService by coordinating SfxEngine, SpeechSynthesisEngine,
 * and SpeechRecognitionEngine with localStorage persistence and reactive settings subscriptions.
 */

import type {
  AudioSpeechService,
  AudioSettings,
  SfxEffect,
  SfxOptions,
  SpeechSynthesisOptions,
  SpeechRecognitionRequest,
  SpeechRecognitionResult
} from '../types';
import { SfxEngine } from '../engines/sfxEngine';
import { SpeechSynthesisEngine } from '../engines/speechSynthesisEngine';
import { SpeechRecognitionEngine } from '../engines/speechRecognitionEngine';

const STORAGE_KEY = 'hiraganaskolan_audio_settings';

const DEFAULT_SETTINGS: AudioSettings = {
  soundEnabled: true,
  speechEnabled: true,
  sfxVolume: 1.0,
  speechVolume: 1.0,
  speechRate: 0.9
};

export class WebAudioSpeechAdapter implements AudioSpeechService {
  private sfxEngine: SfxEngine;
  private speechSynthesisEngine: SpeechSynthesisEngine;
  private speechRecognitionEngine: SpeechRecognitionEngine;
  private settings: AudioSettings;
  private listeners: Set<(settings: Readonly<AudioSettings>) => void> = new Set();

  constructor(initialSettings?: Partial<AudioSettings>) {
    this.settings = this.loadSettings(initialSettings);
    this.sfxEngine = new SfxEngine(this.settings.soundEnabled, this.settings.sfxVolume);
    this.speechSynthesisEngine = new SpeechSynthesisEngine(
      this.settings.speechEnabled,
      this.settings.speechVolume,
      this.settings.speechRate
    );
    this.speechRecognitionEngine = new SpeechRecognitionEngine();
  }

  private loadSettings(overrides?: Partial<AudioSettings>): AudioSettings {
    let stored: Partial<AudioSettings> = {};
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) {
          stored = JSON.parse(item);
        }
      } catch {
        // Ignore JSON parse errors
      }
    }

    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      ...overrides
    };
  }

  private saveSettings(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      } catch {
        // Ignore storage quotas / privacy exceptions
      }
    }
  }

  private notifyListeners(): void {
    const snapshot = this.getSettings();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('Error in audio settings listener:', err);
      }
    });
  }

  public playSfx(effect: SfxEffect, options?: SfxOptions): void {
    this.sfxEngine.play(effect, options);
  }

  public speakJapanese(text: string, options?: SpeechSynthesisOptions): Promise<void> {
    if (!this.settings.soundEnabled || !this.settings.speechEnabled) {
      return Promise.resolve();
    }
    return this.speechSynthesisEngine.speak(text, {
      ...options,
      rate: options?.rate ?? this.settings.speechRate,
      volume: options?.volume ?? this.settings.speechVolume
    });
  }

  public stopSpeech(): void {
    this.speechSynthesisEngine.stop();
  }

  public listenPronunciation(request: SpeechRecognitionRequest): Promise<SpeechRecognitionResult> {
    return this.speechRecognitionEngine.listen(request);
  }

  public stopListening(): void {
    this.speechRecognitionEngine.stop();
  }

  public isRecognitionSupported(): boolean {
    return this.speechRecognitionEngine.isSupported();
  }

  public getSettings(): Readonly<AudioSettings> {
    return Object.freeze({ ...this.settings });
  }

  public updateSettings(partial: Partial<AudioSettings>): void {
    this.settings = {
      ...this.settings,
      ...partial
    };

    // Update subordinate engines
    if (partial.soundEnabled !== undefined) {
      this.sfxEngine.setSoundEnabled(this.settings.soundEnabled);
      if (!this.settings.soundEnabled) {
        this.speechSynthesisEngine.stop();
      }
    }
    if (partial.sfxVolume !== undefined) {
      this.sfxEngine.setMasterVolume(this.settings.sfxVolume);
    }
    if (partial.speechEnabled !== undefined) {
      this.speechSynthesisEngine.setSpeechEnabled(this.settings.speechEnabled);
    }
    if (partial.speechVolume !== undefined) {
      this.speechSynthesisEngine.setMasterVolume(this.settings.speechVolume);
    }
    if (partial.speechRate !== undefined) {
      this.speechSynthesisEngine.setDefaultRate(this.settings.speechRate);
    }

    this.saveSettings();
    this.notifyListeners();
  }

  public subscribeSettings(listener: (settings: Readonly<AudioSettings>) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

/** Default singleton instance for the application */
export const webAudioSpeechAdapter = new WebAudioSpeechAdapter();
