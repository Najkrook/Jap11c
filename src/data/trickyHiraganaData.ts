export interface TrickyCharacter {
  kana: string;
  romaji: string;
  keyFeature: string;
  distinctionSv: string;
  mnemonicSv: string;
}

export interface TrickyGroup {
  id: string;
  title: string;
  nicknameSv: string;
  categoryDescriptionSv: string;
  comparisonTipSv: string;
  characters: TrickyCharacter[];
}

export const TRICKY_HIRAGANA_GROUPS: TrickyGroup[] = [
  {
    id: 're_wa_ne',
    title: 'れ (re) vs わ (wa) vs ね (ne)',
    nicknameSv: 'Knorrvågen & Returen',
    categoryDescriptionSv: 'Den mest kända förväxlingstrion! Alla tre börjar med en rak vänsterstolpe och en vågig högerdel, men slutet avgör allt.',
    comparisonTipSv: 'Titta längst ner till höger: れ sparkar utåt i en retur, わ rundas mjukt inåt som ett hjul, och ね knyter ihop sig i en rund liten ögla.',
    characters: [
      {
        kana: 'れ',
        romaji: 're',
        keyFeature: 'Sparkar utåt',
        distinctionSv: 'Slutar med ett skarpt böjt ben som sparkar utåt åt höger.',
        mnemonicSv: 'Re = Returnera bollen med en spark utåt.'
      },
      {
        kana: 'わ',
        romaji: 'wa',
        keyFeature: 'Rund & öppen',
        distinctionSv: 'Böjer sig runt och mjukt inåt utan knorr, öppen i botten.',
        mnemonicSv: 'Wa = Ett runt hjul på en Wagon (kärra).'
      },
      {
        kana: 'ね',
        romaji: 'ne',
        keyFeature: 'Knorr på svansen',
        distinctionSv: 'Avslutas med en tydlig liten rund ögla/knorr längst ner.',
        mnemonicSv: 'Ne = Neko (katt) med knorr på svansen.'
      }
    ]
  },
  {
    id: 'me_nu',
    title: 'め (me) vs ぬ (nu)',
    nicknameSv: 'Nudeln & Ögat',
    categoryDescriptionSv: 'Båda har en korsande svepande oval form. Endast en liten ögla skiljer dem åt!',
    comparisonTipSv: 'め är helt slät utan knorr (tänk ett öga). ぬ har en liten rund knorr i slutet av det andra svepet (en nudel med knut).',
    characters: [
      {
        kana: 'め',
        romaji: 'me',
        keyFeature: 'Slät oval, ingen knorr',
        distinctionSv: 'Enkel svepande båge som korsar och avslutas rakt och mjukt.',
        mnemonicSv: 'Me = "Me" betyder öga på japanska. Ett slätt öga utan knorrar.'
      },
      {
        kana: 'ぬ',
        romaji: 'nu',
        keyFeature: 'Knorr i botten',
        distinctionSv: 'Har en liten rund ögla/knut i slutet av det högra svepet.',
        mnemonicSv: 'Nu = Nudlar som trasslat ihop sig med en knorr på änden.'
      }
    ]
  },
  {
    id: 'ru_ro',
    title: 'る (ru) vs ろ (ro)',
    nicknameSv: 'Rubinen & Rånaren',
    categoryDescriptionSv: 'De delar exakt samma 3-liknande form – men den ena har sparat sin skatt.',
    comparisonTipSv: 'る har en rund ögla längst ner (innehåller en rubin). ろ saknar ögla och är öppen (någon har rånat den på rubinen).',
    characters: [
      {
        kana: 'る',
        romaji: 'ru',
        keyFeature: 'Sluten ögla',
        distinctionSv: 'Avslutas med en rund, inbunden ögla i basen.',
        mnemonicSv: 'Ru = Gömmer en gnistrande Rubin (Ruby) i öglan.'
      },
      {
        kana: 'ろ',
        romaji: 'ro',
        keyFeature: 'Öppen båge',
        distinctionSv: 'Helt öppen båge i botten utan ögla eller knorr.',
        mnemonicSv: 'Ro = Robbed! Någon rånade bort rubinen så öglan saknas.'
      }
    ]
  },
  {
    id: 'a_o',
    title: 'あ (a) vs お (o)',
    nicknameSv: 'Äpplet & Toppen',
    categoryDescriptionSv: 'Båda har korsande linjer och runda öglor, men uppbyggnaden och prickarna är helt olika.',
    comparisonTipSv: 'あ har ett centralt kors med en stor rund öglekropp i mitten. お har ett takstreck, ett böjt drag nedåt med bottenögla OCH en separat prick uppe till höger.',
    characters: [
      {
        kana: 'あ',
        romaji: 'a',
        keyFeature: 'Kors i mitten + rund mage',
        distinctionSv: 'Horisontellt streck skärs av vertikal båge, omgiven av en stor loop.',
        mnemonicSv: 'A = Ett runt äpple (Apple) med skaft och kärnhus.'
      },
      {
        kana: 'お',
        romaji: 'o',
        keyFeature: 'Tak + ögla + separat prick',
        distinctionSv: 'Horisontellt tak överst, ögla i botten och en separat droppe uppe till höger.',
        mnemonicSv: 'O = En golfspelare som slår bollen: "On the green" med bollen i luften.'
      }
    ]
  },
  {
    id: 'ki_sa_chi',
    title: 'き (ki) vs さ (sa) vs ち (chi)',
    nicknameSv: 'Nyckeln, Saxen & Cheerleadern',
    categoryDescriptionSv: 'Dessa tre blandas lätt ihop på grund av sina tvärstreck och böjda underdelar.',
    comparisonTipSv: 'Räkna tvärstrecken! き har 2 tvärstreck. さ har 1 tvärstreck och böjer sig åt vänster. ち är spegelvänd mot さ med magen åt höger (som en 5:a).',
    characters: [
      {
        kana: 'き',
        romaji: 'ki',
        keyFeature: 'TVÅ tvärstreck',
        distinctionSv: 'Har två parallella horisontella streck och en böjd fot.',
        mnemonicSv: 'Ki = En gammaldags nyckel (Key) med 2 skåror.'
      },
      {
        kana: 'さ',
        romaji: 'sa',
        keyFeature: 'ETT tvärstreck (vänsterböj)',
        distinctionSv: 'Har endast ett horisontellt streck, foten böjer åt vänster.',
        mnemonicSv: 'Sa = Samuraj med ett vass svärd (eller sax med 1 tvärsnitt).'
      },
      {
        kana: 'ち',
        romaji: 'chi',
        keyFeature: 'Spegelvänd 5:a (högerbåge)',
        distinctionSv: 'Ett takstreck med ett korsande drag som bildar en rund mage åt höger.',
        mnemonicSv: 'Chi = En glad Cheerleader med tofs och rund mage (eller siffran 5).'
      }
    ]
  },
  {
    id: 'ha_ho_ma',
    title: 'は (ha) vs ほ (ho) vs ま (ma)',
    nicknameSv: 'Stolparna & Masten',
    categoryDescriptionSv: 'Alla tre har öglor i botten och horisontella streck, men stolpen och toppen avgör vilket tecken det är.',
    comparisonTipSv: 'Har tecknet en vänsterstolpe? は och ほ har stolpe; ま saknar stolpe helt! Sticker mittstrecket upp över taket? På ま sticker det upp, på ほ är taket slutet.',
    characters: [
      {
        kana: 'は',
        romaji: 'ha',
        keyFeature: 'Vänsterstolpe + 1 tvärstreck',
        distinctionSv: 'Vänsterstolpe med ett horisontellt streck och bottenögla till höger.',
        mnemonicSv: 'Ha = En vandrare med stav och en hatt (Ha-tt).'
      },
      {
        kana: 'ほ',
        romaji: 'ho',
        keyFeature: 'Vänsterstolpe + 2 streck under tak',
        distinctionSv: 'Vänsterstolpe + takstreck och ett extra horisontellt streck. Vertikala linjen sticker INTE upp genom taket.',
        mnemonicSv: 'Ho = En Hot dog med tak och stolpe.'
      },
      {
        kana: 'ま',
        romaji: 'ma',
        keyFeature: 'INGEN vänsterstolpe (streck sticker upp)',
        distinctionSv: 'Ingen vänsterstolpe alls! Två tvärstreck där mittlinjen bryter igenom översta taket.',
        mnemonicSv: 'Ma = En segelbåts mast (Mast) som reser sig rakt upp.'
      }
    ]
  },
  {
    id: 'su_mu',
    title: 'す (su) vs む (mu)',
    nicknameSv: 'Snaran & Komulen',
    categoryDescriptionSv: 'Båda har en horisontell topp och en ögla, men komplexiteten och prickarna skiljer dem åt.',
    comparisonTipSv: 'す är enkel och smal med en central hängande ögla. む är bredare med en bottenkrök, en rund ögla och en lös prick/horn uppe till höger.',
    characters: [
      {
        kana: 'す',
        romaji: 'su',
        keyFeature: 'Smal spiralögla, inga prickar',
        distinctionSv: 'Horisontell linje med en vertikal snodd som bildar en ögla mitt i svepet.',
        mnemonicSv: 'Su = En superloop på en bergochdalbana.'
      },
      {
        kana: 'む',
        romaji: 'mu',
        keyFeature: 'Bred mule + ögla + hornprick',
        distinctionSv: 'Vågrät linje, böj till en ögla i botten och ett separat streck uppe till höger.',
        mnemonicSv: 'Mu = En ko som säger Mu-u! (pricken är kons horn).'
      }
    ]
  },
  {
    id: 'i_ri',
    title: 'い (i) vs り (ri)',
    nicknameSv: 'Parallellbågarna',
    categoryDescriptionSv: 'Två parallella linjer bredvid varandra. Längden och hakarna avslöjar vem som är vem.',
    comparisonTipSv: 'い har en längre vänsterlinje med en liten krok uppåt. り har en kort vänsterlinje och en MYCKET längre högerlinje som sveper nedåt.',
    characters: [
      {
        kana: 'い',
        romaji: 'i',
        keyFeature: 'Vänster är längst (med hake)',
        distinctionSv: 'Vänstra bågen är längst och avslutas med en liten hake uppåt.',
        mnemonicSv: 'I = Två ålar (eels) som simmar bredvid varandra.'
      },
      {
        kana: 'り',
        romaji: 'ri',
        keyFeature: 'Höger är mycket längst',
        distinctionSv: 'Vänster är kort, högra linjen sveper långt nedåt som en flod.',
        mnemonicSv: 'Ri = En flod (River) som rinner djupt på höger sida.'
      }
    ]
  },
  {
    id: 'ta_na',
    title: 'た (ta) vs な (na)',
    nicknameSv: 'T-Korset',
    categoryDescriptionSv: 'Båda inleds med ett litet T-liknande kors på vänster sida, men högersidan är helt annorlunda.',
    comparisonTipSv: 'た har tecknet こ (ko) inuti till höger. な har en separat droppe uppe till höger och ett korsande drag med en knorr nedtill.',
    characters: [
      {
        kana: 'た',
        romaji: 'ta',
        keyFeature: 'T-kors + tecknet こ',
        distinctionSv: 'Vänster T-kors kombinerat med två horisontella parallella streck till höger.',
        mnemonicSv: 'Ta = En Taco! T till vänster och fyllning till höger.'
      },
      {
        kana: 'な',
        romaji: 'na',
        keyFeature: 'T-kors + lös droppe + knorr',
        distinctionSv: 'Vänster T-kors följt av en separat prick och en vertikal knorrögla.',
        mnemonicSv: 'Na = En nunna som ber med ett radband och knorr.'
      }
    ]
  },
  {
    id: 'ke_ni_ha',
    title: 'け (ke) vs に (ni) vs は (ha)',
    nicknameSv: 'Vänsterstolparna',
    categoryDescriptionSv: 'Alla tre har en rak vertikal vänsterstolpe, men vad som händer till höger skiljer dem åt.',
    comparisonTipSv: 'け har ett lodrätt streck som böjer av åt vänster. に har två horisontella streck (tecknet こ). は har ett streck med sluten ögla.',
    characters: [
      {
        kana: 'け',
        romaji: 'ke',
        keyFeature: 'Vänsterstolpe + böjd svans',
        distinctionSv: 'Vänsterstolpe med en böjd högerlinje som har en svepande fot.',
        mnemonicSv: 'Ke = Ett ölfat (Keg) med en tappkran.'
      },
      {
        kana: 'に',
        romaji: 'ni',
        keyFeature: 'Vänsterstolpe + två horisontella',
        distinctionSv: 'Vänsterstolpe med tecknet こ (två vågräta streck) till höger.',
        mnemonicSv: 'Ni = Knä (Knee) med två plåster bredvid varandra (ni = 2 på japanska).'
      },
      {
        kana: 'は',
        romaji: 'ha',
        keyFeature: 'Vänsterstolpe + sluten ögla',
        distinctionSv: 'Vänsterstolpe med en rund sluten ögla till höger.',
        mnemonicSv: 'Ha = En man med stav och hatt.'
      }
    ]
  },
  {
    id: 'ra_chi_ro',
    title: 'ら (ra) vs ち (chi) vs ろ (ro)',
    nicknameSv: 'Bågarna & Kaninen',
    categoryDescriptionSv: 'Dessa tecken delar en svepande C- eller 3-form, men taket och kopplingarna skiljer dem.',
    comparisonTipSv: 'ら har en separat droppe svävande över en böjd båge. ち har ett horisontellt tak som skärs av mittlinjen. ろ har inga lösa tak utan är en sammanhängande 3-form.',
    characters: [
      {
        kana: 'ら',
        romaji: 'ra',
        keyFeature: 'Fristående takdroppe över båge',
        distinctionSv: 'En kort diagonal topp-droppe över en öppen rundad båge.',
        mnemonicSv: 'Ra = En snabb kanin (Rabbit) med upprätt öra.'
      },
      {
        kana: 'ち',
        romaji: 'chi',
        keyFeature: 'Korsat tak med mage',
        distinctionSv: 'Ett horisontellt tak som skärs igenom till en 5-form.',
        mnemonicSv: 'Chi = Cheerleader som kastar takstrecket i luften.'
      },
      {
        kana: 'ろ',
        romaji: 'ro',
        keyFeature: 'Hel sammanhängande 3-form',
        distinctionSv: 'Ett enda svepande drag som bildar en öppen siffra 3.',
        mnemonicSv: 'Ro = En slingrande väg (Road) utan avbrott.'
      }
    ]
  }
];

export interface TrickyQuestion {
  id: string;
  type: 'kana_to_romaji' | 'romaji_to_kana';
  targetKana: string;
  targetRomaji: string;
  options: string[];
  correctOption: string;
  groupId: string;
  groupTitle: string;
  distinctionTip: string;
  keyFeature: string;
  mnemonic: string;
}

/**
 * Generate a single tricky question.
 * Crucial pedagogical rule: The false options MUST come strictly from the SAME lookalike group!
 */
export function generateTrickyQuestion(options?: {
  excludeGroupId?: string;
  type?: 'kana_to_romaji' | 'romaji_to_kana';
}): TrickyQuestion {
  let eligibleGroups = TRICKY_HIRAGANA_GROUPS;
  if (options?.excludeGroupId && eligibleGroups.length > 1) {
    eligibleGroups = eligibleGroups.filter(g => g.id !== options.excludeGroupId);
  }

  const group = eligibleGroups[Math.floor(Math.random() * eligibleGroups.length)];
  const targetChar = group.characters[Math.floor(Math.random() * group.characters.length)];

  // Pick question type
  const type: 'kana_to_romaji' | 'romaji_to_kana' = 
    options?.type || (Math.random() > 0.5 ? 'kana_to_romaji' : 'romaji_to_kana');

  if (type === 'kana_to_romaji') {
    // Show Kana, ask for Romaji among group lookalikes
    const choiceOptions = [...group.characters.map(c => c.romaji)].sort(() => Math.random() - 0.5);
    return {
      id: `${group.id}-${targetChar.kana}-${Date.now()}-${Math.random()}`,
      type,
      targetKana: targetChar.kana,
      targetRomaji: targetChar.romaji,
      options: choiceOptions,
      correctOption: targetChar.romaji,
      groupId: group.id,
      groupTitle: group.title,
      distinctionTip: targetChar.distinctionSv,
      keyFeature: targetChar.keyFeature,
      mnemonic: targetChar.mnemonicSv
    };
  } else {
    // Show Romaji, ask for Kana among group lookalikes
    const choiceOptions = [...group.characters.map(c => c.kana)].sort(() => Math.random() - 0.5);
    return {
      id: `${group.id}-${targetChar.romaji}-${Date.now()}-${Math.random()}`,
      type,
      targetKana: targetChar.kana,
      targetRomaji: targetChar.romaji,
      options: choiceOptions,
      correctOption: targetChar.kana,
      groupId: group.id,
      groupTitle: group.title,
      distinctionTip: targetChar.distinctionSv,
      keyFeature: targetChar.keyFeature,
      mnemonic: targetChar.mnemonicSv
    };
  }
}

/**
 * Generate a randomized quiz session with specified number of questions
 */
export function generateTrickyQuizSession(questionCount: number = 10): TrickyQuestion[] {
  const session: TrickyQuestion[] = [];
  let lastGroupId = '';

  for (let i = 0; i < questionCount; i++) {
    const q = generateTrickyQuestion({ excludeGroupId: lastGroupId });
    lastGroupId = q.groupId;
    session.push(q);
  }

  return session;
}
