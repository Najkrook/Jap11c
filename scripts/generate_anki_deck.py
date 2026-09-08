import genanki
import json
import csv
import os

VOCABULARY = [
    # ─── Page 32: Greetings (あいさつ) ───
    {
        "japanese": "おはよう。",
        "hiragana": "",
        "romaji": "Ohayoo.",
        "english": "Good morning.",
        "swedish": "God morgon (informell / till vänner)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Informell morgonhälsning. Används mot jämlikar eller vänner.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "おはよう ございます。",
        "hiragana": "",
        "romaji": "Ohayoo gozaimasu.",
        "english": "Good morning. (polite)",
        "swedish": "God morgon (formell / artig)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Artig hälsning till lärare, chefer och personer man inte känner väl.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "こんにちは。",
        "hiragana": "",
        "romaji": "Konnichiwa.",
        "english": "Good afternoon.",
        "swedish": "God dag / Hej",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "OBS! Sista stavelsen stavas med は (ha), men uttalas 'wa'. Allmän dags-hälsning.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "こんばんは。",
        "hiragana": "",
        "romaji": "Konbanwa.",
        "english": "Good evening.",
        "swedish": "God kväll",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "OBS! Sista stavelsen stavas med は (ha), men uttalas 'wa'. Används när det mörknat.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "さようなら。",
        "hiragana": "",
        "romaji": "Sayoonara.",
        "english": "Good-bye.",
        "swedish": "Adjö / Farväl",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Längre avsked (när man inte ska ses på länge).",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "おやすみ（なさい）。",
        "hiragana": "",
        "romaji": "Oyasumi (nasai).",
        "english": "Good night.",
        "swedish": "God natt",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "なさい läggs till för artig form. Beroende på relation kan 'nasai' utelämnas bland vänner.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "ありがとう。",
        "hiragana": "",
        "romaji": "Arigatoo.",
        "english": "Thank you.",
        "swedish": "Tack (informellt)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Informellt tack mellan vänner och familjemedlemmar.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "ありがとう ございます。",
        "hiragana": "",
        "romaji": "Arigatoo gozaimasu.",
        "english": "Thank you. (polite)",
        "swedish": "Tack så mycket (formellt / artigt)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Formell och artig tacksägelse till lärare, främlingar och äldre.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "すみません。",
        "hiragana": "",
        "romaji": "Sumimasen.",
        "english": "Excuse me.; I'm sorry.",
        "swedish": "Ursäkta mig / Förlåt",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Mycket användbart: påkalla uppmärksamhet ('Ursäkta'), be om ursäkt ('Förlåt') eller visa tacksamhet.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "いいえ。",
        "hiragana": "",
        "romaji": "Iie.",
        "english": "No.; Not at all.",
        "swedish": "Nej / Ingen orsak / Det var så lite",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Betyder både 'Nej' och används som svar när någon tackar ('Ingen orsak').",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "いってきます。",
        "hiragana": "",
        "romaji": "Itte kimasu.",
        "english": "I'll go and come back.",
        "swedish": "Jag går nu / Vi ses sen",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Sägs av den person som lämnar hemmet eller kontoret.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "いってらっしゃい。",
        "hiragana": "",
        "romaji": "Itterasshai.",
        "english": "Please go and come back.",
        "swedish": "Hejdå / Ha det så bra (till den som går)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Sägs till den person som just gett sig av hemifrån.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "ただいま。",
        "hiragana": "",
        "romaji": "Tadaima.",
        "english": "I'm home.",
        "swedish": "Jag är hemma!",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Sägs när man kommer hem och kliver in genom dörren.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "おかえり（なさい）。",
        "hiragana": "",
        "romaji": "Okaeri (nasai).",
        "english": "Welcome home.",
        "swedish": "Välkommen hem!",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Svar till den som ropar 'tadaima'. なさい gör det mer artigt.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "いただきます。",
        "hiragana": "",
        "romaji": "Itadakimasu.",
        "english": "Thank you for the meal. (before eating)",
        "swedish": "Tack för maten (före måltiden)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Sägs med händerna ihop innan man börjar äta ('Jag tar ödmjukt emot').",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "ごちそうさま（でした）。",
        "hiragana": "",
        "romaji": "Gochisoosama (deshita).",
        "english": "Thank you for the meal. (after eating)",
        "swedish": "Tack för maten (efter måltiden)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Sägs när man ätit klart. でした läggs till för artig form till kock eller värd.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "はじめまして。",
        "hiragana": "",
        "romaji": "Hajimemashite.",
        "english": "How do you do?",
        "swedish": "Trevligt att träffas (vid första mötet)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Inleder en självpresentation. Sägs uteslutande allra första gången man träffas.",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "〜です。",
        "hiragana": "",
        "romaji": "... desu.",
        "english": "I am ....",
        "swedish": "... är / Jag är ... (kopula)",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Artig kopula (motsvarar 'är'). T.ex. たなかです (Tanaka desu = Jag är Tanaka).",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },
    {
        "japanese": "よろしく おねがいします。",
        "hiragana": "",
        "romaji": "Yoroshiku onegai shimasu.",
        "english": "Nice to meet you.",
        "swedish": "Trevligt att lära känna dig / Ta väl hand om mig",
        "category": "Hälsningar",
        "lesson": "Genki I s. 32",
        "notes": "Avslutar en självpresentation ('Ser fram emot gott samarbete').",
        "tags": ["Genki-I", "Kapitel-0", "Hälsningar"]
    },

    # ─── Page 38: Lesson 1 Core Vocabulary ───
    # School
    {
        "japanese": "だいがく",
        "hiragana": "",
        "romaji": "daigaku",
        "english": "college; university",
        "swedish": "universitet / högskola",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 大学. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },
    {
        "japanese": "こうこう",
        "hiragana": "",
        "romaji": "kookoo",
        "english": "high school",
        "swedish": "gymnasium / gymnasieskola",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 高校. Långa vokaler: kōkō.",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },
    {
        "japanese": "がくせい",
        "hiragana": "",
        "romaji": "gakusee",
        "english": "student",
        "swedish": "student / elev",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 学生. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },
    {
        "japanese": "だいがくせい",
        "hiragana": "",
        "romaji": "daigakusee",
        "english": "college student",
        "swedish": "universitetsstudent",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 大学生. Sammansatt av だいがく (universitet) + せい (student).",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },
    {
        "japanese": "りゅうがくせい",
        "hiragana": "",
        "romaji": "ryuugakusee",
        "english": "international student",
        "swedish": "utbytesstudent / internationell student",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 留学生. Förekommer i dialogen. Yōon: りゅ (ryu).",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },
    {
        "japanese": "せんせい",
        "hiragana": "",
        "romaji": "sensee",
        "english": "teacher; Professor...",
        "swedish": "lärare / professor",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 先生. Används även som tilltalsord och hederstitel efter lärarens efternamn.",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },
    {
        "japanese": "〜ねんせい",
        "hiragana": "",
        "romaji": "... nensee",
        "english": "... year student",
        "swedish": "...-årsstudent / årskurs ...",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 〜年生. Suffix för skolår / årskurs. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },
    {
        "japanese": "いちねんせい",
        "hiragana": "",
        "romaji": "ichinensee",
        "english": "first-year student",
        "swedish": "förstaårsstudent / etta",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 一年生. いち (1) + ねんせい (årskurs).",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },
    {
        "japanese": "せんこう",
        "hiragana": "",
        "romaji": "senkoo",
        "english": "major",
        "swedish": "huvudämne / studieinriktning",
        "category": "Skola",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 専攻. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Skola"]
    },

    # Person
    {
        "japanese": "わたし",
        "hiragana": "",
        "romaji": "watashi",
        "english": "I",
        "swedish": "jag",
        "category": "Människor",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 私. Standardsättet att säga 'jag' på artig japanska.",
        "tags": ["Genki-I", "Kapitel-1", "Människor"]
    },
    {
        "japanese": "ともだち",
        "hiragana": "",
        "romaji": "tomodachi",
        "english": "friend",
        "swedish": "vän / kompis",
        "category": "Människor",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 友達.",
        "tags": ["Genki-I", "Kapitel-1", "Människor"]
    },
    {
        "japanese": "〜さん",
        "hiragana": "",
        "romaji": "... san",
        "english": "Mr./Ms....",
        "swedish": "herr / fru / fröken",
        "category": "Människor",
        "lesson": "Genki I s. 38",
        "notes": "Artighetssuffix efter andras namn (t.ex. Tanaka-san). Sätt ALDRIG efter ditt eget namn!",
        "tags": ["Genki-I", "Kapitel-1", "Människor"]
    },
    {
        "japanese": "〜じん",
        "hiragana": "",
        "romaji": "... jin",
        "english": "... people",
        "swedish": "...-medborgare / person från ...",
        "category": "Människor",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 〜人. Nationalitetssuffix efter ett land (t.ex. にほんじん, アメリカじん). Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Människor"]
    },
    {
        "japanese": "にほんじん",
        "hiragana": "",
        "romaji": "nihonjin",
        "english": "Japanese people",
        "swedish": "japan / japansk person",
        "category": "Människor",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 日本人. にほん (Japan) + じん (person).",
        "tags": ["Genki-I", "Kapitel-1", "Människor"]
    },

    # Time
    {
        "japanese": "いま",
        "hiragana": "",
        "romaji": "ima",
        "english": "now",
        "swedish": "nu",
        "category": "Tid",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 今. Tidpunkt.",
        "tags": ["Genki-I", "Kapitel-1", "Tid"]
    },
    {
        "japanese": "ごぜん",
        "hiragana": "",
        "romaji": "gozen",
        "english": "A.M.",
        "swedish": "förmiddag (f.m. / A.M.)",
        "category": "Tid",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 午前. Placeras före klockslaget (t.ex. ごぜんくじ = kl 9 på morgonen).",
        "tags": ["Genki-I", "Kapitel-1", "Tid"]
    },
    {
        "japanese": "ごご",
        "hiragana": "",
        "romaji": "gogo",
        "english": "P.M.",
        "swedish": "eftermiddag (e.m. / P.M.)",
        "category": "Tid",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 午後. Placeras före klockslaget (t.ex. ごごさんじ = kl 3 på eftermiddagen).",
        "tags": ["Genki-I", "Kapitel-1", "Tid"]
    },
    {
        "japanese": "〜じ",
        "hiragana": "",
        "romaji": "... ji",
        "english": "o'clock",
        "swedish": "klockan ...",
        "category": "Tid",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 〜時. Suffix för hela timmar.",
        "tags": ["Genki-I", "Kapitel-1", "Tid"]
    },
    {
        "japanese": "いちじ",
        "hiragana": "",
        "romaji": "ichiji",
        "english": "one o'clock",
        "swedish": "klockan ett (1:00)",
        "category": "Tid",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 一時. いち (1) + じ (klockan).",
        "tags": ["Genki-I", "Kapitel-1", "Tid"]
    },
    {
        "japanese": "はん",
        "hiragana": "",
        "romaji": "han",
        "english": "half",
        "swedish": "halv (om tid)",
        "category": "Tid",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 半. Placeras efter timmen: [timme] + はん.",
        "tags": ["Genki-I", "Kapitel-1", "Tid"]
    },
    {
        "japanese": "にじはん",
        "hiragana": "",
        "romaji": "niji han",
        "english": "half past two",
        "swedish": "halv tre / 2:30 (ordagrant: två och en halv)",
        "category": "Tid",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 二時半. OBS! På japanska betyder det 2:30 (på svenska säger vi 'halv tre').",
        "tags": ["Genki-I", "Kapitel-1", "Tid"]
    },

    # Others (p. 38)
    {
        "japanese": "にほん",
        "hiragana": "",
        "romaji": "Nihon",
        "english": "Japan",
        "swedish": "Japan",
        "category": "Övrigt",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 日本. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Övrigt"]
    },
    {
        "japanese": "アメリカ",
        "hiragana": "あめりか",
        "romaji": "Amerika",
        "english": "U.S.A.",
        "swedish": "USA / Amerika",
        "category": "Övrigt",
        "lesson": "Genki I s. 38",
        "notes": "Skrivs i Katakana: アメリカ (hiragana-läsning: あめりか).",
        "tags": ["Genki-I", "Kapitel-1", "Övrigt", "Katakana"]
    },
    {
        "japanese": "〜ご",
        "hiragana": "",
        "romaji": "... go",
        "english": "... language",
        "swedish": "...-språk",
        "category": "Övrigt",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 〜語. Suffix för språk. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Övrigt"]
    },
    {
        "japanese": "にほんご",
        "hiragana": "",
        "romaji": "nihongo",
        "english": "Japanese language",
        "swedish": "japanska (språket)",
        "category": "Övrigt",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 日本語. にほん (Japan) + ご (språk).",
        "tags": ["Genki-I", "Kapitel-1", "Övrigt"]
    },
    {
        "japanese": "〜さい",
        "hiragana": "",
        "romaji": "... sai",
        "english": "... years old",
        "swedish": "... år gammal",
        "category": "Övrigt",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 〜歳. Räknesuffix för ålder. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Övrigt"]
    },
    {
        "japanese": "でんわ",
        "hiragana": "",
        "romaji": "denwa",
        "english": "telephone",
        "swedish": "telefon",
        "category": "Övrigt",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 電話.",
        "tags": ["Genki-I", "Kapitel-1", "Övrigt"]
    },
    {
        "japanese": "〜ばん",
        "hiragana": "",
        "romaji": "... ban",
        "english": "number...",
        "swedish": "nummer ...",
        "category": "Övrigt",
        "lesson": "Genki I s. 38",
        "notes": "Kanji: 〜番. Suffix för nummer/ordningsföljd. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-1", "Övrigt"]
    },

    # ─── Page 39: Lesson 1 Continuation ───
    {
        "japanese": "ばんごう",
        "hiragana": "",
        "romaji": "bangoo",
        "english": "number",
        "swedish": "nummer / telefonnummer",
        "category": "Allmänt",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 番号. でんわばんごう = telefonnummer.",
        "tags": ["Genki-I", "Kapitel-1", "Allmänt"]
    },
    {
        "japanese": "なまえ",
        "hiragana": "",
        "romaji": "namae",
        "english": "name",
        "swedish": "namn",
        "category": "Allmänt",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 名前. おなまえ = namn (artig form när man frågar någon).",
        "tags": ["Genki-I", "Kapitel-1", "Allmänt"]
    },
    {
        "japanese": "なん / なに",
        "hiragana": "",
        "romaji": "nan/nani",
        "english": "what",
        "swedish": "vad",
        "category": "Allmänt",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 何.なん används före d/t/n och räknesuffix (t.ex. なんさい); なに annars.",
        "tags": ["Genki-I", "Kapitel-1", "Allmänt"]
    },

    # Expressions (p. 39)
    {
        "japanese": "あのう",
        "hiragana": "",
        "romaji": "anoo",
        "english": "um...",
        "swedish": "öhm... / ursäkta (tvekande)",
        "category": "Uttryck",
        "lesson": "Genki I s. 39",
        "notes": "Förekommer i dialogen. Tvekande ljud för att mjukt fånga någons uppmärksamhet.",
        "tags": ["Genki-I", "Kapitel-1", "Uttryck"]
    },
    {
        "japanese": "はい",
        "hiragana": "",
        "romaji": "hai",
        "english": "yes",
        "swedish": "ja / uppfattat",
        "category": "Uttryck",
        "lesson": "Genki I s. 39",
        "notes": "Formellt och artigt ja.",
        "tags": ["Genki-I", "Kapitel-1", "Uttryck"]
    },
    {
        "japanese": "そうです",
        "hiragana": "",
        "romaji": "soo desu",
        "english": "That's right.",
        "swedish": "Det stämmer / Det är rätt",
        "category": "Uttryck",
        "lesson": "Genki I s. 39",
        "notes": "Bekräftande uttryck.",
        "tags": ["Genki-I", "Kapitel-1", "Uttryck"]
    },
    {
        "japanese": "そうですか",
        "hiragana": "",
        "romaji": "soo desu ka",
        "english": "I see.; Is that so?",
        "swedish": "Jaha / Är det så? / Jag förstår",
        "category": "Uttryck",
        "lesson": "Genki I s. 39",
        "notes": "Förekommer i dialogen. Uttrycker att man tar emot ny information med intresse.",
        "tags": ["Genki-I", "Kapitel-1", "Uttryck"]
    },

    # Additional Vocabulary: Countries (くに)
    {
        "japanese": "イギリス",
        "hiragana": "いぎりす",
        "romaji": "Igirisu",
        "english": "Britain",
        "swedish": "Storbritannien / England",
        "category": "Länder",
        "lesson": "Genki I s. 39",
        "notes": "Katakana (furigana: いぎりす). Kommer från portugisiskans 'inglês'.",
        "tags": ["Genki-I", "Kapitel-1", "Länder", "Katakana"]
    },
    {
        "japanese": "オーストラリア",
        "hiragana": "おおすとらりあ",
        "romaji": "Oosutoraria",
        "english": "Australia",
        "swedish": "Australien",
        "category": "Länder",
        "lesson": "Genki I s. 39",
        "notes": "Katakana med långt streck ー (furigana: おおすとらりあ).",
        "tags": ["Genki-I", "Kapitel-1", "Länder", "Katakana"]
    },
    {
        "japanese": "かんこく",
        "hiragana": "",
        "romaji": "Kankoku",
        "english": "Korea",
        "swedish": "Sydkorea",
        "category": "Länder",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 韓国.",
        "tags": ["Genki-I", "Kapitel-1", "Länder"]
    },
    {
        "japanese": "カナダ",
        "hiragana": "かなだ",
        "romaji": "Kanada",
        "english": "Canada",
        "swedish": "Kanada",
        "category": "Länder",
        "lesson": "Genki I s. 39",
        "notes": "Katakana (furigana: かなだ).",
        "tags": ["Genki-I", "Kapitel-1", "Länder", "Katakana"]
    },
    {
        "japanese": "ちゅうごく",
        "hiragana": "",
        "romaji": "Chuugoku",
        "english": "China",
        "swedish": "Kina",
        "category": "Länder",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 中国. Yōon: ちゅ (chu).",
        "tags": ["Genki-I", "Kapitel-1", "Länder"]
    },
    {
        "japanese": "インド",
        "hiragana": "いんど",
        "romaji": "Indo",
        "english": "India",
        "swedish": "Indien",
        "category": "Länder",
        "lesson": "Genki I s. 39",
        "notes": "Katakana (furigana: いんど).",
        "tags": ["Genki-I", "Kapitel-1", "Länder", "Katakana"]
    },
    {
        "japanese": "エジプト",
        "hiragana": "えじぷと",
        "romaji": "Ejiputo",
        "english": "Egypt",
        "swedish": "Egypten",
        "category": "Länder",
        "lesson": "Genki I s. 39",
        "notes": "Katakana (furigana: えじぷと). Handakuten ぷ.",
        "tags": ["Genki-I", "Kapitel-1", "Länder", "Katakana"]
    },
    {
        "japanese": "フィリピン",
        "hiragana": "ふぃりぴん",
        "romaji": "Firipin",
        "english": "Philippines",
        "swedish": "Filippinerna",
        "category": "Länder",
        "lesson": "Genki I s. 39",
        "notes": "Katakana (furigana: ふぃりぴん). Kombinationsljud: フィ (fi).",
        "tags": ["Genki-I", "Kapitel-1", "Länder", "Katakana"]
    },

    # Additional Vocabulary: Majors (せんこう)
    {
        "japanese": "アジアけんきゅう",
        "hiragana": "あじあけんきゅう",
        "romaji": "ajia kenkyuu",
        "english": "Asian studies",
        "swedish": "Asienstudier",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Katakana アジア (あじあ) + けんきゅう (forskning/studier).",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen"]
    },
    {
        "japanese": "けいざい",
        "hiragana": "",
        "romaji": "keezai",
        "english": "economics",
        "swedish": "ekonomi / nationalekonomi",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 経済.",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen"]
    },
    {
        "japanese": "こうがく",
        "hiragana": "",
        "romaji": "koogaku",
        "english": "engineering",
        "swedish": "ingenjörsvetenskap / teknik",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 工学. Lång vokal: kōgaku.",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen"]
    },
    {
        "japanese": "こくさいかんけい",
        "hiragana": "",
        "romaji": "kokusaikankee",
        "english": "international relations",
        "swedish": "internationella relationer",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 国際関係. こくさい (internationell) + かんけい (relationer).",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen"]
    },
    {
        "japanese": "コンピューター",
        "hiragana": "こんぴゅうたあ",
        "romaji": "konpyuutaa",
        "english": "computer",
        "swedish": "dator / datavetenskap",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Katakana med långa vokaler ー (furigana: こんぴゅうたあ).",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen", "Katakana"]
    },
    {
        "japanese": "せいじ",
        "hiragana": "",
        "romaji": "seeji",
        "english": "politics",
        "swedish": "statsvetenskap / politik",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 政治.",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen"]
    },
    {
        "japanese": "せいぶつがく",
        "hiragana": "",
        "romaji": "seebutsugaku",
        "english": "biology",
        "swedish": "biologi",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 生物学. せいぶつ (levande varelse) + がく (vetenskap).",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen"]
    },
    {
        "japanese": "ビジネス",
        "hiragana": "びじねす",
        "romaji": "bijinesu",
        "english": "business",
        "swedish": "företagsekonomi / affärsverksamhet",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Katakana (furigana: びじねす).",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen", "Katakana"]
    },
    {
        "japanese": "ぶんがく",
        "hiragana": "",
        "romaji": "bungaku",
        "english": "literature",
        "swedish": "litteraturvetenskap / litteratur",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 文学.",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen"]
    },
    {
        "japanese": "れきし",
        "hiragana": "",
        "romaji": "rekishi",
        "english": "history",
        "swedish": "historia",
        "category": "Ämnen",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 歴史.",
        "tags": ["Genki-I", "Kapitel-1", "Ämnen"]
    },

    # Additional Vocabulary: Occupations (しごと) (p. 39)
    {
        "japanese": "いしゃ",
        "hiragana": "",
        "romaji": "isha",
        "english": "doctor",
        "swedish": "läkare",
        "category": "Yrken",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 医者. Yōon: しゃ (sha).",
        "tags": ["Genki-I", "Kapitel-1", "Yrken"]
    },
    {
        "japanese": "かいしゃいん",
        "hiragana": "",
        "romaji": "kaishain",
        "english": "office worker",
        "swedish": "kontorsanställd / företagsanställd",
        "category": "Yrken",
        "lesson": "Genki I s. 39",
        "notes": "Kanji: 会社員. かいしゃ (företag) + いん (anställd).",
        "tags": ["Genki-I", "Kapitel-1", "Yrken"]
    },

    # ─── Page 40: Lesson 1 Continuation ───
    # Occupations (cont.)
    {
        "japanese": "かんごし",
        "hiragana": "",
        "romaji": "kangoshi",
        "english": "nurse",
        "swedish": "sjuksköterska",
        "category": "Yrken",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: 看護師.",
        "tags": ["Genki-I", "Kapitel-1", "Yrken"]
    },
    {
        "japanese": "こうこうせい",
        "hiragana": "",
        "romaji": "kookoosee",
        "english": "high school student",
        "swedish": "gymnasieelev / gymnasiestudent",
        "category": "Yrken",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: 高校生. こうこう (gymnasium) + せい (student).",
        "tags": ["Genki-I", "Kapitel-1", "Yrken"]
    },
    {
        "japanese": "しゅふ",
        "hiragana": "",
        "romaji": "shufu",
        "english": "housewife",
        "swedish": "hemmafru / hemmaman",
        "category": "Yrken",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: 主婦.",
        "tags": ["Genki-I", "Kapitel-1", "Yrken"]
    },
    {
        "japanese": "だいがくいんせい",
        "hiragana": "",
        "romaji": "daigakuinsee",
        "english": "graduate student",
        "swedish": "master-/doktorandstuderande",
        "category": "Yrken",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: 大学院生. だいがくいん (graduate school) + せい (student).",
        "tags": ["Genki-I", "Kapitel-1", "Yrken"]
    },
    {
        "japanese": "べんごし",
        "hiragana": "",
        "romaji": "bengoshi",
        "english": "lawyer",
        "swedish": "jurist / advokat",
        "category": "Yrken",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: 弁護士.",
        "tags": ["Genki-I", "Kapitel-1", "Yrken"]
    },

    # Family (かぞく)
    {
        "japanese": "おかあさん",
        "hiragana": "",
        "romaji": "okaasan",
        "english": "mother",
        "swedish": "mamma / mor (andras eller artig)",
        "category": "Familj",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: お母さん. Artig form som används om andras mamma eller när man ropar på sin egen.",
        "tags": ["Genki-I", "Kapitel-1", "Familj"]
    },
    {
        "japanese": "おとうさん",
        "hiragana": "",
        "romaji": "otoosan",
        "english": "father",
        "swedish": "pappa / far (andras eller artig)",
        "category": "Familj",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: お父さん. Artig form som används om andras pappa eller när man ropar på sin egen.",
        "tags": ["Genki-I", "Kapitel-1", "Familj"]
    },
    {
        "japanese": "おねえさん",
        "hiragana": "",
        "romaji": "oneesan",
        "english": "older sister",
        "swedish": "storasyster (andras eller artig)",
        "category": "Familj",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: お姉さん. Artig form för storasyster.",
        "tags": ["Genki-I", "Kapitel-1", "Familj"]
    },
    {
        "japanese": "おにいさん",
        "hiragana": "",
        "romaji": "oniisan",
        "english": "older brother",
        "swedish": "storebror (andras eller artig)",
        "category": "Familj",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: お兄さん. Artig form för storebror.",
        "tags": ["Genki-I", "Kapitel-1", "Familj"]
    },
    {
        "japanese": "いもうと",
        "hiragana": "",
        "romaji": "imooto",
        "english": "younger sister",
        "swedish": "lillasyster",
        "category": "Familj",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: 妹. Lång vokal: imōto (stavas med う).",
        "tags": ["Genki-I", "Kapitel-1", "Familj"]
    },
    {
        "japanese": "おとうと",
        "hiragana": "",
        "romaji": "otooto",
        "english": "younger brother",
        "swedish": "lillebror",
        "category": "Familj",
        "lesson": "Genki I s. 40",
        "notes": "Kanji: 弟. Lång vokal: otōto (stavas med う).",
        "tags": ["Genki-I", "Kapitel-1", "Familj"]
    },

    # ─── Page 58: Lesson 2 Vocabulary ───
    # Words That Point (こそあど言葉)
    {
        "japanese": "これ",
        "hiragana": "",
        "romaji": "kore",
        "english": "this one",
        "swedish": "den här / detta (nära talaren)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Självständigt pronomen: sak nära den som talar. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "それ",
        "hiragana": "",
        "romaji": "sore",
        "english": "that one",
        "swedish": "den där (nära lyssnaren)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Självständigt pronomen: sak nära den som lyssnar. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "あれ",
        "hiragana": "",
        "romaji": "are",
        "english": "that one (over there)",
        "swedish": "den där borta (långt från båda)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Självständigt pronomen: sak långt från både talare och lyssnare. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "どれ",
        "hiragana": "",
        "romaji": "dore",
        "english": "which one",
        "swedish": "vilken / vilket (av tre eller fler)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Frågepronomen för val bland föremål. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "この",
        "hiragana": "",
        "romaji": "kono",
        "english": "this...",
        "swedish": "den här... / denna... (+ substantiv)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Bestämningsord. Måste följas av substantiv (t.ex. この ほん = den här boken).",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "その",
        "hiragana": "",
        "romaji": "sono",
        "english": "that...",
        "swedish": "den där... (+ substantiv nära lyssnaren)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Bestämningsord. Måste följas av substantiv. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "あの",
        "hiragana": "",
        "romaji": "ano",
        "english": "that... (over there)",
        "swedish": "den där borta... (+ substantiv långt bort)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Bestämningsord. Måste följas av substantiv. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "どの",
        "hiragana": "",
        "romaji": "dono",
        "english": "which...",
        "swedish": "vilken... (+ substantiv)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Frågeord. Måste följas av substantiv (t.ex. どの とけい = vilken klocka).",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "ここ",
        "hiragana": "",
        "romaji": "koko",
        "english": "here",
        "swedish": "här (plats nära talaren)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Platspronomen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "そこ",
        "hiragana": "",
        "romaji": "soko",
        "english": "there",
        "swedish": "där (plats nära lyssnaren)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Platspronomen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "あそこ",
        "hiragana": "",
        "romaji": "asoko",
        "english": "over there",
        "swedish": "där borta (plats långt från båda)",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Platspronomen. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "どこ",
        "hiragana": "",
        "romaji": "doko",
        "english": "where",
        "swedish": "var / vilken plats",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Frågeord för plats. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },
    {
        "japanese": "だれ",
        "hiragana": "",
        "romaji": "dare",
        "english": "who",
        "swedish": "vem",
        "category": "Pekord",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 誰. Frågeord för person. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Pekord"]
    },

    # Food (たべもの)
    {
        "japanese": "おいしい",
        "hiragana": "",
        "romaji": "oishii",
        "english": "delicious",
        "swedish": "god / läcker / välsmakande",
        "category": "Mat",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 美味しい. Ett i-adjektiv. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Mat"]
    },
    {
        "japanese": "さかな",
        "hiragana": "",
        "romaji": "sakana",
        "english": "fish",
        "swedish": "fisk",
        "category": "Mat",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 魚. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Mat"]
    },
    {
        "japanese": "とんかつ",
        "hiragana": "",
        "romaji": "tonkatsu",
        "english": "pork cutlet",
        "swedish": "panerad fläskkotlett (tonkatsu)",
        "category": "Mat",
        "lesson": "Genki I s. 58",
        "notes": "Klassisk japansk maträtt. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Mat"]
    },
    {
        "japanese": "にく",
        "hiragana": "",
        "romaji": "niku",
        "english": "meat",
        "swedish": "kött",
        "category": "Mat",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 肉.",
        "tags": ["Genki-I", "Kapitel-2", "Mat"]
    },
    {
        "japanese": "メニュー",
        "hiragana": "めにゅう",
        "romaji": "menyuu",
        "english": "menu",
        "swedish": "meny",
        "category": "Mat",
        "lesson": "Genki I s. 58",
        "notes": "Katakana (furigana: めにゅう). Lång vokal med ー. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Mat", "Katakana"]
    },
    {
        "japanese": "やさい",
        "hiragana": "",
        "romaji": "yasai",
        "english": "vegetable",
        "swedish": "grönsak / grönsaker",
        "category": "Mat",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 野菜.",
        "tags": ["Genki-I", "Kapitel-2", "Mat"]
    },

    # Things (もの)
    {
        "japanese": "かさ",
        "hiragana": "",
        "romaji": "kasa",
        "english": "umbrella",
        "swedish": "paraply",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 傘.",
        "tags": ["Genki-I", "Kapitel-2", "Saker"]
    },
    {
        "japanese": "かばん",
        "hiragana": "",
        "romaji": "kaban",
        "english": "bag",
        "swedish": "väska",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 鞄.",
        "tags": ["Genki-I", "Kapitel-2", "Saker"]
    },
    {
        "japanese": "くつ",
        "hiragana": "",
        "romaji": "kutsu",
        "english": "shoes",
        "swedish": "skor",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 靴.",
        "tags": ["Genki-I", "Kapitel-2", "Saker"]
    },
    {
        "japanese": "さいふ",
        "hiragana": "",
        "romaji": "saifu",
        "english": "wallet",
        "swedish": "plånbok",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 財布. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Saker"]
    },
    {
        "japanese": "ジーンズ",
        "hiragana": "じいんず",
        "romaji": "jiinzu",
        "english": "jeans",
        "swedish": "jeans",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Katakana (furigana: じいんず). Långt streck ー och dakuten: ジ (ji), ズ (zu).",
        "tags": ["Genki-I", "Kapitel-2", "Saker", "Katakana"]
    },
    {
        "japanese": "じてんしゃ",
        "hiragana": "",
        "romaji": "jitensha",
        "english": "bicycle",
        "swedish": "cykel",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 自転車. Yōon: しゃ (sha).",
        "tags": ["Genki-I", "Kapitel-2", "Saker"]
    },
    {
        "japanese": "しんぶん",
        "hiragana": "",
        "romaji": "shinbun",
        "english": "newspaper",
        "swedish": "tidning / dagstidning",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 新聞.",
        "tags": ["Genki-I", "Kapitel-2", "Saker"]
    },
    {
        "japanese": "スマホ",
        "hiragana": "すまほ",
        "romaji": "sumaho",
        "english": "smartphone; mobile",
        "swedish": "smartphone / mobiltelefon",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Katakana (furigana: すまほ). Kortform av スマートフォン (smart phone).",
        "tags": ["Genki-I", "Kapitel-2", "Saker", "Katakana"]
    },
    {
        "japanese": "Ｔシャツ",
        "hiragana": "てぃいしゃつ",
        "romaji": "tiishatsu",
        "english": "T-shirt",
        "swedish": "T-shirt / t-tröja",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Romaji 'T' + Katakana 'シャツ' (furigana: てぃいしゃつ). Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Saker", "Katakana"]
    },
    {
        "japanese": "とけい",
        "hiragana": "",
        "romaji": "tokee",
        "english": "watch; clock",
        "swedish": "klocka / armbandsur",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Kanji: 時計. Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Saker"]
    },
    {
        "japanese": "ノート",
        "hiragana": "のおと",
        "romaji": "nooto",
        "english": "notebook",
        "swedish": "anteckningsblock / skrivbok",
        "category": "Saker",
        "lesson": "Genki I s. 58",
        "notes": "Katakana med långt streck ー (furigana: のおと). Förekommer i dialogen.",
        "tags": ["Genki-I", "Kapitel-2", "Saker", "Katakana"]
    }
]

CSS = """
.card {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Meiryo", "Noto Sans JP", sans-serif;
  text-align: center;
  background-color: #fdfcfb;
  color: #1a2b4c;
  padding: 28px 20px;
  border-radius: 16px;
  border: 1px solid #e8e3dc;
  box-shadow: 0 4px 16px rgba(26, 43, 76, 0.04);
  max-width: 520px;
  margin: 0 auto;
}

.nightMode .card {
  background-color: #1c1d21;
  color: #f1f5f9;
  border-color: #334155;
}

.badge-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: 9999px;
  background-color: #f1ede7;
  color: #7c6853;
}

.nightMode .badge {
  background-color: #2d3139;
  color: #d1b89d;
}

.badge.lesson-badge {
  background-color: #e0f2fe;
  color: #0369a1;
}

.nightMode .badge.lesson-badge {
  background-color: #1e293b;
  color: #38bdf8;
}

.japanese-display {
  font-size: 46px;
  font-weight: 700;
  line-height: 1.25;
  color: #0f172a;
  margin: 18px 0 10px 0;
  letter-spacing: 0.02em;
}

.nightMode .japanese-display {
  color: #f8fafc;
}

.hiragana-sub {
  font-size: 18px;
  color: #e11d48;
  font-weight: 600;
  margin-bottom: 6px;
}

.romaji-display {
  font-size: 18px;
  color: #64748b;
  font-style: italic;
  margin-bottom: 8px;
}

.nightMode .romaji-display {
  color: #94a3b8;
}

hr#answer {
  border: none;
  border-top: 1.5px dashed #cbd5e1;
  margin: 22px 0 18px 0;
}

.nightMode hr#answer {
  border-top-color: #475569;
}

.meaning-sv {
  font-size: 23px;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 6px;
  line-height: 1.3;
}

.nightMode .meaning-sv {
  color: #60a5fa;
}

.meaning-en {
  font-size: 16px;
  color: #475569;
  margin-bottom: 12px;
}

.nightMode .meaning-en {
  color: #cbd5e1;
}

.prompt-instruction {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 14px;
}

.notes-box {
  margin-top: 18px;
  text-align: left;
  background-color: #f8fafc;
  border-left: 3px solid #3b82f6;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13.5px;
  line-height: 1.45;
  color: #475569;
}

.nightMode .notes-box {
  background-color: #24272f;
  border-left-color: #60a5fa;
  color: #cbd5e1;
}

.notes-box strong {
  color: #1e293b;
}

.nightMode .notes-box strong {
  color: #f1f5f9;
}
"""

def build_apkg():
    MODEL_ID = 1741520194
    DECK_ID = 1741520195

    model = genanki.Model(
        MODEL_ID,
        'Genki I - Tenta Modell (HiraganaSkolan)',
        fields=[
            {'name': 'Japanese'},
            {'name': 'HiraganaReading'},
            {'name': 'Romaji'},
            {'name': 'Swedish'},
            {'name': 'English'},
            {'name': 'Category'},
            {'name': 'Lesson'},
            {'name': 'Notes'},
        ],
        templates=[
            # Card 1: Japanese -> Meaning
            {
                'name': '1. Läsning (Japanska ➔ Svenska)',
                'qfmt': '''
<div class="card">
  <div class="badge-row">
    <span class="badge">{{Category}}</span>
    <span class="badge lesson-badge">{{Lesson}}</span>
  </div>
  <div class="prompt-instruction">Vad betyder detta på svenska?</div>
  <div class="japanese-display">{{Japanese}}</div>
</div>
''',
                'afmt': '''
<div class="card">
  <div class="badge-row">
    <span class="badge">{{Category}}</span>
    <span class="badge lesson-badge">{{Lesson}}</span>
  </div>
  <div class="japanese-display">{{Japanese}}</div>
  {{#HiraganaReading}}<div class="hiragana-sub">Hiragana: {{HiraganaReading}}</div>{{/HiraganaReading}}
  <div class="romaji-display">{{Romaji}}</div>
  
  <hr id="answer">
  
  <div class="meaning-sv">{{Swedish}}</div>
  <div class="meaning-en">{{English}}</div>
  
  {{#Notes}}
  <div class="notes-box">
    <strong>Notis:</strong> {{Notes}}
  </div>
  {{/Notes}}
</div>
''',
            },
            # Card 2: Meaning -> Japanese
            {
                'name': '2. Skrivning (Svenska ➔ Japanska)',
                'qfmt': '''
<div class="card">
  <div class="badge-row">
    <span class="badge">{{Category}}</span>
    <span class="badge lesson-badge">{{Lesson}}</span>
  </div>
  <div class="prompt-instruction">Hur skrivs detta på japanska?</div>
  <div class="meaning-sv" style="font-size: 26px; margin: 16px 0 6px 0;">{{Swedish}}</div>
  <div class="meaning-en">{{English}}</div>
</div>
''',
                'afmt': '''
<div class="card">
  <div class="badge-row">
    <span class="badge">{{Category}}</span>
    <span class="badge lesson-badge">{{Lesson}}</span>
  </div>
  <div class="meaning-sv" style="font-size: 22px;">{{Swedish}}</div>
  <div class="meaning-en">{{English}}</div>
  
  <hr id="answer">
  
  <div class="japanese-display">{{Japanese}}</div>
  {{#HiraganaReading}}<div class="hiragana-sub">Hiragana: {{HiraganaReading}}</div>{{/HiraganaReading}}
  <div class="romaji-display">{{Romaji}}</div>
  
  {{#Notes}}
  <div class="notes-box">
    <strong>Notis:</strong> {{Notes}}
  </div>
  {{/Notes}}
</div>
''',
            }
        ],
        css=CSS
    )

    deck = genanki.Deck(
        DECK_ID,
        'Genki I — Tenta Ordförråd (Kap 0–2)'
    )

    for item in VOCABULARY:
        note = genanki.Note(
            model=model,
            fields=[
                item['japanese'],
                item['hiragana'],
                item['romaji'],
                item['swedish'],
                item['english'],
                item['category'],
                item['lesson'],
                item['notes'],
            ],
            tags=item['tags']
        )
        deck.add_note(note)

    os.makedirs('anki_export', exist_ok=True)

    output_apkg = os.path.join('anki_export', 'Genki_I_Tenta_Ordforrad.apkg')
    genanki.Package(deck).write_to_file(output_apkg)
    print(f"APKG skapad: {output_apkg} ({len(VOCABULARY)} ord, {len(VOCABULARY)*2} kort)")

    # TSV Export
    output_tsv = os.path.join('anki_export', 'Genki_I_Tenta_Ordforrad.tsv')
    with open(output_tsv, 'w', encoding='utf-8', newline='') as f:
        # Anki TSV headers
        f.write("#separator:tab\n")
        f.write("#html:false\n")
        f.write("#tags column:9\n")
        f.write("#columns:Japanese\tHiraganaReading\tRomaji\tSwedish\tEnglish\tCategory\tLesson\tNotes\tTags\n")
        
        writer = csv.writer(f, delimiter='\t')
        for item in VOCABULARY:
            writer.writerow([
                item['japanese'],
                item['hiragana'],
                item['romaji'],
                item['swedish'],
                item['english'],
                item['category'],
                item['lesson'],
                item['notes'],
                " ".join(item['tags'])
            ])
    print(f"TSV skapad: {output_tsv}")

    # JSON Export
    output_json = os.path.join('anki_export', 'Genki_I_Tenta_Ordforrad.json')
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(VOCABULARY, f, ensure_ascii=False, indent=2)
    print(f"JSON skapad: {output_json}")

if __name__ == '__main__':
    build_apkg()
