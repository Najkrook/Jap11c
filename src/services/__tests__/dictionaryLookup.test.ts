import { describe, it, expect } from 'vitest';
import { enrichScannedWord, lookupLocalDictionary, romanizeKana, normalizeQuery } from '../dictionaryLookup';

describe('dictionaryLookup', () => {
  it('romanizes simple kana and digraphs', () => {
    expect(romanizeKana('ねこ')).toBe('neko');
    expect(romanizeKana('すし')).toBe('sushi');
    expect(romanizeKana('きっぷ')).toBe('kippu'); // sokuon
    expect(romanizeKana('とうきょう')).toBe('toukyou'); // yoon
  });

  it('normalizes queries removing spaces and punctuation', () => {
    expect(normalizeQuery(' おはよう。 ')).toBe('おはよう');
    expect(normalizeQuery('これ、')).toBe('これ');
  });

  it('finds local matches in Genki exam vocab', () => {
    const res = lookupLocalDictionary('おはよう');
    expect(res).not.toBeNull();
    expect(res?.romaji.toLowerCase()).toContain('ohayoo');
    expect(res?.isExactLocalMatch).toBe(true);
  });

  it('finds local matches in Anki anime deck or classroom phrases', () => {
    const res = lookupLocalDictionary('こんにちは');
    expect(res).not.toBeNull();
    expect(res?.romaji.toLowerCase()).toContain('konnichiwa');
  });

  it('returns null for non-existent local query', () => {
    const res = lookupLocalDictionary('supercalifragilisticxyz123');
    expect(res).toBeNull();
  });

  it('does not match an empty normalized query to an empty dictionary field', () => {
    expect(lookupLocalDictionary(' 。、！？ ')).toBeNull();
  });

  it('looks up printed kanji using the lesson glossary and its Swedish meaning', () => {
    expect(lookupLocalDictionary('先生')).toMatchObject({ hiragana: 'せんせい', meaning: 'lärare / professor' });
    expect(lookupLocalDictionary('日本語')).toMatchObject({ hiragana: 'にほんご', meaning: 'japanska språket' });
  });

  it('normalizes half-width kana and combining marks from OCR', () => {
    expect(normalizeQuery('ｶﾞｯｺｳ')).toBe('ガッコウ');
    expect(normalizeQuery('か\u3099っこう')).toBe('がっこう');
  });

  it('returns a synchronous editable draft without inventing a reading for kanji', () => {
    expect(enrichScannedWord('未登録の試験語')).toMatchObject({
      kanji: '未登録の試験語', hiragana: '', romaji: '', meaning: '', isExactLocalMatch: false,
    });
  });
});
