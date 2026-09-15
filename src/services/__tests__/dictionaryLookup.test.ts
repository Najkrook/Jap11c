import { describe, it, expect } from 'vitest';
import { lookupLocalDictionary, romanizeKana, normalizeQuery } from '../dictionaryLookup';

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
});
