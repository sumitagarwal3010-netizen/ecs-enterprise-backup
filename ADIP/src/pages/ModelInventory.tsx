import { useState } from 'react';
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { colors } from '../theme/colors';

const modelInventoryKpis = [
  { label: 'Total Models', value: 10, suffix: '', trend: 5.3 },
  { label: 'Approved Models', value: 7, suffix: '', trend: 2.1 },
  { label: 'Models In Review', value: 2, suffix: '', trend: 0 },
  { label: 'High Risk Models', value: 1, suffix: '', trend: -50 },
];

type ModelRisk = 'High' | 'Medium' | 'Low';
type ModelStatus = 'Approved' | 'In Review' | 'Pilot';
type KpiKey = 'total' | 'approved' | 'inReview' | 'highRisk' | 'mediumRisk' | 'lowRisk';
type GovernanceControlKey = 'humanReview' | 'biasTesting' | 'monitoring' | 'auditLogging' | 'explainability';
type GovernanceAlertKey = 'modelDriftAlert' | 'latencyBreach' | 'dataQualityWarning' | 'missingModelCard' | 'outdatedRiskAssessment';

interface ModelRecord {
  model: string;
  vendor: string;
  version: string;
  risk: ModelRisk;
  riskReason: string;
  status: ModelStatus;
  businessUseCase: string;
  foundationModel: string;
  dataClassification: string;
  riskDrivers: string;
  controls: string;
  approvalStatus: string;
  owner: string;
  businessImpact: string;
  regulatoryImpact: string;
  requiredControls: string[];
}

interface GovernanceControlDetail {
  key: GovernanceControlKey;
  name: string;
  value: number;
  color: string;
  applicationsInScope: string[];
  purpose: string;
  whyItMatters: string;
  coverageCalculation: string;
  modelsRequiringControl: string[];
  modelsCovered: string[];
  coverageFormula: string;
  missingModels?: string[];
  gapReason?: string;
  plannedRemediation?: string;
}

interface GovernanceAlertDetail {
  key: GovernanceAlertKey;
  findingTitle: string;
  relatedApplication: string;
  relatedModel: string;
  lifecycleStage: string;
  shortReason: string;
  issueEvidence: string[];
  missingArtifacts?: { name: string; present: boolean }[];
  severity: 'High' | 'Warning' | 'Healthy';
  impact: string;
  recommendedAction: string;
  owner: string;
  dueDate: string;
  color: string;
}

const models: ModelRecord[] = [
  {
    model: 'Retail Credit Underwriting Copilot',
    vendor: 'Azure OpenAI',
    version: 'gpt-4.1',
    risk: 'High',
    riskReason: 'Lending decisions, customer impact, regulatory impact.',
    status: 'In Review',
    businessUseCase: 'Assist underwriting decisions for retail and SME loans.',
    foundationModel: 'GPT-4.1 with policy-tuned adapters',
    dataClassification: 'Restricted - PII + Financial',
    riskDrivers: 'Credit decision influence, fairness concerns, regulatory scrutiny.',
    controls: 'Human-in-loop approval, fairness tests, monthly risk committee review.',
    approvalStatus: 'Pending final model risk sign-off',
    owner: 'Retail Credit Risk Office',
    businessImpact: 'Directly influences credit decisions and customer outcomes.',
    regulatoryImpact: 'High scrutiny under fair lending and model governance controls.',
    requiredControls: [
      'Human approval required before decision finalization',
      'Bias and fairness validation before each release',
      'Model risk committee sign-off for policy changes',
    ],
  },
  {
    model: 'UPI Fraud Pattern Detector',
    vendor: 'AWS SageMaker',
    version: 'v3.8',
    risk: 'Medium',
    riskReason: 'Internal decision support, monitored outputs.',
    status: 'Approved',
    businessUseCase: 'Prioritize suspicious UPI transactions for analyst review.',
    foundationModel: 'Gradient boosting + behavior rules',
    dataClassification: 'Confidential - Transaction Metadata',
    riskDrivers: 'False positives, drift in fraud patterns.',
    controls: 'Daily threshold tuning, SOC monitoring, analyst override.',
    approvalStatus: 'Approved for production',
    owner: 'Fraud Analytics Team',
    businessImpact: 'Operational fraud prioritization impact on response workflows.',
    regulatoryImpact: 'Moderate reporting obligations under fraud governance.',
    requiredControls: [
      'Human review required for high-value cases',
      'Daily monitoring and threshold governance',
      'Monthly model performance review',
    ],
  },
  {
    model: 'AML Alert Prioritization Engine',
    vendor: 'Databricks Mosaic AI',
    version: 'v2.6',
    risk: 'Medium',
    riskReason: 'Internal decision support, monitored outputs.',
    status: 'Approved',
    businessUseCase: 'Rank AML alerts by investigation urgency.',
    foundationModel: 'Classification ensemble model',
    dataClassification: 'Confidential - AML Case Data',
    riskDrivers: 'Alert miss risk, investigator load skew.',
    controls: 'Dual review for top alerts, explainability logs.',
    approvalStatus: 'Approved with quarterly validation',
    owner: 'AML Intelligence Unit',
    businessImpact: 'Internal investigator prioritization and throughput optimization.',
    regulatoryImpact: 'Moderate compliance oversight for AML controls.',
    requiredControls: [
      'Human review required for escalated alerts',
      'Explainability logs retained for audits',
      'Quarterly validation with compliance team',
    ],
  },
  {
    model: 'Collections Promise-to-Pay Predictor',
    vendor: 'Google Vertex AI',
    version: 'v1.9',
    risk: 'Medium',
    riskReason: 'Internal decision support, monitored outputs.',
    status: 'Approved',
    businessUseCase: 'Predict repayment probability for collections planning.',
    foundationModel: 'Time-series boosted model',
    dataClassification: 'Confidential - Repayment Behavior',
    riskDrivers: 'Bias against vulnerable customer segments.',
    controls: 'Policy floor rules, periodic bias testing.',
    approvalStatus: 'Approved for assisted workflows',
    owner: 'Collections Strategy Office',
    businessImpact: 'Improves collections effectiveness, no autonomous customer action.',
    regulatoryImpact: 'Monitored under customer-treatment policies.',
    requiredControls: [
      'Supervisor review for sensitive cohorts',
      'Policy floor limits on model recommendations',
      'Monthly fairness and drift checks',
    ],
  },
  {
    model: 'Card Dispute Triage Assistant',
    vendor: 'Anthropic Claude',
    version: '4.6 Sonnet',
    risk: 'Low',
    riskReason: 'Advisory or informational use only.',
    status: 'Approved',
    businessUseCase: 'Suggest initial dispute categorization for agents.',
    foundationModel: 'Claude 4.6 Sonnet with retrieval prompts',
    dataClassification: 'Internal - Masked Case Data',
    riskDrivers: 'Suggestion consistency and policy freshness.',
    controls: 'No auto-resolution, supervisor confirmation.',
    approvalStatus: 'Approved for advisory use',
    owner: 'Card Operations Excellence',
    businessImpact: 'Advisory guidance only for service agents.',
    regulatoryImpact: 'Low regulatory impact; no direct decisioning.',
    requiredControls: [
      'No automated decision making',
      'Agent confirmation mandatory',
      'Periodic prompt and output review',
    ],
  },
  {
    model: 'KYC Document Verification Model',
    vendor: 'Azure AI Document Intelligence',
    version: '2025.11',
    risk: 'Medium',
    riskReason: 'Internal decision support, monitored outputs.',
    status: 'Approved',
    businessUseCase: 'Extract KYC fields to assist onboarding analysts.',
    foundationModel: 'OCR + entity extraction pipeline',
    dataClassification: 'Restricted - Identity Documents',
    riskDrivers: 'OCR extraction errors, fraud detection misses.',
    controls: 'Confidence gating, manual fallback checks.',
    approvalStatus: 'Approved with enhanced QA',
    owner: 'Customer Onboarding Governance',
    businessImpact: 'Improves document handling efficiency for onboarding teams.',
    regulatoryImpact: 'Moderate due to KYC data handling obligations.',
    requiredControls: [
      'Manual fallback for low-confidence extraction',
      'PII masking in logs and diagnostics',
      'Weekly QA sample audits',
    ],
  },
  {
    model: 'Treasury Liquidity Forecast Model',
    vendor: 'AWS Bedrock',
    version: 'v2.1',
    risk: 'Low',
    riskReason: 'Advisory or informational use only.',
    status: 'Approved',
    businessUseCase: 'Provide liquidity outlook for treasury planning.',
    foundationModel: 'Hybrid regression forecasting model',
    dataClassification: 'Internal - Treasury Metrics',
    riskDrivers: 'Forecast error during macro volatility.',
    controls: 'Treasury analyst sign-off, stress overlays.',
    approvalStatus: 'Approved for planning advisory',
    owner: 'Treasury Analytics',
    businessImpact: 'Advisory support for treasury planning.',
    regulatoryImpact: 'Low; no automated customer-facing decisions.',
    requiredControls: [
      'Analyst sign-off for final planning decisions',
      'Stress scenario comparison required',
      'Monthly calibration checks',
    ],
  },
  {
    model: 'Branch Demand Forecasting Model',
    vendor: 'Google Vertex AI',
    version: 'v4.2',
    risk: 'Low',
    riskReason: 'Advisory or informational use only.',
    status: 'Approved',
    businessUseCase: 'Forecast branch demand for staffing decisions.',
    foundationModel: 'Temporal forecasting model',
    dataClassification: 'Internal - Branch Operations',
    riskDrivers: 'Seasonal anomalies and local event shocks.',
    controls: 'Planner override and monthly recalibration.',
    approvalStatus: 'Approved for advisory planning',
    owner: 'Branch Transformation PMO',
    businessImpact: 'Informational forecasting for staffing and planning.',
    regulatoryImpact: 'Low regulatory exposure.',
    requiredControls: [
      'Planner override always available',
      'No automated scheduling enforcement',
      'Monthly model accuracy review',
    ],
  },
  {
    model: 'Regulatory Circular Summarizer',
    vendor: 'OpenAI',
    version: 'o3',
    risk: 'Low',
    riskReason: 'Advisory or informational use only.',
    status: 'In Review',
    businessUseCase: 'Summarize RBI circulars for compliance teams.',
    foundationModel: 'o3 with citation-augmented retrieval',
    dataClassification: 'Internal - Regulatory Documents',
    riskDrivers: 'Summary omission or interpretation ambiguity.',
    controls: 'Compliance reviewer approval before circulation.',
    approvalStatus: 'In review',
    owner: 'Regulatory Affairs Team',
    businessImpact: 'Advisory summarization for policy interpretation.',
    regulatoryImpact: 'Moderate due to potential interpretation errors.',
    requiredControls: [
      'Human legal/compliance validation required',
      'Source-citation enforcement in outputs',
      'Pre-publication approval workflow',
    ],
  },
  {
    model: 'Corporate Loan Covenant Monitor',
    vendor: 'Databricks Mosaic AI',
    version: 'v1.4',
    risk: 'Medium',
    riskReason: 'Internal decision support, monitored outputs.',
    status: 'Pilot',
    businessUseCase: 'Flag covenant breach indicators in corporate portfolios.',
    foundationModel: 'Hybrid anomaly + rules engine',
    dataClassification: 'Confidential - Corporate Lending Data',
    riskDrivers: 'Covenant interpretation variance.',
    controls: 'Pilot-only deployment, committee escalation workflow.',
    approvalStatus: 'Pilot - controlled scope',
    owner: 'Corporate Credit Monitoring',
    businessImpact: 'Internal monitoring support for credit covenant breaches.',
    regulatoryImpact: 'Moderate oversight during pilot usage.',
    requiredControls: [
      'Committee escalation for all high-severity flags',
      'Pilot environment restrictions',
      'Weekly monitoring and recalibration',
    ],
  },
];

const governanceControls: GovernanceControlDetail[] = [
  {
    key: 'humanReview',
    name: 'Human Review Coverage',
    value: 100,
    color: colors.success,
    applicationsInScope: [
      'Retail Loan Origination Platform',
      'UPI Fraud Monitoring System',
      'AML Investigation Workbench',
      'Collections Management Portal',
      'KYC Onboarding Platform',
      'Corporate Lending Workspace',
    ],
    purpose: 'Ensure every model-assisted recommendation is reviewed by a qualified decision owner.',
    whyItMatters: 'Prevents unauthorized automated decisioning for customer-impacting workflows.',
    coverageCalculation: 'Manual sign-off enabled for all models that influence operations or customer workflows.',
    modelsRequiringControl: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'KYC Document Verification Model',
      'Corporate Loan Covenant Monitor',
    ],
    modelsCovered: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'KYC Document Verification Model',
      'Corporate Loan Covenant Monitor',
    ],
    coverageFormula: '6/6 = 100%',
  },
  {
    key: 'biasTesting',
    name: 'Bias Testing Coverage',
    value: 92,
    color: colors.success,
    applicationsInScope: [
      'Retail Loan Origination Platform',
      'UPI Fraud Monitoring System',
      'AML Investigation Workbench',
      'Collections Management Portal',
      'Card Dispute Resolution Console',
      'KYC Onboarding Platform',
      'Regulatory Intelligence Desk',
      'Corporate Lending Workspace',
    ],
    purpose: 'Validate model fairness across protected and business-critical cohorts.',
    whyItMatters: 'Reduces discrimination risk and supports fair-lending/regulatory obligations.',
    coverageCalculation: 'Bias test reports required for customer-impacting decision support models.',
    modelsRequiringControl: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'KYC Document Verification Model',
      'Corporate Loan Covenant Monitor',
      'Card Dispute Triage Assistant',
      'Regulatory Circular Summarizer',
      'Branch Demand Forecasting Model',
      'Treasury Liquidity Forecast Model',
      'Retail Credit Underwriting Copilot (Pilot Variant)',
      'UPI Fraud Pattern Detector (Challenger)',
      'AML Alert Prioritization Engine (Challenger)',
    ],
    modelsCovered: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'KYC Document Verification Model',
      'Corporate Loan Covenant Monitor',
      'Card Dispute Triage Assistant',
      'Regulatory Circular Summarizer',
      'Branch Demand Forecasting Model',
      'Treasury Liquidity Forecast Model',
      'UPI Fraud Pattern Detector (Challenger)',
      'AML Alert Prioritization Engine (Challenger)',
    ],
    coverageFormula: '12/13 = 92%',
    missingModels: ['Retail Credit Underwriting Copilot (Pilot Variant)'],
    gapReason: 'Pilot variant fairness benchmark run not completed after recent policy feature update.',
    plannedRemediation: 'Complete cohort parity test and submit bias validation evidence in the next governance cycle.',
  },
  {
    key: 'monitoring',
    name: 'Monitoring Coverage',
    value: 88,
    color: colors.warning,
    applicationsInScope: [
      'Retail Loan Origination Platform',
      'UPI Fraud Monitoring System',
      'AML Investigation Workbench',
      'Collections Management Portal',
      'Card Dispute Resolution Console',
      'KYC Onboarding Platform',
      'Treasury Forecasting Desk',
      'Branch Workforce Planning Dashboard',
      'Regulatory Intelligence Desk',
      'Corporate Lending Workspace',
    ],
    purpose: 'Track performance drift, anomalies, and SLA breaches for deployed models.',
    whyItMatters: 'Early detection limits business loss and model degradation impact.',
    coverageCalculation: 'Continuous telemetry and alerting required for all production and pilot models.',
    modelsRequiringControl: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'Card Dispute Triage Assistant',
      'KYC Document Verification Model',
      'Treasury Liquidity Forecast Model',
      'Branch Demand Forecasting Model',
      'Regulatory Circular Summarizer',
      'Corporate Loan Covenant Monitor',
      'Retail Credit Underwriting Copilot (Pilot Variant)',
      'AML Alert Prioritization Engine (Pilot Sandbox)',
      'KYC Document Verification Model (Pilot)',
      'Corporate Loan Covenant Monitor (Pilot Variant)',
      'Regulatory Circular Summarizer (Pilot)',
      'Treasury Liquidity Forecast Model (Pilot)',
      'Branch Demand Forecasting Model (Pilot)',
    ],
    modelsCovered: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'Card Dispute Triage Assistant',
      'KYC Document Verification Model',
      'Treasury Liquidity Forecast Model',
      'Branch Demand Forecasting Model',
      'Regulatory Circular Summarizer',
      'Corporate Loan Covenant Monitor',
      'Retail Credit Underwriting Copilot (Pilot Variant)',
      'AML Alert Prioritization Engine (Pilot Sandbox)',
      'KYC Document Verification Model (Pilot)',
      'Regulatory Circular Summarizer (Pilot)',
      'Treasury Liquidity Forecast Model (Pilot)',
    ],
    coverageFormula: '15/17 = 88%',
    missingModels: ['Corporate Loan Covenant Monitor (Pilot Variant)', 'Branch Demand Forecasting Model (Pilot)'],
    gapReason: 'Telemetry agents not yet deployed in pilot sandbox segments.',
    plannedRemediation: 'Enable model-level metrics exporters and alert thresholds before next CAB checkpoint.',
  },
  {
    key: 'auditLogging',
    name: 'Audit Logging Coverage',
    value: 100,
    color: colors.success,
    applicationsInScope: [
      'Retail Loan Origination Platform',
      'UPI Fraud Monitoring System',
      'AML Investigation Workbench',
      'Collections Management Portal',
      'Card Dispute Resolution Console',
      'KYC Onboarding Platform',
      'Treasury Forecasting Desk',
      'Branch Workforce Planning Dashboard',
      'Regulatory Intelligence Desk',
      'Corporate Lending Workspace',
    ],
    purpose: 'Maintain immutable logs for model inputs, outputs, and approvals.',
    whyItMatters: 'Supports auditability, forensic review, and regulatory evidence requests.',
    coverageCalculation: 'Audit events must be recorded for every production model interaction.',
    modelsRequiringControl: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'Card Dispute Triage Assistant',
      'KYC Document Verification Model',
      'Treasury Liquidity Forecast Model',
      'Branch Demand Forecasting Model',
      'Regulatory Circular Summarizer',
      'Corporate Loan Covenant Monitor',
    ],
    modelsCovered: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'Card Dispute Triage Assistant',
      'KYC Document Verification Model',
      'Treasury Liquidity Forecast Model',
      'Branch Demand Forecasting Model',
      'Regulatory Circular Summarizer',
      'Corporate Loan Covenant Monitor',
    ],
    coverageFormula: '10/10 = 100%',
  },
  {
    key: 'explainability',
    name: 'Explainability Coverage',
    value: 84,
    color: colors.warning,
    applicationsInScope: [
      'Retail Loan Origination Platform',
      'UPI Fraud Monitoring System',
      'AML Investigation Workbench',
      'Collections Management Portal',
      'Card Dispute Resolution Console',
      'KYC Onboarding Platform',
      'Treasury Forecasting Desk',
      'Branch Workforce Planning Dashboard',
      'Regulatory Intelligence Desk',
      'Corporate Lending Workspace',
    ],
    purpose: 'Provide human-understandable rationale for model-assisted outcomes.',
    whyItMatters: 'Improves decision transparency and accelerates regulatory response.',
    coverageCalculation: 'Explainability artifacts required where outputs inform analyst recommendations.',
    modelsRequiringControl: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'Card Dispute Triage Assistant',
      'KYC Document Verification Model',
      'Treasury Liquidity Forecast Model',
      'Branch Demand Forecasting Model',
      'Regulatory Circular Summarizer',
      'Corporate Loan Covenant Monitor',
      'Retail Credit Underwriting Copilot (Pilot Variant)',
      'Corporate Loan Covenant Monitor (Pilot Variant)',
      'Regulatory Circular Summarizer (Pilot)',
      'UPI Fraud Pattern Detector (Challenger)',
      'AML Alert Prioritization Engine (Challenger)',
      'KYC Document Verification Model (Pilot)',
      'Branch Demand Forecasting Model (Pilot)',
      'Treasury Liquidity Forecast Model (Pilot)',
      'Card Dispute Triage Assistant (Pilot)',
    ],
    modelsCovered: [
      'Retail Credit Underwriting Copilot',
      'UPI Fraud Pattern Detector',
      'AML Alert Prioritization Engine',
      'Collections Promise-to-Pay Predictor',
      'Card Dispute Triage Assistant',
      'KYC Document Verification Model',
      'Treasury Liquidity Forecast Model',
      'Branch Demand Forecasting Model',
      'Regulatory Circular Summarizer',
      'Corporate Loan Covenant Monitor',
      'Retail Credit Underwriting Copilot (Pilot Variant)',
      'Regulatory Circular Summarizer (Pilot)',
      'UPI Fraud Pattern Detector (Challenger)',
      'AML Alert Prioritization Engine (Challenger)',
      'KYC Document Verification Model (Pilot)',
      'Treasury Liquidity Forecast Model (Pilot)',
    ],
    coverageFormula: '16/19 = 84%',
    missingModels: [
      'Corporate Loan Covenant Monitor (Pilot Variant)',
      'Branch Demand Forecasting Model (Pilot)',
      'Card Dispute Triage Assistant (Pilot)',
    ],
    gapReason: 'Structured reason-code templates are not finalized for selected pilot variants.',
    plannedRemediation: 'Publish standardized explainability schema and backfill missing pilot evidence before approval.',
  },
];

const governanceAlerts: GovernanceAlertDetail[] = [
  {
    key: 'modelDriftAlert',
    findingTitle: 'Model Drift Alert',
    relatedApplication: 'UPI Fraud Monitoring System',
    relatedModel: 'UPI Fraud Pattern Detector',
    lifecycleStage: 'Production',
    shortReason: 'Transaction behavior drift exceeded configured guardrail.',
    issueEvidence: [
      'Drift score = 18%',
      'Configured threshold = 15%',
      'Threshold breach duration = 4.5 hours',
      'Alert source: Model monitoring policy MON-UPI-07',
    ],
    severity: 'Warning',
    impact: 'Fraud detection accuracy may degrade, increasing false positives and analyst investigation effort.',
    recommendedAction: 'Recalibrate drift thresholds, retrain on latest behavior set, and validate with challenger backtest.',
    owner: 'Fraud Analytics Team',
    dueDate: '11 Jun 2026',
    color: colors.warning,
  },
  {
    key: 'latencyBreach',
    findingTitle: 'Latency Breach',
    relatedApplication: 'AML Operations Dashboard',
    relatedModel: 'AML Alert Prioritization Engine',
    lifecycleStage: 'Production',
    shortReason: 'Model scoring latency breached investigation SLA window.',
    issueEvidence: [
      'Observed latency = 3.8s',
      'SLA limit = 2.0s',
      'P95 latency breached for 3 consecutive monitoring windows',
      'Queue backlog increase = 22%',
    ],
    severity: 'Warning',
    impact: 'AML case triage throughput is reduced, delaying high-priority review decisions.',
    recommendedAction: 'Scale inference workers, tune feature retrieval path, and revalidate SLA under peak load.',
    owner: 'Model Ops Team',
    dueDate: '10 Jun 2026',
    color: colors.warning,
  },
  {
    key: 'dataQualityWarning',
    findingTitle: 'Data Quality Warning',
    relatedApplication: 'Treasury Liquidity Management Platform',
    relatedModel: 'Treasury Liquidity Forecast Model',
    lifecycleStage: 'Production',
    shortReason: 'Input feed completeness fell below minimum quality standard.',
    issueEvidence: [
      'Data completeness = 88%',
      'Required threshold = 95%',
      'Missing source records detected in intraday feed window 09:30-10:15',
      'Source impacted: Treasury cash-position delta stream',
    ],
    severity: 'Warning',
    impact: 'Liquidity forecast confidence is reduced, impacting intraday funding decisions.',
    recommendedAction: 'Restore missing feed records, rerun validation checks, and confirm completeness recovery above threshold.',
    owner: 'Treasury Data Engineering',
    dueDate: '09 Jun 2026',
    color: colors.warning,
  },
  {
    key: 'missingModelCard',
    findingTitle: 'Missing Model Card',
    relatedApplication: 'Corporate Lending Workspace',
    relatedModel: 'Corporate Loan Covenant Monitor',
    lifecycleStage: 'Pilot',
    shortReason: 'Required governance artifacts are incomplete for stage promotion.',
    issueEvidence: [
      'Promotion gate check failed for Pilot → Production transition',
      'Documentation checklist status = 2/4 required artifacts complete',
    ],
    missingArtifacts: [
      { name: 'Model Card', present: false },
      { name: 'Explainability Report', present: false },
      { name: 'Risk Assessment', present: true },
      { name: 'Monitoring Controls', present: true },
    ],
    severity: 'High',
    impact: 'Cannot promote Pilot → Production until required governance documentation is completed.',
    recommendedAction: 'Publish model card and explainability report, then re-run governance gate review.',
    owner: 'Corporate Credit Monitoring',
    dueDate: '13 Jun 2026',
    color: colors.critical,
  },
  {
    key: 'outdatedRiskAssessment',
    findingTitle: 'Outdated Risk Assessment',
    relatedApplication: 'Regulatory Intelligence Portal',
    relatedModel: 'Regulatory Circular Summarizer',
    lifecycleStage: 'In Review',
    shortReason: 'Annual model risk assessment has crossed policy expiry date.',
    issueEvidence: [
      'Last assessment completed = 14 months ago',
      'Required review cadence = Annual (12 months)',
      'Current status = 2 months overdue',
      'Approval record missing for current review cycle',
    ],
    severity: 'Healthy',
    impact: 'Risk posture may be outdated, creating compliance exposure during regulatory review.',
    recommendedAction: 'Complete annual reassessment, refresh controls evidence, and record governance approval.',
    owner: 'AI Governance PMO',
    dueDate: '17 Jun 2026',
    color: colors.success,
  },
];

export function ModelInventory() {
  const [activeKpi, setActiveKpi] = useState<KpiKey | null>(null);
  const [activeControl, setActiveControl] = useState<GovernanceControlKey | null>(null);
  const [activeAlert, setActiveAlert] = useState<GovernanceAlertKey | null>(null);

  const kpiRows: Record<KpiKey, { title: string; items: ModelRecord[] }> = {
    total: { title: 'Total Models', items: models },
    approved: { title: 'Approved Models', items: models.filter((m) => m.status === 'Approved') },
    inReview: { title: 'Models In Review', items: models.filter((m) => m.status === 'In Review') },
    highRisk: { title: 'High Risk Models', items: models.filter((m) => m.risk === 'High') },
    mediumRisk: { title: 'Medium Risk Models', items: models.filter((m) => m.risk === 'Medium') },
    lowRisk: { title: 'Low Risk Models', items: models.filter((m) => m.risk === 'Low') },
  };

  return (
    <Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}>
          <ModelKpiCard kpi={modelInventoryKpis[0]} onClick={() => setActiveKpi('total')} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <ModelKpiCard kpi={modelInventoryKpis[1]} onClick={() => setActiveKpi('approved')} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <ModelKpiCard kpi={modelInventoryKpis[2]} onClick={() => setActiveKpi('inReview')} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <ModelKpiCard kpi={modelInventoryKpis[3]} onClick={() => setActiveKpi('highRisk')} />
        </Grid>
      </Grid>
      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ModelKpiCard kpi={{ label: 'Medium Risk Models', value: models.filter((m) => m.risk === 'Medium').length, suffix: '', trend: -8.3 }} onClick={() => setActiveKpi('mediumRisk')} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ModelKpiCard kpi={{ label: 'Low Risk Models', value: models.filter((m) => m.risk === 'Low').length, suffix: '', trend: 10.5 }} onClick={() => setActiveKpi('lowRisk')} />
        </Grid>
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="AI Governance Control Coverage" subtitle="Control effectiveness across model governance lifecycle" />
        {governanceControls.map((control) => (
          <Box
            key={control.key}
            sx={{ mb: 1.5, cursor: 'pointer', p: 1, borderRadius: 1, '&:hover': { bgcolor: colors.bg.glass } }}
            onClick={() => setActiveControl(control.key)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.35 }}>
              <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{control.name}</Typography>
              <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800 }}>{control.value}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={control.value}
              sx={{
                height: 7,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': { bgcolor: control.color },
              }}
            />
          </Box>
        ))}
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Governance Alerts" subtitle="Model governance attention points" />
        <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 800, display: 'block', mb: 0.75 }}>
          Monitoring Exceptions
        </Typography>
        {governanceAlerts.slice(0, 3).map((alert) => (
          <AlertListItem key={alert.key} alert={alert} onClick={() => setActiveAlert(alert.key)} />
        ))}
        <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.06em', fontWeight: 800, display: 'block', mt: 1.25, mb: 0.75 }}>
          Documentation Findings
        </Typography>
        {governanceAlerts.slice(3).map((alert) => (
          <AlertListItem key={alert.key} alert={alert} onClick={() => setActiveAlert(alert.key)} />
        ))}
      </GlassCard>

      <Drawer
        anchor="right"
        open={activeKpi !== null || activeControl !== null || activeAlert !== null}
        onClose={() => {
          setActiveKpi(null);
          setActiveControl(null);
          setActiveAlert(null);
        }}
        slotProps={{
          paper: {
            sx: {
              width: 420,
              background: `linear-gradient(180deg, ${colors.bg.tertiary} 0%, ${colors.bg.primary} 100%)`,
              borderLeft: `1px solid ${colors.border.subtle}`,
            },
          },
        }}
      >
        {(activeKpi || activeControl || activeAlert) && (
          <Box sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
              <Box>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.76rem', letterSpacing: '0.06em', fontWeight: 800 }}>Drilldown</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem' }}>
                  {activeKpi ? kpiRows[activeKpi].title : activeControl ? governanceControls.find((c) => c.key === activeControl)?.name : governanceAlerts.find((a) => a.key === activeAlert)?.findingTitle}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => {
                  setActiveKpi(null);
                  setActiveControl(null);
                  setActiveAlert(null);
                }}
                sx={{ color: colors.text.secondary }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            {activeKpi && kpiRows[activeKpi].items.map((item) => (
              <GlassCard key={`${activeKpi}-${item.model}`} hover={false} sx={{ p: 1.5, mb: 1.25 }}>
                <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.84rem' }}>{item.model}</Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', mt: 0.45, fontSize: '0.8rem', fontWeight: 600 }}>
                  {item.vendor} · {item.version} · {item.status}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: colors.info, mt: 0.45, fontSize: '0.78rem', fontWeight: 700 }}>
                  Risk: {item.risk} - {item.riskReason}
                </Typography>
                {(activeKpi === 'highRisk' || activeKpi === 'mediumRisk' || activeKpi === 'lowRisk') && (
                  <Box sx={{ mt: 0.9, pl: 1.25, borderLeft: `2px solid ${colors.info}` }}>
                    <Typography variant="caption" sx={{ display: 'block', color: colors.info, fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', mb: 0.35 }}>
                      Risk Details
                    </Typography>
                    <Typography component="div" variant="caption" sx={{ color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.55 }}>
                      <Box component="span" sx={{ display: 'block' }}>• Risk Category: {item.risk}</Box>
                      <Box component="span" sx={{ display: 'block' }}>• Risk Reason: {item.riskReason}</Box>
                      <Box component="span" sx={{ display: 'block' }}>• Business Impact: {item.businessImpact}</Box>
                      <Box component="span" sx={{ display: 'block' }}>• Regulatory Impact: {item.regulatoryImpact}</Box>
                      <Box component="span" sx={{ display: 'block' }}>• Required Controls:</Box>
                      {item.requiredControls.map((control) => (
                        <Box key={`${item.model}-${control}`} component="span" sx={{ display: 'block', pl: 1 }}>
                          - {control}
                        </Box>
                      ))}
                    </Typography>
                  </Box>
                )}
              </GlassCard>
            ))}

            {activeControl && (() => {
              const control = governanceControls.find((c) => c.key === activeControl);
              if (!control) return null;
              return (
                <GlassCard hover={false} sx={{ p: 1.5 }}>
                  <DetailLine label="Control Name" value={control.name} />
                  <DetailLine label="Purpose" value={control.purpose} />
                  <DetailLine label="Current Coverage %" value={`${control.value}%`} />
                  <DetailLine label="Coverage Calculation" value={control.coverageCalculation} />
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.06em', fontWeight: 800 }}>
                      Applications In Scope
                    </Typography>
                    {control.applicationsInScope.map((appName) => (
                      <Typography key={`${control.key}-app-${appName}`} variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.84rem', fontWeight: 600, lineHeight: 1.4, mt: 0.4 }}>
                        • {appName}
                      </Typography>
                    ))}
                  </Box>
                  <Box sx={{ mt: 1.1, pl: 1.25, borderLeft: `2px solid ${colors.info}` }}>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.84rem', fontWeight: 700, lineHeight: 1.5 }}>
                      Applications in Scope: {control.applicationsInScope.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.84rem', fontWeight: 700, lineHeight: 1.5 }}>
                      AI Models Requiring Control: {control.modelsRequiringControl.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.84rem', fontWeight: 700, lineHeight: 1.5 }}>
                      AI Models Covered: {control.modelsCovered.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.info, fontSize: '0.84rem', fontWeight: 800, lineHeight: 1.5 }}>
                      Coverage = {control.coverageFormula}
                    </Typography>
                  </Box>
                  <DetailLine label="Models Requiring Control" value={control.modelsRequiringControl.join(', ')} />
                  <DetailLine label="Models Covered" value={control.modelsCovered.join(', ')} />
                  <DetailLine label="Coverage Formula" value={control.coverageFormula} />
                  <DetailLine label="Why It Matters" value={control.whyItMatters} />
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.06em', fontWeight: 800 }}>
                      Covered Models
                    </Typography>
                    {control.modelsCovered.map((modelName) => (
                      <Typography key={`${control.key}-covered-${modelName}`} variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.45, mt: 0.5 }}>
                        • {modelName}
                      </Typography>
                    ))}
                  </Box>
                  {control.value < 100 && (
                    <Box sx={{ mt: 1.25 }}>
                      {control.missingModels && control.missingModels.length > 0 && (
                        <DetailLine label="Missing Models" value={control.missingModels.join(', ')} />
                      )}
                      {control.gapReason && <DetailLine label="Gap Reason" value={control.gapReason} />}
                      {control.plannedRemediation && <DetailLine label="Planned Remediation" value={control.plannedRemediation} />}
                    </Box>
                  )}
                </GlassCard>
              );
            })()}

            {activeAlert && (() => {
              const alert = governanceAlerts.find((a) => a.key === activeAlert);
              if (!alert) return null;
              return (
                <GlassCard hover={false} sx={{ p: 1.5 }}>
                  <DetailLine label="Alert Title" value={alert.findingTitle} />
                  <DetailLine label="Related Application" value={alert.relatedApplication} />
                  <DetailLine label="Related Model" value={alert.relatedModel} />
                  <DetailLine label="Lifecycle Stage" value={alert.lifecycleStage} />
                  <DetailLine label="Issue Details" value={alert.shortReason} />
                  <Box sx={{ mt: 0.75, mb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.06em', fontWeight: 800 }}>
                      Issue Evidence
                    </Typography>
                    {alert.issueEvidence.map((evidence) => (
                      <Typography key={`${alert.key}-${evidence}`} variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.5, mt: 0.5 }}>
                        • {evidence}
                      </Typography>
                    ))}
                  </Box>
                  {alert.missingArtifacts && (
                    <Box sx={{ mt: 0.75, mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.06em', fontWeight: 800 }}>
                        Missing Artifacts
                      </Typography>
                      {alert.missingArtifacts.map((artifact) => (
                        <Typography key={`${alert.key}-${artifact.name}`} variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.5, mt: 0.5 }}>
                          {artifact.present ? '✅' : '❌'} {artifact.name}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  <DetailLine label="Severity" value={alert.severity} />
                  <DetailLine label="Impact" value={alert.impact} />
                  <DetailLine label="Recommended Action" value={alert.recommendedAction} />
                  <DetailLine label="Owner" value={alert.owner} />
                  <DetailLine label="Due Date" value={alert.dueDate} />
                </GlassCard>
              );
            })()}
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ mb: 1.75 }}>
      <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.06em', fontWeight: 800 }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: '#FFFFFF', lineHeight: 1.5, fontSize: '0.95rem', fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}

function AlertListItem({ alert, onClick }: { alert: GovernanceAlertDetail; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        mb: 1,
        p: 1.25,
        borderRadius: 1,
        border: `1px solid ${colors.border.subtle}`,
        bgcolor: colors.bg.glass,
        cursor: 'pointer',
        '&:hover': { bgcolor: colors.bg.glass },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.86rem' }}>
          {alert.findingTitle}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: alert.color,
            bgcolor: `${alert.color}22`,
            px: 1,
            py: 0.3,
            borderRadius: 1,
            fontWeight: 800,
            fontSize: '0.72rem',
          }}
        >
          {alert.severity}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ display: 'block', color: colors.info, fontWeight: 700, mt: 0.35, fontSize: '0.76rem' }}>
        {alert.relatedModel}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', mt: 0.2, fontWeight: 600, fontSize: '0.75rem' }}>
        {alert.shortReason}
      </Typography>
    </Box>
  );
}

function ModelKpiCard({
  kpi,
  onClick,
}: {
  kpi: { label: string; value: string | number; suffix?: string; trend?: number };
  onClick: () => void;
}) {
  const isPositive = (kpi.trend ?? 0) >= 0;
  return (
    <GlassCard
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      sx={{
        p: 1.5,
        minHeight: 90,
        cursor: 'pointer',
        '&:focus-visible': {
          outline: `2px solid ${colors.primary}`,
          outlineOffset: 2,
        },
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {kpi.label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text.primary }}>{kpi.value}</Typography>
        {kpi.suffix && <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{kpi.suffix}</Typography>}
      </Box>
      {kpi.trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
          {isPositive ? <TrendingUpIcon sx={{ fontSize: 14, color: colors.success }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: colors.critical }} />}
          <Typography variant="caption" sx={{ color: isPositive ? colors.success : colors.critical, fontWeight: 600 }}>
            {isPositive ? '+' : ''}{kpi.trend}%
          </Typography>
        </Box>
      )}
    </GlassCard>
  );
}
