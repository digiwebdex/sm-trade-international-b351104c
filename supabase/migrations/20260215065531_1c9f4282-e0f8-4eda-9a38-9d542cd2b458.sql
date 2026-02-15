
-- =============================================
-- S.M. Trade International CMS Database Schema
-- =============================================

-- 1. Site Settings (homepage sections, contact info, SEO, header/footer)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for frontend
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 2. Product Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL DEFAULT '',
  description_en TEXT DEFAULT '',
  description_bn TEXT DEFAULT '',
  icon TEXT DEFAULT 'Package',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name_en TEXT NOT NULL,
  name_bn TEXT NOT NULL DEFAULT '',
  description_en TEXT DEFAULT '',
  description_bn TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Gallery
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL DEFAULT '',
  title_bn TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery"
  ON public.gallery FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage gallery"
  ON public.gallery FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Client Logos
CREATE TABLE public.client_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read client logos"
  ON public.client_logos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage client logos"
  ON public.client_logos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Contact Messages (from website visitors)
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a message
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Only authenticated can read/manage
CREATE POLICY "Authenticated users can read contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete contact messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- 7. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true);

-- Storage policies
CREATE POLICY "Public read for cms images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can upload cms images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can update cms images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cms-images');

CREATE POLICY "Authenticated users can delete cms images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'cms-images');

-- 9. Seed default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('hero', '{"title_en": "Premium Customized Corporate Gifts & Promotional Products", "title_bn": "প্রিমিয়াম কাস্টমাইজড কর্পোরেট গিফট ও প্রমোশনাল পণ্য", "subtitle_en": "We customize your brand identity with quality, precision and professionalism.", "subtitle_bn": "আমরা আপনার ব্র্যান্ড পরিচয় মানসম্মতভাবে, নির্ভুলতার সাথে এবং পেশাদারিত্বের মাধ্যমে কাস্টমাইজ করি।"}'),
  ('about', '{"title_en": "About Us", "title_bn": "আমাদের সম্পর্কে", "description_en": "S.M. Trade International is a leading trading company specializing in customized promotional and corporate gift items.", "description_bn": "এস.এম. ট্রেড ইন্টারন্যাশনাল একটি শীর্ষস্থানীয় ট্রেডিং কোম্পানি যা কাস্টমাইজড প্রমোশনাল ও কর্পোরেট গিফট আইটেমে বিশেষজ্ঞ।", "stats": [{"value": "10+", "label_en": "Years Experience", "label_bn": "বছরের অভিজ্ঞতা"}, {"value": "200+", "label_en": "Happy Clients", "label_bn": "সন্তুষ্ট ক্লায়েন্ট"}, {"value": "5000+", "label_en": "Products Delivered", "label_bn": "পণ্য সরবরাহ"}, {"value": "50+", "label_en": "Categories", "label_bn": "ক্যাটাগরি"}]}'),
  ('contact', '{"phone": "+88 01867666888", "phone2": "+88 02224446664", "email": "smtrade.int94@gmail.com", "address_en": "Dhaka, Bangladesh", "address_bn": "ঢাকা, বাংলাদেশ", "whatsapp": "8801867666888"}'),
  ('seo', '{"title": "S.M. Trade International | Premium Customized Corporate Gifts", "description": "Premium customized corporate gifts & promotional products for government and private organizations in Bangladesh.", "keywords": "corporate gifts Bangladesh, customized promotional products, branded gifts Dhaka"}'),
  ('footer', '{"description_en": "Your trusted partner for customized corporate gifts & promotional products.", "description_bn": "কাস্টমাইজড কর্পোরেট গিফট ও প্রমোশনাল পণ্যের আপনার বিশ্বস্ত অংশীদার।"}');

-- 10. Seed default categories
INSERT INTO public.categories (name_en, name_bn, description_en, description_bn, icon, sort_order) VALUES
  ('Corporate Gift Items', 'কর্পোরেট গিফট আইটেম', 'Tie, Crystal, Pen, Key Ring and more — custom-branded for your organization.', 'টাই, ক্রিস্টাল, কলম, কী-রিং এবং আরও অনেক কিছু — আপনার প্রতিষ্ঠানের ব্র্যান্ডে কাস্টমাইজড।', 'Gift', 1),
  ('Office Accessories', 'অফিস আনুষাঙ্গিক', 'Wooden Tissue Box, Desk Organizer, Pen Holder — elegant office essentials.', 'কাঠের টিস্যু বক্স, ডেস্ক অর্গানাইজার, পেন হোল্ডার — মার্জিত অফিস সামগ্রী।', 'Monitor', 2),
  ('Leather Products', 'লেদার পণ্য', 'Executive File, Document Folder — premium leather craftsmanship.', 'এক্সিকিউটিভ ফাইল, ডকুমেন্ট ফোল্ডার — প্রিমিয়াম লেদার কারুশিল্প।', 'Briefcase', 3),
  ('Customized Glass & Crystal', 'কাস্টমাইজড গ্লাস ও ক্রিস্টাল', 'Award trophies, souvenirs and decorative crystal pieces with custom engraving.', 'অ্যাওয়ার্ড ট্রফি, স্মারক ও কাস্টম খোদাই সহ সজ্জিত ক্রিস্টাল পিস।', 'GlassWater', 4);
