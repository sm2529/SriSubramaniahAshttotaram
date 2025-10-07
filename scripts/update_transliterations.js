#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA = path.resolve(__dirname, '../data/names.json');

const updates = new Map([
  [13, 'Tarakasura Samharine'],
  [18, 'Surasainya Surakshakaya'],
  [53, 'Ahaspataye'],
  [62, 'Pushne'],
  [76, 'Parasmai Brahmane'],
  [91, 'Karanopatta Dehaya'],
  [99, 'Rakta Shyamagalaya'],
  [100, 'Subrahmanyaya'],
  [101, 'Guhaya'],
  [103, 'Brahmanyaya'],
  [106, 'Vedaya'],
  [107, 'Vedyaya'],
  [108, 'Akshaya Phalapradaya'],
]);

function main() {
  const raw = fs.readFileSync(DATA, 'utf8');
  const list = JSON.parse(raw);
  const byId = new Map(list.map(x => [x.id, x]));

  const changes = [];
  for (const [id, translit] of updates.entries()) {
    const item = byId.get(id);
    if (!item) continue;
    const before = item.transliteration_en;
    if (before !== translit) {
      item.transliteration_en = translit;
      changes.push({ id, before, after: translit, telugu_name: item.telugu_name });
    }
  }

  fs.writeFileSync(DATA, JSON.stringify(list, null, 2), 'utf8');
  console.log(`Updated ${changes.length} transliteration_en fields.`);
  for (const c of changes) {
    console.log(`#${c.id} ${c.telugu_name}: "${c.before}" -> "${c.after}"`);
  }
}

main();
