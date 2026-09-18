import type { Worker } from 'tesseract.js';
import { version } from 'tesseract.js/package.json';

export type TextDirection = 'horizontal' | 'vertical';
export interface OcrProgress { progress: number; label: string }
export interface OcrResult { text: string; confidence: number }

export function getOcrImageSize(width: number, height: number) {
  const scale = Math.min(1, 2400 / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function getJapaneseWordCandidates(text: string): string[] {
  const clean = text.normalize('NFKC').replace(/([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]) +(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー])/gu, '$1');
  const segments = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter('ja', { granularity: 'word' }).segment(clean), s => s.segment)
    : clean.split(/[\s。、！？「」『』]+/);
  return [...new Set(segments.filter(s => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(s)))].slice(0, 80);
}

export function validateOcrFile(file: File): void {
  if (file.size > 25 * 1024 * 1024) throw new Error('Bilden är för stor. Välj ett foto under 25 MB eller en skärmbild.');
  if (file.type && !file.type.startsWith('image/')) throw new Error('Välj ett foto eller en skärmbild.');
}

async function prepareImage(file: File, signal: AbortSignal): Promise<HTMLCanvasElement> {
  validateOcrFile(file);
  signal.throwIfAborted();
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      const abort = () => { image.src = ''; reject(new DOMException('Avbruten', 'AbortError')); };
      const cleanup = () => signal.removeEventListener('abort', abort);
      image.onload = () => { cleanup(); resolve(); };
      image.onerror = () => { cleanup(); reject(new Error('Bilden kunde inte öppnas. Prova en skärmbild eller ett JPEG-/PNG-foto.')); };
      signal.addEventListener('abort', abort, { once: true });
      image.src = url;
    });
    signal.throwIfAborted();
    // Safari applies the photo's EXIF orientation when drawing the image.
    const canvas = document.createElement('canvas');
    const size = getOcrImageSize(image.naturalWidth, image.naturalHeight);
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Bildläsningen kunde inte starta. Prova att klistra in text med Live Text.');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, size.width, size.height);
    context.drawImage(image, 0, 0, size.width, size.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
    image.src = '';
  }
}

/** Image recognition stays on the device; all models are served with the app. */
export async function recognizeJapaneseImage(
  file: File,
  direction: TextDirection,
  signal: AbortSignal,
  onProgress: (progress: OcrProgress) => void,
): Promise<OcrResult> {
  signal.throwIfAborted();
  const lifetime = new AbortController();
  const abort = () => lifetime.abort(signal.reason);
  signal.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => lifetime.abort(new Error('Bildläsningen tog för lång tid. Försök med ett mindre utsnitt eller klistra in text med Live Text.')), 90_000);
  let worker: Worker | undefined;
  let canvas: HTMLCanvasElement | undefined;
  let stop: (() => void) | undefined;
  const interrupted = new Promise<never>((_, reject) => {
    stop = () => {
      void worker?.terminate();
      reject(lifetime.signal.reason);
    };
    lifetime.signal.addEventListener('abort', stop, { once: true });
  });
  // Attach the race before beginning image decoding or loading a large model.
  const run = async () => {
    onProgress({ progress: 0, label: 'Förbereder bilden…' });
    canvas = await prepareImage(file, lifetime.signal);
    const { createWorker, PSM } = await import('tesseract.js');
    lifetime.signal.throwIfAborted();
    const assetRoot = new URL(`${import.meta.env.BASE_URL}ocr/${version}/`, window.location.href).href;
    worker = await createWorker(direction === 'vertical' ? 'jpn_vert' : 'jpn', 1, {
      workerPath: `${assetRoot}worker.min.js`,
      corePath: `${assetRoot}core`,
      langPath: `${assetRoot}lang`,
      workerBlobURL: false,
      logger: message => {
        if (!lifetime.signal.aborted) onProgress({
          progress: message.status === 'recognizing text' ? Math.round(message.progress * 100) : 0,
          label: message.status === 'recognizing text' ? 'Läser japansk text…' : 'Laddar bildläsaren… Första gången tar lite längre tid.',
        });
      },
      // Tesseract otherwise throws an additional unhandled error in its message callback.
      errorHandler: () => lifetime.abort(new Error('Bildläsaren kunde inte laddas eller läsa bilden. Kontrollera anslutningen och försök igen, eller använd Live Text.')),
    });
    if (lifetime.signal.aborted) {
      await worker.terminate();
      lifetime.signal.throwIfAborted();
    }
    await worker.setParameters({
      tessedit_pageseg_mode: direction === 'vertical' ? PSM.SINGLE_BLOCK_VERT_TEXT : PSM.AUTO,
      user_defined_dpi: '300',
    });
    const { data } = await worker.recognize(canvas);
    return { text: data.text.trim(), confidence: data.confidence };
  };
  try {
    return await Promise.race([interrupted, run()]);
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', abort);
    if (stop) lifetime.signal.removeEventListener('abort', stop);
    await worker?.terminate();
    if (canvas) { canvas.width = 0; canvas.height = 0; }
  }
}
