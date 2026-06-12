import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { KpiCard } from '../components/common/KpiCard';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { SeverityChip } from '../components/common/SeverityChip';
import { AIInsightBox } from '../components/common/AIInsightBox';
import { colors } from '../theme/colors';
import {
  availabilityTrend30d,
  getAvailabilityKpis,
  getServiceIncidentMap,
  serviceAvailabilityData,
  serviceDependencyImpact,
  slaComplianceTracker,
} from '../data/availabilityOperationsData';

const kpis = getAvailabilityKpis();
const serviceIncidentMap = getServiceIncidentMap();

function statusColor(status: 'Healthy' | 'Degraded' | 'At Risk') {
  if (status === 'Healthy') return colors.success;
  if (status === 'Degraded') return colors.warning;
  return colors.critical;
}

export function OperationsAvailabilityPage() {
  return (
    <Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Overall Availability" value={kpis.overallAvailability} suffix="%" trend={0.06} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="SLA Compliance" value={kpis.slaCompliance} suffix="%" trend={-0.3} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Services Below SLA" value={kpis.servicesBelowSla} suffix="" trend={0} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Degraded Services" value={kpis.degradedServices} suffix="" trend={4.2} /></Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Service Availability Table" subtitle="Uptime and SLA posture aligned to active incident conditions" />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Service</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Uptime %</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>SLA Target</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceAvailabilityData.map((service) => (
                    <TableRow key={service.service} sx={{ '& td': { borderColor: colors.border.subtle } }}>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.primary }}>{service.service}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{service.uptime.toFixed(2)}%</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{service.slaTarget.toFixed(1)}%</Typography></TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: statusColor(service.status), fontWeight: 700 }}>
                          {service.status}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="SLA Compliance Tracker" subtitle="Current month compliance and recent breach counts" />
            {slaComplianceTracker.map((service) => (
              <Box key={service.service} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: `1px solid ${colors.border.subtle}` }}>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', color: colors.text.primary }}>{service.service}</Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.72rem' }}>{service.breaches} recent breach{service.breaches > 1 ? 'es' : ''}</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: service.compliance >= 99.5 ? colors.success : colors.warning, fontWeight: 700 }}>
                  {service.compliance.toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </GlassCard>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Availability Trend Chart" subtitle="30-day reliability trend for critical banking services" />
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={availabilityTrend30d}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border.subtle} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: colors.text.muted, fontSize: 11 }} interval={4} />
                  <YAxis domain={[98.8, 100]} tick={{ fill: colors.text.muted, fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: colors.bg.secondary, borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="upiSwitch" name="UPI Switch" stroke={colors.chart.blue} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="paymentGateway" name="Payment Gateway" stroke={colors.chart.green} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="fraudEngine" name="Fraud Engine" stroke={colors.chart.red} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="netBankingPortal" name="Net Banking Portal" stroke={colors.chart.purple} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Service Dependency Impact" subtitle="Dependency health influence on service reliability" />
            {serviceDependencyImpact.map((item) => (
              <Box key={item.service} sx={{ mb: 1.1, pb: 0.9, borderBottom: `1px solid ${colors.border.subtle}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{item.service}</Typography>
                  <SeverityChip severity={item.risk} />
                </Box>
                <Typography variant="caption" sx={{ color: colors.info, display: 'block', fontSize: '0.72rem', mt: 0.3 }}>{item.dependency}</Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.72rem', lineHeight: 1.4 }}>{item.impact}</Typography>
              </Box>
            ))}
          </GlassCard>
        </Grid>
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="AI Availability Insights" subtitle="Service reliability signals correlated with current incident state" />
        <AIInsightBox insight="Fraud Engine and UPI Switch remain below SLA due to active incident pressure; prioritize runbook automation before next peak window." />
        <AIInsightBox insight="Payment Gateway and Net Banking Portal are stable but degraded, indicating dependency-driven reliability risk rather than core service instability." />
        <AIInsightBox insight={`Open incident alignment check: ${serviceIncidentMap.filter((item) => item.incidents.some((inc) => inc.status !== 'Resolved')).length} services currently affected by active incidents.`} />
      </GlassCard>
    </Box>
  );
}
