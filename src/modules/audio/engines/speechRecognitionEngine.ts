/**
 * Speech Recognition Engine
 * 
 * Encapsulates browser Web Speech API SpeechRecognition with Promise-based control,
 * typed discriminated error classifications, multi-alternative evaluation, and
 * phonetic matching via PhoneticMatcher.
 */

import type {
  SpeechRecognitionRequest,
  SpeechRecognitionResult,
  SpeechRecognitionError,
  SpeechRecognitionErrorType
} from '../types';
import { checkPhoneticMatch } from '../utils/phoneticMatcher';

// Minimal interface for browser SpeechRecognition
interface BrowserSpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      length: number;
      [altIndex: number]: {
        transcript: string;
        confidence?: number;
      };
    };
  };
}

interface BrowserSpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface BrowserSpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export class SpeechRecognitionEngine {
  private recognition: BrowserSpeechRecognitionInstance | null = null;
  private isListening: boolean = false;
  private currentReject: ((reason: SpeechRecognitionError) => void) | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Lazily initialized in listen / isSupported
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      'SpeechRecognition' in window ||
      'webkitSpeechRecognition' in window ||
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition !== undefined ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition !== undefined
    );
  }

  private createRecognitionInstance(): BrowserSpeechRecognitionInstance | null {
    if (typeof window === 'undefined') return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return null;

    try {
      return new SpeechRecognitionClass() as BrowserSpeechRecognitionInstance;
    } catch {
      return null;
    }
  }

  /**
   * Listens to speech input and scores it against target Kana and Romaji.
   */
  public listen(request: SpeechRecognitionRequest): Promise<SpeechRecognitionResult> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        const error: SpeechRecognitionError = {
          type: 'unsupported',
          message: 'Röstigenkänning stöds inte i din webbläsare. Testa Chrome eller Edge!'
        };
        reject(error);
        return;
      }

      // Stop previous instance if running
      this.stop();

      const instance = this.createRecognitionInstance();
      if (!instance) {
        const error: SpeechRecognitionError = {
          type: 'unsupported',
          message: 'Kunde inte initiera röstigenkänning i webbläsaren.'
        };
        reject(error);
        return;
      }

      this.recognition = instance;
      this.currentReject = reject;

      instance.lang = request.lang || 'ja-JP';
      instance.continuous = false;
      instance.interimResults = false;
      instance.maxAlternatives = 3;

      let settled = false;

      const cleanup = () => {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
        this.isListening = false;
        this.currentReject = null;
        settled = true;
      };

      instance.onstart = () => {
        this.isListening = true;
      };

      instance.onend = () => {
        this.isListening = false;
      };

      instance.onerror = (event: BrowserSpeechRecognitionErrorEvent) => {
        if (settled) return;
        cleanup();

        let errorType: SpeechRecognitionErrorType = 'unknown';
        let message = 'Kunde inte höra något. Kontrollera mikrofonen och försök igen.';

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorType = 'permission_denied';
          message = 'Mikrofonåtkomst nekades. Tillåt mikrofon i webbläsarens inställningar!';
        } else if (event.error === 'no-speech') {
          errorType = 'no_speech';
          message = 'Inget tal uppfattades. Tala närmare mikrofonen.';
        } else if (event.error === 'network') {
          errorType = 'network_error';
          message = 'Nätverksfel vid röstigenkänning. Kontrollera din anslutning.';
        } else if (event.error === 'aborted') {
          errorType = 'aborted';
          message = 'Inspelningen avbröts.';
        }

        reject({
          type: errorType,
          message,
          originalError: event
        });
      };

      instance.onresult = (event: BrowserSpeechRecognitionEvent) => {
        if (settled) return;
        cleanup();

        if (event.results && event.results.length > 0 && event.results[0].length > 0) {
          const primaryAlt = event.results[0][0];
          const primaryTranscript = primaryAlt.transcript.trim();
          const confidence = primaryAlt.confidence || 0.85;

          const alternatives: string[] = [];
          for (let i = 0; i < event.results[0].length; i++) {
            alternatives.push(event.results[0][i].transcript.trim());
          }

          // Test primary transcript first
          let matchResult = checkPhoneticMatch(
            primaryTranscript,
            request.targetKana,
            request.targetRomaji
          );

          // If primary didn't match, check alternatives
          if (!matchResult.isMatch && alternatives.length > 1) {
            for (let i = 1; i < alternatives.length; i++) {
              const altMatch = checkPhoneticMatch(
                alternatives[i],
                request.targetKana,
                request.targetRomaji
              );
              if (altMatch.isMatch) {
                matchResult = altMatch;
                break;
              }
            }
          }

          resolve({
            transcript: primaryTranscript,
            confidence,
            isMatch: matchResult.isMatch,
            targetExpected: request.targetKana,
            alternatives
          });
        } else {
          reject({
            type: 'no_speech',
            message: 'Kunde inte uppfatta ordet. Försök igen!'
          });
        }
      };

      // Timeout watchdog
      const timeoutMs = request.timeoutMs ?? 7000;
      this.timeoutId = setTimeout(() => {
        if (!settled) {
          cleanup();
          try {
            instance.abort();
          } catch {
            // Ignore
          }
          reject({
            type: 'timeout',
            message: 'Tiden gick ut. Försök tala lite snabbare!'
          });
        }
      }, timeoutMs);

      try {
        instance.start();
      } catch (e) {
        cleanup();
        reject({
          type: 'unknown',
          message: 'Kunde inte starta mikrofonen: ' + String(e),
          originalError: e
        });
      }
    });
  }

  /**
   * Stops active listening.
   */
  public stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }

    this.isListening = false;
  }

  /**
   * Checks whether the engine is currently listening for audio input.
   */
  public getIsListening(): boolean {
    return this.isListening;
  }
}
