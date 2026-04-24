const express = require('express');
const { EmployeeEducation } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const resources = await EmployeeEducation.findAll({ order: [['createdAt', 'DESC']] });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await EmployeeEducation.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    // increment views
    await resource.update({ views: resource.views + 1 });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const resource = await EmployeeEducation.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await EmployeeEducation.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    await resource.update(req.body);
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await EmployeeEducation.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    await resource.destroy();
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
