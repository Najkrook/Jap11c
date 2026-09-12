export interface GrammarPracticeTask {
  promptSv: string;
  answers: string[];
  hintSv: string;
  explanationSv: string;
}

export interface GrammarPracticeScenario {
  titleSv: string;
  contextSv: string;
  vocabularySv: string;
  tasks: GrammarPracticeTask[];
}

// Original exercises complementing the guide. Answers deliberately use a specified
// structure so deterministic checking does not pretend to grade free translation.
const task = (promptSv: string, answers: string[], hintSv: string, explanationSv: string): GrammarPracticeTask =>
  ({ promptSv, answers, hintSv, explanationSv });

export const GRAMMAR_PRACTICE: Record<string, GrammarPracticeScenario> = {
  'japanese-logic-sov': {
    titleSv: 'En paus på kaféet',
    contextSv: 'Du sitter med en vän som undrar vad du ska dricka. Ni vet redan att frågan gäller dig.',
    vocabularySv: 'おちゃ (ocha) = te · のむ (nomu) = dricka · パン (pan) = bröd · たべる (taberu) = äta',
    tasks: [
      task('Bygg svaret ”Jag dricker te” med おちゃ・を・のむ. Utelämna ”jag”.', ['おちゃをのむ', 'お茶を飲む', 'ocha o nomu'], 'Objekt + を + verb.', 'おちゃをのむ。Te är objektet och のむ avslutar satsen. Sammanhanget visar vem som dricker.'),
      task('Nu frågar vännen vad du ska äta. Bygg ”Jag äter bröd” med パン・を・たべる, utan pronomen.', ['パンをたべる', 'パンを食べる', 'ぱんをたべる', 'pan o taberu'], 'Behåll samma satsordning men byt objekt och handling.', 'パンをたべる。Samma struktur fungerar med en ny handling; du behöver inte lägga till わたしは eller です.')
    ]
  },
  'state-of-being-da-desu': {
    titleSv: 'Vem var student?',
    contextSv: 'En vän tror att Mika var lärare förra året. Rätta uppgiften i vardaglig stil.',
    vocabularySv: 'せんせい (sensei) = lärare · がくせい (gakusei) = student',
    tasks: [
      task('Skriv ”Var inte lärare” med せんせい och vardaglig negativ dåtid. Utelämna namnet.', ['せんせいじゃなかった', '先生じゃなかった', 'sensei janakatta', 'せんせいではなかった', '先生ではなかった', 'sensei dewa nakatta'], 'じゃない blir じゃなかった i dåtid.', 'せんせいじゃなかった。Negation och dåtid ligger i kopulans böjning, inte i ett separat verb.'),
      task('Förtydliga: ”Var student.” Använd がくせい och vardaglig bekräftande dåtid, utan namn.', ['がくせいだった', '学生だった', 'gakusei datta'], 'Byt från negativ dåtid till だった.', 'がくせいだった。Tillsammans blir svaren en rättelse: var inte lärare, var student.')
    ]
  },
  'particles-wa-vs-ga': {
    titleSv: 'Hitta rätt person',
    contextSv: 'Någon frågar vem som är lärare. Sen byter ni samtalsämne till Yuki.',
    vocabularySv: 'だれ (dare) = vem · せんせい (sensei) = lärare · がくせい (gakusei) = student',
    tasks: [
      task('Svara på だれがせんせい？ Fyll luckan: ミカ＿せんせいだ。 Skriv bara partikeln.', ['が', 'ga'], 'Svaret identifierar personen som frågeordet efterfrågar.', 'ミカがせんせいだ。が identifierar Mika som personen som är lärare.'),
      task('”Vad gäller Yuki, så är hon student.” Fyll luckan: ユキ＿がくせいだ。 Skriv temapartikeln.', ['は', 'wa'], 'Nu presenteras ett samtalsämne, inte svaret på ”vem?”.', 'ユキはがくせいだ。は sätter Yuki som tema. Skillnaden handlar om vad samtalet redan frågar efter.')
    ]
  },
  'adjectives-i-vs-na': {
    titleSv: 'Välj ett rum',
    contextSv: 'Du jämför två rum inför en resa: ett lugnt rum och ett som inte var billigt.',
    vocabularySv: 'しずか (shizuka) = lugn · へや (heya) = rum · やすい (yasui) = billig',
    tasks: [
      task('Bygg frasen ”ett lugnt rum” av しずか och へや. Lägg till rätt bindning.', ['しずかなへや', '静かな部屋', 'shizuka na heya'], 'しずか är ett な-adjektiv.', 'しずかなへや。な binder adjektivet till substantivet; だ används inte här.'),
      task('Skriv ”Var inte billigt” genom att böja やすい i vardaglig negativ dåtid. Bara adjektivet.', ['やすくなかった', '安くなかった', 'yasukunakatta'], 'い → くない → くなかった.', 'やすくなかった。Ett い-adjektiv bär själv negation och tempus. Lägg inte till だった.')
    ]
  },
  'particles-wo-ni-he-de': {
    titleSv: 'Planera en studiedag',
    contextSv: 'Du åker till biblioteket och läser en bok där. Skilj resans mål från platsen där du läser.',
    vocabularySv: 'としょかん (toshokan) = bibliotek · ほん (hon) = bok · よむ (yomu) = läsa',
    tasks: [
      task('Fyll målet: としょかん＿いく。 Skriv bara en passande partikel.', ['に', 'へ', 'ni', 'e', 'he'], 'Både mål och riktning fungerar med いく.', 'としょかんにいく / としょかんへいく。に markerar målet och へ riktningen.'),
      task('Bygg ”Läser en bok på biblioteket” i ordningen としょかん・ほん・よむ. Lägg till partiklar, utelämna ”jag”.', ['としょかんでほんをよむ', '図書館で本を読む', 'toshokan de hon o yomu'], 'Handlingsplats + で, objekt + を, verb sist.', 'としょかんでほんをよむ。Biblioteket är nu platsen för handlingen (で); boken är det lästa objektet (を).')
    ]
  },
  'verb-groups-ichidan-godan': {
    titleSv: 'Två verb som slutar på る',
    contextSv: 'Du ska säga att du varken äter eller går hem än. Liknande ordboksformer böjs olika.',
    vocabularySv: 'たべる (taberu) = äta, ru-verb · かえる (kaeru) = återvända hem, u-verb',
    tasks: [
      task('Böj たべる till vardaglig negation: ”äter inte”. Skriv bara verbet.', ['たべない', '食べない', 'tabenai'], 'Ru-verb: ta bort る och lägg till ない.', 'たべない。Stammen たべ behålls.'),
      task('Böj nu かえる till vardaglig negation: ”går inte hem”. Skriv bara verbet.', ['かえらない', '帰らない', 'kaeranai'], 'Detta är ett u-verb: る → ら + ない.', 'かえらない。かえる är ett u-verb trots ändelsen える. Formen かえない hör inte till 帰る.')
    ]
  },
  'verb-negation-and-past': {
    titleSv: 'Vad hände i går?',
    contextSv: 'En vän frågar om gårdagens planer. Du gick inte till stationen men köpte en bok.',
    vocabularySv: 'いく (iku) = gå · かう (kau) = köpa',
    tasks: [
      task('Fyll med vardaglig negativ dåtid av いく: きのう、えきに＿＿。 Skriv bara verbet.', ['いかなかった', '行かなかった', 'ikanakatta'], 'いく → いかない → negativ dåtid.', 'きのう、えきにいかなかった。ない böjs till なかった.'),
      task('Fyll med vardaglig positiv dåtid av かう: でも、ほんを＿＿。 Skriv bara verbet.', ['かった', '買った', 'katta'], 'U-verb som slutar på う får った i dåtid.', 'でも、ほんをかった。”Men jag köpte en bok.” Litet っ ingår i böjningen.')
    ]
  },
  'magic-te-form': {
    titleSv: 'Frukost och pågående studier',
    contextSv: 'Berätta först vad du gör i följd och sedan vad du håller på med just nu.',
    vocabularySv: 'あさごはん (asagohan) = frukost · たべる (taberu) = äta · べんきょうする (benkyou suru) = studera',
    tasks: [
      task('Koppla ihop: あさごはんを＿＿、べんきょうする。 Fyll med て-formen av たべる.', ['たべて', '食べて', 'tabete'], 'Ta bort る och lägg till て.', 'あさごはんをたべて、べんきょうする。て binder ihop frukosten med nästa handling.'),
      task('Fyll ”Håller på att studera nu”: いま、＿＿。 Använd べんきょうする + ている i full vardaglig form.', ['べんきょうしている', '勉強している', 'benkyou shite iru', 'benkyo shite iru'], 'する får て-formen して.', 'いま、べんきょうしている。Med detta handlingsverb beskriver ている något som pågår.')
    ]
  },
  'transitive-vs-intransitive': {
    titleSv: 'Dörren till klassrummet',
    contextSv: 'Först ser du dörren öppnas. Sedan berättar du att du själv öppnade den.',
    vocabularySv: 'ドア (doa) = dörr · あく (aku) = öppnas · あける (akeru) = öppna något',
    tasks: [
      task('”Dörren öppnades.” Fyll partikeln: ドア＿あいた。', ['が', 'ga'], 'Dörren är det som ändrar tillstånd, inget objekt bearbetas i satsen.', 'ドアがあいた。あく är intransitivt och dörren markeras med が.'),
      task('Bygg ”Öppnade dörren” med ドア och あける i vardaglig dåtid. Utelämna ”jag”.', ['ドアをあけた', 'ドアを開けた', 'どあをあけた', 'doa o aketa'], 'Nu handlar någon på dörren: objekt + を.', 'ドアをあけた。あける är transitivt och böjs till あけた. Nu beskrivs en persons handling.')
    ]
  },
  'relative-clauses-noun-modification': {
    titleSv: 'Hitta boken och personen',
    contextSv: 'Du behöver precisera vilken bok och vilken person du menar utan svenska ”som”.',
    vocabularySv: 'きのう (kinou) = i går · かう (kau) = köpa · ほん (hon) = bok · ひと (hito) = person',
    tasks: [
      task('Bygg ”boken jag köpte i går” i ordningen きのう・かう (dåtid)・ほん. Utelämna ”jag”.', ['きのうかったほん', '昨日買った本', 'kinou katta hon', 'kino katta hon'], 'Hela beskrivningen står direkt före ほん.', 'きのうかったほん。かった modifierar ほん utan の eller ett ord för ”som”.'),
      task('Bygg ”personen som läser en bok” med ほん・を・よんでいる・ひと i den ordningen.', ['ほんをよんでいるひと', '本を読んでいる人', 'hon o yonde iru hito'], 'Låt hela satsen ほんをよんでいる beskriva ひと.', 'ほんをよんでいるひと。Partikeln を stannar inne i beskrivningen. Det sista substantivet är hela frasens huvudord.')
    ]
  },
  'noun-particles-to-ya-mo-no': {
    titleSv: 'Packa inför lektionen',
    contextSv: 'Du berättar vad väskan innehåller och vems bok du har med dig.',
    vocabularySv: 'ほん (hon) = bok · ノート (nooto) = anteckningsbok · ミカ (Mika) = namn',
    tasks: [
      task('Boken och anteckningsboken är bara exempel bland flera saker. Fyll: ほん＿ノート。', ['や', 'ya'], 'Välj partikeln för en öppen lista.', 'ほんやノート。や betyder att uppräkningen inte är fullständig. と skulle lista de namngivna sakerna som en sluten grupp.'),
      task('Bygg frasen ”Mikas bok” av ミカ och ほん.', ['ミカのほん', 'ミカの本', 'みかのほん', 'Mika no hon'], 'Ägaren står först, sedan の.', 'ミカのほん。の knyter boken till Mika; ordningen är ägare → sak.')
    ]
  },
  'polite-vs-casual-form': {
    titleSv: 'Samma plan, olika mottagare',
    contextSv: 'Först pratar du med en lärare, sedan med en nära vän. Båda frågar om morgondagen.',
    vocabularySv: 'あした (ashita) = i morgon · いく (iku) = gå',
    tasks: [
      task('Till läraren: あした、＿＿。 Fyll ”går” med artig form av いく.', ['いきます', '行きます', 'ikimasu'], 'U-verb: く → き + ます.', 'あした、いきます。ます uttrycker artighet; あした visar att handlingen ligger i framtiden.'),
      task('Planen ändras. Till vännen: あした、＿＿。 Fyll ”går inte” i vardaglig form.', ['いかない', '行かない', 'ikanai'], 'Använd ない-formen, inte ません.', 'あした、いかない。Här ändras både innehållet (negation) och stilnivån (vardaglig).')
    ]
  },
  'addressing-people-and-pronouns': {
    titleSv: 'Presentera dig på kursen',
    contextSv: 'Du heter Yuki. Du presenterar dig för Tanaka och tilltalar sedan din lärare.',
    vocabularySv: 'ユキ (Yuki) = ditt namn · たなか (Tanaka) = efternamn · せんせい (sensei) = lärare',
    tasks: [
      task('Skriv ”Jag är Yuki” med bara ditt namn och です. Använd katakana, hiragana eller romaji.', ['ユキです', 'ゆきです', 'Yuki desu'], 'Lägg inte en hederstitel till ditt eget namn.', 'ユキです。Du sätter normalt inte さん på ditt eget namn när du presenterar dig.'),
      task('Tanaka är din lärare. Skriv tilltalet ”lärare Tanaka” med efternamnet följt av yrkestiteln, utan さん.', ['たなかせんせい', '田中先生', 'Tanaka sensei'], '先生 fungerar själv som titel.', 'たなかせんせい。Namn och roll ger ett naturligt tilltal utan att använda あなた.')
    ]
  },
  'question-marker-and-sentence-particles': {
    titleSv: 'Fråga eller dela en upplevelse?',
    contextSv: 'På ett kafé vill du först fråga om något är te. Sedan kommenterar ni tillsammans smaken.',
    vocabularySv: 'おちゃ (ocha) = te · おいしい (oishii) = god',
    tasks: [
      task('Gör detta till en artig fråga: おちゃです＿。 Skriv slutpartikeln.', ['か', 'ka'], 'Artiga frågor avslutas normalt med frågepartikeln.', 'おちゃですか。か gör påståendet till en fråga: ”Är det te?”'),
      task('Ni smakar båda. ”Gott, eller hur?” Fyll den bekräftelsesökande partikeln: おいしいです＿。', ['ね', 'ne'], 'Du söker samförstånd om en gemensam upplevelse.', 'おいしいですね。ね bjuder in till instämmande. よ hade i stället presenterat information för lyssnaren.')
    ]
  },
  'reasons-kara-vs-node': {
    titleSv: 'Förklara varför du stannar hemma',
    contextSv: 'Det regnar. Du ger samma skäl först vardagligt och sedan i en mer återhållsam förklaring.',
    vocabularySv: 'あめ (ame) = regn · いく (iku) = gå',
    tasks: [
      task('Fyll hela orsaksledet ”eftersom det är regn” med あめ + から: ＿＿、いかない。', ['あめだから', '雨だから', 'ame dakara'], 'Substantivet behöver だ före から.', 'あめだから、いかない。だ binder substantivet あめ till から.'),
      task('Byt till ので: ＿＿、いきません。 Skriv orsaksledet med あめ.', ['あめなので', '雨なので', 'ame nanode'], 'Före ので blir bindningen efter substantiv な.', 'あめなので、いきません。Efter substantiv används なので. Det följande verbet är här också artigt.')
    ]
  },
  'potential-form-ability': {
    titleSv: 'Vad klarar du på resan?',
    contextSv: 'Du beskriver två förmågor: att läsa och att äta en viss maträtt.',
    vocabularySv: 'よむ (yomu) = läsa · たべる (taberu) = äta',
    tasks: [
      task('Fyll ”kan läsa”: ひらがなが＿＿。 Använd vardaglig potentialform av よむ.', ['よめる', '読める', 'yomeru'], 'U-verb: byt u-ljudet till e och lägg till る.', 'ひらがながよめる。よむ → よめる uttrycker förmåga, inte en pågående läsning.'),
      task('Fyll ”kan inte äta”: これは＿＿。 Använd standardformen av たべる i negativ potential, utan att förkorta ら.', ['たべられない', '食べられない', 'taberarenai'], 'たべる → たべられる → negativ form.', 'これはたべられない。Ru-verb får られる, som sedan böjs till られない. Det är oförmåga, inte bara ett beslut att avstå.')
    ]
  },
  'desires-tai-and-hoshii': {
    titleSv: 'Önskelista inför Japanresan',
    contextSv: 'Du vill ha en bok och vill läsa den. Skilj önskan om en sak från önskan att göra något.',
    vocabularySv: 'ほん (hon) = bok · よむ (yomu) = läsa',
    tasks: [
      task('Fyll ”vill ha”: ほんが＿＿。 Använd vardaglig form.', ['ほしい', '欲しい', 'hoshii'], 'Det du önskar är ett substantiv.', 'ほんがほしい。ほしい uttrycker att du vill ha en sak.'),
      task('Fyll ”vill läsa”: このほんを＿＿。 Böj よむ med たい, vardaglig form.', ['よみたい', '読みたい', 'yomitai'], 'Använd samma stam som före ます.', 'このほんをよみたい。よみ + たい uttrycker att du vill utföra handlingen. を fungerar som objektmarkör här.')
    ]
  },
  'volitional-form-suggestions': {
    titleSv: 'Föreslå en lunchpaus',
    contextSv: 'Du föreslår att en vän går med dig. Sedan bjuder du in hela kursgruppen att äta.',
    vocabularySv: 'いく (iku) = gå · たべる (taberu) = äta',
    tasks: [
      task('Till vännen: ”Nu går vi!” Skriv bara vardaglig avsiktsform av いく.', ['いこう', '行こう', 'ikou', 'iko'], 'U-verb: u-ljud → o-ljud + う.', 'いこう。Volitional kan användas som ett gemensamt förslag när sammanhanget är en inbjudan.'),
      task('Till gruppen: ”Låt oss äta.” Skriv bara artig förslagsform av たべる.', ['たべましょう', '食べましょう', 'tabemashou', 'tabemasho'], 'Ru-verbets stam + ましょう.', 'たべましょう。Samma typ av förslag uttrycks här med artig stil.')
    ]
  },
  'giving-and-receiving': {
    titleSv: 'En bok i present',
    contextSv: 'Mika gav dig en bok. Beskriv samma händelse från givarens och mottagarens perspektiv.',
    vocabularySv: 'ほん (hon) = bok · わたし (watashi) = jag',
    tasks: [
      task('Mika är subjekt: ミカがわたしにほんを＿＿。 Fyll vardaglig dåtid av verbet för att ge till mig.', ['くれた', 'kureta'], 'Gåvan rör sig mot dig: くれる.', 'ミカがわたしにほんをくれた。くれる visar att gåvan kommer till dig eller din inre krets.'),
      task('Nu är du tema: わたしはミカにほんを＿＿。 Fyll vardaglig dåtid av ”ta emot”.', ['もらった', 'moratta'], 'もらう är ett u-verb med dåtid på った.', 'わたしはミカにほんをもらった。Samma gåva beskrivs från mottagarens sida. に markerar här vem du fick den av.')
    ]
  },
  'four-conditionals': {
    titleSv: 'Ge råd och bestäm ordningen',
    contextSv: 'Din vän säger att hon ska till Japan. Du ger ett råd, sedan planerar du vad du själv gör efter studierna.',
    vocabularySv: 'にほん (nihon) = Japan · いく (iku) = åka · おわる (owaru) = bli klar',
    tasks: [
      task('Utgå från vännens nämnda plan: にほんにいく＿＿、きょうとがいいよ。 Fyll det kontextuella villkoret.', ['なら', 'nara'], '”Om det är så att du ska åka …” tar upp det vännen just sagt.', 'にほんにいくなら、きょうとがいいよ。なら knyter rådet om Kyoto till den nämnda planen.'),
      task('”När studierna är klara, äter jag.” Fyll おわる i たら-form: べんきょうが＿＿、ごはんをたべる。', ['おわったら', '終わったら', 'owattara'], 'Böj först おわる till dåtid och lägg sedan till ら.', 'べんきょうがおわったら、ごはんをたべる。たら placerar måltiden efter att studierna blivit klara.')
    ]
  },
  'must-and-obligation': {
    titleSv: 'Du har ett prov i morgon',
    contextSv: 'Du måste studera. Uttryck skyldigheten först i full form och sedan som ett kort vardagligt yttrande.',
    vocabularySv: 'べんきょうする (benkyou suru) = studera',
    tasks: [
      task('Skriv ”måste studera” med べんきょうする och hela konstruktionen なければならない.', ['べんきょうしなければならない', '勉強しなければならない', 'benkyou shinakereba naranai', 'benkyo shinakereba naranai'], 'する → しない → しなければ + ならない.', 'べんきょうしなければならない。Den dubbla negationen ger betydelsen ”det går inte om jag inte studerar”.'),
      task('Säg samma sak kort till en vän. Använd べんきょうする och sluta med なきゃ.', ['べんきょうしなきゃ', '勉強しなきゃ', 'benkyou shinakya', 'benkyo shinakya'], 'なければ dras ihop till なきゃ och slutledet utelämnas.', 'べんきょうしなきゃ。Skyldigheten finns kvar trots att ならない inte sägs ut.')
    ]
  },
  'passive-and-causative': {
    titleSv: 'Två händelser i klassrummet',
    contextSv: 'Först blir du berömd av läraren. Sen beskriver du hur läraren får eleverna att läsa en bok.',
    vocabularySv: 'ほめる (homeru) = berömma · よむ (yomu) = läsa · せいと (seito) = elev',
    tasks: [
      task('”Jag blev berömd av läraren.” Fyll passiv dåtid av ほめる: せんせいに＿＿。', ['ほめられた', '褒められた', 'homerareta'], 'Ru-verb: ta bort る, lägg till られる, böj till dåtid.', 'せんせいにほめられた。Den underförstådda personen tar emot handlingen; に visar vem som berömde.'),
      task('”Läraren fick eleverna att läsa en bok.” Fyll kausativ dåtid av よむ: せんせいはせいとにほんを＿＿。', ['よませた', '読ませた', 'yomaseta'], 'U-verb: む → ま + せる, sedan dåtid.', 'せんせいはせいとにほんをよませた。Läraren orsakar handlingen, eleverna läser, boken är objektet. Kausativ kan även betyda att låta någon göra något beroende på sammanhanget.')
    ]
  }
};

export function normalizeGrammarAnswer(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/[\s。、,.!?！？]/gu, '');
}

export function isGrammarAnswerCorrect(value: string, answers: string[]): boolean {
  const normalized = normalizeGrammarAnswer(value);
  return normalized.length > 0 && answers.some(answer => normalizeGrammarAnswer(answer) === normalized);
}
