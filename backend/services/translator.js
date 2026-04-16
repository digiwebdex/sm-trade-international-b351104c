/**
 * Translation service (LibreTranslate self-hosted).
 * Handles single texts, batches, and field-by-field auto-fill on save.
 */
const LIBRE_URL = process.env.LIBRETRANSLATE_URL || 'http://libretranslate:5000';
const LIBRE_KEY = process.env.LIBRETRANSLATE_API_KEY || '';

// LibreTranslate language codes
// NOTE: LibreTranslate uses 'zh-Hans' (Simplified Chinese), not 'zh'
const LANG_CODE = { en: 'en', bn: 'bn', zh: 'zh-Hans', 'zh-Hans': 'zh-Hans' };

/**
 * Translate a single string from source to target language.
 * Returns the translated text or '' on failure.
 */
async function translateText(text, source = 'en', target = 'bn') {
  if (!text || typeof text !== 'string' || !text.trim()) return '';
  if (source === target) return text;

  try {
    const resp = await fetch(`${LIBRE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: LANG_CODE[source] || source,
        target: LANG_CODE[target] || target,
        format: 'text',
        ...(LIBRE_KEY ? { api_key: LIBRE_KEY } : {}),
      }),
      // 25s timeout per call
      signal: AbortSignal.timeout(25000),
    });

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '');
      console.warn(`[translate] HTTP ${resp.status} ${target}: ${errBody.slice(0, 200)}`);
      return '';
    }
    const data = await resp.json();
    return data?.translatedText || '';
  } catch (err) {
    console.warn(`[translate] error ${source}→${target}:`, err.message);
    return '';
  }
}

/**
 * Translate a batch of strings to one target language.
 * LibreTranslate accepts arrays in the `q` field.
 */
async function translateBatch(texts, source = 'en', target = 'bn') {
  if (!Array.isArray(texts) || texts.length === 0) return [];

  // Filter empty / pre-translated indices but preserve positions
  const work = texts.map((t, i) => ({ idx: i, text: t || '' }));
  const toSend = work.filter(w => w.text && w.text.trim());

  if (toSend.length === 0) return texts.map(() => '');

  try {
    const resp = await fetch(`${LIBRE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: toSend.map(w => w.text),
        source: LANG_CODE[source] || source,
        target: LANG_CODE[target] || target,
        format: 'text',
        ...(LIBRE_KEY ? { api_key: LIBRE_KEY } : {}),
      }),
      signal: AbortSignal.timeout(45000),
    });

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '');
      console.warn(`[translateBatch] HTTP ${resp.status} ${target}: ${errBody.slice(0, 200)}`);
      return texts.map(() => '');
    }
    const data = await resp.json();
    const translated = Array.isArray(data?.translatedText)
      ? data.translatedText
      : [data?.translatedText];

    const result = texts.map(() => '');
    toSend.forEach((w, i) => { result[w.idx] = translated[i] || ''; });
    return result;
  } catch (err) {
    console.warn(`[translateBatch] error ${source}→${target}:`, err.message);
    return texts.map(() => '');
  }
}

/**
 * For a row payload: detect *_en fields and auto-fill empty *_bn / *_zh fields.
 * onlyIfEmpty=true means we never overwrite an already-translated value.
 *
 * Returns an updated payload object.
 */
async function autoFillTranslations(payload, opts = {}) {
  const { onlyIfEmpty = true, targets = ['bn', 'zh'] } = opts;
  if (!payload || typeof payload !== 'object') return payload;

  const out = { ...payload };
  const enFields = Object.keys(out).filter(k => k.endsWith('_en'));
  if (enFields.length === 0) return out;

  for (const target of targets) {
    const tasks = [];
    for (const enKey of enFields) {
      const baseKey = enKey.slice(0, -3); // strip _en
      const targetKey = `${baseKey}_${target}`;
      const enVal = out[enKey];
      const targetVal = out[targetKey];

      if (!enVal || typeof enVal !== 'string') continue;
      if (onlyIfEmpty && targetVal && String(targetVal).trim()) continue;

      tasks.push({ targetKey, enVal });
    }
    if (tasks.length === 0) continue;

    const translated = await translateBatch(
      tasks.map(t => t.enVal), 'en', target,
    );
    tasks.forEach((t, i) => {
      if (translated[i]) out[t.targetKey] = translated[i];
    });
  }

  return out;
}

/**
 * Translate JSONB site_settings value of shape:
 *   { field: { en: "...", bn: "...", zh: "..." }, ... }
 * Auto-fills missing bn/zh from en.
 */
async function autoFillSettingsValue(value, opts = {}) {
  const { onlyIfEmpty = true, targets = ['bn', 'zh'] } = opts;
  if (!value || typeof value !== 'object') return value;

  const out = JSON.parse(JSON.stringify(value));
  for (const target of targets) {
    const tasks = [];
    for (const field of Object.keys(out)) {
      const node = out[field];
      if (!node || typeof node !== 'object') continue;
      const enVal = node.en;
      const targetVal = node[target];
      if (!enVal || typeof enVal !== 'string') continue;
      if (onlyIfEmpty && targetVal && String(targetVal).trim()) continue;
      // Skip URLs / icon names / pure numerics — LibreTranslate often mangles them
      if (/^https?:\/\//.test(enVal)) continue;
      if (/^[A-Z][a-zA-Z]*$/.test(enVal) && enVal.length < 20) continue; // icon names like "Briefcase"
      if (/^[\d\s+\-.,]+$/.test(enVal)) continue;
      tasks.push({ field, enVal });
    }
    if (tasks.length === 0) continue;
    const translated = await translateBatch(
      tasks.map(t => t.enVal), 'en', target,
    );
    tasks.forEach((t, i) => {
      if (translated[i]) out[t.field][target] = translated[i];
    });
  }
  return out;
}

module.exports = {
  translateText,
  translateBatch,
  autoFillTranslations,
  autoFillSettingsValue,
};
