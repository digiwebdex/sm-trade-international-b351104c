-- ============================================================
-- Indexes for Performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_is_active ON product_variants(is_active);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_variant_id ON product_images(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_images_image_type ON product_images(image_type);

CREATE INDEX IF NOT EXISTS idx_product_variant_images_variant_id ON product_variant_images(variant_id);

CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_gallery_is_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

CREATE INDEX IF NOT EXISTS idx_hero_slides_is_active ON hero_slides(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_slides_sort_order ON hero_slides(sort_order);

CREATE INDEX IF NOT EXISTS idx_client_logos_is_active ON client_logos(is_active);
CREATE INDEX IF NOT EXISTS idx_client_logos_sort_order ON client_logos(sort_order);

CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_seo_meta_page_slug ON seo_meta(page_slug);

CREATE INDEX IF NOT EXISTS idx_site_settings_setting_key ON site_settings(setting_key);

CREATE INDEX IF NOT EXISTS idx_about_page_field_key ON about_page(field_key);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
