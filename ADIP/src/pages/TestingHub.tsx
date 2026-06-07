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
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { BarChartPanel } from '../components/charts/BarChartPanel';
import { colors } from '../theme/colors';
import { AnalyzeWithAIPanel } from '../components/workflow/AnalyzeWithAIPanel';
import { TestingIntakeWorkflow } from '../components/testing/TestingIntakeWorkflow';

export function TestingHub() {
  return (
    <Box>
      <AnalyzeWithAIPanel
        phase="testing"
        title="Testing Analysis"
        subtitle="Test planning, regression packs, and coverage"
        placeholder="e.g. UPI settlement regression, payment flow test strategy..."
        glow="green"
      />

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="1. Test Planning" subtitle="Planned vs execution readiness across banking applications" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Planned Tests" value={1240} suffix="" trend={6.4} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Executed Tests" value={1138} suffix="" trend={8.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Schedule Adherence" value={92} trend={2.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Execution Variance" value={-4} suffix="%" trend={1.5} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <BarChartPanel
              chartId="testing.plan-vs-execution"
              data={[
                { app: 'Core Banking', planned: 280, executed: 264 },
                { app: 'Mobile Banking', planned: 230, executed: 219 },
                { app: 'UPI Platform', planned: 240, executed: 224 },
                { app: 'Loan Origination', planned: 180, executed: 167 },
                { app: 'Payments Gateway', planned: 190, executed: 176 },
                { app: 'Customer Onboarding', planned: 120, executed: 88 },
              ]}
              categoryKey="app"
              series={[
                { dataKey: 'planned', name: 'Planned', fill: colors.primary, barSize: 16 },
                { dataKey: 'executed', name: 'Executed', fill: colors.success, barSize: 16 },
              ]}
              showLegend
              height={210}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Planned</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Executed</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Adherence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', planned: 280, executed: 264, adherence: '94%' },
                    { app: 'UPI Platform', planned: 240, executed: 224, adherence: '93%' },
                    { app: 'Mobile Banking', planned: 230, executed: 219, adherence: '95%' },
                    { app: 'Customer Onboarding', planned: 120, executed: 88, adherence: '73%' },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.planned}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.executed}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.adherence}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="2. Test Coverage" subtitle="Requirements and feature coverage monitoring" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Coverage %" value={88} trend={2.3} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Requirements Covered" value={312} suffix="" trend={5.4} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Gaps" value={24} suffix="" trend={-14.3} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <DonutChart
              data={[
                { name: 'Covered', value: 88, color: colors.success },
                { name: 'Partial', value: 7, color: colors.warning },
                { name: 'Gap', value: 5, color: colors.critical },
              ]}
              centerLabel="Coverage"
              centerValue="88%"
              height={210}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Requirements</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Covered</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Gaps</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', req: 82, covered: 76, gaps: 6 },
                    { app: 'UPI Platform', req: 69, covered: 63, gaps: 6 },
                    { app: 'Loan Origination', req: 54, covered: 49, gaps: 5 },
                    { app: 'Payments Gateway', req: 48, covered: 45, gaps: 3 },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.req}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.covered}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.gaps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="3. Automated Testing" subtitle="Automation suite health and execution reliability" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Automation Rate" value={72} trend={4.8} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Automated Suites" value={96} suffix="" trend={6.7} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Pass Rate" value={93} trend={1.6} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Flaky Tests" value={14} suffix="" trend={-9.1} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MultiLineChart
              data={[
                { month: 'Jan', automation: 61, pass: 88, suites: 76 },
                { month: 'Feb', automation: 63, pass: 89, suites: 80 },
                { month: 'Mar', automation: 66, pass: 90, suites: 84 },
                { month: 'Apr', automation: 68, pass: 91, suites: 88 },
                { month: 'May', automation: 70, pass: 92, suites: 92 },
                { month: 'Jun', automation: 72, pass: 93, suites: 96 },
              ]}
              series={[
                { key: 'automation', color: colors.primary, name: 'Automation Rate' },
                { key: 'pass', color: colors.success, name: 'Pass Rate' },
                { key: 'suites', color: colors.info, name: 'Automated Suites' },
              ]}
              height={200}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Suite</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>App</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Pass Rate</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Last Run</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { suite: 'Settlement Regression', app: 'UPI Platform', pass: '94%', run: '2h ago' },
                    { suite: 'Loan Workflow E2E', app: 'Loan Origination', pass: '91%', run: '4h ago' },
                    { suite: 'Payments API Contract', app: 'Payments Gateway', pass: '95%', run: '1h ago' },
                    { suite: 'Onboarding Journey', app: 'Customer Onboarding', pass: '89%', run: '5h ago' },
                  ].map((row) => (
                    <TableRow key={row.suite} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.suite}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.pass}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.run}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="4. Defect Management" subtitle="Defect lifecycle and critical issue tracking" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Open Defects" value={58} suffix="" trend={-8.6} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Critical Defects" value={9} suffix="" trend={-18.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Defect Trend" value={-12} suffix="%" trend={-4.1} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MultiLineChart
              data={[
                { month: 'Jan', open: 82, critical: 15, closed: 61 },
                { month: 'Feb', open: 77, critical: 14, closed: 64 },
                { month: 'Mar', open: 72, critical: 13, closed: 68 },
                { month: 'Apr', open: 67, critical: 11, closed: 71 },
                { month: 'May', open: 63, critical: 10, closed: 74 },
                { month: 'Jun', open: 58, critical: 9, closed: 78 },
              ]}
              series={[
                { key: 'open', color: colors.warning, name: 'Open' },
                { key: 'critical', color: colors.critical, name: 'Critical' },
                { key: 'closed', color: colors.success, name: 'Closed' },
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
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Open</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Critical</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>MTTR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', open: 16, critical: 3, mttr: '2.8d' },
                    { app: 'UPI Platform', open: 14, critical: 2, mttr: '2.1d' },
                    { app: 'Mobile Banking', open: 11, critical: 2, mttr: '2.4d' },
                    { app: 'Payments Gateway', open: 9, critical: 1, mttr: '1.9d' },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.open}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.critical}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.mttr}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="5. Test Evidence" subtitle="Evidence completeness and audit readiness posture" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Evidence Uploaded" value={486} suffix="" trend={9.5} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Audit Readiness" value={91} trend={2.4} compact /></Grid>
          <Grid size={{ xs: 6, md: 4 }}><KpiCard label="Missing Evidence" value={18} suffix="" trend={-21.7} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <HorizontalBarChart
              data={[
                { name: 'Uploaded', value: 91 },
                { name: 'Pending', value: 6 },
                { name: 'Missing', value: 3 },
              ]}
              height={180}
              barColor={colors.secondary}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Evidence Uploaded</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Audit Readiness</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Missing</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', uploaded: 112, readiness: '93%', missing: 3 },
                    { app: 'UPI Platform', uploaded: 96, readiness: '92%', missing: 2 },
                    { app: 'Loan Origination', uploaded: 84, readiness: '89%', missing: 5 },
                    { app: 'Customer Onboarding', uploaded: 58, readiness: '88%', missing: 4 },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.uploaded}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.readiness}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.missing}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <TestingIntakeWorkflow />
    </Box>
  );
}
