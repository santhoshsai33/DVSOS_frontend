import { useState } from 'react';
import { AlertTriangle, ArrowRight, Clock, Droplets, Printer } from 'lucide-react';
import { Box, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/shared/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import { toastInfo, toastSuccess } from '../../notifications/toast';
import { formatDateTime } from '../../utils/formatters';

const PENDING_WASH_JOBS = [
  {
    id: 'W-Q1',
    vehicleNumber: 'TN 09 AB 1234',
    ownerName: 'Rajesh Kumar',
    makeModel: 'Maruti Swift',
    serviceType: 'Premium Wash',
    priority: 'HIGH',
    waitTime: '22 min',
    deliveryDate: new Date(Date.now() + 2 * 3600000).toISOString(),
  },
  {
    id: 'W-Q2',
    vehicleNumber: 'MH 02 XY 9012',
    ownerName: 'Arun Pillai',
    makeModel: 'Hyundai i20',
    serviceType: 'Foam Wash',
    priority: 'NORMAL',
    waitTime: '8 min',
    deliveryDate: new Date(Date.now() + 3 * 3600000).toISOString(),
  },
  {
    id: 'W-Q3',
    vehicleNumber: 'AP 16 ZZ 7700',
    ownerName: 'Kiran Reddy',
    makeModel: 'Tata Nexon',
    serviceType: 'Interior Cleaning',
    priority: 'URGENT',
    waitTime: '38 min',
    deliveryDate: new Date(Date.now() + 1 * 3600000).toISOString(),
  },
];

const WATER_WASH_MEMBERS = ['Wash Team A', 'Wash Team B', 'Wash Team C', 'Selvam R.', 'Naveen K.'];
const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

export default function WaterWashAssignMember() {
  const [jobs, setJobs] = useState(PENDING_WASH_JOBS);
  const [search, setSearch] = useState('');
  const [assignModal, setAssignModal] = useState({ isOpen: false, item: null });
  const [selectedMember, setSelectedMember] = useState('');

  const filteredJobs = jobs.filter((job) => (
    job.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
    job.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    job.id.toLowerCase().includes(search.toLowerCase())
  ));

  const handleAssignClick = (item) => {
    setAssignModal({ isOpen: true, item });
    setSelectedMember('');
  };

  const handleConfirmAssign = () => {
    if (!selectedMember) {
      toastInfo('Please select a water wash member');
      return;
    }

    setJobs((current) => current.filter((job) => job.id !== assignModal.item.id));
    setAssignModal({ isOpen: false, item: null });
    toastSuccess(`Assigned to ${selectedMember}. Wash job card sent to printer!`);

    setTimeout(() => {
      toastInfo('Wash job card printed successfully. Please attach it to the vehicle.');
    }, 1500);
  };

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
          <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{row.ownerName}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.makeModel}</Typography>
        </Box>
      ),
    },
    {
      header: 'WASH DETAILS',
      render: (row) => (
        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>{row.serviceType}</Typography>
      ),
    },
    {
      header: 'PRIORITY',
      render: (row) => (
        <Typography
          variant="caption"
          sx={{
            bgcolor: `${PRIORITY_COLORS[row.priority || 'NORMAL']}15`,
            color: PRIORITY_COLORS[row.priority || 'NORMAL'],
            px: 1.5,
            py: 0.5,
            borderRadius: 8,
            fontWeight: 700,
            border: '1px solid',
            borderColor: `${PRIORITY_COLORS[row.priority || 'NORMAL']}40`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {row.priority || 'NORMAL'}
        </Typography>
      ),
    },
    {
      header: 'WAIT TIME',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Clock size={14} color="#6b7280" />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{row.waitTime}</Typography>
        </Box>
      ),
    },
    {
      header: 'DELIVERY',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AlertTriangle size={14} color="#f59e0b" />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{formatDateTime(row.deliveryDate)}</Typography>
        </Box>
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
            handleAssignClick(row);
          }}
          sx={{ fontWeight: 600, textTransform: 'none' }}
        >
          Assign
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Assign Water Wash Member"
        breadcrumbs={[{ label: 'Assign Water Wash Member' }]}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search vehicle, owner, job ID..."
            value={search}
            onChange={setSearch}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Card sx={{ borderRadius: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB', height: '100%' }}>
          <Box sx={{ p: 3, pb: '24px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Droplets size={20} color="#6b7280" />
              <Typography variant="h6" fontWeight={800} sx={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pending Allocation
              </Typography>
            </Box>

            <DataTable
              columns={columns}
              data={filteredJobs}
              emptyMessage="No water wash jobs pending allocation."
              showPagination={true}
            />
          </Box>
        </Card>
      </Box>

      <Modal
        show={assignModal.isOpen}
        onHide={() => setAssignModal({ isOpen: false, item: null })}
        title="Assign Water Wash Member & Print Card"
        confirmLabel="Assign & Print"
        onConfirm={handleConfirmAssign}
        confirmIcon={Printer}
      >
        {assignModal.item && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Please assign a water wash member for job <strong>#{assignModal.item.id}</strong>.
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Select Water Wash Member</InputLabel>
              <Select
                value={selectedMember}
                label="Select Water Wash Member"
                onChange={(event) => setSelectedMember(event.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {WATER_WASH_MEMBERS.map((member) => (
                  <MenuItem key={member} value={member}>{member}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280', fontSize: '0.875rem', mt: 1 }}>
              <Printer size={14} />
              <span>Assigning will automatically print a hard copy of the wash job card.</span>
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
}
