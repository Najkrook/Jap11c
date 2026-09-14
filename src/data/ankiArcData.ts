import type { LucideIcon } from 'lucide-react';
import { 
  Sparkles, 
  Compass, 
  Zap, 
  Flame, 
  Crown, 
  GraduationCap,
  Tv,
  RotateCcw,
  Music
} from 'lucide-react';
import type { AnkiChapter, AnkiDeckMode } from '../types/anki';

export interface AnkiArc {
  id: string;
  arcNumber: number;
  titleSv: string;
  titleJap: string;
  romajiTitle: string;
  descriptionSv: string;
  startChapter: number;      // 1-indexed (e.g. 1)
  endChapter: number;        // 1-indexed (e.g. 35)
  startChapterIndex: number; // 0-indexed (e.g. 0)
  endChapterIndex: number;   // 0-indexed (e.g. 34)
  totalChapters: number;     // e.g. 35
  totalCards: number;        // e.g. 350
  badgeId: string;
  badgeTitle: string;
  badgeJap: string;
  badgeDescription: string;
  iconName: string;
  icon: LucideIcon;
  theme: {
    accentColor: string;     // Tailwind text color
    badgeBg: string;         // Badge background
    badgeBorder: string;     // Badge border
    progressColor: string;   // Progress fill
    borderHighlight: string; // Border when open
  };
}

export const ANKI_ARCS: AnkiArc[] = [
  {
    id: 'arc-1',
    arcNumber: 1,
    titleSv: 'Arc 1: Hälsningar & Grundord',
    titleJap: '挨拶と基本単語',
    romajiTitle: 'Aisatsu to Kihon Tango',
    descriptionSv: 'Hälsningsfraser, personliga pronomen, demonstrativer (kore/sore/are), basala substantiv och vanliga anime-utrop.',
    startChapter: 1,
    endChapter: 35,
    startChapterIndex: 0,
    endChapterIndex: 34,
    totalChapters: 35,
    totalCards: 350,
    badgeId: 'arc_1_master',
    badgeTitle: 'Konnichiwa Master',
    badgeJap: '挨拶マスター',
    badgeDescription: 'Bemästra alla 35 grundkapitel för hälsningar och vardagsord!',
    iconName: 'Sparkles',
    icon: Sparkles,
    theme: {
      accentColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/10',
      badgeBorder: 'border-amber-400/30',
      progressColor: 'bg-amber-500',
      borderHighlight: 'border-amber-400/50',
    }
  },
  {
    id: 'arc-2',
    arcNumber: 2,
    titleSv: 'Arc 2: Basgrammatik & Partiklar',
    titleJap: '基本文法と助詞',
    romajiTitle: 'Kihon Bunpou to Joshi',
    descriptionSv: 'Satsstruktur (SOV), existensverb (iru/aru), artighetsnivå (desu/masu) och de fundamentala partiklarna (wa, ga, o, ni, de, to, mo).',
    startChapter: 36,
    endChapter: 70,
    startChapterIndex: 35,
    endChapterIndex: 69,
    totalChapters: 35,
    totalCards: 350,
    badgeId: 'arc_2_master',
    badgeTitle: 'Partikelkrigare',
    badgeJap: '助詞マスター',
    badgeDescription: 'Bemästra japanskans partiklar och satsuppbyggnad från grunden!',
    iconName: 'Compass',
    icon: Compass,
    theme: {
      accentColor: 'text-sky-600 dark:text-sky-400',
      badgeBg: 'bg-sky-500/10',
      badgeBorder: 'border-sky-400/30',
      progressColor: 'bg-sky-500',
      borderHighlight: 'border-sky-400/50',
    }
  },
  {
    id: 'arc-3',
    arcNumber: 3,
    titleSv: 'Arc 3: Adjektiv & Verbformer',
    titleJap: '形容詞と動詞活用',
    romajiTitle: 'Keiyoushi to Doushi Katsuyou',
    descriptionSv: 'i-/na-adjektiv, ichidan- och godan-verb, verbens Te-form, pågående handling (-te iru) och att prova på saker (-te miru).',
    startChapter: 71,
    endChapter: 105,
    startChapterIndex: 70,
    endChapterIndex: 104,
    totalChapters: 35,
    totalCards: 350,
    badgeId: 'arc_3_master',
    badgeTitle: 'Te-Form Weaver',
    badgeJap: '活用マスター',
    badgeDescription: 'Lär dig binda samman meningar och styra verbens alla former!',
    iconName: 'Zap',
    icon: Zap,
    theme: {
      accentColor: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-500/10',
      badgeBorder: 'border-indigo-400/30',
      progressColor: 'bg-indigo-500',
      borderHighlight: 'border-indigo-400/50',
    }
  },
  {
    id: 'arc-4',
    arcNumber: 4,
    titleSv: 'Arc 4: Satsfogning & Modala uttryck',
    titleJap: '複文と助動詞',
    romajiTitle: 'Fukubun to Jodoushi',
    descriptionSv: 'Bindeord & orsaker (kara, node, noni, kedo), potentialform (dekiru), nödvändighet & tvång (-nakereba naranai) och förslag (-ou).',
    startChapter: 106,
    endChapter: 140,
    startChapterIndex: 105,
    endChapterIndex: 139,
    totalChapters: 35,
    totalCards: 350,
    badgeId: 'arc_4_master',
    badgeTitle: 'Satsbyggare',
    badgeJap: '複文アーキテクト',
    badgeDescription: 'Bygg avancerade sammansatta meningar och uttryck logiska resonemang!',
    iconName: 'Flame',
    icon: Flame,
    theme: {
      accentColor: 'text-orange-600 dark:text-orange-400',
      badgeBg: 'bg-orange-500/10',
      badgeBorder: 'border-orange-400/30',
      progressColor: 'bg-orange-500',
      borderHighlight: 'border-orange-400/50',
    }
  },
  {
    id: 'arc-5',
    arcNumber: 5,
    titleSv: 'Arc 5: Givande, Passiv & Nyanser',
    titleJap: '授受動詞と受身・使役',
    romajiTitle: 'Juju Doushi to Ukemi / Shieki',
    descriptionSv: 'Givande & tagande (ageru, kureru, morau), passiv & kausativ form, råd (-ta hou ga ii) samt överdrifter (-sugiru).',
    startChapter: 141,
    endChapter: 175,
    startChapterIndex: 140,
    endChapterIndex: 174,
    totalChapters: 35,
    totalCards: 350,
    badgeId: 'arc_5_master',
    badgeTitle: 'Nyansmästare',
    badgeJap: 'ニュアンス師匠',
    badgeDescription: 'Hantera sociala relationer, givande, tagande och subtila nyanser!',
    iconName: 'GraduationCap',
    icon: GraduationCap,
    theme: {
      accentColor: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/10',
      badgeBorder: 'border-rose-400/30',
      progressColor: 'bg-rose-500',
      borderHighlight: 'border-rose-400/50',
    }
  },
  {
    id: 'arc-6',
    arcNumber: 6,
    titleSv: 'Arc 6: Fördjupning & Mästarnivå',
    titleJap: 'マスター編: 高度な表現',
    romajiTitle: 'Masutaa-hen: Koudo na Hyougen',
    descriptionSv: 'Förmodanden (you da, rashii, mitai), simultana handlingar (-nagara), talspråkskontraktioner och autentisk anime-dialog.',
    startChapter: 176,
    endChapter: 208,
    startChapterIndex: 175,
    endChapterIndex: 207,
    totalChapters: 33,
    totalCards: 325,
    badgeId: 'arc_6_master',
    badgeTitle: 'Immersion Ace',
    badgeJap: 'アニメマスター',
    badgeDescription: 'Slutför alla 208 anime-kapitel och uppnå full immersion-mästarnivå!',
    iconName: 'Crown',
    icon: Crown,
    theme: {
      accentColor: 'text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-500/10',
      badgeBorder: 'border-purple-400/30',
      progressColor: 'bg-purple-500',
      borderHighlight: 'border-purple-400/50',
    }
  }
];

export function getArcForChapter(chapterIndex: number): AnkiArc | undefined {
  return ANKI_ARCS.find(
    (arc) => chapterIndex >= arc.startChapterIndex && chapterIndex <= arc.endChapterIndex
  );
}

export function getArcChapters(arc: AnkiArc, allChapters: AnkiChapter[]): AnkiChapter[] {
  return allChapters.slice(arc.startChapterIndex, arc.endChapterIndex + 1);
}

export function getArcCompletedCount(arc: AnkiArc, completedIndices: number[]): number {
  if (!completedIndices || completedIndices.length === 0) return 0;
  let count = 0;
  for (let i = arc.startChapterIndex; i <= arc.endChapterIndex; i++) {
    if (completedIndices.includes(i)) count++;
  }
  return count;
}

export type AnkiCategoryType = 'immersion' | 'repetition' | 'exam' | 'music' | 'travel';

export interface AnkiCategoryDeckOption {
  mode: AnkiDeckMode;
  label: string;
  sublabel: string;
  badge?: string;
}

export interface AnkiCategoryDef {
  id: AnkiCategoryType;
  title: string;
  badgeLabel?: string;
  icon: LucideIcon;
  defaultDeck: AnkiDeckMode;
  availableDecks: AnkiCategoryDeckOption[];
}

export const ANKI_CATEGORIES: AnkiCategoryDef[] = [
  {
    id: 'immersion',
    title: 'Anime Immersion',
    badgeLabel: '208 kap',
    icon: Tv,
    defaultDeck: 'anki',
    availableDecks: [
      { mode: 'anki', label: 'Tae Kim Immersion', sublabel: '2 075 kort i 6 arcs' }
    ]
  },
  {
    id: 'repetition',
    title: 'Dagens Repetition',
    badgeLabel: 'SM-2',
    icon: RotateCcw,
    defaultDeck: 'due',
    availableDecks: [
      { mode: 'due', label: 'Förfallna kort', sublabel: 'Spaced repetition' },
      { mode: 'weak', label: 'Svaga kort', sublabel: 'Problemkort & misstag' },
      { mode: 'bookmarks', label: 'Sparade kort', sublabel: '⭐ Favoriter' }
    ]
  },
  {
    id: 'exam',
    title: 'Genki I Tenta',
    badgeLabel: '115 ord',
    icon: GraduationCap,
    defaultDeck: 'genki',
    availableDecks: [
      { mode: 'genki', label: 'Genki I Tentaord', sublabel: 'Kapitel 0, 1 & 2' }
    ]
  },
  {
    id: 'music',
    title: 'City Pop Musik',
    badgeLabel: '124 ord',
    icon: Music,
    defaultDeck: 'stay_with_me',
    availableDecks: [
      { mode: 'stay_with_me', label: 'Stay With Me', sublabel: '松原みき · 54 glosor' },
      { mode: 'plastic_love', label: 'Plastic Love', sublabel: '竹内まりや · 70 glosor' }
    ]
  },
  {
    id: 'travel',
    title: 'Reseguide',
    badgeLabel: '200 fraser',
    icon: Compass,
    defaultDeck: 'words',
    availableDecks: [
      { mode: 'words', label: '100 Reseord', sublabel: 'Viktigaste orden' },
      { mode: 'phrases', label: '100 Resefraser', sublabel: 'Praktiska uttryck' }
    ]
  }
];
