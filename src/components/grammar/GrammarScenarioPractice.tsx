import { useState } from 'react';
import { GRAMMAR_PRACTICE, isGrammarAnswerCorrect } from '../../data/grammarPracticeData';
import { useAudio } from '../../modules/audio';
import { AudioButton } from '../common/AudioButton';

interface Attempt {
  correct: boolean;
  usedHint: boolean;
}

export function GrammarScenarioPractice({ chapterId }: { chapterId: string }) {
  const scenario = GRAMMAR_PRACTICE[chapterId];
  const { playSfx } = useAudio();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [hints, setHints] = useState<Record<number, boolean>>({});
  const [attempts, setAttempts] = useState<Record<number, Attempt>>({});
  if (!scenario) return null;

  const completed = Object.keys(attempts).length;
  const correct = Object.values(attempts).filter(attempt => attempt.correct).length;
  const independent = Object.values(attempts).filter(attempt => attempt.correct && !attempt.usedHint).length;
  const reset = (onlyMissed: boolean) => {
    const keep = (index: number) => onlyMissed && attempts[index]?.correct;
    setAnswers(previous => Object.fromEntries(Object.entries(previous).filter(([index]) => keep(Number(index)))));
    setHints(previous => Object.fromEntries(Object.entries(previous).filter(([index]) => keep(Number(index)))));
    setAttempts(previous => Object.fromEntries(Object.entries(previous).filter(([index]) => keep(Number(index)))));
  };

  return (
    <section aria-labelledby="scenario-heading" className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">Praktisk träning · {scenario.tasks.length} skrivuppgifter</p>
        <h2 id="scenario-heading" className="text-xl font-extrabold text-slate-900 dark:text-white">{scenario.titleSv}</h2>
        <p className="text-sm text-slate-700 dark:text-slate-300">{scenario.contextSv}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Ordlista: {scenario.vocabularySv}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Skriv med kana, kanji eller romaji enligt uppgiftens ord och form. Mellanslag och meningsskiljetecken påverkar inte rättningen. Facit visas efter ditt svar.</p>
      </div>

      <div className="space-y-4">
        {scenario.tasks.map((task, index) => {
          const attempt = attempts[index];
          const inputId = `${chapterId}-practice-${index}`;
          return (
            <form key={inputId} className="p-5 rounded-2xl bg-paper-50 dark:bg-sumi-950 border border-paper-300 dark:border-sumi-800 space-y-3" onSubmit={event => {
              event.preventDefault();
              if (attempt || !answers[index]?.trim()) return;
              const isCorrect = isGrammarAnswerCorrect(answers[index], task.answers);
              setAttempts(previous => ({ ...previous, [index]: { correct: isCorrect, usedHint: !!hints[index] } }));
              playSfx(isCorrect ? 'correct' : 'wrong');
            }}>
              <label htmlFor={inputId} className="block text-sm font-bold text-slate-900 dark:text-white">{index + 1}. {task.promptSv}</label>
              <input id={inputId} value={answers[index] ?? ''} disabled={!!attempt} autoComplete="off" autoCapitalize="off" spellCheck={false}
                onKeyDown={event => { if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault(); }}
                onChange={event => setAnswers(previous => ({ ...previous, [index]: event.target.value }))}
                className="w-full min-w-0 rounded-xl border border-paper-300 dark:border-sumi-700 bg-white dark:bg-sumi-900 px-4 py-3 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70"
                placeholder="Skriv ditt svar…" aria-describedby={hints[index] ? `${inputId}-hint` : undefined} />
              {!attempt && <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={!answers[index]?.trim()} className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold disabled:opacity-40">Kontrollera svar</button>
                <button type="button" aria-expanded={!!hints[index]} aria-controls={`${inputId}-hint`} onClick={() => setHints(previous => ({ ...previous, [index]: true }))} className="px-3 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-300">Visa ledtråd</button>
              </div>}
              {hints[index] && <p id={`${inputId}-hint`} className="text-sm text-amber-800 dark:text-amber-200">Ledtråd: {task.hintSv}</p>}
              <div aria-live="polite">
                {attempt && <div className={`rounded-xl p-4 space-y-2 border ${attempt.correct ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'}`}>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{attempt.correct ? (attempt.usedHint ? 'Rätt med ledtråd!' : 'Rätt på egen hand!') : 'Svaret matchar inte facit ännu.'}</p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-jp text-lg text-slate-900 dark:text-white">{task.answers[0]}</p>
                    <AudioButton text={task.answers[0]} size="sm" />
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{task.explanationSv}</p>
                  {!attempt.correct && <p className="text-xs text-slate-600 dark:text-slate-400">Rättningen jämför med förberedda svar. Andra formuleringar kan vara möjliga; följ uppgiftens angivna ord och form.</p>}
                </div>}
              </div>
            </form>
          );
        })}
      </div>
      <div className="border-t border-paper-200 dark:border-sumi-800 pt-4 space-y-3">
        <p role="status" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{completed} / {scenario.tasks.length} besvarade · {correct} rätt · {independent} utan ledtråd</p>
        {completed === scenario.tasks.length && <div className="flex flex-wrap gap-3">
          {correct < completed && <button type="button" onClick={() => reset(true)} className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-bold">Öva på missarna</button>}
          <button type="button" onClick={() => reset(false)} className="px-4 py-2.5 rounded-xl border border-paper-300 dark:border-sumi-700 text-sm font-bold text-slate-700 dark:text-slate-200">Gör om alla skrivuppgifter</button>
        </div>}
        <p className="text-xs text-slate-500 dark:text-slate-400">Resultatet gäller denna övningsomgång och återställs när du byter kapitel.</p>
      </div>
    </section>
  );
}
