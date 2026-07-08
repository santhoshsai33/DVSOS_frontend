import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { Clock, CheckCircle2, User, AlertTriangle, ArrowRight, Paintbrush } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { ROUTES } from '../../config/routes';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/useAuthStore';
import { getBodyShopDashboardApi } from '../../api/dashboardApi';

// mock data for body shop
const QUEUE_DATA = [
  {
    id: 'B001',
    vehicleNumber: 'TN 09 LM 8899',
    customerName: 'Deepa Menon',
    phone: '+91 98765 43210',
    vehicleInfo: 'Mahindra XUV500',
    vehicleSpec: 'White - Diesel',
    services: 'Body Repair + Paint',
    mechanic: 'Unassigned',
    status: 'In Queue',
    delivery: '5:00 PM',
  },
  {
    id: 'B002',
    vehicleNumber: 'TN 05 CD 3322',
    customerName: 'Murugan A.',
    phone: '+91 87654 32109',
    vehicleInfo: 'Maruti Ertiga',
    vehicleSpec: 'Silver - Petrol',
    services: 'Dent Removal',
    mechanic: 'Ramesh K.',
    status: 'Approval',
    delivery: '3:00 PM',
  },
  {
    id: 'B003',
    vehicleNumber: 'KA 11 PQ 6677',
    customerName: 'Ravi S.',
    phone: '+91 76543 21098',
    vehicleInfo: 'Toyota Innova',
    vehicleSpec: 'White - Diesel',
    services: 'Full Body Repaint',
    mechanic: 'Suresh M.',
    status: 'In Progress',
    delivery: 'Tomorrow 10 AM',
  },
  {
    id: 'B004',
    vehicleNumber: 'MH 08 XX 9900',
    customerName: 'Srinivas R.',
    phone: '+91 65432 10987',
    vehicleInfo: 'Hyundai Venue',
    vehicleSpec: 'Blue - Petrol',
    services: 'Panel Beating',
    mechanic: 'Unassigned',
    status: 'In Queue',
    delivery: '4:00 PM',
  },
  {
    id: 'B005',
    vehicleNumber: 'TN 33 PQ 7788',
    customerName: 'Vikram Rajan',
    phone: '+91 54321 09876',
    vehicleInfo: 'Maruti Baleno 2023',
    vehicleSpec: 'Grey - Petrol',
    services: 'Bumper Replacement',
    mechanic: 'Manoj T.',
    status: 'Done',
    delivery: '12:00 PM ✓',
  }
];

const COLS = [
  { key: 'pending', label: 'Pending', icon: Clock, color: '#F59E0B' },
  { key: 'assigned', label: 'Assigned', icon: User, color: '#3B82F6' },
  { key: 'inProgress', label: 'In Progress', icon: Paintbrush, color: '#8B5CF6' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: '#10B981' },
];

export default function BodyShopQueue() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState([]);
  const [kpis, setKpis] = useState({ pending: 0, assigned: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getBodyShopDashboardApi();
        if (response.success) {
          setQueue(response.data?.queue || []);
          setKpis(response.data?.kpis || { pending: 0, assigned: 0, inProgress: 0, completed: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch body shop dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const columns = [
    {
      header: 'VEHICLE NO.',
      render: (row) => (
        <Typography sx={{ color: '#3b82f6', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.875rem' }}>
          {row.vehicleNumber}
        </Typography>
      ),
    },
    {
      header: 'CUSTOMER',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{row.customerName}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.phone}</Typography>
        </Box>
      ),
    },
    {
      header: 'VEHICLE',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{row.vehicleInfo}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.vehicleSpec}</Typography>
        </Box>
      ),
    },
    {
      header: 'SERVICES',
      render: (row) => (
        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>{row.services}</Typography>
      ),
    },
    {
      header: 'MECHANIC',
      render: (row) => {
        const mechanicStr = row.mechanic || 'Unassigned';
        const mechanics = mechanicStr.split(',').map(name => name.trim()).filter(Boolean);
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {mechanics.map((mechanicName, idx) => (
              <Chip
                key={idx}
                label={mechanicName}
                size="small"
                sx={{
                  bgcolor: mechanicName === 'Unassigned' ? 'transparent' : '#eff6ff',
                  color: mechanicName === 'Unassigned' ? '#d97706' : '#2563eb',
                  border: `1px solid ${mechanicName === 'Unassigned' ? '#fcd34d' : '#bfdbfe'}`,
                  fontWeight: 600,
                  borderRadius: '9999px'
                }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      header: 'BAY',
      render: (row) => {
        const bay = row.bay || row.assignedBay;
        return (
          <Typography sx={{ fontSize: '0.875rem', color: bay || row.bayName ? '#374151' : '#94a3b8', fontWeight: bay || row.bayName ? 600 : 500 }}>
            {bay?.bayName || bay?.bayCode || row.bayName || '—'}
          </Typography>
        );
      },
    },
    {
      header: 'STATUS',
      render: (row) => (
        <Chip
          icon={row.status === 'Approval' ? <AlertTriangle size={14} /> : row.status === 'Done' ? <CheckCircle2 size={14} /> : undefined}
          label={row.status}
          size="small"
          sx={{
            bgcolor: row.status === 'In Queue' ? 'transparent' :
              row.status === 'Approval' ? '#fef3c7' :
                row.status === 'In Progress' ? '#eff6ff' :
                  row.status === 'Done' ? '#ecfdf5' : '#f3f4f6',
            color: row.status === 'In Queue' ? '#d97706' :
              row.status === 'Approval' ? '#d97706' :
                row.status === 'In Progress' ? '#2563eb' :
                  row.status === 'Done' ? '#059669' : '#4b5563',
            border: `1px solid ${row.status === 'In Queue' ? '#fcd34d' :
              row.status === 'Approval' ? '#fcd34d' :
                row.status === 'In Progress' ? '#bfdbfe' :
                  row.status === 'Done' ? '#a7f3d0' : '#e5e7eb'}`,
            fontWeight: 600,
            borderRadius: '9999px',
            '& .MuiChip-icon': { color: 'inherit', ml: 1 }
          }}
        />
      ),
    },
    {
      header: 'DELIVERY',
      render: (row) => (
        <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{row.delivery}</Typography>
      ),
    },
    {
      header: 'ACTION',
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          rightIcon={ArrowRight}
          onClick={() => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
          sx={{
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Open
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F0F4FF', minHeight: '100%' }}>

      {/* KPI Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3, mt: 0 }}>
        {COLS.map((col, i) => {
          const Icon = col.icon;
          const count = kpis[col.key] || 0;
          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
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

      {/* Data Tables Row */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB', height: '100%' }}>
            <CardContent sx={{ p: 3, pb: '24px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Paintbrush size={20} color="#6b7280" />
                <Typography variant="h6" fontWeight={800} sx={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  RECENT BODY SHOP QUEUE
                </Typography>
              </Box>

              <DataTable
                columns={columns}
                data={queue}
                loading={loading}
                emptyMessage="No jobs in queue"
                showPagination={false}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
