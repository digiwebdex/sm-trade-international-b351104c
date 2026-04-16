import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/apiClient';
import { useLanguage } from '@/contexts/LanguageContext';

type Lang = 'en' | 'bn' | 'zh';
type TrilingualValue = { en?: string; bn?: string; zh?: string };
type SettingsMap = Record<string, TrilingualValue | string>;

export const useSiteSettings = () => {
  const { lang } = useLanguage();

  const { data: allSettings } = useQuery({
    queryKey: ['site-settings-public'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const map: Record<string, SettingsMap> = {};
      data?.forEach((row) => {
        map[row.setting_key] = row.setting_value as unknown as SettingsMap;
      });
      return map;
    },
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Resolve a setting value with full trilingual fallback chain:
   *   requested-lang → en → bn → zh → plain string → fallback
   */
  const get = (section: string, field: string, fallback = ''): string => {
    const sectionData = allSettings?.[section];
    if (!sectionData) return fallback;

    const order: Lang[] = [lang, 'en', 'bn', 'zh'].filter(
      (l, i, arr) => arr.indexOf(l) === i,
    ) as Lang[];

    const val = sectionData[field];

    if (typeof val === 'object' && val !== null) {
      const tri = val as TrilingualValue;
      for (const l of order) {
        const v = tri[l];
        if (v && String(v).trim()) return v;
      }
    }

    for (const l of order) {
      const v = sectionData[`${field}_${l}`];
      if (v && typeof v === 'string' && String(v).trim()) return v;
    }

    if (typeof val === 'string' && String(val).trim()) return val;

    return fallback;
  };

  return { get, isLoaded: !!allSettings };
};
