# HiraganaSkolan 🎌

En modern, interaktiv och pedagogisk webbapplikation för att snabbt och effektivt bemästra japansk Hiragana.

---

## ✨ Funktioner

- 📅 **3-Dagars Intensivkurs (Bootcamp)**: Strukturerat dag-för-dag-schema med delmål och diagnostiskt slutprov.
- 🗂️ **50-Ljudstabell (Gojūon)**: Komplett interaktiv tabell med ljuduttal, streckordning (stroke order) och integrerad ritbräda för handskriftsövning.
- 🧠 **Spaced Repetition (SRS)**: SuperMemo SM-2-algoritm med 3D-vändbara flashcards för optimal långtidsinlärning.
- 🎮 **Game Arcade**:
  - **Shinkansen Rush**: Snabbt arkadspel mot klockan längs Shinkansen-linjen.
  - **Dojo Roguelike**: Välj powerups och klara bossar.
  - **Basket Drop**: Fånga fallande kana i rätt korg.
- 🎯 **Övningshubb**: Flervalsfrågor, snabbskrivning, handskriftigenkänning och 60-sekunders kana-rush.
- 🎙️ **Uttalslabb & Minimal Pairs**: Rösttest med Web Speech API för att öva på subtila ljudskillnader (t.ex. långa vokaler, sokuon).
- 🏆 **Gamification**: XP-system, nivåer, streak-räknare och prestationsmärken (Badges).
- 📷 **Egna kort från foto**: Läs japansk text lokalt på enheten, välj ord och spara dem för repetition. Stöd för vågrät och lodrät text samt inklistring från iPhone Live Text.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Ikoner**: Lucide React
- **Ljud**: Web Audio API (syntetiserat) & Web Speech Synthesis/Recognition API

---

## 🚀 Kom igång

### Förutsättningar
- [Node.js](https://nodejs.org/) (v18 eller senare rekommenderas)
- `npm`

### Installation & Körning

```bash
# 1. Klona repot
git clone https://github.com/Najkrook/Jap11c.git
cd Jap11c

# 2. Installera beroenden
npm install

# 3. Starta utvecklingsservern
npm run dev

# 4. Bygg för produktion
npm run build
```

## Skanna och skapa flashkort

Öppna **Flashcards → Skanna / Lägg till ord**. Välj **Ta foto** eller **Välj bild**, och ställ in om texten är vågrät eller lodrät. Fotografera ett ord eller några skarpa rader nära kameran. Granska den avlästa texten, välj ett ord (eller markera en fras), kontrollera betydelsen och tryck **Spara kort**. Bildens övriga ord finns kvar så att du kan skapa flera kort.

På iPhone kan du också kopiera text från ett foto i Bilder med Live Text och klistra in den i ordfältet. Om ett HEIC-foto inte kan öppnas i webbläsaren, välj en skärmbild eller JPEG/PNG. Bilder över 25 MB avvisas; OCR-bilden skalas till högst 2400 pixlar på längsta sidan. Svårläst handstil, furigana, roterad text och täta mangasidor kan behöva ett närmare utsnitt och manuell rättning.

OCR körs med Tesseract.js i en Web Worker. Bilden skickas inte till en OCR-tjänst och inga betalda API:er används. Worker, WASM och japanska språkmodeller laddas från samma webbplats som appen när de behövs. Första avläsningen kräver anslutning för att hämta dessa filer; full offline-funktion garanteras inte. Ord slås upp i appens befintliga ordlistor, som innehåller både svenska och engelska betydelser. Saknas ordet fyller användaren själv i betydelse och eventuell läsning; ingen automatisk översättningstjänst anropas.

`predev` och `prebuild` kopierar OCR-filer från npm-paketen till den ignorerade katalogen `public/ocr/`. Kör alltid `npm run build` före publicering, och publicera hela `dist/` inklusive `ocr/`. Ingen serverfunktion eller API-nyckel behövs. Licenser och källor för OCR finns i [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Regressionskontroll: `npm run test`. Manuell kontroll: välj en bild med kända japanska ord, skapa ett kort, ladda om sidan och öppna kortet under **Mina Skannade Ord**. Kontrollera även avbrytning, okända ord och lodrät text. Verifiering på fysisk iPhone behövs för kameraväljare, HEIC och tangentbordets beteende.
