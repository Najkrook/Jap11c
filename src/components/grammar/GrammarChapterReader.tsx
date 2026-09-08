import React, { useState } from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle,
  BookOpen,
  Volume2
} from 'lucide-react';
import type { GrammarChapter } from '../../types/grammar';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';

interface GrammarChapterReaderProps {
  chapter: GrammarChapter;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const GrammarChapterReader: React.FC<GrammarChapterReaderProps> = ({
  chapter,
  isCompleted,
  onToggleComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}) => {
  const { playSfx } = useAudio();
  const [showRomaji, setShowRomaji] = useState(true);
  const [showFurigana, setShowFurigana] = useState(true);
  
  // Quiz state for this chapter: record selected answer per question id
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const handleSelectAnswer = (qId: string, optionIndex: number, correctIndex: number) => {
    if (selectedAnswers[qId] !== undefined) return; // already answered
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    if (optionIndex === correctIndex) {
      playSfx('correct');
    } else {
      playSfx('wrong');
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = chapter.miniQuiz.filter(q => selectedAnswers[q.id] === q.correctIndex).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Chapter Top Bar & Reading Controls */}
      <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-paper-200 dark:border-sumi-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-brand-200 dark:border-brand-900/60">
                Kapitel {chapter.chapterNumber}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {chapter.readingTimeMin} min läsning
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
              {chapter.titleSv}
            </h1>
            <p className="text-xs sm:text-sm font-jp font-semibold text-slate-500 dark:text-slate-400">
              {chapter.titleJap} • <span className="font-sans font-normal italic">{chapter.romajiTitle}</span>
            </p>
          </div>

          {/* Action buttons: Mark Complete + Display Toggles */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              onClick={() => {
                onToggleComplete();
                playSfx(isCompleted ? 'click' : 'coin');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 ${
                isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs'
                  : 'bg-paper-100 hover:bg-paper-200 dark:bg-sumi-800 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 border border-paper-300 dark:border-sumi-700'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                  Avklarat kapitel
                </>
              ) : (
                <>
                  <Circle size={16} className="text-slate-400" />
                  Markera som läst
                </>
              )}
            </button>
          </div>
        </div>

        {/* View toggles: Romaji & Furigana */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            {chapter.summarySv}
          </p>
          <div className="flex items-center gap-2 bg-paper-100 dark:bg-sumi-800/80 p-1.5 rounded-xl border border-paper-300 dark:border-sumi-700">
            <button
              onClick={() => setShowFurigana(!showFurigana)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                showFurigana
                  ? 'bg-white dark:bg-sumi-900 text-brand-700 dark:text-brand-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Kana-läsning: {showFurigana ? 'På' : 'Av'}
            </button>
            <button
              onClick={() => setShowRomaji(!showRomaji)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                showRomaji
                  ? 'bg-white dark:bg-sumi-900 text-brand-700 dark:text-brand-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Romaji: {showRomaji ? 'På' : 'Av'}
            </button>
          </div>
        </div>

        {/* Tae Kim's Core Insight Card */}
        <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-900/60 rounded-2xl p-5 sm:p-6 space-y-2.5 relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-sm sm:text-base">
            <div className="w-8 h-8 rounded-xl bg-amber-200 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0">
              <Lightbulb size={18} />
            </div>
            <span>Tae Kims gyllene tankemodell</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-amber-100 leading-relaxed font-medium pl-10">
            {chapter.taeKimCoreInsightSv}
          </p>
        </div>

        {/* Quick rule formula */}
        {chapter.ruleFormula && (
          <div className="bg-slate-50 dark:bg-sumi-950 border border-dashed border-slate-300 dark:border-sumi-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Kärnformel:
            </span>
            <code className="text-xs sm:text-sm font-mono font-bold text-brand-700 dark:text-brand-gold bg-white dark:bg-sumi-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-sumi-700">
              {chapter.ruleFormula}
            </code>
          </div>
        )}
      </div>

      {/* Comparison Box (if present) */}
      {chapter.comparisonBox && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {chapter.comparisonBox.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {chapter.comparisonBox.summarySv}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {chapter.comparisonBox.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-paper-50 dark:bg-sumi-950 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-bold font-jp text-brand-700 dark:text-brand-300">
                    {item.term}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-paper-200 dark:bg-sumi-800 text-slate-700 dark:text-slate-300">
                    {item.roleSv}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.nuanceSv}
                </p>
                <div className="bg-white dark:bg-sumi-900 p-3 rounded-xl border border-paper-200 dark:border-sumi-800 text-xs space-y-1">
                  <div className="font-jp font-medium text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{item.exampleKana}</span>
                    <AudioButton text={item.exampleKana} size="sm" />
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] italic">
                    {item.exampleSv}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Chapter Sections */}
      <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-paper-200 dark:border-sumi-800 pb-3">
          <BookOpen size={20} className="text-brand-600 dark:text-brand-400" />
          Lektionsgenomgång
        </h2>

        <div className="space-y-6">
          {chapter.sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {sec.heading}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {sec.contentSv}
              </p>

              {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                <ul className="space-y-2 pt-1 pl-2">
                  {sec.bulletPoints.map((bp, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.subnoteSv && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-sumi-950 border-l-4 border-brand-500 text-xs text-slate-600 dark:text-slate-400 italic">
                  {sec.subnoteSv}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inflection Table (when present) */}
      {chapter.inflectionTable && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {chapter.inflectionTable.title}
            </h2>
            {chapter.inflectionTable.descriptionSv && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {chapter.inflectionTable.descriptionSv}
              </p>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-paper-300 dark:border-sumi-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper-100 dark:bg-sumi-950 border-b border-paper-300 dark:border-sumi-800 text-slate-700 dark:text-slate-300 font-bold">
                  {chapter.inflectionTable.headers.map((h, hIdx) => (
                    <th key={hIdx} className="p-3.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                  {chapter.inflectionTable.rows.some(r => r.noteSv) && (
                    <th className="p-3.5 whitespace-nowrap">Kommentar</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200 dark:divide-sumi-800">
                {chapter.inflectionTable.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-paper-50 dark:hover:bg-sumi-800/50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {row.label}
                    </td>
                    <td className="p-3.5 font-jp font-semibold text-brand-700 dark:text-brand-300 whitespace-nowrap">
                      {row.plainPositive}
                    </td>
                    {row.plainNegative !== '-' && (
                      <td className="p-3.5 font-jp font-semibold text-rose-700 dark:text-rose-400 whitespace-nowrap">
                        {row.plainNegative}
                      </td>
                    )}
                    {row.politePositive && (
                      <td className="p-3.5 font-jp font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {row.politePositive}
                      </td>
                    )}
                    {row.politeNegative && (
                      <td className="p-3.5 font-jp font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {row.politeNegative}
                      </td>
                    )}
                    {row.noteSv && (
                      <td className="p-3.5 text-slate-500 dark:text-slate-400 italic">
                        {row.noteSv}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rich Examples with AudioButton and Literal Breakdown */}
      <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Volume2 size={20} className="text-brand-600 dark:text-brand-400" />
            Autentiska exempelmeningar
          </h2>
          <span className="text-xs text-slate-400">Klicka på högtalaren för att lyssna</span>
        </div>

        <div className="space-y-4 pt-1">
          {chapter.examples.map((ex, idx) => (
            <div
              key={idx}
              className="bg-paper-50 dark:bg-sumi-950 p-5 rounded-2xl border border-paper-300 dark:border-sumi-800 hover:border-brand-400 dark:hover:border-brand-600 transition-colors space-y-2.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  {showFurigana && (
                    <div className="text-xs font-jp text-slate-500 dark:text-slate-400">
                      {ex.furigana}
                    </div>
                  )}
                  <div className="text-lg sm:text-xl font-jp font-bold text-slate-900 dark:text-white">
                    {ex.japanese}
                  </div>
                  {showRomaji && (
                    <div className="text-xs text-brand-600 dark:text-brand-300 font-mono">
                      {ex.romaji}
                    </div>
                  )}
                </div>

                <AudioButton text={ex.audioText} size="md" variant="secondary" />
              </div>

              <div className="pt-2 border-t border-paper-200 dark:border-sumi-800 space-y-1">
                <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {ex.translationSv}
                </div>
                {ex.literalSv && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 italic">
                    <span className="font-sans font-bold not-italic uppercase tracking-wider text-[9px] bg-paper-200 dark:bg-sumi-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      Oragrann satslogik:
                    </span>
                    <span>{ex.literalSv}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Pitfalls / Fällor */}
      {chapter.commonPitfallsSv && chapter.commonPitfallsSv.length > 0 && (
        <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 sm:p-7 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-extrabold text-sm sm:text-base">
            <AlertTriangle size={20} className="text-rose-500 shrink-0" />
            Vanliga fällor för svenska inlärare:
          </div>
          <div className="space-y-2 pt-1 pl-2">
            {chapter.commonPitfallsSv.map((pitfall, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-rose-100">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>{pitfall}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Mini-Quiz */}
      {chapter.miniQuiz && chapter.miniQuiz.length > 0 && (
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-paper-200 dark:border-sumi-800 pb-4">
            <div className="space-y-0.5">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={20} className="text-brand-600 dark:text-brand-400" />
                Självtest: Testa din förståelse
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Svara på frågorna för att kontrollera att du har greppat Tae Kims principer.
              </p>
            </div>
            {answeredCount > 0 && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-paper-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-300">
                {correctCount} / {chapter.miniQuiz.length} rätt
              </span>
            )}
          </div>

          <div className="space-y-6">
            {chapter.miniQuiz.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div
                  key={q.id}
                  className="bg-paper-50 dark:bg-sumi-950 p-5 sm:p-6 rounded-2xl border border-paper-300 dark:border-sumi-800 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {q.questionSv}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-white dark:bg-sumi-900 hover:bg-paper-100 dark:hover:bg-sumi-800 text-slate-700 dark:text-slate-200 border-paper-300 dark:border-sumi-700';

                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-xs';
                        } else if (optIdx === selectedOpt) {
                          btnStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
                        } else {
                          btnStyle = 'bg-paper-100 dark:bg-sumi-900 text-slate-400 dark:text-slate-600 opacity-60 border-paper-200 dark:border-sumi-800';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectAnswer(q.id, optIdx, q.correctIndex)}
                          className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && optIdx === q.correctIndex && (
                            <CheckCircle2 size={16} className="text-white shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-sumi-900 border border-paper-300 dark:border-sumi-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="font-bold text-brand-700 dark:text-brand-300">
                        {selectedOpt === q.correctIndex ? 'Rätt svar!' : 'Förklaring:'}
                      </div>
                      <p className="leading-relaxed">{q.explanationSv}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chapter Footer Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-paper-300 dark:border-sumi-800">
        {hasPrevious && onPrevious ? (
          <button
            onClick={() => {
              onPrevious();
              playSfx('click');
            }}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-paper-100 dark:bg-sumi-900 dark:hover:bg-sumi-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-paper-300 dark:border-sumi-800 shadow-xs flex items-center gap-2 transition-transform active:scale-95"
          >
            <ChevronLeft size={18} />
            Föregående kapitel
          </button>
        ) : <div />}

        {hasNext && onNext ? (
          <button
            onClick={() => {
              onNext();
              playSfx('click');
            }}
            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            Nästa kapitel
            <ChevronRight size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60">
            <Sparkles size={16} /> Du har nått slutet på guiden!
          </div>
        )}
      </div>
    </div>
  );
};
