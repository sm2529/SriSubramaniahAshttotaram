#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const IN = path.resolve(__dirname, '../raw/stotranidhi_subrahmanya_ashtottara.html');
const OUT = path.resolve(__dirname, '../data/canonical_stotranidhi_telugu.json');

function stripTags(html) {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;|&#x[0-9a-fA-F]+;|&[a-zA-Z]+;/g, ' ');
  // Normalise whitespace and remove ZWNJ/ZWJ
  text = text.replace(/[\u200C\u200D]/g, '');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function extractNames(text) {
  const names = [];
  const re = /ఓం\s+([\u0C00-\u0C7F\s\-]+?)\s+నమః/g; // Telugu text between ఓం and నమః
  let m;
  while ((m = re.exec(text)) !== null) {
    let name = m[1].trim();
    name = name.replace(/\s+/g, ' ');
    names.push(name);
  }
  return names;
}

function main() {
  const html = fs.readFileSync(IN, 'utf8');
  const text = stripTags(html);
  const names = extractNames(text);
  const first108 = names.slice(0, 108);

  fs.writeFileSync(OUT, JSON.stringify(first108, null, 2), 'utf8');
  console.log(`Extracted ${names.length} matches. Wrote first ${first108.length} to ${OUT}`);
  if (first108.length !== 108) {
    console.warn('Warning: Did not extract exactly 108 names.');
  }
}

main();
