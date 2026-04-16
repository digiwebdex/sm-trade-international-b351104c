import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/apiClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, Eye, Info, Building2 } from 'lucide-react';
import { pickLocalized } from '@/hooks/useLocalized';

interface AboutRecord {
  field_key: string;
  content_en: string;
  content_bn: string;
  content_zh?: string;
  image_url?: string | null;
}

const sections = [
  { key: 'company_description', label: { en: 'About Us', bn: 'আমাদের সম্পর্কে', zh: '关于我们' }, icon: Info },
  { key: 'mission', label: { en: 'Our Mission', bn: 'আমাদের মিশন', zh: '我们的使命' }, icon: Target },
  { key: 'vision', label: { en: 'Our Vision', bn: 'আমাদের ভিশন', zh: '我们的愿景' }, icon: Eye },
  { key: 'company_history', label: { en: 'Our History', bn: 'আমাদের ইতিহাস', zh: '我们的历史' }, icon: Building2 },
] as const;

const About = () => {
  const { lang } = useLanguage();

  const { data: aboutData = [], isLoading } = useQuery({
    queryKey: ['about-page-public'],
    queryFn: async () => {
      const { data, error } = await supabase.from('about_page' as any).select('*');
      if (error) throw error;
      return (data as unknown) as AboutRecord[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const map = Object.fromEntries(aboutData.map(r => [r.field_key, r]));
  const companyImage = map['company_description']?.image_url;

  const pageTitle = lang === 'zh'
    ? '关于 S. M. Trade International'
    : lang === 'bn'
      ? 'আমাদের সম্পর্কে'
      : 'About S. M. Trade International';

  const pageSubtitle = lang === 'zh'
    ? '孟加拉国领先的企业礼品和促销产品供应商。'
    : lang === 'bn'
      ? 'বাংলাদেশের শীর্ষস্থানীয় কর্পোরেট গিফট এবং প্রমোশনাল পণ্য সরবরাহকারী।'
      : "Bangladesh's premier supplier of corporate gifts and promotional merchandise.";

  const stats = [
    { label: lang === 'zh' ? '年经验' : lang === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience', value: '10+' },
    { label: lang === 'zh' ? '满意客户' : lang === 'bn' ? 'সন্তুষ্ট গ্রাহক' : 'Happy Clients', value: '500+' },
    { label: lang === 'zh' ? '产品类别' : lang === 'bn' ? 'পণ্য বিভাগ' : 'Product Categories', value: '50+' },
    { label: lang === 'zh' ? '已完成项目' : lang === 'bn' ? 'সফল প্রকল্প' : 'Projects Delivered', value: '1000+' },
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-muted/40 border-b border-border py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{pageTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{pageSubtitle}</p>
        </div>
      </section>

      {(companyImage || isLoading) && (
        <section className="container mx-auto px-4 max-w-5xl -mt-8 mb-12">
          {isLoading ? (
            <Skeleton className="w-full h-64 rounded-2xl" />
          ) : companyImage ? (
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
              <img
                src={companyImage}
                alt="S. M. Trade International"
                className="w-full max-h-96 object-cover"
                loading="eager"
              />
            </div>
          ) : null}
        </section>
      )}

      <section className="container mx-auto px-4 max-w-4xl pb-20 space-y-16">
        {isLoading ? (
          <div className="space-y-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ))}
          </div>
        ) : (
          sections.map(sec => {
            const record = map[sec.key];
            const content = pickLocalized(record as any, 'content', lang);
            if (!content) return null;
            const Icon = sec.icon;
            const label = sec.label[lang] || sec.label.en;

            return (
              <div key={sec.key} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{label}</h2>
                </div>
                <div className="pl-13">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                    {content}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b border-border">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default About;
