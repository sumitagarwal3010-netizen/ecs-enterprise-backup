import { useMemo, useState } from 'react';
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { colors } from '../theme/colors';

type PromptStatus = 'Approved' | 'In Review' | 'Violation';
type RiskRating = 'Low' | 'Medium' | 'High';
type ControlResult = 'Pass' | 'Fail';
type KpiKey = 'approved' | 'underReview' | 'violations' | 'compliance';
type CoverageKey = 'pii' | 'injection' | 'regulatory' | 'safety' | 'hallucination';
type AlertKey = 'missingDisclaimer' | 'failedInjection' | 'reviewPending' | 'scopeViolation';
type AlertPriority = 'HIGH PRIORITY' | 'REVIEW REQUIRED' | 'PENDING ACTION';
type AlertSeverity = 'High' | 'Medium';

interface ControlCheck {
  control: string;
  objective: string;
  result: ControlResult;
  evidence: string;
}

interface PromptRecord {
  id: string;
  promptName: string;
  promptText: string;
  application: string;
  model: string;
  governanceFramework: string;
  businessFunction: string;
  owner: string;
  version: string;
  riskRating: RiskRating;
  approvalStatus: PromptStatus;
  approvalDate: string;
  reviewStage: string;
  pendingOwner: string;
  completedControls: number;
  pendingControls: number;
  violatedControl?: string;
  violationSeverity?: 'High' | 'Warning';
  rootCause?: string;
  impactSummary?: string;
  detectionRule?: string;
  recommendedActions?: string;
  dueDate?: string;
  governanceDecision: string;
  decisionRationale: string;
  approvalHistory: string[];
  controls: ControlCheck[];
}

interface CoverageRecord {
  key: CoverageKey;
  label: string;
  coverage: number;
  totalPrompts: number;
  description: string;
  objective: string;
  governanceTraceability: string[];
  frameworkMapping: string[];
  applicationBreakdown: Array<{
    application: string;
    evaluated: number;
    total: number;
    coverage: number;
  }>;
  coverageGapAnalysis: string[];
  controlResults: {
    evaluated: number;
    pass: number;
    fail: number;
  };
  businessRisk: string;
  executiveSummary: string;
  applicationsCovered: string[];
  modelsCovered: string[];
  promptsEvaluated: number;
  formula: string;
}

interface AlertRecord {
  key: AlertKey;
  title: string;
  priority: AlertPriority;
  severity: AlertSeverity;
  application: string;
  governanceFramework: string;
  triggeredControl: string;
  rootCause: string;
  impact: string;
  owner: string;
  recommendedAction: string;
}

interface ApplicationCompliancePoint {
  application: string;
  controlsExecuted: number;
  passed: number;
  failed: number;
  compliance: number;
}

interface FailedControlPoint {
  control: string;
  failureCount: number;
  affectedPrompts: string[];
  affectedApplications: string[];
  reason: string;
}

interface FrameworkCoveragePoint {
  framework: string;
  controlsEvaluated: number;
  controlsPassed: number;
  controlsFailed: number;
  coverage: number;
  scoreContribution: number;
}

const applications = [
  'Net Banking',
  'Mobile Banking',
  'Payments',
  'Fraud Monitoring',
  'AML Operations',
  'Corporate Lending',
];

const frameworkByApp: Record<string, string> = {
  'Net Banking': 'AI Prompt Governance v2.3',
  'Mobile Banking': 'AI Prompt Governance v2.3',
  Payments: 'PCI-DSS Prompt Controls',
  'Fraud Monitoring': 'Internal AI Risk Standard',
  'AML Operations': 'Internal AI Risk Standard',
  'Corporate Lending': 'RBI Fair Lending',
};

const modelsByApp: Record<string, string> = {
  'Net Banking': 'GPT-4.1',
  'Mobile Banking': 'Claude 4.6 Sonnet',
  Payments: 'Azure OpenAI',
  'Fraud Monitoring': 'Azure OpenAI',
  'AML Operations': 'Vertex AI',
  'Corporate Lending': 'GPT-4.1',
};

function getRiskStyle(risk: RiskRating) {
  if (risk === 'High') return { color: colors.critical, bg: `${colors.critical}22` };
  if (risk === 'Medium') return { color: colors.warning, bg: `${colors.warning}22` };
  return { color: colors.success, bg: `${colors.success}22` };
}

function getStatusStyle(status: PromptStatus) {
  if (status === 'Approved') return { color: colors.success, bg: `${colors.success}22` };
  if (status === 'In Review') return { color: colors.info, bg: `${colors.info}22` };
  return { color: colors.critical, bg: `${colors.critical}22` };
}

function getRiskBadgeStyle(risk: RiskRating) {
  if (risk === 'High') return { color: '#FF3B3B', bg: 'rgba(255,59,59,0.2)' };
  if (risk === 'Medium') return { color: '#F59E0B', bg: 'rgba(245,158,11,0.2)' };
  return { color: '#22C55E', bg: 'rgba(34,197,94,0.2)' };
}

function getStatusBadgeStyle(status: PromptStatus | 'Draft') {
  if (status === 'Violation') return { color: '#FF3B3B', bg: 'rgba(255,59,59,0.2)' };
  if (status === 'In Review') return { color: '#F59E0B', bg: 'rgba(245,158,11,0.2)' };
  if (status === 'Approved') return { color: '#22C55E', bg: 'rgba(34,197,94,0.2)' };
  return { color: '#3B82F6', bg: 'rgba(59,130,246,0.2)' };
}

function getAlertSeverityStyle(severity: AlertSeverity) {
  if (severity === 'High') return { color: '#FF5252', bg: 'rgba(255,82,82,0.2)' };
  return { color: '#F59E0B', bg: 'rgba(245,158,11,0.2)' };
}

function buildPromptRecords(): PromptRecord[] {
  const records: PromptRecord[] = [];
  let idx = 1;
  for (const app of applications) {
    for (let i = 0; i < 8; i += 1) {
      const initialStatus: PromptStatus = idx <= 38 ? 'Approved' : idx <= 45 ? 'In Review' : 'Violation';
      const riskRating: RiskRating = app === 'Corporate Lending' || app === 'Fraud Monitoring' ? 'High' : app === 'AML Operations' || app === 'Payments' ? 'Medium' : 'Low';
      const baseControls: ControlCheck[] = [
        { control: 'PII Protection Check', objective: 'Prevent sensitive data leakage in generated content.', result: 'Pass', evidence: 'Masked account and PAN tokens validated in prompt/output tests.' },
        { control: 'Prompt Injection Scan', objective: 'Detect malicious instruction override patterns.', result: 'Pass', evidence: 'Injection pattern scan score below risk threshold.' },
        { control: 'Regulatory Disclaimer Check', objective: 'Enforce banking and regulatory disclaimers.', result: 'Pass', evidence: 'Mandatory disclaimer tokens present in response templates.' },
        { control: 'Prompt Scope Boundary Check', objective: 'Keep prompts within approved business decision boundaries.', result: 'Pass', evidence: 'Prompt intent stayed within approved advisory scope.' },
        { control: 'Fair Lending Bias Check', objective: 'Detect prohibited bias indicators in credit-related outputs.', result: 'Pass', evidence: 'Bias test set remained within fairness threshold across scenarios.' },
      ];

      if (initialStatus === 'Violation' && idx === 46) {
        baseControls[3] = {
          ...baseControls[3],
          result: 'Fail',
          evidence: 'Failure reason: Prompt attempted recommendation language outside approved advisory boundary.',
        };
      }
      if (initialStatus === 'Violation' && idx === 47) {
        baseControls[3] = {
          ...baseControls[3],
          result: 'Fail',
          evidence: 'Failure reason: Scope guardrail missed autonomous decision phrasing in two test runs.',
        };
        baseControls[4] = {
          ...baseControls[4],
          result: 'Fail',
          evidence: 'Failure reason: Fairness threshold breached for protected-segment lending scenarios.',
        };
      }
      if (initialStatus === 'Violation' && idx === 48) {
        baseControls[0] = {
          ...baseControls[0],
          result: 'Fail',
          evidence: 'Failure reason: Response included unmasked customer identifier token in red-team simulation.',
        };
        baseControls[2] = {
          ...baseControls[2],
          result: 'Fail',
          evidence: 'Failure reason: Mandatory regulatory disclaimer line missing in final output template.',
        };
        baseControls[3] = {
          ...baseControls[3],
          result: 'Fail',
          evidence: 'Failure reason: Prompt scope expanded into disallowed direct lending recommendation.',
        };
      }

      const failed = baseControls.filter((c) => c.result === 'Fail');
      const status: PromptStatus = initialStatus === 'Violation' && failed.length === 0 ? 'In Review' : initialStatus;
      const governanceDecision = status === 'Approved'
        ? 'Approved'
        : status === 'In Review'
          ? 'Under Governance Review'
          : 'Violation - Remediation Required';
      const decisionRationale = status === 'Approved'
        ? 'Approved because: passed PII protection, prompt injection testing, regulatory language validation, and output safety verification.'
        : status === 'In Review'
          ? 'Review because: evidence package incomplete and one or more controls pending validation signoff.'
          : `Violation because: ${failed.map((c) => c.control).join(', ')} did not meet governance threshold.`;
      const controlResult = `${baseControls.filter((c) => c.result === 'Pass').length}/${baseControls.length} Pass`;

      records.push({
        id: `PRM-${idx.toString().padStart(3, '0')}`,
        promptName: `${app} Governance Prompt ${i + 1}`,
        promptText: `Generate ${app} assistant guidance with policy-safe responses, include compliance disclaimer, and avoid exposing customer identifiers.`,
        application: app,
        model: modelsByApp[app],
        governanceFramework: frameworkByApp[app],
        businessFunction: app === 'Corporate Lending' ? 'Credit Decision Support' : app === 'Fraud Monitoring' ? 'Fraud Operations' : app === 'AML Operations' ? 'Compliance Monitoring' : 'Customer Service',
        owner: app === 'Net Banking' ? 'Retail Digital Team' : app === 'Mobile Banking' ? 'Mobile Platform AI' : app === 'Payments' ? 'Payments Operations' : app === 'Fraud Monitoring' ? 'Fraud Risk Analytics' : app === 'AML Operations' ? 'AML Intelligence Unit' : 'Corporate Credit Monitoring',
        version: `v${1 + Math.floor(idx / 12)}.${idx % 10}`,
        riskRating,
        approvalStatus: status,
        approvalDate: status === 'Approved' ? `2026-0${(idx % 5) + 1}-1${idx % 9}` : 'Pending',
        reviewStage: status === 'In Review' ? 'Control Validation' : status === 'Violation' ? 'Violation Remediation' : 'Completed',
        pendingOwner: status === 'In Review' ? 'AI Governance Committee' : status === 'Violation' ? 'Model Risk Office' : 'None',
        completedControls: baseControls.filter((c) => c.result === 'Pass').length,
        pendingControls: status === 'Approved' ? 0 : status === 'In Review' ? 2 : failed.length,
        violatedControl: failed[0]?.control,
        violationSeverity: status === 'Violation' ? (riskRating === 'High' ? 'High' : 'Warning') : undefined,
        rootCause: status === 'Violation' ? 'Prompt scope expanded beyond approved business boundaries and guardrail hints were insufficient.' : undefined,
        impactSummary: status === 'Violation' ? 'Potential non-compliant customer-facing output and governance breach risk.' : undefined,
        detectionRule: status === 'Violation' ? 'Rule PG-CTRL-07 triggered when control failures exceed threshold in a single review run.' : undefined,
        recommendedActions: status === 'Violation' ? 'Refine prompt scope, rerun failed controls, and resubmit for governance signoff.' : status === 'In Review' ? 'Complete pending controls and obtain governance committee approval.' : 'Maintain current controls and periodic monitoring cadence.',
        dueDate: status === 'Violation' ? `2026-06-${(10 + (idx % 8)).toString().padStart(2, '0')}` : status === 'In Review' ? `2026-06-${(15 + (idx % 8)).toString().padStart(2, '0')}` : 'N/A',
        governanceDecision,
        decisionRationale: `${decisionRationale} Control Result: ${controlResult}.`,
        approvalHistory: [
          'Submitted by product owner',
          'Security and compliance control execution completed',
          status === 'Approved' ? 'Governance board approved for production usage' : status === 'In Review' ? 'Pending final governance signoff' : 'Flagged by governance monitoring',
        ],
        controls: baseControls,
      });
      idx += 1;
    }
  }
  return records;
}

const coverageData: CoverageRecord[] = [
  {
    key: 'pii',
    label: 'PII Protection Coverage',
    coverage: 95.8,
    totalPrompts: 48,
    description: 'Checks prompt/output masking and sensitive token suppression.',
    objective: 'Prevent exposure of PAN, account number, Aadhaar, and customer contact identifiers in generated responses.',
    governanceTraceability: [
      'Policy: GOV-AI-DLP-04, Data Privacy Standard DPS-PII-2.1',
      'Evidence: DLP scan logs linked to PRM-001 to PRM-048 validation runs',
      'Control owner sign-off: CISO Control Assurance and Retail Compliance',
    ],
    frameworkMapping: ['AI Prompt Governance v2.3', 'PCI-DSS Prompt Controls', 'Internal AI Risk Standard'],
    applicationBreakdown: [
      { application: 'Net Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Mobile Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Payments', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Fraud Monitoring', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'AML Operations', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'Corporate Lending', evaluated: 7, total: 8, coverage: 87.5 },
    ],
    coverageGapAnalysis: [
      '2 prompts pending retest in AML Operations and Corporate Lending after template changes.',
      'Gaps are limited to high-risk flows where red-team payloads triggered remediation hold.',
    ],
    controlResults: { evaluated: 46, pass: 45, fail: 1 },
    businessRisk: 'Unmasked identifiers can create privacy breaches, regulatory penalties, and customer harm.',
    executiveSummary: 'PII control coverage is strong at 95.8% (46/48) with one confirmed failure and targeted remediation in higher-risk domains.',
    applicationsCovered: applications,
    modelsCovered: ['GPT-4.1', 'Claude 4.6 Sonnet', 'Vertex AI', 'Azure OpenAI'],
    promptsEvaluated: 46,
    formula: '46/48 = 95.8%',
  },
  {
    key: 'injection',
    label: 'Prompt Injection Coverage',
    coverage: 91.7,
    totalPrompts: 48,
    description: 'Validates resistance to instruction override attempts.',
    objective: 'Block malicious instruction hijacks that override bank policy and governance constraints.',
    governanceTraceability: [
      'Policy: GOV-AI-SEC-07, Threat Modeling Standard TMS-PROMPT-1.4',
      'Evidence: Adversarial test packs and guardrail confidence logs attached to reviewed prompts',
      'Audit trail: SOC red-team replay results approved by AI Security Review Board',
    ],
    frameworkMapping: ['AI Prompt Governance v2.3', 'Internal AI Risk Standard'],
    applicationBreakdown: [
      { application: 'Net Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Mobile Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Payments', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Fraud Monitoring', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'AML Operations', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'Corporate Lending', evaluated: 6, total: 8, coverage: 75.0 },
    ],
    coverageGapAnalysis: [
      '4 prompts are still under advanced adversarial replay for high-risk use cases.',
      'Corporate Lending retains the largest exposure due to unresolved injection-hardening actions.',
    ],
    controlResults: { evaluated: 44, pass: 42, fail: 2 },
    businessRisk: 'Injection bypasses may produce unauthorized decisions, unsafe disclosures, or manipulated outputs.',
    executiveSummary: 'Injection defense coverage is 91.7% (44/48), with residual gaps concentrated in high-risk Corporate Lending scenarios.',
    applicationsCovered: ['Net Banking', 'Mobile Banking', 'Payments', 'Fraud Monitoring', 'AML Operations', 'Corporate Lending'],
    modelsCovered: ['GPT-4.1', 'Claude 4.6 Sonnet', 'Azure OpenAI'],
    promptsEvaluated: 44,
    formula: '44/48 = 91.7%',
  },
  {
    key: 'regulatory',
    label: 'Regulatory Language Coverage',
    coverage: 89.6,
    totalPrompts: 48,
    description: 'Ensures mandatory banking disclaimers are present and correct.',
    objective: 'Enforce RBI-aligned mandatory disclosures and customer advisory language in governed prompts.',
    governanceTraceability: [
      'Policy: GOV-AI-REG-03, Regulatory Disclosure Standard RDS-5.2',
      'Evidence: Disclaimer token validation logs and policy template diff reports',
      'Review authority: Regulatory Compliance Office and Model Risk Governance',
    ],
    frameworkMapping: ['AI Prompt Governance v2.3', 'RBI Fair Lending', 'PCI-DSS Prompt Controls'],
    applicationBreakdown: [
      { application: 'Net Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Mobile Banking', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'Payments', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'Fraud Monitoring', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'AML Operations', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'Corporate Lending', evaluated: 7, total: 8, coverage: 87.5 },
    ],
    coverageGapAnalysis: [
      '5 prompts remain in disclaimer remediation queue after policy wording updates.',
      'Pending checks are blocked until legal-approved disclosure templates are redeployed.',
    ],
    controlResults: { evaluated: 43, pass: 41, fail: 2 },
    businessRisk: 'Missing or incorrect disclaimers can trigger regulatory breaches and mislead customers.',
    executiveSummary: 'Regulatory language coverage is 89.6% (43/48), and current gaps are tied to disclosure template updates in production workflows.',
    applicationsCovered: ['Net Banking', 'Mobile Banking', 'Payments', 'Fraud Monitoring', 'AML Operations', 'Corporate Lending'],
    modelsCovered: ['GPT-4.1', 'Vertex AI', 'Azure OpenAI'],
    promptsEvaluated: 43,
    formula: '43/48 = 89.6%',
  },
  {
    key: 'safety',
    label: 'Output Safety Coverage',
    coverage: 95.8,
    totalPrompts: 48,
    description: 'Checks unsafe output suppression and policy-safe phrasing.',
    objective: 'Prevent harmful, unauthorized, or policy-violating model outputs across customer-facing prompts.',
    governanceTraceability: [
      'Policy: GOV-AI-SAFE-02, Responsible AI Safety Standard RAI-3.0',
      'Evidence: Safety classifier thresholds and moderation replay reports per prompt',
      'Approval: Enterprise AI Governance Committee safety gate sign-off',
    ],
    frameworkMapping: ['AI Prompt Governance v2.3', 'Internal AI Risk Standard'],
    applicationBreakdown: [
      { application: 'Net Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Mobile Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Payments', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Fraud Monitoring', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'AML Operations', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'Corporate Lending', evaluated: 7, total: 8, coverage: 87.5 },
    ],
    coverageGapAnalysis: [
      '2 prompts are pending final safety rerun after recent scope-control remediations.',
      'Open gaps are bounded to corporate and AML advisory outputs with elevated risk tags.',
    ],
    controlResults: { evaluated: 46, pass: 44, fail: 2 },
    businessRisk: 'Unsafe outputs can cause customer harm, reputational loss, and supervisory escalations.',
    executiveSummary: 'Output safety is covered for 95.8% of prompts (46/48), with two unresolved high-risk exceptions under active remediation.',
    applicationsCovered: applications,
    modelsCovered: ['GPT-4.1', 'Claude 4.6 Sonnet', 'Vertex AI', 'Azure OpenAI'],
    promptsEvaluated: 46,
    formula: '46/48 = 95.8%',
  },
  {
    key: 'hallucination',
    label: 'Hallucination Guardrail Coverage',
    coverage: 91.7,
    totalPrompts: 48,
    description: 'Assesses grounding and unsupported-claim controls.',
    objective: 'Reduce unsupported financial claims by enforcing grounding checks and approved evidence references.',
    governanceTraceability: [
      'Policy: GOV-AI-QUAL-06, Knowledge Grounding Standard KGS-2.5',
      'Evidence: Reference-grounding scorecards and unsupported-claim exception logs',
      'Assurance owner: Model Validation Office and Enterprise Risk Analytics',
    ],
    frameworkMapping: ['AI Prompt Governance v2.3', 'Internal AI Risk Standard', 'RBI Fair Lending'],
    applicationBreakdown: [
      { application: 'Net Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Mobile Banking', evaluated: 8, total: 8, coverage: 100.0 },
      { application: 'Payments', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'Fraud Monitoring', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'AML Operations', evaluated: 7, total: 8, coverage: 87.5 },
      { application: 'Corporate Lending', evaluated: 7, total: 8, coverage: 87.5 },
    ],
    coverageGapAnalysis: [
      '4 prompts require additional grounding datasets before final sign-off.',
      'Current exceptions are concentrated in decision-support prompts with complex policy narratives.',
    ],
    controlResults: { evaluated: 44, pass: 42, fail: 2 },
    businessRisk: 'Hallucinated outputs may create inaccurate guidance, customer disputes, and governance breach exposure.',
    executiveSummary: 'Hallucination guardrails currently cover 91.7% of prompts (44/48), with controlled open items awaiting evidence augmentation.',
    applicationsCovered: ['Net Banking', 'Mobile Banking', 'Payments', 'Fraud Monitoring', 'AML Operations', 'Corporate Lending'],
    modelsCovered: ['GPT-4.1', 'Claude 4.6 Sonnet', 'Azure OpenAI'],
    promptsEvaluated: 44,
    formula: '44/48 = 91.7%',
  },
];

const alerts: AlertRecord[] = [
  {
    key: 'missingDisclaimer',
    title: 'Missing Regulatory Disclaimer',
    priority: 'HIGH PRIORITY',
    severity: 'High',
    application: 'Net Banking',
    governanceFramework: 'RBI Fair Lending + AI Prompt Governance v2.3',
    triggeredControl: 'Regulatory Language Validation',
    rootCause: 'Mandatory regulatory disclaimer was removed from customer-facing response template.',
    impact: 'Customer advisory output may violate regulatory communication requirements.',
    owner: 'Digital Banking Compliance',
    recommendedAction: 'Reinstate disclaimer template and rerun compliance control test.',
  },
  {
    key: 'failedInjection',
    title: 'Failed Prompt Injection Test',
    priority: 'HIGH PRIORITY',
    severity: 'High',
    application: 'Fraud Monitoring',
    governanceFramework: 'Internal AI Risk Standard + AI Prompt Governance v2.3',
    triggeredControl: 'Prompt Injection Scan',
    rootCause: 'Governance guardrails did not fully block malicious instruction override patterns.',
    impact: 'Prompt output integrity may be compromised under malicious instruction patterns.',
    owner: 'Fraud AI Governance Office',
    recommendedAction: 'Tighten instruction hierarchy and deploy updated injection filter rules.',
  },
  {
    key: 'reviewPending',
    title: 'Compliance Review Pending',
    priority: 'PENDING ACTION',
    severity: 'Medium',
    application: 'AML Operations',
    governanceFramework: 'Internal AI Risk Standard + AI Prompt Governance v2.3',
    triggeredControl: 'PII Protection Check',
    rootCause: 'Governance sign-off is delayed because final compliance review is incomplete.',
    impact: 'Prompt cannot be promoted for production use until review completion.',
    owner: 'AML Compliance Governance',
    recommendedAction: 'Complete pending review signoff and attach final evidence package.',
  },
  {
    key: 'scopeViolation',
    title: 'Scope Violation Detected',
    priority: 'REVIEW REQUIRED',
    severity: 'High',
    application: 'Corporate Lending',
    governanceFramework: 'RBI Fair Lending + AI Prompt Governance v2.3',
    triggeredControl: 'Prompt Scope Boundary Check',
    rootCause: 'Prompt scope extended beyond approved advisory boundaries for lending use cases.',
    impact: 'Potential breach of governance boundary for credit decision automation.',
    owner: 'Corporate Lending Governance',
    recommendedAction: 'Rewrite prompt to advisory-only scope and rerun governance validation.',
  },
];

export function PromptGovernance() {
  const [activeKpi, setActiveKpi] = useState<KpiKey | null>(null);
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [activeCoverage, setActiveCoverage] = useState<CoverageKey | null>(null);
  const [activeAlert, setActiveAlert] = useState<AlertKey | null>(null);

  const promptRecords = useMemo(() => buildPromptRecords(), []);
  const approvedPrompts = promptRecords.filter((p) => p.approvalStatus === 'Approved');
  const reviewPrompts = promptRecords.filter((p) => p.approvalStatus === 'In Review');
  const violationPrompts = promptRecords.filter((p) => p.approvalStatus === 'Violation');

  const appCompliance: ApplicationCompliancePoint[] = [
    { application: 'Net Banking', controlsExecuted: 48, passed: 47, failed: 1, compliance: 97.9 },
    { application: 'Mobile Banking', controlsExecuted: 42, passed: 40, failed: 2, compliance: 95.2 },
    { application: 'Payments', controlsExecuted: 38, passed: 36, failed: 2, compliance: 94.7 },
    { application: 'Fraud Monitoring', controlsExecuted: 36, passed: 33, failed: 3, compliance: 91.7 },
    { application: 'AML Operations', controlsExecuted: 34, passed: 31, failed: 3, compliance: 91.2 },
    { application: 'Corporate Lending', controlsExecuted: 42, passed: 36, failed: 6, compliance: 85.7 },
  ];

  const complianceCalc = {
    totalEvaluated: promptRecords.length,
    controlsExecuted: appCompliance.reduce((sum, app) => sum + app.controlsExecuted, 0),
    passed: appCompliance.reduce((sum, app) => sum + app.passed, 0),
    failed: appCompliance.reduce((sum, app) => sum + app.failed, 0),
    applicationsCovered: appCompliance.length,
    modelsCovered: new Set(promptRecords.map((p) => p.model)).size,
  };
  const complianceRatio = (complianceCalc.passed / complianceCalc.controlsExecuted) * 100;
  const complianceFormula = `${complianceCalc.passed}/${complianceCalc.controlsExecuted} = ${complianceRatio.toFixed(1)}% ≈ ${Math.round(complianceRatio)}%`;

  const selectedPrompt = activePromptId ? promptRecords.find((p) => p.id === activePromptId) ?? null : null;
  const selectedCoverage = activeCoverage ? coverageData.find((c) => c.key === activeCoverage) ?? null : null;
  const selectedAlert = activeAlert ? alerts.find((a) => a.key === activeAlert) ?? null : null;
  const alertsByPriority: Record<AlertPriority, AlertRecord[]> = {
    'HIGH PRIORITY': alerts.filter((a) => a.priority === 'HIGH PRIORITY'),
    'REVIEW REQUIRED': alerts.filter((a) => a.priority === 'REVIEW REQUIRED'),
    'PENDING ACTION': alerts.filter((a) => a.priority === 'PENDING ACTION'),
  };

  const kpiCards = [
    { label: 'Approved Prompts', value: 38, suffix: '', trend: 6.1, key: 'approved' as KpiKey },
    { label: 'Prompts Under Review', value: 7, suffix: '', trend: -2.5, key: 'underReview' as KpiKey },
    { label: 'Prompt Violations', value: 3, suffix: '', trend: -25, key: 'violations' as KpiKey },
    { label: 'Compliance Score', value: '93%', trend: 1.8, key: 'compliance' as KpiKey },
  ];

  const topFailedControls: FailedControlPoint[] = [
    {
      control: 'Prompt Scope Boundary Check',
      failureCount: 3,
      affectedPrompts: ['PRM-046', 'PRM-047', 'PRM-048'],
      affectedApplications: ['Corporate Lending'],
      reason: 'Prompt instructions exceeded approved business boundaries.',
    },
    {
      control: 'Fair Lending Bias Check',
      failureCount: 1,
      affectedPrompts: ['PRM-047'],
      affectedApplications: ['Corporate Lending'],
      reason: 'Fairness threshold breached for protected-segment lending scenarios.',
    },
    {
      control: 'PII Protection Check',
      failureCount: 1,
      affectedPrompts: ['PRM-048'],
      affectedApplications: ['Corporate Lending'],
      reason: 'Unmasked customer identifier token appeared in output simulation.',
    },
    {
      control: 'Regulatory Disclaimer Check',
      failureCount: 1,
      affectedPrompts: ['PRM-048'],
      affectedApplications: ['Corporate Lending'],
      reason: 'Mandatory regulatory disclaimer line was missing in final response.',
    },
  ];

  const frameworkCoverage: FrameworkCoveragePoint[] = [
    { framework: 'AI Prompt Governance v2.3', controlsEvaluated: 90, controlsPassed: 87, controlsFailed: 3, coverage: 96.7, scoreContribution: 39.0 },
    { framework: 'RBI Fair Lending', controlsEvaluated: 42, controlsPassed: 36, controlsFailed: 6, coverage: 85.7, scoreContribution: 16.1 },
    { framework: 'PCI-DSS Prompt Controls', controlsEvaluated: 38, controlsPassed: 36, controlsFailed: 2, coverage: 94.7, scoreContribution: 16.1 },
    { framework: 'Internal AI Risk Standard', controlsEvaluated: 70, controlsPassed: 64, controlsFailed: 6, coverage: 91.4, scoreContribution: 28.7 },
  ];

  const executiveFindings = [
    'Highest risk area: Corporate Lending, with 6 control failures across 42 evaluations and 3 violation prompts (PRM-046 to PRM-048).',
    `Most common failure: ${topFailedControls[0].control}, occurring ${topFailedControls[0].failureCount} times across Corporate Lending violations.`,
    `Framework concentration risk: RBI Fair Lending has the lowest coverage (${frameworkCoverage[1].coverage}%) and contributes ${frameworkCoverage[1].scoreContribution}% of passed controls.`,
    'Recommended focus: tighten Corporate Lending prompt approval workflow, scope guardrails, and fairness validation before promotion.',
  ];

  return (
    <Box>
      <Grid container spacing={1.5}>
        {kpiCards.map((kpi) => (
          <Grid key={kpi.label} size={{ xs: 6, md: 3 }}>
            <KpiTile label={kpi.label} value={kpi.value} suffix={kpi.suffix} trend={kpi.trend} onClick={() => setActiveKpi(kpi.key)} />
          </Grid>
        ))}
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Prompt Control Coverage" subtitle="Coverage across governance controls and evaluated prompts" />
        {coverageData.map((coverage) => (
          <Box key={coverage.key} onClick={() => setActiveCoverage(coverage.key)} sx={{ mb: 1.25, p: 1, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: colors.bg.glass } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
              <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{coverage.label}</Typography>
              <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800 }}>{coverage.coverage}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={coverage.coverage}
              sx={{
                height: 7,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': { bgcolor: coverage.coverage >= 95 ? colors.success : coverage.coverage >= 90 ? colors.warning : colors.critical },
              }}
            />
          </Box>
        ))}
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Prompt Governance Alerts" subtitle="Clickable governance exceptions and required remediation" />
        {(['HIGH PRIORITY', 'REVIEW REQUIRED', 'PENDING ACTION'] as AlertPriority[]).map((priority) => (
          <Box key={`priority-${priority}`} sx={{ mb: 1.1 }}>
            <Typography variant="caption" sx={{ color: colors.info, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {priority}
            </Typography>
            {alertsByPriority[priority].map((alert) => {
              const severityStyle = getAlertSeverityStyle(alert.severity);
              return (
                <Box key={alert.key} onClick={() => setActiveAlert(alert.key)} sx={{ mt: 0.55, p: 1, borderRadius: 1, border: `1px solid ${colors.border.subtle}`, bgcolor: colors.bg.glass, cursor: 'pointer' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 0.8 }}>
                    <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.77rem' }}>{alert.title}</Typography>
                    <Typography variant="caption" sx={{ px: 0.8, py: 0.2, borderRadius: 1, fontSize: '0.66rem', fontWeight: 800, color: severityStyle.color, bgcolor: severityStyle.bg }}>
                      {alert.severity}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', mt: 0.25, fontWeight: 700, fontSize: '0.73rem' }}>
                    {alert.application}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: colors.info, mt: 0.15, fontWeight: 700, fontSize: '0.71rem' }}>
                    {alert.triggeredControl}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: colors.text.secondary, mt: 0.15, fontWeight: 700, fontSize: '0.7rem' }}>
                    {alert.governanceFramework}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ))}
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Prompt Governance Register" subtitle="Net Banking · Mobile Banking · Payments · Fraud Monitoring · AML Operations · Corporate Lending" />
        <TableContainer>
          <Table size="small" aria-label="prompt governance table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Prompt</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Model</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Owner</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promptRecords.map((row) => {
                const statusStyle = getStatusStyle(row.approvalStatus);
                return (
                  <TableRow key={row.id} hover sx={{ cursor: 'pointer', '&:hover td': { bgcolor: colors.bg.glass } }} onClick={() => setActivePromptId(row.id)}>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{row.promptName}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.application}</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.model}</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.owner}</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <Typography variant="caption" sx={{ px: 1, py: 0.25, borderRadius: 1, color: statusStyle.color, bgcolor: statusStyle.bg, fontWeight: 700 }}>
                        {row.approvalStatus}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>

      <Drawer
        anchor="right"
        open={activeKpi !== null || activePromptId !== null || activeCoverage !== null || activeAlert !== null}
        onClose={() => {
          setActiveKpi(null);
          setActivePromptId(null);
          setActiveCoverage(null);
          setActiveAlert(null);
        }}
        slotProps={{
          paper: {
            sx: {
              width: 440,
              background: `linear-gradient(180deg, ${colors.bg.tertiary} 0%, ${colors.bg.primary} 100%)`,
              borderLeft: `1px solid ${colors.border.subtle}`,
            },
          },
        }}
      >
        <Box sx={{ p: 2.25 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.25 }}>
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 800 }}>
              {activeKpi
                ? kpiCards.find((k) => k.key === activeKpi)?.label
                : activePromptId
                  ? selectedPrompt?.promptName
                  : activeCoverage
                    ? selectedCoverage?.label
                    : selectedAlert?.title}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                setActiveKpi(null);
                setActivePromptId(null);
                setActiveCoverage(null);
                setActiveAlert(null);
              }}
              sx={{ color: colors.text.secondary }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {activeKpi === 'approved' && approvedPrompts.map((p) => (
            <DrilldownItem
              key={`ap-${p.id}`}
              title={`${p.promptName} (${p.id})`}
              lines={[
                `Application: ${p.application}`,
                `Model: ${p.model}`,
                `Risk Rating: ${p.riskRating}`,
                `Status: ${p.approvalStatus}`,
                `Control Result: ${p.completedControls}/${p.controls.length} Pass`,
              ]}
              onClick={() => setActivePromptId(p.id)}
            />
          ))}

          {activeKpi === 'underReview' && reviewPrompts.map((p) => (
            <DrilldownItem
              key={`rv-${p.id}`}
              title={`${p.promptName} (${p.id})`}
              lines={[
                `Application: ${p.application}`,
                `Model: ${p.model}`,
                `Risk Rating: ${p.riskRating}`,
                `Status: ${p.approvalStatus}`,
                `Control Result: ${p.completedControls}/${p.controls.length} Pass`,
                `Review Stage: ${p.reviewStage}`,
              ]}
              onClick={() => setActivePromptId(p.id)}
            />
          ))}

          {activeKpi === 'violations' && violationPrompts.map((p) => (
            <GlassCard key={`vi-${p.id}`} hover={false} sx={{ p: 1.2, mb: 1.1 }}>
              {(() => {
                const failedControls = p.controls.filter((c) => c.result === 'Fail');
                const passedControls = p.controls.filter((c) => c.result === 'Pass');
                return (
                  <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 0.45 }}>
                <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.82rem' }}>
                  {p.promptName} ({p.id})
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ px: 0.9, py: 0.25, borderRadius: 1, fontWeight: 800, fontSize: '0.68rem', ...getStatusBadgeStyle('Violation') }}
                >
                  Violation
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', mt: 0.15 }}>
                Application: <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 600 }}>{p.application}</Box>
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', mt: 0.15 }}>
                Model: <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 600 }}>{p.model}</Box>
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 700, fontSize: '0.75rem', mt: 0.15 }}>
                Governance Framework: <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 600 }}>{p.governanceFramework}</Box>
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.6, mt: 0.5, flexWrap: 'wrap' }}>
                <Typography
                  variant="caption"
                  sx={{ px: 0.75, py: 0.2, borderRadius: 1, fontWeight: 800, fontSize: '0.66rem', ...getRiskBadgeStyle(p.riskRating) }}
                >
                  Risk: {p.riskRating}
                </Typography>
                <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.72rem' }}>
                  Status: {p.approvalStatus}
                </Typography>
              </Box>
              <Box sx={{ mt: 0.65, borderTop: `1px solid ${colors.border.subtle}`, pt: 0.65 }}>
                <Typography variant="caption" sx={{ display: 'block', color: colors.info, fontWeight: 800, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.35 }}>
                  Control Assessment
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#FF4D4D', fontWeight: 800, fontSize: '0.72rem', mb: 0.2 }}>
                  Failed Controls:
                </Typography>
                {failedControls.map((control) => (
                  <Typography key={`${p.id}-fail-${control.control}`} variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 600, fontSize: '0.74rem', mb: 0.25, pl: 1 }}>
                    • {control.control} — {control.evidence}
                  </Typography>
                ))}
                <Typography variant="caption" sx={{ display: 'block', color: colors.success, fontWeight: 800, fontSize: '0.72rem', mt: 0.4, mb: 0.2 }}>
                  Passed Controls:
                </Typography>
                {passedControls.map((control) => (
                  <Typography key={`${p.id}-pass-${control.control}`} variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 600, fontSize: '0.74rem', mb: 0.2, pl: 1 }}>
                    • {control.control} — Passed
                  </Typography>
                ))}
              </Box>
              <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 600, fontSize: '0.75rem', mt: 0.35 }}>
                Root Cause: {p.rootCause ?? 'N/A'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 600, fontSize: '0.75rem', mt: 0.2 }}>
                Business Impact: {p.impactSummary ?? 'N/A'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 600, fontSize: '0.75rem', mt: 0.2 }}>
                Recommended Action: {p.recommendedActions ?? 'N/A'}
              </Typography>
              <Box sx={{ mt: 0.65, display: 'flex', gap: 0.9, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: colors.success, fontWeight: 700 }}>
                  Passed: {passedControls.length}
                </Typography>
                <Typography variant="caption" sx={{ color: '#FF5252', fontWeight: 800 }}>
                  Failed: {failedControls.length}
                </Typography>
              </Box>
                  </>
                );
              })()}
            </GlassCard>
          ))}

          {activeKpi === 'compliance' && (
            <GlassCard hover={false} sx={{ p: 1.4 }}>
              <DetailLine label="Total Prompts Evaluated" value={`${complianceCalc.totalEvaluated}`} />
              <DetailLine label="Controls Executed" value={`${complianceCalc.controlsExecuted}`} />
              <DetailLine label="Pass Count" value={`${complianceCalc.passed}`} />
              <DetailLine label="Fail Count" value={`${complianceCalc.failed}`} />
              <DetailLine label="Applications Covered" value={`${complianceCalc.applicationsCovered}`} />
              <DetailLine label="Models Covered" value={`${complianceCalc.modelsCovered}`} />
              <DetailLine label="Compliance Formula" value="Compliance Score = Passed Controls / Total Controls Executed" />
              <DetailLine
                label="Formula Example"
                value={`${complianceCalc.passed} Passed, ${complianceCalc.failed} Failed, ${complianceCalc.controlsExecuted} Total → ${complianceFormula}`}
              />

              <Box sx={{ mt: 1.2, mb: 1.25 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>
                  Compliance by Application
                </Typography>
                <Box sx={{ mt: 0.7, height: 240, border: `1px solid ${colors.border.subtle}`, borderRadius: 1, bgcolor: colors.bg.glass, p: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appCompliance} layout="vertical" margin={{ top: 4, right: 10, left: 10, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} />
                      <XAxis type="number" domain={[80, 100]} tick={{ fill: colors.text.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="application" width={110} tick={{ fill: colors.text.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value: number, _name, item) => [
                          `${value}% · ${item.payload.passed}/${item.payload.controlsExecuted} controls passed`,
                          'Compliance',
                        ]}
                        contentStyle={{ backgroundColor: colors.bg.tertiary, border: `1px solid ${colors.border.subtle}`, borderRadius: 8 }}
                        labelStyle={{ color: '#FFFFFF', fontWeight: 700 }}
                        itemStyle={{ color: '#FFFFFF' }}
                      />
                      <Bar dataKey="compliance" radius={[0, 6, 6, 0]}>
                        {appCompliance.map((entry) => (
                          <Cell key={`app-cell-${entry.application}`} fill={entry.compliance >= 95 ? colors.success : entry.compliance >= 90 ? colors.warning : colors.critical} />
                        ))}
                        <LabelList
                          dataKey="compliance"
                          position="right"
                          formatter={(value: number) => `${value.toFixed(1)}%`}
                          style={{ fill: '#FFFFFF', fontSize: 11, fontWeight: 700 }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                {appCompliance.map((app) => (
                  <DetailLine
                    key={`app-evidence-${app.application}`}
                    label={app.application}
                    value={`${app.passed} / ${app.controlsExecuted} controls passed, ${app.failed} failed → ${app.compliance.toFixed(1)}%`}
                  />
                ))}
              </Box>

              <Box sx={{ mt: 1.2, mb: 1.25 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>
                  Top Failed Controls
                </Typography>
                {topFailedControls.map((control) => (
                  <Box key={`failed-control-${control.control}`} sx={{ mb: 1.25, p: 0.9, border: `1px solid ${colors.border.subtle}`, borderRadius: 1, bgcolor: colors.bg.glass }}>
                    <DetailLine label={control.control} value={`Failures: ${control.failureCount}`} />
                    <DetailLine label="Affected Prompts" value={control.affectedPrompts.join(', ')} />
                    <DetailLine label="Affected Applications" value={control.affectedApplications.join(', ')} />
                    <DetailLine label="Failure Reason" value={control.reason} />
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 1.2, mb: 1.25 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>
                  Framework Coverage
                </Typography>
                {frameworkCoverage.map((framework) => (
                  <Box key={`framework-${framework.framework}`} sx={{ mb: 1.25, p: 0.9, border: `1px solid ${colors.border.subtle}`, borderRadius: 1, bgcolor: colors.bg.glass }}>
                    <DetailLine label={framework.framework} value={`${framework.controlsEvaluated} controls evaluated`} />
                    <DetailLine label="Controls Passed" value={`${framework.controlsPassed}`} />
                    <DetailLine label="Controls Failed" value={`${framework.controlsFailed}`} />
                    <DetailLine label="Coverage" value={`${framework.coverage.toFixed(1)}%`} />
                    <DetailLine label="Score Contribution" value={`${framework.scoreContribution.toFixed(1)}%`} />
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 1.2 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>
                  Executive Findings
                </Typography>
                {executiveFindings.map((finding) => (
                  <Typography key={finding} variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.45, mt: 0.55 }}>
                    • {finding}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ mt: 1.2 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>
                  Consistency Validation
                </Typography>
                <DetailLine
                  label="Application Totals Reconcile"
                  value={`${appCompliance.reduce((sum, app) => sum + app.passed, 0)} passed + ${appCompliance.reduce((sum, app) => sum + app.failed, 0)} failed = ${appCompliance.reduce((sum, app) => sum + app.controlsExecuted, 0)} controls`}
                />
                <DetailLine
                  label="Framework Totals Reconcile"
                  value={`${frameworkCoverage.reduce((sum, framework) => sum + framework.controlsPassed, 0)} passed + ${frameworkCoverage.reduce((sum, framework) => sum + framework.controlsFailed, 0)} failed = ${frameworkCoverage.reduce((sum, framework) => sum + framework.controlsEvaluated, 0)} controls`}
                />
                <DetailLine
                  label="Overall Compliance Reconciles"
                  value={`${complianceCalc.passed}/${complianceCalc.controlsExecuted} = ${complianceRatio.toFixed(1)}% (rounded ${Math.round(complianceRatio)}%)`}
                />
              </Box>
            </GlassCard>
          )}

          {activeCoverage && selectedCoverage && (
            <GlassCard hover={false} sx={{ p: 1.4 }}>
              <DetailLine label="Control Objective" value={selectedCoverage.objective} />
              <DetailLine label="Control Description" value={selectedCoverage.description} />
              <Box sx={{ mb: 1.2 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>
                  Governance Traceability
                </Typography>
                {selectedCoverage.governanceTraceability.map((line) => (
                  <Typography key={line} variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.86rem', mt: 0.4, lineHeight: 1.4 }}>
                    • {line}
                  </Typography>
                ))}
              </Box>
              <DetailLine label="Framework Mapping" value={selectedCoverage.frameworkMapping.join(', ')} />
              <Box sx={{ mb: 1.2 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>
                  Application Coverage Breakdown
                </Typography>
                {selectedCoverage.applicationBreakdown.map((row) => (
                  <Typography key={`${selectedCoverage.key}-${row.application}`} variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.86rem', mt: 0.4, lineHeight: 1.4 }}>
                    • {row.application}: {row.evaluated}/{row.total} prompts ({row.coverage.toFixed(1)}%)
                  </Typography>
                ))}
              </Box>
              <Box sx={{ mb: 1.2 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>
                  Coverage Gap Analysis
                </Typography>
                {selectedCoverage.coverageGapAnalysis.map((line) => (
                  <Typography key={line} variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.86rem', mt: 0.4, lineHeight: 1.4 }}>
                    • {line}
                  </Typography>
                ))}
              </Box>
              <DetailLine
                label="Control Results"
                value={`${selectedCoverage.controlResults.pass} pass, ${selectedCoverage.controlResults.fail} fail out of ${selectedCoverage.controlResults.evaluated} evaluated prompts`}
              />
              <DetailLine label="Business Risk" value={selectedCoverage.businessRisk} />
              <DetailLine label="Applications Covered" value={selectedCoverage.applicationsCovered.join(', ')} />
              <DetailLine label="Models Covered" value={selectedCoverage.modelsCovered.join(', ')} />
              <DetailLine label="Prompts Evaluated" value={`${selectedCoverage.promptsEvaluated} of ${selectedCoverage.totalPrompts}`} />
              <DetailLine label="Coverage Calculation" value={selectedCoverage.formula} />
              <DetailLine label="Executive Summary" value={selectedCoverage.executiveSummary} />
            </GlassCard>
          )}

          {activeAlert && selectedAlert && (
            <GlassCard hover={false} sx={{ p: 1.4 }}>
              <DetailLine label="Alert Name" value={selectedAlert.title} />
              <DetailLine label="Related Application" value={selectedAlert.application} />
              <DetailLine label="Triggering Governance Control" value={selectedAlert.triggeredControl} />
              <DetailLine label="Governance Framework" value={selectedAlert.governanceFramework} />
              <DetailLine label="Severity" value={selectedAlert.severity} />
              <DetailLine label="Root Cause" value={selectedAlert.rootCause} />
              <DetailLine label="Business Impact" value={selectedAlert.impact} />
              <DetailLine label="Owner" value={selectedAlert.owner} />
              <DetailLine label="Recommended Action" value={selectedAlert.recommendedAction} />
            </GlassCard>
          )}

          {activePromptId && selectedPrompt && (
            <GlassCard hover={false} sx={{ p: 1.4 }}>
              {selectedPrompt.approvalStatus === 'Violation' && (
                <Box sx={{ mb: 1.3, p: 0.95, borderRadius: 1, border: '1px solid rgba(255,59,59,0.35)', bgcolor: 'rgba(255,59,59,0.14)' }}>
                  <Typography variant="caption" sx={{ color: '#FF5252', textTransform: 'uppercase', fontWeight: 900, fontSize: '0.7rem' }}>
                    Governance Health Summary
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.45, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: colors.success, fontWeight: 800 }}>
                      Controls Passed: {selectedPrompt.completedControls}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#FF5252', fontWeight: 900 }}>
                      Controls Failed: {selectedPrompt.controls.length - selectedPrompt.completedControls}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ px: 0.7, py: 0.2, borderRadius: 1, fontWeight: 900, ...getRiskBadgeStyle(selectedPrompt.riskRating) }}
                    >
                      Risk Level: {selectedPrompt.riskRating}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ px: 0.7, py: 0.2, borderRadius: 1, fontWeight: 900, ...getStatusBadgeStyle(selectedPrompt.approvalStatus) }}
                    >
                      Status: {selectedPrompt.approvalStatus}
                    </Typography>
                  </Box>
                </Box>
              )}
              <DetailLine label="Prompt Name" value={`${selectedPrompt.promptName} (${selectedPrompt.id})`} />
              <DetailLine label="Prompt Text" value={selectedPrompt.promptText} />
              <DetailLine label="Application" value={selectedPrompt.application} />
              <DetailLine label="Model" value={selectedPrompt.model} />
              <DetailLine label="Business Function" value={selectedPrompt.businessFunction} />
              <DetailLine label="Owner" value={selectedPrompt.owner} />
              <DetailLine label="Version" value={selectedPrompt.version} />
              <DetailLine label="Risk Rating" value={selectedPrompt.riskRating} />
              <DetailLine label="Approval Status" value={selectedPrompt.approvalStatus} />
              <DetailLine label="Governance Decision" value={selectedPrompt.governanceDecision} />
              <DetailLine label="Decision Rationale" value={selectedPrompt.decisionRationale} />
              <DetailLine label="Detection Rule" value={selectedPrompt.detectionRule ?? 'N/A'} />
              <DetailLine label="Recommended Actions" value={selectedPrompt.recommendedActions ?? 'N/A'} />
              <DetailLine label="Due Date" value={selectedPrompt.dueDate ?? 'N/A'} />
              <DetailLine
                label="Traceability"
                value={`${selectedPrompt.application} → ${selectedPrompt.model} → ${selectedPrompt.promptName} → ${selectedPrompt.controls.map((c) => c.control).join(', ')} → ${selectedPrompt.governanceDecision}`}
              />
              <Box sx={{ mt: 0.8, mb: 1.2 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.74rem', fontWeight: 800 }}>Approval History</Typography>
                {selectedPrompt.approvalHistory.map((entry) => (
                  <Typography key={`${selectedPrompt.id}-${entry}`} variant="body2" sx={{ color: '#FFFFFF', fontSize: '0.84rem', fontWeight: 600, mt: 0.45 }}>
                    • {entry}
                  </Typography>
                ))}
              </Box>
              <Box sx={{ mt: 0.8 }}>
                <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontSize: '0.74rem', fontWeight: 800 }}>Governance Controls Executed</Typography>
                {selectedPrompt.controls.map((control) => (
                  <Box key={`${selectedPrompt.id}-${control.control}`} sx={{ mt: 0.65, p: 0.8, border: `1px solid ${colors.border.subtle}`, borderRadius: 1, bgcolor: colors.bg.glass }}>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.83rem' }}>{control.control}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', mt: 0.25 }}>{control.objective}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'inline-block',
                        mt: 0.35,
                        px: 0.7,
                        py: 0.15,
                        borderRadius: 1,
                        fontWeight: 900,
                        fontSize: '0.68rem',
                        color: control.result === 'Pass' ? '#22C55E' : '#FF3B3B',
                        bgcolor: control.result === 'Pass' ? 'rgba(34,197,94,0.2)' : 'rgba(255,59,59,0.2)',
                      }}
                    >
                      {control.result === 'Pass' ? 'Passed Control' : 'Failed Control'}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', color: colors.text.secondary, mt: 0.2 }}>{control.evidence}</Typography>
                  </Box>
                ))}
              </Box>
            </GlassCard>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ mb: 1.2 }}>
      <Typography variant="caption" sx={{ color: colors.info, textTransform: 'uppercase', fontWeight: 800, fontSize: '0.74rem' }}>{label}</Typography>
      <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.45 }}>{value}</Typography>
    </Box>
  );
}

function DrilldownItem({ title, lines, onClick }: { title: string; lines: string[]; onClick: () => void }) {
  return (
    <GlassCard hover={false} sx={{ p: 1.15, mb: 1, cursor: 'pointer' }} onClick={onClick}>
      <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.81rem' }}>{title}</Typography>
      {lines.map((line) => (
        <Typography key={`${title}-${line}`} variant="caption" sx={{ display: 'block', color: colors.text.secondary, mt: 0.25, fontSize: '0.74rem' }}>
          {line}
        </Typography>
      ))}
    </GlassCard>
  );
}

function KpiTile({
  label,
  value,
  suffix,
  trend,
  onClick,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  trend?: number;
  onClick: () => void;
}) {
  const isPositive = (trend ?? 0) >= 0;
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
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text.primary }}>{value}</Typography>
        {suffix && <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>{suffix}</Typography>}
      </Box>
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
          {isPositive ? <TrendingUpIcon sx={{ fontSize: 14, color: colors.success }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: colors.critical }} />}
          <Typography variant="caption" sx={{ color: isPositive ? colors.success : colors.critical, fontWeight: 600 }}>
            {isPositive ? '+' : ''}{trend}%
          </Typography>
        </Box>
      )}
    </GlassCard>
  );
}
