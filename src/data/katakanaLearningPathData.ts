import type { LearningChapter } from './learningPathData';

export const KATAKANA_LEARNING_CHAPTERS: LearningChapter[] = [
  // ==========================================
  // ETAPP 1: DE FÖRSTA 25 KATAKANA (ア TILL ノ)
  // ==========================================
  {
    id: 'kata-ch-1',
    chapterNumber: 1,
    stage: 1,
    title: 'Kapitel 1: Vokalerna (ア, イ, ウ, エ, オ)',
    subtitle: 'Katakana-grunden med skarpa, raka linjer',
    rowName: 'A-raden (ア, イ, ウ, エ, オ)',
    kanaIds: ['kata_a', 'kata_i', 'kata_u', 'kata_e', 'kata_o'],
    description: 'De 5 grundvokalerna i Katakana. Till skillnad från Hiraganas mjuka kurvor kännetecknas Katakana av raka streck och skarpa vinklar.',
    pedagogicalNote: 'Koppla till minnesbilderna: ア = vass Yxa (Axe), イ = Igloo-stöd, ウ = Umbrella-tak, エ = Elevator-hiss, オ = Operasångare.',
    targetWords: [
      { kana: 'アイス', romaji: 'aisu', meaningSv: 'glass (ice cream)' },
      { kana: 'アメリカ', romaji: 'amerika', meaningSv: 'USA / Amerika' },
      { kana: 'アニメ', romaji: 'anime', meaningSv: 'anime' },
      { kana: 'エアコン', romaji: 'eakon', meaningSv: 'luftkonditionering' },
      { kana: 'オレンジ', romaji: 'orenji', meaningSv: 'apelsin' }
    ],
    xpReward: 50
  },
  {
    id: 'kata-ch-2',
    chapterNumber: 2,
    stage: 1,
    title: 'Kapitel 2: Ka-raden (カ, キ, ク, ケ, コ)',
    subtitle: 'Vass krispighet för låneord som Kaffe & Kamera',
    rowName: 'Ka-raden (カ, キ, ク, ケ, コ)',
    kanaIds: ['kata_ka', 'kata_ki', 'kata_ku', 'kata_ke', 'kata_ko'],
    description: 'Ka-raden innehåller några av de vanligaste tecknen i japanska restauranger och caféer.',
    pedagogicalNote: 'カ liknar か utan droppen. キ är en nyckel (Key). コ är ett öppet hörn (Corner). Observera att ク (ku) har ett snedstreck genom hörnet.',
    targetWords: [
      { kana: 'カメラ', romaji: 'kamera', meaningSv: 'kamera' },
      { kana: 'カフェ', romaji: 'kafe', meaningSv: 'café' },
      { kana: 'ケーキ', romaji: 'keeki', meaningSv: 'tårta / kaka' },
      { kana: 'コーヒー', romaji: 'koohii', meaningSv: 'kaffe' },
      { kana: 'クッキー', romaji: 'kukkii', meaningSv: 'kaka / cookie' }
    ],
    requiredPriorChapterId: 'kata-ch-1',
    xpReward: 50
  },
  {
    id: 'kata-ch-3',
    chapterNumber: 3,
    stage: 1,
    title: 'Kapitel 3: Sa-raden (サ, シ, ス, セ, ソ)',
    subtitle: 'Mästra SHI (シ) och SO (ソ) med streckriktningsregeln!',
    rowName: 'Sa-raden (サ, シ, ス, セ, ソ)',
    kanaIds: ['kata_sa', 'kata_shi', 'kata_su', 'kata_se', 'kata_so'],
    description: 'Viktigt kapitel för Katakana-studerande! Lär dig skilja シ (shi) från dess framtida tvillingar genom att studera hur strecken ritas.',
    pedagogicalNote: 'シ (shi) tittar UPP mot solen – svepet dras nedifrån och UPPÅT! ソ (so) startar uppe och dras NEDÅT.',
    targetWords: [
      { kana: 'サラダ', romaji: 'sarada', meaningSv: 'sallad' },
      { kana: 'シャツ', romaji: 'shatsu', meaningSv: 'skjorta' },
      { kana: 'スーパー', romaji: 'suupaa', meaningSv: 'mataffär / stormarknad' },
      { kana: 'セーター', romaji: 'seetaa', meaningSv: 'tröja (sweater)' },
      { kana: 'ソース', romaji: 'soosu', meaningSv: 'sås' }
    ],
    requiredPriorChapterId: 'kata-ch-2',
    xpReward: 50
  },
  {
    id: 'kata-ch-4',
    chapterNumber: 4,
    stage: 1,
    title: 'Kapitel 4: Ta-raden (タ, チ, ツ, テ, ト)',
    subtitle: 'Undantagen CHI (チ) & TSU (ツ)',
    rowName: 'Ta-raden (タ, チ, ツ, テ, ト)',
    kanaIds: ['kata_ta', 'kata_chi', 'kata_tsu', 'kata_te', 'kata_to'],
    description: 'Här möter du den beryktade tvillingen ツ (tsu) och det användbara tecknet テ (te) från テレビ (TV).',
    pedagogicalNote: 'ツ (tsu) är en Tsunami som faller NED – svepet dras uppifrån och NEDÅT!',
    targetWords: [
      { kana: 'タクシー', romaji: 'takushii', meaningSv: 'taxi' },
      { kana: 'チーズ', romaji: 'chiizu', meaningSv: 'ost' },
      { kana: 'テレビ', romaji: 'terebi', meaningSv: 'TV' },
      { kana: 'テスト', romaji: 'tesuto', meaningSv: 'test / prov' },
      { kana: 'トマト', romaji: 'tomato', meaningSv: 'tomat' }
    ],
    requiredPriorChapterId: 'kata-ch-3',
    xpReward: 50
  },
  {
    id: 'kata-ch-5',
    chapterNumber: 5,
    stage: 1,
    title: 'Kapitel 5: Na-raden (ナ, ニ, ヌ, ネ, ノ)',
    subtitle: 'Mjuka nasaler och enkla former',
    rowName: 'Na-raden (ナ, ニ, ヌ, ネ, ノ)',
    kanaIds: ['kata_na', 'kata_ni', 'kata_nu', 'kata_ne', 'kata_no'],
    description: 'Sista steget innan Etapp 1 Delprov! Nu kan du redan läsa 25 Katakana-tecken.',
    pedagogicalNote: 'ニ är siffran 2 (ni). ノ är ett enda snedstreck (en näsa i profil).',
    targetWords: [
      { kana: 'ナイフ', romaji: 'naifu', meaningSv: 'kniv' },
      { kana: 'ニュース', romaji: 'nyuusu', meaningSv: 'nyheter' },
      { kana: 'ネクタイ', romaji: 'nekutai', meaningSv: 'slips' },
      { kana: 'ノート', romaji: 'nooto', meaningSv: 'anteckningsbok' },
      { kana: 'ネット', romaji: 'netto', meaningSv: 'internet / nät' }
    ],
    requiredPriorChapterId: 'kata-ch-4',
    xpReward: 50
  },
  {
    id: 'kata-ch-checkpoint-1',
    chapterNumber: 6,
    stage: 1,
    title: 'Milstolpe 1: Delprov Katakana (25 Tecken)',
    subtitle: 'Testa och befäst dina kunskaper från A till NO!',
    rowName: 'Delprov (Etapp 1)',
    kanaIds: [
      'kata_a', 'kata_i', 'kata_u', 'kata_e', 'kata_o',
      'kata_ka', 'kata_ki', 'kata_ku', 'kata_ke', 'kata_ko',
      'kata_sa', 'kata_shi', 'kata_su', 'kata_se', 'kata_so',
      'kata_ta', 'kata_chi', 'kata_tsu', 'kata_te', 'kata_to',
      'kata_na', 'kata_ni', 'kata_nu', 'kata_ne', 'kata_no'
    ],
    description: 'Diagnostiskt prov för alla 25 Katakana i Etapp 1. Få minst 80% rätt för att låsa upp Etapp 2.',
    pedagogicalNote: 'Fokusera särskilt på att inte förväxla シ (shi) och ツ (tsu).',
    targetWords: [
      { kana: 'テスト', romaji: 'tesuto', meaningSv: 'test' },
      { kana: 'アイス', romaji: 'aisu', meaningSv: 'glass' },
      { kana: 'タクシー', romaji: 'takushii', meaningSv: 'taxi' },
      { kana: 'ノート', romaji: 'nooto', meaningSv: 'anteckningsbok' }
    ],
    isCheckpoint: true,
    requiredPriorChapterId: 'kata-ch-5',
    xpReward: 100
  },

  // ==========================================
  // ETAPP 2: HA TILL N OCH DAKUTEN
  // ==========================================
  {
    id: 'kata-ch-7',
    chapterNumber: 7,
    stage: 2,
    title: 'Kapitel 6: Ha-raden (ハ, ヒ, フ, ヘ, ホ)',
    subtitle: 'Från Hamburgare till Hotell',
    rowName: 'Ha-raden (Ha, Hi, Fu, He, Ho)',
    kanaIds: ['kata_ha', 'kata_hi', 'kata_fu', 'kata_he', 'kata_ho'],
    description: 'Ha-raden är full av internationella låneord från hela världen.',
    pedagogicalNote: 'ヘ är identisk med Hiragana へ. フ är en fladdrande flagga.',
    targetWords: [
      { kana: 'ハンバーガー', romaji: 'hanbaagaa', meaningSv: 'hamburgare' },
      { kana: 'ホテル', romaji: 'hoteru', meaningSv: 'hotell' },
      { kana: 'フォーク', romaji: 'fooku', meaningSv: 'gaffel' },
      { kana: 'ホット', romaji: 'hotto', meaningSv: 'varm (dryck)' }
    ],
    requiredPriorChapterId: 'kata-ch-checkpoint-1',
    xpReward: 50
  },
  {
    id: 'kata-ch-8',
    chapterNumber: 8,
    stage: 2,
    title: 'Kapitel 7: Ma-raden (マ, ミ, ム, メ, モ)',
    subtitle: 'Manga, Mjölk och Modeller',
    rowName: 'Ma-raden (Ma, Mi, Mu, Me, Mo)',
    kanaIds: ['kata_ma', 'kata_mi', 'kata_mu', 'kata_me', 'kata_mo'],
    description: 'Mjuka M-ljud med enkla geometriska former.',
    pedagogicalNote: 'モ liknar Hiragana も. ミ är 3 kattmorrhår. メ är ett korsat plåster (medicin för ett öga).',
    targetWords: [
      { kana: 'マンガ', romaji: 'manga', meaningSv: 'manga' },
      { kana: 'ミルク', romaji: 'miruku', meaningSv: 'mjölk' },
      { kana: 'ゲーム', romaji: 'geemu', meaningSv: 'spel' },
      { kana: 'メニュー', romaji: 'menyuu', meaningSv: 'meny' },
      { kana: 'モデル', romaji: 'moderu', meaningSv: 'modell' }
    ],
    requiredPriorChapterId: 'kata-ch-7',
    xpReward: 50
  },
  {
    id: 'kata-ch-9',
    chapterNumber: 9,
    stage: 2,
    title: 'Kapitel 8: Ya-raden (ヤ, ユ, ヨ)',
    subtitle: 'Glidljud och förberedelse för kombinationer',
    rowName: 'Ya-raden (Ya, Yu, Yo)',
    kanaIds: ['kata_ya', 'kata_yu', 'kata_yo'],
    description: 'De tre glidljuden Ya, Yu, Yo som även används som små tecken för Yōon.',
    pedagogicalNote: 'ヤ liknar Hiragana や. ヨ är ett bakvänt E (hyllor för Yo-yos).',
    targetWords: [
      { kana: 'タイヤ', romaji: 'taiya', meaningSv: 'däck (tire)' },
      { kana: 'ユニフォーム', romaji: 'yunifoomu', meaningSv: 'uniform' },
      { kana: 'ヨーグルト', romaji: 'yooguruto', meaningSv: 'yoghurt' },
      { kana: 'ヨーロッパ', romaji: 'yooroppa', meaningSv: 'Europa' }
    ],
    requiredPriorChapterId: 'kata-ch-8',
    xpReward: 50
  },
  {
    id: 'kata-ch-10',
    chapterNumber: 10,
    stage: 2,
    title: 'Kapitel 9: Ra-raden (ラ, リ, ル, レ, ロ)',
    subtitle: 'Japanska R/L-ljud i mängder av låneord',
    rowName: 'Ra-raden (Ra, Ri, Ru, Re, Ro)',
    kanaIds: ['kata_ra', 'kata_ri', 'kata_ru', 'kata_re', 'kata_ro'],
    description: 'Eftersom japanskan inte skiljer på R och L skrivs alla västerländska R- och L-ord med denna rad (t.ex. radio, restaurang, robot).',
    pedagogicalNote: 'リ är identisk med Hiragana り. ロ är en ren kvadrat (Robotmun).',
    targetWords: [
      { kana: 'ラジオ', romaji: 'rajio', meaningSv: 'radio' },
      { kana: 'リーダー', romaji: 'riidaa', meaningSv: 'ledare' },
      { kana: 'ルール', romaji: 'ruuru', meaningSv: 'regel' },
      { kana: 'レストラン', romaji: 'resutoran', meaningSv: 'restaurang' },
      { kana: 'ロボット', romaji: 'robotto', meaningSv: 'robot' }
    ],
    requiredPriorChapterId: 'kata-ch-9',
    xpReward: 50
  },
  {
    id: 'kata-ch-11',
    chapterNumber: 11,
    stage: 2,
    title: 'Kapitel 10: Wa, Wo & N (ワ, ヲ, ン)',
    subtitle: 'Avsluta alla 46 grundtecken & bemästra N (ン)!',
    rowName: 'Wa, Wo, N',
    kanaIds: ['kata_wa', 'kata_wo', 'kata_n'],
    description: 'Sista steget för de 46 grundtecknen! Här lär du dig den sista beryktade tvillingen ン (n).',
    pedagogicalNote: 'ン (n) sveper flackt UPPÅT från botten till toppen! Jämför med ソ (so) som dras nedåt.',
    targetWords: [
      { kana: 'ワイン', romaji: 'wain', meaningSv: 'vin' },
      { kana: 'パン', romaji: 'pan', meaningSv: 'bröd' },
      { kana: 'スウェーデン', romaji: 'suweeden', meaningSv: 'Sverige' }
    ],
    requiredPriorChapterId: 'kata-ch-10',
    xpReward: 50
  },
  {
    id: 'kata-ch-12',
    chapterNumber: 12,
    stage: 2,
    title: 'Kapitel 11: Dakuon (Ga, Za, Da)',
    subtitle: 'Röstade konsonanter med Dakuten ゛',
    rowName: 'Dakuon Del 1 (Ga, Za, Da)',
    kanaIds: [
      'kata_ga', 'kata_gi', 'kata_gu', 'kata_ge', 'kata_go',
      'kata_za', 'kata_ji', 'kata_zu', 'kata_ze', 'kata_zo',
      'kata_da', 'kata_de', 'kata_do'
    ],
    description: 'Genom att lägga till två små röststreck (゛) ändras K till G, S till Z/J och T till D.',
    pedagogicalNote: 'ガム (tuggummi), ギター (gitarr), ジーンズ (jeans), ドア (dörr).',
    targetWords: [
      { kana: 'ガム', romaji: 'gamu', meaningSv: 'tuggummi' },
      { kana: 'ギター', romaji: 'gitaa', meaningSv: 'gitarr' },
      { kana: 'ジーンズ', romaji: 'jiinzu', meaningSv: 'jeans' },
      { kana: 'デザート', romaji: 'dezaato', meaningSv: 'dessert' },
      { kana: 'ドア', romaji: 'doa', meaningSv: 'dörr' }
    ],
    requiredPriorChapterId: 'kata-ch-11',
    xpReward: 60
  },
  {
    id: 'kata-ch-13',
    chapterNumber: 13,
    stage: 2,
    title: 'Kapitel 12: Dakuon & Handakuon (Ba & Pa)',
    subtitle: 'B- och P-ljud (゛och ゜)',
    rowName: 'Ba- och Pa-raden',
    kanaIds: [
      'kata_ba', 'kata_bi', 'kata_bu', 'kata_be', 'kata_bo',
      'kata_pa', 'kata_pi', 'kata_pu', 'kata_pe', 'kata_po'
    ],
    description: 'Ha-raden med två streck blir Ba, och med en liten cirkel (゜) blir den Pa.',
    pedagogicalNote: 'バナナ (banan), ビール (öl), パン (bröd), ピアノ (piano), ペン (penna).',
    targetWords: [
      { kana: 'バナナ', romaji: 'banana', meaningSv: 'banan' },
      { kana: 'ビール', romaji: 'biiru', meaningSv: 'öl' },
      { kana: 'パン', romaji: 'pan', meaningSv: 'bröd' },
      { kana: 'ピアノ', romaji: 'piano', meaningSv: 'piano' },
      { kana: 'ペン', romaji: 'pen', meaningSv: 'penna' }
    ],
    requiredPriorChapterId: 'kata-ch-12',
    xpReward: 60
  },
  {
    id: 'kata-ch-14',
    chapterNumber: 14,
    stage: 2,
    title: 'Kapitel 13: Yōon & Moderna Gairaigo (ティ, ファ, シェ)',
    subtitle: 'Västerländska specialkombinationer i modern japanska',
    rowName: 'Moderna Specialkombinationer',
    kanaIds: [
      'kata_sha', 'kata_sho', 'kata_cha', 'kata_cho', 'kata_ja', 'kata_ju',
      'kata_ti', 'kata_di', 'kata_fa', 'kata_fi', 'kata_fe', 'kata_fo',
      'kata_che', 'kata_she', 'kata_je', 'kata_wi', 'kata_we'
    ],
    description: 'Katakana har unika moderna kombinationer som inte finns i Hiragana för att kunna stava ord som Party (パーティー), Café (カフェ) och Chef (シェフ).',
    pedagogicalNote: 'Litet ィ, ァ, ェ ändrar grundljudet till Ti, Fa, Fe, etc.',
    targetWords: [
      { kana: 'パーティー', romaji: 'paatii', meaningSv: 'fest / party' },
      { kana: 'カフェ', romaji: 'kafe', meaningSv: 'café' },
      { kana: 'フォーク', romaji: 'fooku', meaningSv: 'gaffel' },
      { kana: 'シェフ', romaji: 'shefu', meaningSv: 'kock / chef' },
      { kana: 'ウィンドウ', romaji: 'windou', meaningSv: 'fönster (window)' }
    ],
    requiredPriorChapterId: 'kata-ch-13',
    xpReward: 75
  },
  {
    id: 'kata-ch-checkpoint-2',
    chapterNumber: 15,
    stage: 2,
    title: 'Milstolpe 2: Slutprov Katakana (Alla tecken)',
    subtitle: 'Officiell examen – Bemästra hela Katakana-systemet!',
    rowName: 'Slutprov (Hela Katakana)',
    kanaIds: [
      'kata_a', 'kata_ka', 'kata_sa', 'kata_shi', 'kata_su', 'kata_se', 'kata_so',
      'kata_ta', 'kata_chi', 'kata_tsu', 'kata_te', 'kata_to',
      'kata_ha', 'kata_ma', 'kata_ya', 'kata_ra', 'kata_wa', 'kata_n',
      'kata_ga', 'kata_za', 'kata_da', 'kata_ba', 'kata_pa',
      'kata_ti', 'kata_fa'
    ],
    description: 'Omfattande prov för hela Katakana. Få minst 80% rätt för att erhålla ditt Katakana-mästarbevis.',
    pedagogicalNote: 'Du är nu fullfjädrad Katakana-läsare och kan tyda japanska skyltar, menyer och låneord.',
    targetWords: [
      { kana: 'スウェーデン', romaji: 'suweeden', meaningSv: 'Sverige' },
      { kana: 'レストラン', romaji: 'resutoran', meaningSv: 'restaurang' },
      { kana: 'ハンバーガー', romaji: 'hanbaagaa', meaningSv: 'hamburgare' },
      { kana: 'パーティー', romaji: 'paatii', meaningSv: 'party' }
    ],
    isCheckpoint: true,
    requiredPriorChapterId: 'kata-ch-14',
    xpReward: 150
  }
];
