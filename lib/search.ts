// Lets "مغربيه" find "مغربية" and "ارز" find "أرز": drop diacritics and tatweel, unify alef, ta marbuta and ya
export const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();

// Every word of the query has to appear somewhere in the haystack
export const matches = (haystack: string, query: string) =>
  normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => haystack.includes(w));
