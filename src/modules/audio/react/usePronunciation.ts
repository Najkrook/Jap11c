/**
 * usePronunciation Hook
 * 
 * High-leverage React hook for managing microphone pronunciation attempts,
 * real-time feedback state, phonetic scoring, and error handling.
 */

import { useState, useCallback } from 'react';
import { useAudio } from './audioState';
import type {
  SpeechRecognitionResult,
  SpeechRecognitionError,
  SpeechRecognitionErrorType
} from '../types';

export interface PronunciationFeedback {
  transcript?: string;
  isMatch?: boolean;
  confidence?: number;
  errorMsg?: string;
  errorType?: SpeechRecognitionErrorType;
}

export interface UsePronunciationReturn {
  isListening: boolean;
  feedback: PronunciationFeedback | null;
  startListening: (
    targetKana: string,
    targetRomaji: string,
    options?: { timeoutMs?: number }
  ) => Promise<SpeechRecognitionResult | null>;
  stopListening: () => void;
  clearFeedback: () => void;
  isSupported: boolean;
}

export function usePronunciation(): UsePronunciationReturn {
  const { listenPronunciation, stopListening: stopAudioListening, isRecognitionSupported } = useAudio();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const stopListening = useCallback(() => {
    stopAudioListening();
    setIsListening(false);
  }, [stopAudioListening]);

  const startListening = useCallback(
    async (
      targetKana: string,
      targetRomaji: string,
      options?: { timeoutMs?: number }
    ): Promise<SpeechRecognitionResult | null> => {
      setFeedback(null);
      setIsListening(true);

      try {
        const result = await listenPronunciation({
          targetKana,
          targetRomaji,
          timeoutMs: options?.timeoutMs
        });

        setIsListening(false);
        setFeedback({
          transcript: result.transcript,
          isMatch: result.isMatch,
          confidence: result.confidence
        });

        return result;
      } catch (err) {
        setIsListening(false);
        const recognitionErr = err as SpeechRecognitionError;
        setFeedback({
          errorMsg: recognitionErr?.message || 'Ett oväntat fel uppstod vid röstigenkänning.',
          errorType: recognitionErr?.type || 'unknown'
        });
        return null;
      }
    },
    [listenPronunciation]
  );

  return {
    isListening,
    feedback,
    startListening,
    stopListening,
    clearFeedback,
    isSupported: isRecognitionSupported()
  };
}
