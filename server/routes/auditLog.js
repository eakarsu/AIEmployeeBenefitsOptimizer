const express = require('express');
const { AuditLog } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all audit logs (with optional filters)
router.get('/', auth, async (req, res) => {
  try {
    const where = {};
    if (req.query.action) where.action = req.query.action;
    if (req.query.entityType) where.entityType = req.query.entityType;
    if (req.query.userName) where.userName = req.query.userName;
    const logs = await AuditLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(req.query.limit) || 200
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single log entry
router.get('/:id', auth, async (req, res) => {
  try {
    const log = await AuditLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ error: 'Log entry not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create audit log entry
router.post('/', auth, async (req, res) => {
  try {
    const log = await AuditLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
