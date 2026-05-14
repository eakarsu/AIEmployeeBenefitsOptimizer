// Predictive health costs: ML model predicts next-year medical spend by
// employee cohort. v0 uses prior-year average + simple inflation factor.
const express = require('express');
const auth = require('../middleware/auth');
const { Claim, EmployeeProfile } = require('../models');
const router = express.Router();

const INFLATION = Number(process.env.MEDICAL_INFLATION || 0.06);

// GET /api/predictive-health-costs/cohort?employer_id=&group_by=age|department
router.get('/cohort', auth, async (req, res) => {
  try {
    const { employer_id, group_by = 'age' } = req.query;
    const claims = await Claim.findAll({ where: employer_id ? { employer_id } : {}, limit: 5000 });
    const employees = await EmployeeProfile.findAll({ where: employer_id ? { employer_id } : {}, limit: 5000 });
    const empMap = new Map(employees.map(e => [e.id, e]));

    const buckets = new Map();
    for (const c of claims) {
      const emp = empMap.get(c.employee_id);
      if (!emp) continue;
      let key;
      if (group_by === 'department') key = emp.department || 'unknown';
      else {
        const age = Number(emp.age) || 30;
        key = age < 25 ? '<25' : age < 35 ? '25-34' : age < 45 ? '35-44' : age < 55 ? '45-54' : age < 65 ? '55-64' : '65+';
      }
      const b = buckets.get(key) || { sum: 0, count: 0 };
      b.sum += Number(c.amount || 0);
      b.count++;
      buckets.set(key, b);
    }
    const projections = [];
    for (const [k, v] of buckets.entries()) {
      const avg = v.sum / v.count;
      projections.push({ cohort: k, claims_count: v.count, avg_actual: Math.round(avg), avg_projected_next_year: Math.round(avg * (1 + INFLATION)) });
    }
    projections.sort((a, b) => b.avg_projected_next_year - a.avg_projected_next_year);
    return res.json({ employer_id: employer_id || null, group_by, inflation: INFLATION, projections });
  } catch (e) {
    return res.status(500).json({ error: 'cohort failed', detail: e.message });
  }
});

module.exports = router;
