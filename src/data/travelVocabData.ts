import type { TravelItem } from '../types/anki';
import rawTravelData from './japaneseData.json';

export const TRAVEL_WORDS_CHAPTERS = [
  'Artighet och överlevnad',
  'Förståelse och tempo',
  'Frågeord',
  'Pekord och plats',
  'Platser och transport',
  'Platser du faktiskt behöver',
  'Betalning och vardag',
  'Nyttiga verb',
  'Beskrivningar',
  'Siffror du hör hela tiden',
];

export const TRAVEL_PHRASES_CHAPTERS = [
  'Hälsningar',
  'Förstå och be om hjälp',
  'Tåg, taxi och riktning',
  'Mer vägvisning',
  'Hotell och boende',
  'Restaurang: komma in och beställa',
  'Restaurang: matpreferenser',
  'Shopping',
  'Betalning och små vardagssaker',
  'Problem och sjukdom',
];

const allTravel: TravelItem[] = rawTravelData as TravelItem[];

export const TRAVEL_WORDS: TravelItem[] = allTravel.slice(0, 100);
export const TRAVEL_PHRASES: TravelItem[] = allTravel.slice(100, 200);
