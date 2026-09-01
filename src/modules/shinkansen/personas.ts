import type { MnemonicPersona, PassengerPersona } from './types';

export const KANA_MNEMONIC_MAP: Record<string, MnemonicPersona> = {
  // Vowels (A, I, U, E, O)
  'a': {
    emoji: '🍎',
    nameSv: 'Äppelplockaren',
    cueSv: 'A som i Apel / Äpple',
    quoteHappy: 'Tack! Mina färska äpplen hinner med!',
    quoteStress: 'Akta mina äpplen, tåget avgår strax!'
  },
  'i': {
    emoji: '🦔',
    nameSv: 'Igelkottsvännen',
    cueSv: 'I som i två Iglar / Igelkott',
    quoteHappy: 'Arigatou! Igelkotten och jag är ombord!',
    quoteStress: 'Igelkotten blir stressad av dörrarna!'
  },
  'u': {
    emoji: '🦉',
    nameSv: 'Uggleskådaren',
    cueSv: 'U som i Uggla / Uppsittning',
    quoteHappy: 'Uhh, vilken tur att vi hann!',
    quoteStress: 'Uff! Ryggsäcken fastnar nästan i dörren!'
  },
  'e': {
    emoji: '🐿️',
    nameSv: 'Ekorrmataren',
    cueSv: 'E som i Ekorre',
    quoteHappy: 'Ekorren och jag tackar för hjälpen!',
    quoteStress: 'Ekorren skuttar runt av stress, skynda!'
  },
  'o': {
    emoji: '⛳',
    nameSv: 'Golfaren',
    cueSv: 'O som i Golfboll På green',
    quoteHappy: 'Hole-in-one! Rakt in i vagnen!',
    quoteStress: 'Min golfklubba hinner inte med!'
  },
  // K-row (Ka, Ki, Ku, Ke, Ko)
  'ka': {
    emoji: '🍰',
    nameSv: 'Konditorn',
    cueSv: 'Ka som i en Kaka',
    quoteHappy: 'Kakan är hel och vi är ombord!',
    quoteStress: 'Skynda, tårtan får inte smälta på perrongen!'
  },
  'ki': {
    emoji: '🗝️',
    nameSv: 'Nyckelmästaren',
    cueSv: 'Ki som i en Nyckel (Key)',
    quoteHappy: 'Nyckeln till framgång är snabba tåg!',
    quoteStress: 'Var lade jag nyckeln?! Dörrarna stängs!'
  },
  'ku': {
    emoji: '🐦',
    nameSv: 'Fågelskådaren',
    cueSv: 'Ku som i Kuckeliku / Fågelnäbb',
    quoteHappy: 'Kuckeliku! Ombord i sista sekund!',
    quoteStress: 'Fågeln flyger iväg om vi inte skyndar!'
  },
  'ke': {
    emoji: '🧪',
    nameSv: 'Kemisten',
    cueSv: 'Ke som i Kemi / Kittel',
    quoteHappy: 'Perfekt kemisk reaktion, vi hann!',
    quoteStress: 'Provrören skakar, tåget avgår snart!'
  },
  'ko': {
    emoji: '🐮',
    nameSv: 'Bonden',
    cueSv: 'Ko som i en Ko',
    quoteHappy: 'Muuu-tack! Perfekt tajming!',
    quoteStress: 'Kossan vill gå ombord nu, öppna!'
  },
  // S-row (Sa, Shi, Su, Se, So)
  'sa': {
    emoji: '✂️',
    nameSv: 'Skräddaren',
    cueSv: 'Sa som i en Sax',
    quoteHappy: 'Klippt och skuret! Vi hann med!',
    quoteStress: 'Saxen klipper i sista sekunden!'
  },
  'shi': {
    emoji: '🎣',
    nameSv: 'Fiskaren',
    cueSv: 'Shi som i en Metkrok i Sjön',
    quoteHappy: 'Vilken storfångst att hinna med tåget!',
    quoteStress: 'Metkroken fastnar i spärren, hjälp!'
  },
  'su': {
    emoji: '🍣',
    nameSv: 'Sushikocken',
    cueSv: 'Su som i Sushi / Snurra',
    quoteHappy: 'Sushin levereras i blixtfart!',
    quoteStress: 'Skynda, sushin ska serveras färsk!'
  },
  'se': {
    emoji: '⛵',
    nameSv: 'Seglaren',
    cueSv: 'Se som i en Segelbåt',
    quoteHappy: 'Medvind hela vägen in i kupén!',
    quoteStress: 'Seglen fladdrar, vi måste ombord!'
  },
  'so': {
    emoji: '🪭',
    nameSv: 'Dansaren',
    cueSv: 'So som i en Solfjäder',
    quoteHappy: 'Vackert som en dans, tack!',
    quoteStress: 'Solfjädern viftar i panik!'
  },
  // T-row (Ta, Chi, Tsu, Te, To)
  'ta': {
    emoji: '🍽️',
    nameSv: 'Gourmeten',
    cueSv: 'Ta som i en Tallrik',
    quoteHappy: 'Middagen är räddad, fantastiskt!',
    quoteStress: 'Tallrikarna skramlar, skynda!'
  },
  'chi': {
    emoji: '📣',
    nameSv: 'Cheerleadern',
    cueSv: 'Chi som i en Cheerleader',
    quoteHappy: 'Heja heja! Vi klarade det!',
    quoteStress: 'Heja på mig så jag hinner med!'
  },
  'tsu': {
    emoji: '🌊',
    nameSv: 'Surfare',
    cueSv: 'Tsu som i en Tsunami-våg',
    quoteHappy: 'Red tsunamin rakt in i tåget!',
    quoteStress: 'Vågen sköljer över oss, skynda!'
  },
  'te': {
    emoji: '✋',
    nameSv: 'Handviftaren',
    cueSv: 'Te som i en Hand (手 / Te)',
    quoteHappy: 'Viftar glatt med handen (Te)! Tack för hjälpen!',
    quoteStress: 'Viftar med handen (Te) så tåget inte åker!'
  },
  'to': {
    emoji: '🦶',
    nameSv: 'Maratonlöparen',
    cueSv: 'To som i en Tå / Törnrosa',
    quoteHappy: 'Sprang på tårna ända in i målet!',
    quoteStress: 'Akta tårna så inte dörren klämmer!'
  },
  // N-row (Na, Ni, Nu, Ne, No)
  'na': {
    emoji: '⛪',
    nameSv: 'Klostersystern',
    cueSv: 'Na som i en Nunna vid korset',
    quoteHappy: 'Välsignad resa, tack så mycket!',
    quoteStress: 'Bönerna hjälper, men fötterna måste skynda!'
  },
  'ni': {
    emoji: '🪡',
    nameSv: 'Sömmerskan',
    cueSv: 'Ni som i en Nål / Ni=2 ✌️',
    quoteHappy: 'Tråden är trädd och tåget är nått!',
    quoteStress: 'Tappade nålen på perrongen, hjälp!'
  },
  'nu': {
    emoji: '🍜',
    nameSv: 'Ramen-älskaren',
    cueSv: 'Nu som i Nudlar med ätpinnar',
    quoteHappy: 'Mums! Rammenskålen hann med intakt!',
    quoteStress: 'Nudlarna kallnar om tåget avgår!'
  },
  'ne': {
    emoji: '🐱',
    nameSv: 'Kattälskaren',
    cueSv: 'Ne som i Neko (Katt med svans)',
    quoteHappy: 'Mjau! Katten spinner av glädje!',
    quoteStress: 'Mjaau! Kläm inte svansen i dörren!'
  },
  'no': {
    emoji: '🚫',
    nameSv: 'Trafikvakten',
    cueSv: 'No som i Förbudsmärke (NO!)',
    quoteHappy: 'Klart spår! Inga hinder här!',
    quoteStress: 'Säg inte NO till avgången, skynda!'
  },
  // H-row (Ha, Hi, Fu, He, Ho)
  'ha': {
    emoji: '👒',
    nameSv: 'Modisten',
    cueSv: 'Ha som i en Halmhatt',
    quoteHappy: 'Halmhatten sitter kvar på huvudet, underbart!',
    quoteStress: 'Vinden tar min halmhatt, spring!'
  },
  'hi': {
    emoji: '😄',
    nameSv: 'Komikern',
    cueSv: 'Hi som i ett Leende (Hihihi)',
    quoteHappy: 'Hihihi! Det var det roligaste på länge!',
    quoteStress: 'Skrattet fastnar i halsen om jag missar tåget!'
  },
  'fu': {
    emoji: '🗻',
    nameSv: 'Bergsvandraren',
    cueSv: 'Fu som i Berget Fuji',
    quoteHappy: 'Utsikten från Shinkansen mot Fuji blir magisk!',
    quoteStress: 'Fuji väntar inte, vi måste med!'
  },
  'he': {
    emoji: '⛰️',
    nameSv: 'Backhopparen',
    cueSv: 'He som i en Backe / Höjd',
    quoteHappy: 'Heja heja! Rakt utför backen in i kupén!',
    quoteStress: 'Uppförsbacke mot perrongen, hjälp!'
  },
  'ho': {
    emoji: '🏠',
    nameSv: 'Husbyggaren',
    cueSv: 'Ho som i ett Hus med tak',
    quoteHappy: 'Hemma bra men Shinkansen bäst!',
    quoteStress: 'Måste hem till huset innan solen går ner!'
  },
  // M-row (Ma, Mi, Mu, Me, Mo)
  'ma': {
    emoji: '👩',
    nameSv: 'Mamma',
    cueSv: 'Ma som i Mamma med hårspännen',
    quoteHappy: 'Mamma är stolt över din snabba hjälp!',
    quoteStress: 'Mamma har bråttom, dörrarna stängs!'
  },
  'mi': {
    emoji: '🎵',
    nameSv: 'Musikern',
    cueSv: 'Mi som i Musiknoten Mi',
    quoteHappy: 'Ljuv musik i mina öron, tack!',
    quoteStress: 'Konserten börjar snart, skynda!'
  },
  'mu': {
    emoji: '🐄',
    nameSv: 'Lantbrukaren',
    cueSv: 'Mu som i en Ko (Muuu)',
    quoteHappy: 'Muuu-ligt att vi hann! Tack!',
    quoteStress: 'Muuu! Tåget får inte rulla utan oss!'
  },
  'me': {
    emoji: '👁️',
    nameSv: 'Optikern',
    cueSv: 'Me som i ett Öga (Me på japanska)',
    quoteHappy: 'Jag ser klart och tydligt att vi hann!',
    quoteStress: 'Håll ögonen öppna, dörrarna slår igen!'
  },
  'mo': {
    emoji: '🪱',
    nameSv: 'Metaren',
    cueSv: 'Mo som i en Mask på kroken',
    quoteHappy: 'Masken och jag är säkra ombord!',
    quoteStress: 'Masken slingrar sig, vi måste in!'
  },
  // Y-row (Ya, Yu, Yo)
  'ya': {
    emoji: '🐂',
    nameSv: 'Bergsguiden',
    cueSv: 'Ya som i en Yak-oxe',
    quoteHappy: 'Yaken och jag tackar för skjutsen!',
    quoteStress: 'Yaken vägrar springa fortare, skynda!'
  },
  'yu': {
    emoji: '♨️',
    nameSv: 'Badgästen',
    cueSv: 'Yu som i en Varm källa (Onsen)',
    quoteHappy: 'Ahhh! Det varma källbadet i Kyoto väntar!',
    quoteStress: 'Det varma badet kallnar om vi missar tåget!'
  },
  'yo': {
    emoji: '🪀',
    nameSv: 'Trollkarlen',
    cueSv: 'Yo som i en Jojo',
    quoteHappy: 'Jojon snurrar av glädje!',
    quoteStress: 'Jojosnöret trasslade sig, skynda!'
  },
  // R-row (Ra, Ri, Ru, Re, Ro)
  'ra': {
    emoji: '🐀',
    nameSv: 'Zoologen',
    cueSv: 'Ra som i en Råtta som sitter',
    quoteHappy: 'Pip! Råttan och jag är ombord!',
    quoteStress: 'Råttan smiter in under perrongen, hjälp!'
  },
  'ri': {
    emoji: '🌾',
    nameSv: 'Risbonden',
    cueSv: 'Ri som i två Risstrån',
    quoteHappy: 'Risskörden är räddad!',
    quoteStress: 'Risstråna blåser bort i draget från tåget!'
  },
  'ru': {
    emoji: '🦘',
    nameSv: 'Känguru-skötaren',
    cueSv: 'Ru som i Känguru med bebis i pung',
    quoteHappy: 'Hoppsan hejsan! Rakt ner i tågsätet!',
    quoteStress: 'Bebisen i kängurupungen vaknar av stressen!'
  },
  're': {
    emoji: '🦌',
    nameSv: 'Skogsvaktaren',
    cueSv: 'Re som i en Ren med horn',
    quoteHappy: 'Renhorns-stolt över din insats!',
    quoteStress: 'Hornen fastnar nästan i dörröppningen!'
  },
  'ro': {
    emoji: '🤖',
    nameSv: 'Robotikern',
    cueSv: 'Ro som i en Robot / Rånad känguru',
    quoteHappy: 'Bip bop! Batterierna laddas på tåget!',
    quoteStress: 'Systemöverbelastning! Dörrarna piper!'
  },
  // W, N & Special
  'wa': {
    emoji: '🌊',
    nameSv: 'Kajakpaddlaren',
    cueSv: 'Wa som i ett Vattenfall',
    quoteHappy: 'Paddlade i mål i perfekt tid!',
    quoteStress: 'Strömmen drar iväg, hjälp oss ombord!'
  },
  'wo': {
    emoji: '🏊',
    nameSv: 'Simmaren',
    cueSv: 'Wo som i en Simmare i vågorna',
    quoteHappy: 'Simmade i mål före avgång!',
    quoteStress: 'Tidsgränsen närmar sig, simma fortare!'
  },
  'n': {
    emoji: '🦏',
    nameSv: 'Safariarkitekten',
    cueSv: 'N som i en Noshörning / Natt',
    quoteHappy: 'Noshörningen hann med nattåget!',
    quoteStress: 'Noshörningen är för tung för att springa!'
  },
  // Dakuten / Handakuten
  'ga': { emoji: '🦆', nameSv: 'Gåsägaren', cueSv: 'Ga som i en Gås (Ka + ゛)', quoteHappy: 'Gässen kacklar av glädje!', quoteStress: 'Gåsen springer åt fel håll!' },
  'gi': { emoji: '🎸', nameSv: 'Gitarristen', cueSv: 'Gi som i en Gitarr (Ki + ゛)', quoteHappy: 'Solot levereras i tid!', quoteStress: 'Strängarna går av om jag missar tåget!' },
  'gu': { emoji: '🦍', nameSv: 'Gorillaskötaren', cueSv: 'Gu som i en Gorilla (Ku + ゛)', quoteHappy: 'Gorillan är trygg i vagnen!', quoteStress: 'Gorillan bankar på bröstet av stress!' },
  'ge': { emoji: '🦎', nameSv: 'Reptilforskaren', cueSv: 'Ge som i en Gecko (Ke + ゛)', quoteHappy: 'Geckon sitter fast på tågrutan!', quoteStress: 'Geckon smiter i panik!' },
  'go': { emoji: '🏌️', nameSv: 'Golfproffset', cueSv: 'Go som i Golfbanan (Ko + ゛)', quoteHappy: 'Perfekt drive in i förstaklass!', quoteStress: 'Bollen rullar mot spåret!' },
  'za': { emoji: '🦓', nameSv: 'Safariresenären', cueSv: 'Za som i en Zebra (Sa + ゛)', quoteHappy: 'Zebran har hittat sin plats!', quoteStress: 'Zebramönstret snurrar i huvudet!' },
  'ji': { emoji: '👖', nameSv: 'Jeansdesignern', cueSv: 'Ji som i Jeans (Shi + ゛)', quoteHappy: 'Modetåget rullar vidare!', quoteStress: 'Jeansen spricker om jag springer fortare!' },
  'zu': { emoji: '🧟', nameSv: 'Skräckförfattaren', cueSv: 'Zu som i Zombie (Su + ゛)', quoteHappy: 'Ingen zombie rår på Shinkansen!', quoteStress: 'Zombierna närmar sig, stäng dörren!' },
  'ze': { emoji: '⚡', nameSv: 'Elektrikern', cueSv: 'Ze som i Blixten (Se + ゛)', quoteHappy: 'Blixtsnabb expedition!', quoteStress: 'Spänningen stiger, tåget åker!' },
  'zo': { emoji: '🐘', nameSv: 'Djurskötaren', cueSv: 'Zo som i Zoo / Elefant (So + ゛)', quoteHappy: 'Elefanten kliver ombord!', quoteStress: 'Tungt lass till perrongen!' },
  'da': { emoji: '🎯', nameSv: 'Dartmästaren', cueSv: 'Da som i Dart (Ta + ゛)', quoteHappy: 'Mitt i prick!', quoteStress: 'Sista pilen avgör!' },
  'de': { emoji: '🕵️', nameSv: 'Detektiven', cueSv: 'De som i en Detektiv (Te + ゛)', quoteHappy: 'Fallet är löst ombord på tåget!', quoteStress: 'Skurken flyr om vi missar tåget!' },
  'do': { emoji: '🍩', nameSv: 'Bagaren', cueSv: 'Do som i en Donut (To + ゛)', quoteHappy: 'Donutarna är varma och goda!', quoteStress: 'Glasyren smälter!' },
  'ba': { emoji: '🍌', nameSv: 'Frukthandlaren', cueSv: 'Ba som i Banan (Ha + ゛)', quoteHappy: 'Bananerna levereras färska!', quoteStress: 'Halkar nästan på bananskalet!' },
  'bi': { emoji: '🐝', nameSv: 'Biodlaren', cueSv: 'Bi som i ett Bi (Hi + ゛)', quoteHappy: 'Honungen är säkrad!', quoteStress: 'Bina surrar i panik!' },
  'bu': { emoji: '🐂', nameSv: 'Tjurfäktaren', cueSv: 'Bu som i en Tjur/Bulle (Fu + ゛)', quoteHappy: 'Lugn som en tjur i kupén!', quoteStress: 'Tjuren ser rött vid dörren!' },
  'be': { emoji: '🛌', nameSv: 'Nattresenären', cueSv: 'Be som i Bädd/Säng (He + ゛)', quoteHappy: 'Nu ska jag sova gott i vagnen!', quoteStress: 'Kudden ramlade ur väskan!' },
  'bo': { emoji: '🥊', nameSv: 'Boxaren', cueSv: 'Bo som i Boxare / Boll (Ho + ゛)', quoteHappy: 'Knockout-seger!', quoteStress: 'Gongen har slagit, in i ringen!' },
  'pa': { emoji: '🐼', nameSv: 'Panda-ambassadören', cueSv: 'Pa som i en Panda (Ha + ゜)', quoteHappy: 'Pandan tuggar bambu i lugn och ro!', quoteStress: 'Pandan rör sig i slow-motion!' },
  'pi': { emoji: '🍕', nameSv: 'Pizzabagaren', cueSv: 'Pi som i Pizza (Hi + ゜)', quoteHappy: 'Pizzan är rykande färsk!', quoteStress: 'Ostkanten fastnar i spärren!' },
  'pu': { emoji: '🐩', nameSv: 'Hundtrimmaren', cueSv: 'Pu som i en Pudel (Fu + ゜)', quoteHappy: 'Vovven och jag är ombord!', quoteStress: 'Kopplet trasslar sig!' },
  'pe': { emoji: '🐧', nameSv: 'Polarforskaren', cueSv: 'Pe som i en Pingvin (He + ゜)', quoteHappy: 'Pingvinen glider in på isen!', quoteStress: 'Pingvinen vacklar mot dörren!' },
  'po': { emoji: '🍿', nameSv: 'Biografbesökaren', cueSv: 'Po som i Popcorn (Ho + ゜)', quoteHappy: 'Popcornen är poppade och filmen väntar!', quoteStress: 'Popcornen flyger över hela perrongen!' }
};

export const WORD_MNEMONIC_MAP: Record<string, { emoji: string; nameSv: string; cueSv: string; quoteHappy: string; quoteStress: string }> = {
  'ねこ': { emoji: '🐱', nameSv: 'Kattälskaren', cueSv: 'Neko = Katt', quoteHappy: 'Mjau! Katten spinner av glädje!', quoteStress: 'Mjaau! Kläm inte kattens svans i dörren!' },
  'いぬ': { emoji: '🐶', nameSv: 'Hundägaren', cueSv: 'Inu = Hund', quoteHappy: 'Vovven viftar på svansen ombord!', quoteStress: 'Vovven skäller av stress vid perrongen!' },
  'すし': { emoji: '🍣', nameSv: 'Sushikocken', cueSv: 'Sushi = Sushi', quoteHappy: 'Sushin serveras färsk och god!', quoteStress: 'Skynda innan sushin blir varm!' },
  'やま': { emoji: '⛰️', nameSv: 'Bergsklättraren', cueSv: 'Yama = Berg', quoteHappy: 'Toppbestigningen väntar!', quoteStress: 'Berget väntar inte, vi måste med!' },
  'かわ': { emoji: '🌊', nameSv: 'Flodguiden', cueSv: 'Kawa = Flod', quoteHappy: 'Flodresan fortsätter!', quoteStress: 'Strömmen drar iväg, skynda!' },
  'ほん': { emoji: '📖', nameSv: 'Bokslukaren', cueSv: 'Hon = Bok', quoteHappy: 'En god bok att läsa på tåget!', quoteStress: 'Bokmärket ramlar ut!' },
  'みず': { emoji: '💧', nameSv: 'Vattenbäraren', cueSv: 'Mizu = Vatten', quoteHappy: 'Kallt och friskt källvatten!', quoteStress: 'Spill inte vattnet i rulltrappan!' },
  'くるま': { emoji: '🚗', nameSv: 'Chauffören', cueSv: 'Kuruma = Bil', quoteHappy: 'Shinkansen är snabbare än bilen!', quoteStress: 'Trafikkön till stationen var hemsk!' },
  'さかな': { emoji: '🐟', nameSv: 'Fiskhandlaren', cueSv: 'Sakana = Fisk', quoteHappy: 'Fångsten är räddad!', quoteStress: 'Fisken ska till morgonmarknaden!' },
  'とり': { emoji: '🐦', nameSv: 'Ornitologen', cueSv: 'Tori = Fågel', quoteHappy: 'Fågeln kvittrar i takt med tåget!', quoteStress: 'Fågeln flaxar i panik!' },
  'はな': { emoji: '🌸', nameSv: 'Floristen', cueSv: 'Hana = Blomma', quoteHappy: 'Sakura-blommorna är i full blom!', quoteStress: 'Kronbladen blåser bort i draget!' },
  'あめ': { emoji: '🌧️', nameSv: 'Paraplybäraren', cueSv: 'Ame = Regn / Godis', quoteHappy: 'Torr och trygg inne i Shinkansen!', quoteStress: 'Regnet öser ner, skynda in!' },
  'つき': { emoji: '🌙', nameSv: 'Astronomen', cueSv: 'Tsuki = Måne', quoteHappy: 'Månskenet lyser upp vår färd!', quoteStress: 'Månen stiger, natten är här!' },
  'ひ': { emoji: '🔥', nameSv: 'Eldslukaren', cueSv: 'Hi = Eld / Sol', quoteHappy: 'Elden hålls under kontroll!', quoteStress: 'Det brinner i knutarna, spring!' },
  'いえ': { emoji: '🏠', nameSv: 'Husägaren', cueSv: 'Ie = Hus/Hem', quoteHappy: 'Hemma bra men Shinkansen bäst!', quoteStress: 'Glömde jag låsa dörren hemma?!' },
  'うた': { emoji: '🎤', nameSv: 'Sångaren', cueSv: 'Uta = Sång', quoteHappy: 'Konserten blir en succé!', quoteStress: 'Mikrofonen packades i sista stund!' },
  'うみ': { emoji: '🏖️', nameSv: 'Strandgästen', cueSv: 'Umi = Hav', quoteHappy: 'Havet och stranden väntar!', quoteStress: 'Badbollen studsar iväg på perrongen!' }
};

export function getMnemonicPersona(
  kanaId: string, 
  kanaChar: string, 
  isWord: boolean, 
  wordData?: { kana: string; romaji: string; meaningSv: string }
): PassengerPersona {
  if (isWord && wordData) {
    const wordMnemonic = WORD_MNEMONIC_MAP[wordData.kana];
    if (wordMnemonic) {
      return {
        id: `word_${wordData.romaji}`,
        name: wordMnemonic.nameSv,
        titleSv: wordMnemonic.cueSv,
        avatar: wordMnemonic.emoji,
        happyQuote: wordMnemonic.quoteHappy,
        stressQuote: wordMnemonic.quoteStress
      };
    }
    return {
      id: `word_${wordData.romaji}`,
      name: `${wordData.meaningSv}-resenären`,
      titleSv: `${wordData.romaji.toUpperCase()} = ${wordData.meaningSv}`,
      avatar: '🧳',
      happyQuote: `Tack! ${wordData.meaningSv} är med på tåget!`,
      stressQuote: `Skynda, tåget avgår mot nästa station!`
    };
  }

  const mnemonic = KANA_MNEMONIC_MAP[kanaId];
  if (mnemonic) {
    return {
      id: `kana_${kanaId}`,
      name: mnemonic.nameSv,
      titleSv: mnemonic.cueSv,
      avatar: mnemonic.emoji,
      happyQuote: mnemonic.quoteHappy,
      stressQuote: mnemonic.quoteStress
    };
  }

  return {
    id: `kana_${kanaId}`,
    name: `Resenär (${kanaId.toUpperCase()})`,
    titleSv: `${kanaId.toUpperCase()} (${kanaChar})`,
    avatar: '🎫',
    happyQuote: 'Tack! Jag hann med tåget!',
    stressQuote: 'Hjälp, dörrarna stängs snart!'
  };
}
