import { useState, useEffect, useRef, useCallback, TouchEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/apiClient';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const SPEED = 4500;

const HeroSection = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchDelta = useRef(0);

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
    code: p.product_code,
  }));

  const len = items.length;
  const anglePerItem = len > 0 ? 360 / len : 0;

  const next = useCallback(() => {
    if (len > 1) setRotation(r => r - anglePerItem);
  }, [len, anglePerItem]);

  const prev = useCallback(() => {
    if (len > 1) setRotation(r => r + anglePerItem);
  }, [len, anglePerItem]);

  useEffect(() => {
    if (paused || len < 2) return;
    timerRef.current = setInterval(next, SPEED);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused, len]);

  const currentIndex = len > 0
    ? ((Math.round(-rotation / anglePerItem) % len) + len) % len
    : 0;

  const onTouchStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX; touchDelta.current = 0; setPaused(true); };
  const onTouchMove = (e: TouchEvent) => { touchDelta.current = e.touches[0].clientX - touchStartX.current; };
  const onTouchEnd = () => { if (touchDelta.current > 50) prev(); else if (touchDelta.current < -50) next(); setPaused(false); };

  if (len === 0) {
    return (
      <section id="home" className="relative min-h-[420px] flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #142240 50%, #0a1628 100%)' }}>
        <div className="w-10 h-10 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
      </section>
    );
  }

  const radius = Math.max(260, len * 32);
  const centerItem = items[currentIndex];

  return (
    <section id="home" className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f1d35 40%, #142240 60%, #0a1628 100%)' }}>
      
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

      {/* Gold accent glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[200px]"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06), transparent 60%)' }} />
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)' }} />
        <div className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)' }} />
      </div>

      <div
        className="relative z-10 flex flex-col items-center px-4 py-8 md:py-12 lg:py-14 touch-pan-y"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Section title */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6))' }} />
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium"
              style={{ color: 'rgba(212,175,55,0.8)' }}>
              {lang === 'en' ? 'Our Products' : 'আমাদের পণ্য'}
            </span>
            <div className="w-8 h-px" style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.6), transparent)' }} />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight"
            style={{ color: 'rgba(255,255,255,0.95)', fontFamily: "'Cormorant Garamond', serif" }}>
            {lang === 'en' ? 'Premium Collection' : 'প্রিমিয়াম কালেকশন'}
          </h2>
        </div>

        {/* 3D Carousel */}
        <div
          className="relative w-full max-w-5xl mx-auto h-[280px] sm:h-[340px] md:h-[400px] flex items-center justify-center"
          style={{ perspective: '1400px' }}
        >
          {/* Rotating ring */}
          <div
            className="absolute w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotation}deg)`,
              transition: 'transform 0.9s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            {items.map((item, i) => {
              const itemAngle = i * anglePerItem;
              const isFront = i === currentIndex;

              return (
                <div
                  key={item.id}
                  className="absolute top-1/2 left-1/2 cursor-pointer group"
                  style={{
                    width: 180,
                    height: 240,
                    marginLeft: -90,
                    marginTop: -120,
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => {
                    if (isFront) {
                      navigate(`/product/${item.id}`);
                    } else {
                      let diff = i - currentIndex;
                      if (diff > len / 2) diff -= len;
                      if (diff < -len / 2) diff += len;
                      setRotation(r => r - diff * anglePerItem);
                    }
                  }}
                >
                  <div
                    className="w-full h-full rounded-xl overflow-hidden transition-all duration-500"
                    style={{
                      background: isFront
                        ? 'linear-gradient(145deg, #ffffff 0%, #f8f6f0 100%)'
                        : 'linear-gradient(145deg, #f5f3ed 0%, #e8e4db 100%)',
                      boxShadow: isFront
                        ? '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.3), 0 0 60px -10px rgba(212,175,55,0.1)'
                        : '0 8px 25px -5px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
                    }}
                  >
                    {/* Gold top accent */}
                    <div className="w-full h-[3px]"
                      style={{
                        background: isFront
                          ? 'linear-gradient(90deg, transparent, #d4af37, transparent)'
                          : 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)',
                      }} />

                    {/* Image */}
                    <div className="w-full h-[calc(100%-52px)] p-4 flex items-center justify-center">
                      <OptimizedImage
                        src={item.img}
                        alt={item.label}
                        className="w-full h-full object-contain"
                        blurPlaceholder={false}
                      />
                    </div>

                    {/* Label area */}
                    <div className="h-[48px] flex items-center justify-center px-3"
                      style={{
                        borderTop: '1px solid rgba(212,175,55,0.15)',
                        background: isFront ? 'rgba(212,175,55,0.04)' : 'transparent',
                      }}>
                      <span className="text-[11px] font-semibold truncate text-center leading-tight"
                        style={{ color: isFront ? '#1a1a2e' : '#666' }}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floor reflection */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[50%] h-20 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.04), transparent 70%)' }} />
        </div>

        {/* Active product info + navigation */}
        <div className="flex flex-col items-center mt-2">
          {/* Product name & CTA */}
          <button
            onClick={() => navigate(`/product/${centerItem.id}`)}
            className="group flex items-center gap-2 mb-5 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
          >
            <span className="text-sm font-medium" style={{ color: 'rgba(212,175,55,0.9)' }}>
              {centerItem.label}
            </span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              style={{ color: 'rgba(212,175,55,0.7)' }} />
          </button>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button onClick={prev} aria-label="Previous"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
              style={{
                border: '1px solid rgba(212,175,55,0.25)',
                background: 'rgba(212,175,55,0.05)',
                color: 'rgba(212,175,55,0.7)',
              }}>
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {items.slice(0, Math.min(len, 10)).map((_, i) => (
                <button key={i}
                  onClick={() => {
                    let diff = i - currentIndex;
                    if (diff > len / 2) diff -= len;
                    if (diff < -len / 2) diff += len;
                    setRotation(r => r - diff * anglePerItem);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === currentIndex ? 24 : 6,
                    height: 6,
                    background: i === currentIndex
                      ? 'linear-gradient(90deg, #d4af37, #c5a028)'
                      : 'rgba(212,175,55,0.15)',
                  }} />
              ))}
            </div>

            <button onClick={next} aria-label="Next"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90"
              style={{
                border: '1px solid rgba(212,175,55,0.25)',
                background: 'rgba(212,175,55,0.05)',
                color: 'rgba(212,175,55,0.7)',
              }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
