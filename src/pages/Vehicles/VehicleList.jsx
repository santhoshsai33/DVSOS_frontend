import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, MoreVertical, Eye, Clock } from 'lucide-react';
import { Box, Card, IconButton, Menu, MenuItem, Select, Typography } from '@mui/material';
import { useVehicles } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROUTES } from '../../config/routes';

export default function VehicleList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useVehicles({ 
    search: debouncedSearch, 
    status: statusFilter,
    page: page + 1,
    limit: rowsPerPage
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const columns = [
    {
      header: 'Vehicle Number',
      accessor: 'registrationNo',
      render: (row) => (
        <VehicleNumberPlate vehicleNumber={row.registrationNo} />
      ),
    },
    { header: 'Owner Name', render: (row) => row.customer?.fullName || 'N/A' },
    { header: 'Mobile', render: (row) => row.customer?.mobileNo || 'N/A' },
    { header: 'Make & Model', render: (row) => `${row.brand?.name || ''} ${row.model || ''}`.trim() || 'N/A' },
    { header: 'Type', render: (row) => row.variant || 'N/A' },
    { header: 'Fuel', accessor: 'fuelType' },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => <Typography variant="body2">{formatDateTime(row.createdAt)}</Typography>,
    },
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
  const STATUSES = ['', 'PENDING', 'IN_PROGRESS', 'BODY_SHOP', 'WATER_WASH', 'COMPLETED', 'DELAYED', 'DELIVERED'];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Vehicle Management"
        breadcrumbs={[{ label: 'Vehicles' }]}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search vehicle number, owner, mobile..."
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
            width: { xs: '100%', sm: 180 },
            bgcolor: 'background.paper',
            borderRadius: '24px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '1px' },
          }}
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>{s || 'All Statuses'}</MenuItem>
          ))}
        </Select>
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={tableData}
          loading={isLoading}
          onRowClick={(row) => navigate(`${ROUTES.VEHICLES}/${row.id}`)}
          emptyMessage="No vehicles found"
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
        PaperProps={{ sx: { width: 160, borderRadius: 2, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`${ROUTES.VEHICLES}/${selectedVehicle?.id}`); }}>
          <Eye size={16} className="mr-3 text-primary" />
          View Details
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`${ROUTES.VEHICLES}/${selectedVehicle?.id}/edit`); }}>
          <Edit3 size={16} className="mr-3 text-warning" />
          Edit Vehicle
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`${ROUTES.VEHICLES}/${selectedVehicle?.id}/history`); }}>
          <Clock size={16} className="mr-3 text-warning" />
          History
        </MenuItem>
      </Menu>
    </Box>
  );
}
