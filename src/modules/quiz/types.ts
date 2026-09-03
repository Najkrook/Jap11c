import type { KanaCharacter } from '../../types/kana';
import type { LearningChapter } from '../../data/learningPathData';

export type QuestionType = 'kana-to-romaji' | 'audio-to-kana' | 'romaji-to-kana' | 'word-meaning';

export interface QuizOption {
  id: string;
  label: string;
  subLabel?: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  targetKanaId: string;
  displayItem: string;
  audioItem?: string;
  options: QuizOption[];
}

export interface TargetWord {
  kana: string;
  romaji: string;
  meaningSv: string;
}

export interface QuizSessionConfig {
  chapter?: LearningChapter;
  kanaList: KanaCharacter[];
  questionCount?: number;
  allowedTypes?: QuestionType[];
  targetWords?: TargetWord[];
}

export interface DistractorOptions {
  count?: number;
  excludeIds?: string[];
  prioritizeLookalikes?: boolean;
}

export interface QuizEvaluationResult {
  scorePercent: number;
  isPassed: boolean;
  stars: number;
  mistakesKanaIds: string[];
  totalAnswered: number;
  correctCount: number;
}
