import { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { AlertTriangle, Clock, Car, PhoneCall, ChevronRight } from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDateTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { toastInfo } from '../../notifications/toast';

const now = Date.now();

const MOCK_DELAYED = [
  {
    id: 'JC-1012', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', mobile: '9876543210',
    makeModel: 'Hyundai i20', serviceType: 'Engine Repair', stage: 'Mechanical',
    promisedDelivery: new Date(now - 5 * 3600000).toISOString(),
    delayHours: 5.2, priority: 'HIGH',
  },
  {
    id: 'JC-1008', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', mobile: '9876543213',
    makeModel: 'Toyota Fortuner', serviceType: 'Full Service', stage: 'Body Shop',
    promisedDelivery: new Date(now - 2.5 * 3600000).toISOString(),
    delayHours: 2.5, priority: 'URGENT',
  },
  {
    id: 'JC-1003', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', mobile: '9876543212',
    makeModel: 'Honda City', serviceType: 'Body Repair', stage: 'Water Wash',
    promisedDelivery: new Date(now - 1.2 * 3600000).toISOString(),
    delayHours: 1.2, priority: 'NORMAL',
  },
  {
    id: 'JC-0998', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', mobile: '9876543211',
    makeModel: 'Maruti Swift', serviceType: 'Oil Change', stage: 'Mechanical',
    promisedDelivery: new Date(now - 8 * 3600000).toISOString(),
    delayHours: 8, priority: 'HIGH',
  },
  {
    id: 'JC-0991', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', mobile: '9876543214',
    makeModel: 'Mahindra XUV500', serviceType: 'Brake Service', stage: 'Approval Pending',
    promisedDelivery: new Date(now - 3 * 3600000).toISOString(),
    delayHours: 3, priority: 'HIGH',
  },
];

const PRIORITY_COLORS = { URGENT: '#EF4444', HIGH: '#F59E0B', NORMAL: '#3B82F6', LOW: '#10B981' };

function DelayBadge({ hours }) {
  const color = hours >= 6 ? '#EF4444' : hours >= 3 ? '#F59E0B' : '#3B82F6';
  return (
    <Box component="span" sx={{
      bgcolor: color + '15', color, fontWeight: 700, fontSize: '0.75rem',
      py: 0.5, px: 1.5, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 0.5
    }}>
      <Clock size={12} /> {hours.toFixed(1)} hrs late
    </Box>
  );
}

function StageBadge({ stage }) {
  const colors = {
    'Mechanical': { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
    'Body Shop': { bg: 'rgba(245,158,11,0.1)', color: '#B7791F' },
    'Water Wash': { bg: 'rgba(59,130,246,0.1)', color: '#2563EB' },
    'Approval Pending': { bg: 'rgba(139,92,246,0.1)', color: '#7C3AED' },
  };
  const style = colors[stage] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <Box component="span" sx={{ bgcolor: style.bg, color: style.color, fontWeight: 600, fontSize: '0.75rem', py: 0.5, px: 1.5, borderRadius: 8 }}>
      {stage}
    </Box>
  );
}

export default function DelayedJobs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 300);

  const filtered = MOCK_DELAYED.filter(
    (d) =>
      !debSearch ||
      d.vehicleNumber.toLowerCase().includes(debSearch.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(debSearch.toLowerCase()) ||
      d.id.toLowerCase().includes(debSearch.toLowerCase())
  ).sort((a, b) => b.delayHours - a.delayHours);

  const critical = filtered.filter(d => d.delayHours >= 6).length;
  const warning = filtered.filter(d => d.delayHours >= 3 && d.delayHours < 6).length;

  const columns = [
    {
      header: 'Job Card',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>{row.id}</Typography>
          <Typography variant="caption" color="text.secondary">{row.serviceType}</Typography>
        </Box>
      ),
    },
    {
      header: 'Vehicle',
      render: (row) => (
        <Box>
          <VehicleNumberPlate vehicleNumber={row.vehicleNumber} size="sm" />
          <Typography variant="caption" color="text.secondary">{row.makeModel}</Typography>
        </Box>
      ),
    },
    {
      header: 'Customer',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.ownerName}</Typography>
          <Typography variant="caption" color="text.secondary">{row.mobile}</Typography>
        </Box>
      ),
    },
    { header: 'Stage', render: (row) => <StageBadge stage={row.stage} /> },
    { header: 'Promised Delivery', render: (row) => <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>{formatDateTime(row.promisedDelivery)}</Typography> },
    { header: 'Delay', render: (row) => <DelayBadge hours={row.delayHours} /> },
    {
      header: 'Priority',
      render: (row) => (
        <Typography variant="body2" sx={{ color: PRIORITY_COLORS[row.priority], fontWeight: 700, fontSize: '0.78rem' }}>
          {row.priority}
        </Typography>
      ),
    },
    {
      header: 'Action',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="sm" variant="ghost"
            leftIcon={PhoneCall}
            onClick={() => toastInfo(`Calling ${row.ownerName} at ${row.mobile}...`)}
          >
            Call
          </Button>
          <Button
            size="sm" variant="outline"
            rightIcon={ChevronRight}
            onClick={() => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Delayed Jobs"
        subtitle={`${filtered.length} vehicles past promised delivery time`}
        breadcrumbs={[
          { label: 'Manager', path: ROUTES.MANAGER_DASHBOARD },
          { label: 'Delayed Jobs' },
        ]}
      />

      {/* Summary Alerts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 3, p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <AlertTriangle size={32} color="#EF4444" className="flex-shrink-0" />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#DC2626' }}>{critical}</Typography>
              <Typography variant="body2" sx={{ color: '#7F1D1D', fontWeight: 600 }}>Critical (6+ hrs overdue)</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: 3, p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Clock size={32} color="#F59E0B" className="flex-shrink-0" />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#D97706' }}>{warning}</Typography>
              <Typography variant="body2" sx={{ color: '#78350F', fontWeight: 600 }}>Warning (3–6 hrs overdue)</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: 'background.paper', border: '1.5px solid', borderColor: 'divider', borderRadius: 3, p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Car size={32} color="#3B82F6" className="flex-shrink-0" />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>{filtered.length}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Delayed Vehicles</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Filter Bar */}
      <Box sx={{ mb: 3, width: { xs: '100%', md: 350 } }}>
        <SearchBar
          placeholder="Search by job card, vehicle number, owner..."
          value={search}
          onChange={setSearch}
        />
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No delayed vehicles. Great job! 🎉"
        />
      </Card>
    </Box>
  );
}
