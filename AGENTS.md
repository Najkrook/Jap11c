# AGENTS.md — HiraganaSkolan

Kortfattad guide för utvecklingsagenter som arbetar i detta repository.

---

## 1. Projektöversikt
**HiraganaSkolan** är en modern, interaktiv webbapp för nybörjare som lär sig japansk Hiragana.
- **Estetik**: Subtilt japanskt skol- och studiebokstema (varma papperstoner `#FDFCFB`, läroboksbläck `#1A2B4C`, minimalistisk stationery-känsla).
- **Inriktning**: Universell och neutral för alla självstuderande och nybörjare (inga specifika universitetsnamn).

---

## 2. Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (skol-/papperspalett `paper`, `ink`, `brand`, `sakura`, `sumi`)
- **Ikoner & Effekter**: `lucide-react`, `canvas-confetti`
- **Ljud & Tal**: Web Audio API (syntetiserade ljudeffekter) + Web Speech Synthesis/Recognition API (`ja-JP`) — *inga externa ljudfiler krävs*.
- **Persistens**: `localStorage` (XP, nivåer, streaks, high-scores, SRS-intervall och checklistor).

---

## 3. Arkitektur & Kärnkomponenter

```
src/
├── data/
│   ├── hiraganaData.ts     # Alla 71+ Hiragana med svenska minnesbilder, streckdata & Genki-ord
│   ├── intensiveData.ts    # 3-dagars bootcamp schema, tidsblock & diagnostiskt prov
│   ├── japc11Vocab.ts      # Genki I ordlista & klassrumsfraser
│   ├── phoneticsGuide.ts   # Svensk-japansk fonetikguide & Minimal Pairs
│   └── badgesData.ts       # Prestationer och utmärkelser
├── modules/
│   ├── audio/              # Web Audio API sfx, talsyntes (ja-JP) och röstigenkänning (useAudio & usePronunciation)
│   ├── progression/        # SM-2 algoritm, XP-beräkning, badges & Firestore sync
│   └── shinkansen/         # Shinkansen Rush spelsimulator & tillståndsmotor
├── context/                # React Contexts (AudioContext, ProgressionContext, MnemonicCoachContext)
└── components/
    ├── exam/               # Hiragana-tenta (85 tecken, romaji-inmatning, auto-advance, diplom/resultat)
    ├── learning/           # Pedagogisk Lärstig (5 i taget + delprov & milstolpar)
    ├── game/               # Game Arcade (Shinkansen Rush)
    ├── srs/                # Spaced Repetition (SuperMemo SM-2 minneskort med 3D-vändning)
    ├── chart/              # 50-Ljudstabell (Gojūon) + karakter-modal med ritbräda
    ├── practice/           # Övningshubb (Flerval, snabbskrivning, handskrift, 60s test)
    ├── pronunciation/      # Uttalslabb med mikrofontest (Web Speech API) & Minimal Pairs
    ├── lund/               # Studieguide (Genki I vokabulär & klassrumsfraser)
    ├── home/               # HeroDashboard med 3-stegs onboarding & framstegsöversikt
    └── layout/             # Navbar (flikväljare, live-XP, streaks, ljuddämpning) & Footer
```

---

## 4. Kärnregler & Riktlinjer
1. **Behåll den universella profilen**: Undvik specifika universitetsreferenser (Lund/SOL/JAPC11) så att appen är ren och delbar.
2. **Subtil design**: Håll designen ren och funktionell med studiebokskänsla — överdriv inte traditionella grafiska element.
3. **Självgående ljud**: Använd alltid `useAudio()` (`playSfx`, `speakJapanese`) och `usePronunciation()` från `src/modules/audio` istället för externa ljudfiler.
4. **Byggverifiering**: Kör alltid `npm run build` (`tsc -b && vite build`) för att säkerställa 0 TypeScript-fel.
5. **Matt Pocock Skills**: När användaren ber om en skill eller kör ett snabbkommando (t.ex. `/wayfinder`, `/improve-codebase-architecture`, `/codebase-design`, `/grill-me`, `/domain-modeling`, `/to-spec`, `/tdd` etc.), ska agenten **ALLTID** läsa in `SKILL.md` från `~/.agents/skills/<namn>/SKILL.md` (Windows: `C:\Users\rooki\.agents\skills\<namn>\SKILL.md`) och följa dess metodik. Se [SKILLS.md](file:///c:/Users/rooki/Documents/antigravity/epic-pascal/SKILLS.md) för komplett katalog och instruktioner.

---

## 5. Kommandon
- **Utvecklingsserver**: `npm run dev`
- **Produktionsbygge**: `npm run build`
- **Förhandsgranskning**: `npm run preview`
