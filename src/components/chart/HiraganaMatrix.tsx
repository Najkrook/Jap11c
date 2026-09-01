import React, { useState } from 'react';
import { 
  Grid3X3, 
  Search, 
  Check, 
  BookOpen
} from 'lucide-react';
import type { KanaCharacter, SrsItemData } from '../../types/kana';
import { HIRAGANA_DATA } from '../../data/hiraganaData';
import { AudioButton } from '../common/AudioButton';
import { KanaModal } from './KanaModal';
import { sfx } from '../../utils/audio';
import { useProgression } from '../../context/ProgressionContext';

interface HiraganaMatrixProps {
  kanaProgress?: Record<string, SrsItemData>;
  onStartSrsWithKana?: (kanaList: KanaCharacter[]) => void;
}

export const HiraganaMatrix: React.FC<HiraganaMatrixProps> = ({
  kanaProgress: propKanaProgress
}) => {
  const { stats } = useProgression();
  const kanaProgress = propKanaProgress || stats.kanaProgress;
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'gojuon' | 'dakuon' | 'yoon' | 'week1' | 'week2'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKana, setActiveKana] = useState<KanaCharacter | null>(null);

  // Filter kana based on selection and search
  const filteredKana = HIRAGANA_DATA.filter((k) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchRomaji = k.romaji.toLowerCase().includes(q);
      const matchKana = k.kana.includes(q);
      const matchSwedish = k.mnemonic.summary.toLowerCase().includes(q) || k.mnemonic.storySv.toLowerCase().includes(q);
      if (!matchRomaji && !matchKana && !matchSwedish) return false;
    }

    // Group filter
    if (selectedGroup === 'gojuon') return k.group === 'gojuon';
    if (selectedGroup === 'dakuon') return k.group === 'dakuon' || k.group === 'handakuon';
    if (selectedGroup === 'yoon') return k.group === 'yoon';
    if (selectedGroup === 'week1') return k.japc11Week === 1;
    if (selectedGroup === 'week2') return k.japc11Week === 2;

    return true;
  });

  const getStatus = (id: string): 'new' | 'learning' | 'review' | 'mastered' => {
    return kanaProgress[id]?.status || 'new';
  };

  // Calculate quick stats
  const totalCount = HIRAGANA_DATA.length;
  const masteredCount = HIRAGANA_DATA.filter(k => getStatus(k.id) === 'mastered').length;
  const learningCount = HIRAGANA_DATA.filter(k => getStatus(k.id) === 'learning' || getStatus(k.id) === 'review').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 dark:from-sumi-900 dark:to-sumi-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-brand-bronze/30 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-10 text-[180px] font-jp font-bold pointer-events-none select-none">
          あ
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-brand-bronze/30 text-brand-gold text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-brand-bronze/50 flex items-center gap-1">
                <BookOpen size={14} /> Teckenguide
              </span>
              <span className="text-slate-300 text-xs font-medium">
                71+ Tecken & Kombinationer
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Interaktiv 50-Ljudstabell (Gojūon)
            </h1>
            <p className="text-slate-200 text-sm mt-2 max-w-2xl leading-relaxed">
              Klicka på valfritt tecken för att se dess <strong>svenska mnemoteknik</strong>, animerade <strong>streckordning</strong>, träna på <strong>ritbrädan</strong> och lyssna på naturligt uttal.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/10 dark:bg-sumi-800/60 backdrop-blur rounded-2xl p-4 border border-white/15 shrink-0 flex gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-emerald-400">{masteredCount}</div>
              <div className="text-[11px] text-slate-300 font-medium">Bemästrade</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div>
              <div className="text-2xl font-black text-amber-400">{learningCount}</div>
              <div className="text-[11px] text-slate-300 font-medium">Lär sig</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div>
              <div className="text-2xl font-black text-slate-300">{totalCount - masteredCount - learningCount}</div>
              <div className="text-[11px] text-slate-300 font-medium">Kvar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-sumi-900 p-4 rounded-2xl border border-slate-200 dark:border-sumi-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Alla (71)' },
            { id: 'week1', label: 'Etapp 1 (A-Na)' },
            { id: 'week2', label: 'Etapp 2 (Ha-N & ゛)' },
            { id: 'gojuon', label: 'Baskana (46)' },
            { id: 'dakuon', label: 'Dakuten ゛゜(25)' },
            { id: 'yoon', label: 'Kombinationer (Yōon)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedGroup(tab.id as any);
                sfx.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedGroup === tab.id
                  ? 'bg-brand-600 text-white shadow-xs dark:bg-brand-bronze dark:text-sumi-950'
                  : 'bg-slate-100 dark:bg-sumi-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-sumi-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök tecken, romaji eller minnesbild..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-sumi-950 border border-slate-200 dark:border-sumi-700 focus:outline-none focus:ring-2 focus:ring-brand-bronze text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Grid of Hiragana Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {filteredKana.map((item) => {
          const status = getStatus(item.id);
          const isMastered = status === 'mastered';
          const isLearning = status === 'learning' || status === 'review';

          return (
            <div
              key={item.id}
              onClick={() => {
                setActiveKana(item);
                sfx.playClick();
              }}
              className={`group cursor-pointer bg-white dark:bg-sumi-900 rounded-2xl p-4 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden flex flex-col justify-between ${
                isMastered
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/10'
                  : isLearning
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/10'
                  : 'border-slate-200 dark:border-sumi-800 hover:border-brand-bronze'
              }`}
            >
              {/* Top Row: Romaji & Status pill */}
              <div className="flex justify-between items-start">
                <span className="font-mono text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {item.romaji}
                </span>

                <div className="flex items-center gap-1">
                  {isMastered && (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-[10px]" title="Bemästrad">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                  {isLearning && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Lär dig"></span>
                  )}
                  <AudioButton text={item.kana} size="sm" />
                </div>
              </div>

              {/* Center: Big Hiragana Character */}
              <div className="my-2 text-center">
                <div className="font-jp text-5xl font-extrabold text-slate-900 dark:text-white group-hover:scale-110 transition-transform duration-200">
                  {item.kana}
                </div>
              </div>

              {/* Bottom: Mnemonic Preview */}
              <div className="pt-2 border-t border-slate-100 dark:border-sumi-800/80">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={item.mnemonic.summary}>
                  💡 {item.mnemonic.summary}
                </p>
                <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
                  <span>{item.strokeCount} streck</span>
                  <span className="text-brand-600 dark:text-brand-gold font-medium">Etapp {item.japc11Week}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No results notice */}
      {filteredKana.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-sumi-900 rounded-2xl border border-slate-200 dark:border-sumi-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Inga tecken matchade sökningen "{searchQuery}".
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold"
          >
            Återställ sökning
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {activeKana && (
        <KanaModal
          kana={activeKana}
          srsData={kanaProgress[activeKana.id]}
          onClose={() => setActiveKana(null)}
        />
      )}
    </div>
  );
};
