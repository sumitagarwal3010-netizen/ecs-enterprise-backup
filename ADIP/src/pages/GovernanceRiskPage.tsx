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
import { DrilldownTableRow } from '../components/common/DrilldownTableRow';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { colors } from '../theme/colors';
import { getGovernanceRiskKpis, operationalRiskRegister } from '../data/operationalRiskHeatRegisterData';

const riskKpis = getGovernanceRiskKpis();
const kpis = [
  { label: 'Enterprise Risks', value: riskKpis.enterpriseRisks, suffix: '', trend: -3.1 },
  { label: 'High Risk Items', value: riskKpis.highRiskItems, suffix: '', trend: -11.1 },
  { label: 'Mitigation Plans Due', value: riskKpis.mitigationPlansDue, suffix: '', trend: -16.7 },
  { label: 'Residual Risk Score', value: riskKpis.residualRiskScore, trend: -2.4 },
];

function severityStyle(severity: string) {
  if (severity === 'Critical') return { c: colors.critical, b: `${colors.critical}22` };
  if (severity === 'High') return { c: colors.warning, b: `${colors.warning}22` };
  return { c: colors.info, b: `${colors.info}22` };
}

export function GovernanceRiskPage() {
  return (
    <Box>
      <Grid container spacing={1.5}>
        {kpis.map((kpi, i) => (
          <Grid key={kpi.label} size={{ xs: 6, md: 3 }}>
            <KpiCard label={kpi.label} value={kpi.value} suffix={kpi.suffix} trend={kpi.trend} compact delay={i * 0.05} />
          </Grid>
        ))}
      </Grid>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="Operational Risk Heat Register" subtitle="Context: technology and service continuity risk" />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Risk</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Domain</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Owner</TableCell>
                <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Severity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operationalRiskRegister.map((row) => {
                const s = severityStyle(row.severity);
                return (
                  <TableRow key={row.id} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <DrilldownTableRow chartId="governance-risk.register" segment={row.id} label={row.title} value={row.residualRiskScore} suffix="">
                        <Typography variant="caption" sx={{ fontWeight: 600, color: colors.text.primary }}>{row.title}</Typography>
                      </DrilldownTableRow>
                    </TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.domain}</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.owner}</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle }}>
                      <Typography variant="caption" sx={{ px: 1, py: 0.25, borderRadius: 1, color: s.c, bgcolor: s.b, fontWeight: 700 }}>{row.severity}</Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );
}
