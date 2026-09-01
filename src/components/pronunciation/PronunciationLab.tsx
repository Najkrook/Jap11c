import React, { useState } from 'react';
import { 
  Mic2, 
  Mic, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Activity, 
  VolumeX, 
  X
} from 'lucide-react';
import { PHONETICS_SECTIONS, MINIMAL_PAIRS_DATA } from '../../data/phoneticsGuide';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { AudioButton } from '../common/AudioButton';
import { fireConfetti } from '../common/Confetti';
import { useProgression } from '../../context/ProgressionContext';
import { useAudio, usePronunciation } from '../../modules/audio';

interface PronunciationLabProps {}

export const PronunciationLab: React.FC<PronunciationLabProps> = () => {
  const { recordActivity } = useProgression();
  const { playSfx } = useAudio();
  const { isListening, feedback, startListening, clearFeedback, isSupported } = usePronunciation();
  const [activeTab, setActiveTab] = useState<'guide' | 'mic' | 'minimalPairs'>('guide');

  // Mic Test State
  const [selectedKanaId, setSelectedKanaId] = useState<string>('a');

  // Minimal Pairs Quiz State
  const [minimalPairIndex, setMinimalPairIndex] = useState<number>(0);
  const [minimalPairSelected, setMinimalPairSelected] = useState<number | null>(null);
  const [minimalPairScore, setMinimalPairScore] = useState<number>(0);
  const [minimalPairCompleted, setMinimalPairCompleted] = useState<boolean>(false);

  const currentKana = HIRAGANA_DATA.find(k => k.id === selectedKanaId) || HIRAGANA_DATA[0];

  // Trigger microphone speech recognition via usePronunciation hook
  const handleStartListening = async () => {
    playSfx('click');
    const res = await startListening(currentKana.kana, currentKana.romaji);

    if (res) {
      if (res.isMatch) {
        playSfx('levelUp');
        fireConfetti();

        recordActivity({
          type: 'pronunciation_attempt',
          kanaId: currentKana.id,
          isMatch: true,
          confidence: res.confidence
        });
      } else {
        playSfx('miss');
      }
    }
  };

  // Minimal Pairs Answer Click
  const handleMinimalPairAnswer = (chosenItemIdx: 1 | 2) => {
    if (minimalPairSelected !== null) return;
    setMinimalPairSelected(chosenItemIdx);

    const isCorrect = chosenItemIdx === 1;

    if (isCorrect) {
      playSfx('catch', { combo: 2 });
      setMinimalPairScore(prev => prev + 1);
    } else {
      playSfx('miss');
    }
  };

  const nextMinimalPair = () => {
    if (minimalPairIndex + 1 < MINIMAL_PAIRS_DATA.length) {
      setMinimalPairIndex(prev => prev + 1);
      setMinimalPairSelected(null);
      playSfx('click');
    } else {
      setMinimalPairCompleted(true);
      playSfx('levelUp');
      fireConfetti();
    }
  };

  return (
    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-600 dark:from-sumi-950 dark:to-sumi-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-brand-bronze/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-brand-bronze/30 text-brand-gold text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-brand-bronze/50 flex items-center gap-1">
            <Mic2 size={14} /> Fonetik & Uttalslabb
          </span>
          <span className="text-slate-300 text-xs font-medium">
            Praktisk uttalsguide för svensktalande
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Japanskt Uttal & Tonaccent
        </h1>
        <p className="text-slate-200 text-sm mt-2 max-w-2xl leading-relaxed">
          Lär dig de 5 rena vokalerna, klaff-uttalet av R, hur tonlösa vokaler viskas i <em>desu</em>, och testa ditt eget uttal i mikrofonen!
        </p>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 dark:border-sumi-800 gap-2">
        <button
          onClick={() => { setActiveTab('guide'); playSfx('click'); }}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'guide'
              ? 'border-brand-600 dark:border-brand-gold text-brand-600 dark:text-brand-gold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles size={16} />
          Svensk-Japansk Fonetikguide
        </button>

        <button
          onClick={() => { setActiveTab('mic'); playSfx('click'); }}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'mic'
              ? 'border-brand-600 dark:border-brand-gold text-brand-600 dark:text-brand-gold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Mic size={16} />
          Mikrofontest (Röstigenkänning)
        </button>

        <button
          onClick={() => { setActiveTab('minimalPairs'); playSfx('click'); }}
          className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'minimalPairs'
              ? 'border-brand-600 dark:border-brand-gold text-brand-600 dark:text-brand-gold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Volume2 size={16} />
          Minimal Pairs Lyssningsträning
        </button>
      </div>

      {/* TAB 1: PHONETICS GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-6 animate-fadeIn">
          {PHONETICS_SECTIONS.map((sec) => (
            <div
              key={sec.id}
              className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-brand-600 dark:text-brand-gold flex items-center justify-center font-bold">
                  {sec.id === 'vowels' && <Sparkles size={20} />}
                  {sec.id === 'r_sound' && <Activity size={20} />}
                  {sec.id === 'sokuon_chouon' && <Clock size={20} />}
                  {sec.id === 'voiceless_vowels' && <VolumeX size={20} />}
                  {sec.id === 'pitch_accent' && <TrendingUp size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {sec.titleSv}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sec.shortSummary}
                  </p>
                </div>
              </div>

              {/* Detailed Swedish text */}
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50/70 dark:bg-sumi-950/40 p-4 rounded-2xl border border-slate-100 dark:border-sumi-800">
                {sec.detailedExplanationSv.trim()}
              </div>

              {/* Swedish Trap Warning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-3.5 rounded-2xl text-xs text-amber-900 dark:text-amber-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-300">
                    <AlertCircle size={14} /> Vanligaste svenska felet:
                  </div>
                  {sec.swedishTrap}
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 p-3.5 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 size={14} /> Hur du övar:
                  </div>
                  {sec.howToPractice}
                </div>
              </div>

              {/* Audio samples */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Lyssna på ljudexempel:
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sec.audioExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 bg-slate-100 dark:bg-sumi-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-sumi-700"
                    >
                      <span className="font-jp font-bold text-sm text-slate-900 dark:text-white">
                        {ex.japanese}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        ({ex.romaji})
                      </span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        = {ex.translation}
                      </span>
                      <AudioButton text={ex.japanese} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MICROPHONE TESTER */}
      {activeTab === 'mic' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Mic className="text-sakura-500" />
              Tala i Mikrofonen & Få Feedback
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Välj ett tecken, tryck på mikrofonknappen och uttala tecknet klart och tydligt på japanska.
            </p>
          </div>

          {!isSupported && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0 text-amber-500" />
              <span>Röstigenkänning stöds inte fullt ut i denna webbläsare. För bästa upplevelse rekommenderas Google Chrome eller Microsoft Edge på dator eller Android.</span>
            </div>
          )}

          {/* Kana Selection pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {HIRAGANA_DATA.slice(0, 20).map((k) => (
              <button
                key={k.id}
                onClick={() => {
                  setSelectedKanaId(k.id);
                  clearFeedback();
                  playSfx('click');
                }}
                className={`p-2.5 rounded-2xl font-jp text-lg font-bold shrink-0 transition-all ${
                  selectedKanaId === k.id
                    ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-bronze dark:text-sumi-950 scale-105'
                    : 'bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {k.kana}
              </button>
            ))}
          </div>

          {/* Active Target Card */}
          <div className="bg-slate-50 dark:bg-sumi-950 p-8 rounded-3xl border border-slate-200 dark:border-sumi-800 text-center space-y-4 max-w-md mx-auto">
            <div className="text-7xl font-jp font-black text-slate-900 dark:text-white">
              {currentKana.kana}
            </div>

            <div>
              <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-gold font-mono uppercase">
                {currentKana.romaji}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentKana.swedishSimilarSound}
              </p>
            </div>

            <div className="flex justify-center gap-2">
              <AudioButton text={currentKana.kana} size="md" showLabel label="Lyssna först" variant="secondary" />
            </div>

            {/* Mic Action Button */}
            <div className="pt-4">
              <button
                onClick={handleStartListening}
                disabled={isListening}
                className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-sakura-500 hover:bg-sakura-600 text-white hover:scale-102 active:scale-98'
                }`}
              >
                <Mic size={20} className={isListening ? 'animate-bounce' : ''} />
                {isListening ? 'Lyssnar... Tala nu!' : 'Tryck för att tala i mikrofon'}
              </button>
            </div>

            {/* Mic Feedback Result */}
            {feedback && (
              <div className="pt-4 animate-fadeIn">
                {feedback.errorMsg ? (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2 text-left">
                    <AlertCircle size={18} className="shrink-0 text-amber-500" />
                    <span>{feedback.errorMsg}</span>
                  </div>
                ) : feedback.isMatch ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-2xl text-emerald-800 dark:text-emerald-200 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 size={18} /> Perfekt uttal! (+20 XP)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Uppfattade: <strong className="font-jp text-sm text-slate-800 dark:text-white">"{feedback.transcript}"</strong>
                    </p>
                  </div>
                ) : (
                  <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 rounded-2xl text-rose-800 dark:text-rose-200 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-rose-700 dark:text-rose-300">
                      <X size={18} /> Inte riktigt, försök igen!
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Uppfattade: <strong className="font-jp text-sm text-slate-800 dark:text-white">"{feedback.transcript}"</strong> (Förväntade: {currentKana.kana})
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MINIMAL PAIRS EAR TRAINING */}
      {activeTab === 'minimalPairs' && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Minimal Pairs Lyssningsträning 👂
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Träna ditt öra på att skilja mellan luriga japanska ljudskillnader (korta vs långa vokaler, dubbelkonsonanter och tonaccent).
            </p>
          </div>

          {!minimalPairCompleted ? (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Question progress */}
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>Fråga {minimalPairIndex + 1} av {MINIMAL_PAIRS_DATA.length}</span>
                <span className="text-emerald-500 font-mono">{minimalPairScore} rätt</span>
              </div>

              {/* Question Card */}
              <div className="bg-slate-50 dark:bg-sumi-950 p-6 rounded-3xl border border-slate-200 dark:border-sumi-800 space-y-4">
                <div className="text-center">
                  <span className="text-xs bg-blue-100 dark:bg-blue-950/60 text-brand-600 dark:text-brand-gold font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {MINIMAL_PAIRS_DATA[minimalPairIndex].title}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white mt-3">
                    Lyssna på ljuden och välj: <strong>"{MINIMAL_PAIRS_DATA[minimalPairIndex].item1.meaningSv}"</strong>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                    💡 {MINIMAL_PAIRS_DATA[minimalPairIndex].pitfall}
                  </p>
                </div>

                {/* The Two Choice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* OPTION 1 */}
                  <div
                    onClick={() => handleMinimalPairAnswer(1)}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center space-y-2 ${
                      minimalPairSelected === null
                        ? 'border-slate-200 dark:border-sumi-700 hover:border-brand-bronze bg-white dark:bg-sumi-900'
                        : minimalPairSelected === 1
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-sumi-800 opacity-60 bg-white dark:bg-sumi-900'
                    }`}
                  >
                    <AudioButton text={MINIMAL_PAIRS_DATA[minimalPairIndex].item1.kana} size="md" />
                    <div className="font-jp text-2xl font-extrabold text-slate-900 dark:text-white">
                      {MINIMAL_PAIRS_DATA[minimalPairIndex].item1.kana}
                    </div>
                    <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {MINIMAL_PAIRS_DATA[minimalPairIndex].item1.romaji}
                    </div>
                    {minimalPairSelected !== null && (
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                        🇸🇪 {MINIMAL_PAIRS_DATA[minimalPairIndex].item1.meaningSv}
                      </p>
                    )}
                  </div>

                  {/* OPTION 2 */}
                  <div
                    onClick={() => handleMinimalPairAnswer(2)}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center space-y-2 ${
                      minimalPairSelected === null
                        ? 'border-slate-200 dark:border-sumi-700 hover:border-brand-bronze bg-white dark:bg-sumi-900'
                        : minimalPairSelected === 2
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                        : 'border-slate-200 dark:border-sumi-800 opacity-60 bg-white dark:bg-sumi-900'
                    }`}
                  >
                    <AudioButton text={MINIMAL_PAIRS_DATA[minimalPairIndex].item2.kana} size="md" />
                    <div className="font-jp text-2xl font-extrabold text-slate-900 dark:text-white">
                      {MINIMAL_PAIRS_DATA[minimalPairIndex].item2.kana}
                    </div>
                    <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {MINIMAL_PAIRS_DATA[minimalPairIndex].item2.romaji}
                    </div>
                    {minimalPairSelected !== null && (
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
                        🇸🇪 {MINIMAL_PAIRS_DATA[minimalPairIndex].item2.meaningSv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Next Question Button */}
                {minimalPairSelected !== null && (
                  <div className="text-center pt-2 animate-fadeIn">
                    <button
                      onClick={nextMinimalPair}
                      className="px-6 py-2.5 rounded-xl bg-brand-600 text-white dark:bg-brand-bronze dark:text-sumi-950 font-bold text-xs hover:opacity-90 transition-opacity"
                    >
                      Nästa par →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="text-5xl">🎧</div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Bra lyssnat!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Du fick {minimalPairScore} av {MINIMAL_PAIRS_DATA.length} rätt på minimal pairs övningen.
              </p>
              <button
                onClick={() => {
                  setMinimalPairIndex(0);
                  setMinimalPairSelected(null);
                  setMinimalPairScore(0);
                  setMinimalPairCompleted(false);
                  playSfx('click');
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Gör övningen igen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
