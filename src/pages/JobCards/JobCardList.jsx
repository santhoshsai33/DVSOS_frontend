import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, IconButton, Menu, MenuItem, Select } from '@mui/material';
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
import { ROLES } from '../../constants/roles';

const PRIORITY_COLORS = {
  LOW: '#10B981',
  NORMAL: '#3B82F6',
  HIGH: '#F59E0B',
  URGENT: '#EF4444',
};

export default function JobCardList() {
  const navigate = useNavigate();
  const { role } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useJobCards({ search: debouncedSearch, status: statusFilter });

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
      accessor: 'id',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
          #{row.id}
        </Typography>
      ),
    },
    {
      header: 'Vehicle',
      render: (row) => (
        <VehicleNumberPlate vehicleNumber={row.vehicleNumber} />
      ),
    },
    { header: 'Owner', accessor: 'ownerName' },
    { header: 'Mobile Number', render: (row) => row.ownerMobile || row.mobile || <Typography color="text.secondary">-</Typography> },
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
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Technician', accessor: 'technician', render: (row) => row.technician || <Typography color="text.secondary" variant="body2">Unassigned</Typography> },
    { header: 'Est. Cost', render: (row) => <Typography variant="body2" fontWeight={600}>{formatCurrency(row.estimatedCost)}</Typography> },
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
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.CRM_CREATE_JOB_CARD)}>
            Create Job Card
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search vehicle, owner, job ID..."
            value={search}
            onChange={setSearch}
          />
        </Box>
        <Select
          size="small"
          displayEmpty
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
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
          isLoading={isLoading}
          onRowClick={(row) => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
          emptyMessage="No job cards found"
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(`${ROUTES.JOB_CARDS}/${selectedJob?.id}`); }}>
          <Eye size={16} className="mr-3 text-primary" />
          View
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`${ROUTES.JOB_CARDS}/${selectedJob?.id}/edit`); }}>
          <Edit size={16} className="mr-3 text-warning" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          const targetRoute = role === ROLES.CRM_TEAM ? ROUTES.CRM_ADDITIONAL_WORK : ROUTES.FLOOR_ADDITIONAL_WORK;
          navigate(`${targetRoute}?jobCardId=${selectedJob?.id}`);
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
