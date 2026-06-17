import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, Typography } from '@mui/material';
import {
  ClipboardList, Plus, Clock, Package, CheckCircle2,
  AlertCircle, ArrowRight, MessageCircle, Car, User
} from 'lucide-react';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import { formatDateTime, formatCurrency } from '../../../../utils/formatters';
import { ROUTES } from '../../../../config/routes';
import useAuthStore from '../../../../store/useAuthStore';

const MOCK_PENDING_JOBS = [
  { id: 'JC-1014', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', serviceType: 'Engine Repair', stage: 'Mechanical', estimatedCost: 4500, status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 'JC-1013', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', serviceType: 'Oil Change', stage: 'Approval Pending', estimatedCost: 1800, status: 'PENDING', createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString() },
  { id: 'JC-1011', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', serviceType: 'Body Repair', stage: 'Body Shop', estimatedCost: 7200, status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
];

const MOCK_READY = [
  { id: 'JC-1009', vehicleNumber: 'TN 02 CD 5566', ownerName: 'Vinoth Kumar', serviceType: 'General Service', amount: 2800, readySince: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: 'JC-1007', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', serviceType: 'Full Service', amount: 5400, readySince: new Date(Date.now() - 90 * 60000).toISOString() },
];

const STAGE_COLORS = {
  'Mechanical': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  'Body Shop': { bg: 'rgba(245,158,11,0.1)', color: '#B7791F' },
  'Water Wash': { bg: 'rgba(59,130,246,0.1)', color: '#2563EB' },
  'Approval Pending': { bg: 'rgba(139,92,246,0.1)', color: '#7C3AED' },
  'Ready': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
};

function StagePill({ stage }) {
  const s = STAGE_COLORS[stage] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <Box component="span" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: '0.72rem', px: 1.25, py: 0.5, borderRadius: 8 }}>
      {stage}
    </Box>
  );
}

export default function CrmDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const greeting = new Date().getHours() < 12 ? 'Good Morning' : 'Good Afternoon';

  const kpis = [
    { label: "Today's Job Cards", value: MOCK_PENDING_JOBS.length + MOCK_READY.length + 3, icon: ClipboardList, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', path: ROUTES.JOB_CARDS },
    { label: 'Pending Approvals', value: 2, icon: Clock, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', path: ROUTES.CRM_APPROVAL_FOLLOWUP },
    { label: 'Ready for Delivery', value: MOCK_READY.length, icon: Package, color: '#10B981', bg: 'rgba(16,185,129,0.08)', path: ROUTES.CRM_DELIVERY_READY },
    { label: 'Completed Today', value: 5, icon: CheckCircle2, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', path: ROUTES.JOB_CARDS },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] || 'Team'} 👋`}
        subtitle="Your CRM operations overview for today"
      />

      {/* KPI Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Box
              key={k.label}
              onClick={() => navigate(k.path)}
              sx={{
                bgcolor: k.bg, border: `1.5px solid ${k.color}25`,
                borderRadius: 3, p: 2, display: 'flex', alignItems: 'center', gap: 2,
                cursor: 'pointer', transition: 'transform 0.15s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: k.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={k.color} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mt: 0.5 }}>{k.label}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Grid container spacing={3}>
        {/* Active Job Cards */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ClipboardList size={18} color="#0d9488" />
                Active Job Cards
              </Typography>
              <Button variant="ghost" size="sm" rightIcon={ArrowRight} onClick={() => navigate(ROUTES.JOB_CARDS)}>
                View All
              </Button>
            </Box>
            <Box>
              {MOCK_PENDING_JOBS.map((job, i) => (
                <Box
                  key={job.id}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, p: 2,
                    borderBottom: i < MOCK_PENDING_JOBS.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Car size={16} color="#3B82F6" />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'primary.main' }}>{job.id}</Typography>
                      <StagePill stage={job.stage} />
                    </Box>
                    <Typography sx={{ fontSize: '0.82rem' }}><strong>{job.vehicleNumber}</strong> — {job.ownerName}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {job.serviceType} • Est. {formatCurrency(job.estimatedCost)} • {formatDateTime(job.createdAt)}
                    </Typography>
                  </Box>
                  <Button size="sm" variant="ghost" rightIcon={ArrowRight} onClick={() => navigate(`${ROUTES.JOB_CARDS}/${job.id}`)}>
                    View
                  </Button>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Ready for Delivery Panel */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, border: '1.5px solid rgba(16,185,129,0.25)' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10B981' }}>
                <Package size={18} />
                Ready for Delivery
              </Typography>
              <Button variant="ghost" size="sm" rightIcon={ArrowRight} onClick={() => navigate(ROUTES.CRM_DELIVERY_READY)}>
                All Ready
              </Button>
            </Box>
            <Box>
              {MOCK_READY.map((item, i) => (
                <Box
                  key={item.id}
                  sx={{ p: 2, borderBottom: i < MOCK_READY.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'primary.main' }}>{item.id}</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', mt: 0.5 }}>{item.vehicleNumber}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{item.ownerName} • {item.serviceType}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 800, color: '#10B981', fontSize: '1rem' }}>{formatCurrency(item.amount)}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Ready {formatDateTime(item.readySince)}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="sm" variant="ghost" leftIcon={MessageCircle} style={{ color: '#25D366', borderColor: '#25D366', fontSize: '0.75rem' }}
                      onClick={() => window.open(`https://wa.me/91${item.ownerMobile}`, '_blank')}>
                      WhatsApp
                    </Button>
                    <Button size="sm" variant="primary" style={{ fontSize: '0.75rem' }} onClick={() => navigate(ROUTES.CRM_DELIVERY_READY)}>
                      Confirm Delivery
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Quick Alert: Pending Approvals */}
          <Box sx={{
            mt: 2, bgcolor: 'rgba(139,92,246,0.07)', border: '1.5px solid rgba(139,92,246,0.2)',
            borderRadius: 3, p: 2, display: 'flex', alignItems: 'center', gap: 2,
          }}>
            <AlertCircle size={24} color="#8B5CF6" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#6D28D9' }}>2 Approvals Awaiting</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Customers haven't responded to estimates yet</Typography>
            </Box>
            <Button size="sm" variant="outline" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
              onClick={() => navigate(ROUTES.CRM_APPROVAL_FOLLOWUP)}>
              Follow Up
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
