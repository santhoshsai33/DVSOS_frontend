import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Mail, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Menu, MenuItem, Typography, Select, Card, Avatar } from '@mui/material';
import { useUsers } from '../../queries/useDataQueries';
import RHFSwitch from '../../components/form/RHFSwitch';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDeleteDialog from '../../components/common/ConfirmDeleteDialog';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROLE_LABELS } from '../../constants/roles';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';

export default function UserList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const debSearch = useDebounce(search, 300);

  const { data, isLoading } = useUsers({ search: debSearch, role: roleFilter });
  const [usersList, setUsersList] = useState([]);

  // For Dropdown Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedUser(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  useEffect(() => {
    if (data?.data) {
      const saved = localStorage.getItem('dvsos_users_list');
      if (saved) {
        setUsersList(JSON.parse(saved));
      } else {
        setUsersList(data.data);
      }
    }
  }, [data]);

  const handleStatusChange = (id, newStatus) => {
    const updated = usersList.map(u => {
      if (u.id === id) {
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsersList(updated);
    localStorage.setItem('dvsos_users_list', JSON.stringify(updated));
    toastSuccess('User status updated successfully!');
  };

  const handleDeleteUser = () => {
    setDeleteItem(selectedUser);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (deleteItem) {
      const updated = usersList.filter(u => u.id !== deleteItem.id);
      setUsersList(updated);
      localStorage.setItem('dvsos_users_list', JSON.stringify(updated));
      toastSuccess(`User "${deleteItem.name}" removed successfully.`);
      setDeleteItem(null);
    }
  };

  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.mobile.includes(search);
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
            {row.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
        </Box>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <Box component="a" href={`mailto:${row.email}`} sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          <Mail size={14} className="mr-2" /> {row.email}
        </Box>
      ),
    },
    { header: 'Mobile', accessor: 'mobile' },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <Typography variant="caption" sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', py: 0.5, px: 1, borderRadius: 1, fontWeight: 600 }}>
          {ROLE_LABELS[row.role] || row.role}
        </Typography>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <RHFSwitch
          value={row.status || 'ACTIVE'}
          onChange={(newVal) => handleStatusChange(row.id, newVal)}
        />
      ),
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin',
      render: (row) => <Typography variant="body2">{formatDateTime(row.lastLogin)}</Typography>,
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
        title="User Management"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Users' }]}
        actions={
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => navigate(ROUTES.ADMIN_USER_NEW)}
          >
            Add User
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={setSearch}
          />
        </Box>
        <Select
          size="small"
          displayEmpty
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ 
            width: { xs: '100%', sm: 200 }, 
            bgcolor: 'background.paper', 
            borderRadius: '24px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '1px' },
          }}
        >
          <MenuItem value="">All Roles</MenuItem>
          {Object.entries(ROLE_LABELS).map(([val, label]) => (
            <MenuItem key={val} value={val}>{label}</MenuItem>
          ))}
        </Select>
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading && usersList.length === 0}
          emptyMessage="No users found"
        />
      </Card>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Remove User"
        message={`Are you sure you want to remove "${deleteItem?.name}"?\nThis action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteItem(null)}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { width: 160, borderRadius: 2, mt: 0.5 } }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(ROUTES.ADMIN_USER_EDIT.replace(':id', selectedUser?.id)); }}>
          <Edit size={16} className="mr-3 text-primary" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Trash2 size={16} className="mr-3" />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
