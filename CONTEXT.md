# HiraganaSkolan Domain Context

HiraganaSkolan is a modern Japanese learning platform for beginners, centered on spaced repetition, kana mastery, and textbook immersion.

## Language

**CardRef**:
A canonical reference uniquely identifying a flashcard across any deck via its deck type and item identifier.
_Avoid_: CardId, item pointer, flashcard key

**DeckId**:
The identifier of a curated or user-created card collection (e.g. `kana`, `anki`, `genki`, `custom`).
_Avoid_: category, card group, study mode

**SrsRating**:
The learner's self-assessed recall quality for a card: `again`, `hard`, `good`, or `easy`.
_Avoid_: grade, score, quality, review answer

**SrsItemProgress**:
The persistent scheduling and retention state of a card, tracking repetitions, interval, ease factor, lapses, and next due date.
_Avoid_: card stats, flashcard history, review record

**SpacedRepetitionEngine**:
The deep module responsible for SuperMemo-2 scheduling math, lapse handling, interval progression, and due-card determination.
_Avoid_: SRS service, review manager, scheduler utility

**StudySessionEngine**:
The headless runtime state engine governing an active flashcard review session, including queue rotation, retry reinsertion on 'again', timing, and session score.
_Avoid_: study manager, card runner, review controller