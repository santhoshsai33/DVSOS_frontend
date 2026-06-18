import { useMemo, useState } from 'react';
import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Droplets,
  Eye,
  Truck,
  UserPlus,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';

const INITIAL_WASH_JOBS = [
  {
    id: 'W1',
    vehicleNumber: 'TN 09 AB 1234',
    customer: 'Rajesh Kumar',
    mobile: '+91 98765 43210',
    vehicle: 'Maruti Swift 2019',
    details: 'White - Petrol',
    previousStages: ['Mech'],
    waitMinutes: 22,
    movedAt: '2026-06-18T10:45:00+05:30',
    status: 'UNASSIGNED',
    assignee: '',
    priority: 'HIGH',
  },
  {
    id: 'W2',
    vehicleNumber: 'KA 01 MX 5678',
    customer: 'Priya Sharma',
    mobile: '+91 87654 32109',
    vehicle: 'Honda City 2021',
    details: 'Silver - Petrol',
    previousStages: ['Mech'],
    waitMinutes: 5,
    movedAt: '2026-06-18T10:38:00+05:30',
    status: 'ASSIGNED',
    assignee: 'Wash Team A',
    priority: 'NORMAL',
  },
  {
    id: 'W3',
    vehicleNumber: 'MH 02 XY 9012',
    customer: 'Arun Pillai',
    mobile: '+91 76543 21098',
    vehicle: 'Hyundai i20 2022',
    details: 'Red - Diesel',
    previousStages: ['Mech', 'Body'],
    waitMinutes: 3,
    movedAt: '2026-06-18T10:25:00+05:30',
    status: 'UNASSIGNED',
    assignee: '',
    priority: 'NORMAL',
  },
  {
    id: 'W4',
    vehicleNumber: 'DL 05 AA 2233',
    customer: 'Vikram N.',
    mobile: '+91 65432 10987',
    vehicle: 'Toyota Innova 2020',
    details: 'Grey - Diesel',
    previousStages: ['Mech', 'Body'],
    waitMinutes: 0,
    movedAt: '2026-06-18T09:58:00+05:30',
    status: 'READY_FOR_DELIVERY',
    assignee: 'Wash Team B',
    priority: 'NORMAL',
  },
  {
    id: 'W5',
    vehicleNumber: 'AP 16 ZZ 7700',
    customer: 'Kiran Reddy',
    mobile: '+91 90000 11223',
    vehicle: 'Tata Nexon 2023',
    details: 'Blue - Diesel',
    previousStages: ['Mech'],
    waitMinutes: 38,
    movedAt: '2026-06-18T09:42:00+05:30',
    status: 'UNASSIGNED',
    assignee: '',
    priority: 'HIGH',
  },
  {
    id: 'W6',
    vehicleNumber: 'KL 08 XY 5544',
    customer: 'Mohan D.',
    mobile: '+91 94444 99887',
    vehicle: 'Maruti Dzire 2021',
    details: 'Brown - Petrol',
    previousStages: ['Mech'],
    waitMinutes: 0,
    movedAt: '2026-06-18T09:15:00+05:30',
    status: 'COMPLETED',
    assignee: 'Wash Team C',
    priority: 'NORMAL',
  },
];

const SLA_MINUTES = 20;
const WATER_WASH_EMPLOYEES = ['Wash Team A', 'Wash Team B', 'Wash Team C', 'Selvam R.', 'Naveen K.'];

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
    action: 'View',
  },
};

const toneStyles = {
  warning: { bg: '#FFF7ED', border: '#FDBA74', color: '#C2410C' },
  info: { bg: '#ECFEFF', border: '#67E8F9', color: '#0E7490' },
  success: { bg: '#ECFDF5', border: '#86EFAC', color: '#047857' },
  danger: { bg: '#FEF2F2', border: '#FCA5A5', color: '#B42318' },
};

function StatusPill({ tone, children }) {
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
  const [jobs, setJobs] = useState(INITIAL_WASH_JOBS);
  const [assignJob, setAssignJob] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const isDashboard = location.pathname === ROUTES.WATER_WASH_DASHBOARD;

  const summary = useMemo(() => {
    const waiting = jobs.filter((job) => job.status === 'UNASSIGNED').length;
    const overdue = jobs.filter((job) => !['COMPLETED', 'READY_FOR_DELIVERY'].includes(job.status) && job.waitMinutes > SLA_MINUTES).length;
    const doneToday = jobs.filter((job) => ['COMPLETED', 'READY_FOR_DELIVERY'].includes(job.status)).length;

    return [
      { label: 'Total Today', value: jobs.length, color: '#12343B', iconBg: '#E9EEF1', icon: Droplets },
      { label: 'Completed', value: doneToday, color: '#22C7B8', iconBg: '#E8FAF8', icon: CheckCircle2 },
      { label: 'Waiting', value: waiting, color: '#D97706', iconBg: '#FFF4E5', icon: Clock },
      { label: 'Delayed', value: overdue, color: '#0EA5E9', iconBg: '#EAF8FF', icon: AlertTriangle },
    ];
  }, [jobs]);

  const openJob = (job) => {
    navigate(`${ROUTES.WATER_WASH_JOB}/${job.id}`);
  };

  const openAssignModal = (job) => {
    setAssignJob(job);
    setSelectedEmployee(job.assignee || WATER_WASH_EMPLOYEES[0]);
  };

  const closeAssignModal = () => {
    setAssignJob(null);
    setSelectedEmployee('');
  };

  const handleAssign = () => {
    if (!assignJob || !selectedEmployee) return;

    setJobs((current) => current.map((job) => (
      job.id === assignJob.id
        ? { ...job, assignee: selectedEmployee, status: 'ASSIGNED', waitMinutes: 0 }
        : job
    )));
    toastSuccess(`${assignJob.vehicleNumber} assigned to ${selectedEmployee}`);
    closeAssignModal();
  };

  const handleComplete = (job) => {
    setJobs((current) => current.map((item) => (
      item.id === job.id ? { ...item, status: 'COMPLETED', waitMinutes: 0 } : item
    )));
    toastSuccess(`Water wash completed for ${job.vehicleNumber}`);
  };

  const handleReadyForDelivery = (job) => {
    setJobs((current) => current.map((item) => (
      item.id === job.id ? { ...item, status: 'READY_FOR_DELIVERY', waitMinutes: 0 } : item
    )));
    toastSuccess(`${job.vehicleNumber} moved to ready for delivery`);
  };

  const handleAction = (row) => {
    if (row.status === 'UNASSIGNED') {
      openAssignModal(row);
      return;
    }

    if (row.status === 'ASSIGNED') {
      handleComplete(row);
      return;
    }

    if (row.status === 'COMPLETED') {
      handleReadyForDelivery(row);
      return;
    }

    openJob(row);
  };

  const displayedJobs = useMemo(() => {
    const sorted = [...jobs].sort((a, b) => new Date(b.movedAt) - new Date(a.movedAt));
    return isDashboard ? sorted.slice(0, 4) : sorted;
  }, [isDashboard, jobs]);

  const columns = [
    {
      header: 'Vehicle No.',
      render: (row) => <VehicleNumberPlate vehicleNumber={row.vehicleNumber} />,
    },
    {
      header: 'Customer',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A' }}>
            {row.customer}
          </Typography>
          <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 600 }}>
            {row.mobile}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Vehicle',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
            {row.vehicle}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            {row.details}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Previous Stages',
      render: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {row.previousStages.map((stage) => <StageChip key={stage} label={stage} />)}
        </Box>
      ),
    },
    {
      header: 'Assigned To',
      render: (row) => row.assignee || (
        <Typography variant="body2" color="text.secondary">
          Unassigned
        </Typography>
      ),
    },
    {
      header: 'Wait Time',
      render: (row) => {
        if (['COMPLETED', 'READY_FOR_DELIVERY'].includes(row.status)) {
          return <Typography variant="body2" sx={{ color: '#059669', fontWeight: 800 }}>Done</Typography>;
        }

        const overdue = row.waitMinutes > SLA_MINUTES;
        return (
          <StatusPill tone={overdue ? 'danger' : 'info'}>
            {overdue ? `${row.waitMinutes} min - overdue` : `${row.waitMinutes} min`}
          </StatusPill>
        );
      },
    },
    {
      header: 'Status',
      render: (row) => {
        const meta = statusMeta[row.status];
        return <StatusPill tone={meta.tone}>{meta.label}</StatusPill>;
      },
    },
    {
      header: 'Action',
      render: (row) => {
        const meta = statusMeta[row.status];
        return (
          <Button
            variant={row.status === 'COMPLETED' ? 'success' : row.status === 'READY_FOR_DELIVERY' ? 'outline' : 'primary'}
            size="sm"
            rightIcon={
              row.status === 'UNASSIGNED'
                ? UserPlus
                : row.status === 'ASSIGNED'
                  ? CheckCircle2
                  : row.status === 'COMPLETED'
                    ? Truck
                    : Eye
            }
            onClick={(event) => {
              event.stopPropagation();
              handleAction(row);
            }}
            sx={{ minWidth: row.status === 'COMPLETED' ? 148 : 104 }}
          >
            {meta.action}
          </Button>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#EEF4FF', minHeight: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {summary.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
              <Card
                sx={{
                  minHeight: 170,
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
                <Box sx={{ p: 3, minHeight: 170, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: kpi.color, lineHeight: 1, mb: 2 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#334155', fontWeight: 800 }}>
                    {kpi.label}
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Box
                    sx={{
                      alignSelf: 'flex-end',
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
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Card sx={{ borderRadius: 2, border: '1px solid #D8E2F3', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #D8E2F3', display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChart3 size={18} color="#2563EB" />
          <Typography variant="caption" sx={{ color: '#8A9AB5', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {isDashboard
              ? 'Recently moved to water wash queue - assign employee to start wash'
              : 'All water wash queue - assign employee and update wash status'}
          </Typography>
        </Box>
        <DataTable
          columns={columns}
          data={displayedJobs}
          showPagination={false}
          onRowClick={openJob}
          emptyMessage="No vehicles in water wash queue"
        />
      </Card>

      <Modal
        show={Boolean(assignJob)}
        onHide={closeAssignModal}
        title="Assign Water Wash Employee"
        confirmLabel="Assign"
        onConfirm={handleAssign}
      >
        <Box sx={{ display: 'grid', gap: 2 }}>
          {assignJob && (
            <Box sx={{ display: 'grid', gap: 0.5 }}>
              <VehicleNumberPlate vehicleNumber={assignJob.vehicleNumber} />
              <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700 }}>
                {assignJob.customer} - {assignJob.vehicle}
              </Typography>
            </Box>
          )}

          <FormControl fullWidth>
            <InputLabel id="water-wash-employee-label">Water wash employee</InputLabel>
            <Select
              labelId="water-wash-employee-label"
              label="Water wash employee"
              value={selectedEmployee}
              onChange={(event) => setSelectedEmployee(event.target.value)}
            >
              {WATER_WASH_EMPLOYEES.map((employee) => (
                <MenuItem key={employee} value={employee}>
                  {employee}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Modal>
    </Box>
  );
}
