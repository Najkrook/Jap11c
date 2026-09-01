import type { MinimalPair } from '../types/kana';

export interface PhoneticSection {
  id: string;
  titleSv: string;
  icon: string;
  shortSummary: string;
  detailedExplanationSv: string;
  swedishTrap: string; // Vanligaste svenska felet
  howToPractice: string;
  audioExamples: { japanese: string; romaji: string; translation: string; note?: string }[];
}

export const PHONETICS_SECTIONS: PhoneticSection[] = [
  {
    id: 'vowels',
    titleSv: 'De 5 Japanska Vokalerna (A, I, U, E, O)',
    icon: 'Sparkles',
    shortSummary: 'Japanska har bara 5 rena, korta grundvokaler. De är kortare och renare än svenska vokaler.',
    detailedExplanationSv: `
I svenskan har vi 9 vokaler och runt 18 olika vokalljud med subtila diftongeringar. I japanskan finns bara 5 enkla, stabila vokaler:
- **あ (a)**: Likt A i "katt" eller "hatt". Ganska öppet, men aldrig långdraget.
- **い (i)**: Likt I i "sitt" eller "fisk". Mungiporna dras lätt åt sidorna.
- **う (u)**: Det svåraste ljudet för svenskar! Svenskt "u" (som i "hus") är starkt rundat med plutande läppar. Japanskt /ɯ/ uttalas med **helt orundade läppar**! Det ligger mitt emellan svenskt o och u.
- **え (e)**: Likt E i "ett" eller "penna". Rent och klart.
- **お (o)**: Likt Å/O i "boll" eller "kock". Läpparna bildar en liten ren cirkel utan att glida mot u.
    `,
    swedishTrap: 'Att runda läpparna på "u" så det låter som svenskt "hus" eller "sko", eller att göra vokalerna långa i onödan.',
    howToPractice: 'Säg "u" med ett leende eller avslappnad mun utan att putsluta med läpparna.',
    audioExamples: [
      { japanese: 'あ', romaji: 'a', translation: 'Vokal A' },
      { japanese: 'い', romaji: 'i', translation: 'Vokal I' },
      { japanese: 'う', romaji: 'u', translation: 'Vokal U (orundad)' },
      { japanese: 'え', romaji: 'e', translation: 'Vokal E' },
      { japanese: 'お', romaji: 'o', translation: 'Vokal O' }
    ]
  },
  {
    id: 'r_sound',
    titleSv: 'Japanskt R-ljud (Alveolar Tap / Tungspetsstöt)',
    icon: 'Activity',
    shortSummary: 'Japanskt R är varken ett skorrande eller rullande R – det är en snabb klaff-nuddning mot tandvallen.',
    detailedExplanationSv: `
För svensktalande är japanskt "r" (ra, ri, ru, re, ro) en av de största överraskningarna.
- Det är **inte** det skorrande tungrots-R som finns i södra Sverige.
- Det är **inte** det engelska bakåtböjda R i "red".
- Det är en **alveolar tap (klaff)** [ɾ]: Tungspetsen gör en blixtsnabb stöt mot tandvallen (området strax bakom övre framtänderna), precis som när en amerikan säger "tt" eller "dd" i ordet "water" eller "butter".
- För ett svenskt öra kan det ibland låta nästan som ett snabbt "d" eller "l".
    `,
    swedishTrap: 'Att rulla med tungspetsen som i spanskans R eller skorra i halsen.',
    howToPractice: 'Försök säga "la" men med en supersnabb dutt med tungspetsen strax bakom framtänderna.',
    audioExamples: [
      { japanese: 'ら', romaji: 'ra', translation: 'Ra' },
      { japanese: 'り', romaji: 'ri', translation: 'Ri' },
      { japanese: 'る', romaji: 'ru', translation: 'Ru' },
      { japanese: 'れ', romaji: 're', translation: 'Re' },
      { japanese: 'ろ', romaji: 'ro', translation: 'Ro' },
      { japanese: 'さくら', romaji: 'sakura', translation: 'Körsbärsblomma' }
    ]
  },
  {
    id: 'sokuon_chouon',
    titleSv: 'Dubbelkonsonanter (っ) & Långa Vokaler (Chōon)',
    icon: 'Clock',
    shortSummary: 'I japanskan har tidslängden (morarytmen) avgörande betydelse för ordets innebörd.',
    detailedExplanationSv: `
Japanska styrs av en taktmätare som kallas **mora** (taktslag). Varje kana är exakt 1 taktslag.
1. **Litet Tsu (っ - Sokuon)**:
   - Ett litet っ tar upp ett helt taktslag av **tystnad** (paus) innan nästa konsonant exploderar!
   - Exempel: きて (kite = kom!) är 2 taktslag [ki-te].
   - Exempel: きって (kitte = frimärke) är 3 taktslag [ki - (paus) - te].
2. **Långa vokaler (Chōon)**:
   - En förlängd vokal hålls i exakt dubbel längd (2 morae).
   - おばさん (obasan = tant/faster) [3 slag].
   - おばあさん (obaasan = mormor/farmor) [4 slag].
    `,
    swedishTrap: 'Att slarva med längden så att man råkar säga "tant" när man menar "mormor", eller "kom" när man menar "frimärke".',
    howToPractice: 'Klappa takten med handen: 1 klapp för varje kana, 1 klapp för det tysta lilla っ!',
    audioExamples: [
      { japanese: 'きて', romaji: 'kite', translation: 'kom! (2 slag)' },
      { japanese: 'きって', romaji: 'kitte', translation: 'frimärke (3 slag)' },
      { japanese: 'おじさん', romaji: 'ojisan', translation: 'morbror/farbror (3 slag)' },
      { japanese: 'おじいさん', romaji: 'ojiisan', translation: 'morfar/farfar (4 slag)' }
    ]
  },
  {
    id: 'voiceless_vowels',
    titleSv: 'Viskade Vokaler (Devoicing av I och U)',
    icon: 'VolumeX',
    shortSummary: 'I och U mellan tonlösa konsonanter (eller i slutet av meningar) viskas ofta bort.',
    detailedExplanationSv: `
När vokalerna **i** och **u** hamnar mellan tonlösa konsonanter (k, s, t, h, p) eller i slutet av en fras efter tonlös konsonant, vibrerar inte stämbanden – vokalen viskas eller "tappas" nästan:
- **です (desu)** -> Uttalas i normalt talspråk som "dess".
- **〜ます (masu)** -> Uttalas som "mass".
- **すき (suki)** -> Uttalas som "ski" (jag gillar).
- **した (shita)** -> Uttalas som "shta" (gjorde / under).
- **がくせい (gakusei)** -> Uttalas nästan som "gak-see" (student).
    `,
    swedishTrap: 'Att överdrivet betona "u":et i "desu" så det låter som "de-SUUU".',
    howToPractice: 'Lyssna på hur modersmålstalare säger "Desu" – det slutar med ett skarpt väsande s-ljud.',
    audioExamples: [
      { japanese: 'です', romaji: 'desu', translation: 'är (copula)' },
      { japanese: 'すきです', romaji: 'suki desu', translation: 'jag gillar' },
      { japanese: 'がくせい', romaji: 'gakusei', translation: 'student' },
      { japanese: 'あした', romaji: 'ashita', translation: 'i morgon' }
    ]
  },
  {
    id: 'pitch_accent',
    titleSv: 'Japansk Tonaccent (Pitch Accent)',
    icon: 'TrendingUp',
    shortSummary: 'Japanska är ett tonaccentspråk (hög/låg tonhöjd) precis som svenskans grav/akut accent!',
    detailedExplanationSv: `
Svenska och japanska är faktiskt två av få språk som använder **tonaccent**!
I svenskan har vi skillnad på "anden" (fågeln) och "anden" (spöket).
I standardjapanska rör sig rösten mellan **Hög (High)** och **Låg (Low)** tonhöjd:
1. **Heiban (Platt mönster ⓪)**: Börjar lågt och stiger till högt, fortsätter högt in i partikeln.
2. **Atamadaka (Huvudtopp ①)**: Första stavelsen är HÖG, därefter faller tonen direkt till låg.
   - Exempel: **あめ (á-me)** med hög första stavelse betyder **Regn**!
   - Exempel: **あめ (a-mé)** med låg-hög ton betyder **Godis**!
3. **Nakadaka (Mellantopp)**: Tonen stiger i mitten och faller sedan.
4. **Odaka (Svanstopp)**: Tonen är hög ända till ordets slut och faller på följande partikel.
    `,
    swedishTrap: 'Att använda svensk dynamisk tryckaccent (betona genom att trycka hårdare på en vokal) istället för musikalisk tonhöjdsändring.',
    howToPractice: 'Tänk på tonerna som musikaliska noter: sjung tonen aningen ljusare snarare än att trycka till med magen.',
    audioExamples: [
      { japanese: 'あめ (雨)', romaji: 'ame [1]', translation: 'Regn (Hög-Låg ton)' },
      { japanese: 'あめ (飴)', romaji: 'ame [0/2]', translation: 'Godis (Låg-Hög ton)' },
      { japanese: 'はし (箸)', romaji: 'hashi [1]', translation: 'Ätpinnar (Hög-Låg)' },
      { japanese: 'はし (橋)', romaji: 'hashi [2]', translation: 'Bro (Låg-Hög)' }
    ]
  }
];

export const MINIMAL_PAIRS_DATA: MinimalPair[] = [
  {
    id: 'mp1',
    title: 'Kort vokal vs Lång vokal (Mormor vs Tant)',
    explanationSv: 'Att hålla ut vokalen ett extra taktslag ändrar ordets betydelse helt!',
    pitfall: 'Obasan = tant; Obaasan = mormor/farmor.',
    item1: {
      kana: 'おばさん',
      romaji: 'obasan',
      meaningSv: 'Tant / Faster / Moster (3 morae)',
      type: 'Kort vokal [a]'
    },
    item2: {
      kana: 'おばあさん',
      romaji: 'obaasan',
      meaningSv: 'Mormor / Farmor / Gammal dam (4 morae)',
      type: 'Lång vokal [aa]'
    }
  },
  {
    id: 'mp2',
    title: 'Kort vokal vs Lång vokal (Farbror vs Morfar)',
    explanationSv: 'Samma princip för manliga släktingar med vokal I.',
    pitfall: 'Ojisan = medelålders man; Ojiisan = äldre farbror / morfar.',
    item1: {
      kana: 'おじさん',
      romaji: 'ojisan',
      meaningSv: 'Farbror / Morbror (3 morae)',
      type: 'Kort vokal [i]'
    },
    item2: {
      kana: 'おじいさん',
      romaji: 'ojiisan',
      meaningSv: 'Farfar / Morfar (4 morae)',
      type: 'Lång vokal [ii]'
    }
  },
  {
    id: 'mp3',
    title: 'Enkelkonsonant vs Dubbelkonsonant (Sokuon っ)',
    explanationSv: 'Det lilla っ skapar ett tyst taktslag innan konsonanten.',
    pitfall: 'Kite (kom) vs Kitte (frimärke) är ett klassiskt provmoment!',
    item1: {
      kana: 'きて',
      romaji: 'kite',
      meaningSv: 'Kom hit! / Ta på dig (2 morae)',
      type: 'Vanligt t'
    },
    item2: {
      kana: 'きって',
      romaji: 'kitte',
      meaningSv: 'Frimärke (3 morae med paus)',
      type: 'Dubbelkonsonant [tt]'
    }
  },
  {
    id: 'mp4',
    title: 'Enkelt ljud vs Kombinationsljud (Yōon)',
    explanationSv: 'Stort や (ya) ger två stavelser; litet ゃ (kya) ger en enda stavelse.',
    pitfall: 'Kiyaku (regler) vs Kyaku (gäst/kund).',
    item1: {
      kana: 'きやく',
      romaji: 'kiyaku',
      meaningSv: 'Regler / Avtal (3 stavelser: ki-ya-ku)',
      type: 'Stort や'
    },
    item2: {
      kana: 'きゃく',
      romaji: 'kyaku',
      meaningSv: 'Gäst / Kund (2 stavelser: kya-ku)',
      type: 'Litet ゃ (Yōon)'
    }
  },
  {
    id: 'mp5',
    title: 'Röstat vs Halvröstat (Ba vs Pa)',
    explanationSv: 'Dakuten (゛) ger tonande B, Handakuten (゜) ger explosivt P.',
    pitfall: 'Bara (ros) vs Para (para-).',
    item1: {
      kana: 'ば',
      romaji: 'ba',
      meaningSv: 'Ba-ljud (med ゛)',
      type: 'Dakuten'
    },
    item2: {
      kana: 'ぱ',
      romaji: 'pa',
      meaningSv: 'Pa-ljud (med ゜)',
      type: 'Handakuten'
    }
  },
  {
    id: 'mp6',
    title: 'Tonaccent: Regn vs Godis (Ame)',
    explanationSv: 'Båda skrivs あめ, men tonhöjden på första stavelsen avgör betydelsen!',
    pitfall: 'Regn har hög ton på första stavelsen, godis stiger på andra!',
    item1: {
      kana: 'あめ [①]',
      romaji: 'áme (Hög-Låg)',
      meaningSv: 'Regn',
      type: 'Atamadaka (Topp först)'
    },
    item2: {
      kana: 'あめ [⓪]',
      romaji: 'amé (Låg-Hög)',
      meaningSv: 'Godis / Karamell',
      type: 'Heiban (Stiger)'
    }
  }
];
