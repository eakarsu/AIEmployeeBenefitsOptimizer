// Dependent aging transitions: age out of plans, adult coverage options.
const express = require('express');
const auth = require('../middleware/auth');
const { Dependent } = require('../models');
const router = express.Router();

const ADULT_AGE_OUT = 26;

// GET /api/dependent-aging/upcoming?within_days=180
router.get('/upcoming', auth, async (req, res) => {
  try {
    const withinDays = Math.min(parseInt(req.query.within_days) || 180, 730);
    const all = await Dependent.findAll({ limit: 5000 });
    const horizon = new Date(Date.now() + withinDays * 86400000);
    const upcoming = all.filter(d => {
      if (!d.dob) return false;
      const ageOutDate = new Date(d.dob);
      ageOutDate.setFullYear(ageOutDate.getFullYear() + ADULT_AGE_OUT);
      return ageOutDate > new Date() && ageOutDate <= horizon;
    }).map(d => {
      const ageOutDate = new Date(d.dob);
      ageOutDate.setFullYear(ageOutDate.getFullYear() + ADULT_AGE_OUT);
      return { dependent_id: d.id, employee_id: d.employee_id, name: d.name, dob: d.dob, ages_out_at: ageOutDate.toISOString() };
    }).sort((a, b) => new Date(a.ages_out_at) - new Date(b.ages_out_at));
    return res.json({ within_days: withinDays, count: upcoming.length, upcoming });
  } catch (e) {
    return res.status(500).json({ error: 'lookup failed' });
  }
});

module.exports = router;
