/**
 * Speech Synthesis Engine
 * 
 * Provides Japanese speech synthesis (ja-JP) with asynchronous voice selection,
 * active utterance cancellation, error handling, and timeout safeguards.
 */

import type { SpeechSynthesisOptions } from '../types';

export class SpeechSynthesisEngine {
  private speechEnabled: boolean = true;
  private masterVolume: number = 1.0;
  private defaultRate: number = 0.9;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded: boolean = false;

  constructor(speechEnabled: boolean = true, masterVolume: number = 1.0, defaultRate: number = 0.9) {
    this.speechEnabled = speechEnabled;
    this.masterVolume = masterVolume;
    this.defaultRate = defaultRate;
    this.initVoices();
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public setSpeechEnabled(enabled: boolean): void {
    this.speechEnabled = enabled;
  }

  public isSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  public setDefaultRate(rate: number): void {
    this.defaultRate = Math.max(0.1, Math.min(2.0, rate));
  }

  /**
   * Finds the best matching Japanese voice available in the browser.
   */
  public getJapaneseVoice(preferredVoice?: SpeechSynthesisVoice | string): SpeechSynthesisVoice | undefined {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;

    const currentVoices = this.voices.length > 0 ? this.voices : window.speechSynthesis.getVoices();

    if (preferredVoice) {
      if (typeof preferredVoice === 'string') {
        const named = currentVoices.find((v) => v.name === preferredVoice);
        if (named) return named;
      } else {
        return preferredVoice;
      }
    }

    // 1. Exact ja-JP voice
    const jaJpVoice = currentVoices.find((v) => v.lang === 'ja-JP' || v.lang === 'ja_JP');
    if (jaJpVoice) return jaJpVoice;

    // 2. Generic ja voice
    const jaVoice = currentVoices.find((v) => v.lang.startsWith('ja') || v.lang.includes('JP'));
    if (jaVoice) return jaVoice;

    return undefined;
  }

  /**
   * Pronounces Japanese text with timeout and cancellation protection.
   */
  public speak(text: string, options: SpeechSynthesisOptions = {}): Promise<void> {
    return new Promise((resolve) => {
      if (
        !this.speechEnabled ||
        this.masterVolume <= 0 ||
        !text ||
        typeof window === 'undefined' ||
        !window.speechSynthesis
      ) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel errors
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'ja-JP';
      utterance.rate = options.rate ?? this.defaultRate;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = (options.volume ?? 1.0) * this.masterVolume;

      const voice = this.getJapaneseVoice(options.voice);
      if (voice) {
        utterance.voice = voice;
      }

      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      let settled = false;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        settled = true;
      };

      utterance.onend = () => {
        if (!settled) {
          cleanup();
          resolve();
        }
      };

      utterance.onerror = () => {
        if (!settled) {
          cleanup();
          resolve();
        }
      };

      // Safety timeout in case speech synthesis stalls or fails to fire onend
      const timeoutMs = options.timeoutMs ?? 8000;
      timeoutId = setTimeout(() => {
        if (!settled) {
          cleanup();
          try {
            window.speechSynthesis.cancel();
          } catch {
            // Ignore
          }
          resolve();
        }
      }, timeoutMs);

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        cleanup();
        resolve();
      }
    });
  }

  /**
   * Immediately stops speech playback.
   */
  public stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }
}
