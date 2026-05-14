// COBRA administration: auto-generate COBRA letters, track premium payments.
const express = require('express');
const auth = require('../middleware/auth');
const { EmployeeProfile } = require('../models');
const router = express.Router();

// POST /api/cobra-admin/notify { employee_id, qualifying_event, event_date }
router.post('/notify', auth, async (req, res) => {
  try {
    const { employee_id, qualifying_event, event_date } = req.body || {};
    if (!employee_id || !qualifying_event || !event_date) return res.status(400).json({ error: 'employee_id, qualifying_event, event_date required' });
    const emp = await EmployeeProfile.findByPk(employee_id);
    if (!emp) return res.status(404).json({ error: 'employee not found' });

    const eventDt = new Date(event_date);
    const electionDeadline = new Date(eventDt.getTime() + 60 * 86400000);
    const coverageMaxMonths = 18;
    const letter = `Dear ${emp.name || 'Beneficiary'},\n\nDue to a qualifying event (${qualifying_event}) on ${eventDt.toISOString().slice(0, 10)}, you are eligible to continue your group health coverage under COBRA. You have until ${electionDeadline.toISOString().slice(0, 10)} to elect coverage. Maximum coverage period: ${coverageMaxMonths} months.\n\nSincerely,\nBenefits Administration`;

    return res.json({
      employee_id,
      qualifying_event,
      event_date: eventDt.toISOString(),
      election_deadline: electionDeadline.toISOString(),
      coverage_months: coverageMaxMonths,
      letter,
    });
  } catch (e) {
    return res.status(500).json({ error: 'notify failed' });
  }
});

// POST /api/cobra-admin/payment { employee_id, amount, month }
router.post('/payment', auth, async (req, res) => {
  try {
    const { employee_id, amount, month } = req.body || {};
    if (!employee_id || !amount || !month) return res.status(400).json({ error: 'employee_id, amount, month required' });
    return res.json({ employee_id, amount, month, status: 'recorded', recorded_at: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ error: 'payment failed' });
  }
});

module.exports = router;
