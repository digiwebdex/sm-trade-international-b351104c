import { useState, useEffect, useRef, TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/apiClient';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const HeroSection = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const touchStartX = useRef(0);
  const speedRef = useRef(0.012);

  const { data: dbProducts } = useQuery({
    queryKey: ['hero-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name_en, name_bn, image_url, product_code')
        .eq('is_active', true)
        .not('image_url', 'is', null)
        .neq('image_url', '')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const items = (dbProducts || []).map(p => ({
    img: p.image_url || '',
    label: lang === 'en' ? p.name_en : (p.name_bn || p.name_en),
    id: p.id,
  }));

  const len = items.length;

  // Find the front-most item for the text panel
  const getFrontItem = () => {
    if (len === 0) return null;
    let bestIdx = 0;
    let bestDepth = -Infinity;
    for (let i = 0; i < len; i++) {
      const itemAngle = (360 / len) * i + angle;
      const rad = (itemAngle * Math.PI) / 180;
      const z = Math.cos(rad);
      if (z > bestDepth) { bestDepth = z; bestIdx = i; }
    }
    return items[bestIdx];
  };

  const frontItem = getFrontItem();

  useEffect(() => {
    if (paused || len < 2) return;
    const animate = (time: number) => {
      if (lastTimeRef.current) {
        const delta = time - lastTimeRef.current;
        setAngle(prev => (prev + speedRef.current * delta) % 360);
      }
      lastTimeRef.current = time;
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTimeRef.current = 0;
    };
  }, [paused, len]);

  const onTouchStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX; setPaused(true); };
  const onTouchMove = (e: TouchEvent) => {
    const delta = e.touches[0].clientX - touchStartX.current;
    setAngle(prev => prev - delta * 0.15);
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => { setPaused(false); };

  if (len === 0) {
    return (
      <section id="home" className="relative min-h-[400px] flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #142240 50%, #0a1628 100%)' }}>
        <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </section>
    );
  }

  const radius = 240;
  const cardW = 140;
  const cardH = 175;

  return (
    <section id="home" className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f1d35 40%, #142240 60%, #0a1628 100%)' }}>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[400px] rounded-full blur-[200px]"
          style={{ background: 'radial-gradient(circle, rgba(100,140,200,0.05), transparent 60%)' }} />
      </div>
      {/* Top & bottom gold lines */}
      <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)' }} />
      <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.1), transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

          {/* LEFT — Text content */}
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            {/* Subtitle */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="w-6 h-px" style={{ background: 'rgba(212,175,55,0.5)' }} />
              <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium"
                style={{ color: 'rgba(212,175,55,0.8)' }}>
                {lang === 'en' ? '1st Class Govt. Contractor' : '১ম শ্রেণীর সরকারি ঠিকাদার'}
              </span>
              <div className="w-6 h-px" style={{ background: 'rgba(212,175,55,0.5)' }} />
            </div>

            {/* Main heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              style={{ color: 'rgba(255,255,255,0.95)', fontFamily: "'Cormorant Garamond', serif" }}>
              {lang === 'en' ? (
                <>Premium Corporate<br className="hidden sm:block" /> Gifts & Supplies</>
              ) : (
                <>প্রিমিয়াম কর্পোরেট<br className="hidden sm:block" /> গিফ্ট ও সাপ্লাইজ</>
              )}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed mb-6 max-w-md mx-auto md:mx-0"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              {lang === 'en'
                ? 'Customized promotional products for government and private organizations across Bangladesh.'
                : 'বাংলাদেশের সরকারি ও বেসরকারি প্রতিষ্ঠানের জন্য কাস্টমাইজড প্রমোশনাল পণ্য।'}
            </p>

            {/* Current product badge */}
            {frontItem && (
              <div className="mb-5">
                <span className="text-[10px] tracking-widest uppercase mb-1 block"
                  style={{ color: 'rgba(212,175,55,0.5)' }}>
                  {lang === 'en' ? 'Featured' : 'ফিচার্ড'}
                </span>
                <span className="text-base sm:text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {frontItem.label}
                </span>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <button
                onClick={() => navigate('/catalog')}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #b8962e)',
                  color: '#0a1628',
                }}>
                {lang === 'en' ? 'View Catalog' : 'ক্যাটালগ দেখুন'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('quote');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  border: '1px solid rgba(212,175,55,0.3)',
                  color: 'rgba(212,175,55,0.85)',
                  background: 'rgba(212,175,55,0.05)',
                }}>
                {lang === 'en' ? 'Get Quote' : 'কোটেশন নিন'}
              </button>
            </div>
          </div>

          {/* RIGHT — Circular carousel */}
          <div
            className="flex-1 order-1 md:order-2 relative w-full max-w-lg h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center touch-pan-y"
            style={{ perspective: '900px' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {items.map((item, i) => {
              const itemAngle = (360 / len) * i + angle;
              const rad = (itemAngle * Math.PI) / 180;
              const x = Math.sin(rad) * radius;
              const z = Math.cos(rad) * radius;
              const depthNorm = (z + radius) / (2 * radius);
              const scale = 0.45 + depthNorm * 0.55;
              const opacity = 0.2 + depthNorm * 0.8;
              const zIndex = Math.round(depthNorm * 100);
              const blurVal = depthNorm < 0.3 ? `blur(${Math.round((0.3 - depthNorm) * 5)}px)` : 'none';
              const isFront = depthNorm > 0.92;

              return (
                <div
                  key={item.id}
                  className="absolute cursor-pointer"
                  style={{
                    width: cardW,
                    height: cardH,
                    left: '50%',
                    top: '50%',
                    marginLeft: -cardW / 2,
                    marginTop: -cardH / 2,
                    transform: `translateX(${x}px) scale(${scale})`,
                    opacity,
                    zIndex,
                    filter: blurVal,
                  }}
                  onClick={() => { if (isFront) navigate(`/product/${item.id}`); }}
                >
                  <div
                    className="w-full h-full rounded-xl overflow-hidden"
                    style={{
                      background: '#fff',
                      boxShadow: isFront
                        ? '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.2)'
                        : '0 6px 20px -4px rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="w-full h-full p-3 flex items-center justify-center">
                      <OptimizedImage
                        src={item.img}
                        alt={item.label}
                        className="w-full h-full object-contain"
                        blurPlaceholder={false}
                      />
                    </div>
                    {/* Gold accent on front */}
                    {isFront && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Controls under carousel */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-4 z-[200]">
              <button onClick={() => setAngle(a => a - 360 / len)} aria-label="Previous"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90"
                style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.05)', color: 'rgba(212,175,55,0.6)' }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPaused(p => !p)}
                className="px-3 py-1 rounded-full text-[10px] tracking-wider uppercase transition-all duration-300"
                style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.05)', color: 'rgba(212,175,55,0.6)' }}>
                {paused ? '▶' : '⏸'}
              </button>
              <button onClick={() => setAngle(a => a + 360 / len)} aria-label="Next"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90"
                style={{ border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.05)', color: 'rgba(212,175,55,0.6)' }}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
