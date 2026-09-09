import type { TravelItem, AnkiChapter } from '../types/anki';

// ============================================================================
// LÅT 1: 真夜中のドア〜Stay With Me (Matsubara Miki / 松原みき)
// Sorterad i strikt fallande frekvensordning i det japanska språket (N5 -> N1)
// ============================================================================

export const STAY_WITH_ME_VOCAB: TravelItem[] = [
  // --- Kapitel 1: De allra vanligaste orden (Frekvens 1–11) ---
  {
    japanese: '私',
    hiragana: 'わたし',
    romaji: 'watashi',
    swedish: 'jag, mig',
    english: 'I, me',
    category: 'Toppfrekvens · Pronomen (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「私は私 貴方は貴方と」 (Jag är jag, och du är du). Ett av japanskans mest grundläggande pronomen.'
  },
  {
    japanese: 'する',
    hiragana: 'する',
    romaji: 'suru',
    swedish: 'att göra, kännas',
    english: 'to do, to feel like',
    category: 'Toppfrekvens · Verb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「そんな気もするわ」 (Det känns lite så...). Oregelbundet hjälpverb som bildar massor av vardagsuttryck.'
  },
  {
    japanese: '言う',
    hiragana: 'いう',
    romaji: 'iu',
    swedish: 'att säga',
    english: 'to say',
    category: 'Toppfrekvens · Verb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「昨夜言ってた そんな気もするわ / 口ぐせを言いながら」 Förekommer i låten som dåtid (言ってた), passiv (言われた) och pågående (言いながら).'
  },
  {
    japanese: 'ある',
    hiragana: 'ある',
    romaji: 'aru',
    swedish: 'att finnas, ha',
    english: 'to exist, to have',
    category: 'Toppfrekvens · Verb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「見覚えがある コーヒーのしみ」 (Kaffefläcken som jag känner igen). Används för icke-levande ting.'
  },
  {
    japanese: '来る',
    hiragana: 'くる',
    romaji: 'kuru',
    swedish: 'att komma',
    english: 'to come, arrive',
    category: 'Toppfrekvens · Verb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「二度目の冬が来て」 (När den andra vintern kom). Oregelbundet basverb (kuru -> kite).'
  },
  {
    japanese: '今',
    hiragana: 'いま',
    romaji: 'ima',
    swedish: 'nu, för stunden',
    english: 'now, right now',
    category: 'Toppfrekvens · Tidsadverb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「あの季節が 今 目の前」 (Den där årstiden är nu här rakt framför mina ögon).'
  },
  {
    japanese: '前',
    hiragana: 'まえ',
    romaji: 'mae',
    swedish: 'framför, före',
    english: 'in front of, before',
    category: 'Toppfrekvens · Substantiv (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「あの季節が 今 目の前」 (Rakt framför ögonen på mig).'
  },
  {
    japanese: '目',
    hiragana: 'め',
    romaji: 'me',
    swedish: 'öga, blick',
    english: 'eye, sight',
    category: 'Toppfrekvens · Substantiv (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: 'I uttrycket 目の前 (framför mina ögon). Tecknet föreställer ett öga med pupill.'
  },
  {
    japanese: '気',
    hiragana: 'き',
    romaji: 'ki',
    swedish: 'känsla, sinne, aura',
    english: 'feeling, spirit, mood',
    category: 'Toppfrekvens · Substantiv (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「そんな気もするわ」 (Jag har en sådan känsla / Det känns så).'
  },
  {
    japanese: 'もの',
    hiragana: 'もの',
    romaji: 'mono',
    swedish: 'sak, ting (koncept/materiellt)',
    english: 'thing, entity',
    category: 'Toppfrekvens · Substantiv (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「恋と愛とは 違うものだよと」 (Att förälskelse och kärlek är två helt olika saker).'
  },
  {
    japanese: 'あの',
    hiragana: 'あの',
    romaji: 'ano',
    swedish: 'den där (långt borta/i minnet)',
    english: 'that (over there / remembered)',
    category: 'Toppfrekvens · Pekord (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「あの季節が 今 目の前」 Pekordet あの syftar på något både talare och lyssnare minns väl.'
  },

  // --- Kapitel 2: Vardagliga verb & relationer (Frekvens 12–21) ---
  {
    japanese: '帰る',
    hiragana: 'かえる',
    romaji: 'kaeru',
    swedish: 'att gå hem, återvända',
    english: 'to go home, return',
    category: 'Högfrekvens · Verb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「帰らないでと泣いた」 (Jag grät och bönföll: "Gå inte hem!"). Uttalas med godan-böjning trots -eru.'
  },
  {
    japanese: 'そこ',
    hiragana: 'そこ',
    romaji: 'soko',
    swedish: 'där, hos dig',
    english: 'there',
    category: 'Högfrekvens · Pekord (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「そこに 貴方を感じていたの」 (Jag kände din närvaro precis där).'
  },
  {
    japanese: 'いつも',
    hiragana: 'いつも',
    romaji: 'itsumo',
    swedish: 'alltid, ständigt',
    english: 'always, at all times',
    category: 'Högfrekvens · Adverb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「ふり返ればいつも」 (När jag blickar tillbaka, var du alltid där).'
  },
  {
    japanese: 'まだ',
    hiragana: 'まだ',
    romaji: 'mada',
    swedish: 'fortfarande, ännu',
    english: 'still, yet',
    category: 'Högfrekvens · Adverb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「まだ忘れず 大事にしていた」 (Har ännu inte glömt och bevarar det ömt).'
  },
  {
    japanese: '置く',
    hiragana: 'おく',
    romaji: 'oku',
    swedish: 'att ställa, lägga, placera',
    english: 'to put, place',
    category: 'Högfrekvens · Verb (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「置いたレコードの針」 (Nålen på vinylskivan som jag lade på).'
  },
  {
    japanese: '二人',
    hiragana: 'ふたり',
    romaji: 'futari',
    swedish: 'två personer, vi två',
    english: 'two people, the two of us',
    category: 'Högfrekvens · Räkneord (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「ショーウィンドウに 二人映れば」 (När vi två reflekteras i skyltfönstret). Specialräkneord för 2 personer.'
  },
  {
    japanese: '同じ',
    hiragana: 'おなじ',
    romaji: 'onaji',
    swedish: 'samma, likadan',
    english: 'same, identical',
    category: 'Högfrekvens · Adjektiv (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「同じメロディ 繰り返していた」 (Upprepade samma melodi om och om igen).'
  },
  {
    japanese: '心',
    hiragana: 'こころ',
    romaji: 'kokoro',
    swedish: 'hjärta, själ, sinne',
    english: 'heart, mind, feelings',
    category: 'Högfrekvens · Substantiv (N4)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「離れていった 貴方の心 / 心に穴があいた」 Betyder känslornas och själens kärna, inte den fysiska muskeln.'
  },
  {
    japanese: '貴方',
    hiragana: 'あなた',
    romaji: 'anata',
    swedish: 'du, dig',
    english: 'you',
    category: 'Högfrekvens · Pronomen (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「貴方は貴方と」 (Du är du). Skrivs i modern japanska ofta i Hiragana (あなた), men i sångtexter med kanji 貴方.'
  },
  {
    japanese: '冬',
    hiragana: 'ふゆ',
    romaji: 'fuyu',
    swedish: 'vinter',
    english: 'winter',
    category: 'Medelfrekvens · Årstid (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「二度目の冬が来て」 (När den andra vintern kom).'
  },

  // --- Kapitel 3: Känslor, tid & handlingar (Frekvens 22–32) ---
  {
    japanese: 'コーヒー',
    hiragana: 'こーひー',
    romaji: 'koohii',
    swedish: 'kaffe',
    english: 'coffee',
    category: 'Medelfrekvens · Lånord (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「見覚えがある コーヒーのしみ」 (En kaffefläck jag känner igen).'
  },
  {
    japanese: 'ドア',
    hiragana: 'どあ',
    romaji: 'doa',
    swedish: 'dörr',
    english: 'door',
    category: 'Medelfrekvens · Lånord (N5)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「真夜中のドアをたたき」 (Bultar på dörren mitt i natten).'
  },
  {
    japanese: '違う',
    hiragana: 'ちがう',
    romaji: 'chigau',
    swedish: 'att skilja sig, vara annorlunda',
    english: 'to differ, be different',
    category: 'Medelfrekvens · Verb (N4)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「恋と愛とは 違うものだよと」 ("Förälskelse och sann kärlek är olika saker", sa du).'
  },
  {
    japanese: '忘れる',
    hiragana: 'わすれる',
    romaji: 'wasureru',
    swedish: 'att glömma',
    english: 'to forget',
    category: 'Medelfrekvens · Verb (N4)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「まだ忘れず」 (Utan att ännu ha glömt; -zu är en klassisk nekande form motsvarande -naide).'
  },
  {
    japanese: '泣く',
    hiragana: 'なく',
    romaji: 'naku',
    swedish: 'att gråta',
    english: 'to cry, weep',
    category: 'Medelfrekvens · Verb (N4)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「帰らないでと泣いた」 (Grät och ropade "Gå inte!").'
  },
  {
    japanese: '大事',
    hiragana: 'だいじ',
    romaji: 'daiji',
    swedish: 'viktig, värdefull',
    english: 'important, precious',
    category: 'Medelfrekvens · Na-adjektiv (N4)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「大事にしていた」 (Bevarade och vårdade det som något dyrbart).'
  },
  {
    japanese: '季節',
    hiragana: 'きせつ',
    romaji: 'kisetsu',
    swedish: 'årstid, säsong',
    english: 'season',
    category: 'Medelfrekvens · Substantiv (N4)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「あの季節が 今 目の前」 (Den årstiden återuppstår nu framför mina ögon).'
  },
  {
    japanese: '開く',
    hiragana: 'あく',
    romaji: 'aku',
    swedish: 'att öppna sig, bli ett hål',
    english: 'to open, become hollow',
    category: 'Medelfrekvens · Verb (N4)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「心に穴があいた」 (Det öppnade sig ett tomrum/hål i mitt hjärta).'
  },
  {
    japanese: '感じる',
    hiragana: 'かんじる',
    romaji: 'kanjiru',
    swedish: 'att känna, förnimma',
    english: 'to feel, sense',
    category: 'Medelfrekvens · Verb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「そこに 貴方を感じていたの」 (Jag kände din närvaro där).'
  },
  {
    japanese: '昨夜',
    hiragana: 'ゆうべ',
    romaji: 'yuube',
    swedish: 'igår kväll',
    english: 'last night, yesterday evening',
    category: 'Medelfrekvens · Substantiv (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「昨夜言ってた そんな気もするわ」 Kanji läses traditionellt "yuube" i tal och sång, men kan även läsas "sakuya".'
  },
  {
    japanese: '恋',
    hiragana: 'こい',
    romaji: 'koi',
    swedish: 'förälskelse, passion',
    english: 'romantic love, crush',
    category: 'Medelfrekvens · Substantiv (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「恋と愛とは 違うものだよと」 恋 (koi) handlar om passionerat begär, medan 愛 (ai) är ovillkorlig kärlek.'
  },

  // --- Kapitel 4: Atmosfär & City Pop-miljöer (Frekvens 33–43) ---
  {
    japanese: '愛',
    hiragana: 'あい',
    romaji: 'ai',
    swedish: 'djup kärlek, omtanke',
    english: 'true love, devotion',
    category: 'Medelfrekvens · Substantiv (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「恋と愛とは 違うものだよと」 Djup, varaktig kärlek.'
  },
  {
    japanese: '離れる',
    hiragana: 'はなれる',
    romaji: 'hanareru',
    swedish: 'att glida isär, avlägsna sig',
    english: 'to separate, drift away',
    category: 'Medelfrekvens · Verb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「離れていった 貴方の心」 (Ditt hjärta som gradvis gled ifrån mig).'
  },
  {
    japanese: '抱く',
    hiragana: 'だく',
    romaji: 'daku',
    swedish: 'att omfamna, hålla om',
    english: 'to embrace, hold tight',
    category: 'Medelfrekvens · Verb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「二人の瞬間を抱いて」 (Omfamnar minnet av våra gemensamma ögonblick).'
  },
  {
    japanese: 'たたく',
    hiragana: 'たたく',
    romaji: 'tataku',
    swedish: 'att bulta på, knacka',
    english: 'to knock, beat, strike',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「真夜中のドアをたたき」 (Bultade på dörren mitt i natten).'
  },
  {
    japanese: '繰り返す',
    hiragana: 'くりかえす',
    romaji: 'kurikaesu',
    swedish: 'att upprepa om och om igen',
    english: 'to repeat, reiterate',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「同じメロディ 繰り返していた」 (Spelade samma melodi om och om igen).'
  },
  {
    japanese: '振り返る',
    hiragana: 'ふりかえる',
    romaji: 'furikaeru',
    swedish: 'att blicka tillbaka, se om',
    english: 'to look back, reflect',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「ふり返ればいつも」 (När jag ser tillbaka i backspegeln).'
  },
  {
    japanese: '映る',
    hiragana: 'うつる',
    romaji: 'utsuru',
    swedish: 'att reflekteras, speglas',
    english: 'to be reflected',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「ショーウィンドウに 二人映れば」 (När vi två speglades i fönstret).'
  },
  {
    japanese: '穴',
    hiragana: 'あな',
    romaji: 'ana',
    swedish: 'hål, tomrum',
    english: 'hole, empty void',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「心に穴があいた」 (Ett tomt hål slogs upp i hjärtat).'
  },
  {
    japanese: '真夜中',
    hiragana: 'まよなか',
    romaji: 'mayonaka',
    swedish: 'midnatt, mitt i natten',
    english: 'midnight, dead of night',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「真夜中のドアをたたき」 Titeln på låten! Sammansatt av 真 (äkta/mitt) + 夜中 (nattetid).'
  },
  {
    japanese: '瞬間',
    hiragana: 'しゅんかん',
    romaji: 'shunkan',
    swedish: 'ögonblick, flyktig stund',
    english: 'moment, instant',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「二人の瞬間を抱いて」 (Håller fast vid ögonblicken vi delade).'
  },
  {
    japanese: '暖める',
    hiragana: 'あたためる',
    romaji: 'atatameru',
    swedish: 'att värma, hålla varmt',
    english: 'to warm up, cherish warmly',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「まだ忘れず 暖めてた」 (Har inte glömt, höll minnena varma i hjärtat).'
  },

  // --- Kapitel 5: Låtens unika & poetiska ord (Frekvens 44–54) ---
  {
    japanese: 'レコード',
    hiragana: 'れこーど',
    romaji: 'rekoodo',
    swedish: 'vinylskiva',
    english: 'vinyl record',
    category: 'Katakana · Substantiv',
    lesson: 'Stay With Me (松原みき)',
    notes: '「置いたレコードの針」 (Vinylskivans nål som jag släppte ner).'
  },
  {
    japanese: 'ジャケット',
    hiragana: 'じゃけっと',
    romaji: 'jaketto',
    swedish: 'jacka, kavaj',
    english: 'jacket',
    category: 'Katakana · Substantiv',
    lesson: 'Stay With Me (松原みき)',
    notes: '「グレイのジャケットに 見覚えがある」 (Känner igen den där gråa jackan).'
  },
  {
    japanese: '相変わらず',
    hiragana: 'あいかわらず',
    romaji: 'aikawarazu',
    swedish: 'precis som vanligt, oförändrad',
    english: 'as usual, as ever',
    category: 'Idiomatiskt · Adverb (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「相変らずなのね」 (Du är verkligen likadan som förr).'
  },
  {
    japanese: '針',
    hiragana: 'はり',
    romaji: 'hari',
    swedish: 'nål, pickup-nål',
    english: 'needle, stylus',
    category: 'Substantiv (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「置いたレコードの針」 Syftar här på grammofonens skivspelarnål.'
  },
  {
    japanese: '淋しさ',
    hiragana: 'さびしさ',
    romaji: 'sabishisa',
    swedish: 'ensamhet, vemod',
    english: 'loneliness, sadness',
    category: 'Känsla · Substantiv (N3)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「淋しさまぎらわして」 Skrivs med 淋 eller 寂. Substantivering av adjektivet sabishii (さびしい).'
  },
  {
    japanese: '口癖',
    hiragana: 'くちぐせ',
    romaji: 'kuchiguse',
    swedish: 'favorituttryck, ordstäv man ofta upprepar',
    english: 'pet phrase, habit of saying',
    category: 'Substantiv (N2)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「口ぐせを言いながら」 (Medan jag upprepade dina stående favorituttryck). 口 (mun) + 癖 (vana/ovana).'
  },
  {
    japanese: 'グレイ',
    hiragana: 'ぐれい',
    romaji: 'gurei',
    swedish: 'grå',
    english: 'grey',
    category: 'Katakana · Färg',
    lesson: 'Stay With Me (松原みき)',
    notes: '「グレイのジャケットに」 Katakana-lånord från engelskans grey.'
  },
  {
    japanese: '見覚え',
    hiragana: 'みおぼえ',
    romaji: 'mioboe',
    swedish: 'igenkänning (av något man sett förr)',
    english: 'recognition, remembrance',
    category: 'Substantiv (N2)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「見覚えがある コーヒーのしみ」 Fraser: 見覚えがある = känna igen något till utseendet.'
  },
  {
    japanese: 'しみ',
    hiragana: 'しみ',
    romaji: 'shimi',
    swedish: 'fläck, spillmärke',
    english: 'stain, spot, smudge',
    category: 'Substantiv',
    lesson: 'Stay With Me (松原みき)',
    notes: '「コーヒーのしみ」 Kaffefläck på jackan som väcker gamla minnen till liv.'
  },
  {
    japanese: 'ショーウィンドウ',
    hiragana: 'しょーうぃんどう',
    romaji: 'shoouindou',
    swedish: 'skyltfönster',
    english: 'show window, display window',
    category: 'Katakana · Substantiv',
    lesson: 'Stay With Me (松原みき)',
    notes: '「ショーウィンドウに 二人映れば」 Typisk glamorös stadsmiljö i City Pop-texter.'
  },
  {
    japanese: '紛らわす',
    hiragana: 'まぎらわす',
    romaji: 'magirawasu',
    swedish: 'att skingra, döva, distrahera från smärta',
    english: 'to distract from, to divert, dispel',
    category: 'Poetiskt · Verb (N1)',
    lesson: 'Stay With Me (松原みき)',
    notes: '「淋しさまぎらわして 置いたレコードの針」 (För att försöka döva och skingra ensamheten lade jag på en skiva).'
  }
];

export const STAY_WITH_ME_CHAPTERS: AnkiChapter[] = [
  {
    index: 0,
    title: 'Kapitel 1: De 11 mest grundläggande orden (Frekvens 1–11)',
    itemCount: 11,
    startIndex: 0,
    endIndex: 11,
    isCompleted: false,
    preview: '私 (watashi) → jag, mig'
  },
  {
    index: 1,
    title: 'Kapitel 2: Vardagsverb & relationer (Frekvens 12–21)',
    itemCount: 10,
    startIndex: 11,
    endIndex: 21,
    isCompleted: false,
    preview: '帰る (kaeru) → att gå hem, återvända'
  },
  {
    index: 2,
    title: 'Kapitel 3: Känslor, tid & handlingar (Frekvens 22–32)',
    itemCount: 11,
    startIndex: 21,
    endIndex: 32,
    isCompleted: false,
    preview: 'コーヒー (koohii) → kaffe'
  },
  {
    index: 3,
    title: 'Kapitel 4: Atmosfär & City Pop-miljöer (Frekvens 33–43)',
    itemCount: 11,
    startIndex: 32,
    endIndex: 43,
    isCompleted: false,
    preview: '愛 (ai) → djup kärlek, omtanke'
  },
  {
    index: 4,
    title: 'Kapitel 5: Låtens unika & poetiska ord (Frekvens 44–54)',
    itemCount: 11,
    startIndex: 43,
    endIndex: 54,
    isCompleted: false,
    preview: 'レコード (rekoodo) → vinylskiva'
  }
];


// ============================================================================
// LÅT 2: プラスティック・ラブ (Plastic Love - Mariya Takeuchi / 竹内まりや)
// Sorterad i strikt fallande frekvensordning i det japanska språket (N5 -> N1)
// ============================================================================

export const PLASTIC_LOVE_VOCAB: TravelItem[] = [
  // --- Kapitel 1: De allra vanligaste orden (Frekvens 1–10) ---
  {
    japanese: '人',
    hiragana: 'ひと',
    romaji: 'hito',
    swedish: 'person, människa, någon',
    english: 'person, human, someone',
    category: 'Toppfrekvens · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「私を誘う人は皮肉なものね」 (Männen som bjuder ut mig är verkligen en ödets ironi).'
  },
  {
    japanese: '私',
    hiragana: 'わたし',
    romaji: 'watashi',
    swedish: 'jag, mig',
    english: 'I, me',
    category: 'Toppfrekvens · Pronomen (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「私のことを決して本気で愛さないで」 (Älska mig under inga omständigheter på allvar).'
  },
  {
    japanese: '来る',
    hiragana: 'くる',
    romaji: 'kuru',
    swedish: 'att komma, inträffa',
    english: 'to come, arrive',
    category: 'Toppfrekvens · Verb (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「時間がくれば終わる」 (När tiden är inne tar det slut).'
  },
  {
    japanese: 'それ',
    hiragana: 'それ',
    romaji: 'sore',
    swedish: 'det där, så',
    english: 'that',
    category: 'Toppfrekvens · Pronomen (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「楽しめばそれでいいの」 (Bara man har roligt så räcker det gott så).'
  },
  {
    japanese: '良い',
    hiragana: 'いい',
    romaji: 'ii',
    swedish: 'bra, okej, räcka',
    english: 'good, fine, okay',
    category: 'Toppfrekvens · Adjektiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「それでいいの」 (Det duger, det är helt okej). Ett av japanskans viktigaste i-adjektiv.'
  },
  {
    japanese: '時間',
    hiragana: 'じかん',
    romaji: 'jikan',
    swedish: 'tid, timme',
    english: 'time, hour',
    category: 'Toppfrekvens · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「時間がくれば終わる」 (När tiden väl kommer tar allting slut).'
  },
  {
    japanese: '夜',
    hiragana: 'よる',
    romaji: 'yoru',
    swedish: 'natt, kväll',
    english: 'night, evening',
    category: 'Toppfrekvens · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「昼と夜が逆の暮らし」 (Ett liv där dag och natt har bytt plats).'
  },
  {
    japanese: 'いつも',
    hiragana: 'いつも',
    romaji: 'itsumo',
    swedish: 'alltid, ständigt',
    english: 'always, constantly',
    category: 'Högfrekvens · Adverb (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「私を誘う人は皮肉なものね いつも 彼に似てるわ」 (Männen som bjuder ut mig liknar alltid honom).'
  },
  {
    japanese: '彼',
    hiragana: 'かれ',
    romaji: 'kare',
    swedish: 'han, honom, pojkvän',
    english: 'he, him, boyfriend',
    category: 'Högfrekvens · Pronomen (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「彼に似てるわ」 (De påminner om honom – mitt ex).'
  },
  {
    japanese: '声',
    hiragana: 'こえ',
    romaji: 'koe',
    swedish: 'röst',
    english: 'voice',
    category: 'Högfrekvens · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「ささやく声がしても」 (Även om det hörs viskande röster...).'
  },

  // --- Kapitel 2: Vardag, stil & tidsbegrepp (Frekvens 11–20) ---
  {
    japanese: '昼',
    hiragana: 'ひる',
    romaji: 'hiru',
    swedish: 'dag, dagtid, mitt på dagen',
    english: 'daytime, noon',
    category: 'Högfrekvens · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「昼と夜が逆の暮らしを続けて」 (Vände på dygnet och levde nattliv).'
  },
  {
    japanese: '女',
    hiragana: 'おんな',
    romaji: 'onna',
    swedish: 'kvinna',
    english: 'woman, female',
    category: 'Högfrekvens · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「氷のように冷たい女だと」 (Att jag skulle vara en kvinna kall som is).'
  },
  {
    japanese: 'だけ',
    hiragana: 'だけ',
    romaji: 'dake',
    swedish: 'bara, endast',
    english: 'only, just',
    category: 'Högfrekvens · Begränsningspartikel (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「ハロゲンライトだけ妖しく輝く」 (Bara halogenstrålkastarna lyser förföriskt).'
  },
  {
    japanese: '友だち',
    hiragana: 'ともだち',
    romaji: 'tomodachi',
    swedish: 'vän, kompis',
    english: 'friend, companion',
    category: 'Högfrekvens · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「派手なドレスも靴も 孤独な友だち」 (Den vräkiga klänningen och skorna är mina enda, ensamma vänner).'
  },
  {
    japanese: '心',
    hiragana: 'こころ',
    romaji: 'kokoro',
    swedish: 'hjärta, inre sinne',
    english: 'heart, inner self',
    category: 'Högfrekvens · Substantiv (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「閉ざした心を飾る」 (Pryder mitt tillslutna, låsta hjärta).'
  },
  {
    japanese: '上手',
    hiragana: 'じょうず',
    romaji: 'jouzu',
    swedish: 'skicklig, duktig, smart',
    english: 'skillful, clever',
    category: 'Högfrekvens · Na-adjektiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「上手に打ち込んで」 (Matar skickligt in möten och avsked).'
  },
  {
    japanese: '靴',
    hiragana: 'くつ',
    romaji: 'kutsu',
    swedish: 'skor, klackskor',
    english: 'shoes',
    category: 'Högfrekvens · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「派手なドレスも靴も」 Skrivs med kanji 靴.'
  },
  {
    japanese: '熱い',
    hiragana: 'あつい',
    romaji: 'atsui',
    swedish: 'het, brinnande, intensiv',
    english: 'hot, passionate',
    category: 'Högfrekvens · I-adjektiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「熱いまなざしで」 (Med en glödande, intensiv blick).'
  },
  {
    japanese: '終わる',
    hiragana: 'おわる',
    romaji: 'owaru',
    swedish: 'att ta slut, avslutas',
    english: 'to end, finish',
    category: 'Högfrekvens · Verb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「時間がくれば終わる」 (När tiden är ute är det över).'
  },
  {
    japanese: '覚える',
    hiragana: 'おぼえる',
    romaji: 'oboeru',
    swedish: 'att lära sig, bemästra, minnas',
    english: 'to learn, master, remember',
    category: 'Högfrekvens · Verb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「おぼえた魔術なのよ」 (Det är ett magiskt knep som jag har lärt mig).'
  },

  // --- Kapitel 3: Känsloord & rörelser (Frekvens 21–30) ---
  {
    japanese: '続ける',
    hiragana: 'つづける',
    romaji: 'tsuzukeru',
    swedish: 'att fortsätta, vidmakthålla',
    english: 'to continue, keep up',
    category: 'Högfrekvens · Verb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「暮らしを続けて」 (Fortsatte att leva på det viset).'
  },
  {
    japanese: '踊る',
    hiragana: 'おどる',
    romaji: 'odoru',
    swedish: 'att dansa',
    english: 'to dance',
    category: 'Högfrekvens · Verb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: 'I sammansättningen 踊り明かす (att dansa hela natten fram till gryningen).'
  },
  {
    japanese: '冷たい',
    hiragana: 'つめたい',
    romaji: 'tsumetai',
    swedish: 'kall, kylig, känslokall',
    english: 'cold (to touch / in temperament)',
    category: 'Högfrekvens · I-adjektiv (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「氷のように冷たい女」 Används om föremål och personers temperament (jämför med 寒い som är väder).'
  },
  {
    japanese: '楽しむ',
    hiragana: 'たのしむ',
    romaji: 'tanoshimu',
    swedish: 'att ha kul, njuta av',
    english: 'to enjoy, have fun with',
    category: 'Medelfrekvens · Verb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「恋なんてただのゲーム 楽しめばそれでいいの」 (Kärlek är bara ett spel; om man har roligt räcker det så).'
  },
  {
    japanese: 'ゲーム',
    hiragana: 'げーむ',
    romaji: 'geemu',
    swedish: 'spel',
    english: 'game',
    category: 'Katakana · Substantiv (N5)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「恋なんてただのゲーム」 (Kärlek är bara en lek/ett spel).'
  },
  {
    japanese: 'ずっと',
    hiragana: 'ずっと',
    romaji: 'zutto',
    swedish: 'ända sedan, oavbrutet',
    english: 'all along, continuously ever since',
    category: 'Medelfrekvens · Adverb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「あの日からずっと」 (Ända sedan den där dagen).'
  },
  {
    japanese: '落とす',
    hiragana: 'おとす',
    romaji: 'otosu',
    swedish: 'att tappa, fälla, spilla',
    english: 'to drop, let fall',
    category: 'Medelfrekvens · Verb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「グラスを落として」 (Tappade glaset i golvet).'
  },
  {
    japanese: 'あの日',
    hiragana: 'あのひ',
    romaji: 'ano hi',
    swedish: 'den där dagen, förr i tiden',
    english: 'that day',
    category: 'Medelfrekvens · Tidsuttryck (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「愛に傷ついたあの日から」 (Ända sedan den där dagen då jag blev sårad av kärlek).'
  },
  {
    japanese: '似る',
    hiragana: 'にる',
    romaji: 'niru',
    swedish: 'att likna, påminna om',
    english: 'to resemble, look like',
    category: 'Medelfrekvens · Verb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「彼に似てるわ」 (De liknar honom). Bildar formen 似ている (påminner om).'
  },
  {
    japanese: '急に',
    hiragana: 'きゅうに',
    romaji: 'kyuu ni',
    swedish: 'plötsligt, oväntat',
    english: 'suddenly, abruptly',
    category: 'Medelfrekvens · Adverb (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「急に涙ぐんでも」 (Även om mina ögon plötsligt tåras).'
  },

  // --- Kapitel 4: Kärlek, möten & relationer (Frekvens 31–40) ---
  {
    japanese: '氷',
    hiragana: 'こおり',
    romaji: 'koori',
    swedish: 'is',
    english: 'ice',
    category: 'Medelfrekvens · Substantiv (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「氷のように冷たい女だと」 (En kvinna som är som is).'
  },
  {
    japanese: '恋',
    hiragana: 'こい',
    romaji: 'koi',
    swedish: 'förälskelse, romans',
    english: 'romantic love, passion',
    category: 'Medelfrekvens · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「恋のプログラム / 恋なんてただのゲーム」'
  },
  {
    japanese: '愛',
    hiragana: 'あい',
    romaji: 'ai',
    swedish: 'kärlek, sann hängivenhet',
    english: 'deep love, devotion',
    category: 'Medelfrekvens · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「愛に傷ついたあの日からずっと」 (Ända sedan dagen då jag sårades av kärleken).'
  },
  {
    japanese: '突然',
    hiragana: 'とつぜん',
    romaji: 'totsuzen',
    swedish: 'plötslig, oväntad',
    english: 'sudden, unexpected, abrupt',
    category: 'Medelfrekvens · Adverb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「突然のキスや熱いまなざしで」 (Med en plötslig kyss och heta blickar).'
  },
  {
    japanese: '傷つく',
    hiragana: 'きずつく',
    romaji: 'kizutsuku',
    swedish: 'att bli sårad, ta skada',
    english: 'to get hurt, be wounded',
    category: 'Medelfrekvens · Verb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「愛に傷ついた」 Sammansatt av 傷 (sår) + 付く (fästa).'
  },
  {
    japanese: '愛する',
    hiragana: 'あいする',
    romaji: 'aisuru',
    swedish: 'att älska',
    english: 'to love',
    category: 'Medelfrekvens · Verb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「決して本気で愛さないで」 (Förälska dig inte i mig på allvar!).'
  },
  {
    japanese: 'わけ',
    hiragana: 'わけ',
    romaji: 'wake',
    swedish: 'orsak, skäl, anledning',
    english: 'reason, explanation',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「わけは尋ねないでね」 (Fråga inte efter anledningen). Skrivs i kanji 訳.'
  },
  {
    japanese: '思い出',
    hiragana: 'おもいで',
    romaji: 'omoide',
    swedish: 'minnen, hågkomst',
    english: 'memories, recollections',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「なぜか思い出と重なり合う」 (Av någon anledning överlappar det med mina minnen).'
  },
  {
    japanese: '暮らし',
    hiragana: 'くらし',
    romaji: 'kurashi',
    swedish: 'vardagsliv, leverne',
    english: 'lifestyle, daily living',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「逆の暮らしを続けて」 (Fortsatte att leva ett omvänt nattliv).'
  },
  {
    japanese: '尋ねる',
    hiragana: 'たずねる',
    romaji: 'tazuneru',
    swedish: 'att fråga, förhöra sig om',
    english: 'to ask, inquire',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「わけは尋ねないでね」 (Fråga inte varför).'
  },

  // --- Kapitel 5: Nattliv & City Pop-stämning (Frekvens 41–50) ---
  {
    japanese: '決して',
    hiragana: 'けっして',
    romaji: 'kesshite',
    swedish: 'aldrig någonsin, under inga villkor',
    english: 'never, by no means',
    category: 'Vardagligt · Adverb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「私のことを決して本気で愛さないで」 Följs alltid av en nekande verbform.'
  },
  {
    japanese: '出逢い',
    hiragana: 'であい',
    romaji: 'deai',
    swedish: 'möte, bekantskap',
    english: 'encounter, meeting',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「出逢いと別れ」 Poesikanji 逢 används ofta istället för 合 vid romantiska möten.'
  },
  {
    japanese: '別れ',
    hiragana: 'わかれ',
    romaji: 'wakare',
    swedish: 'avsked, uppbrott, skilsmässa',
    english: 'parting, farewell, breakup',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「出逢いと別れ上手に打ち込んで」 Substantivform av verbet 別れる.'
  },
  {
    japanese: '逆',
    hiragana: 'ぎゃく',
    romaji: 'gyaku',
    swedish: 'motsats, omvänd ordning',
    english: 'reverse, opposite',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「昼と夜が逆の暮らし」 (Ett omvänt liv där natt blev dag).'
  },
  {
    japanese: '本気',
    hiragana: 'ほんき',
    romaji: 'honki',
    swedish: 'på allvar, uppriktighet',
    english: 'seriousness, earnestness',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「決して本気で愛さないで」 (Ta inte känslorna på allvar).'
  },
  {
    japanese: '誘う',
    hiragana: 'さそう',
    romaji: 'sasou',
    swedish: 'att bjuda ut, locka med sig',
    english: 'to invite, ask out, tempt',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「私を誘う人は皮肉なものね」 (Männen som försöker bjuda ut mig).'
  },
  {
    japanese: '輝く',
    hiragana: 'かがやく',
    romaji: 'kagayaku',
    swedish: 'att stråla, glänsa, skimra',
    english: 'to shine, sparkle',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「妖しく輝く」 (Strålar med ett mystiskt och förföriskt sken).'
  },
  {
    japanese: '飾る',
    hiragana: 'かざる',
    romaji: 'kazaru',
    swedish: 'att pryda, dekorera, maskera',
    english: 'to decorate, adorn',
    category: 'Vardagligt · Verb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「閉ざした心を飾る 派手なドレス」 (Kläderna som pryder mitt stängda hjärta).'
  },
  {
    japanese: '眠り',
    hiragana: 'ねむり',
    romaji: 'nemuri',
    swedish: 'sömn, slummer',
    english: 'sleep, slumber',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「眠りにつくころ」 (Vid den tiden då man till slut somnar in).'
  },
  {
    japanese: '高速',
    hiragana: 'こうそく',
    romaji: 'kousoku',
    swedish: 'motorväg, hög fart',
    english: 'expressway, high-speed',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「夜更けの高速で」 Syftar på Shuto Expressway i nattens Tokyo.'
  },

  // --- Kapitel 6: Attityd, drama & clubliv (Frekvens 51–60) ---
  {
    japanese: 'グラス',
    hiragana: 'ぐらす',
    romaji: 'gurasu',
    swedish: 'dricksglas, cocktailglas',
    english: 'glass, drinking glass',
    category: 'Katakana · Substantiv (N4)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「グラスを落として急に涙ぐんでも」 (Även om jag råkar tappa glaset och börjar gråta).'
  },
  {
    japanese: 'なぜか',
    hiragana: 'なぜか',
    romaji: 'nazeka',
    swedish: 'av någon underlig anledning',
    english: 'for some reason, somehow',
    category: 'Vardagligt · Adverb (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「なぜか思い出と重なり合う」 (Av okänd anledning smälter minnena samman).'
  },
  {
    japanese: 'はやり',
    hiragana: 'はやり',
    romaji: 'hayari',
    swedish: 'trend, det som är modernt',
    english: 'trend, craze, fashion',
    category: 'Vardagligt · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「はやりのDiscoで踊り明かす」 Substantiv av verbet hayaru (att vara populärt).'
  },
  {
    japanese: 'プログラム',
    hiragana: 'ぷろぐらむ',
    romaji: 'puroguramu',
    swedish: 'program, kod',
    english: 'program, routine',
    category: 'Katakana · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「恋のプログラムを狂わせないでね」 Futuristisk 80-talsliknelse: kärleken som ett inmatat datorprogram.'
  },
  {
    japanese: 'キス',
    hiragana: 'きす',
    romaji: 'kisu',
    swedish: 'kyss',
    english: 'kiss',
    category: 'Katakana · Substantiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「突然のキスや熱いまなざしで」 Lånord från engelskans kiss.'
  },
  {
    japanese: '派手',
    hiragana: 'はで',
    romaji: 'hade',
    swedish: 'prålig, färgstark, iögonfallande',
    english: 'flashy, showy, flamboyant',
    category: 'Stil · Na-adjektiv (N3)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「派手なドレスも靴も」 80-talserans färgsprakande och eleganta mode.'
  },
  {
    japanese: 'ドレス',
    hiragana: 'どれす',
    romaji: 'doresu',
    swedish: 'klänning, aftonklänning',
    english: 'dress, gown',
    category: 'Katakana · Substantiv',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「派手なドレスも靴も」 Katakana-lånord.'
  },
  {
    japanese: '孤独',
    hiragana: 'こどく',
    romaji: 'kodoku',
    swedish: 'ensamhet, isolering',
    english: 'solitude, loneliness',
    category: 'Känsla · Substantiv (N2)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「孤独な友だち」 Sammansatt av 孤 (ensam) + 独 (ensamstående).'
  },
  {
    japanese: '皮肉',
    hiragana: 'ひにく',
    romaji: 'hiniku',
    swedish: 'ironi, sarkastisk ödets nyck',
    english: 'irony, sarcastic, cynical',
    category: 'Attityd · Na-adjektiv (N2)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「私を誘う人は皮肉なものね」 (Det är en ironisk twist att alla män liknar honom).'
  },
  {
    japanese: 'ささやく',
    hiragana: 'ささやく',
    romaji: 'sasayaku',
    swedish: 'att viska',
    english: 'to whisper, murmur',
    category: 'Verb (N2)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「ささやく声がしても」 Ljudmålande onomatopoetiskt verb.'
  },

  // --- Kapitel 7: Låtens unika metaforer & poesi (Frekvens 61–70) ---
  {
    japanese: '打ち込む',
    hiragana: 'うちこむ',
    romaji: 'uchikomu',
    swedish: 'att knappa in, mata in data',
    english: 'to input, type in data',
    category: 'Handling · Verb (N2)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「出逢いと別れ上手に打ち込んで」 Att skriva in kärleksrelationer i en datormodell.'
  },
  {
    japanese: '狂わせる',
    hiragana: 'くるわせる',
    romaji: 'kuruwaseru',
    swedish: 'att störa, bringa i oordning, förvilla',
    english: 'to throw into disorder, drive mad',
    category: 'Drama · Verb (N1)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「恋のプログラムを狂わせないでね」 (Krascha inte mitt kärleksprogram!).'
  },
  {
    japanese: '夜更け',
    hiragana: 'よふけ',
    romaji: 'yofuke',
    swedish: 'sen natt, vargtimmen, nattens timmar',
    english: 'late at night, small hours',
    category: 'Stämning · Substantiv (N2)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「夜更けの高速で眠りにつくころ」 Sammansatt av 夜 (natt) + 更ける (bli sen).'
  },
  {
    japanese: '魔術',
    hiragana: 'まじゅつ',
    romaji: 'majutsu',
    swedish: 'magi, trollkonst, förtrollning',
    english: 'magic, sorcery, witchcraft',
    category: 'Finess · Substantiv (N2)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「おぼえた魔術なのよ」 (Det är en magisk teknik jag lärt mig för att inte känna smärta).'
  },
  {
    japanese: '閉ざす',
    hiragana: 'とざす',
    romaji: 'tozasu',
    swedish: 'att stänga till, försluta, låsa',
    english: 'to shut, close off, lock away',
    category: 'Känsla · Verb (N1)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「閉ざした心を飾る」 (Förslöt mitt hjärta för att aldrig såras igen).'
  },
  {
    japanese: 'まなざし',
    hiragana: 'まなざし',
    romaji: 'manazashi',
    swedish: 'blick, uttryck i ögonen',
    english: 'gaze, look in one’s eyes',
    category: 'Poetiskt · Substantiv (N1)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「熱いまなざしで」 Skrivs med kanji 眼差し eller i ren hiragana.'
  },
  {
    japanese: '重なり合う',
    hiragana: 'かさなりあう',
    romaji: 'kasanariau',
    swedish: 'att sammanflätas, överlappa varandra',
    english: 'to overlap, intertwine',
    category: 'Poetiskt · Verb (N1)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「思い出と重なり合う」 Sammansättning av 重なる (staplas) + 合う (möta/tillsammans).'
  },
  {
    japanese: '涙ぐむ',
    hiragana: 'なみだぐむ',
    romaji: 'namidagumu',
    swedish: 'att tåras, få tårar i ögonen',
    english: 'to tear up, be moved to tears',
    category: 'Känsla · Verb (N1)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「急に涙ぐんでも わけは尋ねないでね」 (Även om tårarna plötsligt stiger i mina ögon, fråga inte varför).'
  },
  {
    japanese: '妖しい',
    hiragana: 'あやしい',
    romaji: 'ayashii',
    swedish: 'mystisk, förförisk, förtrollande',
    english: 'bewitching, mysteriously alluring',
    category: 'Poetiskt · I-adjektiv (N1)',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「妖しく輝く」 Förtrollande, erotiskt och mystiskt sken från gatljusen.'
  },
  {
    japanese: '踊り明かす',
    hiragana: 'おどりあかす',
    romaji: 'odoriakasu',
    swedish: 'att dansa natten lång ända till gryningen',
    english: 'to dance the night away until dawn',
    category: 'Nattliv · Sammansatt verb',
    lesson: 'Plastic Love (竹内まりや)',
    notes: '「はやりのDiscoで踊り明かすうちに」 踊る (dansa) + 明かす (tillbringa natten tills det ljusnar).'
  }
];

export const PLASTIC_LOVE_CHAPTERS: AnkiChapter[] = [
  {
    index: 0,
    title: 'Kapitel 1: De 10 mest grundläggande orden (Frekvens 1–10)',
    itemCount: 10,
    startIndex: 0,
    endIndex: 10,
    isCompleted: false,
    preview: '人 (hito) → person, människa'
  },
  {
    index: 1,
    title: 'Kapitel 2: Vardag, stil & tidsbegrepp (Frekvens 11–20)',
    itemCount: 10,
    startIndex: 10,
    endIndex: 20,
    isCompleted: false,
    preview: '昼 (hiru) → dag, dagtid'
  },
  {
    index: 2,
    title: 'Kapitel 3: Känsloord & rörelser (Frekvens 21–30)',
    itemCount: 10,
    startIndex: 20,
    endIndex: 30,
    isCompleted: false,
    preview: '続ける (tsuzukeru) → att fortsätta'
  },
  {
    index: 3,
    title: 'Kapitel 4: Kärlek, möten & relationer (Frekvens 31–40)',
    itemCount: 10,
    startIndex: 30,
    endIndex: 40,
    isCompleted: false,
    preview: '氷 (koori) → is'
  },
  {
    index: 4,
    title: 'Kapitel 5: Nattliv & City Pop-stämning (Frekvens 41–50)',
    itemCount: 10,
    startIndex: 40,
    endIndex: 50,
    isCompleted: false,
    preview: '決して (kesshite) → aldrig någonsin'
  },
  {
    index: 5,
    title: 'Kapitel 6: Attityd, drama & clubliv (Frekvens 51–60)',
    itemCount: 10,
    startIndex: 50,
    endIndex: 60,
    isCompleted: false,
    preview: 'グラス (gurasu) → dricksglas'
  },
  {
    index: 6,
    title: 'Kapitel 7: Låtens unika metaforer & poesi (Frekvens 61–70)',
    itemCount: 10,
    startIndex: 60,
    endIndex: 70,
    isCompleted: false,
    preview: '打ち込む (uchikomu) → att knappa in data'
  }
];
