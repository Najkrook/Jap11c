import type { AnkiCardProgress, GenkiCardProgress, CustomFlashcard } from './anki';

export type ScriptMode = 'hiragana' | 'katakana';

export type KanaGroup = 'gojuon' | 'dakuon' | 'handakuon' | 'yoon' | 'special';

export type KanaRow = 
  | 'vowel' 
  | 'k' | 's' | 't' | 'n' | 'h' | 'm' | 'y' | 'r' | 'w' | 'special_n'
  | 'g' | 'z' | 'd' | 'b' | 'p'
  | 'ky' | 'sh' | 'ch' | 'ny' | 'hy' | 'my' | 'ry' | 'gy' | 'j' | 'by' | 'py'
  | 'special_gairaigo';

export interface MnemonicInfo {
  summary: string;
  summaryEn?: string;
  storySv: string;
  storyEn?: string;
  imageVisualDesc: string;
  keyCue: string;
  keyCueEn?: string;
  svgHint?: string;
}

export interface ExampleWord {
  kana: string;
  kanji?: string;
  romaji: string;
  meaningSv: string;
  meaningEn: string;
  genkiChapter?: number | string;
  pitchAccent?: string; // e.g. [0] heiban, [1] atamadaka
}

export interface KanaCharacter {
  id: string; // e.g. "a", "ka", "kya", "kata_a"
  kana: string; // e.g. "あ", "ア", "か", "カ"
  romaji: string; // e.g. "a", "ka", "kya"
  group: KanaGroup;
  row: KanaRow;
  rowNameSv: string; // e.g. "Vokaler (A-raden)"
  strokeCount: number;
  strokeSvgData?: string[]; // SVG path d strings for each stroke
  mnemonic: MnemonicInfo;
  pronunciationTipSv: string; // Svensk fonetisk jämförelse
  swedishSimilarSound: string; // "Låter som A i 'katt'"
  similarSoundPitfall?: string; // "Förväxla inte med お (o)!"
  exampleWords: ExampleWord[];
  courseStage: number; // 1 = Del 1 (A-Na), 2 = Del 2 (Ha-N & Dakuten)
  script?: ScriptMode;
}

export type SrsRating = 'again' | 'hard' | 'good' | 'easy'; // 1, 2, 3, 4

export interface SrsItemData {
  id: string;
  easeFactor: number; // default 2.5
  interval: number; // in hours or days
  repetitions: number;
  nextReviewDate: number; // timestamp
  lastReviewedDate?: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  consecutiveCorrect: number;
  totalReviews: number;
  totalErrors: number;
}

export interface LessonProgress {
  chapterId: string;
  completed: boolean;
  score: number; // percentage e.g. 80-100
  stars: number; // 0, 1, 2, 3
  bestScore: number;
  lastCompletedDate?: string;
  mistakesKanaIds?: string[];
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  kanaProgress: Record<string, SrsItemData>;
  learningProgress?: Record<string, LessonProgress>;
  highScores: {
    kanaDrop: number;
    speedQuiz: number;
    wordScramble: number;
    shinkansenRush?: number;
    dojoRoguelike?: number;
  };
  unlockedBadges: string[];
  ankiProgress?: Record<string, number[]>;
  ankiCardProgress?: Record<number, AnkiCardProgress>;
  genkiCardProgress?: Record<number, GenkiCardProgress>;
  grammarProgress?: string[];
  ankiBookmarks?: number[];
  studyGuideTasks?: Record<string, boolean>;
  intensiveTasks?: Record<string, boolean>;
  customCards?: CustomFlashcard[];
  customCardProgress?: Record<string, AnkiCardProgress>;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'srs' | 'game' | 'pronunciation' | 'general';
  unlockedAt?: string;
}

export interface ClassroomPhrase {
  id: string;
  japanese: string;
  romaji: string;
  swedish: string;
  context: string;
  speaker: 'sensei' | 'student' | 'both';
  audioNote?: string;
}

export interface StudyWeek {
  weekNumber: number;
  dates: string;
  title: string;
  focus: string;
  genkiChapter: string;
  kanaCovered: string[];
  vocabularyCount: number;
  grammarFocus: string[];
  tasks: { id: string; text: string; doneByDefault?: boolean }[];
}

export interface MinimalPair {
  id: string;
  title: string;
  explanationSv: string;
  pitfall: string;
  item1: {
    kana: string;
    romaji: string;
    meaningSv: string;
    type: string;
  };
  item2: {
    kana: string;
    romaji: string;
    meaningSv: string;
    type: string;
  };
}
