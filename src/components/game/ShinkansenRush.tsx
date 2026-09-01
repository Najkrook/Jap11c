import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, 
  Trophy, 
  Flame, 
  RotateCcw, 
  Play, 
  ArrowLeft, 
  Sparkles, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Clock, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Train, 
  MapPin, 
  Compass, 
  Lightbulb, 
  Award, 
  Info, 
  X,
  Users,
  DoorClosed,
  DoorOpen,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import type { UserStats, KanaCharacter } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { GENKI_L1_VOCABULARY } from '../../data/japc11Vocab';
import { sfx, playJapaneseSpeech } from '../../utils/audio';
import { calculateXpAndLevel, saveUserStats } from '../../utils/srs';
import { fireConfetti, fireSuperCelebration } from '../common/Confetti';
import { AudioButton } from '../common/AudioButton';

export interface ShinkansenRushProps {
  userStats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onBackToArcade?: () => void;
}

export type GameMode = 'rush' | 'zen';

// ----------------------------------------------------
// STATION CONFIGURATIONS (5 Progressive Stations)
// ----------------------------------------------------
export interface StationConfig {
  id: number;
  nameJp: string;
  nameKanji: string;
  nameRomaji: string;
  nameSv: string;
  line: string;
  nextStationKanji: string;
  nextStationRomaji: string;
  prevStationKanji: string;
  prevStationRomaji: string;
  trainName: string;
  trainCode: string;
  trainModel: string;
  themeGradient: string;
  accentColor: string;
  badgeBg: string;
  liveryColor: string; // Shinkansen stripe color
  doorTrimColor: string;
  description: string;
  learningFocus: string;
  kanaIds: string[];
  twinPairs?: [string, string][]; // Pairs of commonly confused kana for tricky distractors
  baseTimeSeconds: number;
  passengersTarget: number;
  allowWords?: boolean;
}

export const SHINKANSEN_STATIONS: StationConfig[] = [
  {
    id: 1,
    nameJp: 'とうきょう',
    nameKanji: '東京',
    nameRomaji: 'Tokyo',
    nameSv: 'Tokyo Central',
    line: 'Tokaido Shinkansen (東海道新幹線)',
    nextStationKanji: '品川',
    nextStationRomaji: 'Shinagawa',
    prevStationKanji: '終点',
    prevStationRomaji: 'Origin',
    trainName: 'Kodama 702',
    trainCode: 'こだま 702号',
    trainModel: 'Series 0 / N700S Classic',
    themeGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    accentColor: 'text-blue-400 border-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    liveryColor: 'from-blue-600 via-cyan-400 to-blue-600',
    doorTrimColor: 'border-blue-500',
    description: 'Börja din resa på Tokyos legendariska centralstation. Här introduceras du till de 5 grundvokalerna och Ka-raden.',
    learningFocus: 'Vokaler (A, I, U, E, O) & Ka-raden (Ka, Ki, Ku, Ke, Ko)',
    kanaIds: ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko'],
    twinPairs: [
      ['a', 'o'],
      ['i', 'ri'],
      ['u', 'tsu'],
      ['ka', 'ki'],
      ['ku', 'he'],
      ['ke', 'ha'],
      ['ko', 'ni']
    ],
    baseTimeSeconds: 8.5,
    passengersTarget: 10
  },
  {
    id: 2,
    nameJp: 'なごや',
    nameKanji: '名古屋',
    nameRomaji: 'Nagoya',
    nameSv: 'Nagoya Station',
    line: 'Tokaido Shinkansen (東海道新幹線)',
    nextStationKanji: '京都',
    nextStationRomaji: 'Kyoto',
    prevStationKanji: '浜松',
    prevStationRomaji: 'Hamamatsu',
    trainName: 'Hikari 514',
    trainCode: 'ひかり 514号',
    trainModel: 'Series 700 / N700A Express',
    themeGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    accentColor: 'text-emerald-400 border-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    liveryColor: 'from-emerald-500 via-teal-300 to-emerald-600',
    doorTrimColor: 'border-emerald-500',
    description: 'Välkommen till Nagoya! Här testas din förmåga att skilja på de beryktade tvillingtecknen i Sa- och Ta-raderna.',
    learningFocus: 'Sa-raden (Sa, Shi, Su, Se, So) & Ta-raden (Ta, Chi, Tsu, Te, To) — Shi vs Tsu & Chi vs Sa',
    kanaIds: ['sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to'],
    twinPairs: [
      ['shi', 'tsu'], // Crucial pair!
      ['chi', 'sa'],  // Crucial pair!
      ['ta', 'na'],
      ['so', 'te'],
      ['su', 'mu'],
      ['se', 'ya']
    ],
    baseTimeSeconds: 7.2,
    passengersTarget: 12
  },
  {
    id: 3,
    nameJp: 'きょうと',
    nameKanji: '京都',
    nameRomaji: 'Kyoto',
    nameSv: 'Kyoto Imperial',
    line: 'Tokaido Shinkansen (東海道新幹線)',
    nextStationKanji: '新大阪',
    nextStationRomaji: 'Shin-Osaka',
    prevStationKanji: '名古屋',
    prevStationRomaji: 'Nagoya',
    trainName: 'Sakura 540',
    trainCode: 'さくら 540号',
    trainModel: 'N700-7000 Sakura Series',
    themeGradient: 'from-rose-600 via-purple-700 to-slate-900',
    accentColor: 'text-rose-400 border-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    liveryColor: 'from-pink-500 via-rose-300 to-purple-600',
    doorTrimColor: 'border-rose-500',
    description: 'Kulturens huvudstad. Här tränar vi på Na-, Ha- och Ma-raderna med öglor och snarlika teckenformer.',
    learningFocus: 'Na, Ha, Ma-raderna — Öglor och detaljer: は vs ほ, ぬ vs め, ね vs わ vs れ',
    kanaIds: ['na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi', 'mu', 'me', 'mo'],
    twinPairs: [
      ['ha', 'ho'], // with / without hat
      ['nu', 'me'], // loop vs no loop
      ['ne', 'wa'],
      ['ne', 're'],
      ['ma', 'mo'],
      ['hi', 'he'],
      ['ni', 'ko']
    ],
    baseTimeSeconds: 6.2,
    passengersTarget: 12
  },
  {
    id: 4,
    nameJp: 'しんおおさか',
    nameKanji: '新大阪',
    nameRomaji: 'Shin-Osaka',
    nameSv: 'Shin-Osaka Hub',
    line: 'Sanyo Shinkansen (山陽新幹線)',
    nextStationKanji: '新神戸',
    nextStationRomaji: 'Shin-Kobe',
    prevStationKanji: '京都',
    prevStationRomaji: 'Kyoto',
    trainName: 'Nozomi 28',
    trainCode: 'のぞみ 28号',
    trainModel: 'N700S Supreme 300km/h',
    themeGradient: 'from-amber-500 via-orange-600 to-slate-900',
    accentColor: 'text-amber-400 border-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    liveryColor: 'from-amber-500 via-yellow-300 to-blue-600',
    doorTrimColor: 'border-amber-500',
    description: 'Västra Japans stora pulsåder. Tågen dundrar i 300 km/h med R, Y, W, N samt röstade Dakuten & Handakuten!',
    learningFocus: 'R, Y, W, N & Dakuten (Ga, Za, Da, Ba, Pa) — Snabba röstade reflexer',
    kanaIds: [
      'ra', 'ri', 'ru', 're', 'ro', 'ya', 'yu', 'yo', 'wa', 'wo', 'n',
      'ga', 'gi', 'gu', 'ge', 'go', 'za', 'ji', 'zu', 'ze', 'zo',
      'da', 'de', 'do', 'ba', 'bi', 'bu', 'be', 'bo', 'pa', 'pi', 'pu', 'pe', 'po'
    ],
    twinPairs: [
      ['ru', 'ro'], // loop vs no loop
      ['wa', 're'],
      ['ba', 'pa'], // fnutt vs ring
      ['ga', 'ka'],
      ['za', 'sa']
    ],
    baseTimeSeconds: 5.5,
    passengersTarget: 14
  },
  {
    id: 5,
    nameJp: 'はかた',
    nameKanji: '博多',
    nameRomaji: 'Hakata (End Station)',
    nameSv: 'Hakata Grand Express',
    line: 'Kyushu / Sanyo Shinkansen (山陽・九州新幹線)',
    nextStationKanji: '終点',
    nextStationRomaji: 'Terminus',
    prevStationKanji: '小倉',
    prevStationRomaji: 'Kokura',
    trainName: 'Hayabusa Grand Class',
    trainCode: 'はやぶさ グランド',
    trainModel: 'Series E5/H5 Supersonic',
    themeGradient: 'from-cyan-600 via-blue-700 to-fuchsia-950',
    accentColor: 'text-cyan-400 border-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    liveryColor: 'from-teal-400 via-cyan-300 to-pink-500',
    doorTrimColor: 'border-cyan-400',
    description: 'Slutstationen! Här möter du en blandad snabbstorm från hela alfabetet samt VIP-passagerare med hela ord!',
    learningFocus: 'Alla 71+ Hiragana-tecken + Genki I glosor i blixtrande tempo!',
    kanaIds: HIRAGANA_DATA.map(k => k.id),
    baseTimeSeconds: 4.8,
    passengersTarget: 16,
    allowWords: true
  }
];

// ----------------------------------------------------
// MNEMONIC PERSONAS MAPPED TO EACH HIRAGANA & WORD
// ----------------------------------------------------
export interface MnemonicPersona {
  emoji: string;
  nameSv: string;
  cueSv: string;
  quoteHappy: string;
  quoteStress: string;
}

export const KANA_MNEMONIC_MAP: Record<string, MnemonicPersona> = {
  // Vowels (A, I, U, E, O)
  'a': {
    emoji: '🍎',
    nameSv: 'Äppelplockaren',
    cueSv: 'A som i Apel / Äpple',
    quoteHappy: 'Tack! Mina färska äpplen hinner med!',
    quoteStress: 'Akta mina äpplen, tåget avgår strax!'
  },
  'i': {
    emoji: '🦔',
    nameSv: 'Igelkottsvännen',
    cueSv: 'I som i två Iglar / Igelkott',
    quoteHappy: 'Arigatou! Igelkotten och jag är ombord!',
    quoteStress: 'Igelkotten blir stressad av dörrarna!'
  },
  'u': {
    emoji: '🦉',
    nameSv: 'Uggleskådaren',
    cueSv: 'U som i Uggla / Uppsittning',
    quoteHappy: 'Uhh, vilken tur att vi hann!',
    quoteStress: 'Uff! Ryggsäcken fastnar nästan i dörren!'
  },
  'e': {
    emoji: '🐿️',
    nameSv: 'Ekorrmataren',
    cueSv: 'E som i Ekorre',
    quoteHappy: 'Ekorren och jag tackar för hjälpen!',
    quoteStress: 'Ekorren skuttar runt av stress, skynda!'
  },
  'o': {
    emoji: '⛳',
    nameSv: 'Golfaren',
    cueSv: 'O som i Golfboll På green',
    quoteHappy: 'Hole-in-one! Rakt in i vagnen!',
    quoteStress: 'Min golfklubba hinner inte med!'
  },
  // K-row (Ka, Ki, Ku, Ke, Ko)
  'ka': {
    emoji: '🍰',
    nameSv: 'Konditorn',
    cueSv: 'Ka som i en Kaka',
    quoteHappy: 'Kakan är hel och vi är ombord!',
    quoteStress: 'Skynda, tårtan får inte smälta på perrongen!'
  },
  'ki': {
    emoji: '🗝️',
    nameSv: 'Nyckelmästaren',
    cueSv: 'Ki som i en Nyckel (Key)',
    quoteHappy: 'Nyckeln till framgång är snabba tåg!',
    quoteStress: 'Var lade jag nyckeln?! Dörrarna stängs!'
  },
  'ku': {
    emoji: '🐦',
    nameSv: 'Fågelskådaren',
    cueSv: 'Ku som i Kuckeliku / Fågelnäbb',
    quoteHappy: 'Kuckeliku! Ombord i sista sekund!',
    quoteStress: 'Fågeln flyger iväg om vi inte skyndar!'
  },
  'ke': {
    emoji: '🧪',
    nameSv: 'Kemisten',
    cueSv: 'Ke som i Kemi / Kittel',
    quoteHappy: 'Perfekt kemisk reaktion, vi hann!',
    quoteStress: 'Provrören skakar, tåget avgår snart!'
  },
  'ko': {
    emoji: '🐮',
    nameSv: 'Bonden',
    cueSv: 'Ko som i en Ko',
    quoteHappy: 'Muuu-tack! Perfekt tajming!',
    quoteStress: 'Kossan vill gå ombord nu, öppna!'
  },
  // S-row (Sa, Shi, Su, Se, So)
  'sa': {
    emoji: '✂️',
    nameSv: 'Skräddaren',
    cueSv: 'Sa som i en Sax',
    quoteHappy: 'Klippt och skuret! Vi hann med!',
    quoteStress: 'Saxen klipper i sista sekunden!'
  },
  'shi': {
    emoji: '🎣',
    nameSv: 'Fiskaren',
    cueSv: 'Shi som i en Metkrok i Sjön',
    quoteHappy: 'Vilken storfångst att hinna med tåget!',
    quoteStress: 'Metkroken fastnar i spärren, hjälp!'
  },
  'su': {
    emoji: '🍣',
    nameSv: 'Sushikocken',
    cueSv: 'Su som i Sushi / Snurra',
    quoteHappy: 'Sushin levereras i blixtfart!',
    quoteStress: 'Skynda, sushin ska serveras färsk!'
  },
  'se': {
    emoji: '⛵',
    nameSv: 'Seglaren',
    cueSv: 'Se som i en Segelbåt',
    quoteHappy: 'Medvind hela vägen in i kupén!',
    quoteStress: 'Seglen fladdrar, vi måste ombord!'
  },
  'so': {
    emoji: '🪭',
    nameSv: 'Dansaren',
    cueSv: 'So som i en Solfjäder',
    quoteHappy: 'Vackert som en dans, tack!',
    quoteStress: 'Solfjädern viftar i panik!'
  },
  // T-row (Ta, Chi, Tsu, Te, To)
  'ta': {
    emoji: '🍽️',
    nameSv: 'Gourmeten',
    cueSv: 'Ta som i en Tallrik',
    quoteHappy: 'Middagen är räddad, fantastiskt!',
    quoteStress: 'Tallrikarna skramlar, skynda!'
  },
  'chi': {
    emoji: '📣',
    nameSv: 'Cheerleadern',
    cueSv: 'Chi som i en Cheerleader',
    quoteHappy: 'Heja heja! Vi klarade det!',
    quoteStress: 'Heja på mig så jag hinner med!'
  },
  'tsu': {
    emoji: '🌊',
    nameSv: 'Surfare',
    cueSv: 'Tsu som i en Tsunami-våg',
    quoteHappy: 'Red tsunamin rakt in i tåget!',
    quoteStress: 'Vågen sköljer över oss, skynda!'
  },
  'te': {
    emoji: '✋',
    nameSv: 'Handviftaren',
    cueSv: 'Te som i en Hand (手 / Te)',
    quoteHappy: 'Viftar glatt med handen (Te)! Tack för hjälpen!',
    quoteStress: 'Viftar med handen (Te) så tåget inte åker!'
  },
  'to': {
    emoji: '🦶',
    nameSv: 'Maratonlöparen',
    cueSv: 'To som i en Tå / Törnrosa',
    quoteHappy: 'Sprang på tårna ända in i målet!',
    quoteStress: 'Akta tårna så inte dörren klämmer!'
  },
  // N-row (Na, Ni, Nu, Ne, No)
  'na': {
    emoji: '⛪',
    nameSv: 'Klostersystern',
    cueSv: 'Na som i en Nunna vid korset',
    quoteHappy: 'Välsignad resa, tack så mycket!',
    quoteStress: 'Bönerna hjälper, men fötterna måste skynda!'
  },
  'ni': {
    emoji: '🪡',
    nameSv: 'Sömmerskan',
    cueSv: 'Ni som i en Nål / Ni=2 ✌️',
    quoteHappy: 'Tråden är trädd och tåget är nått!',
    quoteStress: 'Tappade nålen på perrongen, hjälp!'
  },
  'nu': {
    emoji: '🍜',
    nameSv: 'Ramen-älskaren',
    cueSv: 'Nu som i Nudlar med ätpinnar',
    quoteHappy: 'Mums! Rammenskålen hann med intakt!',
    quoteStress: 'Nudlarna kallnar om tåget avgår!'
  },
  'ne': {
    emoji: '🐱',
    nameSv: 'Kattälskaren',
    cueSv: 'Ne som i Neko (Katt med svans)',
    quoteHappy: 'Mjau! Katten spinner av glädje!',
    quoteStress: 'Mjaau! Kläm inte svansen i dörren!'
  },
  'no': {
    emoji: '🚫',
    nameSv: 'Trafikvakten',
    cueSv: 'No som i Förbudsmärke (NO!)',
    quoteHappy: 'Klart spår! Inga hinder här!',
    quoteStress: 'Säg inte NO till avgången, skynda!'
  },
  // H-row (Ha, Hi, Fu, He, Ho)
  'ha': {
    emoji: '👒',
    nameSv: 'Modisten',
    cueSv: 'Ha som i en Halmhatt',
    quoteHappy: 'Halmhatten sitter kvar på huvudet, underbart!',
    quoteStress: 'Vinden tar min halmhatt, spring!'
  },
  'hi': {
    emoji: '😄',
    nameSv: 'Komikern',
    cueSv: 'Hi som i ett Leende (Hihihi)',
    quoteHappy: 'Hihihi! Det var det roligaste på länge!',
    quoteStress: 'Skrattet fastnar i halsen om jag missar tåget!'
  },
  'fu': {
    emoji: '🗻',
    nameSv: 'Bergsvandraren',
    cueSv: 'Fu som i Berget Fuji',
    quoteHappy: 'Utsikten från Shinkansen mot Fuji blir magisk!',
    quoteStress: 'Fuji väntar inte, vi måste med!'
  },
  'he': {
    emoji: '⛰️',
    nameSv: 'Backhopparen',
    cueSv: 'He som i en Backe / Höjd',
    quoteHappy: 'Heja heja! Rakt utför backen in i kupén!',
    quoteStress: 'Uppförsbacke mot perrongen, hjälp!'
  },
  'ho': {
    emoji: '🏠',
    nameSv: 'Husbyggaren',
    cueSv: 'Ho som i ett Hus med tak',
    quoteHappy: 'Hemma bra men Shinkansen bäst!',
    quoteStress: 'Måste hem till huset innan solen går ner!'
  },
  // M-row (Ma, Mi, Mu, Me, Mo)
  'ma': {
    emoji: '👩',
    nameSv: 'Mamma',
    cueSv: 'Ma som i Mamma med hårspännen',
    quoteHappy: 'Mamma är stolt över din snabba hjälp!',
    quoteStress: 'Mamma har bråttom, dörrarna stängs!'
  },
  'mi': {
    emoji: '🎵',
    nameSv: 'Musikern',
    cueSv: 'Mi som i Musiknoten Mi',
    quoteHappy: 'Ljuv musik i mina öron, tack!',
    quoteStress: 'Konserten börjar snart, skynda!'
  },
  'mu': {
    emoji: '🐄',
    nameSv: 'Lantbrukaren',
    cueSv: 'Mu som i en Ko (Muuu)',
    quoteHappy: 'Muuu-ligt att vi hann! Tack!',
    quoteStress: 'Muuu! Tåget får inte rulla utan oss!'
  },
  'me': {
    emoji: '👁️',
    nameSv: 'Optikern',
    cueSv: 'Me som i ett Öga (Me på japanska)',
    quoteHappy: 'Jag ser klart och tydligt att vi hann!',
    quoteStress: 'Håll ögonen öppna, dörrarna slår igen!'
  },
  'mo': {
    emoji: '🪱',
    nameSv: 'Metaren',
    cueSv: 'Mo som i en Mask på kroken',
    quoteHappy: 'Masken och jag är säkra ombord!',
    quoteStress: 'Masken slingrar sig, vi måste in!'
  },
  // Y-row (Ya, Yu, Yo)
  'ya': {
    emoji: '🐂',
    nameSv: 'Bergsguiden',
    cueSv: 'Ya som i en Yak-oxe',
    quoteHappy: 'Yaken och jag tackar för skjutsen!',
    quoteStress: 'Yaken vägrar springa fortare, skynda!'
  },
  'yu': {
    emoji: '♨️',
    nameSv: 'Badgästen',
    cueSv: 'Yu som i en Varm källa (Onsen)',
    quoteHappy: 'Ahhh! Det varma källbadet i Kyoto väntar!',
    quoteStress: 'Det varma badet kallnar om vi missar tåget!'
  },
  'yo': {
    emoji: '🪀',
    nameSv: 'Trollkarlen',
    cueSv: 'Yo som i en Jojo',
    quoteHappy: 'Jojon snurrar av glädje!',
    quoteStress: 'Jojosnöret trasslade sig, skynda!'
  },
  // R-row (Ra, Ri, Ru, Re, Ro)
  'ra': {
    emoji: '🐀',
    nameSv: 'Zoologen',
    cueSv: 'Ra som i en Råtta som sitter',
    quoteHappy: 'Pip! Råttan och jag är ombord!',
    quoteStress: 'Råttan smiter in under perrongen, hjälp!'
  },
  'ri': {
    emoji: '🌾',
    nameSv: 'Risbonden',
    cueSv: 'Ri som i två Risstrån',
    quoteHappy: 'Risskörden är räddad!',
    quoteStress: 'Risstråna blåser bort i draget från tåget!'
  },
  'ru': {
    emoji: '🦘',
    nameSv: 'Känguru-skötaren',
    cueSv: 'Ru som i Känguru med bebis i pung',
    quoteHappy: 'Hoppsan hejsan! Rakt ner i tågsätet!',
    quoteStress: 'Bebisen i kängurupungen vaknar av stressen!'
  },
  're': {
    emoji: '🦌',
    nameSv: 'Skogsvaktaren',
    cueSv: 'Re som i en Ren med horn',
    quoteHappy: 'Renhorns-stolt över din insats!',
    quoteStress: 'Hornen fastnar nästan i dörröppningen!'
  },
  'ro': {
    emoji: '🤖',
    nameSv: 'Robotikern',
    cueSv: 'Ro som i en Robot / Rånad känguru',
    quoteHappy: 'Bip bop! Batterierna laddas på tåget!',
    quoteStress: 'Systemöverbelastning! Dörrarna piper!'
  },
  // W, N & Special
  'wa': {
    emoji: '🌊',
    nameSv: 'Kajakpaddlaren',
    cueSv: 'Wa som i ett Vattenfall',
    quoteHappy: 'Paddlade i mål i perfekt tid!',
    quoteStress: 'Strömmen drar iväg, hjälp oss ombord!'
  },
  'wo': {
    emoji: '🏊',
    nameSv: 'Simmaren',
    cueSv: 'Wo som i en Simmare i vågorna',
    quoteHappy: 'Simmade i mål före avgång!',
    quoteStress: 'Tidsgränsen närmar sig, simma fortare!'
  },
  'n': {
    emoji: '🦏',
    nameSv: 'Safariarkitekten',
    cueSv: 'N som i en Noshörning / Natt',
    quoteHappy: 'Noshörningen hann med nattåget!',
    quoteStress: 'Noshörningen är för tung för att springa!'
  },
  // Dakuten / Handakuten
  'ga': { emoji: '🦆', nameSv: 'Gåsägaren', cueSv: 'Ga som i en Gås (Ka + ゛)', quoteHappy: 'Gässen kacklar av glädje!', quoteStress: 'Gåsen springer åt fel håll!' },
  'gi': { emoji: '🎸', nameSv: 'Gitarristen', cueSv: 'Gi som i en Gitarr (Ki + ゛)', quoteHappy: 'Solot levereras i tid!', quoteStress: 'Strängarna går av om jag missar tåget!' },
  'gu': { emoji: '🦍', nameSv: 'Gorillaskötaren', cueSv: 'Gu som i en Gorilla (Ku + ゛)', quoteHappy: 'Gorillan är trygg i vagnen!', quoteStress: 'Gorillan bankar på bröstet av stress!' },
  'ge': { emoji: '🦎', nameSv: 'Reptilforskaren', cueSv: 'Ge som i en Gecko (Ke + ゛)', quoteHappy: 'Geckon sitter fast på tågrutan!', quoteStress: 'Geckon smiter i panik!' },
  'go': { emoji: '🏌️', nameSv: 'Golfproffset', cueSv: 'Go som i Golfbanan (Ko + ゛)', quoteHappy: 'Perfekt drive in i förstaklass!', quoteStress: 'Bollen rullar mot spåret!' },
  'za': { emoji: '🦓', nameSv: 'Safariresenären', cueSv: 'Za som i en Zebra (Sa + ゛)', quoteHappy: 'Zebran har hittat sin plats!', quoteStress: 'Zebramönstret snurrar i huvudet!' },
  'ji': { emoji: '👖', nameSv: 'Jeansdesignern', cueSv: 'Ji som i Jeans (Shi + ゛)', quoteHappy: 'Modetåget rullar vidare!', quoteStress: 'Jeansen spricker om jag springer fortare!' },
  'zu': { emoji: '🧟', nameSv: 'Skräckförfattaren', cueSv: 'Zu som i Zombie (Su + ゛)', quoteHappy: 'Ingen zombie rår på Shinkansen!', quoteStress: 'Zombierna närmar sig, stäng dörren!' },
  'ze': { emoji: '⚡', nameSv: 'Elektrikern', cueSv: 'Ze som i Blixten (Se + ゛)', quoteHappy: 'Blixtsnabb expedition!', quoteStress: 'Spänningen stiger, tåget åker!' },
  'zo': { emoji: '🐘', nameSv: 'Djurskötaren', cueSv: 'Zo som i Zoo / Elefant (So + ゛)', quoteHappy: 'Elefanten kliver ombord!', quoteStress: 'Tungt lass till perrongen!' },
  'da': { emoji: '🎯', nameSv: 'Dartmästaren', cueSv: 'Da som i Dart (Ta + ゛)', quoteHappy: 'Mitt i prick!', quoteStress: 'Sista pilen avgör!' },
  'de': { emoji: '🕵️', nameSv: 'Detektiven', cueSv: 'De som i en Detektiv (Te + ゛)', quoteHappy: 'Fallet är löst ombord på tåget!', quoteStress: 'Skurken flyr om vi missar tåget!' },
  'do': { emoji: '🍩', nameSv: 'Bagaren', cueSv: 'Do som i en Donut (To + ゛)', quoteHappy: 'Donutarna är varma och goda!', quoteStress: 'Glasyren smälter!' },
  'ba': { emoji: '🍌', nameSv: 'Frukthandlaren', cueSv: 'Ba som i Banan (Ha + ゛)', quoteHappy: 'Bananerna levereras färska!', quoteStress: 'Halkar nästan på bananskalet!' },
  'bi': { emoji: '🐝', nameSv: 'Biodlaren', cueSv: 'Bi som i ett Bi (Hi + ゛)', quoteHappy: 'Honungen är säkrad!', quoteStress: 'Bina surrar i panik!' },
  'bu': { emoji: '🐂', nameSv: 'Tjurfäktaren', cueSv: 'Bu som i en Tjur/Bulle (Fu + ゛)', quoteHappy: 'Lugn som en tjur i kupén!', quoteStress: 'Tjuren ser rött vid dörren!' },
  'be': { emoji: '🛌', nameSv: 'Nattresenären', cueSv: 'Be som i Bädd/Säng (He + ゛)', quoteHappy: 'Nu ska jag sova gott i vagnen!', quoteStress: 'Kudden ramlade ur väskan!' },
  'bo': { emoji: '🥊', nameSv: 'Boxaren', cueSv: 'Bo som i Boxare / Boll (Ho + ゛)', quoteHappy: 'Knockout-seger!', quoteStress: 'Gongen har slagit, in i ringen!' },
  'pa': { emoji: '🐼', nameSv: 'Panda-ambassadören', cueSv: 'Pa som i en Panda (Ha + ゜)', quoteHappy: 'Pandan tuggar bambu i lugn och ro!', quoteStress: 'Pandan rör sig i slow-motion!' },
  'pi': { emoji: '🍕', nameSv: 'Pizzabagaren', cueSv: 'Pi som i Pizza (Hi + ゜)', quoteHappy: 'Pizzan är rykande färsk!', quoteStress: 'Ostkanten fastnar i spärren!' },
  'pu': { emoji: '🐩', nameSv: 'Hundtrimmaren', cueSv: 'Pu som i en Pudel (Fu + ゜)', quoteHappy: 'Vovven och jag är ombord!', quoteStress: 'Kopplet trasslar sig!' },
  'pe': { emoji: '🐧', nameSv: 'Polarforskaren', cueSv: 'Pe som i en Pingvin (He + ゜)', quoteHappy: 'Pingvinen glider in på isen!', quoteStress: 'Pingvinen vacklar mot dörren!' },
  'po': { emoji: '🍿', nameSv: 'Biografbesökaren', cueSv: 'Po som i Popcorn (Ho + ゜)', quoteHappy: 'Popcornen är poppade och filmen väntar!', quoteStress: 'Popcornen flyger över hela perrongen!' }
};

// Word Mnemonic map for Genki words:
export const WORD_MNEMONIC_MAP: Record<string, { emoji: string; nameSv: string; cueSv: string; quoteHappy: string; quoteStress: string }> = {
  'ねこ': { emoji: '🐱', nameSv: 'Kattälskaren', cueSv: 'Neko = Katt', quoteHappy: 'Mjau! Katten spinner av glädje!', quoteStress: 'Mjaau! Kläm inte kattens svans i dörren!' },
  'いぬ': { emoji: '🐶', nameSv: 'Hundägaren', cueSv: 'Inu = Hund', quoteHappy: 'Vovven viftar på svansen ombord!', quoteStress: 'Vovven skäller av stress vid perrongen!' },
  'すし': { emoji: '🍣', nameSv: 'Sushikocken', cueSv: 'Sushi = Sushi', quoteHappy: 'Sushin serveras färsk och god!', quoteStress: 'Skynda innan sushin blir varm!' },
  'やま': { emoji: '⛰️', nameSv: 'Bergsklättraren', cueSv: 'Yama = Berg', quoteHappy: 'Toppbestigningen väntar!', quoteStress: 'Berget väntar inte, vi måste med!' },
  'かわ': { emoji: '🌊', nameSv: 'Flodguiden', cueSv: 'Kawa = Flod', quoteHappy: 'Flodresan fortsätter!', quoteStress: 'Strömmen drar iväg, skynda!' },
  'ほん': { emoji: '📖', nameSv: 'Bokslukaren', cueSv: 'Hon = Bok', quoteHappy: 'En god bok att läsa på tåget!', quoteStress: 'Bokmärket ramlar ut!' },
  'みず': { emoji: '💧', nameSv: 'Vattenbäraren', cueSv: 'Mizu = Vatten', quoteHappy: 'Kallt och friskt källvatten!', quoteStress: 'Spill inte vattnet i rulltrappan!' },
  'くるま': { emoji: '🚗', nameSv: 'Chauffören', cueSv: 'Kuruma = Bil', quoteHappy: 'Shinkansen är snabbare än bilen!', quoteStress: 'Trafikkön till stationen var hemsk!' },
  'さかな': { emoji: '🐟', nameSv: 'Fiskhandlaren', cueSv: 'Sakana = Fisk', quoteHappy: 'Fångsten är räddad!', quoteStress: 'Fisken ska till morgonmarknaden!' },
  'とり': { emoji: '🐦', nameSv: 'Ornitologen', cueSv: 'Tori = Fågel', quoteHappy: 'Fågeln kvittrar i takt med tåget!', quoteStress: 'Fågeln flaxar i panik!' },
  'はな': { emoji: '🌸', nameSv: 'Floristen', cueSv: 'Hana = Blomma', quoteHappy: 'Sakura-blommorna är i full blom!', quoteStress: 'Kronbladen blåser bort i draget!' },
  'あめ': { emoji: '🌧️', nameSv: 'Paraplybäraren', cueSv: 'Ame = Regn / Godis', quoteHappy: 'Torr och trygg inne i Shinkansen!', quoteStress: 'Regnet öser ner, skynda in!' },
  'つき': { emoji: '🌙', nameSv: 'Astronomen', cueSv: 'Tsuki = Måne', quoteHappy: 'Månskenet lyser upp vår färd!', quoteStress: 'Månen stiger, natten är här!' },
  'ひ': { emoji: '🔥', nameSv: 'Eldslukaren', cueSv: 'Hi = Eld / Sol', quoteHappy: 'Elden hålls under kontroll!', quoteStress: 'Det brinner i knutarna, spring!' },
  'いえ': { emoji: '🏠', nameSv: 'Husägaren', cueSv: 'Ie = Hus/Hem', quoteHappy: 'Hemma bra men Shinkansen bäst!', quoteStress: 'Glömde jag låsa dörren hemma?!' },
  'うた': { emoji: '🎤', nameSv: 'Sångaren', cueSv: 'Uta = Sång', quoteHappy: 'Konserten blir en succé!', quoteStress: 'Mikrofonen packades i sista stund!' },
  'うみ': { emoji: '🏖️', nameSv: 'Strandgästen', cueSv: 'Umi = Hav', quoteHappy: 'Havet och stranden väntar!', quoteStress: 'Badbollen studsar iväg på perrongen!' }
};

export interface TrackData {
  trackNumber: 1 | 2 | 3;
  kana: string;
  id: string;
  isCorrect: boolean;
}

export interface PassengerPersona {
  id: string;
  name: string;
  titleSv: string;
  avatar: string;
  happyQuote: string;
  stressQuote: string;
}

export interface PassengerTask {
  id: string;
  isWord: boolean;
  ticketDisplay: string; // Romaji text on ticket, e.g. "TSU" or "SUSHI"
  ticketMeaningSv?: string; // e.g. "✋ Hand (Te)" or "🍣 Sushi"
  correctKana: string; // "つ" or "すし"
  correctId: string;
  characterInfo?: KanaCharacter;
  tracks: TrackData[];
  persona: PassengerPersona;
  timeLimitMs: number;
}

const KANA_MAP = new Map<string, KanaCharacter>(
  HIRAGANA_DATA.map(k => [k.id, k])
);

export const ShinkansenRush: React.FC<ShinkansenRushProps> = ({
  userStats,
  onUpdateStats,
  onBackToArcade
}) => {
  // Navigation & Game State
  const [gameState, setGameState] = useState<'station_select' | 'playing' | 'station_cleared' | 'gameover'>('station_select');
  const [gameMode, setGameMode] = useState<GameMode>('rush');
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  
  // Gameplay metrics
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [passengersServed, setPassengersServed] = useState<number>(0);
  const [stationPassengersServed, setStationPassengersServed] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [sessionXpEarned, setSessionXpEarned] = useState<number>(0);

  // Active round task & Timer
  const [currentTask, setCurrentTask] = useState<PassengerTask | null>(null);
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(8000);
  const [selectedTrack, setSelectedTrack] = useState<1 | 2 | 3 | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [feedbackInfo, setFeedbackInfo] = useState<{ kana: string; romaji: string } | null>(null);
  const [departingTrack, setDepartingTrack] = useState<number | null>(null);
  const [isTrainArriving, setIsTrainArriving] = useState<boolean>(false);

  // Sound & Mnemonic Toggles
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Queue of Upcoming Passengers (Visual Platform Immersion)
  const [upcomingQueue, setUpcomingQueue] = useState<PassengerPersona[]>([]);

  // Refs for loop management
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());
  const doorChimePlayedRef = useRef<boolean>(false);

  const stationConfig = SHINKANSEN_STATIONS[currentStationIndex] || SHINKANSEN_STATIONS[0];

  // Helper to build a mnemonic-connected persona
  const getMnemonicPersona = useCallback((kanaId: string, kanaChar: string, isWord: boolean, wordData?: { kana: string; romaji: string; meaningSv: string }): PassengerPersona => {
    if (isWord && wordData) {
      const wordMnemonic = WORD_MNEMONIC_MAP[wordData.kana];
      if (wordMnemonic) {
        return {
          id: `word_${wordData.romaji}`,
          name: wordMnemonic.nameSv,
          titleSv: wordMnemonic.cueSv,
          avatar: wordMnemonic.emoji,
          happyQuote: wordMnemonic.quoteHappy,
          stressQuote: wordMnemonic.quoteStress
        };
      }
      return {
        id: `word_${wordData.romaji}`,
        name: `${wordData.meaningSv}-resenären`,
        titleSv: `${wordData.romaji.toUpperCase()} = ${wordData.meaningSv}`,
        avatar: '🧳',
        happyQuote: `Tack! ${wordData.meaningSv} är med på tåget!`,
        stressQuote: `Skynda, tåget avgår mot nästa station!`
      };
    }

    const mnemonic = KANA_MNEMONIC_MAP[kanaId];
    if (mnemonic) {
      return {
        id: `kana_${kanaId}`,
        name: mnemonic.nameSv,
        titleSv: mnemonic.cueSv,
        avatar: mnemonic.emoji,
        happyQuote: mnemonic.quoteHappy,
        stressQuote: mnemonic.quoteStress
      };
    }

    return {
      id: `kana_${kanaId}`,
      name: `Resenär (${kanaId.toUpperCase()})`,
      titleSv: `${kanaId.toUpperCase()} (${kanaChar})`,
      avatar: '🎫',
      happyQuote: 'Tack! Jag hann med tåget!',
      stressQuote: 'Hjälp, dörrarna stängs snart!'
    };
  }, []);

  // ----------------------------------------------------
  // GENERATE PASSENGER TASK
  // ----------------------------------------------------
  const generatePassengerTask = useCallback((station: StationConfig): PassengerTask => {
    const isWord = station.allowWords ? Math.random() < 0.35 : false;

    // Generate upcoming queue from station kana pool with cute mnemonic avatars
    const otherKanaIds = station.kanaIds.slice().sort(() => 0.5 - Math.random()).slice(0, 3);
    const queuePersonas = otherKanaIds.map(id => {
      const char = KANA_MAP.get(id);
      return getMnemonicPersona(id, char?.kana || id, false);
    });
    setUpcomingQueue(queuePersonas);

    if (isWord) {
      // Pick a vocabulary word from Genki L1
      const wordList = GENKI_L1_VOCABULARY.filter(w => w.kana && w.romaji && w.kana.length <= 4);
      const chosenWord = wordList[Math.floor(Math.random() * wordList.length)];
      
      const persona = getMnemonicPersona(chosenWord.romaji, chosenWord.kana, true, chosenWord);

      // Pick 2 distractor words
      const otherWords = wordList.filter(w => w.kana !== chosenWord.kana);
      const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
      const distractor1 = shuffledOthers[0] || { kana: 'ねこ', romaji: 'neko' };
      const distractor2 = shuffledOthers[1] || { kana: 'いぬ', romaji: 'inu' };

      const tracksData = [
        { kana: chosenWord.kana, id: chosenWord.romaji, isCorrect: true },
        { kana: distractor1.kana, id: distractor1.romaji, isCorrect: false },
        { kana: distractor2.kana, id: distractor2.romaji, isCorrect: false }
      ].sort(() => 0.5 - Math.random());

      const tracks = tracksData.map((t, idx) => ({
        trackNumber: (idx + 1) as 1 | 2 | 3,
        kana: t.kana,
        id: t.id,
        isCorrect: t.isCorrect
      }));

      return {
        id: `task_${Date.now()}_${Math.random()}`,
        isWord: true,
        ticketDisplay: chosenWord.romaji.toUpperCase(),
        ticketMeaningSv: `${persona.avatar} ${chosenWord.meaningSv}`,
        correctKana: chosenWord.kana,
        correctId: chosenWord.romaji,
        tracks,
        persona,
        timeLimitMs: Math.round(station.baseTimeSeconds * 1000 * 1.2) // Extra time for words
      };
    } else {
      // Pick a single Kana character from station pool
      const validPool = station.kanaIds.map(id => KANA_MAP.get(id)).filter((k): k is KanaCharacter => Boolean(k));
      const targetKana = validPool[Math.floor(Math.random() * validPool.length)] || HIRAGANA_DATA[0];

      const persona = getMnemonicPersona(targetKana.id, targetKana.kana, false);

      // Smart distractor selection:
      // If target has a defined twin pair in this station, try to pick it!
      let distractor1: KanaCharacter | undefined;
      let distractor2: KanaCharacter | undefined;

      if (station.twinPairs) {
        const twinMatch = station.twinPairs.find(pair => pair[0] === targetKana.id || pair[1] === targetKana.id);
        if (twinMatch) {
          const twinId = twinMatch[0] === targetKana.id ? twinMatch[1] : twinMatch[0];
          distractor1 = KANA_MAP.get(twinId);
        }
      }

      // If no twin or distractor1 not found, pick random from station pool
      const poolWithoutTarget = validPool.filter(k => k.id !== targetKana.id);
      if (!distractor1) {
        distractor1 = poolWithoutTarget[Math.floor(Math.random() * poolWithoutTarget.length)] || HIRAGANA_DATA[1];
      }

      const poolWithoutBoth = poolWithoutTarget.filter(k => k.id !== distractor1?.id);
      distractor2 = poolWithoutBoth[Math.floor(Math.random() * poolWithoutBoth.length)] || HIRAGANA_DATA[2];

      const tracksData = [
        { kana: targetKana.kana, id: targetKana.id, isCorrect: true },
        { kana: distractor1.kana, id: distractor1.id, isCorrect: false },
        { kana: distractor2.kana, id: distractor2.id, isCorrect: false }
      ].sort(() => 0.5 - Math.random());

      const tracks = tracksData.map((t, idx) => ({
        trackNumber: (idx + 1) as 1 | 2 | 3,
        kana: t.kana,
        id: t.id,
        isCorrect: t.isCorrect
      }));

      return {
        id: `task_${Date.now()}_${Math.random()}`,
        isWord: false,
        ticketDisplay: targetKana.romaji.toUpperCase(),
        ticketMeaningSv: `${persona.avatar} ${persona.titleSv}`,
        correctKana: targetKana.kana,
        correctId: targetKana.id,
        characterInfo: targetKana,
        tracks,
        persona,
        timeLimitMs: Math.round(station.baseTimeSeconds * 1000)
      };
    }
  }, [getMnemonicPersona]);

  // ----------------------------------------------------
  // START GAME / START STATION
  // ----------------------------------------------------
  const handleStartGame = (stationIdx: number, mode: GameMode) => {
    sfx.playClick();
    sfx.playTrainChime();
    setCurrentStationIndex(stationIdx);
    setGameMode(mode);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setPassengersServed(0);
    setStationPassengersServed(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setSessionXpEarned(0);
    setSelectedTrack(null);
    setFeedback(null);
    setFeedbackInfo(null);
    setDepartingTrack(null);
    setShowMnemonic(false);
    doorChimePlayedRef.current = false;
    setIsTrainArriving(true);
    setTimeout(() => setIsTrainArriving(false), 500);

    const station = SHINKANSEN_STATIONS[stationIdx];
    const initialTask = generatePassengerTask(station);
    setCurrentTask(initialTask);
    setTimeRemainingMs(initialTask.timeLimitMs);
    lastTickTimeRef.current = Date.now();
    setGameState('playing');
  };

  // Next passenger in current station
  const nextPassenger = useCallback((station: StationConfig) => {
    setSelectedTrack(null);
    setFeedback(null);
    setFeedbackInfo(null);
    setDepartingTrack(null);
    setShowMnemonic(false);
    doorChimePlayedRef.current = false;
    setIsTrainArriving(true);
    setTimeout(() => setIsTrainArriving(false), 450);

    const task = generatePassengerTask(station);
    setCurrentTask(task);
    setTimeRemainingMs(task.timeLimitMs);
    lastTickTimeRef.current = Date.now();
  }, [generatePassengerTask]);

  // ----------------------------------------------------
  // TIMER TICK LOOP
  // ----------------------------------------------------
  useEffect(() => {
    if (gameState !== 'playing' || !currentTask || feedback !== null) {
      return;
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      // In Zen mode, timer ticks at 60% speed for relaxation
      const actualDelta = gameMode === 'zen' ? delta * 0.6 : delta;

      setTimeRemainingMs((prev) => {
        const nextTime = prev - actualDelta;
        const timeRatio = nextTime / currentTask.timeLimitMs;

        // Trigger door closing chime when reaching < 35% time
        if (timeRatio < 0.35 && !doorChimePlayedRef.current && !isSoundMuted) {
          doorChimePlayedRef.current = true;
          sfx.playDoorChime();
        }

        if (nextTime <= 0) {
          // Timeout occurred!
          handleTimeout();
          return 0;
        }
        return nextTime;
      });
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentTask, feedback, gameMode, isSoundMuted]);

  // ----------------------------------------------------
  // HANDLE TIMEOUT
  // ----------------------------------------------------
  const handleTimeout = () => {
    if (!currentTask || feedback !== null) return;

    sfx.playMiss();
    sfx.playDoorPneumatic();
    setFeedback('timeout');
    setTotalAttempts(prev => prev + 1);
    setCombo(0);

    if (gameMode === 'rush') {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        handleGameOver();
        return;
      }
    }

    setTimeout(() => {
      nextPassenger(stationConfig);
    }, 1400);
  };

  // ----------------------------------------------------
  // HANDLE TRACK SELECTION (CLICK / KEYBOARD)
  // ----------------------------------------------------
  const handleSelectTrack = (trackNumber: 1 | 2 | 3) => {
    if (gameState !== 'playing' || !currentTask || feedback !== null) return;

    const chosenTrack = currentTask.tracks.find(t => t.trackNumber === trackNumber);
    if (!chosenTrack) return;

    setSelectedTrack(trackNumber);
    setTotalAttempts(prev => prev + 1);

    if (chosenTrack.isCorrect) {
      // ---------------- CORRECT SELECTION ----------------
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      setCorrectCount(prev => prev + 1);
      setPassengersServed(prev => prev + 1);
      setStationPassengersServed(prev => prev + 1);

      // Play audio & voice
      sfx.playCatch(newCombo);
      sfx.playDoorPneumatic();
      if (!isSoundMuted) {
        playJapaneseSpeech(currentTask.correctKana);
      }

      // Bonus train whistle on milestone combos or train filling up
      if (newCombo % 5 === 0) {
        setTimeout(() => sfx.playTrainWhistle(), 300);
      }

      // Calculate score with combo multiplier + reaction speed bonus
      const speedRatio = Math.max(0, timeRemainingMs / currentTask.timeLimitMs);
      const speedBonus = Math.round(speedRatio * 50);
      const comboMultiplier = 1 + Math.min(newCombo * 0.2, 2.5);
      const pointsEarned = Math.round((100 + speedBonus) * comboMultiplier);
      const newScore = score + pointsEarned;
      setScore(newScore);

      // Calculate XP
      const earnedXp = Math.round(pointsEarned * 0.12);
      setSessionXpEarned(prev => prev + earnedXp);

      setFeedback('correct');
      setFeedbackInfo({
        kana: currentTask.correctKana,
        romaji: currentTask.ticketDisplay
      });
      setDepartingTrack(trackNumber);

      // Check if station passenger target reached in Rush Mode
      const newStationCount = stationPassengersServed + 1;
      if (gameMode === 'rush' && newStationCount >= stationConfig.passengersTarget) {
        setTimeout(() => {
          handleStationComplete(newScore);
        }, 1300);
      } else {
        setTimeout(() => {
          nextPassenger(stationConfig);
        }, 1200);
      }
    } else {
      // ---------------- WRONG SELECTION ----------------
      sfx.playMiss();
      sfx.playDoorPneumatic();
      setCombo(0);
      setFeedback('wrong');
      setFeedbackInfo({
        kana: currentTask.correctKana,
        romaji: currentTask.ticketDisplay
      });

      if (gameMode === 'rush') {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => {
            handleGameOver();
          }, 1200);
          return;
        }
      }

      setTimeout(() => {
        nextPassenger(stationConfig);
      }, 1500);
    }
  };

  // ----------------------------------------------------
  // KEYBOARD HOTKEYS (1, 2, 3 / A, S, D / Arrow Keys)
  // ----------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      // Ignore input when user is typing in an input element
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1' || e.code === 'Digit1' || e.code === 'Numpad1' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSelectTrack(1);
      } else if (e.key === '2' || e.code === 'Digit2' || e.code === 'Numpad2' || e.key === 's' || e.key === 'S' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleSelectTrack(2);
      } else if (e.key === '3' || e.code === 'Digit3' || e.code === 'Numpad3' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleSelectTrack(3);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (currentTask && !isSoundMuted) {
          playJapaneseSpeech(currentTask.correctKana);
        }
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowMnemonic(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentTask, feedback, lives, gameMode, isSoundMuted]);

  // ----------------------------------------------------
  // HANDLE STATION CLEAR
  // ----------------------------------------------------
  const handleStationComplete = (finalScore: number) => {
    sfx.playLevelUp();
    sfx.playTrainWhistle();
    fireSuperCelebration();

    // Award XP
    const { newXp, newLevel } = calculateXpAndLevel(userStats.xp, sessionXpEarned + 100);
    const prevHigh = userStats.highScores.shinkansenRush || 0;
    const newHigh = Math.max(prevHigh, finalScore);

    const updatedStats: UserStats = {
      ...userStats,
      xp: newXp,
      level: newLevel,
      highScores: {
        ...userStats.highScores,
        shinkansenRush: newHigh
      }
    };

    onUpdateStats(updatedStats);
    saveUserStats(updatedStats);

    setGameState('station_cleared');
  };

  // ----------------------------------------------------
  // HANDLE GAME OVER
  // ----------------------------------------------------
  const handleGameOver = () => {
    sfx.playGameOver();

    // Save final stats
    const { newXp, newLevel } = calculateXpAndLevel(userStats.xp, sessionXpEarned);
    const prevHigh = userStats.highScores.shinkansenRush || 0;
    const newHigh = Math.max(prevHigh, score);

    const updatedStats: UserStats = {
      ...userStats,
      xp: newXp,
      level: newLevel,
      highScores: {
        ...userStats.highScores,
        shinkansenRush: newHigh
      }
    };

    onUpdateStats(updatedStats);
    saveUserStats(updatedStats);

    setGameState('gameover');
  };

  // ----------------------------------------------------
  // ADVANCE TO NEXT STATION
  // ----------------------------------------------------
  const handleAdvanceStation = () => {
    const nextIdx = currentStationIndex + 1;
    if (nextIdx < SHINKANSEN_STATIONS.length) {
      handleStartGame(nextIdx, gameMode);
    } else {
      // Loop back to start or master mode
      handleStartGame(0, gameMode);
    }
  };

  // ====================================================
  // RENDER: STATION SELECT SCREEN (MAP / ROUTE HUB)
  // ====================================================
  if (gameState === 'station_select') {
    const currentHigh = userStats.highScores.shinkansenRush || 0;

    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
        {/* TOP ARCADE BACK BUTTON & HEADER */}
        {onBackToArcade && (
          <button
            onClick={onBackToArcade}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-sumi-900 border border-slate-200 dark:border-sumi-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-sumi-800 transition-all shadow-xs"
          >
            <ArrowLeft size={15} />
            <span>Tillbaka till Spelarkaden</span>
          </button>
        )}

        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-900 via-slate-900 to-sumi-950 border-2 border-slate-800 text-white p-6 sm:p-8 shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-black tracking-widest uppercase">
                <Train size={13} />
                <span>新幹線ステーションラッシュ • SHINKANSEN RUSH</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <span>Shinkansen Station Rush</span>
                <span className="text-2xl font-jp opacity-60 font-normal">新幹線</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Kliv in i rollen som stationschef på Japans legendariska snabbtågsstationer. Matcha passagerarnas svenska minnesbilder och biljetter till rätt Shinkansen-vagn innan dörrarna stängs och tåget avgår!
              </p>
            </div>

            {/* Quick Stats & Controls Card */}
            <div className="bg-sumi-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-3 shrink-0 self-start md:self-auto min-w-[220px]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Ditt Rekord</span>
                <Trophy size={14} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {currentHigh > 0 ? `${currentHigh.toLocaleString()} p` : '0 p'}
              </div>

              {/* Mode Switcher */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setGameMode('rush')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black transition-all ${
                    gameMode === 'rush'
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame size={14} />
                  <span>Rush (3 Liv)</span>
                </button>
                <button
                  onClick={() => setGameMode('zen')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-black transition-all ${
                    gameMode === 'zen'
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass size={14} />
                  <span>Zen (Övning)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 STATIONS SELECTION GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin size={20} className="text-brand-gold" />
              <span>Välj Startstation & Rutt</span>
            </h2>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              5 Progressiva Stationer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SHINKANSEN_STATIONS.map((station, idx) => (
              <div
                key={station.id}
                onClick={() => handleStartGame(idx, gameMode)}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-sumi-900 border-2 border-slate-200 dark:border-sumi-800 p-5 hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
              >
                {/* Station accent gradient header */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-linear-to-r ${station.themeGradient}`} />

                <div className="space-y-4 pt-1">
                  {/* Station Number + Japanese Kanji Badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-sumi-800 border border-slate-200 dark:border-sumi-700 flex items-center justify-center font-black text-sm text-slate-800 dark:text-white group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                        {station.id}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Station {station.id}
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{station.nameSv}</span>
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-jp text-lg font-black text-slate-700 dark:text-slate-200">
                        {station.nameKanji}
                      </span>
                      <div className="text-[10px] font-mono text-slate-400">
                        {station.nameJp}
                      </div>
                    </div>
                  </div>

                  {/* Train Info Tag */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${station.badgeBg}`}>
                      {station.trainCode}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {station.trainModel}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {station.description}
                  </p>

                  {/* Learning Focus Pill */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-sumi-800/80 border border-slate-200/70 dark:border-sumi-700/60">
                    <div className="text-[10px] font-bold text-brand-gold uppercase flex items-center gap-1">
                      <Sparkles size={11} />
                      <span>Inlärningsfokus</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                      {station.learningFocus}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-sumi-800 flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock size={13} />
                    <span>{station.baseTimeSeconds}s / avgång</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartGame(idx, gameMode);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm"
                  >
                    <span>Starta</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // RENDER: PLAYING SCREEN (INTERACTIVE PLATFORM SCENE)
  // ====================================================
  if (gameState === 'playing' && currentTask) {
    const timePercentage = Math.max(0, (timeRemainingMs / currentTask.timeLimitMs) * 100);
    const isStressTime = timePercentage < 35;
    const isCriticalTime = timePercentage < 18;

    // Door Open Ratio: 1.0 = Fully open, 0.0 = Fully closed
    // When departing with correct answer, force snap to closed
    const doorOpenRatio = feedback === 'correct' || feedback === 'timeout' 
      ? 0 
      : Math.max(0, Math.min(1, timePercentage / 100));

    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-4 animate-fadeIn select-none">
        {/* ============================================================ */}
        {/* TOP STATUS BAR: Navigation, Station Tag, Score, Lives, Combo */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-sumi-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 shadow-sm">
          {/* Back to Station Select */}
          <button
            onClick={() => {
              sfx.playClick();
              setGameState('station_select');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-sumi-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Stationer</span>
          </button>

          {/* Current Station Header Pill */}
          <div className="flex items-center gap-2">
            <span className="font-jp text-base font-black text-slate-900 dark:text-white px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-sumi-800 border border-slate-200 dark:border-sumi-700">
              {stationConfig.nameKanji}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
              {stationConfig.nameRomaji}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 uppercase">
              St. {stationConfig.id}/5
            </span>
          </div>

          {/* Right Metrics: Combo & Lives / Mode */}
          <div className="flex items-center gap-3">
            {/* Combo Pill */}
            {combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-500 text-xs font-black animate-soft-pulse">
                <Flame size={14} className="text-amber-500" />
                <span>{combo}x</span>
              </div>
            )}

            {/* Lives or Zen Mode */}
            {gameMode === 'rush' ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((heartIndex) => (
                  <Heart
                    key={heartIndex}
                    size={18}
                    className={`transition-transform duration-300 ${
                      heartIndex <= lives
                        ? 'fill-rose-500 text-rose-500 scale-100'
                        : 'text-slate-300 dark:text-sumi-700 scale-75'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
                <Compass size={14} />
                <span>Zen</span>
              </div>
            )}

            {/* Score */}
            <div className="text-right pl-2 border-l border-slate-200 dark:border-sumi-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Poäng</div>
              <div className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-amber-400">
                {score.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* JAPANESE STATION PLATFORM ARENA (PERRONG MED PASSAGERARE & SKJUTDÖRRAR) */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl bg-sumi-950 border-2 border-slate-800 text-white shadow-2xl">
          {/* Station Pillar / Overhead Sign */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-mono">
            {/* Station Signage Pillar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-jp font-black text-cyan-300">{stationConfig.nameKanji}</span>
                <span className="text-[11px] text-slate-300">{stationConfig.nameRomaji}</span>
              </div>
              <span className="text-slate-500 hidden md:inline">➔</span>
              <div className="text-[11px] text-slate-400 hidden md:flex items-center gap-1">
                <span>Nästa:</span>
                <strong className="text-slate-300 font-jp">{stationConfig.nextStationKanji}</strong>
                <span>({stationConfig.nextStationRomaji})</span>
              </div>
            </div>

            {/* Departure Progress & Train Type */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                {stationConfig.line}
              </span>
              {gameMode === 'rush' && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-bold text-emerald-400 border border-slate-700">
                  {stationPassengersServed}/{stationConfig.passengersTarget} Ombord
                </span>
              )}
            </div>
          </div>

          {/* MAIN PLATFORM STAGE: ACTIVE PASSENGER & TICKET */}
          <div className="p-4 sm:p-6 bg-linear-to-b from-sumi-950 via-slate-900 to-sumi-950">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left: Active Passenger Avatar & Speech Bubble + Queue Behind */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative shrink-0">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-sumi-900 border-2 flex items-center justify-center text-4xl sm:text-5xl shadow-xl transition-all ${
                    feedback === 'correct' ? 'scale-110 border-emerald-400 ring-4 ring-emerald-400/30' :
                    feedback === 'wrong' || feedback === 'timeout' ? 'shake border-rose-500 ring-4 ring-rose-500/30' :
                    isStressTime ? 'animate-bounce border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-700'
                  }`}>
                    {currentTask.persona.avatar}
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 text-xl">
                    {feedback === 'correct' ? '😊' :
                     feedback === 'wrong' || feedback === 'timeout' ? '😭' :
                     isStressTime ? '😱' : '🎫'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-100">{currentTask.persona.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold">
                      {currentTask.persona.titleSv}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic max-w-xs leading-snug">
                    "{isStressTime ? currentTask.persona.stressQuote : currentTask.persona.happyQuote}"
                  </p>

                  {/* Upcoming queue on platform */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Users size={11} /> Kö:
                    </span>
                    <div className="flex items-center -space-x-1">
                      {upcomingQueue.map((p, i) => (
                        <span
                          key={p.id + i}
                          title={`${p.name} (${p.titleSv})`}
                          className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm opacity-80 hover:opacity-100 transition-opacity"
                        >
                          {p.avatar}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: THE BOARDING TICKET CARD */}
              <div className="bg-sumi-900/95 border-2 border-amber-400/50 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center min-w-[260px] sm:min-w-[300px] text-center shadow-2xl relative">
                <div className="text-[10px] font-black text-amber-400 tracking-widest uppercase flex items-center gap-1.5 mb-1">
                  <span>BILJETT • 指定席</span>
                  <span className="text-sm">{currentTask.persona.avatar}</span>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-wider text-shadow-glow">
                  {currentTask.ticketDisplay}
                </div>

                {currentTask.ticketMeaningSv && (
                  <div className="text-xs font-bold text-amber-300 mt-1 max-w-[250px] truncate bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                    {currentTask.ticketMeaningSv}
                  </div>
                )}

                {/* Speech Sound & Hint Buttons */}
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800 w-full justify-center">
                  <button
                    onClick={() => playJapaneseSpeech(currentTask.correctKana)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sumi-800 hover:bg-sumi-700 text-xs font-bold text-cyan-300 transition-colors"
                    title="Lyssna på uttalet (Mellanslag)"
                  >
                    <Volume2 size={14} />
                    <span>Lyssna</span>
                  </button>

                  {currentTask.characterInfo?.mnemonic && (
                    <button
                      onClick={() => setShowMnemonic(prev => !prev)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sumi-800 hover:bg-sumi-700 text-xs font-bold text-brand-gold transition-colors"
                      title="Visa ledtråd (H)"
                    >
                      <Lightbulb size={14} />
                      <span>Ledtråd</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mnemonic Reveal Box */}
            {showMnemonic && currentTask.characterInfo?.mnemonic && (
              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs flex items-start gap-2.5 mt-4 animate-fadeIn">
                <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Minnesregel: </strong>
                  <span>{currentTask.characterInfo.mnemonic.storySv}</span>
                </div>
              </div>
            )}

            {/* DEPARTURE COUNTDOWN TIMER BAR */}
            <div className="space-y-1.5 pt-5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={`font-black flex items-center gap-1.5 ${
                  isCriticalTime ? 'text-rose-400 animate-pulse' :
                  isStressTime ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  <Clock size={13} />
                  <span>
                    {isCriticalTime ? 'DÖRRARNA STÄNGS NU!' :
                     isStressTime ? 'DÖRRARNA STÄNGS SNART!' : 'Avgångstimer (Avgår vid 0s)'}
                  </span>
                </span>
                <span className="font-bold text-slate-300">
                  {(timeRemainingMs / 1000).toFixed(1)}s
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-75 ease-linear ${
                    isCriticalTime ? 'bg-rose-500 animate-pulse shadow-rose-500/50 shadow-md' :
                    isStressTime ? 'bg-amber-400 shadow-amber-400/50 shadow-md' : 'bg-cyan-400 shadow-cyan-400/50 shadow-md'
                  }`}
                  style={{ width: `${timePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* THE 3 SHINKANSEN TRACKS WITH REAL-TIME SLIDING DOORS & TENJI BLOCKS */}
          {/* ============================================================ */}
          <div className="bg-slate-900 border-t-2 border-slate-800 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Train size={16} className="text-cyan-400" />
                <span>Välj Rätt Shinkansen-Vagn att Gå Ombord:</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Snabbtangenter: [1] [2] [3] eller [A] [S] [D]
              </span>
            </div>

            {/* 3 SHINKANSEN TRACKS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTask.tracks.map((track) => {
                const isChosen = selectedTrack === track.trackNumber;
                const isDeparting = departingTrack === track.trackNumber;

                // Feedback border styles
                let coachBorderColor = 'border-slate-700 hover:border-cyan-400';
                if (feedback !== null) {
                  if (track.isCorrect) {
                    coachBorderColor = 'border-emerald-400 ring-4 ring-emerald-400/30';
                  } else if (isChosen && !track.isCorrect) {
                    coachBorderColor = 'border-rose-500 ring-4 ring-rose-500/30';
                  }
                }

                // Door LED status color
                const doorLedColor = isCriticalTime || feedback === 'timeout'
                  ? 'bg-rose-500 animate-ping'
                  : isStressTime
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400';

                return (
                  <div
                    key={track.trackNumber}
                    onClick={() => handleSelectTrack(track.trackNumber)}
                    className={`group relative flex flex-col justify-between rounded-3xl bg-sumi-950 border-2 p-3 sm:p-4 text-left transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-98 ${coachBorderColor} ${
                      isDeparting ? 'animate-slideOutRight' : isTrainArriving ? 'animate-slideInLeft' : ''
                    }`}
                  >
                    {/* TOP PLATFORM STATUS: Track Number + Door Warning Lamp */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-white text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                          {track.trackNumber}
                        </span>
                        <span className="text-xs font-black text-slate-200">
                          {track.trackNumber}番線 (Spår {track.trackNumber})
                        </span>
                      </div>

                      {/* Door Status LED Lamp */}
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono">
                        <span className={`w-2 h-2 rounded-full ${doorLedColor}`} />
                        <span className="text-slate-400">
                          {doorOpenRatio === 0 ? 'STÄNGD' : isStressTime ? 'STÄNGS' : 'ÖPPEN'}
                        </span>
                      </div>
                    </div>

                    {/* SHINKANSEN COACH BODY (TRAIN EXTERIOR + CABIN INTERIOR + SLIDING DOORS) */}
                    <div className="my-3 rounded-2xl bg-linear-to-b from-slate-200 via-slate-100 to-slate-300 dark:from-slate-800 dark:via-sumi-900 dark:to-slate-950 border-2 border-slate-600 dark:border-slate-700 relative overflow-hidden shadow-inner">
                      
                      {/* Aerodynamic Livery Stripe */}
                      <div className={`h-2 bg-linear-to-r ${stationConfig.liveryColor}`} />

                      {/* Coach Windows & Destination LED display */}
                      <div className="flex items-center justify-between px-3 pt-2 text-[10px] font-mono">
                        <span className="bg-sumi-950 text-cyan-400 px-1.5 py-0.5 rounded font-bold border border-slate-800">
                          CAR 0{track.trackNumber}
                        </span>
                        <span className="text-slate-400 font-jp">
                          {stationConfig.trainName}
                        </span>
                      </div>

                      {/* THE INTERIOR CABIN & SLIDING DOORS FRAME */}
                      <div className="relative mx-3 my-2.5 h-28 rounded-xl bg-amber-50 dark:bg-amber-950/60 border-2 border-slate-400 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
                        
                        {/* Interior Cabin Background (Warm Light & Passenger Seats) */}
                        <div className="absolute inset-0 flex items-center justify-around opacity-20 pointer-events-none text-slate-600 dark:text-amber-200">
                          <span className="text-2xl">💺</span>
                          <span className="text-2xl">💺</span>
                        </div>

                        {/* TARGET HIRAGANA CHARACTER (Inside the Train) */}
                        <div className="relative z-10 font-jp text-4xl sm:text-5xl font-black text-slate-950 dark:text-amber-300 drop-shadow-md transition-transform group-hover:scale-110">
                          {track.kana}
                        </div>

                        {/* SLIDING DOOR - LEFT BLADE */}
                        <div
                          className="absolute top-0 bottom-0 left-0 w-1/2 bg-linear-to-r from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-r-2 border-slate-900 dark:border-slate-950 flex items-center justify-end pr-1 z-20 shadow-md transition-transform duration-75 ease-linear"
                          style={{
                            transform: `translateX(-${doorOpenRatio * 100}%)`
                          }}
                        >
                          {/* Left Door Window Pane */}
                          <div className="w-5 h-16 rounded-md bg-cyan-900/60 border border-cyan-400/40 opacity-80" />
                          <div className="w-1 h-full bg-slate-900/80 ml-1" />
                        </div>

                        {/* SLIDING DOOR - RIGHT BLADE */}
                        <div
                          className="absolute top-0 bottom-0 right-0 w-1/2 bg-linear-to-l from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-l-2 border-slate-900 dark:border-slate-950 flex items-center justify-start pl-1 z-20 shadow-md transition-transform duration-75 ease-linear"
                          style={{
                            transform: `translateX(${doorOpenRatio * 100}%)`
                          }}
                        >
                          <div className="w-1 h-full bg-slate-900/80 mr-1" />
                          {/* Right Door Window Pane */}
                          <div className="w-5 h-16 rounded-md bg-cyan-900/60 border border-cyan-400/40 opacity-80" />
                        </div>
                      </div>

                      {/* Lower Coach Metallic Body Line */}
                      <div className="px-3 pb-1.5 flex justify-between items-center text-[9px] font-mono text-slate-400">
                        <span>SHINKANSEN</span>
                        <span className="font-bold text-slate-500">JR-EAST/WEST</span>
                      </div>
                    </div>

                    {/* PLATFORM FLOOR (TACTILE TENJI BLOCKS & SAFETY LINE) */}
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      {/* Tactile Yellow Braille Paving (点字ブロック) */}
                      <div className="h-2 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-around px-2 overflow-hidden shadow-xs">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(dot => (
                          <span key={dot} className="w-1 h-1 rounded-full bg-amber-600/90 shrink-0" />
                        ))}
                      </div>

                      {/* Bottom Action CTA & Feedback */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-extrabold text-slate-300 group-hover:text-cyan-400 flex items-center gap-1 transition-colors">
                          <span>Gå ombord</span>
                          <ArrowUpRight size={13} />
                        </span>

                        {feedback !== null && track.isCorrect && (
                          <span className="font-black text-emerald-400 flex items-center gap-1 text-xs animate-bounce">
                            <CheckCircle2 size={14} /> Rätt Vagn!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM HELPER BAR: Controls, Sound & Shortcuts */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSoundMuted(prev => !prev)}
              className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isSoundMuted ? 'Ljud av' : 'Ljud på'}</span>
            </button>
          </div>

          <div className="font-mono text-[11px]">
            Totalt expedierade resenärer: <strong className="text-slate-900 dark:text-white">{passengersServed}</strong>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // RENDER: STATION CLEARED MODAL / CELEBRATION
  // ====================================================
  if (gameState === 'station_cleared') {
    const isFinalStation = currentStationIndex === SHINKANSEN_STATIONS.length - 1;

    return (
      <div className="max-w-xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="rounded-3xl bg-white dark:bg-sumi-900 border-2 border-slate-200 dark:border-sumi-800 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-400/15 border-2 border-emerald-400/30 text-emerald-500 flex items-center justify-center text-4xl mx-auto animate-bounce">
            🚄
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-black uppercase">
              <CheckCircle2 size={13} />
              <span>STATION AVKLARAD!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stationConfig.nameSv} {stationConfig.nameKanji}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alla passagerare har framgångsrikt kommit ombord på {stationConfig.trainName}!
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Poäng</div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-amber-400">
                {score.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Max Combo</div>
              <div className="text-lg font-black font-mono text-amber-500">
                {maxCombo}x
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Intjänad XP</div>
              <div className="text-lg font-black font-mono text-emerald-500">
                +{sessionXpEarned} XP
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={() => {
                sfx.playClick();
                setGameState('station_select');
              }}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Välj Station</span>
            </button>

            <button
              onClick={() => handleStartGame(currentStationIndex, gameMode)}
              className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 dark:bg-sumi-800 hover:bg-slate-200 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              Spela Igen
            </button>

            <button
              onClick={handleAdvanceStation}
              className="flex-1 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-transform hover:scale-102"
            >
              <span>{isFinalStation ? 'Tillbaka till Start' : 'Nästa Station'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // RENDER: GAME OVER SCREEN
  // ====================================================
  if (gameState === 'gameover') {
    return (
      <div className="max-w-md mx-auto px-4 py-8 animate-fadeIn">
        <div className="rounded-3xl bg-white dark:bg-sumi-900 border-2 border-slate-200 dark:border-sumi-800 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border-2 border-rose-500/20 text-rose-500 flex items-center justify-center text-3xl mx-auto">
            🛑
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Tåget har avgått!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Du fick slut på liv i {stationConfig.nameSv}. Repetera tecknen och försök igen!
            </p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-800">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Slutpoäng</div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-amber-400">
                {score.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Resenärer</div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                {passengersServed}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setGameState('station_select')}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200"
            >
              Välj Station
            </button>
            <button
              onClick={() => handleStartGame(currentStationIndex, gameMode)}
              className="flex-1 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25"
            >
              Försök Igen 🚄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
