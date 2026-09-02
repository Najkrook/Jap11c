export interface GairaigoWord {
  id: string;
  katakana: string;
  romaji: string;
  originWord: string;
  originLanguage: string; // 'Engelska' | 'Franska' | 'Tyska' | 'Portugisiska' | 'Nederländska' | 'Svenska / Nordiska'
  originFlag: string; // '🇬🇧' | '🇫🇷' | '🇩🇪' | '🇵🇹' | '🇳🇱' | '🇸🇪'
  meaningSv: string;
  category: 'food' | 'tech_gaming' | 'travel_places' | 'daily_life' | 'pop_culture';
  categoryLabelSv: string;
  difficulty: 'easy' | 'medium' | 'hard';
  clueSv: string;
  funFactSv?: string;
}

export const GAIRAIGO_WORDS: GairaigoWord[] = [
  // ==========================================
  // MAT & DRYCK (FOOD)
  // ==========================================
  {
    id: 'g-koohii',
    katakana: 'コーヒー',
    romaji: 'koohii',
    originWord: 'Koffie',
    originLanguage: 'Nederländska',
    originFlag: '🇳🇱',
    meaningSv: 'Kaffe',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'easy',
    clueSv: 'Morgondryck med koffein som serveras i kopp på café.',
    funFactSv: 'Ordet kom till Japan via holländska handelsmän i Dejima redan på 1700-talet!'
  },
  {
    id: 'g-pan',
    katakana: 'パン',
    romaji: 'pan',
    originWord: 'Pão',
    originLanguage: 'Portugisiska',
    originFlag: '🇵🇹',
    meaningSv: 'Bröd',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'easy',
    clueSv: 'Bakat av mjöl och jäst, äts ofta till frukost.',
    funFactSv: 'Kom med portugisiska missionärer på 1500-talet, långt innan engelskan kom in i språket.'
  },
  {
    id: 'g-keeki',
    katakana: 'ケーキ',
    romaji: 'keeki',
    originWord: 'Cake',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Tårta / Kaka',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'easy',
    clueSv: 'Söt bakelse som serveras på födelsedagar med ljus på.',
    funFactSv: 'Japansk "Shortcake" med jordgubbar och vispgrädde är en ikonisk jultradition i Japan!'
  },
  {
    id: 'g-aisu',
    katakana: 'アイス',
    romaji: 'aisu',
    originWord: 'Ice (cream)',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Glass',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'easy',
    clueSv: 'Kall söt efterrätt som svalkar under varma sommardagar.',
    funFactSv: 'Japaner förkortar ofta "ice cream" till bara "aisu" (アイス).'
  },
  {
    id: 'g-biiru',
    katakana: 'ビール',
    romaji: 'biiru',
    originWord: 'Bier',
    originLanguage: 'Nederländska',
    originFlag: '🇳🇱',
    meaningSv: 'Öl',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'easy',
    clueSv: 'Malt- och humledryck som skummar i glaset.',
    funFactSv: 'Förväxla inte med ビル (biru = byggnad/höghus)! Det långa strecket ー skiljer öl från skyskrapor.'
  },
  {
    id: 'g-piza',
    katakana: 'ピザ',
    romaji: 'piza',
    originWord: 'Pizza',
    originLanguage: 'Italienska',
    originFlag: '🇮🇹',
    meaningSv: 'Pizza',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'easy',
    clueSv: 'Rund ugnsbakad botten med tomatsås, ost och toppings.',
    funFactSv: 'I Japan är pizza med majs och majonnäs extremt populärt!'
  },
  {
    id: 'g-hanbaagaa',
    katakana: 'ハンバーガー',
    romaji: 'hanbaagaa',
    originWord: 'Hamburger',
    originLanguage: 'Engelska',
    originFlag: '🇺🇸',
    meaningSv: 'Hamburgare',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'medium',
    clueSv: 'Biff i bröd från snabbmatsrestauranger.',
    funFactSv: 'Förkortas ofta till "baagaa" (バーガー) eller "Makku" (マック) för McDonald\'s i Tokyo.'
  },
  {
    id: 'g-sarada',
    katakana: 'サラダ',
    romaji: 'sarada',
    originWord: 'Salada',
    originLanguage: 'Portugisiska',
    originFlag: '🇵🇹',
    meaningSv: 'Sallad',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'easy',
    clueSv: 'Grönsaksblandning med dressing som förrätt.',
    funFactSv: 'Kombinationen med sesamdressing (goma-dare) är en japansk favorit.'
  },
  {
    id: 'g-chokoreeto',
    katakana: 'チョコレート',
    romaji: 'chokoreeto',
    originWord: 'Chocolate',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Choklad',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'medium',
    clueSv: 'Sött kakaogodis som ges bort på Alla hjärtans dag.',
    funFactSv: 'I Japan ger kvinnor "Giri-choco" (plikttrohetschoklad) till kollegor på Valentine!'
  },
  {
    id: 'g-supuun',
    katakana: 'スプーン',
    romaji: 'supuun',
    originWord: 'Spoon',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Sked',
    category: 'food',
    categoryLabelSv: 'Mat & Dryck',
    difficulty: 'easy',
    clueSv: 'Bestick med rund skål för soppa och glass.',
    funFactSv: 'Används när man äter japansk curry (Karee raisu).'
  },

  // ==========================================
  // TEKNIK & SPEL (TECH & GAMING)
  // ==========================================
  {
    id: 'g-terebi',
    katakana: 'テレビ',
    romaji: 'terebi',
    originWord: 'Television',
    originLanguage: 'Engelska / Franska',
    originFlag: '🇬🇧',
    meaningSv: 'TV / Television',
    category: 'tech_gaming',
    categoryLabelSv: 'Teknik & Spel',
    difficulty: 'easy',
    clueSv: 'Skärm i vardagsrummet som sänder nyheter, sport och anime.',
    funFactSv: 'Japanerna kapade de sista 6 bokstäverna och skapade ordet "terebi".'
  },
  {
    id: 'g-geemu',
    katakana: 'ゲーム',
    romaji: 'geemu',
    originWord: 'Game',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Spel / TV-spel',
    category: 'tech_gaming',
    categoryLabelSv: 'Teknik & Spel',
    difficulty: 'easy',
    clueSv: 'Interaktiv underhållning med Nintendo, PlayStation eller PC.',
    funFactSv: 'Japanska arkadhallar kallas ofta för "Geemu Sentaa" (ゲームセンター / Game Center).'
  },
  {
    id: 'g-kamera',
    katakana: 'カメラ',
    romaji: 'kamera',
    originWord: 'Camera',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Kamera',
    category: 'tech_gaming',
    categoryLabelSv: 'Teknik & Spel',
    difficulty: 'easy',
    clueSv: 'Optisk apparat för att knäppa fotografier.',
    funFactSv: 'Japan har fött världens största kameramärken som Canon, Nikon och Sony.'
  },
  {
    id: 'g-pasokon',
    katakana: 'パソコン',
    romaji: 'pasokon',
    originWord: 'Personal Computer',
    originLanguage: 'Engelska (wasei-eigo)',
    originFlag: '🇯🇵',
    meaningSv: 'Dator / PC / Laptop',
    category: 'tech_gaming',
    categoryLabelSv: 'Teknik & Spel',
    difficulty: 'medium',
    clueSv: 'Bärbar eller stationär dator för plugg och surf.',
    funFactSv: 'Ett typiskt "wasei-eigo" (japanskt hopkok): Pasokon = PErsonal COMputer!'
  },
  {
    id: 'g-sumaho',
    katakana: 'スマホ',
    romaji: 'sumaho',
    originWord: 'Smartphone',
    originLanguage: 'Engelska (wasei-eigo)',
    originFlag: '🇯🇵',
    meaningSv: 'Smartphone / Mobil',
    category: 'tech_gaming',
    categoryLabelSv: 'Teknik & Spel',
    difficulty: 'medium',
    clueSv: 'Pekskärmstelefon du har i fickan hela dagarna.',
    funFactSv: 'Kortform av Smaatofon (スマートフォン) -> Sumaho (スマホ)!'
  },
  {
    id: 'g-robotto',
    katakana: 'ロボット',
    romaji: 'robotto',
    originWord: 'Robot',
    originLanguage: 'Tjeckiska',
    originFlag: '🇨🇿',
    meaningSv: 'Robot',
    category: 'tech_gaming',
    categoryLabelSv: 'Teknik & Spel',
    difficulty: 'easy',
    clueSv: 'Mekanisk eller automatiserad maskin som utför uppgifter.',
    funFactSv: 'Ordet myntades av författaren Karel Čapek 1920 från tjeckiska "robota" (tvångsarbete).'
  },
  {
    id: 'g-appuri',
    katakana: 'アプリ',
    romaji: 'apuri',
    originWord: 'Application',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'App / Applikation',
    category: 'tech_gaming',
    categoryLabelSv: 'Teknik & Spel',
    difficulty: 'medium',
    clueSv: 'Program du laddar ner till telefonen.',
    funFactSv: 'Kort och koncist: "apuri" istället för hela ordet application.'
  },
  {
    id: 'g-animeshon',
    katakana: 'アニメ',
    romaji: 'anime',
    originWord: 'Animation',
    originLanguage: 'Engelska / Franska',
    originFlag: '🇫🇷',
    meaningSv: 'Anime / Animerad film',
    category: 'tech_gaming',
    categoryLabelSv: 'Teknik & Spel',
    difficulty: 'easy',
    clueSv: 'Japansk tecknad film och serier.',
    funFactSv: 'Globalt känt som ett japanskt ord, men härstammar från västerländskans "animation"!'
  },

  // ==========================================
  // RESOR & PLATSER (TRAVEL & PLACES)
  // ==========================================
  {
    id: 'g-hoteru',
    katakana: 'ホテル',
    romaji: 'hoteru',
    originWord: 'Hotel',
    originLanguage: 'Engelska / Franska',
    originFlag: '🇬🇧',
    meaningSv: 'Hotell',
    category: 'travel_places',
    categoryLabelSv: 'Resor & Platser',
    difficulty: 'easy',
    clueSv: 'Boende med reception där man övernattar på resa.',
    funFactSv: 'I Japan finns unika "Kapuseru Hoteru" (Kapselhotell) för smidig övernattning.'
  },
  {
    id: 'g-takushii',
    katakana: 'タクシー',
    romaji: 'takushii',
    originWord: 'Taxi',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Taxi',
    category: 'travel_places',
    categoryLabelSv: 'Resor & Platser',
    difficulty: 'easy',
    clueSv: 'Bil med taxameter och chaufför som kör dig dit du vill.',
    funFactSv: 'Japanska taxibilar har automatiska dörrar som chauffören öppnar från förarsätet!'
  },
  {
    id: 'g-suweeden',
    katakana: 'スウェーデン',
    romaji: 'suweeden',
    originWord: 'Sweden',
    originLanguage: 'Svenska / Engelska',
    originFlag: '🇸🇪',
    meaningSv: 'Sverige',
    category: 'travel_places',
    categoryLabelSv: 'Resor & Platser',
    difficulty: 'medium',
    clueSv: 'Nordiskt land känt för älgar, fika och norrsken.',
    funFactSv: 'Innehåller den moderna Katakana-kombinationen "ウェ" (we) och långvokalen ー!'
  },
  {
    id: 'g-resutoran',
    katakana: 'レストラン',
    romaji: 'resutoran',
    originWord: 'Restaurant',
    originLanguage: 'Franska',
    originFlag: '🇫🇷',
    meaningSv: 'Restaurang',
    category: 'travel_places',
    categoryLabelSv: 'Resor & Platser',
    difficulty: 'medium',
    clueSv: 'Matställe med meny och servitörer.',
    funFactSv: 'Många japanska restauranger visar plastmodeller av maten (sampuru) i fönstret.'
  },
  {
    id: 'g-depaato',
    katakana: 'デパート',
    romaji: 'depaato',
    originWord: 'Department Store',
    originLanguage: 'Engelska',
    originFlag: '🇺🇸',
    meaningSv: 'Varuhus',
    category: 'travel_places',
    categoryLabelSv: 'Resor & Platser',
    difficulty: 'medium',
    clueSv: 'Stort flerplansvaruhus med mode, kosmetika och delikatesskällare.',
    funFactSv: 'Källarvåningen i ett depaato kallas "Depachika" och är ett matparadis.'
  },
  {
    id: 'g-toire',
    katakana: 'トイレ',
    romaji: 'toire',
    originWord: 'Toilet',
    originLanguage: 'Franska / Engelska',
    originFlag: '🇫🇷',
    meaningSv: 'Toalett / WC',
    category: 'travel_places',
    categoryLabelSv: 'Resor & Platser',
    difficulty: 'easy',
    clueSv: 'Hygienrum du letar efter när nöden kräver.',
    funFactSv: 'Japanska toaletter (Washlet) är världsberömda för uppvärmda sitsar och ljudknappar.'
  },

  // ==========================================
  // VARDAGSLIV & KLÄDER (DAILY LIFE)
  // ==========================================
  {
    id: 'g-shatsu',
    katakana: 'シャツ',
    romaji: 'shatsu',
    originWord: 'Shirt',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Skjorta / T-shirt',
    category: 'daily_life',
    categoryLabelSv: 'Vardagsliv & Kläder',
    difficulty: 'easy',
    clueSv: 'Plagg man bär på överkroppen med knappar eller krage.',
    funFactSv: 'En formell herrskjorta kallas "Waishatsu" (ワイシャツ / White shirt).'
  },
  {
    id: 'g-nooto',
    katakana: 'ノート',
    romaji: 'nooto',
    originWord: 'Notebook',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Anteckningsbok / Häfte',
    category: 'daily_life',
    categoryLabelSv: 'Vardagsliv & Kläder',
    difficulty: 'easy',
    clueSv: 'Häfte med linjerade sidor där du skriver ner dina anteckningar.',
    funFactSv: 'Japanskt skrivpapper och anteckningsböcker (som Campus) hyllas av elever världen över.'
  },
  {
    id: 'g-pen',
    katakana: 'ペン',
    romaji: 'pen',
    originWord: 'Pen',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Penna',
    category: 'daily_life',
    categoryLabelSv: 'Vardagsliv & Kläder',
    difficulty: 'easy',
    clueSv: 'Skrivdon med bläckspets.',
    funFactSv: 'En kulspetspenna kallas på japanska "Boorupen" (ボールペン / Ballpoint pen).'
  },
  {
    id: 'g-jiinzu',
    katakana: 'ジーンズ',
    romaji: 'jiinzu',
    originWord: 'Jeans',
    originLanguage: 'Engelska',
    originFlag: '🇺🇸',
    meaningSv: 'Jeans / Denimbyxor',
    category: 'daily_life',
    categoryLabelSv: 'Vardagsliv & Kläder',
    difficulty: 'easy',
    clueSv: 'Slitstarka blå denimbyxor med nitar och fickor.',
    funFactSv: 'Kojima i Okayama är känt som Japans jeanshuvudstad för premium vintage-denim.'
  },
  {
    id: 'g-beddo',
    katakana: 'ベッド',
    romaji: 'beddo',
    originWord: 'Bed',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Säng',
    category: 'daily_life',
    categoryLabelSv: 'Vardagsliv & Kläder',
    difficulty: 'easy',
    clueSv: 'Västerländsk möbel med madrass att sova i.',
    funFactSv: 'Ställs i kontrast till traditionell japansk "Futon" (布団) som rullas ut på tatamigolv.'
  },
  {
    id: 'g-konbini',
    katakana: 'コンビニ',
    romaji: 'konbini',
    originWord: 'Convenience Store',
    originLanguage: 'Engelska (wasei-eigo)',
    originFlag: '🇯🇵',
    meaningSv: 'Närbutik (t.ex. 7-Eleven, Lawson)',
    category: 'daily_life',
    categoryLabelSv: 'Vardagsliv & Kläder',
    difficulty: 'medium',
    clueSv: 'Dygnet runt-öppen närbutik med onigiri, kaffe och paketuthämtning.',
    funFactSv: 'Konbini är hjärtat i japanskt vardagsliv och finns i nästan varje gatuhörn.'
  },

  // ==========================================
  // POPKULTUR & NÖJE (POP CULTURE)
  // ==========================================
  {
    id: 'g-paatii',
    katakana: 'パーティー',
    romaji: 'paatii',
    originWord: 'Party',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Fest / Party',
    category: 'pop_culture',
    categoryLabelSv: 'Popkultur & Nöje',
    difficulty: 'easy',
    clueSv: 'Festlig tillställning med vänner, musik och snacks.',
    funFactSv: 'Innehåller specialkombinationen ティ (ti) med ett litet ィ!'
  },
  {
    id: 'g-karaoke',
    katakana: 'カラオケ',
    romaji: 'karaoke',
    originWord: 'Kara (tom) + Orchestra',
    originLanguage: 'Japanska + Grekiska/Engelska',
    originFlag: '🇯🇵',
    meaningSv: 'Karaoke',
    category: 'pop_culture',
    categoryLabelSv: 'Popkultur & Nöje',
    difficulty: 'easy',
    clueSv: 'Sjung med i låtar med mikrofon och text på skärmen.',
    funFactSv: 'Skapat av "kara" (空 = tom) och "oke" (kort för orkester) – tom orkester!'
  },
  {
    id: 'g-shoppu',
    katakana: 'ショップ',
    romaji: 'shoppu',
    originWord: 'Shop',
    originLanguage: 'Engelska',
    originFlag: '🇬🇧',
    meaningSv: 'Butik / Affär',
    category: 'pop_culture',
    categoryLabelSv: 'Popkultur & Nöje',
    difficulty: 'easy',
    clueSv: 'Handelsplats för varor och souvenirer.',
    funFactSv: 'Innehåller kombinationen ショ (sho) och en liten sokuon (ッ) för paus!'
  },
  {
    id: 'g-konsaato',
    katakana: 'コンサート',
    romaji: 'konsaato',
    originWord: 'Concert',
    originLanguage: 'Engelska / Italienska',
    originFlag: '🇬🇧',
    meaningSv: 'Konsert',
    category: 'pop_culture',
    categoryLabelSv: 'Popkultur & Nöje',
    difficulty: 'medium',
    clueSv: 'Liveframträdande med ett band eller en sångare inför publik.',
    funFactSv: 'I Japan har publiken synkroniserade ljusstavar (penlight) i artistens färg.'
  }
];
