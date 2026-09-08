import type { TravelItem } from '../types/anki';

export interface GenkiVocabItem extends TravelItem {
  japanese: string;
  hiragana?: string;
  romaji: string;
  swedish: string;
  english: string;
  category: string;
  lesson: string;
  notes?: string;
  tags?: string[];
}

export const GENKI_EXAM_VOCAB: GenkiVocabItem[] = [
  // ─── Kapitel 0: Hälsningsfraser 1 (s. 32) ───
  {
    japanese: 'おはよう。',
    romaji: 'Ohayoo.',
    swedish: 'God morgon (informell / till vänner)',
    english: 'Good morning.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Informell morgonhälsning. Används mot vänner eller familj.'
  },
  {
    japanese: 'おはよう ございます。',
    romaji: 'Ohayoo gozaimasu.',
    swedish: 'God morgon (formell / artig)',
    english: 'Good morning. (polite)',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Artig morgonhälsning till lärare, chefer och personer man inte känner väl.'
  },
  {
    japanese: 'こんにちは。',
    romaji: 'Konnichiwa.',
    swedish: 'God dag / Hej',
    english: 'Good afternoon.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'OBS! Sista stavelsen stavas med は (ha), men uttalas "wa".'
  },
  {
    japanese: 'こんばんは。',
    romaji: 'Konbanwa.',
    swedish: 'God kväll',
    english: 'Good evening.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'OBS! Sista stavelsen stavas med は (ha), men uttalas "wa".'
  },
  {
    japanese: 'さようなら。',
    romaji: 'Sayoonara.',
    swedish: 'Adjö / Farväl',
    english: 'Good-bye.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Längre avsked (när man inte ska ses på en längre stund).'
  },
  {
    japanese: 'おやすみ（なさい）。',
    romaji: 'Oyasumi (nasai).',
    swedish: 'God natt',
    english: 'Good night.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'なさい gör det artigt. おやすみ kan användas bland nära vänner.'
  },
  {
    japanese: 'ありがとう。',
    romaji: 'Arigatoo.',
    swedish: 'Tack (informellt)',
    english: 'Thank you.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Informellt tack mellan vänner.'
  },
  {
    japanese: 'ありがとう ございます。',
    romaji: 'Arigatoo gozaimasu.',
    swedish: 'Tack så mycket (formellt / artigt)',
    english: 'Thank you. (polite)',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Artig tacksägelse till lärare, överordnade och främlingar.'
  },
  {
    japanese: 'すみません。',
    romaji: 'Sumimasen.',
    swedish: 'Ursäkta mig / Förlåt',
    english: 'Excuse me.; I\'m sorry.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Används för att påkalla uppmärksamhet, be om ursäkt eller tacka för en tjänst.'
  },
  {
    japanese: 'いいえ。',
    romaji: 'Iie.',
    swedish: 'Nej / Ingen orsak / Det var så lite',
    english: 'No.; Not at all.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Betyder både "Nej" och svar på tack ("Det var så lite").'
  },

  // ─── Kapitel 0: Hälsningsfraser 2 (s. 32) ───
  {
    japanese: 'いってきます。',
    romaji: 'Itte kimasu.',
    swedish: 'Jag går nu / Vi ses sen',
    english: 'I\'ll go and come back.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Sägs av personen som lämnar hemmet eller kontoret.'
  },
  {
    japanese: 'いってらっしゃい。',
    romaji: 'Itterasshai.',
    swedish: 'Hejdå / Ha det så bra',
    english: 'Please go and come back.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Sägs till den person som just gett sig av hemifrån.'
  },
  {
    japanese: 'ただいま。',
    romaji: 'Tadaima.',
    swedish: 'Jag är hemma!',
    english: 'I\'m home.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Sägs när man kommer hem och kliver in genom dörren.'
  },
  {
    japanese: 'おかえり（なさい）。',
    romaji: 'Okaeri (nasai).',
    swedish: 'Välkommen hem!',
    english: 'Welcome home.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Svar till den som ropar "tadaima". なさい gör det artigt.'
  },
  {
    japanese: 'いただきます。',
    romaji: 'Itadakimasu.',
    swedish: 'Tack för maten (före måltiden)',
    english: 'Thank you for the meal. (before eating)',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Sägs med händerna ihop innan man börjar äta ("Jag tar ödmjukt emot").'
  },
  {
    japanese: 'ごちそうさま（でした）。',
    romaji: 'Gochisoosama (deshita).',
    swedish: 'Tack för maten (efter måltiden)',
    english: 'Thank you for the meal. (after eating)',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Sägs när man ätit klart. でした läggs till för artig form till kock/värd.'
  },
  {
    japanese: 'はじめまして。',
    romaji: 'Hajimemashite.',
    swedish: 'Trevligt att träffas (första mötet)',
    english: 'How do you do?',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Inleder en självpresentation. Sägs enbart allra första gången man träffas.'
  },
  {
    japanese: '〜です。',
    romaji: '... desu.',
    swedish: '... är / Jag är ... (kopula)',
    english: 'I am ....',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Artig kopula ("är"). T.ex. たなかです (Tanaka desu = Jag är Tanaka).'
  },
  {
    japanese: 'よろしく おねがいします。',
    romaji: 'Yoroshiku onegai shimasu.',
    swedish: 'Trevligt att lära känna dig / Ta väl hand om mig',
    english: 'Nice to meet you.',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    notes: 'Avslutar en presentation ("Ser fram emot gott samarbete").'
  },

  // ─── Kapitel 1: Skola & Studier (s. 38) ───
  {
    japanese: 'だいがく',
    romaji: 'daigaku',
    swedish: 'universitet / högskola',
    english: 'college; university',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 大学. Förekommer i dialogen.'
  },
  {
    japanese: 'こうこう',
    romaji: 'kookoo',
    swedish: 'gymnasium / gymnasieskola',
    english: 'high school',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 高校. Långa vokaler: kōkō.'
  },
  {
    japanese: 'がくせい',
    romaji: 'gakusee',
    swedish: 'student / elev',
    english: 'student',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 学生. Förekommer i dialogen.'
  },
  {
    japanese: 'だいがくせい',
    romaji: 'daigakusee',
    swedish: 'universitetsstudent',
    english: 'college student',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 大学生. Sammansatt av だいがく (universitet) + せい (student).'
  },
  {
    japanese: 'りゅうがくせい',
    romaji: 'ryuugakusee',
    swedish: 'utbytesstudent / internationell student',
    english: 'international student',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 留学生. Förekommer i dialogen. Yōon: りゅ (ryu).'
  },
  {
    japanese: 'せんせい',
    romaji: 'sensee',
    swedish: 'lärare / professor',
    english: 'teacher; Professor...',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 先生. Används även som tilltalsord och hederstitel.'
  },
  {
    japanese: '〜ねんせい',
    romaji: '... nensee',
    swedish: '...-årsstudent / årskurs ...',
    english: '... year student',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 〜年生. Suffix för skolår / årskurs.'
  },
  {
    japanese: 'いちねんせい',
    romaji: 'ichinensee',
    swedish: 'förstaårsstudent / etta',
    english: 'first-year student',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 一年生. いち (1) + ねんせい (årskurs).'
  },
  {
    japanese: 'せんこう',
    romaji: 'senkoo',
    swedish: 'huvudämne / studieinriktning',
    english: 'major',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 専攻. Förekommer i dialogen.'
  },

  // ─── Kapitel 1: Människor & Relationer (s. 38) ───
  {
    japanese: 'わたし',
    romaji: 'watashi',
    swedish: 'jag',
    english: 'I',
    category: 'Människor',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 私. Standardsättet att säga "jag" på artig japanska.'
  },
  {
    japanese: 'ともだち',
    romaji: 'tomodachi',
    swedish: 'vän / kompis',
    english: 'friend',
    category: 'Människor',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 友達.'
  },
  {
    japanese: '〜さん',
    romaji: '... san',
    swedish: 'herr / fru / fröken',
    english: 'Mr./Ms....',
    category: 'Människor',
    lesson: 'Genki I s. 38',
    notes: 'Artighetssuffix efter andras namn (aldrig sitt eget).'
  },
  {
    japanese: '〜じん',
    romaji: '... jin',
    swedish: '...-person / person från ...',
    english: '... people',
    category: 'Människor',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 〜人. Nationalitetssuffix efter ett land.'
  },
  {
    japanese: 'にほんじん',
    romaji: 'nihonjin',
    swedish: 'japan / japansk person',
    english: 'Japanese people',
    category: 'Människor',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 日本人. にほん (Japan) + じん (person).'
  },

  // ─── Kapitel 1: Klockan & Tidsuttryck (s. 38) ───
  {
    japanese: 'いま',
    romaji: 'ima',
    swedish: 'nu',
    english: 'now',
    category: 'Tid',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 今.'
  },
  {
    japanese: 'ごぜん',
    romaji: 'gozen',
    swedish: 'förmiddag (f.m. / A.M.)',
    english: 'A.M.',
    category: 'Tid',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 午前. Placeras före klockslaget (t.ex. ごぜんくじ = kl 9 f.m.).'
  },
  {
    japanese: 'ごご',
    romaji: 'gogo',
    swedish: 'eftermiddag (e.m. / P.M.)',
    english: 'P.M.',
    category: 'Tid',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 午後. Placeras före klockslaget (t.ex. ごごさんじ = kl 3 e.m.).'
  },
  {
    japanese: '〜じ',
    romaji: '... ji',
    swedish: 'klockan ...',
    english: 'o\'clock',
    category: 'Tid',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 〜時. Suffix för hela timmar.'
  },
  {
    japanese: 'いちじ',
    romaji: 'ichiji',
    swedish: 'klockan ett (1:00)',
    english: 'one o\'clock',
    category: 'Tid',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 一時. いち (1) + じ (klockan).'
  },
  {
    japanese: 'はん',
    romaji: 'han',
    swedish: 'halv (om tid)',
    english: 'half',
    category: 'Tid',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 半. Placeras efter timmen: [timme] + はん.'
  },
  {
    japanese: 'にじはん',
    romaji: 'niji han',
    swedish: 'halv tre / 2:30 (ordagrant: två och en halv)',
    english: 'half past two',
    category: 'Tid',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 二時半. OBS! Betyder 2:30 (på svenska säger vi "halv tre").'
  },

  // ─── Kapitel 1: Telefon & Språk (s. 38) ───
  {
    japanese: 'にほん',
    romaji: 'Nihon',
    swedish: 'Japan',
    english: 'Japan',
    category: 'Övrigt',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 日本.'
  },
  {
    japanese: 'アメリカ',
    hiragana: 'あめりか',
    romaji: 'Amerika',
    swedish: 'USA / Amerika',
    english: 'U.S.A.',
    category: 'Övrigt',
    lesson: 'Genki I s. 38',
    notes: 'Skrivs i Katakana: アメリカ (hiragana: あめりか).'
  },
  {
    japanese: '〜ご',
    romaji: '... go',
    swedish: '...-språk',
    english: '... language',
    category: 'Övrigt',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 〜語. Suffix för språk.'
  },
  {
    japanese: 'にほんご',
    romaji: 'nihongo',
    swedish: 'japanska (språket)',
    english: 'Japanese language',
    category: 'Övrigt',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 日本語. にほん (Japan) + ご (språk).'
  },
  {
    japanese: '〜さい',
    romaji: '... sai',
    swedish: '... år gammal',
    english: '... years old',
    category: 'Övrigt',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 〜歳. Räknesuffix för ålder.'
  },
  {
    japanese: 'でんわ',
    romaji: 'denwa',
    swedish: 'telefon',
    english: 'telephone',
    category: 'Övrigt',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 電話.'
  },
  {
    japanese: '〜ばん',
    romaji: '... ban',
    swedish: 'nummer ...',
    english: 'number...',
    category: 'Övrigt',
    lesson: 'Genki I s. 38',
    notes: 'Kanji: 〜番. Suffix för nummer/ordningsföljd.'
  },

  // ─── Kapitel 1: Allmänt & Uttryck (s. 39) ───
  {
    japanese: 'ばんごう',
    romaji: 'bangoo',
    swedish: 'nummer / telefonnummer',
    english: 'number',
    category: 'Allmänt',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 番号. でんわばんごう = telefonnummer.'
  },
  {
    japanese: 'なまえ',
    romaji: 'namae',
    swedish: 'namn',
    english: 'name',
    category: 'Allmänt',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 名前. おなまえ = namn (artig form när man frågar).'
  },
  {
    japanese: 'なん / なに',
    romaji: 'nan/nani',
    swedish: 'vad',
    english: 'what',
    category: 'Allmänt',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 何. なん före d/t/n och räkneord; なに annars.'
  },
  {
    japanese: 'あのう',
    romaji: 'anoo',
    swedish: 'öhm... / ursäkta (tvekande)',
    english: 'um...',
    category: 'Uttryck',
    lesson: 'Genki I s. 39',
    notes: 'Tvekande ljud för att mjukt fånga någons uppmärksamhet.'
  },
  {
    japanese: 'はい',
    romaji: 'hai',
    swedish: 'ja / uppfattat',
    english: 'yes',
    category: 'Uttryck',
    lesson: 'Genki I s. 39',
    notes: 'Formellt och artigt ja.'
  },
  {
    japanese: 'そうです',
    romaji: 'soo desu',
    swedish: 'Det stämmer / Det är rätt',
    english: 'That\'s right.',
    category: 'Uttryck',
    lesson: 'Genki I s. 39',
    notes: 'Bekräftande uttryck.'
  },
  {
    japanese: 'そうですか',
    romaji: 'soo desu ka',
    swedish: 'Jaha / Är det så? / Jag förstår',
    english: 'I see.; Is that so?',
    category: 'Uttryck',
    lesson: 'Genki I s. 39',
    notes: 'Uttrycker att man tar emot ny information med intresse.'
  },

  // ─── Kapitel 1: Länder & Världen (s. 39) ───
  {
    japanese: 'イギリス',
    hiragana: 'いぎりす',
    romaji: 'Igirisu',
    swedish: 'Storbritannien / England',
    english: 'Britain',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    notes: 'Katakana (furigana: いぎりす). Kommer från portugisiska "inglês".'
  },
  {
    japanese: 'オーストラリア',
    hiragana: 'おおすとらりあ',
    romaji: 'Oosutoraria',
    swedish: 'Australien',
    english: 'Australia',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    notes: 'Katakana med långt streck ー (furigana: おおすとらりあ).'
  },
  {
    japanese: 'かんこく',
    romaji: 'Kankoku',
    swedish: 'Sydkorea',
    english: 'Korea',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 韓国.'
  },
  {
    japanese: 'カナダ',
    hiragana: 'かなだ',
    romaji: 'Kanada',
    swedish: 'Kanada',
    english: 'Canada',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    notes: 'Katakana (furigana: かなだ).'
  },
  {
    japanese: 'ちゅうごく',
    romaji: 'Chuugoku',
    swedish: 'Kina',
    english: 'China',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 中国. Yōon: ちゅ (chu).'
  },
  {
    japanese: 'インド',
    hiragana: 'いんど',
    romaji: 'Indo',
    swedish: 'Indien',
    english: 'India',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    notes: 'Katakana (furigana: いんど).'
  },
  {
    japanese: 'エジプト',
    hiragana: 'えじぷと',
    romaji: 'Ejiputo',
    swedish: 'Egypten',
    english: 'Egypt',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    notes: 'Katakana (furigana: えじぷと). Handakuten ぷ.'
  },
  {
    japanese: 'フィリピン',
    hiragana: 'ふぃりぴん',
    romaji: 'Firipin',
    swedish: 'Filippinerna',
    english: 'Philippines',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    notes: 'Katakana (furigana: ふぃりぴん). Kombinationsljud: フィ (fi).'
  },

  // ─── Kapitel 1: Studieinriktningar & Ämnen (s. 39) ───
  {
    japanese: 'アジアけんきゅう',
    hiragana: 'あじあけんきゅう',
    romaji: 'ajia kenkyuu',
    swedish: 'Asienstudier',
    english: 'Asian studies',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Katakana アジア (あじあ) + けんきゅう (studier/forskning).'
  },
  {
    japanese: 'けいざい',
    romaji: 'keezai',
    swedish: 'ekonomi / nationalekonomi',
    english: 'economics',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 経済.'
  },
  {
    japanese: 'こうがく',
    romaji: 'koogaku',
    swedish: 'ingenjörsvetenskap / teknik',
    english: 'engineering',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 工学. Lång vokal: kōgaku.'
  },
  {
    japanese: 'こくさいかんけい',
    romaji: 'kokusaikankee',
    swedish: 'internationella relationer',
    english: 'international relations',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 国際関係. こくさい (internationell) + かんけい (relationer).'
  },
  {
    japanese: 'コンピューター',
    hiragana: 'こんぴゅうたあ',
    romaji: 'konpyuutaa',
    swedish: 'dator / datavetenskap',
    english: 'computer',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Katakana med långa vokaler ー (furigana: こんぴゅうたあ).'
  },
  {
    japanese: 'せいじ',
    romaji: 'seeji',
    swedish: 'statsvetenskap / politik',
    english: 'politics',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 政治.'
  },
  {
    japanese: 'せいぶつがく',
    romaji: 'seebutsugaku',
    swedish: 'biologi',
    english: 'biology',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 生物学. せいぶつ (biologi) + がく (vetenskap).'
  },
  {
    japanese: 'ビジネス',
    hiragana: 'びじねす',
    romaji: 'bijinesu',
    swedish: 'företagsekonomi / affärsverksamhet',
    english: 'business',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Katakana (furigana: びじねす).'
  },
  {
    japanese: 'ぶんがく',
    romaji: 'bungaku',
    swedish: 'litteraturvetenskap / litteratur',
    english: 'literature',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 文学.'
  },
  {
    japanese: 'れきし',
    romaji: 'rekishi',
    swedish: 'historia',
    english: 'history',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 歴史.'
  },

  // ─── Kapitel 1: Yrken & Arbetsliv (s. 39–40) ───
  {
    japanese: 'いしゃ',
    romaji: 'isha',
    swedish: 'läkare',
    english: 'doctor',
    category: 'Yrken',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 医者. Yōon: しゃ (sha).'
  },
  {
    japanese: 'かいしゃいん',
    romaji: 'kaishain',
    swedish: 'kontorsanställd / företagsanställd',
    english: 'office worker',
    category: 'Yrken',
    lesson: 'Genki I s. 39',
    notes: 'Kanji: 会社員. かいしゃ (företag) + いん (anställd).'
  },
  {
    japanese: 'かんごし',
    romaji: 'kangoshi',
    swedish: 'sjuksköterska',
    english: 'nurse',
    category: 'Yrken',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: 看護師.'
  },
  {
    japanese: 'こうこうせい',
    romaji: 'kookoosee',
    swedish: 'gymnasieelev / gymnasiestudent',
    english: 'high school student',
    category: 'Yrken',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: 高校生. こうこう (gymnasium) + せい (student).'
  },
  {
    japanese: 'しゅふ',
    romaji: 'shufu',
    swedish: 'hemmafru / hemmaman',
    english: 'housewife',
    category: 'Yrken',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: 主婦.'
  },
  {
    japanese: 'だいがくいんせい',
    romaji: 'daigakuinsee',
    swedish: 'master-/doktorandstuderande',
    english: 'graduate student',
    category: 'Yrken',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: 大学院生. だいがくいん (forskarskola) + せい (student).'
  },
  {
    japanese: 'べんごし',
    romaji: 'bengoshi',
    swedish: 'jurist / advokat',
    english: 'lawyer',
    category: 'Yrken',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: 弁護士.'
  },

  // ─── Kapitel 1: Familj (s. 40) ───
  {
    japanese: 'おかあさん',
    romaji: 'okaasan',
    swedish: 'mamma / mor (andras eller artig)',
    english: 'mother',
    category: 'Familj',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: お母さん. Artig form för mamma.'
  },
  {
    japanese: 'おとうさん',
    romaji: 'otoosan',
    swedish: 'pappa / far (andras eller artig)',
    english: 'father',
    category: 'Familj',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: お父さん. Lång vokal: otōsan (stavas med う).'
  },
  {
    japanese: 'おねえさん',
    romaji: 'oneesan',
    swedish: 'storasyster (andras eller artig)',
    english: 'older sister',
    category: 'Familj',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: お姉さん. Stavas med え för lång vokal.'
  },
  {
    japanese: 'おにいさん',
    romaji: 'oniisan',
    swedish: 'storebror (andras eller artig)',
    english: 'older brother',
    category: 'Familj',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: お兄さん. Stavas med い för lång vokal.'
  },
  {
    japanese: 'いもうと',
    romaji: 'imooto',
    swedish: 'lillasyster',
    english: 'younger sister',
    category: 'Familj',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: 妹. Lång vokal: imōto (stavas med う).'
  },
  {
    japanese: 'おとうと',
    romaji: 'otooto',
    swedish: 'lillebror',
    english: 'younger brother',
    category: 'Familj',
    lesson: 'Genki I s. 40',
    notes: 'Kanji: 弟. Lång vokal: otōto (stavas med う).'
  },

  // ─── Kapitel 2: Pekord / Demonstrativ (s. 58) ───
  {
    japanese: 'これ',
    romaji: 'kore',
    swedish: 'den här / detta (nära talaren)',
    english: 'this one',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Självständigt pronomen: sak nära talaren.'
  },
  {
    japanese: 'それ',
    romaji: 'sore',
    swedish: 'den där (nära lyssnaren)',
    english: 'that one',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Självständigt pronomen: sak nära lyssnaren.'
  },
  {
    japanese: 'あれ',
    romaji: 'are',
    swedish: 'den där borta (långt från båda)',
    english: 'that one (over there)',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Självständigt pronomen: sak långt från både talare och lyssnare.'
  },
  {
    japanese: 'どれ',
    romaji: 'dore',
    swedish: 'vilken / vilket (av tre eller fler)',
    english: 'which one',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Frågepronomen för val bland föremål.'
  },
  {
    japanese: 'この',
    romaji: 'kono',
    swedish: 'den här... / denna... (+ substantiv)',
    english: 'this...',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Bestämningsord. Måste följas av substantiv (t.ex. この ほん = den här boken).'
  },
  {
    japanese: 'その',
    romaji: 'sono',
    swedish: 'den där... (+ substantiv nära lyssnaren)',
    english: 'that...',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Bestämningsord. Måste följas av substantiv.'
  },
  {
    japanese: 'あの',
    romaji: 'ano',
    swedish: 'den där borta... (+ substantiv långt bort)',
    english: 'that... (over there)',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Bestämningsord. Måste följas av substantiv.'
  },
  {
    japanese: 'どの',
    romaji: 'dono',
    swedish: 'vilken... (+ substantiv)',
    english: 'which...',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Frågeord. Måste följas av substantiv (t.ex. どの とけい = vilken klocka).'
  },
  {
    japanese: 'ここ',
    romaji: 'koko',
    swedish: 'här (plats nära talaren)',
    english: 'here',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Platspronomen.'
  },
  {
    japanese: 'そこ',
    romaji: 'soko',
    swedish: 'där (plats nära lyssnaren)',
    english: 'there',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Platspronomen.'
  },
  {
    japanese: 'あそこ',
    romaji: 'asoko',
    swedish: 'där borta (plats långt från båda)',
    english: 'over there',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Platspronomen.'
  },
  {
    japanese: 'どこ',
    romaji: 'doko',
    swedish: 'var / vilken plats',
    english: 'where',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Frågeord för plats.'
  },
  {
    japanese: 'だれ',
    romaji: 'dare',
    swedish: 'vem',
    english: 'who',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 誰. Frågeord för person.'
  },

  // ─── Kapitel 2: Mat & Rätter (s. 58) ───
  {
    japanese: 'おいしい',
    romaji: 'oishii',
    swedish: 'god / läcker / välsmakande',
    english: 'delicious',
    category: 'Mat',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 美味しい. Ett i-adjektiv.'
  },
  {
    japanese: 'さかな',
    romaji: 'sakana',
    swedish: 'fisk',
    english: 'fish',
    category: 'Mat',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 魚.'
  },
  {
    japanese: 'とんかつ',
    romaji: 'tonkatsu',
    swedish: 'panerad fläskkotlett (tonkatsu)',
    english: 'pork cutlet',
    category: 'Mat',
    lesson: 'Genki I s. 58',
    notes: 'Klassisk japansk maträtt.'
  },
  {
    japanese: 'にく',
    romaji: 'niku',
    swedish: 'kött',
    english: 'meat',
    category: 'Mat',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 肉.'
  },
  {
    japanese: 'メニュー',
    hiragana: 'めにゅう',
    romaji: 'menyuu',
    swedish: 'meny',
    english: 'menu',
    category: 'Mat',
    lesson: 'Genki I s. 58',
    notes: 'Katakana (furigana: めにゅう). Lång vokal med ー.'
  },
  {
    japanese: 'やさい',
    romaji: 'yasai',
    swedish: 'grönsak / grönsaker',
    english: 'vegetable',
    category: 'Mat',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 野菜.'
  },

  // ─── Kapitel 2: Vardagssaker & Kläder (s. 58) ───
  {
    japanese: 'かさ',
    romaji: 'kasa',
    swedish: 'paraply',
    english: 'umbrella',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 傘.'
  },
  {
    japanese: 'かばん',
    romaji: 'kaban',
    swedish: 'väska',
    english: 'bag',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 鞄.'
  },
  {
    japanese: 'くつ',
    romaji: 'kutsu',
    swedish: 'skor',
    english: 'shoes',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 靴.'
  },
  {
    japanese: 'さいふ',
    romaji: 'saifu',
    swedish: 'plånbok',
    english: 'wallet',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 財布.'
  },
  {
    japanese: 'ジーンズ',
    hiragana: 'じいんず',
    romaji: 'jiinzu',
    swedish: 'jeans',
    english: 'jeans',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Katakana (furigana: じいんず). Långt streck ー och dakuten: ジ (ji), ズ (zu).'
  },
  {
    japanese: 'じてんしゃ',
    romaji: 'jitensha',
    swedish: 'cykel',
    english: 'bicycle',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 自転車. Yōon: しゃ (sha).'
  },
  {
    japanese: 'しんぶん',
    romaji: 'shinbun',
    swedish: 'tidning / dagstidning',
    english: 'newspaper',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 新聞.'
  },
  {
    japanese: 'スマホ',
    hiragana: 'すまほ',
    romaji: 'sumaho',
    swedish: 'smartphone / mobiltelefon',
    english: 'smartphone; mobile',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Katakana (furigana: すまほ). Kortform av スマートフォン (smart phone).'
  },
  {
    japanese: 'Ｔシャツ',
    hiragana: 'てぃいしゃつ',
    romaji: 'tiishatsu',
    swedish: 'T-shirt / t-tröja',
    english: 'T-shirt',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Romaji "T" + Katakana "シャツ" (furigana: てぃいしゃつ).'
  },
  {
    japanese: 'とけい',
    romaji: 'tokee',
    swedish: 'klocka / armbandsur',
    english: 'watch; clock',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Kanji: 時計.'
  },
  {
    japanese: 'ノート',
    hiragana: 'のおと',
    romaji: 'nooto',
    swedish: 'anteckningsblock / skrivbok',
    english: 'notebook',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    notes: 'Katakana med långt streck ー (furigana: のおと).'
  }
];

export interface GenkiChapterInfo {
  index: number;
  title: string;
  category: string;
  lesson: string;
  startIndex: number;
  endIndex: number;
  itemCount: number;
  preview: string;
}

export const GENKI_EXAM_CHAPTERS: GenkiChapterInfo[] = [
  {
    index: 0,
    title: 'Hälsningar: Morgon till kväll',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    startIndex: 0,
    endIndex: 10,
    itemCount: 10,
    preview: 'God morgon, god dag, tack, ursäkta...'
  },
  {
    index: 1,
    title: 'Hälsningar: Hemmet & måltider',
    category: 'Hälsningar',
    lesson: 'Genki I s. 32',
    startIndex: 10,
    endIndex: 19,
    itemCount: 9,
    preview: 'Tadaima, itadakimasu, hajimemashite...'
  },
  {
    index: 2,
    title: 'Skola & Studier',
    category: 'Skola',
    lesson: 'Genki I s. 38',
    startIndex: 19,
    endIndex: 28,
    itemCount: 9,
    preview: 'Daigaku, gakusei, sensei, senkou...'
  },
  {
    index: 3,
    title: 'Människor & Relationer',
    category: 'Människor',
    lesson: 'Genki I s. 38',
    startIndex: 28,
    endIndex: 33,
    itemCount: 5,
    preview: 'Watashi, tomodachi, -san, nihonjin...'
  },
  {
    index: 4,
    title: 'Klockan & Tidsuttryck',
    category: 'Tid',
    lesson: 'Genki I s. 38',
    startIndex: 33,
    endIndex: 40,
    itemCount: 7,
    preview: 'Ima, gozen, gogo, ichiji, niji han...'
  },
  {
    index: 5,
    title: 'Telefon, Språk & Ålder',
    category: 'Övrigt',
    lesson: 'Genki I s. 38',
    startIndex: 40,
    endIndex: 47,
    itemCount: 7,
    preview: 'Nihon, Amerika, nihongo, denwa...'
  },
  {
    index: 6,
    title: 'Allmänt & Praktiska Uttryck',
    category: 'Allmänt & Uttryck',
    lesson: 'Genki I s. 39',
    startIndex: 47,
    endIndex: 54,
    itemCount: 7,
    preview: 'Namae, nan/nani, anoo, soo desu ka...'
  },
  {
    index: 7,
    title: 'Länder & Världen',
    category: 'Länder',
    lesson: 'Genki I s. 39',
    startIndex: 54,
    endIndex: 62,
    itemCount: 8,
    preview: 'Igirisu, Chuugoku, Kankoku, Kanada...'
  },
  {
    index: 8,
    title: 'Studieinriktningar & Ämnen',
    category: 'Ämnen',
    lesson: 'Genki I s. 39',
    startIndex: 62,
    endIndex: 72,
    itemCount: 10,
    preview: 'Keezai, koogaku, seeji, bungaku...'
  },
  {
    index: 9,
    title: 'Yrken & Arbetsliv',
    category: 'Yrken',
    lesson: 'Genki I s. 39–40',
    startIndex: 72,
    endIndex: 79,
    itemCount: 7,
    preview: 'Isha, kaishain, kangoshi, bengoshi...'
  },
  {
    index: 10,
    title: 'Familj (Kazoku)',
    category: 'Familj',
    lesson: 'Genki I s. 40',
    startIndex: 79,
    endIndex: 85,
    itemCount: 6,
    preview: 'Okaasan, otoosan, oneesan, oniisan...'
  },
  {
    index: 11,
    title: 'Pekord (Kosoado-systemet)',
    category: 'Pekord',
    lesson: 'Genki I s. 58',
    startIndex: 85,
    endIndex: 98,
    itemCount: 13,
    preview: 'Kore, sore, are, kono, sono, koko, doko...'
  },
  {
    index: 12,
    title: 'Mat & Smaker (Tabemono)',
    category: 'Mat',
    lesson: 'Genki I s. 58',
    startIndex: 98,
    endIndex: 104,
    itemCount: 6,
    preview: 'Oishii, sakana, tonkatsu, menyuu, yasai...'
  },
  {
    index: 13,
    title: 'Vardagssaker & Kläder (Mono)',
    category: 'Saker',
    lesson: 'Genki I s. 58',
    startIndex: 104,
    endIndex: 115,
    itemCount: 11,
    preview: 'Kasa, kaban, kutsu, jiinzu, sumaho...'
  }
];
