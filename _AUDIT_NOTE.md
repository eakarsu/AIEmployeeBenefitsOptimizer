# Audit Notes — AIEmployeeBenefitsOptimizer

Audit source: `_AUDIT/reports/batch_03.md` § 12 (substantive).

## Original audit recommendations

### Missing AI counterparts
- `/carrier-negotiation` — suggest negotiation angles.
- `/plan-costs-forecast` — multi-year cost prediction.

### Missing non-AI features
- Multi-year (year-over-year) trend comparison.
- Broker portal.
- Real-time claims status.
- HRIS / payroll integration.

### Custom feature suggestions
- Agentic enrollment assistant.
- Predictive medical-spend ML model.
- Wellness ROI tracking.
- Mental-health parity audit.
- Dependent-aging transitions.
- COBRA admin automation.
- Voluntary-benefits marketplace.

## Current state observed

24 routes, 16 AI endpoints already covering compare-plans, enrollment-guidance,
cost-analysis, compliance-check, generate-education, claims-analysis,
wellness-analysis, dependent-analysis, enrollment-optimization,
carrier-evaluation, life-events-analysis, fsa-hsa-optimization,
billing-analysis, benchmark-analysis, document-compliance, chat. Mature vertical.

## Implementations applied this pass

None — incremental AI additions on top of an already-rich surface should be
prioritized against actual user signals, not mechanically added.

## Prioritized backlog

1. **MECHANICAL** — Add `/api/ai/carrier-negotiation` reading
   `claims` + `benchmarks` + `carrierContacts` and producing data-driven
   negotiation talking points.
2. **MECHANICAL** — Add `/api/ai/plan-costs-forecast` reading `costModels`
   and projecting 3-year cost trajectories with assumption sensitivities.
3. **NEEDS-CREDS** — HRIS / payroll integrations require per-vendor APIs
   (ADP, Workday, BambooHR).
4. **NEEDS-PRODUCT-DECISION** — Voluntary-benefits marketplace requires
   carrier partnerships and revenue-share terms.
5. **TOO-RISKY** — Mental-health parity audits touch protected health
   information, require legal sign-off.

## Apply pass 3 (frontend)

The 16 endpoints in `routes/ai.js` were already wired across 15 resource pages (Claims, Enrollment, CostModels, ACACompliance, etc.). However, the additional endpoints in `routes/aiNew.js` (`benefits-recommendation`, `compliance-calendar`, `predictive-cost`) and the `chat` endpoint in `routes/ai.js` had no FE entry point.

Added a dedicated "AI Tools" page that exposes those 4 endpoints with focused forms and a JSON viewer for the structured outputs (chat uses the existing `AIOutput` markdown renderer). 503 / `OPENROUTER_API_KEY` errors render an "AI not configured" warning.

- File added: `client/src/pages/AITools.js`
- Files modified: `client/src/App.js` (route), `client/src/components/Layout.js` (nav)
- Auth: uses existing `api` axios instance with token interceptor
- Syntax check: babel-parser PASS on App.js, Layout.js, AITools.js

## Apply pass 4 (mechanical backlog)

Picked up the two remaining MECHANICAL items from the original audit's prioritized backlog.

- **Carrier Negotiation** — `POST /api/ai/carrier-negotiation` (BE: `server/routes/aiNew.js`). Reads `Claim`, `BenefitsBenchmark`, `CarrierContact`. Produces data-driven negotiation talking points (claims-derived loss-ratio leverage, benchmark gaps, recommended concessions).
- **Plan Costs Forecast** — `POST /api/ai/plan-costs-forecast` (BE: `server/routes/aiNew.js`). Reads `CostModel` + `BenefitsPlan`. Projects 3-year cost trajectory with assumption sensitivities (low/base/high scenarios per variable).

Both endpoints:
- Reuse existing `callOpenRouter`, `persistAnalysis` from `aiNew.js`.
- Inline 503 guard for missing `OPENROUTER_API_KEY` or placeholder `your_openrouter_api_key_here`.
- Reuse `auth` middleware + `aiRateLimiter`.

FE: `client/src/pages/AITools.js` extended with two new tabs (icons `FiBriefcase`, `FiBarChart2`) and per-tool form schemas (carrier_id / carrier_name / focus_area; plan_id / horizon_years / scenario_assumptions). Existing JWT-bearer + 503 detection branch already handle new endpoints.

- Smoke test: PASS — login OK, both endpoints return HTTP 503 with the placeholder env value.
- Syntax check: `node --check server/routes/aiNew.js` PASS, `@babel/parser` PASS on `AITools.js`.

## Apply pass 5 (all backlog)

Picked up 4 remaining custom-feature items from the audit. Mental-health parity audit remains TOO-RISKY (PHI).

- **Wellness ROI** — `POST /api/ai/wellness-roi` (MECHANICAL). Reads `WellnessProgram` + `Claim`; LLM computes per-program ROI, payback months, portfolio-level recommendations.
- **Dependent Aging** — `POST /api/ai/dependent-aging` (MECHANICAL + PRODUCT-DECISION). Computes age-out date from `Dependent.dateOfBirth`; PRODUCT-DECISION default age-out 26 (ACA standard) — overridable via body.age_out_years. Generates per-dependent transition plan + COBRA-eligibility flag.
- **COBRA Automation** — `POST /api/ai/cobra-automation` (MECHANICAL + PRODUCT-DECISION). Reads `EmployeeProfile`, `EnrollmentRecord`, `Dependent`. PRODUCT-DECISION defaults: regulatory_regime=federal, qualifying_event=termination — both overridable. Returns timeline, premium calc, generated notice letter.
- **Multi-Year Trend** — `POST /api/ai/multi-year-trend` (MECHANICAL). In-memory year-bucketing of `Claim` + `EnrollmentRecord`; LLM produces YoY deltas, multi-year CAGR, projections.

All four endpoints:
- Reuse existing `callOpenRouter`, `persistAnalysis`, `aiRateLimiter`.
- Inline 503 guard for missing `OPENROUTER_API_KEY` or placeholder; response shape `{ error, missing: 'OPENROUTER_API_KEY' }`.

FE: `client/src/pages/AITools.js` extended with four new tabs (icons `FiHeart`, `FiUsers`, `FiFileText`, `FiClock`) and per-tool form schemas.

- Smoke test: PASS — login OK at alt port 4019 with admin@benefitsoptimizer.com / password123, all 4 endpoints return HTTP 503 with `missing: OPENROUTER_API_KEY`.
- Syntax check: `node --check server/routes/aiNew.js` PASS, `@babel/parser` PASS on `AITools.js`.
