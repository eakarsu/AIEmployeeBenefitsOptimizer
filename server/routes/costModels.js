const express = require('express');
const { CostModel } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const models = await CostModel.findAll({ order: [['createdAt', 'DESC']] });
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const model = await CostModel.findByPk(req.params.id);
    if (!model) return res.status(404).json({ error: 'Model not found' });
    res.json(model);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const model = await CostModel.create(req.body);
    res.status(201).json(model);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const model = await CostModel.findByPk(req.params.id);
    if (!model) return res.status(404).json({ error: 'Model not found' });
    await model.update(req.body);
    res.json(model);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const model = await CostModel.findByPk(req.params.id);
    if (!model) return res.status(404).json({ error: 'Model not found' });
    await model.destroy();
    res.json({ message: 'Model deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
