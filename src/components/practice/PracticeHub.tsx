import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  PenTool, 
  Keyboard, 
  BookOpen, 
  RotateCcw, 
  Sparkles,
  Shuffle
} from 'lucide-react';
import type { KanaCharacter } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { KATAKANA_DATA } from '../../data/katakanaData';
import { GENKI_L1_VOCABULARY } from '../../data/genkiVocab';
import { GAIRAIGO_WORDS } from '../../data/gairaigoData';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { useScriptMode } from '../../context/scriptModeState';
import { fireSuperCelebration } from '../common/Confetti';
import { useMnemonicCoach } from '../../context/mnemonicCoachState';
import { TrickyHiraganaTrainer } from './TrickyHiraganaTrainer';
import { ParticleTrainer } from './ParticleTrainer';

interface PracticeHubProps {}

export const PracticeHub: React.FC<PracticeHubProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { playSfx, speakJapanese } = useAudio();
  const { recordActivity } = useProgression();
  const { showCoach, isCoachEnabled } = useMnemonicCoach();
  const { isKatakana } = useScriptMode();

  const modeParam = searchParams.get('mode');
  const activeMode: 'tricky' | 'particles' | 'typing' | 'trace' | 'words' = 
    (modeParam === 'tricky' || modeParam === 'particles' || modeParam === 'typing' || modeParam === 'trace' || modeParam === 'words')
      ? modeParam
      : 'tricky';

  const activeDataset = isKatakana ? KATAKANA_DATA : HIRAGANA_DATA;

  // ==========================================
  // 1. SPEED TYPING STATE
  // ==========================================
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [typingInput, setTypingInput] = useState<string>('');
  const [typingList, setTypingList] = useState<KanaCharacter[]>([]);
  const [typingStreak, setTypingStreak] = useState<number>(0);
  const typingInputRef = useRef<HTMLInputElement | null>(null);

  const initTyping = useCallback(() => {
    const shuffled = [...activeDataset].sort(() => Math.random() - 0.5).slice(0, 20);
    setTypingList(shuffled);
    setTypingIndex(0);
    setTypingInput('');
    setTypingStreak(0);
  }, [activeDataset]);

  useEffect(() => {
    if (activeMode === 'typing') {
      // oxlint-disable-next-line react/set-state-in-effect -- Entering typing mode initializes a randomized session.
      initTyping();
    }
  }, [activeMode, initTyping]);

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypingInput(val);

    const current = typingList[typingIndex];
    if (current && val.toLowerCase().trim() === current.romaji.toLowerCase()) {
      // MATCH!
      playSfx('catch', { combo: typingStreak + 1 });
      speakJapanese(current.kana, { rate: 1.1 });
      setTypingStreak(prev => prev + 1);
      setTypingInput('');

      if (typingIndex + 1 < typingList.length) {
        setTypingIndex(prev => prev + 1);
      } else {
        fireSuperCelebration();
        recordActivity({
          type: 'practice_completed',
          practiceType: 'speedTyping',
          score: 200
        });
        initTyping();
      }
    }
  };

  const handleTypingKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const current = typingList[typingIndex];
      if (current && typingInput.trim().toLowerCase() !== current.romaji.toLowerCase()) {
        playSfx('miss');
        if (isCoachEnabled) {
          showCoach(current);
        }
      }
    }
  };

  // ==========================================
  // 2. CANVAS TRACING STATE
  // ==========================================
  const [traceKanaIndex, setTraceKanaIndex] = useState<number>(0);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeTraceKana = activeDataset[traceKanaIndex] || activeDataset[0];

  const clearTraceCanvas = () => {
    const canvas = traceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = traceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#002B49';
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = traceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // ==========================================
  // 3. GENKI I WORD READER STATE
  // ==========================================
  const [revealedWords, setRevealedWords] = useState<Record<number, boolean>>({});

  const toggleRevealWord = (idx: number) => {
    setRevealedWords(prev => ({ ...prev, [idx]: !prev[idx] }));
    playSfx('click');
  };

  return (
    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white dark:bg-sumi-900 p-5 rounded-3xl border border-slate-200 dark:border-sumi-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PenTool className="text-brand-600 dark:text-brand-gold" size={24} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Övningshubben (Aktiva Lärverktyg)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Välj träningsform för att stärka minnet genom aktiv framkallning och handskrift.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {[
            { id: 'tricky', label: 'Kluriga Hiragana', icon: Shuffle },
            { id: 'particles', label: 'Partikelträning ⭐', icon: Sparkles },
            { id: 'typing', label: 'Skriv Romaji', icon: Keyboard },
            { id: 'trace', label: 'Streckordning', icon: PenTool },
            { id: 'words', label: isKatakana ? 'Låneord' : 'Genki I Ord', icon: BookOpen },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setSearchParams({ mode: mode.id });
                  playSfx('click');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                    : 'bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700'
                }`}
              >
                <Icon size={14} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* 0. TRICKY HIRAGANA LOOKALIKES */}
      {/* ========================================== */}
      {activeMode === 'tricky' && (
        <TrickyHiraganaTrainer />
      )}

      {/* ========================================== */}
      {/* 0.5. PARTICLE TRAINER (JOSHI) */}
      {/* ========================================== */}
      {activeMode === 'particles' && (
        <ParticleTrainer />
      )}

      {/* ========================================== */}
      {/* 1. SPEED TYPING DRILL */}
      {/* ========================================== */}
      {activeMode === 'typing' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 xl:p-10 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          <div className="max-w-xl xl:max-w-2xl mx-auto space-y-6 text-center">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>Tecken {typingIndex + 1} av {typingList.length}</span>
              <span className="text-amber-500 font-mono text-sm flex items-center gap-1">
                <Sparkles size={16} /> Streak: {typingStreak}x
              </span>
            </div>

            {/* Target Kana */}
            {typingList[typingIndex] && (
              <div className="bg-slate-50 dark:bg-sumi-950 p-10 xl:p-12 rounded-3xl border border-slate-200 dark:border-sumi-800 space-y-4">
                <div className="text-9xl xl:text-[130px] font-jp font-black text-slate-900 dark:text-white leading-none">
                  {typingList[typingIndex].kana}
                </div>
                <p className="text-xs text-slate-400">
                  💡 Skriv romaji på tangentbordet (t.ex. "ka")
                </p>
              </div>
            )}

            {/* Input Field */}
            <div className="space-y-2">
              <input
                ref={typingInputRef}
                type="text"
                autoFocus
                value={typingInput}
                onChange={handleTypingChange}
                onKeyDown={handleTypingKeyDown}
                placeholder="Skriv romaji här..."
                className="w-full text-center font-mono text-3xl font-bold py-4 px-6 rounded-2xl bg-slate-100 dark:bg-sumi-800 border-2 border-slate-300 dark:border-sumi-600 focus:outline-none focus:ring-2 focus:ring-brand-bronze uppercase tracking-widest text-slate-900 dark:text-white"
              />
              {typingList[typingIndex] && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => showCoach(typingList[typingIndex])}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:underline flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <span>🦊 Behöver du hjälp? Se minnesregeln</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. CANVAS TRACING MODE */}
      {/* ========================================== */}
      {activeMode === 'trace' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Handskrift & Streckordning ✍️
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Öva på att rita tecknet för hand för att bygga ett starkt muskelminne.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTraceKanaIndex(prev => Math.max(prev - 1, 0));
                  clearTraceCanvas();
                  playSfx('click');
                }}
                disabled={traceKanaIndex === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                ← Föregående
              </button>
              <span className="text-xs font-mono font-bold text-slate-500">
                {traceKanaIndex + 1} / {HIRAGANA_DATA.length}
              </span>
              <button
                onClick={() => {
                  setTraceKanaIndex(prev => Math.min(prev + 1, HIRAGANA_DATA.length - 1));
                  clearTraceCanvas();
                  playSfx('click');
                }}
                disabled={traceKanaIndex === HIRAGANA_DATA.length - 1}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-sumi-800 text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Nästa →
              </button>
            </div>
          </div>

          {/* Desktop Split View: Canvas on Left, Details on Right */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
            {/* Canvas column */}
            <div className="xl:col-span-6 flex flex-col items-center space-y-3">
              <div className="w-full flex justify-between items-center px-2">
                <span className="text-xs text-slate-400">Rita med musen eller touch:</span>
                <button
                  onClick={clearTraceCanvas}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-sumi-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={13} /> Rensa tavlan
                </button>
              </div>

              <div className="relative w-full aspect-square max-w-[360px] mx-auto bg-slate-50 dark:bg-sumi-950 rounded-3xl border-2 border-dashed border-slate-300 dark:border-sumi-700 overflow-hidden flex items-center justify-center select-none shadow-inner">
                {/* Reference Grid */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full border-b border-dashed border-slate-200 dark:border-sumi-800 absolute top-0" style={{ height: '50%' }}></div>
                  <div className="w-full h-full border-r border-dashed border-slate-200 dark:border-sumi-800 absolute left-0" style={{ width: '50%' }}></div>
                </div>

                {/* Ghost Guide Character */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 font-jp text-[220px] font-bold text-slate-900 dark:text-white select-none">
                  {activeTraceKana.kana}
                </div>

                {/* Canvas */}
                <canvas
                  ref={traceCanvasRef}
                  width={400}
                  height={400}
                  onMouseDown={startDraw}
                  onMouseMove={drawMove}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  onTouchStart={startDraw}
                  onTouchMove={drawMove}
                  onTouchEnd={() => setIsDrawing(false)}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
                />
              </div>
            </div>

            {/* Details Column on Desktop */}
            <div className="xl:col-span-6 space-y-4">
              <div className="bg-slate-50 dark:bg-sumi-950 p-5 rounded-2xl border border-slate-200 dark:border-sumi-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-2xl font-bold text-brand-600 dark:text-brand-gold uppercase">
                    /{activeTraceKana.romaji}/
                  </span>
                  <span className="text-xs text-slate-400 ml-3">
                    ({activeTraceKana.strokeCount} {activeTraceKana.strokeCount === 1 ? 'streck' : 'streck'})
                  </span>
                </div>
                <AudioButton text={activeTraceKana.kana} size="md" />
              </div>

              {/* Mnemonic info */}
              <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Svensk Minnesbild</span>
                </div>
                <p className="text-sm font-bold text-amber-950 dark:text-amber-100">
                  {activeTraceKana.mnemonic.summary}
                </p>
                <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                  {activeTraceKana.mnemonic.storySv}
                </p>
              </div>

              {/* Pronunciation Advice */}
              <div className="bg-slate-50 dark:bg-sumi-950 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 text-xs text-slate-600 dark:text-slate-300">
                <strong>Uttal:</strong> {activeTraceKana.pronunciationTipSv}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. WORD READER MODE                        */}
      {/* ========================================== */}
      {activeMode === 'words' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {isKatakana ? 'Katakana Låneordsläsning (Gairaigo) 📖' : 'Genki I Ordläsning 📖'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isKatakana 
                ? 'Öva på att läsa autentiska låneord i ren Katakana. Klicka på kortet för att avslöja ledtråd och betydelse!'
                : 'Öva på att läsa riktiga nybörjarord skrivna i ren Hiragana utan romaji. Klicka på kortet för att avslöja betydelsen!'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {(isKatakana 
              ? GAIRAIGO_WORDS.map(w => ({ kana: w.katakana, romaji: w.romaji, meaningSv: `${w.meaningSv} (${w.originFlag} ${w.originLanguage})` }))
              : GENKI_L1_VOCABULARY
            ).map((word, idx) => {
              const isRevealed = !!revealedWords[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleRevealWord(idx)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isRevealed
                      ? isKatakana
                        ? 'border-amber-500 bg-amber-50/20 dark:bg-sumi-950'
                        : 'border-brand-600 dark:border-brand-bronze bg-slate-50 dark:bg-sumi-950'
                      : 'border-slate-200 dark:border-sumi-800 hover:border-slate-300 bg-white dark:bg-sumi-900'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-jp text-2xl font-extrabold text-slate-900 dark:text-white">
                      {word.kana}
                    </span>
                    <AudioButton text={word.kana} size="sm" />
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-sumi-800/80">
                    {isRevealed ? (
                      <div>
                        <span className="font-mono text-xs text-brand-600 dark:text-brand-gold font-bold">
                          {word.romaji}
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          🇸🇪 {word.meaningSv}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Klicka för att avslöja svar
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
