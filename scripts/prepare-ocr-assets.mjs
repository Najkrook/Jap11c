import { copyFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Ship the worker, WASM and language models with the static site. No CDN/API at runtime.
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));
const packageDir = name => dirname(require.resolve(`${name}/package.json`));
const tesseractDir = packageDir('tesseract.js');
const { version } = JSON.parse(await readFile(join(tesseractDir, 'package.json'), 'utf8'));
const output = join(root, 'public', 'ocr', version);
await mkdir(join(output, 'core'), { recursive: true });
await mkdir(join(output, 'lang'), { recursive: true });
await copyFile(join(tesseractDir, 'dist', 'worker.min.js'), join(output, 'worker.min.js'));
await copyFile(join(tesseractDir, 'LICENSE.md'), join(output, 'LICENSE-tesseract.txt'));
const coreDir = packageDir('tesseract.js-core');
for (const name of await readdir(coreDir)) {
  if (name.endsWith('.wasm.js') || name.endsWith('.wasm')) {
    await copyFile(join(coreDir, name), join(output, 'core', name));
  }
}
await copyFile(join(coreDir, 'LICENSE'), join(output, 'LICENSE-core.txt'));
await copyFile(join(coreDir, 'LICENSE'), join(output, 'LICENSE-language-models.txt'));
await copyFile(join(root, 'THIRD_PARTY_NOTICES.md'), join(output, 'THIRD_PARTY_NOTICES.md'));
for (const language of ['jpn', 'jpn_vert']) {
  await copyFile(
    join(packageDir(`@tesseract.js-data/${language}`), '4.0.0_best_int', `${language}.traineddata.gz`),
    join(output, 'lang', `${language}.traineddata.gz`),
  );
}
console.log(`Local OCR assets ready (Tesseract ${version}).`);
