export type RiskSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type RiskTrend = 'Improving' | 'Stable' | 'Worsening';

export interface OperationalRisk {
  id: string;
  title: string;
  description: string;
  domain: string;
  owner: string;
  severity: RiskSeverity;
  businessImpact: string;
  rootCause: string;
  controls: string[];
  mitigationPlan: string;
  dueDate: string;
  mitigationProgress: number;
  mitigationStatus: 'On Track' | 'At Risk' | 'Delayed';
  residualRiskScore: number;
  trend: RiskTrend;
}

export const operationalRiskRegister: OperationalRisk[] = [
  { id: 'RISK-001', title: 'UPI outage concentration in peak window', description: 'UPI peak-hour transaction surges can saturate switch dependencies.', domain: 'Payments', owner: 'SRE Banking', severity: 'High', businessImpact: 'Customer payment failure and revenue leakage during peak window.', rootCause: 'Insufficient autoscaling coverage on fraud-verified UPI path.', controls: ['Peak TPS capacity tests', 'Circuit-breaker on fraud service'], mitigationPlan: 'Enable dynamic burst scaling and complete failover rehearsal.', dueDate: '2026-06-24', mitigationProgress: 62, mitigationStatus: 'At Risk', residualRiskScore: 74, trend: 'Stable' },
  { id: 'RISK-002', title: 'Delayed patching on internet-facing middleware', description: 'Critical CVE patch windows exceed internal SLA.', domain: 'Infrastructure', owner: 'Platform Security', severity: 'Critical', businessImpact: 'Higher likelihood of exploitable vulnerability exposure.', rootCause: 'Change freeze overlap with patch cycle.', controls: ['Weekly vulnerability scans', 'Emergency patch CAB lane'], mitigationPlan: 'Ring-based patch deployment with override approval path.', dueDate: '2026-06-18', mitigationProgress: 48, mitigationStatus: 'Delayed', residualRiskScore: 79, trend: 'Worsening' },
  { id: 'RISK-003', title: 'Fraud model false-positive surge', description: 'Fraud controls over-trigger for selected merchant cohorts.', domain: 'Fraud Monitoring', owner: 'Fraud Analytics', severity: 'Medium', businessImpact: 'Payment declines and customer complaints.', rootCause: 'Model threshold drift under new campaign traffic.', controls: ['Model drift monitor', 'Appeal feedback loop'], mitigationPlan: 'Recalibrate thresholds and deploy cohort-specific rules.', dueDate: '2026-06-28', mitigationProgress: 71, mitigationStatus: 'On Track', residualRiskScore: 63, trend: 'Improving' },
  { id: 'RISK-004', title: 'Batch reconciliation delay for loan postings', description: 'Loan posting reconciliation runs exceed EOD schedule.', domain: 'Core Lending', owner: 'Loan Operations Tech', severity: 'Medium', businessImpact: 'Delayed account updates and settlement mismatch follow-ups.', rootCause: 'Contention between reconciliation and archival jobs.', controls: ['Batch SLA dashboards', 'Queue backpressure alerts'], mitigationPlan: 'Resequence jobs and reserve dedicated compute lane.', dueDate: '2026-07-02', mitigationProgress: 66, mitigationStatus: 'On Track', residualRiskScore: 61, trend: 'Improving' },
  { id: 'RISK-005', title: 'Corporate lending policy exception overflow', description: 'Manual policy exceptions increase in lending workflow.', domain: 'Corporate Lending', owner: 'Credit Policy Office', severity: 'High', businessImpact: 'Higher governance review load and delayed sanctions.', rootCause: 'Rule coverage gaps for edge-case borrower profiles.', controls: ['Policy exception workflow', 'Second-line approval checks'], mitigationPlan: 'Expand policy rules and automate exception triage.', dueDate: '2026-06-30', mitigationProgress: 57, mitigationStatus: 'At Risk', residualRiskScore: 73, trend: 'Stable' },
  { id: 'RISK-006', title: 'Merchant settlement backlog risk', description: 'Daily merchant settlement queue approaches SLA threshold.', domain: 'Payments Operations', owner: 'Head of Payments Operations', severity: 'High', businessImpact: 'Delayed merchant payouts and partner dissatisfaction.', rootCause: 'Settlement queue contention in EOD windows.', controls: ['Settlement queue dashboard', 'Auto-retry controls'], mitigationPlan: 'Add settlement worker pool and isolate heavy merchants.', dueDate: '2026-06-26', mitigationProgress: 54, mitigationStatus: 'At Risk', residualRiskScore: 72, trend: 'Stable' },
  { id: 'RISK-007', title: 'Lending AI fair-use compliance exceptions', description: 'Prompt governance exceptions persist in lending AI rollout.', domain: 'AI Governance', owner: 'Model Risk Office', severity: 'Critical', businessImpact: 'Potential regulatory delay for lending automation release.', rootCause: 'Unclosed control findings in fairness and scope checks.', controls: ['Prompt governance board', 'Fairness validation suite'], mitigationPlan: 'Close open controls and obtain CCO sign-off.', dueDate: '2026-06-20', mitigationProgress: 52, mitigationStatus: 'Delayed', residualRiskScore: 81, trend: 'Worsening' },
  { id: 'RISK-008', title: 'Authentication dependency single point failure', description: 'Shared auth service degrades multiple customer channels.', domain: 'Security', owner: 'Identity Engineering', severity: 'Critical', businessImpact: 'Login failures across net and mobile banking.', rootCause: 'Insufficient active-active routing on auth gateway.', controls: ['Auth service SLO monitors', 'Automated failover health checks'], mitigationPlan: 'Deploy active-active auth topology and chaos validation.', dueDate: '2026-06-22', mitigationProgress: 46, mitigationStatus: 'Delayed', residualRiskScore: 80, trend: 'Worsening' },
  { id: 'RISK-009', title: 'Treasury data quality lag', description: 'Liquidity model inputs lag intraday event stream.', domain: 'Treasury', owner: 'Treasury Data Office', severity: 'Medium', businessImpact: 'Reduced reliability of intraday liquidity signals.', rootCause: 'Late ingestion from RTGS reconciliation feed.', controls: ['Data freshness alerts', 'Input quality thresholds'], mitigationPlan: 'Introduce stream buffering and fallback data source.', dueDate: '2026-07-05', mitigationProgress: 64, mitigationStatus: 'On Track', residualRiskScore: 60, trend: 'Improving' },
  { id: 'RISK-010', title: 'Branch network device patch variability', description: 'Uneven branch endpoint patch levels.', domain: 'Branch Banking', owner: 'Branch IT Controls', severity: 'Medium', businessImpact: 'Operational and security control inconsistency.', rootCause: 'Manual patch orchestration across regional clusters.', controls: ['Endpoint compliance scan', 'Regional patch tracker'], mitigationPlan: 'Automate endpoint patching via central policy.', dueDate: '2026-07-08', mitigationProgress: 58, mitigationStatus: 'On Track', residualRiskScore: 59, trend: 'Stable' },
  { id: 'RISK-011', title: 'Card dispute SLA breach risk', description: 'Dispute queue growth risks breach of TAT commitments.', domain: 'Cards Operations', owner: 'Cards Ops Head', severity: 'Medium', businessImpact: 'Potential penalty and customer dissatisfaction.', rootCause: 'Manual evidence collation bottlenecks.', controls: ['Case prioritization rules', 'SLA threshold alerts'], mitigationPlan: 'Deploy copilot-assisted case preparation.', dueDate: '2026-06-29', mitigationProgress: 61, mitigationStatus: 'At Risk', residualRiskScore: 71, trend: 'Stable' },
  { id: 'RISK-012', title: 'Cross-border AML queue spike', description: 'Cross-border AML alerts spike beyond planned capacity.', domain: 'Compliance', owner: 'AML Operations', severity: 'Medium', businessImpact: 'Potential delay in suspicious activity triage.', rootCause: 'Risk rule updates without workload rebalance.', controls: ['Dynamic alert scoring', 'Analyst capacity pool'], mitigationPlan: 'Retune rule thresholds and add surge roster.', dueDate: '2026-07-03', mitigationProgress: 67, mitigationStatus: 'On Track', residualRiskScore: 62, trend: 'Improving' },
  { id: 'RISK-013', title: 'Net banking session timeout anomalies', description: 'Session drops increase for high-latency users.', domain: 'Net Banking', owner: 'Digital Channels', severity: 'Medium', businessImpact: 'Customer journey interruption and abandonment.', rootCause: 'Session TTL not aligned with latency profile.', controls: ['Session health telemetry', 'Adaptive timeout policy'], mitigationPlan: 'Tune timeout and deploy edge cache update.', dueDate: '2026-07-01', mitigationProgress: 69, mitigationStatus: 'On Track', residualRiskScore: 58, trend: 'Improving' },
  { id: 'RISK-014', title: 'Mobile app release rollback readiness gap', description: 'Rollback playbook lacks full rehearsal for latest mobile release.', domain: 'Release Management', owner: 'Release Control Office', severity: 'Medium', businessImpact: 'Extended outage window if release fails.', rootCause: 'Rollback scenario not included in recent release cycle.', controls: ['Go/No-Go checklist', 'Release simulation gate'], mitigationPlan: 'Execute rollback rehearsal and update checklist.', dueDate: '2026-06-27', mitigationProgress: 65, mitigationStatus: 'On Track', residualRiskScore: 60, trend: 'Stable' },
  { id: 'RISK-015', title: 'API contract drift between payments services', description: 'Service contract changes not synchronized across consumers.', domain: 'Architecture', owner: 'Integration Architecture', severity: 'High', businessImpact: 'Payment workflow errors and integration instability.', rootCause: 'Schema governance lag in fast release cycles.', controls: ['API schema registry', 'Backward-compatibility tests'], mitigationPlan: 'Enforce contract gate and version policy.', dueDate: '2026-06-25', mitigationProgress: 56, mitigationStatus: 'At Risk', residualRiskScore: 70, trend: 'Worsening' },
  { id: 'RISK-016', title: 'UPI mandate reconciliation mismatch', description: 'Mismatch in mandate status across systems.', domain: 'Payments', owner: 'UPI Product Ops', severity: 'Medium', businessImpact: 'Customer complaint handling and reversal workload.', rootCause: 'Asynchronous event loss in retry flow.', controls: ['Event checksum audit', 'Mandate status reconciler'], mitigationPlan: 'Add idempotent replay with event journaling.', dueDate: '2026-07-04', mitigationProgress: 63, mitigationStatus: 'On Track', residualRiskScore: 61, trend: 'Stable' },
  { id: 'RISK-017', title: 'Data retention policy enforcement lag', description: 'Retention cleanup jobs run inconsistently across stores.', domain: 'Data Governance', owner: 'Enterprise Data Governance', severity: 'Medium', businessImpact: 'Compliance exposure and storage cost increase.', rootCause: 'Policy scheduler misalignment with archive windows.', controls: ['Retention policy scanner', 'Monthly compliance attestation'], mitigationPlan: 'Consolidate retention scheduler and monitor failures.', dueDate: '2026-07-09', mitigationProgress: 60, mitigationStatus: 'On Track', residualRiskScore: 59, trend: 'Stable' },
  { id: 'RISK-018', title: 'DR test evidence incompleteness', description: 'Disaster recovery evidence package has missing artifacts.', domain: 'Resilience', owner: 'BCP Office', severity: 'Medium', businessImpact: 'Audit challenge on resilience readiness claims.', rootCause: 'Manual artifact collection and delayed approvals.', controls: ['DR checklist control', 'Evidence repository workflow'], mitigationPlan: 'Automate evidence collection and sign-off workflow.', dueDate: '2026-07-10', mitigationProgress: 55, mitigationStatus: 'At Risk', residualRiskScore: 65, trend: 'Stable' },
  { id: 'RISK-019', title: 'SOC alert noise inflation', description: 'High false-positive ratio in SOC priority alerts.', domain: 'Security Operations', owner: 'SOC Lead', severity: 'Low', businessImpact: 'Analyst fatigue and slower triage.', rootCause: 'Outdated correlation rules.', controls: ['Alert tuning cadence', 'SOC quality metrics'], mitigationPlan: 'Refactor detection rules and suppress known benign events.', dueDate: '2026-07-12', mitigationProgress: 72, mitigationStatus: 'On Track', residualRiskScore: 52, trend: 'Improving' },
  { id: 'RISK-020', title: 'Card tokenization key rotation delay', description: 'Tokenization key rotation not completed in planned cycle.', domain: 'Cards Platform', owner: 'Card Platform Security', severity: 'High', businessImpact: 'Elevated cryptographic exposure and compliance concern.', rootCause: 'HSM maintenance overlap delayed rotation.', controls: ['Key lifecycle tracker', 'Dual-control approvals'], mitigationPlan: 'Execute emergency rotation and automate validation.', dueDate: '2026-06-23', mitigationProgress: 51, mitigationStatus: 'Delayed', residualRiskScore: 75, trend: 'Worsening' },
  { id: 'RISK-021', title: 'Contact center knowledge base staleness', description: 'Policy answers in contact center lag current controls.', domain: 'Customer Service', owner: 'Service Quality Office', severity: 'Low', businessImpact: 'Inconsistent customer guidance on edge scenarios.', rootCause: 'Delayed content refresh workflow.', controls: ['Weekly content review', 'Knowledge freshness score'], mitigationPlan: 'Auto-sync policy changes with KB publication.', dueDate: '2026-07-15', mitigationProgress: 74, mitigationStatus: 'On Track', residualRiskScore: 50, trend: 'Improving' },
  { id: 'RISK-022', title: 'Merchant onboarding KYC exception backlog', description: 'KYC exception queue exceeds target turnaround.', domain: 'Merchant Acquiring', owner: 'Merchant Risk Operations', severity: 'Medium', businessImpact: 'Delayed merchant activation and revenue lag.', rootCause: 'Manual verification on high-risk profiles.', controls: ['KYC queue SLA monitor', 'Risk-based workflow'], mitigationPlan: 'Introduce rule-based auto-approval tiers.', dueDate: '2026-07-06', mitigationProgress: 62, mitigationStatus: 'On Track', residualRiskScore: 63, trend: 'Stable' },
  { id: 'RISK-023', title: 'Cloud cost guardrail variance', description: 'Compute spend exceeds planned guardrail in analytics workloads.', domain: 'FinOps', owner: 'Cloud Governance', severity: 'Low', businessImpact: 'Budget variance without direct service impact.', rootCause: 'Unoptimized model retraining schedule.', controls: ['Cost anomaly detection', 'Tagging policy enforcement'], mitigationPlan: 'Apply scheduling optimization and reserved capacity.', dueDate: '2026-07-14', mitigationProgress: 70, mitigationStatus: 'On Track', residualRiskScore: 53, trend: 'Improving' },
  { id: 'RISK-024', title: 'Loan disbursement callback retry failures', description: 'Retry logic fails on intermittent partner callback outages.', domain: 'Core Lending', owner: 'Lending Integrations', severity: 'Medium', businessImpact: 'Disbursement confirmation delays and manual support load.', rootCause: 'Insufficient retry jitter and timeout tuning.', controls: ['Callback retry monitor', 'Partner SLA tracking'], mitigationPlan: 'Update retry policy and add dead-letter recovery.', dueDate: '2026-07-07', mitigationProgress: 61, mitigationStatus: 'On Track', residualRiskScore: 62, trend: 'Stable' },
  { id: 'RISK-025', title: 'Privileged access recertification slippage', description: 'Quarterly privileged access recertification behind schedule.', domain: 'IAM Governance', owner: 'Identity Governance', severity: 'Medium', businessImpact: 'Increased risk of inappropriate privileged access.', rootCause: 'Delayed business owner attestations.', controls: ['IAM recertification workflow', 'Privilege usage analytics'], mitigationPlan: 'Escalation workflow for overdue attestations.', dueDate: '2026-07-11', mitigationProgress: 57, mitigationStatus: 'At Risk', residualRiskScore: 66, trend: 'Stable' },
  { id: 'RISK-026', title: 'Settlement reporting latency in treasury feed', description: 'Treasury settlement reports delivered beyond expected window.', domain: 'Treasury Operations', owner: 'Treasury Ops Tech', severity: 'Low', businessImpact: 'Reduced timeliness of treasury decision support.', rootCause: 'Batch-to-stream bridge inefficiency.', controls: ['Reporting latency alerts', 'Fallback report generation'], mitigationPlan: 'Shift settlement reports to incremental stream model.', dueDate: '2026-07-16', mitigationProgress: 68, mitigationStatus: 'On Track', residualRiskScore: 54, trend: 'Improving' },
  { id: 'RISK-027', title: 'Model monitoring alert routing gaps', description: 'Some model alerts route to non-owning teams.', domain: 'Model Ops', owner: 'AI Platform Operations', severity: 'Medium', businessImpact: 'Delayed response to model quality deterioration.', rootCause: 'Ownership mapping stale after org change.', controls: ['Model ownership registry', 'Alert routing rules'], mitigationPlan: 'Refresh ownership mapping and alert subscriptions.', dueDate: '2026-07-13', mitigationProgress: 59, mitigationStatus: 'At Risk', residualRiskScore: 64, trend: 'Stable' },
  { id: 'RISK-028', title: 'ATM reconciliation exception trend', description: 'ATM reconciliation exceptions trend above monthly baseline.', domain: 'Retail Operations', owner: 'ATM Operations', severity: 'Low', businessImpact: 'Back-office workload and delayed closure.', rootCause: 'Intermittent cash reconciliation feed mismatch.', controls: ['Exception monitor', 'Daily exception triage'], mitigationPlan: 'Enhance feed validation and reconciliation checks.', dueDate: '2026-07-17', mitigationProgress: 73, mitigationStatus: 'On Track', residualRiskScore: 51, trend: 'Improving' },
  { id: 'RISK-029', title: 'SMS notification delivery lag', description: 'Transactional SMS delays in specific telecom routes.', domain: 'Notification Services', owner: 'Customer Communications Tech', severity: 'Low', businessImpact: 'Delayed customer transaction awareness.', rootCause: 'Route congestion with backup failover latency.', controls: ['Delivery latency SLA', 'Multi-provider routing'], mitigationPlan: 'Prioritize critical templates and optimize route failover.', dueDate: '2026-07-18', mitigationProgress: 71, mitigationStatus: 'On Track', residualRiskScore: 52, trend: 'Stable' },
  { id: 'RISK-030', title: 'Core banking archival backlog', description: 'Archival jobs lag retention schedule in legacy cluster.', domain: 'Core Banking', owner: 'Core Platform Ops', severity: 'Medium', businessImpact: 'Storage pressure and recovery window extension.', rootCause: 'Legacy storage throughput constraints.', controls: ['Archive backlog monitor', 'Storage threshold alerts'], mitigationPlan: 'Migrate archival workloads to optimized storage tier.', dueDate: '2026-07-19', mitigationProgress: 58, mitigationStatus: 'At Risk', residualRiskScore: 65, trend: 'Stable' },
  { id: 'RISK-031', title: 'Vendor dependency SLA variance', description: 'Third-party SLA misses affect non-critical batch services.', domain: 'Third-Party Risk', owner: 'Vendor Governance Office', severity: 'Low', businessImpact: 'Operational variability in reporting batch windows.', rootCause: 'Uneven vendor support staffing on weekends.', controls: ['Vendor SLA dashboard', 'Contractual penalty controls'], mitigationPlan: 'Renegotiate SLA thresholds and add escalation terms.', dueDate: '2026-07-20', mitigationProgress: 69, mitigationStatus: 'On Track', residualRiskScore: 53, trend: 'Improving' },
];

export const highRiskItems = operationalRiskRegister.filter((risk) => risk.severity === 'High' || risk.severity === 'Critical');
export const mitigationPlansDue = operationalRiskRegister
  .filter((risk) => new Date(risk.dueDate) <= new Date('2026-06-30'))
  .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  .slice(0, 5);

export function calculateResidualRiskScore() {
  const weightedResidual = operationalRiskRegister.reduce((sum, risk) => {
    const severityWeight = risk.severity === 'Critical' ? 1.2 : risk.severity === 'High' ? 1.1 : risk.severity === 'Medium' ? 1.0 : 0.9;
    return sum + risk.residualRiskScore * severityWeight;
  }, 0);
  const weightedBaseline = operationalRiskRegister.reduce((sum, risk) => {
    const severityWeight = risk.severity === 'Critical' ? 1.2 : risk.severity === 'High' ? 1.1 : risk.severity === 'Medium' ? 1.0 : 0.9;
    return sum + severityWeight;
  }, 0);
  return Math.round(weightedResidual / weightedBaseline);
}

export const riskTrends = {
  enterpriseRisks: [
    { day: 'Jan', value: 35 },
    { day: 'Feb', value: 34 },
    { day: 'Mar', value: 33 },
    { day: 'Apr', value: 33 },
    { day: 'May', value: 32 },
    { day: 'Jun', value: 31 },
  ],
  highRiskItems: [
    { day: 'Jan', value: 10 },
    { day: 'Feb', value: 10 },
    { day: 'Mar', value: 9 },
    { day: 'Apr', value: 9 },
    { day: 'May', value: 8 },
    { day: 'Jun', value: 8 },
  ],
  mitigationDue: [
    { day: 'Jan', value: 7 },
    { day: 'Feb', value: 7 },
    { day: 'Mar', value: 6 },
    { day: 'Apr', value: 6 },
    { day: 'May', value: 5 },
    { day: 'Jun', value: 5 },
  ],
  residualRisk: [
    { day: 'Jan', value: 69 },
    { day: 'Feb', value: 68 },
    { day: 'Mar', value: 67 },
    { day: 'Apr', value: 66 },
    { day: 'May', value: 65 },
    { day: 'Jun', value: 64 },
  ],
};

export function getGovernanceRiskKpis() {
  return {
    enterpriseRisks: operationalRiskRegister.length,
    highRiskItems: highRiskItems.length,
    mitigationPlansDue: mitigationPlansDue.length,
    residualRiskScore: calculateResidualRiskScore(),
  };
}
