import type { GrammarPart, GrammarChapter } from '../types/grammar';

export const GRAMMAR_PARTS: GrammarPart[] = [
  {
    id: 'basics',
    partNumber: 1,
    titleSv: 'Del 1: Grundläggande satslogik & Partiklar',
    titleJap: '基本文法 (Kihon Bunpou)',
    descriptionSv: 'Förstå hur japanska satser är uppbyggda från grunden utan att översätta ord-för-ord till västerländska språk.',
    colorClass: 'from-brand-600 to-indigo-700'
  },
  {
    id: 'verbs_tenses',
    partNumber: 2,
    titleSv: 'Del 2: Verbböjning & Tidsformer',
    titleJap: '動詞と活用 (Doushi to Katsuyou)',
    descriptionSv: 'Lär dig verbens stammar, te-formens magi, transitivitet och hur bisatser kopplas direkt till substantiv.',
    colorClass: 'from-amber-600 to-orange-700'
  },
  {
    id: 'essential',
    partNumber: 3,
    titleSv: 'Del 3: Essentiell grammatik & Sociala nyanser',
    titleJap: '必須文法 (Hissu Bunpou)',
    descriptionSv: 'Artig vs vardaglig nivå, social distans, frågekonstruktioner och hur man uttrycker förmåga och orsak.',
    colorClass: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'advanced',
    partNumber: 4,
    titleSv: 'Del 4: Avancerade konstruktioner & Uttryckssätt',
    titleJap: '応用表現 (Ouyou Hyougen)',
    descriptionSv: 'Villkorssatser, givande/tagande, tvång ("måste"), samt passiv och kausativ.',
    colorClass: 'from-rose-600 to-pink-700'
  }
];

export const TAE_KIM_CHAPTERS: GrammarChapter[] = [
  // ----------------------------------------------------
  // DEL 1: GRUNDLÄGGANDE SATSLOGIK & PARTIKLAR
  // ----------------------------------------------------
  {
    id: 'japanese-logic-sov',
    chapterNumber: 1,
    partId: 'basics',
    titleSv: 'Japanskans grundprincip: SOV & Utelämnad information',
    titleJap: '日本語の文構造',
    romajiTitle: 'Nihongo no bun kouzou',
    readingTimeMin: 4,
    summarySv: 'Japanska bygger inte meningar som svenska. Verbet kommer ALLTID sist, och allt som redan är uppenbart ur sammanhanget utelämnas helt.',
    taeKimCoreInsightSv: 'I svenska tvingas vi säga "Jag åt ett äpple". På japanska räcker det med "Äpple åt" (eller bara "Åt!") om lyssnaren förstår vem som pratar. Att ständigt säga "watashi wa" låter onaturligt och robotlikt.',
    ruleFormula: '[Kontext/Tema] + [Objekt/Detaljer] + [VERB / TILLSTÅND]',
    sections: [
      {
        heading: '1. Verbet styr universum och kommer sist',
        contentSv: 'Till skillnad från svenska (Subjekt - Verb - Objekt: "Kalle köper kaffe") är japanska ett SOV-språk (Subjekt - Objekt - Verb). Verbet eller tillståndet avslutar alltid påståendet. Det är verbet i slutet som avgör om meningen är positiv, dåtid, negation eller en fråga.',
        bulletPoints: [
          'Svenska: [Jag] [äter] [fisk]. (SVO)',
          'Japanska: [Sakana o] [taberu]. ([Fisk] [äter]). (SOV)',
          'All modifiering (beskrivande ord) kommer FÖRE ordet det beskriver.'
        ]
      },
      {
        heading: '2. Den gyllene regeln: Utelämna det självklara',
        contentSv: 'På japanska är grammatiskt korrekta meningar ofta extremt korta. Om du svarar på frågan "Ska du äta?" behöver du inte säga "Ja, jag ska äta mat". Du säger helt enkelt "Taberu" (Äter!). Japanska litar på kontexten.',
        subnoteSv: 'Tae Kims råd: Försök aldrig direktöversätta svenska småord som "det", "den", "finns" utan tänk på handlingen.'
      }
    ],
    examples: [
      {
        japanese: 'りんごを食べる。',
        furigana: 'りんごをたべる。',
        romaji: 'Ringo o taberu.',
        translationSv: 'Jag äter ett äpple. / (Någon) äter ett äpple.',
        literalSv: 'Äpple [objekt] äta.',
        audioText: 'りんごをたべる。'
      },
      {
        japanese: '行く？ ー 行く。',
        furigana: 'いく？ ー いく。',
        romaji: 'Iku? - Iku.',
        translationSv: 'Går du? – Ja, jag går. / Ska vi dra? – Visst.',
        literalSv: 'Gå? – Gå.',
        audioText: 'いく？いく。'
      },
      {
        japanese: '日本語はおもしろい。',
        furigana: 'にほんごはおもしろい。',
        romaji: 'Nihongo wa omoshiroi.',
        translationSv: 'Japanska är intressant.',
        literalSv: 'Vad gäller japanska [tema]: intressant.',
        audioText: 'にほんごはおもしろい。'
      }
    ],
    commonPitfallsSv: [
      'Börja inte varje mening med "Watashi wa..." (Jag är/Vad gäller mig). Använd det bara när du byter samtalsämne till dig själv.',
      'Placera aldrig verbet i mitten av en huvudsats. Verbet ska ankra slutet.'
    ],
    miniQuiz: [
      {
        id: 'q1-1',
        questionSv: 'Var i en japansk standardsats placeras verbet eller predikatet?',
        options: ['Alltid i början', 'I mitten efter subjektet', 'Alltid allra sist i satsen', 'Det beror på om det är en fråga'],
        correctIndex: 2,
        explanationSv: 'I japanska kommer verbet/tillståndet alltid sist. Det kallas SOV-struktur (Subject-Object-Verb) eller mer precist "head-final".'
      },
      {
        id: 'q1-2',
        questionSv: 'Hur säger du naturligt "Jag äter!" om någon frågar om du vill ha mat?',
        options: ['Watashi wa taberu desu ka', 'Taberu.', 'Watashi taberu ringo', 'Sore wa taberu'],
        correctIndex: 1,
        explanationSv: 'Att bara säga "Taberu" är helt naturligt och fullständigt på japanska eftersom kontexten redan klargör vem som äter!'
      }
    ]
  },
  {
    id: 'state-of-being-da-desu',
    chapterNumber: 2,
    partId: 'basics',
    titleSv: 'Vara-tillståndet: だ (da) & dess böjningar',
    titleJap: '状態の表現 (だ・じゃない・だった)',
    romajiTitle: 'Joutai no hyougen',
    readingTimeMin: 5,
    summarySv: 'Japanska har inget direkt verb för "att vara" (som engelskans is/are). Istället deklarerar man ett tillstånd med kopulan だ (da) eller artiga です (desu).',
    taeKimCoreInsightSv: 'Västerländska läroböcker lär ofta ut "desu = är". Det är felaktigt! "Desu" och "da" deklarerar helt enkelt att något är ett visst faktum ("Student-tillstånd råder"). Förnekelsen är inte ett verb utan böjs som ett i-adjektiv (じゃない).',
    ruleFormula: '[Substantiv / Na-adj] + だ (påstående) / じゃない (inte) / だった (dåtid)',
    sections: [
      {
        heading: '1. Deklarera ett tillstånd i presens',
        contentSv: 'När du vill påstå att något är ett substantiv (t.ex. "Det är en fisk" eller "Jag är student") lägger du till だ (da) i vardagligt tal eller です (desu) i artigt tal.',
        bulletPoints: [
          'さかな (Sakana = fisk) → さかなだ (Det är en fisk).',
          'がくせい (Gakusei = student) → がくせいだ (Är student).'
        ]
      },
      {
        heading: '2. Negation och dåtid av vara-tillståndet',
        contentSv: 'För att säga att något INTE är något använder man じゃない (janai) i vardagligt tal. I dåtid blir det だった (datta) och dåtid negativ じゃなかった (janakatta).',
        bulletPoints: [
          'Negation: じゃない (janai) = "är inte"',
          'Dåtid: だった (datta) = "var"',
          'Dåtid negativ: じゃなかった (janakatta) = "var inte"'
        ]
      }
    ],
    inflectionTable: {
      title: 'Kopulans 4 grundformer (Substantiv: がくせい / Student)',
      headers: ['Tillstånd', 'Vardaglig form (Tae Kim bas)', 'Artig form (Teineigo)'],
      rows: [
        { label: 'Presens bekräftande (Är)', plainPositive: 'がくせい だ (da)', plainNegative: '-', politePositive: 'がくせい です (desu)' },
        { label: 'Presens nekande (Är inte)', plainPositive: 'がくせい じゃない (janai)', plainNegative: '-', politePositive: 'がくせい じゃないです / ではありません' },
        { label: 'Preteritum (Var)', plainPositive: 'がくせい だった (datta)', plainNegative: '-', politePositive: 'がくせい でした (deshita)' },
        { label: 'Preteritum nekande (Var inte)', plainPositive: 'がくせい じゃなかった (janakatta)', plainNegative: '-', politePositive: 'がくせい じゃなかったです' }
      ]
    },
    examples: [
      {
        japanese: 'アリスは学生だ。',
        furigana: 'アリスはがくせいだ。',
        romaji: 'Arisu wa gakusei da.',
        translationSv: 'Alice är student.',
        literalSv: 'Vad gäller Alice: student-deklaration.',
        audioText: 'アリスはがくせいだ。'
      },
      {
        japanese: '友達じゃない。',
        furigana: 'ともだちじゃない。',
        romaji: 'Tomodachi janai.',
        translationSv: '(Vi/Han/Hon) är inte kompisar.',
        literalSv: 'Kompis är-inte.',
        audioText: 'ともだちじゃない。'
      },
      {
        japanese: '昨日は雨だった。',
        furigana: 'きのうはあめだった。',
        romaji: 'Kinou wa ame datta.',
        translationSv: 'Igår regnade det. / Igår var det regn.',
        literalSv: 'Vad gäller igår: regn-var.',
        audioText: 'きのうはあめだった。'
      }
    ],
    commonPitfallsSv: [
      'Använd ALDRIG だ (da) direkt efter ett い-adjektiv! Säg aldrig "oishii da" ❌, utan bara "oishii" eller artigt "oishii desu" ✔️.',
      'Blanda inte ihop じゃない (janai) med svenska negationer framför substantivet. Negationen kommer alltid efter ordet.'
    ],
    miniQuiz: [
      {
        id: 'q2-1',
        questionSv: 'Hur säger du "Det var inte en fisk" i vardagligt tal?',
        options: ['さかな じゃない', 'さかな じゃなかった', 'さかな だったない', 'さかな だ'],
        correctIndex: 1,
        explanationSv: 'Dåtid negativ av tillståndsmarkören är じゃなかった (janakatta). さかな じゃなかった = Det var inte en fisk.'
      },
      {
        id: 'q2-2',
        questionSv: 'Får man sätta だ (da) direkt efter ett い-adjektiv som 高い (takai)?',
        options: ['Ja, det är obligatoriskt', 'Nej, absolut inte! い-adjektiv innehåller redan sitt eget tillstånd', 'Bara i dåtid', 'Bara i skrift'],
        correctIndex: 1,
        explanationSv: 'Tae Kim betonar starkt: だ sätts endast efter substantiv och な-adjektiv. い-adjektiv böjs i sig själva och tar aldrig だ.'
      }
    ]
  },
  {
    id: 'particles-wa-vs-ga',
    chapterNumber: 3,
    partId: 'basics',
    titleSv: 'Partiklarna は (Tema) vs が (Identifierare)',
    titleJap: '助詞「は」と「が」の本質',
    romajiTitle: 'Joshi wa to ga no honshitsu',
    readingTimeMin: 6,
    summarySv: 'Tae Kims mest berömda kapitel. は (wa) definierar samtalsämnet ("Vad gäller X..."), medan が (ga) identifierar vem eller vad som gör något.',
    taeKimCoreInsightSv: 'Glöm regeln "wa = subjekt". Om du säger "Watashi wa ringo ga suki" betyder det ordagrant "Vad gäller mig [wa], äpplen [ga] är omtyckta". "Wa" flyttar strålkastaren till en scen; "ga" pekar ut den specifika skådespelaren.',
    ruleFormula: '[TEMA] は ... [SPECIFIK AKTÖR / SUBJEKT] が [PREDIKAT]',
    comparisonBox: {
      title: 'Skillnaden mellan は (wa) och が (ga)',
      summarySv: 'Den viktigaste distinktionen i hela den japanska grammatiken.',
      items: [
        {
          term: 'は (uttalas wa)',
          roleSv: 'Temamarkör (Topic)',
          nuanceSv: 'Sätter ramen för konversationen: "Vad beträffar X...", "Om vi pratar om X...". Informationen efter は är den nya nyheten.',
          exampleKana: 'たなかさんは せんせいです。',
          exampleSv: 'När det gäller Tanaka [tema], så är han lärare.'
        },
        {
          term: 'が (ga)',
          roleSv: 'Identifierare (Identifier / Subject)',
          nuanceSv: 'Pekar med fingret och svarar på frågan "VEM?" eller "VILKEN?". Betoningen ligger på ordet FÖRE が.',
          exampleKana: 'たなかさんが せんせいです。',
          exampleSv: 'Det är just Tanaka (och ingen annan) som är läraren!'
        }
      ]
    },
    sections: [
      {
        heading: '1. は (wa) lyfter upp ett tema på bordet',
        contentSv: 'När du använder は signalerar du till lyssnaren: "Här är ämnet vi pratar om nu". När ämnet väl är etablerat behöver du inte upprepa det i nästa mening.',
        bulletPoints: [
          'これ は ほん だ。 (Vad beträffar det här: det är en bok).',
          'När du ställer frågor med frågeord (Vem? Vad?) kan du ALDRIG använda は för frågeordet, eftersom ett okänt ord inte kan vara ett etablerat tema!'
        ]
      },
      {
        heading: '2. が (ga) svarar på frågeordet',
        contentSv: 'När du frågar "Vem är studenten?" (誰が学生？ Dare ga gakusei?) måste svaret använda が: "Alice ga gakusei" (Det är Alice som är studenten). が binder predikatet exklusivt till subjektet.'
      }
    ],
    examples: [
      {
        japanese: '誰が来ましたか？ ー 田中さんが来ました。',
        furigana: 'だれがきましたか？ ー たなかさんがきました。',
        romaji: 'Dare ga kimashita ka? - Tanaka-san ga kimashita.',
        translationSv: 'Vem kom? – Det var Tanaka som kom.',
        literalSv: 'Vem [identifierare] kom? – Tanaka [identifierare] kom.',
        audioText: 'だれがきましたか？たなかさんがきました。'
      },
      {
        japanese: '私は猫が好きだ。',
        furigana: 'わたしはねこがすきだ。',
        romaji: 'Watashi wa neko ga suki da.',
        translationSv: 'Jag gillar katter.',
        literalSv: 'Vad gäller mig [tema]: katter [identifierat objekt] är omtyckta.',
        audioText: 'わたしはねこがすきだ。'
      },
      {
        japanese: '今日は天気がいい。',
        furigana: 'きょうはてんきがいい。',
        romaji: 'Kyou wa tenki ga ii.',
        translationSv: 'Idag är vädret fint.',
        literalSv: 'Vad gäller idag [tema]: vädret [identifierare] är bra.',
        audioText: 'きょうはてんきがいい。'
      }
    ],
    commonPitfallsSv: [
      'Frågeord som 誰 (dare = vem), 何 (nani = vad), どこ (doko = var) kan ALDRIG följas av は. Skriv alltid 誰が (dare ga) och 何が (nani ga)!',
      'Tro inte att personen i meningen alltid måste ha は. I bisatser används nästan alltid が för subjektet.'
    ],
    miniQuiz: [
      {
        id: 'q3-1',
        questionSv: 'Hur översätter man bäst frågan "Vem åt kakan?" till japanska?',
        options: ['誰はケーキを食べた？ (Dare wa...)', '誰がケーキを食べた？ (Dare ga...)', '誰をケーキを食べた？ (Dare o...)', '誰にケーキを食べた？ (Dare ni...)'],
        correctIndex: 1,
        explanationSv: 'Frågeord (som 誰 = vem) kan aldrig vara ett tema med は. De kräver alltid identifieraren が (Dare ga...)'
      },
      {
        id: 'q3-2',
        questionSv: 'I meningen "私は猫が好きだ" (Watashi wa neko ga suki da), vad är funktionerna för は och が?',
        options: ['は markerar direkt objekt, が markerar verb', 'は anger samtalsämnet ("för min del"), が pekar ut det som gillas (katterna)', 'Båda betyder exakt samma sak', 'は används bara för djur'],
        correctIndex: 1,
        explanationSv: 'Precis! は sätter kontexten (för min del / vad gäller mig), medan が identifierar vad egenskapen "omtyckt" gäller (katterna).'
      }
    ]
  },
  {
    id: 'adjectives-i-vs-na',
    chapterNumber: 4,
    partId: 'basics',
    titleSv: 'Adjektivens två världar: い-adjektiv vs な-adjektiv',
    titleJap: '形容詞 (い形容詞とな形容詞)',
    romajiTitle: 'Keiyoushi (i-keiyoushi to na-keiyoushi)',
    readingTimeMin: 5,
    summarySv: 'Japanska adjektiv är inte som svenska. い-adjektiv fungerar som beskrivande miniverb som böjs i dåtid och negation. な-adjektiv beter sig som substantiv.',
    taeKimCoreInsightSv: 'Ett い-adjektiv som 高い (takai = dyr) bär redan på sitt eget "är"! Därför kan "Takai!" ensamt betyga "Det är dyrt!". Du lägger aldrig till だ. För att böja det klipper du bara bort sista い och sätter på くない, かった eller くなかった.',
    ruleFormula: 'い-adj: 〜い → 〜くない (inte) → 〜かった (dåtid) | な-adj: + な före substantiv, + だ i slutet',
    sections: [
      {
        heading: '1. Sanna adjektiv: い-adjektiv',
        contentSv: 'Slutar alltid på det enkla tecknet い (föregånget av a, i, u, o). De böjs direkt på sitt slut-i.',
        bulletPoints: [
          'Presens: たかい (Dyr / Är dyr)',
          'Negation: たかくない (Inte dyr / Är inte dyr)',
          'Dåtid: たかかった (Var dyr)',
          'Dåtid negativ: たかくなかった (Var inte dyr)',
          '⚠️ Undantag: いい (ii = bra) böjs från sin rot よい (yoi): よくない, よかった, よくなかった.'
        ]
      },
      {
        heading: '2. Nominala adjektiv: な-adjektiv',
        contentSv: 'Fungerar i grunden som substantiv. När de beskriver ett substantiv kräver de länkpartikeln な (na). När de står som predikat i slutet av en mening tar de だ / です precis som substantiv.',
        bulletPoints: [
          '静か (shizuka = tyst) → 静かな部屋 (shizuka na heya = ett tyst rum).',
          '部屋は静かだ (Heya wa shizuka da = Rummet är tyst).'
        ]
      }
    ],
    inflectionTable: {
      title: 'Böjningsmönster: い-adjektiv (高い) vs な-adjektiv (静か)',
      headers: ['Form', 'い-adjektiv (たかい)', 'な-adjektiv (しずか)'],
      rows: [
        { label: 'Presens bekräftande', plainPositive: 'たかい (takai)', plainNegative: '-', politePositive: 'しずか だ (shizuka da)' },
        { label: 'Presens nekande', plainPositive: 'たかくない (takakunai)', plainNegative: '-', politePositive: 'しずか じゃない (shizuka janai)' },
        { label: 'Preteritum', plainPositive: 'たかかった (takakatta)', plainNegative: '-', politePositive: 'しずか だった (shizuka datta)' },
        { label: 'Preteritum nekande', plainPositive: 'たかくなかった (takakunakatta)', plainNegative: '-', politePositive: 'しずか じゃなかった (shizuka janakatta)' }
      ]
    },
    examples: [
      {
        japanese: 'この映画はおもしろかった！',
        furigana: 'このえいがはおもしろかった！',
        romaji: 'Kono eiga wa omoshirokatta!',
        translationSv: 'Den här filmen var intressant!',
        literalSv: 'Denna film [tema]: intressant-var!',
        audioText: 'このえいがはおもしろかった！'
      },
      {
        japanese: '静かな町に住んでいる。',
        furigana: 'しずかなまちにすんでいる。',
        romaji: 'Shizuka na machi ni sunde iru.',
        translationSv: 'Jag bor i en lugn/tyst stad.',
        literalSv: 'Lugn [na] stad i boende är.',
        audioText: 'しずかなまちにすんでいる。'
      },
      {
        japanese: '昨日は天気がよくなかった。',
        furigana: 'きのうはてんきがよくなかった。',
        romaji: 'Kinou wa tenki ga yokunakatta.',
        translationSv: 'Igår var vädret inte bra.',
        literalSv: 'Igår [tema]: väder [identifierare] bra-inte-var.',
        audioText: 'きのうはてんきがよくなかった。'
      }
    ],
    commonPitfallsSv: [
      '⚠️ Kirei (きれい = vacker/ren) och Yuumei (ゆうめい = berömd) slutar på "i" i romaji, men är な-adjektiv! (Kirei na hito, inte kirei hito).',
      'Glöm inte att いい (bra) böjs som よくない och よかった, ALDRIG "ikunai" ❌.'
    ],
    miniQuiz: [
      {
        id: 'q4-1',
        questionSv: 'Hur säger du "Det var gott" med い-adjektivet 美味しい (oishii)?',
        options: ['美味しいだ (oishii da)', '美味しかったです (oishikatta desu / oishikatta)', '美味しいでした (oishii deshita)', '美味しかっただ (oishikatta da)'],
        correctIndex: 1,
        explanationSv: 'För い-adjektiv byts slut-い mot かった i dåtid: 美味しかった (oishikatta). Du lägger aldrig till だ!'
      },
      {
        id: 'q4-2',
        questionSv: 'Vilket slags adjektiv är きれい (kirei = ren/vacker)?',
        options: ['い-adjektiv eftersom det slutar på bokstaven i', 'な-adjektiv (skrivs 綺麗 och kräver な framför substantiv)', 'Ett oregelbundet verb', 'Ett adverb'],
        correctIndex: 1,
        explanationSv: 'き・れい är ett な-adjektiv som råkar sluta på ljudet "ei". Därför heter det "kirei na hana" (en vacker blomma).'
      }
    ]
  },
  {
    id: 'particles-wo-ni-he-de',
    chapterNumber: 5,
    partId: 'basics',
    titleSv: 'Partiklarna を, に, へ, で: Objekt, mål & plats',
    titleJap: '助詞「を」「に」「へ」「で」',
    romajiTitle: 'Joshi o, ni, e, de',
    readingTimeMin: 5,
    summarySv: 'Hur du kopplar samman handlingar med omvärlden: vad som påverkas (を), vart man rör sig eller när något sker (に/へ), och var handlingen utförs (で).',
    taeKimCoreInsightSv: 'En av de vanligaste förväxlingarna är に vs で för platser. Tae Kims minnesregel är glasklar: で markerar ARENAN där en dynamisk handling sker (äta, plugga). に markerar SLUTDESTINATIONEN för en rörelse eller ett statiskt varande (bo, sitta, finnas).',
    ruleFormula: '[Objekt] を | [Mål/Tid] に | [Riktning] へ | [Plats/Verktyg] で',
    comparisonBox: {
      title: 'Platsens två partiklar: に vs で',
      summarySv: 'Båda kan översättas till "i" eller "på", men beskriver helt skilda saker.',
      items: [
        {
          term: 'で (de)',
          roleSv: 'Plats för handling / Redskap',
          nuanceSv: 'Handlingen sker PÅ denna plats. Också medel: "med tåg", "med ätpinnar".',
          exampleKana: 'としょかんで べんきょうする。',
          exampleSv: 'Plugga på biblioteket (dynamisk aktivitet).'
        },
        {
          term: 'に (ni)',
          roleSv: 'Mål / Slutpunkt / Existens',
          nuanceSv: 'Rörelsens ändpunkt (gå TILL) eller var något bara FINNS (statiskt).',
          exampleKana: 'とうきょうに いく。 / いえに いる。',
          exampleSv: 'Åka till Tokyo. / Vara hemma.'
        }
      ]
    },
    sections: [
      {
        heading: '1. Direkt objekt med を (uttalas "o")',
        contentSv: 'Partikeln を fästs vid det substantiv som utsätts för verbets handling.',
        bulletPoints: [
          'ほん を よむ (Läsa en bok).',
          'みず を のむ (Dricka vatten).'
        ]
      },
      {
        heading: '2. Riktning med へ (uttalas "e")',
        contentSv: 'へ fungerar som en kompassnål. Till skillnad från に (som är det specifika målet) betonar へ rörelseriktningen mot något ("på väg mot").'
      }
    ],
    examples: [
      {
        japanese: '箸で寿司を食べます。',
        furigana: 'はしですしをたべます。',
        romaji: 'Hashi de sushi o tabemasu.',
        translationSv: 'Jag äter sushi med ätpinnar.',
        literalSv: 'Ätpinnar [medel] sushi [objekt] äter.',
        audioText: 'はしですしをたべます。'
      },
      {
        japanese: '学校に行きます。',
        furigana: 'がっこうにいきます。',
        romaji: 'Gakkou ni ikimasu.',
        translationSv: 'Jag går till skolan.',
        literalSv: 'Skola [måldestination] går.',
        audioText: 'がっこうにいきます。'
      },
      {
        japanese: 'カフェで本を読んだ。',
        furigana: 'カフェでほんをよんだ。',
        romaji: 'Kafe de hon o yonda.',
        translationSv: 'Jag läste en bok på kaféet.',
        literalSv: 'Kafé [handlingsplats] bok [objekt] läste.',
        audioText: 'カフェでほんをよんだ。'
      }
    ],
    commonPitfallsSv: [
      'Partikeln を skrivs med hiragana を men uttalas ALLTID som "o".',
      'Partikeln へ skrivs med hiragana へ men uttalas ALLTID som "e" när den är partikel.'
    ],
    miniQuiz: [
      {
        id: 'q5-1',
        questionSv: 'Vilken partikel saknas i: レストラン [ ? ] ご飯を食べた (Åt mat på restaurangen)?',
        options: ['に', 'で', 'へ', 'を'],
        correctIndex: 1,
        explanationSv: 'Att äta är en aktiv handling, så platsen där handlingen utförs ska markeras med で (de).'
      },
      {
        id: 'q5-2',
        questionSv: 'Hur uttalas partikeln へ när den används i "日本へ行く"?',
        options: ['He', 'E', 'Ni', 'Ha'],
        correctIndex: 1,
        explanationSv: 'Som partikel uttalas へ alltid som "e"!'
      }
    ]
  },

  // ----------------------------------------------------
  // DEL 2: VERBBÖJNING & TIDSFORMER
  // ----------------------------------------------------
  {
    id: 'verb-groups-ichidan-godan',
    chapterNumber: 6,
    partId: 'verbs_tenses',
    titleSv: 'Verbens 3 grupper: Ru-verb, U-verb & Oregelbundna',
    titleJap: '動詞の分類 (一段動詞と五段動詞)',
    romajiTitle: 'Doushi no bunrui',
    readingTimeMin: 6,
    summarySv: 'Alla japanska verb i ordboksform slutar på ett u-ljud. De delas in i två logiska huvudfamiljer: Ru-verb (Ichidan) och U-verb (Godan), plus två oregelbundna.',
    taeKimCoreInsightSv: 'Tae Kim använder termerna "ru-verb" och "u-verb". U-verb är fantastiskt matematiska: de vandrar längs Gojuon-tabellens 5 vokaler (a-i-u-e-o) beroende på böjning! Ru-verb är ännu enklare: du klipper bara bort る (ru) och klistrar på ändelsen.',
    ruleFormula: 'Ru-verb: slutar på [e/i] + る | U-verb: alla andra verb | Oregelbundna: する (suru) & くる (kuru)',
    sections: [
      {
        heading: '1. Ru-verb (Ichidan / 一段動詞)',
        contentSv: 'Slutar ALLTID på る (ru), och vokalen precis före る är ALLTID ett "i" eller "e"-ljud.',
        bulletPoints: [
          'たべる (taberu = äta) → vokal före ru är "e" → Ru-verb!',
          'みる (miru = se) → vokal före ru är "i" → Ru-verb!',
          'Böjningsregel: Droppa bara る! Stammen är tabe- respektive mi-.'
        ]
      },
      {
        heading: '2. U-verb (Godan / 五段動詞)',
        contentSv: 'Inkluderar ALLA verb som slutar på u, ku, gu, su, tsu, nu, bu, mu. Inkluderar även verb som slutar på る där föregående vokal är a, u eller o (t.ex. わ・かる = förstå, の・る = åka).',
        bulletPoints: [
          'いく (iku = gå), はなす (hanasu = prata), のむ (nomu = dricka).',
          'Böjningsregel: Det sista kana-tecknet skiftar rad i tabellen (t.ex. ku → ka, ki, ku, ke, ko).'
        ]
      },
      {
        heading: '3. De enda 2 oregelbundna verben i hela språket',
        contentSv: 'Japanska är extremt regelbundet jämfört med europeiska språk. Det finns bara två oregelbundna basverb:',
        bulletPoints: [
          'する (suru = att göra) → stammen blir shi- (しない, します).',
          'くる (kuru = att komma) → stammen blir ko- (こない) eller ki- (きます).'
        ]
      }
    ],
    inflectionTable: {
      title: 'Översikt över verbgrupper och stammar',
      headers: ['Grupp', 'Exempel', 'Negativ stam (Nai)', 'Artig stam (Masu)'],
      rows: [
        { label: 'Ru-verb (Ichidan)', plainPositive: 'たべる (taberu)', plainNegative: 'たべ- (tabenai)', politePositive: 'たべ- (tabemasu)', noteSv: 'Droppa bara る' },
        { label: 'U-verb (Godan)', plainPositive: 'のむ (nomu)', plainNegative: 'のま- (nomanai)', politePositive: 'のみ- (nomimasu)', noteSv: 'u → a (negation), u → i (artig)' },
        { label: 'U-verb (Ku-ändelse)', plainPositive: 'かく (kaku)', plainNegative: 'かか- (kakanai)', politePositive: 'かき- (kakimasu)', noteSv: 'ku → ka, ku → ki' },
        { label: 'Oregelbunden (Göra)', plainPositive: 'する (suru)', plainNegative: 'し- (shinai)', politePositive: 'し- (shimasu)', noteSv: 'Helt egen böjning' },
        { label: 'Oregelbunden (Komma)', plainPositive: 'くる (kuru)', plainNegative: 'こ- (konai)', politePositive: 'き- (kimasu)', noteSv: 'Växlar vokal: ku / ko / ki' }
      ]
    },
    examples: [
      {
        japanese: '毎日日本語を勉強する。',
        furigana: 'まいにちにほんごをべんきょうする。',
        romaji: 'Mainichi nihongo o benkyou suru.',
        translationSv: 'Jag studerar japanska varje dag.',
        literalSv: 'Varje dag japanska [objekt] studier-göra.',
        audioText: 'まいにちにほんごをべんきょうする。'
      },
      {
        japanese: '友達と話す。',
        furigana: 'ともだちとはなす。',
        romaji: 'Tomodachi to hanasu.',
        translationSv: 'Jag pratar med en vän.',
        literalSv: 'Vän [tillsammans med] prata (u-verb).',
        audioText: 'ともだちとはなす。'
      }
    ],
    commonPitfallsSv: [
      '⚠️ Några lömska verb ser ut som Ru-verb men är U-verb! De viktigaste att memorera: かえる (kaeru = gå hem), はいる (hairu = gå in), しる (shiru = veta), はしる (hashiru = springa). De böjs som U-verb: kaeranai, hairanai!',
      'Tro inte att alla verb som slutar på る är ru-verb.'
    ],
    miniQuiz: [
      {
        id: 'q6-1',
        questionSv: 'Vilken verbgrupp tillhör verbet 食べる (taberu = äta)?',
        options: ['U-verb (Godan)', 'Ru-verb (Ichidan)', 'Oregelbundet verb', 'Kopula'],
        correctIndex: 1,
        explanationSv: 'Det slutar på る och föregås av "e" (be). Det är ett typiskt Ru-verb (Ichidan).'
      },
      {
        id: 'q6-2',
        questionSv: 'Hur många oregelbundna verb finns det i grundläggande japanska?',
        options: ['Över 100 som i engelskan', 'Cirka 20', 'Endast 2: する (suru) och くる (kuru)', 'Inga alls'],
        correctIndex: 2,
        explanationSv: 'Japanska är otroligt tacksamt: det finns bara två oregelbundna basverb: suru och kuru!'
      }
    ]
  },
  {
    id: 'verb-negation-and-past',
    chapterNumber: 7,
    partId: 'verbs_tenses',
    titleSv: 'Negation (ナイ-form) & Preteritum (た-form)',
    titleJap: '動詞の否定形と過去形',
    romajiTitle: 'Doushi no hiteikei to kakokei',
    readingTimeMin: 6,
    summarySv: 'Hur du säger "äter inte" (tabenai) och "åt" (tabeta). När ett verb böjs till negation (〜ない) förvandlas det till ett い-adjektiv och böjs därefter!',
    taeKimCoreInsightSv: 'Tae Kims geniala observation: När du sätter 〜ない på ett verb (t.ex. 食べない tabenai = inte äta), slutar det på い. Från och med den sekunden beter det sig EXAKT som ett い-adjektiv! Dåtid negativ blir därför 食べなかった (tabenakatta), precis som takakunakatta!',
    ruleFormula: 'Ru-verb: droppa る + ない / た | U-verb: u → a + ない | Dåtid följer te-formens ljudskifte',
    sections: [
      {
        heading: '1. Bilda negation (Nai-form)',
        contentSv: 'För ru-verb: ta bort る och lägg till ない. För u-verb: ändra sista u-ljudet till motsvarande a-ljud och lägg till ない.',
        bulletPoints: [
          'Ru-verb: みる (se) → みない (ser inte)',
          'U-verb: かく (skriva) → かかない (skriver inte)',
          'U-verb: はなす (prata) → はなさない (pratar inte)',
          '⚠️ Verb som slutar på ren vokal う: u → wa! (かう kau → かわない kawanai, köper inte).'
        ]
      },
      {
        heading: '2. Bilda dåtid (Ta-form)',
        contentSv: 'Ta-formen bildas med exakt samma regler som て-formen (se nästa kapitel).',
        bulletPoints: [
          'Ru-verb: たべる → たべた (åt)',
          'U-verb: ku → いた (かく → かいた), mu/bu/nu → んだ (のむ → のんだ), su → した (はなす → はなした).'
        ]
      }
    ],
    inflectionTable: {
      title: 'Verbböjning i 4 tids- och jakandepositioner',
      headers: ['Verb', 'Presens bekräftande', 'Presens nekande', 'Preteritum', 'Preteritum nekande'],
      rows: [
        { label: 'Taberu (Ru)', plainPositive: 'たべる (taberu)', plainNegative: 'たべない (tabenai)', politePositive: 'たべた (tabeta)', noteSv: 'たべなかった (tabenakatta)' },
        { label: 'Nomu (U)', plainPositive: 'のむ (nomu)', plainNegative: 'のまない (nomanai)', politePositive: 'のんだ (nonda)', noteSv: 'のまなかった (nomanakatta)' },
        { label: 'Iku (U - undantag dåtid)', plainPositive: 'いく (iku)', plainNegative: 'いかない (ikanai)', politePositive: 'いった (itta)', noteSv: 'いかなかった (ikanakatta)' },
        { label: 'Suru (Oreg.)', plainPositive: 'する (suru)', plainNegative: 'しない (shinai)', politePositive: 'した (shita)', noteSv: 'しなかった (shinakatta)' },
        { label: 'Kuru (Oreg.)', plainPositive: 'くる (kuru)', plainNegative: 'こない (konai)', politePositive: 'きた (kita)', noteSv: 'こなかった (konakatta)' }
      ]
    },
    examples: [
      {
        japanese: '昨日は何も食べなかった。',
        furigana: 'きのうはなにもたべなかった。',
        romaji: 'Kinou wa nani mo tabenakatta.',
        translationSv: 'Igår åt jag ingenting.',
        literalSv: 'Igår [tema]: vad som helst inte-åt.',
        audioText: 'きのうはなにもたべなかった。'
      },
      {
        japanese: '手紙を書いた。',
        furigana: 'てがみをかいた。',
        romaji: 'Tegami o kaita.',
        translationSv: 'Jag skrev ett brev.',
        literalSv: 'Brev [objekt] skrev.',
        audioText: 'てがみをかいた。'
      }
    ],
    commonPitfallsSv: [
      'Glöm inte: för verb som slutar på う (t.ex. 買う kau = köpa) blir negationen 買わない (kawanai), ALDRIG "kaanai"!',
      'いく (iku = gå) har den oregelbundna dåtidsformen いった (itta), inte "iita".'
    ],
    miniQuiz: [
      {
        id: 'q7-1',
        questionSv: 'Vad blir negationen av u-verbet 飲む (nomu = dricka)?',
        options: ['のむない (nomunai)', 'のまない (nomanai)', 'のみない (nominai)', 'のめない (nomenai)'],
        correctIndex: 1,
        explanationSv: 'U-verb ändrar sitt u till a före ない: nomu → no-ma-nai.'
      },
      {
        id: 'q7-2',
        questionSv: 'Hur böjer man 食べない (äta inte) till dåtid ("åt inte")?',
        options: ['食べないだった', '食べたない', '食べなかった', '食べないでした'],
        correctIndex: 2,
        explanationSv: 'Eftersom 食べない slutar på い böjs det precis som ett い-adjektiv: ない → なかった (tabenakatta).'
      }
    ]
  },
  {
    id: 'magic-te-form',
    chapterNumber: 8,
    partId: 'verbs_tenses',
    titleSv: 'Den magiska て-formen: Samband & Pågående handling',
    titleJap: '「て形」の魔法 (接続と進行形)',
    romajiTitle: 'Te-kei no mahou',
    readingTimeMin: 7,
    summarySv: 'Te-formen är den viktigaste böjningsformen i hela japanskan. Den används för att binda ihop flera handlingar ("och så..."), be om saker, och bilda pågående presens (〜ている).',
    taeKimCoreInsightSv: 'Tänk på て (te) som ett kommatecken eller ordet "och". Det lämnar satsen öppen och svävande tills nästa verb tar vid. När du kombinerar て med いる (iru = finnas) får du 〜ている (te iru), vilket motsvarar engelskans "-ing" (pågående handling eller kvarstående tillstånd).',
    ruleFormula: 'Verb (te-form) + いる (pågående/tillstånd) | Verb1 (te) + Verb2 (följdhandling)',
    sections: [
      {
        heading: '1. Te-formens ljudskiftningsregler för U-verb',
        contentSv: 'Hur verbets ändelse förvandlas till te:',
        bulletPoints: [
          'う, つ, る → って (tte) : かう → かって, まつ → まって, とる → とって',
          'む, ぶ, ぬ → んで (nde) : のむ → のんで, あそぶ → あそんで, しぬ → しんで',
          'く → いて (ite) : かく → かいて (Undantag: いく → いって)',
          'ぐ → いで (ide) : およぐ → およいで',
          'す → して (shite) : はなす → はなして',
          'Ru-verb: droppa る + て (たべる → たべて, みる → みて)'
        ]
      },
      {
        heading: '2. Den mångsidiga konstruktionen 〜ている (te iru)',
        contentSv: 'Betyder antingen en aktiv pågående handling (håller på att äta) eller ett kvarstående tillstånd som uppstått (bor i Tokyo, är gift, vet).',
        bulletPoints: [
          'いま たべている (Håller på att äta just nu).',
          'とうきょうに すんでいる (Bor i Tokyo – tillstånd som varar).',
          'しっている (Vet / känner till – tillstånd).'
        ]
      }
    ],
    examples: [
      {
        japanese: '朝起きて、コーヒーを飲んだ。',
        furigana: 'あさおきて、コーヒーをのんだ。',
        romaji: 'Asa okite, koohii o nonda.',
        translationSv: 'Jag vaknade på morgonen och drack kaffe.',
        literalSv: 'Morgon vakna-och, kaffe [objekt] drack.',
        audioText: 'あさおきて、コーヒーをのんだ。'
      },
      {
        japanese: '今、日本語を勉強している。',
        furigana: 'いま、にほんごをべんきょうしている。',
        romaji: 'Ima, nihongo o benkyou shite iru.',
        translationSv: 'Just nu håller jag på och studerar japanska.',
        literalSv: 'Nu, japanska [objekt] studerande är.',
        audioText: 'いま、にほんごをべんきょうしている。'
      },
      {
        japanese: 'ちょっと待ってください。',
        furigana: 'ちょっとまってください。',
        romaji: 'Chotto matte kudasai.',
        translationSv: 'Vänta ett ögonblick, tack.',
        literalSv: 'Lite väntande [te] vänligen-ge.',
        audioText: 'ちょっとまってください。'
      }
    ],
    commonPitfallsSv: [
      '⚠️ Svenskt tänkande: "Jag känner till / vet" heter på japanska 知っている (shitte iru = te-form + iru). Men "jag vet inte" heter 知らない (shiranai), INTE "shitte inai"!',
      'Glöm inte att 行く (iku) blir 行って (itte), inte "iite".'
    ],
    miniQuiz: [
      {
        id: 'q8-1',
        questionSv: 'Vad är te-formen av verbet 飲む (nomu = dricka)?',
        options: ['のみて (nomite)', 'のんで (nonde)', 'のって (notte)', 'のまて (nomate)'],
        correctIndex: 1,
        explanationSv: 'Verb som slutar på む (mu), ぶ (bu) och ぬ (nu) får alltid ändelsen んで (nde): nomu → nonde.'
      },
      {
        id: 'q8-2',
        questionSv: 'Vad uttrycker meningen "本を読んでいる"?',
        options: ['Jag har aldrig läst en bok', 'Jag vill läsa en bok', 'Jag håller på och läser en bok (pågående handling)', 'Läs boken!'],
        correctIndex: 2,
        explanationSv: 'Te-form + いる uttrycker att handlingen pågår just nu: håller på att läsa.'
      }
    ]
  },
  {
    id: 'transitive-vs-intransitive',
    chapterNumber: 9,
    partId: 'verbs_tenses',
    titleSv: 'Transitiva vs Intransitiva verb (他動詞 vs 自動詞)',
    titleJap: '自動詞と他動詞の使い分け',
    romajiTitle: 'Jidoushi to tadoushi',
    readingTimeMin: 5,
    summarySv: 'Öppnar du dörren, eller öppnas dörren av sig själv? Japanska skiljer stenhårt mellan verb med en aktiv aktör (transitiva) och verb som beskriver en spontan förändring (intransitiva).',
    taeKimCoreInsightSv: 'I svenska använder vi ofta samma ord ("Jag öppnar dörren" vs "Dörren öppnas"). I japanska är det två helt olika verb med olika partiklar: [Subjekt] が 開く (aku = dörren öppnas av sig själv) vs [Aktör] が [Objekt] を 開ける (akeru = någon öppnar dörren).',
    ruleFormula: 'Intransitiv (spontan händelse): [Ting] が [Verb-Jidoushi] | Transitiv (avsiktlig handling): [Objekt] を [Verb-Tadoushi]',
    comparisonBox: {
      title: 'Vanliga verbpar: Intransitiv (自動詞) vs Transitiv (他動詞)',
      summarySv: 'Lägg märke till hur partiklarna が och を speglar skillnaden.',
      items: [
        {
          term: '開く (aku) vs 開ける (akeru)',
          roleSv: 'Öppnas vs Öppna',
          nuanceSv: 'Dörren öppnas (av vinden/sig själv) vs Jag öppnar dörren.',
          exampleKana: 'ドアが あく。 / ドアを あける。',
          exampleSv: 'Dörren öppnas. / Öppnar dörren.'
        },
        {
          term: '消える (kieru) vs 消す (kesu)',
          roleSv: 'Slockna vs Släcka/Stänga av',
          nuanceSv: 'Ljuset slocknar av sig självt vs Någon släcker lyset.',
          exampleKana: 'でんきが きえる。 / でんきを けす。',
          exampleSv: 'Ljuset slocknar. / Släcker ljuset.'
        },
        {
          term: '入る (hairu) vs 入れる (ireru)',
          roleSv: 'Gå in vs Stoppa in / Lägga i',
          nuanceSv: 'Katten går in i rummet vs Stoppa ner boken i väskan.',
          exampleKana: 'へやに はいる。 / かばんに いれる。',
          exampleSv: 'Gå in i rummet. / Lägga i väskan.'
        }
      ]
    },
    sections: [
      {
        heading: '1. Varför är detta så avgörande i japanska?',
        contentSv: 'I japansk kultur tonar man ofta ner personligt ansvar eller fokuserar på sakernas tillstånd. Därför används intransitiva verb mycket mer frekvent än i svenskan.',
        bulletPoints: [
          'Istället för "Jag tappade min plånbok" säger man ofta "Plånboken föll bort" (さいふが おちた).',
          'Kombinerat med 〜ている beskriver intransitiva verb tillståndet: ドアが開いている (Dörren står öppen).'
        ]
      }
    ],
    examples: [
      {
        japanese: '窓が開いている。',
        furigana: 'まどがあいている。',
        romaji: 'Mado ga aite iru.',
        translationSv: 'Fönstret står öppet.',
        literalSv: 'Fönster [identifierare] öppnat-varande.',
        audioText: 'まどがあいている。'
      },
      {
        japanese: '電気を消してください。',
        furigana: 'でんきをけしてください。',
        romaji: 'Denki o keshite kudasai.',
        translationSv: 'Släck lampan, tack.',
        literalSv: 'Lampa [objekt] släcka-vänligen.',
        audioText: 'でんきをけしてください。'
      }
    ],
    commonPitfallsSv: [
      'Para aldrig ihop partikeln を med ett intransitivt verb (t.ex. "doa o aku" ❌). Intransitiva verb tar inte direkta objekt!',
      'Lär dig verben i par redan från början så slipper du blanda ihop dem senare.'
    ],
    miniQuiz: [
      {
        id: 'q9-1',
        questionSv: 'Vilken mening är korrekt om du själv vill öppna fönstret?',
        options: ['窓が開く (Mado ga aku)', '窓を開ける (Mado o akeru)', '窓で開ける (Mado de akeru)', '窓を開く (Mado o aku)'],
        correctIndex: 1,
        explanationSv: 'Att öppna något avsiktligt är det transitiva verbet 開ける (akeru), som tar det direkta objektet med を: 窓を開ける.'
      },
      {
        id: 'q9-2',
        questionSv: 'Vad betyder meningen "電気を消した"?',
        options: ['Lampan slocknade av sig själv', 'Jag släckte lampan', 'Lampan är trasig', 'Det är ljust'],
        correctIndex: 1,
        explanationSv: '消す (kesu) är det transitiva verbet för att släcka/stänga av något.'
      }
    ]
  },
  {
    id: 'relative-clauses-noun-modification',
    chapterNumber: 10,
    partId: 'verbs_tenses',
    titleSv: 'Substantivmodifiering & Bisatser (Relative Clauses)',
    titleJap: '名詞修飾と関係節',
    romajiTitle: 'Meishi shuushoku',
    readingTimeMin: 6,
    summarySv: 'Hur skapar man meningar som "Boken som jag läste igår" eller "Personen som lagar mat"? I japanska behövs inga relativa pronomen ("som/vilken") – du sätter bara hela satsen rakt framför substantivet!',
    taeKimCoreInsightSv: 'I svenska säger vi: "Personen [SOM kom hit igår]". Vi lägger till ordet "som" och placerar bisatsen EFTER substantivet. På japanska placeras ALLT som beskriver ett substantiv FÖRE substantivet: "[きのう きた] ひと" ([Igår kom-som] person). Enkelt, elegant och kraftfullt!',
    ruleFormula: '[Hel sats i vanlig form (plain)] + [Substantiv]',
    sections: [
      {
        heading: '1. Inga småord krävs!',
        contentSv: 'Du behöver aldrig översätta ord som "som", "vilket" eller "där". Allt du gör är att ta en komplett sats i vardagsform (plain form) och ställa den direkt framför substantivet.',
        bulletPoints: [
          '本を読んだ (Läste en bok) + 人 (Person) → 本を読んだ人 (Personen som läste en bok).',
          'きのう買った (Köpte igår) + パン (Bröd) → きのう買ったパン (Brödet jag köpte igår).'
        ]
      },
      {
        heading: '2. Subjektet i en bisats tar が (ga)',
        contentSv: 'Inuti den beskrivande bisatsen markeras subjektet nästan uteslutande med が (ga), aldrig med は.',
        bulletPoints: [
          '田中さんが作ったケーキ (Kakan som Tanaka bakade).'
        ]
      }
    ],
    examples: [
      {
        japanese: '昨日見た映画はとても面白かった。',
        furigana: 'きのうみたえいがはとてもおもしろかった。',
        romaji: 'Kinou mita eiga wa totemo omoshirokatta.',
        translationSv: 'Filmen som jag såg igår var väldigt intressant.',
        literalSv: '[Igår såg] film [tema]: väldigt intressant-var.',
        audioText: 'きのうみたえいがはとてもおもしろかった。'
      },
      {
        japanese: '日本で買った時計をなくした。',
        furigana: 'にほんでかったとけいをなくした。',
        romaji: 'Nihon de katta tokei o nakushita.',
        translationSv: 'Jag tappade bort klockan som jag köpte i Japan.',
        literalSv: '[I Japan köpte] klocka [objekt] tappade-bort.',
        audioText: 'にほんでかったとけいをなくした。'
      }
    ],
    commonPitfallsSv: [
      'Använd ALDRIG artig form (masu/desu) inuti den beskrivande bisatsen! Skriv inte "kaimashita tokei" ❌, utan alltid plain form: "katta tokei" ✔️.',
      'Sätt inte bisatsen efter substantivet som på svenska.'
    ],
    miniQuiz: [
      {
        id: 'q10-1',
        questionSv: 'Hur säger du "Maten som mamma lagade" på japanska?',
        options: ['母は料理を作ったご飯', '母が作った料理 (Haha ga tsukutta ryouri)', '料理が母を作った', '作った料理は母'],
        correctIndex: 1,
        explanationSv: 'Bisatsen "[Haha ga tsukutta]" (Mamma lagade) placeras direkt framför substantivet "ryouri" (mat/rätt).'
      },
      {
        id: 'q10-2',
        questionSv: 'Vilken form måste verbet ha när det modifierar ett substantiv i en bisats?',
        options: ['Alltid artig masu-form', 'Alltid ordboksform / plain form (t.ex. tabeta, taberu)', 'Te-form', 'Imperativ'],
        correctIndex: 1,
        explanationSv: 'Bisatser som modifierar substantiv står alltid i den vanliga basformen (plain form).'
      }
    ]
  },

  // ----------------------------------------------------
  // DEL 3: ESSENTIELL GRAMMATIK & SOCIALA NYANSER
  // ----------------------------------------------------
  {
    id: 'noun-particles-to-ya-mo-no',
    chapterNumber: 11,
    partId: 'essential',
    titleSv: 'Partiklarna と, や, も, の: Listor, likhet & ägande',
    titleJap: '名詞の助詞「と」「や」「も」「の」',
    romajiTitle: 'Meishi no joshi to, ya, mo, no',
    readingTimeMin: 5,
    summarySv: 'Fyra oumbärliga partiklar som kopplar ihop substantiv: と för kompletta listor ("och"), や för exempel ("bland annat"), も för "också", och の för ägande och beskrivning.',
    taeKimCoreInsightSv: 'Svenska har bara ordet "och", men japanska skiljer på uttömmande listor (と = exakt dessa och inga fler) och öppna listor (や = till exempel dessa saker bland andra). Dessutom är の det ultimata länkordet som binder samman substantiv från det stora till det lilla.',
    ruleFormula: 'A と B (A och B) | A や B (saker som A och B) | A も (A också) | A の B (B som tillhör/kännetecknas av A)',
    comparisonBox: {
      title: 'Listandets konst: と vs や',
      summarySv: 'Välj partikel beroende på om din lista är komplett eller ett urval.',
      items: [
        {
          term: 'と (to)',
          roleSv: 'Fullständig lista / Tillsammans med',
          nuanceSv: 'Räknar upp alla ingående saker. Inget mer finns på listan.',
          exampleKana: 'りんごと みかんを かった。',
          exampleSv: 'Jag köpte äpplen och mandariner (och inget annat).'
        },
        {
          term: 'や (ya)',
          roleSv: 'Exempellista ("bland annat")',
          nuanceSv: 'Öppen lista. Ofta avslutas den med など (nado = och så vidare).',
          exampleKana: 'ほんや ペンを かった。',
          exampleSv: 'Jag köpte böcker och pennor (bland annat).'
        }
      ]
    },
    sections: [
      {
        heading: '1. Partikeln も (mo): "Också" eller "även"',
        contentSv: 'Partikeln も ersätter は, が och を helt när du vill uttrycka att något också gäller.',
        bulletPoints: [
          'わたし は がくせい だ → わたし も がくせい だ (Jag är OCKSÅ student).',
          'みず を のむ → みず も のむ (Dricker OCKSÅ vatten).'
        ]
      },
      {
        heading: '2. Partikeln の (no): Ägande och beskrivning',
        contentSv: 'Binder samman substantiv. Går alltid från det överordnade till det specifika (t.ex. Land → Skola → Min bok).',
        bulletPoints: [
          'わたしのほん (Min bok)',
          'にほんごのせんせい (Lärare i japanska)'
        ]
      }
    ],
    examples: [
      {
        japanese: '田中さんも行く。',
        furigana: 'たなかさんもいく。',
        romaji: 'Tanaka-san mo iku.',
        translationSv: 'Tanaka följer också med.',
        literalSv: 'Tanaka [också] går.',
        audioText: 'たなかさんもいく。'
      },
      {
        japanese: '机の上に本やペンなどがある。',
        furigana: 'つくえのうえにほんやペンなどがある。',
        romaji: 'Tsukue no ue ni hon ya pen nado ga aru.',
        translationSv: 'På skrivbordet finns saker som böcker och pennor.',
        literalSv: 'Skrivbord [no] ovansida på bok [ya] penna [m.m.] [ga] finns.',
        audioText: 'つくえのうえにほんやペンなどがある。'
      }
    ],
    commonPitfallsSv: [
      'Skriv aldrig "watashi wa mo" ❌! Partikeln も ersätter は helt: "watashi mo" ✔️.',
      'Ordningen med の är omvänd mot svenskt genitiv ibland: "Japanskspråkig lärare" = 日本語の先生 (Nihongo no sensei).'
    ],
    miniQuiz: [
      {
        id: 'q11-1',
        questionSv: 'Vad händer med partikeln は när du vill säga "Jag vill OCKSÅ äta"?',
        options: ['Den står kvar före mo (wa mo)', 'Den byts ut helt mot mo (Watashi mo)', 'Den flyttas till slutet', 'Den ändras till ga'],
        correctIndex: 1,
        explanationSv: 'Partikeln も ersätter partiklarna は, が och を helt och hållet.'
      },
      {
        id: 'q11-2',
        questionSv: 'När använder du partikeln や (ya) istället för と (to)?',
        options: ['När du vill ge en fullständig lista', 'När du bara nämner några exempel bland flera möjliga saker', 'Bara med människor', 'Bara i dåtid'],
        correctIndex: 1,
        explanationSv: 'や används för icke-uttömmande listor ("saker som A och B, bland annat").'
      }
    ]
  },
  {
    id: 'polite-vs-casual-form',
    chapterNumber: 12,
    partId: 'essential',
    titleSv: 'Artig form (です / ます) vs Vardagsform & Social distans',
    titleJap: '丁寧語と普通形 (社会的距離)',
    romajiTitle: 'Teineigo to futsuukei',
    readingTimeMin: 6,
    summarySv: 'I japanska signalerar grammatiken inte bara vad du säger, utan din relation till den du pratar med. Artig form skapar en respektfull skyddsbuffert, medan vardagsformen bygger intimitet.',
    taeKimCoreInsightSv: 'De flesta läroböcker börjar med "masu" och "desu". Tae Kim lär ut vardagsformen först eftersom vardagsformen är det sanna språket. Masu och desu är i själva verket bara "artighetsskal" som klistras på i slutet av meningen för att hålla social distans till främlingar och överordnade.',
    ruleFormula: 'Verb-stam + ます (masu) | Substantiv/Adjektiv + です (desu)',
    sections: [
      {
        heading: '1. När använder man vad?',
        contentSv: 'Artig form (Teineigo) är standarden när du pratar med lärare, butikspersonal, kollegor och personer du inte känner väl. Vardagsform (Futsuukei) används med familj, nära vänner och personer i samma ålder eller yngre.',
        bulletPoints: [
          'Vardaglig: 食べる (taberu) → Artig: 食べます (tabemasu)',
          'Vardaglig: 飲まない (nomanai) → Artig: 飲みません (nomimasen)',
          'Vardaglig: 飲んだ (nonda) → Artig: 飲みました (nomimashita)'
        ]
      },
      {
        heading: '2. Hur masu-formen byggs',
        contentSv: 'Masu läggs till på verbets "i-stam" (den stam som U-verb har på i-raden, och Ru-verb har när ru klipps bort).',
        bulletPoints: [
          'Ru-verb: たべる → たべ + ます = たべます',
          'U-verb: いく (iku) → いき + ます = いきます',
          'U-verb: はなす (hanasu) → はなし + ます = はなします'
        ]
      }
    ],
    inflectionTable: {
      title: 'Artighetsändelser för verb (ます-systemet)',
      headers: ['Form', 'Bekräftande (+)', 'Nekande (-)'],
      rows: [
        { label: 'Presens / Framtid', plainPositive: '〜ます (tabemasu - äter)', plainNegative: '〜ません (tabemasen - äter inte)' },
        { label: 'Preteritum (Dåtid)', plainPositive: '〜ました (tabemashita - åt)', plainNegative: '〜ませんでした (tabemasen deshita - åt inte)' },
        { label: 'Förslag ("Ska vi?")', plainPositive: '〜ましょう (tabemashou - låt oss äta)', plainNegative: '〜ませんか (tabemasen ka - vill du inte äta?)' }
      ]
    },
    examples: [
      {
        japanese: '明日は大学に行きます。',
        furigana: 'あしたはだいがくにいきます。',
        romaji: 'Ashita wa daigaku ni ikimasu.',
        translationSv: 'Imorgon går jag till universitetet. (Artigt)',
        literalSv: 'Imorgon [tema]: universitet till gå-artigt.',
        audioText: 'あしたはだいがくにいきます。'
      },
      {
        japanese: '肉は食べません。',
        furigana: 'にくはたべません。',
        romaji: 'Niku wa tabemasen.',
        translationSv: 'Jag äter inte kött. (Artigt)',
        literalSv: 'Kött [tema]: ät-inte-artigt.',
        audioText: 'にくはたべません。'
      }
    ],
    commonPitfallsSv: [
      'Blanda inte stilnivåer hejvilt i samma konversation. Håll dig antingen till artig stil eller vardaglig stil gentemot en samtalspartner.',
      'Använd ALDRIG masu-form inuti en relativ bisats (t.ex. "ikimasu hito" ❌).'
    ],
    miniQuiz: [
      {
        id: 'q12-1',
        questionSv: 'Vad är dåtidsformen av 飲みます (dricker artigt)?',
        options: ['飲みました (Nomimashita)', '飲んだです (Nonda desu)', '飲みましたでした', '飲みてでした'],
        correctIndex: 0,
        explanationSv: 'Dåtid av ます är alltid ました (mashita): 飲みました.'
      },
      {
        id: 'q12-2',
        questionSv: 'Vilken form bör du använda när du pratar med en butiksanställd eller en professor?',
        options: ['Vardagsform (da/taberu)', 'Artig form (desu/masu)', 'Slang', 'Bara gester'],
        correctIndex: 1,
        explanationSv: 'Gentemot främlingar, lärare och i professionella sammanhang är artig form (Teineigo) den förväntade artighetsbufferten.'
      }
    ]
  },
  {
    id: 'addressing-people-and-pronouns',
    chapterNumber: 13,
    partId: 'essential',
    titleSv: 'Tilltal, Titlar (-san, -kun) & "Du"-fällan',
    titleJap: '人称代名詞と敬称 (「あなた」の罠)',
    romajiTitle: 'Ninshou daimeishi to keishou',
    readingTimeMin: 5,
    summarySv: 'Varför ska man nästan aldrig säga "anata" (du) på japanska? Lär dig hur man tilltalar personer med respektfulla suffix och varför japaner föredrar att använda personens roll eller namn.',
    taeKimCoreInsightSv: 'I engelska och svenska är "du" det normala tilltalet. I japanska låter "anata" distanserat, anklagande eller som ett tilltal mellan äkta makar. Riktig japanska använder personens efternamn + suffix (Tanaka-san), personens titel (Sensei), eller utelämnar ordet helt!',
    ruleFormula: '[Efternamn / Förnamn] + さん (-san) / くん (-kun) / ちゃん (-chan) / 先生 (sensei)',
    comparisonBox: {
      title: 'Vanliga japanska hederstitlar (Suffix)',
      summarySv: 'Sätts alltid på den andra personens namn, ALDRIG på ditt eget!',
      items: [
        {
          term: '〜さん (-san)',
          roleSv: 'Universellt artigt (Herr/Fru)',
          nuanceSv: 'Det säkra standardvalet för alla vuxna du inte är extremt nära vän med.',
          exampleKana: 'たなかさん',
          exampleSv: 'Tanaka-san'
        },
        {
          term: '〜くん (-kun)',
          roleSv: 'Vänskapligt / Yngre (ofta killar)',
          nuanceSv: 'Används för jämnåriga killar, pojkar, eller underordnade på en arbetsplats.',
          exampleKana: 'けんくん',
          exampleSv: 'Ken-kun'
        },
        {
          term: '〜ちゃん (-chan)',
          roleSv: 'Gulligt / Förtroligt',
          nuanceSv: 'För små barn, husdjur, eller nära kvinnliga vänner.',
          exampleKana: 'ゆきちゃん',
          exampleSv: 'Yuki-chan'
        },
        {
          term: '先生 (sensei)',
          roleSv: 'Lärare / Läkare / Författare',
          nuanceSv: 'Står antingen ensamt eller efter namnet för mästare inom ett yrke.',
          exampleKana: 'せんせい、しつもんがあります。',
          exampleSv: 'Sensei, jag har en fråga.'
        }
      ]
    },
    sections: [
      {
        heading: '1. Personliga pronomen för "Jag"',
        contentSv: 'I japanska väljer man pronomen efter kontext och personlighet:',
        bulletPoints: [
          'わたし (watashi) : Neutral standard för alla vuxna, särskilt artigt och för kvinnor.',
          'ぼく (boku) : Mjukt, ödmjukt och vanligt bland pojkar och unga män.',
          'おれ (ore) : Tufft, informellt för män bland nära kompisar. Används aldrig mot överordnade!',
          'わたくし (watakushi) : Extremt formellt affärsspråk.'
        ]
      }
    ],
    examples: [
      {
        japanese: '田中さんは明日来ますか？',
        furigana: 'たなかさんはあすきますか？',
        romaji: 'Tanaka-san wa asu kimasu ka?',
        translationSv: 'Kommer du imorgon, Tanaka? (Ordagrant: Kommer Tanaka imorgon?)',
        literalSv: 'Tanaka-san [tema]: imorgon kommer-fråga?',
        audioText: 'たなかさんはあすきますか？'
      },
      {
        japanese: '先生、ありがとうございました。',
        furigana: 'せんせい、ありがとうございました。',
        romaji: 'Sensei, arigatou gozaimashita.',
        translationSv: 'Tack så mycket, läraren! (Till sin lärare)',
        literalSv: 'Lärare, tack så mycket var.',
        audioText: 'せんせい、ありがとうございました。'
      }
    ],
    commonPitfallsSv: [
      '⚠️ Kalla ALDRIG dig själv för "-san" (t.ex. "Watashi wa Anna-san desu" ❌). Det låter som att du hyllar dig själv!',
      'Undvik att slänga dig med "anata". Om du vet personens namn, använd namnet + san.'
    ],
    miniQuiz: [
      {
        id: 'q13-1',
        questionSv: 'Vad är den viktigaste regeln för namnändelser som -san och -kun?',
        options: ['De måste alltid sättas på ditt eget namn också', 'De används ALDRIG om dig själv, bara om andra', 'De används bara i skrift', 'De ersätter alla verb'],
        correctIndex: 1,
        explanationSv: 'Att sätta en hederstitel på sig själv betraktas som en stor social faux pas. Du presenterar dig alltid utan -san.'
      },
      {
        id: 'q13-2',
        questionSv: 'Varför bör man undvika att använda "anata" (du) i vardagen?',
        options: ['För att det betyder "fiende"', 'För att det kan uppfattas distanserat eller nedlåtande – det är mycket mer naturligt att använda personens namn + san', 'För att det bara får användas av kejsaren', 'För att grammatiken förbjuder pronomen'],
        correctIndex: 1,
        explanationSv: 'Japaner använder hellre personens efternamn eller titel (eller utelämnar pronomenet helt) än att säga "anata".'
      }
    ]
  },
  {
    id: 'question-marker-and-sentence-particles',
    chapterNumber: 14,
    partId: 'essential',
    titleSv: 'Frågor & Slutpartiklar: か, ね, よ',
    titleJap: '終助詞「か」「ね」「よ」',
    romajiTitle: 'Shuujoshi ka, ne, yo',
    readingTimeMin: 5,
    summarySv: 'Slutpartiklar ger japanskan dess känslomässiga färg. Frågepartikeln か fungerar som ett muntligt frågetecken, medan ね söker bekräftelse och よ delar med sig av ny information.',
    taeKimCoreInsightSv: 'I skriftlig och artig japanska avslutar か frågan utan att man behöver ett frågetecken. Men i vardagligt tal låter か ofta för hårt och abrupt! Därför ställer vänner frågor genom att helt enkelt höja tonen i slutet av meningen eller använda partikeln の.',
    ruleFormula: 'Sats + か (fråga) | Sats + ね (håller du inte med?) | Sats + よ (jag upplyser dig!)',
    sections: [
      {
        heading: '1. Slutpartikeln ね (ne): Instämmande',
        contentSv: 'Motsvarar svenskans "eller hur?", "visst?" eller engelskans "isn\'t it?". Den bjuder in lyssnaren till gemenskap och medhåll.',
        bulletPoints: [
          'いい 天気 です ね (Fint väder idag, eller hur?).',
          '美味しい ね (Gott, va?).'
        ]
      },
      {
        heading: '2. Slutpartikeln よ (yo): Påstående / Ny information',
        contentSv: 'Används när talaren har kunskap som lyssnaren antas sakna. Fungerar som ett utropstecken eller "hörru, det är faktiskt så här!".',
        bulletPoints: [
          'これ は 美味しい よ (Den här är faktiskt jättegod, ska du veta!).',
          '時間 が ない よ (Vi har ingen tid kvar, vet du!).'
        ]
      }
    ],
    examples: [
      {
        japanese: 'これは何ですか？',
        furigana: 'これはなんですか？',
        romaji: 'Kore wa nan desu ka?',
        translationSv: 'Vad är det här? (Artig fråga)',
        literalSv: 'Detta [tema]: vad är [ka]?',
        audioText: 'これはなんですか？'
      },
      {
        japanese: '明日は休みだよ！',
        furigana: 'あしたはやすみだよ！',
        romaji: 'Ashita wa yasumi da yo!',
        translationSv: 'Imorgon är vi lediga, vet du!',
        literalSv: 'Imorgon [tema]: ledighet är [yo]!',
        audioText: 'あしたはやすみだよ！'
      },
      {
        japanese: '日本語は面白いですね。',
        furigana: 'にほんごはおもしろいですね。',
        romaji: 'Nihongo wa omoshiroi desu ne.',
        translationSv: 'Japanska är intressant, eller hur?',
        literalSv: 'Japanska [tema]: intressant är [ne].',
        audioText: 'にほんごはおもしろいですね。'
      }
    ],
    commonPitfallsSv: [
      'Överanvänd inte よ (yo) i varje mening – det kan låta tjatigt eller påstridigt.',
      'Sätt inte か efter vardagligt だ (t.ex. "da ka" ❌). Det låter mycket aggressivt på japanska.'
    ],
    miniQuiz: [
      {
        id: 'q14-1',
        questionSv: 'Vilken slutpartikel använder du när du vill säga "Filmen var fantastisk, eller hur?" och söker den andres medhåll?',
        options: ['よ (yo)', 'ね (ne)', 'か (ka)', 'わ (wa)'],
        correctIndex: 1,
        explanationSv: 'ね (ne) söker medhåll och samförstånd ("eller hur?").'
      },
      {
        id: 'q14-2',
        questionSv: 'Hur ställer man normalt en vardaglig fråga till en kompis ("Äter du?")?',
        options: ['Taberu da ka?', 'Taberu? (med stigande tonfall i rösten)', 'Taberu desu ka zo', 'Taberu yo ka'],
        correctIndex: 1,
        explanationSv: 'I vardagligt tal använder man sällan か direkt, utan höjer bara tonfallet i slutet: Taberu? ⤴️'
      }
    ]
  },
  {
    id: 'reasons-kara-vs-node',
    chapterNumber: 15,
    partId: 'essential',
    titleSv: 'Orsakssamband: から vs ので ("Därför att")',
    titleJap: '理由の表現「から」と「ので」',
    romajiTitle: 'Riyuu no hyougen kara to node',
    readingTimeMin: 5,
    summarySv: 'Både から (kara) och ので (node) betyder "eftersom" eller "därför att". Men から uttrycker en personlig, subjektiv åsikt, medan ので presenterar en objektiv, artig förklaring.',
    taeKimCoreInsightSv: 'Tänk på から som talarens egna känslor ("Det regnar, så JAG vill inte gå ut!"). Tänk på ので som en neutral naturkraft eller artig förklaring ("Eftersom tåget är försenat ber vi om ursäkt"). Därför är ので alltid säkrare i artiga ursäkter.',
    ruleFormula: '[Orsak] から / ので、 [Konsekvens / Resultat]',
    comparisonBox: {
      title: 'Skillnaden mellan から och ので',
      summarySv: 'Valet av bindeord avgör om orsaken uppfattas som en personlig åsikt eller ett objektivt faktum.',
      items: [
        {
          term: 'から (kara)',
          roleSv: 'Subjektiv orsak',
          nuanceSv: 'Fokuserar på talarens vilja, förslag eller varningar. Kan användas för direkta uppmaningar.',
          exampleKana: 'あぶないから、やめて！',
          exampleSv: 'Det är farligt, så sluta! (Direkt uppmaning)'
        },
        {
          term: 'ので (node)',
          roleSv: 'Objektiv / Artig anledning',
          nuanceSv: 'Mjukare och mer respektfullt. Låter som "Eftersom omständigheterna är sådana...".',
          exampleKana: 'じかんが ないので、しつれいします。',
          exampleSv: 'Eftersom tiden är knapp ber jag att få avvika. (Artigt)'
        }
      ]
    },
    sections: [
      {
        heading: '1. Ordföljden är omvänd mot svenskan',
        contentSv: 'I svenska sätter vi ofta slutsatsen först: "Jag stannar hemma för att det regnar". I japanska kommer ALLTID orsaken först:',
        bulletPoints: [
          '雨が降っている から、家にいる。 (Eftersom det regnar, stannar jag hemma).'
        ]
      }
    ],
    examples: [
      {
        japanese: '忙しいから、行けない。',
        furigana: 'いそがしいから、いけない。',
        romaji: 'Isogashii kara, ikenai.',
        translationSv: 'Eftersom jag är upptagen kan jag inte gå.',
        literalSv: 'Upptagen därför-att, kan-inte-gå.',
        audioText: 'いそがしいから、いけない。'
      },
      {
        japanese: '電車が遅れたので、遅刻しました。',
        furigana: 'でんしゃがおくれたので、ちこくしました。',
        romaji: 'Densha ga okureta node, chikoku shimashita.',
        translationSv: 'Eftersom tåget var försenat blev jag sen. (Artig ursäkt)',
        literalSv: 'Tåg [identifierare] blev-försenat eftersom, sen-ankomst gjorde.',
        audioText: 'でんしゃがおくれたので、ちこくしました。'
      }
    ],
    commonPitfallsSv: [
      'Efter ett substantiv eller な-adjektiv kräver ので ett な före: t.ex. 静か な ので (shizuka na node), 雨 な ので (ame na node).',
      'Använd inte から när du ber din chef om ursäkt; ので är betydligt mer professionellt.'
    ],
    miniQuiz: [
      {
        id: 'q15-1',
        questionSv: 'Vilket bindeord är bäst när du artigt förklarar för en lärare varför du är sen?',
        options: ['から (kara)', 'ので (node)', 'けど (kedo)', 'のに (noni)'],
        correctIndex: 1,
        explanationSv: 'ので (node) presenterar omständigheten objektivt och är betydligt artigare i ursäkter än det mer påstridiga から.'
      },
      {
        id: 'q15-2',
        questionSv: 'Vad ska placeras framför ので efter substantivet 病気 (byouki = sjukdom)?',
        options: ['だ (byouki da node)', 'な (byouki na node)', 'の (byouki no node)', 'Ingenting alls'],
        correctIndex: 1,
        explanationSv: 'Substantiv och な-adjektiv måste ta な framför ので: 病気なので (Eftersom jag är sjuk).'
      }
    ]
  },
  {
    id: 'potential-form-ability',
    chapterNumber: 16,
    partId: 'essential',
    titleSv: 'Potentialform: Att kunna göra något (〜(ら)れる)',
    titleJap: '可能形 (〜ができる・〜(ら)れる)',
    romajiTitle: 'Kanoukei',
    readingTimeMin: 6,
    summarySv: 'Hur du säger "jag kan tala japanska" eller "kan du äta stark mat?". Lär dig hur verben själva böjs till förmågeform, och varför partikeln を ofta växlar till が!',
    taeKimCoreInsightSv: 'I svenska lägger vi till hjälpverbet "kan" (kan äta). I japanska transformerar du själva verbet: U-verb byter slut-u till "e-ljud" + る (hanasu → hanaseru = kan tala!). Ru-verb får られる (taberareru). Och lägg märke till partikeln: Det du förmår blir ett tillstånd, så を byts oftast ut mot が!',
    ruleFormula: 'Ru-verb: droppa る + られる | U-verb: u → e + る | する → できる | くる → こられる',
    sections: [
      {
        heading: '1. Böjningsmönstret för potentialis',
        contentSv: 'När ett verb väl är böjt till potentialform beter det sig ALLTID som ett Ru-verb (Ichidan).',
        bulletPoints: [
          'Ru-verb: たべる → たべられる (kan äta) / colloquial: たべれる',
          'U-verb: いく (iku) → いける (kan gå)',
          'U-verb: のむ (nomu) → のめる (kan dricka)',
          'U-verb: はなす (hanasu) → はなせる (kan prata)',
          'Oregelbundna: する → できる (kan göra) | くる → こられる (kan komma)'
        ]
      },
      {
        heading: '2. Partikelväxlingen: を blir が',
        contentSv: 'Eftersom förmågan ses som en egenskap hos dig tar förmågans föremål oftast partikeln が.',
        bulletPoints: [
          '日本語 を 話す (Talar japanska - aktiv handling).',
          '日本語 が 話せる (Kan tala japanska - uppnådd förmåga).'
        ]
      }
    ],
    examples: [
      {
        japanese: '漢字が読めますか？',
        furigana: 'かんじがよめますか？',
        romaji: 'Kanji ga yomemasu ka?',
        translationSv: 'Kan du läsa kanji?',
        literalSv: 'Kanji [identifierare] läs-förmåga-finns-fråga?',
        audioText: 'かんじがよめますか？'
      },
      {
        japanese: '納豆は食べられない。',
        furigana: 'なっとうはたべられない。',
        romaji: 'Nattou wa taberarenai.',
        translationSv: 'Natto kan jag inte äta.',
        literalSv: 'Natto [tema]: ät-kan-inte.',
        audioText: 'なっとうはたべられない。'
      }
    ],
    commonPitfallsSv: [
      'Glöm inte att する (suru) har den helt unika formen できる (dekiru = kan göra). Försök inte säga "sureru" ❌!',
      'I talspråk droppar japaner ofta "ra" i ru-verb (ら抜き言葉): "tabereru" istället för "taberareru". Båda är vanliga i modern japanska.'
    ],
    miniQuiz: [
      {
        id: 'q16-1',
        questionSv: 'Vad blir potentialformen av u-verbet 行く (iku = gå)?',
        options: ['いかれる (ikareru)', 'いける (ikeru)', 'いくできる (iku dekiru)', 'いきた (ikita)'],
        correctIndex: 1,
        explanationSv: 'U-verb ändrar sitt u-ljud till e-ljud + る: iku → ikeru (kan gå).'
      },
      {
        id: 'q16-2',
        questionSv: 'Vad är potentialformen för det oregelbundna verbet する (suru = göra)?',
        options: ['すれる (sureru)', 'しられる (shirareru)', 'できる (dekiru)', 'してきる (shitekiru)'],
        correctIndex: 2,
        explanationSv: 'Suru blir できる (dekiru = kan göra). Det är ett av japanskans viktigaste ord.'
      }
    ]
  },

  // ----------------------------------------------------
  // DEL 4: AVANCERADE KONSTRUKTIONER & UTTRYCKSSÄTT
  // ----------------------------------------------------
  {
    id: 'desires-tai-and-hoshii',
    chapterNumber: 17,
    partId: 'advanced',
    titleSv: 'Att vilja: 〜たい (verb) vs ほしい (substantiv)',
    titleJap: '願望の表現「たい」と「ほしい」',
    romajiTitle: 'Ganbou no hyougen tai to hoshii',
    readingTimeMin: 5,
    summarySv: 'Hur uttrycker man vad man vill ha eller göra? För handlingar använder man ändelsen 〜たい, och för fysiska föremål adjektivet ほしい. Båda fungerar grammatiskt som い-adjektiv!',
    taeKimCoreInsightSv: 'I västerländska språk är "vill" ett verb ("jag vill äta"). I japanska blir handlingen du vill göra till ett beskrivande tillstånd: 食べたい (tabetai = är ät-önskvärd). Därför böjs den EXAKT som ett い-adjektiv: tabetakunai (vill inte äta), tabetakatta (ville äta)!',
    ruleFormula: 'Verb-masustam + たい (vill göra) | Substantiv + が ほしい (vill ha)',
    sections: [
      {
        heading: '1. 〜たい för verb',
        contentSv: 'Ta bort ます från artig form och lägg till たい. Det böjs sedan som alla い-adjektiv.',
        bulletPoints: [
          'いきたい (vill gå) → いきたくない (vill inte gå) → いきたかった (ville gå).',
          'みずが のみたい (Vill dricka vatten - partikeln kan vara både が och を).'
        ]
      },
      {
        heading: '2. 欲しい (hoshii) för ting',
        contentSv: 'När du vill ha ett fysiskt substantiv använder du adjektivet ほしい.',
        bulletPoints: [
          'あたらしい くるま が ほしい (Jag vill ha en ny bil).'
        ]
      },
      {
        heading: '3. En viktig japansk tabu: Andras önskningar',
        contentSv: 'Du kan ALDRIG direkt påstå att någon annan "vill ha" något med たい eller ほしい, eftersom du inte kan läsa andras tankar. För andra personer använder man 〜たがっている (verkar vilja) eller citat.'
      }
    ],
    examples: [
      {
        japanese: '日本に行きたいです。',
        furigana: 'にほんにいきたいです。',
        romaji: 'Nihon ni ikitai desu.',
        translationSv: 'Jag vill åka till Japan.',
        literalSv: 'Japan till gå-önskande är.',
        audioText: 'にほんにいきたいです。'
      },
      {
        japanese: '新しいパソコンが欲しい。',
        furigana: 'あたらしいパソコンがほしい。',
        romaji: 'Atarashii pasokon ga hoshii.',
        translationSv: 'Jag vill ha en ny dator.',
        literalSv: 'Ny dator [identifierare] är-önskad.',
        audioText: 'あたらしいパソコンがほしい。'
      }
    ],
    commonPitfallsSv: [
      'Säg inte "Tanaka-san wa ikitai desu" ❌. Att påstå vad någon annan känner låter oartigt på japanska; använd istället "Tanaka-san wa ikitagatte iru" (Tanaka verkar vilja åka).',
      'Vill du ha ett föremål ska du använda ほしい, inte たい. Säg aldrig "ringo o tai" ❌.'
    ],
    miniQuiz: [
      {
        id: 'q17-1',
        questionSv: 'Hur säger du "Jag ville inte äta" med verbet 食べる?',
        options: ['食べたかったない', '食べたくなかった (Tabetakunakatta)', '食べたいでしたない', '食べなかったたい'],
        correctIndex: 1,
        explanationSv: 'たい böjs som ett い-adjektiv: たい → たくない (negation) → たくなかった (dåtid negation).'
      },
      {
        id: 'q17-2',
        questionSv: 'Vad ska du använda om du vill ha en kopp kaffe (ett substantiv)?',
        options: ['コーヒーを飲みたい (vill dricka) eller コーヒーが欲しい (vill ha)', 'コーヒーを食べたい', 'コーヒーのだ', 'コーヒーをたい'],
        correctIndex: 0,
        explanationSv: 'För substantiv används が欲しい, eller med verbet: 飲みたい.'
      }
    ]
  },
  {
    id: 'volitional-form-suggestions',
    chapterNumber: 18,
    partId: 'advanced',
    titleSv: 'Avsiktsform & Förslag (Volitional: 〜(よ)う & 〜ましょう)',
    titleJap: '意志形 (勧誘と意志)',
    romajiTitle: 'Ishikei',
    readingTimeMin: 5,
    summarySv: 'Hur föreslår du "Ska vi dra?", "Låt oss äta!" eller fattar ett inre beslut "Nu ska jag banne mig plugga"? Avsiktsformen uttrycker både personlig avsikt och förslag till andra.',
    taeKimCoreInsightSv: 'I artigt tal lägger man till 〜ましょう (mashou). Men i vardagligt tal förvandlas verbet till den vackra "o-klangen": U-verb ändrar sitt slutljud till o-raden + う (Iku → Ikou = Låt oss gå!). Ru-verb får よう (Taberu → Tabeyou = Låt oss äta!).',
    ruleFormula: 'Ru-verb: droppa る + よう | U-verb: u → ou | Artig: masustam + ましょう',
    sections: [
      {
        heading: '1. Vardaglig avsiktsform (Volitional)',
        contentSv: 'Används med kompisar för förslag ("Kom igen, vi drar!") eller för att prata med sig själv om vad man ska göra.',
        bulletPoints: [
          'Ru-verb: みる → みよう (Låt oss titta / Ska vi se?)',
          'U-verb: いく → いこう (Nu drar vi / Låt oss gå)',
          'U-verb: はなす → はなそう (Låt oss prata)',
          'U-verb: のむ → のもう (Låt oss ta en drink)',
          'Oregelbundna: する → しよう | くる → こよう'
        ]
      },
      {
        heading: '2. Konstruktionen 〜と思う (Avsikt: "Jag tänker göra")',
        contentSv: 'När du kombinerar volitional med と思う (to omou = tänker/tror) uttrycker du din personliga plan: 映画を見ようと思う (Jag tänker se en film).'
      }
    ],
    examples: [
      {
        japanese: 'そろそろ行こう！',
        furigana: 'そろそろいこう！',
        romaji: 'Sorosoro ikou!',
        translationSv: 'Nu borde vi nog dra! / Låt oss gå snart!',
        literalSv: 'Snart gå-låt-oss!',
        audioText: 'そろそろいこう！'
      },
      {
        japanese: '一緒にご飯を食べましょう。',
        furigana: 'いっしょにごはんをたべましょう。',
        romaji: 'Issho ni gohan o tabemashou.',
        translationSv: 'Låt oss äta mat tillsammans. (Artigt förslag)',
        literalSv: 'Tillsammans måltid [objekt] äta-låt-oss-artigt.',
        audioText: 'いっしょにごはんをたべましょう。'
      }
    ],
    commonPitfallsSv: [
      'Förväxla inte vardagliga いこう (ikou = låt oss gå) med dåtidsformen いった (itta = gick).',
      'Masu-formens förslag 〜ましょう (mashou) används bara mot andra, medan vardagsformen しよう även kan användas när man peppar sig själv ("Nu ska jag plugga!").'
    ],
    miniQuiz: [
      {
        id: 'q18-1',
        questionSv: 'Vad är den vardagliga avsiktsformen (volitional) av verbet 飲む (nomu = dricka)?',
        options: ['のみよう (nomiyou)', 'のもう (nomou)', 'のめ (nome)', 'のましょう (nomashou)'],
        correctIndex: 1,
        explanationSv: 'U-verb byter slut-u till o-vokal + u: nomu → no-m-o-u (nomou).'
      },
      {
        id: 'q18-2',
        questionSv: 'Hur säger du artigt "Låt oss börja" med verbet 始める (hajimeru)?',
        options: ['始めよう (hajimeyou)', '始めましょう (hajimemashou)', '始めるです (hajimeru desu)', '始めたい (hajimetai)'],
        correctIndex: 1,
        explanationSv: 'Artig avsiktsform är masustammen + ましょう: 始めましょう (Hajimemashou).'
      }
    ]
  },
  {
    id: 'giving-and-receiving',
    chapterNumber: 19,
    partId: 'advanced',
    titleSv: 'Givande och tagande: あげる, くれる, もらう',
    titleJap: '授受表現 (あげる・くれる・もらう)',
    romajiTitle: 'Juju hyougen',
    readingTimeMin: 7,
    summarySv: 'På japanska beror verbet för "att ge" på vem som ger till vem. Riktningen mot talaren (inåt gruppen) eller bort från talaren (utåt) är en av de vackraste och mest centrala aspekterna av japansk social psykologi.',
    taeKimCoreInsightSv: 'I svenska säger vi "Kalle gav mig boken" och "Jag gav Kalle boken" med samma verb ("gav"). I japanska är detta absolut förbjudet! Om någon ger något TILL DIG (eller din in-grupp) måste du använda くれる (kureru). Ger du BORT något till någon annan använder du あげる (ageru). Tar du emot använder du もらう (morau).',
    ruleFormula: '[Givare] が [Mottagare] に あげる (bortåt) / くれる (hitåt) | [Mottagare] が [Givare] に もらう (ta emot)',
    comparisonBox: {
      title: 'De tre riktningarna för gåvor och tjänster',
      summarySv: 'Vem rör sig gåvan eller tjänsten mot?',
      items: [
        {
          term: 'あげる (ageru)',
          roleSv: 'Ge bortåt / uppåt',
          nuanceSv: 'Från dig till någon annan, eller från person A till person B. Rör sig BORT från talaren.',
          exampleKana: 'わたしが ともだちに プレゼントを あげた。',
          exampleSv: 'Jag gav en present till min kompis.'
        },
        {
          term: 'くれる (kureru)',
          roleSv: 'Ge hitåt (till mig)',
          nuanceSv: 'Någon annan ger något till MIG eller till min familj/in-grupp.',
          exampleKana: 'ともだちが わたしに ほんを くれた。',
          exampleSv: 'Kompisen gav en bok till mig.'
        },
        {
          term: 'もらう (morau)',
          roleSv: 'Ta emot',
          nuanceSv: 'Subjektet är den som tar emot gåvan/tjänsten från någon (markerad med に eller から).',
          exampleKana: 'わたしは せんせいに ほんを もらった。',
          exampleSv: 'Jag tog emot / fick en bok av läraren.'
        }
      ]
    },
    sections: [
      {
        heading: '1. Göra tjänster: 〜てあげる, 〜てくれる, 〜てもらう',
        contentSv: 'När du sätter dessa verb efter ett annat verb i て-form betyder det att man gör handlingen som en tjänst eller väntjänst för någon.',
        bulletPoints: [
          'ともだちが にほんごを おしえてくれた (Kompisen lärde mig japanska – som en snäll tjänst till mig!).',
          'にもつを もってあげた (Jag bar väskan åt honom/henne som en tjänst).'
        ]
      }
    ],
    examples: [
      {
        japanese: '田中さんがプレゼントをくれた。',
        furigana: 'たなかさんがプレゼントをくれた。',
        romaji: 'Tanaka-san ga purezento o kureta.',
        translationSv: 'Tanaka gav mig en present.',
        literalSv: 'Tanaka [identifierare] present [objekt] gav-till-mig.',
        audioText: 'たなかさんがプレゼントをくれた。'
      },
      {
        japanese: '友達に宿題を手伝ってもらった。',
        furigana: 'ともだちにしゅくだいをつてつだってもらった。',
        romaji: 'Tomodachi ni shukudai o tetsudatte moratta.',
        translationSv: 'Jag fick hjälp med läxorna av min kompis.',
        literalSv: 'Av kompis läxa [objekt] hjälpande-tog-emot.',
        audioText: 'ともだちにしゅくだいをつてつだってもらった。'
      }
    ],
    commonPitfallsSv: [
      '⚠️ Använd ALDRIG あげる när någon ger något till dig! Säg aldrig "Tanaka ga watashi ni ageta" ❌. Det måste heta くれた (kureta)!',
      'Att säga 〜てあげる till en överordnad eller främling kan låta nedlåtande ("jag gör dig en tjänst"). Var varsam med det.'
    ],
    miniQuiz: [
      {
        id: 'q19-1',
        questionSv: 'Vilket verb ska användas i: "Alice [ ? ] mig en blomma"?',
        options: ['あげた (ageta)', 'くれた (kureta)', 'もらった (moratta)', 'した (shita)'],
        correctIndex: 1,
        explanationSv: 'När någon ger något TILL DIG (hitåt mot talaren) måste verbet くれる (kureru / kureta) användas.'
      },
      {
        id: 'q19-2',
        questionSv: 'Vad uttrycker meningen "友達が車を直してくれた"?',
        options: ['Kompisen lagade sin egen bil', 'Kompisen lagade bilen åt mig som en vänlig handling/tjänst', 'Jag tvingade kompisen att laga bilen', 'Bilen är trasig'],
        correctIndex: 1,
        explanationSv: 'て + くれた visar att handlingen gjordes som en tjänst och gåva riktad till talaren.'
      }
    ]
  },
  {
    id: 'four-conditionals',
    chapterNumber: 20,
    partId: 'advanced',
    titleSv: 'De 4 Villkorsformerna: と, ば, たら, なら ("Om / När")',
    titleJap: '条件形 (と・ば・たら・なら)',
    romajiTitle: 'Joukenkei',
    readingTimeMin: 7,
    summarySv: 'Japanska har inte bara ett ord för "om". Det finns fyra distinkta villkorsformer med helt olika nyanser: naturlig konsekvens (と), hypotetiskt villkor (ば), sekventiellt villkor (たら) och kontextuellt villkor (なら).',
    taeKimCoreInsightSv: 'Detta är ofta ett av de mest förvirrande kapitlen i vanliga läroböcker, men Tae Kims uppdelning gör det kristallklart: と är oundviklig naturvetenskap ("tryck på knappen så startar motorn"). たら är tidsföljd ("när/om det väl skett"). ば är det logiska villkoret ("om bara X händer..."). Och なら är kontext ("om det är just DET du pratar om!").',
    ruleFormula: 'と (naturlig följd) | 〜ば (hypotes) | 〜たら (tidsföljd/sekvens) | 〜なら (om kontext)',
    comparisonBox: {
      title: 'De 4 villkorsformernas kärnroller',
      summarySv: 'Vilken typ av villkor vill du uttrycka?',
      items: [
        {
          term: 'と (to)',
          roleSv: 'Naturlig / Oundviklig konsekvens',
          nuanceSv: 'Varje gång A händer, händer alltid B automatiskt (naturkrafter, vägbeskrivningar, maskiner).',
          exampleKana: 'ボタンを おすと、水が でる。',
          exampleSv: 'Om du trycker på knappen rinner vatten ut.'
        },
        {
          term: 'ば (ba)',
          roleSv: 'Allmänt / Hypotetiskt villkor',
          nuanceSv: 'Fokuserar på själva förutsättningen: "Om bara detta uppfylls, så...".',
          exampleKana: '安ければ、買います。',
          exampleSv: 'Om den är billig så köper jag den.'
        },
        {
          term: 'たら (tara)',
          roleSv: 'Sekventiellt villkor ("Efter att / Om")',
          nuanceSv: 'Det mest flexibla och vanliga i talspråk. Betyder ofta "När X har hänt, ska jag göra Y".',
          exampleKana: '家に着いたら、電話してね。',
          exampleSv: 'När du kommer hem, ring mig!'
        },
        {
          term: 'なら (nara)',
          roleSv: 'Kontextuellt villkor ("Om det gäller...")',
          nuanceSv: 'Bygger på något den andra precis nämnde: "Om det är Tokyo du ska till, rekommenderar jag tåg".',
          exampleKana: '日本に行くなら、京都がいいよ。',
          exampleSv: 'Om det är Japan du ska till är Kyoto toppen.'
        }
      ]
    },
    sections: [
      {
        heading: '1. Tara (たら) – Det säkra valet i talspråk',
        contentSv: 'Bilda ta-form och lägg till ら (ra). Detta är den enda formen som utan problem kan följas av uppmaningar och böner (t.ex. "När du är klar, kom hit!").',
        bulletPoints: [
          'たべる → たべたら (Om/när jag ätit)',
          'のむ → のんだら (Om/när jag druckit)'
        ]
      }
    ],
    examples: [
      {
        japanese: '春になると、桜が咲く。',
        furigana: 'はるになると、さくらがさく。',
        romaji: 'Haru ni naru to, sakura ga saku.',
        translationSv: 'När det blir vår slår körsbärsblommorna ut.',
        literalSv: 'Vår [tillstånd] bli [to], körsbärsblommor [identifierare] blommar.',
        audioText: 'はるになると、さくらがさく。'
      },
      {
        japanese: '時間があったら、映画を見に行こう。',
        furigana: 'じかんがあったら、えいがをみにいこう。',
        romaji: 'Jikan ga attara, eiga o mi ni ikou.',
        translationSv: 'Om vi har tid, låt oss gå och se en bio.',
        literalSv: 'Tid [identifierare] om-finns [tara], bio [objekt] se för låt-oss-gå.',
        audioText: 'じかんがあったら、えいがをみにいこう。'
      }
    ],
    commonPitfallsSv: [
      'Efter と kan du ALDRIG ha en uppmaning eller personlig viljeyttring (t.ex. "När våren kommer, kom och hälsa på" får inte ha と). Använd たら för uppmaningar!',
      'Blanda inte ihop なら (nara) med dåtid.'
    ],
    miniQuiz: [
      {
        id: 'q20-1',
        questionSv: 'Vilket villkor passar bäst för en maskininstruktion: "Om man vrider på ratten svänger bilen"?',
        options: ['と (to) – naturlig och oundviklig följd', 'なら (nara)', 'たい (tai)', 'から (kara)'],
        correctIndex: 0,
        explanationSv: 'と används för oundvikliga, mekaniska och naturliga samband: händer A så inträffar automatiskt B.'
      },
      {
        id: 'q20-2',
        questionSv: 'Vilken villkorsform är den enda som helt naturligt fungerar med uppmaningar som "Ring mig när du kommer fram!"?',
        options: ['と (to)', 'たら (tara)', 'ば (ba)', 'ので (node)'],
        correctIndex: 1,
        explanationSv: 'たら (tara) är tidsföljdsvillkoret och det enda som obehindrat kan ta böner och uppmaningar i huvudsatsen.'
      }
    ]
  },
  {
    id: 'must-and-obligation',
    chapterNumber: 21,
    partId: 'advanced',
    titleSv: 'Måste & Tvång: 〜なければならない & 〜なきゃ',
    titleJap: '義務と必然 (〜なければならない)',
    romajiTitle: 'Gimu to hitsuzen',
    readingTimeMin: 5,
    summarySv: 'Hur säger man "jag måste göra mina läxor"? Japanska har inget ord för "måste". Istället använder man en fascinerande dubbelnegation: "Om man inte gör det, så går det inte!"',
    taeKimCoreInsightSv: 'Konstruktionen ser lång och skrämmande ut för nybörjare: なければならない (nakereba naranai). Men bryt ner logiken med Tae Kims metod: なければ betyder "om inte...", och ならない betyder "blir inte bra / duger inte". Tillsammans: "Om jag inte pluggar duger det inte" = Jag måste plugga! I vardagligt talspråk förkortas detta till supersmidiga 〜なきゃ (nakya) eller 〜ないと (naito).',
    ruleFormula: 'Verb-negativ stam: 〜なければならない (formellt) | 〜なきゃ (vardagligt tal)',
    sections: [
      {
        heading: '1. Den formella fullängdaren',
        contentSv: 'Bilda negation (nai-form), ta bort い och lägg till ければならない.',
        bulletPoints: [
          'たべる → たべない → たべなければならない (Måste äta)',
          'いく → いかない → いかなければならない (Måste gå)'
        ]
      },
      {
        heading: '2. Den vardagliga anime- och talspråksformen',
        contentSv: 'I vardagen säger nästan ingen hela ramsan. Man slutar helt enkelt meningen vid villkoret!',
        bulletPoints: [
          'いかなきゃ！ (Ikanakya! = Måste dra!)',
          'べんきょうしないと！ (Benkyou shinaito! = Måste plugga!)'
        ]
      }
    ],
    examples: [
      {
        japanese: '明日は早く起きなければならない。',
        furigana: 'あしたははやくおきなければならない。',
        romaji: 'Ashita wa hayaku okinakereba naranai.',
        translationSv: 'Imorgon måste jag gå upp tidigt.',
        literalSv: 'Imorgon [tema]: tidigt om-inte-vaknar duger-inte.',
        audioText: 'あしたははやくおきなければならない。'
      },
      {
        japanese: 'もう行かなきゃ！',
        furigana: 'もういかなきゃ！',
        romaji: 'Mou ikanakya!',
        translationSv: 'Jag måste gå nu! / Måste dra!',
        literalSv: 'Redan om-inte-går (underförstått: går inte).',
        audioText: 'もういかなきゃ！'
      }
    ],
    commonPitfallsSv: [
      'Bli inte skrämd av längden på なければならない. Se det som en färdig byggkloss.',
      'Glöm inte att basen alltid är verbets ナイ-stam: ika-nakereba, tabe-nakereba.'
    ],
    miniQuiz: [
      {
        id: 'q21-1',
        questionSv: 'Vad är den bokstavliga filosofiska innebörden i det japanska uttrycket för "måste" (なければならない)?',
        options: ['Det är en order från kungen', 'Om man inte gör det så går det/duger det inte', 'Gud vill detta', 'Det kostar pengar'],
        correctIndex: 1,
        explanationSv: 'Japanskan uttrycker plikt genom dubbelnegation: nakereba (om inte) naranai (duger/fungerar det inte).'
      },
      {
        id: 'q21-2',
        questionSv: 'Hur säger du snabbt till en kompis "Jag måste plugga!" i vardagligt tal?',
        options: ['べんきょうしたい', 'べんきょうしなきゃ！ (Benkyou shinakya!)', 'べんきょうするだ', 'べんきょうしたくない'],
        correctIndex: 1,
        explanationSv: 'I talspråk förkortas konstruktionen oftast till 〜なきゃ (nakya): Benkyou shinakya!'
      }
    ]
  },
  {
    id: 'passive-and-causative',
    chapterNumber: 22,
    partId: 'advanced',
    titleSv: 'Passiv, Kausativ & Drabbad passiv (〜られる, 〜させる)',
    titleJap: '受身と使役 (〜られる・〜させる)',
    romajiTitle: 'Ukemi to shieki',
    readingTimeMin: 7,
    summarySv: 'Hur uttrycker du att någon fick eller tvingade dig att göra något (kausativ), eller att du blev drabbad av någons handling (passiv)? Japanskans "lidande passiv" är unikt uttrycksfullt.',
    taeKimCoreInsightSv: 'I svenska är passiv bara ett grammatiskt byte: "Tårtan åts av Kalle". Men i japanska finns dessutom "drabbad passiv" (Adversative Passive): om någon gör något som ställer till besvär för dig, kan du göra handlingen passiv för att visa ditt lidande! T.ex. 雨に降られた (Ame ni furareta = "Jag blev regnad på av regnet / regnet ställde till det för mig!").',
    ruleFormula: 'Passiv: Ru: + られる | U: u → a + れる || Kausativ: Ru: + させる | U: u → a + せる',
    sections: [
      {
        heading: '1. Passivform (受身 - Ukemi)',
        contentSv: 'Någon blir utsatt för en handling. Den som utför handlingen markeras med に.',
        bulletPoints: [
          'Ru-verb: たべる → たべられる (bli uppäten)',
          'U-verb: しかる (skälla ut) → しかられる (bli utskälld)',
          'いぬに てを かまれた (Blev biten i handen av hunden).'
        ]
      },
      {
        heading: '2. Kausativform (使役 - Shieki): Låta eller tvinga',
        contentSv: 'Få någon att göra något, eller tillåta någon att göra det.',
        bulletPoints: [
          'Ru-verb: たべる → たべさせる (få/låta någon äta)',
          'U-verb: いく → いかせる (låta/få någon gå)',
          '先生が生徒に宿題をさせた (Läraren lät/fick eleverna göra läxor).'
        ]
      },
      {
        heading: '3. Kausativ-passiv (使役受身): Att bli tvingad att göra något',
        contentSv: 'Kombinationen av båda: 〜させられる. Betyder att man tvingades göra något mot sin vilja (t.ex. tvingades sjunga eller äta grönsaker!).'
      }
    ],
    examples: [
      {
        japanese: '弟にケーキを食べられた！',
        furigana: 'おとうとにケーキをたべられた！',
        romaji: 'Otouto ni keeki o taberareta!',
        translationSv: 'Lillebror åt upp min tårta! (Drabbad passiv: jag blev drabbad av att kakan åts)',
        literalSv: 'Av lillebror tårta [objekt] bli-uppäten-var!',
        audioText: 'おとうとにケーキをたべられた！'
      },
      {
        japanese: '野菜を食べさせられた。',
        furigana: 'やさいをたべさせられた。',
        romaji: 'Yasai o tabesaserareta.',
        translationSv: 'Jag blev tvingad att äta grönsaker.',
        literalSv: 'Grönsaker [objekt] äta-låta-bli-utsatt-för-var.',
        audioText: 'やさいをたべさせられた。'
      }
    ],
    commonPitfallsSv: [
      'Blanda inte ihop passivformen för ru-verb (たべられる) med potentialformen (kan äta) – de har samma form! Kontexten avgör.',
      'Den som utför handlingen vid passiv markeras med partikeln に (ni), inte で.'
    ],
    miniQuiz: [
      {
        id: 'q22-1',
        questionSv: 'Vad uttrycker japanskans berömda "drabbade passiv" (Adversative Passive)?',
        options: ['Att talaren är glad och tacksam', 'Att talaren blev negativt påverkad/besvärad av händelsen', 'Att händelsen skedde i framtiden', 'Att ingen vet vem som gjorde det'],
        correctIndex: 1,
        explanationSv: 'Japansk drabbad passiv visar tydligt att talaren upplevde obehag, sorg eller irritation över det som inträffade.'
      },
      {
        id: 'q22-2',
        questionSv: 'Vad betyder den sammansatta kausativ-passiva formen 歌わせられた (utawasaserareta / utawaserareta)?',
        options: ['Jag fick sjunga', 'Jag blev tvingad att sjunga', 'Jag kan inte sjunga', 'Jag vill sjunga'],
        correctIndex: 1,
        explanationSv: 'Kausativ-passiv (〜させられる) betyder specifikt att man blev tvingad att utföra handlingen.'
      }
    ]
  }
];

export function getChapterById(id: string): GrammarChapter | undefined {
  return TAE_KIM_CHAPTERS.find(c => c.id === id);
}

export function getChaptersByPart(partId: string): GrammarChapter[] {
  return TAE_KIM_CHAPTERS.filter(c => c.partId === partId);
}

export function getNextChapter(currentId: string): GrammarChapter | undefined {
  const currentIndex = TAE_KIM_CHAPTERS.findIndex(c => c.id === currentId);
  if (currentIndex >= 0 && currentIndex < TAE_KIM_CHAPTERS.length - 1) {
    return TAE_KIM_CHAPTERS[currentIndex + 1];
  }
  return undefined;
}

export function getPreviousChapter(currentId: string): GrammarChapter | undefined {
  const currentIndex = TAE_KIM_CHAPTERS.findIndex(c => c.id === currentId);
  if (currentIndex > 0) {
    return TAE_KIM_CHAPTERS[currentIndex - 1];
  }
  return undefined;
}
