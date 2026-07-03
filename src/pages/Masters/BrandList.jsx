import React, { useState, useEffect } from 'react';
import { Box, Card, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { Plus, Edit, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import RHFSwitch from '../../components/form/RHFSwitch';
import SearchBar from '../../components/common/SearchBar';
import { toastSuccess, toastError } from '../../notifications/toast';
import StatusFilter from '../../components/common/StatusFilter';
import { adminBrandApi } from '../../api/adminBrandApi';

export default function BrandList() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        isActive: statusFilter === 'ACTIVE' ? true : statusFilter === 'INACTIVE' ? false : undefined
      };
      const response = await adminBrandApi.getBrands(params);
      setBrands(response.data?.brands || []);
      setTotalCount(response.meta?.total || 0);
    } catch (error) {
      toastError('Failed to fetch brands');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, search, statusFilter]);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedBrand(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBrand(null);
  };

  const getEditPath = (brand) => {
    const identifier = brand?.slug || brand?.id;
    return ROUTES.ADMIN_MASTER_BRANDS_EDIT.replace(':slug', identifier);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminBrandApi.updateBrandStatus(id, newStatus);
      setBrands(prev => prev.map(b => b.id === id ? { ...b, isActive: newStatus } : b));
      toastSuccess('Brand status updated successfully!');
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to update status');
      fetchBrands(); // Refresh to original state
    }
  };

  const columns = [
    {
      header: 'Brand Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <RHFSwitch
          value={row.isActive !== undefined ? row.isActive : true}
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
        title="Brand Master"
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_MASTER_BRANDS_NEW)}>
            Add Brand
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search brand..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(0); }}
          />
        </Box>
        <StatusFilter
          value={statusFilter}
          onChange={(val) => { setStatusFilter(val); setPage(0); }}
        />
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={brands}
          loading={loading}
          emptyMessage="No brands found"
          serverSide={true}
          totalCount={totalCount}
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
        PaperProps={{ sx: { width: 180, borderRadius: 2, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          navigate(getEditPath(selectedBrand), { state: { brand: selectedBrand } }); 
        }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit
        </MenuItem>
      </Menu>
    </Box>
  );
}
