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
import { BarChartPanel } from '../components/charts/BarChartPanel';
import { GlassCard } from '../components/common/GlassCard';
import { ModuleHeader } from '../components/common/ModuleHeader';
import { MultiLineChart } from '../components/charts/MultiLineChart';
import { DonutChart } from '../components/charts/DonutChart';
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';
import { colors } from '../theme/colors';
import { AnalyzeWithAIPanel } from '../components/workflow/AnalyzeWithAIPanel';
import { DevelopmentIntakeWorkflow } from '../components/development/DevelopmentIntakeWorkflow';

export function DevelopmentHub() {
  return (
    <Box>
      <AnalyzeWithAIPanel
        phase="development"
        title="Development Analysis"
        subtitle="API, service, and database design readiness"
        placeholder="e.g. Settlement API implementation, merchant limit service..."
        glow="purple"
      />

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="1. Code Quality" subtitle="Repository quality and maintainability posture" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Total Repositories" value={48} suffix="" trend={4.3} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Code Quality Score" value={89} trend={2.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Code Smells" value={214} suffix="" trend={-6.7} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Maintainability Index" value={84} trend={3.5} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <DonutChart
              data={[
                { name: 'Core Banking', value: 16, color: colors.primary },
                { name: 'Mobile Banking', value: 11, color: colors.info },
                { name: 'UPI Platform', value: 9, color: colors.success },
                { name: 'Loan Origination', value: 5, color: colors.warning },
                { name: 'Payments Gateway', value: 4, color: colors.secondary },
                { name: 'Customer Onboarding', value: 3, color: colors.critical },
              ]}
              centerLabel="Repos"
              centerValue={48}
              height={210}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Sonar Quality Score</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Code Smells</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Maintainability</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', score: 'A (92)', smells: 48, maintainability: '87' },
                    { app: 'Mobile Banking', score: 'A (90)', smells: 34, maintainability: '85' },
                    { app: 'UPI Platform', score: 'B (86)', smells: 41, maintainability: '81' },
                    { app: 'Payments Gateway', score: 'B (84)', smells: 37, maintainability: '79' },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.score}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.smells}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.maintainability}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="2. Secure Coding" subtitle="Security findings and secure coding adherence" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Security Scans Executed" value={172} suffix="" trend={12.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Critical Vulnerabilities" value={7} suffix="" trend={-22.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Open Security Issues" value={26} suffix="" trend={-10.3} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Secure Coding Compliance %" value={91} trend={2.6} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <HorizontalBarChart
              data={[
                { name: 'Critical', value: 7 },
                { name: 'High', value: 9 },
                { name: 'Medium', value: 10 },
              ]}
              height={180}
              barColor={colors.critical}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Security Findings</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Code Coverage</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Compliance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', findings: 8, coverage: '84%', compliance: '92%' },
                    { app: 'UPI Platform', findings: 7, coverage: '81%', compliance: '90%' },
                    { app: 'Loan Origination', findings: 5, coverage: '79%', compliance: '89%' },
                    { app: 'Customer Onboarding', findings: 6, coverage: '82%', compliance: '91%' },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.findings}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.coverage}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.compliance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="3. AI Code Review" subtitle="AI-assisted code review productivity and quality" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="AI Reviews Performed" value={318} suffix="" trend={18.4} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Defects Detected" value={96} suffix="" trend={11.6} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Review Acceptance Rate" value={88} trend={4.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="AI Recommendation Accuracy" value={86} trend={3.1} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MultiLineChart
              data={[
                { month: 'Jan', reviews: 32, defects: 10, acceptance: 79 },
                { month: 'Feb', reviews: 41, defects: 13, acceptance: 81 },
                { month: 'Mar', reviews: 47, defects: 14, acceptance: 83 },
                { month: 'Apr', reviews: 58, defects: 17, acceptance: 85 },
                { month: 'May', reviews: 66, defects: 20, acceptance: 87 },
                { month: 'Jun', reviews: 74, defects: 22, acceptance: 88 },
              ]}
              series={[
                { key: 'reviews', color: colors.primary, name: 'AI Reviews' },
                { key: 'defects', color: colors.warning, name: 'Defects Detected' },
                { key: 'acceptance', color: colors.success, name: 'Acceptance Rate' },
              ]}
              height={200}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Repo</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Pull Requests</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>AI Suggestions</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Accepted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { repo: 'core-banking-services', prs: 42, suggestions: 118, accepted: '89%' },
                    { repo: 'mobile-banking-app', prs: 38, suggestions: 94, accepted: '87%' },
                    { repo: 'upi-risk-engine', prs: 29, suggestions: 71, accepted: '85%' },
                    { repo: 'payments-gateway-api', prs: 31, suggestions: 79, accepted: '88%' },
                  ].map((row) => (
                    <TableRow key={row.repo} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.repo}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.prs}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.suggestions}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.accepted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="4. Dependency Analysis" subtitle="Library health and vulnerability management" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Dependencies Monitored" value={1246} suffix="" trend={5.6} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Outdated Libraries" value={83} suffix="" trend={-9.8} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Vulnerable Packages" value={19} suffix="" trend={-13.6} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Upgrade Compliance %" value={86} trend={3.4} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <BarChartPanel
              chartId="development.dependency-health"
              data={[
                { bucket: 'Up-to-date', count: 1144 },
                { bucket: 'Outdated', count: 83 },
                { bucket: 'Vulnerable', count: 19 },
              ]}
              categoryKey="bucket"
              series={[{ dataKey: 'count', name: 'Packages', fill: colors.info, barSize: 28 }]}
              height={190}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Application</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Dependencies</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Outdated</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Build Success Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', deps: 314, outdated: 18, build: '97%' },
                    { app: 'Mobile Banking', deps: 242, outdated: 14, build: '96%' },
                    { app: 'UPI Platform', deps: 267, outdated: 21, build: '95%' },
                    { app: 'Customer Onboarding', deps: 143, outdated: 10, build: '98%' },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.deps}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.outdated}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.build}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <GlassCard sx={{ p: 2, mt: 1.5 }}>
        <ModuleHeader title="5. Technical Debt" subtitle="Debt backlog tracking and refactoring pipeline" />
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Technical Debt Hours" value={1240} suffix="" trend={-7.2} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Debt Trend" value={-12} suffix="%" trend={-4.1} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Refactoring Candidates" value={42} suffix="" trend={5.0} compact /></Grid>
          <Grid size={{ xs: 6, md: 3 }}><KpiCard label="Debt Reduction %" value={18} trend={6.8} compact /></Grid>
        </Grid>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <MultiLineChart
              data={[
                { month: 'Jan', debtHours: 1560, refactoringBacklog: 54 },
                { month: 'Feb', debtHours: 1490, refactoringBacklog: 52 },
                { month: 'Mar', debtHours: 1430, refactoringBacklog: 49 },
                { month: 'Apr', debtHours: 1375, refactoringBacklog: 47 },
                { month: 'May', debtHours: 1305, refactoringBacklog: 44 },
                { month: 'Jun', debtHours: 1240, refactoringBacklog: 42 },
              ]}
              series={[
                { key: 'debtHours', color: colors.warning, name: 'Debt Hours' },
                { key: 'refactoringBacklog', color: colors.secondary, name: 'Refactoring Backlog' },
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
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Debt Hours</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Refactoring Backlog</TableCell>
                    <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.muted, fontWeight: 600 }}>Reduction</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { app: 'Core Banking', debt: 340, backlog: 9, reduction: '16%' },
                    { app: 'UPI Platform', debt: 286, backlog: 11, reduction: '14%' },
                    { app: 'Loan Origination', debt: 224, backlog: 8, reduction: '19%' },
                    { app: 'Mobile Banking', debt: 198, backlog: 7, reduction: '22%' },
                  ].map((row) => (
                    <TableRow key={row.app} hover sx={{ '&:hover td': { bgcolor: colors.bg.glass } }}>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.primary }}>{row.app}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.debt}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.backlog}</TableCell>
                      <TableCell sx={{ borderColor: colors.border.subtle, color: colors.text.secondary }}>{row.reduction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </GlassCard>

      <DevelopmentIntakeWorkflow />
    </Box>
  );
}
