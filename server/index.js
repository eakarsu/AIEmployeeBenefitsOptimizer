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
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
