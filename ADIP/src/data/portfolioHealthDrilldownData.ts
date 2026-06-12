export interface PortfolioHealthFactor {
  id: string;
  title: string;
  value: number;
  weight: number;
  note: string;
}

export interface OnTrackProject {
  id: string;
  title: string;
  owner: string;
  progress: string;
  releaseTarget: string;
  achievements: string;
  risks: string;
  confidence: number;
  status: 'On Track';
}

export interface AtRiskProject {
  id: string;
  title: string;
  severity: 'High' | 'Medium';
  reason: string;
  impact: string;
  mitigation: string;
  owner: string;
}

export interface CriticalEscalation {
  id: string;
  title: string;
  impact: string;
  owner: string;
  status: string;
  resolution: string;
  targetResolution: string;
  path: string;
}

export const portfolioHealthBreakdown: PortfolioHealthFactor[] = [
  { id: 'REQ', title: 'Requirements Quality', value: 84, weight: 0.15, note: '287 requirements analysed, 14 high-risk items open.' },
  { id: 'ARCH', title: 'Architecture Readiness', value: 88, weight: 0.15, note: 'Critical dependency risk persists on UPI Switch and Fraud Engine.' },
  { id: 'DEV', title: 'Development Quality', value: 87, weight: 0.15, note: 'Code quality 87 with 34 debt items and 5 security findings.' },
  { id: 'TEST', title: 'Testing Effectiveness', value: 93, weight: 0.15, note: 'Coverage 96.8% and low defect leakage across core domains.' },
  { id: 'REL', title: 'Release Confidence', value: 88, weight: 0.15, note: '4 in-flight releases, UPI 24.6 still high risk.' },
  { id: 'PROD', title: 'Production Stability', value: 91, weight: 0.15, note: 'Availability 99.94%, MTTR 22 minutes, 6 open incidents.' },
  { id: 'GOV', title: 'Governance Posture', value: 85, weight: 0.1, note: 'Policy compliance high, but open VAPT and audit observations remain.' },
];

export const portfolioHealthTrend = [
  { day: 'Jan', value: 82 },
  { day: 'Feb', value: 83 },
  { day: 'Mar', value: 84 },
  { day: 'Apr', value: 85 },
  { day: 'May', value: 87 },
  { day: 'Jun', value: 88 },
];

export const onTrackProjects: OnTrackProject[] = [
  {
    id: 'PRG-NB-84',
    title: 'Net Banking 8.4 Hardening',
    owner: 'Retail Digital Engineering',
    progress: '82%',
    releaseTarget: 'R-NB-8.4 / Jun Sprint 3',
    achievements: 'Session stability fixes closed and synthetic monitoring coverage expanded.',
    risks: 'Low residual risk on customer notification throttling.',
    confidence: 93,
    status: 'On Track',
  },
  {
    id: 'PRG-MOB-59',
    title: 'Mobile Banking 5.9 Controls',
    owner: 'Mobile Platform AI',
    progress: '78%',
    releaseTarget: 'R-MOB-5.9 / Jul Sprint 1',
    achievements: 'Biometric flow regression and RBI disclaimer controls signed off.',
    risks: 'Medium risk from pending certificate rotation window.',
    confidence: 91,
    status: 'On Track',
  },
  {
    id: 'PRG-PAY-122',
    title: 'Payments Platform 12.2 Readiness',
    owner: 'Payments Engineering',
    progress: '74%',
    releaseTarget: 'R-PAY-12.2 / Jul Sprint 2',
    achievements: 'Merchant settlement reconciliation and rollback drills completed.',
    risks: 'Medium risk on settlement DB pool saturation at peak.',
    confidence: 88,
    status: 'On Track',
  },
  {
    id: 'PRG-GOV-PROMPT',
    title: 'Prompt Governance Control Uplift',
    owner: 'Enterprise AI Governance',
    progress: '86%',
    releaseTarget: 'Governance Wave 3 / Jul',
    achievements: 'Coverage drilldowns aligned; violation remediation workflow enforced.',
    risks: 'Low residual risk on pending AML sign-off.',
    confidence: 94,
    status: 'On Track',
  },
];

export const onTrackTrend = [
  { day: 'Jan', value: 6 },
  { day: 'Feb', value: 7 },
  { day: 'Mar', value: 7 },
  { day: 'Apr', value: 8 },
  { day: 'May', value: 8 },
  { day: 'Jun', value: 9 },
];

export const atRiskProjects: AtRiskProject[] = [
  {
    id: 'PRG-UPI-246',
    title: 'UPI Release 24.6',
    severity: 'High',
    reason: 'Fraud Engine dependency remains a single point of failure on verify path.',
    impact: 'Potential payment authorization disruption at peak UPI load.',
    mitigation: 'Enable circuit breaker and complete failover simulation before CAB.',
    owner: 'Payments Reliability Office',
  },
  {
    id: 'PRG-FRAUD-REVAMP',
    title: 'Enterprise Fraud Detection Revamp',
    severity: 'High',
    reason: 'Model latency spikes continue under adversarial transaction patterns.',
    impact: 'False decline and delayed fraud response can affect customer trust and loss rates.',
    mitigation: 'Deploy model shard scaling and enforce inference SLA guardrails.',
    owner: 'Fraud Risk Analytics',
  },
  {
    id: 'PRG-SETTLEMENT-AUTO',
    title: 'Merchant Auto Settlement',
    severity: 'Medium',
    reason: 'Batch overlap with mandate reconciliation creates operational contention.',
    impact: 'Settlement SLA breaches for merchant payouts during EOD windows.',
    mitigation: 'Resequence batch windows and isolate settlement queue resources.',
    owner: 'Payments Operations',
  },
];

export const atRiskTrend = [
  { day: 'Jan', value: 5 },
  { day: 'Feb', value: 5 },
  { day: 'Mar', value: 4 },
  { day: 'Apr', value: 4 },
  { day: 'May', value: 3 },
  { day: 'Jun', value: 3 },
];

export const criticalEscalations: CriticalEscalation[] = [
  {
    id: 'ESC-01',
    title: 'Fraud Engine Resilience Decision',
    impact: 'UPI authorization path remains exposed to critical outage risk.',
    owner: 'Chief Technology Officer',
    status: 'Open - Executive Decision Required',
    resolution: 'Approve HA node expansion and mandatory canary failover by next CAB.',
    targetResolution: '2026-06-21',
    path: 'CTO -> CIO -> Release Governance Board',
  },
  {
    id: 'ESC-02',
    title: 'Regulatory Control Closure for Lending AI',
    impact: 'RBI Fair Lending control exceptions can delay lending workflow rollout.',
    owner: 'Chief Compliance Officer',
    status: 'In Progress',
    resolution: 'Close Prompt Scope Boundary and Fair Lending Bias exceptions with signed evidence.',
    targetResolution: '2026-06-18',
    path: 'CCO -> Head of Lending -> Model Risk Committee',
  },
  {
    id: 'ESC-03',
    title: 'Settlement Capacity Approval',
    impact: 'Merchant settlement backlog risk may breach partner payout commitments.',
    owner: 'Head of Payments Operations',
    status: 'Tracking',
    resolution: 'Approve temporary capacity uplift and permanent queue optimization plan.',
    targetResolution: '2026-06-25',
    path: 'Payments Ops Head -> COO -> Executive Operations Council',
  },
];

export const escalationTrend = [
  { day: 'Jan', value: 4 },
  { day: 'Feb', value: 4 },
  { day: 'Mar', value: 3 },
  { day: 'Apr', value: 3 },
  { day: 'May', value: 2 },
  { day: 'Jun', value: 2 },
];

export function calculatePortfolioHealthScore(): number {
  const weighted = portfolioHealthBreakdown.reduce((sum, factor) => sum + factor.value * factor.weight, 0);
  return Math.round(weighted);
}

export function getPortfolioHealthKpis() {
  return {
    portfolioHealthScore: calculatePortfolioHealthScore(),
    projectsOnTrack: onTrackProjects.length,
    projectsAtRisk: atRiskProjects.length,
    criticalEscalations: criticalEscalations.length,
  };
}
