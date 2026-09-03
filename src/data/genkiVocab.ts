import type { ClassroomPhrase, StudyWeek, ExampleWord } from '../types/kana';

export const COURSE_INFO = {
  courseCode: 'JP101',
  courseName: 'Japanska: Grundkurs (Nybörjare)',
  institution: 'Språkkurs & Självstudier',
  term: 'Nybörjarnivå',
  textbook: 'Genki I: An Integrated Approach to Elementary Japanese (3rd Edition)',
  description: 'En komplett nybörjarguide för att lära sig japansk Hiragana, grundläggande hälsningsfraser, vanliga klassrumsuttryck och ordförråd från Genki I.',
  tipsForStudents: [
    'Lär dig Hiragana HELT utantill tidigt. Det gör all vidare språkinlärning tio gånger lättare!',
    'Öva aktiv framkallning (skriva för hand) varje dag – korrekt streckordning hjälper minnet.',
    'Lyssna noga på skillnaden mellan långa vokaler (t.ex. おばさん tant vs おばあさん mormor) och dubbelkonsonanter (sokuon っ).',
    'Använd de artiga hälsningsfraserna regelbundet för att bygga ett naturligt flyt!'
  ]
};

export const CLASSROOM_PHRASES: ClassroomPhrase[] = [
  {
    id: 'p1',
    japanese: 'おはようございます',
    romaji: 'Ohayou gozaimasu',
    swedish: 'God morgon (formell hälsning)',
    context: 'Artig morgonhälsning till lärare eller kollegor.',
    speaker: 'both'
  },
  {
    id: 'p2',
    japanese: 'こんにちは',
    romaji: 'Konnichiwa',
    swedish: 'God dag / Hej',
    context: 'Allmän hälsning dagtid.',
    speaker: 'both'
  },
  {
    id: 'p3',
    japanese: 'せんせい、しつもんがあります',
    romaji: 'Sensei, shitsumon ga arimasu',
    swedish: 'Läraren, jag har en fråga!',
    context: 'När du räcker upp handen under lektionen.',
    speaker: 'student'
  },
  {
    id: 'p4',
    japanese: 'もういちどおねがいします',
    romaji: 'Mou ichido onegaishimasu',
    swedish: 'En gång till, är du snäll / Kan du upprepa det?',
    context: 'Om någon pratade för snabbt eller du vill höra uttalet igen.',
    speaker: 'student'
  },
  {
    id: 'p5',
    japanese: 'ゆっくりいってください',
    romaji: 'Yukkuri itte kudasai',
    swedish: 'Säg det långsamt, är du snäll.',
    context: 'För att be om långsammare taltempo.',
    speaker: 'student'
  },
  {
    id: 'p6',
    japanese: 'わかりました',
    romaji: 'Wakarimashita',
    swedish: 'Jag förstår / Jag fattar!',
    context: 'När du har förstått en förklaring.',
    speaker: 'student'
  },
  {
    id: 'p7',
    japanese: 'わかりません',
    romaji: 'Wakarimasen',
    swedish: 'Jag förstår inte / Jag vet inte.',
    context: 'När något är oklart under genomgången.',
    speaker: 'student'
  },
  {
    id: 'p8',
    japanese: 'きいてください',
    romaji: 'Kiite kudasai',
    swedish: 'Lyssna, är ni snälla.',
    context: 'Uppmaning att lyssna på en ljudfil eller ett exempel.',
    speaker: 'sensei'
  },
  {
    id: 'p9',
    japanese: 'みてください',
    romaji: 'Mite kudasai',
    swedish: 'Titta här, är ni snälla.',
    context: 'Uppmaning att titta på tavlan eller skärmen.',
    speaker: 'sensei'
  },
  {
    id: 'p10',
    japanese: 'かいてください',
    romaji: 'Kaite kudasai',
    swedish: 'Skriv ner detta, är ni snälla.',
    context: 'När man ska göra en skrivövning.',
    speaker: 'sensei'
  },
  {
    id: 'p11',
    japanese: 'よんでください',
    romaji: 'Yonde kudasai',
    swedish: 'Läs högt, är du snäll.',
    context: 'Uppmaning att läsa en dialog eller text.',
    speaker: 'sensei'
  },
  {
    id: 'p12',
    japanese: 'よろしくおねがいします',
    romaji: 'Yoroshiku onegaishimasu',
    swedish: 'Trevligt att lära känna dig / Jag ser fram emot att samarbeta med dig.',
    context: 'Sägs vid självpresentationer och inför övningar.',
    speaker: 'both'
  },
  {
    id: 'p13',
    japanese: 'しつれいします',
    romaji: 'Shitsureishimasu',
    swedish: 'Ursäkta mig (vid inträde eller avslut).',
    context: 'Artig fras när man går in eller ut ur ett rum.',
    speaker: 'student'
  },
  {
    id: 'p14',
    japanese: 'ありがとうございます',
    romaji: 'Arigatou gozaimasu',
    swedish: 'Tack så mycket (formellt)',
    context: 'Tacka läraren eller en kurskamrat.',
    speaker: 'both'
  }
];

export const STUDY_ROADMAP: StudyWeek[] = [
  {
    weekNumber: 1,
    dates: 'Etapp 1',
    title: 'Grunden: Vokaler & Ka-Sa-Ta-Na',
    focus: 'De 25 första baskana (あ till の), grundläggande japansk fonetik och artiga hälsningar.',
    genkiChapter: 'Genki I: Introduktion & Lektion 0',
    kanaCovered: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の'],
    vocabularyCount: 30,
    grammarFocus: [
      'Japanska vokalljud vs svenska vokaler',
      'Kopplingen mellan Hiragana och stavelser (mora)',
      'Hälsningsfraser (Aisatsu)'
    ],
    tasks: [
      { id: 't1', text: 'Lär dig vokalerna (あ い う え お) med mnemoteknik', doneByDefault: false },
      { id: 't2', text: 'Öva Ka-Sa-Ta-Na raderna på ritbrädan för rätt streckordning', doneByDefault: false },
      { id: 't3', text: 'Spela 3 omgångar i Shinkansen Rush', doneByDefault: false },
      { id: 't4', text: 'Kör SRS-repetition för Etapp 1-korten', doneByDefault: false }
    ]
  },
  {
    weekNumber: 2,
    dates: 'Etapp 2',
    title: 'Slutför Hiragana: Ha-Ma-Ya-Ra-Wa-N & Dakuten',
    focus: 'Resterande 21 baskana + röstade ljud (Dakuten/Handakuten ゛゜) + kombinationsljud (Yōon きゃ, しゅ etc.) + Sokuon (litet っ).',
    genkiChapter: 'Genki I: Lektion 1 Ordförråd',
    kanaCovered: ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん', 'が', 'ざ', 'だ', 'ば', 'ぱ', 'きゃ', 'しゃ', 'ちゃ'],
    vocabularyCount: 50,
    grammarFocus: [
      'R-ljudets klaff-uttal (alveolar tap)',
      'Partiklarna は (wa) och を (o)',
      'Långa vokaler (おばあさん vs おばさん) och dubbelkonsonanter (がっこう)'
    ],
    tasks: [
      { id: 't5', text: 'Bemästra Ha-Ma-Ya-Ra-Wa-N raderna', doneByDefault: false },
      { id: 't6', text: 'Förstå skillnaden på Dakuten (゛) och Handakuten (゜)', doneByDefault: false },
      { id: 't7', text: 'Klara 60-sekunders snabbtestet med över 80% rätt', doneByDefault: false },
      { id: 't8', text: 'Testa ditt uttal i mikrofonen i Uttalslabben', doneByDefault: false }
    ]
  },
  {
    weekNumber: 3,
    dates: 'Etapp 3',
    title: 'Flytande läsning & Genki I Kapitel 1',
    focus: 'Läs hela meningar, självpresentationer (Jikoshoukai), siffror 1-100, klockan och enkel X wa Y desu-grammatik.',
    genkiChapter: 'Genki I: Lektion 1 (Dialoger & Grammatik)',
    kanaCovered: ['Alla 71+ Hiragana i praktisk läsning'],
    vocabularyCount: 85,
    grammarFocus: [
      'Subjekt + wa + Predikat + desu (A wa B desu)',
      'Frågepartikeln ka (か)',
      'Ägandepartikeln no (の)',
      'Sifferräkning 1–100 och tidsuttryck (X-ji, X-fun)'
    ],
    tasks: [
      { id: 't9', text: 'Läs Genki I ordlistan helt utan romaji', doneByDefault: false },
      { id: 't10', text: 'Bygg din egen självpresentation i ren Hiragana', doneByDefault: false },
      { id: 't11', text: 'Uppnå minst 1 000 XP i appen', doneByDefault: false }
    ]
  }
];

export const GENKI_L1_VOCABULARY: ExampleWord[] = [
  // Hälsningar & Artighet
  { kana: 'おはよう', romaji: 'ohayou', meaningSv: 'god morgon (informell)', meaningEn: 'good morning', genkiChapter: 'L0' },
  { kana: 'おはようございます', romaji: 'ohayou gozaimasu', meaningSv: 'god morgon (formell)', meaningEn: 'good morning (polite)', genkiChapter: 'L0' },
  { kana: 'こんにちは', romaji: 'konnichiwa', meaningSv: 'god dag / hej', meaningEn: 'good afternoon / hello', genkiChapter: 'L0' },
  { kana: 'こんばんは', romaji: 'konbanwa', meaningSv: 'god kväll', meaningEn: 'good evening', genkiChapter: 'L0' },
  { kana: 'さようなら', romaji: 'sayounara', meaningSv: 'adjö / hejdå (längre avsked)', meaningEn: 'goodbye', genkiChapter: 'L0' },
  { kana: 'おやすみなさい', romaji: 'oyasuminasai', meaningSv: 'god natt', meaningEn: 'good night', genkiChapter: 'L0' },
  { kana: 'ありがとうございます', romaji: 'arigatou gozaimasu', meaningSv: 'tack så mycket', meaningEn: 'thank you very much', genkiChapter: 'L0' },
  { kana: 'すみません', romaji: 'sumimasen', meaningSv: 'ursäkta mig / förlåt', meaningEn: 'excuse me / I am sorry', genkiChapter: 'L0' },
  { kana: 'いいえ', romaji: 'iie', meaningSv: 'nej / ingen orsak', meaningEn: 'no / not at all', genkiChapter: 'L0' },
  { kana: 'はじめまして', romaji: 'hajimemashite', meaningSv: 'trevligt att träffas', meaningEn: 'nice to meet you', genkiChapter: 'L1' },
  { kana: 'よろしくおねがいします', romaji: 'yoroshiku onegaishimasu', meaningSv: 'trevligt att lära känna dig', meaningEn: 'please treat me favorably', genkiChapter: 'L1' },

  // Människor & Skola
  { kana: 'がくせい', kanji: '学生', romaji: 'gakusei', meaningSv: 'student', meaningEn: 'student', genkiChapter: 'L1' },
  { kana: 'だいがくせい', kanji: '大学生', romaji: 'daigakusei', meaningSv: 'universitetsstudent', meaningEn: 'college student', genkiChapter: 'L1' },
  { kana: 'だいがく', kanji: '大学', romaji: 'daigaku', meaningSv: 'universitet / högskola', meaningEn: 'university / college', genkiChapter: 'L1' },
  { kana: 'せんせい', kanji: '先生', romaji: 'sensei', meaningSv: 'lärare / professor', meaningEn: 'teacher / professor', genkiChapter: 'L1' },
  { kana: 'りゅうがくせい', kanji: '留学生', romaji: 'ryuugakusei', meaningSv: 'utbytesstudent', meaningEn: 'international student', genkiChapter: 'L1' },
  { kana: 'ともだち', kanji: '友達', romaji: 'tomodachi', meaningSv: 'vän / kompis', meaningEn: 'friend', genkiChapter: 'L1' },
  { kana: 'わたし', kanji: '私', romaji: 'watashi', meaningSv: 'jag / mig', meaningEn: 'I / myself', genkiChapter: 'L1' },
  { kana: 'なまえ', kanji: '名前', romaji: 'namae', meaningSv: 'namn', meaningEn: 'name', genkiChapter: 'L1' },
  { kana: 'あのう', romaji: 'anou', meaningSv: 'ööh / ursäkta (tvekande)', meaningEn: 'um... / well...', genkiChapter: 'L1' },
  { kana: 'はい', romaji: 'hai', meaningSv: 'ja', meaningEn: 'yes', genkiChapter: 'L1' },
  { kana: 'そうです', romaji: 'sou desu', meaningSv: 'det stämmer', meaningEn: 'that is right', genkiChapter: 'L1' },

  // Ämnen & Språk
  { kana: 'にほんご', kanji: '日本語', romaji: 'nihongo', meaningSv: 'japanska språket', meaningEn: 'Japanese language', genkiChapter: 'L1' },
  { kana: 'えいご', kanji: '英語', romaji: 'eigo', meaningSv: 'engelska språket', meaningEn: 'English language', genkiChapter: 'L1' },
  { kana: 'せんこう', kanji: '専攻', romaji: 'senkou', meaningSv: 'huvudämne / inriktning', meaningEn: 'major', genkiChapter: 'L1' },
  { kana: 'けいざい', kanji: '経済', romaji: 'keizai', meaningSv: 'ekonomi', meaningEn: 'economics', genkiChapter: 'L1' },
  { kana: 'れきし', kanji: '歴史', romaji: 'rekishi', meaningSv: 'historia', meaningEn: 'history', genkiChapter: 'L1' },
  { kana: 'ぶんがく', kanji: '文学', romaji: 'bungaku', meaningSv: 'litteratur', meaningEn: 'literature', genkiChapter: 'L1' },

  // Länder & Nationaliteter
  { kana: 'にほん', kanji: '日本', romaji: 'nihon', meaningSv: 'Japan', meaningEn: 'Japan', genkiChapter: 'L1' },
  { kana: 'スウェーデン', romaji: 'suweeden', meaningSv: 'Sverige', meaningEn: 'Sweden', genkiChapter: 'L1' },
  { kana: 'アメリカ', romaji: 'amerika', meaningSv: 'USA / Amerika', meaningEn: 'USA', genkiChapter: 'L1' },
  { kana: 'ちゅうごく', kanji: '中国', romaji: 'chuugoku', meaningSv: 'Kina', meaningEn: 'China', genkiChapter: 'L1' },
  { kana: 'かんこく', kanji: '韓国', romaji: 'kankoku', meaningSv: 'Sydkorea', meaningEn: 'South Korea', genkiChapter: 'L1' },
  { kana: 'にほんじん', kanji: '日本人', romaji: 'nihonjin', meaningSv: 'japan (person)', meaningEn: 'Japanese person', genkiChapter: 'L1' },

  // Siffror
  { kana: 'ぜろ', romaji: 'zero', meaningSv: 'noll (0)', meaningEn: 'zero (0)', genkiChapter: 'L1' },
  { kana: 'いち', romaji: 'ichi', meaningSv: 'ett (1)', meaningEn: 'one (1)', genkiChapter: 'L1' },
  { kana: 'に', romaji: 'ni', meaningSv: 'två (2)', meaningEn: 'two (2)', genkiChapter: 'L1' },
  { kana: 'さん', romaji: 'san', meaningSv: 'tre (3)', meaningEn: 'three (3)', genkiChapter: 'L1' },
  { kana: 'よん / し', romaji: 'yon / shi', meaningSv: 'fyra (4)', meaningEn: 'four (4)', genkiChapter: 'L1' },
  { kana: 'ご', romaji: 'go', meaningSv: 'fem (5)', meaningEn: 'five (5)', genkiChapter: 'L1' },
  { kana: 'ろく', romaji: 'roku', meaningSv: 'sex (6)', meaningEn: 'six (6)', genkiChapter: 'L1' },
  { kana: 'なな / しち', romaji: 'nana / shichi', meaningSv: 'sju (7)', meaningEn: 'seven (7)', genkiChapter: 'L1' },
  { kana: 'はち', romaji: 'hachi', meaningSv: 'åtta (8)', meaningEn: 'eight (8)', genkiChapter: 'L1' },
  { kana: 'きゅう / く', romaji: 'kyuu / ku', meaningSv: 'nio (9)', meaningEn: 'nine (9)', genkiChapter: 'L1' },
  { kana: 'じゅう', romaji: 'juu', meaningSv: 'tio (10)', meaningEn: 'ten (10)', genkiChapter: 'L1' },
  { kana: 'ひゃく', romaji: 'hyaku', meaningSv: 'hundra (100)', meaningEn: 'hundred (100)', genkiChapter: 'L1' },

  // Tid & Ålder
  { kana: 'いま', kanji: '今', romaji: 'ima', meaningSv: 'nu', meaningEn: 'now', genkiChapter: 'L1' },
  { kana: 'じかん', kanji: '時間', romaji: 'jikan', meaningSv: 'tid / timme', meaningEn: 'time / hour', genkiChapter: 'L1' },
  { kana: 'はん', kanji: '半', romaji: 'han', meaningSv: 'halv (t.ex. klockan halv)', meaningEn: 'half', genkiChapter: 'L1' },
  { kana: 'さい', kanji: '歳', romaji: 'sai', meaningSv: '... år gammal', meaningEn: 'years old', genkiChapter: 'L1' },
  { kana: 'なんさい', kanji: '何歳', romaji: 'nansai', meaningSv: 'hur gammal?', meaningEn: 'how old?', genkiChapter: 'L1' },
  { kana: 'なんじ', kanji: '何時', romaji: 'nanji', meaningSv: 'vad är klockan?', meaningEn: 'what time?', genkiChapter: 'L1' }
];
