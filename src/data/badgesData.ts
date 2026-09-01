import type { Badge } from '../types/kana';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_five',
    title: 'Första Femman',
    description: 'Lär dig de fem grundvokalerna (あ い う え お) och klara deras första repetition.',
    icon: 'Sparkles',
    category: 'srs'
  },
  {
    id: 'streak_3',
    title: 'Flitig Studerande',
    description: 'Behåll en studiedag-streak på minst 3 dagar i rad.',
    icon: 'Flame',
    category: 'general'
  },
  {
    id: 'game_master_1000',
    title: 'Shinkansen-Förare',
    description: 'Få över 1 000 poäng i Shinkansen Rush.',
    icon: 'Trophy',
    category: 'game'
  },
  {
    id: 'combo_king',
    title: 'Shinkansen-Akrobat',
    description: 'Uppnå en 15x combo i Shinkansen Rush.',
    icon: 'Zap',
    category: 'game'
  },
  {
    id: 'dakuten_pro',
    title: 'Dakuten-Kungen',
    description: 'Lås upp och bemästra alla röstade ljud (GA, ZA, DA, BA, PA).',
    icon: 'CheckCircle2',
    category: 'srs'
  },
  {
    id: 'voice_virtuoso',
    title: 'Uttalsvirtuos',
    description: 'Testa ditt japanska uttal i mikrofonen med godkänd träffsäkerhet.',
    icon: 'Mic',
    category: 'pronunciation'
  },
  {
    id: 'speed_demon',
    title: 'Blixtsnabb Läsare',
    description: 'Klara 20 tecken under 60 sekunder i Snabbtestet.',
    icon: 'Timer',
    category: 'srs'
  },
  {
    id: 'lund_ready',
    title: 'Hiragana-Mästare',
    description: 'Bemästra alla 46 grundläggande Hiragana!',
    icon: 'GraduationCap',
    category: 'general'
  }
];
