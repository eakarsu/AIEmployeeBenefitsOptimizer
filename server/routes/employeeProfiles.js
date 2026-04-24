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
    const employee = await EmployeeProfile.create(req.body);
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
