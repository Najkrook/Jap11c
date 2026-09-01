import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Shield, 
  Heart, 
  Zap, 
  Sparkles, 
  Flame, 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Sword, 
  ShoppingBag, 
  Coffee, 
  Gift, 
  Compass, 
  Volume2, 
  Crown, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Coins, 
  ChevronRight, 
  Info, 
  Sparkle,
  Target,
  Swords,
  Scroll,
  Plus,
  Play
} from 'lucide-react';
import type { UserStats, KanaCharacter } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { sfx, playJapaneseSpeech } from '../../utils/audio';
import { calculateXpAndLevel, saveUserStats } from '../../utils/srs';
import { fireConfetti, fireSuperCelebration } from '../common/Confetti';

export interface DojoRoguelikeProps {
  userStats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBackToArcade?: () => void;
}

// ============================================================================
// DAKUTEN & HANDAKUTEN MAPPINGS & ELEMENTAL DEFINITIONS
// ============================================================================

interface DakutenTransform {
  toKana: string;
  toRomaji: string;
  element: string;
  elementNameSv: string;
  effectDesc: string;
  damageMultiplier: number;
}

const DAKUTEN_MAP: Record<string, DakutenTransform> = {
  'か': { toKana: 'が', toRomaji: 'ga', element: '⚡', elementNameSv: 'Åska', effectDesc: 'Åskstöt: 2.5x skada + bedövar', damageMultiplier: 2.5 },
  'き': { toKana: 'ぎ', toRomaji: 'gi', element: '⚡', elementNameSv: 'Åska', effectDesc: 'Blixtklinga: 2.5x skada', damageMultiplier: 2.5 },
  'く': { toKana: 'ぐ', toRomaji: 'gu', element: '🪨', elementNameSv: 'Jord', effectDesc: 'Stenkross: 2.5x skada + 5 sköld', damageMultiplier: 2.5 },
  'け': { toKana: 'げ', toRomaji: 'ge', element: '⚡', elementNameSv: 'Åska', effectDesc: 'Elektrisk stöt: 2.5x skada', damageMultiplier: 2.5 },
  'こ': { toKana: 'ご', toRomaji: 'go', element: '🌑', elementNameSv: 'Skugga', effectDesc: 'Mörkerpuls: 2.5x skada', damageMultiplier: 2.5 },
  
  'さ': { toKana: 'ざ', toRomaji: 'za', element: '🌪️', elementNameSv: 'Storm', effectDesc: 'Stormhugg: 2.5x skada', damageMultiplier: 2.5 },
  'し': { toKana: 'じ', toRomaji: 'ji', element: '⚡', elementNameSv: 'Chock', effectDesc: 'Chockvåg: 2.5x skada', damageMultiplier: 2.5 },
  'す': { toKana: 'ず', toRomaji: 'zu', element: '🪨', elementNameSv: 'Skalv', effectDesc: 'Jordskalv: 2.5x skada', damageMultiplier: 2.5 },
  'せ': { toKana: 'ぜ', toRomaji: 'ze', element: '💨', elementNameSv: 'Vind', effectDesc: 'Vindkast: 2.5x skada', damageMultiplier: 2.5 },
  'そ': { toKana: 'ぞ', toRomaji: 'zo', element: '🌑', elementNameSv: 'Skugga', effectDesc: 'Skuggklo: 2.5x skada', damageMultiplier: 2.5 },
  
  'た': { toKana: 'だ', toRomaji: 'da', element: '🛡️', elementNameSv: 'Metall', effectDesc: 'Pansarslag: 2.5x skada + 8 sköld', damageMultiplier: 2.5 },
  'ち': { toKana: 'ぢ', toRomaji: 'ji', element: '🗡️', elementNameSv: 'Stål', effectDesc: 'Genomträngande stöt: 2.5x skada', damageMultiplier: 2.5 },
  'つ': { toKana: 'づ', toRomaji: 'zu', element: '🌊', elementNameSv: 'Flod', effectDesc: 'Flodvirvel: 2.5x skada', damageMultiplier: 2.5 },
  'て': { toKana: 'で', toRomaji: 'de', element: '🥊', elementNameSv: 'Järnhand', effectDesc: 'Järnnäve: 2.5x skada + 5 sköld', damageMultiplier: 2.5 },
  'と': { toKana: 'ど', toRomaji: 'do', element: '💥', elementNameSv: 'Dunder', effectDesc: 'Dundersmäll: 2.5x skada', damageMultiplier: 2.5 },
  
  'は': { toKana: 'ば', toRomaji: 'ba', element: '🔥', elementNameSv: 'Eld', effectDesc: 'Eldexplosion: 2.5x skada', damageMultiplier: 2.5 },
  'ひ': { toKana: 'び', toRomaji: 'bi', element: '☀️', elementNameSv: 'Sol', effectDesc: 'Solstråle: 2.5x skada', damageMultiplier: 2.5 },
  'ふ': { toKana: 'ぶ', toRomaji: 'bu', element: '🌋', elementNameSv: 'Lava', effectDesc: 'Lavasvall: 2.5x skada', damageMultiplier: 2.5 },
  'へ': { toKana: 'べ', toRomaji: 'be', element: '☄️', elementNameSv: 'Meteor', effectDesc: 'Meteorslag: 2.5x skada', damageMultiplier: 2.5 },
  'ほ': { toKana: 'ぼ', toRomaji: 'bo', element: '🌟', elementNameSv: 'Supernova', effectDesc: 'Nova-stöt: 2.5x skada', damageMultiplier: 2.5 }
};

const HANDAKUTEN_MAP: Record<string, DakutenTransform> = {
  'は': { toKana: 'ぱ', toRomaji: 'pa', element: '✨', elementNameSv: 'Kritisk Stjärna', effectDesc: 'Stjärnglans: 3.0x KRITISK skada!', damageMultiplier: 3.0 },
  'ひ': { toKana: 'ぴ', toRomaji: 'pi', element: '✨', elementNameSv: 'Kritisk Ljusstråle', effectDesc: 'Ljusspjut: 3.0x KRITISK skada!', damageMultiplier: 3.0 },
  'ふ': { toKana: 'ぷ', toRomaji: 'pu', element: '🫧', elementNameSv: 'Kritisk Bubbelbarriär', effectDesc: 'Helig Barriär: 3.0x skada + 12 sköld!', damageMultiplier: 3.0 },
  'へ': { toKana: 'ぺ', toRomaji: 'pe', element: '💫', elementNameSv: 'Kritisk Chock', effectDesc: 'Snabbchock: 3.0x KRITISK skada!', damageMultiplier: 3.0 },
  'ほ': { toKana: 'ぽ', toRomaji: 'po', element: '🌸', elementNameSv: 'Kritisk Ande', effectDesc: 'Andlig blomning: 3.0x skada + 10 HP!', damageMultiplier: 3.0 }
};

// ============================================================================
// WORD COMBOS & KANJI JUTSU DICTIONARY
// ============================================================================

interface WordCombo {
  kana: string;
  kanji?: string;
  romaji: string;
  meaningSv: string;
  nameSv: string;
  bonusDamage: number;
  healHp: number;
  bonusShield: number;
  restoreKi: number;
  specialDescription: string;
  color: string;
}

const WORD_COMBOS: WordCombo[] = [
  { kana: 'すし', kanji: '寿司', romaji: 'sushi', meaningSv: 'Sushi', nameSv: 'Sushi-Hugget', bonusDamage: 30, healHp: 12, bonusShield: 0, restoreKi: 0, specialDescription: '+30 skada & +12 HP återställs', color: 'from-amber-500 to-red-500' },
  { kana: 'ねこ', kanji: '猫', romaji: 'neko', meaningSv: 'Katt', nameSv: 'Kattklon', bonusDamage: 35, healHp: 0, bonusShield: 0, restoreKi: 1, specialDescription: '+35 snabb skada & +1 Ki', color: 'from-orange-500 to-amber-400' },
  { kana: 'いぬ', kanji: '犬', romaji: 'inu', meaningSv: 'Hund', nameSv: 'Vaktbettet', bonusDamage: 32, healHp: 0, bonusShield: 10, restoreKi: 0, specialDescription: '+32 skada & +10 Sköld', color: 'from-amber-600 to-yellow-500' },
  { kana: 'さくら', kanji: '桜', romaji: 'sakura', meaningSv: 'Körsbärsblomma', nameSv: 'Körsbärsstormen', bonusDamage: 45, healHp: 8, bonusShield: 15, restoreKi: 0, specialDescription: '+45 skada, +8 HP & +15 Sköld', color: 'from-pink-500 to-rose-400' },
  { kana: 'みず', kanji: '水', romaji: 'mizu', meaningSv: 'Vatten', nameSv: 'Helande Källan', bonusDamage: 25, healHp: 28, bonusShield: 0, restoreKi: 0, specialDescription: '+25 skada & massiv +28 HP Helning!', color: 'from-cyan-500 to-blue-500' },
  { kana: 'はな', kanji: '花', romaji: 'hana', meaningSv: 'Blomma', nameSv: 'Blomsterbarriären', bonusDamage: 28, healHp: 10, bonusShield: 14, restoreKi: 0, specialDescription: '+28 skada & +14 Sköld', color: 'from-emerald-400 to-teal-500' },
  { kana: 'とり', kanji: '鳥', romaji: 'tori', meaningSv: 'Fågel', nameSv: 'Falkdyket', bonusDamage: 36, healHp: 0, bonusShield: 0, restoreKi: 1, specialDescription: '+36 skada & +1 Ki', color: 'from-sky-400 to-indigo-500' },
  { kana: 'あめ', kanji: '雨/飴', romaji: 'ame', meaningSv: 'Regn / Godis', nameSv: 'Söta Regndroppen', bonusDamage: 30, healHp: 14, bonusShield: 5, restoreKi: 0, specialDescription: '+30 skada & +14 HP', color: 'from-blue-400 to-cyan-300' },
  { kana: 'あさ', kanji: '朝', romaji: 'asa', meaningSv: 'Morgon', nameSv: 'Gryningsklingan', bonusDamage: 32, healHp: 0, bonusShield: 18, restoreKi: 0, specialDescription: '+32 skada & +18 Sköld', color: 'from-yellow-400 to-orange-400' },
  { kana: 'いえ', kanji: '家', romaji: 'ie', meaningSv: 'Hus / Hem', nameSv: 'Dojomuren', bonusDamage: 26, healHp: 0, bonusShield: 24, restoreKi: 0, specialDescription: '+26 skada & stark +24 Sköld', color: 'from-amber-700 to-amber-500' },
  { kana: 'やま', kanji: '山', romaji: 'yama', meaningSv: 'Berg', nameSv: 'Bergskrossaren', bonusDamage: 42, healHp: 0, bonusShield: 12, restoreKi: 0, specialDescription: '+42 tung skada & +12 Sköld', color: 'from-stone-600 to-stone-400' },
  { kana: 'かわ', kanji: '川', romaji: 'kawa', meaningSv: 'Flod', nameSv: 'Flodvirveln', bonusDamage: 34, healHp: 0, bonusShield: 10, restoreKi: 1, specialDescription: '+34 skada, +10 Sköld & +1 Ki', color: 'from-cyan-600 to-teal-400' },
  { kana: 'つき', kanji: '月', romaji: 'tsuki', meaningSv: 'Måne', nameSv: 'Månskensglansen', bonusDamage: 38, healHp: 10, bonusShield: 15, restoreKi: 0, specialDescription: '+38 magisk skada & +15 Sköld', color: 'from-indigo-400 to-purple-400' },
  { kana: 'ゆき', kanji: '雪', romaji: 'yuki', meaningSv: 'Snö', nameSv: 'Frostchocken', bonusDamage: 40, healHp: 0, bonusShield: 16, restoreKi: 0, specialDescription: '+40 is-skada & fryser fienden', color: 'from-cyan-300 to-blue-400' },
  { kana: 'かぜ', kanji: '風', romaji: 'kaze', meaningSv: 'Vind', nameSv: 'Vindstöten', bonusDamage: 36, healHp: 0, bonusShield: 0, restoreKi: 1, specialDescription: '+36 skada & ger +1 Ki', color: 'from-teal-400 to-emerald-400' },
  { kana: 'うmi', kanji: '海', romaji: 'umi', meaningSv: 'Hav', nameSv: 'Tidvattensvågen', bonusDamage: 44, healHp: 12, bonusShield: 12, restoreKi: 0, specialDescription: '+44 vatten-skada & balanserar Ki', color: 'from-blue-600 to-indigo-600' },
  { kana: 'ほし', kanji: '星', romaji: 'hoshi', meaningSv: 'Stjärna', nameSv: 'Stjärnfallet', bonusDamage: 46, healHp: 0, bonusShield: 15, restoreKi: 0, specialDescription: '+46 kosmisk skada', color: 'from-amber-400 to-purple-500' },
  { kana: 'せんせい', kanji: '先生', romaji: 'sensei', meaningSv: 'Lärare / Mästare', nameSv: 'Mästarens Visdom', bonusDamage: 55, healHp: 25, bonusShield: 20, restoreKi: 1, specialDescription: 'Legendarisk kombo: +55 skada, +25 HP, +20 Sköld & +1 Ki!', color: 'from-brand-gold to-amber-600' },
  { kana: 'ともだち', kanji: '友達', romaji: 'tomodachi', meaningSv: 'Vän', nameSv: 'Vänskapsbandet', bonusDamage: 50, healHp: 20, bonusShield: 25, restoreKi: 0, specialDescription: '+50 skada, +20 HP & +25 Sköld', color: 'from-emerald-500 to-teal-400' },
  { kana: 'がくせい', kanji: '学生', romaji: 'gakusei', meaningSv: 'Student', nameSv: 'Flitig Studerande', bonusDamage: 42, healHp: 0, bonusShield: 15, restoreKi: 1, specialDescription: '+42 skada & återställer energi', color: 'from-blue-500 to-cyan-400' },
  { kana: 'にほん', kanji: '日本', romaji: 'nihon', meaningSv: 'Japan', nameSv: 'Soluppgångens Rike', bonusDamage: 52, healHp: 18, bonusShield: 18, restoreKi: 0, specialDescription: '+52 helig skada & +18 HP', color: 'from-red-500 to-amber-400' },
  { kana: 'ありがとう', kanji: '有難う', romaji: 'arigatou', meaningSv: 'Tack', nameSv: 'Tacksamhetens Välsignelse', bonusDamage: 65, healHp: 30, bonusShield: 30, restoreKi: 2, specialDescription: 'Gudomlig kombo: +65 skada, +30 HP, +30 Sköld & full Ki!', color: 'from-amber-400 via-rose-500 to-purple-600' },
  { kana: 'おはよう', kanji: 'お早う', romaji: 'ohayou', meaningSv: 'God Morgon', nameSv: 'Gryningsljus', bonusDamage: 40, healHp: 12, bonusShield: 15, restoreKi: 0, specialDescription: '+40 skada & +15 Sköld', color: 'from-orange-400 to-yellow-400' },
  { kana: 'こんにちは', kanji: '今日は', romaji: 'konnichiwa', meaningSv: 'God Dag / Hej', nameSv: 'Middagssolens Kraft', bonusDamage: 48, healHp: 16, bonusShield: 16, restoreKi: 0, specialDescription: '+48 skada & +16 HP', color: 'from-amber-500 to-emerald-500' },
  { kana: 'さようなら', kanji: '左様なら', romaji: 'sayounara', meaningSv: 'Farväl', nameSv: 'Avskedsklingan', bonusDamage: 60, healHp: 0, bonusShield: 0, restoreKi: 1, specialDescription: '+60 monumental skada & +1 Ki', color: 'from-purple-600 to-rose-600' },
  { kana: 'て', kanji: '手', romaji: 'te', meaningSv: 'Hand', nameSv: 'Karate-hugget', bonusDamage: 14, healHp: 0, bonusShield: 6, restoreKi: 0, specialDescription: '+14 snabb skada & +6 Sköld', color: 'from-stone-500 to-amber-600' },
  { kana: 'め', kanji: '目', romaji: 'me', meaningSv: 'Öga', nameSv: 'Örnögat', bonusDamage: 15, healHp: 0, bonusShield: 0, restoreKi: 0, specialDescription: '+15 skada & ökad precision', color: 'from-sky-500 to-blue-600' },
  { kana: 'き', kanji: '木/気', romaji: 'ki', meaningSv: 'Träd / Energi', nameSv: 'Ki-Fokus', bonusDamage: 16, healHp: 6, bonusShield: 0, restoreKi: 1, specialDescription: '+16 skada & +1 Ki', color: 'from-emerald-500 to-green-600' },
  { kana: 'ひ', kanji: '火', romaji: 'hi', meaningSv: 'Eld', nameSv: 'Eldgnistan', bonusDamage: 20, healHp: 0, bonusShield: 0, restoreKi: 0, specialDescription: '+20 ren eldskada', color: 'from-red-600 to-orange-500' },
  { kana: 'いち', kanji: '一', romaji: 'ichi', meaningSv: 'Ett (1)', nameSv: 'Första Hugget', bonusDamage: 22, healHp: 0, bonusShield: 8, restoreKi: 0, specialDescription: '+22 skada & +8 Sköld', color: 'from-blue-400 to-indigo-500' },
  { kana: 'に', kanji: '二', romaji: 'ni', meaningSv: 'Två (2)', nameSv: 'Dubbelstöten', bonusDamage: 24, healHp: 0, bonusShield: 0, restoreKi: 0, specialDescription: '+24 skada', color: 'from-cyan-500 to-blue-500' },
  { kana: 'さん', kanji: '三', romaji: 'san', meaningSv: 'Tre (3)', nameSv: 'Tredje Gardet', bonusDamage: 28, healHp: 0, bonusShield: 12, restoreKi: 0, specialDescription: '+28 skada & +12 Sköld', color: 'from-emerald-500 to-teal-500' },
  { kana: 'よん', kanji: '四', romaji: 'yon', meaningSv: 'Fyra (4)', nameSv: 'Fyrpunkts-stöt', bonusDamage: 32, healHp: 0, bonusShield: 10, restoreKi: 0, specialDescription: '+32 skada & +10 Sköld', color: 'from-purple-500 to-pink-500' },
  { kana: 'ご', kanji: '五', romaji: 'go', meaningSv: 'Fem (5)', nameSv: 'Fem Elements Kross', bonusDamage: 36, healHp: 10, bonusShield: 10, restoreKi: 0, specialDescription: '+36 skada & +10 HP & +10 Sköld', color: 'from-amber-500 to-red-500' }
];

// ============================================================================
// 10 YOKAI FLOORS & BOSSES
// ============================================================================

export interface YokaiEnemy {
  id: string;
  floorNumber: number;
  nameSv: string;
  jpName: string;
  titleSv: string;
  avatar: string;
  maxHp: number;
  currentHp: number;
  baseAttack: number;
  intent: string;
  intentDamage: number;
  weaknessHint: string;
  weaknessKana: string[];
  description: string;
  isBoss: boolean;
  rewardGold: number;
  rewardXp: number;
}

const YOKAI_FLOORS: Omit<YokaiEnemy, 'currentHp' | 'intentDamage'>[] = [
  {
    id: 'kodama',
    floorNumber: 1,
    nameSv: 'Kodama (Trädande)',
    jpName: '木霊 (こだま)',
    titleSv: 'Dojons Viskande Naturande',
    avatar: '🌲',
    maxHp: 40,
    baseAttack: 7,
    intent: 'Viskande Grenar',
    weaknessHint: 'Svag mot grundvokaler (あ, い, う, え, お)',
    weaknessKana: ['あ', 'い', 'う', 'え', 'お'],
    description: 'En liten skygg trädande som skyddar dojons ingångsportar med kvistar och löv.',
    isBoss: false,
    rewardGold: 15,
    rewardXp: 40
  },
  {
    id: 'chibi-kitsune',
    floorNumber: 2,
    nameSv: 'Chibi Kitsune (Rävande)',
    jpName: '子狐 (こぎつね)',
    titleSv: 'Den Listiga Eldräven',
    avatar: '🦊',
    maxHp: 55,
    baseAttack: 9,
    intent: 'Räveld & Skuggsteg',
    weaknessHint: 'Svag mot K-raden (か, き, く, け, こ)',
    weaknessKana: ['か', 'き', 'く', 'け', 'こ'],
    description: 'En busig räv med en brinnande svansspets som leker med illusioner.',
    isBoss: false,
    rewardGold: 20,
    rewardXp: 55
  },
  {
    id: 'tanuki',
    floorNumber: 3,
    nameSv: 'Busig Tanuki',
    jpName: '悪戯狸 (たぬき)',
    titleSv: 'Mårdhunden från Bambuskogen',
    avatar: '🦝',
    maxHp: 70,
    baseAttack: 11,
    intent: 'Lövförvandling & Kullerbytta',
    weaknessHint: 'Svag mot S-raden (さ, し, す, せ, そ)',
    weaknessKana: ['さ', 'し', 'す', 'せ', 'そ'],
    description: 'En skämtsam mårdhund som förvandlar stenar till kaffekannor och kastar ekollon.',
    isBoss: false,
    rewardGold: 28,
    rewardXp: 70
  },
  {
    id: 'kappa',
    floorNumber: 4,
    nameSv: 'Kappa (Vattenande)',
    jpName: '河童 (かっぱ)',
    titleSv: 'Dammsjöns Väktare',
    avatar: '🥒',
    maxHp: 85,
    baseAttack: 13,
    intent: 'Vattenstråle & Skål-sköld',
    weaknessHint: 'Svag mot T-raden (た, ち, つ, て, と) eller ordet "みず"',
    weaknessKana: ['た', 'ち', 'つ', 'て', 'と', 'みず'],
    description: 'En grön vattenvarelse med en skål på huvudet. Älskar gurkor och kampsport!',
    isBoss: false,
    rewardGold: 35,
    rewardXp: 90
  },
  {
    id: 'aka-oni',
    floorNumber: 5,
    nameSv: 'Mid-Boss: Aka-Oni (Röd Demon)',
    jpName: '赤鬼 (あかおに)',
    titleSv: 'Mittentemplets Järnportvakt',
    avatar: '👹',
    maxHp: 135,
    baseAttack: 17,
    intent: 'Järnklubbans Dunderkross',
    weaknessHint: 'Svag mot Dakuten (゛) & Ordkombos ("さくら", "いぬ", "すし")',
    weaknessKana: ['が', 'ざ', 'だ', 'ば', 'ぱ', 'さくら', 'いぬ', 'すし'],
    description: 'En väldig hornbeprydd röd demon som vaktar bron till dojons inre helgedomar.',
    isBoss: true,
    rewardGold: 60,
    rewardXp: 160
  },
  {
    id: 'tengu',
    floorNumber: 6,
    nameSv: 'Krigar-Tengu (Kråkman)',
    jpName: '天狗 (てんぐ)',
    titleSv: 'Vindarnas Mästarkrigare',
    avatar: '👺',
    maxHp: 110,
    baseAttack: 15,
    intent: 'Virvelvind & Solfjädershugg',
    weaknessHint: 'Svag mot H-raden (は, ひ, ふ, へ, ほ) & Handakuten (゜)',
    weaknessKana: ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
    description: 'En stolt krigare med lång näsa och vingar som behärskar vindens skarpaste klingor.',
    isBoss: false,
    rewardGold: 45,
    rewardXp: 120
  },
  {
    id: 'yuki-onna',
    floorNumber: 7,
    nameSv: 'Yuki-Onna (Snödrottning)',
    jpName: '雪女 (ゆきおんな)',
    titleSv: 'Frostbergets Ande',
    avatar: '❄️',
    maxHp: 125,
    baseAttack: 18,
    intent: 'Bitande Isvind & Frostkristall',
    weaknessHint: 'Svag mot M-raden (ま, み, む, め, も) & Eld-ord ("ひ")',
    weaknessKana: ['ま', 'み', 'む', 'め', 'も', 'ひ'],
    description: 'En vacker men iskall ande som fyller dojon med virvlande snöstormar.',
    isBoss: false,
    rewardGold: 50,
    rewardXp: 140
  },
  {
    id: 'raijin',
    floorNumber: 8,
    nameSv: 'Åskguden Raijin',
    jpName: '雷神 (らいじん)',
    titleSv: 'Himmelens Trumslagare',
    avatar: '⚡',
    maxHp: 155,
    baseAttack: 21,
    intent: 'Åsktrummans Vrede & Blixtnät',
    weaknessHint: 'Svag mot R-raden (ら, り, る, れ, ろ) & Dakuten',
    weaknessKana: ['ら', 'り', 'る', 'れ', 'ろ', 'が', 'ぎ', 'ぐ', 'げ', 'ご'],
    description: 'Guden som framkallar blixt och dunder genom att slå på sin cirkel av heliga taiko-trummor.',
    isBoss: false,
    rewardGold: 65,
    rewardXp: 180
  },
  {
    id: 'fujin',
    floorNumber: 9,
    nameSv: 'Vindguden Fujin',
    jpName: '風神 (ふうじん)',
    titleSv: 'Stormsäckens Härskare',
    avatar: '🌪️',
    maxHp: 170,
    baseAttack: 23,
    intent: 'Tyfonkross & Tornado-hugg',
    weaknessHint: 'Svag mot Y-raden (や, ゆ, よ) & 3+ bokstävers ord',
    weaknessKana: ['や', 'ゆ', 'よ', 'ともだち', 'せんせい', 'ありがとう'],
    description: 'Guden som håller himlens vindar fångade i sin stora lädersäck och släpper lös stormar.',
    isBoss: false,
    rewardGold: 75,
    rewardXp: 210
  },
  {
    id: 'ryujin',
    floorNumber: 10,
    nameSv: 'Slutboss: Tempeldraken Ryūjin',
    jpName: '龍神 (りゅうじん)',
    titleSv: 'Dojons Uråldriga Väktardrake',
    avatar: '🐉',
    maxHp: 240,
    baseAttack: 26,
    intent: 'Drakeld & Kosmisk Pärlstorm',
    weaknessHint: 'Svag mot Mästarkombos ("せんせい", "ありがとう", "にほん", Dakuten)',
    weaknessKana: ['せんせい', 'ありがとう', 'にほん', 'が', 'ざ', 'だ', 'ば', 'ぱ'],
    description: 'Den uråldriga draken som vakar över Hiraganans allra heligaste hemligheter. Endast en sann mästare kan vinna hans respekt!',
    isBoss: true,
    rewardGold: 150,
    rewardXp: 400
  }
];

// ============================================================================
// RELICS DEFINITIONS
// ============================================================================

export interface Relic {
  id: string;
  nameSv: string;
  jpName: string;
  icon: string;
  description: string;
  price: number;
}

const ALL_RELICS: Relic[] = [
  { id: 'sake-cup', nameSv: 'Sake-bägaren', jpName: 'お酒の杯', icon: '🍶', description: '+25% extra skada vid ordbildning och kombos', price: 40 },
  { id: 'kitsune-mask', nameSv: 'Kitsune-masken', jpName: '狐の面', icon: '🦊', description: 'Återställ 10 HP efter varje avklarad strid', price: 45 },
  { id: 'tengu-feather', nameSv: 'Tengu-fjädern', jpName: '天狗の羽', icon: '🪶', description: '+1 Max Ki / Energi varje runda', price: 60 },
  { id: 'daruma-doll', nameSv: 'Daruma-dockan', jpName: '達磨', icon: '🧿', description: 'Överlev ett dödligt slag med 1 HP (1 gång)', price: 50 },
  { id: 'maneki-neko', nameSv: 'Maneki-Neko', jpName: '招き猫', icon: '🐱', description: '+50% mer Koban-guld från besegrade fiender', price: 35 },
  { id: 'magatama', nameSv: 'Magatama-amuletten', jpName: '勾玉', icon: '💎', description: '+25 Max HP och återställer 25 HP direkt', price: 45 },
  { id: 'bonsai-shield', nameSv: 'Bonsai-skölden', jpName: '盆栽の盾', icon: '🪴', description: 'Starta varje strid med +10 gratis Sköld', price: 40 },
  { id: 'calligraphy-brush', nameSv: 'Kalligrafipenseln', jpName: '筆 (ふで)', icon: '🖌️', description: 'Dra 6 kort till handen istället för 5', price: 55 }
];

// ============================================================================
// CARD MODEL & HELPER FUNCTIONS
// ============================================================================

export interface HandCard {
  id: string; // unique card id in hand
  charId: string; // kana id in HIRAGANA_DATA
  kana: string;
  romaji: string;
  baseDamage: number;
  kiCost: number;
  isDakuten: boolean;
  isHandakuten: boolean;
  runeApplied: null | 'dakuten' | 'handakuten';
  elementIcon?: string;
  elementName?: string;
  specialDesc?: string;
  mnemonicSummary: string;
  soundHint: string;
}

function generateRandomHandCard(relics: string[]): HandCard {
  // Pick from gojuon characters in HIRAGANA_DATA
  const gojuonList = HIRAGANA_DATA.filter(k => k.group === 'gojuon');
  const picked = gojuonList[Math.floor(Math.random() * gojuonList.length)];
  
  const baseDmg = 9 + Math.floor(Math.random() * 4); // 9-12
  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    charId: picked.id,
    kana: picked.kana,
    romaji: picked.romaji,
    baseDamage: baseDmg,
    kiCost: 1,
    isDakuten: false,
    isHandakuten: false,
    runeApplied: null,
    mnemonicSummary: picked.mnemonic?.summary || 'Tänk på formen!',
    soundHint: picked.swedishSimilarSound || picked.pronunciationTipSv || ''
  };
}

// Generate multiple cards
function drawHandCards(count: number, relics: string[]): HandCard[] {
  const cards: HandCard[] = [];
  for (let i = 0; i < count; i++) {
    cards.push(generateRandomHandCard(relics));
  }
  return cards;
}

// Helper to check if card can take Dakuten
function canTakeDakuten(card: HandCard): boolean {
  return !card.isDakuten && !card.isHandakuten && !!DAKUTEN_MAP[card.kana];
}

// Helper to check if card can take Handakuten
function canTakeHandakuten(card: HandCard): boolean {
  return !card.isDakuten && !card.isHandakuten && !!HANDAKUTEN_MAP[card.kana];
}

// ============================================================================
// GAME STATES & NODE TYPES
// ============================================================================

export type GamePhase = 
  | 'intro'
  | 'combat'
  | 'parry'
  | 'map'
  | 'teahouse'
  | 'merchant'
  | 'treasure'
  | 'victory'
  | 'gameover';

export interface CombatLogEntry {
  id: string;
  timestamp: number;
  text: string;
  type: 'player' | 'enemy' | 'combo' | 'rune' | 'heal' | 'shield' | 'parry' | 'info';
}

// ============================================================================
// COMPONENT MAIN
// ============================================================================

export const DojoRoguelike: React.FC<DojoRoguelikeProps> = ({
  userStats,
  onUpdateStats,
  onBackToArcade
}) => {
  // Game session states
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentFloorIdx, setCurrentFloorIdx] = useState<number>(0);
  
  // Player RPG stats
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(100);
  const [playerShield, setPlayerShield] = useState<number>(0);
  const [playerKi, setPlayerKi] = useState<number>(3);
  const [gold, setGold] = useState<number>(30);
  const [dakutenRunes, setDakutenRunes] = useState<number>(2);
  const [handakutenRunes, setHandakutenRunes] = useState<number>(1);
  const [ownedRelics, setOwnedRelics] = useState<string[]>([]);
  const [darumaUsed, setDarumaUsed] = useState<boolean>(false);
  
  // Hand & Selection
  const [hand, setHand] = useState<HandCard[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [selectedRuneType, setSelectedRuneType] = useState<null | 'dakuten' | 'handakuten'>(null);
  
  // Current Enemy
  const [enemy, setEnemy] = useState<YokaiEnemy | null>(null);
  const [enemyShield, setEnemyShield] = useState<number>(0);
  const [enemyStunned, setEnemyStunned] = useState<boolean>(false);
  
  // Parry challenge
  const [parryKana, setParryKana] = useState<KanaCharacter | null>(null);
  const [parryOptions, setParryOptions] = useState<string[]>([]);
  const [parryTimeLeft, setParryTimeLeft] = useState<number>(4);
  const parryTimerRef = useRef<number | null>(null);

  // Combat Log & Visual Banner
  const [combatLogs, setCombatLogs] = useState<CombatLogEntry[]>([]);
  const [activeComboBanner, setActiveComboBanner] = useState<WordCombo | null>(null);
  const [damagePopups, setDamagePopups] = useState<{ id: string; target: 'player' | 'enemy'; text: string; isCrit?: boolean; isHeal?: boolean }[]>([]);
  
  // Run statistics
  const [runStats, setRunStats] = useState<{
    floorsCleared: number;
    monstersDefeated: number;
    wordsFormed: string[];
    runesUsed: number;
    parriesSuccess: number;
    totalDamageDealt: number;
    score: number;
  }>({
    floorsCleared: 0,
    monstersDefeated: 0,
    wordsFormed: [],
    runesUsed: 0,
    parriesSuccess: 0,
    totalDamageDealt: 0,
    score: 0
  });

  const [hoveredCard, setHoveredCard] = useState<HandCard | null>(null);

  // Add a combat log
  const addLog = useCallback((text: string, type: CombatLogEntry['type']) => {
    setCombatLogs(prev => [
      { id: `${Date.now()}-${Math.random()}`, timestamp: Date.now(), text, type },
      ...prev.slice(0, 30)
    ]);
  }, []);

  // Show a floating damage or heal popup
  const showPopup = useCallback((target: 'player' | 'enemy', text: string, isCrit = false, isHeal = false) => {
    const id = `pop-${Date.now()}-${Math.random()}`;
    setDamagePopups(prev => [...prev, { id, target, text, isCrit, isHeal }]);
    setTimeout(() => {
      setDamagePopups(prev => prev.filter(p => p.id !== id));
    }, 1500);
  }, []);

  // Active Relic Helper
  const hasRelic = useCallback((relicId: string) => ownedRelics.includes(relicId), [ownedRelics]);

  // Hand card count (6 if calligraphy brush, else 5)
  const handSize = useMemo(() => {
    return hasRelic('calligraphy-brush') ? 6 : 5;
  }, [hasRelic]);

  // Max Ki calculation (includes Tengu feather)
  const maxKi = useMemo(() => {
    return 3 + (hasRelic('tengu-feather') ? 1 : 0);
  }, [hasRelic]);

  // ============================================================================
  // START NEW RUN & FLOORS
  // ============================================================================

  const startNewRun = () => {
    sfx.playClick();
    sfx.playSwordSlash();
    
    setPlayerHp(100);
    setPlayerMaxHp(100);
    setPlayerShield(0);
    setPlayerKi(3);
    setGold(25);
    setDakutenRunes(2);
    setHandakutenRunes(1);
    setOwnedRelics([]);
    setDarumaUsed(false);
    setCurrentFloorIdx(0);
    
    setRunStats({
      floorsCleared: 0,
      monstersDefeated: 0,
      wordsFormed: [],
      runesUsed: 0,
      parriesSuccess: 0,
      totalDamageDealt: 0,
      score: 0
    });
    
    setCombatLogs([]);
    startFloor(0, []);
  };

  const startFloor = (floorIdx: number, currentRelics: string[]) => {
    const rawFloor = YOKAI_FLOORS[floorIdx];
    const initialIntentDmg = rawFloor.baseAttack + Math.floor(Math.random() * 4);
    
    const newEnemy: YokaiEnemy = {
      ...rawFloor,
      currentHp: rawFloor.maxHp,
      intentDamage: initialIntentDmg
    };
    
    setEnemy(newEnemy);
    setEnemyShield(0);
    setEnemyStunned(false);
    setCurrentFloorIdx(floorIdx);
    
    // Draw fresh hand
    const initialHand = drawHandCards(hasRelic('calligraphy-brush') ? 6 : 5, currentRelics);
    setHand(initialHand);
    setSelectedCardIds([]);
    setSelectedRuneType(null);
    
    // Reset round ki and apply bonsai shield
    const startShield = hasRelic('bonsai-shield') ? 10 : 0;
    setPlayerShield(startShield);
    setPlayerKi(3 + (currentRelics.includes('tengu-feather') ? 1 : 0));
    
    setPhase('combat');
    addLog(`⛩️ Du kliver in på Våning ${floorIdx + 1}: ${newEnemy.nameSv}!`, 'info');
    if (startShield > 0) {
      addLog(`🪴 Bonsai-skölden ger dig +10 Sköld vid stridens start!`, 'shield');
    }
  };

  // ============================================================================
  // WORD COMBO DETECTION
  // ============================================================================

  // Get selected cards in exact click order
  const selectedCards = useMemo(() => {
    return selectedCardIds.map(id => hand.find(c => c.id === id)!).filter(Boolean);
  }, [selectedCardIds, hand]);

  // Combined Kana string of selected cards
  const selectedKanaSequence = useMemo(() => {
    return selectedCards.map(c => c.kana).join('');
  }, [selectedCards]);

  // Detected Word Combo
  const detectedWordCombo = useMemo(() => {
    if (selectedCards.length < 1) return null;
    const match = WORD_COMBOS.find(w => w.kana === selectedKanaSequence);
    return match || null;
  }, [selectedKanaSequence, selectedCards]);

  // Total Ki cost of selected cards
  const selectedKiCost = useMemo(() => {
    return selectedCards.reduce((acc, c) => acc + c.kiCost, 0);
  }, [selectedCards]);

  // Total calculated damage for selected cards
  const calculatedAttack = useMemo(() => {
    if (selectedCards.length === 0) return { damage: 0, isCombo: false, bonusShield: 0, heal: 0, restoreKi: 0 };
    
    let rawDamage = selectedCards.reduce((sum, c) => {
      let cardDmg = c.baseDamage;
      if (c.isDakuten) cardDmg = Math.round(cardDmg * 2.5);
      if (c.isHandakuten) cardDmg = Math.round(cardDmg * 3.0);
      
      // Weakness multiplier
      if (enemy && enemy.weaknessKana.includes(c.kana)) {
        cardDmg = Math.round(cardDmg * 1.5);
      }
      return sum + cardDmg;
    }, 0);

    let bonusShield = 0;
    let heal = 0;
    let restoreKi = 0;

    // Relic: Sake-bägaren bonus
    const hasSake = hasRelic('sake-cup');

    if (detectedWordCombo) {
      let comboBonus = detectedWordCombo.bonusDamage;
      if (hasSake) comboBonus = Math.round(comboBonus * 1.25);
      
      rawDamage += comboBonus;
      bonusShield += detectedWordCombo.bonusShield;
      heal += detectedWordCombo.healHp;
      restoreKi += detectedWordCombo.restoreKi;

      // Enemy weakness to word?
      if (enemy && enemy.weaknessKana.includes(detectedWordCombo.kana)) {
        rawDamage = Math.round(rawDamage * 1.3);
      }
    } else if (selectedCards.length >= 3 && hasSake) {
      rawDamage = Math.round(rawDamage * 1.25);
    }

    return {
      damage: rawDamage,
      isCombo: !!detectedWordCombo,
      bonusShield,
      heal,
      restoreKi
    };
  }, [selectedCards, detectedWordCombo, enemy, hasRelic]);

  // ============================================================================
  // CARD INTERACTION & RUNE ATTACHMENT
  // ============================================================================

  const handleCardClick = (card: HandCard) => {
    sfx.playClick();

    // If a rune is currently selected, try applying it to this card!
    if (selectedRuneType) {
      if (selectedRuneType === 'dakuten') {
        if (canTakeDakuten(card)) {
          applyDakutenRune(card.id);
        } else {
          sfx.playMiss();
          addLog(`Tecknet ${card.kana} kan inte ta Dakuten (゛). Välj ett tecken från K, S, T eller H-raderna!`, 'info');
        }
      } else if (selectedRuneType === 'handakuten') {
        if (canTakeHandakuten(card)) {
          applyHandakutenRune(card.id);
        } else {
          sfx.playMiss();
          addLog(`Tecknet ${card.kana} kan inte ta Handakuten (゜). Välj ett tecken från H-raden (は, ひ, ふ, へ, ほ)!`, 'info');
        }
      }
      setSelectedRuneType(null);
      return;
    }

    // Toggle selection
    if (selectedCardIds.includes(card.id)) {
      setSelectedCardIds(prev => prev.filter(id => id !== card.id));
    } else {
      setSelectedCardIds(prev => [...prev, card.id]);
      // Play pronunciation on select
      playJapaneseSpeech(card.kana);
    }
  };

  const applyDakutenRune = (cardId: string) => {
    if (dakutenRunes <= 0) return;
    
    setHand(prev => prev.map(c => {
      if (c.id === cardId && DAKUTEN_MAP[c.kana]) {
        const trans = DAKUTEN_MAP[c.kana];
        sfx.playMagicCast();
        showPopup('player', `⚡ ${trans.toKana} (+2.5x)`, true);
        addLog(`✨ Dakuten-Runa fästes på ${c.kana}! Transformerades till ${trans.toKana} (${trans.toRomaji}) med ${trans.elementNameSv}-kraft!`, 'rune');
        return {
          ...c,
          kana: trans.toKana,
          romaji: trans.toRomaji,
          isDakuten: true,
          runeApplied: 'dakuten',
          elementIcon: trans.element,
          elementName: trans.elementNameSv,
          specialDesc: trans.effectDesc,
          baseDamage: Math.round(c.baseDamage * trans.damageMultiplier)
        };
      }
      return c;
    }));
    
    setDakutenRunes(prev => Math.max(0, prev - 1));
    setRunStats(prev => ({ ...prev, runesUsed: prev.runesUsed + 1 }));
  };

  const applyHandakutenRune = (cardId: string) => {
    if (handakutenRunes <= 0) return;
    
    setHand(prev => prev.map(c => {
      if (c.id === cardId && HANDAKUTEN_MAP[c.kana]) {
        const trans = HANDAKUTEN_MAP[c.kana];
        sfx.playMagicCast();
        showPopup('player', `✨ ${trans.toKana} (+3.0x KRIT)`, true);
        addLog(`🌸 Handakuten-Runa fästes på ${c.kana}! Transformerades till ${trans.toKana} (${trans.toRomaji}) med ${trans.elementNameSv}!`, 'rune');
        return {
          ...c,
          kana: trans.toKana,
          romaji: trans.toRomaji,
          isHandakuten: true,
          runeApplied: 'handakuten',
          elementIcon: trans.element,
          elementName: trans.elementNameSv,
          specialDesc: trans.effectDesc,
          baseDamage: Math.round(c.baseDamage * trans.damageMultiplier)
        };
      }
      return c;
    }));
    
    setHandakutenRunes(prev => Math.max(0, prev - 1));
    setRunStats(prev => ({ ...prev, runesUsed: prev.runesUsed + 1 }));
  };

  // ============================================================================
  // EXECUTE ATTACK & PLAY CARDS
  // ============================================================================

  const handlePlaySelectedCards = () => {
    if (selectedCards.length === 0 || !enemy) return;
    if (playerKi < selectedKiCost) {
      sfx.playMiss();
      addLog(`Inte tillräckligt med Ki! Du behöver ${selectedKiCost} Ki men har bara ${playerKi}.`, 'info');
      return;
    }

    // Deduct Ki
    setPlayerKi(prev => Math.max(0, prev - selectedKiCost));

    const { damage, isCombo, bonusShield, heal, restoreKi } = calculatedAttack;

    // Trigger sounds & effects
    if (isCombo && detectedWordCombo) {
      sfx.playMagicCast();
      sfx.playSwordSlash();
      playJapaneseSpeech(detectedWordCombo.kana);
      setActiveComboBanner(detectedWordCombo);
      setTimeout(() => setActiveComboBanner(null), 3000);
      
      addLog(`🔥 ORDBILDNING: 「${detectedWordCombo.kana}」 (${detectedWordCombo.romaji} • ${detectedWordCombo.meaningSv})! ${detectedWordCombo.nameSv} aktiveras för ${damage} skada!`, 'combo');
      
      setRunStats(prev => ({
        ...prev,
        wordsFormed: [...prev.wordsFormed, detectedWordCombo.kana]
      }));
    } else {
      sfx.playSwordSlash();
      addLog(`⚔️ Du anfaller med [${selectedCards.map(c => c.kana).join(', ')}] och gör ${damage} skada!`, 'player');
    }

    // Apply heal
    if (heal > 0) {
      sfx.playHeal();
      setPlayerHp(prev => Math.min(playerMaxHp, prev + heal));
      showPopup('player', `+${heal} HP`, false, true);
      addLog(`💖 Helande effekt återställer ${heal} HP!`, 'heal');
    }

    // Apply shield
    if (bonusShield > 0) {
      setPlayerShield(prev => prev + bonusShield);
      showPopup('player', `+${bonusShield} Sköld`);
      addLog(`🛡️ Du bygger upp +${bonusShield} Sköld!`, 'shield');
    }

    // Restore Ki
    if (restoreKi > 0) {
      setPlayerKi(prev => Math.min(maxKi, prev + restoreKi));
      addLog(`⚡ Energi återställd: +${restoreKi} Ki!`, 'info');
    }

    // Apply Damage to Enemy
    let remainingDamage = damage;
    let updatedEnemyShield = enemyShield;
    
    if (updatedEnemyShield > 0) {
      if (remainingDamage <= updatedEnemyShield) {
        updatedEnemyShield -= remainingDamage;
        remainingDamage = 0;
      } else {
        remainingDamage -= updatedEnemyShield;
        updatedEnemyShield = 0;
      }
      setEnemyShield(updatedEnemyShield);
    }

    const newEnemyHp = Math.max(0, enemy.currentHp - remainingDamage);
    setEnemy(prev => prev ? { ...prev, currentHp: newEnemyHp } : null);
    showPopup('enemy', `-${damage}`, isCombo);
    
    setRunStats(prev => ({
      ...prev,
      totalDamageDealt: prev.totalDamageDealt + damage
    }));

    // Discard played cards and draw replacements
    const remainingHand = hand.filter(c => !selectedCardIds.includes(c.id));
    const newCardsToDraw = handSize - remainingHand.length;
    const drawn = drawHandCards(newCardsToDraw, ownedRelics);
    setHand([...remainingHand, ...drawn]);
    setSelectedCardIds([]);

    // Check if Enemy Defeated
    if (newEnemyHp <= 0) {
      handleEnemyDefeated();
      return;
    }
  };

  // ============================================================================
  // ENEMY DEFEAT & REWARDS
  // ============================================================================

  const handleEnemyDefeated = () => {
    if (!enemy) return;

    sfx.playMonsterHit();
    sfx.playLevelUp();
    
    if (enemy.isBoss) {
      fireSuperCelebration();
    } else {
      fireConfetti();
    }

    // Gold & XP calculation (Maneki-Neko relic bonus)
    const goldMultiplier = hasRelic('maneki-neko') ? 1.5 : 1.0;
    const earnedGold = Math.round(enemy.rewardGold * goldMultiplier);
    const earnedXp = enemy.rewardXp;

    setGold(prev => prev + earnedGold);
    sfx.playCoin();

    // Kitsune mask relic heal
    if (hasRelic('kitsune-mask')) {
      const maskHeal = 10;
      setPlayerHp(prev => Math.min(playerMaxHp, prev + maskHeal));
      addLog(`🦊 Kitsune-masken återställer ${maskHeal} HP efter segern!`, 'heal');
    }

    // Rune drops (chance)
    const gotDakuten = Math.random() < 0.65;
    const gotHandakuten = Math.random() < 0.35 || enemy.isBoss;
    
    if (gotDakuten) setDakutenRunes(prev => prev + 1);
    if (gotHandakuten) setHandakutenRunes(prev => prev + 1);

    addLog(`🏆 SEGER! Du besegrade ${enemy.nameSv}! Du fann ${earnedGold} Koban-guld och +${earnedXp} XP!`, 'info');
    if (gotDakuten) addLog(`📜 Du fann en Dakuten-runa (゛)!`, 'rune');
    if (gotHandakuten) addLog(`🌸 Du fann en sällsynt Handakuten-runa (゜)!`, 'rune');

    // Update run stats
    const updatedCleared = currentFloorIdx + 1;
    const updatedScore = runStats.score + (currentFloorIdx + 1) * 200 + earnedGold * 2;
    
    setRunStats(prev => ({
      ...prev,
      floorsCleared: updatedCleared,
      monstersDefeated: prev.monstersDefeated + 1,
      score: updatedScore
    }));

    // Check if Final Boss Cleared (Floor 10)
    if (currentFloorIdx >= 9) {
      handleFinalVictory(updatedScore, earnedXp);
      return;
    }

    // Go to Dojo Map / Path Selection
    setTimeout(() => {
      setPhase('map');
    }, 1800);
  };

  // ============================================================================
  // FINAL VICTORY & GAME OVER STATS SAVE
  // ============================================================================

  const handleFinalVictory = (finalScore: number, finalXp: number) => {
    setPhase('victory');
    sfx.playLevelUp();
    fireSuperCelebration();

    // XP and High Score update
    const totalEarnedXp = finalXp + 250;
    const { newXp, newLevel } = calculateXpAndLevel(userStats.xp, totalEarnedXp);
    
    const currentHigh = userStats.highScores.dojoRoguelike || 0;
    const newHigh = Math.max(currentHigh, finalScore);
    
    const updatedStats: UserStats = {
      ...userStats,
      xp: newXp,
      level: newLevel,
      highScores: {
        ...userStats.highScores,
        dojoRoguelike: newHigh
      }
    };

    saveUserStats(updatedStats);
    onUpdateStats(updatedStats);
  };

  const handleGameOver = () => {
    setPhase('gameover');
    sfx.playGameOver();

    const finalScore = runStats.score + runStats.monstersDefeated * 100 + runStats.wordsFormed.length * 50;
    const earnedXp = Math.max(20, runStats.monstersDefeated * 35);
    const { newXp, newLevel } = calculateXpAndLevel(userStats.xp, earnedXp);

    const currentHigh = userStats.highScores.dojoRoguelike || 0;
    const newHigh = Math.max(currentHigh, finalScore);

    const updatedStats: UserStats = {
      ...userStats,
      xp: newXp,
      level: newLevel,
      highScores: {
        ...userStats.highScores,
        dojoRoguelike: newHigh
      }
    };

    saveUserStats(updatedStats);
    onUpdateStats(updatedStats);
  };

  // ============================================================================
  // DEFENSIVE PARRY TURN (ENEMY ATTACK & COUNTER)
  // ============================================================================

  const handleEndTurn = () => {
    if (!enemy) return;

    // If enemy is stunned, skip attack!
    if (enemyStunned) {
      addLog(`🌀 ${enemy.nameSv} är bedövad och kan inte anfalla denna tur!`, 'info');
      setEnemyStunned(false);
      // Next player turn reset
      setPlayerKi(maxKi);
      return;
    }

    // Pick a random Kana from HIRAGANA_DATA for parry defense
    const randomKana = HIRAGANA_DATA[Math.floor(Math.random() * HIRAGANA_DATA.length)];
    
    // Generate 3 wrong options
    const otherKanas = HIRAGANA_DATA.filter(k => k.id !== randomKana.id);
    const shuffledOthers = [...otherKanas].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [randomKana.romaji, ...shuffledOthers.map(o => o.romaji)].sort(() => Math.random() - 0.5);

    setParryKana(randomKana);
    setParryOptions(options);
    setParryTimeLeft(4);
    setPhase('parry');

    // Announce enemy incoming attack
    addLog(`⚠️ ${enemy.nameSv} förbereder: "${enemy.intent}" (${enemy.intentDamage} skada)! Identifiera tecknet för att PARERA!`, 'enemy');

    // Start 4s timer
    if (parryTimerRef.current) clearInterval(parryTimerRef.current);
    
    let secondsLeft = 4;
    parryTimerRef.current = window.setInterval(() => {
      secondsLeft -= 1;
      setParryTimeLeft(secondsLeft);
      if (secondsLeft <= 0) {
        if (parryTimerRef.current) clearInterval(parryTimerRef.current);
        handleParryAnswer(null); // Time ran out
      }
    }, 1000);
  };

  const handleParryAnswer = (selectedRomaji: string | null) => {
    if (parryTimerRef.current) {
      clearInterval(parryTimerRef.current);
      parryTimerRef.current = null;
    }

    const isSuccess = parryKana && selectedRomaji === parryKana.romaji;

    if (!enemy) return;

    setTimeout(() => {
      if (isSuccess) {
        // Successful Parry!
        sfx.playCatch();
        sfx.playSwordSlash();
        
        const counterDamage = 14;
        const reducedIncoming = Math.max(0, Math.floor(enemy.intentDamage * 0.4));
        
        addLog(`⚔️ PERFEKT PARERING! Du identifierade 「${parryKana?.kana}」 (${parryKana?.romaji})! Skadan reducerades med 60% och du gör en motattack på ${counterDamage} skada!`, 'parry');
        showPopup('enemy', `-${counterDamage} KONTRA!`, true);
        
        // Counter damage to enemy
        const newEnemyHp = Math.max(0, enemy.currentHp - counterDamage);
        setEnemy(prev => prev ? { ...prev, currentHp: newEnemyHp } : null);

        setRunStats(prev => ({
          ...prev,
          parriesSuccess: prev.parriesSuccess + 1,
          totalDamageDealt: prev.totalDamageDealt + counterDamage
        }));

        if (newEnemyHp <= 0) {
          handleEnemyDefeated();
          return;
        }

        // Apply remaining reduced incoming damage
        applyIncomingDamage(reducedIncoming);
      } else {
        // Failed Parry / Miss
        sfx.playMiss();
        sfx.playMonsterHit();
        addLog(`💥 Pareringen misslyckades! Tecknet var 「${parryKana?.kana}」 (${parryKana?.romaji}). Du tar full skada (${enemy.intentDamage})!`, 'enemy');
        applyIncomingDamage(enemy.intentDamage);
      }

      // Reset for next turn
      setPhase('combat');
      setPlayerKi(maxKi);
      
      // Calculate next intent for enemy
      const nextDmg = enemy.baseAttack + Math.floor(Math.random() * 5);
      setEnemy(prev => prev ? { ...prev, intentDamage: nextDmg } : null);
    }, 1200);
  };

  const applyIncomingDamage = (rawDmg: number) => {
    let currentShield = playerShield;
    let actualHpLoss = rawDmg;

    if (currentShield > 0) {
      if (actualHpLoss <= currentShield) {
        currentShield -= actualHpLoss;
        actualHpLoss = 0;
      } else {
        actualHpLoss -= currentShield;
        currentShield = 0;
      }
      setPlayerShield(currentShield);
    }

    if (actualHpLoss > 0) {
      showPopup('player', `-${actualHpLoss}`, false);
      setPlayerHp(prev => {
        const nextHp = prev - actualHpLoss;
        if (nextHp <= 0) {
          // Check Daruma Doll relic
          if (hasRelic('daruma-doll') && !darumaUsed) {
            setDarumaUsed(true);
            sfx.playMagicCast();
            addLog(`🧿 DARUMA-DOCKAN RÄDDAR DIG! Du överlever med 1 HP!`, 'heal');
            showPopup('player', 'DARUMA RÄDDNING! (1 HP)', true);
            return 1;
          }
          handleGameOver();
          return 0;
        }
        return nextHp;
      });
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (parryTimerRef.current) clearInterval(parryTimerRef.current);
    };
  }, []);

  // ============================================================================
  // TEAHOUSE & REST NODE
  // ============================================================================

  const handleTeahouseOption = (option: 'matcha' | 'meditate' | 'calligraphy') => {
    sfx.playClick();
    if (option === 'matcha') {
      sfx.playHeal();
      const healed = 40;
      setPlayerHp(prev => Math.min(playerMaxHp, prev + healed));
      addLog(`🍵 Du njuter av en varm skål matcha-te och återställer ${healed} HP!`, 'heal');
    } else if (option === 'meditate') {
      sfx.playMagicCast();
      setPlayerMaxHp(prev => prev + 15);
      setPlayerHp(prev => prev + 15);
      setDakutenRunes(prev => prev + 1);
      addLog(`🧘 Djup meditation över tecknens rötter: +15 Max HP och +1 Dakuten-runa erhålls!`, 'info');
    } else if (option === 'calligraphy') {
      sfx.playMagicCast();
      setHandakutenRunes(prev => prev + 1);
      setDakutenRunes(prev => prev + 1);
      addLog(`🖌️ Kalligrafi-fokus: Du mästrar penseln och erhåller 1 Dakuten (゛) och 1 Handakuten (゜) runa!`, 'rune');
    }
    
    // Proceed to next floor
    startFloor(currentFloorIdx + 1, ownedRelics);
  };

  // ============================================================================
  // TANUKI MERCHANT SHOP NODE
  // ============================================================================

  const handleBuyRelic = (relic: Relic) => {
    if (gold < relic.price || ownedRelics.includes(relic.id)) {
      sfx.playMiss();
      return;
    }
    sfx.playCoin();
    sfx.playMagicCast();
    setGold(prev => prev - relic.price);
    setOwnedRelics(prev => [...prev, relic.id]);
    
    if (relic.id === 'magatama') {
      setPlayerMaxHp(prev => prev + 25);
      setPlayerHp(prev => prev + 25);
    }
    addLog(`🦝 Tanuki-handlaren överlämnar ${relic.nameSv} (${relic.jpName}) till dig!`, 'info');
  };

  const handleBuyRune = (type: 'dakuten' | 'handakuten') => {
    const cost = type === 'dakuten' ? 25 : 40;
    if (gold < cost) {
      sfx.playMiss();
      return;
    }
    sfx.playCoin();
    sfx.playMagicCast();
    setGold(prev => prev - cost);
    if (type === 'dakuten') {
      setDakutenRunes(prev => prev + 1);
      addLog(`📜 Du köpte 1 Dakuten-runa (゛) för ${cost} Koban!`, 'rune');
    } else {
      setHandakutenRunes(prev => prev + 1);
      addLog(`🌸 Du köpte 1 Handakuten-runa (゜) för ${cost} Koban!`, 'rune');
    }
  };

  const handleBuyHeal = () => {
    const cost = 30;
    if (gold < cost) {
      sfx.playMiss();
      return;
    }
    sfx.playCoin();
    sfx.playHeal();
    setGold(prev => prev - cost);
    const healAmount = 50;
    setPlayerHp(prev => Math.min(playerMaxHp, prev + healAmount));
    addLog(`♨️ Onsen-elixiret helar dig för +${healAmount} HP!`, 'heal');
  };

  // ============================================================================
  // TREASURE CHEST NODE
  // ============================================================================

  const handleOpenTreasure = (choice: 'gold' | 'runes' | 'relic') => {
    sfx.playCoin();
    sfx.playLevelUp();
    
    if (choice === 'gold') {
      const bonusGold = 50 + Math.floor(Math.random() * 30);
      setGold(prev => prev + bonusGold);
      addLog(`🎁 Du öppnade tempelkistan och fann en stor skatt på ${bonusGold} Koban-guld!`, 'info');
    } else if (choice === 'runes') {
      setDakutenRunes(prev => prev + 2);
      setHandakutenRunes(prev => prev + 1);
      addLog(`🎁 Tempelkistan lyste upp: Du erhöll 2 Dakuten-runor och 1 Handakuten-runa!`, 'rune');
    } else if (choice === 'relic') {
      const unowned = ALL_RELICS.filter(r => !ownedRelics.includes(r.id));
      if (unowned.length > 0) {
        const randomRelic = unowned[Math.floor(Math.random() * unowned.length)];
        setOwnedRelics(prev => [...prev, randomRelic.id]);
        addLog(`🎁 Tempelkistan innehöll den sällsynta reliken: ${randomRelic.nameSv} (${randomRelic.jpName})!`, 'info');
      } else {
        setGold(prev => prev + 60);
        addLog(`🎁 Du fann 60 Koban-guld!`, 'info');
      }
    }

    // Proceed to next floor
    startFloor(currentFloorIdx + 1, ownedRelics);
  };

  // ============================================================================
  // RENDER: INTRO VIEW
  // ============================================================================

  if (phase === 'intro') {
    const highScore = userStats.highScores.dojoRoguelike || 0;
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-sumi-950 via-slate-950 to-sumi-900 border-2 border-amber-500/40 text-white p-8 sm:p-10 shadow-2xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-xs font-black tracking-widest uppercase">
                <Sparkles size={14} />
                <span>ROGUE-RPG • HIRAGANA QUEST</span>
              </div>

              {onBackToArcade && (
                <button
                  onClick={onBackToArcade}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sumi-900 border border-slate-700 hover:border-slate-500 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm"
                >
                  <ArrowLeft size={14} />
                  <span>Tillbaka till Arkaden</span>
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center gap-3">
                  <span>Dojo Roguelike</span>
                  <span className="text-2xl sm:text-3xl font-jp text-amber-400 font-normal">ひらがなクエスト</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Träd in i den legendariska Hiragana-dojon. Klättra 10 våningar, bekämpa mytologiska Yokai-monster med kraftfulla Kana-kort, fäst Dakuten-runor och bygg autentiska japanska ordkombinationer för massiv magisk skada!
                </p>
              </div>

              <div className="bg-sumi-900/90 border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center backdrop-blur-md min-w-[180px]">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-2xl mb-2">
                  🏆
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Högsta Rekord</div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                  {highScore > 0 ? `${highScore.toLocaleString()} p` : '–'}
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-sumi-900/80 border border-slate-800 space-y-1.5">
                <div className="text-2xl">📜</div>
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">Dakuten-Runor (゛ / ゜)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transformera grundkort (か + ゛ = が) för 2.5x–3.0x förstärkt elementärskada!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sumi-900/80 border border-slate-800 space-y-1.5">
                <div className="text-2xl">🍣</div>
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">Ordbildnings-Combos</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bilda riktiga ord som すし, ねこ, さくら, みず för helning, sköldar och talat uttal!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sumi-900/80 border border-slate-800 space-y-1.5">
                <div className="text-2xl">⚔️</div>
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">Parera Yokai-Attacker</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Identifiera fiendens kastade tecken på tid för att halvera skadan och kontra!
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={startNewRun}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-linear-to-r from-amber-500 via-amber-400 to-yellow-500 text-sumi-950 font-black text-base hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sword size={20} className="stroke-[2.5]" />
                <span>STARTA ÄVENTYRET</span>
                <ChevronRight size={20} />
              </button>
              
              <div className="text-xs text-slate-400 font-medium">
                10 Våningar • 2 Bossar • Reliker & Tehus
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: COMBAT & PARRY VIEW
  // ============================================================================

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 select-none animate-fadeIn">
      {/* ============================================================ */}
      {/* TOP BAR: FLOOR, HP, SHIELD, KI, GOLD, RUNES */}
      {/* ============================================================ */}
      <div className="bg-sumi-950/90 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Floor badge & Back button */}
        <div className="flex items-center gap-3">
          {onBackToArcade && (
            <button
              onClick={onBackToArcade}
              className="p-2 rounded-xl bg-sumi-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-xs cursor-pointer"
              title="Tillbaka till Arkaden"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-gold">
              Dojo Nivå {currentFloorIdx + 1}/10
            </div>
            <div className="text-base font-black text-white flex items-center gap-2">
              <span>{enemy?.nameSv || 'Dojo Rum'}</span>
              {enemy?.isBoss && (
                <span className="px-2 py-0.5 rounded-full bg-red-600/30 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider animate-pulse">
                  BOSS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Player Resources Status */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Player HP */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-sm">
              <Heart size={16} className="fill-rose-500" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">HP</div>
              <div className="text-sm font-black text-rose-400 font-mono">
                {playerHp}/{playerMaxHp}
              </div>
            </div>
          </div>

          {/* Player Shield */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
              <Shield size={16} className="fill-blue-500/40" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Sköld</div>
              <div className="text-sm font-black text-blue-400 font-mono">
                {playerShield}
              </div>
            </div>
          </div>

          {/* Player Ki / Energy */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              <Zap size={16} className="fill-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Ki Energi</div>
              <div className="text-sm font-black text-amber-400 font-mono flex items-center gap-1">
                {Array.from({ length: maxKi }).map((_, i) => (
                  <span key={i} className={`inline-block w-2.5 h-2.5 rounded-full ${i < playerKi ? 'bg-amber-400 shadow-sm shadow-amber-400/80' : 'bg-slate-700'}`} />
                ))}
                <span className="ml-1 text-xs">({playerKi}/{maxKi})</span>
              </div>
            </div>
          </div>

          {/* Gold Koban */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 font-bold text-sm">
              <Coins size={16} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Koban</div>
              <div className="text-sm font-black text-yellow-400 font-mono">
                {gold} 🪙
              </div>
            </div>
          </div>
        </div>

        {/* Right: Runes Inventory */}
        <div className="flex items-center gap-2">
          {/* Dakuten Rune Button */}
          <button
            onClick={() => {
              if (dakutenRunes > 0) {
                sfx.playClick();
                setSelectedRuneType(selectedRuneType === 'dakuten' ? null : 'dakuten');
              }
            }}
            disabled={dakutenRunes <= 0}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-black ${
              selectedRuneType === 'dakuten'
                ? 'bg-amber-500 text-sumi-950 border-amber-400 scale-105 shadow-md shadow-amber-500/30 animate-pulse'
                : dakutenRunes > 0
                ? 'bg-sumi-900 text-amber-400 border-amber-500/40 hover:border-amber-400 cursor-pointer'
                : 'bg-sumi-900/40 text-slate-600 border-slate-800 opacity-60 cursor-not-allowed'
            }`}
            title="Klicka och klicka sedan på ett kort (K, S, T, H-rad) för att fästa Dakuten (+2.5x skada)!"
          >
            <span className="text-sm font-jp">゛</span>
            <span>Dakuten ({dakutenRunes})</span>
          </button>

          {/* Handakuten Rune Button */}
          <button
            onClick={() => {
              if (handakutenRunes > 0) {
                sfx.playClick();
                setSelectedRuneType(selectedRuneType === 'handakuten' ? null : 'handakuten');
              }
            }}
            disabled={handakutenRunes <= 0}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-black ${
              selectedRuneType === 'handakuten'
                ? 'bg-rose-500 text-white border-rose-400 scale-105 shadow-md shadow-rose-500/30 animate-pulse'
                : handakutenRunes > 0
                ? 'bg-sumi-900 text-rose-400 border-rose-500/40 hover:border-rose-400 cursor-pointer'
                : 'bg-sumi-900/40 text-slate-600 border-slate-800 opacity-60 cursor-not-allowed'
            }`}
            title="Klicka och klicka sedan på ett kort från H-raden för att fästa Handakuten (+3.0x Kritisk skada)!"
          >
            <span className="text-sm font-jp">゜</span>
            <span>Handakuten ({handakutenRunes})</span>
          </button>
        </div>
      </div>

      {/* Rune Selection Active Help Banner */}
      {selectedRuneType && (
        <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400 animate-spin" />
            <span>
              {selectedRuneType === 'dakuten'
                ? 'Välj ett kort i handen från K, S, T eller H-raden för att fästa Dakuten (゛) och förvandla det!'
                : 'Välj ett kort i handen från H-raden (は, ひ, ふ, へ, ほ) för att fästa Handakuten (゜) och ge 3.0x KRIT!'}
            </span>
          </div>
          <button
            onClick={() => setSelectedRuneType(null)}
            className="px-2 py-0.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-[11px] font-black cursor-pointer"
          >
            Avbryt
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAP / REST / MERCHANT / TREASURE / VICTORY / GAMEOVER VIEWS */}
      {/* ============================================================ */}

      {phase === 'map' && (
        <div className="bg-sumi-950 border border-slate-800 rounded-3xl p-8 space-y-6 text-center animate-fadeIn shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-xs font-black uppercase">
            <Compass size={14} />
            <span>DOJO-KARTAN • VÄGVAL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Välj Nästa Väg i Dojon
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Våning {currentFloorIdx + 1} är renad! Välj vilken väg du vill ta vidare genom dojons kammare.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto pt-4">
            {/* Battle Option */}
            <button
              onClick={() => {
                sfx.playClick();
                startFloor(currentFloorIdx + 1, ownedRelics);
              }}
              className="group p-6 rounded-3xl bg-sumi-900 border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all text-left space-y-3 cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                ⚔️
              </div>
              <div>
                <div className="text-[10px] font-black text-red-400 uppercase tracking-wider">Möt Nästa Yokai</div>
                <h3 className="text-lg font-black text-white group-hover:text-red-400 transition-colors">
                  Våning {currentFloorIdx + 2}: {YOKAI_FLOORS[currentFloorIdx + 1]?.nameSv || 'Tempelstrid'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kliv rakt in i nästa strid för Koban-guld, XP och chans på heliga runor.
                </p>
              </div>
            </button>

            {/* Teahouse Option */}
            <button
              onClick={() => {
                sfx.playClick();
                setPhase('teahouse');
              }}
              className="group p-6 rounded-3xl bg-sumi-900 border-2 border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-left space-y-3 cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🍵
              </div>
              <div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Tehus & Meditation</div>
                <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                  Ocha Zen-Kammaren
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Drick varmt matcha-te för att hela HP eller meditera för permanenta uppgraderingar.
                </p>
              </div>
            </button>

            {/* Merchant / Treasure Option */}
            {currentFloorIdx % 2 === 0 ? (
              <button
                onClick={() => {
                  sfx.playClick();
                  setPhase('merchant');
                }}
                className="group p-6 rounded-3xl bg-sumi-900 border-2 border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 transition-all text-left space-y-3 cursor-pointer shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🦝
                </div>
                <div>
                  <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Handelsman</div>
                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                    Tanuki-Shopen
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Handla kraftfulla reliker, helande Onsen-elixir och runor för ditt Koban-guld.
                  </p>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  sfx.playClick();
                  setPhase('treasure');
                }}
                className="group p-6 rounded-3xl bg-sumi-900 border-2 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 transition-all text-left space-y-3 cursor-pointer shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  🎁
                </div>
                <div>
                  <div className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Skattkammare</div>
                  <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors">
                    Yokai Tempelkista
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Öppna en gyllene tempelkista och välj guld, sällsynta runor eller reliker.
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'teahouse' && (
        <div className="bg-sumi-950 border border-emerald-500/40 rounded-3xl p-8 space-y-6 text-center animate-fadeIn shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase">
            <Coffee size={14} />
            <span>OCHA TEHUS • VILA & MEDITATION</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Dojons Tehus: Vila Din Ande
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Doften av färskt matcha och rökelse fyller rummet. Välj hur du vill förbereda dig inför nästa våning.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto pt-4">
            <button
              onClick={() => handleTeahouseOption('matcha')}
              className="p-6 rounded-3xl bg-sumi-900 border-2 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/15 transition-all text-left space-y-3 cursor-pointer"
            >
              <div className="text-3xl">🍵</div>
              <h3 className="text-base font-black text-emerald-400">Drick Grönt Matcha-Te</h3>
              <p className="text-xs text-slate-300">
                Återställer <strong className="text-emerald-400">+40 HP</strong> omedelbart till din livsmätare.
              </p>
            </button>

            <button
              onClick={() => handleTeahouseOption('meditate')}
              className="p-6 rounded-3xl bg-sumi-900 border-2 border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/15 transition-all text-left space-y-3 cursor-pointer"
            >
              <div className="text-3xl">🧘</div>
              <h3 className="text-base font-black text-amber-400">Meditera över Tecknen</h3>
              <p className="text-xs text-slate-300">
                Öka din <strong className="text-amber-400">+15 Max HP</strong> permanent och få <strong className="text-amber-400">+1 Dakuten-runa</strong>.
              </p>
            </button>

            <button
              onClick={() => handleTeahouseOption('calligraphy')}
              className="p-6 rounded-3xl bg-sumi-900 border-2 border-purple-500/40 hover:border-purple-400 hover:bg-purple-500/15 transition-all text-left space-y-3 cursor-pointer"
            >
              <div className="text-3xl">🖌️</div>
              <h3 className="text-base font-black text-purple-400">Kalligrafi-Träning</h3>
              <p className="text-xs text-slate-300">
                Få <strong className="text-purple-400">+1 Dakuten</strong> och <strong className="text-rose-400">+1 Handakuten</strong> runa!
              </p>
            </button>
          </div>
        </div>
      )}

      {phase === 'merchant' && (
        <div className="bg-sumi-950 border border-amber-500/40 rounded-3xl p-8 space-y-6 animate-fadeIn shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-3xl">
                🦝
              </div>
              <div>
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Tanuki Handlaren</div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Shopen i Bambulunden</h2>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-sumi-900 border border-amber-500/30 text-amber-400 font-mono font-black text-sm">
              <Coins size={16} />
              <span>Ditt Guld: {gold} Koban</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            "Välkommen, krigare! Mina reliker har välsignats av skogens Kami. Vad önskar du byta mot ditt guld?"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Onsen Elixir */}
            <div className="p-4 rounded-2xl bg-sumi-900 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">♨️</span>
                  <span className="text-xs font-black text-amber-400 font-mono">30 🪙</span>
                </div>
                <h4 className="text-sm font-black text-white mt-2">Onsen-Elixir</h4>
                <p className="text-xs text-slate-400 mt-1">Återställ +50 HP direkt.</p>
              </div>
              <button
                onClick={handleBuyHeal}
                disabled={gold < 30}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-sumi-950 font-black text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Köp (30 🪙)
              </button>
            </div>

            {/* Dakuten Rune */}
            <div className="p-4 rounded-2xl bg-sumi-900 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-jp text-amber-400 font-black">゛</span>
                  <span className="text-xs font-black text-amber-400 font-mono">25 🪙</span>
                </div>
                <h4 className="text-sm font-black text-white mt-2">Dakuten-Runa</h4>
                <p className="text-xs text-slate-400 mt-1">+1 Dakuten (゛) för 2.5x kortförstärkning.</p>
              </div>
              <button
                onClick={() => handleBuyRune('dakuten')}
                disabled={gold < 25}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-sumi-950 font-black text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Köp (25 🪙)
              </button>
            </div>

            {/* Handakuten Rune */}
            <div className="p-4 rounded-2xl bg-sumi-900 border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-jp text-rose-400 font-black">゜</span>
                  <span className="text-xs font-black text-amber-400 font-mono">40 🪙</span>
                </div>
                <h4 className="text-sm font-black text-white mt-2">Handakuten-Runa</h4>
                <p className="text-xs text-slate-400 mt-1">+1 Handakuten (゜) för 3.0x KRIT på H-raden.</p>
              </div>
              <button
                onClick={() => handleBuyRune('handakuten')}
                disabled={gold < 40}
                className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Köp (40 🪙)
              </button>
            </div>
          </div>

          {/* Relics for Sale */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Sällsynta Reliker</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {ALL_RELICS.map(relic => {
                const owned = ownedRelics.includes(relic.id);
                return (
                  <div key={relic.id} className="p-3.5 rounded-2xl bg-sumi-900 border border-slate-800 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{relic.icon}</span>
                        <span className="text-[11px] font-bold font-mono text-amber-400">
                          {owned ? 'ÄGD' : `${relic.price} 🪙`}
                        </span>
                      </div>
                      <div className="text-xs font-black text-white mt-1">{relic.nameSv}</div>
                      <div className="text-[10px] font-jp text-slate-400">{relic.jpName}</div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{relic.description}</p>
                    </div>
                    <button
                      onClick={() => handleBuyRelic(relic)}
                      disabled={owned || gold < relic.price}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition-all ${
                        owned
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                          : gold >= relic.price
                          ? 'bg-amber-500 hover:bg-amber-400 text-sumi-950 cursor-pointer'
                          : 'bg-sumi-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {owned ? 'Köpt' : `Köp (${relic.price} 🪙)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                sfx.playClick();
                startFloor(currentFloorIdx + 1, ownedRelics);
              }}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-sumi-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Gå Vidare till Våning {currentFloorIdx + 2}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {phase === 'treasure' && (
        <div className="bg-sumi-950 border border-purple-500/40 rounded-3xl p-8 space-y-6 text-center animate-fadeIn shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-black uppercase">
            <Gift size={14} />
            <span>YOKAI TEMPELKISTA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            En Gyllene Tempelkista Uppenbarar Sig!
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Välj vilken tempelskatt du vill öppna ur kistan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto pt-4">
            <button
              onClick={() => handleOpenTreasure('gold')}
              className="p-6 rounded-3xl bg-sumi-900 border-2 border-yellow-500/40 hover:border-yellow-400 hover:bg-yellow-500/15 transition-all text-left space-y-3 cursor-pointer"
            >
              <div className="text-3xl">🪙</div>
              <h3 className="text-base font-black text-yellow-400">Guldskatt (+50–80 Koban)</h3>
              <p className="text-xs text-slate-300">
                Fyll din kappsäck med glänsande guldmynt för att handla hos Tanuki-handlaren.
              </p>
            </button>

            <button
              onClick={() => handleOpenTreasure('runes')}
              className="p-6 rounded-3xl bg-sumi-900 border-2 border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/15 transition-all text-left space-y-3 cursor-pointer"
            >
              <div className="text-3xl">📜</div>
              <h3 className="text-base font-black text-amber-400">Runpaket (+2 Dakuten, +1 Handakuten)</h3>
              <p className="text-xs text-slate-300">
                Samla heliga runor för att transformera dina kort till förödande elementärkrafter.
              </p>
            </button>

            <button
              onClick={() => handleOpenTreasure('relic')}
              className="p-6 rounded-3xl bg-sumi-900 border-2 border-purple-500/40 hover:border-purple-400 hover:bg-purple-500/15 transition-all text-left space-y-3 cursor-pointer"
            >
              <div className="text-3xl">💎</div>
              <h3 className="text-base font-black text-purple-400">Sällsynt Mystisk Relik</h3>
              <p className="text-xs text-slate-300">
                Lås upp en slumpmässig kraftfull passiv artefakt direkt till ditt inventarium.
              </p>
            </button>
          </div>
        </div>
      )}

      {phase === 'victory' && (
        <div className="bg-sumi-950 border-2 border-amber-500/60 rounded-3xl p-8 sm:p-10 space-y-6 text-center animate-fadeIn shadow-2xl max-w-3xl mx-auto">
          <div className="text-6xl animate-bounce">🐉</div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-xs font-black tracking-widest uppercase">
            <Crown size={16} />
            <span>FULLSTÄNDIG SEGER • DOJO-MÄSTARE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Du Har Besegrat Tempeldraken Ryūjin!
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Dojons uråldriga mästare bugar inför din fulländade Hiragana-visdom. Du har bemästrat alla 10 våningar, runor och ordkombinationer!
          </p>

          {/* Stats summary grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-sumi-900/90 border border-slate-800 rounded-2xl p-4 text-left">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Slutpoäng</div>
              <div className="text-xl font-black text-amber-400 font-mono">{runStats.score.toLocaleString()} p</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Besegrade Yokai</div>
              <div className="text-xl font-black text-white font-mono">{runStats.monstersDefeated}/10</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Bildade Ord</div>
              <div className="text-xl font-black text-pink-400 font-mono">{runStats.wordsFormed.length}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Pareringar</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{runStats.parriesSuccess}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={startNewRun}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-sumi-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw size={16} />
              <span>SPELA IGEN</span>
            </button>
            {onBackToArcade && (
              <button
                onClick={onBackToArcade}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-sumi-900 border border-slate-700 hover:border-slate-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Tillbaka till Arkaden</span>
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="bg-sumi-950 border-2 border-red-500/50 rounded-3xl p-8 sm:p-10 space-y-6 text-center animate-fadeIn shadow-2xl max-w-2xl mx-auto">
          <div className="text-5xl">💀</div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black uppercase">
            <AlertCircle size={16} />
            <span>NEDERLAG I DOJON</span>
          </div>

          <h2 className="text-3xl font-black text-white">
            Ditt Liv Tog Slut på Våning {currentFloorIdx + 1}
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Yokai-monstrens krafter var för starka denna gång. Träna dina tecken, använd fler Dakuten-runor och kom tillbaka starkare!
          </p>

          <div className="grid grid-cols-3 gap-3 bg-sumi-900 border border-slate-800 rounded-2xl p-4 text-center">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Nådd Våning</div>
              <div className="text-lg font-black text-white font-mono">{currentFloorIdx + 1}/10</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Besegrade Yokai</div>
              <div className="text-lg font-black text-amber-400 font-mono">{runStats.monstersDefeated}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Total Poäng</div>
              <div className="text-lg font-black text-red-400 font-mono">{runStats.score} p</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={startNewRun}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw size={16} />
              <span>FÖRSÖK IGEN</span>
            </button>
            {onBackToArcade && (
              <button
                onClick={onBackToArcade}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-sumi-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Tillbaka till Arkaden</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* COMBAT VIEW MAIN ARENA */}
      {/* ============================================================ */}

      {(phase === 'combat' || phase === 'parry') && enemy && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ========================================== */}
          {/* LEFT 2 COLS: ENEMY ARENA & CARD HAND */}
          {/* ========================================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enemy Card Arena */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-sumi-900 via-slate-900 to-sumi-950 border-2 border-slate-800 p-6 sm:p-8 shadow-xl">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Floating Damage Popups */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {damagePopups.map(popup => (
                  <div
                    key={popup.id}
                    className={`absolute text-2xl sm:text-3xl font-black font-mono animate-bounce px-3 py-1 rounded-xl backdrop-blur-md shadow-2xl ${
                      popup.target === 'enemy'
                        ? popup.isCrit
                          ? 'text-yellow-300 bg-red-900/90 border border-yellow-400 scale-125'
                          : 'text-red-400 bg-sumi-950/90 border border-red-500/50'
                        : popup.isHeal
                        ? 'text-emerald-300 bg-emerald-950/90 border border-emerald-400'
                        : 'text-rose-400 bg-rose-950/90 border border-rose-500'
                    }`}
                  >
                    {popup.text}
                  </div>
                ))}
              </div>

              {/* Top info: Floor & Description */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold text-brand-gold uppercase tracking-wider">
                    {enemy.titleSv}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 mt-0.5">
                    <span>{enemy.nameSv}</span>
                    <span className="text-xl font-jp text-slate-400 font-normal">{enemy.jpName}</span>
                  </h3>
                </div>

                {/* Intent Badge */}
                <div className="p-3 rounded-2xl bg-sumi-950 border border-red-500/40 text-right">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Planerad Attack</div>
                  <div className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                    <Swords size={14} className="text-red-400" />
                    <span>{enemy.intent}</span>
                    <span className="text-red-400 font-mono">({enemy.intentDamage} dmg)</span>
                  </div>
                </div>
              </div>

              {/* Enemy Avatar & HP Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-6 py-6">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-sumi-950 border-2 border-slate-700 flex items-center justify-center text-5xl sm:text-6xl shadow-2xl">
                    {enemy.avatar}
                  </div>
                  {enemy.isBoss && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                      BOSS
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Fiendens Hälsa (HP)</span>
                    <span className="text-white font-mono text-sm">
                      {enemy.currentHp} / {enemy.maxHp} HP
                    </span>
                  </div>

                  {/* HP Progress Bar */}
                  <div className="h-4 w-full bg-sumi-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100))}%` }}
                    />
                  </div>

                  {/* Weakness hint */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-300/90 pt-1">
                    <Target size={14} className="text-amber-400 shrink-0" />
                    <span>{enemy.weaknessHint}</span>
                  </div>
                </div>
              </div>

              {/* Combo Banner Animation */}
              {activeComboBanner && (
                <div className="p-4 rounded-2xl bg-linear-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-center shadow-2xl animate-pulse space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-amber-200">
                    ✨ ORDBILDNINGSAKTIVERING ✨
                  </div>
                  <div className="text-2xl font-black flex items-center justify-center gap-2">
                    <span className="font-jp text-3xl">{activeComboBanner.kana}</span>
                    <span>• {activeComboBanner.nameSv}</span>
                  </div>
                  <div className="text-xs text-amber-100 font-bold">
                    {activeComboBanner.meaningSv} • {activeComboBanner.specialDescription}
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* PARRY CHALLENGE OVERLAY (DURING PARRY PHASE) */}
            {/* ============================================================ */}
            {phase === 'parry' && parryKana && (
              <div className="bg-sumi-950 border-2 border-red-500 rounded-3xl p-6 sm:p-8 text-center space-y-5 animate-fadeIn shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black uppercase">
                    <Shield size={14} />
                    <span>SNABBPARERING</span>
                  </div>
                  <div className="text-sm font-black font-mono text-amber-400 flex items-center gap-1">
                    <span>Tid kvar:</span>
                    <span className="text-lg text-red-400">{parryTimeLeft}s</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">
                    Fienden kastar en attack! Vad är tecknets romaji?
                  </h3>
                  <div className="w-24 h-24 rounded-3xl bg-sumi-900 border-2 border-amber-400/80 flex items-center justify-center text-5xl font-jp text-amber-300 mx-auto my-3 shadow-xl">
                    {parryKana.kana}
                  </div>
                  <p className="text-xs text-slate-400">
                    Klicka rätt läsning nedan inom {parryTimeLeft} sekunder för att absorbera skadan och kontra!
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                  {parryOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleParryAnswer(opt)}
                      className="py-3 px-4 rounded-2xl bg-sumi-900 border-2 border-slate-700 hover:border-amber-400 hover:bg-amber-400/20 text-white hover:text-amber-300 font-mono font-black text-base transition-all active:scale-95 cursor-pointer shadow-md"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* CARD HAND & COMBINATION STRIP (DURING COMBAT PHASE) */}
            {/* ============================================================ */}
            {phase === 'combat' && (
              <div className="space-y-4">
                {/* Combination Strip */}
                <div className="bg-sumi-950/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Valda Kort & Ordföljd:</span>
                      {detectedWordCombo && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-black uppercase animate-pulse">
                          ✨ ORD DETEKTERAT: {detectedWordCombo.meaningSv.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 min-h-[36px]">
                      {selectedCards.length === 0 ? (
                        <span className="text-xs text-slate-500 italic">
                          Klicka på korten i din hand för att bygga en attack eller bilda ord...
                        </span>
                      ) : (
                        selectedCards.map((card, idx) => (
                          <div
                            key={card.id}
                            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-sumi-900 border border-amber-500/40 text-white text-sm font-black shadow-sm"
                          >
                            <span className="text-[10px] text-amber-400 font-mono">#{idx + 1}</span>
                            <span className="font-jp text-base">{card.kana}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({card.romaji})</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Calculated Stats & Action Buttons */}
                  <div className="flex items-center gap-3">
                    {selectedCards.length > 0 && (
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Totalkraft</div>
                        <div className="text-base font-black text-amber-400 font-mono">
                          {calculatedAttack.damage} dmg{' '}
                          <span className="text-xs text-slate-400">({selectedKiCost} Ki)</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handlePlaySelectedCards}
                      disabled={selectedCards.length === 0 || playerKi < selectedKiCost}
                      className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg ${
                        selectedCards.length > 0 && playerKi >= selectedKiCost
                          ? detectedWordCombo
                            ? 'bg-linear-to-r from-amber-500 via-rose-500 to-purple-600 text-white hover:brightness-110 active:scale-95 shadow-amber-500/20 cursor-pointer animate-pulse'
                            : 'bg-amber-400 hover:bg-amber-300 text-sumi-950 active:scale-95 cursor-pointer'
                          : 'bg-sumi-800 text-slate-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Sword size={16} />
                      <span>{detectedWordCombo ? 'SPELA ORDKOMBO!' : 'ANFALL'}</span>
                    </button>

                    <button
                      onClick={handleEndTurn}
                      className="px-4 py-3 rounded-2xl bg-sumi-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-black text-xs transition-all cursor-pointer"
                      title="Avsluta din tur och förbered parering mot fiendens attack"
                    >
                      Avsluta Tur
                    </button>
                  </div>
                </div>

                {/* Hand Cards Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {hand.map((card) => {
                    const isSelected = selectedCardIds.includes(card.id);
                    const selectIndex = selectedCardIds.indexOf(card.id);

                    return (
                      <div
                        key={card.id}
                        onClick={() => handleCardClick(card)}
                        onMouseEnter={() => setHoveredCard(card)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`group relative rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 cursor-pointer select-none ${
                          isSelected
                            ? 'bg-linear-to-b from-amber-950/80 to-sumi-900 border-2 border-amber-400 shadow-xl shadow-amber-400/20 -translate-y-2'
                            : 'bg-sumi-900/90 border border-slate-800 hover:border-slate-600 hover:-translate-y-1'
                        }`}
                      >
                        {/* Top: Selection index or Rune icon */}
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="font-mono text-slate-400">{card.kiCost} Ki</span>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-amber-400 text-sumi-950 font-mono font-black flex items-center justify-center text-[10px]">
                              {selectIndex + 1}
                            </span>
                          ) : card.isDakuten ? (
                            <span className="px-1 rounded bg-amber-500/20 text-amber-400 font-jp">゛</span>
                          ) : card.isHandakuten ? (
                            <span className="px-1 rounded bg-rose-500/20 text-rose-400 font-jp">゜</span>
                          ) : null}
                        </div>

                        {/* Middle: Kana Character */}
                        <div className="my-2 text-center">
                          <div className={`text-3xl sm:text-4xl font-jp font-black transition-transform group-hover:scale-110 ${
                            card.isHandakuten ? 'text-rose-400' : card.isDakuten ? 'text-amber-300' : 'text-white'
                          }`}>
                            {card.kana}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 font-bold mt-0.5">
                            {card.romaji}
                          </div>
                        </div>

                        {/* Bottom: Damage & Element */}
                        <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="font-mono font-black text-amber-400">
                            {card.baseDamage} dmg
                          </span>
                          {card.elementIcon && (
                            <span>{card.elementIcon}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* RIGHT COL: COMBAT LOG & RELICS PANEL */}
          {/* ========================================== */}
          <div className="space-y-6">
            {/* Active Relics Strip */}
            <div className="bg-sumi-950/90 border border-slate-800 rounded-3xl p-4 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Crown size={14} className="text-brand-gold" />
                  <span>Aktiva Reliker ({ownedRelics.length})</span>
                </span>
                <span className="text-[10px] text-brand-gold font-mono font-bold">Passiva Bonusar</span>
              </div>

              {ownedRelics.length === 0 ? (
                <div className="p-3 rounded-2xl bg-sumi-900/50 border border-slate-800/80 text-center text-xs text-slate-500">
                  Inga reliker funna än. Besök Tanuki-handlaren eller öppna tempelkistor!
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {ownedRelics.map(rId => {
                    const r = ALL_RELICS.find(item => item.id === rId);
                    if (!r) return null;
                    return (
                      <div
                        key={r.id}
                        className="px-2.5 py-1 rounded-xl bg-sumi-900 border border-slate-800 flex items-center gap-1.5 text-xs font-bold text-white shadow-sm"
                        title={`${r.nameSv}: ${r.description}`}
                      >
                        <span>{r.icon}</span>
                        <span>{r.nameSv}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Hovered Card Mnemonic / Sound Hint */}
            {hoveredCard && (
              <div className="p-4 rounded-3xl bg-sumi-900 border border-amber-500/40 space-y-2 animate-fadeIn shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Teckenfokus: {hoveredCard.kana} ({hoveredCard.romaji})
                  </div>
                  <button
                    onClick={() => playJapaneseSpeech(hoveredCard.kana)}
                    className="p-1 rounded-lg bg-sumi-950 text-slate-400 hover:text-white cursor-pointer"
                    title="Lyssna på uttal"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Minnesbild:</strong> {hoveredCard.mnemonicSummary}
                </p>
                {hoveredCard.soundHint && (
                  <p className="text-[11px] text-slate-400 italic">
                    {hoveredCard.soundHint}
                  </p>
                )}
              </div>
            )}

            {/* Combat Event Log */}
            <div className="bg-sumi-950/90 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-lg flex flex-col h-[300px]">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1.5">
                  <Scroll size={14} className="text-amber-400" />
                  <span>Dojo Stridslogg</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Realtid</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 text-xs font-medium pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {combatLogs.length === 0 ? (
                  <div className="text-slate-600 text-center py-8 italic">
                    Striden har börjat. Spela kort för att skapa händelser...
                  </div>
                ) : (
                  combatLogs.map(log => (
                    <div
                      key={log.id}
                      className={`p-2 rounded-xl border text-[11px] leading-relaxed ${
                        log.type === 'combo'
                          ? 'bg-amber-500/10 text-amber-200 border-amber-500/40 font-bold'
                          : log.type === 'rune'
                          ? 'bg-purple-500/10 text-purple-200 border-purple-500/30 font-bold'
                          : log.type === 'heal'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : log.type === 'shield'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          : log.type === 'parry'
                          ? 'bg-teal-500/10 text-teal-300 border-teal-500/30 font-bold'
                          : log.type === 'enemy'
                          ? 'bg-red-500/10 text-red-300 border-red-500/30'
                          : 'bg-sumi-900/60 text-slate-300 border-slate-800'
                      }`}
                    >
                      {log.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

