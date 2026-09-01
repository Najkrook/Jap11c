/**
 * Speech Recognition Helper (Backward Compatibility Bridge)
 * 
 * Delegates to the central WebAudioSpeechAdapter and PhoneticMatcher in `src/modules/audio`.
 */

import { webAudioSpeechAdapter } from '../modules/audio';
import type { SpeechRecognitionResult, SpeechRecognitionError } from '../modules/audio';

export interface SpeechRecognitionResultData {
  transcript: string;
  confidence: number;
  isMatch: boolean;
  targetExpected: string;
}

export function isSpeechRecognitionSupported(): boolean {
  return webAudioSpeechAdapter.isRecognitionSupported();
}

export class JapaneseSpeechRecognizer {
  public listen(
    targetKana: string,
    targetRomaji: string,
    onResult: (res: SpeechRecognitionResultData) => void,
    onError: (errorMsg: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    if (onStart) onStart();

    webAudioSpeechAdapter
      .listenPronunciation({
        targetKana,
        targetRomaji
      })
      .then((res: SpeechRecognitionResult) => {
        onResult({
          transcript: res.transcript,
          confidence: res.confidence,
          isMatch: res.isMatch,
          targetExpected: res.targetExpected
        });
        if (onEnd) onEnd();
      })
      .catch((err: SpeechRecognitionError | Error) => {
        const errorMsg =
          'message' in err && err.message
            ? err.message
            : 'Kunde inte höra något. Kontrollera mikrofonen och försök igen.';
        onError(errorMsg);
        if (onEnd) onEnd();
      });
  }

  public stop(): void {
    webAudioSpeechAdapter.stopListening();
  }
}
