// Mental health parity: ensure mental-health coverage equals medical (a U.S.
// regulatory requirement). Compares MH vs medical metrics.
const express = require('express');
const auth = require('../middleware/auth');
const { BenefitsPlan } = require('../models');
const router = express.Router();

// GET /api/mental-health-parity/:plan_id
router.get('/:plan_id', auth, async (req, res) => {
  try {
    const plan = await BenefitsPlan.findByPk(req.params.plan_id);
    if (!plan) return res.status(404).json({ error: 'plan not found' });
    const med = plan.medical_coverage || {};
    const mh = plan.mental_health_coverage || {};
    const gaps = [];
    function compare(field) {
      const a = Number(med[field] || 0);
      const b = Number(mh[field] || 0);
      if (a > b * 1.1) gaps.push({ field, medical: a, mental_health: b, severity: 'parity_violation' });
      else if (Math.abs(a - b) / Math.max(a, 1) > 0.2) gaps.push({ field, medical: a, mental_health: b, severity: 'warning' });
    }
    compare('annual_visit_limit');
    compare('out_of_pocket_max');
    compare('copay');
    compare('coinsurance_pct');
    return res.json({
      plan_id: plan.id,
      parity_compliant: gaps.filter(g => g.severity === 'parity_violation').length === 0,
      gaps,
    });
  } catch (e) {
    return res.status(500).json({ error: 'parity failed' });
  }
});

module.exports = router;
