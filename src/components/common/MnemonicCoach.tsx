import React from 'react';
import { 
  Volume2, 
  Check, 
  X, 
  Sparkles, 
  AlertTriangle, 
  EyeOff
} from 'lucide-react';
import { useMnemonicCoach } from '../../context/mnemonicCoachState';
import { useAudio } from '../../modules/audio';

/**
 * Animated SVG illustration of "Kitsune Sensei" -
 * The wise origami study fox mascot of HiraganaSkolan.
 */
const KitsuneSenseiAvatar: React.FC<{ size?: number; isHappy?: boolean }> = ({ size = 64 }) => {
  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md animate-bounce-subtle"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Background Aura */}
        <circle cx="50" cy="50" r="44" className="fill-amber-400/20 dark:fill-amber-400/10" />

        {/* Fox Ears */}
        {/* Left Ear */}
        <path
          d="M 22 46 L 15 15 L 42 32 Z"
          className="fill-amber-600 dark:fill-amber-500"
        />
        {/* Left Inner Ear */}
        <path
          d="M 23 38 L 19 21 L 36 31 Z"
          className="fill-amber-100 dark:fill-amber-200"
        />

        {/* Right Ear */}
        <path
          d="M 78 46 L 85 15 L 58 32 Z"
          className="fill-amber-600 dark:fill-amber-500"
        />
        {/* Right Inner Ear */}
        <path
          d="M 77 38 L 81 21 L 64 31 Z"
          className="fill-amber-100 dark:fill-amber-200"
        />

        {/* Fox Face Main Shape */}
        <path
          d="M 22 45 C 18 62 32 82 50 88 C 68 82 82 62 78 45 C 75 35 65 30 50 30 C 35 30 25 35 22 45 Z"
          className="fill-amber-500 dark:fill-amber-400"
        />

        {/* White Cheeks / Muzzle */}
        <path
          d="M 23 54 C 28 68 38 80 50 86 C 62 80 72 68 77 54 C 70 57 60 52 50 56 C 40 52 30 57 23 54 Z"
          className="fill-paper-50 dark:fill-paper-100"
        />

        {/* Sensei Graduation Cap / Headband */}
        <path
          d="M 32 30 L 50 20 L 68 30 L 50 34 Z"
          className="fill-ink-navy dark:fill-brand-bronze"
        />
        <circle cx="50" cy="27" r="2.5" className="fill-amber-400" />
        <path
          d="M 50 27 Q 62 25 66 38"
          stroke="#E65100"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="66" cy="38" r="2" className="fill-amber-600" />

        {/* Wise Scholar Glasses */}
        {/* Left Lens */}
        <circle
          cx="40"
          cy="52"
          r="6.5"
          className="stroke-ink-navy dark:stroke-sumi-900"
          strokeWidth="1.8"
          fill="none"
        />
        {/* Right Lens */}
        <circle
          cx="60"
          cy="52"
          r="6.5"
          className="stroke-ink-navy dark:stroke-sumi-900"
          strokeWidth="1.8"
          fill="none"
        />
        {/* Glasses Bridge */}
        <path
          d="M 46.5 52 Q 50 50 53.5 52"
          className="stroke-ink-navy dark:stroke-sumi-900"
          strokeWidth="1.8"
          fill="none"
        />

        {/* Smiling Eyes behind glasses */}
        <path
          d="M 36 52 Q 40 48 44 52"
          stroke="#1A2B4C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 56 52 Q 60 48 64 52"
          stroke="#1A2B4C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cute Black Nose */}
        <polygon
          points="47,66 53,66 50,70"
          className="fill-ink-navy dark:fill-sumi-900"
        />

        {/* Cheerful Smile */}
        <path
          d="M 46 72 Q 50 75 54 72"
          stroke="#1A2B4C"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Rosy Cheeks */}
        <circle cx="30" cy="62" r="3.5" className="fill-rose-400/50" />
        <circle cx="70" cy="62" r="3.5" className="fill-rose-400/50" />
      </svg>

      {/* Sparkle badge */}
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 items-center justify-center text-[9px] text-white font-bold">✨</span>
      </span>
    </div>
  );
};

export const MnemonicCoach: React.FC = () => {
  const { isCoachEnabled, isOpen, activeKana, hideCoach, setCoachEnabled } = useMnemonicCoach();
  const { playSfx, speakJapanese } = useAudio();

  if (!isCoachEnabled) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            setCoachEnabled(true);
            playSfx('click');
          }}
          title="Kitsune Sensei är tystad. Klicka för att aktivera minnestips igen."
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-sumi-900/90 backdrop-blur border border-paper-300 dark:border-sumi-700 shadow-md text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-semibold hover:border-amber-400 transition-all hover:scale-105"
        >
          <span className="text-base">🦊</span>
          <span className="hidden sm:inline">Aktivera Sensei-tips</span>
        </button>
      </div>
    );
  }

  if (!isOpen || !activeKana) {
    return null;
  }

  const handlePlayAudio = () => {
    playSfx('click');
    speakJapanese(activeKana.kana);
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-50 flex items-end sm:items-auto justify-center sm:justify-end p-4 pointer-events-none animate-fadeIn">
      {/* Popover Bubble Container */}
      <div className="pointer-events-auto bg-white dark:bg-sumi-900 rounded-3xl border-2 border-amber-300 dark:border-amber-700/60 shadow-2xl w-full max-w-md sm:w-[420px] overflow-hidden transform transition-all animate-scaleUp">
        
        {/* Top Header with Sensei Profile */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-brand-700 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KitsuneSenseiAvatar size={36} />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white tracking-tight">
                  Kitsune Sensei
                </h3>
                <span className="text-[10px] font-bold bg-white/20 text-amber-100 px-1.5 py-0.2 rounded-full">
                  Minneshjälp
                </span>
              </div>
              <p className="text-[11px] text-amber-100/90 font-medium">
                Ingen fara, vi kikar på minnesregeln! 💡
              </p>
            </div>
          </div>

          <button
            onClick={() => hideCoach(false)}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            title="Stäng tipset"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Target Character Spotlight Tile */}
          <div className="flex items-center justify-between bg-paper-50 dark:bg-sumi-950 p-3.5 rounded-2xl border border-paper-200 dark:border-sumi-800">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-ink-navy dark:bg-brand-bronze text-white dark:text-sumi-950 flex items-center justify-center text-3xl font-jp font-bold shadow-sm">
                {activeKana.kana}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xl font-black text-ink-900 dark:text-white uppercase tracking-wider">
                    {activeKana.romaji}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    ({activeKana.rowNameSv})
                  </span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                  Nyckel: {activeKana.mnemonic.keyCue}
                </p>
              </div>
            </div>

            <button
              onClick={handlePlayAudio}
              className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shadow-2xs group"
              title="Lyssna på uttalet"
            >
              <Volume2 size={18} className="group-hover:animate-pulse" />
              <span className="text-xs font-bold hidden sm:inline">Lyssna</span>
            </button>
          </div>

          {/* Mnemonic Rule Box (SV + EN) */}
          <div className="bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl p-4 border border-amber-200/80 dark:border-amber-900/50 space-y-2.5">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                <Sparkles size={14} className="text-amber-500" />
                <span>🇸🇪 Svensk Minnesbild</span>
              </div>

              <div className="text-sm font-bold text-ink-900 dark:text-amber-100">
                "{activeKana.mnemonic.summary}"
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                {activeKana.mnemonic.storySv}
              </p>
            </div>

            {activeKana.mnemonic.summaryEn && (
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 space-y-0.5">
                <div className="text-xs font-bold text-amber-900/90 dark:text-amber-300">
                  🇬🇧 English: <span className="font-normal italic">"{activeKana.mnemonic.summaryEn}"</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                  {activeKana.mnemonic.storyEn}
                </p>
              </div>
            )}
          </div>

          {/* Pronunciation & Pitfalls */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <span className="font-bold shrink-0 text-brand-600 dark:text-brand-400">🗣️ Uttal:</span>
              <span>{activeKana.pronunciationTipSv} ({activeKana.swedishSimilarSound})</span>
            </div>

            {activeKana.similarSoundPitfall && (
              <div className="flex items-start gap-2 text-amber-800 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/30 px-2.5 py-1.5 rounded-xl border border-amber-200/50 dark:border-amber-900/30">
                <AlertTriangle size={14} className="shrink-0 text-amber-600 mt-0.5" />
                <span><strong>Tips:</strong> {activeKana.similarSoundPitfall}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-paper-200 dark:border-sumi-800">
            <button
              onClick={() => hideCoach(true)}
              className="text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1 underline underline-offset-2 order-2 sm:order-1"
            >
              <EyeOff size={13} />
              <span>Stäng av Sensei-tips</span>
            </button>

            <button
              onClick={() => {
                playSfx('click');
                hideCoach(false);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-sumi-950 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 order-1 sm:order-2"
            >
              <Check size={16} />
              <span>Okej, tack! Fortsätt</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
