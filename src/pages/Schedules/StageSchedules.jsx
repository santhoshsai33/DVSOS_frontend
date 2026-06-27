import React, { useState } from 'react';
import { Box, Card, Typography, IconButton, Chip, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import RHFSwitch from '../../components/form/RHFSwitch';
import ConfirmDeleteDialog from '../../components/common/ConfirmDeleteDialog';
import { ROUTES } from '../../config/routes';
import { toastSuccess } from '../../notifications/toast';

export default function StageSchedules() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  // Dummy Data for UI
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      stageName: 'Mechanical Inspection',
      intervalMinutes: 30,
      roles: ['MANAGER', 'FLOOR_SUPERVISOR'],
      message: 'Please complete the general inspection.',
      isActive: true,
    },
    {
      id: 2,
      stageName: 'Body Shop Repair',
      intervalMinutes: 60,
      roles: ['BODY_SHOP_SUPERVISOR'],
      message: 'Fix the rear bumper dent.',
      isActive: true,
    },
  ]);

  const filteredSchedules = schedules.filter((s) =>
    s.stageName.toLowerCase().includes(search.toLowerCase()) ||
    s.message.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedSchedules = filteredSchedules.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSchedule(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSchedule(null);
  };

  const handleEdit = () => {
    if (selectedSchedule) {
      navigate(ROUTES.MD_STAGE_SCHEDULES_EDIT.replace(':id', selectedSchedule.id));
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteItem(selectedSchedule);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (deleteItem) {
      setSchedules(prev => prev.filter(s => s.id !== deleteItem.id));
      toastSuccess('Schedule deleted successfully!');
      setDeleteItem(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, isActive: newStatus } : s));
    toastSuccess('Schedule status updated successfully!');
  };

  const columns = [
    {
      header: 'Stage Name',
      accessor: 'stageName',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.stageName}</Typography>,
    },
    {
      header: 'Interval Time',
      accessor: 'intervalMinutes',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.intervalMinutes} Minutes
        </Typography>
      ),
    },
    {
      header: 'Assigned Roles',
      accessor: 'roles',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.roles.map((role, idx) => (
            <Chip key={idx} label={role.replace(/_/g, ' ')} size="small" variant="outlined" />
          ))}
        </Box>
      ),
    },
    {
      header: 'Message',
      accessor: 'message',
      render: (row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
          {row.message}
        </Typography>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <RHFSwitch
          value={row.isActive}
          onChange={(newVal) => handleStatusChange(row.id, newVal)}
        />
      ),
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Stage Schedules"
        actions={
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => navigate(ROUTES.MD_STAGE_SCHEDULES_NEW)}
          >
            Add Schedule
          </Button>
        }
      />

      <Box sx={{ display: 'flex', mb: 3 }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search schedules..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(0);
            }}
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={paginatedSchedules}
          loading={false}
          emptyMessage="No schedules found."
          serverSide={false}
          totalCount={filteredSchedules.length}
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
        <MenuItem onClick={handleEdit}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete
        </MenuItem>
      </Menu>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Delete Schedule"
        message={`Are you sure you want to delete the schedule for "${deleteItem?.stageName}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </Box>
  );
}
