import type { KanaCharacter } from '../../types/kana';

// Supports the common Hepburn and Kunrei-shiki alternatives used in the course.
export function checkRomajiMatch(input: string, kana: KanaCharacter): boolean {
  const cleanInput = input.trim().toLowerCase();
  if (!cleanInput) return false;

  const target = kana.romaji.toLowerCase();
  if (cleanInput === target) return true;

  const alternates: Record<string, string[]> = {
    shi: ['si'],
    chi: ['ti'],
    tsu: ['tu'],
    fu: ['hu'],
    wo: ['o'],
    n: ['nn'],
    ji: ['zi'],
    zu: ['du'],
    sha: ['sya'],
    shu: ['syu'],
    sho: ['syo'],
    cha: ['tya'],
    chu: ['tyu'],
    cho: ['tyo'],
    ja: ['jya', 'zya'],
    ju: ['jyu', 'zyu'],
    jo: ['jyo', 'zyo'],
    ti: ['chi', 'thi'],
    di: ['ji', 'dhi'],
    fa: ['fwa', 'hua'],
    fi: ['fwi', 'fui'],
    fe: ['fwe', 'hue'],
    fo: ['fwo', 'huo'],
    wi: ['ui'],
    we: ['ue'],
    che: ['tye'],
    she: ['sye'],
    je: ['jye']
  };

  if (alternates[target]?.includes(cleanInput)) return true;

  const normalizedId = kana.id.toLowerCase();
  return normalizedId === cleanInput || normalizedId.replace('kata_', '') === cleanInput;
}
