const express = require('express');
const { BenefitsPlan } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all plans
router.get('/', auth, async (req, res) => {
  try {
    const plans = await BenefitsPlan.findAll({ order: [['createdAt', 'DESC']] });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single plan
router.get('/:id', auth, async (req, res) => {
  try {
    const plan = await BenefitsPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create plan
router.post('/', auth, async (req, res) => {
  try {
    const plan = await BenefitsPlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update plan
router.put('/:id', auth, async (req, res) => {
  try {
    const plan = await BenefitsPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    await plan.update(req.body);
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete plan
router.delete('/:id', auth, async (req, res) => {
  try {
    const plan = await BenefitsPlan.findByPk(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    await plan.destroy();
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
