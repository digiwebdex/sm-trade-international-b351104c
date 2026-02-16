import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, PenTool, FlaskConical, Factory, Truck } from 'lucide-react';

const steps = [
  { icon: MessageSquare, titleKey: 'process.1.title', descKey: 'process.1.desc' },
  { icon: PenTool, titleKey: 'process.2.title', descKey: 'process.2.desc' },
  { icon: FlaskConical, titleKey: 'process.3.title', descKey: 'process.3.desc' },
  { icon: Factory, titleKey: 'process.4.title', descKey: 'process.4.desc' },
  { icon: Truck, titleKey: 'process.5.title', descKey: 'process.5.desc' },
];

const ProcessSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {lang === 'en' ? 'How It Works' : 'কিভাবে কাজ করে'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5">{t('process.title')}</h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </div>

        {/* Desktop: Horizontal stepper */}
        <div className="hidden md:block max-w-5xl mx-auto">
          <div className="relative flex items-start justify-between">
            {/* Connecting line */}
            <div className="absolute top-8 left-[10%] right-[10%] h-px bg-border" />

            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center w-1/5 px-2">
                <span className="text-3xl font-bold text-border mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center mb-4 relative z-10">
                  <step.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ fontFamily: 'DM Sans, Noto Sans Bengali, sans-serif' }}>
                  {t(step.titleKey)}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical list with number markers */}
        <div className="md:hidden space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="text-2xl font-bold text-border shrink-0 w-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <step.icon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">{t(step.titleKey)}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{t(step.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
