import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import logo from '@/assets/logo.jpeg';
import { Phone, Mail, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();
  const { get } = useSiteSettings();

  const desc = get('footer', 'description', t('footer.desc'));
  const copyright = get('footer', 'copyright', t('footer.rights'));
  const phone = get('contact', 'phone', '+88 01867666888');
  const email = get('contact', 'email', 'smtrade.int94@gmail.com');
  const address = get('contact', 'address', t('contact.addressValue'));

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Thin gold line */}
      <div className="h-px bg-accent/40" />

      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="Logo" className="h-10 rounded" />
              <span className="font-bold text-lg">S. M. Trade International</span>
            </div>
            <p className="text-primary-foreground/40 text-sm leading-relaxed mb-6">{desc}</p>
            <div className="flex items-center gap-3">
              {[Facebook, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-primary-foreground/5 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors">
                  <Icon className="h-4 w-4 text-primary-foreground/40" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-widest uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>{t('footer.quicklinks')}</h4>
            <div className="space-y-3">
              {['nav.home', 'nav.about', 'nav.services', 'nav.products', 'nav.contact'].map(k => (
                <a key={k} href={`#${k.split('.')[1]}`} className="block text-primary-foreground/40 hover:text-primary-foreground text-sm transition-colors">
                  {t(k)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-widest uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>{t('footer.contactinfo')}</h4>
            <div className="space-y-4 text-sm text-primary-foreground/40">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-8 text-center">
          <span className="text-primary-foreground/30 text-sm">
            © {new Date().getFullYear()} S. M. Trade International. {copyright}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
