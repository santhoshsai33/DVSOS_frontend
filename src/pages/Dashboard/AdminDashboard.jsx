import { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, Database, Settings, ShieldCheck,
  Plus, RefreshCw, TrendingUp, Car, Wrench, Hammer, Droplets, Briefcase, Crown,
  Package, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { ROUTES } from '../../config/routes';

const MOCK_STATS = {
  totalUsers: 24,
  todayTotalVehicle: 15,
  readyToDelivery: 3,
  pendingApproval: 4,
};

const MOCK_STAGE_DIST = [
  { stage: 'Gate Entry', count: 1, color: '#3B82F6' },
  { stage: 'Job Card', count: 0, color: '#8B5CF6' },
  { stage: 'Approval', count: 1, color: '#F59E0B' },
  { stage: 'Mechanical', count: 1, color: '#EF4444' },
  { stage: 'Body Shop', count: 1, color: '#10B981' },
  { stage: 'Water Wash', count: 1, color: '#06B6D4' },
  { stage: 'Ready', count: 1, color: '#22C55E' },
];

const MOCK_VEHICLE_STATUS = [
  { registration: 'TN38AK4521', owner: 'Anand Krishnamurthy', stage: 'MECHANICAL', status: 'ON TRACK' },
  { registration: 'TN45BJ2233', owner: 'Priya Venkatesh', stage: 'APPROVAL', status: 'ON TRACK' },
  { registration: 'TN22CD8899', owner: 'Murugan Pillai', stage: 'BODY SHOP', status: 'DELAYED' },
  { registration: 'TN01EF5567', owner: 'Lakshmi Sundaram', stage: 'WATER WASH', status: 'ON TRACK' },
  { registration: 'TN57GH1122', owner: 'Vijay Annamalai', stage: 'GATE ENTRY', status: 'ON TRACK' },
  { registration: 'TN33PQ9900', owner: 'Sathish Mohan', stage: 'READY', status: 'ON TRACK' },
];

const STAGE_STYLES = {
  'GATE ENTRY': { color: '#7C3AED', bg: '#F3E8FF' },
  'JOB CARD': { color: '#9333EA', bg: '#F3E8FF' },
  'APPROVAL': { color: '#D97706', bg: '#FEF3C7' },
  'MECHANICAL': { color: '#EF4444', bg: '#FEE2E2' },
  'BODY SHOP': { color: '#0F766E', bg: '#CCFBF1' },
  'WATER WASH': { color: '#2563EB', bg: '#DBEAFE' },
  'READY': { color: '#059669', bg: '#D1FAE5' },
};

const STATUS_STYLES = {
  'ON TRACK': { color: '#059669', bg: '#D1FAE5' },
  'DELAYED': { color: '#EF4444', bg: '#FEE2E2' },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const kpis = [
    {
      label: 'Today Total Vehicle',
      value: MOCK_STATS.todayTotalVehicle,
      icon: Car,
      color: '#3B82F6',
      change: '+5 compared to yesterday',
      positive: true,
      action: () => navigate(ROUTES.GATE_DASHBOARD),
    },
    {
      label: 'Ready to Delivery',
      value: MOCK_STATS.readyToDelivery,
      icon: Package,
      color: '#10B981',
      change: '2 delivered today',
      positive: true,
      action: () => navigate(ROUTES.CRM_DELIVERY_READY),
    },
    {
      label: 'Total Users',
      value: MOCK_STATS.totalUsers,
      icon: Users,
      color: '#8B5CF6',
      change: '+2 added this week',
      positive: true,
      action: () => navigate(ROUTES.ADMIN_USERS),
    },
    {
      label: 'Pending Approval',
      value: MOCK_STATS.pendingApproval,
      icon: Clock,
      color: '#F59E0B',
      change: 'Requires immediate action',
      positive: false,
      action: () => navigate(ROUTES.MANAGER_PENDING_APPROVALS),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="System Administration"
        subtitle="Manage users, roles, service catalog and system configuration"
        actions={
          <Button variant="secondary" size="sm" leftIcon={RefreshCw} isLoading={refreshing} onClick={handleRefresh}>
            Refresh
          </Button>
        }
      />

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card 
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'transform 0.2s', 
                  '&:hover': { transform: 'translateY(-4px)' } 
                }} 
                onClick={kpi.action}
              >
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
                    <TrendingUp size={14} className="mr-1" /> {kpi.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Stage Distribution Chart */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" fontWeight={700}>Stage Distribution</Typography>
            <Chip label="LIVE" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0284C7', fontWeight: 700 }} />
          </Box>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STAGE_DIST} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} ticks={[0, 0.25, 0.5, 0.75, 1]} domain={[0, 1]} />
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', fontSize: '13px' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28}>
                  {MOCK_STAGE_DIST.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Vehicle Status Summary */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3, pb: '24px !important' }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            Vehicle Status Summary
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Registration</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Owner</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Stage</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_VEHICLE_STATUS.map((item, index) => {
                  const stageStyle = STAGE_STYLES[item.stage] || { color: '#0f172a', bg: '#e2e8f0' };
                  const statusStyle = STATUS_STYLES[item.status] || { color: '#0f172a', bg: '#e2e8f0' };
                  return (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{item.registration}</TableCell>
                      <TableCell>{item.owner}</TableCell>
                      <TableCell>
                        <Chip 
                          label={item.stage} 
                          size="small" 
                          sx={{ bgcolor: stageStyle.bg, color: stageStyle.color, fontWeight: 700, borderRadius: 1 }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.status} 
                          size="small" 
                          sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 700, borderRadius: 1 }} 
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
