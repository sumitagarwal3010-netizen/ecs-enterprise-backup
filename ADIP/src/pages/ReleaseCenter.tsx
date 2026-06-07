import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { KpiCard } from '../components/common/KpiCard';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChartPanel } from '../components/charts/BarChartPanel';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';
import { colors } from '../theme/colors';
import { AnalyzeWithAIPanel } from '../components/workflow/AnalyzeWithAIPanel';
import { ReleaseIntakeWorkflow } from '../components/release/ReleaseIntakeWorkflow';

export function ReleaseCenter() {
  return (
    <Box>
      <AnalyzeWithAIPanel
        phase="deployment"
        title="Deployment Analysis"
        subtitle="Release planning, rollback, and go-live validation"
        placeholder="e.g. UPI v2.4 production rollout, settlement service deployment..."
        glow="green"
      />

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="1. Release Planning" subtitle="Planning and delivery predictability across banking platforms" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Planned Releases" value={27} suffix="" trend={8.0} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Upcoming Releases" value={11} suffix="" trend={3.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="On-Time Delivery %" value={91} trend={2.5} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <BarChartPanel
              chartId="release.planning-trend"
              data={[
                { month: 'Jan', planned: 4, delivered: 3 },
                { month: 'Feb', planned: 4, delivered: 4 },
                { month: 'Mar', planned: 5, delivered: 4 },
                { month: 'Apr', planned: 5, delivered: 5 },
                { month: 'May', planned: 4, delivered: 4 },
                { month: 'Jun', planned: 5, delivered: 5 },
              ]}
              categoryKey="month"
              series={[
                { dataKey: 'planned', name: 'Planned', fill: colors.primary, barSize: 16 },
                { dataKey: 'delivered', name: 'Delivered', fill: colors.success, barSize: 16 },
              ]}
              height={200}
              showLegend
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Planned</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Upcoming</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>On-Time %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', planned: 6, upcoming: 2, onTime: '92%' },
                    { app: 'UPI Platform', planned: 7, upcoming: 3, onTime: '90%' },
                    { app: 'Mobile Banking', planned: 5, upcoming: 2, onTime: '93%' },
                    { app: 'Payments Gateway', planned: 4, upcoming: 2, onTime: '89%' },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.planned}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.upcoming}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.onTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="2. CAB Approvals" subtitle="Change advisory board decision health" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Pending CAB" value={8} suffix="" trend={-11.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Approved Changes" value={46} suffix="" trend={9.5} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Rejected Changes" value={5} suffix="" trend={-16.7} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <DonutChart
              data={[
                { name: 'Approved', value: 46, color: colors.success },
                { name: 'Pending', value: 8, color: colors.warning },
                { name: 'Rejected', value: 5, color: colors.critical },
              ]}
              centerLabel="CAB"
              centerValue={59}
              height={200}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Change ID</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Decision</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { id: 'CAB-311', app: 'UPI Platform', type: 'Schema Change', decision: 'Approved' },
                    { id: 'CAB-314', app: 'Core Banking', type: 'Infra Upgrade', decision: 'Pending' },
                    { id: 'CAB-320', app: 'Loan Origination', type: 'API Refactor', decision: 'Rejected' },
                    { id: 'CAB-322', app: 'Mobile Banking', type: 'Feature Toggle', decision: 'Approved' },
                  ].map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.id}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.type}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.decision}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="3. Deployment Readiness" subtitle="Go-live readiness posture by platform" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Ready for Deployment" value={14} suffix="" trend={7.7} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Blocked Releases" value={3} suffix="" trend={-25.0} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Readiness Score" value={88} trend={2.9} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MultiLineChart
              data={[
                { month: 'Jan', ready: 8, blocked: 6, score: 78 },
                { month: 'Feb', ready: 9, blocked: 5, score: 80 },
                { month: 'Mar', ready: 10, blocked: 5, score: 82 },
                { month: 'Apr', ready: 11, blocked: 4, score: 84 },
                { month: 'May', ready: 13, blocked: 4, score: 86 },
                { month: 'Jun', ready: 14, blocked: 3, score: 88 },
              ]}
              series={[
                { key: 'ready', color: colors.success, name: 'Ready' },
                { key: 'blocked', color: colors.critical, name: 'Blocked' },
                { key: 'score', color: colors.primary, name: 'Readiness Score' },
              ]}
              height={200}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Ready</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Blocked</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', ready: 3, blocked: 1, score: '90%' },
                    { app: 'UPI Platform', ready: 4, blocked: 1, score: '87%' },
                    { app: 'Mobile Banking', ready: 2, blocked: 0, score: '92%' },
                    { app: 'Payments Gateway', ready: 2, blocked: 1, score: '84%' },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.ready}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.blocked}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="4. Change Risk" subtitle="Risk distribution for in-flight release changes" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Low Risk" value={18} suffix="" trend={6.4} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Medium Risk" value={9} suffix="" trend={-3.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="High Risk" value={4} suffix="" trend={-20.0} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <HorizontalBarChart
              data={[
                { name: 'Low', value: 58 },
                { name: 'Medium', value: 29 },
                { name: 'High', value: 13 },
              ]}
              height={190}
              barColor={colors.warning}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Change</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Risk</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Mitigation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { change: 'Settlement Engine Cutover', app: 'UPI Platform', risk: 'High', mitigation: 'Blue/Green' },
                    { change: 'Ledger Index Optimization', app: 'Core Banking', risk: 'Medium', mitigation: 'Canary' },
                    { change: 'Payment Retry Enhancements', app: 'Payments Gateway', risk: 'Low', mitigation: 'Feature Toggle' },
                    { change: 'Loan Rule Update', app: 'Loan Origination', risk: 'Medium', mitigation: 'Shadow Run' },
                  ].map((row) => (
                    <TableRow key={row.change} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.change}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.risk}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.mitigation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="5. Rollback Planning" subtitle="Recovery preparedness and rollback validation" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Rollback Tested" value={19} suffix="" trend={11.8} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Recovery Success %" value={96} trend={1.7} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Open Risks" value={5} suffix="" trend={-16.7} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <DonutChart
              data={[
                { name: 'Rollback Tested', value: 19, color: colors.success },
                { name: 'Pending Test', value: 3, color: colors.warning },
                { name: 'High-Risk', value: 2, color: colors.critical },
              ]}
              centerLabel="Rollback"
              centerValue={24}
              height={200}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Rollback Tested</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Recovery Success</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Open Risks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', tested: 'Yes', recovery: '97%', risks: 1 },
                    { app: 'UPI Platform', tested: 'Yes', recovery: '95%', risks: 2 },
                    { app: 'Mobile Banking', tested: 'Yes', recovery: '98%', risks: 0 },
                    { app: 'Payments Gateway', tested: 'No', recovery: '93%', risks: 2 },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.tested}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.recovery}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.risks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <ReleaseIntakeWorkflow />
    </Box>
  );
}
