const router = require('express').Router();

router.post('/score', (req, res) => {
  const { uncoveredDependents = 0, agingOutSoon = 0, lifeEventsPending = 0, enrollmentDaysLeft = 30 } = req.body || {};
  const score = Math.min(100, Math.round(
    Number(uncoveredDependents) * 24 +
    Number(agingOutSoon) * 18 +
    Number(lifeEventsPending) * 12 +
    Math.max(0, 14 - Number(enrollmentDaysLeft)) * 2
  ));
  res.json({
    feature: 'dependent_coverage_gap',
    score,
    level: score >= 70 ? 'urgent' : score >= 35 ? 'review' : 'covered',
    actions: [
      Number(uncoveredDependents) > 0 && 'Notify employees with uncovered dependents before enrollment closes.',
      Number(agingOutSoon) > 0 && 'Start aging-out transition workflow for dependents near eligibility limit.',
      Number(lifeEventsPending) > 0 && 'Resolve pending life-event documentation.',
    ].filter(Boolean),
  });
});

module.exports = router;
