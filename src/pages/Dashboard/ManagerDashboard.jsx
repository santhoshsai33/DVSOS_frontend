import { Box, Card, Grid, Typography } from '@mui/material';
import {
  AlertTriangle,
  BarChart3,
  Car,
  CheckCircle2,
  ClipboardList,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { ROUTES } from '../../config/routes';

const kpis = [
  { label: 'Total Today', value: 23, color: '#12343B', iconBg: '#E9EEF1', icon: Car },
  { label: 'Completed', value: 9, color: '#22C7B8', iconBg: '#E8FAF8', icon: CheckCircle2 },
  { label: 'JC Pending', value: 2, color: '#D97706', iconBg: '#FFF4E5', icon: ClipboardList },
  { label: 'Delayed', value: 3, color: '#0EA5E9', iconBg: '#EAF8FF', icon: AlertTriangle },
];

const pipeline = [
  { label: 'Gate / JC Pending', value: 2, meta: 'Awaiting job card', color: '#D97706', bg: '#FFF7ED', route: ROUTES.CRM_PENDING_JOB_CARDS },
  { label: 'Mechanical', value: 8, meta: '3 active - 5 waiting', color: '#2563EB', bg: '#EFF6FF', route: ROUTES.FLOOR_MECHANICAL_QUEUE },
  { label: 'Body Shop', value: 4, meta: '2 active - 2 waiting', color: '#7C3AED', bg: '#F5F3FF', route: ROUTES.BODY_SHOP_QUEUE },
  { label: 'Water Wash', value: 5, meta: '2 washing - 3 queue', color: '#0891B2', bg: '#ECFEFF', route: ROUTES.WATER_WASH_QUEUE },
  { label: 'Completed', value: 9, meta: 'Ready for delivery', color: '#059669', bg: '#ECFDF5', route: ROUTES.CRM_DELIVERY_READY },
];

const vehicles = [
  {
    id: 'JC002',
    vehicleNumber: 'KA 05 XY 9876',
    ownerName: 'Priya Singh',
    ownerMobile: '9876543211',
    serviceType: 'Oil Change',
    services: ['Oil Change'],
    status: 'PENDING',
    technician: '',
    estimatedCost: 1200,
    createdAt: '2024-06-12T09:15:00Z',
    stage: 'Approval Pending',
    stageTone: 'danger',
    delivery: '5:00 PM',
  },
  {
    id: 'JC001',
    vehicleNumber: 'TN 01 AB 1234',
    ownerName: 'Ramesh Kumar',
    ownerMobile: '9876543210',
    serviceType: 'General Service',
    services: ['Oil Change', 'Brake Check', 'AC Service'],
    status: 'IN_PROGRESS',
    technician: 'Rajan M.',
    estimatedCost: 3500,
    createdAt: '2024-06-12T08:00:00Z',
    stage: 'Mechanical',
    stageTone: 'warning',
    delivery: '5:00 PM',
  },
  {
    id: 'JC003',
    vehicleNumber: 'MH 12 PQ 4567',
    ownerName: 'Arun Patel',
    ownerMobile: '9876543212',
    serviceType: 'Body Repair',
    services: ['Body Repair', 'Paint Job'],
    status: 'COMPLETED',
    technician: 'Vikram S.',
    estimatedCost: 18500,
    createdAt: '2024-06-12T07:30:00Z',
    stage: 'Completed',
    stageTone: 'info',
    delivery: '3:00 PM',
  },
  {
    id: 'JC004',
    vehicleNumber: 'DL 04 RS 3344',
    ownerName: 'Suresh Nair',
    ownerMobile: '9876543213',
    serviceType: 'Engine Repair',
    services: ['Engine Repair', 'Brake Service'],
    status: 'DELAYED',
    technician: 'Anand P.',
    estimatedCost: 25000,
    createdAt: '2024-06-11T10:00:00Z',
    stage: 'Body Shop',
    stageTone: 'purple',
    delivery: 'Tomorrow',
  },
  {
    id: 'JC005',
    vehicleNumber: 'TN 09 LM 8899',
    ownerName: 'Deepa Menon',
    ownerMobile: '9876543214',
    serviceType: 'General Service',
    services: ['General Service', 'Tyre Rotation'],
    status: 'BODY_SHOP',
    technician: 'Rajan M.',
    estimatedCost: 8000,
    createdAt: '2024-06-12T08:45:00Z',
    stage: 'Body Shop',
    stageTone: 'success',
    delivery: '11 AM',
  },
];

const toneStyles = {
  danger: { bg: '#FEF2F2', border: '#FCA5A5', color: '#B42318' },
  warning: { bg: '#FFFBEB', border: '#FCD34D', color: '#B7791F' },
  success: { bg: '#ECFDF5', border: '#86EFAC', color: '#047857' },
  info: { bg: '#EFF6FF', border: '#BFDBFE', color: '#2563EB' },
  purple: { bg: '#F5F3FF', border: '#DDD6FE', color: '#7C3AED' },
};

function StagePill({ tone, children }) {
  const style = toneStyles[tone] || toneStyles.info;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: style.border,
        bgcolor: style.bg,
        color: style.color,
        borderRadius: '999px',
        px: 1,
        py: 0.35,
        fontSize: 11,
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const jobCardColumns = [
    {
      header: 'Job Card #',
      accessor: 'id',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155' }}>
          #{row.id}
        </Typography>
      ),
    },
    {
      header: 'Vehicle',
      render: (row) => <VehicleNumberPlate vehicleNumber={row.vehicleNumber} />,
    },
    { header: 'Owner', accessor: 'ownerName' },
    { header: 'Mobile Number', accessor: 'ownerMobile' },
    {
      header: 'Stage',
      render: (row) => <StagePill tone={row.stageTone}>{row.stage}</StagePill>,
    },
    {
      header: 'Technician',
      render: (row) => row.technician || <Typography variant="body2" color="text.secondary">Unassigned</Typography>,
    },
    {
      header: 'Est. Cost',
      render: (row) => (
        <Typography variant="body2" fontWeight={800}>
          Rs. {row.estimatedCost.toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      header: 'Action',
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          rightIcon={Eye}
          onClick={(event) => {
            event.stopPropagation();
            navigate(`${ROUTES.JOB_CARDS}/${row.id}`);
          }}
        >
          Open
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  borderTop: '6px solid',
                  borderTopColor: kpi.color,
                  boxShadow: '0 12px 24px -22px rgba(15, 23, 42, 0.7)',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: kpi.color, lineHeight: 1 }}>
                      {kpi.value}
                    </Typography>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 3,
                        bgcolor: kpi.iconBg,
                        color: kpi.color,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Icon size={21} />
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" sx={{ color: '#334155', fontWeight: 800 }}>
                    {kpi.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', mb: 2 }}>
        <Box sx={{ p: 2.25 }}>
          <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Pipeline overview
          </Typography>
          <Box
            sx={{
              borderTop: '1px solid #D8E2F3',
              mt: 1.25,
              pt: 2,
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 2, lg: 3 },
              pb: 0.5,
            }}
          >
            {pipeline.map((stage, index) => (
              <Box key={stage.label} sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'center', gap: { xs: 1.25, lg: 2 }, flex: 1, width: '100%' }}>
                <Box
                  sx={{
                    width: '100%',
                    minHeight: 96,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: stage.color,
                    bgcolor: stage.bg,
                    p: 1.5,
                    '&:hover': { boxShadow: '0 10px 20px -18px rgba(15,23,42,0.9)' },
                  }}
                >
                  <Typography variant="caption" sx={{ display: 'block', color: stage.color, fontWeight: 900, textTransform: 'uppercase', fontSize: 10 }}>
                    {stage.label}
                  </Typography>
                  <Typography variant="h5" sx={{ color: stage.color, fontWeight: 900, my: 0.5 }}>{stage.value}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: 10 }}>{stage.meta}</Typography>
                </Box>
                {index < pipeline.length - 1 && (
                  <Typography sx={{ color: '#94A3B8', fontWeight: 900, transform: { xs: 'rotate(90deg)', lg: 'none' } }}>
                    {/* {'->'} */}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Card>

      <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #D8E2F3', display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChart3 size={18} color="#2563EB" />
          <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Recent job cards - click a row to view details
          </Typography>
        </Box>
        <DataTable
          columns={jobCardColumns}
          data={vehicles}
          showPagination={false}
          onRowClick={(row) => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
          emptyMessage="No recent job cards found"
        />
      </Card>
    </Box>
  );
}
