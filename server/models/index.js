const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'hr_admin' }
}, { tableName: 'users', timestamps: true });

// Benefits Plans Model
const BenefitsPlan = sequelize.define('BenefitsPlan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  planName: { type: DataTypes.STRING, allowNull: false },
  carrier: { type: DataTypes.STRING, allowNull: false },
  planType: { type: DataTypes.STRING, allowNull: false }, // HMO, PPO, EPO, HDHP
  monthlyPremium: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  deductible: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  outOfPocketMax: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  copayCost: { type: DataTypes.DECIMAL(10, 2) },
  coinsurance: { type: DataTypes.INTEGER }, // percentage
  networkSize: { type: DataTypes.STRING },
  coverageLevel: { type: DataTypes.STRING }, // Employee, Employee+Spouse, Family
  dentalIncluded: { type: DataTypes.BOOLEAN, defaultValue: false },
  visionIncluded: { type: DataTypes.BOOLEAN, defaultValue: false },
  hsaEligible: { type: DataTypes.BOOLEAN, defaultValue: false },
  rating: { type: DataTypes.DECIMAL(2, 1) },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'benefits_plans', timestamps: true });

// Enrollment Records Model
const EnrollmentRecord = sequelize.define('EnrollmentRecord', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employeeName: { type: DataTypes.STRING, allowNull: false },
  employeeEmail: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING },
  planName: { type: DataTypes.STRING, allowNull: false },
  carrier: { type: DataTypes.STRING },
  enrollmentDate: { type: DataTypes.DATEONLY },
  coverageStartDate: { type: DataTypes.DATEONLY },
  coverageLevel: { type: DataTypes.STRING },
  monthlyContribution: { type: DataTypes.DECIMAL(10, 2) },
  employerContribution: { type: DataTypes.DECIMAL(10, 2) },
  status: { type: DataTypes.STRING, defaultValue: 'active' }, // active, pending, terminated
  dependents: { type: DataTypes.INTEGER, defaultValue: 0 },
  notes: { type: DataTypes.TEXT }
}, { tableName: 'enrollment_records', timestamps: true });

// Cost Models Model
const CostModel = sequelize.define('CostModel', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  modelName: { type: DataTypes.STRING, allowNull: false },
  companySize: { type: DataTypes.INTEGER, allowNull: false },
  industry: { type: DataTypes.STRING },
  planType: { type: DataTypes.STRING },
  avgEmployeeAge: { type: DataTypes.DECIMAL(4, 1) },
  totalAnnualCost: { type: DataTypes.DECIMAL(12, 2) },
  employerSharePercent: { type: DataTypes.INTEGER },
  employeeSharePercent: { type: DataTypes.INTEGER },
  perEmployeeMonthlyCost: { type: DataTypes.DECIMAL(10, 2) },
  projectedIncrease: { type: DataTypes.DECIMAL(4, 1) }, // percentage
  hsaContribution: { type: DataTypes.DECIMAL(10, 2) },
  adminCosts: { type: DataTypes.DECIMAL(10, 2) },
  claimsHistory: { type: DataTypes.STRING },
  renewalDate: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'cost_models', timestamps: true });

// ACA Compliance Model
const ACACompliance = sequelize.define('ACACompliance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  ein: { type: DataTypes.STRING },
  totalEmployees: { type: DataTypes.INTEGER, allowNull: false },
  fullTimeEmployees: { type: DataTypes.INTEGER },
  partTimeEmployees: { type: DataTypes.INTEGER },
  aleStatus: { type: DataTypes.BOOLEAN }, // Applicable Large Employer
  minimumEssentialCoverage: { type: DataTypes.BOOLEAN },
  affordabilityTestPassed: { type: DataTypes.BOOLEAN },
  minimumValueTestPassed: { type: DataTypes.BOOLEAN },
  form1095cFiled: { type: DataTypes.BOOLEAN },
  form1094cFiled: { type: DataTypes.BOOLEAN },
  reportingYear: { type: DataTypes.INTEGER },
  penaltyRisk: { type: DataTypes.STRING }, // none, low, medium, high
  lastAuditDate: { type: DataTypes.DATEONLY },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'aca_compliance', timestamps: true });

// Employee Education Model
const EmployeeEducation = sequelize.define('EmployeeEducation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false }, // health, dental, vision, hsa, fsa, retirement, wellness
  contentType: { type: DataTypes.STRING }, // article, video, infographic, quiz, guide
  description: { type: DataTypes.TEXT },
  content: { type: DataTypes.TEXT },
  targetAudience: { type: DataTypes.STRING }, // all, new_hires, managers, executives
  difficulty: { type: DataTypes.STRING }, // beginner, intermediate, advanced
  estimatedReadTime: { type: DataTypes.INTEGER }, // minutes
  tags: { type: DataTypes.STRING },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  helpfulVotes: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'employee_education', timestamps: true });

// Claims Analytics Model
const Claim = sequelize.define('Claim', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  claimNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  employeeName: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING },
  planName: { type: DataTypes.STRING, allowNull: false },
  carrier: { type: DataTypes.STRING },
  claimType: { type: DataTypes.STRING }, // medical, dental, vision, pharmacy, mental_health
  serviceDate: { type: DataTypes.DATEONLY },
  claimDate: { type: DataTypes.DATEONLY },
  providerName: { type: DataTypes.STRING },
  diagnosisCode: { type: DataTypes.STRING },
  amountBilled: { type: DataTypes.DECIMAL(10, 2) },
  amountAllowed: { type: DataTypes.DECIMAL(10, 2) },
  amountPaid: { type: DataTypes.DECIMAL(10, 2) },
  employeeResponsibility: { type: DataTypes.DECIMAL(10, 2) },
  claimStatus: { type: DataTypes.STRING, defaultValue: 'submitted' }, // submitted, processing, approved, denied, appealed
  denialReason: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'claims', timestamps: true });

// Wellness Programs Model
const WellnessProgram = sequelize.define('WellnessProgram', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  programName: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING }, // fitness, nutrition, mental_health, preventive, smoking_cessation, financial_wellness
  description: { type: DataTypes.TEXT },
  vendor: { type: DataTypes.STRING },
  startDate: { type: DataTypes.DATEONLY },
  endDate: { type: DataTypes.DATEONLY },
  maxParticipants: { type: DataTypes.INTEGER },
  currentParticipants: { type: DataTypes.INTEGER, defaultValue: 0 },
  incentiveType: { type: DataTypes.STRING }, // premium_discount, hsa_contribution, gift_card, pto
  incentiveAmount: { type: DataTypes.DECIMAL(10, 2) },
  annualBudget: { type: DataTypes.DECIMAL(10, 2) },
  costPerEmployee: { type: DataTypes.DECIMAL(10, 2) },
  participationRate: { type: DataTypes.DECIMAL(5, 2) },
  healthOutcomeMetric: { type: DataTypes.STRING },
  roiEstimate: { type: DataTypes.DECIMAL(5, 2) },
  eligibility: { type: DataTypes.STRING, defaultValue: 'all' },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'wellness_programs', timestamps: true });

// Dependent Management Model
const Dependent = sequelize.define('Dependent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employeeName: { type: DataTypes.STRING, allowNull: false },
  employeeEmail: { type: DataTypes.STRING, allowNull: false },
  dependentName: { type: DataTypes.STRING, allowNull: false },
  relationship: { type: DataTypes.STRING }, // spouse, child, domestic_partner, disabled_dependent
  dateOfBirth: { type: DataTypes.DATEONLY },
  ssnLast4: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  coveredUnderPlan: { type: DataTypes.STRING },
  coverageStartDate: { type: DataTypes.DATEONLY },
  coverageEndDate: { type: DataTypes.DATEONLY },
  verificationStatus: { type: DataTypes.STRING, defaultValue: 'pending' }, // verified, pending, expired, failed
  verificationDate: { type: DataTypes.DATEONLY },
  documentOnFile: { type: DataTypes.STRING },
  ageOutDate: { type: DataTypes.DATEONLY },
  disabledDependent: { type: DataTypes.BOOLEAN, defaultValue: false },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'dependents', timestamps: true });

// Open Enrollment Periods Model
const OpenEnrollment = sequelize.define('OpenEnrollment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  enrollmentName: { type: DataTypes.STRING, allowNull: false },
  planYear: { type: DataTypes.INTEGER, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: false },
  coverageEffectiveDate: { type: DataTypes.DATEONLY },
  eligibleEmployees: { type: DataTypes.INTEGER },
  enrolledEmployees: { type: DataTypes.INTEGER, defaultValue: 0 },
  completionRate: { type: DataTypes.DECIMAL(5, 2) },
  changesAllowed: { type: DataTypes.BOOLEAN, defaultValue: true },
  lateEnrollmentGrace: { type: DataTypes.INTEGER },
  communicationsSent: { type: DataTypes.INTEGER, defaultValue: 0 },
  reminderFrequency: { type: DataTypes.STRING },
  newPlansAvailable: { type: DataTypes.INTEGER },
  discontinuedPlans: { type: DataTypes.STRING },
  averagePremiumChange: { type: DataTypes.DECIMAL(5, 2) },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'upcoming' }
}, { tableName: 'open_enrollments', timestamps: true });

// Carrier Contacts Model
const CarrierContact = sequelize.define('CarrierContact', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  carrierName: { type: DataTypes.STRING, allowNull: false },
  contactName: { type: DataTypes.STRING, allowNull: false },
  contactTitle: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  accountNumber: { type: DataTypes.STRING },
  groupNumber: { type: DataTypes.STRING },
  planTypes: { type: DataTypes.STRING },
  contractStartDate: { type: DataTypes.DATEONLY },
  contractEndDate: { type: DataTypes.DATEONLY },
  renewalDate: { type: DataTypes.DATEONLY },
  commissionRate: { type: DataTypes.DECIMAL(4, 2) },
  serviceRating: { type: DataTypes.DECIMAL(2, 1) },
  escalationContact: { type: DataTypes.STRING },
  escalationPhone: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'carrier_contacts', timestamps: true });

// Life Event Model
const LifeEvent = sequelize.define('LifeEvent', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employeeName: { type: DataTypes.STRING, allowNull: false },
  employeeEmail: { type: DataTypes.STRING, allowNull: false },
  eventType: { type: DataTypes.STRING, allowNull: false }, // marriage, birth, divorce, adoption, death, job_loss
  eventDate: { type: DataTypes.DATEONLY, allowNull: false },
  documentType: { type: DataTypes.STRING },
  verificationStatus: { type: DataTypes.STRING, defaultValue: 'pending' }, // verified, pending, failed
  affectedPlans: { type: DataTypes.STRING },
  coverageChangeRequired: { type: DataTypes.BOOLEAN, defaultValue: false },
  newCoverageLevel: { type: DataTypes.STRING },
  effectiveDate: { type: DataTypes.DATEONLY },
  deadline: { type: DataTypes.DATEONLY },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'life_events', timestamps: true });

// FSA/HSA Account Model
const FSAHSAAccount = sequelize.define('FSAHSAAccount', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  accountHolderName: { type: DataTypes.STRING, allowNull: false },
  accountHolderEmail: { type: DataTypes.STRING, allowNull: false },
  accountType: { type: DataTypes.STRING, allowNull: false }, // FSA, HSA, DCFSA
  employerContribution: { type: DataTypes.DECIMAL(10, 2) },
  employeeContribution: { type: DataTypes.DECIMAL(10, 2) },
  currentBalance: { type: DataTypes.DECIMAL(10, 2) },
  annualLimit: { type: DataTypes.DECIMAL(10, 2) },
  planYear: { type: DataTypes.INTEGER },
  carryoverAmount: { type: DataTypes.DECIMAL(10, 2) },
  rolloverEligible: { type: DataTypes.BOOLEAN, defaultValue: false },
  investmentBalance: { type: DataTypes.DECIMAL(10, 2) },
  lastContributionDate: { type: DataTypes.DATEONLY },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'fsa_hsa_accounts', timestamps: true });

// Premium Billing Model
const PremiumBilling = sequelize.define('PremiumBilling', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  carrier: { type: DataTypes.STRING, allowNull: false },
  billingPeriod: { type: DataTypes.STRING, allowNull: false },
  totalPremium: { type: DataTypes.DECIMAL(12, 2) },
  employerShare: { type: DataTypes.DECIMAL(12, 2) },
  employeeShare: { type: DataTypes.DECIMAL(12, 2) },
  enrolledCount: { type: DataTypes.INTEGER },
  dueDate: { type: DataTypes.DATEONLY },
  paidDate: { type: DataTypes.DATEONLY },
  paymentMethod: { type: DataTypes.STRING },
  balanceAmount: { type: DataTypes.DECIMAL(10, 2) },
  reconciled: { type: DataTypes.BOOLEAN, defaultValue: false },
  discrepancyAmount: { type: DataTypes.DECIMAL(10, 2) },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending, paid, overdue, disputed
}, { tableName: 'premium_billing', timestamps: true });

// Benefits Benchmark Model
const BenefitsBenchmark = sequelize.define('BenefitsBenchmark', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  benchmarkName: { type: DataTypes.STRING, allowNull: false },
  industry: { type: DataTypes.STRING, allowNull: false },
  region: { type: DataTypes.STRING, allowNull: false },
  companySize: { type: DataTypes.INTEGER },
  benchmarkYear: { type: DataTypes.INTEGER, allowNull: false },
  avgMonthlyPremium: { type: DataTypes.DECIMAL(10, 2) },
  avgDeductible: { type: DataTypes.DECIMAL(10, 2) },
  avgEmployerContribution: { type: DataTypes.DECIMAL(10, 2) },
  medianOutOfPocketMax: { type: DataTypes.DECIMAL(10, 2) },
  hsaAdoptionRate: { type: DataTypes.DECIMAL(5, 2) },
  dentalCoverageRate: { type: DataTypes.DECIMAL(5, 2) },
  visionCoverageRate: { type: DataTypes.DECIMAL(5, 2) },
  wellnessProgramRate: { type: DataTypes.DECIMAL(5, 2) },
  source: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'benefits_benchmarks', timestamps: true });

// Employee Profile Model
const EmployeeProfile = sequelize.define('EmployeeProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  position: { type: DataTypes.STRING },
  employeeId: { type: DataTypes.STRING, unique: true },
  hireDate: { type: DataTypes.DATEONLY },
  dateOfBirth: { type: DataTypes.DATEONLY },
  employmentType: { type: DataTypes.STRING, defaultValue: 'full_time' }, // full_time, part_time, contractor
  salary: { type: DataTypes.DECIMAL(12, 2) },
  manager: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  emergencyContact: { type: DataTypes.STRING },
  emergencyPhone: { type: DataTypes.STRING },
  benefitsEligible: { type: DataTypes.BOOLEAN, defaultValue: true },
  enrolledPlan: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'employee_profiles', timestamps: true });

// Notification Model
const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // deadline, alert, reminder, info, warning
  category: { type: DataTypes.STRING }, // enrollment, compliance, billing, life_event, general
  priority: { type: DataTypes.STRING, defaultValue: 'medium' }, // low, medium, high, urgent
  targetDate: { type: DataTypes.DATEONLY },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  isDismissed: { type: DataTypes.BOOLEAN, defaultValue: false },
  relatedEntity: { type: DataTypes.STRING },
  relatedEntityId: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'notifications', timestamps: true });

// Audit Log Model
const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  action: { type: DataTypes.STRING, allowNull: false }, // create, update, delete, login, export, view
  entityType: { type: DataTypes.STRING, allowNull: false },
  entityId: { type: DataTypes.INTEGER },
  entityName: { type: DataTypes.STRING },
  userName: { type: DataTypes.STRING, allowNull: false },
  userEmail: { type: DataTypes.STRING },
  changes: { type: DataTypes.TEXT }, // JSON string of changes
  ipAddress: { type: DataTypes.STRING },
  details: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'success' }
}, { tableName: 'audit_logs', timestamps: true });

// Compliance Document Model
const ComplianceDocument = sequelize.define('ComplianceDocument', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  documentName: { type: DataTypes.STRING, allowNull: false },
  documentType: { type: DataTypes.STRING, allowNull: false }, // SPD, SBC, HIPAA_Notice, FMLA_Notice, COBRA_Notice, Form_5500, SAR
  carrier: { type: DataTypes.STRING },
  planYear: { type: DataTypes.INTEGER },
  issueDate: { type: DataTypes.DATEONLY },
  effectiveDate: { type: DataTypes.DATEONLY },
  expiryDate: { type: DataTypes.DATEONLY },
  version: { type: DataTypes.STRING },
  approvedBy: { type: DataTypes.STRING },
  distributionMethod: { type: DataTypes.STRING },
  distributionDate: { type: DataTypes.DATEONLY },
  employeesNotified: { type: DataTypes.INTEGER },
  auditStatus: { type: DataTypes.STRING, defaultValue: 'current' }, // current, expiring, expired, pending_review
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'active' }
}, { tableName: 'compliance_documents', timestamps: true });

module.exports = {
  sequelize,
  User,
  BenefitsPlan,
  EnrollmentRecord,
  CostModel,
  ACACompliance,
  EmployeeEducation,
  Claim,
  WellnessProgram,
  Dependent,
  OpenEnrollment,
  CarrierContact,
  LifeEvent,
  FSAHSAAccount,
  PremiumBilling,
  BenefitsBenchmark,
  ComplianceDocument,
  EmployeeProfile,
  Notification,
  AuditLog
};
