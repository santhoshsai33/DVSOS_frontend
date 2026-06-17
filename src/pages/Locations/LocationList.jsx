import React, { useState } from 'react';
import { Box, Card, IconButton, Menu, MenuItem, Select, Typography } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import useMasterDataStore from '../../store/useMasterDataStore';
import { toastSuccess } from '../../notifications/toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

export default function LocationList() {
  const navigate = useNavigate();
  const { locations, deleteLocation, updateLocation } = useMasterDataStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedLocation(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLocation(null);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteLocation(item.id);
      toastSuccess(`Location "${item.name}" deleted successfully.`);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateLocation(id, { status: newStatus });
    toastSuccess('Location status updated successfully!');
  };

  const columns = [
    {
      header: 'Location Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
    },
    {
      header: 'District',
      accessor: 'district'
    },
    {
      header: 'Phone No',
      accessor: 'phoneNo'
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Select
          native
          size="small"
          value={row.status || 'ACTIVE'}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          sx={{ width: 120, height: 32, fontSize: '0.85rem' }}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <IconButton size="small" onClick={(e) => handleMenuClick(e, row)}>
          <MoreVertical size={18} />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Locations"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Locations' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_LOCATIONS_NEW)}>
            Add Location
          </Button>
        }
      />

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={locations || []}
          emptyMessage="No locations found"
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { width: 180, borderRadius: 2, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/admin/locations/${selectedLocation?.id}/edit`); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit Location
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleDelete(selectedLocation); }} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete Location
        </MenuItem>
      </Menu>
    </Box>
  );
}
