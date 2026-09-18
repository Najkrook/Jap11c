import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera, ImagePlus, Volume2, Check, ArrowRight, LoaderCircle } from 'lucide-react';
import { useAudio } from '../../modules/audio';
import { useProgression } from '../../context/progressionState';
import { enrichScannedWord, normalizeQuery, type DictionaryLookupResult } from '../../services/dictionaryLookup';
import { getJapaneseWordCandidates, recognizeJapaneseImage, validateOcrFile, type OcrProgress, type TextDirection } from '../../services/japaneseOcr';
import type { CustomFlashcard } from '../../types/anki';

interface QuickAddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardSaved?: (card: CustomFlashcard) => void;
}

const fieldClass = 'w-full rounded-xl border border-paper-300 dark:border-sumi-700 bg-white dark:bg-sumi-950 px-3 py-2.5 text-base text-ink-900 dark:text-white outline-hidden focus:border-amber-500 disabled:opacity-50';
const labelClass = 'block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5';
const japaneseText = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;

// A fresh session on each open. Closing disposes the OCR task and its draft.
export function QuickAddWordModal(props: QuickAddWordModalProps) {
  return props.isOpen ? createPortal(<QuickAddWordForm {...props} />, document.body) : null;
}

function QuickAddWordForm({ onClose, onCardSaved }: QuickAddWordModalProps) {
  const { playSfx, speakJapanese } = useAudio();
  const { addCustomCard, stats } = useProgression();
  const [rawInput, setRawInput] = useState('');
  const [draft, setDraft] = useState<DictionaryLookupResult>(() => enrichScannedWord(''));
  const [recognizedText, setRecognizedText] = useState('');
  const [selection, setSelection] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [direction, setDirection] = useState<TextDirection>('horizontal');
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [scanNotice, setScanNotice] = useState('');
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<AbortController | null>(null);
  const savingRef = useRef(false);
  const busy = progress !== null;
  const candidates = useMemo(() => getJapaneseWordCandidates(recognizedText), [recognizedText]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Do not open the iPhone keyboard over the photo controls automatically.
    dialogRef.current?.focus();
    return () => {
      scanRef.current?.abort();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  function changeWord(value: string) {
    // Reset all dictionary fields in the input event. Nothing arrives later.
    setRawInput(value);
    setDraft(enrichScannedWord(value));
    setSavedMessage('');
    setError('');
    savingRef.current = false;
  }

  function cancelScan() {
    scanRef.current?.abort();
    scanRef.current = null;
    setProgress(null);
    setScanNotice('Bildläsningen avbröts. Välj ett nytt foto eller skriv in text.');
  }

  async function scan(file: File) {
    try {
      validateOcrFile(file);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Välj ett giltigt foto.');
      return;
    }
    scanRef.current?.abort();
    const controller = new AbortController();
    scanRef.current = controller;
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRecognizedText('');
    setSelection('');
    setScanNotice('');
    changeWord('');
    setProgress({ progress: 0, label: 'Förbereder bilden…' });
    try {
      const result = await recognizeJapaneseImage(file, direction, controller.signal, status => {
        if (scanRef.current === controller && !controller.signal.aborted) setProgress(status);
      });
      if (scanRef.current !== controller || controller.signal.aborted) return;
      setRecognizedText(result.text);
      const words = getJapaneseWordCandidates(result.text);
      if (!words.length) {
        setScanNotice('Ingen japansk text hittades. Ta ett skarpare foto nära texten, byt textriktning eller använd Live Text.');
      } else {
        setScanNotice(result.confidence < 60
          ? 'Avläsningen är osäker. Kontrollera tecknen noga eller prova ett tydligare foto.'
          : 'Kontrollera avläst text och välj ett ord till ditt kort.');
        if (words.length === 1) changeWord(words[0]);
      }
    } catch (cause) {
      if (scanRef.current !== controller || controller.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : 'Bilden kunde inte läsas. Prova igen eller klistra in text med Live Text.');
    } finally {
      if (scanRef.current === controller) {
        scanRef.current = null;
        setProgress(null);
      }
    }
  }

  function pickPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = ''; // Allow retrying the same photo.
    if (file) void scan(file);
  }

  const writtenWord = draft.kanji.trim() || draft.hiragana.trim() || rawInput.trim();
  const duplicate = Boolean(writtenWord && draft.meaning.trim() && stats.customCards?.some(card =>
    normalizeQuery(card.kanji || card.hiragana) === normalizeQuery(writtenWord)
    && card.meaning.trim().toLocaleLowerCase() === draft.meaning.trim().toLocaleLowerCase(),
  ));
  const canSave = !busy && japaneseText.test(writtenWord) && Boolean(draft.meaning.trim()) && !duplicate;

  function saveCard(event: React.FormEvent) {
    event.preventDefault();
    if (!canSave || savingRef.current) return;
    savingRef.current = true;
    try {
      const result = addCustomCard({
        kanji: draft.kanji.trim() || (!draft.hiragana.trim() ? writtenWord : ''),
        hiragana: draft.hiragana.trim(),
        romaji: draft.romaji.trim(),
        meaning: draft.meaning.trim(),
        source: draft.source.trim() || 'Eget ord',
        ...(draft.notes?.trim() ? { notes: draft.notes.trim() } : {}),
      });
      const savedCard = result.currentStats.customCards?.at(-1);
      setSavedMessage(`Sparade ”${writtenWord}” i Mina skannade ord.`);
      setRawInput('');
      setDraft(enrichScannedWord(''));
      inputRef.current?.focus();
      if (savedCard) onCardSaved?.(savedCard);
    } catch {
      savingRef.current = false;
      setError('Kortet kunde inte sparas. Dina fält finns kvar, försök igen.');
    }
  }

  function handleDialogKeys(event: React.KeyboardEvent) {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
    if (event.key !== 'Tab') return;
    const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled):not([type="file"]), textarea:not(:disabled), select:not(:disabled), a[href], summary',
    ) || []).filter(element => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sumi-950/75 p-2 sm:p-4 backdrop-blur-xs">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="scan-title" tabIndex={-1} onKeyDown={handleDialogKeys}
        className="flex max-h-[95dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-paper-300 bg-paper-50 shadow-2xl outline-hidden dark:border-sumi-700 dark:bg-sumi-900">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-paper-200 px-5 py-4 dark:border-sumi-800">
          <div>
            <h2 id="scan-title" className="text-lg font-black text-ink-900 dark:text-white">Skanna & skapa kort</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Foto, Live Text eller egen text. Inga betalda tjänster.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Stäng" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-paper-200 dark:hover:bg-sumi-800"><X size={22} /></button>
        </header>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5">
          <section aria-label="Läs text från foto" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" disabled={busy} onClick={() => cameraRef.current?.click()} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-3 font-bold text-sumi-950 disabled:opacity-50"><Camera size={20} />Ta foto</button>
              <button type="button" disabled={busy} onClick={() => photoRef.current?.click()} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-paper-300 bg-white px-3 py-3 font-bold text-ink-900 dark:border-sumi-700 dark:bg-sumi-800 dark:text-white disabled:opacity-50"><ImagePlus size={20} />Välj bild</button>
            </div>
            <input ref={cameraRef} aria-label="Ta foto av japansk text" type="file" accept="image/*" capture="environment" hidden onChange={pickPhoto} />
            <input ref={photoRef} aria-label="Välj bild med japansk text" type="file" accept="image/*" hidden onChange={pickPhoto} />
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">Fotografera ett ord eller några tydliga rader nära kameran. Bilden läses på din enhet och skickas inte till någon bildtjänst.</p>
            <div>
              <label htmlFor="scan-direction" className={labelClass}>Textens riktning i bilden</label>
              <select id="scan-direction" value={direction} disabled={busy} onChange={e => setDirection(e.target.value as TextDirection)} className={fieldClass}>
                <option value="horizontal">Vågrät text →</option><option value="vertical">Lodrät text ↓ (t.ex. manga)</option>
              </select>
            </div>
            {previewUrl && <div className="flex items-center gap-3">
              <img src={previewUrl} alt="Ditt valda foto" className="h-24 w-24 rounded-xl border border-paper-300 object-contain bg-white" />
              {!busy && photo && <button type="button" onClick={() => void scan(photo)} className="min-h-11 text-sm font-bold text-amber-700 dark:text-amber-400">Läs bilden igen</button>}
            </div>}
            {progress && <div className="rounded-xl bg-amber-500/10 p-3 space-y-2" aria-live="polite">
              <p className="flex items-center gap-2 text-sm text-ink-900 dark:text-white"><LoaderCircle className="animate-spin shrink-0" size={17} />{progress.label}</p>
              <progress aria-label="Bildläsning" value={progress.progress} max={100} className="h-2 w-full accent-amber-500" />
              <button type="button" onClick={cancelScan} className="min-h-11 text-sm font-bold text-amber-700 dark:text-amber-400">Avbryt bildläsning</button>
            </div>}
            {scanNotice && <p role="status" className="text-sm text-slate-600 dark:text-slate-300">{scanNotice}</p>}
            <details className="text-sm text-slate-600 dark:text-slate-300">
              <summary className="cursor-pointer py-2 font-bold">Alternativ på iPhone: Live Text</summary>
              <p className="pt-1 leading-relaxed">Öppna fotot i Bilder, håll på den japanska texten och välj Kopiera. Klistra sedan in ordet i fältet nedan. Du kan också använda ”Skanna text” i iPhones textmeny om alternativet visas.</p>
            </details>
          </section>
          {recognizedText && <section className="space-y-3 rounded-2xl border border-paper-300 p-3 dark:border-sumi-700">
            <label htmlFor="scan-result" className={labelClass}>Avläst text — rätta vid behov</label>
            <textarea id="scan-result" value={recognizedText} rows={3} className={fieldClass}
              onChange={e => { setRecognizedText(e.target.value); setSelection(''); }}
              onSelect={e => { const area = e.currentTarget; setSelection(area.value.slice(area.selectionStart, area.selectionEnd).trim()); }} />
            {selection && <button type="button" onClick={() => changeWord(selection)} className="min-h-11 text-sm font-bold text-amber-700 dark:text-amber-400">Använd markerad text: {selection}</button>}
            <p className="text-xs text-slate-500 dark:text-slate-400">Välj ett ord, eller markera en längre fras i texten:</p>
            <div className="flex flex-wrap gap-2">{candidates.map(word => <button key={word} type="button" onClick={() => changeWord(word)} className="min-h-11 rounded-xl border border-amber-300 bg-amber-500/10 px-3 py-2 text-base font-bold text-ink-900 dark:border-amber-800 dark:text-white">{word}</button>)}</div>
          </section>}
          {savedMessage && <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-500/15 p-3 text-sm font-bold text-emerald-800 dark:text-emerald-300"><Check size={18} />{savedMessage}</p>}
          {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">{error}</p>}
          <form id="scan-card-form" onSubmit={saveCard}>
            <fieldset disabled={busy} className="space-y-4">
              <div>
                <label htmlFor="scan-word" className={labelClass}>Japanskt ord eller fras</label>
                <input id="scan-word" ref={inputRef} type="text" value={rawInput} onChange={e => changeWord(e.target.value)} placeholder="Skriv eller klistra in, t.ex. 猫" autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false} className={fieldClass} />
              </div>
              {rawInput.trim() && <div className="space-y-4 rounded-2xl border border-amber-400/40 bg-white p-4 dark:bg-sumi-950">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{draft.isExactLocalMatch ? 'Hittades i appens ordlista — kontrollera betydelsen.' : 'Ingen lokal träff — fyll i betydelsen själv.'}</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="min-w-0 text-center">
                    {draft.kanji && draft.hiragana && <p className="text-sm text-amber-700 dark:text-amber-400">{draft.hiragana}</p>}
                    <p className="break-words text-3xl font-bold text-ink-900 dark:text-white">{writtenWord}</p>
                    {draft.romaji && <p className="mt-1 text-sm text-slate-500">{draft.romaji}</p>}
                  </div>
                  <button type="button" aria-label="Lyssna på uttal" onClick={() => { speakJapanese(draft.hiragana || writtenWord); playSfx('click'); }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400"><Volume2 size={20} /></button>
                </div>
                <div>
                  <label htmlFor="scan-meaning" className={labelClass}>Betydelse / översättning <span className="font-normal">(krävs)</span></label>
                  <input id="scan-meaning" type="text" value={draft.meaning} onChange={e => setDraft({ ...draft, meaning: e.target.value })} placeholder="t.ex. katt, skola, god morgon..." required className={fieldClass} />
                  <p className="mt-1 text-xs text-slate-500">Vissa ordlistor har engelska betydelser. Du kan skriva din egen svenska översättning.</p>
                </div>
                <details>
                  <summary className="cursor-pointer py-2 text-sm font-bold text-amber-700 dark:text-amber-400">Justera läsning, romaji och källa</summary>
                  <div className="mt-3 space-y-3">
                    {([
                      ['kanji', 'Japansk stavning (kanji)'], ['hiragana', 'Läsning i kana (valfri)'],
                      ['romaji', 'Romaji (valfri)'], ['source', 'Källa / tagg'],
                    ] as const).map(([key, label]) => <div key={key}>
                      <label className={labelClass} htmlFor={`scan-${key}`}>{label}</label>
                      <input id={`scan-${key}`} value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })} className={fieldClass} />
                    </div>)}
                    <label className={labelClass} htmlFor="scan-notes">Anteckning (valfri)</label>
                    <textarea id="scan-notes" value={draft.notes || ''} onChange={e => setDraft({ ...draft, notes: e.target.value })} className={fieldClass} rows={2} />
                  </div>
                </details>
                {duplicate && <p role="status" className="text-sm text-amber-700 dark:text-amber-400">Det här ordet med samma betydelse finns redan i din samling.</p>}
                {!japaneseText.test(writtenWord) && <p className="text-sm text-amber-700 dark:text-amber-400">Skriv japanska tecken eller ett romaji-ord som finns i ordlistan.</p>}
              </div>}
            </fieldset>
          </form>
        </div>
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-paper-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-sumi-800 dark:bg-sumi-950">
          <span className="text-xs text-slate-500">{stats.customCards?.length || 0} egna kort</span>
          <button form="scan-card-form" type="submit" disabled={!canSave} className="flex min-h-12 items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-extrabold text-sumi-950 disabled:cursor-not-allowed disabled:bg-paper-200 disabled:text-slate-400 dark:disabled:bg-sumi-800">Spara kort <ArrowRight size={17} /></button>
        </footer>
      </div>
    </div>
  );
}
