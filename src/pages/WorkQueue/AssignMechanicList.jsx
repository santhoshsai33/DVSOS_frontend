import { useState, useEffect } from 'react';
import { User, Printer, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Card, Chip } from '@mui/material';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import { toastSuccess, toastInfo, toastError } from '../../notifications/toast';
import { formatDateTime } from '../../utils/formatters';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/useAuthStore';
import { getMechanicalQueueApi, getBodyShopQueueApi, getWaterWashQueueApi, assignQueueWorkApi } from '../../api/queueApi';
import { getMechanicsDropdownApi } from '../../api/userApi';
import { getDepartmentFromModules } from '../../utils/authAccess';

const PENDING_JOBS = [
  { id: 'Q1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', makeModel: 'Hyundai i20', serviceType: 'General Service', priority: 'HIGH', waitTime: '1 hr 20 min', deliveryDate: new Date(Date.now() + 2 * 3600000).toISOString(), requiredServices: ['Water Wash'] },
  { id: 'Q2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', makeModel: 'Maruti Swift', serviceType: 'Oil Change', priority: 'NORMAL', waitTime: '45 min', deliveryDate: new Date(Date.now() + 4 * 3600000).toISOString(), requiredServices: [] },
  { id: 'Q3', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', makeModel: 'Tata Nexon', serviceType: 'Brake Service', priority: 'URGENT', waitTime: '10 min', deliveryDate: new Date(Date.now() + 1 * 3600000).toISOString(), requiredServices: ['Body Shop'] },
];

const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

export default function AssignMechanicList() {
  const queryClient = useQueryClient();
  const { role, user, menus } = useAuthStore();
  const locationId = user?.locationId || user?.location_id || user?.branchId || '';
  const queueCategory = getDepartmentFromModules(menus) || 'mechanical';
  const isBodyShop = queueCategory === 'body-shop';
  const isWaterWash = queueCategory === 'water-wash';
  const assigneeLabel = isBodyShop ? 'Technician' : isWaterWash ? 'Member' : 'Mechanic';
  const pageTitle = isBodyShop ? 'Assign Technician (Body Shop)' : isWaterWash ? 'Assign Water Wash Member' : 'Assign Mechanic';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const { data: jobsResponse, isLoading } = useQuery({
    queryKey: ['assign-mechanic-queue', role, locationId, page, rowsPerPage, search],
    queryFn: async () => {
      const params = { locationId, page: page + 1, limit: rowsPerPage, search };
      if (queueCategory === 'body-shop') {
        return getBodyShopQueueApi(params);
      } else if (queueCategory === 'water-wash') {
        return getWaterWashQueueApi(params);
      } else {
        return getMechanicalQueueApi(params);
      }
    },
    enabled: !!role
  });

  const { data: mechanicsResponse, isLoading: isMechanicsLoading } = useQuery({
    queryKey: ['mechanics-dropdown', role, locationId],
    queryFn: () => getMechanicsDropdownApi({ locationId, category: queueCategory }),
    enabled: !!role,
    staleTime: 60000
  });

  const apiJobs = jobsResponse?.data?.data || jobsResponse?.data || PENDING_JOBS;
  const mechanics = mechanicsResponse?.data?.users || mechanicsResponse?.users || [];

  const [localJobs, setLocalJobs] = useState([]);

  useEffect(() => {
    if (apiJobs) {
      setLocalJobs(apiJobs);
    }
  }, [apiJobs]);

  const [assignModal, setAssignModal] = useState({ isOpen: false, item: null });
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const selectedMechanicUser = mechanics.find((mechanic) => String(mechanic.id) === String(selectedMechanic));

  const assignMutation = useMutation({
    mutationFn: ({ jobCardId, payload }) => assignQueueWorkApi(jobCardId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assign-mechanic-queue'] });
      setLocalJobs((currentJobs) => currentJobs.filter((job) => {
        const currentJobCardId = job.jobCardId || job.id;
        const assignedJobCardId = assignModal.item?.jobCardId || assignModal.item?.id;
        return String(currentJobCardId) !== String(assignedJobCardId);
      }));
      setAssignModal({ isOpen: false, item: null });

      toastSuccess(`Assigned to ${selectedMechanicUser?.fullName || assigneeLabel.toLowerCase()}. Job Card sent to printer!`);

      // setTimeout(() => {
      //   toastInfo('Job Card printed successfully. Please attach it to the vehicle.');
      // }, 1500);
    },
    onError: (error) => {
      toastError(error?.message || `Failed to assign ${assigneeLabel.toLowerCase()}`);
    }
  });

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
      toastInfo(`Please select a ${assigneeLabel.toLowerCase()}`);
      return;
    }

    const jobCardId = assignModal.item?.jobCardId || assignModal.item?.id;

    if (!jobCardId) {
      toastError('Valid job card is required');
      return;
    }

    assignMutation.mutate({
      jobCardId,
      payload: {
        assignedUserId: Number(selectedMechanic),
        category: assignModal.item?.category || queueCategory
      }
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title={pageTitle}
        breadcrumbs={[{ label: pageTitle }]}
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
              totalCount={jobsResponse?.meta?.total || jobsResponse?.data?.total || jobsResponse?.total || filteredJobs.length}
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
        title={`Assign ${assigneeLabel}`}
        confirmLabel="Assign"
        onConfirm={handleConfirmAssign}
        isConfirming={assignMutation.isPending}
        confirmIcon={Printer}
      >
        {assignModal.item && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Please assign a {assigneeLabel.toLowerCase()} for job <strong>{assignModal.item.jobCardNo || assignModal.item.id}</strong>.
            </Typography>

            <FormControl fullWidth size="small">
              <InputLabel>{`Select ${assigneeLabel}`}</InputLabel>
              <Select
                value={selectedMechanic}
                label={`Select ${assigneeLabel}`}
                onChange={(e) => setSelectedMechanic(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {isMechanicsLoading && (
                  <MenuItem disabled value="">
                    Loading {assigneeLabel.toLowerCase()}s...
                  </MenuItem>
                )}
                {!isMechanicsLoading && mechanics.length === 0 && (
                  <MenuItem disabled value="">
                    No active {assigneeLabel.toLowerCase()}s found
                  </MenuItem>
                )}
                {mechanics.map((mechanic) => (
                  <MenuItem key={mechanic.id} value={mechanic.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {mechanic.fullName}{mechanic.employeeCode ? ` (${mechanic.employeeCode})` : ''}
                      </Typography>
                      <Chip
                        size="small"
                        label={mechanic.availabilityLabel || (mechanic.activeJobCount > 0 ? `Busy (${mechanic.activeJobCount} jobs)` : 'Available')}
                        sx={{
                          height: 22,
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          bgcolor: mechanic.activeJobCount > 0 ? '#FEF3C7' : '#DCFCE7',
                          color: mechanic.activeJobCount > 0 ? '#B45309' : '#15803D',
                          border: '1px solid',
                          borderColor: mechanic.activeJobCount > 0 ? '#FCD34D' : '#86EFAC',
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
{/* 
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280', fontSize: '0.875rem', mt: 1 }}>
              <Printer size={14} />
              <span>Assigning will automatically print a hard copy of the job card.</span>
            </Box> */}
          </Box>
        )}
      </Modal>
    </Box>
  );
}
