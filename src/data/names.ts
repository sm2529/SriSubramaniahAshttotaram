import namesData from '../../data/names.json';

export type Name = {
  id: number;
  telugu_name: string;
  transliteration_en: string;
  english_meaning: string;
  meaning_te?: string;
  audio_url?: string | null;
};

export const names: Name[] = namesData as Name[];

export function getNameById(id: number): Name | undefined {
  return names.find(n => n.id === id);
}
