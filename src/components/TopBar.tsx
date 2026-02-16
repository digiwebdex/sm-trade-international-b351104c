import { Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TopBar = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="bg-primary text-primary-foreground py-1.5 text-xs tracking-wide">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <a href="tel:+8801867666888" className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <Phone className="h-3 w-3" />
            <span className="hidden sm:inline">+88 01867666888</span>
          </a>
          <a href="mailto:smtrade.int94@gmail.com" className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <Mail className="h-3 w-3" />
            <span className="hidden sm:inline">smtrade.int94@gmail.com</span>
          </a>
        </div>
        <button
          onClick={toggleLang}
          className="opacity-70 hover:opacity-100 transition-opacity text-xs tracking-widest uppercase"
        >
          {lang === 'en' ? 'বাংলা' : 'English'}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
