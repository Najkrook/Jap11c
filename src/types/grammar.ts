export type GrammarPartId = 'basics' | 'verbs_tenses' | 'essential' | 'advanced';

export interface GrammarPart {
  id: GrammarPartId;
  partNumber: number;
  titleSv: string;
  titleJap: string;
  descriptionSv: string;
  colorClass: string;
}

export interface GrammarExample {
  japanese: string;
  furigana: string;
  romaji: string;
  translationSv: string;
  literalSv?: string; // Tae Kim's literal structural breakdown
  audioText: string;
}

export interface GrammarQuizQuestion {
  id: string;
  questionSv: string;
  japaneseSnippet?: string;
  options: string[];
  correctIndex: number;
  explanationSv: string;
}

export interface GrammarInflectionTableRow {
  label: string;
  plainPositive: string;
  plainNegative: string;
  politePositive?: string;
  politeNegative?: string;
  noteSv?: string;
}

export interface GrammarInflectionTable {
  title: string;
  descriptionSv?: string;
  headers: string[];
  rows: GrammarInflectionTableRow[];
}

export interface GrammarComparisonItem {
  term: string;
  roleSv: string;
  nuanceSv: string;
  exampleKana: string;
  exampleSv: string;
}

export interface GrammarComparisonBox {
  title: string;
  summarySv: string;
  items: GrammarComparisonItem[];
}

export interface GrammarSectionContent {
  heading: string;
  contentSv: string;
  bulletPoints?: string[];
  subnoteSv?: string;
}

export interface GrammarChapter {
  id: string;
  chapterNumber: number;
  partId: GrammarPartId;
  titleSv: string;
  titleJap: string;
  romajiTitle: string;
  readingTimeMin: number;
  summarySv: string;
  taeKimCoreInsightSv: string;
  ruleFormula?: string;
  sections: GrammarSectionContent[];
  inflectionTable?: GrammarInflectionTable;
  comparisonBox?: GrammarComparisonBox;
  examples: GrammarExample[];
  commonPitfallsSv: string[];
  miniQuiz: GrammarQuizQuestion[];
}

export interface GrammarProgressState {
  completedChapters: string[]; // chapter ids
  quizScores: Record<string, number>; // chapterId -> percentage (0-100)
}
