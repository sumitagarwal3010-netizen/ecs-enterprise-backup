import { sparkline7d } from './mockDataEngine.js';
import {
  atRiskProjects,
  atRiskTrend,
  calculatePortfolioHealthScore,
  criticalEscalations,
  escalationTrend,
  onTrackProjects,
  onTrackTrend,
  portfolioHealthBreakdown,
  portfolioHealthTrend,
} from '../data/portfolioHealthDrilldownData.ts';
import {
  activeProgramsTrend,
  adoptionBreakdown,
  adoptionTrend,
  aiInitiatives,
  delayedProgramsTrend,
  getAiProgramStatusBreakdown,
  getAiProgramStatusKpis,
  onTrackProgramsTrend,
} from '../data/aiInitiativePortfolioData.ts';
import {
  calculateResidualRiskScore,
  highRiskItems,
  mitigationPlansDue,
  operationalRiskRegister,
  riskTrends,
} from '../data/operationalRiskHeatRegisterData.ts';
import {
  getIncidentOperationsKpis,
  getOpenIncidents,
  incidentOperationsData,
  incidentTrend7d,
  mttrTrend7d,
} from '../data/incidentOperationsData.ts';
import {
  availabilityTrend30d,
  getAvailabilityKpis,
  serviceAvailabilityData,
  serviceDependencyImpact,
  slaComplianceTracker,
} from '../data/availabilityOperationsData.ts';
import {
  capacityForecastTrend,
  capacityServiceData,
  forecastedBreaches,
  getCapacityKpis,
} from '../data/capacityOperationsData.ts';
import {
  getLearningKpis,
  lessonsCaptured,
  reusableAssetsCreated,
  similarChanges,
  techDebtBreakdown,
} from '../data/learningHubData.ts';
import {
  adoptionByDomain,
  bestPracticeLibrary,
  complianceCoverageByDomain,
  getBestPracticesKpis,
  highRiskGaps,
} from '../data/bestPracticesData.ts';
import {
  activeConsumerTeams,
  getReusableAssetsKpis,
  reusableDeliveryAssets,
  topReusedAssets,
} from '../data/reusableDeliveryAssetsData.ts';
import {
  getLessonsManagementKpis,
  implementationTracker,
  learningAdoptionTeams,
  lessonsRepository,
  recurrenceTrend,
  remainingProblemAreas,
} from '../data/lessonsManagementData.ts';

/** @typedef {import('../types/kpiDrilldown').KpiDrilldownPayload} KpiDrilldownPayload */
/** @typedef {import('../types/kpiDrilldown').KpiDrilldownContext} KpiDrilldownContext */
/** @typedef {import('../types/simulation').SimulationState} SimulationState */

/**
 * @param {SimulationState} state
 * @returns {{ name: string; status?: string }[]}
 */
function appsFromArchitecture(state) {
  return state.architecture.services.map((s) => ({
    name: s.label,
    status: s.risk,
  }));
}

/**
 * @param {SimulationState} state
 * @returns {{ id: string; title: string; severity: string; domain?: string }[]}
 */
function incidentsFromState(state) {
  return state.production.openIncidents.map((i) => ({
    id: i.id,
    title: i.title,
    severity: i.severity,
    domain: i.domain,
  }));
}

/**
 * @param {SimulationState} state
 * @returns {{ id: string; name: string; confidence: number; risk: string }[]}
 */
function releasesFromState(state) {
  return state.release.releases.map((r) => ({
    id: r.id,
    name: r.name,
    confidence: r.confidence,
    risk: r.risk,
  }));
}

/**
 * @param {SimulationState} state
 * @returns {import('../data/aiUseCaseRegistryMock').AIUseCase[]}
 */
function useCasesFromState(state) {
  return state.aiGovernance?.useCases ?? [];
}

/**
 * @param {SimulationState} state
 * @param {import('../data/aiUseCaseRegistryMock').AIUseCase} uc
 * @param {KpiDrilldownContext} ctx
 * @returns {KpiDrilldownPayload}
 */
function buildUseCaseDrilldown(state, uc, ctx) {
  return buildPayload(ctx, {
    sourceRecords: uc.reviewHistory.map((r, i) => ({
      id: `REV-${i + 1}`,
      title: r.outcome,
      detail: r.reviewer,
      meta: r.date,
    })),
    supportingEvidence: [
      uc.description,
      `Model: ${uc.modelName} · Owner: ${uc.owner}`,
      `Compliance: ${uc.complianceFramework}`,
      `Data classification: ${uc.dataClassification}`,
      ...uc.controls,
    ],
    relatedApplications: appsFromArchitecture(state).filter((a) =>
      uc.domain === 'Payments' ? a.name.includes('UPI') || a.name.includes('Payment') || a.name.includes('Fraud')
        : uc.domain === 'Mobile Banking' ? a.name.includes('Mobile') || a.name.includes('Auth')
          : true,
    ).slice(0, 4),
    relatedIncidents: incidentsFromState(state).filter((i) =>
      uc.riskTier === 'high' || i.domain === uc.domain,
    ).slice(0, 3),
    relatedReleases: releasesFromState(state).filter((r) => r.domain === uc.domain).slice(0, 3),
    historicalTrend: sparkline7d(uc.riskTier === 'high' ? 72 : uc.riskTier === 'medium' ? 85 : 94),
  });
}

/**
 * @param {KpiDrilldownContext} ctx
 * @param {Partial<KpiDrilldownPayload>} overrides
 * @returns {KpiDrilldownPayload}
 */
function buildPayload(ctx, overrides = {}) {
  return {
    label: ctx.label,
    value: ctx.value,
    suffix: ctx.suffix,
    sourceRecords: [],
    supportingEvidence: [],
    relatedApplications: [],
    relatedIncidents: [],
    relatedReleases: [],
    historicalTrend: ctx.data?.length ? ctx.data : sparkline7d(90),
    ...overrides,
  };
}

/**
 * @param {SimulationState} state
 */
function buildActiveChangeRecords(state) {
  const requirementChanges = state.delivery.topRequirements.map((req) => ({
    id: `CHG-${req.id}`,
    title: req.title,
    detail: `Type: Requirement · Application: ${req.domain} · Owner: Product Management`,
    meta: `Status: In Progress · Risk: ${req.risk}`,
  }));
  const releaseChanges = state.release.riskMatrix.map((risk, idx) => ({
    id: `CHG-REL-${idx + 1}`,
    title: risk.title,
    detail: `Type: Release Readiness · Application: ${risk.domain} · Owner: Release Control Office`,
    meta: `Status: Active · Risk: ${risk.severity}`,
  }));
  const engineeringChanges = state.development.securityItems.map((item, idx) => ({
    id: `CHG-ENG-${idx + 1}`,
    title: item.title,
    detail: 'Type: Engineering Remediation · Application: Shared Platform · Owner: Engineering Security',
    meta: `Status: In Progress · Risk: ${item.severity}`,
  }));
  const testingChanges = state.testing.aiRecommendations.map((rec, idx) => ({
    id: `CHG-TST-${idx + 1}`,
    title: rec,
    detail: 'Type: Test Optimization · Application: Quality Engineering · Owner: QA Excellence',
    meta: 'Status: Planned · Risk: medium',
  }));
  const governanceChanges = state.governance.topFindings.slice(0, 4).map((finding, idx) => ({
    id: `CHG-GOV-${idx + 1}`,
    title: finding.title,
    detail: 'Type: Governance Action · Application: Enterprise Controls · Owner: Governance Office',
    meta: `Status: Open · Risk: ${finding.severity}`,
  }));
  return [...requirementChanges, ...releaseChanges, ...engineeringChanges, ...testingChanges, ...governanceChanges];
}

/** @type {Record<string, (state: SimulationState, ctx: KpiDrilldownContext) => KpiDrilldownPayload>} */
const resolvers = {
  'Delivery Health': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Delivery Health Trend',
      customTrendExplanation: 'Delivery Health is derived from requirements quality, engineering quality, test effectiveness, release confidence, and change stability.',
      customSections: [
        {
          title: 'Score Calculation',
          bullets: [
            `Delivery Health (${ctx.value}%) = 20% Requirements Quality (${state.requirements.qualityScore}%) + 25% Development Code Quality (${state.development.codeQuality}%) + 20% Testing Effectiveness (${state.testing.effectiveness}%) + 20% Release Confidence (${state.release.confidence}%) + 15% Change Stability (${Math.round(100 - state.delivery.changeFailureRate * 8)}%).`,
            `Lead Time ${state.delivery.leadTimeHours}h and Change Failure Rate ${state.delivery.changeFailureRate}% are primary drag factors.`,
          ],
        },
        {
          title: 'Contributing Signals',
          records: state.delivery.pipelineVelocity.map((stage) => ({
            id: stage.stage.slice(0, 3).toUpperCase(),
            title: `${stage.stage} Throughput`,
            detail: `${stage.count} items · ${stage.avgDays} days average`,
            meta: stage.stage === 'Release' ? `${state.release.confidence}% release confidence` : `${state.testing.effectiveness}% test effectiveness`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: ctx.data ?? state.executive.kpis.find((k) => k.label === 'Delivery Health')?.data ?? sparkline7d(Number(ctx.value) || 94),
    }),

  'Production Health': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Production Health Trend',
      customTrendExplanation: 'Production Health is driven by service uptime, open-incident load, critical incident count, and MTTR performance.',
      customSections: [
        {
          title: 'Score Calculation',
          bullets: [
            `Production Health (${ctx.value}%) is derived from Availability (${state.production.availability}%), MTTR (${state.production.mttrMinutes}m), Open Incidents (${state.production.openIncidents.length}), and Critical Incident load.`,
            `Current profile: ${state.production.serviceHealth.filter((s) => s.status !== 'healthy').length} degraded/critical services and ${state.production.slaBreaches} SLA breach(es).`,
          ],
        },
        {
          title: 'Service Contributors',
          records: state.production.serviceHealth.map((svc) => ({
            id: svc.name.slice(0, 4).toUpperCase(),
            title: svc.name,
            detail: `Uptime ${svc.uptime}%`,
            meta: svc.status,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: state.executive.kpis.find((k) => k.label === 'Production Health')?.data ?? state.production.incidentTrend.map((p) => ({ day: p.day, value: Math.max(70, 96 - p.count * 4) })),
    }),

  'Governance Health': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Governance Health Trend',
      customTrendExplanation: 'Governance Health is calculated from policy compliance, baseline compliance, finding severity mix, and open strategic high-risk controls.',
      customSections: [
        {
          title: 'Score Calculation',
          bullets: [
            `Governance Health (${ctx.value}%) = 35% Policy Compliance (${state.governance.policyCompliance}%) + 25% Baseline Compliance (${state.governance.baselineCompliance}%) + 20% Control Standards Average (${Math.round(state.governance.complianceStandards.reduce((sum, s) => sum + s.score, 0) / state.governance.complianceStandards.length)}%) + 20% Finding Severity Penalty.`,
            `Critical findings: ${state.governance.findingSeverity.find((f) => f.name === 'Critical')?.value ?? 0}, High findings: ${state.governance.findingSeverity.find((f) => f.name === 'High')?.value ?? 0}.`,
          ],
        },
        {
          title: 'Control and Audit Contributors',
          records: state.governance.complianceStandards.map((standard) => ({
            id: standard.name.slice(0, 4).toUpperCase(),
            title: standard.name,
            detail: `Score ${standard.score}%`,
            meta: `Policy compliance baseline ${state.governance.policyCompliance}%`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: ctx.data ?? state.executive.kpis.find((k) => k.label === 'Governance Health')?.data ?? sparkline7d(state.governance.governanceScore),
    }),

  'Engineering Health': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Engineering Health Trend',
      customTrendExplanation: 'Engineering Health is computed from code quality, technical debt, security findings, PR aging, and defect escape profile.',
      customSections: [
        {
          title: 'Score Calculation',
          bullets: [
            `Engineering Health (${ctx.value}%) reflects Code Quality (${state.development.codeQuality}%), Tech Debt (${state.development.techDebt}), Security Findings (${state.development.securityFindings}), and Escaped Defect pressure.`,
            `PR aging distribution: ${state.development.prAging.map((p) => `${p.range}=${p.count}`).join(', ')}.`,
          ],
        },
        {
          title: 'Security and Debt Contributors',
          records: state.development.securityItems.map((item, idx) => ({
            id: `ENG-${idx + 1}`,
            title: item.title,
            detail: `Severity ${item.severity}`,
            meta: `Tech debt ${state.development.techDebt} · Code quality ${state.development.codeQuality}%`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: state.executive.kpis.find((k) => k.label === 'Engineering Health')?.data ?? state.development.qualityTrend.map((p) => ({ day: p.month, value: p.quality })),
    }),

  'Open Risks': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Open Risks Trend',
      customTrendExplanation: 'Open Risks is sourced directly from Strategic Risks inventory and includes all active enterprise operational risks.',
      customSections: [
        {
          title: `Strategic Risk Inventory (${operationalRiskRegister.length})`,
          records: operationalRiskRegister.map((risk) => ({
            id: risk.id,
            title: risk.title,
            detail: `${risk.domain} · Owner: ${risk.owner} · Severity: ${risk.severity}`,
            meta: `Residual ${risk.residualRiskScore}% · Due ${risk.dueDate}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: riskTrends.enterpriseRisks,
    }),

  'Open Incidents': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Open Incidents Trend',
      customTrendExplanation: 'Open incidents are sourced from the shared incident operations dataset used by both Production and Incident Management views.',
      customSections: [
        {
          title: `Open Incident Queue (${getIncidentOperationsKpis().openIncidents})`,
          records: getOpenIncidents().map((inc) => ({
            id: inc.id,
            title: inc.service,
            detail: `${inc.severity.toUpperCase()} · ${inc.status} · Owner: ${inc.owner}`,
            meta: `Escalation: ${inc.escalationStatus}`,
          })),
        },
        {
          title: 'Severity Breakdown',
          bullets: [
            `Critical: ${getOpenIncidents().filter((inc) => inc.severity === 'critical').length}`,
            `High: ${getOpenIncidents().filter((inc) => inc.severity === 'high').length}`,
            `Medium: ${getOpenIncidents().filter((inc) => inc.severity === 'medium').length}`,
            `Low: ${getOpenIncidents().filter((inc) => inc.severity === 'low').length}`,
            `Owners: ${Array.from(new Set(getOpenIncidents().map((inc) => inc.owner))).join(', ')}`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: incidentTrend7d,
    }),

  'Critical Incidents': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Critical Incident Trend',
      customTrendExplanation: 'Critical incidents represent P1 operations events requiring escalation and active mitigation tracking.',
      customSections: [
        {
          title: `Critical Incident Detail (${getIncidentOperationsKpis().criticalIncidents})`,
          records: getOpenIncidents()
            .filter((inc) => inc.severity === 'critical')
            .map((inc) => ({
              id: inc.id,
              title: inc.service,
              detail: `Impact: ${inc.impact}`,
              meta: `Escalation: ${inc.escalationStatus} · Mitigation: ${inc.mitigationProgress}%`,
            })),
        },
        {
          title: 'Impacted Services',
          bullets: getOpenIncidents()
            .filter((inc) => inc.severity === 'critical')
            .map((inc) => `${inc.service} · ${inc.status} · Owner ${inc.owner}`),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: incidentTrend7d.map((point) => ({
        day: point.day,
        value: point.day === 'Mon' || point.day === 'Tue' ? 2 : 1,
      })),
    }),

  'Escalated Incidents': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Escalated Incidents Trend',
      customTrendExplanation: 'Escalated incidents are active incidents currently under L3 or war-room governance.',
      customSections: [
        {
          title: `Escalation Queue (${getIncidentOperationsKpis().escalatedIncidents})`,
          records: getOpenIncidents()
            .filter((inc) => inc.escalated)
            .map((inc) => ({
              id: inc.id,
              title: inc.service,
              detail: `Owner: ${inc.owner} · Status: ${inc.status}`,
              meta: `${inc.escalationStatus} · Mitigation ${inc.mitigationProgress}%`,
            })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'Mon', value: 4 },
        { day: 'Tue', value: 4 },
        { day: 'Wed', value: 3 },
        { day: 'Thu', value: 3 },
        { day: 'Fri', value: 3 },
        { day: 'Sat', value: 3 },
        { day: 'Sun', value: getIncidentOperationsKpis().escalatedIncidents },
      ],
    }),

  'Overall Availability': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Overall Availability Trend (30-day)',
      customTrendExplanation: `Overall Availability (${getAvailabilityKpis().overallAvailability}%) is calculated as the average uptime across shared banking services in the availability table.`,
      customSections: [
        {
          title: 'Contributing Services',
          records: serviceAvailabilityData.map((service) => ({
            id: service.service.slice(0, 3).toUpperCase(),
            title: service.service,
            detail: `Uptime ${service.uptime.toFixed(2)}% vs SLA ${service.slaTarget.toFixed(1)}%`,
            meta: `Status: ${service.status}`,
          })),
        },
        {
          title: 'Highest and Lowest Uptime',
          bullets: [
            `Highest: ${[...serviceAvailabilityData].sort((a, b) => b.uptime - a.uptime)[0].service} (${[...serviceAvailabilityData].sort((a, b) => b.uptime - a.uptime)[0].uptime.toFixed(2)}%)`,
            `Lowest: ${[...serviceAvailabilityData].sort((a, b) => a.uptime - b.uptime)[0].service} (${[...serviceAvailabilityData].sort((a, b) => a.uptime - b.uptime)[0].uptime.toFixed(2)}%)`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: availabilityTrend30d.map((point) => ({
        day: point.day,
        value: Number((((point.upiSwitch + point.paymentGateway + point.fraudEngine + point.netBankingPortal) / 4).toFixed(2))),
      })),
    }),

  'SLA Compliance': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'SLA Compliance Trend',
      customTrendExplanation: `SLA Compliance (${getAvailabilityKpis().slaCompliance}%) is the average monthly compliance score across all tracked services.`,
      customSections: [
        {
          title: 'Services Meeting and Breaching SLA',
          bullets: [
            `Meeting SLA target: ${serviceAvailabilityData.filter((service) => service.uptime >= service.slaTarget).map((service) => service.service).join(', ')}`,
            `Breaching SLA target: ${serviceAvailabilityData.filter((service) => service.uptime < service.slaTarget).map((service) => service.service).join(', ')}`,
          ],
        },
        {
          title: 'Recent Breach History',
          records: slaComplianceTracker.map((service) => ({
            id: service.service.slice(0, 3).toUpperCase(),
            title: service.service,
            detail: `Compliance ${service.compliance.toFixed(1)}%`,
            meta: `${service.breaches} recent breach${service.breaches > 1 ? 'es' : ''}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 99.4 },
        { day: 'W2', value: 99.3 },
        { day: 'W3', value: 99.2 },
        { day: 'W4', value: getAvailabilityKpis().slaCompliance },
      ],
    }),

  'Services Below SLA': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Services Below SLA Trend',
      customTrendExplanation: `Services Below SLA (${getAvailabilityKpis().servicesBelowSla}) counts services where current uptime is below target SLA.`,
      customSections: [
        {
          title: 'Services Causing Below-SLA Count',
          records: serviceAvailabilityData
            .filter((service) => service.uptime < service.slaTarget)
            .map((service) => ({
              id: service.service.slice(0, 3).toUpperCase(),
              title: service.service,
              detail: `Current uptime ${service.uptime.toFixed(2)}% vs target ${service.slaTarget.toFixed(1)}%`,
              meta: `Gap ${(service.slaTarget - service.uptime).toFixed(2)}%`,
            })),
        },
        {
          title: 'Impact Summary',
          bullets: serviceDependencyImpact
            .filter((item) => serviceAvailabilityData.some((service) => service.service === item.service && service.uptime < service.slaTarget))
            .map((item) => `${item.service}: ${item.impact}`),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 3 },
        { day: 'W2', value: 3 },
        { day: 'W3', value: 2 },
        { day: 'W4', value: getAvailabilityKpis().servicesBelowSla },
      ],
    }),

  'Degraded Services': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Degraded Services Trend',
      customTrendExplanation: `Degraded Services (${getAvailabilityKpis().degradedServices}) includes services marked Degraded or At Risk in current reliability posture.`,
      customSections: [
        {
          title: 'Service Health and Incident Link',
          records: serviceAvailabilityData
            .filter((service) => service.status !== 'Healthy')
            .map((service) => {
              const relatedIncidents = incidentOperationsData.filter((incident) => incident.service === service.service && incident.status !== 'Resolved');
              return {
                id: service.service.slice(0, 3).toUpperCase(),
                title: service.service,
                detail: `Health: ${service.status} · Uptime ${service.uptime.toFixed(2)}%`,
                meta: relatedIncidents.length
                  ? `Related incidents: ${relatedIncidents.map((incident) => incident.id).join(', ')}`
                  : 'No active incident',
              };
            }),
        },
        {
          title: 'Operational Impact',
          bullets: serviceDependencyImpact
            .filter((item) => serviceAvailabilityData.some((service) => service.service === item.service && service.status !== 'Healthy'))
            .map((item) => `${item.service}: ${item.impact}`),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 4 },
        { day: 'W2', value: 4 },
        { day: 'W3', value: 4 },
        { day: 'W4', value: getAvailabilityKpis().degradedServices },
      ],
    }),

  'Capacity Utilization': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Capacity Utilization Trend',
      customTrendExplanation: 'Capacity Utilization (88%) is the weighted utilization rollup across hotspot services with peak-window concurrency uplift.',
      customSections: [
        {
          title: `Contributing Services (${getCapacityKpis().capacityUtilization}%)`,
          records: capacityServiceData.map((service) => ({
            id: service.service.slice(0, 3).toUpperCase(),
            title: service.service,
            detail: `Utilization ${service.utilization}% · Traffic share ${(service.trafficShare * 100).toFixed(0)}%`,
            meta: `Contribution ${(service.utilization * service.trafficShare).toFixed(2)} points`,
          })),
        },
        {
          title: 'Calculation',
          bullets: [
            `Weighted base = ${capacityServiceData.map((service) => `${service.utilization}*${(service.trafficShare * 100).toFixed(0)}%`).join(' + ')} = 86.23%.`,
            'Peak-window concurrency uplift = +1.8 points.',
            `Capacity Utilization = 86.20 + 1.80 = ${getCapacityKpis().capacityUtilization}%.`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: capacityForecastTrend.map((point) => ({
        day: point.month,
        value: Number((((point.fraudEngine * 0.37) + (point.upiSwitch * 0.34) + (point.paymentGateway * 0.23) + (point.notificationHub * 0.06) + 1.8).toFixed(2))),
      })),
    }),

  'Services Near Capacity': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Near-Capacity Services Trend',
      customTrendExplanation: 'Services Near Capacity (3) counts services at or above the 80% operational threshold.',
      customSections: [
        {
          title: `Near-Capacity Services (${getCapacityKpis().servicesNearCapacity})`,
          records: capacityServiceData
            .filter((service) => service.utilization >= service.threshold)
            .map((service) => ({
              id: service.service.slice(0, 3).toUpperCase(),
              title: service.service,
              detail: `Current utilization ${service.utilization}% · Threshold ${service.threshold}%`,
              meta: service.service === 'Fraud Engine'
                ? 'Primary risk driver'
                : service.service === 'UPI Switch'
                  ? 'Secondary risk driver'
                  : 'Warning tier utilization',
            })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 2 },
        { day: 'W2', value: 3 },
        { day: 'W3', value: 3 },
        { day: 'W4', value: getCapacityKpis().servicesNearCapacity },
      ],
    }),

  'Forecasted Capacity Breaches': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Forecasted Breaches Trend',
      customTrendExplanation: 'Forecasted Capacity Breaches (2) counts services projected to cross the 90% breach threshold.',
      customSections: [
        {
          title: `Forecasted Breach Services (${getCapacityKpis().forecastedBreaches})`,
          records: forecastedBreaches.map((item) => ({
            id: item.service.slice(0, 3).toUpperCase(),
            title: item.service,
            detail: `Current ${item.current}% -> Forecast ${item.forecast}%`,
            meta: `Breach threshold ${item.breachThreshold}%`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 1 },
        { day: 'W2', value: 1 },
        { day: 'W3', value: 2 },
        { day: 'W4', value: getCapacityKpis().forecastedBreaches },
      ],
    }),

  'Peak Load Headroom': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Peak Load Headroom Trend',
      customTrendExplanation: 'Peak Load Headroom (12%) is the remaining capacity after current aggregate capacity utilization.',
      customSections: [
        {
          title: `Headroom Calculation (${getCapacityKpis().peakLoadHeadroom}%)`,
          bullets: [
            `Max capacity envelope: 100%.`,
            `Current capacity utilization: ${getCapacityKpis().capacityUtilization}%.`,
            `Peak Load Headroom = 100 - ${getCapacityKpis().capacityUtilization} = ${getCapacityKpis().peakLoadHeadroom}%.`,
          ],
        },
        {
          title: 'Contributing Services',
          records: capacityServiceData.map((service) => ({
            id: service.service.slice(0, 3).toUpperCase(),
            title: service.service,
            detail: `Utilization ${service.utilization}%`,
            meta: `Headroom ${100 - service.utilization}%`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 14 },
        { day: 'W2', value: 13 },
        { day: 'W3', value: 12 },
        { day: 'W4', value: getCapacityKpis().peakLoadHeadroom },
      ],
    }),

  'Business Impact': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Business Impact Trend',
      customTrendExplanation: 'Business Impact score rolls up customer experience, payments/revenue, regulatory compliance, and settlement SLA impact areas.',
      customSections: [
        {
          title: 'Business Impact Calculation',
          bullets: [
            `Business Impact (${ctx.value}%) = weighted average of Customer Experience, Revenue/UPI Volume, Regulatory Compliance, and Settlement SLA.`,
            `Current factors: ${state.executive.businessImpactAreas.map((a) => `${a.name} ${a.value}%`).join(' · ')}.`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: state.executive.businessImpactAreas.map((_, i) => ({
        day: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
        value: Math.max(70, state.executive.businessImpactScore - (5 - i)),
      })),
    }),

  'Portfolio Health': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Portfolio Health MoM Trend',
      customTrendExplanation: 'Portfolio Health uses the same score breakdown and calculation as the Portfolio Health page.',
      customSections: [
        {
          title: `Score Breakdown (${calculatePortfolioHealthScore()}%)`,
          records: portfolioHealthBreakdown.map((item) => ({
            id: item.id,
            title: item.title,
            detail: item.note,
            meta: `${item.value}% @ ${(item.weight * 100).toFixed(0)}% weight`,
          })),
        },
        {
          title: 'Score Formula',
          bullets: [
            'Portfolio Health = Weighted SDLC composite across Requirements, Architecture, Development, Testing, Release, Production, Governance.',
            `Weighted result: ${portfolioHealthBreakdown.map((item) => `${item.value}*${item.weight}`).join(' + ')} = ${calculatePortfolioHealthScore()}.0%.`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: portfolioHealthTrend,
    }),

  'Portfolio Health Score': (state, ctx) => resolvers['Portfolio Health'](state, ctx),

  'AI SDLC Maturity': (state, ctx) => {
    const maturityBase = (
      state.requirements.qualityScore * 0.17 +
      state.architecture.readiness * 0.16 +
      state.development.health * 0.17 +
      state.testing.effectiveness * 0.2 +
      state.release.confidence * 0.16 +
      state.operations.operationalHealth * 0.14
    );
    const maturityPenalty = (state.testing.manualTests / state.testing.totalTests) * 8 +
      (state.governance.findingSeverity.find((f) => f.name === 'Critical')?.value ?? 0) * 0.8;
    const maturity = Math.round(maturityBase - maturityPenalty);
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'AI SDLC Maturity Trend',
      customTrendExplanation: 'Maturity is a weighted SDLC rollup across Requirements, Architecture, Development, Testing, Release, and Operations.',
      customSections: [
        {
          title: `Maturity Breakdown (${maturity}%)`,
          records: [
            { id: 'REQ', title: 'Requirements', detail: `Quality score ${state.requirements.qualityScore}%`, meta: 'Weight 17%' },
            { id: 'ARC', title: 'Architecture', detail: `Readiness ${state.architecture.readiness}%`, meta: 'Weight 16%' },
            { id: 'DEV', title: 'Development', detail: `Engineering health ${state.development.health}%`, meta: 'Weight 17%' },
            { id: 'TST', title: 'Testing', detail: `Effectiveness ${state.testing.effectiveness}%`, meta: 'Weight 20%' },
            { id: 'REL', title: 'Release', detail: `Release confidence ${state.release.confidence}%`, meta: 'Weight 16%' },
            { id: 'OPS', title: 'Operations', detail: `Operational health ${state.operations.operationalHealth}%`, meta: 'Weight 14%' },
          ],
        },
        {
          title: 'Calculation Notes',
          bullets: [
            `Weighted base: ${maturityBase.toFixed(1)}%.`,
            `Penalty factors: manual-test load and critical governance findings (${maturityPenalty.toFixed(1)}%).`,
            `Final AI SDLC Maturity: ${maturity}%.`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'Jan', value: Math.max(78, maturity - 4) },
        { day: 'Feb', value: Math.max(79, maturity - 3) },
        { day: 'Mar', value: Math.max(80, maturity - 2) },
        { day: 'Apr', value: Math.max(81, maturity - 1) },
        { day: 'May', value: Math.max(82, maturity) },
        { day: 'Jun', value: maturity },
      ],
    });
  },

  'Release Success Rate': (state, ctx) => {
    const releaseWindowTotal = 42;
    const highRiskReleases = state.release.releases.filter((r) => r.risk === 'high').length;
    const failedReleases = Math.max(1, Math.round((100 - state.release.confidence) / 12 + highRiskReleases * 0.2));
    const successfulReleases = releaseWindowTotal - failedReleases;
    const successRate = Number(((successfulReleases / releaseWindowTotal) * 100).toFixed(1));
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Release Success Trend',
      customTrendExplanation: 'Success rate is based on successful vs failed releases in rolling release windows, adjusted by release confidence and blocker pressure.',
      customSections: [
        {
          title: `Release Outcome (${successRate}%)`,
          bullets: [
            `Successful releases: ${successfulReleases}`,
            `Failed/rolled-back releases: ${failedReleases}`,
            `Total releases evaluated: ${releaseWindowTotal}`,
            `Calculation: ${successfulReleases}/${releaseWindowTotal} = ${successRate}%`,
          ],
        },
        {
          title: 'Contributing Factors',
          records: [
            { id: 'CONF', title: 'Enterprise Release Confidence', detail: `${state.release.confidence}%`, meta: `Open blockers ${state.release.checklist.filter((c) => c.status !== 'completed').length}` },
            { id: 'TEST', title: 'Testing Readiness', detail: `${state.release.readiness.find((r) => r.dimension === 'Testing')?.score ?? state.testing.effectiveness}%`, meta: `Testing effectiveness ${state.testing.effectiveness}%` },
            { id: 'DEP', title: 'Deployment Readiness', detail: `${state.release.deploymentReadiness}%`, meta: `Rollback readiness ${state.release.rollbackReadiness}%` },
            { id: 'GOV', title: 'Governance Readiness', detail: `${state.release.readiness.find((r) => r.dimension === 'Governance')?.score ?? state.governance.policyCompliance}%`, meta: `Policy compliance ${state.governance.policyCompliance}%` },
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'Jan', value: Math.max(95, successRate - 1.8) },
        { day: 'Feb', value: Math.max(95.4, successRate - 1.4) },
        { day: 'Mar', value: Math.max(95.8, successRate - 1.1) },
        { day: 'Apr', value: Math.max(96.3, successRate - 0.7) },
        { day: 'May', value: Math.max(96.8, successRate - 0.4) },
        { day: 'Jun', value: successRate },
      ],
    });
  },

  'Critical Risks': (state, ctx) => {
    const criticalRisks = operationalRiskRegister
      .filter((risk) => risk.severity === 'Critical' || risk.severity === 'High')
      .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
      .slice(0, 7);
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Critical Risk Trend',
      customTrendExplanation: 'Critical risk count reflects the highest-severity, highest-residual-risk enterprise items from the Strategic Risks inventory.',
      customSections: [
        {
          title: 'Critical Risks (7)',
          records: criticalRisks.map((risk) => ({
            id: risk.id,
            title: risk.title,
            detail: `Why critical: ${risk.businessImpact} · Owner: ${risk.owner}`,
            meta: `Mitigation ${risk.mitigationStatus} (${risk.mitigationProgress}%) · Residual ${risk.residualRiskScore}%`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'Jan', value: 10 },
        { day: 'Feb', value: 9 },
        { day: 'Mar', value: 9 },
        { day: 'Apr', value: 8 },
        { day: 'May', value: 8 },
        { day: 'Jun', value: criticalRisks.length },
      ],
    });
  },

  'Projects On Track': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'On-Track Portfolio Trend',
      customTrendExplanation: 'On-track delivery rose from 6 to 9 programs as release gating stabilized and quality controls reduced churn.',
      customSections: [
        {
          title: 'On-Track Banking Programs',
          records: onTrackProjects.map((project) => ({
            id: project.id,
            title: project.title,
            detail: `Progress ${project.progress} · Owner ${project.owner} · Milestone ${project.achievements}`,
            meta: `Release ${project.releaseTarget} · Confidence ${project.confidence}% · ${project.risks}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        ...onTrackTrend,
      ],
    }),

  'Projects At Risk': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'At-Risk Portfolio Trend',
      customTrendExplanation: 'Risk has reduced from 5 to 3 projects since January, with remaining concentration in Payments and Fraud transformation lines.',
      customSections: [
        {
          title: 'At-Risk Programs',
          records: atRiskProjects.map((project) => ({
            id: project.id,
            title: project.title,
            detail: `Severity ${project.severity} · Owner ${project.owner} · Impact ${project.impact}`,
            meta: `Reason: ${project.reason} · Mitigation: ${project.mitigation}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        ...atRiskTrend,
      ],
    }),

  'Critical Escalations': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Escalation Trend',
      customTrendExplanation: 'Executive escalations reduced from 4 to 2 after closure of two release-governance blockers, while strategic resilience and compliance items remain open.',
      customSections: [
        {
          title: 'Executive Escalations',
          records: criticalEscalations.map((item) => ({
            id: item.id,
            title: item.title,
            detail: `Business impact: ${item.impact} Owner: ${item.owner} Status: ${item.status}`,
            meta: `Remediation: ${item.resolution} Target resolution: ${item.targetResolution} Path: ${item.path}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        ...escalationTrend,
      ],
    }),

  'Active AI Programs': (state, ctx) =>
    (() => {
      const kpis = getAiProgramStatusKpis();
      const statusBreakdown = getAiProgramStatusBreakdown();
      const statusBreakdownLabel = statusBreakdown.map((item) => `${item.status}: ${item.count}`).join(', ');
      return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Active Program Growth Trend',
      customTrendExplanation: 'Program count increased from 9 to 12 as Lending, AML, and Operations initiatives graduated from discovery to active execution.',
      customSections: [
        {
          title: `AI Initiative Portfolio (${kpis.activePrograms})`,
          records: aiInitiatives.map((initiative) => ({
            id: initiative.id,
            title: initiative.name,
            detail: `Objective: ${initiative.objective} Business value: ${initiative.businessValue}`,
            meta: `Owner: ${initiative.owner} · Progress: ${initiative.progress}% · Status: ${initiative.status}`,
          })),
        },
        {
          title: 'Status Reconciliation',
          bullets: [
            `Active Programs: ${kpis.activePrograms}`,
            `Status categories: ${statusBreakdownLabel}`,
            `Reconciled total: ${statusBreakdown.reduce((sum, item) => sum + item.count, 0)} of ${kpis.activePrograms}`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: activeProgramsTrend,
      });
    })(),

  'Programs On Track': (state, ctx) => {
    const onTrack = aiInitiatives.filter((initiative) => initiative.status === 'On Track');
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'On-Track Program Trend',
      customTrendExplanation: 'On-track initiatives rose from 5 to 8 as milestone completion improved across Payments, Compliance, and Retail programs.',
      customSections: [
        {
          title: 'On-Track Initiatives',
          records: onTrack.map((initiative) => ({
            id: initiative.id,
            title: initiative.name,
            detail: `Why on track: ${initiative.milestonesCompleted[0]}. Completed milestones: ${initiative.milestonesCompleted.join(' | ')}`,
            meta: `Upcoming: ${initiative.upcomingMilestones.join(' | ')} · Confidence: ${initiative.confidence}%`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: onTrackProgramsTrend,
    });
  },

  'Programs Delayed': (state, ctx) => {
    const delayed = aiInitiatives.filter((initiative) => initiative.status === 'Delayed');
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Delayed Program Trend',
      customTrendExplanation: 'Delayed initiatives reduced from 4 to 3 after mitigation execution, though infrastructure and governance dependencies still affect timelines.',
      customSections: [
        {
          title: 'Delayed Initiatives',
          records: delayed.map((initiative) => ({
            id: initiative.id,
            title: initiative.name,
            detail: `Delay reason: ${initiative.delayReason} Impact: ${initiative.impact}`,
            meta: `Mitigation: ${initiative.mitigation} · Revised timeline: ${initiative.revisedTimeline}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: delayedProgramsTrend,
    });
  },

  'Programs Watchlist': (state, ctx) => {
    const watchlist = aiInitiatives.filter((initiative) => initiative.status === 'Watchlist');
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Watchlist Program Trend',
      customTrendExplanation: 'Watchlist initiatives require active monitoring due to elevated delivery risk or milestone uncertainty.',
      customSections: [
        {
          title: 'Watchlist Initiatives',
          records: watchlist.map((initiative) => ({
            id: initiative.id,
            title: initiative.name,
            detail: `Current progress: ${initiative.progress}% · Objective: ${initiative.objective}`,
            meta: `Owner: ${initiative.owner} · Confidence: ${initiative.confidence}% · Upcoming: ${initiative.upcomingMilestones.join(' | ')}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'Jan', value: 0 },
        { day: 'Feb', value: 0 },
        { day: 'Mar', value: 1 },
        { day: 'Apr', value: 1 },
        { day: 'May', value: 1 },
        { day: 'Jun', value: watchlist.length },
      ],
    });
  },

  'AI Adoption': (state, ctx) => {
    const adoption = getAiProgramStatusKpis().aiAdoption;
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'AI Adoption Trend',
      customTrendExplanation: 'Adoption increased steadily as more teams onboarded AI workflows across Requirements, Development, Testing, Release, and Governance.',
      customSections: [
        {
          title: 'Adoption Breakdown',
          records: [
            {
              id: 'TEAM',
              title: 'Teams Enabled',
              detail: `${adoptionBreakdown.teamsEnabled.adopted}/${adoptionBreakdown.teamsEnabled.total}`,
              meta: `${((adoptionBreakdown.teamsEnabled.adopted / adoptionBreakdown.teamsEnabled.total) * 100).toFixed(1)}%`,
            },
            {
              id: 'USER',
              title: 'Active Users',
              detail: `${adoptionBreakdown.activeUsers.adopted}/${adoptionBreakdown.activeUsers.total}`,
              meta: `${((adoptionBreakdown.activeUsers.adopted / adoptionBreakdown.activeUsers.total) * 100).toFixed(1)}%`,
            },
            {
              id: 'FLOW',
              title: 'Workflows Operationalized',
              detail: `${adoptionBreakdown.workflowsOperationalized.adopted}/${adoptionBreakdown.workflowsOperationalized.total}`,
              meta: `${((adoptionBreakdown.workflowsOperationalized.adopted / adoptionBreakdown.workflowsOperationalized.total) * 100).toFixed(1)}%`,
            },
            {
              id: 'SDLC',
              title: 'SDLC Phases Embedded',
              detail: `${adoptionBreakdown.sdlcPhasesEmbedded.adopted}/${adoptionBreakdown.sdlcPhasesEmbedded.total}`,
              meta: `${((adoptionBreakdown.sdlcPhasesEmbedded.adopted / adoptionBreakdown.sdlcPhasesEmbedded.total) * 100).toFixed(1)}%`,
            },
            {
              id: 'USE',
              title: 'Monthly Active Usage',
              detail: `${adoptionBreakdown.monthlyActiveUsage.adopted}/100`,
              meta: `${adoptionBreakdown.monthlyActiveUsage.adopted.toFixed(1)}%`,
            },
          ],
        },
        {
          title: 'Adoption Formula',
          bullets: [
            'Adoption = 20% Teams + 25% Active Users + 25% Workflows + 15% SDLC Embedding + 15% Monthly Usage.',
            `Weighted outcome = ${adoption}% adoption across AI initiative portfolio.`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: adoptionTrend,
    });
  },

  'Enterprise Risks': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Enterprise Risk Trend',
      customTrendExplanation: 'Open enterprise risks reduced from 35 to 31 over six months due to closure of medium-severity operational items.',
      customSections: [
        {
          title: 'Operational Risk Heat Register (31)',
          records: operationalRiskRegister.map((risk) => ({
            id: risk.id,
            title: risk.title,
            detail: `${risk.domain} · Owner: ${risk.owner} · Severity: ${risk.severity}`,
            meta: `Residual ${risk.residualRiskScore}% · Due ${risk.dueDate} · Trend ${risk.trend}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: riskTrends.enterpriseRisks,
    }),

  'High Risk Items': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'High/Critical Risk Trend',
      customTrendExplanation: 'High/Critical risk concentration decreased to 8 after control hardening in payments and architecture domains.',
      customSections: [
        {
          title: 'High/Critical Risks (8)',
          records: highRiskItems.map((risk) => ({
            id: risk.id,
            title: risk.title,
            detail: `Why high risk: ${risk.businessImpact} Root cause: ${risk.rootCause}`,
            meta: `Severity ${risk.severity} · Residual ${risk.residualRiskScore}% · Controls: ${risk.controls.join(' | ')}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: riskTrends.highRiskItems,
    }),

  'Mitigation Plans Due': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Mitigation Due Trend',
      customTrendExplanation: 'Due mitigation items reduced from 7 to 5 as closure discipline improved under risk governance reviews.',
      customSections: [
        {
          title: 'Mitigation Actions Due (5)',
          records: mitigationPlansDue.map((risk) => ({
            id: risk.id,
            title: risk.title,
            detail: `Owner ${risk.owner} · Due ${risk.dueDate} · Progress ${risk.mitigationProgress}%`,
            meta: `Status ${risk.mitigationStatus} · Plan: ${risk.mitigationPlan}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: riskTrends.mitigationDue,
    }),

  'Residual Risk Score': (state, ctx) => {
    const residualScore = calculateResidualRiskScore();
    const criticalCount = operationalRiskRegister.filter((risk) => risk.severity === 'Critical').length;
    const highCount = operationalRiskRegister.filter((risk) => risk.severity === 'High').length;
    const mediumCount = operationalRiskRegister.filter((risk) => risk.severity === 'Medium').length;
    const lowCount = operationalRiskRegister.filter((risk) => risk.severity === 'Low').length;
    const avgMitigation = Math.round(
      operationalRiskRegister.reduce((sum, risk) => sum + risk.mitigationProgress, 0) / operationalRiskRegister.length,
    );
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Residual Risk Score Trend',
      customTrendExplanation: 'Residual risk declined from 69% to 64% as mitigation progress improved and high-risk control effectiveness increased.',
      customSections: [
        {
          title: 'Residual Score Breakdown',
          bullets: [
            `Risk mix: ${criticalCount} Critical, ${highCount} High, ${mediumCount} Medium, ${lowCount} Low.`,
            `Average mitigation completion: ${avgMitigation}%.`,
            'Residual Risk Score = severity-weighted residual exposure adjusted by control completion.',
            `Calculated residual risk score: ${residualScore}%.`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: riskTrends.residualRisk,
    });
  },

  'Active Changes': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.delivery.pipelineVelocity.map((p) => ({
        id: p.stage,
        title: p.stage,
        detail: `${p.count} items`,
        meta: `Avg ${p.avgDays}d`,
      })),
      supportingEvidence: [
        `Sprint burndown on track: ${state.delivery.sprintBurndown[state.delivery.sprintBurndown.length - 1]?.actual}% complete`,
      ],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(120),
    }),

  'In-Flight Releases': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.release.releases.map((r) => ({
        id: r.id,
        title: r.name,
        detail: r.domain,
        meta: `${r.confidence}% · ${r.risk} risk`,
      })),
      supportingEvidence: state.release.checklist.map((c) => `${c.item}: ${c.status}`),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.release.confidence),
    }),

  'Requirements Analysed': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.requirements.topRiskRequirements.map((r) => ({
        id: r.id,
        title: r.title,
        detail: r.domain,
        meta: `${r.risk} · ${r.impact}`,
      })),
      supportingEvidence: state.requirements.complianceBreakdown.map(
        (c) => `${c.name}: ${c.count} requirements`,
      ),
      relatedApplications: appsFromArchitecture(state).slice(0, 4),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(85),
    }),

  'Business Impact Index': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.executive.businessImpactAreas.map((a) => ({
        id: a.name,
        title: a.name,
        meta: `${a.value}%`,
      })),
      supportingEvidence: state.delivery.topRequirements.map((r) => `${r.title} — ${r.impact} impact`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.delivery.businessImpactIndex),
    }),

  'Compliance Impact': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.requirements.complianceBreakdown.map((c) => ({
        id: c.name,
        title: c.name,
        meta: `${c.count} reqs`,
      })),
      supportingEvidence: state.governance.complianceStandards.map((s) => `${s.name}: ${s.score}%`),
      relatedApplications: [{ name: 'Payment Gateway', status: 'high' }, { name: 'UPI Switch', status: 'critical' }],
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state).filter((r) => r.domain === 'Payments'),
      historicalTrend: sparkline7d(state.requirements.complianceImpact * 3),
    }),

  'Requirement Risks': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.requirements.topRiskRequirements.map((r) => ({
        id: r.id,
        title: r.title,
        meta: r.risk,
      })),
      supportingEvidence: state.requirements.riskDistribution.map((d) => `${d.name}: ${d.value}`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.delivery.requirementRisks * 5),
    }),

  'Architecture Risks': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.architecture.techRisks.map((r, i) => ({
        id: `AR-${i + 1}`,
        title: r.title,
        meta: r.severity,
      })),
      supportingEvidence: state.architecture.recommendations,
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).filter((i) => i.domain === 'Payments'),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.architecture.readiness),
    }),

  'Technical Debt': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.development.securityItems.map((s, i) => ({
        id: `TD-${i + 1}`,
        title: s.title,
        meta: s.severity,
      })),
      supportingEvidence: [
        `Tech debt score: ${state.development.techDebt} items`,
        ...state.architecture.recommendations,
      ],
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status !== 'low'),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.qualityTrend.map((p) => ({ day: p.month, value: p.debt })),
    }),

  'Test Coverage': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.testing.coverageHeatmap.map((row, i) => ({
        id: `COV-${i}`,
        title: row[0],
        detail: state.testing.heatmapEnvs.map((env, j) => `${env}: ${row[j + 1]}%`).join(' · '),
      })),
      supportingEvidence: state.testing.aiRecommendations,
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(typeof ctx.value === 'number' ? ctx.value : state.testing.coverage),
    }),

  'Code Quality': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.development.securityItems.map((s, i) => ({
        id: `CQ-${i + 1}`,
        title: s.title,
        meta: s.severity,
      })),
      supportingEvidence: state.development.prAging.map((p) => `${p.range}: ${p.count} PRs`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.qualityTrend.map((p) => ({ day: p.month, value: p.quality })),
    }),

  'Change Failure Rate': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.release.riskMatrix.map((r, i) => ({
        id: `CFR-${i}`,
        title: r.title,
        meta: r.severity,
      })),
      supportingEvidence: [`Deployment frequency: ${state.delivery.deploymentFrequency}/month`],
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(95 - state.delivery.changeFailureRate * 5),
    }),

  'Deployments / Month': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: releasesFromState(state).map((r) => ({
        id: r.id,
        title: r.name,
        meta: `${r.confidence}%`,
      })),
      supportingEvidence: state.release.checklist.map((c) => c.item),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.commitTrend.map((p) => ({ day: p.week, value: p.prs * 8 })),
    }),

  'Lead Time': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.delivery.pipelineVelocity.map((p) => ({
        id: p.stage,
        title: p.stage,
        meta: `${p.avgDays}d avg`,
      })),
      supportingEvidence: [`Defect density: ${state.delivery.defectDensity}/KLOC`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(100 - state.delivery.leadTimeHours / 2),
    }),

  'Defect Density': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.testing.defectTrend.map((d) => ({
        id: d.week,
        title: d.week,
        detail: `${d.found} found, ${d.escaped} escaped`,
      })),
      supportingEvidence: [`Defect leakage: ${state.testing.defectLeakage}`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.testing.defectTrend.map((d) => ({ day: d.week, value: d.found })),
    }),

  'High Risk': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.requirements.topRiskRequirements
        .filter((r) => r.risk === 'high')
        .map((r) => ({ id: r.id, title: r.title, meta: r.domain })),
      supportingEvidence: state.requirements.riskDistribution.map((d) => `${d.name}: ${d.value}`),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state).filter((r) => r.risk === 'high'),
      historicalTrend: sparkline7d(state.requirements.highRisk * 4),
    }),

  Ambiguous: (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.requirements.topRiskRequirements.slice(0, 3).map((r) => ({
        id: r.id,
        title: r.title,
        detail: 'Ambiguity flagged in acceptance criteria',
        meta: r.domain,
      })),
      supportingEvidence: [`Analysis queue: ${state.requirements.analysisQueue} pending reviews`],
      relatedApplications: appsFromArchitecture(state).slice(0, 3),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.requirements.ambiguous * 8),
    }),

  'Missing Criteria': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.requirements.topRiskRequirements.slice(1, 4).map((r) => ({
        id: r.id,
        title: r.title,
        detail: 'Missing acceptance criteria',
        meta: r.risk,
      })),
      supportingEvidence: [`Quality score: ${state.requirements.qualityScore}%`],
      relatedApplications: appsFromArchitecture(state).slice(0, 2),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.requirements.missingCriteria * 10),
    }),

  'Compliance-Tagged': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.requirements.complianceBreakdown.map((c) => ({
        id: c.name,
        title: c.name,
        meta: `${c.count} tagged`,
      })),
      supportingEvidence: state.governance.complianceStandards.map((s) => `${s.name}: ${s.score}%`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.requirements.complianceImpact * 4),
    }),

  'Architecture Readiness': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.architecture.layerReadiness.map((l) => ({
        id: l.label,
        title: l.label,
        meta: `${l.value}%`,
      })),
      supportingEvidence: state.architecture.techRisks.map((r) => r.title),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.architecture.readiness),
    }),

  'Critical Dependencies': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.architecture.techRisks
        .filter((r) => r.severity === 'critical' || r.severity === 'high')
        .map((r, i) => ({ id: `DEP-${i}`, title: r.title, meta: r.severity })),
      supportingEvidence: state.architecture.edges.map((e) => e.join(' → ')),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state).filter((i) => i.severity === 'critical'),
      relatedReleases: releasesFromState(state).filter((r) => r.name.includes('UPI')),
      historicalTrend: sparkline7d(state.architecture.criticalDependencies * 12),
    }),

  'Integration Risks': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.architecture.techRisks.map((r, i) => ({
        id: `INT-${i}`,
        title: r.title,
        meta: r.severity,
      })),
      supportingEvidence: state.architecture.recommendations,
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(80),
    }),

  'Cross-Team Dependencies': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.architecture.edges.map((e, i) => ({
        id: `XTD-${i}`,
        title: e.join(' ↔ '),
        detail: 'Service dependency',
      })),
      supportingEvidence: state.architecture.layerReadiness.map((l) => `${l.label}: ${l.value}%`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.architecture.crossTeamDeps * 6),
    }),

  'Pull Requests': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.development.prAging.map((p) => ({
        id: p.range,
        title: p.range,
        meta: `${p.count} PRs`,
      })),
      supportingEvidence: state.development.securityItems.map((s) => s.title),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.commitTrend.map((p) => ({ day: p.week, value: p.prs })),
    }),

  Commits: (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.development.commitTrend.map((p) => ({
        id: p.week,
        title: p.week,
        meta: `${p.commits} commits`,
      })),
      supportingEvidence: [`Code quality: ${state.development.codeQuality}%`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.commitTrend.map((p) => ({ day: p.week, value: p.commits })),
    }),

  'Tech Debt': (state, ctx) =>
    resolvers['Technical Debt'](state, ctx),

  'Dev Health': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.development.securityItems.map((s, i) => ({
        id: `DH-${i}`,
        title: s.title,
        meta: s.severity,
      })),
      supportingEvidence: [
        `Commits: ${state.development.commits} · PRs: ${state.development.pullRequests}`,
      ],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.qualityTrend.map((p) => ({ day: p.month, value: p.quality })),
    }),

  'Total Tests': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.testing.coverageHeatmap.map((row, i) => ({
        id: `TST-${i}`,
        title: String(row[0]),
        detail: `Coverage across ${state.testing.heatmapEnvs.join(', ')}`,
      })),
      supportingEvidence: state.testing.aiRecommendations,
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(90),
    }),

  'Manual Tests': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.testing.coverageHeatmap.map((row, i) => ({
        id: `MAN-${i}`,
        title: String(row[0]),
        meta: `Manual coverage gap: ${100 - Number(row[1])}%`,
      })),
      supportingEvidence: [`Automation rate: ${state.testing.automation}%`],
      relatedApplications: appsFromArchitecture(state).slice(0, 3),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.testing.manualTests / 100),
    }),

  Coverage: (state, ctx) => resolvers['Test Coverage'](state, ctx),

  Automation: (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.testing.aiRecommendations.map((r, i) => ({
        id: `AUTO-${i}`,
        title: r,
      })),
      supportingEvidence: [`Effectiveness: ${state.testing.effectiveness}%`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.testing.automation),
    }),

  Effectiveness: (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.testing.defectTrend.map((d) => ({
        id: d.week,
        title: d.week,
        detail: `Escaped defects: ${d.escaped}`,
      })),
      supportingEvidence: [`Defect leakage: ${state.testing.defectLeakage}`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.testing.effectiveness),
    }),

  'AI Recommended': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.testing.aiRecommendations.map((r, i) => ({
        id: `AI-${i}`,
        title: r,
      })),
      supportingEvidence: [`Optimization progress: ${state.testing.optimizationProgress}%`],
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state).filter((r) => r.risk === 'high'),
      historicalTrend: sparkline7d(state.testing.recommended / 3),
    }),

  'Release Confidence': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.release.readiness.map((r) => ({
        id: r.dimension,
        title: r.dimension,
        meta: `${r.score}% · ${r.status}`,
      })),
      supportingEvidence: state.release.checklist.map((c) => `${c.item}: ${c.status}`),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.release.confidence),
    }),

  'Rollback Readiness': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.release.releases.map((r) => ({
        id: r.id,
        title: r.name,
        meta: `${r.confidence}% confidence`,
      })),
      supportingEvidence: state.release.riskMatrix.map((r) => r.title),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.release.rollbackReadiness),
    }),

  'Deployment Readiness': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.release.checklist.map((c, i) => ({
        id: `CHK-${i}`,
        title: c.item,
        meta: c.status,
      })),
      supportingEvidence: state.release.riskMatrix.map((r) => `${r.title} (${r.severity})`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.release.deploymentReadiness),
    }),

  'Go / No-Go': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.release.readiness.map((r) => ({
        id: r.dimension,
        title: r.dimension,
        meta: r.status,
      })),
      supportingEvidence: [
        `Enterprise decision: ${state.release.goNoGo}`,
        ...state.release.checklist.filter((c) => c.status !== 'completed').map((c) => `Pending: ${c.item}`),
      ],
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status !== 'low'),
      relatedIncidents: incidentsFromState(state).filter((i) => i.severity === 'critical'),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.release.confidence),
    }),

  Availability: (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.production.serviceHealth.map((s) => ({
        id: s.name,
        title: s.name,
        meta: `${s.uptime}% uptime`,
      })),
      supportingEvidence: [`SLA breaches: ${state.production.slaBreaches}`],
      relatedApplications: state.production.serviceHealth.map((s) => ({
        name: s.name,
        status: s.status,
      })),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.production.availability),
    }),

  MTTR: (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'MTTR Trend',
      customTrendExplanation: 'MTTR is derived from the shared incident operations dataset and is consistent between Production summary and Incident Management views.',
      customSections: [
        {
          title: `Current MTTR (${getIncidentOperationsKpis().mttrMinutes}m)`,
          bullets: [
            `Open incidents: ${getIncidentOperationsKpis().openIncidents}`,
            `Critical incidents: ${getIncidentOperationsKpis().criticalIncidents}`,
            `Escalated incidents: ${getIncidentOperationsKpis().escalatedIncidents}`,
          ],
        },
        {
          title: 'Average by Severity',
          bullets: ['critical', 'high', 'medium', 'low'].map((severity) => {
            const items = incidentOperationsData.filter((inc) => inc.severity === severity);
            const avg = items.length
              ? Math.round(items.reduce((sum, inc) => sum + inc.mttrMinutes, 0) / items.length)
              : 0;
            return `${severity.toUpperCase()}: ${avg}m`;
          }),
        },
        {
          title: 'Recent Resolution Times',
          records: incidentOperationsData.map((inc) => ({
            id: inc.id,
            title: inc.service,
            detail: `Resolution time: ${inc.mttrMinutes} minutes`,
            meta: `${inc.severity.toUpperCase()} · ${inc.status}`,
          })),
        },
        {
          title: 'Improvement Opportunities',
          bullets: [
            'Reduce RCA handoff time by auto-assigning incident commander at incident creation.',
            'Pre-stage rollback and circuit-breaker runbooks for Fraud Engine and UPI Switch.',
            'Run dependency health checks before release windows to prevent external and DB recovery delays.',
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: mttrTrend7d,
    }),

  'Service Health': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.production.serviceHealth.map((s) => ({
        id: s.name,
        title: s.name,
        meta: s.status,
      })),
      supportingEvidence: state.production.topIssues.map((i) => i.issue),
      relatedApplications: state.production.serviceHealth.map((s) => ({
        name: s.name,
        status: s.status,
      })),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.production.health),
    }),

  'Batch Health': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.operations.batchJobs.map((j, i) => ({
        id: `BATCH-${i}`,
        title: j.name,
        meta: `${j.status} · ${j.progress}%`,
      })),
      supportingEvidence: state.operations.operationalRisks.map((r) => `${r.title} (${r.severity})`),
      relatedApplications: [{ name: 'Core Banking', status: 'low' }, { name: 'UPI Switch', status: 'critical' }],
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.operations.batchHealth),
    }),

  'Capacity Utilization (Legacy)': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.operations.capacityForecast.map((f) => ({
        id: f.day,
        title: f.day,
        meta: `${f.predicted}% predicted`,
      })),
      supportingEvidence: state.operations.operationalRisks.map((r) => r.title),
      relatedApplications: appsFromArchitecture(state).slice(0, 4),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.operations.capacityTrend.map((p) => ({ day: p.hour, value: p.cpu })),
    }),

  'CPU Utilization': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.operations.capacityTrend.map((p) => ({
        id: p.hour,
        title: `${p.hour}:00`,
        meta: `CPU ${p.cpu}%`,
      })),
      supportingEvidence: [`Memory avg: ${state.operations.capacityTrend[3]?.memory}%`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.operations.capacityTrend.map((p) => ({ day: p.hour, value: p.cpu })),
    }),

  'Storage Utilization': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.operations.capacityTrend.map((p) => ({
        id: `ST-${p.hour}`,
        title: `${p.hour}:00`,
        meta: `Storage ${p.storage}%`,
      })),
      supportingEvidence: state.operations.operationalRisks.map((r) => r.title),
      relatedApplications: appsFromArchitecture(state).slice(0, 3),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.operations.capacityTrend.map((p) => ({ day: p.hour, value: p.storage })),
    }),

  'Audit Findings': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.governance.auditTrail.map((a, i) => ({
        id: `AUD-${i}`,
        title: a.event,
        meta: a.time,
      })),
      supportingEvidence: state.governance.topFindings.map((f) => f.title),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(90),
    }),

  'VAPT Findings': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.governance.topFindings.map((f, i) => ({
        id: `VAPT-${i}`,
        title: f.title,
        meta: f.severity,
      })),
      supportingEvidence: state.governance.findingSeverity.map((f) => `${f.name}: ${f.value}`),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status !== 'low'),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(85),
    }),

  'Policy Violations': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.governance.topFindings
        .filter((f) => f.severity === 'medium' || f.severity === 'high')
        .map((f, i) => ({ id: `POL-${i}`, title: f.title, meta: f.severity })),
      supportingEvidence: [`Policy compliance: ${state.governance.policyCompliance}%`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(92),
    }),

  'Security Findings': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.development.securityItems.map((s, i) => ({
        id: `SEC-${i}`,
        title: s.title,
        meta: s.severity,
      })),
      supportingEvidence: state.governance.topFindings.map((f) => f.title),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(88),
    }),

  'Governance Score': (state, ctx) => resolvers['Governance Health'](state, ctx),

  'Lessons Captured': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Lessons Captured Trend',
      customTrendExplanation: `Lessons Captured (${getLessonsManagementKpis().lessonsCaptured}) is sourced from the Lessons Repository across Incidents, Production, Availability, Capacity, and Governance.`,
      customSections: [
        {
          title: `Captured Lessons (${getLessonsManagementKpis().lessonsCaptured})`,
          records: lessonsRepository.map((lesson) => ({
            id: lesson.id,
            title: lesson.lesson,
            detail: `${lesson.service} · Source: ${lesson.source} · Owner: ${lesson.owner}`,
            meta: `${lesson.date} · ${lesson.severity} · ${lesson.status}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 16 },
        { day: 'W2', value: 19 },
        { day: 'W3', value: 22 },
        { day: 'W4', value: getLessonsManagementKpis().lessonsCaptured },
      ],
    }),

  'Lessons Implemented': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Lessons Implemented Trend',
      customTrendExplanation: `Lessons Implemented (${getLessonsManagementKpis().lessonsImplemented}) counts repository lessons with implemented actions in implementation tracker.`,
      customSections: [
        {
          title: `Implemented Lessons (${getLessonsManagementKpis().lessonsImplemented})`,
          records: implementationTracker.map((item) => ({
            id: item.lessonId,
            title: item.lesson,
            detail: item.actionTaken,
            meta: `${item.status} · ${item.completion}% complete`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 11 },
        { day: 'W2', value: 14 },
        { day: 'W3', value: 16 },
        { day: 'W4', value: getLessonsManagementKpis().lessonsImplemented },
      ],
    }),

  'Recurrence Reduction': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Recurrence Reduction Trend',
      customTrendExplanation: `Recurrence Reduction is calculated as (20 baseline recurring incidents - 17 current recurring incidents) / 20 = ${getLessonsManagementKpis().recurrenceReduction}%.`,
      customSections: [
        {
          title: 'Reduction Calculation',
          bullets: [
            'Baseline recurring incidents: 20',
            'Current recurring incidents: 17',
            `Recurrence Reduction = (20 - 17) / 20 = ${getLessonsManagementKpis().recurrenceReduction}%`,
          ],
        },
        {
          title: 'Prevented and Remaining Areas',
          bullets: [
            `Prevented incidents this cycle: ${recurrenceTrend[recurrenceTrend.length - 1]?.prevented ?? 0}`,
            ...remainingProblemAreas.map((area) => `Remaining area: ${area}`),
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: recurrenceTrend.map((point) => ({ day: point.month, value: point.recurring })),
    }),

  'Learning Adoption': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Learning Adoption Trend',
      customTrendExplanation: `Learning Adoption is ${getLessonsManagementKpis().adoptedTeams} adopted teams out of ${getLessonsManagementKpis().totalTeams} total teams = ${getLessonsManagementKpis().learningAdoption}%.`,
      customSections: [
        {
          title: 'Adoption Calculation',
          bullets: [
            `Adopted teams: ${getLessonsManagementKpis().adoptedTeams}`,
            `Total teams: ${getLessonsManagementKpis().totalTeams}`,
            `Learning Adoption = ${getLessonsManagementKpis().adoptedTeams}/${getLessonsManagementKpis().totalTeams} = ${getLessonsManagementKpis().learningAdoption}%`,
          ],
        },
        {
          title: `Team Adoption List (${getLessonsManagementKpis().totalTeams})`,
          records: learningAdoptionTeams.map((team, idx) => ({
            id: `TEAM-${idx + 1}`,
            title: team.team,
            detail: team.adopted ? 'Adopted learning assets' : 'Pending adoption',
            meta: team.adopted ? 'Adopted' : 'Pending',
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 64 },
        { day: 'W2', value: 69 },
        { day: 'W3', value: 73 },
        { day: 'W4', value: getLessonsManagementKpis().learningAdoption },
      ],
    }),

  'Reusable Assets Created': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Reusable Assets Created Trend',
      customTrendExplanation: `Reusable Assets Created (${getLearningKpis().reusableAssetsCount}) represents distinct artifacts created from operational and governance learning.`,
      customSections: [
        {
          title: `Created Assets (${getLearningKpis().reusableAssetsCount})`,
          records: reusableAssetsCreated.map((asset) => ({
            id: asset.id,
            title: asset.title,
            detail: `${asset.service} · Source: ${asset.source} · Created ${asset.createdOn}`,
            meta: `Reuse count: ${asset.reuseCount}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 11 },
        { day: 'W2', value: 14 },
        { day: 'W3', value: 16 },
        { day: 'W4', value: getLearningKpis().reusableAssetsCount },
      ],
    }),

  'Knowledge Reuse Rate': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Knowledge Reuse Rate Trend',
      customTrendExplanation: `Knowledge Reuse Rate (${getLearningKpis().knowledgeReuseRate}%) is calculated from reused asset applications over total asset usage opportunities.`,
      customSections: [
        {
          title: 'Reuse Calculation',
          bullets: [
            `Reused asset applications: ${getLearningKpis().reusedAssets}`,
            `Total asset usage opportunities: ${getLearningKpis().totalAssetUsages}`,
            `Knowledge Reuse Rate = ${getLearningKpis().reusedAssets}/${getLearningKpis().totalAssetUsages} = ${getLearningKpis().knowledgeReuseRate}%`,
          ],
        },
        {
          title: 'Most Reused Assets',
          records: [...reusableAssetsCreated]
            .sort((a, b) => b.reuseCount - a.reuseCount)
            .slice(0, 8)
            .map((asset) => ({
              id: asset.id,
              title: asset.title,
              detail: `${asset.service} · ${asset.source}`,
              meta: `Reuse count: ${asset.reuseCount}`,
            })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 68 },
        { day: 'W2', value: 71 },
        { day: 'W3', value: 74 },
        { day: 'W4', value: getLearningKpis().knowledgeReuseRate },
      ],
    }),

  'Tech Debt Logged': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Tech Debt Logged Trend',
      customTrendExplanation: `Tech Debt Logged (${getLearningKpis().techDebtLogged}) is tracked as a category rollup of learning-derived debt items.`,
      customSections: [
        {
          title: `Category Breakdown (${getLearningKpis().techDebtLogged})`,
          records: techDebtBreakdown.map((item) => ({
            id: item.category.slice(0, 3).toUpperCase(),
            title: item.category,
            detail: `Logged items: ${item.count}`,
            meta: 'Source: Incidents/Production/Availability/Capacity/Governance',
          })),
        },
        {
          title: 'Total Calculation',
          bullets: [
            `${techDebtBreakdown.map((item) => item.count).join(' + ')} = ${getLearningKpis().techDebtLogged}`,
          ],
        },
        {
          title: 'Similar Changes',
          bullets: similarChanges.map((item) => `${item.text} (${item.time})`),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 82 },
        { day: 'W2', value: 87 },
        { day: 'W3', value: 93 },
        { day: 'W4', value: getLearningKpis().techDebtLogged },
      ],
    }),

  'Approved Best Practices': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Approved Best Practices Trend',
      customTrendExplanation: `Approved Best Practices (${getBestPracticesKpis().approvedBestPractices}) are grouped by Operations, Security, Testing, Architecture, and AI Governance domains.`,
      customSections: [
        {
          title: 'Domain Grouping',
          bullets: ['Operations', 'Security', 'Testing', 'Architecture', 'AI Governance'].map((domain) => {
            const count = bestPracticeLibrary.filter((practice) => practice.domain === domain).length;
            return `${domain}: ${count}`;
          }),
        },
        {
          title: `Approved Practices (${getBestPracticesKpis().approvedBestPractices})`,
          records: bestPracticeLibrary.map((practice) => ({
            id: practice.id,
            title: practice.practice,
            detail: `${practice.domain} · ${practice.impactedService} · Owner: ${practice.owner}`,
            meta: `Status: ${practice.status}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 24 },
        { day: 'W2', value: 27 },
        { day: 'W3', value: 30 },
        { day: 'W4', value: getBestPracticesKpis().approvedBestPractices },
      ],
    }),

  'Adoption Rate': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Adoption Rate Trend',
      customTrendExplanation: `Adoption Rate is ${getBestPracticesKpis().adoptedPractices}/${getBestPracticesKpis().applicablePractices} = ${getBestPracticesKpis().adoptionRate}% across approved practices.`,
      customSections: [
        {
          title: 'Adoption Calculation',
          bullets: [
            `Adopted practices: ${getBestPracticesKpis().adoptedPractices}`,
            `Applicable practices: ${getBestPracticesKpis().applicablePractices}`,
            `Adoption Rate = ${getBestPracticesKpis().adoptedPractices}/${getBestPracticesKpis().applicablePractices} = ${getBestPracticesKpis().adoptionRate}%`,
          ],
        },
        {
          title: 'Adopted Practices',
          records: bestPracticeLibrary
            .filter((practice) => practice.status === 'Adopted')
            .map((practice) => ({
              id: practice.id,
              title: practice.practice,
              detail: `${practice.domain} · ${practice.impactedService}`,
              meta: 'Adopted',
            })),
        },
        {
          title: 'Pending Practices',
          records: bestPracticeLibrary
            .filter((practice) => practice.status === 'Pending')
            .map((practice) => ({
              id: practice.id,
              title: practice.practice,
              detail: `${practice.domain} · ${practice.impactedService}`,
              meta: 'Pending',
            })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: adoptionByDomain.map((item, idx) => ({ day: `D${idx + 1}`, value: item.adoptedRate })),
    }),

  'High-Risk Gaps': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'High-Risk Gaps Trend',
      customTrendExplanation: `High-Risk Gaps (${getBestPracticesKpis().highRiskGapsCount}) represent missing practices with direct operational or governance risk impact.`,
      customSections: [
        {
          title: `Gap Register (${getBestPracticesKpis().highRiskGapsCount})`,
          records: highRiskGaps.map((gap) => ({
            id: gap.id,
            title: `${gap.service} · ${gap.missingPractice}`,
            detail: gap.riskReason,
            meta: 'Risk: High',
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 7 },
        { day: 'W2', value: 6 },
        { day: 'W3', value: 5 },
        { day: 'W4', value: getBestPracticesKpis().highRiskGapsCount },
      ],
    }),

  'Compliance Coverage': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Compliance Coverage Trend',
      customTrendExplanation: `Compliance Coverage is ${getBestPracticesKpis().coveredControls}/${getBestPracticesKpis().totalControls} = ${getBestPracticesKpis().complianceCoverage}% across mapped controls.`,
      customSections: [
        {
          title: 'Coverage Calculation',
          bullets: [
            `Covered controls: ${getBestPracticesKpis().coveredControls}`,
            `Total controls: ${getBestPracticesKpis().totalControls}`,
            `Compliance Coverage = ${getBestPracticesKpis().coveredControls}/${getBestPracticesKpis().totalControls} = ${getBestPracticesKpis().complianceCoverage}%`,
          ],
        },
        {
          title: 'Coverage by Domain',
          records: complianceCoverageByDomain.map((item) => ({
            id: item.domain.slice(0, 3).toUpperCase(),
            title: item.domain,
            detail: `Covered ${item.covered} of ${item.total}`,
            meta: `${Math.round((item.covered / item.total) * 100)}%`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 87 },
        { day: 'W2', value: 89 },
        { day: 'W3', value: 90 },
        { day: 'W4', value: getBestPracticesKpis().complianceCoverage },
      ],
    }),

  'Reusable Assets Available': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Reusable Assets Availability Trend',
      customTrendExplanation: `Reusable Assets Available (${getReusableAssetsKpis().reusableAssetsAvailable}) is the total count of approved reusable delivery assets in catalog.`,
      customSections: [
        {
          title: `Asset Catalog Count (${getReusableAssetsKpis().reusableAssetsAvailable})`,
          records: reusableDeliveryAssets.map((asset) => ({
            id: asset.id,
            title: asset.name,
            detail: `${asset.category} · ${asset.service} · Owner: ${asset.owner}`,
            meta: `Reuse count ${asset.reuseCount} · Updated ${asset.lastUpdated}`,
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 39 },
        { day: 'W2', value: 42 },
        { day: 'W3', value: 45 },
        { day: 'W4', value: getReusableAssetsKpis().reusableAssetsAvailable },
      ],
    }),

  'Asset Reuse Rate': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Asset Reuse Rate Trend',
      customTrendExplanation: `Asset Reuse Rate is ${getReusableAssetsKpis().totalReuseSuccessful}/${getReusableAssetsKpis().totalReuseOpportunities} = ${getReusableAssetsKpis().assetReuseRate}%.`,
      customSections: [
        {
          title: 'Reuse Rate Calculation',
          bullets: [
            `Successful reuse outcomes: ${getReusableAssetsKpis().totalReuseSuccessful}`,
            `Total reuse opportunities: ${getReusableAssetsKpis().totalReuseOpportunities}`,
            `Asset Reuse Rate = ${getReusableAssetsKpis().totalReuseSuccessful}/${getReusableAssetsKpis().totalReuseOpportunities} = ${getReusableAssetsKpis().assetReuseRate}%`,
          ],
        },
        {
          title: 'Top Reused Assets',
          records: topReusedAssets.map((asset) => ({
            id: asset.id,
            title: asset.name,
            detail: `${asset.service} · ${asset.category}`,
            meta: `Reuse count ${asset.reuseCount}`,
          })),
        },
        {
          title: 'Pending Expansion Assets',
          records: [...reusableDeliveryAssets]
            .sort((a, b) => a.reuseCount - b.reuseCount)
            .slice(0, 8)
            .map((asset) => ({
              id: asset.id,
              title: asset.name,
              detail: `${asset.service} · Reuse opportunities ${asset.reuseOpportunities}`,
              meta: `Current reuse ${asset.reuseSuccessful}`,
            })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 68 },
        { day: 'W2', value: 71 },
        { day: 'W3', value: 74 },
        { day: 'W4', value: getReusableAssetsKpis().assetReuseRate },
      ],
    }),

  'Delivery Hours Saved': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Delivery Hours Saved Trend',
      customTrendExplanation: `Delivery Hours Saved (${getReusableAssetsKpis().deliveryHoursSaved}) equals the sum of asset-level impact hours across reusable delivery assets.`,
      customSections: [
        {
          title: 'Hours Saved by Asset',
          records: reusableDeliveryAssets.map((asset) => ({
            id: asset.id,
            title: asset.name,
            detail: `${asset.service} · ${asset.category}`,
            meta: `${asset.impactHoursSaved} hours saved`,
          })),
        },
        {
          title: 'Total Calculation',
          bullets: [
            `Total hours saved = ${reusableDeliveryAssets.map((asset) => asset.impactHoursSaved).join(' + ')} = ${getReusableAssetsKpis().deliveryHoursSaved}`,
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 840 },
        { day: 'W2', value: 960 },
        { day: 'W3', value: 1115 },
        { day: 'W4', value: getReusableAssetsKpis().deliveryHoursSaved },
      ],
    }),

  'Active Asset Consumers': (state, ctx) =>
    buildPayload(ctx, {
      customMode: true,
      customTrendTitle: 'Active Asset Consumers Trend',
      customTrendExplanation: `Active Asset Consumers (${getReusableAssetsKpis().activeAssetConsumers}) counts unique teams actively using reusable delivery assets this cycle.`,
      customSections: [
        {
          title: `Consuming Teams (${getReusableAssetsKpis().activeAssetConsumers})`,
          records: activeConsumerTeams.map((team, idx) => ({
            id: `TEAM-${idx + 1}`,
            title: team,
            detail: 'Active consumer in current delivery cycle',
            meta: 'Consuming reusable assets',
          })),
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 8 },
        { day: 'W2', value: 9 },
        { day: 'W3', value: 11 },
        { day: 'W4', value: getReusableAssetsKpis().activeAssetConsumers },
      ],
    }),

  'Reports Generated': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.reports.reportTypes.map((r, i) => ({
        id: `RPT-${i}`,
        title: r.name,
        meta: r.type,
      })),
      supportingEvidence: [`Last export: ${state.reports.lastExport}`],
      relatedApplications: appsFromArchitecture(state).slice(0, 2),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.reports.generated * 3),
    }),

  'Scheduled Reports': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: state.reports.reportTypes.map((r, i) => ({
        id: `SCH-${i}`,
        title: r.name,
        meta: `Scheduled · ${r.type}`,
      })),
      supportingEvidence: [`${state.reports.scheduled} active schedules`],
      relatedApplications: appsFromArchitecture(state).slice(0, 2),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.reports.scheduled * 10),
    }),

  'Total AI Use Cases': (state, ctx) =>
    buildPayload(ctx, {
      sourceRecords: useCasesFromState(state).map((u) => ({
        id: u.id,
        title: u.name,
        detail: u.domain,
        meta: `${u.modelType} · ${u.status}`,
      })),
      supportingEvidence: [
        `Approved: ${useCasesFromState(state).filter((u) => u.status === 'Approved').length}`,
        `Pilot: ${useCasesFromState(state).filter((u) => u.status === 'Pilot').length}`,
        `In review: ${useCasesFromState(state).filter((u) => u.status === 'Review').length}`,
      ],
      relatedApplications: appsFromArchitecture(state).slice(0, 4),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state).slice(0, 2),
      historicalTrend: sparkline7d(useCasesFromState(state).length * 3),
    }),

  'Approved Models': (state, ctx) => {
    const approved = useCasesFromState(state).filter((u) => u.status === 'Approved');
    return buildPayload(ctx, {
      sourceRecords: approved.map((u) => ({
        id: u.id,
        title: u.name,
        detail: u.domain,
        meta: `${u.modelName} · ${u.riskTier} risk`,
      })),
      supportingEvidence: approved.map((u) => `Last review: ${u.lastReview} — ${u.name}`),
      relatedApplications: appsFromArchitecture(state).slice(0, 3),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state).slice(0, 2),
      historicalTrend: sparkline7d(approved.length * 8),
    });
  },

  'High Risk Use Cases': (state, ctx) => {
    const highRisk = useCasesFromState(state).filter((u) => u.riskTier === 'high');
    return buildPayload(ctx, {
      sourceRecords: highRisk.map((u) => ({
        id: u.id,
        title: u.name,
        detail: u.owner,
        meta: `${u.status} · ${u.domain}`,
      })),
      supportingEvidence: highRisk.flatMap((u) => u.controls.slice(0, 2)),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state).filter((i) => i.severity === 'critical' || i.severity === 'high'),
      relatedReleases: releasesFromState(state).filter((r) => r.risk === 'high'),
      historicalTrend: sparkline7d(highRisk.length * 10),
    });
  },

  'Pending Review': (state, ctx) => {
    const pending = useCasesFromState(state).filter((u) => u.status === 'Review');
    return buildPayload(ctx, {
      sourceRecords: pending.map((u) => ({
        id: u.id,
        title: u.name,
        detail: u.owner,
        meta: u.lastReview,
      })),
      supportingEvidence: pending.map((u) => u.reviewHistory[u.reviewHistory.length - 1]?.outcome ?? u.description),
      relatedApplications: appsFromArchitecture(state).slice(0, 2),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state).slice(0, 2),
      historicalTrend: sparkline7d(pending.length * 12),
    });
  },
};

/** @type {Record<string, (state: SimulationState, ctx: KpiDrilldownContext) => KpiDrilldownPayload>} */
const chartResolvers = {
  'governance-risk.register': (state, ctx) => {
    const risk = operationalRiskRegister.find((item) => item.id === ctx.segment);
    if (!risk) {
      return buildPayload(ctx, {
        sourceRecords: [{ id: ctx.segment ?? 'RISK', title: ctx.label, meta: String(ctx.value) }],
        supportingEvidence: ['Selected risk is not available in the operational risk register dataset.'],
        relatedApplications: [],
        relatedIncidents: [],
        relatedReleases: [],
      });
    }
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: `${risk.id} Residual Trend`,
      customTrendExplanation: `${risk.title} currently carries ${risk.residualRiskScore}% residual risk with ${risk.mitigationProgress}% mitigation completion.`,
      customSections: [
        {
          title: 'Risk Detail',
          records: [
            { id: risk.id, title: risk.title, detail: risk.description, meta: `${risk.domain} · ${risk.severity}` },
            { id: 'IMPACT', title: 'Business Impact', detail: risk.businessImpact, meta: `Owner: ${risk.owner}` },
            { id: 'CAUSE', title: 'Root Cause', detail: risk.rootCause, meta: `Trend: ${risk.trend}` },
            { id: 'CTRL', title: 'Controls', detail: risk.controls.join(' | '), meta: `Residual Risk: ${risk.residualRiskScore}%` },
            { id: 'MIT', title: 'Mitigation Plan', detail: risk.mitigationPlan, meta: `Due: ${risk.dueDate} · Progress: ${risk.mitigationProgress}% · ${risk.mitigationStatus}` },
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [{ name: risk.domain, status: risk.severity.toLowerCase() }],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'Jan', value: Math.min(95, risk.residualRiskScore + 6) },
        { day: 'Feb', value: Math.min(95, risk.residualRiskScore + 5) },
        { day: 'Mar', value: Math.min(95, risk.residualRiskScore + 4) },
        { day: 'Apr', value: Math.min(95, risk.residualRiskScore + 3) },
        { day: 'May', value: Math.min(95, risk.residualRiskScore + 1) },
        { day: 'Jun', value: risk.residualRiskScore },
      ],
    });
  },

  'ai-program-status.portfolio': (state, ctx) => {
    const initiative = aiInitiatives.find((item) => item.id === ctx.segment);
    if (!initiative) {
      return buildPayload(ctx, {
        sourceRecords: [{ id: ctx.segment ?? 'AI', title: ctx.label, meta: String(ctx.value) }],
        supportingEvidence: ['Selected initiative is not available in the active AI portfolio dataset.'],
        relatedApplications: [],
        relatedIncidents: [],
        relatedReleases: [],
      });
    }
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: `${initiative.name} Progress Trend`,
      customTrendExplanation: `${initiative.name} is currently ${initiative.progress}% complete with ${initiative.confidence}% delivery confidence.`,
      customSections: [
        {
          title: 'Program Profile',
          records: [
            { id: initiative.id, title: initiative.name, detail: `Objective: ${initiative.objective}`, meta: `Business Value: ${initiative.businessValue}` },
            { id: 'OWN', title: 'Owner & Status', detail: `Owner: ${initiative.owner}`, meta: `Status: ${initiative.status} · Progress: ${initiative.progress}% · Confidence: ${initiative.confidence}%` },
            { id: 'MS1', title: 'Completed Milestones', detail: initiative.milestonesCompleted.join(' | '), meta: 'Completed' },
            { id: 'MS2', title: 'Upcoming Milestones', detail: initiative.upcomingMilestones.join(' | '), meta: 'Upcoming' },
            { id: 'KPI', title: 'Program KPIs', detail: initiative.kpis.join(' | '), meta: 'Business KPIs' },
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [{ name: initiative.businessUnit, status: initiative.status.toLowerCase() }],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'Jan', value: Math.max(35, initiative.progress - 24) },
        { day: 'Feb', value: Math.max(40, initiative.progress - 18) },
        { day: 'Mar', value: Math.max(45, initiative.progress - 13) },
        { day: 'Apr', value: Math.max(50, initiative.progress - 9) },
        { day: 'May', value: Math.max(55, initiative.progress - 4) },
        { day: 'Jun', value: initiative.progress },
      ],
    });
  },

  'best-practices.library': (state, ctx) => {
    const practice = bestPracticeLibrary.find((item) => item.id === ctx.segment);
    if (!practice) {
      return buildPayload(ctx, {
        sourceRecords: [{ id: ctx.segment ?? 'BP', title: ctx.label, meta: String(ctx.value) }],
        supportingEvidence: ['Selected best practice is not available in the approved library dataset.'],
        relatedApplications: [],
        relatedIncidents: [],
        relatedReleases: [],
      });
    }
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: `${practice.id} Adoption Trend`,
      customTrendExplanation: `${practice.practice} is ${practice.status.toLowerCase()} for ${practice.impactedService} under ${practice.domain} domain ownership.`,
      customSections: [
        {
          title: 'Practice Detail',
          records: [
            { id: practice.id, title: practice.practice, detail: `Domain: ${practice.domain} · Owner: ${practice.owner}`, meta: `Status: ${practice.status}` },
            { id: 'OBJ', title: 'Objective', detail: practice.objective, meta: 'Why this practice exists' },
            { id: 'REA', title: 'Reason', detail: practice.reason, meta: `Impacted service: ${practice.impactedService}` },
            { id: 'REL', title: 'Related Lesson/Incident', detail: practice.relatedLessonIncident, meta: 'Evidence link' },
            { id: 'ADP', title: 'Adoption Status', detail: `${practice.status} in current review cycle`, meta: practice.status === 'Adopted' ? 'Operationalized' : 'Requires closure' },
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [{ name: practice.impactedService, status: practice.status === 'Adopted' ? 'low' : 'high' }],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: practice.status === 'Adopted' ? 55 : 35 },
        { day: 'W2', value: practice.status === 'Adopted' ? 68 : 40 },
        { day: 'W3', value: practice.status === 'Adopted' ? 81 : 46 },
        { day: 'W4', value: practice.status === 'Adopted' ? 100 : 52 },
      ],
    });
  },

  'best-practices.adoption-domain': (state, ctx) => {
    const domain = adoptionByDomain.find((item) => item.domain === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: bestPracticeLibrary
        .filter((practice) => !domain || practice.domain === domain.domain)
        .map((practice) => ({
          id: practice.id,
          title: practice.practice,
          detail: `${practice.impactedService} · ${practice.owner}`,
          meta: practice.status,
        })),
      supportingEvidence: [
        ...(domain ? [`${domain.domain} adoption: ${domain.adoptedRate}%`] : []),
        ...highRiskGaps.map((gap) => `${gap.service}: ${gap.missingPractice}`),
      ],
      relatedApplications: bestPracticeLibrary
        .filter((practice) => !domain || practice.domain === domain.domain)
        .slice(0, 5)
        .map((practice) => ({ name: practice.impactedService, status: practice.status === 'Adopted' ? 'low' : 'high' })),
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: adoptionByDomain.map((item, idx) => ({ day: `D${idx + 1}`, value: item.adoptedRate })),
    });
  },

  'reusable-assets.catalog': (state, ctx) => {
    const asset = reusableDeliveryAssets.find((item) => item.id === ctx.segment);
    if (!asset) {
      return buildPayload(ctx, {
        sourceRecords: [{ id: ctx.segment ?? 'ASSET', title: ctx.label, meta: String(ctx.value) }],
        supportingEvidence: ['Selected asset is not available in reusable delivery asset catalog.'],
        relatedApplications: [],
        relatedIncidents: [],
        relatedReleases: [],
      });
    }
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: `${asset.id} Reuse Trend`,
      customTrendExplanation: `${asset.name} currently has ${asset.reuseCount} reuses across active delivery teams.`,
      customSections: [
        {
          title: 'Asset Profile',
          records: [
            { id: asset.id, title: asset.name, detail: `${asset.category} · ${asset.service} · Owner: ${asset.owner}`, meta: `Last updated: ${asset.lastUpdated}` },
            { id: 'DESC', title: 'Description', detail: asset.description, meta: 'Purpose' },
            { id: 'HIST', title: 'Reuse History', detail: asset.reuseHistory.join(' | '), meta: 'Recent usage trail' },
            { id: 'CONS', title: 'Consumers', detail: asset.consumers.join(' | '), meta: `${asset.consumers.length} consuming teams` },
            { id: 'IMPT', title: 'Business Impact', detail: asset.businessImpact, meta: `${asset.impactHoursSaved} hours saved` },
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [{ name: asset.service, status: asset.reuseCount >= 10 ? 'low' : 'medium' }],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: Math.max(1, asset.reuseCount - 6) },
        { day: 'W2', value: Math.max(2, asset.reuseCount - 4) },
        { day: 'W3', value: Math.max(3, asset.reuseCount - 2) },
        { day: 'W4', value: asset.reuseCount },
      ],
    });
  },

  'reusable-assets.impact': (state, ctx) => {
    return buildPayload(ctx, {
      sourceRecords: [
        { id: 'IMP-1', title: 'Hours Saved', detail: 'Summed asset impact hours', meta: String(getReusableAssetsKpis().deliveryHoursSaved) },
        { id: 'IMP-2', title: 'Faster Delivery', detail: 'Cycle-time reduction from reusable templates/checklists', meta: '28%' },
        { id: 'IMP-3', title: 'Reduced Incidents', detail: 'Fewer rollout errors due to standardized runbooks', meta: '17%' },
        { id: 'IMP-4', title: 'Reduced Audit Effort', detail: 'Lower manual evidence preparation due to control packs', meta: '22%' },
      ],
      supportingEvidence: [
        `Top contributors: ${topReusedAssets.slice(0, 3).map((asset) => asset.name).join(' | ')}`,
        `Active consumers: ${activeConsumerTeams.join(', ')}`,
      ],
      relatedApplications: topReusedAssets.slice(0, 5).map((asset) => ({ name: asset.service, status: 'low' })),
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: 860 },
        { day: 'W2', value: 980 },
        { day: 'W3', value: 1120 },
        { day: 'W4', value: getReusableAssetsKpis().deliveryHoursSaved },
      ],
    });
  },

  'lessons.repository': (state, ctx) => {
    const lesson = lessonsRepository.find((item) => item.id === ctx.segment);
    if (!lesson) {
      return buildPayload(ctx, {
        sourceRecords: [{ id: ctx.segment ?? 'LSN', title: ctx.label, meta: String(ctx.value) }],
        supportingEvidence: ['Selected lesson is not available in lessons repository dataset.'],
        relatedApplications: [],
        relatedIncidents: [],
        relatedReleases: [],
      });
    }
    const implementation = implementationTracker.find((item) => item.lessonId === lesson.id);
    return buildPayload(ctx, {
      customMode: true,
      customTrendTitle: `${lesson.id} Implementation Trend`,
      customTrendExplanation: `${lesson.lesson} is tracked under ${lesson.source} with current status ${lesson.status}.`,
      customSections: [
        {
          title: 'Lesson Detail',
          records: [
            { id: lesson.id, title: lesson.lesson, detail: `Service: ${lesson.service} · Owner: ${lesson.owner}`, meta: `${lesson.date} · ${lesson.severity}` },
            { id: 'SRC', title: 'Source', detail: lesson.source, meta: `Status: ${lesson.status}` },
            { id: 'RSN', title: 'Reason', detail: lesson.reason, meta: 'Learning rationale' },
            { id: 'IMP', title: 'Implementation', detail: implementation?.actionTaken ?? 'Planned action pending', meta: implementation ? `${implementation.completion}% complete` : 'No action yet' },
          ],
        },
      ],
      sourceRecords: [],
      supportingEvidence: [],
      relatedApplications: [{ name: lesson.service, status: lesson.status === 'Implemented' ? 'low' : 'high' }],
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: [
        { day: 'W1', value: lesson.status === 'Implemented' ? 30 : 20 },
        { day: 'W2', value: lesson.status === 'Implemented' ? 55 : 30 },
        { day: 'W3', value: lesson.status === 'Implemented' ? 80 : 40 },
        { day: 'W4', value: lesson.status === 'Implemented' ? 100 : lesson.status === 'In Progress' ? 70 : 45 },
      ],
    });
  },

  'lessons.recurrence-trend': (state, ctx) => {
    return buildPayload(ctx, {
      sourceRecords: recurrenceTrend.map((point) => ({
        id: point.month,
        title: `${point.month} recurrence snapshot`,
        detail: `Recurring: ${point.recurring}, Prevented: ${point.prevented}`,
        meta: `Net recurring trend ${(point.recurring - point.prevented)}`,
      })),
      supportingEvidence: [
        'Baseline recurring incidents: 20',
        'Current recurring incidents: 17',
        'Reduction from baseline: 15%',
        ...remainingProblemAreas.map((area) => `Remaining area: ${area}`),
      ],
      relatedApplications: lessonsRepository.slice(0, 5).map((lesson) => ({ name: lesson.service, status: lesson.severity })),
      relatedIncidents: [],
      relatedReleases: [],
      historicalTrend: recurrenceTrend.map((point) => ({ day: point.month, value: point.recurring })),
    });
  },

  'executive.risk-by-phase': (state, ctx) => {
    const phase = ctx.segment ?? '';
    const phaseReqs = state.requirements.topRiskRequirements.filter((_, i) => {
      const phases = ['Requirements', 'Architecture', 'Development', 'Testing'];
      return phases[i % phases.length] === phase || phase === '';
    });
    return buildPayload(ctx, {
      sourceRecords: phaseReqs.length
        ? phaseReqs.map((r) => ({ id: r.id, title: r.title, detail: r.domain, meta: r.risk }))
        : [{ id: phase, title: `${phase} phase risks`, meta: `${state.executive.riskByPhase.find((p) => p.name === phase)?.value ?? 0} open` }],
      supportingEvidence: state.requirements.topRiskRequirements.map((r) => `${r.id} — ${r.title}`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.executive.riskByPhase.find((p) => p.name === phase)?.value ?? 5 * 10),
    });
  },

  'executive.business-impact': (state, ctx) => {
    const area = state.executive.businessImpactAreas.find((a) => a.name === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: state.delivery.topRequirements.map((r) => ({
        id: r.id, title: r.title, detail: r.impact, meta: r.domain,
      })),
      supportingEvidence: [`${ctx.segment} impact score: ${area?.value ?? ctx.value}%`, ...state.dynamicInsights.slice(0, 2)],
      relatedApplications: appsFromArchitecture(state).slice(0, 4),
      relatedIncidents: incidentsFromState(state).slice(0, 3),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(area?.value ?? 85),
    });
  },

  'finding-severity': (state, ctx) => {
    const severity = (ctx.segment ?? '').toLowerCase();
    const findings = state.governance.topFindings.filter((f) => !severity || f.severity === severity);
    return buildPayload(ctx, {
      sourceRecords: findings.map((f, i) => ({ id: `FND-${i}`, title: f.title, meta: f.severity })),
      supportingEvidence: state.governance.auditTrail.map((a) => `${a.event} (${a.time})`),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status !== 'low'),
      relatedIncidents: incidentsFromState(state).filter((i) => !severity || i.severity === severity),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.governance.governanceScore),
    });
  },

  'requirements.risk-distribution': (state, ctx) => {
    const risk = (ctx.segment ?? '').toLowerCase();
    const reqs = state.requirements.topRiskRequirements.filter((r) => !risk || r.risk === risk);
    return buildPayload(ctx, {
      sourceRecords: reqs.map((r) => ({ id: r.id, title: r.title, detail: r.domain, meta: r.impact })),
      supportingEvidence: state.requirements.complianceBreakdown.map((c) => `${c.name}: ${c.count}`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.requirements.qualityScore),
    });
  },

  'requirements.compliance-breakdown': (state, ctx) => {
    const item = state.requirements.complianceBreakdown.find((c) => c.name === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: state.requirements.topRiskRequirements
        .filter((r) => r.impact === 'Compliance' || r.domain === 'Payments')
        .map((r) => ({ id: r.id, title: r.title, meta: r.risk })),
      supportingEvidence: state.governance.complianceStandards.map((s) => `${s.name}: ${s.score}%`),
      relatedApplications: appsFromArchitecture(state).slice(0, 3),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state).filter((r) => r.domain === 'Payments'),
      historicalTrend: sparkline7d((item?.count ?? 1) * 10),
    });
  },

  'requirements.quality-gauge': (state, ctx) => resolvers['Requirements Analysed'](state, { ...ctx, label: 'Requirements Analysed', value: state.requirements.analysed, suffix: '' }),

  'governance.compliance-standards': (state, ctx) => {
    const std = state.governance.complianceStandards.find((s) => s.name === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: state.governance.topFindings.map((f, i) => ({ id: `GOV-${i}`, title: f.title, meta: f.severity })),
      supportingEvidence: [`${ctx.segment} compliance: ${std?.score ?? ctx.value}%`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(std?.score ?? 90),
    });
  },

  'governance.gauge': (state, ctx) => resolvers['Governance Health'](state, { ...ctx, label: 'Governance Health', value: state.governance.governanceScore }),

  'governance.compliance-gauge': (state, ctx) => {
    const score = ctx.segment === 'Baseline'
      ? state.governance.baselineCompliance
      : state.governance.policyCompliance;
    return buildPayload(ctx, {
      sourceRecords: state.governance.complianceStandards.map((s) => ({ id: s.name, title: s.name, meta: `${s.score}%` })),
      supportingEvidence: state.governance.auditTrail.map((a) => `${a.event} (${a.time})`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(score),
    });
  },

  'operations.health-gauge': (state, ctx) => resolvers['Batch Health'](state, { ...ctx, label: 'Batch Health', value: state.operations.operationalHealth }),

  'operations.batch-jobs': (state, ctx) => {
    const job = state.operations.batchJobs.find((j) => j.name === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: job ? [{ id: job.name, title: job.name, meta: `${job.status} · ${job.progress}%` }] : [],
      supportingEvidence: state.operations.operationalRisks.map((r) => `${r.title} (${r.severity})`),
      relatedApplications: appsFromArchitecture(state).slice(0, 3),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.operations.batchHealth),
    });
  },

  'release.confidence-gauge': (state, ctx) => resolvers['Release Confidence'](state, { ...ctx, label: 'Release Confidence', value: state.release.confidence }),

  'release.readiness-dimension': (state, ctx) => {
    const dim = state.release.readiness.find((r) => r.dimension === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: state.release.checklist.map((c, i) => ({ id: `CHK-${i}`, title: c.item, meta: c.status })),
      supportingEvidence: [`${ctx.segment}: ${dim?.score ?? ctx.value}% · ${dim?.status ?? ''}`],
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(dim?.score ?? state.release.confidence),
    });
  },

  'architecture.layer-readiness': (state, ctx) => {
    const layer = state.architecture.layerReadiness.find((l) => l.label === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: state.architecture.techRisks.map((r, i) => ({ id: `AR-${i}`, title: r.title, meta: r.severity })),
      supportingEvidence: state.architecture.recommendations,
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(layer?.value ?? state.architecture.readiness),
    });
  },

  'testing.coverage-heatmap': (state, ctx) => {
    const [rowLabel, colLabel] = (ctx.segment ?? '|').split('|');
    return buildPayload(ctx, {
      sourceRecords: state.testing.aiRecommendations.map((r, i) => ({ id: `REC-${i}`, title: r })),
      supportingEvidence: [`${rowLabel} · ${colLabel}: ${ctx.value}% coverage`, ...state.testing.aiRecommendations],
      relatedApplications: appsFromArchitecture(state).filter((a) => rowLabel && a.name.includes(rowLabel.split(' ')[0])),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(Number(ctx.value) || state.testing.coverage),
    });
  },

  'delivery.pipeline-velocity': (state, ctx) => {
    const stage = state.delivery.pipelineVelocity.find((p) => p.stage === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: state.delivery.topRequirements.map((r) => ({ id: r.id, title: r.title, meta: r.domain })),
      supportingEvidence: [`${ctx.segment}: ${stage?.count ?? ctx.value} items · avg ${stage?.avgDays ?? '—'}d`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 2),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d((stage?.count ?? 30) + 60),
    });
  },

  'delivery.sprint-burndown': (state, ctx) => {
    const [day, series] = (ctx.segment ?? '|').split('|');
    const point = state.delivery.sprintBurndown.find((p) => p.day === day);
    const val = series === 'planned' ? point?.planned : point?.actual;
    return buildPayload(ctx, {
      sourceRecords: state.delivery.topRequirements.map((r) => ({ id: r.id, title: r.title, meta: r.risk })),
      supportingEvidence: [`${day} ${series}: ${val ?? ctx.value}% remaining`],
      relatedApplications: appsFromArchitecture(state).slice(0, 3),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.delivery.sprintBurndown.map((p) => ({ day: p.day, value: p.actual })),
    });
  },

  'development.pr-aging': (state, ctx) => {
    const bucket = state.development.prAging.find((p) => p.range === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: state.development.securityItems.map((s, i) => ({ id: `PR-${i}`, title: s.title, meta: s.severity })),
      supportingEvidence: [`${ctx.segment}: ${bucket?.count ?? ctx.value} pull requests`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.commitTrend.map((p) => ({ day: p.week, value: p.prs })),
    });
  },

  'development.commit-trend': (state, ctx) => {
    const [week, series] = (ctx.segment ?? '|').split('|');
    const point = state.development.commitTrend.find((p) => p.week === week);
    const val = series === 'prs' ? point?.prs : point?.commits;
    return buildPayload(ctx, {
      sourceRecords: state.development.securityItems.map((s, i) => ({ id: `CM-${i}`, title: s.title, meta: s.severity })),
      supportingEvidence: [`${week} — ${series ?? 'commits'}: ${val ?? ctx.value}`],
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.commitTrend.map((p) => ({ day: p.week, value: p.commits })),
    });
  },

  'production.incident-trend': (state, ctx) => {
    const day = incidentTrend7d.find((p) => p.day === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: getOpenIncidents().map((i) => ({
        id: i.id, title: i.service, detail: i.owner, meta: `${i.severity} · ${i.status}`,
      })),
      supportingEvidence: incidentOperationsData.map((i) => `${i.id}: ${i.rca}`),
      relatedApplications: getOpenIncidents().map((i) => ({ name: i.service, status: i.severity })),
      relatedIncidents: getOpenIncidents().map((i) => ({ id: i.id, title: i.service, severity: i.severity })),
      relatedReleases: releasesFromState(state),
      historicalTrend: incidentTrend7d.map((p) => ({ day: p.day, value: p.value })),
    });
  },

  'requirements.top-risk': (state, ctx) => {
    const req = state.requirements.topRiskRequirements.find((r) => r.id === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: req ? [{ id: req.id, title: req.title, detail: req.domain, meta: `${req.risk} · ${req.impact}` }] : [],
      supportingEvidence: state.requirements.complianceBreakdown.map((c) => `${c.name}: ${c.count}`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).filter((i) => i.domain === req?.domain),
      relatedReleases: releasesFromState(state).filter((r) => r.domain === req?.domain),
      historicalTrend: sparkline7d(state.requirements.qualityScore),
    });
  },

  'delivery.top-requirements': (state, ctx) => {
    const req = state.delivery.topRequirements.find((r) => r.id === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: req ? [{ id: req.id, title: req.title, detail: req.domain, meta: req.risk }] : [],
      supportingEvidence: state.delivery.pipelineVelocity.map((p) => `${p.stage}: ${p.count} items`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.delivery.businessImpactIndex),
    });
  },

  'release.in-flight': (state, ctx) => {
    const rel = state.release.releases.find((r) => r.id === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: state.release.checklist.map((c, i) => ({ id: `CHK-${i}`, title: c.item, meta: c.status })),
      supportingEvidence: state.release.riskMatrix.map((r) => r.title),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status === 'critical'),
      relatedIncidents: incidentsFromState(state).filter((i) => i.domain === rel?.domain),
      relatedReleases: rel ? [{ id: rel.id, name: rel.name, confidence: rel.confidence, risk: rel.risk }] : releasesFromState(state),
      historicalTrend: sparkline7d(rel?.confidence ?? state.release.confidence),
    });
  },

  'release.risk-matrix': (state, ctx) => {
    const risk = state.release.riskMatrix.find((r) => r.title === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: risk ? [{ id: 'RISK-1', title: risk.title, detail: risk.domain, meta: risk.severity }] : [],
      supportingEvidence: state.release.checklist.map((c) => `${c.item}: ${c.status}`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state).filter((r) => r.domain === risk?.domain),
      historicalTrend: sparkline7d(state.release.confidence),
    });
  },

  'governance.top-findings': (state, ctx) => {
    const finding = state.governance.topFindings.find((f) => f.title === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: finding ? [{ id: 'FND-1', title: finding.title, meta: finding.severity }] : [],
      supportingEvidence: state.governance.auditTrail.map((a) => `${a.time} — ${a.event}`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(state.governance.governanceScore),
    });
  },

  'production.open-incidents': (state, ctx) => {
    const inc = incidentOperationsData.find((i) => i.id === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: inc ? [{ id: inc.id, title: inc.service, detail: inc.impact, meta: `${inc.severity.toUpperCase()} · ${inc.status}` }] : [],
      supportingEvidence: inc ? [inc.rca, `Escalation: ${inc.escalationStatus}`, `Mitigation progress: ${inc.mitigationProgress}%`] : incidentOperationsData.map((i) => i.rca),
      relatedApplications: (inc ? [inc] : getOpenIncidents()).map((i) => ({ name: i.service, status: i.severity })),
      relatedIncidents: (inc ? [inc] : getOpenIncidents()).map((i) => ({ id: i.id, title: i.service, severity: i.severity })),
      relatedReleases: releasesFromState(state),
      historicalTrend: inc?.timeline.map((event, idx) => ({ day: `${idx + 1}`, value: (idx + 1) * 12 + 20 })) ?? incidentTrend7d.map((p) => ({ day: p.day, value: p.value })),
    });
  },

  'production.service-health': (state, ctx) => {
    const svc = state.production.serviceHealth.find((s) => s.name === ctx.segment);
    const issue = state.production.topIssues.find((i) => i.issue.includes((ctx.segment ?? '').split(' ')[0]));
    return buildPayload(ctx, {
      sourceRecords: svc ? [{ id: svc.name, title: svc.name, meta: `${svc.uptime}% uptime · ${svc.status}` }] : [],
      supportingEvidence: issue ? [issue.rca] : [],
      relatedApplications: [{ name: ctx.segment ?? '', status: svc?.status }],
      relatedIncidents: incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: sparkline7d(svc?.uptime ?? state.production.health),
    });
  },

  'development.security-items': (state, ctx) => {
    const item = state.development.securityItems.find((s) => s.title === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: item ? [{ id: 'SEC-1', title: item.title, meta: item.severity }] : [],
      supportingEvidence: state.development.prAging.map((p) => `${p.range}: ${p.count} PRs`),
      relatedApplications: appsFromArchitecture(state),
      relatedIncidents: incidentsFromState(state).slice(0, 1),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.development.qualityTrend.map((p) => ({ day: p.month, value: p.quality })),
    });
  },

  'executive.critical-incidents': (state, ctx) => {
    const inc = state.executive.criticalIncidents.find((i) => i.id === ctx.segment);
    return buildPayload(ctx, {
      sourceRecords: inc ? [{ id: inc.id, title: inc.title, detail: inc.domain, meta: `${inc.severity} · ${inc.duration}` }] : [],
      supportingEvidence: state.production.topIssues.map((i) => i.rca),
      relatedApplications: appsFromArchitecture(state).filter((a) => a.status !== 'healthy'),
      relatedIncidents: inc ? [{ id: inc.id, title: inc.title, severity: inc.severity, domain: inc.domain }] : incidentsFromState(state),
      relatedReleases: releasesFromState(state),
      historicalTrend: state.production.incidentTrend.map((p) => ({ day: p.day, value: p.count })),
    });
  },

  'ai-governance.use-case-registry': (state, ctx) => {
    const uc = useCasesFromState(state).find((u) => u.id === ctx.segment);
    if (!uc) {
      return buildPayload(ctx, {
        sourceRecords: [{ id: ctx.segment ?? '—', title: ctx.label, meta: String(ctx.value) }],
        supportingEvidence: state.dynamicInsights.slice(0, 3),
        relatedApplications: appsFromArchitecture(state),
        relatedIncidents: incidentsFromState(state),
        relatedReleases: releasesFromState(state),
      });
    }
    return buildUseCaseDrilldown(state, uc, ctx);
  },
};

/**
 * @param {KpiDrilldownContext} ctx
 * @param {SimulationState} state
 * @returns {KpiDrilldownPayload}
 */
function resolveChartDrilldown(ctx, state) {
  const resolver = chartResolvers[ctx.chartId ?? ''];
  if (resolver) return resolver(state, ctx);

  return buildPayload(ctx, {
    sourceRecords: [{ id: ctx.segment ?? '—', title: ctx.label, meta: String(ctx.value) }],
    supportingEvidence: state.dynamicInsights.slice(0, 3),
    relatedApplications: appsFromArchitecture(state),
    relatedIncidents: incidentsFromState(state),
    relatedReleases: releasesFromState(state),
  });
}

/**
 * @param {KpiDrilldownContext} ctx
 * @param {SimulationState} state
 * @returns {KpiDrilldownPayload}
 */
export function resolveKpiDrilldown(ctx, state) {
  if (ctx.chartId) return resolveChartDrilldown(ctx, state);

  const resolver = resolvers[ctx.label];
  if (resolver) return resolver(state, ctx);

  return buildPayload(ctx, {
    sourceRecords: state.requirements.topRiskRequirements.slice(0, 4).map((r) => ({
      id: r.id,
      title: r.title,
      meta: r.domain,
    })),
    supportingEvidence: state.dynamicInsights.slice(0, 3),
    relatedApplications: appsFromArchitecture(state),
    relatedIncidents: incidentsFromState(state),
    relatedReleases: releasesFromState(state),
  });
}
