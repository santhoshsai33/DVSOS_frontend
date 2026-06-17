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

export default function ServiceCategories() {
  const navigate = useNavigate();
  const { serviceCategories, deleteCategory, updateCategory } = useMasterDataStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCategory(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete category "${item.name}"?`)) {
      deleteCategory(item.id);
      toastSuccess(`Category "${item.name}" deleted successfully.`);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateCategory(id, { status: newStatus });
    toastSuccess('Category status updated successfully!');
  };

  const columns = [
    {
      header: 'Category Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
    },
    { header: 'Description', accessor: 'description' },
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
        title="Service Categories"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Categories' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_CATEGORIES_NEW)}>
            Add Category
          </Button>
        }
      />

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={serviceCategories}
          emptyMessage="No service categories found"
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/admin/master/categories/${selectedCategory?.id}/edit`); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit Category
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); handleDelete(selectedCategory); }} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete Category
        </MenuItem>
      </Menu>
    </Box>
  );
}
