import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { KpiCard } from '../components/common/KpiCard';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { SeverityChip } from '../components/common/SeverityChip';
import { AIInsightBox } from '../components/common/AIInsightBox';
import { colors } from '../theme/colors';
import {
  capacityForecastTrend,
  capacityServiceData,
  forecastedBreaches,
  getCapacityKpis,
} from '../data/capacityOperationsData';

const kpis = getCapacityKpis();

export function OperationsCapacityPage() {
  return (
    <Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Capacity Utilization" value={kpis.capacityUtilization} suffix="%" trend={3.4} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Services Near Capacity" value={kpis.servicesNearCapacity} suffix="" trend={7.1} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Forecasted Capacity Breaches" value={kpis.forecastedBreaches} suffix="" trend={5.2} /></Grid>
        <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Peak Load Headroom" value={kpis.peakLoadHeadroom} suffix="%" trend={-4.8} /></Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Capacity Hotspots" subtitle="Current operational utilization against service thresholds" />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Service</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Utilization</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Threshold</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {capacityServiceData.map((service) => (
                    <TableRow key={service.service} sx={{ '& td': { borderColor: colors.border.subtle } }}>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.primary }}>{service.service}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.primary, fontWeight: 700 }}>{service.utilization}%</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ color: colors.text.secondary }}>{service.threshold}%</Typography></TableCell>
                      <TableCell><SeverityChip severity={service.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <GlassCard sx={{ p: 2 }}>
            <ModuleHeader title="Forecasted Breaches" subtitle="Services projected to exceed breach thresholds this cycle" />
            {forecastedBreaches.map((item) => (
              <Box key={item.service} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.9, borderBottom: `1px solid ${colors.border.subtle}` }}>
                <Box>
                  <Typography variant="caption" sx={{ color: colors.text.primary, display: 'block' }}>{item.service}</Typography>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, fontSize: '0.72rem' }}>
                    {`Current ${item.current}% -> Forecast ${item.forecast}% (Threshold ${item.breachThreshold}%)`}
                  </Typography>
                </Box>
                <SeverityChip severity="high" />
              </Box>
            ))}
          </GlassCard>
        </Grid>
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Capacity Forecast" subtitle="Utilization outlook for key operational services" />
        <MultiLineChart
          data={capacityForecastTrend}
          series={[
            { key: 'fraudEngine', color: colors.chart.red, name: 'Fraud Engine' },
            { key: 'upiSwitch', color: colors.chart.blue, name: 'UPI Switch' },
            { key: 'paymentGateway', color: colors.chart.amber, name: 'Payment Gateway' },
            { key: 'notificationHub', color: colors.chart.green, name: 'Notification Hub' },
          ]}
          height={230}
        />
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="AI Capacity Recommendations" subtitle="Priority actions for near-term capacity risk reduction" />
        <AIInsightBox insight="Fraud Engine: add processing nodes and rebalance scoring worker pools before weekend peak cycle." />
        <AIInsightBox insight="UPI Switch: increase throughput allocation and enforce queue partition limits during high-volume windows." />
        <AIInsightBox insight="Payment Gateway: continue active monitoring with threshold alerts at 85% to avoid cascading saturation." />
      </GlassCard>
    </Box>
  );
}
