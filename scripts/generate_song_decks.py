import genanki
import json
import csv
import os
import re
import shutil

CSS = """
.card {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Yu Gothic Medium", Meiryo, sans-serif;
    font-size: 16px;
    text-align: center;
    color: #1a2b4c;
    background-color: #fdfcfb;
    padding: 24px 16px;
    max-width: 520px;
    margin: 0 auto;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(26, 43, 76, 0.08);
}

.category-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 4px 12px;
    border-radius: 9999px;
    background-color: #e0e7ff;
    color: #3730a3;
    margin-bottom: 14px;
}

.lesson-badge {
    display: inline-block;
    font-size: 11px;
    color: #64748b;
    margin-left: 6px;
    font-weight: 600;
}

.front-main {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
    margin: 16px 0 8px 0;
}

.front-sub {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 8px;
}

.prompt {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 16px;
    font-style: italic;
}

.back-japanese {
    font-size: 38px;
    font-weight: 900;
    color: #1a2b4c;
    margin: 16px 0 4px 0;
    line-height: 1.2;
}

.back-reading {
    font-size: 18px;
    font-weight: 700;
    color: #4338ca;
    margin-bottom: 4px;
}

.back-romaji {
    font-size: 13px;
    font-family: monospace;
    color: #64748b;
    margin-bottom: 16px;
}

.meaning-box {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 16px;
    margin: 16px 0;
    text-align: left;
}

.meaning-label {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    color: #94a3b8;
    letter-spacing: 0.05em;
}

.meaning-text {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin-top: 2px;
}

.meaning-en {
    font-size: 13px;
    color: #475569;
    margin-top: 2px;
}

.notes-box {
    background-color: #eef2ff;
    border-left: 3px solid #6366f1;
    border-radius: 0 8px 8px 0;
    padding: 10px 14px;
    margin-top: 12px;
    text-align: left;
    font-size: 12px;
    line-height: 1.5;
    color: #312e81;
}

.notes-label {
    font-weight: 800;
    color: #4338ca;
    margin-right: 4px;
}
"""

FRONT_TEMPLATE = """
<div class="card">
    <div>
        <span class="category-badge">{{Category}}</span>
        <span class="lesson-badge">{{Lesson}}</span>
    </div>
    <div class="front-main">{{Swedish}}</div>
    {{#English}}
    <div class="front-sub">🇬🇧 {{English}}</div>
    {{/English}}
    <div class="prompt">Vad heter detta på japanska? (Klicka för att vända)</div>
</div>
"""

BACK_TEMPLATE = """
<div class="card">
    <div>
        <span class="category-badge">{{Category}}</span>
        <span class="lesson-badge">{{Lesson}}</span>
    </div>
    <div class="back-japanese">{{Japanese}}</div>
    {{#HiraganaReading}}
    <div class="back-reading">{{HiraganaReading}}</div>
    {{/HiraganaReading}}
    {{#Romaji}}
    <div class="back-romaji">{{Romaji}}</div>
    {{/Romaji}}
    
    <div class="meaning-box">
        <div class="meaning-label">Svenska</div>
        <div class="meaning-text">{{Swedish}}</div>
        {{#English}}
        <div class="meaning-en">🇬🇧 {{English}}</div>
        {{/English}}
    </div>
    
    {{#Notes}}
    <div class="notes-box">
        <span class="notes-label">🎵 Låtrad & kontext:</span>{{Notes}}
    </div>
    {{/Notes}}
</div>
"""

def parse_ts_dataset(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into Stay With Me and Plastic Love sections
    parts = content.split("export const PLASTIC_LOVE_VOCAB")
    stay_section = parts[0]
    plastic_section = parts[1] if len(parts) > 1 else ""

    def extract_items(section_text):
        items = []
        # Find every object block enclosed in curly brackets
        matches = re.findall(r'\{\s*japanese:\s*[\'\"](.*?)\n\s*\}', section_text, re.DOTALL)
        for m in matches:
            block = "japanese: '" + m
            def get_field(field_name):
                fm = re.search(rf"{field_name}:\s*['\"](.*?)['\"],?", block, re.DOTALL)
                return fm.group(1).strip() if fm else ""

            item = {
                "japanese": get_field("japanese"),
                "hiragana": get_field("hiragana"),
                "romaji": get_field("romaji"),
                "swedish": get_field("swedish"),
                "english": get_field("english"),
                "category": get_field("category"),
                "lesson": get_field("lesson"),
                "notes": get_field("notes")
            }
            if item["japanese"]:
                items.append(item)
        return items

    stay_vocab = extract_items(stay_section)
    plastic_vocab = extract_items(plastic_section)
    return stay_vocab, plastic_vocab

def build_deck_package(deck_id, deck_name, file_prefix, vocab_list, tags_prefix):
    model = genanki.Model(
        deck_id + 100,
        f'{deck_name} Modul',
        fields=[
            {'name': 'Japanese'},
            {'name': 'HiraganaReading'},
            {'name': 'Romaji'},
            {'name': 'Swedish'},
            {'name': 'English'},
            {'name': 'Category'},
            {'name': 'Lesson'},
            {'name': 'Notes'},
        ],
        templates=[
            {
                'name': 'Svenska -> Japanska (Aktiv framkallning)',
                'qfmt': FRONT_TEMPLATE,
                'afmt': BACK_TEMPLATE,
            }
        ],
        css=CSS
    )

    deck = genanki.Deck(deck_id, deck_name)

    for idx, item in enumerate(vocab_list):
        tags = [tags_prefix, f"Rank-{idx+1}", item['category'].split(' · ')[0].replace(' ', '-')]
        note = genanki.Note(
            model=model,
            fields=[
                item['japanese'],
                item['hiragana'],
                item['romaji'],
                item['swedish'],
                item['english'],
                item['category'],
                item['lesson'],
                item['notes'],
            ],
            tags=tags
        )
        deck.add_note(note)

    os.makedirs('anki_export', exist_ok=True)
    os.makedirs('public', exist_ok=True)

    # 1. APKG Export
    apkg_name = f"{file_prefix}.apkg"
    export_apkg_path = os.path.join('anki_export', apkg_name)
    public_apkg_path = os.path.join('public', apkg_name)
    dist_apkg_path = os.path.join('dist', apkg_name)

    genanki.Package(deck).write_to_file(export_apkg_path)
    shutil.copy2(export_apkg_path, public_apkg_path)
    if os.path.exists('dist'):
        shutil.copy2(export_apkg_path, dist_apkg_path)

    print(f"APKG skapad: {export_apkg_path} ({len(vocab_list)} ord)")

    # 2. TSV Export
    tsv_name = f"{file_prefix}.tsv"
    export_tsv_path = os.path.join('anki_export', tsv_name)
    public_tsv_path = os.path.join('public', tsv_name)
    dist_tsv_path = os.path.join('dist', tsv_name)

    with open(export_tsv_path, 'w', encoding='utf-8', newline='') as f:
        f.write("#separator:tab\n")
        f.write("#html:false\n")
        f.write("#tags column:9\n")
        f.write("#columns:Japanese\tHiraganaReading\tRomaji\tSwedish\tEnglish\tCategory\tLesson\tNotes\tTags\n")
        writer = csv.writer(f, delimiter='\t')
        for idx, item in enumerate(vocab_list):
            tags = [tags_prefix, f"Rank-{idx+1}"]
            writer.writerow([
                item['japanese'],
                item['hiragana'],
                item['romaji'],
                item['swedish'],
                item['english'],
                item['category'],
                item['lesson'],
                item['notes'],
                " ".join(tags)
            ])
    shutil.copy2(export_tsv_path, public_tsv_path)
    if os.path.exists('dist'):
        shutil.copy2(export_tsv_path, dist_tsv_path)

    print(f"TSV skapad: {export_tsv_path}")

    # 3. JSON Export
    json_name = f"{file_prefix}.json"
    export_json_path = os.path.join('anki_export', json_name)
    with open(export_json_path, 'w', encoding='utf-8') as f:
        json.dump(vocab_list, f, ensure_ascii=False, indent=2)
    print(f"JSON skapad: {export_json_path}")

def main():
    data_path = os.path.join('src', 'data', 'songDecksData.ts')
    stay_vocab, plastic_vocab = parse_ts_dataset(data_path)
    print(f"Läste in {len(stay_vocab)} ord för Stay With Me och {len(plastic_vocab)} ord för Plastic Love.")

    # Build Stay With Me
    build_deck_package(
        deck_id=1789202601,
        deck_name='City Pop — Stay With Me (真夜中のドア) [Frekvens]',
        file_prefix='Stay_With_Me_Ordforrad',
        vocab_list=stay_vocab,
        tags_prefix='StayWithMe'
    )

    # Build Plastic Love
    build_deck_package(
        deck_id=1789202602,
        deck_name='City Pop — Plastic Love (プラスティック・ラブ) [Frekvens]',
        file_prefix='Plastic_Love_Ordforrad',
        vocab_list=plastic_vocab,
        tags_prefix='PlasticLove'
    )

if __name__ == '__main__':
    main()
