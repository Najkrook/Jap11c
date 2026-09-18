# OCR components

The photo-to-card feature uses these unmodified open-source components, served with the app:

- **Tesseract.js**, https://github.com/naptha/tesseract.js — Apache License 2.0. The package's `LICENSE.md` is copied into `dist/ocr/<version>/LICENSE-tesseract.txt` during the build.
- **Tesseract.js-core**, https://github.com/naptha/tesseract.js-core — Apache License 2.0. The package's license is copied into `dist/ocr/<version>/LICENSE-core.txt`.
- **Japanese language models** (`jpn` and `jpn_vert`, `4.0.0_best_int`), distributed via `@tesseract.js-data/jpn` and `@tesseract.js-data/jpn_vert` version 1.0.0 from https://github.com/naptha/tessdata. These are integerized Tesseract language models, derived from https://github.com/tesseract-ocr/tessdata_best (Apache License 2.0). The Apache license is also distributed as `LICENSE-language-models.txt`.

The npm language-model packaging declares the MIT license. Authors listed in its package metadata: Balearica and Jerome Wu. No external OCR or translation API is used.
