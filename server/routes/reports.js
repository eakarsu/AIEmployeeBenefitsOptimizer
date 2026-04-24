const express = require('express');
const { BenefitsPlan, EnrollmentRecord, CostModel, Claim, WellnessProgram, EmployeeProfile, PremiumBilling, FSAHSAAccount } = require('../models');
const auth = require('../middleware/auth');
const { Op, fn, col, literal } = require('sequelize');
const router = express.Router();

// Enrollment summary report
router.get('/enrollment-summary', auth, async (req, res) => {
  try {
    const enrollments = await EnrollmentRecord.findAll();
    const byPlan = {};
    const byDepartment = {};
    const byStatus = {};
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;

    enrollments.forEach(e => {
      byPlan[e.planName] = (byPlan[e.planName] || 0) + 1;
      byDepartment[e.department || 'Unknown'] = (byDepartment[e.department || 'Unknown'] || 0) + 1;
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      totalEmployeeContrib += Number(e.monthlyContribution) || 0;
      totalEmployerContrib += Number(e.employerContribution) || 0;
    });

    res.json({
      totalEnrollments: enrollments.length,
      byPlan,
      byDepartment,
      byStatus,
      totalMonthlyEmployeeContributions: totalEmployeeContrib,
      totalMonthlyEmployerContributions: totalEmployerContrib,
      averageEmployeeContribution: enrollments.length ? (totalEmployeeContrib / enrollments.length).toFixed(2) : 0,
      averageDependents: enrollments.length ? (enrollments.reduce((a, e) => a + (e.dependents || 0), 0) / enrollments.length).toFixed(1) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cost overview report
router.get('/cost-overview', auth, async (req, res) => {
  try {
    const costModels = await CostModel.findAll();
    const billing = await PremiumBilling.findAll();

    const totalAnnualCost = costModels.reduce((a, c) => a + (Number(c.totalAnnualCost) || 0), 0);
    const avgEmployerShare = costModels.length ? costModels.reduce((a, c) => a + (Number(c.employerSharePercent) || 0), 0) / costModels.length : 0;
    const totalBilled = billing.reduce((a, b) => a + (Number(b.totalPremium) || 0), 0);
    const totalPaid = billing.filter(b => b.paidDate).reduce((a, b) => a + (Number(b.totalPremium) || 0), 0);
    const overdue = billing.filter(b => b.status === 'overdue').length;

    const byIndustry = {};
    costModels.forEach(c => {
      if (!byIndustry[c.industry]) byIndustry[c.industry] = { count: 0, totalCost: 0 };
      byIndustry[c.industry].count++;
      byIndustry[c.industry].totalCost += Number(c.totalAnnualCost) || 0;
    });

    res.json({
      totalAnnualCost,
      averageEmployerSharePercent: avgEmployerShare.toFixed(1),
      totalBilledAmount: totalBilled,
      totalPaidAmount: totalPaid,
      outstandingAmount: totalBilled - totalPaid,
      overdueInvoices: overdue,
      costModelCount: costModels.length,
      byIndustry
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Claims summary report
router.get('/claims-summary', auth, async (req, res) => {
  try {
    const claims = await Claim.findAll();
    const byType = {};
    const byStatus = {};
    const byDepartment = {};
    let totalBilled = 0, totalPaid = 0, totalDenied = 0;

    claims.forEach(c => {
      byType[c.claimType || 'Unknown'] = (byType[c.claimType || 'Unknown'] || 0) + 1;
      byStatus[c.claimStatus] = (byStatus[c.claimStatus] || 0) + 1;
      byDepartment[c.department || 'Unknown'] = (byDepartment[c.department || 'Unknown'] || 0) + 1;
      totalBilled += Number(c.amountBilled) || 0;
      totalPaid += Number(c.amountPaid) || 0;
      if (c.claimStatus === 'denied') totalDenied++;
    });

    res.json({
      totalClaims: claims.length,
      byType,
      byStatus,
      byDepartment,
      totalAmountBilled: totalBilled,
      totalAmountPaid: totalPaid,
      denialRate: claims.length ? ((totalDenied / claims.length) * 100).toFixed(1) : 0,
      averageClaimAmount: claims.length ? (totalBilled / claims.length).toFixed(2) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Employee demographics report
router.get('/employee-demographics', auth, async (req, res) => {
  try {
    const employees = await EmployeeProfile.findAll();
    const byDepartment = {};
    const byLocation = {};
    const byEmploymentType = {};
    const byStatus = {};

    employees.forEach(e => {
      byDepartment[e.department || 'Unknown'] = (byDepartment[e.department || 'Unknown'] || 0) + 1;
      byLocation[e.location || 'Unknown'] = (byLocation[e.location || 'Unknown'] || 0) + 1;
      byEmploymentType[e.employmentType] = (byEmploymentType[e.employmentType] || 0) + 1;
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    });

    const eligible = employees.filter(e => e.benefitsEligible).length;

    res.json({
      totalEmployees: employees.length,
      benefitsEligible: eligible,
      benefitsEligiblePercent: employees.length ? ((eligible / employees.length) * 100).toFixed(1) : 0,
      byDepartment,
      byLocation,
      byEmploymentType,
      byStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Plan comparison report
router.get('/plan-comparison', auth, async (req, res) => {
  try {
    const plans = await BenefitsPlan.findAll({ where: { status: 'active' } });
    const byType = {};
    const byCarrier = {};

    plans.forEach(p => {
      if (!byType[p.planType]) byType[p.planType] = { count: 0, avgPremium: 0, avgDeductible: 0, plans: [] };
      byType[p.planType].count++;
      byType[p.planType].avgPremium += Number(p.monthlyPremium) || 0;
      byType[p.planType].avgDeductible += Number(p.deductible) || 0;
      byType[p.planType].plans.push(p.planName);

      byCarrier[p.carrier] = (byCarrier[p.carrier] || 0) + 1;
    });

    Object.keys(byType).forEach(k => {
      byType[k].avgPremium = (byType[k].avgPremium / byType[k].count).toFixed(2);
      byType[k].avgDeductible = (byType[k].avgDeductible / byType[k].count).toFixed(2);
    });

    res.json({
      totalActivePlans: plans.length,
      byType,
      byCarrier,
      lowestPremium: plans.length ? plans.reduce((a, b) => Number(a.monthlyPremium) < Number(b.monthlyPremium) ? a : b).planName : null,
      highestRated: plans.length ? plans.reduce((a, b) => Number(a.rating) > Number(b.rating) ? a : b).planName : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
