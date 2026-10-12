// Wellness ROI tracking: measure health-behavior change → cost savings.
const express = require('express');
const auth = require('../middleware/auth');
const { WellnessProgram } = require('../models');
const router = express.Router();

// GET /api/wellness-roi/:program_id
router.get('/:program_id', auth, async (req, res) => {
  try {
    const program = await WellnessProgram.findByPk(req.params.program_id);
    if (!program) return res.status(404).json({ error: 'program not found' });
    // The native models have no employer/program-to-claim attribution. Do not
    // read unrelated claims or report invented zero costs/savings as measured ROI.
    return res.status(501).json({
      error: 'Measured wellness ROI requires documented program-to-claim attribution, which the native records do not provide.',
      code: 'PROGRAM_CLAIM_ATTRIBUTION_UNAVAILABLE',
      program_id: program.id
    });
  } catch (e) {
    return res.status(500).json({ error: 'roi failed' });
  }
});

module.exports = router;
