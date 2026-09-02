import { describe, it, expect } from 'vitest';
import { checkRomajiMatch } from '../HiraganaExam';
import { HIRAGANA_DATA } from '../../../data/hiraganaData';
import { KATAKANA_DATA } from '../../../data/katakanaData';

describe('HiraganaExam checkRomajiMatch', () => {
  it('correctly matches standard romaji for all 85 hiragana characters', () => {
    expect(HIRAGANA_DATA.length).toBe(85);

    for (const kana of HIRAGANA_DATA) {
      expect(checkRomajiMatch(kana.romaji, kana)).toBe(true);
      expect(checkRomajiMatch(kana.romaji.toUpperCase(), kana)).toBe(true);
      expect(checkRomajiMatch(`  ${kana.romaji}  `, kana)).toBe(true);
    }
  });

  it('correctly matches alternate romaji spellings (Hepburn and Kunrei-shiki)', () => {
    const shi = HIRAGANA_DATA.find(k => k.id === 'shi')!;
    expect(checkRomajiMatch('shi', shi)).toBe(true);
    expect(checkRomajiMatch('si', shi)).toBe(true);

    const chi = HIRAGANA_DATA.find(k => k.id === 'chi')!;
    expect(checkRomajiMatch('chi', chi)).toBe(true);
    expect(checkRomajiMatch('ti', chi)).toBe(true);

    const tsu = HIRAGANA_DATA.find(k => k.id === 'tsu')!;
    expect(checkRomajiMatch('tsu', tsu)).toBe(true);
    expect(checkRomajiMatch('tu', tsu)).toBe(true);

    const fu = HIRAGANA_DATA.find(k => k.id === 'fu')!;
    expect(checkRomajiMatch('fu', fu)).toBe(true);
    expect(checkRomajiMatch('hu', fu)).toBe(true);

    const wo = HIRAGANA_DATA.find(k => k.id === 'wo')!;
    expect(checkRomajiMatch('wo', wo)).toBe(true);
    expect(checkRomajiMatch('o', wo)).toBe(true);

    const n = HIRAGANA_DATA.find(k => k.id === 'n')!;
    expect(checkRomajiMatch('n', n)).toBe(true);
    expect(checkRomajiMatch('nn', n)).toBe(true);

    const ji = HIRAGANA_DATA.find(k => k.id === 'ji')!;
    expect(checkRomajiMatch('ji', ji)).toBe(true);
    expect(checkRomajiMatch('zi', ji)).toBe(true);

    const sha = HIRAGANA_DATA.find(k => k.id === 'sha')!;
    expect(checkRomajiMatch('sha', sha)).toBe(true);
    expect(checkRomajiMatch('sya', sha)).toBe(true);

    const cha = HIRAGANA_DATA.find(k => k.id === 'cha')!;
    expect(checkRomajiMatch('cha', cha)).toBe(true);
    expect(checkRomajiMatch('tya', cha)).toBe(true);

    const ja = HIRAGANA_DATA.find(k => k.id === 'ja')!;
    expect(checkRomajiMatch('ja', ja)).toBe(true);
    expect(checkRomajiMatch('jya', ja)).toBe(true);
    expect(checkRomajiMatch('zya', ja)).toBe(true);
  });

  it('correctly matches standard romaji for all katakana characters', () => {
    expect(KATAKANA_DATA.length).toBeGreaterThanOrEqual(85);

    for (const kana of KATAKANA_DATA) {
      expect(checkRomajiMatch(kana.romaji, kana)).toBe(true);
      expect(checkRomajiMatch(kana.romaji.toUpperCase(), kana)).toBe(true);
      expect(checkRomajiMatch(`  ${kana.romaji}  `, kana)).toBe(true);
    }
  });

  it('correctly matches modern Katakana Gairaigo special combinations', () => {
    const ti = KATAKANA_DATA.find(k => k.id === 'kata_ti')!;
    expect(checkRomajiMatch('ti', ti)).toBe(true);
    expect(checkRomajiMatch('chi', ti)).toBe(true);

    const fa = KATAKANA_DATA.find(k => k.id === 'kata_fa')!;
    expect(checkRomajiMatch('fa', fa)).toBe(true);

    const we = KATAKANA_DATA.find(k => k.id === 'kata_we')!;
    expect(checkRomajiMatch('we', we)).toBe(true);
  });

  it('rejects incorrect romaji input', () => {
    const ka = HIRAGANA_DATA.find(k => k.id === 'ka')!;
    expect(checkRomajiMatch('ki', ka)).toBe(false);
    expect(checkRomajiMatch('sa', ka)).toBe(false);
    expect(checkRomajiMatch('', ka)).toBe(false);
  });
});
