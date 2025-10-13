import { type Name } from '../data/names';

const cleanQuality = (text: string) => text.replace(/\.$/, '');

const toMidSentence = (text: string) => {
  if (!text) return text;
  const trimmed = text.trim();
  if (trimmed.length === 0) return trimmed;
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
};

export type BloomPrompts = {
  remember: string;
  understand: string;
  apply: string;
};

export const getBloomPrompts = (name: Name): BloomPrompts => {
  const quality = cleanQuality(name.english_meaning);
  const qualityAsPhrase = toMidSentence(quality);
  const significance = name.significance && name.significance.trim().length > 0
    ? name.significance.trim()
    : `In the Skanda Purana’s hymns and dialogues, Murugan is repeatedly honoured as the wellspring of ${qualityAsPhrase}. Contemplate how this facet steadies the devas and devotees alike.`;
  const baseApplication = name.application && name.application.trim().length > 0
    ? name.application.trim()
    : `Choose one small act today to embody ${qualityAsPhrase}. Let it be deliberate, gentle, and offered as seva to those around you.`;

  return {
    remember: `Chant “${name.telugu_name}” (${name.transliteration_en}) slowly, visualising Subramaniah radiating ${qualityAsPhrase}. Allow the mantra to settle in the heart before moving on.`,
    understand: significance,
    apply: baseApplication,
  };
};
