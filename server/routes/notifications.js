const express = require('express');
const { Notification } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Get all notifications
router.get('/', auth, async (req, res) => {
  try {
    const where = {};
    if (req.query.unread === 'true') where.isRead = false;
    if (req.query.priority) where.priority = req.query.priority;
    if (req.query.category) where.category = req.query.category;
    const notifications = await Notification.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.count({ where: { isRead: false, isDismissed: false } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single notification
router.get('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create notification
router.post('/', auth, async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    await notification.update({ isRead: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark all as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.update({ isRead: true }, { where: { isRead: false } });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dismiss notification
router.put('/:id/dismiss', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    await notification.update({ isDismissed: true, isRead: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update notification
router.put('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    await notification.update(req.body);
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    await notification.destroy();
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
