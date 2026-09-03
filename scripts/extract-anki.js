/**
 * Extract cards and media from the Tae Kim .apkg.
 * Outputs:
 *   src/data/ankiData.json  — card data with audio filenames
 *   public/audio/           — all MP3 files
 */
import AdmZip from 'adm-zip';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const defaultApkgPath = path.resolve(
  projectRoot,
  '..',
  '..',
  '..',
  'AntigravityData',
  'japanese-study',
  'Japanese_course_based_on_Tae_Kims_grammar_guide__anime.apkg',
);
const configuredApkgPath = process.argv[2] || process.env.JAPANESE_STUDY_ANKI_PATH || defaultApkgPath;
const apkgPath = path.resolve(configuredApkgPath);
const outputPath = path.join(projectRoot, 'src', 'data', 'ankiData.json');
const audioDir = path.join(projectRoot, 'public', 'audio');
const imgDir = path.join(projectRoot, 'public', 'images', 'anki');

if (!fs.existsSync(apkgPath)) {
  throw new Error(
    `Anki archive not found at ${apkgPath}. Pass a path as the first argument or set JAPANESE_STUDY_ANKI_PATH.`,
  );
}

// Create output dirs
fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(imgDir, { recursive: true });

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'anki-'));
const zip = new AdmZip(apkgPath);
zip.extractAllTo(tmpDir, true);

// ─── Parse media map ───
const mediaMapPath = path.join(tmpDir, 'media');
let mediaMap = {};
if (fs.existsSync(mediaMapPath)) {
  mediaMap = JSON.parse(fs.readFileSync(mediaMapPath, 'utf8'));
}

// ─── Extract Files ───
let audioCount = 0;
let imgCount = 0;
for (const [num, realName] of Object.entries(mediaMap)) {
  const isAudio = realName.endsWith('.mp3');
  const isImage = realName.endsWith('.jpg') || realName.endsWith('.png') || realName.endsWith('.gif');
  if (!isAudio && !isImage) continue;

  const srcPath = path.join(tmpDir, num);
  const destPath = isAudio ? path.join(audioDir, realName) : path.join(imgDir, realName);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    if (isAudio) audioCount++;
    else imgCount++;
  }
}
console.log(`Extracted ${audioCount} audio files to public/audio/`);
console.log(`Extracted ${imgCount} image files to public/images/anki/`);

// ─── Extract card data ───
const db = new Database(path.join(tmpDir, 'collection.anki21'));

const col = db.prepare("SELECT models FROM col LIMIT 1").get();
const models = JSON.parse(col.models);
const modelFields = {};
for (const [id, model] of Object.entries(models)) {
  modelFields[id] = { name: model.name, fields: model.flds.map(f => f.name) };
}

const notes = db.prepare("SELECT * FROM notes ORDER BY id").all();

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\[sound:[^\]]+\]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFilename(raw, pattern) {
  if (!raw) return '';
  const match = raw.match(pattern);
  return match ? match[1] : '';
}

const cards = [];
let skipped = 0;

for (const note of notes) {
  const mid = String(note.mid);
  const model = modelFields[mid];
  if (!model || model.name === 'InfoNote') { skipped++; continue; }

  const fieldValues = note.flds.split('\x1f');
  const fieldMap = {};
  model.fields.forEach((name, i) => {
    fieldMap[name] = fieldValues[i] || '';
  });

  const kanji = stripHtml(fieldMap['Jlab-Kanji'] || '');
  const hiragana = stripHtml(fieldMap['Jlab-Hiragana'] || '');
  const romaji = stripHtml(fieldMap['Jlab-ListeningFront'] || '');
  const meaning = stripHtml(fieldMap['RemarksBack'] || '');
  const source = stripHtml(fieldMap['Source'] || '');
  const audio = extractFilename(fieldMap['Audio'] || '', /\[sound:([^\]]+)\]/);
  const image = extractFilename(fieldMap['Image'] || '', /src="([^"]+)"/);

  if (!kanji && !hiragana) { skipped++; continue; }

  cards.push({
    kanji,
    hiragana,
    romaji,
    meaning,
    source,
    audio,
    image
  });
}

console.log(`Extracted ${cards.length} cards, skipped ${skipped}`);
console.log(`Cards with audio: ${cards.filter(c => c.audio).length}`);
console.log('Sample:', JSON.stringify(cards[0], null, 2));

fs.writeFileSync(outputPath, JSON.stringify(cards, null, 2), 'utf8');
console.log(`Written to ${outputPath}`);

db.close();
fs.rmSync(tmpDir, { recursive: true, force: true });
