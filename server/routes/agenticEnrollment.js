// Agentic enrollment: NL prompt → recommended plans + tradeoff explanation.
const express = require('express');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { BenefitsPlan } = require('../models');
const router = express.Router();

async function callOpenRouter(prompt, system) {
  const key = process.env.OPENROUTER_API_KEY; // TODO: configure credentials
  if (!key) return null;
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022',
      messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
      max_tokens: 1200,
    }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  return j.choices?.[0]?.message?.content;
}

// POST /api/agentic-enrollment/recommend { brief, family_size?, budget_monthly?, employer_id? }
router.post('/recommend', auth, aiRateLimiter, async (req, res) => {
  try {
    const { brief, family_size, budget_monthly, employer_id } = req.body || {};
    if (!brief) return res.status(400).json({ error: 'brief required' });

    const where = employer_id ? { employer_id } : {};
    const plans = await BenefitsPlan.findAll({ where, limit: 50 });
    const system = 'You are a benefits advisor. Recommend optimal plans for the brief with tradeoffs. Output JSON {"top_plans":[{"plan_id":id,"reason":"...","monthly_cost":num}],"tradeoffs":"...","next_questions":["..."]}.';
    const ctx = `Brief: ${brief}\nFamily size: ${family_size || 'unknown'}\nBudget: ${budget_monthly || 'unknown'}\nPlans: ${JSON.stringify(plans).slice(0, 4000)}`;
    const raw = await callOpenRouter(ctx, system);
    if (!raw) return res.status(503).json({ error: 'OPENROUTER_API_KEY missing' });
    let parsed;
    try { parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw); } catch { parsed = { raw }; }
    return res.json({ brief, recommendation: parsed });
  } catch (e) {
    return res.status(500).json({ error: 'recommend failed' });
  }
});

module.exports = router;
