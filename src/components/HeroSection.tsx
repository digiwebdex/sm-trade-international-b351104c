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

  const words = (title as string).split(' ');
  const firstWord = words[0];
  const restWords = words.slice(1).join(' ');

  return (
    <section id="home" className="relative min-h-[600px] lg:min-h-[700px]">
      {/* Ken Burns background */}
      <img
        src={heroBg}
        alt="Premium corporate gifts"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: 'kenBurns 20s ease-in-out infinite alternate' }}
      />

      {/* Clean dark overlay */}
      <div className="absolute inset-0 bg-foreground/65" />

      {/* Content — centered */}
      <div className="relative z-10 flex items-center justify-center min-h-[600px] lg:min-h-[700px]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <p
            className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6"
            style={{ animation: 'heroFadeUp 0.8s ease-out both', fontFamily: 'DM Sans, sans-serif' }}
          >
            S. M. Trade International
          </p>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6 text-white"
            style={{ animation: 'heroFadeUp 0.8s 0.15s ease-out both' }}
          >
            <span className="text-gradient">{firstWord}</span>{' '}
            {restWords}
          </h1>

          <p
            className="text-base md:text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ animation: 'heroFadeUp 0.8s 0.3s ease-out both', fontFamily: 'DM Sans, sans-serif' }}
          >
            {subtitle}
          </p>

          <div style={{ animation: 'heroFadeUp 0.8s 0.45s ease-out both' }}>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white text-base px-12 py-6 rounded-full transition-all duration-300 shadow-lg"
            >
              <a href="#contact">
                <span className="font-semibold tracking-wide" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {ctaPrimary}
                </span>
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
