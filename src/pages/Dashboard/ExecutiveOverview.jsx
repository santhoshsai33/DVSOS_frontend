import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Star, Clock, Target, Award, RefreshCw
} from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatCurrency } from '../../utils/formatters';

const BRANCH_DATA = [
  { branch: 'Chennai – Main', revenue: 328000, target: 300000, jobs: 84, csat: 4.7, avgTAT: '3.2 hrs', onTime: 92 },
  { branch: 'Chennai – OMR', revenue: 215000, target: 250000, jobs: 56, csat: 4.4, avgTAT: '3.8 hrs', onTime: 85 },
  { branch: 'Bangalore', revenue: 184000, target: 200000, jobs: 48, csat: 4.6, avgTAT: '4.1 hrs', onTime: 88 },
];

const MONTHLY_TREND = [
  { month: 'Jan', revenue: 680000, target: 700000 },
  { month: 'Feb', revenue: 720000, target: 700000 },
  { month: 'Mar', revenue: 695000, target: 720000 },
  { month: 'Apr', revenue: 810000, target: 750000 },
  { month: 'May', revenue: 755000, target: 750000 },
  { month: 'Jun', revenue: 727000, target: 760000 },
];

const RADAR_DATA = [
  { subject: 'Revenue', A: 88, fullMark: 100 },
  { subject: 'CSAT', A: 94, fullMark: 100 },
  { subject: 'On-Time', A: 88, fullMark: 100 },
  { subject: 'Throughput', A: 76, fullMark: 100 },
  { subject: 'Efficiency', A: 82, fullMark: 100 },
];

function TrendIndicator({ value, target }) {
  const pct = ((value / target) * 100).toFixed(0);
  const isGood = value >= target;
  return (
    <Box component="span" sx={{ color: isGood ? 'success.main' : 'error.main', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
      {isGood ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
      {pct}% of target
    </Box>
  );
}

export default function ExecutiveOverview() {
  const totalRevenue = BRANCH_DATA.reduce((s, b) => s + b.revenue, 0);
  const totalTarget = BRANCH_DATA.reduce((s, b) => s + b.target, 0);
  const avgCsat = (BRANCH_DATA.reduce((s, b) => s + b.csat, 0) / BRANCH_DATA.length).toFixed(1);
  const totalJobs = BRANCH_DATA.reduce((s, b) => s + b.jobs, 0);
  const avgOnTime = Math.round(BRANCH_DATA.reduce((s, b) => s + b.onTime, 0) / BRANCH_DATA.length);

  const kpis = [
    { label: 'Total Revenue (MTD)', value: formatCurrency(totalRevenue), icon: DollarSign, color: '#0F766E', sub: <TrendIndicator value={totalRevenue} target={totalTarget} /> },
    { label: 'Total Jobs (MTD)', value: totalJobs, icon: Target, color: '#10B981', sub: 'Across all branches' },
    { label: 'Avg CSAT Score', value: `${avgCsat} / 5.0`, icon: Star, color: '#F59E0B', sub: 'Customer satisfaction index' },
    { label: 'On-Time Delivery', value: `${avgOnTime}%`, icon: Clock, color: '#8B5CF6', sub: 'Promised vs actual delivery' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Executive Overview"
        subtitle="Multi-branch performance, revenue vs target and operational KPIs"
        breadcrumbs={[{ label: 'MD', path: '/md/dashboard' }, { label: 'Executive Overview' }]}
        actions={
          <Button variant="secondary" size="sm" leftIcon={RefreshCw}>
            Refresh
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ borderRadius: 0 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${kpi.color}15`, color: kpi.color, mr: 2 }}>
                      <Icon size={24} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {kpi.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                    {kpi.value}
                  </Typography>
                  {typeof kpi.sub === 'string' ? (
                    <Typography variant="caption" color="text.secondary">
                      {kpi.sub}
                    </Typography>
                  ) : (
                    kpi.sub
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} xl={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Monthly Revenue vs Target</Typography>
              <Box sx={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_TREND} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={v => [formatCurrency(v)]} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="revenue" fill="#0F766E" radius={[4, 4, 0, 0]} name="Actual Revenue" barSize={30} />
                    <Bar dataKey="target" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Target" barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} xl={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Performance Scorecard</Typography>
              <Box sx={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={RADAR_DATA}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} />
                    <Radar name="Score" dataKey="A" stroke="#0F766E" fill="#0F766E" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Award size={20} color="#0F766E" />
          <Typography variant="h6" fontWeight={700}>Branch-wise Performance</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Branch</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Revenue (MTD)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>vs Target</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Jobs</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>CSAT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Avg TAT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>On-Time %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {BRANCH_DATA.map((b, i) => (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{b.branch}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(b.revenue)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ height: 6, bgcolor: '#F1F5F9', borderRadius: 1, width: 80 }}>
                        <Box sx={{ height: '100%', width: `${Math.min((b.revenue / b.target) * 100, 100)}%`, bgcolor: b.revenue >= b.target ? 'success.main' : 'warning.main', borderRadius: 1 }} />
                      </Box>
                      <TrendIndicator value={b.revenue} target={b.target} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{b.jobs}</TableCell>
                  <TableCell sx={{ color: b.csat >= 4.5 ? 'success.main' : 'warning.main', fontWeight: 700 }}>
                    ⭐ {b.csat}
                  </TableCell>
                  <TableCell>{b.avgTAT}</TableCell>
                  <TableCell sx={{ color: b.onTime >= 90 ? 'success.main' : b.onTime >= 80 ? 'warning.main' : 'error.main', fontWeight: 700 }}>
                    {b.onTime}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
