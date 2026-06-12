export type BestPracticeDomain = 'Operations' | 'Security' | 'Testing' | 'Architecture' | 'AI Governance';
export type PracticeStatus = 'Adopted' | 'Pending';
export type PracticeService = 'Fraud Engine' | 'UPI Switch' | 'Payment Gateway' | 'Notification Hub' | 'Net Banking Portal';

export interface BestPracticeRecord {
  id: string;
  practice: string;
  domain: BestPracticeDomain;
  status: PracticeStatus;
  owner: string;
  objective: string;
  reason: string;
  relatedLessonIncident: string;
  impactedService: PracticeService;
}

export interface HighRiskGapRecord {
  id: string;
  service: PracticeService;
  missingPractice: string;
  riskReason: string;
}

export const bestPracticeLibrary: BestPracticeRecord[] = [
  { id: 'BP-001', practice: 'Fraud scoring degradation triage within 15 minutes', domain: 'Operations', status: 'Adopted', owner: 'Fraud Ops Lead', objective: 'Reduce response time for scoring slowdowns.', reason: 'Fraud Engine incidents showed delayed triage increased payment risk.', relatedLessonIncident: 'INC-240601 thread-pool starvation response lag.', impactedService: 'Fraud Engine' },
  { id: 'BP-002', practice: 'UPI failover route validation before peak windows', domain: 'Operations', status: 'Adopted', owner: 'Payments SRE Manager', objective: 'Prevent transaction reversals during network instability.', reason: 'UPI switch packet loss incidents required predictable fallback.', relatedLessonIncident: 'INC-240602 primary path packet drop event.', impactedService: 'UPI Switch' },
  { id: 'BP-003', practice: 'Gateway timeout fallback activation policy', domain: 'Operations', status: 'Adopted', owner: 'Card Platform Ops Lead', objective: 'Stabilize authorization during partner latency spikes.', reason: 'Partner API variability caused transient customer failures.', relatedLessonIncident: 'Payment Gateway timeout burst in May peak cycle.', impactedService: 'Payment Gateway' },
  { id: 'BP-004', practice: 'Notification backlog auto-drain workflow', domain: 'Operations', status: 'Adopted', owner: 'Digital Messaging Ops', objective: 'Clear queue lag before SLA breach.', reason: 'Notification queue lag impacted customer communication timelines.', relatedLessonIncident: 'INC-240604 queue lag and delayed delivery.', impactedService: 'Notification Hub' },
  { id: 'BP-005', practice: 'Net banking session error bridge protocol', domain: 'Operations', status: 'Adopted', owner: 'Channel Reliability Manager', objective: 'Coordinate rapid containment of session outages.', reason: 'Session failure incidents spiked without clear command flow.', relatedLessonIncident: 'INC-240605 session pool saturation.', impactedService: 'Net Banking Portal' },
  { id: 'BP-006', practice: 'Operational war-room escalation trigger matrix', domain: 'Operations', status: 'Adopted', owner: 'Ops Command Center', objective: 'Standardize escalation thresholds across services.', reason: 'Escalation inconsistency prolonged P1 coordination.', relatedLessonIncident: 'Cross-service escalation delays across Fraud/UPI incidents.', impactedService: 'UPI Switch' },
  { id: 'BP-007', practice: '24x7 on-call runbook attestation cadence', domain: 'Operations', status: 'Pending', owner: 'Site Reliability Office', objective: 'Ensure runbook readiness for all critical services.', reason: 'Outdated runbooks increased dependency on individual experts.', relatedLessonIncident: 'Post-incident review from Fraud Engine mitigation.', impactedService: 'Fraud Engine' },
  { id: 'BP-008', practice: 'Peak-hour capacity pre-check gate', domain: 'Operations', status: 'Pending', owner: 'Capacity Engineering Lead', objective: 'Block high-risk deployments before saturation periods.', reason: 'Peak loads exacerbated existing hotspot services.', relatedLessonIncident: 'Capacity forecast breach for Fraud/UPI hotspots.', impactedService: 'UPI Switch' },

  { id: 'BP-009', practice: 'Fraud model artifact signature verification', domain: 'Security', status: 'Adopted', owner: 'Model Security Lead', objective: 'Prevent unverified model package rollout.', reason: 'Model refresh integrity gaps increase operational and compliance risk.', relatedLessonIncident: 'Fraud model refresh rollback requirement.', impactedService: 'Fraud Engine' },
  { id: 'BP-010', practice: 'UPI API token rotation hardening', domain: 'Security', status: 'Adopted', owner: 'Payments Security Architect', objective: 'Reduce credential exposure windows.', reason: 'Switch token lifecycle was too long for current threat posture.', relatedLessonIncident: 'Governance audit finding on secret lifetime.', impactedService: 'UPI Switch' },
  { id: 'BP-011', practice: 'Gateway dependency security exception registry', domain: 'Security', status: 'Adopted', owner: 'Third-Party Risk Manager', objective: 'Track and close partner-side control exceptions.', reason: 'External dependency risks must be visible for release decisions.', relatedLessonIncident: 'Gateway partner latency and exception handling review.', impactedService: 'Payment Gateway' },
  { id: 'BP-012', practice: 'Notification encryption posture baseline', domain: 'Security', status: 'Adopted', owner: 'Messaging Security Engineer', objective: 'Enforce transport/storage controls for outbound notifications.', reason: 'Messaging systems carry sensitive communication payloads.', relatedLessonIncident: 'Notification control review in governance cycle.', impactedService: 'Notification Hub' },
  { id: 'BP-013', practice: 'Net banking session anomaly signatures', domain: 'Security', status: 'Adopted', owner: 'Channel Security Lead', objective: 'Detect abnormal session behavior in real time.', reason: 'Session spikes can mask account abuse patterns.', relatedLessonIncident: 'Net Banking session instability and failed logins.', impactedService: 'Net Banking Portal' },
  { id: 'BP-014', practice: 'Service account least-privilege recertification', domain: 'Security', status: 'Adopted', owner: 'IAM Governance Office', objective: 'Limit privilege creep across critical services.', reason: 'Elevated access scope increased blast radius.', relatedLessonIncident: 'Governance control variance in quarterly audit.', impactedService: 'Fraud Engine' },
  { id: 'BP-015', practice: 'Runtime policy enforcement for AI scoring services', domain: 'Security', status: 'Pending', owner: 'AI Platform Security', objective: 'Enforce request-level policy checks before scoring.', reason: 'Runtime policy drift can bypass intended controls.', relatedLessonIncident: 'AI governance red-team recommendation.', impactedService: 'Fraud Engine' },

  { id: 'BP-016', practice: 'Critical path synthetic monitoring tests', domain: 'Testing', status: 'Adopted', owner: 'QE Lead - Channels', objective: 'Catch transaction path failures before customer impact.', reason: 'Production incident precursors were visible in synthetic patterns.', relatedLessonIncident: 'UPI reversal precursor identified in synthetic run.', impactedService: 'UPI Switch' },
  { id: 'BP-017', practice: 'Fraud scoring regression pack per model refresh', domain: 'Testing', status: 'Adopted', owner: 'QE Lead - Fraud', objective: 'Validate scoring latency and accuracy after updates.', reason: 'Model refresh caused runtime regressions in prior cycle.', relatedLessonIncident: 'INC-240601 mitigation postmortem action.', impactedService: 'Fraud Engine' },
  { id: 'BP-018', practice: 'Gateway partner chaos test scenarios', domain: 'Testing', status: 'Adopted', owner: 'QE Lead - Payments', objective: 'Simulate degraded partner behavior safely.', reason: 'Partner-induced latency remains primary uncertainty source.', relatedLessonIncident: 'Gateway timeout event during acquirer maintenance.', impactedService: 'Payment Gateway' },
  { id: 'BP-019', practice: 'Notification queue saturation soak tests', domain: 'Testing', status: 'Adopted', owner: 'QE Lead - Messaging', objective: 'Validate sustained throughput under burst traffic.', reason: 'Queue saturation incidents surfaced under burst conditions.', relatedLessonIncident: 'Notification backlog recovery review.', impactedService: 'Notification Hub' },
  { id: 'BP-020', practice: 'Net banking failover readiness test cadence', domain: 'Testing', status: 'Adopted', owner: 'QE Lead - Banking Channels', objective: 'Verify failover behavior during DB lag events.', reason: 'Replica lag affected user sessions during peak usage.', relatedLessonIncident: 'Net Banking incident recovery exercise.', impactedService: 'Net Banking Portal' },
  { id: 'BP-021', practice: 'Cross-service contract test baseline', domain: 'Testing', status: 'Pending', owner: 'Quality Engineering Office', objective: 'Reduce integration defects across service interfaces.', reason: 'Contract drift caused delayed detection in staging.', relatedLessonIncident: 'UPI + gateway dependency defect chain.', impactedService: 'Payment Gateway' },

  { id: 'BP-022', practice: 'Fraud Engine horizontal scaling standard', domain: 'Architecture', status: 'Adopted', owner: 'Platform Architect - Fraud', objective: 'Increase resiliency under scoring spikes.', reason: 'CPU and worker saturation remains top availability driver.', relatedLessonIncident: 'Capacity forecast showed breach trend for Fraud Engine.', impactedService: 'Fraud Engine' },
  { id: 'BP-023', practice: 'UPI Switch active-active routing blueprint', domain: 'Architecture', status: 'Adopted', owner: 'Payments Platform Architect', objective: 'Minimize single-path dependency risk.', reason: 'Network instability events need deterministic failover.', relatedLessonIncident: 'UPI packet loss incident and reroute mitigation.', impactedService: 'UPI Switch' },
  { id: 'BP-024', practice: 'Gateway dependency isolation pattern', domain: 'Architecture', status: 'Adopted', owner: 'Card Platform Architect', objective: 'Contain partner failures from core transaction flows.', reason: 'External acquirer outages must not cascade.', relatedLessonIncident: 'Gateway fallback route postmortem.', impactedService: 'Payment Gateway' },
  { id: 'BP-025', practice: 'Notification event queue partitioning baseline', domain: 'Architecture', status: 'Adopted', owner: 'Messaging Architect', objective: 'Prevent queue-level bottlenecks in burst windows.', reason: 'Single-queue hotspots increased lag variance.', relatedLessonIncident: 'Notification queue lag analysis.', impactedService: 'Notification Hub' },
  { id: 'BP-026', practice: 'Session-store replica health guardrails', domain: 'Architecture', status: 'Pending', owner: 'Channels Platform Architect', objective: 'Avoid session instability during replica lag.', reason: 'Replica lag remains a recurring risk for user sessions.', relatedLessonIncident: 'Net Banking session incident investigation.', impactedService: 'Net Banking Portal' },

  { id: 'BP-027', practice: 'AI control evidence automation policy', domain: 'AI Governance', status: 'Adopted', owner: 'AI Governance Lead', objective: 'Automate control evidence capture for audits.', reason: 'Manual evidence collection delays control closure.', relatedLessonIncident: 'Governance evidence backlog reduction initiative.', impactedService: 'Fraud Engine' },
  { id: 'BP-028', practice: 'Prompt governance remediation SLA', domain: 'AI Governance', status: 'Adopted', owner: 'Prompt Governance Manager', objective: 'Close prompt-risk findings within defined SLA.', reason: 'Unresolved prompt findings delayed rollout approvals.', relatedLessonIncident: 'Prompt-governance remediation deferral impact.', impactedService: 'Fraud Engine' },
  { id: 'BP-029', practice: 'Model risk-tier review cadence', domain: 'AI Governance', status: 'Adopted', owner: 'Model Risk Office', objective: 'Revalidate high-risk model controls regularly.', reason: 'Risk-tier changes impact operational controls and approvals.', relatedLessonIncident: 'High-risk use-case governance review.', impactedService: 'UPI Switch' },
  { id: 'BP-030', practice: 'UPI AI use-case compliance checklist', domain: 'AI Governance', status: 'Adopted', owner: 'Payments Governance Partner', objective: 'Ensure UPI AI changes meet policy guardrails.', reason: 'Payment rail sensitivity requires stricter compliance review.', relatedLessonIncident: 'UPI compliance evidence escalation.', impactedService: 'UPI Switch' },
  { id: 'BP-031', practice: 'Gateway AI decision traceability standard', domain: 'AI Governance', status: 'Adopted', owner: 'Card Governance Partner', objective: 'Maintain explainability for automated decisions.', reason: 'Decision traceability needed for dispute and audit workflows.', relatedLessonIncident: 'Card dispute copilot governance checks.', impactedService: 'Payment Gateway' },
  { id: 'BP-032', practice: 'Notification AI communication quality controls', domain: 'AI Governance', status: 'Adopted', owner: 'Channels Governance Partner', objective: 'Ensure outbound AI communication remains compliant and clear.', reason: 'Customer messaging quality impacts trust and complaint risk.', relatedLessonIncident: 'Notification quality review and policy update.', impactedService: 'Notification Hub' },
];

export const highRiskGaps: HighRiskGapRecord[] = [
  { id: 'GAP-01', service: 'Fraud Engine', missingPractice: '24x7 on-call runbook attestation cadence', riskReason: 'Runbook drift increases MTTR during scoring incidents.' },
  { id: 'GAP-02', service: 'UPI Switch', missingPractice: 'Peak-hour capacity pre-check gate', riskReason: 'Release windows can overlap with capacity saturation events.' },
  { id: 'GAP-03', service: 'Fraud Engine', missingPractice: 'Runtime policy enforcement for AI scoring services', riskReason: 'Policy bypass risk remains elevated for high-impact AI decisions.' },
  { id: 'GAP-04', service: 'Payment Gateway', missingPractice: 'Cross-service contract test baseline', riskReason: 'Integration drift may delay detection of transaction path defects.' },
  { id: 'GAP-05', service: 'Net Banking Portal', missingPractice: 'Session-store replica health guardrails', riskReason: 'Replica lag can trigger customer-visible session instability.' },
];

export const complianceCoverageByDomain = [
  { domain: 'Operations', covered: 20, total: 22 },
  { domain: 'Security', covered: 19, total: 21 },
  { domain: 'Testing', covered: 16, total: 18 },
  { domain: 'Architecture', covered: 15, total: 17 },
  { domain: 'AI Governance', covered: 21, total: 22 },
];

export const recommendedPractices = [
  {
    recommendation: 'Enable automated runbook attestation checks for Fraud Engine responders.',
    reason: 'Manual runbook drift is a primary contributor to delayed mitigation handoffs.',
    impactedService: 'Fraud Engine' as PracticeService,
    expectedBenefit: 'Reduce incident command transition time by 18-22%.',
  },
  {
    recommendation: 'Introduce pre-peak capacity gate for UPI Switch release windows.',
    reason: 'Forecast indicates repeated near-breach load during high-volume periods.',
    impactedService: 'UPI Switch' as PracticeService,
    expectedBenefit: 'Cut forecasted breach probability by ~30%.',
  },
  {
    recommendation: 'Operationalize contract test baseline before Payment Gateway partner changes.',
    reason: 'External dependency shifts are the largest source of silent integration drift.',
    impactedService: 'Payment Gateway' as PracticeService,
    expectedBenefit: 'Lower production defect leakage for partner changes by 15%.',
  },
];

export function getBestPracticesKpis() {
  const approvedBestPractices = bestPracticeLibrary.length; // 32
  const adoptedPractices = bestPracticeLibrary.filter((practice) => practice.status === 'Adopted').length; // 27
  const applicablePractices = approvedBestPractices; // 32
  const adoptionRate = Math.round((adoptedPractices / applicablePractices) * 100); // 84
  const highRiskGapsCount = highRiskGaps.length; // 5
  const coveredControls = complianceCoverageByDomain.reduce((sum, item) => sum + item.covered, 0); // 91
  const totalControls = complianceCoverageByDomain.reduce((sum, item) => sum + item.total, 0); // 100
  const complianceCoverage = Math.round((coveredControls / totalControls) * 100); // 91

  return {
    approvedBestPractices,
    adoptedPractices,
    applicablePractices,
    adoptionRate,
    highRiskGapsCount,
    coveredControls,
    totalControls,
    complianceCoverage,
  };
}

export const adoptionByDomain = complianceCoverageByDomain.map((item) => {
  const domainPractices = bestPracticeLibrary.filter((practice) => practice.domain === item.domain);
  const adopted = domainPractices.filter((practice) => practice.status === 'Adopted').length;
  return {
    domain: item.domain,
    adoptedRate: Math.round((adopted / domainPractices.length) * 100),
  };
});
