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

export default function ServiceCenterList() {
  const navigate = useNavigate();
  const { masterServiceCenters, deleteServiceCenter, updateServiceCenter } = useMasterDataStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCenter(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCenter(null);
  };

  const handleDelete = () => {
    setDeleteItem(selectedCenter);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (deleteItem) {
      deleteServiceCenter(deleteItem.id);
      toastSuccess(`Service Center "${deleteItem.name}" deleted successfully.`);
      setDeleteItem(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateServiceCenter(id, { status: newStatus });
    toastSuccess('Service Center status updated successfully!');
  };

  const columns = [
    {
      header: 'Service Center Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
    },
    {
      header: 'Contact Number',
      accessor: 'contactNumber'
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
        title="Service Centers Master"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Service Centers Master' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_SERVICE_CENTERS_NEW)}>
            Add Service Center
          </Button>
        }
      />

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={masterServiceCenters || []}
          emptyMessage="No service centers found"
        />
      </Card>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Delete Service Center"
        message="Are you sure you want to delete this service center? This action cannot be undone."
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/admin/service-centers/${selectedCenter?.id}/edit`); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit Service Center
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete Service Center
        </MenuItem>
      </Menu>
    </Box>
  );
}
