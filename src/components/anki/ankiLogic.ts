import type { AnkiCard, AnkiChapter, AnkiDeckMode, AnkiCardProgress, AnkiReviewRating, GenkiReviewRating, GenkiCardProgress, TravelItem } from '../../types/anki';
import rawAnkiData from '../../data/ankiData.json';
import { TRAVEL_WORDS, TRAVEL_PHRASES, TRAVEL_WORDS_CHAPTERS, TRAVEL_PHRASES_CHAPTERS } from '../../data/travelVocabData';
import { GENKI_EXAM_VOCAB, GENKI_EXAM_CHAPTERS } from '../../data/genkiExamData';
import { 
  STAY_WITH_ME_VOCAB, 
  STAY_WITH_ME_CHAPTERS, 
  PLASTIC_LOVE_VOCAB, 
  PLASTIC_LOVE_CHAPTERS 
} from '../../data/songDecksData';

export const ANKI_CARDS: AnkiCard[] = rawAnkiData as AnkiCard[];
export const ANKI_CHAPTER_SIZE = 10;
export const TRAVEL_CHAPTER_SIZE = 10;

export function extractShortMeaning(meaning: string | undefined): string {
  if (!meaning) return '';

  const colonMatch = meaning.match(/^([\w-]+):\s*(.+?)(?:\s{2,}|$)/);
  if (colonMatch) {
    const def = colonMatch[2].split(/[.!](?:\s|$)/)[0];
    if (def.length <= 80) return def;
  }

  const bracketMatch = meaning.match(/^\[.*?\]\s*(.+?)(?:\.\s|$)/);
  if (bracketMatch) {
    const def = bracketMatch[1];
    if (def.length <= 80) return def;
  }

  const firstSentence = meaning.split(/[.!]\s/)[0];
  if (firstSentence.length <= 80) return firstSentence;
  return `${firstSentence.substring(0, 77)}...`;
}

export function formatAnimeSource(source: string | undefined): string {
  if (!source) return '';
  return source.replace(/_/g, ' ').replace(/\(JP\+Eng\)/gi, '').trim();
}

const preloadedImages = new Set<string>();

export function preloadAnkiImages(cards: AnkiCard[], startIndex: number, count: number = 5): void {
  const endIndex = Math.min(startIndex + count, cards.length);
  for (let i = startIndex; i < endIndex; i++) {
    const imageName = cards[i]?.image;
    if (!imageName) continue;
    const src = `/images/anki/${imageName}`;
    if (!preloadedImages.has(src)) {
      const img = new Image();
      img.src = src;
      preloadedImages.add(src);
    }
  }
}

const ANKI_BOOKMARKS_KEY = 'hiraganaskolan_anki_bookmarks';

export function getAnkiBookmarks(): number[] {
  try {
    const raw = localStorage.getItem(ANKI_BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAnkiBookmarks(bookmarks: number[]): void {
  try {
    localStorage.setItem(ANKI_BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // Ignore quota errors
  }
}

export function isAnkiBookmarked(index: number, bookmarks?: number[]): boolean {
  const list = bookmarks ?? getAnkiBookmarks();
  return list.includes(index);
}

export function toggleAnkiBookmark(index: number): boolean {
  const current = getAnkiBookmarks();
  const exists = current.includes(index);
  const updated = exists ? current.filter((i) => i !== index) : [...current, index].sort((a, b) => a - b);
  saveAnkiBookmarks(updated);
  return !exists;
}

export function getDeckItems(
  mode: AnkiDeckMode,
  bookmarksList?: number[],
  customIndices?: number[]
): (AnkiCard | TravelItem)[] {
  if (mode === 'genki') return GENKI_EXAM_VOCAB;
  if (mode === 'stay_with_me') return STAY_WITH_ME_VOCAB;
  if (mode === 'plastic_love') return PLASTIC_LOVE_VOCAB;
  if (mode === 'words') return TRAVEL_WORDS;
  if (mode === 'phrases') return TRAVEL_PHRASES;
  if (mode === 'bookmarks') {
    const bookmarks = bookmarksList ?? getAnkiBookmarks();
    return bookmarks.map((idx) => ANKI_CARDS[idx]).filter(Boolean);
  }
  if (mode === 'due' || mode === 'weak') {
    const indices = customIndices ?? [];
    return indices.map((idx) => ANKI_CARDS[idx]).filter(Boolean);
  }
  return ANKI_CARDS;
}

export function getDeckChapters(
  mode: AnkiDeckMode,
  completedList: number[] = [],
  bookmarksList?: number[],
  customIndices?: number[]
): AnkiChapter[] {
  if (mode === 'kana') {
    return [];
  }

  if (mode === 'genki') {
    return GENKI_EXAM_CHAPTERS.map((chap) => ({
      index: chap.index,
      title: chap.title,
      itemCount: chap.itemCount,
      startIndex: chap.startIndex,
      endIndex: chap.endIndex,
      isCompleted: completedList.includes(chap.index),
      preview: chap.preview,
    }));
  }

  if (mode === 'stay_with_me') {
    return STAY_WITH_ME_CHAPTERS.map((chap) => ({
      index: chap.index,
      title: chap.title,
      itemCount: chap.itemCount,
      startIndex: chap.startIndex,
      endIndex: chap.endIndex,
      isCompleted: completedList.includes(chap.index),
      preview: chap.preview,
    }));
  }

  if (mode === 'plastic_love') {
    return PLASTIC_LOVE_CHAPTERS.map((chap) => ({
      index: chap.index,
      title: chap.title,
      itemCount: chap.itemCount,
      startIndex: chap.startIndex,
      endIndex: chap.endIndex,
      isCompleted: completedList.includes(chap.index),
      preview: chap.preview,
    }));
  }

  if (mode === 'words') {
    return TRAVEL_WORDS_CHAPTERS.map((title, i) => {
      const startIndex = i * TRAVEL_CHAPTER_SIZE;
      const endIndex = Math.min(startIndex + TRAVEL_CHAPTER_SIZE, TRAVEL_WORDS.length);
      const firstItem = TRAVEL_WORDS[startIndex];
      return {
        index: i,
        title,
        itemCount: endIndex - startIndex,
        startIndex,
        endIndex,
        isCompleted: completedList.includes(i),
        preview: firstItem ? `${firstItem.swedish} → ${firstItem.japanese}` : undefined,
      };
    });
  }

  if (mode === 'phrases') {
    return TRAVEL_PHRASES_CHAPTERS.map((title, i) => {
      const startIndex = i * TRAVEL_CHAPTER_SIZE;
      const endIndex = Math.min(startIndex + TRAVEL_CHAPTER_SIZE, TRAVEL_PHRASES.length);
      const firstItem = TRAVEL_PHRASES[startIndex];
      return {
        index: i,
        title,
        itemCount: endIndex - startIndex,
        startIndex,
        endIndex,
        isCompleted: completedList.includes(i),
        preview: firstItem ? `${firstItem.swedish} → ${firstItem.japanese}` : undefined,
      };
    });
  }

  if (mode === 'bookmarks') {
    const bookmarks = bookmarksList ?? getAnkiBookmarks();
    if (bookmarks.length === 0) return [];
    const totalChapters = Math.ceil(bookmarks.length / ANKI_CHAPTER_SIZE);
    return Array.from({ length: totalChapters }, (_, i) => {
      const startIndex = i * ANKI_CHAPTER_SIZE;
      const endIndex = Math.min(startIndex + ANKI_CHAPTER_SIZE, bookmarks.length);
      const firstCardIndex = bookmarks[startIndex];
      const firstCard = ANKI_CARDS[firstCardIndex];
      const preview = firstCard ? `${firstCard.romaji || firstCard.kanji} (${firstCard.source || 'Anime'})` : undefined;
      return {
        index: i,
        title: `Favoriter Del ${i + 1}`,
        itemCount: endIndex - startIndex,
        startIndex,
        endIndex,
        isCompleted: completedList.includes(i),
        preview,
      };
    });
  }

  if (mode === 'due') {
    const indices = customIndices ?? [];
    if (indices.length === 0) return [];
    const batchSize = 15;
    const totalChapters = Math.ceil(indices.length / batchSize);
    return Array.from({ length: totalChapters }, (_, i) => {
      const startIndex = i * batchSize;
      const endIndex = Math.min(startIndex + batchSize, indices.length);
      const firstCardIndex = indices[startIndex];
      const firstCard = ANKI_CARDS[firstCardIndex];
      const preview = firstCard ? `${firstCard.romaji || firstCard.kanji} (${firstCard.source || 'Anime'})` : undefined;
      return {
        index: i,
        title: `Repetition Del ${i + 1}`,
        itemCount: endIndex - startIndex,
        startIndex,
        endIndex,
        isCompleted: completedList.includes(i),
        preview,
      };
    });
  }

  if (mode === 'weak') {
    const indices = customIndices ?? [];
    if (indices.length === 0) return [];
    const batchSize = 15;
    const totalChapters = Math.ceil(indices.length / batchSize);
    return Array.from({ length: totalChapters }, (_, i) => {
      const startIndex = i * batchSize;
      const endIndex = Math.min(startIndex + batchSize, indices.length);
      const firstCardIndex = indices[startIndex];
      const firstCard = ANKI_CARDS[firstCardIndex];
      const preview = firstCard ? `${firstCard.romaji || firstCard.kanji} (${firstCard.source || 'Anime'})` : undefined;
      return {
        index: i,
        title: `Svaga kort Del ${i + 1}`,
        itemCount: endIndex - startIndex,
        startIndex,
        endIndex,
        isCompleted: completedList.includes(i),
        preview,
      };
    });
  }

  // Anki mode (Tae Kim deck)
  const totalChapters = Math.ceil(ANKI_CARDS.length / ANKI_CHAPTER_SIZE);
  return Array.from({ length: totalChapters }, (_, i) => {
    const startIndex = i * ANKI_CHAPTER_SIZE;
    const endIndex = Math.min(startIndex + ANKI_CHAPTER_SIZE, ANKI_CARDS.length);
    const firstCard = ANKI_CARDS[startIndex];
    const preview = firstCard ? `${firstCard.romaji || firstCard.kanji} (${firstCard.source || 'Anime'})` : undefined;
    return {
      index: i,
      title: `Kapitel ${i + 1}`,
      itemCount: endIndex - startIndex,
      startIndex,
      endIndex,
      isCompleted: completedList.includes(i),
      preview,
    };
  });
}

export function calculateNextIntervals(
  currentProgress?: AnkiCardProgress
): Record<AnkiReviewRating, { days: number; label: string }> {
  if (!currentProgress || currentProgress.repetitions === 0) {
    return {
      again: { days: 0, label: '<10m' },
      hard: { days: 1, label: '1d' },
      good: { days: 1, label: '1d' },
      easy: { days: 3, label: '3d' },
    };
  }

  if (currentProgress.repetitions === 1) {
    return {
      again: { days: 0, label: '<10m' },
      hard: { days: 2, label: '2d' },
      good: { days: 3, label: '3d' },
      easy: { days: 6, label: '6d' },
    };
  }

  const hardDays = Math.max(1, Math.round(currentProgress.interval * 1.2));
  const goodDays = Math.max(1, Math.round(currentProgress.interval * (currentProgress.easeFactor || 2.5)));
  const easyDays = Math.max(1, Math.round(currentProgress.interval * (currentProgress.easeFactor || 2.5) * 1.3));

  const formatDays = (d: number) => {
    if (d >= 30) {
      const m = Math.round(d / 30);
      return `${m}mån`;
    }
    return `${d}d`;
  };

  return {
    again: { days: 0, label: '<10m' },
    hard: { days: hardDays, label: formatDays(hardDays) },
    good: { days: goodDays, label: formatDays(goodDays) },
    easy: { days: easyDays, label: formatDays(easyDays) },
  };
}

export function getDueAnkiCardIndices(cardProgress?: Record<number, AnkiCardProgress>): number[] {
  if (!cardProgress) return [];
  const now = Date.now();
  return Object.values(cardProgress)
    .filter((item) => item.nextReviewDate <= now)
    .map((item) => item.cardIndex)
    .sort((a, b) => a - b);
}

export function getWeakAnkiCardIndices(cardProgress?: Record<number, AnkiCardProgress>): number[] {
  if (!cardProgress) return [];
  return Object.values(cardProgress)
    .filter((item) => item.totalErrors > 0 || item.lapses > 0)
    .sort((a, b) => (b.totalErrors + b.lapses) - (a.totalErrors + a.lapses))
    .map((item) => item.cardIndex);
}

export interface SearchResult {
  card: AnkiCard;
  globalIndex: number;
  chapterIndex: number;
}

export function searchAnkiCards(query: string, maxResults: number = 30): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];
  for (let i = 0; i < ANKI_CARDS.length; i++) {
    const card = ANKI_CARDS[i];
    if (
      card.romaji.toLowerCase().includes(q) ||
      card.kanji.toLowerCase().includes(q) ||
      card.hiragana.toLowerCase().includes(q) ||
      card.meaning.toLowerCase().includes(q) ||
      card.source.toLowerCase().includes(q)
    ) {
      results.push({
        card,
        globalIndex: i,
        chapterIndex: Math.floor(i / ANKI_CHAPTER_SIZE),
      });
      if (results.length >= maxResults) break;
    }
  }
  return results;
}

export function calculateGenkiNextIntervals(
  currentProgress?: GenkiCardProgress
): Record<GenkiReviewRating, { hours: number; label: string; fullLabel: string }> {
  const notAtAll = { hours: 0, label: 'Nu', fullLabel: 'Repetera nu' };
  const barely = { hours: 0.1667, label: '10m', fullLabel: 'Om 10 minuter' };
  const almost = { hours: 5, label: '5h', fullLabel: 'Om 5 timmar' };

  if (!currentProgress || currentProgress.repetitions === 0) {
    return {
      not_at_all: notAtAll,
      barely,
      almost,
      known: { hours: 72, label: '3d', fullLabel: 'Om 3 dagar' },
    };
  }

  if (currentProgress.repetitions === 1) {
    return {
      not_at_all: notAtAll,
      barely,
      almost,
      known: { hours: 168, label: '7d', fullLabel: 'Om 7 dagar' },
    };
  }

  // Adaptive escalation with ease factor, capped at 30 days (720 hours)
  const factor = currentProgress.easeFactor || 2.3;
  const rawHours = Math.round(currentProgress.intervalHours * factor);
  const nextHours = Math.min(720, Math.max(72, rawHours));
  const nextDays = Math.max(1, Math.round(nextHours / 24));

  return {
    not_at_all: notAtAll,
    barely,
    almost,
    known: {
      hours: nextDays * 24,
      label: `${nextDays}d`,
      fullLabel: `Om ${nextDays} dagar`,
    },
  };
}

export function getDueGenkiCardIndices(cardProgress?: Record<number, GenkiCardProgress>): number[] {
  if (!cardProgress) return [];
  const now = Date.now();
  return Object.values(cardProgress)
    .filter((item) => item.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate - b.nextReviewDate)
    .map((item) => item.cardIndex);
}

export interface GenkiDeckStats {
  total: number;
  due: number;
  upcomingToday: number;
  mastered: number;
  learning: number;
  unstarted: number;
}

export function getGenkiDeckStats(
  cardProgress?: Record<number, GenkiCardProgress>,
  totalCards: number = GENKI_EXAM_VOCAB.length
): GenkiDeckStats {
  if (!cardProgress) {
    return {
      total: totalCards,
      due: 0,
      upcomingToday: 0,
      mastered: 0,
      learning: 0,
      unstarted: totalCards,
    };
  }

  const now = Date.now();
  const fiveHoursLater = now + 5 * 3600 * 1000;
  let due = 0;
  let upcomingToday = 0;
  let mastered = 0;
  let learning = 0;
  let startedCount = 0;

  for (let i = 0; i < totalCards; i++) {
    const item = cardProgress[i];
    if (!item) continue;
    startedCount++;

    if (item.nextReviewDate <= now) {
      due++;
    } else if (item.nextReviewDate <= fiveHoursLater) {
      upcomingToday++;
    }

    if (item.status === 'mastered' || item.intervalHours >= 72) {
      mastered++;
    } else {
      learning++;
    }
  }

  return {
    total: totalCards,
    due,
    upcomingToday,
    mastered,
    learning,
    unstarted: Math.max(0, totalCards - startedCount),
  };
}

export function getGenkiSessionQueue(
  cardProgress: Record<number, GenkiCardProgress> | undefined,
  batchSize: number | 'all',
  totalCards: number = GENKI_EXAM_VOCAB.length
): number[] {
  const now = Date.now();
  const progressMap = cardProgress || {};

  // 1. Due cards sorted by nextReviewDate ascending (oldest due first)
  const dueIndices: number[] = [];
  // 2. New / unstarted cards in sequential textbook order 0..114
  const newIndices: number[] = [];
  // 3. Other cards (reviewed but not yet due, for review fallback)
  const scheduledIndices: number[] = [];

  for (let i = 0; i < totalCards; i++) {
    const item = progressMap[i];
    if (!item) {
      newIndices.push(i);
    } else if (item.nextReviewDate <= now) {
      dueIndices.push(i);
    } else {
      scheduledIndices.push(i);
    }
  }

  // Sort dueIndices so the most overdue come first
  dueIndices.sort((a, b) => {
    const timeA = progressMap[a]?.nextReviewDate ?? 0;
    const timeB = progressMap[b]?.nextReviewDate ?? 0;
    return timeA - timeB;
  });

  // Sort scheduledIndices by nextReviewDate
  scheduledIndices.sort((a, b) => {
    const timeA = progressMap[a]?.nextReviewDate ?? 0;
    const timeB = progressMap[b]?.nextReviewDate ?? 0;
    return timeA - timeB;
  });

  // Combined prioritized queue: Due cards first, then new cards
  let queue = [...dueIndices, ...newIndices];

  // If both due and new are empty, fallback to already scheduled cards
  if (queue.length === 0) {
    queue = [...scheduledIndices];
  }

  if (batchSize === 'all') {
    return queue;
  }

  return queue.slice(0, batchSize);
}

