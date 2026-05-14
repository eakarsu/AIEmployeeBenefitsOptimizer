const express = require('express');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { AiAnalysis, EmployeeProfile, BenefitsPlan, Claim, EnrollmentRecord, BenefitsBenchmark, CarrierContact, CostModel, WellnessProgram, Dependent } = require('../models');
const https = require('https');
const router = express.Router();

async function callOpenRouter(prompt, context) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022';

  const body = JSON.stringify({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert AI Employee Benefits Optimizer assistant. Provide detailed, professional, and actionable advice in JSON format when requested.'
      },
      {
        role: 'user',
        content: context ? `Context:\n${JSON.stringify(context, null, 2)}\n\nQuestion: ${prompt}` : prompt
      }
    ],
    max_tokens: 2000,
    temperature: 0.7
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Benefits Optimizer'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error.message || 'OpenRouter API error'));
          else resolve(parsed);
        } catch (e) {
          reject(new Error('Failed to parse API response'));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function persistAnalysis({ entity_type, entity_id, analysis_type, result_text, user_id }) {
  try {
    await AiAnalysis.create({ entity_type, entity_id: entity_id || null, analysis_type, result_text, user_id: user_id || null });
  } catch (e) {
    console.error('Failed to persist AI analysis:', e.message);
  }
}

// POST /api/ai/benefits-recommendation
// Accepts { employee_id }, fetches employee profile, compares active plans, returns ranked recommendation
router.post('/benefits-recommendation', auth, aiRateLimiter, async (req, res) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      return res.status(400).json({ error: 'employee_id is required' });
    }

    const employee = await EmployeeProfile.findOne({
      where: { employeeId: String(employee_id) }
    }) || await EmployeeProfile.findByPk(employee_id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const activePlans = await BenefitsPlan.findAll({ where: { status: 'active' } });

    const prompt = `You are an expert benefits advisor. Given the employee profile and available plans, produce a ranked recommendation with cost breakdowns. Return a JSON object with fields: ranked_plans (array of { plan_name, rank, monthly_employee_cost, annual_employee_cost, pros, cons, recommendation_reason }), summary, top_recommendation.`;

    const result = await callOpenRouter(prompt, { employee, activePlans });
    const text = result.choices[0].message.content;

    await persistAnalysis({
      entity_type: 'employee_profile',
      entity_id: employee.id,
      analysis_type: 'benefits-recommendation',
      result_text: text,
      user_id: req.user?.id
    });

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

    res.json({ recommendation: parsed, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/compliance-calendar
// Accepts {}, uses AI to generate ACA/ERISA/COBRA compliance deadline calendar with urgency flags
router.post('/compliance-calendar', auth, aiRateLimiter, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const prompt = `Generate a comprehensive compliance deadline calendar for ${currentYear} and ${currentYear + 1} covering ACA, ERISA, and COBRA regulations. Return a JSON object with field: calendar (array of { deadline_name, regulation, due_date, description, urgency (low/medium/high/critical), days_until_due, required_action }). Include at least 15 key deadlines. Sort by due_date ascending.`;

    const result = await callOpenRouter(prompt, { currentYear });
    const text = result.choices[0].message.content;

    await persistAnalysis({
      entity_type: 'compliance',
      entity_id: null,
      analysis_type: 'compliance-calendar',
      result_text: text,
      user_id: req.user?.id
    });

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

    res.json({ calendar: parsed, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/predictive-cost
// Accepts { date_range }, fetches claims history + enrollment trends, projects premium increases with confidence intervals
router.post('/predictive-cost', auth, aiRateLimiter, async (req, res) => {
  try {
    const { date_range } = req.body;

    const recentClaims = await Claim.findAll({
      order: [['createdAt', 'DESC']],
      limit: 200
    });

    const enrollmentTrends = await EnrollmentRecord.findAll({
      order: [['createdAt', 'DESC']],
      limit: 200
    });

    const prompt = `You are an actuarial AI assistant. Analyze the provided claims history and enrollment trends for the period ${date_range || 'last 12 months'}. Project next-year premium increases with confidence intervals. Return a JSON object with fields: projected_increase_percent, confidence_interval_low, confidence_interval_high, confidence_level, key_cost_drivers (array), trend_analysis, monthly_projections (array of { month, projected_cost, lower_bound, upper_bound }), recommendations (array), summary.`;

    const result = await callOpenRouter(prompt, {
      date_range,
      claims_summary: {
        total_claims: recentClaims.length,
        total_billed: recentClaims.reduce((s, c) => s + parseFloat(c.amountBilled || 0), 0),
        total_paid: recentClaims.reduce((s, c) => s + parseFloat(c.amountPaid || 0), 0),
        by_type: recentClaims.reduce((acc, c) => {
          acc[c.claimType] = (acc[c.claimType] || 0) + 1;
          return acc;
        }, {})
      },
      enrollment_summary: {
        total_enrolled: enrollmentTrends.length,
        active: enrollmentTrends.filter(e => e.status === 'active').length,
        avg_monthly_contribution: enrollmentTrends.reduce((s, e) => s + parseFloat(e.monthlyContribution || 0), 0) / (enrollmentTrends.length || 1)
      }
    });

    const text = result.choices[0].message.content;

    await persistAnalysis({
      entity_type: 'cost_projection',
      entity_id: null,
      analysis_type: 'predictive-cost',
      result_text: text,
      user_id: req.user?.id
    });

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

    res.json({ projection: parsed, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/carrier-negotiation
// Generate data-driven negotiation talking points using claims, benchmarks, carrier contacts
router.post('/carrier-negotiation', auth, aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }
    const { carrier_id, carrier_name, focus_area } = req.body;

    let carrier = null;
    if (carrier_id) {
      try { carrier = await CarrierContact.findByPk(carrier_id); } catch (e) {}
    }
    const carrierLabel = carrier ? (carrier.carrierName || carrier.name) : (carrier_name || 'all carriers');

    const claims = await Claim.findAll({ order: [['createdAt', 'DESC']], limit: 200 });
    const benchmarks = await BenefitsBenchmark.findAll({ limit: 100 });
    const carriers = await CarrierContact.findAll({ limit: 100 });

    const claimsSummary = {
      total_claims: claims.length,
      total_billed: claims.reduce((s, c) => s + parseFloat(c.amountBilled || 0), 0),
      total_paid: claims.reduce((s, c) => s + parseFloat(c.amountPaid || 0), 0),
      avg_paid: claims.length ? (claims.reduce((s, c) => s + parseFloat(c.amountPaid || 0), 0) / claims.length) : 0,
      by_status: claims.reduce((acc, c) => { acc[c.status || 'unknown'] = (acc[c.status || 'unknown'] || 0) + 1; return acc; }, {}),
      by_type: claims.reduce((acc, c) => { acc[c.claimType || 'unknown'] = (acc[c.claimType || 'unknown'] || 0) + 1; return acc; }, {}),
    };

    const prompt = `You are a benefits-broker AI advising on carrier negotiation. Produce data-driven talking points to use against ${carrierLabel}${focus_area ? ' focused on ' + focus_area : ''}. Return a JSON object with fields: talking_points (array of { point, supporting_data, leverage_score (0-100), category (premium|network|claims_handling|service|other) }), benchmark_gaps (array of { metric, our_value, benchmark_value, gap_percent }), recommended_concessions (array of { concession, justification, priority }), risks_if_not_addressed (array), summary.`;

    const result = await callOpenRouter(prompt, {
      carrier: carrier || { name: carrierLabel },
      focus_area: focus_area || null,
      claims_summary: claimsSummary,
      benchmarks: benchmarks.map(b => b.toJSON ? b.toJSON() : b),
      other_carriers: carriers.map(c => c.toJSON ? c.toJSON() : c),
    });
    const text = result.choices[0].message.content;

    await persistAnalysis({
      entity_type: 'carrier_contact',
      entity_id: carrier ? carrier.id : null,
      analysis_type: 'carrier-negotiation',
      result_text: text,
      user_id: req.user?.id,
    });

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

    res.json({ negotiation: parsed, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/plan-costs-forecast
// Multi-year (3-year) cost projection using cost models with sensitivity analysis
router.post('/plan-costs-forecast', auth, aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }
    const { plan_id, horizon_years = 3, scenario_assumptions } = req.body;

    const costModels = plan_id
      ? await CostModel.findAll({ where: { id: plan_id } })
      : await CostModel.findAll({ limit: 100 });

    const plans = await BenefitsPlan.findAll({ where: { status: 'active' }, limit: 50 });

    const prompt = `You are an actuarial AI. Project ${horizon_years}-year cost trajectories for the supplied plans/cost models${scenario_assumptions ? ' under these assumptions: ' + JSON.stringify(scenario_assumptions) : ''}. Provide assumption sensitivities. Return a JSON object with fields: per_plan_forecasts (array of { plan_id, plan_name, year_by_year (array of { year, projected_total_cost, projected_per_employee_cost, key_drivers }), cumulative_cost, growth_rate_cagr }), sensitivity_analysis (array of { variable, low_scenario, base_scenario, high_scenario, impact_percent }), recommended_mitigations (array), summary.`;

    const result = await callOpenRouter(prompt, {
      horizon_years,
      scenario_assumptions: scenario_assumptions || null,
      cost_models: costModels.map(c => c.toJSON ? c.toJSON() : c),
      active_plans: plans.map(p => p.toJSON ? p.toJSON() : p),
    });
    const text = result.choices[0].message.content;

    await persistAnalysis({
      entity_type: plan_id ? 'benefits_plan' : 'cost_forecast',
      entity_id: plan_id || null,
      analysis_type: 'plan-costs-forecast',
      result_text: text,
      user_id: req.user?.id,
    });

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }

    res.json({ forecast: parsed, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/wellness-roi
// MECHANICAL: Compute wellness program ROI from existing WellnessProgram + Claim data,
// then have the LLM narrate ROI/recommendations. Env: OPENROUTER_API_KEY.
router.post('/wellness-roi', auth, aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured', missing: 'OPENROUTER_API_KEY' });
    }
    const { program_id, lookback_months = 12 } = req.body;

    const programs = program_id
      ? await WellnessProgram.findAll({ where: { id: program_id } })
      : await WellnessProgram.findAll({ limit: 50 });
    const claims = await Claim.findAll({ order: [['createdAt', 'DESC']], limit: 300 });

    const claimsTotals = {
      total_billed: claims.reduce((s, c) => s + parseFloat(c.amountBilled || 0), 0),
      total_paid: claims.reduce((s, c) => s + parseFloat(c.amountPaid || 0), 0),
      preventive_count: claims.filter(c => (c.claimType || '').toLowerCase().includes('preventive')).length,
      mental_health_count: claims.filter(c => (c.claimType || '').toLowerCase().includes('mental')).length,
    };

    const prompt = `You are a benefits-analytics AI. Compute ROI for the supplied wellness programs over the last ${lookback_months} months. For each program report investment (annualBudget + costPerEmployee*currentParticipants), estimated savings (claims avoided, productivity uplift), net ROI, payback period. Return JSON: { per_program (array of { program_id, program_name, investment, estimated_savings, net_roi, roi_pct, payback_months, confidence, drivers }), portfolio_roi_pct, top_performer, underperformers (array), recommendations (array), summary }.`;

    const result = await callOpenRouter(prompt, {
      lookback_months,
      programs: programs.map(p => p.toJSON ? p.toJSON() : p),
      claims_summary: claimsTotals,
    });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'wellness_program', entity_id: program_id || null, analysis_type: 'wellness-roi', result_text: text, user_id: req.user?.id });
    let parsed; try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
    res.json({ wellness_roi: parsed, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/dependent-aging
// MECHANICAL: Identify dependents nearing age-out (typically 26 in US). PRODUCT-DECISION:
// default age-out at 26 (ACA standard) — overridable via body.age_out_years.
// Env: OPENROUTER_API_KEY.
router.post('/dependent-aging', auth, aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured', missing: 'OPENROUTER_API_KEY' });
    }
    // PRODUCT-DECISION: ACA-standard age-out is 26; allow override via request body.
    const { age_out_years = 26, lookahead_days = 365 } = req.body;

    const allDependents = await Dependent.findAll({ where: { status: 'active' }, limit: 500 });
    const now = new Date();
    const aging = allDependents
      .filter(d => d.dateOfBirth && (d.relationship || '').toLowerCase() !== 'spouse')
      .map(d => {
        const dob = new Date(d.dateOfBirth);
        const ageOutDate = new Date(dob.getFullYear() + age_out_years, dob.getMonth(), dob.getDate());
        const daysUntil = Math.round((ageOutDate - now) / (1000 * 60 * 60 * 24));
        return { id: d.id, dependentName: d.dependentName, employeeName: d.employeeName, employeeEmail: d.employeeEmail, relationship: d.relationship, dob: d.dateOfBirth, age_out_date: ageOutDate.toISOString().slice(0, 10), days_until_age_out: daysUntil, disabled: d.disabledDependent };
      })
      .filter(d => d.days_until_age_out <= lookahead_days && d.days_until_age_out >= -30 && !d.disabled)
      .sort((a, b) => a.days_until_age_out - b.days_until_age_out)
      .slice(0, 100);

    const prompt = `You are a benefits-administration AI. For each dependent nearing age-out (default ${age_out_years}), produce a transition plan: notification cadence, COBRA-eligibility callout, alternative coverage recommendations. Return JSON: { transitions (array of { dependent_id, employee_email, dependent_name, age_out_date, days_until, notification_steps (array of { offset_days, channel, message }), cobra_eligible (bool), alternative_coverage (array), risk_if_inaction }), summary, total_count }.`;

    const result = await callOpenRouter(prompt, { age_out_years, lookahead_days, aging });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'dependent', entity_id: null, analysis_type: 'dependent-aging', result_text: text, user_id: req.user?.id });
    let parsed; try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
    res.json({ dependent_aging: parsed, candidates: aging, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/cobra-automation
// MECHANICAL: COBRA admin automation — generate notice timelines, premium calculations,
// and continuation eligibility for separated/qualifying-event employees.
// PRODUCT-DECISION: assume federal COBRA (18-month base, 36-month for dependents on
// secondary qualifying events) — overridable via body.regulatory_regime.
// Env: OPENROUTER_API_KEY.
router.post('/cobra-automation', auth, aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured', missing: 'OPENROUTER_API_KEY' });
    }
    const { employee_id, qualifying_event = 'termination', regulatory_regime = 'federal' } = req.body;

    let employee = null;
    if (employee_id) {
      try { employee = await EmployeeProfile.findByPk(employee_id); } catch (e) {}
    }
    const enrollments = employee_id
      ? await EnrollmentRecord.findAll({ where: { employeeId: String(employee_id) }, limit: 20 })
      : [];
    const dependents = employee && employee.email
      ? await Dependent.findAll({ where: { employeeEmail: employee.email }, limit: 20 })
      : [];

    const prompt = `You are a COBRA administration AI under ${regulatory_regime} regime, qualifying event: ${qualifying_event}. Produce a full COBRA action plan. Return JSON: { eligibility: { eligible (bool), reason }, timeline (array of { day_offset, deadline_name, action, regulatory_basis }), premium_calculation: { current_employer_share, current_employee_share, cobra_premium_with_admin_fee, admin_fee_pct, monthly_total }, dependent_specific_notices (array), generated_notice_letter, follow_up_cadence, risks_of_noncompliance, summary }.`;

    const result = await callOpenRouter(prompt, { employee, enrollments, dependents, qualifying_event, regulatory_regime });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'employee_profile', entity_id: employee_id || null, analysis_type: 'cobra-automation', result_text: text, user_id: req.user?.id });
    let parsed; try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
    res.json({ cobra: parsed, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/multi-year-trend
// MECHANICAL: Year-over-year claims/enrollment/cost-model trend comparison.
// Env: OPENROUTER_API_KEY.
router.post('/multi-year-trend', auth, aiRateLimiter, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return res.status(503).json({ error: 'OPENROUTER_API_KEY is not configured', missing: 'OPENROUTER_API_KEY' });
    }
    const { years_back = 3, metric = 'all' } = req.body;

    const claims = await Claim.findAll({ order: [['createdAt', 'DESC']], limit: 1000 });
    const enrollments = await EnrollmentRecord.findAll({ order: [['createdAt', 'DESC']], limit: 1000 });
    const costModels = await CostModel.findAll({ limit: 100 });

    // In-memory bucketing by calendar year — additive only.
    const yearBuckets = {};
    for (const c of claims) {
      const y = c.createdAt ? new Date(c.createdAt).getFullYear() : 'unknown';
      if (!yearBuckets[y]) yearBuckets[y] = { year: y, claims_count: 0, total_billed: 0, total_paid: 0, enrollments_count: 0, by_type: {} };
      yearBuckets[y].claims_count += 1;
      yearBuckets[y].total_billed += parseFloat(c.amountBilled || 0);
      yearBuckets[y].total_paid += parseFloat(c.amountPaid || 0);
      const t = c.claimType || 'unknown';
      yearBuckets[y].by_type[t] = (yearBuckets[y].by_type[t] || 0) + 1;
    }
    for (const e of enrollments) {
      const y = e.createdAt ? new Date(e.createdAt).getFullYear() : 'unknown';
      if (!yearBuckets[y]) yearBuckets[y] = { year: y, claims_count: 0, total_billed: 0, total_paid: 0, enrollments_count: 0, by_type: {} };
      yearBuckets[y].enrollments_count += 1;
    }
    const yearly = Object.values(yearBuckets).filter(b => typeof b.year === 'number').sort((a, b) => b.year - a.year).slice(0, years_back);

    const prompt = `You are a benefits-analytics AI. Given these per-year aggregates (${years_back} years), compute YoY deltas, multi-year CAGR, identify outliers, and project the trajectory. Metric focus: ${metric}. Return JSON: { yearly_metrics (array — pass through), yoy_changes (array of { from_year, to_year, claims_delta_pct, paid_delta_pct, enrollment_delta_pct }), cagr: { paid_pct, enrollment_pct }, outlier_years (array), narrative, projections_next_year, recommendations (array), summary }.`;

    const result = await callOpenRouter(prompt, { yearly, cost_models: costModels.map(c => c.toJSON ? c.toJSON() : c), metric });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'multi_year_trend', entity_id: null, analysis_type: 'multi-year-trend', result_text: text, user_id: req.user?.id });
    let parsed; try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
    res.json({ trend: parsed, yearly, model: result.model, usage: result.usage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
