import { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Car, Clock, CheckCircle2, AlertTriangle, TrendingUp,
  RefreshCw, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useManagerDashboard } from '../../queries/useDashboardQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import useAuthStore from '../../store/useAuthStore';
import { ROUTES } from '../../config/routes';

const PIE_COLORS = ['#0F766E', '#B7791F', '#2563EB', '#B42318', '#6B7280'];

export default function ManagerDashboard() {
  const { data, isLoading, refetch, isFetching } = useManagerDashboard();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (isLoading) return <Loader fullPage text="Loading dashboard..." />;

  const kpis = [
    {
      label: 'Vehicles Today',
      value: data?.totalVehiclesToday ?? 0,
      icon: Car,
      color: '#3B82F6',
      change: '+12% vs yesterday',
      positive: true,
    },
    {
      label: 'Pending Approvals',
      value: data?.pendingApprovals ?? 0,
      icon: Clock,
      color: '#F59E0B',
      change: '2 require urgent action',
      positive: false,
    },
    {
      label: 'Completed Jobs',
      value: data?.completedJobs ?? 0,
      icon: CheckCircle2,
      color: '#10B981',
      change: '+8% vs yesterday',
      positive: true,
    },
    {
      label: 'Delayed Vehicles',
      value: data?.delayedJobs ?? 0,
      icon: AlertTriangle,
      color: '#EF4444',
      change: '1 over 24 hrs',
      positive: false,
    },
  ];

  const jobColumns = [
    { header: 'Vehicle No', accessor: 'vehicleNo', render: (row) => <Typography variant="body2" fontWeight={700}>{row.vehicleNo}</Typography> },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Stage', accessor: 'stage' },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Time in Stage', accessor: 'timeInStage' },
  ];

  const recentJobs = data?.recentJobs || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title={`Good ${new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, ${user?.name?.split(' ')[0] || 'Manager'} 👋`}
        subtitle="Here's your operations overview for today"
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="secondary" size="sm" leftIcon={RefreshCw} isLoading={isFetching} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={() => navigate(ROUTES.GATE_ENTRY)}>
              New Entry
            </Button>
          </Box>
        }
      />

      {/* KPI Cards */}
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
                  <Typography variant="caption" sx={{ color: kpi.positive ? 'success.main' : 'error.main', display: 'flex', alignItems: 'center' }}>
                    {kpi.positive ? <TrendingUp size={14} className="mr-1" /> : <AlertTriangle size={14} className="mr-1" />}
                    {kpi.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Weekly Revenue & Jobs</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>{formatCurrency(data?.revenueToday ?? 0)} today</Typography>
              </Box>
              <Box sx={{ height: 280, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.weeklyRevenue || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F766E" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v, name) => [name === 'revenue' ? formatCurrency(v) : v, name === 'revenue' ? 'Revenue' : 'Jobs']} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={3} fill="url(#revenueGrad)" dot={false} />
                    <Area type="monotone" dataKey="jobs" stroke="#B7791F" strokeWidth={2} fill="none" dot={false} strokeDasharray="4 2" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Service Breakdown</Typography>
              <Box sx={{ height: 250, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.serviceBreakdown || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {(data?.serviceBreakdown || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: '8px' }} />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Jobs Table */}
      <Card sx={{ borderRadius: 0 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700}>Active Jobs</Typography>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.JOB_CARDS)}>View All</Button>
        </Box>
        <DataTable
          columns={jobColumns}
          data={recentJobs}
          onRowClick={(row) => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
          emptyMessage="No active jobs found"
        />
      </Card>
    </Box>
  );
}
