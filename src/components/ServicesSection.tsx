import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, Monitor, Briefcase, GlassWater } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { icon: Gift, titleKey: 'categories.1.title', descKey: 'categories.1.desc' },
  { icon: Monitor, titleKey: 'categories.2.title', descKey: 'categories.2.desc' },
  { icon: Briefcase, titleKey: 'categories.3.title', descKey: 'categories.3.desc' },
  { icon: GlassWater, titleKey: 'categories.4.title', descKey: 'categories.4.desc' },
];

const ServicesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('categories.title')}</h2>
        <div className="w-16 h-1 bg-sm-red mx-auto mb-12 rounded" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((s, i) => (
            <Card key={i} className="group hover-lift border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-sm-red/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-sm-red transition-colors duration-300">
                  <s.icon className="h-8 w-8 text-sm-red group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ fontFamily: 'Inter, Noto Sans Bengali, sans-serif' }}>{t(s.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(s.descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
