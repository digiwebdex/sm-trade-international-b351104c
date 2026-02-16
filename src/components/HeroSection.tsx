import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const { t } = useLanguage();
  const { get } = useSiteSettings();

  const title = get('hero', 'title', t('hero.title'));
  const subtitle = get('hero', 'subtitle', t('hero.subtitle'));
  const ctaPrimary = get('hero', 'cta_primary', t('hero.cta'));
  const ctaSecondary = get('hero', 'cta_secondary', t('hero.contact'));

  return (
    <section id="home" className="relative min-h-[600px] lg:min-h-[700px]">
      {/* Full-width hero image */}
      <img
        src={heroBg}
        alt="Premium corporate gifts"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(150,20%,6%)]/85 via-[hsl(150,20%,6%)]/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[600px] lg:min-h-[700px]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 bg-[hsl(var(--sm-gold))]/15 backdrop-blur-sm text-[hsl(var(--sm-gold))] text-xs font-semibold px-5 py-2 rounded-full mb-8 tracking-widest uppercase border border-[hsl(var(--sm-gold))]/25"
              style={{ animation: 'heroFadeUp 0.8s ease-out both' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--sm-gold))]" />
              S. M. Trade International
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white"
              style={{ animation: 'heroFadeUp 0.8s 0.15s ease-out both' }}
            >
              {title}
            </h1>
            <p
              className="text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed"
              style={{ animation: 'heroFadeUp 0.8s 0.3s ease-out both', fontFamily: 'DM Sans, sans-serif' }}
            >
              {subtitle}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 sm:gap-5"
              style={{ animation: 'heroFadeUp 0.8s 0.45s ease-out both' }}
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-[hsl(var(--sm-gold))] hover:bg-[hsl(var(--sm-gold-dark))] text-white text-base px-10 py-6 rounded-lg transition-all duration-300 shadow-lg shadow-[hsl(var(--sm-gold))]/20 hover:shadow-xl hover:shadow-[hsl(var(--sm-gold))]/30"
              >
                <a href="#contact">
                  <span className="flex items-center gap-2 font-semibold tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {ctaPrimary}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/25 text-white bg-white/5 backdrop-blur-sm text-base px-10 py-6 rounded-lg hover:bg-white/15 hover:border-white/40 transition-all duration-300"
              >
                <a href="#products">
                  <span className="font-semibold tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>{ctaSecondary}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
