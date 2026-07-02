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
import { toastSuccess } from '../../notifications/toast';
import StatusFilter from '../../components/common/StatusFilter';

const DEFAULT_BRANDS = [
  { id: 'b-1', name: 'Hyundai', country: 'South Korea', slug: 'hyundai', isActive: true },
  { id: 'b-2', name: 'Maruti Suzuki', country: 'India', slug: 'maruti-suzuki', isActive: true },
  { id: 'b-3', name: 'Honda', country: 'Japan', slug: 'honda', isActive: true },
  { id: 'b-4', name: 'Toyota', country: 'Japan', slug: 'toyota', isActive: true },
  { id: 'b-5', name: 'Mahindra', country: 'India', slug: 'mahindra', isActive: true },
  { id: 'b-6', name: 'Tata', country: 'India', slug: 'tata', isActive: true },
];

export default function BrandList() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Initialize and load brands from localStorage or fallback to defaults
  useEffect(() => {
    setLoading(true);
    const stored = localStorage.getItem('mock_brands');
    if (stored) {
      setBrands(JSON.parse(stored));
    } else {
      localStorage.setItem('mock_brands', JSON.stringify(DEFAULT_BRANDS));
      setBrands(DEFAULT_BRANDS);
    }
    setLoading(false);
  }, []);

  const saveBrandsToStorage = (updatedBrands) => {
    localStorage.setItem('mock_brands', JSON.stringify(updatedBrands));
    setBrands(updatedBrands);
  };

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

  const handleStatusChange = (id, newStatus) => {
    const updated = brands.map(b => b.id === id ? { ...b, isActive: newStatus } : b);
    saveBrandsToStorage(updated);
    toastSuccess('Brand status updated successfully!');
  };

  const filteredBrands = brands.filter(brand => {
    const query = search.toLowerCase();
    const matchSearch = brand.name.toLowerCase().includes(query);
    let matchStatus = true;
    if (statusFilter === 'ACTIVE') matchStatus = brand.isActive !== false; // assuming default true
    if (statusFilter === 'INACTIVE') matchStatus = brand.isActive === false;
    return matchSearch && matchStatus;
  });

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
          data={filteredBrands.slice(page * rowsPerPage, (page + 1) * rowsPerPage)}
          loading={loading}
          emptyMessage="No brands found"
          serverSide={false}
          totalCount={filteredBrands.length}
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(getEditPath(selectedBrand)); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit
        </MenuItem>
      </Menu>
    </Box>
  );
}
