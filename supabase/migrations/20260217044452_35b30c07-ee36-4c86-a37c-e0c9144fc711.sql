-- Create table for multiple images per variant
CREATE TABLE public.product_variant_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_variant_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read variant images"
  ON public.product_variant_images
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage variant images"
  ON public.product_variants
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_variant_images_variant_id ON public.product_variant_images(variant_id);

-- Also add a product_images table for base product gallery
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product images"
  ON public.product_images
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage product images"
  ON public.product_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);