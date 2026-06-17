import React, { useState } from 'react';
import { Box, Card, IconButton, Menu, MenuItem, Select, Typography, Chip } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import useMasterDataStore from '../../store/useMasterDataStore';
import { toastSuccess } from '../../notifications/toast';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

export default function StateList() {
  const navigate = useNavigate();
  const { masterStates, deleteState, updateState } = useMasterDataStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedState(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedState(null);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteState(item.id);
      toastSuccess(`State "${item.name}" deleted successfully.`);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateState(id, { status: newStatus });
    toastSuccess('State status updated successfully!');
  };

  const columns = [
    {
      header: 'State Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
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
        title="State Master"
        breadcrumbs={[{ label: 'Settings' }, { label: 'States Master' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_STATES_NEW)}>
            Add State
          </Button>
        }
      />

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={masterStates || []}
          emptyMessage="No states found"
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/admin/master-states/${selectedState?.id}/edit`); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit State
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleDelete(selectedState); }} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete State
        </MenuItem>
      </Menu>
    </Box>
  );
}
