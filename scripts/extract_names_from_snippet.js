#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '../raw/names_snippet.js');
const OUT = path.resolve(__dirname, '../data/names.json');

function extractArraySource(text) {
  let markerIndex = text.indexOf('const names');
  if (markerIndex === -1) markerIndex = text.indexOf('names =');
  if (markerIndex === -1) throw new Error('Could not find names array declaration');
  const start = text.indexOf('[', markerIndex);
  if (start === -1) throw new Error('Could not find start of array');

  let depth = 0;
  let inString = false;
  let stringQuote = null;
  let escape = false;
  let end = -1;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === stringQuote) {
        inString = false;
        stringQuote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringQuote = ch;
      continue;
    }

    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) throw new Error('Could not find end of array');
  return text.slice(start, end + 1);
}

function quoteObjectKeys(jsLike) {
  // Quote unquoted keys in object literals: { id: 1, telugu: "..." } -> { "id": 1, "telugu": "..." }
  return jsLike.replace(/(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
}

function main() {
  const raw = fs.readFileSync(SRC, 'utf8');
  const arrSrc = extractArraySource(raw);
  const jsonish = quoteObjectKeys(arrSrc);

  let arr;
  try {
    arr = JSON.parse(jsonish);
  } catch (e) {
    console.error('Failed to parse names array as JSON. Error:', e.message);
    process.exit(1);
  }

  // Transform schema
  const transformed = arr.map((n) => ({
    id: n.id,
    telugu_name: n.telugu,
    transliteration_en: n.english,
    meaning_te: n.meaningTelugu,
    english_meaning: n.meaningEnglish,
    audio_url: null,
  }));

  // Basic validation
  const ids = transformed.map((x) => x.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    console.warn('Warning: duplicate IDs detected');
  }
  const expectedCount = 108;
  if (transformed.length !== expectedCount) {
    console.warn(`Warning: expected ${expectedCount} entries, found ${transformed.length}`);
  }
  // Check continuity 1..108
  const missing = [];
  for (let i = 1; i <= expectedCount; i++) {
    if (!uniqueIds.has(i)) missing.push(i);
  }
  if (missing.length) {
    console.warn('Warning: missing IDs:', missing.join(','));
  }

  fs.writeFileSync(OUT, JSON.stringify(transformed, null, 2), 'utf8');
  console.log(`Wrote ${OUT} with ${transformed.length} entries.`);
}

main();
