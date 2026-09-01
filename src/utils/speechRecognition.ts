// Speech Recognition Helper for Japanese Pronunciation Testing

export interface SpeechRecognitionResultData {
  transcript: string;
  confidence: number;
  isMatch: boolean;
  targetExpected: string;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export class JapaneseSpeechRecognizer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ja-JP';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 3;
      }
    }
  }

  public listen(
    targetKana: string,
    targetRomaji: string,
    onResult: (res: SpeechRecognitionResultData) => void,
    onError: (errorMsg: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.recognition) {
      onError('Röstigenkänning stöds inte i din webbläsare. Testa Chrome eller Edge!');
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let msg = 'Kunde inte höra något. Kontrollera mikrofonen och försök igen.';
      if (event.error === 'not-allowed') {
        msg = 'Mikrofonåtkomst nekades. Tillåt mikrofon i webbläsarens inställningar!';
      } else if (event.error === 'no-speech') {
        msg = 'Inget tal uppfattades. Tala närmare mikrofonen.';
      }
      onError(msg);
      if (onEnd) onEnd();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.recognition.onresult = (event: any) => {
      this.isListening = false;
      if (event.results && event.results.length > 0) {
        const result = event.results[0][0];
        const transcript = result.transcript.trim();
        const confidence = result.confidence;

        // Check if transcript matches target (hiragana, romaji or phonetic match)
        const cleanTranscript = transcript.toLowerCase().replace(/[\s.,!?]/g, '');
        const cleanTargetKana = targetKana.toLowerCase().replace(/[\s.,!?]/g, '');
        const cleanTargetRomaji = targetRomaji.toLowerCase().replace(/[\s.,!?]/g, '');

        const isMatch = cleanTranscript === cleanTargetKana || 
                        cleanTranscript === cleanTargetRomaji ||
                        cleanTranscript.includes(cleanTargetKana) ||
                        cleanTargetKana.includes(cleanTranscript);

        onResult({
          transcript,
          confidence: confidence || 0.85,
          isMatch,
          targetExpected: targetKana
        });
      } else {
        onError('Kunde inte uppfatta ordet. Försök igen!');
      }
    };

    try {
      this.recognition.start();
    } catch (e) {
      onError('Kunde inte starta mikrofonen: ' + String(e));
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }
}
