// ============================================================
// === Batch 03 Gaps & Frontend Mounts ===
// Auto-generated Gap-feature endpoints (lean v0).
// TODO: configure credentials (set OPENROUTER_API_KEY).
// ============================================================
const express = require('express');
const router = express.Router();

let _gfReady = false;
async function ensureGapTable(pool) {
  if (_gfReady || !pool) return;
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS gap_features (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(120) NOT NULL,
      user_id INT,
      input JSONB,
      output JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    _gfReady = true;
  } catch (_) { /* tolerant of missing DB */ }
}

async function callAI(prompt) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return { ok: false, status: 503, error: 'AI service unavailable. Set OPENROUTER_API_KEY (TODO: configure credentials).' };
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      }),
    });
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return { ok: r.ok, status: r.status, text, raw: data };
  } catch (e) {
    return { ok: false, status: 500, error: String(e.message || e) };
  }
}

function buildHandler(slug, label, hint) {
  return async (req, res) => {
    const body = req.body || {};
    const userId = req.user?.id || null;
    const prompt = `Feature: ${label}\nContext hint: ${hint}\nUser input:\n${JSON.stringify(body, null, 2)}\n\nProduce a concise, actionable response.`;
    const ai = await callAI(prompt);
    try {
      const pool = req.app.locals.pool || req.app.get('pool') || null;
      if (pool) {
        await ensureGapTable(pool);
        await pool.query('INSERT INTO gap_features(slug, user_id, input, output) VALUES ($1,$2,$3,$4)',
          [slug, userId, body, { text: ai.text || ai.error || null }]);
      }
    } catch (_) { /* tolerant */ }
    if (!ai.ok) return res.status(ai.status || 500).json({ error: ai.error || ai.text || `Upstream error (${ai.status})`, slug });
    res.json({ slug, label, result: ai.text });
  };
}

router.post('/gap-no-carrier-negotiation-angle-generator', buildHandler('gap-ai-no-carrier-negotiation-angle-generator', 'No carrier-negotiation angle generator', 'No carrier-negotiation angle generator'));
router.post('/gap-no-multi-year-plan-cost-forecaster', buildHandler('gap-ai-no-multi-year-plan-cost-forecaster', 'No multi-year plan-cost forecaster', 'No multi-year plan-cost forecaster'));
router.post('/gap-no-mental-health-parity-gap-analyser', buildHandler('gap-ai-no-mental-health-parity-gap-analyser', 'No mental-health-parity gap analyser', 'No mental-health-parity gap analyser'));
router.post('/gap-no-multi-year-cost-comparison-reports', buildHandler('gap-non-no-multi-year-cost-comparison-reports', 'No multi-year cost comparison reports', 'No multi-year cost comparison reports'));
router.post('/gap-no-broker-portal-endpoints', buildHandler('gap-non-no-broker-portal-endpoints', 'No broker portal endpoints', 'No broker portal endpoints'));
router.post('/gap-no-real-time-claims-status-only-stored', buildHandler('gap-non-no-real-time-claims-status-only-stored', 'No real-time claims status (only stored)', 'No real-time claims status (only stored)'));
router.post('/gap-limited-hris-payroll-integration-no-workday-adp-connector', buildHandler('gap-non-limited-hris-payroll-integration-no-workday-adp-connector', 'Limited HRIS/payroll integration (no Workday/ADP connector)', 'Limited HRIS/payroll integration (no Workday/ADP connector)'));
router.post('/gap-no-webhooks', buildHandler('gap-non-no-webhooks', 'No webhooks', 'No webhooks'));
router.post('/gap-no-file-upload-no-spd-policy-doc-ingest', buildHandler('gap-non-no-file-upload-no-spd-policy-doc-ingest', 'No file upload (no SPD/policy doc ingest)', 'No file upload (no SPD/policy doc ingest)'));

module.exports = router;
