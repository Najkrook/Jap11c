import React from 'react';
import { 
  Layers, 
  Sparkles, 
  Printer, 
  BookOpen, 
  HelpCircle
} from 'lucide-react';

export const GrammarQuickReference: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300 dark:border-amber-900">
              Formelblad & Fusklapp
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Grammatisk Snabböversikt
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Ett sammanfattande referensblad över Tae Kims böjningsmönster och partikelregler för snabb repetition.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-paper-100 hover:bg-paper-200 dark:bg-sumi-800 dark:hover:bg-sumi-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-paper-300 dark:border-sumi-700 transition-colors shrink-0"
        >
          <Printer size={15} /> Skriv ut fusklapp
        </button>
      </div>

      {/* 1. Verbböjningsmatris */}
      <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-paper-200 dark:border-sumi-800 pb-3">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={20} className="text-brand-600 dark:text-brand-400" />
            1. Verbböjningarnas Huvudmatris
          </h3>
          <span className="text-xs text-slate-400">Baserat på ordboksform</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-paper-300 dark:border-sumi-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-paper-100 dark:bg-sumi-950 border-b border-paper-300 dark:border-sumi-800 text-slate-700 dark:text-slate-300 font-bold">
                <th className="p-3.5 whitespace-nowrap">Verbtyp</th>
                <th className="p-3.5 whitespace-nowrap">Exempel</th>
                <th className="p-3.5 whitespace-nowrap">Negation (ナイ)</th>
                <th className="p-3.5 whitespace-nowrap">Preteritum (た)</th>
                <th className="p-3.5 whitespace-nowrap">Koppling (て)</th>
                <th className="p-3.5 whitespace-nowrap">Artig (ます)</th>
                <th className="p-3.5 whitespace-nowrap">Potential (kan)</th>
                <th className="p-3.5 whitespace-nowrap">Avsikt (låt oss)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200 dark:divide-sumi-800">
              <tr className="hover:bg-paper-50 dark:hover:bg-sumi-800/40">
                <td className="p-3.5 font-bold text-brand-700 dark:text-brand-300 whitespace-nowrap">
                  Ru-verb (Ichidan)
                </td>
                <td className="p-3.5 font-jp font-semibold text-slate-900 dark:text-white">たべる</td>
                <td className="p-3.5 font-jp text-rose-600 dark:text-rose-400">たべない</td>
                <td className="p-3.5 font-jp text-blue-600 dark:text-blue-400">たべた</td>
                <td className="p-3.5 font-jp text-emerald-600 dark:text-emerald-400">たべて</td>
                <td className="p-3.5 font-jp text-purple-600 dark:text-purple-400">たべます</td>
                <td className="p-3.5 font-jp text-amber-600 dark:text-amber-400">たべられる</td>
                <td className="p-3.5 font-jp text-indigo-600 dark:text-indigo-400">たべよう</td>
              </tr>
              <tr className="hover:bg-paper-50 dark:hover:bg-sumi-800/40">
                <td className="p-3.5 font-bold text-brand-700 dark:text-brand-300 whitespace-nowrap">
                  U-verb: ku (Godan)
                </td>
                <td className="p-3.5 font-jp font-semibold text-slate-900 dark:text-white">かく (skriva)</td>
                <td className="p-3.5 font-jp text-rose-600 dark:text-rose-400">かかない</td>
                <td className="p-3.5 font-jp text-blue-600 dark:text-blue-400">かいた</td>
                <td className="p-3.5 font-jp text-emerald-600 dark:text-emerald-400">かいて</td>
                <td className="p-3.5 font-jp text-purple-600 dark:text-purple-400">かきます</td>
                <td className="p-3.5 font-jp text-amber-600 dark:text-amber-400">かける</td>
                <td className="p-3.5 font-jp text-indigo-600 dark:text-indigo-400">かこう</td>
              </tr>
              <tr className="hover:bg-paper-50 dark:hover:bg-sumi-800/40">
                <td className="p-3.5 font-bold text-brand-700 dark:text-brand-300 whitespace-nowrap">
                  U-verb: mu/bu (Godan)
                </td>
                <td className="p-3.5 font-jp font-semibold text-slate-900 dark:text-white">のむ (dricka)</td>
                <td className="p-3.5 font-jp text-rose-600 dark:text-rose-400">のまない</td>
                <td className="p-3.5 font-jp text-blue-600 dark:text-blue-400">のんだ</td>
                <td className="p-3.5 font-jp text-emerald-600 dark:text-emerald-400">のんで</td>
                <td className="p-3.5 font-jp text-purple-600 dark:text-purple-400">のみます</td>
                <td className="p-3.5 font-jp text-amber-600 dark:text-amber-400">のめる</td>
                <td className="p-3.5 font-jp text-indigo-600 dark:text-indigo-400">のもう</td>
              </tr>
              <tr className="hover:bg-paper-50 dark:hover:bg-sumi-800/40">
                <td className="p-3.5 font-bold text-brand-700 dark:text-brand-300 whitespace-nowrap">
                  U-verb: su (Godan)
                </td>
                <td className="p-3.5 font-jp font-semibold text-slate-900 dark:text-white">はなす (tala)</td>
                <td className="p-3.5 font-jp text-rose-600 dark:text-rose-400">はなさない</td>
                <td className="p-3.5 font-jp text-blue-600 dark:text-blue-400">はなした</td>
                <td className="p-3.5 font-jp text-emerald-600 dark:text-emerald-400">はなして</td>
                <td className="p-3.5 font-jp text-purple-600 dark:text-purple-400">はなします</td>
                <td className="p-3.5 font-jp text-amber-600 dark:text-amber-400">はなせる</td>
                <td className="p-3.5 font-jp text-indigo-600 dark:text-indigo-400">はなそう</td>
              </tr>
              <tr className="hover:bg-paper-50 dark:hover:bg-sumi-800/40 bg-amber-50/40 dark:bg-amber-950/20">
                <td className="p-3.5 font-bold text-amber-800 dark:text-amber-300 whitespace-nowrap">
                  Oregelbunden: する
                </td>
                <td className="p-3.5 font-jp font-semibold text-slate-900 dark:text-white">する (göra)</td>
                <td className="p-3.5 font-jp text-rose-600 dark:text-rose-400">しない</td>
                <td className="p-3.5 font-jp text-blue-600 dark:text-blue-400">した</td>
                <td className="p-3.5 font-jp text-emerald-600 dark:text-emerald-400">して</td>
                <td className="p-3.5 font-jp text-purple-600 dark:text-purple-400">します</td>
                <td className="p-3.5 font-jp text-amber-600 dark:text-amber-400">できる</td>
                <td className="p-3.5 font-jp text-indigo-600 dark:text-indigo-400">しよう</td>
              </tr>
              <tr className="hover:bg-paper-50 dark:hover:bg-sumi-800/40 bg-amber-50/40 dark:bg-amber-950/20">
                <td className="p-3.5 font-bold text-amber-800 dark:text-amber-300 whitespace-nowrap">
                  Oregelbunden: くる
                </td>
                <td className="p-3.5 font-jp font-semibold text-slate-900 dark:text-white">くる (komma)</td>
                <td className="p-3.5 font-jp text-rose-600 dark:text-rose-400">こない</td>
                <td className="p-3.5 font-jp text-blue-600 dark:text-blue-400">きた</td>
                <td className="p-3.5 font-jp text-emerald-600 dark:text-emerald-400">きて</td>
                <td className="p-3.5 font-jp text-purple-600 dark:text-purple-400">きます</td>
                <td className="p-3.5 font-jp text-amber-600 dark:text-amber-400">こられる</td>
                <td className="p-3.5 font-jp text-indigo-600 dark:text-indigo-400">こよう</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Adjektiv och Vara-tillstånd */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adjektiv */}
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-7 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-4">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            2. Adjektivens böjningar
          </h3>
          <div className="space-y-3 text-xs">
            <div className="bg-paper-50 dark:bg-sumi-950 p-4 rounded-2xl border border-paper-200 dark:border-sumi-800 space-y-2">
              <div className="font-bold text-brand-700 dark:text-brand-300">
                い-adjektiv (t.ex. たかい / takai):
              </div>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                <li>• Presens: <span className="font-jp font-bold">たかい</span> (Är dyr)</li>
                <li>• Negation: <span className="font-jp font-bold text-rose-600">たかくない</span> (Är inte dyr)</li>
                <li>• Dåtid: <span className="font-jp font-bold text-blue-600">たかかった</span> (Var dyr)</li>
                <li>• Dåtid neg: <span className="font-jp font-bold text-purple-600">たかくなかった</span> (Var inte dyr)</li>
              </ul>
            </div>

            <div className="bg-paper-50 dark:bg-sumi-950 p-4 rounded-2xl border border-paper-200 dark:border-sumi-800 space-y-2">
              <div className="font-bold text-brand-700 dark:text-brand-300">
                な-adjektiv (t.ex. しずか / shizuka):
              </div>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                <li>• Före substantiv: <span className="font-jp font-bold text-emerald-600">しずか な へや</span> (Tyst rum)</li>
                <li>• Presens: <span className="font-jp font-bold">しずか だ / です</span> (Är tyst)</li>
                <li>• Negation: <span className="font-jp font-bold text-rose-600">しずか じゃない</span> (Är inte tyst)</li>
                <li>• Dåtid: <span className="font-jp font-bold text-blue-600">しずか だった</span> (Var tyst)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Partikelsammanfattning */}
        <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-7 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-4">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-500" />
            3. Partiklarnas Huvudroller
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-950 border border-paper-200 dark:border-sumi-800">
              <span className="font-bold font-jp text-brand-700 dark:text-brand-300">は (wa)</span>: Samtalsämne / Tema
            </div>
            <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-950 border border-paper-200 dark:border-sumi-800">
              <span className="font-bold font-jp text-brand-700 dark:text-brand-300">が (ga)</span>: Identifierare / Subjekt
            </div>
            <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-950 border border-paper-200 dark:border-sumi-800">
              <span className="font-bold font-jp text-brand-700 dark:text-brand-300">を (o)</span>: Direkt objekt
            </div>
            <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-950 border border-paper-200 dark:border-sumi-800">
              <span className="font-bold font-jp text-brand-700 dark:text-brand-300">に (ni)</span>: Mål / Tidpunkt / Statisk plats
            </div>
            <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-950 border border-paper-200 dark:border-sumi-800">
              <span className="font-bold font-jp text-brand-700 dark:text-brand-300">で (de)</span>: Plats för handling / Redskap
            </div>
            <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-950 border border-paper-200 dark:border-sumi-800">
              <span className="font-bold font-jp text-brand-700 dark:text-brand-300">へ (e)</span>: Rörelseriktning mot
            </div>
            <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-950 border border-paper-200 dark:border-sumi-800">
              <span className="font-bold font-jp text-brand-700 dark:text-brand-300">と (to)</span>: Komplett "och" / Tillsammans med
            </div>
            <div className="p-2.5 rounded-xl bg-paper-50 dark:bg-sumi-950 border border-paper-200 dark:border-sumi-800">
              <span className="font-bold font-jp text-brand-700 dark:text-brand-300">の (no)</span>: Ägande & Substantivlänk
            </div>
          </div>
        </div>
      </div>

      {/* 4. De 4 Villkorsformerna i ett nötskal */}
      <div className="bg-white dark:bg-sumi-900 rounded-3xl p-6 sm:p-8 border border-paper-300 dark:border-sumi-800 shadow-xs space-y-4">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle size={20} className="text-brand-600 dark:text-brand-400" />
          4. De 4 Villkorsformerna ("Om / När")
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-paper-50 dark:bg-sumi-950 border border-paper-300 dark:border-sumi-800 space-y-2">
            <div className="font-bold font-jp text-base text-brand-700 dark:text-brand-300">
              と (to)
            </div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Naturlig / Fysisk följd
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Oundvikligt samband ("om man trycker på knappen startar motorn"). Kan INTE ta uppmaningar.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-paper-50 dark:bg-sumi-950 border border-paper-300 dark:border-sumi-800 space-y-2">
            <div className="font-bold font-jp text-base text-brand-700 dark:text-brand-300">
              ば (ba)
            </div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Hypotetiskt villkor
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Fokus på förutsättningen: "Om bara detta är uppfyllt, då...".
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-paper-50 dark:bg-sumi-950 border border-paper-300 dark:border-sumi-800 space-y-2">
            <div className="font-bold font-jp text-base text-brand-700 dark:text-brand-300">
              たら (tara)
            </div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Sekventiellt ("Efter att")
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Det mest mångsidiga i talspråk. Tar utan problem uppmaningar och böner ("Ring när du kommer!").
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-paper-50 dark:bg-sumi-950 border border-paper-300 dark:border-sumi-800 space-y-2">
            <div className="font-bold font-jp text-base text-brand-700 dark:text-brand-300">
              なら (nara)
            </div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Kontextuellt villkor
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Bygger på vad samtalspartnern just sa: "Om det är just DET du menar, så...".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
