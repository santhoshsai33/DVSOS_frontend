import React from 'react';
import { ShieldCheck, Edit, Trash2, Plus, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Box, Menu, MenuItem, IconButton, Typography, Select } from '@mui/material';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import DataTable from '../../../../components/common/DataTable';
import { toastSuccess } from '../../../../notifications/toast';
import { ROUTES } from '../../../../config/routes';
import ConfirmDeleteDialog from '../../../../components/common/ConfirmDeleteDialog';

const MOCK_ROLES_LIST = [
  { id: 1, designation: 'Super Admin', roleCode: 'SUPER_ADMIN', accessLevel: 'Full Access', active: true },
  { id: 2, designation: 'General Manager', roleCode: 'MANAGER', accessLevel: 'Custom Access', active: true },
  { id: 3, designation: 'Floor Supervisor', roleCode: 'FLOOR_SUPERVISOR', accessLevel: 'Custom Access', active: true },
  { id: 4, designation: 'Gate Security Executive', roleCode: 'GATE_SECURITY', accessLevel: 'Custom Access', active: true },
  { id: 5, designation: 'CRM Officer', roleCode: 'CRM_TEAM', accessLevel: 'Custom Access', active: true },
  { id: 6, designation: 'Body Shop Lead', roleCode: 'BODY_SHOP_SUPERVISOR', accessLevel: 'Custom Access', active: true },
  { id: 7, designation: 'Water Wash Lead', roleCode: 'WATER_WASH_TEAM', accessLevel: 'Custom Access', active: true },
  { id: 8, designation: 'Managing Director', roleCode: 'MD', accessLevel: 'Custom Access', active: true }
];

export default function RoleList() {
  const navigate = useNavigate();
  const [roles, setRoles] = React.useState(() => {
    try {
      const saved = localStorage.getItem('dvsos_roles_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_ROLES_LIST;
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [deleteItem, setDeleteItem] = React.useState(null);

  const handleMenuClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRole(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleStatusChange = (id, newActive) => {
    const updated = roles.map(roleItem => {
      if (roleItem.id === id) {
        return { ...roleItem, active: newActive };
      }
      return roleItem;
    });
    setRoles(updated);
    localStorage.setItem('dvsos_roles_list', JSON.stringify(updated));
    toastSuccess('Role status updated successfully!');
  };

  const handleDelete = () => {
    setDeleteItem(selectedRole);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (deleteItem) {
      const updated = roles.filter(roleItem => roleItem.id !== deleteItem.id);
      setRoles(updated);
      localStorage.setItem('dvsos_roles_list', JSON.stringify(updated));
      toastSuccess(`Role policy for "${deleteItem.designation}" removed successfully.`);
      setDeleteItem(null);
    }
  };

  const columns = [
    {
      header: 'Designation Name',
      accessor: 'designation',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">{row.designation}</Typography>
      )
    },
    {
      header: 'Role Code',
      accessor: 'roleCode',
      render: (row) => <Typography variant="body2" fontWeight={500} color="text.primary">{row.roleCode.replace(/_/g, ' ')}</Typography>
    },
    {
      header: 'Status',
      render: (row) => (
        <Select
          size="small"
          value={row.active ? 'Active' : 'Inactive'}
          onChange={(e) => handleStatusChange(row.id, e.target.value === 'Active')}
          sx={{ 
            width: 120, 
            height: 32, 
            fontSize: '0.85rem',
            borderRadius: '16px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: '1px' },
          }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
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
        title="Role Management"
        breadcrumbs={[{ label: 'Admin', path: ROUTES.ADMIN_DASHBOARD }, { label: 'Roles' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.ADMIN_ROLE_PRIVILEGES)}>
            Add Role Privileges
          </Button>
        }
      />

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={roles}
          emptyMessage="No role policies found"
        />
      </Box>

      <ConfirmDeleteDialog
        open={!!deleteItem}
        title="Delete Role Policy"
        message={`Are you sure you want to delete the privileges policy for role "${deleteItem?.designation}"?`}
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
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/admin/roles/privileges/${selectedRole?.id}/edit`); }}>
          <Edit size={16} style={{ marginRight: 12, color: '#0d9488' }} />
          Edit Privileges
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 12, color: 'inherit' }} />
          Delete Policy
        </MenuItem>
      </Menu>
    </Box>
  );
}
