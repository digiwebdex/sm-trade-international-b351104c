-- ============================================================
-- Seed Data — Default admin user & initial settings
-- Password: changeme123 (bcrypt hash)
-- CHANGE THIS IMMEDIATELY after deployment!
-- ============================================================

INSERT INTO users (email, password_hash) VALUES
  ('admin@smtradeint.com', '$2b$10$PLACEHOLDER_HASH_REPLACE_ME')
ON CONFLICT (email) DO NOTHING;

-- Default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('contact', '{"phone": "+88 01867666888", "email": "smtrade.int94@gmail.com", "address": "Dhaka, Bangladesh", "whatsapp_number": "8801867666888"}'),
  ('branding', '{"company_name": {"en": "S. M. Trade International", "bn": "এস. এম. ট্রেড ইন্টারন্যাশনাল"}, "tagline": {"en": "Premium Corporate Gifts & Promotional Products", "bn": "প্রিমিয়াম কর্পোরেট গিফট ও প্রমোশনাল পণ্য"}}'),
  ('social', '{"facebook": "", "linkedin": "", "instagram": ""}')
ON CONFLICT (setting_key) DO NOTHING;

-- NOTE: Run migration/export_supabase_data.sh first to export
-- all existing production data, then import it with:
--   psql -U smtrade_user -d smtrade_db -f database/data.sql
