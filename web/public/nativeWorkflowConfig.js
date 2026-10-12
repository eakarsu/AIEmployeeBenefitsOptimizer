window.nativeWorkflowConfig = {
  "title": "Employee Benefits Optimizer",
  "features": [
    {
      "id": "ai-compare-plans",
      "endpoint": "/ai/compare-plans",
      "title": "Compare plans",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "plans",
          "type": "text",
          "required": false,
          "label": "Plans",
          "presets": [
            "PPO: $620 monthly premium, $1,500 deductible, $4,500 out-of-pocket maximum; HDHP: $430 premium, $3,200 deductible, $6,000 maximum.",
            "PPO: $710 monthly premium, $750 deductible, broad network; HMO: $490 premium, $1,250 deductible, local network.",
            "HDHP: $390 monthly premium, $3,000 deductible with $800 employer HSA contribution; EPO: $550 premium, $1,000 deductible."
          ],
          "manual": false
        },
        {
          "key": "criteria",
          "type": "text",
          "required": false,
          "label": "Criteria",
          "presets": [
            "Compare annual cost for a family expecting routine care and prescriptions.",
            "Prioritize predictable specialist access and total yearly cost.",
            "Consider a healthy employee who values HSA savings and emergency coverage."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 73
      }
    },
    {
      "id": "ai-enrollment-guidance",
      "endpoint": "/ai/enrollment-guidance",
      "title": "Enrollment guidance",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "employeeProfile",
          "type": "text",
          "required": false,
          "label": "Employee Profile",
          "presets": [
            "Illustrative employee: age 34, family coverage, expected specialist visits, moderate prescription use.",
            "Illustrative employee: age 27, individual coverage, low expected use, wants HSA eligibility.",
            "Illustrative employee: age 52, spouse coverage, ongoing treatment and predictable copays preferred."
          ],
          "manual": true
        },
        {
          "key": "availablePlans",
          "type": "text",
          "required": false,
          "label": "Available Plans",
          "presets": [
            "PPO: $620 monthly, $1,500 deductible; HDHP: $430 monthly, $3,200 deductible.",
            "HDHP: $390 monthly, $3,000 deductible, $800 employer HSA contribution; HMO: $470 monthly, $1,200 deductible.",
            "PPO: $710 monthly, $750 deductible; EPO: $550 monthly, $1,000 deductible."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 91
      }
    },
    {
      "id": "ai-cost-analysis",
      "endpoint": "/ai/cost-analysis",
      "title": "Cost analysis",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "costData",
          "type": "text",
          "required": false,
          "label": "Cost Data",
          "presets": [
            "Current annual premium $720,000 for 100 employees; claims trend 7%; employer share 75%.",
            "Annual premium $1.2M for 180 employees; renewal increase 9%; utilization up 4%.",
            "Annual premium $540,000 for 80 employees; high-cost claims $95,000; employer share 80%."
          ],
          "manual": false
        },
        {
          "key": "scenario",
          "type": "text",
          "required": false,
          "label": "Scenario",
          "presets": [
            "Compare 5%, 7%, and 10% renewal increases over three years.",
            "Estimate savings from moving 20% of enrollment to an HDHP.",
            "Model a 10% increase in enrollment and a 6% medical trend."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 109
      }
    },
    {
      "id": "ai-compliance-check",
      "endpoint": "/ai/compliance-check",
      "title": "Compliance check",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "complianceData",
          "type": "text",
          "required": false,
          "label": "Compliance Data",
          "presets": [
            "Illustrative 120-person employer; review ACA affordability and annual notices for the upcoming plan year.",
            "Illustrative self-funded plan; review required disclosures and claims appeal deadlines.",
            "Illustrative employer with employees in three states; review enrollment notices and privacy obligations."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 127
      }
    },
    {
      "id": "ai-generate-education",
      "endpoint": "/ai/generate-education",
      "title": "Generate education",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "topic",
          "type": "text",
          "required": false,
          "label": "Topic",
          "presets": [
            "How deductibles and out-of-pocket maximums work",
            "How to compare an HSA-eligible plan with a PPO",
            "What to do after a qualifying life event"
          ],
          "manual": false
        },
        {
          "key": "audience",
          "type": "text",
          "required": false,
          "label": "Audience",
          "presets": [
            "New employees choosing individual coverage",
            "Employees considering family coverage",
            "Benefits administrators preparing open enrollment"
          ],
          "manual": false
        },
        {
          "key": "contentType",
          "type": "text",
          "required": false,
          "label": "Content Type",
          "presets": [
            "Plain-language FAQ",
            "One-page comparison guide",
            "Step-by-step checklist"
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 145
      }
    },
    {
      "id": "ai-claims-analysis",
      "endpoint": "/ai/claims-analysis",
      "title": "Claims analysis",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "claimsData",
          "type": "text",
          "required": false,
          "label": "Claims Data",
          "presets": [
            "Illustrative claims: 120 medical claims, $180,000 billed, $125,000 paid, 9 denials; identify utilization themes.",
            "Illustrative claims: 40 pharmacy claims, $24,000 paid, 5 specialty prescriptions; summarize cost drivers.",
            "Illustrative claims: 25 out-of-network claims, $38,000 paid, 4 appeals; review recurring issues."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 163
      }
    },
    {
      "id": "ai-wellness-analysis",
      "endpoint": "/ai/wellness-analysis",
      "title": "Wellness analysis",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "wellnessData",
          "type": "text",
          "required": false,
          "label": "Wellness Data",
          "presets": [
            "Illustrative wellness program: 100 eligible employees, 42 participants, $18,000 annual budget; summarize engagement.",
            "Illustrative screening program: 75 eligible, 50 participants, $12,000 cost; identify participation barriers.",
            "Illustrative mental health program: 200 eligible, 60 active users, $30,000 budget; suggest measurement plan."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 175
      }
    },
    {
      "id": "ai-dependent-analysis",
      "endpoint": "/ai/dependent-analysis",
      "title": "Dependent analysis",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "dependentData",
          "type": "text",
          "required": false,
          "label": "Dependent Data",
          "presets": [
            "Illustrative family: employee with spouse and two children, ages 12 and 20; review eligibility questions.",
            "Illustrative dependent approaching age 26 in six months; identify transition steps.",
            "Illustrative employee adding a newborn after a qualifying event; outline documentation and timing."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 187
      }
    },
    {
      "id": "ai-enrollment-optimization",
      "endpoint": "/ai/enrollment-optimization",
      "title": "Enrollment optimization",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "enrollmentData",
          "type": "text",
          "required": false,
          "label": "Enrollment Data",
          "presets": [
            "Illustrative open enrollment: 100 eligible, 74 completed, 26 pending; deadline in two weeks.",
            "Illustrative enrollment: 240 eligible, 180 completed; 35% selected HDHP and 65% PPO.",
            "Illustrative new hire cohort: 45 eligible, 30 enrolled, 10 waived, 5 incomplete."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 199
      }
    },
    {
      "id": "ai-carrier-evaluation",
      "endpoint": "/ai/carrier-evaluation",
      "title": "Carrier evaluation",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "carrierData",
          "type": "text",
          "required": false,
          "label": "Carrier Data",
          "presets": [
            "Illustrative carrier A: 94% claims accuracy, 3-day average service response, 8% renewal increase.",
            "Illustrative carrier B: broad network, 89% claims accuracy, 6-day response, 5% renewal increase.",
            "Illustrative carrier C: 96% claims accuracy, narrow network, 7% renewal increase."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 211
      }
    },
    {
      "id": "ai-life-events-analysis",
      "endpoint": "/ai/life-events-analysis",
      "title": "Life events analysis",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "lifeEventsData",
          "type": "text",
          "required": false,
          "label": "Life Events Data",
          "presets": [
            "Illustrative employee reports marriage on June 12; identify enrollment steps and documents.",
            "Illustrative employee reports birth of a child; outline dependent addition and deadline checks.",
            "Illustrative employee loses other coverage; identify special enrollment review steps."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 223
      }
    },
    {
      "id": "ai-fsa-hsa-optimization",
      "endpoint": "/ai/fsa-hsa-optimization",
      "title": "Fsa hsa optimization",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "fsaHsaData",
          "type": "text",
          "required": false,
          "label": "Fsa Hsa Data",
          "presets": [
            "Illustrative employee expects $2,400 in eligible expenses and has access to an HSA-eligible HDHP.",
            "Illustrative family expects $4,000 in eligible expenses and offers a health FSA.",
            "Illustrative employee has a $900 carryover and expects $1,600 in expenses next year."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 235
      }
    },
    {
      "id": "ai-billing-analysis",
      "endpoint": "/ai/billing-analysis",
      "title": "Billing analysis",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "billingData",
          "type": "text",
          "required": false,
          "label": "Billing Data",
          "presets": [
            "Illustrative invoice: $62,000 billed for 100 covered lives; enrollment roster shows 98 active.",
            "Illustrative premium reconciliation: $48,000 billed, $46,500 expected, two retroactive terminations.",
            "Illustrative invoice: 120 covered lives, three duplicate charges, one missing dependent adjustment."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 247
      }
    },
    {
      "id": "ai-benchmark-analysis",
      "endpoint": "/ai/benchmark-analysis",
      "title": "Benchmark analysis",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "benchmarkData",
          "type": "text",
          "required": false,
          "label": "Benchmark Data",
          "presets": [
            "Illustrative employer medical premium $620 per employee per month; peer median $590.",
            "Illustrative employer HSA contribution $800 annually; peer range $500 to $1,000.",
            "Illustrative employer dental participation 72%; peer median 68%."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 259
      }
    },
    {
      "id": "ai-document-compliance",
      "endpoint": "/ai/document-compliance",
      "title": "Document compliance",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "documentData",
          "type": "text",
          "required": false,
          "label": "Document Data",
          "presets": [
            "Illustrative summary plan description last revised two years ago; review disclosure checklist.",
            "Illustrative open-enrollment notice packet; check clarity of eligibility and deadlines.",
            "Illustrative plan amendment changing prescription tiers; identify participant communication needs."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 271
      }
    },
    {
      "id": "ai-chat",
      "endpoint": "/ai/chat",
      "title": "Chat",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "message",
          "type": "text",
          "required": false,
          "label": "Message",
          "presets": [
            "Explain the difference between a deductible and an out-of-pocket maximum.",
            "What information should employees gather before choosing a health plan?",
            "How can HR explain an HSA-eligible plan during open enrollment?"
          ],
          "manual": false
        },
        {
          "key": "context",
          "type": "text",
          "required": false,
          "label": "Context",
          "presets": [
            "Audience: new employees; use plain language and one example.",
            "Audience: family coverage shoppers; keep the answer concise.",
            "Audience: benefits team; include a short action checklist."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/ai.js",
        "line": 283
      }
    },
    {
      "id": "ai-benefits-recommendation",
      "endpoint": "/ai/benefits-recommendation",
      "title": "Benefits recommendation",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "employee_id",
          "type": "text",
          "required": true,
          "label": "Employee id",
          "manual": true,
          "resource": "employee-profiles"
        }
      ],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 71
      }
    },
    {
      "id": "ai-compliance-calendar",
      "endpoint": "/ai/compliance-calendar",
      "title": "Compliance calendar",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 112
      }
    },
    {
      "id": "ai-predictive-cost",
      "endpoint": "/ai/predictive-cost",
      "title": "Predictive cost",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "date_range",
          "type": "text",
          "required": false,
          "label": "Date range",
          "presets": [
            "Next 12 months",
            "Next calendar year",
            "Next 24 months"
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 139
      }
    },
    {
      "id": "ai-carrier-negotiation",
      "endpoint": "/ai/carrier-negotiation",
      "title": "Carrier negotiation",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "carrier_id",
          "type": "text",
          "required": true,
          "label": "Carrier id",
          "manual": true,
          "resource": "carrier-contacts"
        },
        {
          "key": "carrier_name",
          "type": "text",
          "required": false,
          "label": "Carrier name",
          "presets": [
            "Current medical carrier",
            "Incumbent dental carrier",
            "Prospective vision carrier"
          ],
          "manual": false
        },
        {
          "key": "focus_area",
          "type": "text",
          "required": false,
          "label": "Focus area",
          "presets": [
            "Renewal pricing, network access, and service levels",
            "Claims accuracy, reporting, and escalation timing",
            "Premium guarantees and member support"
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 194
      }
    },
    {
      "id": "ai-plan-costs-forecast",
      "endpoint": "/ai/plan-costs-forecast",
      "title": "Plan costs forecast",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "plan_id",
          "type": "text",
          "required": true,
          "label": "Cost model",
          "manual": true,
          "resource": "cost-models"
        },
        {
          "key": "horizon_years",
          "default": 3,
          "type": "number",
          "required": false,
          "label": "Horizon years",
          "presets": [
            3,
            5,
            2
          ],
          "manual": false
        },
        {
          "key": "scenario_assumptions",
          "type": "text",
          "required": false,
          "label": "Scenario assumptions",
          "presets": [
            "Medical trend 6%; enrollment stable; employer share 75%.",
            "Medical trend 8%; enrollment grows 5% annually; employer share 70%.",
            "Medical trend 4%; enrollment declines 3%; employer share 80%."
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 250
      }
    },
    {
      "id": "ai-wellness-roi",
      "endpoint": "/ai/wellness-roi",
      "title": "Wellness roi",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "program_id",
          "type": "text",
          "required": true,
          "label": "Program id",
          "manual": true,
          "resource": "wellness"
        },
        {
          "key": "lookback_months",
          "default": 12,
          "type": "number",
          "required": false,
          "label": "Lookback months",
          "presets": [
            12,
            24,
            18
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 293
      }
    },
    {
      "id": "ai-dependent-aging",
      "endpoint": "/ai/dependent-aging",
      "title": "Dependent aging",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "age_out_years",
          "default": 26,
          "type": "number",
          "required": false,
          "label": "Age out years",
          "presets": [
            26,
            26,
            25
          ],
          "manual": false
        },
        {
          "key": "lookahead_days",
          "default": 365,
          "type": "number",
          "required": false,
          "label": "Lookahead days",
          "presets": [
            90,
            180,
            365
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 332
      }
    },
    {
      "id": "ai-cobra-automation",
      "endpoint": "/ai/cobra-automation",
      "title": "Cobra automation",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "employee_id",
          "type": "text",
          "required": true,
          "label": "Employee id",
          "manual": true,
          "resource": "employee-profiles"
        },
        {
          "key": "qualifying_event",
          "default": "termination",
          "type": "text",
          "required": false,
          "label": "Qualifying event",
          "presets": [
            "Termination of employment",
            "Reduction in hours",
            "Divorce or legal separation"
          ],
          "manual": false
        },
        {
          "key": "regulatory_regime",
          "default": "federal",
          "type": "text",
          "required": false,
          "label": "Regulatory regime",
          "presets": [
            "Federal COBRA; verify applicable state continuation rules",
            "Federal COBRA; verify plan and notice dates",
            "Federal COBRA; verify applicable state requirements"
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 372
      }
    },
    {
      "id": "ai-multi-year-trend",
      "endpoint": "/ai/multi-year-trend",
      "title": "Multi year trend",
      "description": "Examples are illustrative. Confirm source data and review the response before taking operational action.",
      "fields": [
        {
          "key": "years_back",
          "default": 3,
          "type": "number",
          "required": false,
          "label": "Years back",
          "presets": [
            3,
            5,
            2
          ],
          "manual": false
        },
        {
          "key": "metric",
          "default": "all",
          "type": "text",
          "required": false,
          "label": "Metric",
          "presets": [
            "total_cost",
            "per_employee_cost",
            "claims_cost"
          ],
          "manual": false
        }
      ],
      "source": {
        "file": "server/routes/aiNew.js",
        "line": 405
      }
    }
  ],
  "resources": [
    {
      "key": "benefits-plans",
      "endpoint": "/benefits-plans",
      "label": "Benefits plans",
      "fields": [
        "planName",
        "carrier",
        "planType",
        "monthlyPremium",
        "deductible",
        "outOfPocketMax",
        "copayCost",
        "coinsurance",
        "networkSize",
        "coverageLevel",
        "dentalIncluded",
        "visionIncluded",
        "hsaEligible",
        "rating"
      ],
      "updateFields": [
        "planName",
        "carrier",
        "planType",
        "monthlyPremium",
        "deductible",
        "outOfPocketMax",
        "copayCost",
        "coinsurance",
        "networkSize",
        "coverageLevel",
        "dentalIncluded",
        "visionIncluded",
        "hsaEligible",
        "rating",
        "status"
      ],
      "delete": true,
      "source": "server/routes/benefitsPlans.js"
    },
    {
      "key": "employee-profiles",
      "endpoint": "/employee-profiles",
      "label": "Employee profiles",
      "fields": [
        "firstName",
        "lastName",
        "email",
        "phone",
        "department",
        "position",
        "employeeId",
        "hireDate",
        "dateOfBirth",
        "employmentType",
        "salary",
        "manager",
        "location",
        "emergencyContact",
        "emergencyPhone",
        "benefitsEligible",
        "enrolledPlan",
        "notes"
      ],
      "updateFields": [
        "firstName",
        "lastName",
        "email",
        "phone",
        "department",
        "position",
        "employeeId",
        "hireDate",
        "dateOfBirth",
        "employmentType",
        "salary",
        "manager",
        "location",
        "emergencyContact",
        "emergencyPhone",
        "benefitsEligible",
        "enrolledPlan",
        "notes",
        "status"
      ],
      "delete": true,
      "source": "server/routes/employeeProfiles.js"
    },
    {
      "key": "carrier-contacts",
      "endpoint": "/carrier-contacts",
      "label": "Carrier contacts",
      "fields": [
        "carrierName",
        "contactName",
        "contactTitle",
        "email",
        "phone",
        "accountNumber",
        "groupNumber",
        "planTypes",
        "contractStartDate",
        "contractEndDate",
        "renewalDate",
        "commissionRate",
        "serviceRating",
        "escalationContact",
        "escalationPhone",
        "notes"
      ],
      "updateFields": [
        "carrierName",
        "contactName",
        "contactTitle",
        "email",
        "phone",
        "accountNumber",
        "groupNumber",
        "planTypes",
        "contractStartDate",
        "contractEndDate",
        "renewalDate",
        "commissionRate",
        "serviceRating",
        "escalationContact",
        "escalationPhone",
        "notes",
        "status"
      ],
      "delete": true,
      "source": "server/routes/carrierContacts.js"
    },
    {
      "key": "wellness",
      "endpoint": "/wellness",
      "label": "Wellness",
      "fields": [
        "programName",
        "category",
        "description",
        "vendor",
        "startDate",
        "endDate",
        "maxParticipants",
        "currentParticipants",
        "incentiveType",
        "incentiveAmount",
        "annualBudget",
        "costPerEmployee",
        "participationRate",
        "healthOutcomeMetric",
        "roiEstimate",
        "eligibility"
      ],
      "updateFields": [
        "programName",
        "category",
        "description",
        "vendor",
        "startDate",
        "endDate",
        "maxParticipants",
        "currentParticipants",
        "incentiveType",
        "incentiveAmount",
        "annualBudget",
        "costPerEmployee",
        "participationRate",
        "healthOutcomeMetric",
        "roiEstimate",
        "eligibility",
        "status"
      ],
      "delete": true,
      "source": "server/routes/wellness.js"
    },
    {
      "key": "cost-models",
      "endpoint": "/cost-models",
      "label": "Cost models",
      "fields": [],
      "delete": false,
      "source": "server/routes/costModels.js"
    }
  ]
};
