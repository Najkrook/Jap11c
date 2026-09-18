import { ANKI_CARDS, extractShortMeaning } from '../components/anki/ankiLogic';
import { GENKI_EXAM_VOCAB } from '../data/genkiExamData';
import { CLASSROOM_PHRASES, GENKI_L1_VOCABULARY } from '../data/genkiVocab';
import { TRAVEL_WORDS, TRAVEL_PHRASES } from '../data/travelVocabData';
import { HIRAGANA_DATA } from '../data/hiraganaData';
import { KATAKANA_DATA } from '../data/katakanaData';

export interface DictionaryLookupResult {
  kanji: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  source: string;
  notes?: string;
  isExactLocalMatch: boolean;
}

// Fast lookup map for Kana -> Romaji
const KANA_TO_ROMAJI_MAP: Record<string, string> = {};

// Populate from HIRAGANA_DATA and KATAKANA_DATA
[...HIRAGANA_DATA, ...KATAKANA_DATA].forEach((item) => {
  if (item.kana && item.romaji) {
    KANA_TO_ROMAJI_MAP[item.kana] = item.romaji;
  }
});

// Extra mappings for combined digraphs (sokuon, long vowels etc.)
export function romanizeKana(text: string): string {
  if (!text) return '';
  let result = '';
  let i = 0;
  while (i < text.length) {
    const twoChars = text.substring(i, i + 2);
    if (KANA_TO_ROMAJI_MAP[twoChars]) {
      result += KANA_TO_ROMAJI_MAP[twoChars];
      i += 2;
      continue;
    }

    const oneChar = text[i];
    if (oneChar === 'っ' || oneChar === 'ッ') {
      // Sokuon (double following consonant)
      const nextKana = text[i + 1];
      const nextRomaji = nextKana ? KANA_TO_ROMAJI_MAP[nextKana] || '' : '';
      const consonant = nextRomaji ? nextRomaji[0] : 't';
      result += consonant;
      i += 1;
      continue;
    }

    if (KANA_TO_ROMAJI_MAP[oneChar]) {
      result += KANA_TO_ROMAJI_MAP[oneChar];
    } else {
      result += oneChar;
    }
    i += 1;
  }
  return result;
}

/**
 * Normalizes Japanese query strings (trims whitespace, cleans full-width spaces and trailing punctuation).
 */
export function normalizeQuery(query: string): string {
  return query
    .normalize('NFKC')
    .trim()
    .replace(/[。、！？\s]/g, '')
    .toLowerCase();
}

/**
 * Searches local databases (ANKI_CARDS, GENKI_EXAM_VOCAB, CLASSROOM_PHRASES, TRAVEL_WORDS/PHRASES).
 * 100% offline, synchronous, 0 kr.
 */
export function lookupLocalDictionary(rawQuery: string): DictionaryLookupResult | null {
  const q = rawQuery.trim();
  if (!q) return null;

  const normalized = normalizeQuery(q);
  if (!normalized) return null;

  // 1. Check GENKI_EXAM_VOCAB (highest relevance for learners, has Swedish meanings!)
  for (const item of GENKI_EXAM_VOCAB) {
    const itemJpNorm = normalizeQuery(item.japanese);
    const itemKanaNorm = item.hiragana ? normalizeQuery(item.hiragana) : '';
    const itemRomajiNorm = normalizeQuery(item.romaji);

    if (itemJpNorm === normalized || (itemKanaNorm && itemKanaNorm === normalized) || itemRomajiNorm === normalized) {
      return {
        kanji: item.japanese !== item.hiragana && item.hiragana ? item.japanese.replace(/[。、]/g, '') : '',
        hiragana: (item.hiragana || item.japanese).replace(/[。、]/g, ''),
        romaji: item.romaji.replace(/[。、]/g, ''),
        meaning: item.swedish || item.english,
        source: item.lesson ? `Genki I (${item.lesson})` : 'Genki I Vocab',
        notes: item.notes,
        isExactLocalMatch: true
      };
    }
  }

  // The lesson glossary supplies kanji spellings absent from the kana-only exam list.
  for (const word of GENKI_L1_VOCABULARY) {
    if ([word.kana, word.kanji, word.romaji].some(value => value && normalizeQuery(value) === normalized)) {
      return {
        kanji: word.kanji || '',
        hiragana: word.kana,
        romaji: word.romaji,
        meaning: word.meaningSv || word.meaningEn,
        source: 'Genki I ordlista',
        isExactLocalMatch: true,
      };
    }
  }

  // 2. Check ANKI_CARDS (over 2 000 cards)
  for (const card of ANKI_CARDS) {
    const cardKanjiNorm = normalizeQuery(card.kanji);
    const cardKanaNorm = normalizeQuery(card.hiragana);
    const cardRomajiNorm = normalizeQuery(card.romaji);

    if (cardKanjiNorm === normalized || cardKanaNorm === normalized || cardRomajiNorm === normalized) {
      return {
        kanji: card.kanji !== card.hiragana ? card.kanji : '',
        hiragana: card.hiragana,
        romaji: card.romaji,
        meaning: extractShortMeaning(card.meaning),
        source: card.source || 'Anime Anki',
        isExactLocalMatch: true
      };
    }
  }

  // 3. Check CLASSROOM_PHRASES
  for (const phrase of CLASSROOM_PHRASES) {
    const pJpNorm = normalizeQuery(phrase.japanese);
    const pRomajiNorm = normalizeQuery(phrase.romaji);

    if (pJpNorm === normalized || pRomajiNorm === normalized) {
      return {
        kanji: '',
        hiragana: phrase.japanese,
        romaji: phrase.romaji,
        meaning: phrase.swedish,
        source: 'Klassrumsfras',
        notes: phrase.context,
        isExactLocalMatch: true
      };
    }
  }

  // 4. Check TRAVEL_WORDS & TRAVEL_PHRASES
  for (const item of [...TRAVEL_WORDS, ...TRAVEL_PHRASES]) {
    const itemJpNorm = normalizeQuery(item.japanese);
    const itemKanaNorm = item.hiragana ? normalizeQuery(item.hiragana) : '';
    const itemRomajiNorm = item.romaji ? normalizeQuery(item.romaji) : '';

    if (itemJpNorm === normalized || (itemKanaNorm && itemKanaNorm === normalized) || itemRomajiNorm === normalized) {
      return {
        kanji: item.hiragana && item.japanese !== item.hiragana ? item.japanese : '',
        hiragana: item.hiragana || item.japanese,
        romaji: item.romaji || romanizeKana(item.hiragana || item.japanese),
        meaning: item.swedish || item.english || '',
        source: item.category ? `Resejapanska (${item.category})` : 'Resejapanska',
        notes: item.notes,
        isExactLocalMatch: true
      };
    }
  }

  // 5. Check Example words in Hiragana & Katakana Data
  for (const kana of [...HIRAGANA_DATA, ...KATAKANA_DATA]) {
    for (const ex of kana.exampleWords || []) {
      const exKanaNorm = normalizeQuery(ex.kana);
      const exKanjiNorm = ex.kanji ? normalizeQuery(ex.kanji) : '';
      const exRomajiNorm = normalizeQuery(ex.romaji);

      if (exKanaNorm === normalized || exKanjiNorm === normalized || exRomajiNorm === normalized) {
        return {
          kanji: ex.kanji || '',
          hiragana: ex.kana,
          romaji: ex.romaji,
          meaning: ex.meaningSv || ex.meaningEn,
          source: 'Hiragana/Katakana Exempelord',
          isExactLocalMatch: true
        };
      }
    }
  }

  return null;
}

/** Build an editable draft synchronously. No network or late updates to user edits. */
export function enrichScannedWord(rawInput: string): DictionaryLookupResult {
  const cleanInput = rawInput.normalize('NFKC').trim();
  const localMatch = lookupLocalDictionary(cleanInput);
  if (localMatch) return localMatch;

  const hasKanji = /[\p{Script=Han}]/u.test(cleanInput);
  const isAllKana = /^[\p{Script=Hiragana}\p{Script=Katakana}ー\s。、！？]+$/u.test(cleanInput);
  return {
    kanji: hasKanji ? cleanInput : '',
    hiragana: isAllKana ? cleanInput : '',
    romaji: isAllKana ? romanizeKana(cleanInput) : '',
    meaning: '',
    source: 'Eget ord',
    isExactLocalMatch: false,
  };
}
