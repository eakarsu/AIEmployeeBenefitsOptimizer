const express = require('express');
const { EmployeeProfile } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const employees = await EmployeeProfile.findAll({ order: [['lastName', 'ASC'], ['firstName', 'ASC']] });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single employee
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await EmployeeProfile.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create employee
router.post('/', auth, async (req, res) => {
  try {
    const { employee_id, name, department } = req.body;
    // Support both flat name or firstName/lastName fields
    const hasName = name || (req.body.firstName && req.body.lastName);
    const hasEmployeeId = employee_id || req.body.employeeId;
    if (!hasEmployeeId || !hasName || !department) {
      return res.status(400).json({
        error: 'Missing required fields: employee_id, name, department'
      });
    }
    // Map flat fields to model fields if needed
    const payload = { ...req.body };
    if (name && !req.body.firstName) {
      const parts = name.split(' ');
      payload.firstName = parts[0] || name;
      payload.lastName = parts.slice(1).join(' ') || '';
    }
    if (employee_id && !req.body.employeeId) {
      payload.employeeId = employee_id;
    }
    const employee = await EmployeeProfile.create(payload);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update employee
router.put('/:id', auth, async (req, res) => {
  try {
    const employee = await EmployeeProfile.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    await employee.update(req.body);
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete employee
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await EmployeeProfile.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
