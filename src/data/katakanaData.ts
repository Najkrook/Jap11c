import type { KanaCharacter } from '../types/kana';

export const KATAKANA_DATA: KanaCharacter[] = [
  // ==========================================
  // VOKALER (A-RADEN) - GRUNDTECKEN
  // ==========================================
  {
    id: 'kata_a',
    kana: 'ア',
    romaji: 'a',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 25 30 L 70 30 L 50 60',
      'M 48 55 L 30 85'
    ],
    mnemonic: {
      summary: 'En vass Yxa (Axe) med handtag',
      summaryEn: 'An Axe with an angled handle',
      storySv: 'Tänk på en vass "Axe" (yxa). Det översta vinklade strecket är yxhuvudet och det nedre sneda strecket är handtaget. "A" för Axe/Yxa!',
      storyEn: 'Looks like an Axe chopping down. "A" for Axe!',
      imageVisualDesc: 'Ett vinklat blad upptill och ett handtag som sträcker sig nedåt till vänster.',
      keyCue: 'A som i Axe (Yxa)',
      keyCueEn: 'A for Axe'
    },
    pronunciationTipSv: 'Kort, öppet "a" precis som i svenskans "katt", inte utdraget. Munnen hålls avslappnad.',
    swedishSimilarSound: 'Kort A som i "hatt"',
    similarSoundPitfall: 'Förväxla inte med マ (ma)! ア har ett öppet hörn och ett separat handtag.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'アイス', romaji: 'aisu', meaningSv: 'glass (ice cream)', meaningEn: 'ice cream', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'アメリカ', romaji: 'amerika', meaningSv: 'USA / Amerika', meaningEn: 'America', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'アニメ', romaji: 'anime', meaningSv: 'japansk animation', meaningEn: 'anime', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_i',
    kana: 'イ',
    romaji: 'i',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 55 20 L 35 55',
      'M 45 45 L 45 85'
    ],
    mnemonic: {
      summary: 'Ett Igloo-hörn eller en person som står rak som ett I',
      summaryEn: 'An Easel or Igloo corner',
      storySv: 'En person med en ryggsäck som lutar sig framåt och står på ett rakt ben som ett "I". Även likt vänstra halvan av Hiragana い!',
      storyEn: 'Looks like an easel or an "I" beam with an angled support.',
      imageVisualDesc: 'Ett snett stödstreck till vänster och en rak vertikal stam.',
      keyCue: 'I som i Igloo / Stöd',
      keyCueEn: 'I for Easel'
    },
    pronunciationTipSv: 'Kort "i" som i svenskans "sitt". Mungiporna dras lätt utåt.',
    swedishSimilarSound: 'Kort I som i "sitt"',
    similarSoundPitfall: 'Lätt att blanda ihop med T-radens tecken eller kanji för människa (人), men har en rak lodrät stam.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'イギリス', romaji: 'igirisu', meaningSv: 'Storbritannien / England', meaningEn: 'UK / Britain', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'イタリア', romaji: 'itaria', meaningSv: 'Italien', meaningEn: 'Italy', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'インク', romaji: 'inku', meaningSv: 'bläck', meaningEn: 'ink', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_u',
    kana: 'ウ',
    romaji: 'u',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 50 18 L 50 32',
      'M 30 38 L 30 55',
      'M 30 40 L 70 40 L 60 85'
    ],
    mnemonic: {
      summary: 'Ett uppfällt Paraply (Umbrella) i taket',
      summaryEn: 'An Umbrella top with side ribs',
      storySv: 'Taket på ett hus eller toppen på ett "Umbrella" (paraply). Spetsen överst skyddar mot regn. "U" för Umbrella!',
      storyEn: 'The canopy of an Umbrella protecting you from rain. "U" for Umbrella!',
      imageVisualDesc: 'En topprick och ett tak med två sidoväggar/böjar.',
      keyCue: 'U som i Umbrella (Paraply)',
      keyCueEn: 'U for Umbrella'
    },
    pronunciationTipSv: 'Orundat, neutralt u/o-ljud. Läpparna hålls avslappnade utan att puta.',
    swedishSimilarSound: 'Neutralt orundat u/o',
    similarSoundPitfall: 'Förväxla inte med ワ (wa) eller フ (fu)! ウ har en topprick och två hörn.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'ウェイター', romaji: 'weitaa', meaningSv: 'servitör (waiter)', meaningEn: 'waiter', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ウイルス', romaji: 'uirusu', meaningSv: 'virus', meaningEn: 'virus', genkiChapter: 'L4', pitchAccent: '①' },
      { kana: 'ウール', romaji: 'uuru', meaningSv: 'ull (wool)', meaningEn: 'wool', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_e',
    kana: 'エ',
    romaji: 'e',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 30 25 L 70 25',
      'M 50 25 L 50 75',
      'M 22 75 L 78 75'
    ],
    mnemonic: {
      summary: 'En Hissbalk (Elevator) i en stålkonstruktion',
      summaryEn: 'An Elevator I-beam structure',
      storySv: 'En stålkonstruktion eller en "Elevator" (hiss) som åker mellan två våningsplan med en central hiss-pelare. "E" för Elevator!',
      storyEn: 'A steel I-beam for an Elevator shaft. "E" for Elevator!',
      imageVisualDesc: 'En balk med tak, botten och en bärande mittstolpe.',
      keyCue: 'E som i Elevator (Hiss)',
      keyCueEn: 'E for Elevator'
    },
    pronunciationTipSv: 'Kort "e" som i svenskans "sett" eller "penna".',
    swedishSimilarSound: 'Kort E som i "sett"',
    similarSoundPitfall: 'Förväxla inte med kanji för arbete (工) – formen är identisk men läses som ljudet E i Katakana!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'エアコン', romaji: 'eakon', meaningSv: 'luftkonditionering (air con)', meaningEn: 'air conditioning', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'エレベーター', romaji: 'erebeetaa', meaningSv: 'hiss (elevator)', meaningEn: 'elevator', genkiChapter: 'L2', pitchAccent: '③' },
      { kana: 'エネルギー', romaji: 'enerugii', meaningSv: 'energi (tyskans Energie)', meaningEn: 'energy', genkiChapter: 'L5', pitchAccent: '②' }
    ]
  },
  {
    id: 'kata_o',
    kana: 'オ',
    romaji: 'o',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 25 35 L 75 35',
      'M 48 20 L 48 85 L 40 75',
      'M 45 42 L 25 80'
    ],
    mnemonic: {
      summary: 'En Operasångare som sträcker ut armarna',
      summaryEn: 'An Opera singer belting on stage',
      storySv: 'En "Operasångare" på scen som sträcker ut armarna och tar i från tårna: "OOOOO!". Ser ut som en person med mikrofon och utsträckt arm.',
      storyEn: 'An Opera singer belting out an "OHHH!" note with arms outstretched.',
      imageVisualDesc: 'En personform med horisontell armbalk och ett ben som sparkar ut.',
      keyCue: 'O som i Opera',
      keyCueEn: 'O for Opera'
    },
    pronunciationTipSv: 'Kort, rent "o" som i svenskans "ost" eller "kort". Rundade läppar.',
    swedishSimilarSound: 'Kort O som i "bott"',
    similarSoundPitfall: 'Förväxla inte med ホ (ho) eller kanji 才. オ har en rak arm och ett snedstreck till vänster.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'オレンジ', romaji: 'orenji', meaningSv: 'apelsin / orange', meaningEn: 'orange', genkiChapter: 'L2', pitchAccent: '②' },
      { kana: 'オンライン', romaji: 'onrain', meaningSv: 'online', meaningEn: 'online', genkiChapter: 'L3', pitchAccent: '⓪' },
      { kana: 'オランダ', romaji: 'oranda', meaningSv: 'Nederländerna / Holland', meaningEn: 'Netherlands', genkiChapter: 'L1', pitchAccent: '⓪' }
    ]
  },

  // ==========================================
  // KA-RADEN (KA, KI, KU, KE, KO)
  // ==========================================
  {
    id: 'kata_ka',
    kana: 'カ',
    romaji: 'ka',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'Ka-raden (Ka, Ki, Ku, Ke, Ko)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 28 35 L 72 35 L 62 82 L 52 70',
      'M 48 20 L 32 80'
    ],
    mnemonic: {
      summary: 'Ett Kaffemått eller Hiragana か utan droppen',
      summaryEn: 'Hiragana か without the extra drop / A sharp K',
      storySv: 'Exakt samma form som Hiragana か, men skarpare och utan den lilla droppen till höger! Tänk på en vass Kaffekanna.',
      storyEn: 'Just like Hiragana か but simplified with sharp angular strokes.',
      imageVisualDesc: 'En vinklad arm och ett snedstreck som skär igenom.',
      keyCue: 'Ka som i Kaffekanna',
      keyCueEn: 'Ka for Coffee maker'
    },
    pronunciationTipSv: 'Krispigt och tydligt K-ljud följt av kort a.',
    swedishSimilarSound: 'Ka som i "kaka"',
    similarSoundPitfall: 'Förväxla inte med 力 (chikara/kraft) – カ är katakana Ka!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'カメラ', romaji: 'kamera', meaningSv: 'kamera', meaningEn: 'camera', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'カフェ', romaji: 'kafe', meaningSv: 'café', meaningEn: 'cafe', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'カード', romaji: 'kaado', meaningSv: 'kort / kreditkort', meaningEn: 'card', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_ki',
    kana: 'キ',
    romaji: 'ki',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'Ka-raden (Ka, Ki, Ku, Ke, Ko)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 30 32 L 70 32',
      'M 25 52 L 75 52',
      'M 55 18 L 40 85'
    ],
    mnemonic: {
      summary: 'En Nyckel (Key) med två tänder',
      summaryEn: 'A Key with two crossbars',
      storySv: 'Toppen av Hiragana き eller en modern säkerhetsnyckel (Key) med två tvärslåar. "Ki" för Key/Nyckel!',
      storyEn: 'Looks like a Key or the top half of Hiragana き.',
      imageVisualDesc: 'Två parallella horisontella streck korsade av en sned stam.',
      keyCue: 'Ki som i Key (Nyckel)',
      keyCueEn: 'Ki for Key'
    },
    pronunciationTipSv: 'Kort ki som i "kikare".',
    swedishSimilarSound: 'Ki som i "kikare"',
    similarSoundPitfall: 'Förväxla inte med テ (te) eller チ (chi) – キ har två tvärstreck!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'キッチン', romaji: 'kicchin', meaningSv: 'kök (kitchen)', meaningEn: 'kitchen', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'キー', romaji: 'kii', meaningSv: 'nyckel / tangent', meaningEn: 'key', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'キャンプ', romaji: 'kyanpu', meaningSv: 'camping / läger', meaningEn: 'camping', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_ku',
    kana: 'ク',
    romaji: 'ku',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'Ka-raden (Ka, Ki, Ku, Ke, Ko)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 48 20 L 32 50',
      'M 35 42 L 72 42 L 45 85'
    ],
    mnemonic: {
      summary: 'En Kockhatt (Cook) eller en fågelnäbb med tofs',
      summaryEn: 'A Cook hat / sharp corner',
      storySv: 'Tänk på en Kock (Cook) med en sned kockmössa. Vänstra strecket är mössans veck. "Ku" för Kock/Cook!',
      storyEn: 'A Cook wearing a chef hat at a slight angle.',
      imageVisualDesc: 'Ett toppsnedstreck och ett vinklat tak som sveper ner.',
      keyCue: 'Ku som i Kock / Cook',
      keyCueEn: 'Ku for Cook'
    },
    pronunciationTipSv: 'Kort ku med neutralt orundat u.',
    swedishSimilarSound: 'Ku som i "kulle"',
    similarSoundPitfall: '⚠️ OBS: Förväxla inte med ワ (wa) eller タ (ta)! ク har ett öppet vänsterstreck som skär genom hörnet.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'クラス', romaji: 'kurasu', meaningSv: 'klass / lektionsgrupp', meaningEn: 'class', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'クッキー', romaji: 'kukkii', meaningSv: 'kaka / cookie', meaningEn: 'cookie', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'タクシー', romaji: 'takushii', meaningSv: 'taxi', meaningEn: 'taxi', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_ke',
    kana: 'ケ',
    romaji: 'ke',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'Ka-raden (Ka, Ki, Ku, Ke, Ko)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 45 20 L 28 50',
      'M 28 42 L 75 42',
      'M 55 42 L 40 85'
    ],
    mnemonic: {
      summary: 'En Korg (Kettle/Keg) med handtag eller K med snedstreck',
      summaryEn: 'A K-shape with an angled roof',
      storySv: 'Ser ut som bokstaven K med en liten sned hatt överst. Tänk på en Kittel (Kettle) eller Keps. "Ke" för Keps!',
      storyEn: 'Looks like the letter K tilting under a hat.',
      imageVisualDesc: 'Ett övre snedstreck, ett horisontellt tvärstreck och ett centralt böjt ben.',
      keyCue: 'Ke som i Keps / Kittel',
      keyCueEn: 'Ke for Kettle'
    },
    pronunciationTipSv: 'Kort ke som i "keps".',
    swedishSimilarSound: 'Ke som i "keps"',
    similarSoundPitfall: 'Förväxla inte med ク (ku) eller チ (chi)! ケ har ett helt horisontellt tvärstreck och ett centralt böjt ben.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'ケーキ', romaji: 'keeki', meaningSv: 'tårta / kaka (cake)', meaningEn: 'cake', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'スウェーデン', romaji: 'suweeden', meaningSv: 'Sverige', meaningEn: 'Sweden', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'スケート', romaji: 'sukeeto', meaningSv: 'skridskoåkning / skate', meaningEn: 'skating', genkiChapter: 'L3', pitchAccent: '②' }
    ]
  },
  {
    id: 'kata_ko',
    kana: 'コ',
    romaji: 'ko',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'Ka-raden (Ka, Ki, Ku, Ke, Ko)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 30 30 L 70 30 L 70 70',
      'M 30 70 L 70 70'
    ],
    mnemonic: {
      summary: 'Ett öppet Hörne (Corner)',
      summaryEn: 'A square open Corner',
      storySv: 'Två räta vinklar som bildar ett öppet "Corner" (hörn) eller en låda. "Ko" för Corner/Kvadrat!',
      storyEn: 'Two clean 90-degree lines forming a Corner. "Ko" for Corner!',
      imageVisualDesc: 'En övre vinkel och en undre baslinje som skapar en öppen fyrkant åt vänster.',
      keyCue: 'Ko som i Corner (Hörn)',
      keyCueEn: 'Ko for Corner'
    },
    pronunciationTipSv: 'Kort ko med rundade läppar.',
    swedishSimilarSound: 'Ko som i "kopp"',
    similarSoundPitfall: 'Förväxla inte med ユ (yu) eller ゴ (go)! コ är helt öppen åt vänster.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'コーヒー', romaji: 'koohii', meaningSv: 'kaffe (coffee)', meaningEn: 'coffee', genkiChapter: 'L1', pitchAccent: '③' },
      { kana: 'コーラ', romaji: 'koora', meaningSv: 'cola', meaningEn: 'cola', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'コンビニ', romaji: 'konbini', meaningSv: 'närbutik (convenience store)', meaningEn: 'convenience store', genkiChapter: 'L2', pitchAccent: '⓪' }
    ]
  },

  // ==========================================
  // SA-RADEN (SA, SHI, SU, SE, SO)
  // ==========================================
  {
    id: 'kata_sa',
    kana: 'サ',
    romaji: 'sa',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'Sa-raden (Sa, Shi, Su, Se, So)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 25 38 L 75 38',
      'M 40 25 L 38 52',
      'M 60 25 L 56 82'
    ],
    mnemonic: {
      summary: 'Tre brädor på en Sadel (Saddle) eller tre Sardiner',
      summaryEn: 'A Saddle stirrup with two hanging straps',
      storySv: 'En horisontell bom med två nedhängande remmar från en "Sadel" (Saddle). Högra remmen är längre!',
      storyEn: 'A saddle crossbeam with two straps hanging down.',
      imageVisualDesc: 'En tvärslå och två vertikala ben, det högra längre och lätt böjt.',
      keyCue: 'Sa som i Sadel',
      keyCueEn: 'Sa for Saddle'
    },
    pronunciationTipSv: 'Klart s följt av kort a.',
    swedishSimilarSound: 'Sa som i "sax"',
    similarSoundPitfall: 'Förväxla inte med セ (se) eller サ (sa) – notera de två vertikala pinnarna!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'サラダ', romaji: 'sarada', meaningSv: 'sallad', meaningEn: 'salad', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'サンダル', romaji: 'sandaru', meaningSv: 'sandaler', meaningEn: 'sandals', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'サッカー', romaji: 'sakkaa', meaningSv: 'fotboll (soccer)', meaningEn: 'soccer', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_shi',
    kana: 'シ',
    romaji: 'shi',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'Sa-raden (Sa, Shi, Su, Se, So)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 32 30 L 42 36',
      'M 28 52 L 38 58',
      'M 25 80 Q 45 75 75 40'
    ],
    mnemonic: {
      summary: 'En person som ler och blinkar snett uppåt mot himlen (SHI)',
      summaryEn: 'A face looking and sweeping UPWARDS',
      storySv: '⚠️ KATAKANA TVILLING-REGEL: Tänk på "SHI tittar UPP mot solen (SHIning sun)". De två prickarna ligger nästan lodrätt och sista svepet dras NEDIFRÅN OCH UPP!',
      storyEn: 'SHI looks UP at the SHIning sun. Strokes are vertical and sweep UPWARDS.',
      imageVisualDesc: 'Två vertikala droppar och ett långt svep draget nedifrån och snett uppåt höger.',
      keyCue: 'Shi som i SHIning sun (sveper UPPÅT)',
      keyCueEn: 'Shi for SHIning (sweeps UP)'
    },
    pronunciationTipSv: 'Uttalas "shi" (som i skinka/tji), aldrig hårt "si".',
    swedishSimilarSound: 'Shi som i "tji"',
    similarSoundPitfall: '⚠️ BERYKTAD TVILLING: Blanda inte ihop med ツ (tsu)! I シ (shi) ligger prickarna i linje lodrätt och svepet går UPPÅT. I ツ (tsu) ligger prickarna vågrätt och svepet går NEDÅT.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'シャツ', romaji: 'shatsu', meaningSv: 'skjorta (shirt)', meaningEn: 'shirt', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'シャワー', romaji: 'shawaa', meaningSv: 'dusch (shower)', meaningEn: 'shower', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'タクシー', romaji: 'takushii', meaningSv: 'taxi', meaningEn: 'taxi', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_su',
    kana: 'ス',
    romaji: 'su',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'Sa-raden (Sa, Shi, Su, Se, So)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 30 32 L 68 32 L 40 85',
      'M 52 55 L 75 82'
    ],
    mnemonic: {
      summary: 'En person som åker Skidor (Ski / Super-man)',
      summaryEn: 'A downhill Skier with ski poles',
      storySv: 'En skidåkare i störtloppsställning. Översta böjen är ryggen och det högra benet skjuter fart. "Su" för Super-skidåkare!',
      storyEn: 'A skier speeding downhill with legs bent.',
      imageVisualDesc: 'En vinkelform med en böjd diagonal stam och ett stödjande högerben.',
      keyCue: 'Su som i Skidor / Super-man',
      keyCueEn: 'Su for Skier'
    },
    pronunciationTipSv: 'Kort su med orundat u.',
    swedishSimilarSound: 'Su som i "surt"',
    similarSoundPitfall: 'Förväxla inte med ヌ (nu)! ス har ingen ögla och det högra strecket sitter längre ner.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'スーパー', romaji: 'suupaa', meaningSv: 'mataffär / stormarknad (supermarket)', meaningEn: 'supermarket', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'スポーツ', romaji: 'supootsu', meaningSv: 'sport', meaningEn: 'sports', genkiChapter: 'L3', pitchAccent: '②' },
      { kana: 'スプーン', romaji: 'supuun', meaningSv: 'sked (spoon)', meaningEn: 'spoon', genkiChapter: 'L2', pitchAccent: '②' }
    ]
  },
  {
    id: 'kata_se',
    kana: 'セ',
    romaji: 'se',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'Sa-raden (Sa, Shi, Su, Se, So)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 28 35 L 72 35 L 72 58 L 52 58',
      'M 50 20 L 50 78 L 78 78'
    ],
    mnemonic: {
      summary: 'En fåtölj / Säte (Seat) eller Hiragana せ förenklad',
      summaryEn: 'A comfortable Seat / armchair',
      storySv: 'Ett bekvämt "Säte" (Seat) eller en modern soffa. Nästan identisk med Hiragana せ fast med kantigare hörn!',
      storyEn: 'Looks like a Seat or the simplified version of Hiragana せ.',
      imageVisualDesc: 'En L-formad ram och en sittdyna.',
      keyCue: 'Se som i Säte (Seat)',
      keyCueEn: 'Se for Seat'
    },
    pronunciationTipSv: 'Kort se som i "segel".',
    swedishSimilarSound: 'Se som i "semla"',
    similarSoundPitfall: 'Förväxla inte med サ (sa) eller ヒ (hi)!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'セーター', romaji: 'seetaa', meaningSv: 'tröja (sweater)', meaningEn: 'sweater', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'セット', romaji: 'setto', meaningSv: 'uppsättning / set / meny', meaningEn: 'set', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'センス', romaji: 'sensu', meaningSv: 'sinne / känsla (sense) / solfjäder', meaningEn: 'sense', genkiChapter: 'L4', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_so',
    kana: 'ソ',
    romaji: 'so',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'Sa-raden (Sa, Shi, Su, Se, So)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 38 25 L 48 42',
      'M 68 25 Q 55 60 30 85'
    ],
    mnemonic: {
      summary: 'En sytråd som nålen SOrterar NEDÅT (SO)',
      summaryEn: 'Strokes going DOWNWARD like sewing thread',
      storySv: '⚠️ KATAKANA TVILLING-REGEL: "SO SOrterar nålen NEDÅT". Pricken ligger till vänster och det långa svepet startar uppifrån höger och dras NEDÅT mot vänster!',
      storyEn: 'SO needle Sewed DOWNWARDS. Stroke starts at the top and sweeps DOWN.',
      imageVisualDesc: 'En övre prick och ett långt svep uppifrån och nedåt.',
      keyCue: 'So som i SOrtera NEDÅT',
      keyCueEn: 'So for Sewing down'
    },
    pronunciationTipSv: 'Kort rent so med rundade läppar.',
    swedishSimilarSound: 'So som i "socker"',
    similarSoundPitfall: '⚠️ BERYKTAD TVILLING: Blanda inte ihop med ン (n)! I ソ (so) dras långa strecket uppifrån och NEDÅT (brant). I ン (n) dras det nedifrån och UPPÅT (flackt).',
    japc11Week: 1,
    exampleWords: [
      { kana: 'ソフト', romaji: 'sofuto', meaningSv: 'mjuk / mjukvara (software)', meaningEn: 'soft / software', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ソース', romaji: 'soosu', meaningSv: 'sås (sauce)', meaningEn: 'sauce', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ソックス', romaji: 'sokkusu', meaningSv: 'strumpor (socks)', meaningEn: 'socks', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },

  // ==========================================
  // TA-RADEN (TA, CHI, TSU, TE, TO)
  // ==========================================
  {
    id: 'kata_ta',
    kana: 'タ',
    romaji: 'ta',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'Ta-raden (Ta, Chi, Tsu, Te, To)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 45 20 L 32 48',
      'M 34 38 L 72 38 L 45 85',
      'M 40 58 L 65 72'
    ],
    mnemonic: {
      summary: 'En Tacoskiva eller bokstaven T och A i ett',
      summaryEn: 'A Taco shell with filling',
      storySv: 'Ett krispigt Tacoskal (Taco) med fyllning i mitten, eller en drakvinge. "Ta" för Tacos!',
      storyEn: 'A crisp Taco shell with filling in the center.',
      imageVisualDesc: 'Ett tak med ett böjt ben och ett inre tvärstreck.',
      keyCue: 'Ta som i Taco',
      keyCueEn: 'Ta for Taco'
    },
    pronunciationTipSv: 'Kort ta som i "tack".',
    swedishSimilarSound: 'Ta som i "tack"',
    similarSoundPitfall: 'Förväxla inte med ク (ku) eller ケ (ke) – タ har ett extra streck inuti magen!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'タクシー', romaji: 'takushii', meaningSv: 'taxi', meaningEn: 'taxi', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'タオル', romaji: 'taoru', meaningSv: 'handduk (towel)', meaningEn: 'towel', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'タイプ', romaji: 'taipu', meaningSv: 'typ / skriva på tangentbord', meaningEn: 'type', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_chi',
    kana: 'チ',
    romaji: 'chi',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'Ta-raden (Ta, Chi, Tsu, Te, To)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 68 22 L 32 35',
      'M 25 52 L 75 52',
      'M 52 35 Q 50 68 38 85'
    ],
    mnemonic: {
      summary: 'En Cheerleader med pom-poms (CHI)',
      summaryEn: 'A Cheerleader doing a high kick',
      storySv: 'En "Cheerleader" (Chi) som gör en benspark med armarna rakt ut och håret i en snygg tofs överst!',
      storyEn: 'A Cheerleader kicking up a leg.',
      imageVisualDesc: 'Ett övre lutande streck, en horisontell bom och ett centralt böjt ben.',
      keyCue: 'Chi som i Cheerleader',
      keyCueEn: 'Chi for Cheerleader'
    },
    pronunciationTipSv: 'Uttalas "chi" (som i chips), aldrig "ti".',
    swedishSimilarSound: 'Chi som i "chips"',
    similarSoundPitfall: 'Förväxla inte med テ (te) eller セ (se) – チ har ett snedstreck allra högst upp!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'チーズ', romaji: 'chiizu', meaningSv: 'ost (cheese)', meaningEn: 'cheese', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'チケット', romaji: 'chiketto', meaningSv: 'biljett (ticket)', meaningEn: 'ticket', genkiChapter: 'L2', pitchAccent: '②' },
      { kana: 'チョコレート', romaji: 'chokoreeto', meaningSv: 'choklad', meaningEn: 'chocolate', genkiChapter: 'L2', pitchAccent: '③' }
    ]
  },
  {
    id: 'kata_tsu',
    kana: 'ツ',
    romaji: 'tsu',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'Ta-raden (Ta, Chi, Tsu, Te, To)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 35 25 L 42 40',
      'M 55 28 L 62 43',
      'M 78 30 Q 60 70 30 85'
    ],
    mnemonic: {
      summary: 'En Tsunami-våg som störtar NEDÅT (TSU)',
      summaryEn: 'A Tsunami wave crashing DOWNWARD',
      storySv: '⚠️ KATAKANA TVILLING-REGEL: "TSUnamin faller NED från himlen". De två översta dropparna ligger VÅGRÄTT bredvid varandra och det stora svepet dras UPPIFRÅN OCH NED!',
      storyEn: 'A TSUnami wave crashing DOWNWARDS. Dots are horizontal, big stroke sweeps DOWN.',
      imageVisualDesc: 'Två horisontella droppar och ett svep från övre högra hörnet nedåt mot vänster.',
      keyCue: 'Tsu som i TSUnami (störtar NEDÅT)',
      keyCueEn: 'Tsu for Tsunami crashing down'
    },
    pronunciationTipSv: 'Uttalas "tsu" som i slutet på ordet "katt-sol".',
    swedishSimilarSound: 'Tsu som i "katt-sand"',
    similarSoundPitfall: '⚠️ BERYKTAD TVILLING: Jämför med シ (shi)! I ツ (tsu) ligger dropparna horisontellt och svepet faller NEDÅT. I シ (shi) ligger de vertikalt och svepet dras UPPÅT.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'ツアー', romaji: 'tsuaa', meaningSv: 'tur / rundresa (tour)', meaningEn: 'tour', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'シャツ', romaji: 'shatsu', meaningSv: 'skjorta (shirt)', meaningEn: 'shirt', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'スポーツ', romaji: 'supootsu', meaningSv: 'sport', meaningEn: 'sports', genkiChapter: 'L3', pitchAccent: '②' }
    ]
  },
  {
    id: 'kata_te',
    kana: 'テ',
    romaji: 'te',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'Ta-raden (Ta, Chi, Tsu, Te, To)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 35 30 L 65 30',
      'M 25 52 L 75 52',
      'M 50 52 Q 48 75 32 85'
    ],
    mnemonic: {
      summary: 'En Telefonstolpe eller en TV-antenn',
      summaryEn: 'A Telephone pole with crossbars',
      storySv: 'En Telefonstolpe (Telephone) med två tvärslåar för ledningar. "Te" för Telefon / Television!',
      storyEn: 'A Telephone pole with cables running across.',
      imageVisualDesc: 'Två horisontella tvärbalkar och en böjd mittstolpe.',
      keyCue: 'Te som i Telefon / TV',
      keyCueEn: 'Te for Telephone'
    },
    pronunciationTipSv: 'Kort te som i "test".',
    swedishSimilarSound: 'Te som i "text"',
    similarSoundPitfall: 'Förväxla inte med チ (chi) eller キ (ki) – テ har en horisontell toppbom utan snedhatt!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'テレビ', romaji: 'terebi', meaningSv: 'TV (television)', meaningEn: 'television', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'テスト', romaji: 'tesuto', meaningSv: 'test / prov', meaningEn: 'test', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'テニス', romaji: 'tenisu', meaningSv: 'tennis', meaningEn: 'tennis', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_to',
    kana: 'ト',
    romaji: 'to',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'Ta-raden (Ta, Chi, Tsu, Te, To)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 45 20 L 45 85',
      'M 45 45 L 75 60'
    ],
    mnemonic: {
      summary: 'En Totte / Trädstam med en Gren',
      summaryEn: 'A Totem pole with one protruding branch',
      storySv: 'En rak stam med en utstickande gren som en "Totempåle" eller en Tå (Toe) som pekar ut. "To" för Totem!',
      storyEn: 'A Totem pole with a branch poking out to the right.',
      imageVisualDesc: 'En vertikal stam med en sned gren som pekar snett nedåt höger.',
      keyCue: 'To som i Totem / Tå',
      keyCueEn: 'To for Totem'
    },
    pronunciationTipSv: 'Kort to med rundade läppar.',
    swedishSimilarSound: 'To som i "tork"',
    similarSoundPitfall: 'Lätt att känna igen! Ser ut som ett kors med enbart höger arm.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'トマト', romaji: 'tomato', meaningSv: 'tomat', meaningEn: 'tomato', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'トイレ', romaji: 'toire', meaningSv: 'toalett', meaningEn: 'toilet', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ホテル', romaji: 'hoteru', meaningSv: 'hotell', meaningEn: 'hotel', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },

  // ==========================================
  // NA-RADEN (NA, NI, NU, NE, NO)
  // ==========================================
  {
    id: 'kata_na',
    kana: 'ナ',
    romaji: 'na',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'Na-raden (Na, Ni, Nu, Ne, No)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 25 40 L 75 40',
      'M 52 20 Q 50 60 30 85'
    ],
    mnemonic: {
      summary: 'Ett Svärd eller en Nål (Nail) som böjs',
      summaryEn: 'A sharp cross or Nail',
      storySv: 'En Nål eller spik (Nail) som sticks igenom en bräda och böjs. Tänk "Na" för Nål/Nail!',
      storyEn: 'A sharp Nail sticking through a piece of wood.',
      imageVisualDesc: 'Ett horisontellt streck och ett böjt svärdliknande svep nedåt vänster.',
      keyCue: 'Na som i Nål / Nail',
      keyCueEn: 'Na for Nail'
    },
    pronunciationTipSv: 'Mjukt nasal-n följt av a.',
    swedishSimilarSound: 'Na som i "natt"',
    similarSoundPitfall: 'Förväxla inte med メ (me) eller オ (o) – ナ har ett rent horisontellt takstreck.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'ナイフ', romaji: 'naifu', meaningSv: 'kniv (knife)', meaningEn: 'knife', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'バナナ', romaji: 'banana', meaningSv: 'banan', meaningEn: 'banana', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ナプキン', romaji: 'napukin', meaningSv: 'servett (napkin)', meaningEn: 'napkin', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_ni',
    kana: 'ニ',
    romaji: 'ni',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'Na-raden (Na, Ni, Nu, Ne, No)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 32 35 L 68 35',
      'M 25 65 L 75 65'
    ],
    mnemonic: {
      summary: 'Två (Ni) horisontella Nålar',
      summaryEn: 'Two lines (Japanese number two is NI 二)',
      storySv: 'Exakt samma tecken som den japanska siffran 2 (ni, 二)! Två parallella Nålar. "Ni" för siffran 2!',
      storyEn: 'Identical to the kanji for two (二 = ni). Two parallel bars.',
      imageVisualDesc: 'Två horisontella linjer, den undre något längre.',
      keyCue: 'Ni som i siffran 2 (Ni)',
      keyCueEn: 'Ni for Two'
    },
    pronunciationTipSv: 'Kort ni som i "nisse".',
    swedishSimilarSound: 'Ni som i "nisse"',
    similarSoundPitfall: 'Förväxla inte med kanji för ett (一) eller tre (三) – ニ är två streck!',
    japc11Week: 1,
    exampleWords: [
      { kana: 'ニュース', romaji: 'nyuusu', meaningSv: 'nyheter (news)', meaningEn: 'news', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'アニメ', romaji: 'anime', meaningSv: 'anime', meaningEn: 'anime', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'テニス', romaji: 'tenisu', meaningSv: 'tennis', meaningEn: 'tennis', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_nu',
    kana: 'ヌ',
    romaji: 'nu',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'Na-raden (Na, Ni, Nu, Ne, No)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 30 35 L 70 35 L 42 75',
      'M 42 45 L 72 82'
    ],
    mnemonic: {
      summary: 'Nudlar (Noodles) som fångas med ätpinnar',
      summaryEn: 'Chopsticks picking up Noodles',
      storySv: 'Två ätpinnar som korsar varandra och lyfter upp goda "Nudlar" (Noodles). "Nu" för Nudlar!',
      storyEn: 'Two chopsticks crossed together picking up tasty Noodles.',
      imageVisualDesc: 'En vinkelram med ett korsande högersnedstreck.',
      keyCue: 'Nu som i Nudlar',
      keyCueEn: 'Nu for Noodles'
    },
    pronunciationTipSv: 'Kort nu med orundat u.',
    swedishSimilarSound: 'Nu som i "nummer"',
    similarSoundPitfall: 'Förväxla inte med ス (su) eller フ (fu) – ヌ har ett kryssande stödben.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'カヌー', romaji: 'kanuu', meaningSv: 'kanot (canoe)', meaningEn: 'canoe', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'ヌードル', romaji: 'nuudoru', meaningSv: 'nudlar (noodles)', meaningEn: 'noodles', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'マヌカ', romaji: 'manuka', meaningSv: 'manuka (honung)', meaningEn: 'manuka', genkiChapter: 'L4', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_ne',
    kana: 'ネ',
    romaji: 'ne',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'Na-raden (Na, Ni, Nu, Ne, No)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: [
      'M 45 18 L 52 30',
      'M 30 38 L 55 38 L 35 85',
      'M 48 48 L 48 85',
      'M 55 60 L 75 80'
    ],
    mnemonic: {
      summary: 'Ett Nät (Net) eller ett halsband (Necklace)',
      summaryEn: 'A Necklace hanging on a bust',
      storySv: 'Ett elegant halsband (Necklace) eller ett fisknät (Net) som hängs upp på en krok. "Ne" för Net/Necklace!',
      storyEn: 'A shiny Necklace hanging on a mannequin bust.',
      imageVisualDesc: 'En topprick, en vinkel och ett centralt ben med en liten sidostötta.',
      keyCue: 'Ne som i Net / Necklace',
      keyCueEn: 'Ne for Necklace'
    },
    pronunciationTipSv: 'Kort ne som i "nelson".',
    swedishSimilarSound: 'Ne som i "nektar"',
    similarSoundPitfall: 'Förväxla inte med ホ (ho) – ネ har en övre prick och en vinklad vänsteraxel.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'ネクタイ', romaji: 'nekutai', meaningSv: 'slips (necktie)', meaningEn: 'necktie', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ネット', romaji: 'netto', meaningSv: 'nät / internet', meaningEn: 'internet / net', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ノート', romaji: 'nooto', meaningSv: 'anteckningsbok (notebook)', meaningEn: 'notebook', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_no',
    kana: 'ノ',
    romaji: 'no',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'Na-raden (Na, Ni, Nu, Ne, No)',
    strokeCount: 1,
    script: 'katakana',
    strokeSvgData: [
      'M 68 22 Q 55 55 30 85'
    ],
    mnemonic: {
      summary: 'En lång rak Näsa (Nose) i profil',
      summaryEn: 'A sharp sloped Nose',
      storySv: 'Ett enda elegant svepande streck som profilen på en lång "Näsa" (Nose). "No" för Nose/Näsa!',
      storyEn: 'A single simple slash like the bridge of a long Nose.',
      imageVisualDesc: 'Ett enda jämnt böjt snedstreck från övre höger till nedre vänster.',
      keyCue: 'No som i Näsa / Nose',
      keyCueEn: 'No for Nose'
    },
    pronunciationTipSv: 'Kort no med rundade läppar.',
    swedishSimilarSound: 'No som i "noll"',
    similarSoundPitfall: 'Enkelt att minnas! Endast ett enda svep.',
    japc11Week: 1,
    exampleWords: [
      { kana: 'ノート', romaji: 'nooto', meaningSv: 'anteckningsbok (notebook)', meaningEn: 'notebook', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ノルウェー', romaji: 'noruwee', meaningSv: 'Norge (Norway)', meaningEn: 'Norway', genkiChapter: 'L1', pitchAccent: '③' },
      { kana: 'ピアノ', romaji: 'piano', meaningSv: 'piano', meaningEn: 'piano', genkiChapter: 'L2', pitchAccent: '⓪' }
    ]
  },

  // ==========================================
  // HA-RADEN (HA, HI, FU, HE, HO)
  // ==========================================
  {
    id: 'kata_ha',
    kana: 'ハ',
    romaji: 'ha',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'Ha-raden (Ha, Hi, Fu, He, Ho)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 42 30 L 28 75',
      'M 58 30 L 72 75'
    ],
    mnemonic: {
      summary: 'Ett Halmtak eller två ben som skrattar "Ha-Ha!"',
      summaryEn: 'Two legs dancing and laughing Ha-Ha!',
      storySv: 'Två ben som dansar och skrattar "HA-HA!", eller sidorna på en Hatt/Halmtak. "Ha" för Ha-Ha!',
      storyEn: 'Two legs striding and laughing Ha-Ha!',
      imageVisualDesc: 'Två utåtpekande streck som bildar ett öppet tält eller två ben.',
      keyCue: 'Ha som i Ha-Ha / Hatt',
      keyCueEn: 'Ha for Ha-Ha laughing'
    },
    pronunciationTipSv: 'Mjukt h-ljud följt av kort a.',
    swedishSimilarSound: 'Ha som i "hatt"',
    similarSoundPitfall: 'Förväxla inte med 八 (siffran åtta) som har samma form!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ハンバーガー', romaji: 'hanbaagaa', meaningSv: 'hamburgare', meaningEn: 'hamburger', genkiChapter: 'L1', pitchAccent: '③' },
      { kana: 'パン', romaji: 'pan', meaningSv: 'bröd (med handakuten)', meaningEn: 'bread', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ハイキング', romaji: 'haikingu', meaningSv: 'vandring (hiking)', meaningEn: 'hiking', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_hi',
    kana: 'ヒ',
    romaji: 'hi',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'Ha-raden (Ha, Hi, Fu, He, Ho)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 30 35 L 60 35',
      'M 30 20 L 30 75 L 75 75'
    ],
    mnemonic: {
      summary: 'En Hiss eller en person som vinkar "Hi!" från en stol',
      summaryEn: 'A person on a stool waving Hi!',
      storySv: 'En person som sitter på en barstol och vinkar "HI!" med armen utsträckt. "Hi" för Hi / Hej!',
      storyEn: 'A person sitting on a tall chair shouting HI!',
      imageVisualDesc: 'Ett toppstreck och en L-formad rygg med fotstöd.',
      keyCue: 'Hi som i Hi! (Hej)',
      keyCueEn: 'Hi for waving Hi'
    },
    pronunciationTipSv: 'Kort hi som i "hitta".',
    swedishSimilarSound: 'Hi som i "hitta"',
    similarSoundPitfall: 'Förväxla inte med セ (se) – ヒ har en öppen högersida med ett rakt fotstreck.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'コーヒー', romaji: 'koohii', meaningSv: 'kaffe', meaningEn: 'coffee', genkiChapter: 'L1', pitchAccent: '③' },
      { kana: 'ヒーター', romaji: 'hiitaa', meaningSv: 'värmare / element (heater)', meaningEn: 'heater', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ヒット', romaji: 'hitto', meaningSv: 'hitlåt / träff (hit)', meaningEn: 'hit', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_fu',
    kana: 'フ',
    romaji: 'fu',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'Ha-raden (Ha, Hi, Fu, He, Ho)',
    strokeCount: 1,
    script: 'katakana',
    strokeSvgData: [
      'M 30 32 L 70 32 Q 55 60 35 82'
    ],
    mnemonic: {
      summary: 'En Flaggstång med en Fladdrande vimpel',
      summaryEn: 'A Flag flapping in the wind',
      storySv: 'En Flagga som Fladdrar i vinden (Fu). Ett enkelt horisontellt tak med ett böjt segel. "Fu" för Flagga!',
      storyEn: 'A Flag flapping in a light breeze.',
      imageVisualDesc: 'En topplinje som viker av nedåt i en svepande båge.',
      keyCue: 'Fu som i Flagga / Fladdra',
      keyCueEn: 'Fu for Flag flapping'
    },
    pronunciationTipSv: 'Mjukt blåsande ljud bildat genom att blåsa luft mellan läpparna (bilabial frikativa), inte engelskt F med tänderna mot läppen!',
    swedishSimilarSound: 'Mjukt utblås mellan läpparna',
    similarSoundPitfall: 'Förväxla inte med ラ (ra) eller ワ (wa) – フ har inget vertikalt stödstreck.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'フォーク', romaji: 'fooku', meaningSv: 'gaffel (fork)', meaningEn: 'fork', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'フランス', romaji: 'furansu', meaningSv: 'Frankrike', meaningEn: 'France', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'カフェ', romaji: 'kafe', meaningSv: 'café', meaningEn: 'cafe', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_he',
    kana: 'ヘ',
    romaji: 'he',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'Ha-raden (Ha, Hi, Fu, He, Ho)',
    strokeCount: 1,
    script: 'katakana',
    strokeSvgData: [
      'M 25 60 L 45 35 L 78 70'
    ],
    mnemonic: {
      summary: 'En Hjälm (Helmet) på ett berg',
      summaryEn: 'A Mountaintop or Helmet (identical to Hiragana へ)',
      storySv: 'Exakt samma form som Hiragana へ! En bergstopp eller en Hjälm (Helmet). "He" för Helmet/Hjälm!',
      storyEn: 'Identical to Hiragana へ! Looks like a mountaintop or a roof.',
      imageVisualDesc: 'En uppåtgående kort ramp och en längre nedåtgående backe.',
      keyCue: 'He som i Hjälm / Helmet',
      keyCueEn: 'He for Helmet'
    },
    pronunciationTipSv: 'Kort he som i "helg".',
    swedishSimilarSound: 'He som i "helg"',
    similarSoundPitfall: 'Identisk med Hiragana へ! Superenkel att komma ihåg.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ヘルメット', romaji: 'herumetto', meaningSv: 'hjälm (helmet)', meaningEn: 'helmet', genkiChapter: 'L2', pitchAccent: '③' },
      { kana: 'ホテル', romaji: 'hoteru', meaningSv: 'hotell', meaningEn: 'hotel', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ページ', romaji: 'peeji', meaningSv: 'sida (page)', meaningEn: 'page', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_ho',
    kana: 'ホ',
    romaji: 'ho',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'Ha-raden (Ha, Hi, Fu, He, Ho)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: [
      'M 25 32 L 75 32',
      'M 50 18 L 50 85',
      'M 38 48 L 28 72',
      'M 62 48 L 72 72'
    ],
    mnemonic: {
      summary: 'Ett Hus (Home) med trädpelare och två stödribbor',
      summaryEn: 'A holy tree or Home cross structure',
      storySv: 'En korsad påle med två stödben som håller upp ett Hem (Home) eller en Helgonstaty. "Ho" för Home/Hus!',
      storyEn: 'A wooden frame with support struts holding up a Home.',
      imageVisualDesc: 'Ett korsat T med två nedåtriktade stöddroppar på sidorna.',
      keyCue: 'Ho som i Home (Hus)',
      keyCueEn: 'Ho for Home'
    },
    pronunciationTipSv: 'Kort ho med rundade läppar.',
    swedishSimilarSound: 'Ho som i "hopp"',
    similarSoundPitfall: 'Förväxla inte med オ (o) eller 木 (trä-kanji) – ホ har en ren tvärbalk överst och droppar under.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ホテル', romaji: 'hoteru', meaningSv: 'hotell', meaningEn: 'hotel', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ホット', romaji: 'hotto', meaningSv: 'varm (hot / kaffe)', meaningEn: 'hot', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ホワイト', romaji: 'howaito', meaningSv: 'vit (white)', meaningEn: 'white', genkiChapter: 'L2', pitchAccent: '②' }
    ]
  },

  // ==========================================
  // MA-RADEN (MA, MI, MU, ME, MO)
  // ==========================================
  {
    id: 'kata_ma',
    kana: 'マ',
    romaji: 'ma',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'Ma-raden (Ma, Mi, Mu, Me, Mo)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 30 35 L 70 35 L 42 70',
      'M 55 62 L 75 80'
    ],
    mnemonic: {
      summary: 'En Mask (Mask) med spetsig nos',
      summaryEn: 'A superhero Mask angle',
      storySv: 'En spetsig "Mask" för ögonen som en superhjälte bär, med ett litet band till höger. "Ma" för Mask!',
      storyEn: 'A pointed superhero Mask over the eyes with a side strap.',
      imageVisualDesc: 'En vinkel med en spetsig botten och en liten högerdroppe.',
      keyCue: 'Ma som i Mask',
      keyCueEn: 'Ma for Mask'
    },
    pronunciationTipSv: 'Kort ma som i "matta".',
    swedishSimilarSound: 'Ma som i "matta"',
    similarSoundPitfall: 'Förväxla inte med ア (a) eller ム (mu)! マ är stängd i vinkeln.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'マンガ', romaji: 'manga', meaningSv: 'manga / japanska serier', meaningEn: 'manga', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'マッチ', romaji: 'macchi', meaningSv: 'tändsticka / match', meaningEn: 'match', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'マイク', romaji: 'maiku', meaningSv: 'mikrofon (mike)', meaningEn: 'microphone', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_mi',
    kana: 'ミ',
    romaji: 'mi',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'Ma-raden (Ma, Mi, Mu, Me, Mo)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 30 30 L 65 38',
      'M 28 50 L 68 58',
      'M 25 70 L 75 78'
    ],
    mnemonic: {
      summary: 'Tre (Mitsu) morrhår på en katt som jamar "Miau!"',
      summaryEn: 'Three whiskers on a cat meowing Mi-au!',
      storySv: 'Tre parallella morrhår på en katt som jamar "Mi-au!". "Mi" för Miau / tre Morrhår!',
      storyEn: 'Three slanted cat whiskers purring "Meee!".',
      imageVisualDesc: 'Tre parallella snedstreck från vänster till höger, det nedersta längst.',
      keyCue: 'Mi som i Morrhår / Miau',
      keyCueEn: 'Mi for cat whiskers'
    },
    pronunciationTipSv: 'Kort mi som i "minne".',
    swedishSimilarSound: 'Mi som i "min"',
    similarSoundPitfall: 'Förväxla inte med kanji för tre (三) – ミ har lutande svepande streck!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ミルク', romaji: 'miruku', meaningSv: 'mjölk (milk)', meaningEn: 'milk', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ミス', romaji: 'misu', meaningSv: 'misstag (mistake)', meaningEn: 'mistake', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'ミニ', romaji: 'mini', meaningSv: 'mini / liten', meaningEn: 'mini', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_mu',
    kana: 'ム',
    romaji: 'mu',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'Ma-raden (Ma, Mi, Mu, Me, Mo)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 48 25 L 30 65 L 75 65',
      'M 58 45 L 68 60'
    ],
    mnemonic: {
      summary: 'En stor Muskel (Muscle) eller en ko som råmar "Muu!"',
      summaryEn: 'A flexed arm showing a triangular Muscle',
      storySv: 'En spänd överarm med en triangelformad Muskel (Muscle). "Mu" för Muskel / Muu!',
      storyEn: 'A triangular flexing arm showing off a Muscle.',
      imageVisualDesc: 'En triangelform med ett stöddrag inuti.',
      keyCue: 'Mu som i Muskel / Muu',
      keyCueEn: 'Mu for Muscle'
    },
    pronunciationTipSv: 'Kort mu med neutralt u.',
    swedishSimilarSound: 'Mu som i "mun"',
    similarSoundPitfall: 'Förväxla inte med マ (ma) eller ス (su) – ム är en liggande triangel.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ゲーム', romaji: 'geemu', meaningSv: 'spel (game)', meaningEn: 'game', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'チーム', romaji: 'chiimu', meaningSv: 'lag / team', meaningEn: 'team', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'ガム', romaji: 'gamu', meaningSv: 'tuggummi (chewing gum)', meaningEn: 'gum', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_me',
    kana: 'メ',
    romaji: 'me',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'Ma-raden (Ma, Mi, Mu, Me, Mo)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 68 25 Q 50 60 30 85',
      'M 35 40 L 72 75'
    ],
    mnemonic: {
      summary: 'Ett plåster som Medicinerar (Medicine) ett öga (Me)',
      summaryEn: 'An X-shaped bandaid / Medicine patch',
      storySv: 'Ett korsat plåster för att Medicinera (Medicine). På japanska betyder "Me" (目) dessutom öga! "Me" för Medicin!',
      storyEn: 'An X-shaped bandage providing Medicine to a scratch.',
      imageVisualDesc: 'Ett långt böjt snedstreck korsat av ett kortare snedstreck som bildar ett X.',
      keyCue: 'Me som i Medicin / Plåster',
      keyCueEn: 'Me for Medicine'
    },
    pronunciationTipSv: 'Kort me som i "metall".',
    swedishSimilarSound: 'Me som i "metall"',
    similarSoundPitfall: 'Förväxla inte med ナ (na) eller ヌ (nu) – メ har ingen horisontell toppstång!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'メニュー', romaji: 'menyuu', meaningSv: 'meny (menu)', meaningEn: 'menu', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'メール', romaji: 'meeru', meaningSv: 'e-post (email / mail)', meaningEn: 'email', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'メロン', romaji: 'meron', meaningSv: 'melon', meaningEn: 'melon', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_mo',
    kana: 'モ',
    romaji: 'mo',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'Ma-raden (Ma, Mi, Mu, Me, Mo)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 28 35 L 68 35',
      'M 22 55 L 75 55',
      'M 48 20 L 48 75 L 75 75'
    ],
    mnemonic: {
      summary: 'En Monitor med två antenner eller Hiragana も med raka hörn',
      summaryEn: 'A Monitor with shelf / Hiragana も simplified',
      storySv: 'Nästan exakt som Hiragana も, men med skarpa och raka linjer som en modern "Monitor" (skärm). "Mo" för Monitor!',
      storyEn: 'Looks just like Hiragana も with sharp right angles.',
      imageVisualDesc: 'Två horisontella tvärribbor och en mittstam med ett böjt fotsteg till höger.',
      keyCue: 'Mo som i Monitor',
      keyCueEn: 'Mo for Monitor'
    },
    pronunciationTipSv: 'Kort mo med rundade läppar.',
    swedishSimilarSound: 'Mo som i "morgon"',
    similarSoundPitfall: 'Superlik Hiragana も! Lätt att känna igen.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'モデル', romaji: 'moderu', meaningSv: 'modell (model)', meaningEn: 'model', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'モーター', romaji: 'mootaa', meaningSv: 'motor', meaningEn: 'motor', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'モダン', romaji: 'modan', meaningSv: 'modern', meaningEn: 'modern', genkiChapter: 'L4', pitchAccent: '①' }
    ]
  },

  // ==========================================
  // YA-RADEN (YA, YU, YO)
  // ==========================================
  {
    id: 'kata_ya',
    kana: 'ヤ',
    romaji: 'ya',
    group: 'gojuon',
    row: 'y',
    rowNameSv: 'Ya-raden (Ya, Yu, Yo)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 28 38 L 70 38 L 48 65',
      'M 58 20 L 42 85'
    ],
    mnemonic: {
      summary: 'En Yacht i solnedgången eller Hiragana や utan stöddroppen',
      summaryEn: 'A Yacht sailing / Hiragana や with crisp edges',
      storySv: 'Fören och masten på en lyxig "Yacht". Mycket lik Hiragana や men utan den lilla droppen ovanför. "Ya" för Yacht!',
      storyEn: 'The sleek bow and mast of a speeding Yacht.',
      imageVisualDesc: 'En vinklad takbalk och en skärande diagonal mast.',
      keyCue: 'Ya som i Yacht',
      keyCueEn: 'Ya for Yacht'
    },
    pronunciationTipSv: 'Kort glidljud j+a som i "jag".',
    swedishSimilarSound: 'Ya som i "jaga"',
    similarSoundPitfall: 'Förväxla inte med セ (se) – ヤ lutar åt vänster med en sned mast.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'タイヤ', romaji: 'taiya', meaningSv: 'däck (tire)', meaningEn: 'tire', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'ダイヤ', romaji: 'daiya', meaningSv: 'diamant / tidtabell (diagram)', meaningEn: 'diamond / schedule', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'シャツ', romaji: 'shatsu', meaningSv: 'skjorta', meaningEn: 'shirt', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_yu',
    kana: 'ユ',
    romaji: 'yu',
    group: 'gojuon',
    row: 'y',
    rowNameSv: 'Ya-raden (Ya, Yu, Yo)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 30 30 L 70 30 L 70 70 L 30 70',
      'M 50 50 L 50 85'
    ],
    mnemonic: {
      summary: 'En krok eller bock för "YOU are number one!"',
      summaryEn: 'A big stylized U-turn / hook',
      storySv: 'En vinkel med en fot under som pekar på "YOU" – "You are number one!". "Yu" för You!',
      storyEn: 'A pointing finger saying YOU are next!',
      imageVisualDesc: 'En C-liknande öppen fyrkant med ett ben som fortsätter nedåt.',
      keyCue: 'Yu som i You',
      keyCueEn: 'Yu for You'
    },
    pronunciationTipSv: 'Kort j+u med orundat u.',
    swedishSimilarSound: 'Yu som i "julafton"',
    similarSoundPitfall: 'Förväxla inte med コ (ko) – ユ har ett vertikalt ben som sticker ut undertill!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ユニフォーム', romaji: 'yunifoomu', meaningSv: 'uniform / matchtröja', meaningEn: 'uniform', genkiChapter: 'L2', pitchAccent: '③' },
      { kana: 'ユーモア', romaji: 'yuumoa', meaningSv: 'humor', meaningEn: 'humor', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'ユーザー', romaji: 'yuuzaa', meaningSv: 'användare (user)', meaningEn: 'user', genkiChapter: 'L4', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_yo',
    kana: 'ヨ',
    romaji: 'yo',
    group: 'gojuon',
    row: 'y',
    rowNameSv: 'Ya-raden (Ya, Yu, Yo)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 30 28 L 70 28 L 70 72 L 30 72',
      'M 30 50 L 68 50',
      'M 30 72 L 70 72'
    ],
    mnemonic: {
      summary: 'En leksaks-Jojo (Yo-yo) med hyllor eller bokstaven E baklänges',
      summaryEn: 'A backwards letter E / Yo-yo rack',
      storySv: 'Bokstaven E baklänges, eller hyllor för att stapla Yo-yo (Jojor). "Yo" för Yo-yo!',
      storyEn: 'A backwards E holding slots for Yo-yos.',
      imageVisualDesc: 'En vertikal rygg till höger med tre horisontella pinnar som pekar åt vänster.',
      keyCue: 'Yo som i Yo-yo (Jojo)',
      keyCueEn: 'Yo for Yo-yo'
    },
    pronunciationTipSv: 'Kort j+o som i "joddla".',
    swedishSimilarSound: 'Yo som i "jogg"',
    similarSoundPitfall: 'Förväxla inte med kanji för tre (三) – ヨ har en stängd rygg på höger sida!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ヨーグルト', romaji: 'yooguruto', meaningSv: 'yoghurt', meaningEn: 'yogurt', genkiChapter: 'L2', pitchAccent: '③' },
      { kana: 'ヨーロッパ', romaji: 'yooroppa', meaningSv: 'Europa', meaningEn: 'Europe', genkiChapter: 'L1', pitchAccent: '③' },
      { kana: 'ヨガ', romaji: 'yoga', meaningSv: 'yoga', meaningEn: 'yoga', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },

  // ==========================================
  // RA-RADEN (RA, RI, RU, RE, RO)
  // ==========================================
  {
    id: 'kata_ra',
    kana: 'ラ',
    romaji: 'ra',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'Ra-raden (Ra, Ri, Ru, Re, Ro)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 30 28 L 68 28',
      'M 30 45 L 68 45 Q 55 75 35 85'
    ],
    mnemonic: {
      summary: 'En Racket eller en fällstol som fälls ut',
      summaryEn: 'A folding chair or tennis Racket top',
      storySv: 'En bekväm solstol eller en fällbar Racket-hållare. "Ra" för Racket / Radio!',
      storyEn: 'A folding lounge chair ready for relaxation.',
      imageVisualDesc: 'Ett toppstreck och en vinklad stolskontur under.',
      keyCue: 'Ra som i Radio / Racket',
      keyCueEn: 'Ra for Radio'
    },
    pronunciationTipSv: 'Japanskt R är ett snabbt slag med tungspetsen mot tandvallen, mitt emellan svenskt R och L.',
    swedishSimilarSound: 'Mjukt R/L-tapp mot gommen',
    similarSoundPitfall: 'Förväxla inte med フ (fu) eller ウ (u) – ラ har två horisontella streck överst.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ラジオ', romaji: 'rajio', meaningSv: 'radio', meaningEn: 'radio', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ラーメン', romaji: 'raamen', meaningSv: 'ramennudlar', meaningEn: 'ramen', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'カメラ', romaji: 'kamera', meaningSv: 'kamera', meaningEn: 'camera', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_ri',
    kana: 'リ',
    romaji: 'ri',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'Ra-raden (Ra, Ri, Ru, Re, Ro)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 35 30 L 35 60',
      'M 65 20 Q 65 65 48 85'
    ],
    mnemonic: {
      summary: 'Två Rismarkspinnar eller Hiragana り med raka streck',
      summaryEn: 'Two reeds in a River / Hiragana り',
      storySv: 'Nästan exakt identisk med Hiragana り! Två strån som vajar i en Flod (River). "Ri" för River / Risstrå!',
      storyEn: 'Identical to Hiragana り with crisp straight lines.',
      imageVisualDesc: 'Ett kort vänsterstreck och ett långt svepande högerstreck.',
      keyCue: 'Ri som i River / Risstrå',
      keyCueEn: 'Ri for River'
    },
    pronunciationTipSv: 'Kort ri med tungslag.',
    swedishSimilarSound: 'Ri med tungspetsslag',
    similarSoundPitfall: 'Identisk med Hiragana り! Mycket enkel.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'リーダー', romaji: 'riidaa', meaningSv: 'ledare (leader)', meaningEn: 'leader', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'リンゴ', romaji: 'ringo', meaningSv: 'äpple', meaningEn: 'apple', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'イタリア', romaji: 'itaria', meaningSv: 'Italien', meaningEn: 'Italy', genkiChapter: 'L2', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'kata_ru',
    kana: 'ル',
    romaji: 'ru',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'Ra-raden (Ra, Ri, Ru, Re, Ro)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 42 25 L 30 75',
      'M 58 25 L 58 70 Q 58 82 72 82'
    ],
    mnemonic: {
      summary: 'Två Rötter (Roots) som växer ner i jorden',
      summaryEn: 'Two Roots growing down with a hook',
      storySv: 'Två "Rötter" (Roots) från ett träd. Den högra roten svänger uppåt med en krok för att suga vatten. "Ru" för Roots/Rötter!',
      storyEn: 'Two tree Roots digging into the ground, right one curving up.',
      imageVisualDesc: 'Ett snett vänsterben och ett högerben som böjer uppåt i en hake.',
      keyCue: 'Ru som i Roots (Rötter)',
      keyCueEn: 'Ru for Roots'
    },
    pronunciationTipSv: 'Kort ru med orundat u.',
    swedishSimilarSound: 'Ru med tungspets-R',
    similarSoundPitfall: 'Förväxla inte med レ (re) eller ハ (ha) – ル har två separata ben och högerbenet har en krok!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ルール', romaji: 'ruuru', meaningSv: 'regel (rule)', meaningEn: 'rule', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ホテル', romaji: 'hoteru', meaningSv: 'hotell', meaningEn: 'hotel', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'プール', romaji: 'puuru', meaningSv: 'pool / simbassäng', meaningEn: 'pool', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_re',
    kana: 'レ',
    romaji: 're',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'Ra-raden (Ra, Ri, Ru, Re, Ro)',
    strokeCount: 1,
    script: 'katakana',
    strokeSvgData: [
      'M 45 20 L 45 75 Q 45 85 70 85'
    ],
    mnemonic: {
      summary: 'En vinkelhake eller ett Rektangelhörn',
      summaryEn: 'A clean right-angle corner or checkmark',
      storySv: 'Ett enda streck som svänger i en rät vinkel som ett Rektangelhörn eller en bock. "Re" för Rektangel!',
      storyEn: 'A single crisp stroke forming a checkmark or corner.',
      imageVisualDesc: 'Ett vertikalt streck som svänger mjukt 90 grader åt höger.',
      keyCue: 'Re som i Rektangel / Redo',
      keyCueEn: 'Re for Rectangle'
    },
    pronunciationTipSv: 'Kort re som i "resa".',
    swedishSimilarSound: 'Re som i "ren"',
    similarSoundPitfall: 'Förväxla inte med ル (ru) – レ är bara ETT enda sammanhängande streck!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'レストラン', romaji: 'resutoran', meaningSv: 'restaurang', meaningEn: 'restaurant', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'レモン', romaji: 'remon', meaningSv: 'citron (lemon)', meaningEn: 'lemon', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'テレビ', romaji: 'terebi', meaningSv: 'TV', meaningEn: 'television', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_ro',
    kana: 'ロ',
    romaji: 'ro',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'Ra-raden (Ra, Ri, Ru, Re, Ro)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: [
      'M 30 25 L 30 75',
      'M 30 25 L 70 25 L 70 75',
      'M 30 75 L 70 75'
    ],
    mnemonic: {
      summary: 'En Fyrkantig Robotmun (Robot)',
      summaryEn: 'A square Robot mouth',
      storySv: 'En perfekt fyrkant som munnen på en Robot! "Ro" för Robot!',
      storyEn: 'A square box like a Robot mouth.',
      imageVisualDesc: 'En helt stängd kvadrat/box.',
      keyCue: 'Ro som i Robot',
      keyCueEn: 'Ro for Robot'
    },
    pronunciationTipSv: 'Kort ro med rundade läppar.',
    swedishSimilarSound: 'Ro som i "ropa"',
    similarSoundPitfall: 'Förväxla inte med 口 (kuchi/mun-kanji) – identisk form men fungerar som Katakana Ro!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ロボット', romaji: 'robotto', meaningSv: 'robot', meaningEn: 'robot', genkiChapter: 'L2', pitchAccent: '②' },
      { kana: 'ロシア', romaji: 'roshia', meaningSv: 'Ryssland (Russia)', meaningEn: 'Russia', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ヨーロッパ', romaji: 'yooroppa', meaningSv: 'Europa', meaningEn: 'Europe', genkiChapter: 'L1', pitchAccent: '③' }
    ]
  },

  // ==========================================
  // WA, WO, N (SPECIALARE)
  // ==========================================
  {
    id: 'kata_wa',
    kana: 'ワ',
    romaji: 'wa',
    group: 'gojuon',
    row: 'w',
    rowNameSv: 'Wa-raden (Wa, Wo, N)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 35 32 L 35 55',
      'M 35 35 L 70 35 Q 60 70 40 85'
    ],
    mnemonic: {
      summary: 'Ett Vinglas (Wine glass) eller ett Vattenfall (Waterfall)',
      summaryEn: 'A Wine glass top or Waterfall',
      storySv: 'Överdelen på ett Vinglas (Wine) eller toppen på ett Vattenfall (Waterfall). "Wa" för Wine/Vatten!',
      storyEn: 'The rim of a Wine goblet ready for a toast.',
      imageVisualDesc: 'Ett litet vänsterstreck och ett tak som böjer mjukt nedåt.',
      keyCue: 'Wa som i Wine (Vin) / Waterfall',
      keyCueEn: 'Wa for Wine'
    },
    pronunciationTipSv: 'Kort mjukt wa som i engelskans "water".',
    swedishSimilarSound: 'Wa som i "weekend"',
    similarSoundPitfall: 'Förväxla inte med ク (ku) eller ウ (u) – ワ har ett rakt vänsterben och ingen topprick!',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ワイン', romaji: 'wain', meaningSv: 'vin (wine)', meaningEn: 'wine', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ワイシャツ', romaji: 'waishatsu', meaningSv: 'skjorta / dress shirt', meaningEn: 'dress shirt', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'シャワー', romaji: 'shawaa', meaningSv: 'dusch', meaningEn: 'shower', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'kata_wo',
    kana: 'ヲ',
    romaji: 'wo',
    group: 'gojuon',
    row: 'w',
    rowNameSv: 'Wa-raden (Wa, Wo, N)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 30 32 L 70 32',
      'M 32 50 L 62 50 Q 52 75 35 85'
    ],
    mnemonic: {
      summary: 'En Hund som skäller "WO-OF!" med två ben',
      summaryEn: 'A dog barking "Woof!"',
      storySv: 'En hund som hoppar upp på bakbenen och skäller "WOOF!". Används ytterst sällan i modern Katakana men viktig att känna igen! "Wo" för Woof!',
      storyEn: 'A jumping dog barking "WOOF!".',
      imageVisualDesc: 'Två horisontella balkar med ett svepande ben.',
      keyCue: 'Wo som i Woof!',
      keyCueEn: 'Wo for Woof'
    },
    pronunciationTipSv: 'Uttalas i praktiken som "o" precis som Hiragana を.',
    swedishSimilarSound: 'Kort O',
    similarSoundPitfall: 'Förväxla inte med フ (fu) – ヲ har en extra horisontell bom överst.',
    japc11Week: 2,
    exampleWords: [
      { kana: 'ヲタク', romaji: 'wotaku', meaningSv: 'otaku / nörd (alternativ stavning)', meaningEn: 'geek / otaku', genkiChapter: 'L4', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'kata_n',
    kana: 'ン',
    romaji: 'n',
    group: 'gojuon',
    row: 'special_n',
    rowNameSv: 'Specialkonsonant (N)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: [
      'M 32 38 L 45 48',
      'M 25 75 Q 45 70 75 35'
    ],
    mnemonic: {
      summary: 'En Noshörning (N) som sveper horisontellt UPPÅT (N)',
      summaryEn: 'A Rhino horn sweeping UPWARDS',
      storySv: '⚠️ KATAKANA TVILLING-REGEL: "Noshörningen stångar UPPÅT". Pricken sitter till vänster och det långa svepet startar NERE och dras flackt UPPÅT mot höger!',
      storyEn: 'A Rhino horn sweeping UPWARDS. Stroke starts at the bottom and sweeps UP.',
      imageVisualDesc: 'En nedre prick och ett långt svep draget nedifrån och snett uppåt höger i en flack vinkel.',
      keyCue: 'N som i Noshörning (sveper UPPÅT)',
      keyCueEn: 'N for sweeping UP'
    },
    pronunciationTipSv: 'Nasal stavelsekonsonant. Tar en hel mora (takt) i anspråk.',
    swedishSimilarSound: 'Nasalt N som i "bank"',
    similarSoundPitfall: '⚠️ BERYKTAD TVILLING: Blanda inte ihop med ソ (so)! I ン (n) dras strecket NEDIFRÅN OCH UPPÅT (flack vinkel). I ソ (so) dras det UPPIFRÅN OCH NEDÅT (brant vinkel).',
    japc11Week: 2,
    exampleWords: [
      { kana: 'パン', romaji: 'pan', meaningSv: 'bröd', meaningEn: 'bread', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ワイン', romaji: 'wain', meaningSv: 'vin', meaningEn: 'wine', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'スウェーデン', romaji: 'suweeden', meaningSv: 'Sverige', meaningEn: 'Sweden', genkiChapter: 'L1', pitchAccent: '②' }
    ]
  },

  // ==========================================
  // DAKUON (゛) - 20 TECKEN
  // ==========================================
  {
    id: 'kata_ga',
    kana: 'ガ',
    romaji: 'ga',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'Ga-raden (Ga, Gi, Gu, Ge, Go)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 28 35 L 72 35 L 62 82', 'M 48 20 L 32 80', 'M 72 18 L 78 26', 'M 78 15 L 84 23'],
    mnemonic: { summary: 'Kaffemått med två Dakuten-prickar', storySv: 'Katakana カ (ka) med två röstprickar blir GA som i Garage!', imageVisualDesc: 'K med två dakuten-prickar uppe till höger.', keyCue: 'Ga som i Garage' },
    pronunciationTipSv: 'Hårt g följt av kort a.',
    swedishSimilarSound: 'Ga som i "gata"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ガム', romaji: 'gamu', meaningSv: 'tuggummi', meaningEn: 'gum', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'ガラス', romaji: 'garasu', meaningSv: 'glas', meaningEn: 'glass', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },
  {
    id: 'kata_gi',
    kana: 'ギ',
    romaji: 'gi',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'Ga-raden (Ga, Gi, Gu, Ge, Go)',
    strokeCount: 5,
    script: 'katakana',
    strokeSvgData: ['M 30 32 L 70 32', 'M 25 52 L 75 52', 'M 55 18 L 40 85', 'M 75 18 L 80 25', 'M 80 15 L 85 22'],
    mnemonic: { summary: 'Nyckel med Dakuten-prickar', storySv: 'Katakana キ (ki) med prickar blir GI som i Gitarr!', imageVisualDesc: 'Ki med två dakuten.', keyCue: 'Gi som i Gitarr' },
    pronunciationTipSv: 'Hårt gi som i "gilla".',
    swedishSimilarSound: 'Gi som i "giva"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ギター', romaji: 'gitaa', meaningSv: 'gitarr (guitar)', meaningEn: 'guitar', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'イギリス', romaji: 'igirisu', meaningSv: 'England', meaningEn: 'UK', genkiChapter: 'L1', pitchAccent: '⓪' }]
  },
  {
    id: 'kata_gu',
    kana: 'グ',
    romaji: 'gu',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'Ga-raden (Ga, Gi, Gu, Ge, Go)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 48 20 L 32 50', 'M 35 42 L 72 42 L 45 85', 'M 75 18 L 80 25', 'M 80 15 L 85 22'],
    mnemonic: { summary: 'Kockhatt med röstprickar', storySv: 'Katakana ク (ku) med prickar blir GU som i Gurka!', imageVisualDesc: 'Ku med dakuten.', keyCue: 'Gu som i Gurka' },
    pronunciationTipSv: 'Hårt gu med orundat u.',
    swedishSimilarSound: 'Gu som i "guld"',
    japc11Week: 2,
    exampleWords: [{ kana: 'グループ', romaji: 'guruupu', meaningSv: 'grupp (group)', meaningEn: 'group', genkiChapter: 'L2', pitchAccent: '②' }, { kana: 'グラス', romaji: 'gurasu', meaningSv: 'dricksglas (glass)', meaningEn: 'glass', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_ge',
    kana: 'ゲ',
    romaji: 'ge',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'Ga-raden (Ga, Gi, Gu, Ge, Go)',
    strokeCount: 5,
    script: 'katakana',
    strokeSvgData: ['M 45 20 L 28 50', 'M 28 42 L 75 42', 'M 55 42 L 40 85', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Keps med röstprickar', storySv: 'Katakana ケ (ke) med prickar blir GE som i Game/Spel!', imageVisualDesc: 'Ke med dakuten.', keyCue: 'Ge som i Game' },
    pronunciationTipSv: 'Hårt ge som i "get".',
    swedishSimilarSound: 'Ge som i "get"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ゲーム', romaji: 'geemu', meaningSv: 'spel (game)', meaningEn: 'game', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'ゲスト', romaji: 'gesuto', meaningSv: 'gäst (guest)', meaningEn: 'guest', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_go',
    kana: 'ゴ',
    romaji: 'go',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'Ga-raden (Ga, Gi, Gu, Ge, Go)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 30 30 L 70 30 L 70 70', 'M 30 70 L 70 70', 'M 75 18 L 80 25', 'M 80 15 L 85 22'],
    mnemonic: { summary: 'Hörna med röstprickar', storySv: 'Katakana コ (ko) med prickar blir GO som i Golf!', imageVisualDesc: 'Ko med dakuten.', keyCue: 'Go som i Golf' },
    pronunciationTipSv: 'Hårt go med rundade läppar.',
    swedishSimilarSound: 'Go som i "godis"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ゴルフ', romaji: 'gorufu', meaningSv: 'golf', meaningEn: 'golf', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'リンゴ', romaji: 'ringo', meaningSv: 'äpple', meaningEn: 'apple', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },

  {
    id: 'kata_za',
    kana: 'ザ',
    romaji: 'za',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'Za-raden (Za, Ji, Zu, Ze, Zo)',
    strokeCount: 5,
    script: 'katakana',
    strokeSvgData: ['M 25 38 L 75 38', 'M 40 25 L 38 52', 'M 60 25 L 56 82', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Sadel med röstprickar', storySv: 'Katakana サ (sa) med prickar blir ZA som i Zebra!', imageVisualDesc: 'Sa med dakuten.', keyCue: 'Za som i Zebra' },
    pronunciationTipSv: 'Tonande z som i engelskans "zoo" eller "zebra".',
    swedishSimilarSound: 'Za som i "zoo"',
    japc11Week: 2,
    exampleWords: [{ kana: 'デザート', romaji: 'dezaato', meaningSv: 'dessert / efterrätt', meaningEn: 'dessert', genkiChapter: 'L2', pitchAccent: '②' }, { kana: 'ピザ', romaji: 'piza', meaningSv: 'pizza', meaningEn: 'pizza', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'kata_ji',
    kana: 'ジ',
    romaji: 'ji',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'Za-raden (Za, Ji, Zu, Ze, Zo)',
    strokeCount: 5,
    script: 'katakana',
    strokeSvgData: ['M 32 30 L 42 36', 'M 28 52 L 38 58', 'M 25 80 Q 45 75 75 40', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Shi med röstprickar', storySv: 'Katakana シ (shi) med prickar blir JI som i Jeans eller Juice!', imageVisualDesc: 'Shi med dakuten.', keyCue: 'Ji som i Jeans' },
    pronunciationTipSv: 'Tonande j som i engelskans "jeans" eller "juice".',
    swedishSimilarSound: 'Dji som i "jeans"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ジーンズ', romaji: 'jiinzu', meaningSv: 'jeans', meaningEn: 'jeans', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'ジュース', romaji: 'juusu', meaningSv: 'juice', meaningEn: 'juice', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'ラジオ', romaji: 'rajio', meaningSv: 'radio', meaningEn: 'radio', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'kata_zu',
    kana: 'ズ',
    romaji: 'zu',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'Za-raden (Za, Ji, Zu, Ze, Zo)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 30 32 L 68 32 L 40 85', 'M 52 55 L 75 82', 'M 75 18 L 80 25', 'M 80 15 L 85 22'],
    mnemonic: { summary: 'Skidåkare med röstprickar', storySv: 'Katakana ス (su) med prickar blir ZU som i Zoom!', imageVisualDesc: 'Su med dakuten.', keyCue: 'Zu som i Zoom' },
    pronunciationTipSv: 'Tonande z med orundat u.',
    swedishSimilarSound: 'Zu som i "zoom"',
    japc11Week: 2,
    exampleWords: [{ kana: 'チーズ', romaji: 'chiizu', meaningSv: 'ost (cheese)', meaningEn: 'cheese', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'ズボン', romaji: 'zubon', meaningSv: 'byxor (pants/trousers)', meaningEn: 'trousers', genkiChapter: 'L2', pitchAccent: '②' }]
  },
  {
    id: 'kata_ze',
    kana: 'ゼ',
    romaji: 'ze',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'Za-raden (Za, Ji, Zu, Ze, Zo)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 28 35 L 72 35 L 72 58 L 52 58', 'M 50 20 L 50 78 L 78 78', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Säte med röstprickar', storySv: 'Katakana セ (se) med prickar blir ZE som i Zest!', imageVisualDesc: 'Se med dakuten.', keyCue: 'Ze som i Zest' },
    pronunciationTipSv: 'Tonande z följt av e.',
    swedishSimilarSound: 'Ze som i "zest"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ゼロ', romaji: 'zero', meaningSv: 'noll (zero)', meaningEn: 'zero', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'ゼリー', romaji: 'zerii', meaningSv: 'gelé (jelly)', meaningEn: 'jelly', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_zo',
    kana: 'ゾ',
    romaji: 'zo',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'Za-raden (Za, Ji, Zu, Ze, Zo)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 38 25 L 48 42', 'M 68 25 Q 55 60 30 85', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'So med röstprickar', storySv: 'Katakana ソ (so) med prickar blir ZO som i Zon (Zone)!', imageVisualDesc: 'So med dakuten.', keyCue: 'Zo som i Zon / Zone' },
    pronunciationTipSv: 'Tonande z följt av o.',
    swedishSimilarSound: 'Zo som i "zon"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ゾンビ', romaji: 'zonbi', meaningSv: 'zombie', meaningEn: 'zombie', genkiChapter: 'L3', pitchAccent: '①' }, { kana: 'ゾーン', romaji: 'zoon', meaningSv: 'zon (zone)', meaningEn: 'zone', genkiChapter: 'L3', pitchAccent: '①' }]
  },

  {
    id: 'kata_da',
    kana: 'ダ',
    romaji: 'da',
    group: 'dakuon',
    row: 'd',
    rowNameSv: 'Da-raden (Da, Di, Du, De, Do)',
    strokeCount: 5,
    script: 'katakana',
    strokeSvgData: ['M 45 20 L 32 48', 'M 34 38 L 72 38 L 45 85', 'M 40 58 L 65 72', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Taco med röstprickar', storySv: 'Katakana タ (ta) med prickar blir DA som i Dans!', imageVisualDesc: 'Ta med dakuten.', keyCue: 'Da som i Dans' },
    pronunciationTipSv: 'Hårt d följt av kort a.',
    swedishSimilarSound: 'Da som i "dag"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ダンス', romaji: 'dansu', meaningSv: 'dans (dance)', meaningEn: 'dance', genkiChapter: 'L3', pitchAccent: '①' }, { kana: 'サラダ', romaji: 'sarada', meaningSv: 'sallad', meaningEn: 'salad', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_de',
    kana: 'デ',
    romaji: 'de',
    group: 'dakuon',
    row: 'd',
    rowNameSv: 'Da-raden (Da, Di, Du, De, Do)',
    strokeCount: 5,
    script: 'katakana',
    strokeSvgData: ['M 35 30 L 65 30', 'M 25 52 L 75 52', 'M 50 52 Q 48 75 32 85', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Telefonstolpe med prickar', storySv: 'Katakana テ (te) med prickar blir DE som i Dessert!', imageVisualDesc: 'Te med dakuten.', keyCue: 'De som i Dessert' },
    pronunciationTipSv: 'Hårt d följt av kort e.',
    swedishSimilarSound: 'De som i "dela"',
    japc11Week: 2,
    exampleWords: [{ kana: 'デパート', romaji: 'depaato', meaningSv: 'varuhus (department store)', meaningEn: 'department store', genkiChapter: 'L1', pitchAccent: '②' }, { kana: 'デザート', romaji: 'dezaato', meaningSv: 'dessert', meaningEn: 'dessert', genkiChapter: 'L2', pitchAccent: '②' }]
  },
  {
    id: 'kata_do',
    kana: 'ド',
    romaji: 'do',
    group: 'dakuon',
    row: 'd',
    rowNameSv: 'Da-raden (Da, Di, Du, De, Do)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 45 20 L 45 85', 'M 45 45 L 75 60', 'M 75 18 L 80 25', 'M 80 15 L 85 22'],
    mnemonic: { summary: 'Totem med röstprickar', storySv: 'Katakana ト (to) med prickar blir DO som i Dörr (Door)!', imageVisualDesc: 'To med dakuten.', keyCue: 'Do som i Dörr / Door' },
    pronunciationTipSv: 'Hårt d med rundade läppar.',
    swedishSimilarSound: 'Do som i "docka"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ドア', romaji: 'doa', meaningSv: 'dörr (door)', meaningEn: 'door', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'カード', romaji: 'kaado', meaningSv: 'kort / kreditkort', meaningEn: 'card', genkiChapter: 'L2', pitchAccent: '①' }]
  },

  {
    id: 'kata_ba',
    kana: 'バ',
    romaji: 'ba',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'Ba-raden (Ba, Bi, Bu, Be, Bo)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 42 30 L 28 75', 'M 58 30 L 72 75', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Hatt med röstprickar', storySv: 'Katakana ハ (ha) med prickar blir BA som i Banan!', imageVisualDesc: 'Ha med dakuten.', keyCue: 'Ba som i Banan' },
    pronunciationTipSv: 'Mjukt tonande b följt av a.',
    swedishSimilarSound: 'Ba som i "backe"',
    japc11Week: 2,
    exampleWords: [{ kana: 'バナナ', romaji: 'banana', meaningSv: 'banan', meaningEn: 'banana', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'バス', romaji: 'basu', meaningSv: 'buss', meaningEn: 'bus', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'バター', romaji: 'bataa', meaningSv: 'smör (butter)', meaningEn: 'butter', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_bi',
    kana: 'ビ',
    romaji: 'bi',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'Ba-raden (Ba, Bi, Bu, Be, Bo)',
    strokeCount: 4,
    script: 'katakana',
    strokeSvgData: ['M 30 35 L 60 35', 'M 30 20 L 30 75 L 75 75', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Hi-stol med röstprickar', storySv: 'Katakana ヒ (hi) med prickar blir BI som i Bil eller Öl (Bīru)!', imageVisualDesc: 'Hi med dakuten.', keyCue: 'Bi som i Bil / Bīru' },
    pronunciationTipSv: 'Kort bi som i "bita".',
    swedishSimilarSound: 'Bi som i "bil"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ビール', romaji: 'biiru', meaningSv: 'öl (beer)', meaningEn: 'beer', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'ビル', romaji: 'biru', meaningSv: 'byggnad / höghus (building)', meaningEn: 'building', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'テレビ', romaji: 'terebi', meaningSv: 'TV', meaningEn: 'TV', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'kata_bu',
    kana: 'ブ',
    romaji: 'bu',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'Ba-raden (Ba, Bi, Bu, Be, Bo)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: ['M 30 32 L 70 32 Q 55 60 35 82', 'M 75 18 L 80 25', 'M 80 15 L 85 22'],
    mnemonic: { summary: 'Flaggstång med prickar', storySv: 'Katakana フ (fu) med prickar blir BU som i Buss / Bok!', imageVisualDesc: 'Fu med dakuten.', keyCue: 'Bu som i Buss' },
    pronunciationTipSv: 'Tonande b med orundat u.',
    swedishSimilarSound: 'Bu som i "buss"',
    japc11Week: 2,
    exampleWords: [{ kana: 'テーブル', romaji: 'teeburu', meaningSv: 'bord (table)', meaningEn: 'table', genkiChapter: 'L2', pitchAccent: '⓪' }, { kana: 'クラブ', romaji: 'kurabu', meaningSv: 'klubb (club)', meaningEn: 'club', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_be',
    kana: 'ベ',
    romaji: 'be',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'Ba-raden (Ba, Bi, Bu, Be, Bo)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: ['M 25 60 L 45 35 L 78 70', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Hjälm med röstprickar', storySv: 'Katakana ヘ (he) med prickar blir BE som i Bälte / Säng (Bed)!', imageVisualDesc: 'He med dakuten.', keyCue: 'Be som i Bälte / Bed' },
    pronunciationTipSv: 'Kort be som i "bädd".',
    swedishSimilarSound: 'Be som i "bädd"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ベッド', romaji: 'beddo', meaningSv: 'säng (bed)', meaningEn: 'bed', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'ベルト', romaji: 'beruto', meaningSv: 'bälte (belt)', meaningEn: 'belt', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },
  {
    id: 'kata_bo',
    kana: 'ボ',
    romaji: 'bo',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'Ba-raden (Ba, Bi, Bu, Be, Bo)',
    strokeCount: 6,
    script: 'katakana',
    strokeSvgData: ['M 25 32 L 75 32', 'M 50 18 L 50 85', 'M 38 48 L 28 72', 'M 62 48 L 72 72', 'M 78 18 L 83 25', 'M 83 15 L 88 22'],
    mnemonic: { summary: 'Hus med röstprickar', storySv: 'Katakana ホ (ho) med prickar blir BO som i Boll / Box!', imageVisualDesc: 'Ho med dakuten.', keyCue: 'Bo som i Boll / Box' },
    pronunciationTipSv: 'Kort bo med rundade läppar.',
    swedishSimilarSound: 'Bo som i "boll"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ボール', romaji: 'booru', meaningSv: 'boll (ball)', meaningEn: 'ball', genkiChapter: 'L2', pitchAccent: '⓪' }, { kana: 'ボタン', romaji: 'botan', meaningSv: 'knapp (button)', meaningEn: 'button', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },

  // ==========================================
  // HANDAKUON (゜) - 5 TECKEN
  // ==========================================
  {
    id: 'kata_pa',
    kana: 'パ',
    romaji: 'pa',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'Pa-raden (Pa, Pi, Pu, Pe, Po)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: ['M 42 30 L 28 75', 'M 58 30 L 72 75', 'M 80 20 A 4 4 0 1 1 79.9 20'],
    mnemonic: { summary: 'Hatt med en rund ballongcirkel (Handakuten)', storySv: 'Katakana ハ (ha) med en liten rund ring blir PA som i Pan / Bröd!', imageVisualDesc: 'Ha med liten handakuten-cirkel.', keyCue: 'Pa som i Pan (Bröd)' },
    pronunciationTipSv: 'Kort krispigt p följt av a.',
    swedishSimilarSound: 'Pa som i "pannkaka"',
    japc11Week: 2,
    exampleWords: [{ kana: 'パン', romaji: 'pan', meaningSv: 'bröd', meaningEn: 'bread', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'パーティー', romaji: 'paatii', meaningSv: 'fest (party)', meaningEn: 'party', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'kata_pi',
    kana: 'ピ',
    romaji: 'pi',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'Pa-raden (Pa, Pi, Pu, Pe, Po)',
    strokeCount: 3,
    script: 'katakana',
    strokeSvgData: ['M 30 35 L 60 35', 'M 30 20 L 30 75 L 75 75', 'M 80 20 A 4 4 0 1 1 79.9 20'],
    mnemonic: { summary: 'Stol med handakuten-ring', storySv: 'Katakana ヒ (hi) med ring blir PI som i Piano eller Pizza!', imageVisualDesc: 'Hi med liten cirkel.', keyCue: 'Pi som i Piano / Pizza' },
    pronunciationTipSv: 'Kort pi som i "pigg".',
    swedishSimilarSound: 'Pi som i "piano"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ピアノ', romaji: 'piano', meaningSv: 'piano', meaningEn: 'piano', genkiChapter: 'L2', pitchAccent: '⓪' }, { kana: 'ピザ', romaji: 'piza', meaningSv: 'pizza', meaningEn: 'pizza', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'kata_pu',
    kana: 'プ',
    romaji: 'pu',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'Pa-raden (Pa, Pi, Pu, Pe, Po)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: ['M 30 32 L 70 32 Q 55 60 35 82', 'M 80 20 A 4 4 0 1 1 79.9 20'],
    mnemonic: { summary: 'Flaggstång med ring', storySv: 'Katakana フ (fu) med ring blir PU som i Pool!', imageVisualDesc: 'Fu med liten cirkel.', keyCue: 'Pu som i Pool' },
    pronunciationTipSv: 'Kort pu med orundat u.',
    swedishSimilarSound: 'Pu som i "puss"',
    japc11Week: 2,
    exampleWords: [{ kana: 'プール', romaji: 'puuru', meaningSv: 'simbassäng (pool)', meaningEn: 'pool', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'スプーン', romaji: 'supuun', meaningSv: 'sked (spoon)', meaningEn: 'spoon', genkiChapter: 'L2', pitchAccent: '②' }]
  },
  {
    id: 'kata_pe',
    kana: 'ペ',
    romaji: 'pe',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'Pa-raden (Pa, Pi, Pu, Pe, Po)',
    strokeCount: 2,
    script: 'katakana',
    strokeSvgData: ['M 25 60 L 45 35 L 78 70', 'M 80 20 A 4 4 0 1 1 79.9 20'],
    mnemonic: { summary: 'Hjälm med ring', storySv: 'Katakana ヘ (he) med ring blir PE som i Penna (Pen)!', imageVisualDesc: 'He med liten cirkel.', keyCue: 'Pe som i Pen / Penna' },
    pronunciationTipSv: 'Kort pe som i "penna".',
    swedishSimilarSound: 'Pe som i "penna"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ペン', romaji: 'pen', meaningSv: 'penna (pen)', meaningEn: 'pen', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'ページ', romaji: 'peeji', meaningSv: 'sida (page)', meaningEn: 'page', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_po',
    kana: 'ポ',
    romaji: 'po',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'Pa-raden (Pa, Pi, Pu, Pe, Po)',
    strokeCount: 5,
    script: 'katakana',
    strokeSvgData: ['M 25 32 L 75 32', 'M 50 18 L 50 85', 'M 38 48 L 28 72', 'M 62 48 L 72 72', 'M 80 20 A 4 4 0 1 1 79.9 20'],
    mnemonic: { summary: 'Hus med handakuten-ring', storySv: 'Katakana ホ (ho) med ring blir PO som i Popcorn!', imageVisualDesc: 'Ho med liten cirkel.', keyCue: 'Po som i Popcorn' },
    pronunciationTipSv: 'Kort po med rundade läppar.',
    swedishSimilarSound: 'Po som i "post"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ポケット', romaji: 'poketto', meaningSv: 'ficka (pocket)', meaningEn: 'pocket', genkiChapter: 'L2', pitchAccent: '②' }, { kana: 'スポーツ', romaji: 'supootsu', meaningSv: 'sport', meaningEn: 'sports', genkiChapter: 'L3', pitchAccent: '②' }]
  },

  // ==========================================
  // YŌON (KOMBINATIONER) & MODERNA GAIRAIGO-SPECIALARE
  // ==========================================
  {
    id: 'kata_kya',
    kana: 'キャ',
    romaji: 'kya',
    group: 'yoon',
    row: 'ky',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 5,
    script: 'katakana',
    mnemonic: { summary: 'Ki + litet ya', storySv: 'Kombination av キ (ki) och litet ャ (ya) bildar KYA som i Camping (Kyanpu)!', imageVisualDesc: 'Ki följt av litet ya.', keyCue: 'Kya som i Camping' },
    pronunciationTipSv: 'Kort kya i en enda sammansatt stavelse.',
    swedishSimilarSound: 'Kya',
    japc11Week: 2,
    exampleWords: [{ kana: 'キャンプ', romaji: 'kyanpu', meaningSv: 'camping', meaningEn: 'camping', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_sha',
    kana: 'シャ',
    romaji: 'sha',
    group: 'yoon',
    row: 'sh',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 5,
    script: 'katakana',
    mnemonic: { summary: 'Shi + litet ya', storySv: 'Kombination av シ (shi) och litet ャ (ya) bildar SHA som i Schampo / Skjorta (Shatsu)!', imageVisualDesc: 'Shi följt av litet ya.', keyCue: 'Sha som i Skjorta / Schampo' },
    pronunciationTipSv: 'Mjukt sha som i "schackel".',
    swedishSimilarSound: 'Sha som i "schampo"',
    japc11Week: 2,
    exampleWords: [{ kana: 'シャツ', romaji: 'shatsu', meaningSv: 'skjorta', meaningEn: 'shirt', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'シャワー', romaji: 'shawaa', meaningSv: 'dusch', meaningEn: 'shower', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_shu',
    kana: 'シュ',
    romaji: 'shu',
    group: 'yoon',
    row: 'sh',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 5,
    script: 'katakana',
    mnemonic: { summary: 'Shi + litet yu', storySv: 'Kombination av シ (shi) och litet ュ (yu) bildar SHU som i Skidor / Cream puff (Shuukuriimu)!', imageVisualDesc: 'Shi följt av litet yu.', keyCue: 'Shu' },
    pronunciationTipSv: 'Mjukt shu.',
    swedishSimilarSound: 'Shu som i "tjut"',
    japc11Week: 2,
    exampleWords: [{ kana: 'シュークリーム', romaji: 'shuukuriimu', meaningSv: 'gräddbulle (chou à la crème)', meaningEn: 'cream puff', genkiChapter: 'L3', pitchAccent: '③' }]
  },
  {
    id: 'kata_sho',
    kana: 'ショ',
    romaji: 'sho',
    group: 'yoon',
    row: 'sh',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 6,
    script: 'katakana',
    mnemonic: { summary: 'Shi + litet yo', storySv: 'Kombination av シ (shi) och litet ョ (yo) bildar SHO som i Shopping / Show!', imageVisualDesc: 'Shi följt av litet yo.', keyCue: 'Sho som i Shopping' },
    pronunciationTipSv: 'Mjukt sho som i "shopping".',
    swedishSimilarSound: 'Sho som i "show"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ショップ', romaji: 'shoppu', meaningSv: 'butik (shop)', meaningEn: 'shop', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'ショー', romaji: 'shoo', meaningSv: 'föreställning (show)', meaningEn: 'show', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_cha',
    kana: 'チャ',
    romaji: 'cha',
    group: 'yoon',
    row: 'ch',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 5,
    script: 'katakana',
    mnemonic: { summary: 'Chi + litet ya', storySv: 'Kombination av チ (chi) och litet ャ (ya) bildar CHA som i Chans / Chatta!', imageVisualDesc: 'Chi följt av litet ya.', keyCue: 'Cha som i Chatta' },
    pronunciationTipSv: 'Tydligt cha som i engelskans "chance".',
    swedishSimilarSound: 'Cha som i "chans"',
    japc11Week: 2,
    exampleWords: [{ kana: 'チャット', romaji: 'chatto', meaningSv: 'chatt (chat)', meaningEn: 'chat', genkiChapter: 'L3', pitchAccent: '①' }, { kana: 'チャンス', romaji: 'chansu', meaningSv: 'chans (chance)', meaningEn: 'chance', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_chu',
    kana: 'チュ',
    romaji: 'chu',
    group: 'yoon',
    row: 'ch',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 5,
    script: 'katakana',
    mnemonic: { summary: 'Chi + litet yu', storySv: 'Kombination av チ (chi) och litet ュ (yu) bildar CHU som i Tuggummi (Chew) / Tulpan (Chuurippu)!', imageVisualDesc: 'Chi följt av litet yu.', keyCue: 'Chu som i Tulpan' },
    pronunciationTipSv: 'Kort chu.',
    swedishSimilarSound: 'Chu',
    japc11Week: 2,
    exampleWords: [{ kana: 'チューリップ', romaji: 'chuurippu', meaningSv: 'tulpan (tulip)', meaningEn: 'tulip', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_cho',
    kana: 'チョ',
    romaji: 'cho',
    group: 'yoon',
    row: 'ch',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 6,
    script: 'katakana',
    mnemonic: { summary: 'Chi + litet yo', storySv: 'Kombination av チ (chi) och litet ョ (yo) bildar CHO som i Choklad (Chokoreeto)!', imageVisualDesc: 'Chi följt av litet yo.', keyCue: 'Cho som i Choklad' },
    pronunciationTipSv: 'Tydligt cho som i "choklad".',
    swedishSimilarSound: 'Cho som i "chock"',
    japc11Week: 2,
    exampleWords: [{ kana: 'チョコレート', romaji: 'chokoreeto', meaningSv: 'choklad (chocolate)', meaningEn: 'chocolate', genkiChapter: 'L2', pitchAccent: '③' }]
  },
  {
    id: 'kata_ja',
    kana: 'ジャ',
    romaji: 'ja',
    group: 'yoon',
    row: 'j',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 7,
    script: 'katakana',
    mnemonic: { summary: 'Ji + litet ya', storySv: 'Kombination av ジ (ji) och litet ャ (ya) bildar JA som i Jacka (Jaketto) eller Sylt (Jam)!', imageVisualDesc: 'Ji följt av litet ya.', keyCue: 'Ja som i Jacka / Jam' },
    pronunciationTipSv: 'Tonande dja som i engelskans "jacket" eller "jam".',
    swedishSimilarSound: 'Dja som i "jacka"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ジャケット', romaji: 'jaketto', meaningSv: 'jacka (jacket)', meaningEn: 'jacket', genkiChapter: 'L2', pitchAccent: '②' }, { kana: 'ジャム', romaji: 'jamu', meaningSv: 'sylt / marmelad (jam)', meaningEn: 'jam', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_ju',
    kana: 'ジュ',
    romaji: 'ju',
    group: 'yoon',
    row: 'j',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 7,
    script: 'katakana',
    mnemonic: { summary: 'Ji + litet yu', storySv: 'Kombination av ジ (ji) och litet ュ (yu) bildar JU som i Juice (Juusu)!', imageVisualDesc: 'Ji följt av litet yu.', keyCue: 'Ju som i Juice' },
    pronunciationTipSv: 'Tonande dju som i "juice".',
    swedishSimilarSound: 'Dju som i "juice"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ジュース', romaji: 'juusu', meaningSv: 'juice', meaningEn: 'juice', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'kata_jo',
    kana: 'ジョ',
    romaji: 'jo',
    group: 'yoon',
    row: 'j',
    rowNameSv: 'Kombinationer (Yōon)',
    strokeCount: 8,
    script: 'katakana',
    mnemonic: { summary: 'Ji + litet yo', storySv: 'Kombination av ジ (ji) och litet ョ (yo) bildar JO som i Jogga (Jogingu)!', imageVisualDesc: 'Ji följt av litet yo.', keyCue: 'Jo som i Jogga' },
    pronunciationTipSv: 'Tonande djo som i "jogging".',
    swedishSimilarSound: 'Djo som i "jogging"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ジョギング', romaji: 'jogingu', meaningSv: 'joggning', meaningEn: 'jogging', genkiChapter: 'L3', pitchAccent: '⓪' }]
  },

  // ==========================================
  // MODERNA GAIRAIGO-SPECIALKOMBINATIONER
  // (Avgörande för autentiska låneord i Katakana)
  // ==========================================
  {
    id: 'kata_ti',
    kana: 'ティ',
    romaji: 'ti',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 5,
    script: 'katakana',
    mnemonic: { summary: 'Te + litet i för modernt TI-ljud', storySv: 'Te (テ) och litet i (ィ) bildar det moderna låneordsljudet TI som i Party (Paatii) och Näsduk (Tisshu)!', imageVisualDesc: 'Te med ett litet i bredvid.', keyCue: 'Ti som i Party / Näsduk' },
    pronunciationTipSv: 'Rent "ti" (inte chi). Används för att återge moderna utländska ord.',
    swedishSimilarSound: 'Ti som i "titel"',
    japc11Week: 2,
    exampleWords: [{ kana: 'パーティー', romaji: 'paatii', meaningSv: 'fest / party', meaningEn: 'party', genkiChapter: 'L1', pitchAccent: '①' }, { kana: 'ティッシュ', romaji: 'tisshu', meaningSv: 'pappersnäsduk (tissue)', meaningEn: 'tissue', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_di',
    kana: 'ディ',
    romaji: 'di',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 7,
    script: 'katakana',
    mnemonic: { summary: 'De + litet i för modernt DI-ljud', storySv: 'De (デ) och litet i (ィ) bildar modernt DI som i Disk (Disuku) eller Middag (Dinner)!', imageVisualDesc: 'De med litet i.', keyCue: 'Di som i Disk' },
    pronunciationTipSv: 'Rent "di" (inte ji).',
    swedishSimilarSound: 'Di som i "disk"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ディスク', romaji: 'disuku', meaningSv: 'disk / skiva', meaningEn: 'disk', genkiChapter: 'L3', pitchAccent: '①' }, { kana: 'ディナー', romaji: 'dinaa', meaningSv: 'finmiddag (dinner)', meaningEn: 'dinner', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_fa',
    kana: 'ファ',
    romaji: 'fa',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 3,
    script: 'katakana',
    mnemonic: { summary: 'Fu + litet a för FA-ljud', storySv: 'Fu (フ) och litet a (ァ) bildar FA som i Fan (beundrare) eller Snabbmat (Fast food)!', imageVisualDesc: 'Fu med litet a.', keyCue: 'Fa som i Fan / Fast food' },
    pronunciationTipSv: 'Krispigt f-ljud följt av a.',
    swedishSimilarSound: 'Fa som i "fart"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ファストフード', romaji: 'fasutofuudo', meaningSv: 'snabbmat (fast food)', meaningEn: 'fast food', genkiChapter: 'L2', pitchAccent: '④' }, { kana: 'ファン', romaji: 'fan', meaningSv: 'fan / beundrare / fläkt', meaningEn: 'fan', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_fi',
    kana: 'フィ',
    romaji: 'fi',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 3,
    script: 'katakana',
    mnemonic: { summary: 'Fu + litet i för FI-ljud', storySv: 'Fu (フ) och litet i (ィ) bildar FI som i Film (Firumu) eller Finland!', imageVisualDesc: 'Fu med litet i.', keyCue: 'Fi som i Film / Finland' },
    pronunciationTipSv: 'Krispigt f följt av i.',
    swedishSimilarSound: 'Fi som i "film"',
    japc11Week: 2,
    exampleWords: [{ kana: 'フィルム', romaji: 'firumu', meaningSv: 'film / fotofilm', meaningEn: 'film', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'フィンランド', romaji: 'finrando', meaningSv: 'Finland', meaningEn: 'Finland', genkiChapter: 'L1', pitchAccent: '③' }]
  },
  {
    id: 'kata_fe',
    kana: 'フェ',
    romaji: 'fe',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 4,
    script: 'katakana',
    mnemonic: { summary: 'Fu + litet e för FE-ljud', storySv: 'Fu (フ) och litet e (ェ) bildar FE som i Café (Kafe) och Festival (Fesu)!', imageVisualDesc: 'Fu med litet e.', keyCue: 'Fe som i Café / Festival' },
    pronunciationTipSv: 'Krispigt f följt av e.',
    swedishSimilarSound: 'Fe som i "fest"',
    japc11Week: 2,
    exampleWords: [{ kana: 'カフェ', romaji: 'kafe', meaningSv: 'café', meaningEn: 'cafe', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'フェスティバル', romaji: 'fesutibaru', meaningSv: 'festival', meaningEn: 'festival', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_fo',
    kana: 'フォ',
    romaji: 'fo',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 4,
    script: 'katakana',
    mnemonic: { summary: 'Fu + litet o för FO-ljud', storySv: 'Fu (フ) och litet o (ォ) bildar FO som i Gaffel (Fork / Fooku)!', imageVisualDesc: 'Fu med litet o.', keyCue: 'Fo som i Gaffel (Fork)' },
    pronunciationTipSv: 'Krispigt f följt av o.',
    swedishSimilarSound: 'Fo som i "foto"',
    japc11Week: 2,
    exampleWords: [{ kana: 'フォーク', romaji: 'fooku', meaningSv: 'gaffel (fork)', meaningEn: 'fork', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'フォーム', romaji: 'foomu', meaningSv: 'formulär / form', meaningEn: 'form', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_che',
    kana: 'チェ',
    romaji: 'che',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 6,
    script: 'katakana',
    mnemonic: { summary: 'Chi + litet e för CHE-ljud', storySv: 'Chi (チ) och litet e (ェ) bildar CHE som i Kontroll / Check (Chekku) och Schack (Chess)!', imageVisualDesc: 'Chi med litet e.', keyCue: 'Che som i Checka' },
    pronunciationTipSv: 'Tydligt che som i "check".',
    swedishSimilarSound: 'Che som i "check"',
    japc11Week: 2,
    exampleWords: [{ kana: 'チェック', romaji: 'chekku', meaningSv: 'kontrollera / checka in', meaningEn: 'check', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'kata_she',
    kana: 'シェ',
    romaji: 'she',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 6,
    script: 'katakana',
    mnemonic: { summary: 'Shi + litet e för SHE-ljud', storySv: 'Shi (シ) och litet e (ェ) bildar SHE som i Kock / Chef (Shefu)!', imageVisualDesc: 'Shi med litet e.', keyCue: 'She som i Chef (Kock)' },
    pronunciationTipSv: 'Mjukt she.',
    swedishSimilarSound: 'She som i "chef"',
    japc11Week: 2,
    exampleWords: [{ kana: 'シェフ', romaji: 'shefu', meaningSv: 'kock / köksmästare (chef)', meaningEn: 'chef', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_je',
    kana: 'ジェ',
    romaji: 'je',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 8,
    script: 'katakana',
    mnemonic: { summary: 'Ji + litet e för JE-ljud', storySv: 'Ji (ジ) och litet e (ェ) bildar JE som i Jetplan (Jetto) och Gelé (Jelly)!', imageVisualDesc: 'Ji med litet e.', keyCue: 'Je som i Jetplan' },
    pronunciationTipSv: 'Tonande dje som i "jet".',
    swedishSimilarSound: 'Dje som i "jet"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ジェット', romaji: 'jetto', meaningSv: 'jetplan / jetmotor', meaningEn: 'jet', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'kata_wi',
    kana: 'ウィ',
    romaji: 'wi',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 5,
    script: 'katakana',
    mnemonic: { summary: 'U + litet i för WI-ljud', storySv: 'U (ウ) och litet i (ィ) bildar WI som i Fönster (Window / Uindou) och Whisky!', imageVisualDesc: 'U med litet i.', keyCue: 'Wi som i Window / Whisky' },
    pronunciationTipSv: 'Engelskt w följt av i.',
    swedishSimilarSound: 'Wi som i "whisky"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ウィンドウ', romaji: 'windou', meaningSv: 'fönster (window)', meaningEn: 'window', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'ウィスキー', romaji: 'wisukii', meaningSv: 'whisky', meaningEn: 'whiskey', genkiChapter: 'L2', pitchAccent: '②' }]
  },
  {
    id: 'kata_we',
    kana: 'ウェ',
    romaji: 'we',
    group: 'special',
    row: 'special_gairaigo',
    rowNameSv: 'Specialkombinationer (Gairaigo)',
    strokeCount: 6,
    script: 'katakana',
    mnemonic: { summary: 'U + litet e för WE-ljud', storySv: 'U (ウ) och litet e (ェ) bildar WE som i Servitör (Waiter / Weitaa) och Webb (Web)!', imageVisualDesc: 'U med litet e.', keyCue: 'We som i Webb / Waiter' },
    pronunciationTipSv: 'Engelskt w följt av e.',
    swedishSimilarSound: 'We som i "webb"',
    japc11Week: 2,
    exampleWords: [{ kana: 'ウェイター', romaji: 'weitaa', meaningSv: 'servitör (waiter)', meaningEn: 'waiter', genkiChapter: 'L2', pitchAccent: '①' }, { kana: 'ウェブ', romaji: 'webu', meaningSv: 'webb (web)', meaningEn: 'web', genkiChapter: 'L1', pitchAccent: '①' }]
  }
];

export const KATAKANA_MAP = new Map<string, KanaCharacter>(
  KATAKANA_DATA.map(k => [k.id, k])
);
