#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DATA = path.resolve(__dirname, '../data/names.json');

function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const key = keyFn(item);
    const list = map.get(key);
    if (list) list.push(item); else map.set(key, [item]);
  }
  return map;
}

function main() {
  const raw = fs.readFileSync(DATA, 'utf8');
  const items = JSON.parse(raw);

  let issues = 0;

  // Count
  if (items.length !== 108) {
    console.log(`ERROR: Expected 108 entries, found ${items.length}`);
    issues++;
  } else {
    console.log('OK: Count is 108');
  }

  // ID continuity
  const ids = items.map(i => i.id).sort((a,b) => a-b);
  const missing = [];
  for (let i = 1; i <= 108; i++) if (!ids.includes(i)) missing.push(i);
  if (missing.length) {
    console.log('ERROR: Missing IDs:', missing.join(', '));
    issues++;
  } else {
    console.log('OK: IDs 1..108 present');
  }

  // Duplicate Telugu names
  const byTelugu = groupBy(items, i => i.telugu_name);
  const dupTelugu = [...byTelugu.entries()].filter(([k,v]) => k && v.length > 1);
  if (dupTelugu.length) {
    console.log('ISSUE: Duplicate telugu_name values found:');
    for (const [name, list] of dupTelugu) {
      console.log(`  - ${name}: ids [${list.map(x=>x.id).join(', ')}]`);
    }
    issues += dupTelugu.length;
  } else {
    console.log('OK: No duplicate telugu_name');
  }

  // Duplicate transliterations (simplified check: case-insensitive)
  const byTranslit = groupBy(items, i => (i.transliteration_en || '').trim().toLowerCase());
  const dupTranslit = [...byTranslit.entries()].filter(([k,v]) => k && v.length > 1);
  if (dupTranslit.length) {
    console.log('NOTE: Duplicate transliteration_en values (may be okay, but review):');
    for (const [name, list] of dupTranslit) {
      console.log(`  - ${name}: ids [${list.map(x=>x.id).join(', ')}]`);
    }
  } else {
    console.log('OK: No duplicate transliteration_en');
  }

  // Spot-check: same telugu_name with differing transliterations
  const translitByTelugu = [];
  for (const [name, list] of byTelugu.entries()) {
    if (!name) continue;
    const set = new Set(list.map(x => x.transliteration_en));
    if (set.size > 1) translitByTelugu.push({ name, ids: list.map(x=>x.id), translits: [...set] });
  }
  if (translitByTelugu.length) {
    console.log('ISSUE: Same telugu_name with different transliteration_en:');
    for (const row of translitByTelugu) {
      console.log(`  - ${row.name}: ids [${row.ids.join(', ')}], translits [${row.translits.join(' | ')}]`);
    }
    issues += translitByTelugu.length;
  } else {
    console.log('OK: Transliteration consistent per telugu_name');
  }

  // Report summary
  if (issues === 0) {
    console.log('\nValidation complete: No blocking issues found.');
  } else {
    console.log(`\nValidation complete: Found ${issues} issue(s).`);
  }
}

main();
