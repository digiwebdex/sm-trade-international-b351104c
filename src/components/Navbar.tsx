import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.jpeg';

const Navbar = () => {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.services', href: '#services' },
    { key: 'nav.products', href: '#products' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 relative">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="S. M. Trade International" className="h-10 w-auto rounded" />
          <span className="hidden md:inline font-bold text-xl tracking-tight">S. M. Trade International</span>
        </a>
        <span className="md:hidden absolute left-1/2 -translate-x-1/2 font-bold text-sm tracking-wide text-center leading-tight">
          S. M. Trade International
        </span>
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a
              key={l.key}
              href={l.href}
              className="relative px-4 py-2 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {t(l.key)}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accent group-hover:w-3/4 transition-all duration-300 rounded-full" />
            </a>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border/40 px-4 pb-4">
          {links.map(l => (
            <a
              key={l.key}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-border/20 last:border-0"
            >
              {t(l.key)}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
