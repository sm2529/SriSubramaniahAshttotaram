import namesData from '../../data/names.json';
import { nameSupplements } from './nameMetadata';

export type Name = {
  id: number;
  telugu_name: string;
  transliteration_en: string;
  english_meaning: string;
  meaning_te?: string;
  audio_url?: string | null;
  image?: string;
  application?: string;
  significance?: string;
};

type RawName = Name;

export const names: Name[] = (namesData as RawName[]).map((name) => ({
  ...name,
  ...nameSupplements[name.id],
}));

export function getNameById(id: number): Name | undefined {
  return names.find(n => n.id === id);
}
