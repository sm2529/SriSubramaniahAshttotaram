#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA = path.resolve(__dirname, '../data/names.json');

// Obvious transliteration typos to correct (simplified English)
const updates = new Map([
  [11, 'Shaktidharaya'],         // was Sakthidharaya
  [24, 'Shaktidharaya'],         // was Sakthidaraya
  [29, 'Vishakhaya'],            // was Vishakaya
  [30, 'Shankaratmajaya'],       // was Sankaratmajaya
  [32, 'Gana Swamine'],          // was Jana Swamine
  [38, 'Ganga Sutaya'],          // was Ganga Suthaya
  [41, 'Pavakatmajaya'],         // was Pavakathmajaya
  [45, 'Kamalasana Samstutaya'], // was Kamalasana Samsthutaya
  [52, 'Prajapataye'],           // was Prajapathaye
  [60, 'Patave'],                // was Vatave
  [70, 'Shankaratmajaya'],       // was Shankarathmajaya
  [78, 'Virat Sutaya'],          // was Virat Suthaya
  [97, 'Viruddha Hantre'],       // was Viruddha Hanthre
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
