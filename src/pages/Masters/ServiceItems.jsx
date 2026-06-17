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
import { formatCurrency } from '../../utils/formatters';

export default function ServiceItems() {
  const navigate = useNavigate();
  const { masterServices, deleteService, updateService } = useMasterDataStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete service "${item.name}"?`)) {
      deleteService(item.id);
      toastSuccess(`Service "${item.name}" deleted successfully.`);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateService(id, { status: newStatus });
    toastSuccess('Service status updated successfully!');
  };

  const columns = [
    {
      header: 'Service Item Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
    },
    { header: 'Category Group', accessor: 'category' },
    {
      header: 'Base Price (₹)',
      accessor: 'price',
      render: (row) => <Typography variant="body2" fontWeight={600} color="success.main">{formatCurrency(row.price || 0)}</Typography>
    },
    {
      header: 'Est. Duration',
      accessor: 'estimatedMinutes',
      render: (row) => <Typography variant="body2">{row.estimatedMinutes ? `${row.estimatedMinutes} mins` : '-'}</Typography>
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
        title="Service Items"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Service Items' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_ITEMS_NEW)}>
            Add Service Item
          </Button>
        }
      />

      <Card sx={{ boxShadow: 1, borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={masterServices}
          emptyMessage="No service items found"
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/admin/master/items/${selectedItem?.id}/edit`); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit Service
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleDelete(selectedItem); }} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete Service
        </MenuItem>
      </Menu>
    </Box>
  );
}
