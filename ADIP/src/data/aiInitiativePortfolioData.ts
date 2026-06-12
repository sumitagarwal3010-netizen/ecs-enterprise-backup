export type InitiativeStatus = 'On Track' | 'Delayed' | 'Watchlist';

export interface AiInitiative {
  id: string;
  name: string;
  businessUnit: string;
  owner: string;
  objective: string;
  businessValue: string;
  progress: number;
  status: InitiativeStatus;
  confidence: number;
  milestonesCompleted: string[];
  upcomingMilestones: string[];
  kpis: string[];
  delayReason?: string;
  impact?: string;
  mitigation?: string;
  revisedTimeline?: string;
}

export const aiInitiatives: AiInitiative[] = [
  { id: 'AI-01', name: 'Retail Lending AI Underwriter', businessUnit: 'Retail Assets', owner: 'Head of Retail Lending', objective: 'Reduce underwriting TAT while maintaining credit policy adherence.', businessValue: 'Cuts approval cycle by 28% and improves sanction throughput.', progress: 81, status: 'On Track', confidence: 91, milestonesCompleted: ['Credit policy rule-engine integration', 'Pilot across salaried segment'], upcomingMilestones: ['Expand to self-employed segment', 'RBI model governance final signoff'], kpis: ['TAT down 24%', 'Manual overrides down 18%'] },
  { id: 'AI-02', name: 'UPI Fraud Early Warning', businessUnit: 'Payments', owner: 'Chief Risk Officer', objective: 'Detect mule-account and synthetic fraud patterns before authorization.', businessValue: 'Reduces fraud loss leakage on UPI peak windows.', progress: 76, status: 'On Track', confidence: 88, milestonesCompleted: ['Streaming feature store enabled', 'Real-time scoring in UPI switch'], upcomingMilestones: ['False-positive calibration wave 2', 'NPCI compliance review'], kpis: ['Fraud catch-rate +16%', 'False positives -9%'] },
  { id: 'AI-03', name: 'Card Dispute Resolution Copilot', businessUnit: 'Cards', owner: 'Head of Cards Ops', objective: 'Assist agents with evidence summarization and response drafting.', businessValue: 'Improves dispute closure productivity and customer communication quality.', progress: 68, status: 'Watchlist', confidence: 74, milestonesCompleted: ['Case summarization model deployed', 'Workflow integration in dispute desk'], upcomingMilestones: ['Chargeback recommendation engine', 'Quality benchmark signoff'], kpis: ['Agent effort -19%', 'FCR +8%'] },
  { id: 'AI-04', name: 'Corporate Cashflow Forecasting AI', businessUnit: 'Corporate Banking', owner: 'Head of Transaction Banking', objective: 'Forecast client cashflow volatility for treasury advisory.', businessValue: 'Improves wallet share through proactive treasury recommendations.', progress: 63, status: 'On Track', confidence: 84, milestonesCompleted: ['Top-50 client baseline model', 'Treasury dashboard integration'], upcomingMilestones: ['Expand to top-200 clients', 'Backtesting governance signoff'], kpis: ['Forecast error down 14%', 'Advisory conversion +11%'] },
  { id: 'AI-05', name: 'AML Alert Prioritization Engine', businessUnit: 'Compliance', owner: 'Chief Compliance Officer', objective: 'Prioritize AML alerts by financial and regulatory risk.', businessValue: 'Reduces analyst queue load and improves STR timeliness.', progress: 72, status: 'On Track', confidence: 89, milestonesCompleted: ['Risk scoring model in AML console', 'Analyst triage workflow automation'], upcomingMilestones: ['Cross-border transaction enrichment', 'Audit trail hardening'], kpis: ['Alert handling time -22%', 'STR timeliness +13%'] },
  { id: 'AI-06', name: 'Branch Service Assistant', businessUnit: 'Branch Banking', owner: 'Head of Branch Network', objective: 'Support branch staff with customer intent and next-best-action prompts.', businessValue: 'Improves service consistency and branch productivity.', progress: 59, status: 'Delayed', confidence: 66, milestonesCompleted: ['Pilot in 40 branches', 'Knowledge base alignment'], upcomingMilestones: ['Rollout to 120 branches', 'Regional language extension'], kpis: ['Queue time -12%', 'Cross-sell +6%'], delayReason: 'Branch device refresh and network readiness lag in two circles.', impact: 'Rollout pace reduced; service uplift benefits deferred by one quarter.', mitigation: 'Phased rollout with upgraded branch clusters first and offline fallback mode.', revisedTimeline: 'Moved from Q2 close to mid-Q3' },
  { id: 'AI-07', name: 'Collections Next Best Action AI', businessUnit: 'Collections', owner: 'Head of Recoveries', objective: 'Recommend account-level recovery strategy and channel.', businessValue: 'Improves recovery yield and reduces agent trial-and-error.', progress: 66, status: 'On Track', confidence: 83, milestonesCompleted: ['Behavioral segmentation model live', 'Dialer prioritization integration'], upcomingMilestones: ['Field-collection route optimization', 'Legal handoff policy tuning'], kpis: ['Recovery rate +9%', 'Right-party contact +12%'] },
  { id: 'AI-08', name: 'Treasury Liquidity Signal Model', businessUnit: 'Treasury', owner: 'Treasurer', objective: 'Predict intraday liquidity stress events for funding decisions.', businessValue: 'Reduces liquidity buffers while keeping prudential safeguards.', progress: 54, status: 'Delayed', confidence: 64, milestonesCompleted: ['Signal pipeline from RTGS/NEFT events', 'Treasury cockpit prototype'], upcomingMilestones: ['Intraday stress backtesting', 'ALCO approval'], kpis: ['Idle liquidity -7%', 'Forecast confidence +10%'], delayReason: 'Historical treasury data normalization took longer than expected.', impact: 'ALCO production signoff postponed, delaying balance-sheet optimization.', mitigation: 'Dedicated data quality sprint with treasury ops and data platform teams.', revisedTimeline: 'Shifted from Jul to Sep release window' },
  { id: 'AI-09', name: 'SME Credit Monitoring Copilot', businessUnit: 'SME Lending', owner: 'Head of SME Risk', objective: 'Detect early stress indicators in SME portfolios.', businessValue: 'Improves proactive intervention and lowers delinquency drift.', progress: 62, status: 'On Track', confidence: 82, milestonesCompleted: ['Bureau + internal signal fusion', 'Relationship manager dashboard'], upcomingMilestones: ['Portfolio-wide stress score rollout', 'Risk policy calibration'], kpis: ['Early-warning precision +15%', 'Delinquency drift -5%'] },
  { id: 'AI-10', name: 'Customer Service Voice Assist QA', businessUnit: 'Contact Center', owner: 'Head of Service Excellence', objective: 'Auto-evaluate agent-customer calls for quality and compliance.', businessValue: 'Raises QA coverage and reduces manual sampling bias.', progress: 71, status: 'On Track', confidence: 87, milestonesCompleted: ['Speech analytics pipeline setup', 'Compliance script checks automated'], upcomingMilestones: ['Coach recommendations release', 'Multi-lingual QA pack'], kpis: ['QA coverage 3x', 'Compliance misses -21%'] },
  { id: 'AI-11', name: 'Merchant Churn Prediction', businessUnit: 'Merchant Acquiring', owner: 'Head of Merchant Business', objective: 'Predict merchant churn and trigger retention actions.', businessValue: 'Protects acquiring revenue and improves retention campaign ROI.', progress: 64, status: 'On Track', confidence: 81, milestonesCompleted: ['Churn model v1 deployed', 'Campaign trigger integration'], upcomingMilestones: ['Retention offer optimization', 'Partner performance calibration'], kpis: ['Churn reduced 4.2%', 'Retention ROI +14%'] },
  { id: 'AI-12', name: 'Enterprise Knowledge Risk Assistant', businessUnit: 'Operations Risk', owner: 'Chief Operating Officer', objective: 'Assist control teams with policy lookup and risk guidance.', businessValue: 'Speeds control decisions and reduces inconsistent interpretations.', progress: 57, status: 'Delayed', confidence: 67, milestonesCompleted: ['Policy indexing complete', 'RAG baseline in operations portal'], upcomingMilestones: ['Controlled pilot in ops risk desk', 'Governance red-team clearance'], kpis: ['Policy lookup time -31%', 'Control query closure +18%'], delayReason: 'Prompt-governance remediation required before enterprise rollout.', impact: 'Control teams continue manual policy lookup, slowing risk response.', mitigation: 'Complete governance remediation and staged rollout by control domain.', revisedTimeline: 'Deferred from Aug to Oct go-live' },
];

export const adoptionBreakdown = {
  teamsEnabled: { adopted: 17, total: 23 },
  activeUsers: { adopted: 1240, total: 1680 },
  workflowsOperationalized: { adopted: 31, total: 42 },
  sdlcPhasesEmbedded: { adopted: 5, total: 7 },
  monthlyActiveUsage: { adopted: 76, total: 100 },
};

export const adoptionWeights = {
  teamsEnabled: 0.2,
  activeUsers: 0.25,
  workflowsOperationalized: 0.25,
  sdlcPhasesEmbedded: 0.15,
  monthlyActiveUsage: 0.15,
};

export function calculateAiAdoptionScore(): number {
  const teams = adoptionBreakdown.teamsEnabled.adopted / adoptionBreakdown.teamsEnabled.total;
  const users = adoptionBreakdown.activeUsers.adopted / adoptionBreakdown.activeUsers.total;
  const workflows = adoptionBreakdown.workflowsOperationalized.adopted / adoptionBreakdown.workflowsOperationalized.total;
  const sdlc = adoptionBreakdown.sdlcPhasesEmbedded.adopted / adoptionBreakdown.sdlcPhasesEmbedded.total;
  const usage = adoptionBreakdown.monthlyActiveUsage.adopted / adoptionBreakdown.monthlyActiveUsage.total;
  const weighted =
    teams * adoptionWeights.teamsEnabled +
    users * adoptionWeights.activeUsers +
    workflows * adoptionWeights.workflowsOperationalized +
    sdlc * adoptionWeights.sdlcPhasesEmbedded +
    usage * adoptionWeights.monthlyActiveUsage;
  return Math.round(weighted * 100);
}

export function getAiProgramStatusKpis() {
  const onTrackPrograms = aiInitiatives.filter((item) => item.status === 'On Track').length;
  const delayedPrograms = aiInitiatives.filter((item) => item.status === 'Delayed').length;
  const otherStatuses = aiInitiatives.length - onTrackPrograms - delayedPrograms;
  return {
    activePrograms: aiInitiatives.length,
    onTrackPrograms,
    delayedPrograms,
    otherStatuses,
    aiAdoption: calculateAiAdoptionScore(),
  };
}

export function getAiProgramStatusBreakdown() {
  const breakdown = aiInitiatives.reduce<Record<string, number>>((acc, initiative) => {
    acc[initiative.status] = (acc[initiative.status] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(breakdown)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

export const aiProgramTrend = [
  { month: 'Jan', planned: 56, actual: 49 },
  { month: 'Feb', planned: 59, actual: 53 },
  { month: 'Mar', planned: 62, actual: 57 },
  { month: 'Apr', planned: 66, actual: 61 },
  { month: 'May', planned: 69, actual: 66 },
  { month: 'Jun', planned: 72, actual: 70 },
];

export const activeProgramsTrend = [
  { day: 'Jan', value: 9 },
  { day: 'Feb', value: 10 },
  { day: 'Mar', value: 10 },
  { day: 'Apr', value: 11 },
  { day: 'May', value: 12 },
  { day: 'Jun', value: 12 },
];

export const onTrackProgramsTrend = [
  { day: 'Jan', value: 5 },
  { day: 'Feb', value: 6 },
  { day: 'Mar', value: 6 },
  { day: 'Apr', value: 7 },
  { day: 'May', value: 8 },
  { day: 'Jun', value: 8 },
];

export const delayedProgramsTrend = [
  { day: 'Jan', value: 4 },
  { day: 'Feb', value: 4 },
  { day: 'Mar', value: 4 },
  { day: 'Apr', value: 3 },
  { day: 'May', value: 3 },
  { day: 'Jun', value: 3 },
];

export const adoptionTrend = [
  { day: 'Jan', value: 61 },
  { day: 'Feb', value: 64 },
  { day: 'Mar', value: 67 },
  { day: 'Apr', value: 70 },
  { day: 'May', value: 72 },
  { day: 'Jun', value: 74 },
];
