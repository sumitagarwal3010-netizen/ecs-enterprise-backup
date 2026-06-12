import { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { KpiCard } from '../components/common/KpiCard';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { SeverityChip } from '../components/common/SeverityChip';
import { DonutChart } from '../components/charts/DonutChart';
import { AIInsightBox } from '../components/common/AIInsightBox';
import { colors } from '../theme/colors';
import {
  getIncidentOperationsKpis,
  getRootCauseDistribution,
  incidentOperationsData,
} from '../data/incidentOperationsData';

const statusColor: Record<IncidentStatus, string> = {
  Investigating: colors.warning,
  Mitigating: colors.critical,
  Monitoring: colors.info,
  Resolved: colors.success,
};

export function OperationsIncidentsPage() {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidentOperationsData[0]?.id ?? '');

  const selectedIncident = incidentOperationsData.find((incident) => incident.id === selectedIncidentId) ?? incidentOperationsData[0];

  const kpis = useMemo(() => getIncidentOperationsKpis(), []);

  const rootCauseDistribution = useMemo(() => {
    const counts = getRootCauseDistribution();

    return [
      { name: 'Application', value: counts.Application, color: colors.chart.blue },
      { name: 'Infrastructure', value: counts.Infrastructure, color: colors.chart.purple },
      { name: 'Database', value: counts.Database, color: colors.chart.green },
      { name: 'Network', value: counts.Network, color: colors.chart.amber },
      { name: 'External Dependency', value: counts['External Dependency'], color: colors.chart.red },
    ];
  }, []);

  return (
    <Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Open Incidents" value={kpis.openIncidents} suffix="" trend={-8.5} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Critical Incidents" value={kpis.criticalIncidents} suffix="" trend={-12.0} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="MTTR" value={`${kpis.mttrMinutes}m`} suffix="" trend={-6.2} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Escalated Incidents" value={kpis.escalatedIncidents} suffix="" trend={4.8} /></Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Incident Queue" subtitle="Select an incident to inspect timeline and response actions" />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Incident ID</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Service</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Severity</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Owner</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incidentOperationsData.map((incident) => {
                    const isSelected = selectedIncident?.id === incident.id;
                    return (
                      <TableRow
                        key={incident.id}
                        hover
                        onClick={() => setSelectedIncidentId(incident.id)}
                        sx={{
                          cursor: 'pointer',
                          '& td': { borderColor: colors.border.subtle },
                          ...(isSelected && { '& td': { bgcolor: colors.bg.glass } }),
                        }}
                      >
                        <TableCell>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: colors.text.primary }}>
                            {incident.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: colors.text.primary }}>
                            {incident.service}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <SeverityChip severity={incident.severity} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: statusColor[incident.status], fontWeight: 700 }}>
                            {incident.status}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {incident.owner}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader
              title="Incident Timeline"
              subtitle={selectedIncident ? `${selectedIncident.id} · ${selectedIncident.service}` : 'Select incident'}
            />
            {selectedIncident?.timeline.map((event, index) => (
              <Box key={`${event.label}-${event.time}`} sx={{ display: 'flex', gap: 1.1, pb: index === selectedIncident.timeline.length - 1 ? 0 : 1.1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.2 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.info }} />
                  {index < selectedIncident.timeline.length - 1 && <Box sx={{ width: 1.5, flex: 1, bgcolor: colors.border.subtle, mt: 0.5 }} />}
                </Box>
                <Box sx={{ pb: 0.4 }}>
                  <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>
                    {event.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.info, display: 'block', fontWeight: 700 }}>
                    {event.time}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.72rem', lineHeight: 1.4 }}>
                    {event.note}
                  </Typography>
                </Box>
              </Box>
            ))}
          </GlassCard>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Root Cause Distribution" subtitle="Operational incident classification this week" />
            <DonutChart data={rootCauseDistribution} centerLabel="Incidents" centerValue={incidentOperationsData.length} height={188} />
            <Box sx={{ mt: 1.2, display: 'grid', gap: 0.6 }}>
              {rootCauseDistribution.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="AI Incident Insights" subtitle="Demo recommendations generated from incident queue patterns" />
            <AIInsightBox insight="Fraud Engine incidents account for the highest operational impact this week; prioritize model-serving resiliency and JVM pool guardrails." />
            <AIInsightBox insight="Deploy circuit breaker protection before UPI Release 24.6 to reduce reversal spikes during peak transaction windows." />
            <AIInsightBox insight="Net Banking and Payment Gateway incidents indicate dependency concentration; enforce pre-release dependency health checks and controlled failover drills." />
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
}
