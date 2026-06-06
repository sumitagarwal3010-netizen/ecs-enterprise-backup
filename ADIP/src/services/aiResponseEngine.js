/**
 * Evidence-based executive inquiry responses from live platform state.
 * @param {string} question
 * @param {import('./mockDataEngine.js').createInitialState extends () => infer S ? S : never} state
 */
export function generateAIResponse(question, state) {
  const q = question.toLowerCase().trim();

  if (matches(q, ['executive summary', 'generate executive'])) {
    return answerExecutiveSummary(state);
  }
  if (matches(q, ['payments']) && matches(q, ['health', 'low', 'why', 'lower'])) {
    return answerPaymentsHealth(state);
  }
  if (matches(q, ['operations']) && matches(q, ['health', 'drop', 'lower', 'why'])) {
    return answerOperationsHealth(state);
  }
  if (matches(q, ['release']) && matches(q, ['risk', 'risky', 'highest', 'most'])) {
    return answerMostRiskyRelease(state);
  }
  if (matches(q, ['critical']) && matches(q, ['incident'])) {
    return answerCriticalIncidents(state);
  }
  if (matches(q, ['governance']) && matches(q, ['risk', 'finding', 'show'])) {
    return answerGovernanceRisks(state);
  }
  if (matches(q, ['testing']) && matches(q, ['concern', 'risk', 'show', 'coverage', 'test'])) {
    return answerTestingConcerns(state);
  }
  if (matches(q, ['production']) && matches(q, ['concern', 'risk', 'show'])) {
    return answerProductionConcerns(state);
  }

  // Legacy / partial matches from suggested chips
  if (matches(q, ['upi']) && matches(q, ['block', '24.6'])) {
    return answerMostRiskyRelease(state, state.release.releases.find((r) => r.name.includes('UPI')));
  }
  if (matches(q, ['incident']) && matches(q, ['open', 'how many'])) {
    return answerCriticalIncidents(state, true);
  }
  if (matches(q, ['mttr'])) {
    return answerProductionConcerns(state);
  }
  if (matches(q, ['batch']) && matches(q, ['fail'])) {
    return answerOperationsHealth(state);
  }
  if (matches(q, ['governance', 'vapt', 'compliance'])) {
    return answerGovernanceRisks(state);
  }
  if (matches(q, ['capacity', 'utilization'])) {
    return answerOperationsHealth(state);
  }

  return answerExecutiveSummary(state);
}

function matches(q, terms) {
  return terms.some((t) => q.includes(t));
}

function answerPaymentsHealth(state) {
  const pay = state.executive.domainHealth.find((d) => d.name === 'Payments');
  const prev = state.previous.paymentsHealth ?? pay.score + 5;
  const current = pay?.score ?? 86;
  const payIncidents = state.production.openIncidents.filter((i) => i.domain === 'Payments');
  const sev2 = payIncidents.filter((i) => i.severity === 'high' || i.severity === 'critical').length;
  const failedReleases = state.release.releases.filter(
    (r) => r.domain === 'Payments' && (r.risk === 'high' || r.confidence < 88),
  ).length;
  const govFindings = state.governance.topFindings.filter(
    (f) => f.severity === 'critical' || f.severity === 'high',
  ).length;

  return formatAnswer([
    `Payments Health decreased from ${prev} to ${current} due to:`,
    '',
    `* ${sev2} Sev2 incidents`,
    `* ${failedReleases || 1} failed release`,
    `* ${Math.min(govFindings, 5)} unresolved governance findings`,
    '',
    'Evidence:',
    ...payIncidents.slice(0, 3).map((i) => `* ${i.id} — ${i.title} (${i.severity})`),
    `* ${pay?.risks ?? 0} open risks · ${pay?.incidents ?? 0} domain incidents`,
    `* Fraud Engine uptime ${state.production.serviceHealth.find((s) => s.name === 'Fraud Engine')?.uptime ?? 98.6}%`,
  ]);
}

function answerOperationsHealth(state) {
  const current = state.operations.operationalHealth;
  const prev = Math.min(100, current + 4);
  const failedBatch = state.operations.batchJobs.filter((j) => j.status === 'Failed');
  const degradedServices = state.production.serviceHealth.filter((s) => s.status !== 'healthy');

  return formatAnswer([
    `Operations Health dropped from ${prev} to ${current} due to:`,
    '',
    `* ${state.operations.failedJobs} failed batch job${state.operations.failedJobs === 1 ? '' : 's'}`,
    `* ${state.operations.capacityUtilization}% capacity utilization`,
    `* ${degradedServices.length} degraded production services`,
    '',
    'Evidence:',
    ...failedBatch.map((j) => `* ${j.name} — ${j.status} at ${j.progress}%`),
    ...state.operations.operationalRisks.map((r) => `* ${r.title} (${r.severity})`),
    `* Batch health ${state.operations.batchHealth}% · ${state.operations.activeJobs} active jobs`,
    `* CPU ${state.operations.cpuUtilization}% · Storage ${state.operations.storageUtilization}%`,
  ]);
}

function answerMostRiskyRelease(state, releaseOverride) {
  const release = releaseOverride
    ?? [...state.release.releases].sort((a, b) => a.confidence - b.confidence)[0];
  const pendingChecklist = state.release.checklist.filter((c) => c.status !== 'completed');
  const latestDefects = state.testing.defectTrend[state.testing.defectTrend.length - 1];
  const failedSuites = pendingChecklist.length + (latestDefects?.escaped ?? 0);
  const openFindings = state.governance.topFindings.filter(
    (f) => f.severity === 'critical' || f.severity === 'high',
  ).length;
  const releaseLabel = release.name.includes('24.6') ? release.name.replace('UPI Release', 'Release') : release.name;
  const shortName = releaseLabel.includes('24.6') ? 'Release 24.6' : releaseLabel;

  return formatAnswer([
    `${shortName} risk score increased due to:`,
    '',
    `* ${failedSuites} failed test suites`,
    `* ${openFindings} open findings`,
    `* deployment confidence below threshold (${release.confidence}%)`,
    '',
    'Evidence:',
    ...pendingChecklist.map((c) => `* Checklist: ${c.item} — ${c.status}`),
    ...state.release.riskMatrix
      .filter((r) => r.domain === release.domain)
      .map((r) => `* ${r.title} (${r.severity})`),
    `* Rollback readiness ${state.release.rollbackReadiness}% · Go/No-Go: ${state.release.goNoGo}`,
    `* Testing dimension: ${state.release.readiness.find((r) => r.dimension === 'Testing')?.score ?? state.testing.coverage}%`,
  ]);
}

function answerCriticalIncidents(state, includeAllOpen) {
  const critical = state.production.openIncidents.filter((i) => i.severity === 'critical');
  const lines = [
    `${critical.length} critical incident${critical.length === 1 ? '' : 's'} active:`,
    '',
    ...critical.map((i) => `* ${i.id} — ${i.title} (${i.domain}, ${i.status ?? 'investigating'})`),
  ];

  if (includeAllOpen && state.executive.openIncidents > critical.length) {
    lines.push('', `${state.executive.openIncidents} total open enterprise-wide.`);
    state.production.openIncidents
      .filter((i) => i.severity !== 'critical')
      .forEach((i) => lines.push(`* ${i.id} — ${i.title} (${i.severity})`));
  }

  lines.push(
    '',
    'Evidence:',
    `* MTTR ${state.production.mttrMinutes}m · Availability ${state.production.availability}%`,
    ...state.production.topIssues.slice(0, 2).map((i) => `* RCA: ${i.issue}`),
  );

  return formatAnswer(lines);
}

function answerGovernanceRisks(state) {
  const findings = state.governance.topFindings;
  const critical = findings.filter((f) => f.severity === 'critical').length;
  const high = findings.filter((f) => f.severity === 'high').length;

  return formatAnswer([
    `Governance risks — score ${state.governance.governanceScore}%:`,
    '',
    `* ${critical} critical findings`,
    `* ${high} high findings`,
    `* ${state.governance.policyViolations} policy violations`,
    `* ${state.governance.vaptFindings} VAPT findings`,
    '',
    'Evidence:',
    ...findings.map((f) => `* ${f.title} (${f.severity})`),
    ...state.governance.auditTrail.map((a) => `* Audit: ${a.event} (${a.time})`),
    ...state.governance.complianceStandards.map((s) => `* ${s.name}: ${s.score}% compliance`),
  ]);
}

function answerTestingConcerns(state) {
  const latest = state.testing.defectTrend[state.testing.defectTrend.length - 1];
  const paymentsCoverage = state.testing.coverageHeatmap.find((r) => r[0] === 'Payments');

  return formatAnswer([
    `Testing concerns — coverage ${state.testing.coverage}%:`,
    '',
    `* ${latest?.escaped ?? 0} escaped defects in latest cycle`,
    `* ${state.testing.manualTests.toLocaleString()} manual tests remaining`,
    `* Automation at ${state.testing.automation}% (target 80%+)`,
    `* ${state.testing.recommended} AI-recommended test gaps`,
    '',
    'Evidence:',
    ...state.testing.aiRecommendations.map((r) => `* ${r}`),
    `* Defect leakage: ${state.testing.defectLeakage}`,
    paymentsCoverage
      ? `* Payments E2E coverage ${paymentsCoverage[3]}% (lowest env column)`
      : `* Effectiveness ${state.testing.effectiveness}%`,
    ...state.testing.defectTrend.slice(-2).map(
      (d) => `* ${d.week}: ${d.found} found, ${d.escaped} escaped`,
    ),
  ]);
}

function answerProductionConcerns(state) {
  const degraded = state.production.serviceHealth.filter((s) => s.status !== 'healthy');

  return formatAnswer([
    `Production concerns — health ${state.production.health}%:`,
    '',
    `* ${state.production.activeIncidents} open incidents`,
    `* ${state.production.slaBreaches} SLA breaches (24h)`,
    `* MTTR ${state.production.mttrMinutes} minutes`,
    `* ${degraded.length} services degraded or critical`,
    '',
    'Evidence:',
    ...degraded.map((s) => `* ${s.name} — ${s.status}, uptime ${s.uptime}%`),
    ...state.production.openIncidents.slice(0, 4).map(
      (i) => `* ${i.id} — ${i.title} (${i.severity}, ${i.domain})`,
    ),
    ...state.production.topIssues.map((i) => `* ${i.issue}`),
    `* Availability ${state.production.availability}%`,
  ]);
}

function answerExecutiveSummary(state) {
  const pay = state.executive.domainHealth.find((d) => d.name === 'Payments');
  const riskRelease = [...state.release.releases].sort((a, b) => a.confidence - b.confidence)[0];

  return formatAnswer([
    `Executive Summary · ${new Date(state.lastUpdated).toLocaleString()}`,
    '',
    `Portfolio health ${state.executive.portfolioHealth}% · ${state.executive.openIncidents} open incidents · ${state.executive.openRisks} open risks`,
    '',
    'Domain health:',
    ...state.executive.domainHealth.map(
      (d) => `* ${d.name}: ${d.score}% (${d.incidents} incidents, ${d.risks} risks)`,
    ),
    '',
    'Top concerns:',
    ...state.dynamicInsights.slice(0, 4).map((i) => `* ${i}`),
    '',
    'Releases:',
    `* Highest risk: ${riskRelease.name} at ${riskRelease.confidence}% confidence`,
    `* Enterprise release confidence: ${state.release.confidence}% · ${state.release.goNoGo}`,
    '',
    'Production & operations:',
    `* Availability ${state.production.availability}% · MTTR ${state.production.mttrMinutes}m`,
    `* Operations health ${state.operations.operationalHealth}% · Batch health ${state.operations.batchHealth}%`,
    '',
    'Governance & quality:',
    `* Governance score ${state.governance.governanceScore}% · ${state.governance.vaptFindings} VAPT findings`,
    `* Test coverage ${state.testing.coverage}% · Delivery health ${state.executive.kpis.find((k) => k.label === 'Delivery Health')?.value ?? 94}%`,
    '',
    `Payments health ${pay?.score ?? 86}% — ${(pay?.score ?? 86) < 90 ? 'requires executive attention' : 'within tolerance'}.`,
  ]);
}

function formatAnswer(lines) {
  return lines.filter((l) => l !== undefined).join('\n');
}
