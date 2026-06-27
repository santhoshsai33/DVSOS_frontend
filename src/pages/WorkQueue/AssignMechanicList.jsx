import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Printer, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Card } from '@mui/material';
import Button from '../../components/common/Button';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import { toastSuccess, toastInfo } from '../../notifications/toast';
import { formatDateTime } from '../../utils/formatters';
import styles from './WorkQueue.module.css';
import { ROUTES } from '../../config/routes';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/useAuthStore';
import { ROLES } from '../../constants/roles';
import { getMechanicalQueueApi, getBodyShopQueueApi, getWaterWashQueueApi } from '../../api/queueApi';

const PENDING_JOBS = [
  { id: 'Q1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', makeModel: 'Hyundai i20', serviceType: 'General Service', priority: 'HIGH', waitTime: '1 hr 20 min', deliveryDate: new Date(Date.now() + 2 * 3600000).toISOString(), requiredServices: ['Water Wash'] },
  { id: 'Q2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', makeModel: 'Maruti Swift', serviceType: 'Oil Change', priority: 'NORMAL', waitTime: '45 min', deliveryDate: new Date(Date.now() + 4 * 3600000).toISOString(), requiredServices: [] },
  { id: 'Q3', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', makeModel: 'Tata Nexon', serviceType: 'Brake Service', priority: 'URGENT', waitTime: '10 min', deliveryDate: new Date(Date.now() + 1 * 3600000).toISOString(), requiredServices: ['Body Shop'] },
];

const MECHANICS = ['Rajan M.', 'Vikram S.', 'Anand P.', 'Suresh K.'];
const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

export default function AssignMechanicList() {
  const navigate = useNavigate();
  const { role, user } = useAuthStore();
  const locationId = user?.locationId || user?.location_id || user?.branchId || '';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: ['assign-mechanic-queue', role, locationId, page, rowsPerPage, search],
    queryFn: async () => {
      const params = { locationId, page: page + 1, limit: rowsPerPage, search };
      if (role === ROLES.BODY_SHOP_SUPERVISOR) {
        return getBodyShopQueueApi(params);
      } else if (role === ROLES.WATER_WASH_TEAM) {
        return getWaterWashQueueApi(params);
      } else {
        return getMechanicalQueueApi(params);
      }
    },
    enabled: !!role
  });

  const apiJobs = jobsResponse?.data?.data || jobsResponse?.data || PENDING_JOBS;

  const [localJobs, setLocalJobs] = useState([]);

  useEffect(() => {
    if (apiJobs) {
      setLocalJobs(apiJobs);
    }
  }, [apiJobs]);

  const [assignModal, setAssignModal] = useState({ isOpen: false, item: null });
  const [selectedMechanic, setSelectedMechanic] = useState('');

  const filteredJobs = localJobs.filter(job => 
    (job?.vehicleNo || job?.vehicleNumber || '')?.toLowerCase().includes(search.toLowerCase()) ||
    (job?.customerName || job?.ownerName || '')?.toLowerCase().includes(search.toLowerCase()) ||
    (job?.jobCardNo || job?.id || '')?.toString().toLowerCase().includes(search.toLowerCase())
  );

  const handleAssignClick = (item) => {
    setAssignModal({ isOpen: true, item });
    setSelectedMechanic('');
  };

  const columns = [
    {
      header: 'VEHICLE NO.',
      render: (row) => (
        <Typography sx={{ color: '#3b82f6', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.875rem' }}>
          {row.vehicleNo || row.vehicleNumber || '—'}
        </Typography>
      ),
    },
    {
      header: 'CUSTOMER',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{row.customerName || row.ownerName || '—'}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.vehicleModel || row.makeModel || '—'}</Typography>
        </Box>
      ),
    },
    {
      header: 'SERVICES',
      render: (row) => (
        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>
          {row.serviceNames?.length ? row.serviceNames.join(', ') : (row.serviceType || '—')}
        </Typography>
      ),
    },
    {
      header: 'PRIORITY',
      render: (row) => (
        <Typography variant="caption" sx={{
          bgcolor: `${PRIORITY_COLORS[row.priority || 'NORMAL']}15`,
          color: PRIORITY_COLORS[row.priority || 'NORMAL'],
          px: 1.5, py: 0.5, borderRadius: 8, fontWeight: 700,
          border: '1px solid', borderColor: `${PRIORITY_COLORS[row.priority || 'NORMAL']}40`,
          textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          {row.priority || 'NORMAL'}
        </Typography>
      ),
    },
    {
      header: 'WAIT TIME',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Clock size={14} color="#6b7280" />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
            {row.waitMinutes !== undefined ? `${row.waitMinutes} min` : (row.waitTime || '—')}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'DELIVERY',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AlertTriangle size={14} color="#f59e0b" />
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
            {row.expectedDeliveryAt ? formatDateTime(row.expectedDeliveryAt) : (row.deliveryDate ? formatDateTime(row.deliveryDate) : '—')}
          </Typography>
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
          onClick={(e) => {
            e.stopPropagation();
            handleAssignClick(row);
          }}
          sx={{
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Assign
        </Button>
      ),
    },
  ];

  const handleConfirmAssign = () => {
    if (!selectedMechanic) {
      toastInfo('Please select a mechanic');
      return;
    }

    setLocalJobs(localJobs.filter(j => j.id !== assignModal.item.id));
    setAssignModal({ isOpen: false, item: null });

    toastSuccess(`Assigned to ${selectedMechanic}. Job Card sent to printer!`);

    setTimeout(() => {
      toastInfo('Job Card printed successfully. Please attach it to the vehicle.');
    }, 1500);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Assign Mechanic"
        breadcrumbs={[{ label: 'Assign Mechanic' }]}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search vehicle, owner, job ID..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(0); }}
          />
        </Box>
      </Box>

      {/* Data Tables Row */}
      <Box sx={{ mt: 1 }}>
        <Card sx={{ borderRadius: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB', height: '100%' }}>
          <Box sx={{ p: 3, pb: '24px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <User size={20} color="#6b7280" />
              <Typography variant="h6" fontWeight={800} sx={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pending Allocation
              </Typography>
            </Box>

            <DataTable
              columns={columns}
              data={filteredJobs}
              emptyMessage="No jobs pending allocation."
              loading={isLoading}
              serverSide={true}
              totalCount={jobsResponse?.data?.total || jobsResponse?.total || filteredJobs.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newLimit) => {
                setRowsPerPage(newLimit);
                setPage(0);
              }}
            />
          </Box>
        </Card>
      </Box>

      <Modal
        show={assignModal.isOpen}
        onHide={() => setAssignModal({ isOpen: false, item: null })}
        title="Assign Mechanic & Print Card"
        confirmLabel="Assign & Print"
        onConfirm={handleConfirmAssign}
        confirmIcon={Printer}
      >
        {assignModal.item && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Please assign a mechanic for job <strong>#{assignModal.item.id}</strong>.
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>Select Mechanic</InputLabel>
              <Select
                value={selectedMechanic}
                label="Select Mechanic"
                onChange={(e) => setSelectedMechanic(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {MECHANICS.map(m => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280', fontSize: '0.875rem', mt: 1 }}>
              <Printer size={14} />
              <span>Assigning will automatically print a hard copy of the job card.</span>
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
}
