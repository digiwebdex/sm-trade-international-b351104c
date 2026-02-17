-- Fix: Make the read policy PERMISSIVE so anonymous users can read variants
DROP POLICY "Anyone can read active variants" ON public.product_variants;
CREATE POLICY "Anyone can read active variants"
  ON public.product_variants
  FOR SELECT
  USING (true);

-- Also fix same issue on products and categories tables
DROP POLICY "Anyone can read active products" ON public.products;
CREATE POLICY "Anyone can read active products"
  ON public.products
  FOR SELECT
  USING (true);

DROP POLICY "Anyone can read active categories" ON public.categories;
CREATE POLICY "Anyone can read active categories"
  ON public.categories
  FOR SELECT
  USING (true);