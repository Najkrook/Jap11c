import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Volume2, 
  Sparkles, 
  PenTool, 
  RotateCcw, 
  Check, 
  BookOpen, 
  AlertCircle, 
  Play
} from 'lucide-react';
import type { KanaCharacter, SrsItemData } from '../../types/kana';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';

interface KanaModalProps {
  kana: KanaCharacter | null;
  srsData?: SrsItemData;
  onClose: () => void;
  onSelectKana?: (k: KanaCharacter) => void;
}

export const KanaModal: React.FC<KanaModalProps> = ({
  kana,
  srsData,
  onClose
}) => {
  const { playSfx, speakJapanese } = useAudio();
  const [activeTab, setActiveTab] = useState<'mnemonic' | 'draw' | 'words' | 'phonetics'>('mnemonic');
  const [isDrawing, setIsDrawing] = useState(false);
  const [animatingStroke, setAnimatingStroke] = useState(false);
  const [activeStrokeIdx, setActiveStrokeIdx] = useState<number>(-1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Initialize and clear canvas when kana changes or tab switches
  useEffect(() => {
    if (activeTab === 'draw') {
      clearCanvas();
    }
  }, [activeTab, kana, clearCanvas]);

  if (!kana) return null;

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
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
    ctx.strokeStyle = '#1A2B4C';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
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

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Stroke Order Animation
  const playStrokeAnimation = () => {
    if (!kana.strokeSvgData || kana.strokeSvgData.length === 0 || animatingStroke) return;
    setAnimatingStroke(true);
    playSfx('click');
    
    let current = 0;
    setActiveStrokeIdx(0);
    const interval = setInterval(() => {
      current++;
      if (current >= (kana.strokeSvgData?.length || 0)) {
        clearInterval(interval);
        setTimeout(() => {
          setAnimatingStroke(false);
          setActiveStrokeIdx(-1);
        }, 1000);
      } else {
        setActiveStrokeIdx(current);
      }
    }, 700);
  };

  const getStatusBadge = () => {
    if (!srsData || srsData.status === 'new') {
      return <span className="bg-paper-200 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium">Nytt tecken</span>;
    }
    if (srsData.status === 'learning') {
      return <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs px-2.5 py-1 rounded-full font-medium">Lär dig</span>;
    }
    if (srsData.status === 'mastered') {
      return <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Check size={12} /> Bemästrad</span>;
    }
    return <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full font-medium">Repeteras</span>;
  };

  const handleKanaBoxClick = () => {
    playSfx('click');
    speakJapanese(kana.kana, { rate: 0.9 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-sumi-900 rounded-3xl shadow-2xl border border-paper-300 dark:border-sumi-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col transition-colors"
      >
        {/* Header */}
        <div className="p-6 border-b border-paper-200 dark:border-sumi-800 flex justify-between items-start bg-paper-50 dark:bg-sumi-950/40">
          <div className="flex items-center gap-5">
            {/* Big Clean Kana Character Box (Clickable to hear pronunciation) */}
            <div 
              onClick={handleKanaBoxClick}
              title="Klicka för att lyssna på uttalet"
              className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-500 text-ink-950 rounded-2xl flex items-center justify-center font-jp text-5xl font-black shadow-sm shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform border border-amber-300/80 group"
            >
              {kana.kana}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-extrabold text-ink-800 dark:text-white font-mono tracking-tight">
                  {kana.romaji}
                </h2>
                <AudioButton text={kana.kana} size="sm" variant="secondary" showLabel label="Lyssna" />
                {getStatusBadge()}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {kana.rowNameSv} • {kana.strokeCount} streck • Etapp {kana.courseStage}
              </p>
              
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1 pt-0.5">
                <Volume2 size={13} className="shrink-0" /> {kana.swedishSimilarSound}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Stäng"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-paper-200 dark:hover:bg-sumi-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Subtabs */}
        <div className="flex border-b border-paper-200 dark:border-sumi-800 px-6 pt-3 gap-2 bg-paper-50/50 dark:bg-sumi-950/20 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveTab('mnemonic'); playSfx('click'); }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'mnemonic'
                ? 'border-amber-500 text-ink-800 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles size={16} />
            Mnemoteknik (Minnesregel)
          </button>

          <button
            onClick={() => { setActiveTab('draw'); playSfx('click'); }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'draw'
                ? 'border-amber-500 text-ink-800 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PenTool size={16} />
            Rita & Streckordning
          </button>

          <button
            onClick={() => { setActiveTab('words'); playSfx('click'); }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'words'
                ? 'border-amber-500 text-ink-800 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen size={16} />
            Exempelord ({kana.exampleWords.length})
          </button>

          <button
            onClick={() => { setActiveTab('phonetics'); playSfx('click'); }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'phonetics'
                ? 'border-amber-500 text-ink-800 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertCircle size={16} />
            Uttal & Fallgropar
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto">
          {/* TAB 1: MNEMONIC */}
          {activeTab === 'mnemonic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-paper-100 dark:bg-amber-950/20 border border-paper-300 dark:border-amber-900/40 rounded-2xl p-5 space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-ink-800 dark:text-amber-300 font-extrabold text-sm mb-1">
                    <Sparkles size={16} className="text-amber-500" />
                    <span>🇸🇪 Svensk minnesbild: {kana.mnemonic.summary}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {kana.mnemonic.storySv}
                  </p>
                </div>

                {kana.mnemonic.summaryEn && (
                  <div className="pt-2 border-t border-paper-300/60 dark:border-amber-900/30">
                    <div className="flex items-center gap-2 text-ink-800 dark:text-amber-300 font-bold text-xs mb-1">
                      <span>🇬🇧 English mnemonic: {kana.mnemonic.summaryEn}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      {kana.mnemonic.storyEn}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-paper-300/80 dark:border-amber-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-ink-700 dark:text-amber-200 font-medium">
                  <span>💡 Nyckel: <strong>{kana.mnemonic.keyCue}</strong> {kana.mnemonic.keyCueEn && `(${kana.mnemonic.keyCueEn})`}</span>
                  <span className="text-slate-500 dark:text-slate-400 italic">{kana.mnemonic.imageVisualDesc}</span>
                </div>
              </div>

              {/* Visual Stroke & Comparison card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-paper-50 dark:bg-sumi-950 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-2">Visuellt Tecken</span>
                  <div className="text-7xl font-jp font-bold text-ink-800 dark:text-slate-100 py-2">
                    {kana.kana}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Låter som: <span className="font-bold text-ink-navy dark:text-brand-gold">{kana.romaji}</span>
                  </span>
                </div>

                <div className="bg-paper-50 dark:bg-sumi-950 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Svensk Fonetik</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                      {kana.pronunciationTipSv}
                    </p>
                  </div>
                  {kana.similarSoundPitfall && (
                    <div className="mt-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl p-3 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{kana.similarSoundPitfall}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRAWING & STROKE ORDER */}
          {activeTab === 'draw' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-paper-100 dark:bg-sumi-950 p-3.5 rounded-2xl border border-paper-300 dark:border-sumi-800">
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-ink-800 dark:text-white">Streckordning ({kana.strokeCount} streck):</span> Rita tecknet för hand med musen eller fingret.
                </div>
                <div className="flex items-center gap-2">
                  {kana.strokeSvgData && (
                    <button
                      onClick={playStrokeAnimation}
                      disabled={animatingStroke}
                      className="px-3 py-1.5 rounded-xl bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 text-xs font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity shadow-xs"
                    >
                      <Play size={12} />
                      {animatingStroke ? 'Visar...' : 'Animera streck'}
                    </button>
                  )}
                  <button
                    onClick={clearCanvas}
                    className="px-3 py-1.5 rounded-xl bg-paper-200 dark:bg-sumi-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 hover:bg-paper-300 dark:hover:bg-sumi-700 transition-colors"
                  >
                    <RotateCcw size={12} />
                    Rensa
                  </button>
                </div>
              </div>

              {/* Drawing Area & Overlay */}
              <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-paper-50 dark:bg-sumi-950 rounded-3xl border-2 border-dashed border-paper-300 dark:border-sumi-700 overflow-hidden select-none flex items-center justify-center">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full border-b border-dashed border-paper-300 dark:border-sumi-800 absolute top-0" style={{ height: '50%' }}></div>
                  <div className="w-full h-full border-r border-dashed border-paper-300 dark:border-sumi-800 absolute left-0" style={{ width: '50%' }}></div>
                  <div className="absolute inset-0 border border-paper-300 dark:border-sumi-800"></div>
                </div>

                {/* Ghost Kana guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-25 font-jp text-[180px] font-bold text-slate-900 dark:text-white select-none">
                  {kana.kana}
                </div>

                {/* Animated SVG stroke demonstration if available */}
                {kana.strokeSvgData && kana.strokeSvgData.length > 0 && (
                  <svg 
                    viewBox="0 0 100 100" 
                    className="absolute inset-0 w-full h-full pointer-events-none p-4"
                  >
                    {kana.strokeSvgData.map((d, idx) => {
                      const isHighlighted = activeStrokeIdx === idx;
                      const isPast = activeStrokeIdx > idx;
                      return (
                        <path
                          key={idx}
                          d={d}
                          fill="none"
                          stroke={isHighlighted ? '#F43F5E' : isPast ? '#1A2B4C' : '#94A3B8'}
                          strokeWidth={isHighlighted ? '7' : '4'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={isHighlighted ? 'animate-pulse' : ''}
                        />
                      );
                    })}
                  </svg>
                )}

                {/* Interactive Drawing Canvas */}
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
                />
              </div>

              <p className="text-center text-xs text-slate-400">
                ✍️ Tips: Börja alltid uppifrån och ner, och från vänster till höger!
              </p>
            </div>
          )}

          {/* TAB 3: GENKI I WORDS */}
          {activeTab === 'words' && (
            <div className="space-y-3 animate-fadeIn">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vanliga nybörjarord med detta tecken:
              </p>

              <div className="space-y-2">
                {kana.exampleWords.map((word, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-paper-50 dark:bg-sumi-950 border border-paper-300 dark:border-sumi-800 flex items-center justify-between hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <AudioButton text={word.kana} size="sm" variant="secondary" />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-jp text-lg font-bold text-ink-900 dark:text-white">
                            {word.kana}
                          </span>
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            ({word.romaji})
                          </span>
                          {word.pitchAccent && (
                            <span className="text-[10px] bg-paper-200 dark:bg-sumi-800 text-ink-700 dark:text-slate-300 px-1.5 rounded font-mono">
                              Ton: {word.pitchAccent}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                          🇸🇪 {word.meaningSv} <span className="text-slate-400 font-normal">({word.meaningEn})</span>
                        </p>
                      </div>
                    </div>

                    {word.genkiChapter && (
                      <span className="text-[11px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md font-semibold">
                        {word.genkiChapter}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHONETICS & TRAPS */}
          {activeTab === 'phonetics' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-paper-50 dark:bg-sumi-950 p-4 rounded-2xl border border-paper-300 dark:border-sumi-800">
                <h4 className="font-bold text-sm text-ink-800 dark:text-white mb-2 flex items-center gap-2">
                  <Volume2 size={16} className="text-amber-500" />
                  Svensk fonetisk jämförelse
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {kana.pronunciationTipSv}
                </p>
              </div>

              {kana.similarSoundPitfall && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl">
                  <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-500" />
                    Vanlig förväxling
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    {kana.similarSoundPitfall}
                  </p>
                </div>
              )}

              {/* SRS Stat details if available */}
              {srsData && (
                <div className="bg-paper-50 dark:bg-sumi-950 p-4 rounded-2xl border border-paper-300 dark:border-sumi-800 text-xs text-slate-600 dark:text-slate-400 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-ink-800 dark:text-slate-200">SRS Repetitionsstatus:</span>
                    <p className="mt-0.5">Antal repetitioner: {srsData.repetitions} | Intervall: {srsData.interval} dagar</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-ink-800 dark:text-slate-200">Träffsäkerhet:</span>
                    <p className="mt-0.5 font-mono">{srsData.consecutiveCorrect} rätt i rad</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-paper-50 dark:bg-sumi-950/60 border-t border-paper-200 dark:border-sumi-800 flex justify-between items-center">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            HiraganaSkolan • Japanska för nybörjare
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-ink-navy text-white dark:bg-brand-bronze dark:text-sumi-950 font-bold text-xs hover:opacity-90 transition-opacity shadow-xs"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};
