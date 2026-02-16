import { useLanguage } from '@/contexts/LanguageContext';

const clients = [
  'Bangladesh Public Administration Training Centre (BPATC)',
  'Bangabandhu Sheikh Mujibur Rahman Tunnel Authority',
  'Various Government Ministries',
  'Private Corporations',
  'NGOs & International Organizations',
  'Educational Institutions',
];

const ClientsSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {lang === 'en' ? 'Trusted By' : 'বিশ্বস্ত'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('clients.title')}</h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {clients.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 px-4 border-l-2 border-border hover:border-accent transition-colors duration-200 group"
            >
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
