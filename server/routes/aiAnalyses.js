const express = require('express');
const auth = require('../middleware/auth');
const { AiAnalysis } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// GET /api/ai-analyses - list with pagination + optional entity_type filter
router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const where = {};
    if (req.query.entity_type) {
      where.entity_type = req.query.entity_type;
    }
    const { count, rows } = await AiAnalysis.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
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

// GET /api/ai-analyses/:entity_type/:entity_id - history for specific entity
router.get('/:entity_type/:entity_id', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const { count, rows } = await AiAnalysis.findAndCountAll({
      where: {
        entity_type: req.params.entity_type,
        entity_id: req.params.entity_id
      },
      order: [['created_at', 'DESC']],
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

module.exports = router;
