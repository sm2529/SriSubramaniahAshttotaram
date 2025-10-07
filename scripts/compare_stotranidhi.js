#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CANON = path.resolve(__dirname, '../data/canonical_stotranidhi_telugu.json');
const DATA = path.resolve(__dirname, '../data/names.json');

function normalize(s) {
  return (s || '')
    .replace(/[\u200C\u200D]/g, '') // ZWNJ/ZWJ
    .replace(/\s+/g, '') // remove whitespace
    .trim();
}

function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const k = keyFn(item);
    const list = map.get(k);
    if (list) list.push(item); else map.set(k, [item]);
  }
  return map;
}

function main() {
  const canon = JSON.parse(fs.readFileSync(CANON, 'utf8'));
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const byId = new Map(data.map(x => [x.id, x]));

  const mismatches = [];
  for (let i = 1; i <= canon.length; i++) {
    const c = canon[i - 1];
    const d = byId.get(i);
    if (!d) {
      mismatches.push({ id: i, type: 'missing_in_dataset', canonical: c, dataset: null });
      continue;
    }
    const cN = normalize(c);
    const dN = normalize(d.telugu_name);
    if (cN !== dN) {
      mismatches.push({ id: i, type: 'text_mismatch', canonical: c, dataset: d.telugu_name });
    }
  }

  // Duplicates in dataset
  const byTelugu = groupBy(data, x => normalize(x.telugu_name));
  const dupDataset = [...byTelugu.entries()].filter(([k,v]) => k && v.length > 1)
    .map(([k, v]) => ({ telugu: v[0].telugu_name, ids: v.map(x => x.id) }));

  // Duplicates in canonical (should be none, but check)
  const byCanon = groupBy(canon, x => normalize(x));
  const dupCanon = [...byCanon.entries()].filter(([k,v]) => k && v.length > 1)
    .map(([k, v]) => ({ telugu: v[0], count: v.length }));

  const report = {
    canonical_count: canon.length,
    dataset_count: data.length,
    mismatch_count: mismatches.length,
    mismatches,
    duplicate_dataset_telugu: dupDataset,
    duplicate_canonical_telugu: dupCanon,
  };

  console.log(`Canonical count: ${report.canonical_count}`);
  console.log(`Dataset count:   ${report.dataset_count}`);
  console.log(`Mismatches:      ${report.mismatch_count}`);
  if (report.mismatch_count) {
    console.log('\nFirst 20 mismatches:');
    for (const mm of mismatches.slice(0, 20)) {
      console.log(`#${mm.id}: canonical="${mm.canonical}" | dataset="${mm.dataset}"`);
    }
  }
  if (dupDataset.length) {
    console.log('\nDataset duplicates (normalized telugu):');
    for (const d of dupDataset) {
      console.log(`  - ${d.telugu}: ids [${d.ids.join(', ')}]`);
    }
  }
  if (dupCanon.length) {
    console.log('\nCanonical duplicates (unexpected):');
    for (const d of dupCanon) {
      console.log(`  - ${d.telugu} (x${d.count})`);
    }
  }

  fs.writeFileSync(path.resolve(__dirname, '../data/verification_report_stotranidhi.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log('\nWrote data/verification_report_stotranidhi.json with full details.');
}

main();
