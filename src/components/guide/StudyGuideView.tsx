import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Lightbulb, 
  MessageSquare, 
  Printer, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { COURSE_INFO, CLASSROOM_PHRASES, STUDY_ROADMAP } from '../../data/genkiVocab';
import { AudioButton } from '../common/AudioButton';
import { useAudio } from '../../modules/audio';

const STORAGE_KEY = 'hiraganaskolan_studyguide_tasks_v1';

export const StudyGuideView: React.FC = () => {
  const { playSfx } = useAudio();
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
    } catch (e) {
      console.warn('Failed to save studyguide tasks', e);
    }
  }, [completedTasks]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      playSfx('click');
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-sumi-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-bronze/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/15 backdrop-blur text-sakura-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 flex items-center gap-1.5">
                <BookOpen size={14} /> Studieguide & Kursstöd
              </span>
              <span className="text-xs text-slate-300 font-medium">Genki I (3rd Edition)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Japanska för Nybörjare: Studieplan & Fraser
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {COURSE_INFO.description}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 shrink-0 transition-colors"
          >
            <Printer size={15} /> Skriv ut studieguide
          </button>
        </div>
      </div>

      {/* Tae Kim Grammar Cross-Link Banner */}
      <div className="bg-gradient-to-r from-brand-50 to-indigo-50/60 dark:from-brand-950/40 dark:to-indigo-950/30 border border-brand-200 dark:border-brand-900/60 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            📖
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Söker du Tae Kims Grammatikguide?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Gå igenom alla 22 kapitel med japansk satslogik, verbböjningar, ljudexempel och miniquiz.
            </p>
          </div>
        </div>
        <Link
          to="/grammar"
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 shrink-0 transition-colors shadow-xs"
        >
          Öppna Grammatikguiden <ArrowRight size={14} />
        </Link>
      </div>

      {/* Survival Tips */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-sm sm:text-base">
          <Lightbulb className="text-amber-500" size={20} />
          4 Gyllene Råd för att lyckas med japanskan:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {COURSE_INFO.tipsForStudents.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-sumi-900/80 p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold flex items-center justify-center shrink-0 text-[11px]">
                {idx + 1}
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Study Roadmap */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-brand-600 dark:text-brand-gold" size={22} />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Rekommenderad Studieplan & Checklista
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {STUDY_ROADMAP.map((week) => (
            <div
              key={week.weekNumber}
              className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-sumi-800 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-sumi-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-gold uppercase tracking-wider">
                    {week.dates}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {week.title}
                  </h3>
                </div>
                <span className="bg-slate-100 dark:bg-sumi-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {week.genkiChapter}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {week.focus}
              </p>

              {/* Kana tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-bold text-slate-400 mr-1">Tecken:</span>
                {week.kanaCovered.map((k, i) => (
                  <span
                    key={i}
                    className="font-jp text-xs bg-slate-100 dark:bg-sumi-800 px-2 py-0.5 rounded-md font-bold text-slate-800 dark:text-slate-200"
                  >
                    {k}
                  </span>
                ))}
              </div>

              {/* Task Checklist */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Checklista:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {week.tasks.map((task) => {
                    const isDone = !!completedTasks[task.id];
                    return (
                      <label
                        key={task.id}
                        className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-3 text-xs ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 line-through'
                            : 'bg-slate-50 dark:bg-sumi-950 border-slate-200 dark:border-sumi-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="font-medium">{task.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classroom Phrases Bank */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-brand-600 dark:text-brand-gold" size={22} />
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Viktiga Klassrumsfraser
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fraser och hälsningar som är bra att kunna under lektioner och gruppövningar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CLASSROOM_PHRASES.map((phrase) => (
            <div
              key={phrase.id}
              className="bg-white dark:bg-sumi-900 p-5 rounded-2xl border border-slate-200 dark:border-sumi-800 shadow-xs flex flex-col justify-between space-y-3 hover:border-brand-bronze transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-jp text-lg font-bold text-slate-900 dark:text-white">
                    {phrase.japanese}
                  </div>
                  <div className="font-mono text-xs text-brand-600 dark:text-brand-gold font-semibold mt-0.5">
                    {phrase.romaji}
                  </div>
                </div>
                <AudioButton text={phrase.japanese} size="sm" variant="secondary" />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-sumi-800 text-xs">
                <p className="text-slate-800 dark:text-slate-200 font-semibold">
                  🇸🇪 {phrase.swedish}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 italic">
                  💡 {phrase.context}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
