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
import SearchBar from '../../components/common/SearchBar';
import { toastSuccess } from '../../notifications/toast';

export default function DistrictList() {
  const navigate = useNavigate();
  const { masterDistricts, masterStates, deleteDistrict, updateDistrict } = useMasterDataStore();
  const [search, setSearch] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedDistrict(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDistrict(null);
  };

  const handleDelete = () => {
    setDeleteItem(selectedDistrict);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (deleteItem) {
      deleteDistrict(deleteItem.id);
      toastSuccess(`District "${deleteItem.name}" deleted successfully.`);
      setDeleteItem(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateDistrict(id, { status: newStatus });
    toastSuccess('District status updated successfully!');
  };

  // Helper to get State Name from State ID
  const getStateName = (stateId) => {
    const state = masterStates.find(s => s.id === stateId);
    return state ? state.name : 'Unknown State';
  };

  const filteredDistricts = (masterDistricts || []).filter(dist =>
    dist.name.toLowerCase().includes(search.toLowerCase()) ||
    getStateName(dist.stateId).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'District Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
    },
    {
      header: 'State',
      accessor: 'stateId',
      render: (row) => <Typography variant="body2">{getStateName(row.stateId)}</Typography>
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
        title="Districts Master"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Districts Master' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_DISTRICTS_NEW)}>
            Add District
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search district or state..."
            value={search}
            onChange={setSearch}
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={filteredDistricts}
          emptyMessage="No districts found"
        />
      </Card>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Delete District"
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(ROUTES.ADMIN_MASTER_DISTRICTS_EDIT.replace(':id', selectedDistrict?.id)); }}>
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
