/**
 * Mock Audio & Speech Adapter (Test Implementation)
 * 
 * In-memory test implementation for unit testing and CI without requiring
 * real browser Web Audio or Speech APIs. Tracks invocations and allows
 * programmatic mocking of recognition results and errors.
 */

import type {
  AudioSpeechService,
  AudioSettings,
  SfxEffect,
  SfxOptions,
  SpeechSynthesisOptions,
  SpeechRecognitionRequest,
  SpeechRecognitionResult,
  SpeechRecognitionError
} from '../types';
import { checkPhoneticMatch } from '../utils/phoneticMatcher';

export class MockAudioSpeechAdapter implements AudioSpeechService {
  public sfxCalls: { effect: SfxEffect; options?: SfxOptions }[] = [];
  public speechCalls: { text: string; options?: SpeechSynthesisOptions }[] = [];
  public stopSpeechCalls: number = 0;
  public stopListeningCalls: number = 0;

  public mockRecognitionSupported: boolean = true;
  public mockRecognitionResult: SpeechRecognitionResult | null = null;
  public mockRecognitionError: SpeechRecognitionError | null = null;

  private settings: AudioSettings;
  private listeners: Set<(settings: Readonly<AudioSettings>) => void> = new Set();

  constructor(initialSettings?: Partial<AudioSettings>) {
    this.settings = {
      soundEnabled: true,
      speechEnabled: true,
      sfxVolume: 1.0,
      speechVolume: 1.0,
      speechRate: 0.9,
      ...initialSettings
    };
  }

  public playSfx(effect: SfxEffect, options?: SfxOptions): void {
    if (!this.settings.soundEnabled) return;
    this.sfxCalls.push({ effect, options });
  }

  public speakJapanese(text: string, options?: SpeechSynthesisOptions): Promise<void> {
    if (!this.settings.soundEnabled || !this.settings.speechEnabled) return Promise.resolve();
    this.speechCalls.push({ text, options });
    return Promise.resolve();
  }

  public stopSpeech(): void {
    this.stopSpeechCalls++;
  }

  public listenPronunciation(request: SpeechRecognitionRequest): Promise<SpeechRecognitionResult> {
    if (!this.mockRecognitionSupported) {
      return Promise.reject({
        type: 'unsupported',
        message: 'Röstigenkänning stöds inte.'
      });
    }

    if (this.mockRecognitionError) {
      return Promise.reject(this.mockRecognitionError);
    }

    if (this.mockRecognitionResult) {
      return Promise.resolve(this.mockRecognitionResult);
    }

    // Default simulation: automatic phonetic matcher evaluation based on target
    const simulatedTranscript = request.targetKana;
    const match = checkPhoneticMatch(simulatedTranscript, request.targetKana, request.targetRomaji);

    return Promise.resolve({
      transcript: simulatedTranscript,
      confidence: 0.95,
      isMatch: match.isMatch,
      targetExpected: request.targetKana,
      alternatives: [simulatedTranscript]
    });
  }

  public stopListening(): void {
    this.stopListeningCalls++;
  }

  public isRecognitionSupported(): boolean {
    return this.mockRecognitionSupported;
  }

  public getSettings(): Readonly<AudioSettings> {
    return Object.freeze({ ...this.settings });
  }

  public updateSettings(partial: Partial<AudioSettings>): void {
    this.settings = {
      ...this.settings,
      ...partial
    };
    const snapshot = this.getSettings();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  public subscribeSettings(listener: (settings: Readonly<AudioSettings>) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public clearCalls(): void {
    this.sfxCalls = [];
    this.speechCalls = [];
    this.stopSpeechCalls = 0;
    this.stopListeningCalls = 0;
    this.mockRecognitionResult = null;
    this.mockRecognitionError = null;
  }
}
