// Wellness ROI tracking: measure health-behavior change → cost savings.
const express = require('express');
const auth = require('../middleware/auth');
const { WellnessProgram, Claim } = require('../models');
const router = express.Router();

// GET /api/wellness-roi/:program_id
router.get('/:program_id', auth, async (req, res) => {
  try {
    const program = await WellnessProgram.findByPk(req.params.program_id);
    if (!program) return res.status(404).json({ error: 'program not found' });
    const startedAt = program.started_at || program.createdAt || new Date();
    const claimsBefore = await Claim.findAll({ where: { employer_id: program.employer_id }, limit: 10000 });
    let before = 0, after = 0, n = 0;
    for (const c of claimsBefore) {
      const t = new Date(c.service_date || c.createdAt);
      const amt = Number(c.amount || 0);
      if (t < startedAt) before += amt;
      else { after += amt; n++; }
    }
    const cost = Number(program.cost || 0);
    const savingsPerEnrollee = (before - after) / Math.max(program.enrollee_count || 1, 1);
    const roi = cost > 0 ? Math.round(((before - after - cost) / cost) * 10000) / 100 : null;
    return res.json({
      program_id: program.id,
      pre_period_claims: Math.round(before),
      post_period_claims: Math.round(after),
      enrollees: program.enrollee_count || null,
      program_cost: cost,
      savings_per_enrollee: Math.round(savingsPerEnrollee),
      roi_pct: roi,
    });
  } catch (e) {
    return res.status(500).json({ error: 'roi failed' });
  }
});

module.exports = router;
