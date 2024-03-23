export const Locales = ["de", "en", "es"] as const;
export type Locale = (typeof Locales)[number];

