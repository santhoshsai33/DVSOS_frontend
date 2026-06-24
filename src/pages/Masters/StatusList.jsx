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

export default function StatusList() {
  const navigate = useNavigate();
  const { masterStatuses, masterModules, deleteStatus, updateStatus } = useMasterDataStore();
  const [search, setSearch] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedStatus(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStatus(null);
  };

  const handleDelete = () => {
    setDeleteItem(selectedStatus);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (deleteItem) {
      deleteStatus(deleteItem.id);
      toastSuccess(`Status "${deleteItem.name}" deleted successfully.`);
      setDeleteItem(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateStatus(id, { status: newStatus });
    toastSuccess('Status updated successfully!');
  };

  const getModuleName = (moduleId) => {
    const module = masterModules?.find(m => m.id === moduleId);
    return module ? module.name : 'Unknown Module';
  };

  const filteredStatuses = (masterStatuses || []).filter(status =>
    status.name.toLowerCase().includes(search.toLowerCase()) ||
    getModuleName(status.moduleId).toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Module',
      accessor: 'moduleId',
      render: (row) => <Typography variant="body2">{getModuleName(row.moduleId)}</Typography>
    },
    {
      header: 'Status Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
    },
    {
      header: 'Description',
      accessor: 'description',
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
        title="Status Master"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Statuses' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_STATUSES_NEW)}>
            Add Status
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search status or module..."
            value={search}
            onChange={setSearch}
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={filteredStatuses}
          emptyMessage="No statuses found"
        />
      </Card>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Delete Status"
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
        PaperProps={{ sx: { width: 180, borderRadius: 0, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(ROUTES.ADMIN_MASTER_STATUSES_EDIT.replace(':id', selectedStatus?.id)); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit Status
        </MenuItem>
        {/* <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete Status
        </MenuItem> */}
      </Menu>
    </Box>
  );
}
