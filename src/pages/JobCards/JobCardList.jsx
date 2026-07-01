import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, IconButton, Menu, MenuItem, Select, Chip } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import { Plus, Eye, Edit, MoreVertical, PlusCircle, MessageCircle } from 'lucide-react';
import { useJobCards } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROUTES } from '../../config/routes';
import useAuthStore from '../../store/useAuthStore';
import { getDepartmentFromModules, hasReadableModule } from '../../utils/authAccess';

const PRIORITY_COLORS = {
  LOW: '#10B981',
  NORMAL: '#3B82F6',
  HIGH: '#F59E0B',
  URGENT: '#EF4444',
};

export default function JobCardList() {
  const navigate = useNavigate();
  const { menus } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(search, 300);
  const department = getDepartmentFromModules(menus);
  const canCreateJobCard = !['body-shop', 'water-wash'].includes(department);
  const departmentFilter = ['body-shop', 'water-wash'].includes(department) ? department : undefined;

  const { data, isLoading } = useJobCards({
    search: debouncedSearch,
    status: statusFilter,
    department: departmentFilter,
    page: page + 1,
    limit: rowsPerPage
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedJob(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const columns = [
    {
      header: 'Job Card #',
      accessor: 'jobCardNo',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
          #{row.jobCardNo}
        </Typography>
      ),
    },
    {
      header: 'Vehicle',
      render: (row) => (
        <VehicleNumberPlate vehicleNumber={row.vehicle?.registrationNo} />
      ),
    },
    { header: 'Owner', render: (row) => row.customer?.fullName || 'N/A' },
    { header: 'Mobile Number', render: (row) => row.customer?.mobileNo || '-' },
    {
      header: 'Priority',
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
    { header: 'Status', render: (row) => <StatusBadge status={row.currentStatus?.statusCode || 'PENDING'} /> },
    {
      header: 'MECHANIC',
      accessor: 'technician',
      render: (row) => {
        const mechanicName = row.technician || 'Unassigned';
        return (
          <Chip
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
        );
      }
    },
    { header: 'Est. Cost', render: (row) => <Typography variant="body2" fontWeight={600}>{formatCurrency(row.totalEstimate)}</Typography> },
    { header: 'Created', render: (row) => <Typography variant="body2">{formatDateTime(row.createdAt)}</Typography> },
    {
      header: 'Actions',
      render: (row) => (
        <IconButton size="small" onClick={(e) => handleMenuClick(e, row)}>
          <MoreVertical size={18} />
        </IconButton>
      ),
    },
  ];

  const tableData = data?.data || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Job Cards"
        breadcrumbs={[{ label: 'Job Cards' }]}
        actions={canCreateJobCard ? (
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.CRM_CREATE_JOB_CARD)}>
            Create Job Card
          </Button>
        ) : null}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search vehicle, owner, job ID..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(0); }}
          />
        </Box>
        <Select
          size="small"
          displayEmpty
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          sx={{
            width: { xs: '100%', sm: 200 },
            bgcolor: 'background.paper',
            borderRadius: '24px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '1px' },
          }}
        >
          {['', 'PENDING', 'IN_PROGRESS', 'BODY_SHOP', 'WATER_WASH', 'COMPLETED', 'DELAYED'].map((s) => (
            <MenuItem key={s} value={s}>{s || 'All Statuses'}</MenuItem>
          ))}
        </Select>
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={tableData}
          loading={isLoading}
          onRowClick={(row) => navigate(`${ROUTES.JOB_CARDS}/view/${row.slug || row.id}`)}
          emptyMessage="No job cards found"
          serverSide={true}
          totalCount={data?.meta?.total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { width: 220, borderRadius: 2, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`${ROUTES.JOB_CARDS}/view/${selectedJob?.slug || selectedJob?.id}`); }}>
          <Eye size={16} className="mr-3 text-primary" />
          View
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`${ROUTES.JOB_CARDS}/edit/${selectedJob?.slug || selectedJob?.id}`); }}>
          <Edit size={16} className="mr-3 text-warning" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          if (department === 'mechanical') {
            navigate(`${ROUTES.FLOOR_ADDITIONAL_WORK_NEW}?jobCardId=${selectedJob?.id}`);
          } else if (department === 'body-shop') {
            navigate(`${ROUTES.BODY_SHOP_ADDITIONAL_WORK_NEW}?jobCardId=${selectedJob?.id}`);
          } else {
            const targetRoute = hasReadableModule(menus, 'crm-team') ? ROUTES.CRM_ADDITIONAL_WORK : ROUTES.FLOOR_ADDITIONAL_WORK_NEW;
            navigate(`${targetRoute}?jobCardId=${selectedJob?.id}`);
          }
        }}>
          <PlusCircle size={16} className="mr-3 text-body-shop" />
          Add Additional Work
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          const message = `Hello ${selectedJob?.ownerName || 'Customer'}, your vehicle service card #${selectedJob?.id} estimate is ready. Please reply YES to approve work.`;
          window.open(`https://wa.me/91${selectedJob?.ownerMobile || selectedJob?.mobile || ''}?text=${encodeURIComponent(message)}`, '_blank');
        }} sx={{ color: '#10B981' }}>
          <MessageCircle size={16} className="mr-3 text-success" />
          WhatsApp Resend
        </MenuItem>
      </Menu>
    </Box>
  );
}
