import { useState, useMemo } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  mainImage: string;
  productImages: { id: string; image_url: string; sort_order: number }[];
  variantImages: { id: string; image_url: string; sort_order: number }[];
  activeVariantImage?: string | null;
  title: string;
}

const ProductImageGallery = ({
  mainImage,
  productImages,
  variantImages,
  activeVariantImage,
  title,
}: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build gallery: active variant image first, then variant gallery, then product gallery, then main
  const allImages = useMemo(() => {
    const images: string[] = [];

    if (activeVariantImage) {
      images.push(activeVariantImage);
    }

    variantImages.forEach(img => {
      if (!images.includes(img.image_url)) images.push(img.image_url);
    });

    productImages.forEach(img => {
      if (!images.includes(img.image_url)) images.push(img.image_url);
    });

    if (mainImage && !images.includes(mainImage)) {
      images.push(mainImage);
    }

    return images.length > 0 ? images : [mainImage || ''];
  }, [mainImage, productImages, variantImages, activeVariantImage]);

  // Reset index when variant changes
  const safeIndex = selectedIndex >= allImages.length ? 0 : selectedIndex;
  const currentImage = allImages[safeIndex];

  return (
    <div className="space-y-3">
      {/* Main display */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-border/30 shadow-sm">
        {currentImage ? (
          <OptimizedImage
            src={currentImage}
            alt={title}
            className="w-full h-full object-contain p-4"
            wrapperClassName="w-full h-full"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {title}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {allImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                safeIndex === idx
                  ? 'border-[hsl(var(--sm-gold))] ring-1 ring-[hsl(var(--sm-gold))]/30'
                  : 'border-border/30 hover:border-border'
              )}
            >
              <img
                src={img}
                alt={`${title} view ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
