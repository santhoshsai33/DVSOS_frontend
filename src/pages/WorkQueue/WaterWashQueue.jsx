import { useMemo, useState } from 'react';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplets,
  Truck,
  UserPlus,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/shared/PageHeader';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { ROUTES } from '../../config/routes';

const INITIAL_WASH_JOBS = [
  {
    id: 'W1',
    vehicleNumber: 'TN 09 AB 1234',
    customer: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    vehicle: 'Maruti Swift 2019',
    details: 'White - Petrol',
    washService: 'Premium Wash',
    previousStages: ['Mech'],
    waitMinutes: 22,
    movedAt: '2026-06-18T10:45:00+05:30',
    status: 'UNASSIGNED',
    assignee: '',
    priority: 'HIGH',
    delivery: '5:30 PM',
  },
  {
    id: 'W2',
    vehicleNumber: 'KA 01 MX 5678',
    customer: 'Priya Sharma',
    mobile: '+91 87654 32109',
    vehicle: 'Honda City 2021',
    details: 'Silver - Petrol',
    washService: 'Exterior Wash',
    previousStages: ['Mech'],
    waitMinutes: 5,
    movedAt: '2026-06-18T10:38:00+05:30',
    status: 'ASSIGNED',
    assignee: 'Wash Team A',
    priority: 'NORMAL',
    delivery: '4:45 PM',
  },
  {
    id: 'W3',
    vehicleNumber: 'MH 02 XY 9012',
    customer: 'Arun Pillai',
    mobile: '+91 76543 21098',
    vehicle: 'Hyundai i20 2022',
    details: 'Red - Diesel',
    washService: 'Foam Wash',
    previousStages: ['Mech', 'Body'],
    waitMinutes: 3,
    movedAt: '2026-06-18T10:25:00+05:30',
    status: 'UNASSIGNED',
    assignee: '',
    priority: 'NORMAL',
    delivery: '6:00 PM',
  },
  {
    id: 'W4',
    vehicleNumber: 'DL 05 AA 2233',
    customer: 'Vikram N.',
    mobile: '+91 65432 10987',
    vehicle: 'Toyota Innova 2020',
    details: 'Grey - Diesel',
    washService: 'Full Detail Wash',
    previousStages: ['Mech', 'Body'],
    waitMinutes: 0,
    movedAt: '2026-06-18T09:58:00+05:30',
    status: 'READY_FOR_DELIVERY',
    assignee: 'Wash Team B',
    priority: 'NORMAL',
    delivery: 'Ready',
  },
  {
    id: 'W5',
    vehicleNumber: 'AP 16 ZZ 7700',
    customer: 'Kiran Reddy',
    mobile: '+91 90000 11223',
    vehicle: 'Tata Nexon 2023',
    details: 'Blue - Diesel',
    washService: 'Interior Cleaning',
    previousStages: ['Mech'],
    waitMinutes: 38,
    movedAt: '2026-06-18T09:42:00+05:30',
    status: 'UNASSIGNED',
    assignee: '',
    priority: 'HIGH',
    delivery: 'Overdue',
  },
  {
    id: 'W6',
    vehicleNumber: 'KL 08 XY 5544',
    customer: 'Mohan D.',
    mobile: '+91 94444 99887',
    vehicle: 'Maruti Dzire 2021',
    details: 'Brown - Petrol',
    washService: 'Basic Wash',
    previousStages: ['Mech'],
    waitMinutes: 0,
    movedAt: '2026-06-18T09:15:00+05:30',
    status: 'COMPLETED',
    assignee: 'Wash Team C',
    priority: 'NORMAL',
    delivery: '12:30 PM',
  },
];

const SLA_MINUTES = 20;
const COLS = [
  { key: 'PENDING', label: 'Pending', icon: Clock, color: '#F59E0B' },
  { key: 'ASSIGNED', label: 'Assigned', icon: UserPlus, color: '#3B82F6' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Droplets, color: '#8B5CF6' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: '#10B981' },
];

const statusMeta = {
  UNASSIGNED: {
    label: 'Unassigned',
    tone: 'warning',
    action: 'Assign',
  },
  ASSIGNED: {
    label: 'Assigned',
    tone: 'info',
    action: 'Complete',
  },
  COMPLETED: {
    label: 'Wash Complete',
    tone: 'success',
    action: 'Ready to Delivery',
  },
  READY_FOR_DELIVERY: {
    label: 'Ready for Delivery',
    tone: 'success',
  },
};

const toneStyles = {
  warning: { bg: '#FFF7ED', border: '#FDBA74', color: '#C2410C' },
  info: { bg: '#ECFEFF', border: '#67E8F9', color: '#0E7490' },
  success: { bg: '#ECFDF5', border: '#86EFAC', color: '#047857' },
  danger: { bg: '#FEF2F2', border: '#FCA5A5', color: '#B42318' },
};

function StatusChip({ tone, icon, children }) {
  const style = toneStyles[tone] || toneStyles.info;
  return (
    <Chip
      icon={icon}
      label={children}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontWeight: 800,
        borderRadius: '9999px',
        '& .MuiChip-icon': { color: 'inherit', ml: 1 },
      }}
    />
  );
}

function StageChip({ label }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #86EFAC',
        bgcolor: '#ECFDF5',
        color: '#047857',
        borderRadius: '999px',
        px: 1,
        py: 0.3,
        fontSize: 11,
        fontWeight: 800,
        mr: 0.5,
        mb: 0.5,
      }}
    >
      {label}
    </Box>
  );
}

export default function WaterWashQueue() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs] = useState(INITIAL_WASH_JOBS);

  const isDashboard = location.pathname === ROUTES.WATER_WASH_DASHBOARD;

  const summary = useMemo(() => {
    const waiting = jobs.filter((job) => job.status === 'UNASSIGNED').length;

    return {
      PENDING: waiting,
      ASSIGNED: jobs.filter((job) => job.status === 'ASSIGNED').length,
      IN_PROGRESS: jobs.filter((job) => job.status === 'ASSIGNED').length,
      COMPLETED: jobs.filter((job) => ['COMPLETED', 'READY_FOR_DELIVERY'].includes(job.status)).length,
    };
  }, [jobs]);

  const openJob = (job) => {
    navigate(`${ROUTES.JOB_CARDS}/${job.id}`);
  };

  const displayedJobs = useMemo(() => {
    const sorted = [...jobs].sort((a, b) => new Date(b.movedAt) - new Date(a.movedAt));
    return isDashboard ? sorted.slice(0, 4) : sorted;
  }, [isDashboard, jobs]);

  const columns = [
    {
      header: 'VEHICLE NO.',
      render: (row) => <VehicleNumberPlate vehicleNumber={row.vehicleNumber} />,
    },
    {
      header: 'CUSTOMER',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
            {row.customer}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {row.mobile}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'VEHICLE',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
            {row.vehicle}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {row.details}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'WASH DETAILS',
      render: (row) => (
        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
          {row.washService}
        </Typography>
      ),
    },
    {
      header: 'PREVIOUS STAGES',
      render: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {row.previousStages.map((stage) => <StageChip key={stage} label={stage} />)}
        </Box>
      ),
    },
    {
      header: 'EMPLOYEE',
      render: (row) => (
        <Chip
          label={row.assignee || 'Unassigned'}
          size="small"
          sx={{
            bgcolor: row.assignee ? '#eff6ff' : 'transparent',
            color: row.assignee ? '#2563eb' : '#d97706',
            border: `1px solid ${row.assignee ? '#bfdbfe' : '#fcd34d'}`,
            fontWeight: 600,
            borderRadius: '9999px',
          }}
        />
      ),
    },
    {
      header: 'WAIT TIME',
      render: (row) => {
        if (['COMPLETED', 'READY_FOR_DELIVERY'].includes(row.status)) {
          return <Typography sx={{ color: '#059669', fontWeight: 800, fontSize: '0.875rem' }}>Done</Typography>;
        }

        const overdue = row.waitMinutes > SLA_MINUTES;
        return (
          <StatusChip tone={overdue ? 'danger' : 'info'} icon={overdue ? <AlertTriangle size={14} /> : undefined}>
            {overdue ? `${row.waitMinutes} min - overdue` : `${row.waitMinutes} min`}
          </StatusChip>
        );
      },
    },
    {
      header: 'STATUS',
      render: (row) => {
        const meta = statusMeta[row.status];
        return (
          <StatusChip
            tone={meta.tone}
            icon={row.status === 'READY_FOR_DELIVERY' ? <Truck size={14} /> : row.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : undefined}
          >
            {meta.label}
          </StatusChip>
        );
      },
    },
    {
      header: 'DELIVERY',
      render: (row) => (
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
          {row.status === 'READY_FOR_DELIVERY' ? `${row.delivery} ✓` : row.delivery}
        </Typography>
      ),
    },
    {
      header: 'ACTION',
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          rightIcon={ArrowRight}
          onClick={(event) => {
            event.stopPropagation();
            openJob(row);
          }}
          sx={{ fontWeight: 600, textTransform: 'none' }}
        >
          Open
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {COLS.map((col) => {
          const Icon = col.icon;
          const count = summary[col.key] || 0;
          return (
            <Grid item xs={12} sm={6} md={3} key={col.key}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  borderTop: `4px solid ${col.color}`,
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h3" fontWeight={800} sx={{ color: col.color, lineHeight: 1 }}>
                      {count}
                    </Typography>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${col.color}15`, color: col.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} />
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    {col.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB', height: '100%' }}>
            <CardContent sx={{ p: 3, pb: '24px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Droplets size={20} color="#6b7280" />
                <Typography variant="h6" fontWeight={800} sx={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isDashboard ? 'RECENT WATER WASH QUEUE' : 'WATER WASH JOB QUEUE'}
                </Typography>
              </Box>

              <DataTable
                columns={columns}
                data={displayedJobs}
                showPagination={false}
                onRowClick={openJob}
                emptyMessage="No vehicles in water wash queue"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
