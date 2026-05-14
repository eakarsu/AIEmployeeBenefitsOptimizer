const express = require('express');
const { EnrollmentRecord } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all (paginated)
router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await EnrollmentRecord.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    res.json({
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single
router.get('/:id', auth, async (req, res) => {
  try {
    const record = await EnrollmentRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post('/', auth, async (req, res) => {
  try {
    const record = await EnrollmentRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const record = await EnrollmentRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    await record.update(req.body);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await EnrollmentRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Record not found' });
    await record.destroy();
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
