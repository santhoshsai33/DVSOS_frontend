import { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Select, MenuItem } from '@mui/material';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, Crown, RefreshCw, TrendingUp, Car, Package, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
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
  const [timeRange, setTimeRange] = useState('Today');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const kpis = [
    {
      label: 'Today Total Vehicle',
      value: MOCK_STATS.todayTotalVehicle,
      icon: Car,
      color: '#1a434d',
      change: '+5 compared to yesterday',
      positive: true,
      action: () => navigate(ROUTES.GATE_DASHBOARD),
    },
    {
      label: 'Ready to Delivery',
      value: MOCK_STATS.readyToDelivery,
      icon: Package,
      color: '#2dd4bf',
      change: '2 delivered today',
      positive: true,
      action: () => navigate(ROUTES.CRM_DELIVERY_READY),
    },
    {
      label: 'Total Users',
      value: MOCK_STATS.totalUsers,
      icon: Users,
      color: '#13323a',
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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F6F9', minHeight: '100%' }}>

      {/* Top Banner matching MDDashboard style with Teal Theme */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3,
        bgcolor: '#FFFFFF', p: 2, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        border: '1px solid #E5E7EB'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a434d' }}>
            <Crown size={22} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#000" sx={{ lineHeight: 1.2 }}>
              Super Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage users, roles, and system configuration
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={RefreshCw}
            isLoading={refreshing}
            onClick={handleRefresh}
            sx={{ bgcolor: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#e2e8f0' } }}
          >
            Refresh
          </Button>
          <Select
            size="small"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ minWidth: 120, borderRadius: 2, bgcolor: '#FFFFFF' }}
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This Week">This Week</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* KPI Cards Row (Styled like MDDashboard) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  borderTop: `4px solid ${kpi.color}`,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onClick={kpi.action}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ color: kpi.color }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1, mt: 0.5 }}>
                    {kpi.label}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" sx={{ color: kpi.positive ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                      <TrendingUp size={14} style={{ marginRight: 4 }} /> {kpi.change}
                    </Typography>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Stage Distribution Chart */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" fontWeight={800}>Stage Distribution</Typography>
            <Chip label="LIVE" size="small" sx={{ bgcolor: 'rgba(26, 67, 77, 0.1)', color: '#1a434d', fontWeight: 700 }} />
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
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB' }}>
        <CardContent sx={{ p: 3, pb: '24px !important' }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
            Vehicle Status Summary
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', py: 1.5, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderBottom: 'none' }}>Registration</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', py: 1.5, borderBottom: 'none' }}>Owner</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', py: 1.5, borderBottom: 'none' }}>Stage</TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', py: 1.5, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderBottom: 'none' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_VEHICLE_STATUS.map((item, index) => {
                  const stageStyle = STAGE_STYLES[item.stage] || { color: '#0f172a', bg: '#e2e8f0' };
                  const statusStyle = STATUS_STYLES[item.status] || { color: '#0f172a', bg: '#e2e8f0' };
                  return (
                    <TableRow key={index} sx={{ '& td': { borderBottom: '1px solid #F1F5F9', py: 2 } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#1E293B' }}>{item.registration}</TableCell>
                      <TableCell sx={{ fontWeight: 500, color: '#475569' }}>{item.owner}</TableCell>
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
