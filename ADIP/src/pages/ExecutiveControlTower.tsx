import { Box, Grid, Typography, Button, LinearProgress } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { DrilldownTableRow } from '../components/common/DrilldownTableRow';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { SeverityChip } from '../components/common/SeverityChip';
import { DonutChart } from '../components/charts/DonutChart';
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { colors } from '../theme/colors';
import { useFilteredSimulation } from '../hooks/useFilteredSimulation';

export function ExecutiveControlTower() {
  const { executive, release, governance, learning, dynamicInsights, previous } = useFilteredSimulation();
  const releaseConfidenceDelta = Number((release.confidence - (previous?.releaseConfidence ?? release.confidence)).toFixed(1));
  const isConfidenceUp = releaseConfidenceDelta >= 0;
  const openBlockers = release.checklist.filter((item) => item.status !== 'completed').length;
  const testingReadiness = release.readiness.find((r) => r.dimension === 'Testing')?.score ?? release.confidence;
  const deploymentReadiness = release.deploymentReadiness;
  const governanceReadiness = release.readiness.find((r) => r.dimension === 'Governance')?.score ?? governance.policyCompliance;
  const releaseExplanation = `Confidence ${release.confidence}% reflects testing readiness (${testingReadiness}%), deployment readiness (${deploymentReadiness}%), governance readiness (${governanceReadiness}%), and ${openBlockers} open blocker${openBlockers === 1 ? '' : 's'}.`;
  const phaseTrendDirection = executive.riskByPhase.reduce<Record<string, 'up' | 'down' | 'flat'>>((acc, phase) => {
    const baseline = phase.name === 'Requirements' ? 6 : phase.name === 'Architecture' ? 5 : phase.name === 'Development' ? 4 : phase.name === 'Testing' ? 3 : 3;
    acc[phase.name] = phase.value > baseline ? 'up' : phase.value < baseline ? 'down' : 'flat';
    return acc;
  }, {});

  return (
    <Box>
      <Grid container spacing={1.5}>
        {executive.kpis.map((kpi, i) => (
          <Grid key={kpi.label} size={{ xs: 6, md: 3 }}>
            <KpiCard label={kpi.label} value={kpi.value} trend={kpi.trend} data={kpi.data} delay={i * 0.05} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Open Risks" value={executive.openRisks} suffix="" trend={executive.portfolioMetrics[3].trend} compact />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Open Incidents" value={executive.openIncidents} suffix="" trend={executive.portfolioMetrics[2].trend} compact />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Business Impact" value={executive.businessImpactScore} trend={1.2} compact />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Portfolio Health" value={executive.portfolioHealth} trend={2.4} compact />
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {executive.domainHealth.map((d, i) => (
          <Grid key={d.name} size={{ xs: 6, md: 4 }}>
            <GlassCard delay={0.1 + i * 0.05} sx={{ p: 1.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{d.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{d.score}%</Typography>
                <Typography variant="caption" color="text.secondary">Health</Typography>
              </Box>
              <Box sx={{ height: 32, mt: 0.5 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={d.trend}>
                    <Area type="monotone" dataKey="value" stroke={colors.primary} fill={`${colors.primary}22`} strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                {[
                  { l: 'Changes', v: d.changes },
                  { l: 'Risks', v: d.risks },
                  { l: 'Incidents', v: d.incidents },
                ].map((m) => (
                  <Box key={m.l} sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block' }}>{m.l}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{m.v}</Typography>
                  </Box>
                ))}
              </Box>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader number={1} title="Domain Confidence Trend" subtitle="Net Banking · Mobile · Payments" />
            <MultiLineChart
              data={executive.confidenceTrend}
              series={[
                { key: 'net', color: colors.primary, name: 'Net Banking' },
                { key: 'mobile', color: colors.info, name: 'Mobile Banking' },
                { key: 'payments', color: colors.warning, name: 'Payments' },
              ]}
              height={220}
            />
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2, height: '100%' }} glow="purple">
            <ModuleHeader title="Executive Insights" subtitle="Live · updates every 30s" />
            {dynamicInsights.map((insight) => (
              <Typography key={insight} variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', mb: 1, lineHeight: 1.5 }}>
                • {insight}
              </Typography>
            ))}
          </GlassCard>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {executive.portfolioMetrics.map((m, i) => (
          <Grid key={m.label} size={{ xs: 6, md: 3 }}>
            <KpiCard label={m.label} value={m.value} suffix="" trend={m.trend} delay={0.1 + i * 0.05} compact />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2, height: '100%' }}>
            <ModuleHeader title="Risk by SDLC Phase" />
            <DonutChart chartId="executive.risk-by-phase" data={executive.riskByPhase} centerLabel="Open Risks" centerValue={executive.openRisks} height={150} />
            <Box sx={{ mt: 0.8 }}>
              {[
                ...executive.riskByPhase,
                { name: 'Release', value: release.riskMatrix.filter((r) => r.severity === 'high').length },
                { name: 'Production', value: executive.openIncidents },
              ].map((phase) => {
                const dir = phaseTrendDirection[phase.name] ?? (phase.value >= 3 ? 'up' : 'down');
                return (
                  <Box key={`phase-${phase.name}`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.35 }}>
                    <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.72rem' }}>
                      {phase.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: dir === 'up' ? colors.warning : dir === 'down' ? colors.success : colors.info,
                        fontWeight: 800,
                        fontSize: '0.7rem',
                      }}
                    >
                      {phase.value} {dir === 'up' ? '↑' : dir === 'down' ? '↓' : '→'}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2, height: '100%' }}>
            <ModuleHeader title="Release Confidence" subtitle="Executive readiness summary" />
            <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 0.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.6 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#FFFFFF', lineHeight: 1 }}>
                  {release.confidence}%
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontWeight: 700 }}>
                  Confidence
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                {isConfidenceUp ? <TrendingUpIcon sx={{ fontSize: 14, color: colors.success }} /> : <TrendingDownIcon sx={{ fontSize: 14, color: colors.critical }} />}
                <Typography variant="caption" sx={{ fontWeight: 800, color: isConfidenceUp ? colors.success : colors.critical }}>
                  {isConfidenceUp ? '+' : ''}{releaseConfidenceDelta}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ display: 'block', color: colors.text.secondary, fontSize: '0.72rem', lineHeight: 1.45, mb: 1 }}>
              {releaseExplanation}
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: colors.info, fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                Key Contributors
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 700, mt: 0.3, fontSize: '0.72rem' }}>
                Testing {testingReadiness}% · Deployment {deploymentReadiness}% · Governance {governanceReadiness}% · Open Blockers {openBlockers}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: colors.info, fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                Active Release Confidence
              </Typography>
              {release.releases.map((rel) => (
                <Box key={rel.id} sx={{ mt: 0.45 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
                    <Typography variant="caption" sx={{ color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700 }}>{rel.name}</Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.68rem', fontWeight: 700 }}>{rel.confidence}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={rel.confidence}
                    sx={{
                      height: 5,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': { bgcolor: rel.risk === 'high' ? colors.critical : rel.risk === 'medium' ? colors.warning : colors.success },
                    }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 0.9 }}>
              <Typography variant="caption" sx={{ color: colors.info, fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                Readiness and Blockers
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#FFFFFF', fontWeight: 700, mt: 0.25, fontSize: '0.72rem' }}>
                Top blockers: {release.checklist.filter((item) => item.status !== 'completed').map((item) => item.item).join(' · ') || 'None'}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: colors.text.secondary, mt: 0.2, fontSize: '0.7rem', fontWeight: 700 }}>
                Upcoming milestones: CAB approval, final governance sign-off, production cutover rehearsal.
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: colors.text.secondary, mt: 0.2, fontSize: '0.7rem', fontWeight: 700 }}>
                Lower confidence drivers: {release.releases.filter((r) => r.confidence < release.confidence).map((r) => `${r.name} (${r.risk})`).join(' · ') || 'No outliers'}.
              </Typography>
            </Box>
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2, height: '100%' }}>
            <ModuleHeader title="Business Impact Areas" />
            <HorizontalBarChart chartId="executive.business-impact" data={executive.businessImpactAreas} height={150} barColor={colors.secondary} />
            <Box sx={{ mt: 0.8 }}>
              {executive.businessImpactAreas.map((area) => {
                const trend = area.value >= executive.businessImpactScore ? 'up' : 'down';
                const driver = area.name.includes('Customer')
                  ? `${executive.openIncidents} open incidents influencing experience`
                  : area.name.includes('Revenue')
                    ? `Payments health ${executive.domainHealth.find((d) => d.name === 'Payments')?.score ?? 0}%`
                    : area.name.includes('Regulatory')
                      ? `Governance score ${governance.governanceScore}%`
                      : `${release.releases.filter((r) => r.risk === 'high').length} high-risk release(s)`;
                return (
                  <Box key={`impact-${area.name}`} sx={{ mt: 0.35 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.72rem' }}>
                        {area.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: trend === 'up' ? colors.success : colors.warning, fontWeight: 800, fontSize: '0.7rem' }}
                      >
                        {area.value}% {trend === 'up' ? '↑' : '↓'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.68rem', fontWeight: 700 }}>
                      {driver}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Critical Incidents" />
            {executive.criticalIncidents.map((inc) => (
              <DrilldownTableRow
                key={inc.id}
                chartId="executive.critical-incidents"
                segment={inc.id}
                label={inc.title}
                value={inc.id}
                sx={{ p: 1, mb: 0.75, borderRadius: 1, bgcolor: colors.bg.glass, border: `1px solid ${colors.border.subtle}` }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{inc.id}</Typography>
                  <SeverityChip severity={inc.severity} />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.25 }}>{inc.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{inc.domain} · {inc.duration}</Typography>
              </DrilldownTableRow>
            ))}
          </GlassCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Enterprise Scorecard" />
            {executive.scorecard.map((s) => (
              <Box key={s.label} sx={{ mb: 1.25 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                  <Typography variant="caption">{s.label}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{s.value}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={s.value}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': { bgcolor: s.value >= 90 ? colors.success : colors.primary },
                  }}
                />
              </Box>
            ))}
            <ModuleHeader title="Governance Snapshot" />
            <DonutChart chartId="finding-severity" data={governance.findingSeverity} centerLabel="Findings" height={120} />
          </GlassCard>
        </Grid>
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Active AI Scans" />
        <Grid container spacing={1.5}>
          {executive.activeScans.map((scan) => (
            <Grid key={scan.name} size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 1.5, borderRadius: 1, border: `1px solid ${colors.border.subtle}` }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>{scan.name}</Typography>
                <LinearProgress variant="determinate" value={scan.progress} sx={{ mt: 1, height: 4, borderRadius: 2 }} />
                <Typography variant="caption" color="text.secondary">{scan.status} · {scan.progress}%</Typography>
              </Box>
            </Grid>
          ))}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Lessons learned: {learning.lessonsLearned} · Reusable assets: {learning.reusableAssets}
            </Typography>
            <Button size="small" sx={{ mt: 1, fontSize: '0.75rem' }}>View Learning Hub →</Button>
          </Grid>
        </Grid>
      </GlassCard>
    </Box>
  );
}
