// Voluntary benefits marketplace: accident, critical illness, pet insurance,
// etc., with agent recommendations.
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const CATALOG = [
  { id: 'acc-01', name: 'Accident Insurance', carrier: 'AcmeHealth', monthly_cost: 12, category: 'accident' },
  { id: 'ci-01', name: 'Critical Illness', carrier: 'AcmeHealth', monthly_cost: 18, category: 'critical_illness' },
  { id: 'pet-01', name: 'Pet Insurance', carrier: 'PetCare Co.', monthly_cost: 22, category: 'pet' },
  { id: 'leg-01', name: 'Legal Assistance', carrier: 'LegalShield', monthly_cost: 8, category: 'legal' },
  { id: 'id-01', name: 'Identity Theft Protection', carrier: 'SafeID', monthly_cost: 5, category: 'identity' },
];

// GET /api/voluntary-benefits/catalog
router.get('/catalog', auth, (req, res) => res.json({ count: CATALOG.length, products: CATALOG }));

// POST /api/voluntary-benefits/recommend { profile: { age, dependents, has_pet, ... } }
router.post('/recommend', auth, (req, res) => {
  const p = req.body?.profile || {};
  const recs = [];
  if (Number(p.age) >= 50) recs.push(CATALOG.find(x => x.id === 'ci-01'));
  if (p.has_pet) recs.push(CATALOG.find(x => x.id === 'pet-01'));
  if (Number(p.dependents || 0) > 0) recs.push(CATALOG.find(x => x.id === 'acc-01'));
  if (p.high_risk_role) recs.push(CATALOG.find(x => x.id === 'leg-01'));
  recs.push(CATALOG.find(x => x.id === 'id-01'));
  const filtered = recs.filter(Boolean);
  return res.json({ profile: p, recommendations: filtered });
});

// POST /api/voluntary-benefits/enroll { employee_id, product_id }
router.post('/enroll', auth, (req, res) => {
  const { employee_id, product_id } = req.body || {};
  if (!employee_id || !product_id) return res.status(400).json({ error: 'employee_id + product_id required' });
  const product = CATALOG.find(p => p.id === product_id);
  if (!product) return res.status(404).json({ error: 'product not found' });
  return res.json({ employee_id, product, status: 'enrolled', enrolled_at: new Date().toISOString() });
});

module.exports = router;
