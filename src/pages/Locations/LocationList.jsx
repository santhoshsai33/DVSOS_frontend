import React, { useState } from 'react';
import { Box, Card, IconButton, Menu, MenuItem, Select, Typography } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import useMasterDataStore from '../../store/useMasterDataStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import ConfirmDeleteDialog from '../../components/common/ConfirmDeleteDialog';
import RHFSwitch from '../../components/form/RHFSwitch';

export default function LocationList() {
  const navigate = useNavigate();
  const { locations, deleteLocation, updateLocation } = useMasterDataStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedLocation(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLocation(null);
  };

  const handleDelete = () => {
    setDeleteItem(selectedLocation);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (deleteItem) {
      deleteLocation(deleteItem.id);
      toastSuccess(`Location "${deleteItem.name}" deleted successfully.`);
      setDeleteItem(null);
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
        <RHFSwitch
          value={row.status || 'ACTIVE'}
          onChange={(newVal) => handleStatusChange(row.id, newVal)}
        />
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

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Delete Location"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { width: 180, borderRadius: 2, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(ROUTES.ADMIN_LOCATIONS_EDIT.replace(':id', selectedLocation?.id)); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
