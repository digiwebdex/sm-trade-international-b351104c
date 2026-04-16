const express = require('express');
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');
const {
  translateBatch,
  autoFillTranslations,
  autoFillSettingsValue,
} = require('../services/translator');

const router = express.Router();

// ── Tables eligible for auto-translation (column-based) ─────
const TRANSLATABLE_TABLES = {
  categories:        { fields: ['name', 'description'] },
  products:          { fields: ['name', 'description', 'short_description'] },
  product_variants:  { fields: ['variant_label'] },
  gallery:           { fields: ['title'] },
  about_page:        { fields: ['content'] },
  seo_meta:          { fields: ['meta_title', 'meta_description'] },
};

// ── POST /api/translate — generic batch translate ──────────
//   body: { texts: string[], source?: 'en', targets?: ['bn','zh'] }
//   resp: { bn: string[], zh: string[] }
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

// ── POST /api/translate/bulk/:table ─────────────────────────
// Loops through all rows of a table and fills missing _bn / _zh fields.
// Body: { onlyIfEmpty?: true, targets?: ['bn','zh'] }
router.post('/bulk/:table', authMiddleware, async (req, res) => {
  const { table } = req.params;
  const cfg = TRANSLATABLE_TABLES[table];
  if (!cfg) return res.status(400).json({ error: `Table ${table} is not translatable` });

  const onlyIfEmpty = req.body?.onlyIfEmpty !== false;
  const targets = Array.isArray(req.body?.targets) ? req.body.targets : ['bn', 'zh'];

  try {
    const { rows } = await pool.query(`SELECT * FROM ${table}`);
    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const row of rows) {
      // Build a payload of just the translatable _en fields
      const payload = {};
      for (const f of cfg.fields) {
        const enKey = `${f}_en`;
        if (row[enKey]) payload[enKey] = row[enKey];
        for (const tgt of targets) payload[`${f}_${tgt}`] = row[`${f}_${tgt}`] || '';
      }

      const translated = await autoFillTranslations(payload, { onlyIfEmpty, targets });

      // Diff: only UPDATE columns that actually changed
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
      if (setParts.length === 0) { skipped++; continue; }
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

// ── POST /api/translate/bulk-site-settings ──────────────────
// Loops site_settings JSONB rows, fills missing bn/zh in nested values.
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

// ── GET /api/translate/health ──────────────────────────────
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
