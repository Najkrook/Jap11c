export interface IntensiveTimeBlock {
  id: string;
  timeLabel: string; // T.ex. "Förmiddag (Session 1)"
  duration: string;  // T.ex. "45 minuter"
  title: string;
  kanaList: string[]; // ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ']
  description: string;
  keyMnemonicTips: string[];
  tasks: { id: string; text: string; actionType: 'chart' | 'game' | 'srs' | 'draw' | 'read' }[];
  targetGameLevel?: number; // Nivå i arkadspelet
}

export interface IntensiveDayPlan {
  dayNumber: number;
  dayTitle: string;
  subtitle: string;
  focusText: string;
  estimatedHours: string;
  blocks: IntensiveTimeBlock[];
  dailyProTip: string;
}

export const INTENSIVE_DAYS_DATA: IntensiveDayPlan[] = [
  {
    dayNumber: 1,
    dayTitle: 'Dag 1: Halva Baskana (A till NO)',
    subtitle: 'De första 25 grundtecknen',
    focusText: 'Bygg grunden med vokalerna och K-, S-, T- och N-raderna med svenska minnesbilder och första repetitionen.',
    estimatedHours: 'Ca 2,5 – 3 timmar totalt',
    dailyProTip: 'Rita varje tecken minst två gånger med pekfingret eller musen medan du säger ljudet högt. Kopplingen hand-öga-röst skapar trefaldigt starkare minnesspår!',
    blocks: [
      {
        id: 'd1_b1',
        timeLabel: 'Block 1 • Förmiddag',
        duration: '45 minuter',
        title: 'Vokalerna (A, I, U, E, O) & K-raden (Ka, Ki, Ku, Ke, Ko)',
        kanaList: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'],
        description: 'Börja med de 5 rena vokalerna som alla andra stavelser bygger på, följt av Ka-raden.',
        keyMnemonicTips: [
          'あ (a) = Apel (ett äpple med stjälk)',
          'い (i) = Två linjer som Igelkottstaggar',
          'う (u) = En person som gör Uppsittning',
          'え (e) = Ett Ekorr-öga',
          'お (o) = Golfboll På green',
          'か (ka) = En Kaka som skärs',
          'き (ki) = En Nyckel (Key)'
        ],
        tasks: [
          { id: 'd1_t1', text: 'Kolla in de 10 tecknen i 50-tabellen och lyssna på uttalet', actionType: 'chart' },
          { id: 'd1_t2', text: 'Kör Shinkansen Rush: Station 1 (Tokyo - Vokaler & Ka-raden)', actionType: 'game' },
          { id: 'd1_t3', text: 'Träna streckordningen på ritbrädan för de 10 tecknen', actionType: 'draw' }
        ],
        targetGameLevel: 1
      },
      {
        id: 'd1_b2',
        timeLabel: 'Block 2 • Eftermiddag',
        duration: '45 minuter',
        title: 'S-raden (Sa, Shi, Su, Se, So) & T-raden (Ta, Chi, Tsu, Te, To)',
        kanaList: ['さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と'],
        description: 'Tio viktiga konsonanter. Lägg extra märke till specialuttalen: SHI (inte "si") och CHI/TSU (inte "ti/tu").',
        keyMnemonicTips: [
          'さ (sa) = En Sax (liknar ki men har bara 1 tvärstreck)',
          'し (shi) = En Metkrok i Sjön',
          'す (su) = En Snurra med en ögla',
          'ち (chi) = Ser ut som en siffra 5 (Cheerleader)',
          'つ (tsu) = En stor Tsunami-våg'
        ],
        tasks: [
          { id: 'd1_t4', text: 'Se skillnaden mellan さ (sa) och き (ki) i 50-tabellen', actionType: 'chart' },
          { id: 'd1_t5', text: 'Kör Shinkansen Rush: Station 2 (Nagoya - Sa & Ta tvillingar)', actionType: 'game' },
          { id: 'd1_t6', text: 'Kör en 10-korts repetition med SRS Minneskort', actionType: 'srs' }
        ],
        targetGameLevel: 2
      },
      {
        id: 'd1_b3',
        timeLabel: 'Block 3 • Kväll & Konsolidering',
        duration: '40 minuter',
        title: 'N-raden (Na, Ni, Nu, Ne, No) & Kvällsrepetition',
        kanaList: ['な', 'に', 'ぬ', 'ね', 'の'],
        description: 'Knyt ihop första halvan av alfabetet med N-raden. Avsluta med en kort session minneskort precis innan du lägger dig.',
        keyMnemonicTips: [
          'な (na) = Nunna som ber vid ett kors',
          'に (ni) = Två nålar (Ni = 2 på japanska)',
          'ぬ (nu) = Nudlar med ätpinnar och en ögla',
          'ね (ne) = Neko (Katt) med en snurrad svans',
          'の (no) = Ett runt Förbudsmärke (NO!)'
        ],
        tasks: [
          { id: 'd1_t7', text: 'Kör Shinkansen Rush: Repetera Station 1 & 2', actionType: 'game' },
          { id: 'd1_t8', text: 'Kör 5 minuter SRS-minneskort för alla 25 tecken från Dag 1', actionType: 'srs' },
          { id: 'd1_t9', text: 'Slutkontroll: Testa att skriva あ till の på ett papper', actionType: 'draw' }
        ],
        targetGameLevel: 5
      }
    ]
  },
  {
    dayNumber: 2,
    dayTitle: 'Dag 2: Slutför Baskana & Dakuten (46+ tecken)',
    subtitle: 'Resterande baskana + röstade ljud (゛ ゜)',
    focusText: 'Idag slutför du alla 46 grundtecken (H, M, Y, R, W, N) samt lär dig den enkla regeln för Dakuten (GA, ZA, DA, BA, PA).',
    estimatedHours: 'Ca 2,5 – 3 timmar totalt',
    dailyProTip: 'Dakuten (゛) och Handakuten (゜) är superlätta: det är samma tecken som du redan kan, bara med två fnuttar eller en liten cirkel som ändrar konsonantljudet!',
    blocks: [
      {
        id: 'd2_b1',
        timeLabel: 'Block 1 • Förmiddag',
        duration: '45 minuter',
        title: 'H-raden (Ha, Hi, Fu, He, Ho) & M-raden (Ma, Mi, Mu, Me, Mo)',
        kanaList: ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も'],
        description: 'Tio tecken med många roliga minnesbilder. Se upp för skillnaden mellan は (ha) och ほ (ho) samt め (me) och ぬ (nu).',
        keyMnemonicTips: [
          'は (ha) = Halmhatt (med stolpe och ögla)',
          'ひ (hi) = Ett stort leende (Hihihi)',
          'ふ (fu) = Berget Fuji',
          'へ (he) = En backe / Höjd (Heja heja!)',
          'ほ (ho) = Som ha men med ett tak överst (Hatt)',
          'ま (ma) = Mamma med två hårspännen',
          'む (mu) = En Ko som säger Mu (med horn och mule)'
        ],
        tasks: [
          { id: 'd2_t1', text: 'Studera H- och M-raderna i 50-tabellen', actionType: 'chart' },
          { id: 'd2_t2', text: 'Kör Shinkansen Rush: Station 3 (Kyoto - Na, Ha, Ma)', actionType: 'game' },
          { id: 'd2_t3', text: 'Öva handskrift för de 10 tecknen på ritbrädan', actionType: 'draw' }
        ],
        targetGameLevel: 3
      },
      {
        id: 'd2_b2',
        timeLabel: 'Block 2 • Eftermiddag',
        duration: '45 minuter',
        title: 'Y-, R-, W-raden & Ensamma N (Alla 46 baskana klara!)',
        kanaList: ['や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'],
        description: 'Sista spurten för grundalfabetet! R-ljudet är ett snabbt klaff-ljud och N (ん) är den enda konsonanten som kan stå helt ensam.',
        keyMnemonicTips: [
          'や (ya) = En Yak-oxe',
          'ゆ (yu) = En fisk som simmar',
          'よ (yo) = En Jojo',
          'ら (ra) = En Råtta som sitter',
          'る (ru) = En Känguru med pung (liten ögla)',
          'ろ (ro) = Som ru men rånad på sin ögla',
          'わ (wa) = Vattenfall',
          'ん (n) = Skrivs som ett svenskt skrivstils-n'
        ],
        tasks: [
          { id: 'd2_t4', text: 'Kör Shinkansen Rush: Repetera Station 1, 2 och 3', actionType: 'game' },
          { id: 'd2_t5', text: 'Kör Flervalstestet i Övningshubben för att testa alla 46 tecken', actionType: 'read' },
          { id: 'd2_t6', text: 'Stort grattis – du kan nu alla 46 grundläggande Hiragana!', actionType: 'chart' }
        ],
        targetGameLevel: 3
      },
      {
        id: 'd2_b3',
        timeLabel: 'Block 3 • Kväll: Dakuten (゛) & Handakuten (゜)',
        duration: '40 minuter',
        title: 'Röstade ljud: GA, ZA, DA, BA och PA (25 nya ljud på 15 minuter!)',
        kanaList: ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ', 'だ', 'ぢ', 'づ', 'で', 'ど', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
        description: 'Två fnuttar (Dakuten ゛) gör konsonanten tonande: K->G, S->Z/J, T->D, H->B. En liten cirkel (゜) gör H->P!',
        keyMnemonicTips: [
          'か (ka) + ゛ = が (ga)',
          'さ (sa) + ゛ = ざ (za)',
          'し (shi) + ゛ = じ (ji)',
          'は (ha) + ゛ = ば (ba)',
          'は (ha) + ゜ = ぱ (pa) (Handakuten)'
        ],
        tasks: [
          { id: 'd2_t7', text: 'Kör Shinkansen Rush: Station 4 (Shin-Osaka - Dakuten & Handakuten)', actionType: 'game' },
          { id: 'd2_t8', text: 'Kör 15 minuter SRS-minneskort för hela alfabetet före läggdags', actionType: 'srs' }
        ],
        targetGameLevel: 4
      }
    ]
  },
  {
    dayNumber: 3,
    dayTitle: 'Dag 3: Kombinationer, Läsflyt & Diagnostiskt Slutprov',
    subtitle: 'Yōon, Sokuon & Verklig textläsning',
    focusText: 'Idag sätter du ihop allt till flytande läsning! Lär dig kombinationsljud (kya, sho...), dubbelkonsonanter (っ), läs riktiga Genki-ord och gör slutprovet.',
    estimatedHours: 'Ca 2 – 2,5 timmar totalt',
    dailyProTip: 'Försök att aldrig läsa romaji från och med idag. Tvinga hjärnan att direkt avkoda de japanska tecknen till ljud – då lossnar flytet på riktigt!',
    blocks: [
      {
        id: 'd3_b1',
        timeLabel: 'Block 1 • Förmiddag',
        duration: '40 minuter',
        title: 'Kombinationsljud (Yōon きゃ, しゅ, ちょ...) & Dubbelkonsonant (Litet っ)',
        kanaList: ['きゃ', 'きゅ', 'きょ', 'しゃ', 'しゅ', 'しょ', 'ちゃ', 'ちゅ', 'ちょ', 'にゃ', 'ひゃ', 'みゃ', 'りゃ', 'ぎゃ', 'じゃ', 'びゃ', 'ぴゃ'],
        description: 'Ett litet ya/yu/yo (ゃ ゅ ょ) efter en I-stavelse bildar ett enda sammansatt ljud. Ett litet っ (sokuon) skapar ett taktslag av tystnad före nästa konsonant.',
        keyMnemonicTips: [
          'き (ki) + ゃ (litet ya) = きゃ (kya) [1 stavelse]',
          'し (shi) + ゅ (litet yu) = しゅ (shu)',
          'ち (chi) + ょ (litet yo) = ちょ (cho)',
          'きって (kitte = frimärke): Litet っ ger en paus [ki - paus - te]'
        ],
        tasks: [
          { id: 'd3_t1', text: 'Läs om Yōon och Sokuon i Fonetikguiden (Uttalslabben)', actionType: 'read' },
          { id: 'd3_t2', text: 'Gör Minimal Pairs-lyssningsövningen i Uttalslabben', actionType: 'chart' }
        ]
      },
      {
        id: 'd3_b2',
        timeLabel: 'Block 2 • Eftermiddag',
        duration: '45 minuter',
        title: 'Praktisk Ordläsning (Genki I Ordförråd)',
        kanaList: ['おはよう', 'こんにちは', 'がくせい', 'だいがく', 'ともだち', 'にほんご', 'せんせい'],
        description: 'Träna på att läsa riktiga japanska ord helt utan romaji i Genki I-ordläsaren.',
        keyMnemonicTips: [
          'Läs ordet högt med naturlig rytm',
          'Klappa takten: varje kana = 1 taktslag (mora)',
          'Använd talsyntesen för att kontrollera uttalet'
        ],
        tasks: [
          { id: 'd3_t3', text: 'Öppna Genki I Ordläsaren i Övningshubben och läs 20 ord', actionType: 'read' },
          { id: 'd3_t4', text: 'Kör 60-sekunders snabbtestet – sikta på över 15 rätt!', actionType: 'game' }
        ]
      },
      {
        id: 'd3_b3',
        timeLabel: 'Block 3 • Kväll: Diagnostiskt Slutprov 📝',
        duration: '35 minuter',
        title: 'Slutprov & Kursdiplom',
        kanaList: ['あ' , 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ', 'ま', 'み', 'む', 'め', 'も', 'や', 'ゆ', 'よ', 'ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'],
        description: 'Slutför det diagnostiska provet nedan för att kontrollera att du bemästrat hela alfabetet.',
        keyMnemonicTips: [
          'Gå igenom alla 46 tecken',
          'Systemet identifierar automatiskt eventuella tecken du behöver repetera lite mer'
        ],
        tasks: [
          { id: 'd3_t5', text: 'Starta och slutför det Diagnostiska Slutprovet nedan', actionType: 'read' }
        ]
      }
    ]
  }
];

export const DIAGNOSTIC_EXAM_ITEMS = [
  { kana: 'あ', romaji: 'a', options: ['a', 'o', 'e', 'u'], row: 'A-raden' },
  { kana: 'か', romaji: 'ka', options: ['ka', 'ta', 'sa', 'ke'], row: 'K-raden' },
  { kana: 'し', romaji: 'shi', options: ['shi', 'tsu', 'chi', 'so'], row: 'S-raden' },
  { kana: 'つ', romaji: 'tsu', options: ['tsu', 'shi', 'te', 'chi'], row: 'T-raden' },
  { kana: 'ぬ', romaji: 'nu', options: ['nu', 'ne', 'me', 'wa'], row: 'N-raden' },
  { kana: 'ふ', romaji: 'fu', options: ['fu', 'hi', 'ho', 'u'], row: 'H-raden' },
  { kana: 'む', romaji: 'mu', options: ['mu', 'su', 'ma', 'me'], row: 'M-raden' },
  { kana: 'ゆ', romaji: 'yu', options: ['yu', 'yo', 'ya', 'mo'], row: 'Y-raden' },
  { kana: 'れ', romaji: 're', options: ['re', 'ne', 'wa', 'ru'], row: 'R-raden' },
  { kana: 'を', romaji: 'wo', options: ['wo', 'wa', 'o', 'ro'], row: 'W-raden' },
  { kana: 'ん', romaji: 'n', options: ['n', 'so', 'shi', 'te'], row: 'N' },
  { kana: 'が', romaji: 'ga', options: ['ga', 'ka', 'za', 'da'], row: 'Dakuten' },
  { kana: 'じ', romaji: 'ji', options: ['ji', 'zu', 'shi', 'chi'], row: 'Dakuten' },
  { kana: 'ぱ', romaji: 'pa', options: ['pa', 'ba', 'ha', 'po'], row: 'Handakuten' },
  { kana: 'きっ', romaji: 'kit', options: ['ki (med sokuon)', 'kiya', 'kiku', 'kichi'], row: 'Sokuon' }
];
