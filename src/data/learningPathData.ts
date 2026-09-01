export interface LearningChapter {
  id: string;
  chapterNumber: number;
  stage: 1 | 2;
  title: string;
  subtitle: string;
  rowName: string;
  kanaIds: string[];
  description: string;
  pedagogicalNote: string;
  targetWords: {
    kana: string;
    romaji: string;
    meaningSv: string;
  }[];
  isCheckpoint?: boolean;
  requiredPriorChapterId?: string;
  xpReward: number;
}

export const LEARNING_CHAPTERS: LearningChapter[] = [
  // ==========================================
  // ETAPP 1: DE FÖRSTA 25 TECKNEN (A TILL NO)
  // ==========================================
  {
    id: 'ch-1',
    chapterNumber: 1,
    stage: 1,
    title: 'Kapitel 1: Vokalerna',
    subtitle: 'Grunden för hela japanska språksystemet',
    rowName: 'A-raden (A, I, U, E, O)',
    kanaIds: ['a', 'i', 'u', 'e', 'o'],
    description: 'De 5 rena vokalerna som alla andra stavelser bygger på. Behåll munnen avslappnad och korta vokalerna.',
    pedagogicalNote: 'Koppla varje vokal till dess svenska bildminne: A = Apel, I = Två iglar, U = Uppsittning, E = Ekorre, O = Golfboll på green.',
    targetWords: [
      { kana: 'あい', romaji: 'ai', meaningSv: 'kärlek' },
      { kana: 'いえ', romaji: 'ie', meaningSv: 'hus / hem' },
      { kana: 'うえ', romaji: 'ue', meaningSv: 'över / uppe' },
      { kana: 'あお', romaji: 'ao', meaningSv: 'blå' },
      { kana: 'いいえ', romaji: 'iie', meaningSv: 'nej' }
    ],
    xpReward: 50
  },
  {
    id: 'ch-2',
    chapterNumber: 2,
    stage: 1,
    title: 'Kapitel 2: K-raden',
    subtitle: 'Kombinera K-ljudet med dina 5 vokaler',
    rowName: 'Ka-raden (Ka, Ki, Ku, Ke, Ko)',
    kanaIds: ['ka', 'ki', 'ku', 'ke', 'ko'],
    description: 'Klart och krispigt K-ljud. Tillsammans med vokalerna kan du nu redan bilda massor av riktiga japanska ord!',
    pedagogicalNote: 'Lägg märke till att く (ku) bara har ett enda streck (som en fågelnäbb) medan き (ki) liknar en nyckel (key).',
    targetWords: [
      { kana: 'あき', romaji: 'aki', meaningSv: 'höst' },
      { kana: 'かお', romaji: 'kao', meaningSv: 'ansikte' },
      { kana: 'きく', romaji: 'kiku', meaningSv: 'lyssna / krysantemum' },
      { kana: 'いけ', romaji: 'ike', meaningSv: 'damm / tjärn' },
      { kana: 'ここ', romaji: 'koko', meaningSv: 'här' }
    ],
    requiredPriorChapterId: 'ch-1',
    xpReward: 50
  },
  {
    id: 'ch-3',
    chapterNumber: 3,
    stage: 1,
    title: 'Kapitel 3: S-raden',
    subtitle: 'Observera det speciella undantaget SHI (し)',
    rowName: 'Sa-raden (Sa, Shi, Su, Se, So)',
    kanaIds: ['sa', 'shi', 'su', 'se', 'so'],
    description: 'I japanskan finns inget rent "si" – stavelsen uttalas alltid "shi" (som i svenskans skinka/tji).',
    pedagogicalNote: 'し (shi) ser ut som en metkrok (eller fiskkrok). Förväxla inte さ (sa) och き (ki) – sa har bara ett tvärstreck!',
    targetWords: [
      { kana: 'あさ', romaji: 'asa', meaningSv: 'morgon' },
      { kana: 'すし', romaji: 'sushi', meaningSv: 'sushi' },
      { kana: 'さけ', romaji: 'sake', meaningSv: 'lax / risvin' },
      { kana: 'せかい', romaji: 'sekai', meaningSv: 'värld' },
      { kana: 'うそ', romaji: 'uso', meaningSv: 'lögn / skämt' }
    ],
    requiredPriorChapterId: 'ch-2',
    xpReward: 50
  },
  {
    id: 'ch-4',
    chapterNumber: 4,
    stage: 1,
    title: 'Kapitel 4: T-raden',
    subtitle: 'Viktiga undantag: CHI (ち) och TSU (つ)',
    rowName: 'Ta-raden (Ta, Chi, Tsu, Te, To)',
    kanaIds: ['ta', 'chi', 'tsu', 'te', 'to'],
    description: 'Istället för "ti" och "tu" har japanskan "chi" (som i chip) och "tsu" (som slutet på ordet katt-sol).',
    pedagogicalNote: 'つ (tsu) liknar en tsunamivåg. ち (chi) liknar en glad cheerleader med tofs.',
    targetWords: [
      { kana: 'つき', romaji: 'tsuki', meaningSv: 'måne' },
      { kana: 'うた', romaji: 'uta', meaningSv: 'sång' },
      { kana: 'ちち', romaji: 'chichi', meaningSv: 'min pappa' },
      { kana: 'て', romaji: 'te', meaningSv: 'hand' },
      { kana: 'おと', romaji: 'oto', meaningSv: 'ljud' }
    ],
    requiredPriorChapterId: 'ch-3',
    xpReward: 50
  },
  {
    id: 'ch-5',
    chapterNumber: 5,
    stage: 1,
    title: 'Kapitel 5: N-raden',
    subtitle: 'Sista steget innan Etapp 1 Delprov!',
    rowName: 'Na-raden (Na, Ni, Nu, Ne, No)',
    kanaIds: ['na', 'ni', 'nu', 'ne', 'no'],
    description: 'Mjuka nasala ljud med N. Nu behärskar du 25 tecken och över hälften av alla vanliga baskana!',
    pedagogicalNote: 'の (no) är en enkel förbjudet-skylt / spiral ("NO entry"). ね (ne) har en ögla på slutet som svansen på en katt (neko).',
    targetWords: [
      { kana: 'なつ', romaji: 'natsu', meaningSv: 'sommar' },
      { kana: 'いぬ', romaji: 'inu', meaningSv: 'hund' },
      { kana: 'ねこ', romaji: 'neko', meaningSv: 'katt' },
      { kana: 'くに', romaji: 'kuni', meaningSv: 'land / hemland' },
      { kana: 'なに', romaji: 'nani', meaningSv: 'vad' }
    ],
    requiredPriorChapterId: 'ch-4',
    xpReward: 50
  },

  // ------------------------------------------
  // CHECKPOINT 1: DELPROV (KAPITEL 1-5)
  // ------------------------------------------
  {
    id: 'cp-1',
    chapterNumber: 5.5,
    stage: 1,
    title: 'Delprov 1: Halvtidscheckpoint',
    subtitle: 'Samlingstest på de första 25 tecknen (A till NO)',
    rowName: 'Samlingstest (A, K, S, T, N)',
    kanaIds: [
      'a', 'i', 'u', 'e', 'o',
      'ka', 'ki', 'ku', 'ke', 'ko',
      'sa', 'shi', 'su', 'se', 'so',
      'ta', 'chi', 'tsu', 'te', 'to',
      'na', 'ni', 'nu', 'ne', 'no'
    ],
    description: 'Ett 15-frågors samlingstest som blandar alla 25 tecken du hittills lärt dig. Få minst 80% för att låsa upp Etapp 2!',
    pedagogicalNote: 'Detta test verifierar att du inte blandar ihop liknande tecken som あ/お, さ/き eller ね/れ/わ.',
    targetWords: [
      { kana: 'あさごはん', romaji: 'asagohan', meaningSv: 'frukost' },
      { kana: 'たなか', romaji: 'tanaka', meaningSv: 'Tanaka (namn)' },
      { kana: 'おとな', romaji: 'otona', meaningSv: 'vuxen' },
      { kana: 'すいか', romaji: 'suika', meaningSv: 'vattenmelon' }
    ],
    isCheckpoint: true,
    requiredPriorChapterId: 'ch-5',
    xpReward: 150
  },

  // ==========================================
  // ETAPP 2: RESTERANDE 21 TECKEN (HA TILL N)
  // ==========================================
  {
    id: 'ch-6',
    chapterNumber: 6,
    stage: 2,
    title: 'Kapitel 6: H-raden',
    subtitle: 'Observera det luftiga undantaget FU (ふ)',
    rowName: 'Ha-raden (Ha, Hi, Fu, He, Ho)',
    kanaIds: ['ha', 'hi', 'fu', 'he', 'ho'],
    description: 'I japanskan uttalas "fu" mjukt med läpparna utan att tänderna nuddar underläppen (som att blåsa ut ett ljus).',
    pedagogicalNote: 'ふ (fu) ser ut som berget Fuji. は (ha) och ほ (ho) är väldigt lika – men ほ har en liten hatt högst upp!',
    targetWords: [
      { kana: 'はな', romaji: 'hana', meaningSv: 'blomma / näsa' },
      { kana: 'ひと', romaji: 'hito', meaningSv: 'människa / person' },
      { kana: 'ふね', romaji: 'fune', meaningSv: 'båt / skepp' },
      { kana: 'へた', romaji: 'heta', meaningSv: 'oskicklig' },
      { kana: 'ほし', romaji: 'hoshi', meaningSv: 'stjärna' }
    ],
    requiredPriorChapterId: 'cp-1',
    xpReward: 50
  },
  {
    id: 'ch-7',
    chapterNumber: 7,
    stage: 2,
    title: 'Kapitel 7: M-raden',
    subtitle: 'Mjuka och melodiska M-ljud',
    rowName: 'Ma-raden (Ma, Mi, Mu, Me, Mo)',
    kanaIds: ['ma', 'mi', 'mu', 'me', 'mo'],
    description: 'M-raden ger dig många centrala ord som mizu (vatten) och ame (regn).',
    pedagogicalNote: 'む (mu) ser ut som en ko som muar. め (me) ser ut som en nudelskål (eller ett öga, "me" betyder öga på japanska).',
    targetWords: [
      { kana: 'まち', romaji: 'machi', meaningSv: 'stad' },
      { kana: 'みみ', romaji: 'mimi', meaningSv: 'öron' },
      { kana: 'むし', romaji: 'mushi', meaningSv: 'insekt' },
      { kana: 'め', romaji: 'me', meaningSv: 'öga' },
      { kana: 'もの', romaji: 'mono', meaningSv: 'sak / föremål' }
    ],
    requiredPriorChapterId: 'ch-6',
    xpReward: 50
  },
  {
    id: 'ch-8',
    chapterNumber: 8,
    stage: 2,
    title: 'Kapitel 8: Y-raden',
    subtitle: 'De 3 halvvokalerna (Ya, Yu, Yo)',
    rowName: 'Ya-raden (Ya, Yu, Yo)',
    kanaIds: ['ya', 'yu', 'yo'],
    description: 'Y-raden har bara tre tecken i modern japanska! Dessa används även senare för att bygga kombinationsljud (きゃ, しゅ, ちょ).',
    pedagogicalNote: 'や (ya) liknar en yak-oxe. ゆ (yu) liknar en simmande fisk eller siffran 102. よ (yo) ser ut som en jojje.',
    targetWords: [
      { kana: 'やま', romaji: 'yama', meaningSv: 'berg' },
      { kana: 'ゆき', romaji: 'yuki', meaningSv: 'snö' },
      { kana: 'よる', romaji: 'yoru', meaningSv: 'natt / kväll' },
      { kana: 'へや', romaji: 'heya', meaningSv: 'rum' },
      { kana: 'ゆめ', romaji: 'yume', meaningSv: 'dröm' }
    ],
    requiredPriorChapterId: 'ch-7',
    xpReward: 50
  },
  {
    id: 'ch-9',
    chapterNumber: 9,
    stage: 2,
    title: 'Kapitel 9: R-raden',
    subtitle: 'Det karakteristiska japanska flappade R/L-ljudet',
    rowName: 'Ra-raden (Ra, Ri, Ru, Re, Ro)',
    kanaIds: ['ra', 'ri', 'ru', 're', 'ro'],
    description: 'Japanskt R är ett snabbt klick med tungspetsen mot tandvallen – en hybrid mellan svenskt D, L och R.',
    pedagogicalNote: 'る (ru) har en rund ögla på slutet medan ろ (ro) är öppen utan ögla. り (ri) är ett rinnande vattendrag.',
    targetWords: [
      { kana: 'さくら', romaji: 'sakura', meaningSv: 'körsbärsblommor' },
      { kana: 'とり', romaji: 'tori', meaningSv: 'fågel' },
      { kana: 'くるま', romaji: 'kuruma', meaningSv: 'bil' },
      { kana: 'しろ', romaji: 'shiro', meaningSv: 'vit / slott' },
      { kana: 'そら', romaji: 'sora', meaningSv: 'himmel' }
    ],
    requiredPriorChapterId: 'ch-8',
    xpReward: 50
  },
  {
    id: 'ch-10',
    chapterNumber: 10,
    stage: 2,
    title: 'Kapitel 10: W-raden & N',
    subtitle: 'De sista pusselbitarna i Hiragana!',
    rowName: 'Wa, Wo, N',
    kanaIds: ['wa', 'wo', 'n'],
    description: 'わ (wa) och grammaticapartikeln を (wo / o), samt japanskans enda fristående konsonant ん (n). Grattis, du kan nu hela alfabetet!',
    pedagogicalNote: 'ん (n) ser precis ut som ett snirkligt litet "n". を (wo) används uteslutande som grammatisk objektsmarkör i meningar.',
    targetWords: [
      { kana: 'わたし', romaji: 'watashi', meaningSv: 'jag / mig' },
      { kana: 'ほん', romaji: 'hon', meaningSv: 'bok' },
      { kana: 'にほん', romaji: 'nihon', meaningSv: 'Japan' },
      { kana: 'せんせい', romaji: 'sensei', meaningSv: 'lärare' },
      { kana: 'おんがく', romaji: 'ongaku', meaningSv: 'musik' }
    ],
    requiredPriorChapterId: 'ch-9',
    xpReward: 50
  },

  // ------------------------------------------
  // CHECKPOINT 2: SLUTPROV (ALLA 46 TECKEN)
  // ------------------------------------------
  {
    id: 'cp-2',
    chapterNumber: 10.5,
    stage: 2,
    title: 'Slutprov: Hiragana Mästardiplom',
    subtitle: 'Det stora certifieringstestet på alla 46 grundtecken',
    rowName: 'Slutprov (Alla 46 tecken)',
    kanaIds: [
      'a', 'i', 'u', 'e', 'o',
      'ka', 'ki', 'ku', 'ke', 'ko',
      'sa', 'shi', 'su', 'se', 'so',
      'ta', 'chi', 'tsu', 'te', 'to',
      'na', 'ni', 'nu', 'ne', 'no',
      'ha', 'hi', 'fu', 'he', 'ho',
      'ma', 'mi', 'mu', 'me', 'mo',
      'ya', 'yu', 'yo',
      'ra', 'ri', 'ru', 're', 'ro',
      'wa', 'wo', 'n'
    ],
    description: 'Slutprovet på 25 frågor som testar hela grundalfabetet, blandade ljud och autentiska japanska glosor från Genki I. Klarar du 80% är du officiellt Hiragana-godkänd!',
    pedagogicalNote: 'Ta god tid på dig och lita på dina svenska minnesbilder när du tvekar.',
    targetWords: [
      { kana: 'ありがとう', romaji: 'arigatou', meaningSv: 'tack så mycket' },
      { kana: 'さようなら', romaji: 'sayounara', meaningSv: 'hejdå' },
      { kana: 'ともだち', romaji: 'tomodachi', meaningSv: 'vän / kompis' },
      { kana: 'がくせい', romaji: 'gakusei', meaningSv: 'student' }
    ],
    isCheckpoint: true,
    requiredPriorChapterId: 'ch-10',
    xpReward: 300
  }
];
