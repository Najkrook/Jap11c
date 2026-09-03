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
    id: 'hiragana_master',
    title: 'Hiragana-Mästare',
    description: 'Bemästra alla 46 grundläggande Hiragana!',
    icon: 'GraduationCap',
    category: 'general'
  },
  {
    id: 'katakana_first_five',
    title: 'Katakana-Starten',
    description: 'Lär dig de 5 första Katakana-vokalerna (ア イ ウ エ オ).',
    icon: 'Sparkles',
    category: 'srs'
  },
  {
    id: 'katakana_master',
    title: 'Katakana-Mästare',
    description: 'Bemästra alla 46 grundläggande Katakana!',
    icon: 'GraduationCap',
    category: 'general'
  },
  {
    id: 'gairaigo_detective',
    title: 'Låneords-Detektiven',
    description: 'Knäck hemliga låneord i Gairaigo Mystery Decoder!',
    icon: 'Sparkles',
    category: 'game'
  },
  {
    id: 'twin_master',
    title: 'Tvilling-Tämjare',
    description: 'Mästra skillnaden mellan シ/ツ och ソ/ン i Tvillingtränaren!',
    icon: 'Zap',
    category: 'game'
  }
];
