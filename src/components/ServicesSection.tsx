import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, Monitor, Briefcase, GlassWater } from 'lucide-react';

const categories = [
  { icon: Gift, titleKey: 'categories.1.title', descKey: 'categories.1.desc' },
  { icon: Monitor, titleKey: 'categories.2.title', descKey: 'categories.2.desc' },
  { icon: Briefcase, titleKey: 'categories.3.title', descKey: 'categories.3.desc' },
  { icon: GlassWater, titleKey: 'categories.4.title', descKey: 'categories.4.desc' },
];

const ServicesSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="services" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {lang === 'en' ? 'What We Offer' : 'আমরা যা অফার করি'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5">{t('categories.title')}</h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories.map((s, i) => (
            <div
              key={i}
              className="group bg-background rounded-xl border border-border/40 p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-colors duration-300">
                <s.icon className="h-7 w-7 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-base mb-3" style={{ fontFamily: 'DM Sans, Noto Sans Bengali, sans-serif' }}>
                {t(s.titleKey)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t(s.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
