-- ============================================================
-- Foreign Key Constraints
-- ============================================================

ALTER TABLE products
  ADD CONSTRAINT products_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id)
  ON DELETE SET NULL;

ALTER TABLE product_variants
  ADD CONSTRAINT product_variants_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id)
  ON DELETE CASCADE;

ALTER TABLE product_images
  ADD CONSTRAINT product_images_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id)
  ON DELETE CASCADE;

ALTER TABLE product_images
  ADD CONSTRAINT product_images_variant_id_fkey
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
  ON DELETE SET NULL;

ALTER TABLE product_variant_images
  ADD CONSTRAINT product_variant_images_variant_id_fkey
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
  ON DELETE CASCADE;

-- Unique constraints
ALTER TABLE seo_meta ADD CONSTRAINT seo_meta_page_slug_unique UNIQUE (page_slug);
