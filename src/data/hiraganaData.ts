import type { KanaCharacter } from '../types/kana';

export const HIRAGANA_DATA: KanaCharacter[] = [
  // ==========================================
  // VOKALER (A-RADEN) - DEL 1
  // ==========================================
  {
    id: 'a',
    kana: 'あ',
    romaji: 'a',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 3,
    strokeSvgData: [
      'M 25 35 Q 50 34 75 35',
      'M 50 18 Q 48 55 45 85',
      'M 35 48 C 65 35 80 60 65 80 C 45 92 30 75 30 55 C 30 45 42 42 55 45'
    ],
    mnemonic: {
      summary: 'En Apel (äpple) på ett träd med en stam',
      summaryEn: 'An Apple hanging from a tree branch',
      storySv: 'Tänk på en "Apel" (äpple). Du ser trädstammen med grenen och ett stort runt äpple som hänger under. "A" för Apel!',
      storyEn: 'See the trunk, the cross branch, and a big round Apple hanging underneath. "A" for Apple!',
      imageVisualDesc: 'Ett korsat träd med ett runt äpple som hänger i en ögla till höger.',
      keyCue: 'A som i Apel / Äpple',
      keyCueEn: 'A for Apple'
    },
    pronunciationTipSv: 'Ett kort och öppet "a", likt svenskans A i "katt" eller "hatt", inte långt "aaa". Håll munnen avslappnad.',
    swedishSimilarSound: 'Kort A som i "hatt"',
    similarSoundPitfall: 'Förväxla inte med お (o)! あ har ett kors och en stor rund ögla.',
    courseStage: 1,
    exampleWords: [
      { kana: 'あさ', romaji: 'asa', meaningSv: 'morgon', meaningEn: 'morning', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'あめ', romaji: 'ame', meaningSv: 'regn / godis', meaningEn: 'rain / candy', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ありがとう', romaji: 'arigatou', meaningSv: 'tack', meaningEn: 'thank you', genkiChapter: 'L0', pitchAccent: '②' }
    ]
  },
  {
    id: 'i',
    kana: 'い',
    romaji: 'i',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 2,
    strokeSvgData: [
      'M 32 25 C 30 55 33 70 42 80 C 44 82 45 78 40 70',
      'M 68 38 C 70 52 68 62 62 70'
    ],
    mnemonic: {
      summary: 'Två Iglar som simmar bredvid varandra',
      summaryEn: 'Two Eels swimming side by side',
      storySv: 'Två "Iglar" (eller två I-streck) simmar parallellt i vattnet. Den vänstra har en liten hake längst ner.',
      storyEn: 'Two vertical parallel lines like two Eels or two "I" strokes swimming in the water.',
      imageVisualDesc: 'Två böjda vertikala linjer som två parallella iglar.',
      keyCue: 'I som i två Iglar',
      keyCueEn: 'I for two Eels'
    },
    pronunciationTipSv: 'Kort "i" som i svenskans "sitt" eller "fisk". Mungiporna dras lätt åt sidorna.',
    swedishSimilarSound: 'Kort I som i "sitt"',
    similarSoundPitfall: 'Förväxla inte med り (ri)! I い är vänster streck längre med en krok.',
    courseStage: 1,
    exampleWords: [
      { kana: 'いえ', romaji: 'ie', meaningSv: 'hus/hem', meaningEn: 'house/home', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'いいえ', romaji: 'iie', meaningSv: 'nej', meaningEn: 'no', genkiChapter: 'L0', pitchAccent: '③' },
      { kana: 'いぬ', romaji: 'inu', meaningSv: 'hund', meaningEn: 'dog', genkiChapter: 'L2', pitchAccent: '②' }
    ]
  },
  {
    id: 'u',
    kana: 'う',
    romaji: 'u',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 2,
    strokeSvgData: [
      'M 45 20 Q 55 23 58 30',
      'M 35 42 C 65 38 75 60 62 78 C 50 90 35 85 30 75'
    ],
    mnemonic: {
      summary: 'Någon som får ett slag i magen och stönar "Uff!"',
      summaryEn: 'An Umpire hit in the stomach / Sit-up',
      storySv: 'En böjd rygg på någon som bär en tung ryggsäck och stönar "Ufff!". Lilla strecket överst är huvudet.',
      storyEn: 'A person bent over doing sit-ups or an Umpire hit in the gut yelling "Uugh!".',
      imageVisualDesc: 'Ett toppstreck och en stor böjd kurva som en person som hukar sig.',
      keyCue: 'U som i Uff!',
      keyCueEn: 'U for Umpire'
    },
    pronunciationTipSv: 'VIKTIGT: Inte som svenskt "u" (hus) eller "o"! Läpparna ska vara helt orundade (platta). Det är ett neutralt ljud mitt emellan svenskt o och u.',
    swedishSimilarSound: 'Neutralt orundat u/o',
    similarSoundPitfall: 'Förväxla inte med ら (ra)! う har en rundare mage utan rak rygg.',
    courseStage: 1,
    exampleWords: [
      { kana: 'うえ', romaji: 'ue', meaningSv: 'ovanpå/över', meaningEn: 'above/on', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'うた', romaji: 'uta', meaningSv: 'sång', meaningEn: 'song', genkiChapter: 'L3', pitchAccent: '②' },
      { kana: 'うみ', romaji: 'umi', meaningSv: 'hav', meaningEn: 'sea/ocean', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'e',
    kana: 'え',
    romaji: 'e',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 2,
    strokeSvgData: [
      'M 45 18 Q 55 22 58 28',
      'M 48 35 L 32 60 L 68 56 C 55 68 45 82 72 82'
    ],
    mnemonic: {
      summary: 'En Exotisk fågel på en gren',
      summaryEn: 'An Energetic ninja running forward',
      storySv: 'Tänk på en "Exotisk" pelikan eller svan som sträcker på halsen, eller ett sicksackande "E" med en vinklad svans.',
      storyEn: 'An Exotic bird or an Energetic ninja dashing forward with his arms stretched out.',
      imageVisualDesc: 'Ett takstreck och en sicksack-linje med en vågig fot.',
      keyCue: 'E som i Exotisk fågel',
      keyCueEn: 'E for Energetic'
    },
    pronunciationTipSv: 'Kort och klart "e" som i svenskans "ett" eller "penna".',
    swedishSimilarSound: 'Kort E som i "penna"',
    similarSoundPitfall: 'Förväxla inte med ん (n)! え har ett toppstreck och en extra böj.',
    courseStage: 1,
    exampleWords: [
      { kana: 'えき', romaji: 'eki', meaningSv: 'tågstation', meaningEn: 'train station', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'えいご', romaji: 'eigo', meaningSv: 'engelska språket', meaningEn: 'English language', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'えん', romaji: 'en', meaningSv: 'yen (japansk valuta)', meaningEn: 'yen', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'o',
    kana: 'お',
    romaji: 'o',
    group: 'gojuon',
    row: 'vowel',
    rowNameSv: 'Vokaler (A-raden)',
    strokeCount: 3,
    strokeSvgData: [
      'M 25 35 Q 45 35 60 35',
      'M 42 20 L 42 60 C 42 78 30 82 25 75 C 20 68 30 55 55 60 C 68 64 72 80 65 88',
      'M 72 32 Q 78 38 80 44'
    ],
    mnemonic: {
      summary: 'En Orm på en Ormbunke med en liten prick',
      summaryEn: 'A golf ball On the green next to the flag',
      storySv: 'En "Orm" slingrar sig runt en stam och tappar en liten droppe ("pricken" uppe till höger). "O" för Orm!',
      storyEn: 'A golfer putting a ball On the green, with the flagpole on the left and a golf ball on the right.',
      imageVisualDesc: 'Ett korsat streck med en stor slinga och en flygande accent-prick till höger.',
      keyCue: 'O som i Orm med prick',
      keyCueEn: 'O for On the green'
    },
    pronunciationTipSv: 'Kort och rent "å/o"-ljud som i svenskans "kom" eller "boll". Forma läpparna till ett litet O.',
    swedishSimilarSound: 'Kort å/o som i "boll"',
    similarSoundPitfall: 'Se upp för skillnaden mot あ (a)! お har den lilla separata pricken uppe till höger.',
    courseStage: 1,
    exampleWords: [
      { kana: 'おはよう', romaji: 'ohayou', meaningSv: 'god morgon (informell)', meaningEn: 'good morning', genkiChapter: 'L0', pitchAccent: '②' },
      { kana: 'おちゃ', romaji: 'ocha', meaningSv: 'grönt te', meaningEn: 'green tea', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'おんな', romaji: 'onna', meaningSv: 'kvinna', meaningEn: 'woman', genkiChapter: 'L1', pitchAccent: '③' }
    ]
  },

  // ==========================================
  // KA-RADEN - DEL 1
  // ==========================================
  {
    id: 'ka',
    kana: 'か',
    romaji: 'ka',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'KA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 28 35 L 58 35 C 68 35 65 55 58 75 C 56 79 50 78 52 70',
      'M 42 20 Q 38 55 35 85',
      'M 70 30 Q 75 38 78 45'
    ],
    mnemonic: {
      summary: 'En Kanna som häller ut en droppe te',
      summaryEn: 'A Karate kick slicing a board',
      storySv: 'Det ser ut som en kaffekanna eller tekanna ("Ka") med pipen till vänster och en liten droppe som skvätter till höger.',
      storyEn: 'A martial artist executing a dynamic Karate kick, splitting a piece of wood into the air.',
      imageVisualDesc: 'En böjd kanna med handtag och en liten droppe till höger.',
      keyCue: 'KA som i Kanna',
      keyCueEn: 'Ka for Karate kick'
    },
    pronunciationTipSv: 'Klart "k" följt av kort "a". Ingen kraftig aspiration som i svenska.',
    swedishSimilarSound: 'Som "ka" i "kaka"',
    courseStage: 1,
    exampleWords: [
      { kana: 'かさ', romaji: 'kasa', meaningSv: 'paraply', meaningEn: 'umbrella', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'かわ', romaji: 'kawa', meaningSv: 'flod', meaningEn: 'river', genkiChapter: 'L3', pitchAccent: '②' },
      { kana: 'がくせい', romaji: 'gakusei', meaningSv: 'student', meaningEn: 'student', genkiChapter: 'L1', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'ki',
    kana: 'き',
    romaji: 'ki',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'KA-raden',
    strokeCount: 4,
    strokeSvgData: [
      'M 30 35 Q 50 32 70 35',
      'M 28 48 Q 50 45 72 48',
      'M 55 20 Q 48 55 42 70',
      'M 35 72 C 55 85 65 75 58 65'
    ],
    mnemonic: {
      summary: 'En Kistnyckel (Key) som öppnar ett lås',
      summaryEn: 'An antique Key with notches and a loop',
      storySv: 'Liknar en gammal gammaldags nyckel ("Key" -> Ki) med två räfflor och ett böjt handtag i botten.',
      storyEn: 'An antique Key with two horizontal ridges and a rounded bottom bow.',
      imageVisualDesc: 'Två tvärstreck, ett lutande mittstreck och en separat böjd båge nedtill.',
      keyCue: 'KI som i Nyckel (Key)',
      keyCueEn: 'Ki for Key'
    },
    pronunciationTipSv: 'Som "ki" i "kilo".',
    swedishSimilarSound: 'Som "ki" i "kilo"',
    similarSoundPitfall: 'Förväxla inte med さ (sa)! き har 2 tvärstreck, さ har bara 1.',
    courseStage: 1,
    exampleWords: [
      { kana: 'き', romaji: 'ki', meaningSv: 'träd', meaningEn: 'tree', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'きょう', romaji: 'kyou', meaningSv: 'idag', meaningEn: 'today', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'きく', romaji: 'kiku', meaningSv: 'att lyssna/fråga', meaningEn: 'to listen/hear', genkiChapter: 'L3', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'ku',
    kana: 'く',
    romaji: 'ku',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'KA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 65 25 L 35 50 L 65 78'
    ],
    mnemonic: {
      summary: 'En Kucku-näbb (gökfågel) som öppnar sig: "Ku-cku!"',
      summaryEn: 'A Cuckoo bird beak open wide',
      storySv: 'Det ser ut som en fågelnäbb som ropar "Ku-cku!". Lättaste tecknet med ett enda streck som en < pil.',
      storyEn: 'A single angled stroke like a Cuckoo bird’s sharp beak waiting for food.',
      imageVisualDesc: 'En öppen vinkelform likt en fågelnäbb (<).',
      keyCue: 'KU som i Kucku-fågel',
      keyCueEn: 'Ku for Cuckoo bird'
    },
    pronunciationTipSv: 'Kom ihåg: orundade läppar! Som "koo" fast utan att pluta med munnen.',
    swedishSimilarSound: 'Kort k + neutralt u',
    courseStage: 1,
    exampleWords: [
      { kana: 'くるま', romaji: 'kuruma', meaningSv: 'bil', meaningEn: 'car', genkiChapter: 'L4', pitchAccent: '⓪' },
      { kana: 'くち', romaji: 'kuchi', meaningSv: 'mun', meaningEn: 'mouth', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'くに', romaji: 'kuni', meaningSv: 'land/hemland', meaningEn: 'country', genkiChapter: 'L1', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'ke',
    kana: 'け',
    romaji: 'ke',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'KA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 30 25 Q 30 55 25 80',
      'M 48 38 Q 65 35 78 38',
      'M 65 22 Q 65 55 62 82'
    ],
    mnemonic: {
      summary: 'En Ketchupflaska eller ett Kex på högkant',
      summaryEn: 'A Keg of beer standing on a stand',
      storySv: 'En "Ketchupflaska" med korken och en kniv som breder ut på ett Kex ("Ke").',
      storyEn: 'A wooden Keg of beer on the left with a tap on the right.',
      imageVisualDesc: 'Ett vertikalt vänsterstreck, ett horisontellt tvärstreck och ett böjt högerstreck.',
      keyCue: 'KE som i Kex / Ketchup',
      keyCueEn: 'Ke for Keg'
    },
    pronunciationTipSv: 'Kort "ke" som i "keps".',
    swedishSimilarSound: 'Som "ke" i "keps"',
    similarSoundPitfall: 'Förväxla inte med は (ha) eller に (ni)! け har ett öppet kryss till höger utan ögla.',
    courseStage: 1,
    exampleWords: [
      { kana: 'けさ', romaji: 'kesa', meaningSv: 'i morse', meaningEn: 'this morning', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'けいたいでんわ', romaji: 'keitaidenwa', meaningSv: 'mobiltelefon', meaningEn: 'cell phone', genkiChapter: 'L2', pitchAccent: '⑤' }
    ]
  },
  {
    id: 'ko',
    kana: 'こ',
    romaji: 'ko',
    group: 'gojuon',
    row: 'k',
    rowNameSv: 'KA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 30 35 Q 50 32 70 35 C 72 38 68 44 60 44',
      'M 32 72 Q 52 75 72 70'
    ],
    mnemonic: {
      summary: 'Två Klossar som ligger på varandra',
      summaryEn: 'Two Koi fish swimming in a pond',
      storySv: 'Två träklossar ("Ko" för Klossar) eller en Krokodilmun som stängs.',
      storyEn: 'Two curved horizontal strokes like a pair of Koi fish swimming atop each other.',
      imageVisualDesc: 'Två parallella horisontella bågar.',
      keyCue: 'KO som i Klossar / Krokodil',
      keyCueEn: 'Ko for Koi fish'
    },
    pronunciationTipSv: 'Kort "ko/kå" som i "kock".',
    swedishSimilarSound: 'Som "ko" i "kock"',
    similarSoundPitfall: 'Förväxla inte med い (i) som står vertikalt. こ ligger horisontellt!',
    courseStage: 1,
    exampleWords: [
      { kana: 'これ', romaji: 'kore', meaningSv: 'den här (nära mig)', meaningEn: 'this one', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'ここ', romaji: 'koko', meaningSv: 'här (denna plats)', meaningEn: 'here', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'こんにちは', romaji: 'konnichiwa', meaningSv: 'god dag / hej', meaningEn: 'hello', genkiChapter: 'L0', pitchAccent: '⓪' }
    ]
  },

  // ==========================================
  // SA-RADEN - DEL 1
  // ==========================================
  {
    id: 'sa',
    kana: 'さ',
    romaji: 'sa',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'SA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 30 38 Q 50 35 70 38',
      'M 55 22 Q 48 55 42 70',
      'M 35 72 C 55 85 65 75 58 65'
    ],
    mnemonic: {
      summary: 'En Sadel med en stigbygel',
      summaryEn: 'A Samurai sword slashing through',
      storySv: 'En "Sadel" ("Sa") sedd från sidan med ett fäste och en svängd båge.',
      storyEn: 'A single diagonal slash across a curve like a Samurai drawing his katana.',
      imageVisualDesc: 'Ett tvärstreck, ett lutande streck och en lös båge nedtill.',
      keyCue: 'SA som i Sadel',
      keyCueEn: 'Sa for Samurai'
    },
    pronunciationTipSv: 'Som "sa" i "sax".',
    swedishSimilarSound: 'Som "sa" i "sax"',
    similarSoundPitfall: 'き har två tvärstreck, さ har bara ett! ち är spegelvänt mot さ.',
    courseStage: 1,
    exampleWords: [
      { kana: 'さかな', romaji: 'sakana', meaningSv: 'fisk', meaningEn: 'fish', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'さくら', romaji: 'sakura', meaningSv: 'körsbärsblomma', meaningEn: 'cherry blossom', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'さようなら', romaji: 'sayounara', meaningSv: 'adjö / hejdå', meaningEn: 'goodbye', genkiChapter: 'L0', pitchAccent: '④' }
    ]
  },
  {
    id: 'shi',
    kana: 'し',
    romaji: 'shi',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'SA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 42 20 Q 42 70 48 80 C 58 90 75 80 80 70'
    ],
    mnemonic: {
      summary: 'En fiskekrok som fångar en Sik (eller She/Hennes hår)',
      summaryEn: 'A She-hook / fishing hook in the sea',
      storySv: 'En böjd fiskekrok som man drar upp en "Sik" (Shi) med. Ett enda elegant streck.',
      storyEn: 'A simple J-curve looking like a fishing hook or the flowing long hair of a She.',
      imageVisualDesc: 'Ett vertikalt streck som svänger mjukt uppåt åt höger som en krok (J-form).',
      keyCue: 'SHI som i Sik på en krok',
      keyCueEn: 'Shi for She-hook'
    },
    pronunciationTipSv: 'OBS: Det uttalas "shi" (inte si)! Mjukt som engelskans "she" eller tyskans "sch", tungspetsen nära tandvallen.',
    swedishSimilarSound: 'Mjukt "sje/shi" som i engelska "she"',
    courseStage: 1,
    exampleWords: [
      { kana: 'しんぶん', romaji: 'shinbun', meaningSv: 'tidning', meaningEn: 'newspaper', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'しろい', romaji: 'shiroi', meaningSv: 'vit', meaningEn: 'white', genkiChapter: 'L3', pitchAccent: '②' },
      { kana: 'しつれいします', romaji: 'shitsureishimasu', meaningSv: 'ursäkta mig (artigt uttryck)', meaningEn: 'excuse me', genkiChapter: 'L0', pitchAccent: '④' }
    ]
  },
  {
    id: 'su',
    kana: 'す',
    romaji: 'su',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'SA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 25 35 Q 50 33 75 35',
      'M 52 18 L 52 48 C 52 60 38 62 38 52 C 38 42 55 42 55 60 L 50 85'
    ],
    mnemonic: {
      summary: 'En gunga som gör en Snurr (Loop)',
      summaryEn: 'A Swimmer doing a loop / Pregnant belly',
      storySv: 'Ett rep som snurrar en loop i luften. Tänk på en "Snurr" eller "Supersnurra".',
      storyEn: 'A vertical rope with a spiral loop like a Swimmer spinning in water.',
      imageVisualDesc: 'Ett vågrätt streck och ett lodrätt streck med en ögla i mitten som går rakt ner.',
      keyCue: 'SU som i Snurr',
      keyCueEn: 'Su for Swimmer loop'
    },
    pronunciationTipSv: 'Kort s + orundat u. I slutet av ord (som です desu, ます masu) viskas ofta u:et bort helt ("dess", "mass").',
    swedishSimilarSound: 'Som "s" + neutralt u',
    similarSoundPitfall: 'Förväxla inte med む (mu)! す har öglan på mittlinjen.',
    courseStage: 1,
    exampleWords: [
      { kana: 'すし', romaji: 'sushi', meaningSv: 'sushi', meaningEn: 'sushi', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'すみません', romaji: 'sumimasen', meaningSv: 'ursäkta mig / förlåt (grundfras)', meaningEn: 'excuse me / sorry', genkiChapter: 'L0', pitchAccent: '④' },
      { kana: 'すき', romaji: 'suki', meaningSv: 'att tycka om / gilla', meaningEn: 'liked / fond of', genkiChapter: 'L5', pitchAccent: '②' }
    ]
  },
  {
    id: 'se',
    kana: 'せ',
    romaji: 'se',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'SA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 25 40 Q 50 38 78 40',
      'M 68 25 L 68 60 Q 68 78 50 78',
      'M 42 22 L 42 82'
    ],
    mnemonic: {
      summary: 'Någon som Sitter i en Sessel / Fåtölj och pekar',
      summaryEn: 'A person Saying something on a stage',
      storySv: 'Någon som sitter i en fåtölj och säger "Se här!".',
      storyEn: 'A mouth opening wide or someone Settling into a seat saying something.',
      imageVisualDesc: 'Ett tvärstreck, ett högerstreck som svänger inåt och ett vänster lodrätt streck.',
      keyCue: 'SE som i Se här!',
      keyCueEn: 'Se for Saying / Seat'
    },
    pronunciationTipSv: 'Kort "se" som i svenskans "sett".',
    swedishSimilarSound: 'Som "se" i "senap"',
    courseStage: 1,
    exampleWords: [
      { kana: 'せんせい', romaji: 'sensei', meaningSv: 'lärare / professor', meaningEn: 'teacher / professor', genkiChapter: 'L1', pitchAccent: '③' },
      { kana: 'せんこう', romaji: 'senkou', meaningSv: 'huvudämne / inriktning', meaningEn: 'major (academic)', genkiChapter: 'L1', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'so',
    kana: 'そ',
    romaji: 'so',
    group: 'gojuon',
    row: 's',
    rowNameSv: 'SA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 35 25 L 65 25 L 35 52 L 65 52 C 60 75 40 85 30 75'
    ],
    mnemonic: {
      summary: 'En Sicksackande Söm (Sy en söm)',
      summaryEn: 'A zig-zag Sewing stitch',
      storySv: 'Ett sicksack-mönster som en nål som Syr en söm: Z-form överst och en C-båge underst i ett enda drag.',
      storyEn: 'A smooth Z-curve down like a needle Sewing with continuous thread.',
      imageVisualDesc: 'En Z-form sammanhängande med en rund C-skål nedtill.',
      keyCue: 'SO som i Sy en söm',
      keyCueEn: 'So for Sewing stitch'
    },
    pronunciationTipSv: 'Kort "so/så" som i "socker".',
    swedishSimilarSound: 'Som "so" i "socker"',
    similarSoundPitfall: 'Förväxla inte med て (te) eller を (wo)!',
    courseStage: 1,
    exampleWords: [
      { kana: 'そこ', romaji: 'soko', meaningSv: 'där (nära lyssnaren)', meaningEn: 'there', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'そうです', romaji: 'sou desu', meaningSv: 'det stämmer / just det', meaningEn: 'that is right', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },

  // ==========================================
  // TA-RADEN - DEL 1
  // ==========================================
  {
    id: 'ta',
    kana: 'た',
    romaji: 'ta',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'TA-raden',
    strokeCount: 4,
    strokeSvgData: [
      'M 25 35 Q 45 35 55 35',
      'M 40 20 L 35 80',
      'M 55 45 Q 70 42 78 45',
      'M 52 68 Q 68 70 75 66'
    ],
    mnemonic: {
      summary: 'Bokstaven "t" och "a" skriva tillsammans: t + a = ta',
      summaryEn: 'The letters "t" and "a" combined',
      storySv: 'Till vänster ser du ett "t" och till höger ser du ett litet こ (ko) som bildar "ta"!',
      storyEn: 'Look closely: the left part is a lowercase "t" and the right part is an "a"!',
      imageVisualDesc: 'Ett kors till vänster och två små tvärstreck till höger.',
      keyCue: 'TA som t + a',
      keyCueEn: 'Ta looks like "ta"'
    },
    pronunciationTipSv: 'Kort rent "ta" som i "tack".',
    swedishSimilarSound: 'Som "ta" i "tack"',
    similarSoundPitfall: 'Förväxla inte med な (na) eller に (ni)!',
    courseStage: 1,
    exampleWords: [
      { kana: 'たかい', romaji: 'takai', meaningSv: 'dyr / hög', meaningEn: 'expensive / tall', genkiChapter: 'L2', pitchAccent: '②' },
      { kana: 'たべる', romaji: 'taberu', meaningSv: 'att äta', meaningEn: 'to eat', genkiChapter: 'L3', pitchAccent: '②' }
    ]
  },
  {
    id: 'chi',
    kana: 'ち',
    romaji: 'chi',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'TA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 30 35 Q 55 33 75 35',
      'M 52 20 L 40 55 C 58 45 75 60 65 78 C 52 90 35 82 32 75'
    ],
    mnemonic: {
      summary: 'En Cheerleader med en rund boll / En femma (5:a)',
      summaryEn: 'A Cheerleader doing a jump with pom-poms',
      storySv: 'En "Cheerleader" (Chi) som kastar en boll, eller siffran 5 med ett tvärstreck.',
      storyEn: 'A Cheerleader holding a pom-pom or a face with a cheeky smile.',
      imageVisualDesc: 'Ett horisontellt takstreck och ett streck som böjer sig i en 5-liknande båge.',
      keyCue: 'CHI som i Cheerleader / 5:a',
      keyCueEn: 'Chi for Cheerleader'
    },
    pronunciationTipSv: 'OBS: Uttalas "chi" (inte ti)! Som "tj" i svenska "tjej" eller engelska "cheese".',
    swedishSimilarSound: 'Tje-ljud som i "tjej" eller "cheese"',
    similarSoundPitfall: 'ち är spegelvänt mot さ (sa)! ち svänger åt höger (som 5:a).',
    courseStage: 1,
    exampleWords: [
      { kana: 'ちち', romaji: 'chichi', meaningSv: 'min pappa', meaningEn: 'my father', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'ちず', romaji: 'chizu', meaningSv: 'karta', meaningEn: 'map', genkiChapter: 'L4', pitchAccent: '①' },
      { kana: 'ちいさい', romaji: 'chiisai', meaningSv: 'liten', meaningEn: 'small', genkiChapter: 'L3', pitchAccent: '③' }
    ]
  },
  {
    id: 'tsu',
    kana: 'つ',
    romaji: 'tsu',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'TA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 30 40 C 70 30 85 55 70 78 C 55 92 35 85 30 75'
    ],
    mnemonic: {
      summary: 'En Tsunami-våg som sveper in',
      summaryEn: 'A giant Tsunami wave cresting',
      storySv: 'En jättelik "Tsunami-våg" (Tsu) som kröker sig i vattnet. Ett enda svepande streck.',
      storyEn: 'A single sweeping arc resembling a huge Tsunami wave crashing down.',
      imageVisualDesc: 'En stor svepande båge som liknar en vågkam.',
      keyCue: 'TSU som i Tsunami-våg',
      keyCueEn: 'Tsu for Tsunami wave'
    },
    pronunciationTipSv: 'OBS: "ts"-ljud som i svenskans "katt-s" eller "tsunami". Tryck tungan mot framtänderna och släpp fram ett s.',
    swedishSimilarSound: 'Som ts i "katt-sand" eller "tsunami"',
    similarSoundPitfall: 'Detta tecken används också i litet format (っ) som dubbelkonsonant (Sokuon)!',
    courseStage: 1,
    exampleWords: [
      { kana: 'つき', romaji: 'tsuki', meaningSv: 'måne / månad', meaningEn: 'moon / month', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'つくえ', romaji: 'tsukue', meaningSv: 'skrivbord', meaningEn: 'desk', genkiChapter: 'L2', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'te',
    kana: 'て',
    romaji: 'te',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'TA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 30 35 L 68 35 C 55 55 42 70 65 82'
    ],
    mnemonic: {
      summary: 'En Te-kopp med handtag eller en hund som ber med Tassen',
      summaryEn: 'A broken Tennis racket or the letter "T"',
      storySv: 'Ett "T" som böjer sig mjukt som handtaget på en kopp "Te" (Te).',
      storyEn: 'A horizontal bar curving down like a Tennis racket or dog tail.',
      imageVisualDesc: 'Ett vågrätt takstreck som mjukt svänger ner i en rund båge.',
      keyCue: 'TE som i Kopp med Te',
      keyCueEn: 'Te for Tennis racket'
    },
    pronunciationTipSv: 'Kort "te" som i "test".',
    swedishSimilarSound: 'Som "te" i "test"',
    courseStage: 1,
    exampleWords: [
      { kana: 'て', romaji: 'te', meaningSv: 'hand', meaningEn: 'hand', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'てがみ', romaji: 'tegami', meaningSv: 'brev', meaningEn: 'letter', genkiChapter: 'L4', pitchAccent: '⓪' },
      { kana: 'てんき', romaji: 'tenki', meaningSv: 'väder', meaningEn: 'weather', genkiChapter: 'L4', pitchAccent: '①' }
    ]
  },
  {
    id: 'to',
    kana: 'と',
    romaji: 'to',
    group: 'gojuon',
    row: 't',
    rowNameSv: 'TA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 42 22 L 42 50',
      'M 38 45 C 70 45 75 75 50 82 C 42 85 38 80 38 75'
    ],
    mnemonic: {
      summary: 'En Tagg i en Tå (Toe)',
      summaryEn: 'A big Toe with a Thorn in it',
      storySv: 'En sticka eller spik som sticker rakt in i en "Tå" (To).',
      storyEn: 'A vertical toe with a sharp Thorn or splinter poking right into it.',
      imageVisualDesc: 'Ett litet vertikalt streck och en stor C-båge som möter det.',
      keyCue: 'TO som i Tagg i en Tå',
      keyCueEn: 'To for Thorn in Toe'
    },
    pronunciationTipSv: 'Kort "to/tå" som i "tomte".',
    swedishSimilarSound: 'Som "to" i "tomte"',
    courseStage: 1,
    exampleWords: [
      { kana: 'ともだち', romaji: 'tomodachi', meaningSv: 'vän / kompis', meaningEn: 'friend', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'とけい', romaji: 'tokei', meaningSv: 'klocka / ur', meaningEn: 'watch / clock', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'としょかん', romaji: 'toshokan', meaningSv: 'bibliotek', meaningEn: 'library', genkiChapter: 'L2', pitchAccent: '②' }
    ]
  },

  // ==========================================
  // NA-RADEN - DEL 1
  // ==========================================
  {
    id: 'na',
    kana: 'な',
    romaji: 'na',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'NA-raden',
    strokeCount: 4,
    strokeSvgData: [
      'M 25 35 Q 45 35 55 35',
      'M 38 20 L 32 75',
      'M 68 30 Q 75 38 72 45',
      'M 65 52 L 65 72 C 65 82 52 82 52 75 C 52 68 68 68 68 80'
    ],
    mnemonic: {
      summary: 'En Nunna som ber vid ett kors',
      summaryEn: 'A Nun praying in front of a cross',
      storySv: 'Ett kors till vänster och en "Nunna" (Na) som knäböjer och ber till höger.',
      storyEn: 'A cross on the left and a kneeling Nun praying on the right.',
      imageVisualDesc: 'Kors till vänster, en prick och en ögla till höger.',
      keyCue: 'NA som i Nunna',
      keyCueEn: 'Na for praying Nun'
    },
    pronunciationTipSv: 'Kort rent "na" som i "natt".',
    swedishSimilarSound: 'Som "na" i "natt"',
    courseStage: 1,
    exampleWords: [
      { kana: 'なまえ', romaji: 'namae', meaningSv: 'namn', meaningEn: 'name', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'なに', romaji: 'nani', meaningSv: 'vad?', meaningEn: 'what?', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'なつ', romaji: 'natsu', meaningSv: 'sommar', meaningEn: 'summer', genkiChapter: 'L4', pitchAccent: '②' }
    ]
  },
  {
    id: 'ni',
    kana: 'に',
    romaji: 'ni',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'NA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 30 25 Q 30 55 25 80',
      'M 52 40 Q 70 38 78 40',
      'M 50 68 Q 68 70 78 66'
    ],
    mnemonic: {
      summary: 'En Nål och två trådar (eller siffran 2 = Ni)',
      summaryEn: 'A Needle and two threads / Knee',
      storySv: 'En "Nål" till vänster och två vågräta stygn. På japanska betyder "ni" också 2!',
      storyEn: 'A vertical needle on the left with two horizontal threads on the right.',
      imageVisualDesc: 'Ett lodrätt streck till vänster och två vågräta streck till höger (= こ ko).',
      keyCue: 'NI som i Nål / Siffran 2 (ni)',
      keyCueEn: 'Ni for Needle / Knee'
    },
    pronunciationTipSv: 'Kort "ni" som i "nitton".',
    swedishSimilarSound: 'Som "ni" i "nitton"',
    similarSoundPitfall: 'Förväxla inte med こ (ko) eller た (ta)!',
    courseStage: 1,
    exampleWords: [
      { kana: 'にほん', romaji: 'nihon', meaningSv: 'Japan', meaningEn: 'Japan', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'にほんご', romaji: 'nihongo', meaningSv: 'japanska språket', meaningEn: 'Japanese language', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'にく', romaji: 'niku', meaningSv: 'kött', meaningEn: 'meat', genkiChapter: 'L2', pitchAccent: '②' }
    ]
  },
  {
    id: 'nu',
    kana: 'ぬ',
    romaji: 'nu',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'NA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 35 25 L 50 78',
      'M 42 35 C 75 42 75 80 50 80 C 35 80 30 50 48 45 C 65 42 78 65 72 82 C 70 88 80 88 82 80'
    ],
    mnemonic: {
      summary: 'Nudlar på ätpinnar med en liten ögla på slutet',
      summaryEn: 'Chopsticks grabbing Noodles with a loop',
      storySv: 'Någon som snurrar "Nudlar" (Nu) runt ätpinnar och avslutar med en liten rund ögla längst ut på svansen.',
      storyEn: 'Two crossed chopsticks lifting a tangled bowl of Noodles with a little loop.',
      imageVisualDesc: 'Korsande böjda linjer med en liten extra snurrögla i nedre högra hörnet.',
      keyCue: 'NU som i Nudlar med ögla',
      keyCueEn: 'Nu for Noodles'
    },
    pronunciationTipSv: 'Kort n + orundat u.',
    swedishSimilarSound: 'Som "nu" med neutral vokal',
    similarSoundPitfall: 'Förväxla inte med め (me)! ぬ har en ögla på svansen, め har det inte.',
    courseStage: 1,
    exampleWords: [
      { kana: 'いぬ', romaji: 'inu', meaningSv: 'hund', meaningEn: 'dog', genkiChapter: 'L2', pitchAccent: '②' },
      { kana: 'ぬいぐるみ', romaji: 'nuigurumi', meaningSv: 'gosedjur', meaningEn: 'stuffed toy', genkiChapter: 'L4', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'ne',
    kana: 'ね',
    romaji: 'ne',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'NA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 32 20 L 32 82',
      'M 25 40 L 68 35 L 40 70 C 65 55 78 72 70 82 C 65 88 78 88 80 80'
    ],
    mnemonic: {
      summary: 'En Katt (Neko) med en knorr på svansen',
      summaryEn: 'A Neko (Cat) with a curled tail',
      storySv: 'En kattunge ("Neko" -> Ne) som sitter vid en stolpe och har en liten lockig knorr på svansen.',
      storyEn: 'A cat climbing a post with its tail curled into a neat loop at the end.',
      imageVisualDesc: 'Lodrät stolpe till vänster och en sicksacklinje som avslutas med en snurrögla.',
      keyCue: 'NE som i Neko (Katt)',
      keyCueEn: 'Ne for Neko (Cat)'
    },
    pronunciationTipSv: 'Kort "ne" som i "nej". Används också i slutet av meningar som "eller hur?" (ね).',
    swedishSimilarSound: 'Som "ne" i "nej"',
    similarSoundPitfall: 'Förväxla inte med わ (wa) eller れ (re)! ね har en ögla på svansen.',
    courseStage: 1,
    exampleWords: [
      { kana: 'ねこ', romaji: 'neko', meaningSv: 'katt', meaningEn: 'cat', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ねる', romaji: 'neru', meaningSv: 'att sova / gå och lägga sig', meaningEn: 'to sleep', genkiChapter: 'L3', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'no',
    kana: 'の',
    romaji: 'no',
    group: 'gojuon',
    row: 'n',
    rowNameSv: 'NA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 55 25 L 35 65 C 28 80 45 88 62 82 C 78 72 75 42 55 42 C 42 42 35 55 35 65'
    ],
    mnemonic: {
      summary: 'En "NO ENTRY" förbudsskylt eller en Noshörnings horn',
      summaryEn: 'A "NO" sign / spiral loop',
      storySv: 'Ett runt "NO"-förbudsmärke med ett snedstreck, eller ett Noshörningshorn i en spiral. Ett mjukt streck.',
      storyEn: 'A simple circular curve like a "NO Entry" sign or a pig nose.',
      imageVisualDesc: 'En elegant spiralformad cirkel med ingång från mitten.',
      keyCue: 'NO som i Noshörning / No Entry',
      keyCueEn: 'No for NO sign'
    },
    pronunciationTipSv: 'Kort "no/nå" som i "noll". Japanskans viktigaste genitivpartikel (X no Y = X:s Y).',
    swedishSimilarSound: 'Som "no" i "noll"',
    courseStage: 1,
    exampleWords: [
      { kana: 'のむ', romaji: 'nomu', meaningSv: 'att dricka', meaningEn: 'to drink', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'ノート', romaji: 'nooto', meaningSv: 'anteckningsblock', meaningEn: 'notebook', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },

  // ==========================================
  // HA-RADEN - DEL 2
  // ==========================================
  {
    id: 'ha',
    kana: 'は',
    romaji: 'ha',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'HA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 28 22 Q 28 55 24 82',
      'M 45 42 Q 65 40 75 42',
      'M 62 25 L 62 65 C 62 78 50 78 50 70 C 50 62 68 62 68 75'
    ],
    mnemonic: {
      summary: 'En Hare som hoppar vid ett träd',
      summaryEn: 'A Hockey stick and puck with a hoop / "Ha" laugh',
      storySv: 'Stolpe till vänster och en "Hare" (Ha) som sitter på bakbenen med en rund mage till höger.',
      storyEn: 'A vertical hockey stick with a rounded loop at the base.',
      imageVisualDesc: 'Stolpe till vänster, tvärstreck och en ögla till höger.',
      keyCue: 'HA som i Hare',
      keyCueEn: 'Ha for Hockey stick'
    },
    pronunciationTipSv: 'Kort "ha". OBS! När は fungerar som ämnespartikel i meningar (t.ex. わたしは watashi wa) uttalas det "WA"!',
    swedishSimilarSound: 'Som "ha" i "hatt" (eller "wa" som partikel)',
    similarSoundPitfall: 'Förväxla inte med ほ (ho) som har ett takstreck, eller け (ke) som inte har ögla.',
    courseStage: 2,
    exampleWords: [
      { kana: 'はい', romaji: 'hai', meaningSv: 'ja', meaningEn: 'yes', genkiChapter: 'L0', pitchAccent: '①' },
      { kana: 'はじめまして', romaji: 'hajimemashite', meaningSv: 'trevligt att träffas (första mötet)', meaningEn: 'nice to meet you', genkiChapter: 'L1', pitchAccent: '④' },
      { kana: 'はな', romaji: 'hana', meaningSv: 'blomma / näsa', meaningEn: 'flower / nose', genkiChapter: 'L2', pitchAccent: '②' }
    ]
  },
  {
    id: 'hi',
    kana: 'ひ',
    romaji: 'hi',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'HA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 25 35 L 42 35 C 32 60 38 80 50 82 C 65 82 72 60 62 35 L 78 35'
    ],
    mnemonic: {
      summary: 'Någon som skrattar "Hi-hi-hi!" med ett stort leende',
      summaryEn: 'A smiling mouth laughing "Hee hee!"',
      storySv: 'En stor glad mun som skrattar "Hi-hi-hi!". Ett enda sammanhängande U-format leende.',
      storyEn: 'A wide smiling U-shape with a nose saying "Hee-hee!".',
      imageVisualDesc: 'En bred U-formad båge med två vingar på sidorna.',
      keyCue: 'HI som i Hi-hi-hi!',
      keyCueEn: 'Hi for "Hee-hee" smile'
    },
    pronunciationTipSv: 'Kort "hi". Blås lite luft mellan tungan och gommen (likt tyska "ich").',
    swedishSimilarSound: 'Som "hi" i "hink"',
    courseStage: 2,
    exampleWords: [
      { kana: 'ひと', romaji: 'hito', meaningSv: 'person / människa', meaningEn: 'person', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'ひる', romaji: 'hiru', meaningSv: 'dagtid / lunchtid', meaningEn: 'noon / daytime', genkiChapter: 'L3', pitchAccent: '②' },
      { kana: 'ひだり', romaji: 'hidari', meaningSv: 'vänster (riktning)', meaningEn: 'left', genkiChapter: 'L4', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'fu',
    kana: 'ふ',
    romaji: 'fu',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'HA-raden',
    strokeCount: 4,
    strokeSvgData: [
      'M 50 20 Q 55 25 50 32',
      'M 50 40 Q 52 65 42 80',
      'M 30 52 Q 25 60 28 68',
      'M 72 52 Q 78 60 75 68'
    ],
    mnemonic: {
      summary: 'Mount Fuji med två snömoln på sidorna',
      summaryEn: 'Mount Fuji / Hula dancer in motion',
      storySv: 'Det majestätiska berget Mount "Fuji" (Fu) med toppen och två snömoln som blåser på sidorna.',
      storyEn: 'The central nose and side droplets resemble Mt. Fuji or a floating dancer.',
      imageVisualDesc: 'Topp-prick, en mittbåge som en bergskam och två sidoprickar.',
      keyCue: 'FU som i Mount Fuji',
      keyCueEn: 'Fu for Mount Fuji'
    },
    pronunciationTipSv: 'OBS: Inte svenskt "f" med tänderna mot underläppen! Blås mjukt mellan båda läpparna (bilabialt frikativum) som när du blåser ut ett ljus.',
    swedishSimilarSound: 'Mjukt blåsande F/H mellan läpparna',
    courseStage: 2,
    exampleWords: [
      { kana: 'ふゆ', romaji: 'fuyu', meaningSv: 'vinter', meaningEn: 'winter', genkiChapter: 'L4', pitchAccent: '②' },
      { kana: 'ふるい', romaji: 'furui', meaningSv: 'gammal (om saker)', meaningEn: 'old', genkiChapter: 'L3', pitchAccent: '②' },
      { kana: 'ふじさん', romaji: 'fujisan', meaningSv: 'Berget Fuji', meaningEn: 'Mt Fuji', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },
  {
    id: 'he',
    kana: 'へ',
    romaji: 'he',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'HA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 25 60 L 48 35 L 80 65'
    ],
    mnemonic: {
      summary: 'En Hjälm eller Höjd (bergskulle)',
      summaryEn: 'A Hill or Helmet peak pointing up',
      storySv: 'En spetsig "Hjälm" eller "Höjd" (He). Ett enda uppåt- och nedåtstreck.',
      storyEn: 'A simple chevron shaped like the peak of a steep Hill or Mount Everest.',
      imageVisualDesc: 'Ett tak / vinkel ^ som går uppåt vänster och längre ner åt höger.',
      keyCue: 'HE som i Hjälm / Höjd',
      keyCueEn: 'He for Hill'
    },
    pronunciationTipSv: 'Kort "he". OBS! Som riktningspartikel ("till/mot") uttalas へ som "E"!',
    swedishSimilarSound: 'Som "he" i "hej" (eller "e" som partikel)',
    courseStage: 2,
    exampleWords: [
      { kana: 'へや', romaji: 'heya', meaningSv: 'rum', meaningEn: 'room', genkiChapter: 'L2', pitchAccent: '②' },
      { kana: 'へた', romaji: 'heta', meaningSv: 'dålig på / oskicklig', meaningEn: 'unskillful', genkiChapter: 'L5', pitchAccent: '②' }
    ]
  },
  {
    id: 'ho',
    kana: 'ほ',
    romaji: 'ho',
    group: 'gojuon',
    row: 'h',
    rowNameSv: 'HA-raden',
    strokeCount: 4,
    strokeSvgData: [
      'M 28 22 Q 28 55 24 82',
      'M 45 32 Q 68 30 78 32',
      'M 48 50 Q 65 48 75 50',
      'M 62 25 L 62 65 C 62 78 50 78 50 70 C 50 62 68 62 68 75'
    ],
    mnemonic: {
      summary: 'En person med en Hatt (Hat) som ropar "Ho-ho!"',
      summaryEn: 'Santa saying "Ho Ho Ho" with a hat',
      storySv: 'Precis som は (ha), men med en extra Hatt (övre tvärstreck). "Ho" för Ho-ho och Hatt!',
      storyEn: 'Similar to は (ha), but wearing a hat on top! Santa wearing a hat saying "Ho ho ho!".',
      imageVisualDesc: 'Vänsterstolpe, två tvärstreck och en ögla nedtill höger.',
      keyCue: 'HO som i person med Hatt',
      keyCueEn: 'Ho for Ho-ho-ho Santa'
    },
    pronunciationTipSv: 'Kort "ho/hå" som i "hopp".',
    swedishSimilarSound: 'Som "ho" i "hopp"',
    similarSoundPitfall: 'は har 1 tvärstreck, ほ har 2 (med tak)! Se upp för ぼ (bo) och ぽ (po).',
    courseStage: 2,
    exampleWords: [
      { kana: 'ほん', romaji: 'hon', meaningSv: 'bok', meaningEn: 'book', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'ほんとう', romaji: 'hontou', meaningSv: 'sanning / verkligen', meaningEn: 'truth / really', genkiChapter: 'L3', pitchAccent: '⓪' }
    ]
  },

  // ==========================================
  // MA-RADEN - DEL 2
  // ==========================================
  {
    id: 'ma',
    kana: 'ま',
    romaji: 'ma',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'MA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 28 35 Q 50 33 72 35',
      'M 30 50 Q 50 48 70 50',
      'M 52 20 L 52 65 C 52 78 38 78 38 70 C 38 62 58 62 58 75'
    ],
    mnemonic: {
      summary: 'En Mamma med två hårspännen och en knut i nacken',
      summaryEn: 'A Mast on a ship / Mama face with earrings',
      storySv: 'En "Mamma" (Ma) med två fina hårspännen och en lockig hårknut nedtill.',
      storyEn: 'Two horizontal lines crossing a mast with a loop at the bottom.',
      imageVisualDesc: 'Två horisontella streck och en vertikal linje med en ögla.',
      keyCue: 'MA som i Mamma',
      keyCueEn: 'Ma for Mast / Mama'
    },
    pronunciationTipSv: 'Kort rent "ma" som i "mat".',
    swedishSimilarSound: 'Som "ma" i "mat"',
    similarSoundPitfall: 'Förväxla inte med ほ (ho) eller も (mo)! ま har ingen vänsterstolpe.',
    courseStage: 2,
    exampleWords: [
      { kana: 'まち', romaji: 'machi', meaningSv: 'stad', meaningEn: 'town / city', genkiChapter: 'L4', pitchAccent: '②' },
      { kana: 'まいにち', romaji: 'mainichi', meaningSv: 'varje dag', meaningEn: 'every day', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'まえ', romaji: 'mae', meaningSv: 'framför / före', meaningEn: 'front / before', genkiChapter: 'L4', pitchAccent: '①' }
    ]
  },
  {
    id: 'mi',
    kana: 'み',
    romaji: 'mi',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'MA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 30 35 L 68 35 L 35 65 C 45 80 65 80 75 75',
      'M 68 50 Q 58 75 52 85'
    ],
    mnemonic: {
      summary: 'Noten "Mi" (Do-Re-Mi) eller en 21:a',
      summaryEn: 'Music note (looks like 21) / "Me" singing',
      storySv: 'Ser ut som siffran "21" sammanflätad, eller den musikaliska tonen "Mi".',
      storyEn: 'Looks like the number 21 or a fluid musical note with an accent stroke.',
      imageVisualDesc: 'En 2-liknande form med en ögla och ett genomskärande streck till höger.',
      keyCue: 'MI som i Do-Re-Mi',
      keyCueEn: 'Mi for Musical note'
    },
    pronunciationTipSv: 'Kort "mi" som i "minut".',
    swedishSimilarSound: 'Som "mi" i "minut"',
    courseStage: 2,
    exampleWords: [
      { kana: 'みず', romaji: 'mizu', meaningSv: 'vatten', meaningEn: 'water', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'みぎ', romaji: 'migi', meaningSv: 'höger (riktning)', meaningEn: 'right', genkiChapter: 'L4', pitchAccent: '⓪' },
      { kana: 'みる', romaji: 'miru', meaningSv: 'att se / titta', meaningEn: 'to see / watch', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'mu',
    kana: 'む',
    romaji: 'mu',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'MA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 28 38 Q 48 35 60 38',
      'M 42 22 L 42 55 C 42 68 30 68 30 58 C 30 48 55 52 65 65 C 75 75 78 85 75 88',
      'M 75 32 Q 80 38 78 45'
    ],
    mnemonic: {
      summary: 'En Ko som säger "Muu!" med en fluga på nosen',
      summaryEn: 'A Cow saying "Moo" with horns',
      storySv: 'En ko med stor nos ("Muu!") och en liten fluga (pricken) som surrar bredvid örat.',
      storyEn: 'A stylized cow face with horns and an extra dot for the cow saying "Moooo".',
      imageVisualDesc: 'Horisontellt streck, vertikal linje med bottenögla och en prick uppe till höger.',
      keyCue: 'MU som i Ko som säger Muu',
      keyCueEn: 'Mu for Mooing Cow'
    },
    pronunciationTipSv: 'Kort m + orundat u.',
    swedishSimilarSound: 'M + neutralt u',
    similarSoundPitfall: 'Förväxla inte med す (su)! む har en krok uppåt och en separat prick.',
    courseStage: 2,
    exampleWords: [
      { kana: 'むずかしい', romaji: 'muzukashii', meaningSv: 'svår (om grammatik/prov)', meaningEn: 'difficult', genkiChapter: 'L5', pitchAccent: '④' },
      { kana: 'むし', romaji: 'mushi', meaningSv: 'insekt', meaningEn: 'insect', genkiChapter: 'L4', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'me',
    kana: 'め',
    romaji: 'me',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'MA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 35 25 L 50 78',
      'M 42 35 C 75 42 75 80 50 80 C 35 80 30 50 48 45 C 65 42 75 60 78 78'
    ],
    mnemonic: {
      summary: 'Ett öga (på japanska: Me = 目) eller en Melon utan ögla',
      summaryEn: 'A bowl of Noodles without a loop / "Me" (Eye)',
      storySv: 'Ett öga med ögonfransar. På japanska heter öga "me"! Notera: ingen ögla som i ぬ (nu).',
      storyEn: 'Like ぬ (nu), but clean without the loop at the end. "Me" means eye in Japanese!',
      imageVisualDesc: 'Likt ぬ men svansen slutar öppet utan knorr.',
      keyCue: 'ME som i ett öga (Me)',
      keyCueEn: 'Me for Noodles / Eye'
    },
    pronunciationTipSv: 'Kort "me" som i "melon".',
    swedishSimilarSound: 'Som "me" i "melon"',
    similarSoundPitfall: 'ぬ har en ögla, め har INGEN ögla! Se upp för あ och ぬ.',
    courseStage: 2,
    exampleWords: [
      { kana: 'め', romaji: 'me', meaningSv: 'öga', meaningEn: 'eye', genkiChapter: 'L1', pitchAccent: '①' },
      { kana: 'めがね', romaji: 'megane', meaningSv: 'glasögon', meaningEn: 'glasses', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'mo',
    kana: 'も',
    romaji: 'mo',
    group: 'gojuon',
    row: 'm',
    rowNameSv: 'MA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 48 20 L 48 70 C 48 85 68 85 75 75',
      'M 30 40 Q 50 38 68 40',
      'M 28 55 Q 50 52 70 55'
    ],
    mnemonic: {
      summary: 'En fiskekrok med More (mer) maskar på',
      summaryEn: 'A Fishhook with worms catching More fish',
      storySv: 'Som し (shi/krok), fast med två maskar fastsatta som tvärstreck. "Mo" för More worms!',
      storyEn: 'A big fishhook with two worms skewered across it to catch More fish.',
      imageVisualDesc: 'En vertikal krok med två tvärstreck genom mitten.',
      keyCue: 'MO som i More maskar på kroken',
      keyCueEn: 'Mo for More fish'
    },
    pronunciationTipSv: 'Kort "mo/må" som i "mossa". Partikeln も betyder "också/även"!',
    swedishSimilarSound: 'Som "mo" i "mossa"',
    courseStage: 2,
    exampleWords: [
      { kana: 'もくようび', romaji: 'mokuyoubi', meaningSv: 'torsdag', meaningEn: 'Thursday', genkiChapter: 'L1', pitchAccent: '③' },
      { kana: 'もの', romaji: 'mono', meaningSv: 'sak / ting', meaningEn: 'thing', genkiChapter: 'L2', pitchAccent: '②' },
      { kana: 'もしもし', romaji: 'moshimoshi', meaningSv: 'hallå (i telefon)', meaningEn: 'hello (on phone)', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },

  // ==========================================
  // YA-RADEN - DEL 2
  // ==========================================
  {
    id: 'ya',
    kana: 'や',
    romaji: 'ya',
    group: 'gojuon',
    row: 'y',
    rowNameSv: 'YA-raden',
    strokeCount: 3,
    strokeSvgData: [
      'M 30 42 C 45 28 65 30 65 48 C 65 65 52 75 42 75',
      'M 68 28 Q 72 35 70 40',
      'M 42 22 L 52 82'
    ],
    mnemonic: {
      summary: 'En Yak-oxe med horn',
      summaryEn: 'A Yak with horns and a tail',
      storySv: 'Huvudet på en långhårig "Yak-oxe" (Ya) med horn och en panna.',
      storyEn: 'The body of a Yak with an upright horn and a back tail.',
      imageVisualDesc: 'En rund båge med ett litet hornstreck och ett långt tvärstreck.',
      keyCue: 'YA som i Yak-oxe',
      keyCueEn: 'Ya for Yak'
    },
    pronunciationTipSv: 'Kort "ja" som i "jag".',
    swedishSimilarSound: 'Som "ja" i "jacka"',
    courseStage: 2,
    exampleWords: [
      { kana: 'やま', romaji: 'yama', meaningSv: 'berg', meaningEn: 'mountain', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'やすみ', romaji: 'yasumi', meaningSv: 'vila / lov / helg', meaningEn: 'rest / holiday', genkiChapter: 'L3', pitchAccent: '③' },
      { kana: 'やさい', romaji: 'yasai', meaningSv: 'grönsaker', meaningEn: 'vegetables', genkiChapter: 'L2', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'yu',
    kana: 'ゆ',
    romaji: 'yu',
    group: 'gojuon',
    row: 'y',
    rowNameSv: 'YA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 35 30 L 35 60 C 35 78 55 78 68 65 C 75 58 72 45 60 45 C 45 45 35 55 35 65',
      'M 58 20 L 58 82'
    ],
    mnemonic: {
      summary: 'En fisk som simmar (eller en person i badet: Yu = varmt bad)',
      summaryEn: 'A swimming Fish / You in a pool (looks like 102)',
      storySv: 'En fisk som simmar uppåt och genomskärs av en linje, eller formen på en You-turn (U-sväng).',
      storyEn: 'A graceful fish swimming or the numbers 102 shaped into a dolphin.',
      imageVisualDesc: 'En stor ögla med en vertikal genomskärande linje.',
      keyCue: 'YU som i You-turn / Varmt bad',
      keyCueEn: 'Yu for You swimming'
    },
    pronunciationTipSv: 'Kort "jo/ju" med orundat u.',
    swedishSimilarSound: 'Som j + neutralt u',
    courseStage: 2,
    exampleWords: [
      { kana: 'ゆき', romaji: 'yuki', meaningSv: 'snö', meaningEn: 'snow', genkiChapter: 'L4', pitchAccent: '②' },
      { kana: 'ゆうめい', romaji: 'yuumei', meaningSv: 'berömd / känd', meaningEn: 'famous', genkiChapter: 'L5', pitchAccent: '⓪' },
      { kana: 'ゆうびんきょく', romaji: 'yuubinkyoku', meaningSv: 'postkontor', meaningEn: 'post office', genkiChapter: 'L2', pitchAccent: '③' }
    ]
  },
  {
    id: 'yo',
    kana: 'よ',
    romaji: 'yo',
    group: 'gojuon',
    row: 'y',
    rowNameSv: 'YA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 30 38 Q 48 38 60 38',
      'M 55 20 L 55 65 C 55 78 38 78 38 70 C 38 62 58 62 58 75'
    ],
    mnemonic: {
      summary: 'En Jojo (Yo-yo) som snurrar på ett snöre',
      summaryEn: 'A Yo-yo dangling from a finger',
      storySv: 'En person som leker med en "Jojo" (Yo-yo) och snurrar öglan i luften.',
      storyEn: 'A finger holding a string with a round Yo-yo at the bottom.',
      imageVisualDesc: 'Ett kort horisontellt streck och ett lodrätt streck med en vänsterögla.',
      keyCue: 'YO som i Jojo (Yo-yo)',
      keyCueEn: 'Yo for Yo-yo'
    },
    pronunciationTipSv: 'Kort "jå/jo" som i "jogg". Används som partikel i slutet av meningar (よ) för att ge ny information!',
    swedishSimilarSound: 'Som "jo" i "jogg"',
    similarSoundPitfall: 'Förväxla inte med ま (ma) eller は (ha)! よ har bara ett kort tvärstreck som inte sticker ut till höger.',
    courseStage: 2,
    exampleWords: [
      { kana: 'よる', romaji: 'yoru', meaningSv: 'kväll / natt', meaningEn: 'night', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'よく', romaji: 'yoku', meaningSv: 'ofta / väl', meaningEn: 'often / well', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'よろしく', romaji: 'yoroshiku', meaningSv: 'trevligt att lära känna dig', meaningEn: 'pleased to meet you', genkiChapter: 'L0', pitchAccent: '②' }
    ]
  },

  // ==========================================
  // RA-RADEN - DEL 2
  // ==========================================
  {
    id: 'ra',
    kana: 'ら',
    romaji: 'ra',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'RA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 42 22 Q 52 24 55 30',
      'M 40 40 L 40 55 C 55 45 75 55 68 75 C 60 88 40 85 35 78'
    ],
    mnemonic: {
      summary: 'En Rappe (hare) eller en Ruggig 5:a',
      summaryEn: 'A Rabbit sitting upright / Rapper with cap',
      storySv: 'Ser ut som ett litet tak och en öppen mage, som en Rap-artist med keps.',
      storyEn: 'A rabbit sitting up on its hind legs or a rapper wearing a backwards cap.',
      imageVisualDesc: 'En topp-prick och ett vinklat streck med en rund mage.',
      keyCue: 'RA som i Rappe',
      keyCueEn: 'Ra for Rabbit / Rapper'
    },
    pronunciationTipSv: 'VIKTIGT: Japanskt "R" är INTE svenskt rullande R eller skorrande R! Det är ett snabbt "klaffljud" (alveolar tap) där tungspetsen nuddar tandvallen en millisekund, som ett mellanting mellan D och L.',
    swedishSimilarSound: 'Mellanting mellan svenskt D och L',
    similarSoundPitfall: 'Förväxla inte med う (u) eller ち (chi)!',
    courseStage: 2,
    exampleWords: [
      { kana: 'らいしゅう', romaji: 'raishuu', meaningSv: 'nästa vecka', meaningEn: 'next week', genkiChapter: 'L3', pitchAccent: '⓪' },
      { kana: 'ラジオ', romaji: 'rajio', meaningSv: 'radio', meaningEn: 'radio', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'ri',
    kana: 'り',
    romaji: 'ri',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'RA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 35 28 L 35 55',
      'M 65 22 Q 65 65 52 82'
    ],
    mnemonic: {
      summary: 'Ett Rinnande Ris-fält med två strån',
      summaryEn: 'A River with two flowing streams',
      storySv: 'Två strån i ett "Ris-fält" (Ri) där det högra strået böjer sig långt ner i vinden.',
      storyEn: 'Two vertical riverbanks with a longer right stream flowing downwards.',
      imageVisualDesc: 'Kort vänsterstreck och ett långt elegant böjt högerstreck.',
      keyCue: 'RI som i Ris-fält',
      keyCueEn: 'Ri for River'
    },
    pronunciationTipSv: 'Lätt tungspetsstöt + kort i.',
    swedishSimilarSound: 'Kort L/R-stöt + i',
    similarSoundPitfall: 'I い (i) är vänstra strecket längst. I り (ri) är högra strecket längst och sveper ner!',
    courseStage: 2,
    exampleWords: [
      { kana: 'りんご', romaji: 'ringo', meaningSv: 'äpple', meaningEn: 'apple', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'りゅうがくせい', romaji: 'ryuugakusei', meaningSv: 'utbytesstudent', meaningEn: 'international student', genkiChapter: 'L1', pitchAccent: '④' }
    ]
  },
  {
    id: 'ru',
    kana: 'る',
    romaji: 'ru',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'RA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 32 28 L 68 28 L 38 58 C 65 48 78 68 68 80 C 62 88 52 88 52 80 C 52 72 65 72 65 80'
    ],
    mnemonic: {
      summary: 'En Rullande kula med en Rulle/Loop i slutet',
      summaryEn: 'A Ruby held in a loop / Road with a loop',
      storySv: 'Som en 3:a som Rullar runt och knyter en liten ögla på slutet. "Ru" för Rulle!',
      storyEn: 'A winding road with a circular loop holding a precious Ruby at the end.',
      imageVisualDesc: 'En 3-liknande form som avslutas med en rund ögla längst ner.',
      keyCue: 'RU som i Rullande ögla',
      keyCueEn: 'Ru for Ruby in a loop'
    },
    pronunciationTipSv: 'Lätt tungspetsstöt + orundat u.',
    swedishSimilarSound: 'L/R-stöt + neutralt u',
    similarSoundPitfall: 'Jämför med ろ (ro)! る har en ögla, ろ är helt öppen.',
    courseStage: 2,
    exampleWords: [
      { kana: 'くるま', romaji: 'kuruma', meaningSv: 'bil', meaningEn: 'car', genkiChapter: 'L4', pitchAccent: '⓪' },
      { kana: 'ひる', romaji: 'hiru', meaningSv: 'dagtid / lunch', meaningEn: 'noon', genkiChapter: 'L3', pitchAccent: '②' }
    ]
  },
  {
    id: 're',
    kana: 'れ',
    romaji: 're',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'RA-raden',
    strokeCount: 2,
    strokeSvgData: [
      'M 32 20 L 32 82',
      'M 25 40 L 68 35 L 40 70 C 60 55 68 70 78 82'
    ],
    mnemonic: {
      summary: 'En Ren som sparkar bakut med benet',
      summaryEn: 'A person Resting against a tree',
      storySv: 'En "Ren" (Re) som står vid ett träd och sparkar bakåt med bakbenet.',
      storyEn: 'A person leaning back resting their legs and feet outward.',
      imageVisualDesc: 'Stolpe till vänster och en sicksacklinje som sparkar rakt ut till höger utan ögla.',
      keyCue: 'RE som i Ren som sparkar',
      keyCueEn: 'Re for Resting'
    },
    pronunciationTipSv: 'Lätt tungspetsstöt + kort e.',
    swedishSimilarSound: 'L/R-stöt + e',
    similarSoundPitfall: 'Skillnad mot ね (ne) och わ (wa): れ svänger UTÅT till höger, ね har ögla, わ böjer inåt som en mage.',
    courseStage: 2,
    exampleWords: [
      { kana: 'れきし', romaji: 'rekishi', meaningSv: 'historia', meaningEn: 'history', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'これ', romaji: 'kore', meaningSv: 'den här', meaningEn: 'this', genkiChapter: 'L2', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'ro',
    kana: 'ろ',
    romaji: 'ro',
    group: 'gojuon',
    row: 'r',
    rowNameSv: 'RA-raden',
    strokeCount: 1,
    strokeSvgData: [
      'M 32 28 L 68 28 L 38 58 C 65 48 78 68 65 82 C 55 90 38 85 32 78'
    ],
    mnemonic: {
      summary: 'En Roddbåt (eller siffran 3) som blev rånad (Robbed)',
      summaryEn: 'A Road that has been Robbed of its Ruby',
      storySv: 'Ser ut som る (ru), men någon Robbed (stal) öglan så botten är helt tom!',
      storyEn: 'Identical to る (ru), but the ruby was stolen! The bottom is open.',
      imageVisualDesc: 'En ren 3-liknande form utan ögla.',
      keyCue: 'RO som i Robbed (ingen ögla)',
      keyCueEn: 'Ro for Robbed Road'
    },
    pronunciationTipSv: 'Lätt tungspetsstöt + kort å/o.',
    swedishSimilarSound: 'L/R-stöt + å/o',
    similarSoundPitfall: 'Förväxla inte med る (ru)! ろ har ingen ögla.',
    courseStage: 2,
    exampleWords: [
      { kana: 'ろく', romaji: 'roku', meaningSv: 'sex (siffran 6)', meaningEn: 'six', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'しろい', romaji: 'shiroi', meaningSv: 'vit', meaningEn: 'white', genkiChapter: 'L3', pitchAccent: '②' }
    ]
  },

  // ==========================================
  // WA, WO & N - DEL 2
  // ==========================================
  {
    id: 'wa',
    kana: 'わ',
    romaji: 'wa',
    group: 'gojuon',
    row: 'w',
    rowNameSv: 'WA-raden & N',
    strokeCount: 2,
    strokeSvgData: [
      'M 32 20 L 32 82',
      'M 25 40 L 68 35 L 40 70 C 65 52 78 70 65 82 C 55 90 40 85 38 78'
    ],
    mnemonic: {
      summary: 'En Vattenmelon eller en Svan med stor mage',
      summaryEn: 'A White swan sitting on water / Wasp',
      storySv: 'En "Vattenmelon" (Wa) med en stor rund båge till höger, utan knorr på svansen.',
      storyEn: 'A straight neck and a rounded puffy white swan body with an open back.',
      imageVisualDesc: 'Stolpe till vänster och en stor rund mage till höger.',
      keyCue: 'WA som i Vattenmelon',
      keyCueEn: 'Wa for White swan'
    },
    pronunciationTipSv: 'Kort "wa" som i engelska "water". Mjukt w-ljud.',
    swedishSimilarSound: 'Som "wa" i engelska "was"',
    similarSoundPitfall: 'ね har en ögla, れ sparkar utåt, わ har en sluten rund mage!',
    courseStage: 2,
    exampleWords: [
      { kana: 'わたし', romaji: 'watashi', meaningSv: 'jag / mig', meaningEn: 'I / me', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'わかる', romaji: 'wakaru', meaningSv: 'att förstå (Wakarimashita = jag förstår)', meaningEn: 'to understand', genkiChapter: 'L3', pitchAccent: '②' }
    ]
  },
  {
    id: 'wo',
    kana: 'を',
    romaji: 'wo',
    group: 'gojuon',
    row: 'w',
    rowNameSv: 'WA-raden & N',
    strokeCount: 3,
    strokeSvgData: [
      'M 30 35 Q 55 32 75 35',
      'M 52 20 L 35 62 L 68 62',
      'M 42 62 C 68 62 75 80 55 85 C 45 88 38 80 40 75'
    ],
    mnemonic: {
      summary: 'En person som ropar "Woah!" när hen åker skateboard',
      summaryEn: 'A cheerleader yelling "Whoa!" / Olympic athlete',
      storySv: 'En person som hoppar över ett hinder och ropar "Woah!". Används ENDAST som objektsmarkör i japansk grammatik!',
      storyEn: 'A gymnast jumping over a beam yelling "Whoa!". Used as object particle.',
      imageVisualDesc: 'Ett toppstreck, en z-linje och en C-båge som korsar nedtill.',
      keyCue: 'WO som i "Woah!" (objektspartikel)',
      keyCueEn: 'Wo for "Whoa!"'
    },
    pronunciationTipSv: 'OBS: I modernt japanskt talspråk uttalas を nästan alltid exakt som "O"! Den stavas ofta "wo" i romaji för att särskilja den från お.',
    swedishSimilarSound: 'Uttalas som "O", skrivs som objektspartikel',
    courseStage: 2,
    exampleWords: [
      { kana: 'みずをのむ', romaji: 'mizu o nomu', meaningSv: 'att dricka vatten', meaningEn: 'to drinnk water', genkiChapter: 'L3', pitchAccent: '⓪' },
      { kana: 'ほんをよむ', romaji: 'hon o yomu', meaningSv: 'att läsa en bok', meaningEn: 'to read a book', genkiChapter: 'L3', pitchAccent: '①' }
    ]
  },
  {
    id: 'n',
    kana: 'ん',
    romaji: 'n',
    group: 'gojuon',
    row: 'special_n',
    rowNameSv: 'N (Ensam konsonant)',
    strokeCount: 1,
    strokeSvgData: [
      'M 35 30 L 30 75 L 55 45 C 68 45 75 65 65 78 C 60 84 68 85 75 80'
    ],
    mnemonic: {
      summary: 'Bokstaven "n" skriven i kursiv stil',
      summaryEn: 'A lowercase cursive "n"',
      storySv: 'Det ser precis ut som ett snirkligt, kursivt litet "n"!',
      storyEn: 'Looks almost identical to a handwritten lowercase letter "n".',
      imageVisualDesc: 'En n-liknande vågform i ett enda svepande drag.',
      keyCue: 'N som ett snirkligt n',
      keyCueEn: 'N for lowercase "n"'
    },
    pronunciationTipSv: 'Japanskans enda fristående konsonant. Kan anpassa sitt ljud efter följande bokstav: före m/b/p låter det som M (shinbun -> shimbun), före k/g som ng (ringo), annars som N.',
    swedishSimilarSound: 'Som N (eller M/NG beroende på följandeljud)',
    courseStage: 2,
    exampleWords: [
      { kana: 'にほん', romaji: 'nihon', meaningSv: 'Japan', meaningEn: 'Japan', genkiChapter: 'L1', pitchAccent: '②' },
      { kana: 'せんせい', romaji: 'sensei', meaningSv: 'lärare', meaningEn: 'teacher', genkiChapter: 'L1', pitchAccent: '③' },
      { kana: 'しんぶん', romaji: 'shinbun', meaningSv: 'tidning', meaningEn: 'newspaper', genkiChapter: 'L2', pitchAccent: '⓪' }
    ]
  },

  // ==========================================
  // DAKUON (RÖSTLIGA LJUD MED DAKUTEN ゛)
  // ==========================================
  {
    id: 'ga',
    kana: 'が',
    romaji: 'ga',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'GA-raden (K + ゛)',
    strokeCount: 5,
    mnemonic: {
      summary: 'Kanna (か) med två droppar som säger "Ga-ga"',
      summaryEn: 'Ka (か) with voice marks = Ga',
      storySv: 'Kannan か med två små röst-streck (dakuten) uppe till höger.',
      storyEn: 'か (ka) with two voice marks (dakuten) turns into the hard "Ga" sound.',
      imageVisualDesc: 'か med dakuten ゛',
      keyCue: 'GA = KA + ゛',
      keyCueEn: 'Ga = Ka + ゛'
    },
    pronunciationTipSv: 'Hårt "ga" som i "gata". Partikeln が markerar subjekt!',
    swedishSimilarSound: 'Som "ga" i "gata"',
    courseStage: 2,
    exampleWords: [
      { kana: 'がくせい', romaji: 'gakusei', meaningSv: 'student', meaningEn: 'student', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'だいがく', romaji: 'daigaku', meaningSv: 'universitet', meaningEn: 'university', genkiChapter: 'L1', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'gi',
    kana: 'ぎ',
    romaji: 'gi',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'GA-raden (K + ゛)',
    strokeCount: 6,
    mnemonic: {
      summary: 'Nyckeln (き) med två gnistor: Gi',
      summaryEn: 'Ki (き) with voice marks = Gi',
      storySv: 'き med dakuten ゛ blir Gi.',
      storyEn: 'き (ki) with two voice marks turns into "Gi" (as in geese).',
      imageVisualDesc: 'き med ゛',
      keyCue: 'GI = KI + ゛',
      keyCueEn: 'Gi = Ki + ゛'
    },
    pronunciationTipSv: 'Hårt "gi" som i "gissel", inte j-ljud.',
    swedishSimilarSound: 'Hårt g + i som i "gift"',
    courseStage: 2,
    exampleWords: [
      { kana: 'ぎんこう', romaji: 'ginkou', meaningSv: 'bank', meaningEn: 'bank', genkiChapter: 'L2', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'gu',
    kana: 'ぐ',
    romaji: 'gu',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'GA-raden (K + ゛)',
    strokeCount: 3,
    mnemonic: {
      summary: 'Näbben (く) som ropar "Gu-gu!"',
      summaryEn: 'Ku (く) with voice marks = Gu',
      storySv: 'く med dakuten ゛ blir Gu.',
      storyEn: 'く (ku) with two voice marks turns into "Gu" (as in goose).',
      imageVisualDesc: 'く med ゛',
      keyCue: 'GU = KU + ゛',
      keyCueEn: 'Gu = Ku + ゛'
    },
    pronunciationTipSv: 'Hårt g + orundat u.',
    swedishSimilarSound: 'Hårt g + neutralt u',
    courseStage: 2,
    exampleWords: [
      { kana: 'ぐらい', romaji: 'gurai', meaningSv: 'ungefär / cirka', meaningEn: 'about / approximately', genkiChapter: 'L4', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'ge',
    kana: 'げ',
    romaji: 'ge',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'GA-raden (K + ゛)',
    strokeCount: 5,
    mnemonic: {
      summary: 'Kexet (け) med två smulor: Ge',
      summaryEn: 'Ke (け) with voice marks = Ge',
      storySv: 'け med dakuten ゛ blir Ge.',
      storyEn: 'け (ke) with two voice marks turns into "Ge" (as in get).',
      imageVisualDesc: 'け med ゛',
      keyCue: 'GE = KE + ゛',
      keyCueEn: 'Ge = Ke + ゛'
    },
    pronunciationTipSv: 'Hårt g + kort e (som i "get", fast hårt g).',
    swedishSimilarSound: 'Hårt g + e',
    courseStage: 2,
    exampleWords: [
      { kana: 'げつようび', romaji: 'getsuyoubi', meaningSv: 'måndag', meaningEn: 'Monday', genkiChapter: 'L1', pitchAccent: '③' }
    ]
  },
  {
    id: 'go',
    kana: 'ご',
    romaji: 'go',
    group: 'dakuon',
    row: 'g',
    rowNameSv: 'GA-raden (K + ゛)',
    strokeCount: 4,
    mnemonic: {
      summary: 'Klossarna (こ) med två prickar: Go',
      summaryEn: 'Ko (こ) with voice marks = Go',
      storySv: 'こ med dakuten ゛ blir Go (även siffran 5 på japanska!).',
      storyEn: 'こ (ko) with two voice marks turns into "Go" (as in gold).',
      imageVisualDesc: 'こ med ゛',
      keyCue: 'GO = KO + ゛',
      keyCueEn: 'Go = Ko + ゛'
    },
    pronunciationTipSv: 'Hårt g + kort å/o. Betyder "språk" som suffix (nihon-go = japanska).',
    swedishSimilarSound: 'Som "go" i "godis"',
    courseStage: 2,
    exampleWords: [
      { kana: 'ごはん', romaji: 'gohan', meaningSv: 'kokt ris / måltid', meaningEn: 'cooked rice / meal', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'ごご', romaji: 'gogo', meaningSv: 'eftermiddag (P.M.)', meaningEn: 'afternoon / P.M.', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },

  // ==========================================
  // ZA-RADEN (S + ゛)
  // ==========================================
  {
    id: 'za',
    kana: 'ざ',
    romaji: 'za',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'ZA-raden (S + ゛)',
    strokeCount: 5,
    mnemonic: { summary: 'Sadeln (さ) med två remmar: Za',
      summaryEn: 'Sa (さ) with voice marks = Za', storySv: 'さ med dakuten blir Za.',
      storyEn: 'さ (sa) with voice marks turns into "Za" (as in zap).', imageVisualDesc: 'さ med ゛', keyCue: 'ZA = SA + ゛',
      keyCueEn: 'Za = Sa + ゛' },
    pronunciationTipSv: 'Surrande z som i engelskans "zoo" + a.',
    swedishSimilarSound: 'Surrande Z + a',
    courseStage: 2,
    exampleWords: [{ kana: 'ざっし', romaji: 'zasshi', meaningSv: 'tidskrift/magasin', meaningEn: 'magazine', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },
  {
    id: 'ji',
    kana: 'じ',
    romaji: 'ji',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'ZA-raden (S + ゛)',
    strokeCount: 3,
    mnemonic: { summary: 'Kroken (し) med två prickar: Ji',
      summaryEn: 'Shi (し) with voice marks = Ji', storySv: 'し med dakuten blir Ji (likt engelska Jeep).',
      storyEn: 'し (shi) with voice marks turns into "Ji" (as in jeans).', imageVisualDesc: 'し med ゛', keyCue: 'JI = SHI + ゛',
      keyCueEn: 'Ji = Shi + ゛' },
    pronunciationTipSv: 'Som "j" i engelskans "jeep" eller "jump".',
    swedishSimilarSound: 'Engelskt J som i "Jeep"',
    courseStage: 2,
    exampleWords: [
      { kana: 'じかん', romaji: 'jikan', meaningSv: 'tid / timmar', meaningEn: 'time / hours', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'じしょ', romaji: 'jisho', meaningSv: 'ordbok / lexikon', meaningEn: 'dictionary', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'zu',
    kana: 'ず',
    romaji: 'zu',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'ZA-raden (S + ゛)',
    strokeCount: 4,
    mnemonic: { summary: 'Snurran (す) med två surr: Zu',
      summaryEn: 'Su (す) with voice marks = Zu', storySv: 'す med dakuten blir Zu.',
      storyEn: 'す (su) with voice marks turns into "Zu" (as in zoo).', imageVisualDesc: 'す med ゛', keyCue: 'ZU = SU + ゛',
      keyCueEn: 'Zu = Su + ゛' },
    pronunciationTipSv: 'Surrande z + orundat u.',
    swedishSimilarSound: 'Surrande Z + u',
    courseStage: 2,
    exampleWords: [{ kana: 'みず', romaji: 'mizu', meaningSv: 'vatten', meaningEn: 'water', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },
  {
    id: 'ze',
    kana: 'ぜ',
    romaji: 'ze',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'ZA-raden (S + ゛)',
    strokeCount: 5,
    mnemonic: { summary: 'Sesseln (せ) med två märken: Ze',
      summaryEn: 'Se (せ) with voice marks = Ze', storySv: 'せ med dakuten blir Ze.',
      storyEn: 'せ (se) with voice marks turns into "Ze" (as in zest).', imageVisualDesc: 'せ med ゛', keyCue: 'ZE = SE + ゛',
      keyCueEn: 'Ze = Se + ゛' },
    pronunciationTipSv: 'Surrande z + kort e.',
    swedishSimilarSound: 'Surrande Z + e',
    courseStage: 2,
    exampleWords: [{ kana: 'ぜんぜん', romaji: 'zenzen', meaningSv: 'inte alls (med negation)', meaningEn: 'not at all', genkiChapter: 'L3', pitchAccent: '⓪' }]
  },
  {
    id: 'zo',
    kana: 'ぞ',
    romaji: 'zo',
    group: 'dakuon',
    row: 'z',
    rowNameSv: 'ZA-raden (S + ゛)',
    strokeCount: 3,
    mnemonic: { summary: 'Sömmen (そ) med två stygn: Zo',
      summaryEn: 'So (そ) with voice marks = Zo', storySv: 'そ med dakuten blir Zo.',
      storyEn: 'そ (so) with voice marks turns into "Zo" (as in zone).', imageVisualDesc: 'そ med ゛', keyCue: 'ZO = SO + ゛',
      keyCueEn: 'Zo = So + ゛' },
    pronunciationTipSv: 'Surrande z + kort å/o.',
    swedishSimilarSound: 'Surrande Z + å/o',
    courseStage: 2,
    exampleWords: [{ kana: 'どうぞ', romaji: 'douzo', meaningSv: 'varsågod', meaningEn: 'please / here you go', genkiChapter: 'L2', pitchAccent: '①' }]
  },

  // ==========================================
  // DA-RADEN (T + ゛)
  // ==========================================
  {
    id: 'da',
    kana: 'だ',
    romaji: 'da',
    group: 'dakuon',
    row: 'd',
    rowNameSv: 'DA-raden (T + ゛)',
    strokeCount: 6,
    mnemonic: { summary: 'Ta (た) med dakuten = Da',
      summaryEn: 'Ta (た) with voice marks = Da', storySv: 'た med dakuten blir Da.',
      storyEn: 'た (ta) with voice marks turns into "Da" (as in dart).', imageVisualDesc: 'た med ゛', keyCue: 'DA = TA + ゛',
      keyCueEn: 'Da = Ta + ゛' },
    pronunciationTipSv: 'Klart "da" som i "dag". Informell form av です (desu).',
    swedishSimilarSound: 'Som "da" i "dag"',
    courseStage: 2,
    exampleWords: [{ kana: 'だいがく', romaji: 'daigaku', meaningSv: 'universitet', meaningEn: 'university', genkiChapter: 'L1', pitchAccent: '⓪' }]
  },
  {
    id: 'de',
    kana: 'で',
    romaji: 'de',
    group: 'dakuon',
    row: 'd',
    rowNameSv: 'DA-raden (T + ゛)',
    strokeCount: 3,
    mnemonic: { summary: 'Te (て) med dakuten = De',
      summaryEn: 'Te (て) with voice marks = De', storySv: 'て med dakuten blir De.',
      storyEn: 'て (te) with voice marks turns into "De" (as in deck).', imageVisualDesc: 'て med ゛', keyCue: 'DE = TE + ゛',
      keyCueEn: 'De = Te + ゛' },
    pronunciationTipSv: 'Kort "de". Grammatisk partikel för plats där handling sker!',
    swedishSimilarSound: 'Som "de" i "dela"',
    courseStage: 2,
    exampleWords: [
      { kana: 'でんわ', romaji: 'denwa', meaningSv: 'telefon', meaningEn: 'telephone', genkiChapter: 'L1', pitchAccent: '⓪' },
      { kana: 'です', romaji: 'desu', meaningSv: 'är / copula (artigt verb)', meaningEn: 'to be / is', genkiChapter: 'L1', pitchAccent: '①' }
    ]
  },
  {
    id: 'do',
    kana: 'ど',
    romaji: 'do',
    group: 'dakuon',
    row: 'd',
    rowNameSv: 'DA-raden (T + ゛)',
    strokeCount: 4,
    mnemonic: { summary: 'Tå (と) med dakuten = Do',
      summaryEn: 'To (と) with voice marks = Do', storySv: 'と med dakuten blir Do.',
      storyEn: 'と (to) with voice marks turns into "Do" (as in door).', imageVisualDesc: 'と med ゛', keyCue: 'DO = TO + ゛',
      keyCueEn: 'Do = To + ゛' },
    pronunciationTipSv: 'Kort "do/då" som i "docka".',
    swedishSimilarSound: 'Som "do" i "docka"',
    courseStage: 2,
    exampleWords: [
      { kana: 'どこ', romaji: 'doko', meaningSv: 'var? (vilken plats)', meaningEn: 'where?', genkiChapter: 'L2', pitchAccent: '①' },
      { kana: 'どうも', romaji: 'doumo', meaningSv: 'tack / på många sätt', meaningEn: 'thanks', genkiChapter: 'L0', pitchAccent: '①' },
      { kana: 'どようび', romaji: 'doyoubi', meaningSv: 'lördag', meaningEn: 'Saturday', genkiChapter: 'L1', pitchAccent: '②' }
    ]
  },

  // ==========================================
  // BA-RADEN (H + ゛) & PA-RADEN (H + ゜)
  // ==========================================
  {
    id: 'ba',
    kana: 'ば',
    romaji: 'ba',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'BA-raden (H + ゛)',
    strokeCount: 5,
    mnemonic: { summary: 'Hare (は) med dakuten = Ba',
      summaryEn: 'Ha (は) with voice marks = Ba', storySv: 'は med ゛ blir Ba.',
      storyEn: 'は (ha) with voice marks turns into "Ba" (as in ball).', imageVisualDesc: 'は med ゛', keyCue: 'BA = HA + ゛',
      keyCueEn: 'Ba = Ha + ゛' },
    pronunciationTipSv: 'Kort rent "ba" som i "bada".',
    swedishSimilarSound: 'Som "ba" i "bada"',
    courseStage: 2,
    exampleWords: [{ kana: 'ばんごう', romaji: 'bangou', meaningSv: 'nummer', meaningEn: 'number', genkiChapter: 'L1', pitchAccent: '③' }]
  },
  {
    id: 'bi',
    kana: 'び',
    romaji: 'bi',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'BA-raden (H + ゛)',
    strokeCount: 3,
    mnemonic: { summary: 'Leendet (ひ) med dakuten = Bi',
      summaryEn: 'Hi (ひ) with voice marks = Bi', storySv: 'ひ med ゛ blir Bi.',
      storyEn: 'ひ (hi) with voice marks turns into "Bi" (as in bean).', imageVisualDesc: 'ひ med ゛', keyCue: 'BI = HI + ゛',
      keyCueEn: 'Bi = Hi + ゛' },
    pronunciationTipSv: 'Kort "bi" som i "bita".',
    swedishSimilarSound: 'Som "bi" i "bita"',
    courseStage: 2,
    exampleWords: [{ kana: 'びょういん', romaji: 'byouin', meaningSv: 'sjukhus', meaningEn: 'hospital', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },
  {
    id: 'bu',
    kana: 'ぶ',
    romaji: 'bu',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'BA-raden (H + ゛)',
    strokeCount: 6,
    mnemonic: { summary: 'Fuji (ふ) med dakuten = Bu',
      summaryEn: 'Fu (ふ) with voice marks = Bu', storySv: 'ふ med ゛ blir Bu.',
      storyEn: 'ふ (fu) with voice marks turns into "Bu" (as in book).', imageVisualDesc: 'ふ med ゛', keyCue: 'BU = FU + ゛',
      keyCueEn: 'Bu = Fu + ゛' },
    pronunciationTipSv: 'Kort b + orundat u.',
    swedishSimilarSound: 'B + neutralt u',
    courseStage: 2,
    exampleWords: [{ kana: 'ぶんがく', romaji: 'bungaku', meaningSv: 'litteratur', meaningEn: 'literature', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'be',
    kana: 'べ',
    romaji: 'be',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'BA-raden (H + ゛)',
    strokeCount: 3,
    mnemonic: { summary: 'Hjälmen (へ) med dakuten = Be',
      summaryEn: 'He (へ) with voice marks = Be', storySv: 'へ med ゛ blir Be.',
      storyEn: 'へ (he) with voice marks turns into "Be" (as in bell).', imageVisualDesc: 'へ med ゛', keyCue: 'BE = HE + ゛',
      keyCueEn: 'Be = He + ゛' },
    pronunciationTipSv: 'Kort "be" som i "bädd".',
    swedishSimilarSound: 'Som "be" i "bäck"',
    courseStage: 2,
    exampleWords: [{ kana: 'べんきょう', romaji: 'benkyou', meaningSv: 'studier / att plugga', meaningEn: 'study', genkiChapter: 'L3', pitchAccent: '⓪' }]
  },
  {
    id: 'bo',
    kana: 'ぼ',
    romaji: 'bo',
    group: 'dakuon',
    row: 'b',
    rowNameSv: 'BA-raden (H + ゛)',
    strokeCount: 6,
    mnemonic: { summary: 'Hatten (ほ) med dakuten = Bo',
      summaryEn: 'Ho (ほ) with voice marks = Bo', storySv: 'ほ med ゛ blir Bo.',
      storyEn: 'ほ (ho) with voice marks turns into "Bo" (as in boat).', imageVisualDesc: 'ほ med ゛', keyCue: 'BO = HO + ゛',
      keyCueEn: 'Bo = Ho + ゛' },
    pronunciationTipSv: 'Kort "bo/bå" som i "boll".',
    swedishSimilarSound: 'Som "bo" i "boll"',
    courseStage: 2,
    exampleWords: [{ kana: 'ぼうし', romaji: 'boushi', meaningSv: 'hatt / mössa', meaningEn: 'hat / cap', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },
  {
    id: 'pa',
    kana: 'ぱ',
    romaji: 'pa',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'PA-raden (H + ゜)',
    strokeCount: 4,
    mnemonic: { summary: 'Haren (は) med en rund bubbla (Handakuten) = Pa',
      summaryEn: 'Ha (は) with pop circle = Pa', storySv: 'Den lilla runda cirkeln ゜ (handakuten) förvandlar H till P som en Pop-bubbla!',
      storyEn: 'は (ha) with a small circle (maru) pops into "Pa" (as in party).', imageVisualDesc: 'は med ゜', keyCue: 'PA = HA + ゜',
      keyCueEn: 'Pa = Ha + ゜' },
    pronunciationTipSv: 'Klart "pa" som i "pappa".',
    swedishSimilarSound: 'Som "pa" i "pappa"',
    courseStage: 2,
    exampleWords: [{ kana: 'パン', romaji: 'pan', meaningSv: 'bröd', meaningEn: 'bread', genkiChapter: 'L3', pitchAccent: '①' }]
  },
  {
    id: 'pi',
    kana: 'ぴ',
    romaji: 'pi',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'PA-raden (H + ゜)',
    strokeCount: 2,
    mnemonic: { summary: 'ひ med bubbla = Pi',
      summaryEn: 'Hi (ひ) with pop circle = Pi', storySv: 'ひ med handakuten-cirkel blir Pi.',
      storyEn: 'ひ (hi) with a small circle pops into "Pi" (as in pizza).', imageVisualDesc: 'ひ med ゜', keyCue: 'PI = HI + ゜',
      keyCueEn: 'Pi = Hi + ゜' },
    pronunciationTipSv: 'Kort "pi" som i "pilot".',
    swedishSimilarSound: 'Som "pi" i "pilot"',
    courseStage: 2,
    exampleWords: [{ kana: 'えんぴつ', romaji: 'enpitsu', meaningSv: 'blyertspenna', meaningEn: 'pencil', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },
  {
    id: 'pu',
    kana: 'ぷ',
    romaji: 'pu',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'PA-raden (H + ゜)',
    strokeCount: 5,
    mnemonic: { summary: 'ふ med bubbla = Pu',
      summaryEn: 'Fu (ふ) with pop circle = Pu', storySv: 'ふ med ゜ blir Pu.',
      storyEn: 'ふ (fu) with a small circle pops into "Pu" (as in pudding).', imageVisualDesc: 'ふ med ゜', keyCue: 'PU = FU + ゜',
      keyCueEn: 'Pu = Fu + ゜' },
    pronunciationTipSv: 'Kort p + orundat u.',
    swedishSimilarSound: 'P + neutralt u',
    courseStage: 2,
    exampleWords: [{ kana: 'きっぷ', romaji: 'kippu', meaningSv: 'biljett', meaningEn: 'ticket', genkiChapter: 'L4', pitchAccent: '⓪' }]
  },
  {
    id: 'pe',
    kana: 'ぺ',
    romaji: 'pe',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'PA-raden (H + ゜)',
    strokeCount: 2,
    mnemonic: { summary: 'へ med bubbla = Pe',
      summaryEn: 'He (へ) with pop circle = Pe', storySv: 'へ med ゜ blir Pe.',
      storyEn: 'へ (he) with a small circle pops into "Pe" (as in penguin).', imageVisualDesc: 'へ med ゜', keyCue: 'PE = HE + ゜',
      keyCueEn: 'Pe = He + ゜' },
    pronunciationTipSv: 'Kort "pe" som i "penna".',
    swedishSimilarSound: 'Som "pe" i "penna"',
    courseStage: 2,
    exampleWords: [{ kana: 'ぺらぺら', romaji: 'perapera', meaningSv: 'flytande (tala ett språk flytande)', meaningEn: 'fluent', genkiChapter: 'L1', pitchAccent: '⓪' }]
  },
  {
    id: 'po',
    kana: 'ぽ',
    romaji: 'ぽ',
    group: 'handakuon',
    row: 'p',
    rowNameSv: 'PA-raden (H + ゜)',
    strokeCount: 5,
    mnemonic: { summary: 'ほ med bubbla = Po',
      summaryEn: 'Ho (ほ) with pop circle = Po', storySv: 'ほ med ゜ blir Po.',
      storyEn: 'ほ (ho) with a small circle pops into "Po" (as in popcorn).', imageVisualDesc: 'ほ med ゜', keyCue: 'PO = HO + ゜',
      keyCueEn: 'Po = Ho + ゜' },
    pronunciationTipSv: 'Kort "po/på" som i "post".',
    swedishSimilarSound: 'Som "po" i "post"',
    courseStage: 2,
    exampleWords: [{ kana: 'さんぽ', romaji: 'sanpo', meaningSv: 'promenad', meaningEn: 'walk / stroll', genkiChapter: 'L4', pitchAccent: '⓪' }]
  },

  // ==========================================
  // YOON (KOMBINATIONER MED LITET YA, YU, YO)
  // ==========================================
  {
    id: 'kya',
    kana: 'きゃ',
    romaji: 'kya',
    group: 'yoon',
    row: 'ky',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 7,
    mnemonic: { summary: 'き + litet ゃ = kya',
      summaryEn: 'Ki + small ya = Kya', storySv: 'Kombination av Ki och litet Ya skapar enstaviga ljudet Kya!',
      storyEn: 'Blend "Ki" and small "Ya" into one single syllable "Kya".', imageVisualDesc: 'き + ゃ', keyCue: 'KYA',
      keyCueEn: 'Kya' },
    pronunciationTipSv: 'Enstavigt! Låt inte som "ki-ya" utan ett snabbt "kja".',
    swedishSimilarSound: 'Som "kja" i "kjol"',
    courseStage: 2,
    exampleWords: [{ kana: 'きゃく', romaji: 'kyaku', meaningSv: 'gäst / kund', meaningEn: 'guest / customer', genkiChapter: 'L4', pitchAccent: '⓪' }]
  },
  {
    id: 'kyu',
    kana: 'きゅ',
    romaji: 'kyu',
    group: 'yoon',
    row: 'ky',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 6,
    mnemonic: { summary: 'き + litet ゅ = kyu',
      summaryEn: 'Ki + small yu = Kyu', storySv: 'Ki + litet Yu = Kyu (även siffran 9!).',
      storyEn: 'Blend "Ki" and small "Yu" into "Kyu" (also the number 9!).', imageVisualDesc: 'き + ゅ', keyCue: 'KYU',
      keyCueEn: 'Kyu' },
    pronunciationTipSv: 'Kort enstavigt kju.',
    swedishSimilarSound: 'Som "kju"',
    courseStage: 2,
    exampleWords: [{ kana: 'きゅう', romaji: 'kyuu', meaningSv: 'nio (siffran 9)', meaningEn: 'nine', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'kyo',
    kana: 'きょ',
    romaji: 'kyo',
    group: 'yoon',
    row: 'ky',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 6,
    mnemonic: { summary: 'き + litet ょ = kyo',
      summaryEn: 'Ki + small yo = Kyo', storySv: 'Ki + litet Yo = Kyo (som i Kyoto!).',
      storyEn: 'Blend "Ki" and small "Yo" into "Kyo" (as in Kyoto).', imageVisualDesc: 'き + ょ', keyCue: 'KYO',
      keyCueEn: 'Kyo' },
    pronunciationTipSv: 'Kort enstavigt kjå/kjo.',
    swedishSimilarSound: 'Som "kjo" i "kjol"',
    courseStage: 2,
    exampleWords: [
      { kana: 'きょう', romaji: 'kyou', meaningSv: 'idag', meaningEn: 'today', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'きょうしつ', romaji: 'kyoushitsu', meaningSv: 'klassrum', meaningEn: 'classroom', genkiChapter: 'L2', pitchAccent: '⓪' },
      { kana: 'とうきょう', romaji: 'toukyou', meaningSv: 'Tokyo', meaningEn: 'Tokyo', genkiChapter: 'L1', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'sha',
    kana: 'しゃ',
    romaji: 'sha',
    group: 'yoon',
    row: 'sh',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 4,
    mnemonic: { summary: 'し + litet ゃ = sha',
      summaryEn: 'Shi + small ya = Sha', storySv: 'Shi + litet Ya = Sha.',
      storyEn: 'Blend "Shi" and small "Ya" into a crisp single syllable "Sha".', imageVisualDesc: 'し + ゃ', keyCue: 'SHA',
      keyCueEn: 'Sha' },
    pronunciationTipSv: 'Enstavigt "sja/sha" som i engelska "shadow".',
    swedishSimilarSound: 'Som "sja" i "schack"',
    courseStage: 2,
    exampleWords: [{ kana: 'しゃしん', romaji: 'shashin', meaningSv: 'fotografi', meaningEn: 'photograph', genkiChapter: 'L2', pitchAccent: '⓪' }]
  },
  {
    id: 'shu',
    kana: 'しゅ',
    romaji: 'shu',
    group: 'yoon',
    row: 'sh',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 3,
    mnemonic: { summary: 'し + litet ゅ = shu',
      summaryEn: 'Shi + small yu = Shu', storySv: 'Shi + litet Yu = Shu.',
      storyEn: 'Blend "Shi" and small "Yu" into "Shu" (as in shoe).', imageVisualDesc: 'し + ゅ', keyCue: 'SHU',
      keyCueEn: 'Shu' },
    pronunciationTipSv: 'Enstavigt "sju/shu" som i "shoot".',
    swedishSimilarSound: 'Som "sju" eller engelska "shoe"',
    courseStage: 2,
    exampleWords: [{ kana: 'しゅくだい', romaji: 'shukudai', meaningSv: 'läxa', meaningEn: 'homework', genkiChapter: 'L3', pitchAccent: '⓪' }]
  },
  {
    id: 'sho',
    kana: 'しょ',
    romaji: 'sho',
    group: 'yoon',
    row: 'sh',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 3,
    mnemonic: { summary: 'し + litet ょ = sho',
      summaryEn: 'Shi + small yo = Sho', storySv: 'Shi + litet Yo = Sho.',
      storyEn: 'Blend "Shi" and small "Yo" into "Sho" (as in show).', imageVisualDesc: 'し + ょ', keyCue: 'SHO',
      keyCueEn: 'Sho' },
    pronunciationTipSv: 'Enstavigt "sjå/sho" som i engelska "shop".',
    swedishSimilarSound: 'Som "sho" i "show"',
    courseStage: 2,
    exampleWords: [
      { kana: 'としょかん', romaji: 'toshokan', meaningSv: 'bibliotek', meaningEn: 'library', genkiChapter: 'L2', pitchAccent: '②' },
      { kana: 'じしょ', romaji: 'jisho', meaningSv: 'lexikon', meaningEn: 'dictionary', genkiChapter: 'L2', pitchAccent: '①' }
    ]
  },
  {
    id: 'cha',
    kana: 'ちゃ',
    romaji: 'cha',
    group: 'yoon',
    row: 'ch',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 5,
    mnemonic: { summary: 'ち + litet ゃ = cha',
      summaryEn: 'Chi + small ya = Cha', storySv: 'Chi + litet Ya = Cha (som grönt te: Ocha!).',
      storyEn: 'Blend "Chi" and small "Ya" into "Cha" (as in ocha / tea).', imageVisualDesc: 'ち + ゃ', keyCue: 'CHA',
      keyCueEn: 'Cha' },
    pronunciationTipSv: 'Enstavigt "tja/cha".',
    swedishSimilarSound: 'Som "tja" i hälsningen "Tja!"',
    courseStage: 2,
    exampleWords: [{ kana: 'おちゃ', romaji: 'ocha', meaningSv: 'grönt te', meaningEn: 'green tea', genkiChapter: 'L1', pitchAccent: '⓪' }]
  },
  {
    id: 'chu',
    kana: 'ちゅ',
    romaji: 'chu',
    group: 'yoon',
    row: 'ch',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 4,
    mnemonic: { summary: 'ち + litet ゅ = chu',
      summaryEn: 'Chi + small yu = Chu', storySv: 'Chi + litet Yu = Chu (kinesisk mat / kyssljud).',
      storyEn: 'Blend "Chi" and small "Yu" into "Chu" (as in chew).', imageVisualDesc: 'ち + ゅ', keyCue: 'CHU',
      keyCueEn: 'Chu' },
    pronunciationTipSv: 'Enstavigt "tju/chu".',
    swedishSimilarSound: 'Som "tju" i "tjugo"',
    courseStage: 2,
    exampleWords: [{ kana: 'ちゅうごく', romaji: 'chuugoku', meaningSv: 'Kina', meaningEn: 'China', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'cho',
    kana: 'ちょ',
    romaji: 'cho',
    group: 'yoon',
    row: 'ch',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 4,
    mnemonic: { summary: 'ち + litet ょ = cho',
      summaryEn: 'Chi + small yo = Cho', storySv: 'Chi + litet Yo = Cho.',
      storyEn: 'Blend "Chi" and small "Yo" into "Cho" (as in chocolate).', imageVisualDesc: 'ち + ょ', keyCue: 'CHO',
      keyCueEn: 'Cho' },
    pronunciationTipSv: 'Enstavigt "tjå/cho".',
    swedishSimilarSound: 'Som "tjo" i "tjoho"',
    courseStage: 2,
    exampleWords: [{ kana: 'ちょっと', romaji: 'chotto', meaningSv: 'lite / ett ögonblick', meaningEn: 'a little / a moment', genkiChapter: 'L2', pitchAccent: '①' }]
  },
  {
    id: 'nya',
    kana: 'にゃ',
    romaji: 'nya',
    group: 'yoon',
    row: 'ny',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 6,
    mnemonic: { summary: 'に + litet ゃ = nya',
      summaryEn: 'Ni + small ya = Nya', storySv: 'Kattens mjauande på japanska är "Nya-nya"!',
      storyEn: 'Blend "Ni" and small "Ya" into "Nya" (sound of a cat meowing!).', imageVisualDesc: 'に + ゃ', keyCue: 'NYA',
      keyCueEn: 'Nya' },
    pronunciationTipSv: 'Enstavigt "nja/nya".',
    swedishSimilarSound: 'Som "nja" i "konjak"',
    courseStage: 2,
    exampleWords: [{ kana: 'こんにゃく', romaji: 'konnyaku', meaningSv: 'konjac (japansk råvara)', meaningEn: 'konjac', genkiChapter: 'L4', pitchAccent: '③' }]
  },
  {
    id: 'ryo',
    kana: 'りょ',
    romaji: 'ryo',
    group: 'yoon',
    row: 'ry',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 4,
    mnemonic: { summary: 'り + litet ょ = ryo',
      summaryEn: 'Ri + small yo = Ryo', storySv: 'Ri + litet Yo = Ryo (som i ryokan / matlagning ryori).',
      storyEn: 'Blend "Ri" and small "Yo" into "Ryo" (as in ryokan inn).', imageVisualDesc: 'り + ょ', keyCue: 'RYO',
      keyCueEn: 'Ryo' },
    pronunciationTipSv: 'Tungspetsstöt + jo/jå.',
    swedishSimilarSound: 'L/R-stöt + jo',
    courseStage: 2,
    exampleWords: [
      { kana: 'りょうり', romaji: 'ryouri', meaningSv: 'matlagning / maträtt', meaningEn: 'cooking / cuisine', genkiChapter: 'L3', pitchAccent: '①' },
      { kana: 'りょこう', romaji: 'ryokou', meaningSv: 'resa', meaningEn: 'trip / travel', genkiChapter: 'L4', pitchAccent: '⓪' }
    ]
  },
  {
    id: 'gyu',
    kana: 'ぎゅ',
    romaji: 'gyu',
    group: 'yoon',
    row: 'gy',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 8,
    mnemonic: { summary: 'ぎ + litet ゅ = gyu',
      summaryEn: 'Gi + small yu = Gyu', storySv: 'Gi + litet Yu = Gyu (nötkött gyuuniku / gyuudon).',
      storyEn: 'Blend "Gi" and small "Yu" into "Gyu" (as in gyudon beef bowl).', imageVisualDesc: 'ぎ + ゅ', keyCue: 'GYU',
      keyCueEn: 'Gyu' },
    pronunciationTipSv: 'Hårt g + ju.',
    swedishSimilarSound: 'Hårt g + ju',
    courseStage: 2,
    exampleWords: [{ kana: 'ぎゅうにゅう', romaji: 'gyuunyuu', meaningSv: 'mjölk', meaningEn: 'cow milk', genkiChapter: 'L3', pitchAccent: '⓪' }]
  },
  {
    id: 'ja',
    kana: 'じゃ',
    romaji: 'ja',
    group: 'yoon',
    row: 'j',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 6,
    mnemonic: { summary: 'じ + litet ゃ = ja',
      summaryEn: 'Ji + small ya = Ja', storySv: 'Ji + litet Ya = Ja (som i jaa mata = vi ses då!).',
      storyEn: 'Blend "Ji" and small "Ya" into "Ja" (as in jar).', imageVisualDesc: 'じ + ゃ', keyCue: 'JA',
      keyCueEn: 'Ja' },
    pronunciationTipSv: 'Engelskt j-ljud + a.',
    swedishSimilarSound: 'Som "ja" med engelskt J (jump)',
    courseStage: 2,
    exampleWords: [
      { kana: 'じゃあ', romaji: 'jaa', meaningSv: 'då så / i så fall', meaningEn: 'well then', genkiChapter: 'L0', pitchAccent: '①' },
      { kana: 'じゃ、また', romaji: 'ja, mata', meaningSv: 'vi ses då (hejdå)', meaningEn: 'see you later', genkiChapter: 'L0', pitchAccent: '①' }
    ]
  },
  {
    id: 'ju',
    kana: 'じゅ',
    romaji: 'ju',
    group: 'yoon',
    row: 'j',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 5,
    mnemonic: { summary: 'じ + litet ゅ = ju',
      summaryEn: 'Ji + small yu = Ju', storySv: 'Ji + litet Yu = Ju (även siffran 10 = Juu!).',
      storyEn: 'Blend "Ji" and small "Yu" into "Ju" (as in juice).', imageVisualDesc: 'じ + ゅ', keyCue: 'JU',
      keyCueEn: 'Ju' },
    pronunciationTipSv: 'Engelskt j-ljud + neutralt u.',
    swedishSimilarSound: 'Engelskt J + u',
    courseStage: 2,
    exampleWords: [{ kana: 'じゅう', romaji: 'juu', meaningSv: 'tio (siffran 10)', meaningEn: 'ten', genkiChapter: 'L1', pitchAccent: '①' }]
  },
  {
    id: 'jo',
    kana: 'じょ',
    romaji: 'jo',
    group: 'yoon',
    row: 'j',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 5,
    mnemonic: { summary: 'じ + litet ょ = jo',
      summaryEn: 'Ji + small yo = Jo', storySv: 'Ji + litet Yo = Jo (som i kvinna Josei).',
      storyEn: 'Blend "Ji" and small "Yo" into "Jo" (as in jogging).', imageVisualDesc: 'じ + ょ', keyCue: 'JO',
      keyCueEn: 'Jo' },
    pronunciationTipSv: 'Engelskt j-ljud + å/o.',
    swedishSimilarSound: 'Engelskt J + å/o',
    courseStage: 2,
    exampleWords: [{ kana: 'じょうず', romaji: 'jouzu', meaningSv: 'duktig på / skicklig', meaningEn: 'skillful / good at', genkiChapter: 'L5', pitchAccent: '③' }]
  },
  {
    id: 'byo',
    kana: 'びょ',
    romaji: 'byo',
    group: 'yoon',
    row: 'by',
    rowNameSv: 'Kombinationsljud (Yōon)',
    strokeCount: 5,
    mnemonic: { 
      summary: 'び + litet ょ = byo', 
      summaryEn: 'Bi + small yo = Byo',
      storySv: 'Bi + litet Yo = Byo (som i sjukhus byouin).', 
      storyEn: 'Blend "Bi" and small "Yo" into "Byo" (as in byouin / hospital).',
      imageVisualDesc: 'び + ょ', 
      keyCue: 'BYO',
      keyCueEn: 'Byo'
    },
    pronunciationTipSv: 'Kort bjo/bjå.',
    swedishSimilarSound: 'Som "bjo" i "björn"',
    courseStage: 2,
    exampleWords: [{ kana: 'びょういん', romaji: 'byouin', meaningSv: 'sjukhus', meaningEn: 'hospital', genkiChapter: 'L2', pitchAccent: '⓪' }]
  }
];

export const BASIC_GOJUON = HIRAGANA_DATA.filter(k => k.group === 'gojuon');
export const DAKUON_HANDAKUON = HIRAGANA_DATA.filter(k => k.group === 'dakuon' || k.group === 'handakuon');
export const YOON_COMBINATIONS = HIRAGANA_DATA.filter(k => k.group === 'yoon');

export const HIRAGANA_MAP = new Map<string, KanaCharacter>(
  HIRAGANA_DATA.map(k => [k.id, k])
);

export const KANA_BY_CHARACTER = new Map<string, KanaCharacter>(
  HIRAGANA_DATA.map(k => [k.kana, k])
);
