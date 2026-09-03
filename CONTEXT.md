# CONTEXT.md — HiraganaSkolan Domain Glossary

Detta dokument definierar domänterminologin för HiraganaSkolan och fungerar som vägledning för arkitektur, moduler och namngivning.

---

## Domäntermer & Moduler

### 1. Progression (ProgressionModule)
Den centrala domänmodulen som ansvarar för användarens långsiktiga framsteg, erfarenhetspoäng (XP), nivåberäkning, dagliga streaks, SuperMemo SM-2 repetitioner, ordförrådsframsteg (Anki Deck progress) och automatisk utdelning av utmärkelser (Badges).
- **Interface**: Presenterar enhetliga metoder som `recordActivity(activity)`, `getStats()`, `getDueCards()`, `getSummary()`, `subscribe(listener)`, `getAnkiProgress(mode)`.
- **Seams**: 
  - *Persistens-seam*: `StorageAdapter` (med `LocalStorageAdapter` i produktion och `InMemoryStorageAdapter` i test).
  - *UI-seam*: `ProgressionProvider` och `useProgression()` i React.

### 2. Spaced Repetition (SRS)
Algoritmisk minnesrepetition baserad på SuperMemo SM-2.
- **SrsRating**: Kvalitetsbetyg (`again`, `hard`, `good`, `easy`).
- **SrsItemData**: Tillstånd för ett tecken med `easeFactor`, `interval`, `repetitions`, `nextReviewDate`, `status` (`new` | `learning` | `review` | `mastered`).
- **DueCards**: Tecken vars `nextReviewDate` har passerat eller som har status `new`.

### 3. Daglig Streak (Daily Streak)
Beräkning av antal konsekutiva studiedagar.
- Beräknas med lokal tidszon och kalenderdatum (`YYYY-MM-DD`).
- Inkrementeras vid första aktiviteten en ny dag efter föregående dag.
- Nollställs om mer än 1 kalenderdag passerat sedan senaste aktivitet.

### 4. Erfarenhet & Nivå (XP & Level)
- Formel: $\text{Nivå} = \lfloor\sqrt{\text{XP} / 50}\rfloor + 1$.
- Tröskel för nivå $L$: $XP(L) = (L - 1)^2 \times 50$.

### 5. Utmärkelser (Badges)
Prestationer som låses upp automatiskt av `BadgeEngine` vid händelser i systemet (t.ex. `first_five`, `streak_3`, `game_master_1000`, `combo_king`, `dakuten_pro`, `voice_virtuoso`, `speed_demon`, `lund_ready`).

### 6. Kana & Lärstig (Kana & Learning Path)
- **Gojūon (50-ljudstabellen)**: Grundläggande 46 tecken (Vokaler till N).
- **Dakuon / Handakuten**: Röstade tecken med citattecken (゛) eller ring (゜).
- **Yōon**: Kombinationsljud (t.ex. `kya`, `shu`, `cho`).
- **LearningChapter**: Strukturerad lektionsenhet (5 tecken i taget) med studie-, prov- och resultatfas.

### 7. Ljud & Röst (AudioSpeechModule)
En hårdvaruoberoende modul för proceduriella ljudeffekter (SFX), talsyntes (TTS) och röstigenkänning (STT).
- **SfxEffect**: Syntetiserade ljudeffekter genererade on-the-fly via Web Audio API oscillatorer och envelope-filter (`click`, `correct`, `catch`, `wrong`, `miss`, `levelUp`, `gameOver`, `trainChime`, `trainWhistle`, `doorChime`, `doorPneumatic`, `swordSlash`, `magicCast`, `monsterHit`, `coin`, `heal`). Inga externa MP3/WAV-filer krävs.
- **Dynamic Pitch Escalation**: Korrekta svar / fångster skalar frekvensen progressivt med användarens combo-streak.
- **SpeechSynthesis (TTS)**: Web Speech API för naturligt japanskt modersmålsuttal (`ja-JP`) med asynkron röstvalsprioritering och timeout-vakt.
- **PhoneticMatcher**: Algoritm för förlåtande matchning av användarens tal mot förväntade Kana/Romaji med Hepburn/Kunrei-normalisering, Katakana-Hiragana-konvertering och borttagning av interpunktion.
- **SpeechRecognition (STT)**: Promise-baserad mikrofoninspelning och bedömning med diskriminerade feltyper (`permission_denied`, `no_speech`, `network_error`, `timeout`, `unsupported`).
- **Seams**:
  - *Hårdvaru-seam*: `AudioSpeechPort` (med `WebAudioSpeechAdapter` i produktion och `MockAudioSpeechAdapter` i test).
  - *UI-seam*: `AudioProvider`, `useAudio()` och `usePronunciation()` i React.

### 8. Frågemotor & Förväxlingsanalys (KanaQuizModule)
En UI-agnostisk domänmodul för att generera pedagogiska flervalsfrågor, diagnostiska delprov och distraktorer.
- **ConfuserMatrix**: Samlad relationskatalog över visuellt och fonetiskt snarlika tecken för både Hiragana och Katakana (t.ex. `あ/お`, `ね/れ/わ`, `さ/き`, `シ/ツ`, `ソ/ン`, `ク/ワ`, `ヌ/ス`).
- **DistractorHeuristics**: Prioriterar tecken från samma kapitel, därefter direkta lookalikes, och fyller ut med säkra slumpval så att eleven inte kan gissa genom uteslutningsmetoden.
- **QuestionTypes**: `kana-to-romaji`, `audio-to-kana`, `romaji-to-kana`, `word-meaning`.
- **Interface**:
  - `generateQuizSession(config)`
  - `getSmartDistractors(target, options)`
  - `getLookalikes(kanaId)`


