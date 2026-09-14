import { describe, it, expect, beforeEach } from 'vitest';
import { MockAudioSpeechAdapter } from '../adapters/mockAudioSpeechAdapter';
import type { AudioSettings } from '../types';
import {
  checkPhoneticMatch,
  katakanaToHiragana,
  normalizeRomaji,
  stripPunctuationAndWhitespace,
  normalizeTranscript
} from '../utils/phoneticMatcher';

describe('AudioSpeechService & MockAudioSpeechAdapter', () => {
  let adapter: MockAudioSpeechAdapter;

  beforeEach(() => {
    adapter = new MockAudioSpeechAdapter();
  });

  describe('SFX Playback', () => {
    it('records played sound effects with options', () => {
      adapter.playSfx('click');
      adapter.playSfx('catch', { combo: 3 });
      adapter.playSfx('levelUp');
      adapter.playSfx('trainChime');
      adapter.playSfx('swordSlash');

      expect(adapter.sfxCalls).toHaveLength(5);
      expect(adapter.sfxCalls[0]).toEqual({ effect: 'click', options: undefined });
      expect(adapter.sfxCalls[1]).toEqual({ effect: 'catch', options: { combo: 3 } });
      expect(adapter.sfxCalls[2].effect).toBe('levelUp');
      expect(adapter.sfxCalls[3].effect).toBe('trainChime');
      expect(adapter.sfxCalls[4].effect).toBe('swordSlash');
    });

    it('suppresses sound effects when soundEnabled is false', () => {
      adapter.updateSettings({ soundEnabled: false });
      adapter.playSfx('click');
      adapter.playSfx('levelUp');

      expect(adapter.sfxCalls).toHaveLength(0);
    });

    it('allows clearing call logs', () => {
      adapter.playSfx('coin');
      expect(adapter.sfxCalls).toHaveLength(1);
      adapter.clearCalls();
      expect(adapter.sfxCalls).toHaveLength(0);
    });
  });

  describe('Speech Synthesis', () => {
    it('records speech calls with text and rate options', async () => {
      await adapter.speakJapanese('あ', { rate: 0.9 });
      await adapter.speakJapanese('こんにちは', { rate: 0.8, pitch: 1.1 });

      expect(adapter.speechCalls).toHaveLength(2);
      expect(adapter.speechCalls[0]).toEqual({ text: 'あ', options: { rate: 0.9 } });
      expect(adapter.speechCalls[1].text).toBe('こんにちは');
      expect(adapter.speechCalls[1].options?.pitch).toBe(1.1);
    });

    it('suppresses speech playback when speechEnabled is false', async () => {
      adapter.updateSettings({ speechEnabled: false });
      await adapter.speakJapanese('さようなら');

      expect(adapter.speechCalls).toHaveLength(0);
    });

    it('suppresses speech playback when soundEnabled is false', async () => {
      adapter.updateSettings({ soundEnabled: false });
      await adapter.speakJapanese('さようなら');

      expect(adapter.speechCalls).toHaveLength(0);
    });

    it('increments stopSpeech call counter', () => {
      expect(adapter.stopSpeechCalls).toBe(0);
      adapter.stopSpeech();
      expect(adapter.stopSpeechCalls).toBe(1);
    });
  });

  describe('Phonetic Matcher', () => {
    it('converts Katakana to Hiragana', () => {
      expect(katakanaToHiragana('ア')).toBe('あ');
      expect(katakanaToHiragana('カ')).toBe('か');
      expect(katakanaToHiragana('ネコ')).toBe('ねこ');
      expect(katakanaToHiragana('サクラ')).toBe('さくら');
    });

    it('normalizes Romaji variants and macrons to standard Hepburn', () => {
      expect(normalizeRomaji('si')).toBe('shi');
      expect(normalizeRomaji('tu')).toBe('tsu');
      expect(normalizeRomaji('ti')).toBe('chi');
      expect(normalizeRomaji('hu')).toBe('fu');
      expect(normalizeRomaji('zi')).toBe('ji');
      expect(normalizeRomaji('di')).toBe('ji');
      expect(normalizeRomaji('du')).toBe('zu');
      expect(normalizeRomaji('sya')).toBe('sha');
      expect(normalizeRomaji('tya')).toBe('cha');
      expect(normalizeRomaji('jya')).toBe('ja');
      expect(normalizeRomaji('tōkyō')).toBe('toukyou');
    });

    it('strips punctuation, quotes, Japanese brackets, and whitespace', () => {
      expect(stripPunctuationAndWhitespace(' あ ! ')).toBe('あ');
      expect(stripPunctuationAndWhitespace('「ねこ。」')).toBe('ねこ');
      expect(stripPunctuationAndWhitespace('ka!?')).toBe('ka');
    });

    it('normalizes full transcripts correctly', () => {
      expect(normalizeTranscript(' カ ! ')).toBe('か');
      expect(normalizeTranscript(' SHI ')).toBe('shi');
      expect(normalizeTranscript('SI')).toBe('shi');
    });

    it('accurately matches exact Hiragana and Romaji targets', () => {
      const match1 = checkPhoneticMatch('あ', 'あ', 'a');
      expect(match1.isMatch).toBe(true);
      expect(match1.matchType).toBe('exact_kana');

      const match2 = checkPhoneticMatch('a', 'あ', 'a');
      expect(match2.isMatch).toBe(true);
      expect(match2.matchType).toBe('exact_romaji');
    });

    it('accurately matches Katakana input against Hiragana target', () => {
      const match = checkPhoneticMatch('ア', 'あ', 'a');
      expect(match.isMatch).toBe(true);
      expect(match.matchType).toBe('exact_kana');
    });

    it('matches Hepburn and Kunrei variants forgivingly', () => {
      // User says "si" when target is "shi" (し)
      const matchShi = checkPhoneticMatch('si', 'し', 'shi');
      expect(matchShi.isMatch).toBe(true);

      // User says "tu" when target is "tsu" (つ)
      const matchTsu = checkPhoneticMatch('tu', 'つ', 'tsu');
      expect(matchTsu.isMatch).toBe(true);

      // User says "hu" when target is "fu" (ふ)
      const matchFu = checkPhoneticMatch('hu', 'ふ', 'fu');
      expect(matchFu.isMatch).toBe(true);
    });

    it('matches elongated / polite substring transcripts', () => {
      const matchLong = checkPhoneticMatch('あー', 'あ', 'a');
      expect(matchLong.isMatch).toBe(true);
      expect(matchLong.matchType).toBe('substring_kana');
    });

    it('correctly rejects non-matching input', () => {
      const mismatch = checkPhoneticMatch('ka', 'さ', 'sa');
      expect(mismatch.isMatch).toBe(false);
      expect(mismatch.matchType).toBe('none');

      const mismatchKana = checkPhoneticMatch('ぬ', 'ね', 'ne');
      expect(mismatchKana.isMatch).toBe(false);
    });
  });

  describe('Speech Recognition with Mock Adapter', () => {
    it('evaluates automatic match when no explicit mock is set', async () => {
      const result = await adapter.listenPronunciation({
        targetKana: 'か',
        targetRomaji: 'ka'
      });

      expect(result.isMatch).toBe(true);
      expect(result.transcript).toBe('か');
      expect(result.targetExpected).toBe('か');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('returns custom mock recognition result when set', async () => {
      adapter.mockRecognitionResult = {
        transcript: 'き',
        confidence: 0.92,
        isMatch: false,
        targetExpected: 'か',
        alternatives: ['き', 'ぎ']
      };

      const result = await adapter.listenPronunciation({
        targetKana: 'か',
        targetRomaji: 'ka'
      });

      expect(result.isMatch).toBe(false);
      expect(result.transcript).toBe('き');
      expect(result.alternatives).toContain('ぎ');
    });

    it('rejects with structured error when mockRecognitionError is set', async () => {
      adapter.mockRecognitionError = {
        type: 'permission_denied',
        message: 'Mikrofonåtkomst nekades.'
      };

      await expect(
        adapter.listenPronunciation({
          targetKana: 'あ',
          targetRomaji: 'a'
        })
      ).rejects.toEqual({
        type: 'permission_denied',
        message: 'Mikrofonåtkomst nekades.'
      });
    });

    it('rejects when speech recognition is unsupported', async () => {
      adapter.mockRecognitionSupported = false;

      await expect(
        adapter.listenPronunciation({
          targetKana: 'あ',
          targetRomaji: 'a'
        })
      ).rejects.toEqual({
        type: 'unsupported',
        message: 'Röstigenkänning stöds inte.'
      });
    });

    it('handles stopListening call', () => {
      expect(adapter.stopListeningCalls).toBe(0);
      adapter.stopListening();
      expect(adapter.stopListeningCalls).toBe(1);
    });
  });

  describe('Settings & Reactive Subscriptions', () => {
    it('reads initial settings', () => {
      const settings = adapter.getSettings();
      expect(settings.soundEnabled).toBe(true);
      expect(settings.speechEnabled).toBe(true);
      expect(settings.sfxVolume).toBe(1.0);
      expect(settings.speechRate).toBe(0.9);
    });

    it('updates settings and notifies subscribers', () => {
      let notifiedSettings: Readonly<AudioSettings> | null = null;
      const unsubscribe = adapter.subscribeSettings((newSettings) => {
        notifiedSettings = newSettings;
      });

      adapter.updateSettings({ sfxVolume: 0.5, speechRate: 0.85 });

      expect(notifiedSettings).not.toBeNull();
      const updated = notifiedSettings as Readonly<AudioSettings> | null;
      expect(updated?.sfxVolume).toBe(0.5);
      expect(updated?.speechRate).toBe(0.85);

      // Test unsubscribe
      notifiedSettings = null;
      unsubscribe();
      adapter.updateSettings({ sfxVolume: 0.7 });
      expect(notifiedSettings).toBeNull();
    });
  });
});
