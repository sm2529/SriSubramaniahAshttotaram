import enhancements from '../../data/nameEnhancements.json';

export type NameSupplement = {
  image?: string;
  application?: string;
  significance?: string;
  english_meaning?: string;
  transliteration_en?: string;
};

type EnhancementEntry = NameSupplement & { id: number };

const baseSupplements = (enhancements as EnhancementEntry[]).reduce<Record<number, NameSupplement>>((acc, entry) => {
  const { id, ...supplement } = entry;
  acc[id] = supplement;
  return acc;
}, {});

const peacockSupplement = baseSupplements[8] ?? {};

export const nameSupplements: Record<number, NameSupplement> = {
  ...baseSupplements,
  8: {
    ...peacockSupplement,
    image: '/images/cards/sikhi-vahanaya.svg',
  },
};
