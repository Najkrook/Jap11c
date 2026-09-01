/**
 * Phonetic Matcher Utility
 * 
 * Provides robust phonetic normalization and comparison between speech recognition
 * transcripts and Japanese Kana / Romaji targets. Handles Katakana-to-Hiragana
 * conversion, Hepburn/Kunrei romaji variants, macrons, punctuation, and whitespace.
 */

/**
 * Converts Katakana characters in a string to their Hiragana equivalents.
 */
export function katakanaToHiragana(text: string): string {
  return text.replace(/[\u30A1-\u30F6]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x60);
  });
}

/**
 * Normalizes romaji variants to standardized Hepburn representation.
 */
export function normalizeRomaji(romaji: string): string {
  let r = romaji.toLowerCase().trim();

  // Replace macrons with double vowels
  r = r
    .replace(/ā/g, 'aa')
    .replace(/ī/g, 'ii')
    .replace(/ū/g, 'uu')
    .replace(/ē/g, 'ee')
    .replace(/ō/g, 'ou');

  // Kunrei / Nihon-shiki to standard Hepburn mappings
  r = r
    .replace(/sya/g, 'sha')
    .replace(/syu/g, 'shu')
    .replace(/syo/g, 'sho')
    .replace(/tya/g, 'cha')
    .replace(/tyu/g, 'chu')
    .replace(/tyo/g, 'cho')
    .replace(/zya|jya/g, 'ja')
    .replace(/zyu|jyu/g, 'ju')
    .replace(/zyo|jyo/g, 'jo')
    .replace(/si/g, 'shi')
    .replace(/ti/g, 'chi')
    .replace(/tu/g, 'tsu')
    .replace(/hu/g, 'fu')
    .replace(/zi|di/g, 'ji')
    .replace(/du/g, 'zu');

  return r;
}

/**
 * Strips whitespace, punctuation, and symbols from transcript or target strings.
 */
export function stripPunctuationAndWhitespace(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s.,!?、。・！？\-_~〜「」『』()（）"']/g, '')
    .trim();
}

/**
 * Normalizes a Japanese transcript or target string.
 */
export function normalizeTranscript(text: string): string {
  const noPunct = stripPunctuationAndWhitespace(text);
  const hiragana = katakanaToHiragana(noPunct);
  return normalizeRomaji(hiragana);
}

export interface MatchResult {
  isMatch: boolean;
  normalizedTranscript: string;
  normalizedTargetKana: string;
  normalizedTargetRomaji: string;
  matchType?: 'exact_kana' | 'exact_romaji' | 'substring_kana' | 'substring_romaji' | 'none';
}

/**
 * Checks if a speech recognition transcript matches the expected Kana or Romaji target.
 */
export function checkPhoneticMatch(
  transcript: string,
  targetKana: string,
  targetRomaji: string
): MatchResult {
  const cleanTranscript = normalizeTranscript(transcript);
  const cleanTargetKana = normalizeTranscript(targetKana);
  const cleanTargetRomaji = normalizeTranscript(targetRomaji);

  // 1. Direct equality with target Kana
  if (cleanTranscript.length > 0 && cleanTranscript === cleanTargetKana) {
    return {
      isMatch: true,
      normalizedTranscript: cleanTranscript,
      normalizedTargetKana: cleanTargetKana,
      normalizedTargetRomaji: cleanTargetRomaji,
      matchType: 'exact_kana'
    };
  }

  // 2. Direct equality with target Romaji
  if (cleanTranscript.length > 0 && cleanTranscript === cleanTargetRomaji) {
    return {
      isMatch: true,
      normalizedTranscript: cleanTranscript,
      normalizedTargetKana: cleanTargetKana,
      normalizedTargetRomaji: cleanTargetRomaji,
      matchType: 'exact_romaji'
    };
  }

  // 3. Substring match (e.g. transcript includes the target character with prolonged sound "あー" or politeness suffix)
  if (
    cleanTranscript.length > 0 &&
    (cleanTranscript.includes(cleanTargetKana) || cleanTargetKana.includes(cleanTranscript))
  ) {
    return {
      isMatch: true,
      normalizedTranscript: cleanTranscript,
      normalizedTargetKana: cleanTargetKana,
      normalizedTargetRomaji: cleanTargetRomaji,
      matchType: 'substring_kana'
    };
  }

  if (
    cleanTranscript.length > 0 &&
    (cleanTranscript.includes(cleanTargetRomaji) || cleanTargetRomaji.includes(cleanTranscript))
  ) {
    return {
      isMatch: true,
      normalizedTranscript: cleanTranscript,
      normalizedTargetKana: cleanTargetKana,
      normalizedTargetRomaji: cleanTargetRomaji,
      matchType: 'substring_romaji'
    };
  }

  return {
    isMatch: false,
    normalizedTranscript: cleanTranscript,
    normalizedTargetKana: cleanTargetKana,
    normalizedTargetRomaji: cleanTargetRomaji,
    matchType: 'none'
  };
}
