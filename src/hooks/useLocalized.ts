/**
 * Trilingual field helper.
 *
 * Reads `name_en` / `name_bn` / `name_zh` style columns from a row and returns
 * the best match for the active language with a graceful fallback chain:
 *   requested-lang → en → bn → zh → ''.
 *
 * Usage:
 *   const { L } = useLocalized();
 *   const productName = L(product, 'name'); // picks name_en/_bn/_zh
 */
import { useLanguage } from '@/contexts/LanguageContext';

type Lang = 'en' | 'bn' | 'zh';

export function pickLocalized(
  row: Record<string, any> | null | undefined,
  base: string,
  lang: Lang,
): string {
  if (!row) return '';
  const order: Lang[] = [lang, 'en', 'bn', 'zh'].filter(
    (l, i, arr) => arr.indexOf(l) === i,
  ) as Lang[];
  for (const l of order) {
    const v = row[`${base}_${l}`];
    if (v && String(v).trim()) return String(v);
  }
  // Fallback to plain field (no suffix)
  const plain = row[base];
  return plain && typeof plain === 'string' ? plain : '';
}

export function useLocalized() {
  const { lang } = useLanguage();
  const L = (row: Record<string, any> | null | undefined, base: string) =>
    pickLocalized(row, base, lang);
  return { L, lang };
}
