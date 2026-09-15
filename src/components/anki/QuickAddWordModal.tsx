import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  Sparkles, 
  Volume2, 
  Check, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Smartphone,
  Edit3,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { enrichScannedWord, type DictionaryLookupResult } from '../../services/dictionaryLookup';
import { fireSuperCelebration } from '../common/Confetti';
import type { CustomFlashcard } from '../../types/anki';

interface QuickAddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardSaved?: (card: CustomFlashcard) => void;
}

export const QuickAddWordModal: React.FC<QuickAddWordModalProps> = ({
  isOpen,
  onClose,
  onCardSaved
}) => {
  const { playSfx, speakJapanese } = useAudio();
  const { addCustomCard, stats } = useProgression();

  const [rawInput, setRawInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState<DictionaryLookupResult | null>(null);

  // Editable fields for the flashcard
  const [kanji, setKanji] = useState('');
  const [hiragana, setHiragana] = useState('');
  const [romaji, setRomaji] = useState('');
  const [meaning, setMeaning] = useState('');
  const [source, setSource] = useState('iPhone-skanning');
  const [notes, setNotes] = useState('');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedCountThisSession, setSavedCountThisSession] = useState(0);
  const [justSavedMessage, setJustSavedMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Debounced auto-enrichment on raw input change
  useEffect(() => {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      setLookupResult(null);
      setKanji('');
      setHiragana('');
      setRomaji('');
      setMeaning('');
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const enriched = await enrichScannedWord(trimmed);
        if (!isMounted) return;

        setLookupResult(enriched);
        setKanji(enriched.kanji);
        setHiragana(enriched.hiragana);
        setRomaji(enriched.romaji);
        setMeaning(enriched.meaning);
        if (enriched.source) {
          setSource(enriched.source);
        }
        if (enriched.notes) {
          setNotes(enriched.notes);
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [rawInput]);

  if (!isOpen) return null;

  const handlePronounce = () => {
    const textToSpeak = hiragana || kanji || rawInput;
    if (textToSpeak) {
      speakJapanese(textToSpeak);
      playSfx('click');
    }
  };

  const handleSave = () => {
    const finalHiragana = (hiragana || rawInput).trim();
    const finalMeaning = meaning.trim();

    if (!finalHiragana || !finalMeaning) {
      playSfx('wrong');
      return;
    }

    addCustomCard({
      kanji: kanji.trim(),
      hiragana: finalHiragana,
      romaji: (romaji || finalHiragana).trim(),
      meaning: finalMeaning,
      source: source.trim() || 'iPhone-skanning',
      notes: notes.trim() ? notes.trim() : undefined
    });

    fireSuperCelebration();
    setSavedCountThisSession((prev) => prev + 1);
    setJustSavedMessage(`Sparade "${kanji || finalHiragana}"!`);

    setTimeout(() => {
      setJustSavedMessage(null);
    }, 2500);

    // Reset input for next scan
    setRawInput('');
    setKanji('');
    setHiragana('');
    setRomaji('');
    setMeaning('');
    setNotes('');
    setLookupResult(null);

    // Re-focus input for fast consecutive scanning
    inputRef.current?.focus();
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playSfx('click');
    // On iPhone, opening the camera with Live Text allows tapping the text in the camera or photo picker.
    // As a helper, we prompt the user to use the iOS Live Text icon
    inputRef.current?.focus();
  };

  const totalCustomCards = (stats.customCards?.length || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sumi-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-paper-50 dark:bg-sumi-900 rounded-3xl shadow-2xl border border-paper-300 dark:border-sumi-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-paper-200 dark:border-sumi-800 flex items-center justify-between bg-white dark:bg-sumi-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Camera size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-ink-900 dark:text-white flex items-center gap-2">
                <span>Skanna & Skapa kort</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  100% Gratis
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Peka med iPhone-kameran eller klistra in japansk text
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSfx('click');
              onClose();
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-paper-100 dark:hover:bg-sumi-800 transition-all cursor-pointer"
            aria-label="Stäng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* iOS Live Text Helper Banner */}
          <div className="bg-amber-500/10 dark:bg-amber-950/40 rounded-2xl p-3.5 border border-amber-500/20 flex items-start gap-3 text-xs text-ink-900 dark:text-amber-200">
            <Smartphone size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <p className="font-extrabold text-amber-700 dark:text-amber-300">
                iPhone Live Text (Skanna text):
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                1. Klicka i inmatningsrutan nedan.<br />
                2. Tryck på <strong>kamerasymbolen [Skanna text]</strong> direkt på iPhone-tangentbordet.<br />
                3. Rikta kameran mot boken eller skärmen för omedelbar avläsning!
              </p>
            </div>
          </div>

          {/* Success Banner if just saved */}
          {justSavedMessage && (
            <div className="bg-emerald-500 text-white rounded-2xl p-3 px-4 flex items-center justify-between text-xs font-bold animate-fadeIn shadow-md">
              <span className="flex items-center gap-2">
                <Check size={16} />
                {justSavedMessage}
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                {totalCustomCards} i samlingen
              </span>
            </div>
          )}

          {/* Input & Camera capture row */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-ink-900 dark:text-slate-200 uppercase tracking-wider">
                Japanskt ord / tecken
              </label>
              {isSearching && (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles size={12} className="animate-spin" />
                  Slår upp i ordbok...
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Dutta här och välj 'Skanna text'..."
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                className="w-full pl-4 pr-24 py-3.5 bg-white dark:bg-sumi-950 border-2 border-paper-300 dark:border-sumi-700 focus:border-amber-500 dark:focus:border-amber-400 rounded-2xl text-base font-bold text-ink-900 dark:text-white placeholder:text-slate-400 transition-all outline-hidden shadow-xs"
              />

              <div className="absolute right-2 flex items-center gap-1">
                {rawInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setRawInput('');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-paper-100 hover:bg-paper-200 dark:bg-sumi-800 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border border-paper-300 dark:border-sumi-700"
                  title="Ta foto med mobilen"
                >
                  <Camera size={14} />
                  <span className="hidden sm:inline">Foto</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
              </div>
            </div>
          </div>

          {/* Flashcard Live Preview */}
          {(rawInput || hiragana || meaning) && (
            <div className="bg-white dark:bg-sumi-950 rounded-3xl p-5 border-2 border-amber-400/40 dark:border-amber-500/30 shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={13} className="text-amber-500" />
                  Kortförhandsgranskning
                </span>
                {lookupResult && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    lookupResult.isExactLocalMatch
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                  }`}>
                    {lookupResult.isExactLocalMatch ? '✓ Hittades lokalt' : 'Öppen ordbok'}
                  </span>
                )}
              </div>

              {/* Japanese Character Display */}
              <div className="text-center py-2 relative">
                {/* Furigana if kanji exists */}
                {kanji && hiragana && (
                  <span className="block text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mb-0.5">
                    {hiragana}
                  </span>
                )}

                <div className="flex items-center justify-center gap-3">
                  <h3 className="text-3xl sm:text-4xl font-black text-ink-900 dark:text-white tracking-wide">
                    {kanji || hiragana || rawInput}
                  </h3>

                  <button
                    type="button"
                    onClick={handlePronounce}
                    className="w-10 h-10 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                    title="Lyssna på uttal"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>

                {romaji && (
                  <span className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                    {romaji}
                  </span>
                )}
              </div>

              {/* Meaning Field */}
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Svensk betydelse / översättning
                </label>
                <input
                  type="text"
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="t.ex. katt, skola, god morgon..."
                  className="w-full px-4 py-2.5 bg-paper-100 dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 rounded-xl text-sm font-bold text-ink-900 dark:text-white focus:border-amber-500 outline-hidden"
                />
              </div>

              {/* Advanced / Fine-tune Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit3 size={13} />
                <span>{showAdvanced ? 'Dölj detaljfält' : 'Justera kanji, hiragana eller källa'}</span>
              </button>

              {/* Advanced Fields */}
              {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-paper-200 dark:border-sumi-800 animate-fadeIn">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Kanji (valfri)</label>
                    <input
                      type="text"
                      value={kanji}
                      onChange={(e) => setKanji(e.target.value)}
                      placeholder="t.ex. 猫"
                      className="w-full px-3 py-1.5 bg-paper-100 dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 rounded-lg text-xs font-bold text-ink-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Hiragana / Läsning</label>
                    <input
                      type="text"
                      value={hiragana}
                      onChange={(e) => setHiragana(e.target.value)}
                      placeholder="t.ex. ねこ"
                      className="w-full px-3 py-1.5 bg-paper-100 dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 rounded-lg text-xs font-bold text-ink-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Romaji</label>
                    <input
                      type="text"
                      value={romaji}
                      onChange={(e) => setRomaji(e.target.value)}
                      placeholder="t.ex. neko"
                      className="w-full px-3 py-1.5 bg-paper-100 dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 rounded-lg text-xs font-bold text-ink-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Källa / Tagg</label>
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="t.ex. Genki kap 3, Manga, Meny"
                      className="w-full px-3 py-1.5 bg-paper-100 dark:bg-sumi-900 border border-paper-300 dark:border-sumi-700 rounded-lg text-xs font-bold text-ink-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-paper-200 dark:border-sumi-800 bg-white dark:bg-sumi-950 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {totalCustomCards > 0 && (
              <span><strong>{totalCustomCards}</strong> kort i egna samlingen</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playSfx('click');
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-paper-300 dark:border-sumi-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-paper-100 dark:hover:bg-sumi-800 transition-all cursor-pointer"
            >
              Klar
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!rawInput && !hiragana && !meaning}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                (rawInput || hiragana) && meaning
                  ? 'bg-amber-500 hover:bg-amber-400 text-sumi-950 active:scale-95'
                  : 'bg-slate-200 dark:bg-sumi-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Spara kort</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
