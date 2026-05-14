const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const benefitsPlansRoutes = require('./routes/benefitsPlans');
const enrollmentRoutes = require('./routes/enrollment');
const costModelsRoutes = require('./routes/costModels');
const acaComplianceRoutes = require('./routes/acaCompliance');
const educationRoutes = require('./routes/education');
const aiRoutes = require('./routes/ai');
const aiNewRoutes = require('./routes/aiNew');
const aiAnalysesRoutes = require('./routes/aiAnalyses');
const claimsRoutes = require('./routes/claims');
const wellnessRoutes = require('./routes/wellness');
const dependentsRoutes = require('./routes/dependents');
const openEnrollmentRoutes = require('./routes/openEnrollment');
const carrierContactsRoutes = require('./routes/carrierContacts');
const lifeEventsRoutes = require('./routes/lifeEvents');
const fsaHsaRoutes = require('./routes/fsaHsa');
const premiumBillingRoutes = require('./routes/premiumBilling');
const benchmarksRoutes = require('./routes/benchmarks');
const complianceDocumentsRoutes = require('./routes/complianceDocuments');
const employeeProfilesRoutes = require('./routes/employeeProfiles');
const notificationsRoutes = require('./routes/notifications');
const auditLogRoutes = require('./routes/auditLog');
const reportsRoutes = require('./routes/reports');
const dataExportRoutes = require('./routes/dataExport');

const app = express();
const PORT = process.env.BACKEND_PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/benefits-plans', benefitsPlansRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/cost-models', costModelsRoutes);
app.use('/api/aca-compliance', acaComplianceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai', aiNewRoutes);
app.use('/api/ai-analyses', aiAnalysesRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/dependents', dependentsRoutes);
app.use('/api/open-enrollment', openEnrollmentRoutes);
app.use('/api/carrier-contacts', carrierContactsRoutes);
app.use('/api/life-events', lifeEventsRoutes);
app.use('/api/fsa-hsa', fsaHsaRoutes);
app.use('/api/premium-billing', premiumBillingRoutes);
app.use('/api/benchmarks', benchmarksRoutes);
app.use('/api/compliance-documents', complianceDocumentsRoutes);
app.use('/api/employee-profiles', employeeProfilesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/audit-log', auditLogRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/export', dataExportRoutes);
app.use('/api/agentic-enrollment', require('./routes/agenticEnrollment'));
app.use('/api/predictive-health-costs', require('./routes/predictiveHealthCosts'));
app.use('/api/wellness-roi', require('./routes/wellnessRoi'));
app.use('/api/mental-health-parity', require('./routes/mentalHealthParity'));
app.use('/api/dependent-aging', require('./routes/dependentAging'));
app.use('/api/cobra-admin', require('./routes/cobraAdmin'));
app.use('/api/voluntary-benefits', require('./routes/voluntaryBenefits'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    
// === Batch 03 Gaps & Frontend Mounts ===
try {
  const _batch03 = require('./routes/batch03Gaps');
  if (typeof authenticateToken === 'function') app.use('/api', authenticateToken, _batch03);
  else app.use('/api', _batch03);
} catch (_e) { /* batch03 gap routes optional */ }

app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
