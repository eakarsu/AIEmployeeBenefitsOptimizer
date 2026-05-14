const express = require('express');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { AiAnalysis } = require('../models');
const https = require('https');
const router = express.Router();

async function callOpenRouter(prompt, context) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-5-sonnet-20241022';

  const body = JSON.stringify({
    model: model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert AI Employee Benefits Optimizer assistant. You help HR departments with benefits plan comparison, enrollment guidance, cost modeling, ACA compliance, and employee education. Provide detailed, professional, and actionable advice. Format your responses with clear sections using markdown-style headers (##), bullet points, and bold text for emphasis.'
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
          if (parsed.error) {
            reject(new Error(parsed.error.message || 'OpenRouter API error'));
          } else {
            resolve(parsed);
          }
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

// AI Plan Comparison
router.post('/compare-plans', auth, aiRateLimiter, async (req, res) => {
  try {
    const { plans, criteria } = req.body;
    const prompt = `Compare these employee benefits plans and provide a detailed analysis with recommendations. Focus on: value for money, coverage quality, network access, and suitability for different employee demographics.${criteria ? ` Additional criteria: ${criteria}` : ''}`;
    const result = await callOpenRouter(prompt, { plans });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'plan', entity_id: null, analysis_type: 'compare-plans', result_text: text, user_id: req.user?.id });
    res.json({
      analysis: text,
      model: result.model,
      usage: result.usage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Enrollment Guidance
router.post('/enrollment-guidance', auth, aiRateLimiter, async (req, res) => {
  try {
    const { employeeProfile, availablePlans } = req.body;
    const prompt = `Provide personalized enrollment guidance for this employee. Consider their family situation, health needs, and financial preferences to recommend the best benefits plan. Include step-by-step enrollment instructions.`;
    const result = await callOpenRouter(prompt, { employeeProfile, availablePlans });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'enrollment', entity_id: null, analysis_type: 'enrollment-guidance', result_text: text, user_id: req.user?.id });
    res.json({
      guidance: text,
      model: result.model,
      usage: result.usage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Cost Analysis
router.post('/cost-analysis', auth, aiRateLimiter, async (req, res) => {
  try {
    const { costData, scenario } = req.body;
    const prompt = `Analyze the benefits cost data for this employer and provide: 1) Cost optimization recommendations 2) Year-over-year trend analysis 3) Benchmarking insights compared to industry standards 4) Specific actionable strategies to reduce costs while maintaining quality coverage.${scenario ? ` Scenario: ${scenario}` : ''}`;
    const result = await callOpenRouter(prompt, { costData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'cost_model', entity_id: null, analysis_type: 'cost-analysis', result_text: text, user_id: req.user?.id });
    res.json({
      analysis: text,
      model: result.model,
      usage: result.usage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI ACA Compliance Check
router.post('/compliance-check', auth, aiRateLimiter, async (req, res) => {
  try {
    const { complianceData } = req.body;
    const prompt = `Perform a comprehensive ACA compliance analysis for this organization. Check: 1) ALE status determination 2) Minimum Essential Coverage requirements 3) Affordability Safe Harbor tests 4) Minimum Value requirements 5) Reporting obligations (1094-C/1095-C) 6) Potential penalty exposure. Provide specific remediation steps for any compliance gaps.`;
    const result = await callOpenRouter(prompt, { complianceData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'aca_compliance', entity_id: null, analysis_type: 'compliance-check', result_text: text, user_id: req.user?.id });
    res.json({
      complianceReport: text,
      model: result.model,
      usage: result.usage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Education Content Generator
router.post('/generate-education', auth, aiRateLimiter, async (req, res) => {
  try {
    const { topic, audience, contentType } = req.body;
    const prompt = `Create professional employee benefits education content about "${topic}" for ${audience || 'all employees'}. Content type: ${contentType || 'article'}. Make it engaging, easy to understand, and include practical examples. Include key takeaways and action items.`;
    const result = await callOpenRouter(prompt, { topic, audience, contentType });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'education', entity_id: null, analysis_type: 'generate-education', result_text: text, user_id: req.user?.id });
    res.json({
      content: text,
      model: result.model,
      usage: result.usage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Claims Analysis
router.post('/claims-analysis', auth, aiRateLimiter, async (req, res) => {
  try {
    const { claimsData } = req.body;
    const prompt = `Analyze these employee benefits claims data. Provide: 1) Claims trend analysis by type 2) Top cost drivers 3) Denial patterns and root causes 4) Recommendations to reduce claim costs 5) Fraud risk indicators 6) Provider network optimization suggestions.`;
    const result = await callOpenRouter(prompt, { claimsData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'claim', entity_id: null, analysis_type: 'claims-analysis', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Wellness Program Analysis
router.post('/wellness-analysis', auth, aiRateLimiter, async (req, res) => {
  try {
    const { wellnessData } = req.body;
    const prompt = `Analyze these wellness programs and provide: 1) ROI assessment for each program 2) Participation optimization strategies 3) Program effectiveness ranking 4) Budget allocation recommendations 5) New program suggestions based on gaps 6) Industry benchmarking insights.`;
    const result = await callOpenRouter(prompt, { wellnessData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'wellness', entity_id: null, analysis_type: 'wellness-analysis', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Dependent Verification Analysis
router.post('/dependent-analysis', auth, aiRateLimiter, async (req, res) => {
  try {
    const { dependentData } = req.body;
    const prompt = `Analyze the dependent management data and provide: 1) Verification status summary 2) Age-out risk alerts 3) Coverage gap identification 4) Cost impact of ineligible dependents 5) Recommendations for dependent audit process 6) Compliance risk assessment.`;
    const result = await callOpenRouter(prompt, { dependentData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'dependent', entity_id: null, analysis_type: 'dependent-analysis', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Open Enrollment Optimization
router.post('/enrollment-optimization', auth, aiRateLimiter, async (req, res) => {
  try {
    const { enrollmentData } = req.body;
    const prompt = `Analyze the open enrollment data and provide: 1) Completion rate optimization strategies 2) Communication effectiveness analysis 3) Plan selection trends 4) Premium change impact assessment 5) Employee engagement recommendations 6) Timeline optimization suggestions.`;
    const result = await callOpenRouter(prompt, { enrollmentData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'open_enrollment', entity_id: null, analysis_type: 'enrollment-optimization', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Carrier Evaluation
router.post('/carrier-evaluation', auth, aiRateLimiter, async (req, res) => {
  try {
    const { carrierData } = req.body;
    const prompt = `Evaluate these insurance carriers and provide: 1) Service quality ranking 2) Contract renewal recommendations 3) Commission rate benchmarking 4) Network adequacy assessment 5) Carrier consolidation opportunities 6) Negotiation strategies for upcoming renewals.`;
    const result = await callOpenRouter(prompt, { carrierData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'carrier', entity_id: null, analysis_type: 'carrier-evaluation', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Life Events Analysis
router.post('/life-events-analysis', auth, aiRateLimiter, async (req, res) => {
  try {
    const { lifeEventsData } = req.body;
    const prompt = `Analyze these employee life events data and provide: 1) Special enrollment period guidance for each event type 2) Required documentation checklist 3) Coverage change recommendations 4) Deadline tracking and compliance risks 5) Impact on current benefits elections 6) Best practices for processing qualifying life events efficiently.`;
    const result = await callOpenRouter(prompt, { lifeEventsData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'life_event', entity_id: null, analysis_type: 'life-events-analysis', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI FSA/HSA Optimization
router.post('/fsa-hsa-optimization', auth, aiRateLimiter, async (req, res) => {
  try {
    const { fsaHsaData } = req.body;
    const prompt = `Analyze these FSA/HSA account data and provide: 1) Contribution optimization recommendations per employee 2) Year-end balance analysis and use-it-or-lose-it risk alerts 3) HSA investment strategy suggestions 4) Tax savings calculations 5) Comparison of FSA vs HSA vs DCFSA benefits 6) Employer contribution benchmarking and optimization.`;
    const result = await callOpenRouter(prompt, { fsaHsaData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'fsa_hsa', entity_id: null, analysis_type: 'fsa-hsa-optimization', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Premium Billing Analysis
router.post('/billing-analysis', auth, aiRateLimiter, async (req, res) => {
  try {
    const { billingData } = req.body;
    const prompt = `Analyze these premium billing records and provide: 1) Payment status summary and overdue alerts 2) Discrepancy identification and root cause analysis 3) Carrier billing accuracy assessment 4) Enrolled count reconciliation 5) Cash flow projections for upcoming payments 6) Cost trend analysis across billing periods and recommendations for dispute resolution.`;
    const result = await callOpenRouter(prompt, { billingData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'premium_billing', entity_id: null, analysis_type: 'billing-analysis', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Benchmark Analysis
router.post('/benchmark-analysis', auth, aiRateLimiter, async (req, res) => {
  try {
    const { benchmarkData } = req.body;
    const prompt = `Analyze these benefits benchmarking data and provide: 1) Comparison of company benefits to industry standards 2) Regional and company-size adjusted insights 3) Areas where benefits exceed or fall below benchmarks 4) Premium competitiveness assessment 5) HSA and wellness program adoption comparison 6) Strategic recommendations for benefits design improvements based on market positioning.`;
    const result = await callOpenRouter(prompt, { benchmarkData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'benchmark', entity_id: null, analysis_type: 'benchmark-analysis', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// AI Document Compliance Analysis
router.post('/document-compliance', auth, aiRateLimiter, async (req, res) => {
  try {
    const { documentData } = req.body;
    const prompt = `Analyze these compliance documents and provide: 1) Document inventory completeness check 2) Expiration alerts and renewal timeline 3) Distribution compliance verification 4) Missing or outdated document identification 5) Regulatory requirement gap analysis (ERISA, HIPAA, COBRA, FMLA) 6) Audit readiness assessment and remediation priorities.`;
    const result = await callOpenRouter(prompt, { documentData });
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'compliance_document', entity_id: null, analysis_type: 'document-compliance', result_text: text, user_id: req.user?.id });
    res.json({ analysis: text, model: result.model, usage: result.usage });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// General AI Chat
router.post('/chat', auth, aiRateLimiter, async (req, res) => {
  try {
    const { message, context } = req.body;
    const result = await callOpenRouter(message, context);
    const text = result.choices[0].message.content;
    await persistAnalysis({ entity_type: 'chat', entity_id: null, analysis_type: 'chat', result_text: text, user_id: req.user?.id });
    res.json({
      response: text,
      model: result.model,
      usage: result.usage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
