import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Award, Users, Package, Layers } from 'lucide-react';

const icons = [Award, Users, Package, Layers];

const AboutSection = () => {
  const { t, lang } = useLanguage();
  const { get } = useSiteSettings();

  const title = get('about', 'title', t('about.title'));
  const desc = get('about', 'description', t('about.desc'));

  const stats = [
    { icon: icons[0], value: get('about', 'stat1_value', '10+'), label: get('about', 'stat1_label', t('about.stat1.label')) },
    { icon: icons[1], value: get('about', 'stat2_value', '200+'), label: get('about', 'stat2_label', t('about.stat2.label')) },
    { icon: icons[2], value: get('about', 'stat3_value', '5000+'), label: get('about', 'stat3_label', t('about.stat3.label')) },
    { icon: icons[3], value: get('about', 'stat4_value', '50+'), label: get('about', 'stat4_label', t('about.stat4.label')) },
  ];

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {lang === 'en' ? 'Who We Are' : 'আমরা কারা'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{title}</h2>
          <div className="w-12 h-px bg-accent mx-auto mb-8" />
          <p className="text-muted-foreground text-lg leading-relaxed">{desc}</p>
        </div>

        {/* Horizontal stat bar */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`text-center py-6 ${i < stats.length - 1 ? 'md:border-r border-border/40' : ''}`}
            >
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.value}</div>
              <div className="text-muted-foreground text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
