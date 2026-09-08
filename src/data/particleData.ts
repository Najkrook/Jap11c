export type ParticleDuelCategory = 
  | 'all'
  | 'wa_vs_ga'
  | 'ni_vs_de'
  | 'o_vs_ni_vs_he'
  | 'no_to_mo'
  | 'kara_made';

export interface ParticleQuestion {
  id: string;
  category: ParticleDuelCategory;
  level: 1 | 2 | 3;
  // Sentence split into [before, after] so UI can render "before [ ___ ] after"
  sentenceParts: [string, string];
  fullSentenceKana: string;
  romaji: string;
  swedishTranslation: string;
  correctParticle: string;
  options: string[];
  ruleSummary: string;
  explanationSv: string;
  keyCueSv?: string;
}

export interface ParticleDuelGroup {
  id: ParticleDuelCategory;
  title: string;
  nicknameSv: string;
  descriptionSv: string;
  particles: string[];
  badgeColor: string;
}

export interface ParticleGuideItem {
  particle: string;
  romaji: string;
  nameSv: string;
  coreRoleSv: string;
  goldenRulesSv: string[];
  exampleSentences: {
    kana: string;
    romaji: string;
    translationSv: string;
  }[];
  pitfallWarningSv: string;
}

export const PARTICLE_DUEL_GROUPS: ParticleDuelGroup[] = [
  {
    id: 'all',
    title: 'Alla Partiklar',
    nicknameSv: 'Mästartestet (Blandat)',
    descriptionSv: 'Slumpade frågor från alla partikelkategorier. Perfekt repetition för helhetsförståelse!',
    particles: ['は', 'が', 'を', 'に', 'で', 'へ', 'の', 'と', 'も', 'から', 'まで', 'か'],
    badgeColor: 'bg-brand-600 text-white dark:bg-brand-gold dark:text-sumi-950'
  },
  {
    id: 'wa_vs_ga',
    title: 'は (wa) vs が (ga)',
    nicknameSv: 'Ämnet vs Subjektet',
    descriptionSv: 'Japanskans mest berömda partikelpar! は sätter scenen ("vad gäller X"), medan が pekar ut det specifika subjektet eller används med gilla (すき) och existens (ある/いる).',
    particles: ['は', 'が'],
    badgeColor: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-sumi-950'
  },
  {
    id: 'ni_vs_de',
    title: 'に (ni) vs で (de)',
    nicknameSv: 'Tid & Plats-duellen',
    descriptionSv: 'Var och när? Använd に för specifik tidpunkt, destination och existensplats. Använd で för plats där en aktiv handling sker eller för färdmedel/verktyg.',
    particles: ['に', 'で'],
    badgeColor: 'bg-blue-600 text-white dark:bg-blue-400 dark:text-sumi-950'
  },
  {
    id: 'o_vs_ni_vs_he',
    title: 'を (o) vs に (ni) vs へ (e)',
    nicknameSv: 'Objektet & Rörelsen',
    descriptionSv: 'を markerar vad du gör något med (direkt objekt). に markerar målet eller mottagaren. へ betonar färdriktningen mot ett mål.',
    particles: ['を', 'に', 'へ'],
    badgeColor: 'bg-purple-600 text-white dark:bg-purple-400 dark:text-sumi-950'
  },
  {
    id: 'no_to_mo',
    title: 'の (no) vs と (to) vs も (mo)',
    nicknameSv: 'Ägande, Och & Också',
    descriptionSv: 'の kopplar ihop substantiv ("X:s Y"). と binder ihop substantiv ("och") eller betyder "tillsammans med". も ersätter は/が/を för "också/även".',
    particles: ['の', 'と', 'も'],
    badgeColor: 'bg-amber-600 text-white dark:bg-amber-400 dark:text-sumi-950'
  },
  {
    id: 'kara_made',
    title: 'から (kara) & まで (made)',
    nicknameSv: 'Från start till mål',
    descriptionSv: 'から markerar startpunkt ("från") i tid eller rum. まで markerar slutpunkt ("till / fram till"). Ofta använda i par!',
    particles: ['から', 'まで'],
    badgeColor: 'bg-rose-600 text-white dark:bg-rose-400 dark:text-sumi-950'
  }
];

export const PARTICLE_QUESTIONS: ParticleQuestion[] = [
  // ==========================================
  // WA vs GA
  // ==========================================
  {
    id: 'q_wa_1',
    category: 'wa_vs_ga',
    level: 1,
    sentenceParts: ['わたし', 'がくせいです。'],
    fullSentenceKana: 'わたしはがくせいです。',
    romaji: 'watashi wa gakusei desu.',
    swedishTranslation: 'Jag är student.',
    correctParticle: 'は',
    options: ['は', 'が', 'を', 'に'],
    ruleSummary: 'Ämnesmarkör (Topic) → は',
    explanationSv: 'は (uttalas "wa") lyfter fram meningsämnet ("Vad gäller mig, så är jag student"). För enkla presentationer av vem man är används は.',
    keyCueSv: 'Vad gäller X → は'
  },
  {
    id: 'q_ga_suki_1',
    category: 'wa_vs_ga',
    level: 1,
    sentenceParts: ['わたしは ねこ', 'すきです。'],
    fullSentenceKana: 'わたしはねこがすきです。',
    romaji: 'watashi wa neko ga suki desu.',
    swedishTranslation: 'Jag gillar katter.',
    correctParticle: 'が',
    options: ['が', 'を', 'は', 'に'],
    ruleSummary: 'Gillar (すき) tar alltid → が',
    explanationSv: 'På japanska är すき (suki) ett adjektiv ("är tilltalande"), inte ett transitivt verb! Därför markeras saken man gillar alltid med が, aldrig を.',
    keyCueSv: 'Suki / Kirai / Jouzu / Heta → tar alltid が!'
  },
  {
    id: 'q_ga_exist_1',
    category: 'wa_vs_ga',
    level: 2,
    sentenceParts: ['あそこに いぬ', 'います。'],
    fullSentenceKana: 'あそこにいぬがいます。',
    romaji: 'asoko ni inu ga imasu.',
    swedishTranslation: 'Det finns en hund där borta.',
    correctParticle: 'が',
    options: ['が', 'は', 'を', 'で'],
    ruleSummary: 'Existenssubjekt (います/あります) → が',
    explanationSv: 'När vi introducerar vad som existerar eller finns på en plats med います (levande) eller あります (döda ting), markeras varelsen/föremålet med が.',
    keyCueSv: '[Plats] ni [Ting/Varelse] ga imasu/arimasu'
  },
  {
    id: 'q_ga_question_1',
    category: 'wa_vs_ga',
    level: 2,
    sentenceParts: ['だれ', 'きましたか。'],
    fullSentenceKana: 'だれがきましたか。',
    romaji: 'dare ga kimashita ka.',
    swedishTranslation: 'Vem kom?',
    correctParticle: 'が',
    options: ['が', 'は', 'を', 'に'],
    ruleSummary: 'Frågeord som subjekt → alltid が',
    explanationSv: 'Frågeord (だれ vem, なに vad, どれ vilken) kan aldrig ta ämnespartikeln は. När frågeordet är satsens subjekt används alltid が!',
    keyCueSv: 'だれ/なに + が (aldrig は)'
  },
  {
    id: 'q_wa_topic_contrast',
    category: 'wa_vs_ga',
    level: 2,
    sentenceParts: ['きょう', 'いい てんきですね。'],
    fullSentenceKana: 'きょうはいいてんきですね。',
    romaji: 'kyou wa ii tenki desu ne.',
    swedishTranslation: 'Idag är det fint väder, eller hur?',
    correctParticle: 'は',
    options: ['は', 'が', 'を', 'で'],
    ruleSummary: 'Tidsuttryck som samtalsämne → は',
    explanationSv: 'きょう (idag) sätts här upp som samtalsämne ("Vad gäller idag, så är det fint väder"). Då används ämnespartikeln は.',
    keyCueSv: 'きょう / あした som ämne → は'
  },
  {
    id: 'q_ga_hoshii_1',
    category: 'wa_vs_ga',
    level: 2,
    sentenceParts: ['わたしは くるま', 'ほしいです。'],
    fullSentenceKana: 'わたしはくるまがほしいです。',
    romaji: 'watashi wa kuruma ga hoshii desu.',
    swedishTranslation: 'Jag vill ha en bil.',
    correctParticle: 'が',
    options: ['が', 'を', 'は', 'に'],
    ruleSummary: 'Önskan (ほしい) tar → が',
    explanationSv: 'Precis som すき (gilla) är ほしい (vill ha) ett i-adjektiv ("är önskad"). Föremålet man vill ha markeras därför med が.',
    keyCueSv: 'ほしい (vill ha) → tar が'
  },
  {
    id: 'q_ga_jouzu_1',
    category: 'wa_vs_ga',
    level: 2,
    sentenceParts: ['たなかさんは にほんご', 'じょうずです。'],
    fullSentenceKana: 'たなかさんはにほんごがじょうずです。',
    romaji: 'tanaka-san wa nihongo ga jouzu desu.',
    swedishTranslation: 'Tanaka-san är duktig på japanska.',
    correctParticle: 'が',
    options: ['が', 'を', 'は', 'で'],
    ruleSummary: 'Färdighet (じょうず / へた) tar → が',
    explanationSv: 'Färdigheter och förmågor beskrivs med adjektiv på japanska (じょうず duktig, へた dålig). Området man behärskar markeras med が.',
    keyCueSv: 'じょうず (duktig) → tar が'
  },

  // ==========================================
  // NI vs DE
  // ==========================================
  {
    id: 'q_de_action_1',
    category: 'ni_vs_de',
    level: 1,
    sentenceParts: ['としょかん', 'ほんを よみます。'],
    fullSentenceKana: 'としょかんでほんをよみます。',
    romaji: 'toshokan de hon o yomimasu.',
    swedishTranslation: 'Jag läser en bok på biblioteket.',
    correctParticle: 'で',
    options: ['で', 'に', 'へ', 'を'],
    ruleSummary: 'Plats för aktiv handling → で',
    explanationSv: 'När en aktiv handling utförs på en plats (att läsa, äta, studera) markeras platsen alltid med で. Partikeln に används bara för existens eller destination.',
    keyCueSv: 'Göra något på en plats → で'
  },
  {
    id: 'q_de_action_restaurant',
    category: 'ni_vs_de',
    level: 1,
    sentenceParts: ['レストラン', 'ひるごはんを たべました。'],
    fullSentenceKana: 'レストランでひるごはんをたべました。',
    romaji: 'resutoran de hirugohan o tabemashita.',
    swedishTranslation: 'Jag åt lunch på restaurangen.',
    correctParticle: 'で',
    options: ['で', 'に', 'へ', 'を'],
    ruleSummary: 'Äta på en plats (handling) → で',
    explanationSv: 'Att äta lunch är en aktiv handling, så restaurangen måste markeras med で. Hade meningen varit "jag gick till restaurangen" hade det varit に eller へ.',
    keyCueSv: 'Aktivitet (äta/dricka) på plats → で'
  },
  {
    id: 'q_ni_time_1',
    category: 'ni_vs_de',
    level: 1,
    sentenceParts: ['まいにち 7じ', 'おきます。'],
    fullSentenceKana: 'まいにち7じにおきます。',
    romaji: 'mainichi shichiji ni okimasu.',
    swedishTranslation: 'Jag vaknar klockan 7 varje dag.',
    correctParticle: 'に',
    options: ['に', 'で', 'を', 'は'],
    ruleSummary: 'Specifik tidpunkt med siffra → に',
    explanationSv: 'Tidpunkter som innehåller ett specifikt klockslag eller datum med siffror (7:00, måndag, 3 maj) tar partikeln に. Relativa tider som "idag" eller "varje dag" tar inte に.',
    keyCueSv: 'Klockslag / datum → に'
  },
  {
    id: 'q_ni_exist_room',
    category: 'ni_vs_de',
    level: 2,
    sentenceParts: ['へや', 'つくえが あります。'],
    fullSentenceKana: 'へやにつくえがあります。',
    romaji: 'heya ni tsukue ga arimasu.',
    swedishTranslation: 'Det finns ett skrivbord i rummet.',
    correctParticle: 'に',
    options: ['に', 'で', 'へ', 'を'],
    ruleSummary: 'Plats för existens (あります/います) → に',
    explanationSv: 'Rummet är här en plats där något statiskt FINNS (finns ett bord), inte en plats där en handling utförs. Därför används に tillsammans med あります.',
    keyCueSv: 'Något finns på en plats → に あります'
  },
  {
    id: 'q_de_tool_pencil',
    category: 'ni_vs_de',
    level: 1,
    sentenceParts: ['えんぴつ', 'なまえを かきます。'],
    fullSentenceKana: 'えんぴつでなまえをかきます。',
    romaji: 'enpitsu de namae o kakimasu.',
    swedishTranslation: 'Jag skriver mitt namn med en blyertspenna.',
    correctParticle: 'で',
    options: ['で', 'に', 'を', 'と'],
    ruleSummary: 'Verktyg / redskap ("med") → で',
    explanationSv: 'で anger vilket verktyg, redskap eller medel du använder för att genomföra handlingen (med penna, med ätpinnar, med sax).',
    keyCueSv: 'Med hjälp av redskap → で'
  },
  {
    id: 'q_de_transport_bus',
    category: 'ni_vs_de',
    level: 1,
    sentenceParts: ['バス', 'がっこうへ いきます。'],
    fullSentenceKana: 'バスでがっこうへいきます。',
    romaji: 'basu de gakkou e ikimasu.',
    swedishTranslation: 'Jag åker till skolan med buss.',
    correctParticle: 'で',
    options: ['で', 'に', 'へ', 'を'],
    ruleSummary: 'Färdmedel ("med / via") → で',
    explanationSv: 'Transportmedel (buss, tåg, cykel, bil) räknas som redskap/metod för förflyttningen och markeras med で.',
    keyCueSv: 'Färdsätt (tåg/buss/bil) → で'
  },
  {
    id: 'q_de_language_japanese',
    category: 'ni_vs_de',
    level: 2,
    sentenceParts: ['にほんご', 'はなしてください。'],
    fullSentenceKana: 'にほんごではなしてください。',
    romaji: 'nihongo de hanashite kudasai.',
    swedishTranslation: 'Snälla tala på japanska.',
    correctParticle: 'で',
    options: ['で', 'に', 'を', 'は'],
    ruleSummary: 'Språk och medium ("på japanska") → で',
    explanationSv: 'När ett språk används som kommunikationsmedel (på japanska, på engelska, på svenska) används partikeln で.',
    keyCueSv: 'Kommunicera på ett språk → で'
  },

  // ==========================================
  // O vs NI vs HE
  // ==========================================
  {
    id: 'q_o_drink_tea',
    category: 'o_vs_ni_vs_he',
    level: 1,
    sentenceParts: ['わたしは おちゃ', 'のみます。'],
    fullSentenceKana: 'わたしはおちゃをのみます。',
    romaji: 'watashi wa ocha o nomimasu.',
    swedishTranslation: 'Jag dricker te.',
    correctParticle: 'を',
    options: ['を', 'に', 'で', 'は'],
    ruleSummary: 'Direkt objekt för handling → を',
    explanationSv: 'Teet är det direkta objektet som påverkas av verbet "att dricka". Direkt objekt markeras alltid med を (skrivs med hiragana を men uttalas som "o").',
    keyCueSv: 'Objekt som påverkas av verbet → を'
  },
  {
    id: 'q_o_read_book',
    category: 'o_vs_ni_vs_he',
    level: 1,
    sentenceParts: ['まいばん ほん', 'よみます。'],
    fullSentenceKana: 'まいばんほんをよみます。',
    romaji: 'maiban hon o yomimasu.',
    swedishTranslation: 'Varje kväll läser jag en bok.',
    correctParticle: 'を',
    options: ['を', 'に', 'で', 'が'],
    ruleSummary: 'Objekt för läsning → を',
    explanationSv: 'Boken (ほん) är det direkta objektet som blir läst. Skrivs を (uttalas "o").',
    keyCueSv: 'Läsa, äta, köpa något → を'
  },
  {
    id: 'q_ni_destination_school',
    category: 'o_vs_ni_vs_he',
    level: 1,
    sentenceParts: ['わたしは がっこう', 'いきます。'],
    fullSentenceKana: 'わたしはがっこうにいきます。',
    romaji: 'watashi wa gakkou ni ikimasu.',
    swedishTranslation: 'Jag går till skolan.',
    correctParticle: 'に',
    options: ['に', 'を', 'で', 'の'],
    ruleSummary: 'Destination / slutpunkt för rörelse → に',
    explanationSv: 'Destinationen (målet) för förflyttningsverb som いく (gå/åka) eller くる (komma) markeras med に (eller へ). Skolan är målet, inte ett direkt objekt!',
    keyCueSv: 'Åka/gå till en destination → に'
  },
  {
    id: 'q_he_direction_japan',
    category: 'o_vs_ni_vs_he',
    level: 2,
    sentenceParts: ['らいねん にほん', 'いきます。'],
    fullSentenceKana: 'らいねんにほんへいきます。',
    romaji: 'rainen nihon e ikimasu.',
    swedishTranslation: 'Nästa år åker jag mot/till Japan.',
    correctParticle: 'へ',
    options: ['へ', 'を', 'で', 'から'],
    ruleSummary: 'Riktningspartikel ("mot") → へ',
    explanationSv: 'へ (skrivs som "he" men uttalas "e" som partikel) betonar riktningen på resan. Både に och へ är godkända för rörelse, men bland alternativen är へ den enda giltiga riktningsmarkören!',
    keyCueSv: 'Riktning (uttalas E) → へ'
  },
  {
    id: 'q_ni_meet_friend',
    category: 'o_vs_ni_vs_he',
    level: 2,
    sentenceParts: ['あした ともだち', 'あいます。'],
    fullSentenceKana: 'あしたともだちにあいます。',
    romaji: 'ashita tomodachi ni aimasu.',
    swedishTranslation: 'Imorgon ska jag träffa en vän.',
    correctParticle: 'に',
    options: ['に', 'を', 'で', 'へ'],
    ruleSummary: 'Träffa någon (あう) tar alltid → に',
    explanationSv: 'Klassisk fälla! På svenska säger vi "träffa en vän" (objekt), men på japanska rör man sig mot personen: [Person] に あいます (au tar partikeln に, aldrig を!).',
    keyCueSv: 'Träffa en person: [Person] に あう'
  },
  {
    id: 'q_ni_target_call',
    category: 'o_vs_ni_vs_he',
    level: 2,
    sentenceParts: ['せんせい', 'でんわを かけました。'],
    fullSentenceKana: 'せんせいにでんわをかけました。',
    romaji: 'sensei ni denwa o kakemashita.',
    swedishTranslation: 'Jag ringde ett telefonsamtal till läraren.',
    correctParticle: 'に',
    options: ['に', 'で', 'を', 'へ'],
    ruleSummary: 'Mottagare av handlingen → に',
    explanationSv: 'Läraren är mottagaren av samtalet (indirekt objekt: "till läraren"). Telefonsamtalet (でんわ) är det direkta objektet som tar を, och mottagaren tar に.',
    keyCueSv: 'Mottagare (ringa till, ge till) → に'
  },

  // ==========================================
  // NO vs TO vs MO
  // ==========================================
  {
    id: 'q_no_possession_book',
    category: 'no_to_mo',
    level: 1,
    sentenceParts: ['これは わたし', 'ほんです。'],
    fullSentenceKana: 'これはわたしのほんです。',
    romaji: 'kore wa watashi no hon desu.',
    swedishTranslation: 'Det här är min bok.',
    correctParticle: 'の',
    options: ['の', 'と', 'も', 'は'],
    ruleSummary: 'Ägande / genitiv ("min") → の',
    explanationSv: 'の kopplar ihop två substantiv och visar ägande: わたし (jag) + の + ほん (bok) = "min bok" (bok som tillhör mig).',
    keyCueSv: 'X no Y = X:s Y'
  },
  {
    id: 'q_no_connection_japanese_teacher',
    category: 'no_to_mo',
    level: 1,
    sentenceParts: ['やまださんは にほんご', 'せんせいです。'],
    fullSentenceKana: 'やまださんはにほんごのせんせいです。',
    romaji: 'yamada-san wa nihongo no sensei desu.',
    swedishTranslation: 'Yamada-san är lärare i japanska.',
    correctParticle: 'の',
    options: ['の', 'と', 'で', 'に'],
    ruleSummary: 'Koppla samman två substantiv → の',
    explanationSv: 'I japanskan sätts substantiv som beskriver ett annat substantiv ihop med の: にほんご (japanska) + の + せんせい (lärare) = japansklärare.',
    keyCueSv: 'Sammensatta substantiv → の'
  },
  {
    id: 'q_to_exhaustive_list',
    category: 'no_to_mo',
    level: 1,
    sentenceParts: ['パン', 'みずを かいました。'],
    fullSentenceKana: 'パンとみずをかいました。',
    romaji: 'pan to mizu o kaimashita.',
    swedishTranslation: 'Jag köpte bröd och vatten.',
    correctParticle: 'と',
    options: ['と', 'の', 'も', 'に'],
    ruleSummary: 'Koppla ihop substantiv ("och") → と',
    explanationSv: 'När du räknar upp en fullständig lista av saker kopplas substantiven ihop med と ("och"). A と B = "A och B".',
    keyCueSv: 'Substantiv OCH substantiv → と'
  },
  {
    id: 'q_to_together_with',
    category: 'no_to_mo',
    level: 1,
    sentenceParts: ['きのう ともだち', 'えいがを みました。'],
    fullSentenceKana: 'きのうともだちとえいがをみました。',
    romaji: 'kinou tomodachi to eiga o mimashita.',
    swedishTranslation: 'Igår såg jag en film tillsammans med en vän.',
    correctParticle: 'と',
    options: ['と', 'に', 'で', 'の'],
    ruleSummary: 'Göra något tillsammans med någon → と',
    explanationSv: 'När du utför en aktivitet tillsammans med en person eller ett sällskap används partikeln と ("med"). [Person] と = "med [person]".',
    keyCueSv: 'Tillsammans med [person] → と'
  },
  {
    id: 'q_mo_also_student',
    category: 'no_to_mo',
    level: 1,
    sentenceParts: ['たなかさんは がくせいです。わたし', 'がくせいです。'],
    fullSentenceKana: 'たなかさんはがくせいです。わたしもがくせいです。',
    romaji: 'tanaka-san wa gakusei desu. watashi mo gakusei desu.',
    swedishTranslation: 'Tanaka-san är student. Jag är också student.',
    correctParticle: 'も',
    options: ['も', 'は', 'が', 'と'],
    ruleSummary: 'Också / även (ersätter は) → も',
    explanationSv: 'も betyder "också / även" och ersätter ämnespartikeln は helt. Skriv inte "わたしはも", utan bara "わたしも"!',
    keyCueSv: 'Också / även → も (ersätter は, が, を)'
  },
  {
    id: 'q_mo_also_coffee',
    category: 'no_to_mo',
    level: 2,
    sentenceParts: ['おちゃを のみました。コーヒー', 'のみました。'],
    fullSentenceKana: 'おちゃをのみました。コーヒーものみました。',
    romaji: 'ocha o nomimashita. koohii mo nomimashita.',
    swedishTranslation: 'Jag drack te. Jag drack också kaffe.',
    correctParticle: 'も',
    options: ['も', 'を', 'は', 'と'],
    ruleSummary: 'Också för objekt (ersätter を) → も',
    explanationSv: 'När も används för att säga att man också gjorde något med ett föremål ersätter も objektspartikeln を helt: コーヒーも のみました.',
    keyCueSv: 'Drack också kaffe → コーヒーも'
  },

  // ==========================================
  // KARA & MADE
  // ==========================================
  {
    id: 'q_kara_start_time',
    category: 'kara_made',
    level: 1,
    sentenceParts: ['じゅぎょうは 9じ', 'はじまります。'],
    fullSentenceKana: 'じゅぎょうは9じからはじまります。',
    romaji: 'jugyou wa kuji kara hajimarimasu.',
    swedishTranslation: 'Lektionen börjar från klockan 9.',
    correctParticle: 'から',
    options: ['から', 'まで', 'に', 'で'],
    ruleSummary: 'Startpunkt i tid ("från") → から',
    explanationSv: 'から markerar startpunkten i tid eller rum ("från klockan 9").',
    keyCueSv: 'Från (tid/plats) → から'
  },
  {
    id: 'q_made_end_time',
    category: 'kara_made',
    level: 1,
    sentenceParts: ['ぎんこうは 3じ', 'です。'],
    fullSentenceKana: 'ぎんこうは3じまでです。',
    romaji: 'ginkou wa sanji made desu.',
    swedishTranslation: 'Banken har öppet fram till klockan 3.',
    correctParticle: 'まで',
    options: ['まで', 'から', 'に', 'で'],
    ruleSummary: 'Slutpunkt i tid ("till / fram till") → まで',
    explanationSv: 'まで markerar slutpunkten i tid eller rum ("fram till klockan 3").',
    keyCueSv: 'Till / fram till → まで'
  },
  {
    id: 'q_kara_made_combo_time',
    category: 'kara_made',
    level: 1,
    sentenceParts: ['まいにち 9じから 5じ', 'べんきょうします。'],
    fullSentenceKana: 'まいにち9じから5じまでべんきょうします。',
    romaji: 'mainichi kuji kara goji made benkyou shimasu.',
    swedishTranslation: 'Varje dag pluggar jag från 9 till 5.',
    correctParticle: 'まで',
    options: ['まで', 'から', 'に', 'で'],
    ruleSummary: 'Från X till Y → [X] から [Y] まで',
    explanationSv: 'Det klassiska paret! Startpunkten har redan から (9じから), så slutpunkten 5じ måste följas av まで.',
    keyCueSv: '[X] から [Y] まで'
  },
  {
    id: 'q_kara_origin_place',
    category: 'kara_made',
    level: 2,
    sentenceParts: ['スウェーデン', 'きました。'],
    fullSentenceKana: 'スウェーデンからきました。',
    romaji: 'suweeden kara kimashita.',
    swedishTranslation: 'Jag kommer från Sverige.',
    correctParticle: 'から',
    options: ['から', 'まで', 'に', 'で'],
    ruleSummary: 'Ursprung ("från en plats") → から',
    explanationSv: 'När du berättar var du kommer ifrån används ursprungspartikeln から tillsammans med verbet きました (kom): Sverige + kara kimashita.',
    keyCueSv: '[Land] から きました = Jag kommer från [Land]'
  },
  {
    id: 'q_made_distance_station',
    category: 'kara_made',
    level: 2,
    sentenceParts: ['うちから えき', 'あるいて いきます。'],
    fullSentenceKana: 'うちからえきまであるいていきます。',
    romaji: 'uchi kara eki made aruite ikimasu.',
    swedishTranslation: 'Jag går till fots från hemmet till stationen.',
    correctParticle: 'まで',
    options: ['まで', 'から', 'に', 'へ'],
    ruleSummary: 'Slutdestination för sträckan → まで',
    explanationSv: 'När man anger hela sträckan från en punkt till en annan används [Från] から [Till] まで. Här är stationen slutpunkten på promenaden.',
    keyCueSv: 'Hela sträckan fram till → まで'
  },

  // ==========================================
  // SENTENCE ENDERS (KA, NE, YO) & ADVANCED
  // ==========================================
  {
    id: 'q_ka_question_sentence',
    category: 'all',
    level: 1,
    sentenceParts: ['これは あなたの かさです', '。'],
    fullSentenceKana: 'これはあなたのかさですか。',
    romaji: 'kore wa anata no kasa desu ka.',
    swedishTranslation: 'Är det här ditt paraply?',
    correctParticle: 'か',
    options: ['か', 'ね', 'よ', 'の'],
    ruleSummary: 'Frågemärke i tal och skrift → か',
    explanationSv: 'か i slutet av en artig mening gör påståendet till en fråga (motsvarar frågetecknet i japansk grammatik).',
    keyCueSv: 'Satsavslutande fråga → か'
  },
  {
    id: 'q_ne_tag_question',
    category: 'all',
    level: 1,
    sentenceParts: ['きょうは さむいですね。― そうです', '。'],
    fullSentenceKana: 'きょうはさむいですね。― そうですね。',
    romaji: 'kyou wa samui desu ne. - sou desu ne.',
    swedishTranslation: 'Idag är det kallt, eller hur? ― Ja, visst är det så.',
    correctParticle: 'ね',
    options: ['ね', 'よ', 'か', 'わ'],
    ruleSummary: 'Söker bekräftelse / medhåll ("eller hur?") → ね',
    explanationSv: 'ね i slutet av en mening fungerar som svenskans "eller hur?" eller "visst?". Talaren söker samförstånd från lyssnaren.',
    keyCueSv: 'Bekräftelse & medhåll → ね'
  },
  {
    id: 'q_yo_assertion',
    category: 'all',
    level: 2,
    sentenceParts: ['このラーメンは とても おいしいです', '！'],
    fullSentenceKana: 'このラーメンはとてもおいしいですよ！',
    romaji: 'kono raamen wa totemo oishii desu yo!',
    swedishTranslation: 'Den här ramenen är verkligen jättegod, kan jag lova!',
    correctParticle: 'よ',
    options: ['よ', 'ね', 'か', 'も'],
    ruleSummary: 'Ger ny information / övertygelse ("du vet!") → よ',
    explanationSv: 'よ signalerar att talaren delar med sig av ny information som lyssnaren antas inte veta, eller ger en vänlig försäkran ("jag lovar dig!").',
    keyCueSv: 'Ny information till lyssnaren → よ'
  },
  {
    id: 'q_de_event_concert',
    category: 'ni_vs_de',
    level: 3,
    sentenceParts: ['とうきょう', 'コンサートが あります。'],
    fullSentenceKana: 'とうきょうでコンサートがあります。',
    romaji: 'toukyou de konsaato ga arimasu.',
    swedishTranslation: 'Det är konsert i Tokyo (evenemanget äger rum).',
    correctParticle: 'で',
    options: ['で', 'に', 'へ', 'を'],
    ruleSummary: 'Evenemang som äger rum (händelse) → で',
    explanationSv: 'Avancerad tentafälla! Normalt tar あります partikeln に för fysisk existens ("boken finns på bordet"). Men när subjektet är ett EVENEMANG (konsert, fest, match, prov) som utspelar sig, tar platsen partikeln で!',
    keyCueSv: 'Evenemang äger rum ([Konsert/Fest] ga arimasu) → で'
  },
  {
    id: 'q_ni_time_relative_none',
    category: 'ni_vs_de',
    level: 3,
    sentenceParts: ['わたしは きょう', 'にほんごを べんきょうします。'],
    fullSentenceKana: 'わたしはきょうにほんごをべんきょうします。',
    romaji: 'watashi wa kyou nihongo o benkyou shimasu.',
    swedishTranslation: 'Jag ska studera japanska idag. (Ingen tidspartikel behövs för kyou!)',
    correctParticle: 'は',
    options: ['は', 'に', 'で', 'を'],
    ruleSummary: 'Relativa tidsord (kyou, ashita) tar INTE に',
    explanationSv: 'Relativa tidsord som きょう (idag), あした (imorgon) och きのう (igår) tar ALDRIG tidspartikeln に. Om man sätter en partikel här kan det bara vara ämnespartikeln は.',
    keyCueSv: 'Kyou / Ashita / Mainichi tar ALDRIG に!'
  }
];

export const PARTICLE_GUIDE_ITEMS: ParticleGuideItem[] = [
  {
    particle: 'は',
    romaji: 'wa',
    nameSv: 'Ämnespartikel (Topic)',
    coreRoleSv: 'Lyfter fram vad meningen handlar om ("Vad gäller X...").',
    goldenRulesSv: [
      'Skrivs med hiragana-tecknet は men uttalas alltid "WA" när det fungerar som partikel.',
      'Sätter scenen för meningen: allt som sägs efteråt är en kommentar om detta ämne.',
      'Ersätts av も när du vill säga "också".'
    ],
    exampleSentences: [
      { kana: 'わたしは がくせいです。', romaji: 'watashi wa gakusei desu.', translationSv: 'Jag är student.' },
      { kana: 'きょうは あついです。', romaji: 'kyou wa atsui desu.', translationSv: 'Idag är det varmt.' }
    ],
    pitfallWarningSv: 'Förväxla inte med subjektspartikeln が. は handlar om det kända ämnet, medan が pekar ut vem/vad som utför handlingen eller har en specifik egenskap.'
  },
  {
    particle: 'が',
    romaji: 'ga',
    nameSv: 'Subjektspartikel & Egenskapsfokus',
    coreRoleSv: 'Anger vem eller vad som är det grammatiska subjektet, och används med gilla/ogilla samt existens.',
    goldenRulesSv: [
      'Används med adjektiv som すき (gilla), きらい (ogilla), じょうず (duktig), へた (dålig), ほしい (vill ha).',
      'Används alltid med あります (döda ting finns) och います (levande varelser finns).',
      'Frågeord i subjektsställning (だれ vem, なに vad) måste ta が, aldrig は.'
    ],
    exampleSentences: [
      { kana: 'ねこが すきです。', romaji: 'neko ga suki desu.', translationSv: 'Jag gillar katter.' },
      { kana: 'あそこに いぬが います。', romaji: 'asoko ni inu ga imasu.', translationSv: 'Där borta finns en hund.' }
    ],
    pitfallWarningSv: 'Säg ALDRIG "ねこをすきです" (neko o suki desu). På japanska är "suki" ett adjektiv och kan aldrig ta objektspartikeln を!'
  },
  {
    particle: 'を',
    romaji: 'o / wo',
    nameSv: 'Objektspartikel (Direkt objekt)',
    coreRoleSv: 'Markerar målet för en transitiv handling (vad du äter, dricker, läser eller gör).',
    goldenRulesSv: [
      'Skrivs med hiragana を men uttalas som rent "O".',
      'Används med transitiva verb: たべる (äta), のむ (dricka), よむ (läsa), みる (se), する (göra).'
    ],
    exampleSentences: [
      { kana: 'みずを のみます。', romaji: 'mizu o nomimasu.', translationSv: 'Jag dricker vatten.' },
      { kana: 'えいがを みます。', romaji: 'eiga o mimasu.', translationSv: 'Jag tittar på film.' }
    ],
    pitfallWarningSv: 'Tecknet を används i modern japanska nästan uteslutande som grammatisk partikel. Det inleder aldrig ord.'
  },
  {
    particle: 'に',
    romaji: 'ni',
    nameSv: 'Tid, Mål & Existenspunkt',
    coreRoleSv: 'Träffpunkten! Anger specifik tidpunkt, destination eller platsen där något finns.',
    goldenRulesSv: [
      'Specifik tid med siffror: 7じに (kl 7), げつようびに (på måndag).',
      'Destination för rörelse: にほんに いきます (åka till Japan).',
      'Plats för existens: へやに あります (finns i rummet).',
      'Person man möter eller ringer: ともだちに あいます (träffar en vän).'
    ],
    exampleSentences: [
      { kana: '8じに おきます。', romaji: 'hachiji ni okimasu.', translationSv: 'Jag vaknar klockan 8.' },
      { kana: 'がっこうに いきます。', romaji: 'gakkou ni ikimasu.', translationSv: 'Jag går till skolan.' }
    ],
    pitfallWarningSv: 'Använd inte に för platsen där du gör en aktiv handling (t.ex. äter eller pluggar) — då är det alltid で!'
  },
  {
    particle: 'で',
    romaji: 'de',
    nameSv: 'Handlingsplats, Medel & Verktyg',
    coreRoleSv: 'Var handlingen äger rum, eller vilket verktyg/färdsätt du använder.',
    goldenRulesSv: [
      'Plats för aktivitet: としょかんで べんきょうする (studera på biblioteket).',
      'Färdmedel: バスで いく (åka med buss).',
      'Verktyg: はしで たべる (äta med pinnar).',
      'Språk: にほんごで はなす (prata på japanska).'
    ],
    exampleSentences: [
      { kana: 'カフェで コーヒーを のみます。', romaji: 'kafe de koohii o nomimasu.', translationSv: 'Jag dricker kaffe på kaféet.' },
      { kana: 'しんかんせんで いきます。', romaji: 'shinkansen de ikimasu.', translationSv: 'Jag åker med Shinkansen.' }
    ],
    pitfallWarningSv: 'Minnesregel: Sitter du still och bara "finns" där? → に. Utför du en aktiv handling (äter, skriver, läser)? → で.'
  },
  {
    particle: 'へ',
    romaji: 'e',
    nameSv: 'Riktningspartikel ("mot")',
    coreRoleSv: 'Markerar kompassriktningen mot ett mål för en förflyttning.',
    goldenRulesSv: [
      'Skrivs med hiragana へ men uttalas som "E" som partikel.',
      'Betonar riktningen på väg mot målet mer än själva ankomstpunkten.'
    ],
    exampleSentences: [
      { kana: 'とうきょうへ いきます。', romaji: 'toukyou e ikimasu.', translationSv: 'Jag åker mot Tokyo.' },
      { kana: 'うちへ かえります。', romaji: 'uchi e kaerimasu.', translationSv: 'Jag vänder hemåt.' }
    ],
    pitfallWarningSv: 'Till skillnad från に kan へ inte användas för klockslag eller för existens.'
  },
  {
    particle: 'の',
    romaji: 'no',
    nameSv: 'Genitiv / Ägande / Modifikator',
    coreRoleSv: 'Knyter ihop två substantiv så att det första beskriver det andra ("X:s Y").',
    goldenRulesSv: [
      'Ägande: わたしの ほん (min bok).',
      'Härkomst / typ: にほんの くるま (japansk bil).',
      'Yrkesområde: えいごの せんせい (engelsklärare).'
    ],
    exampleSentences: [
      { kana: 'だれの かさですか。', romaji: 'dare no kasa desu ka.', translationSv: 'Vems paraply är det här?' },
      { kana: 'わたしの ともだちです。', romaji: 'watashi no tomodachi desu.', translationSv: 'Det är min vän.' }
    ],
    pitfallWarningSv: 'Ordningen är strikt: Ägaren eller kategorin kommer ALLTID först. "Min bok" = わたし (jag) + の + ほん (bok).'
  },
  {
    particle: 'と',
    romaji: 'to',
    nameSv: 'Och & Tillsammans med',
    coreRoleSv: 'Binder ihop substantiv i en uttömmande lista eller anger sällskap.',
    goldenRulesSv: [
      'Substantiv A och Substantiv B: コーヒーと ケーキ (kaffe och kaka).',
      'Tillsammans med person: ともだちと (tillsammans med en kompis).'
    ],
    exampleSentences: [
      { kana: 'ねこと いぬが います。', romaji: 'neko to inu ga imasu.', translationSv: 'Det finns en katt och en hund.' },
      { kana: 'かぞくと ひるごはんを たべます。', romaji: 'kazoku to hirugohan o tabemasu.', translationSv: 'Jag äter lunch med familjen.' }
    ],
    pitfallWarningSv: 'と binder endast ihop SUBSTANTIV, aldrig hela satser eller adjektiv!'
  },
  {
    particle: 'も',
    romaji: 'mo',
    nameSv: 'Också / Även',
    coreRoleSv: 'Ersätter は, が eller を för att visa att samma sak gäller för detta element.',
    goldenRulesSv: [
      'Ersätter は: わたしも がくせいです (Jag är också student).',
      'Ersätter を: これも かいました (Jag köpte den här också).'
    ],
    exampleSentences: [
      { kana: 'これも おいしいです。', romaji: 'kore mo oishii desu.', translationSv: 'Den här är också god.' },
      { kana: 'あしたも いきます。', romaji: 'ashita mo ikimasu.', translationSv: 'Jag åker imorgon också.' }
    ],
    pitfallWarningSv: 'Kombinera inte "はも" eller "をも". Partikeln も ersätter dem direkt.'
  },
  {
    particle: 'から & まで',
    romaji: 'kara & made',
    nameSv: 'Från & Till',
    coreRoleSv: 'Anger start- och slutpunkt i antingen tid eller rum.',
    goldenRulesSv: [
      'Från tid/plats: 9じから (från kl 9), とうきょうから (från Tokyo).',
      'Fram till tid/plats: 5じまで (till kl 5), えきまで (fram till stationen).',
      'Kombination: 9じから 5じまで (från 9 till 5).'
    ],
    exampleSentences: [
      { kana: 'スウェーデンから きました。', romaji: 'suweeden kara kimashita.', translationSv: 'Jag kommer från Sverige.' },
      { kana: 'うちから だいがくまで あるきます。', romaji: 'uchi kara daigaku made arukimasu.', translationSv: 'Jag promenerar från hemmet till universitetet.' }
    ],
    pitfallWarningSv: 'Kom ihåg att ordningen är logisk: から (från start) kommer alltid före まで (till slutet).'
  }
];

/**
 * Filter questions by duel category
 */
export function getQuestionsByCategory(category: ParticleDuelCategory): ParticleQuestion[] {
  if (category === 'all') {
    return PARTICLE_QUESTIONS;
  }
  return PARTICLE_QUESTIONS.filter(q => q.category === category);
}

/**
 * Generate a randomized question with fallback options
 */
export function generateParticleQuestion(options?: {
  category?: ParticleDuelCategory;
  excludeId?: string;
}): ParticleQuestion {
  const category = options?.category || 'all';
  let pool = getQuestionsByCategory(category);

  if (options?.excludeId && pool.length > 1) {
    pool = pool.filter(q => q.id !== options.excludeId);
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const selected = pool[randomIndex] || PARTICLE_QUESTIONS[0];

  // Shuffle the options so the correct answer isn't always in the same position
  const shuffledOptions = [...selected.options].sort(() => Math.random() - 0.5);

  return {
    ...selected,
    options: shuffledOptions
  };
}

/**
 * Generate a quiz round session of N randomized questions
 */
export function generateParticleSession(size: number = 10, category: ParticleDuelCategory = 'all'): ParticleQuestion[] {
  const pool = getQuestionsByCategory(category);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  const selected = shuffled.slice(0, Math.min(size, shuffled.length));

  // If pool was smaller than desired size, fill with repeats
  while (selected.length < size && pool.length > 0) {
    const extra = pool[Math.floor(Math.random() * pool.length)];
    selected.push(extra);
  }

  return selected.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5)
  }));
}
