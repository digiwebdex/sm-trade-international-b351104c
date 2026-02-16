import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Static fallback images
import img1 from '@/assets/products/ties-blue.png';
import img2 from '@/assets/products/bpatc-building.png';
import img3 from '@/assets/products/product-3.png';
import img4 from '@/assets/products/product-4.png';
import img5 from '@/assets/products/product-5.png';
import img6 from '@/assets/products/tunnel-souvenir.png';
import img7 from '@/assets/products/product-7.png';
import img8 from '@/assets/products/product-8.png';
import img9 from '@/assets/products/product-9.png';
import img10 from '@/assets/products/product-10.png';
import img11 from '@/assets/products/glassware.png';
import img12 from '@/assets/products/product-12.png';

interface StaticProduct {
  src: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  category: string;
}

const staticProducts: StaticProduct[] = [
  { src: img1, titleEn: 'Customized Ties', titleBn: 'কাস্টমাইজড টাই', descEn: 'Premium silk ties with custom branding.', descBn: 'কাস্টম ব্র্যান্ডিং সহ প্রিমিয়াম সিল্ক টাই।', category: 'corporate' },
  { src: img2, titleEn: 'BPATC Project', titleBn: 'বিপিএটিসি প্রজেক্ট', descEn: 'Custom project for BPATC.', descBn: 'বিপিএটিসির জন্য কাস্টম প্রকল্প।', category: 'souvenir' },
  { src: img3, titleEn: 'Leather Goods', titleBn: 'লেদার পণ্য', descEn: 'Genuine leather products.', descBn: 'আসল চামড়ার পণ্য।', category: 'corporate' },
  { src: img4, titleEn: 'Custom Bags', titleBn: 'কাস্টম ব্যাগ', descEn: 'Branded bags for events.', descBn: 'ইভেন্টের জন্য ব্র্যান্ডেড ব্যাগ।', category: 'corporate' },
  { src: img5, titleEn: 'Promotional Items', titleBn: 'প্রমোশনাল আইটেম', descEn: 'Custom promotional gifts.', descBn: 'কাস্টম প্রমোশনাল গিফট।', category: 'corporate' },
  { src: img6, titleEn: 'Bangabandhu Tunnel Souvenir', titleBn: 'বঙ্গবন্ধু টানেল স্মারক', descEn: 'Commemorative souvenir.', descBn: 'স্মারক উপহার।', category: 'souvenir' },
  { src: img7, titleEn: 'Custom Products', titleBn: 'কাস্টম পণ্য', descEn: 'Tailor-made corporate items.', descBn: 'কর্পোরেট আইটেম।', category: 'corporate' },
  { src: img8, titleEn: 'Branded Items', titleBn: 'ব্র্যান্ডেড আইটেম', descEn: 'Logo-printed merchandise.', descBn: 'লোগো-প্রিন্টেড পণ্য।', category: 'corporate' },
  { src: img9, titleEn: 'Stationery Set', titleBn: 'স্টেশনারি সেট', descEn: 'Premium branded stationery.', descBn: 'প্রিমিয়াম ব্র্যান্ডেড স্টেশনারি।', category: 'stationery' },
  { src: img10, titleEn: 'Premium Gifts', titleBn: 'প্রিমিয়াম গিফট', descEn: 'Luxury gift collections.', descBn: 'বিলাসবহুল গিফট সংগ্রহ।', category: 'corporate' },
  { src: img11, titleEn: 'Deli Glassware', titleBn: 'ডেলি গ্লাসওয়্যার', descEn: 'Custom engraved glassware.', descBn: 'কাস্টম খোদাই গ্লাসওয়্যার।', category: 'corporate' },
  { src: img12, titleEn: 'Special Collection', titleBn: 'স্পেশাল কালেকশন', descEn: 'Exclusive gift collection.', descBn: 'এক্সক্লুসিভ গিফট সংগ্রহ।', category: 'corporate' },
];

type DisplayProduct = {
  src: string;
  title: string;
  titleEn: string;
  titleBn: string;
  desc: string;
  descEn: string;
  descBn: string;
  category: string;
  categoryLabel: string;
  isActive: boolean;
};

const ProductsSection = () => {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [lightbox, setLightbox] = useState<DisplayProduct | null>(null);

  const { data: dbProducts = [] } = useQuery({
    queryKey: ['public-products-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name_en, name_bn)')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: dbCategories = [] } = useQuery({
    queryKey: ['public-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name_en, name_bn')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const useDbData = dbProducts.length > 0;

  const allProducts: DisplayProduct[] = useMemo(() => {
    if (useDbData) {
      return dbProducts.filter(p => p.is_active).map(p => {
        const cat = (p as any).categories;
        return {
          src: p.image_url || '',
          title: lang === 'en' ? p.name_en : (p.name_bn || p.name_en),
          titleEn: p.name_en,
          titleBn: p.name_bn || '',
          desc: lang === 'en' ? (p.description_en || '') : (p.description_bn || p.description_en || ''),
          descEn: p.description_en || '',
          descBn: p.description_bn || '',
          category: p.category_id || 'all',
          categoryLabel: cat ? (lang === 'en' ? cat.name_en : (cat.name_bn || cat.name_en)) : '',
          isActive: p.is_active,
        };
      });
    }
    return staticProducts.map(p => ({
      src: p.src,
      title: lang === 'en' ? p.titleEn : p.titleBn,
      titleEn: p.titleEn,
      titleBn: p.titleBn,
      desc: lang === 'en' ? p.descEn : p.descBn,
      descEn: p.descEn,
      descBn: p.descBn,
      category: p.category,
      categoryLabel: '',
      isActive: true,
    }));
  }, [dbProducts, useDbData, lang]);

  const filterCategories = useMemo(() => {
    if (useDbData) {
      return [
        { id: 'all', label: t('products.all') },
        ...dbCategories.map(c => ({
          id: c.id,
          label: lang === 'en' ? c.name_en : (c.name_bn || c.name_en),
        })),
      ];
    }
    return [
      { id: 'all', label: t('products.all') },
      { id: 'corporate', label: t('products.corporate') },
      { id: 'souvenir', label: t('products.souvenir') },
      { id: 'stationery', label: t('products.stationery') },
    ];
  }, [useDbData, dbCategories, lang, t]);

  const filtered = useMemo(() => {
    let result = allProducts;
    if (filter !== 'all') result = result.filter(p => p.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(p =>
        p.titleEn.toLowerCase().includes(q) || p.titleBn.includes(q) ||
        p.descEn.toLowerCase().includes(q) || p.descBn.includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allProducts, filter, search]);

  const searchPlaceholder = lang === 'en' ? 'Search products...' : 'পণ্য খুঁজুন...';
  const noResults = lang === 'en' ? 'No products found.' : 'কোনো পণ্য পাওয়া যায়নি।';

  return (
    <section id="products" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {lang === 'en' ? 'Our Products' : 'আমাদের পণ্য'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5">{t('products.title')}</h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </div>

        {/* Search */}
        <div className="max-w-sm mx-auto mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 rounded-full border-border/40 bg-background"
          />
        </div>

        {/* Filter chips */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {filterCategories.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                filter === c.id
                  ? 'bg-foreground text-background'
                  : 'bg-background text-muted-foreground hover:text-foreground border border-border/40'
              }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{noResults}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <div
                key={i}
                className="group cursor-pointer overflow-hidden rounded-xl bg-background border border-border/30 hover:shadow-lg transition-all duration-300 flex flex-col"
                onClick={() => setLightbox(p)}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  {p.src ? (
                    <img
                      src={p.src}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">{p.title}</div>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">{p.title}</h3>
                  {p.categoryLabel && (
                    <span className="inline-block self-start bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
                      {p.categoryLabel}
                    </span>
                  )}
                  {p.desc && (
                    <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">{p.desc}</p>
                  )}
                  <span className="mt-auto pt-1.5 text-[11px] font-semibold text-accent group-hover:underline">
                    {lang === 'en' ? 'Request Quote →' : 'কোটেশন চান →'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white z-10" onClick={() => setLightbox(null)}>
            <X className="h-7 w-7" />
          </button>
          <div className="max-w-2xl w-full flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
            {lightbox.src && (
              <img src={lightbox.src} alt={lightbox.title} className="max-w-full max-h-[55vh] object-contain rounded-lg" />
            )}
            <div className="text-center space-y-3 max-w-lg">
              <h3 className="text-xl font-bold text-white">{lightbox.title}</h3>
              {lightbox.desc && <p className="text-white/50 text-sm leading-relaxed">{lightbox.desc}</p>}
              <a
                href="#contact"
                onClick={() => setLightbox(null)}
                className="inline-block mt-3 px-8 py-2.5 rounded-full border border-accent text-accent text-sm font-semibold hover:bg-accent hover:text-white transition-colors duration-200"
              >
                {lang === 'en' ? 'Request Quote' : 'কোটেশন অনুরোধ'}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
