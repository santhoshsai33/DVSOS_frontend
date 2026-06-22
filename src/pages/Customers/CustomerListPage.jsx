import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, IconButton, Select, Typography, Box, Card } from '@mui/material';
import { Plus, Edit, Trash2, Mail, Search, MoreVertical, MapPin } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import ConfirmDeleteDialog from '../../components/common/ConfirmDeleteDialog';
import RHFSwitch from '../../components/form/RHFSwitch';

const INITIAL_CUSTOMERS = [
  { id: '1', name: 'Ramesh Patel', email: 'ramesh@gmail.com', mobile: '9876543210', address: '45 Green Park, Madurai', visits: 4, status: 'ACTIVE' },
  { id: '2', name: 'Anjali Sharma', email: 'anjali.s@yahoo.com', mobile: '9123456789', address: '88 KK Nagar, Madurai', visits: 2, status: 'ACTIVE' },
  { id: '3', name: 'Balaji Sundar', email: 'balaji@gmail.com', mobile: '9845601234', address: '12 Bypass Road, Madurai', visits: 7, status: 'ACTIVE' },
  { id: '4', name: 'Srinivasan R', email: 'srini@outlook.com', mobile: '9789012345', address: '303 Anna Nagar, Madurai', visits: 1, status: 'INACTIVE' }
];

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('dvsos_customers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CUSTOMERS;
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('dvsos_customers', JSON.stringify(customers));
  }, [customers]);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = customers.map(c => {
      if (c.id === id) {
        return { ...c, status: newStatus };
      }
      return c;
    });
    setCustomers(updated);
    toastSuccess('Customer status updated successfully!');
  };

  const handleDelete = () => {
    setDeleteItem(selectedCustomer);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (deleteItem) {
      const updated = customers.filter(c => c.id !== deleteItem.id);
      setCustomers(updated);
      toastSuccess(`Customer "${deleteItem.name}" deleted successfully.`);
      setDeleteItem(null);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: 'Customer Name',
      accessor: 'name',
      render: (row) => (
        <Link to={`/customers/${row.id}`} style={{ fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none' }}>
          {row.name}
        </Link>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <a href={`mailto:${row.email}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
          <Mail size={12} /> {row.email}
        </a>
      )
    },
    {
      header: 'Mobile',
      accessor: 'mobile',
    },
    {
      header: 'Address',
      accessor: 'address',
      render: (row) => (
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} /> {row.address || '-'}
        </span>
      )
    },
    {
      header: 'Total Visits',
      accessor: 'visits',
      render: (row) => <Typography variant="caption" sx={{ bgcolor: 'grey.100', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5 }}>{row.visits || 0} visits</Typography>
    },
    {
      header: 'Status',
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
        title="Customer Directory"
        breadcrumbs={[{ label: 'Customers' }]}
      />

      <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={setSearch}
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={filteredCustomers}
          emptyMessage="No customers found"
        />
      </Card>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Delete Customer"
        message={`Are you sure you want to delete customer "${deleteItem?.name}"?\nThis action cannot be undone.`}
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/customers/${selectedCustomer?.id}/edit`); }}>
          <Edit size={16} style={{ marginRight: 12, color: '#0d9488' }} />
          Edit Customer
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 12, color: 'inherit' }} />
          Delete Customer
        </MenuItem>
      </Menu>
    </Box>
  );
}
