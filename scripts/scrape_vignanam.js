#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const IN = path.resolve(__dirname, '../raw/vignanam_subrahmanya_ashtottara.html');
const OUT = path.resolve(__dirname, '../data/canonical_vignanam_telugu.json');

function stripTags(html) {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;|&#x[0-9a-fA-F]+;|&[a-zA-Z]+;/g, ' ');
  // Normalise whitespace
  text = text.replace(/[\u200C\u200D]/g, ''); // remove ZWNJ/ZWJ if present
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function extractNames(text) {
  const names = [];
  const re = /ఓం\s+([\u0C00-\u0C7F\s\-]+?)\s+నమః/g; // Telugu block between ఓం and నమః
  let m;
  while ((m = re.exec(text)) !== null) {
    let name = m[1].trim();
    // Collapse internal whitespace to a single space
    name = name.replace(/\s+/g, ' ');
    names.push(name);
  }
  return names;
}

function main() {
  const html = fs.readFileSync(IN, 'utf8');
  const text = stripTags(html);
  const names = extractNames(text);

  // Some pages might include trailing artifacts; keep first 108 if there are extras
  const first108 = names.slice(0, 108);

  fs.writeFileSync(OUT, JSON.stringify(first108, null, 2), 'utf8');
  console.log(`Extracted ${names.length} matches. Wrote first ${first108.length} to ${OUT}`);
  if (names.length < 108) {
    console.warn('Warning: fewer than 108 names extracted. The page layout may have changed.');
  }
}

main();
