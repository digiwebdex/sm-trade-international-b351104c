const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');
const {
  translateBatch,
  autoFillTranslations,
  autoFillSettingsValue,
} = require('../services/translator');

const router = express.Router();

const TRANSLATABLE_TABLES = {
  categories:        { fields: ['name', 'description'] },
  products:          { fields: ['name', 'description', 'short_description'] },
  product_variants:  { fields: ['variant_label'] },
  gallery:           { fields: ['title'] },
  about_page:        { fields: ['content'] },
  seo_meta:          { fields: ['meta_title', 'meta_description'] },
};

async function translateHeroSlides(rows, { onlyIfEmpty, targets }) {
  let updated = 0;
  let skipped = 0;
  const errors = [];

  for (const row of rows) {
    const nextTranslations = row.translations && typeof row.translations === 'object'
      ? JSON.parse(JSON.stringify(row.translations))
      : {};

    let changed = false;

    for (const target of targets) {
      const sourceFields = [
        { key: 'title', value: row.title || '' },
        { key: 'subtitle', value: row.subtitle || '' },
        { key: 'cta_text', value: row.cta_text || '' },
      ].filter((field) => field.value && String(field.value).trim());

      if (sourceFields.length === 0) continue;

      const current = nextTranslations[target] && typeof nextTranslations[target] === 'object'
        ? nextTranslations[target]
        : {};

      const pending = sourceFields.filter((field) => {
        const existing = current[field.key];
        return !(onlyIfEmpty && existing && String(existing).trim());
      });

      if (pending.length === 0) continue;

      const translated = await translateBatch(
        pending.map((field) => field.value),
        'en',
        target,
      );

      pending.forEach((field, index) => {
        const value = translated[index];
        if (value && value !== current[field.key]) {
          current[field.key] = value;
          changed = true;
        }
      });

      if (Object.keys(current).length > 0) {
        nextTranslations[target] = current;
      }
    }

    if (!changed) {
      skipped++;
      continue;
    }

    try {
      await pool.query(
        'UPDATE hero_slides SET translations = $1, updated_at = now() WHERE id = $2',
        [JSON.stringify(nextTranslations), row.id],
      );
      updated++;
    } catch (e) {
      errors.push({ id: row.id, error: e.message });
    }
  }

  return { updated, skipped, errors };
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { texts, source = 'en', targets = ['bn', 'zh'] } = req.body || {};
    if (!Array.isArray(texts)) {
      return res.status(400).json({ error: 'texts must be an array' });
    }
    const out = {};
    for (const t of targets) {
      out[t] = await translateBatch(texts, source, t);
    }
    res.json(out);
  } catch (err) {
    console.error('POST /translate error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/bulk/:table', authMiddleware, async (req, res) => {
  const { table } = req.params;
  const onlyIfEmpty = req.body?.onlyIfEmpty !== false;
  const targets = Array.isArray(req.body?.targets) ? req.body.targets : ['bn', 'zh'];

  try {
    if (table === 'hero_slides') {
      const { rows } = await pool.query('SELECT * FROM hero_slides ORDER BY sort_order, created_at');
      const result = await translateHeroSlides(rows, { onlyIfEmpty, targets });
      return res.json({ table, total: rows.length, ...result });
    }

    const cfg = TRANSLATABLE_TABLES[table];
    if (!cfg) return res.status(400).json({ error: `Table ${table} is not translatable` });

    const { rows } = await pool.query(`SELECT * FROM ${table}`);
    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const row of rows) {
      const payload = {};
      for (const f of cfg.fields) {
        const enKey = `${f}_en`;
        if (row[enKey]) payload[enKey] = row[enKey];
        for (const tgt of targets) payload[`${f}_${tgt}`] = row[`${f}_${tgt}`] || '';
      }

      const translated = await autoFillTranslations(payload, { onlyIfEmpty, targets });

      const setParts = [];
      const values = [];
      let i = 1;
      for (const tgt of targets) {
        for (const f of cfg.fields) {
          const key = `${f}_${tgt}`;
          if (translated[key] && translated[key] !== row[key]) {
            setParts.push(`${key} = $${i++}`);
            values.push(translated[key]);
          }
        }
      }
      if (setParts.length === 0) {
        skipped++;
        continue;
      }
      values.push(row.id);
      try {
        await pool.query(
          `UPDATE ${table} SET ${setParts.join(', ')} WHERE id = $${i}`,
          values,
        );
        updated++;
      } catch (e) {
        errors.push({ id: row.id, error: e.message });
      }
    }

    res.json({ table, total: rows.length, updated, skipped, errors });
  } catch (err) {
    console.error(`POST /translate/bulk/${table} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/bulk-site-settings', authMiddleware, async (req, res) => {
  const onlyIfEmpty = req.body?.onlyIfEmpty !== false;
  const targets = Array.isArray(req.body?.targets) ? req.body.targets : ['bn', 'zh'];

  try {
    const { rows } = await pool.query('SELECT * FROM site_settings');
    let updated = 0;
    for (const row of rows) {
      const newValue = await autoFillSettingsValue(row.setting_value || {}, { onlyIfEmpty, targets });
      const before = JSON.stringify(row.setting_value || {});
      const after = JSON.stringify(newValue);
      if (before === after) continue;
      await pool.query(
        'UPDATE site_settings SET setting_value = $1, updated_at = now() WHERE id = $2',
        [JSON.stringify(newValue), row.id],
      );
      updated++;
    }
    res.json({ total: rows.length, updated });
  } catch (err) {
    console.error('POST /translate/bulk-site-settings error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/health', async (_req, res) => {
  try {
    const url = (process.env.LIBRETRANSLATE_URL || 'http://libretranslate:5000') + '/languages';
    const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) return res.status(503).json({ ok: false, status: resp.status });
    const langs = await resp.json();
    res.json({ ok: true, languages: Array.isArray(langs) ? langs.map(l => l.code) : langs });
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message });
  }
});

module.exports = router;
module.exports.TRANSLATABLE_TABLES = TRANSLATABLE_TABLES;
