# Project: HiraganaSkolan Anki SRS Hub & Study Session Redesign

## Architecture
- **Framework**: React 18 + TypeScript + Vite + Tailwind CSS
- **Routing**: SPA routing via React Router (`/anki` routes to `AnkiHub.tsx`)
- **State & Progression**:
  - `ProgressionContext.tsx` & `ProgressionServiceImpl.ts`: Manages `stats.ankiProgress`, `stats.ankiCardProgress`, `dueAnkiCards`, `weakAnkiCards`, and bookmarks in `localStorage` (`'hiraganaskolan_user_stats_v2'`).
  - SM-2 Spaced Repetition engine with ease factors `[1.3, 3.0]`, interval scaling, and 10-minute lapse re-queues.
- **Audio Engine**: Native Web Audio API (`playSfx`) & Web Speech Synthesis API (`speakJapanese` with `ja-JP`), strictly zero external audio files.
- **Visual Design**: Subtle Japanese paper stationery aesthetic (`paper`, `ink`, `brand`, `sakura`, `sumi`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | 6-Arc Immersion Progression | Partition 208 Tae Kim chapters (2,075 cards) into 6 logical arcs (0 gaps, 0 overlaps) with badges, progress bars, and descriptions | M1 | ORIGINAL_REQUEST §R2 |
| 2 | Categorized Deck Selector | Group 9 deck modes into 5 intuitive categories (`immersion`, `repetition`, `exam`, `music`, `travel`) | M1 | ORIGINAL_REQUEST §R2 |
| 3 | 1-Click Due Review Action | Prominent Hero SRS Banner at top of AnkiHub triggering instant due review in 1 click | M1 | ORIGINAL_REQUEST §R2 |
| 4 | Collapsible Arc Accordions | Accordion UI for 6 arcs with auto-expansion of active arc, search/filter support, and "Öppna alla / Stäng alla" | M1 | ORIGINAL_REQUEST §R2 |
| 5 | Viewport-Contained Canvas | Fixed full-viewport canvas (`fixed inset-0 z-40 h-[100dvh] overflow-hidden`) with body scroll lock | M2 | ORIGINAL_REQUEST §R1 |
| 6 | Adaptive Media Sizing | Responsive 16:9 media frame constrained to `max-h-[22vh]` (mobile) and `max-h-[32vh]` (desktop) | M2 | ORIGINAL_REQUEST §R1 |
| 7 | Permanently Visible Rating Bar | Single-row 4-column rating buttons (`Again`, `Hard`, `Good`, `Easy`) pinned at bottom (`shrink-0`) on mobile & desktop | M2 | ORIGINAL_REQUEST §R1 |
| 8 | Compact Unified Study Header | Single 52px header with breadcrumbs, compact mode buttons, controls, and 4px integrated linear progress bar | M2 | ORIGINAL_REQUEST §R1 |
| 9 | Inline Audio Replay & Wave | Audio replay with animated equalizer sound wave indicator and 'R' keyboard trigger | M2 | ORIGINAL_REQUEST §R3 |
| 10 | Independent Furigana Toggle | Reading toggle (`showFurigana` + 'F' shortcut) for active recall testing before checking pronunciation | M2 | ORIGINAL_REQUEST §R3 |
| 11 | Rapid Keyboard Study Controls | Space to reveal, 1-4 for ratings, Esc to exit/back, R for audio, F for furigana | M2 | ORIGINAL_REQUEST §R3 |
| 12 | Backward Compatibility | Non-destructive presentation mapping over `stats.ankiProgress` and `stats.ankiCardProgress` preserving legacy data | M3 | ORIGINAL_REQUEST §R4 |
| 13 | Comprehensive Automated Tests | Vitest suite verifying arcs, categorization, zero-scroll classes, keyboard controls, and backward compatibility (min 142 passing tests) | M3 | ORIGINAL_REQUEST §R4 |
| 14 | Production Build Integrity | TypeScript compilation check (`tsc -b && vite build`) with 0 errors and zero lint warnings | M3 | ORIGINAL_REQUEST §R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Categorized Deck Selector & Stage-Based Immersion Arcs | `src/data/ankiArcData.ts`, `src/components/anki/AnkiHub.tsx`, arc accordions, category tabs, 1-click due banner | none | DONE (Verified & Clean, 169 tests pass) |
| M2 | Viewport-Contained Study Session & Rapid Controls | `src/components/anki/AnkiCardStudy.tsx`, fixed 100dvh canvas, adaptive media, single-row rating bar, furigana toggle, audio wave, keyboard triggers | M1 (contracts defined) | DONE (Verified & Clean, zero-scroll & R3 controls) |
| M3 | Comprehensive Vitest Suite & Build Verification | `src/components/anki/__tests__/ankiArcs.test.ts`, `src/components/anki/__tests__/m1EmpiricalStress.test.ts`, `src/components/anki/__tests__/m2EmpiricalStress.test.ts`, test run (190 tests passing), build run (0 TS errors), final adversarial audits | M1, M2 | DONE (190/190 tests passing, 0 TS errors, 0 lint errors, 100% verified) |

## Interface Contracts
### 1. `src/data/ankiArcData.ts` ↔ `AnkiHub.tsx` & `AnkiCardStudy.tsx`
```typescript
export interface AnkiArc {
  id: string;
  arcNumber: number;
  titleSv: string;
  titleJap: string;
  romajiTitle: string;
  descriptionSv: string;
  startChapter: number;      // 1-indexed (1..208)
  endChapter: number;        // 1-indexed
  startChapterIndex: number; // 0-indexed (0..207)
  endChapterIndex: number;   // 0-indexed
  totalChapters: number;
  totalCards: number;
  badgeId: string;
  badgeTitle: string;
  badgeJap: string;
  badgeDescription: string;
  iconName: string;
  theme: {
    accentColor: string;
    badgeBg: string;
    badgeBorder: string;
    progressColor: string;
    borderHighlight: string;
  };
}

export type AnkiCategoryType = 'immersion' | 'repetition' | 'exam' | 'music' | 'travel';
```

### 2. `AnkiCardStudy.tsx` Zero-Scroll Layout Contract
- Outer Container: `fixed inset-0 z-40 flex flex-col h-[100dvh] max-h-[100dvh] w-full bg-paper-100 dark:bg-sumi-950 text-ink-900 dark:text-slate-100 overflow-hidden select-none`
- Header Bar: `shrink-0 h-12 sm:h-14 bg-white dark:bg-sumi-900 border-b ...`
- Card Container: `w-full max-w-3xl flex-1 min-h-0 flex flex-col bg-white dark:bg-sumi-900 rounded-2xl border ... overflow-hidden`
- Media Frame: `relative w-full shrink-0 aspect-video max-h-[22vh] sm:max-h-[28vh] md:max-h-[32vh] overflow-hidden`
- Content Canvas: `flex-1 min-h-0 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4`
- Action Controls: `shrink-0 p-2.5 sm:p-3 bg-paper-50 dark:bg-sumi-950/80 border-t ... pb-[max(0.75rem,env(safe-area-inset-bottom))]`
- Rating Grid: `grid grid-cols-4 gap-1.5 sm:gap-2` (single-row on both mobile & desktop)

## Code Layout & Write Boundaries
- `src/data/ankiArcData.ts`: Owned exclusively by Milestone 1 Worker.
- `src/components/anki/AnkiHub.tsx`: Owned exclusively by Milestone 1 Worker.
- `src/components/anki/AnkiCardStudy.tsx`: Owned exclusively by Milestone 2 Worker.
- `src/components/anki/ankiLogic.ts`: Shared logic functions (Furigana, keyboard shortcut helpers, arc progress helpers).
- `src/components/anki/__tests__/`: Owned exclusively by Milestone 3 / Test Writer Workers.
- `.agents/`: Agent metadata only (no source code).
