const express = require('express');
const { BenefitsPlan, EnrollmentRecord, CostModel, Claim, EmployeeProfile, Dependent, PremiumBilling, AuditLog } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

function toCSV(data) {
  if (!data.length) return '';
  const headers = Object.keys(data[0].toJSON ? data[0].toJSON() : data[0]);
  const rows = data.map(row => {
    const obj = row.toJSON ? row.toJSON() : row;
    return headers.map(h => {
      const val = obj[h] == null ? '' : String(obj[h]);
      return val.includes(',') || val.includes('"') || val.includes('\n')
        ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

const exportModels = {
  'benefits-plans': BenefitsPlan,
  'enrollment': EnrollmentRecord,
  'cost-models': CostModel,
  'claims': Claim,
  'employees': EmployeeProfile,
  'dependents': Dependent,
  'premium-billing': PremiumBilling,
  'audit-log': AuditLog
};

// Export data as CSV
router.get('/:entity', auth, async (req, res) => {
  try {
    const Model = exportModels[req.params.entity];
    if (!Model) return res.status(400).json({ error: `Invalid export entity: ${req.params.entity}. Available: ${Object.keys(exportModels).join(', ')}` });

    const data = await Model.findAll({ order: [['createdAt', 'DESC']] });
    const csv = toCSV(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.entity}-export-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
