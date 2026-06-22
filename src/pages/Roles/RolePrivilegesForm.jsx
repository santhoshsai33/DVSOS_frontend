import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Checkbox,
  MenuItem,
  Select
} from '@mui/material';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import Input from '../../components/common/Input';
import { toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';

const PERMISSION_ROWS = [
  { module: 'Administration', subModule: 'Admin Dashboard' },
  { module: 'Administration', subModule: 'User Management' },
  { module: 'Administration', subModule: 'Role Management' },
  { module: 'Administration', subModule: 'Service Items' },
  { module: 'Administration', subModule: 'System Settings' },
  { module: 'Administration', subModule: 'Audit Logs' },
  { module: 'Gate Operations', subModule: 'Gate Dashboard' },
  { module: 'Gate Operations', subModule: 'Vehicle Entry' },
  { module: 'CRM Operations', subModule: 'CRM Dashboard' },
  { module: 'CRM Operations', subModule: 'Pending Approvals' },
  { module: 'CRM Operations', subModule: 'Delivery Ready' },
  { module: 'Floor Workshop', subModule: 'Floor Dashboard' },
  { module: 'Floor Workshop', subModule: 'Mechanical Queue' },
  { module: 'Floor Workshop', subModule: 'Assign Mechanic' },
  { module: 'Floor Workshop', subModule: 'Additional Work' },
  { module: 'Body Shop', subModule: 'Body Shop Queue' },
  { module: 'Water Wash', subModule: 'Water Wash Queue' },
  { module: 'Manager Operations', subModule: 'Manager Dashboard' },
  { module: 'Manager Operations', subModule: 'Operations Overview' },
  { module: 'Manager Operations', subModule: 'Delayed Jobs' },
  { module: 'Manager Operations', subModule: 'Reports' },
  { module: 'MD Analytics', subModule: 'MD Dashboard' },
  { module: 'MD Analytics', subModule: 'Executive Overview' },
  { module: 'MD Analytics', subModule: 'Performance Report' },
  { module: 'MD Analytics', subModule: 'Service KPI' },
  { module: 'Common Pages', subModule: 'Customers' },
  { module: 'Common Pages', subModule: 'Vehicles' },
  { module: 'Common Pages', subModule: 'Job Cards' },
  { module: 'Common Pages', subModule: 'Notifications' }
];

const MODULES = ['Administration', 'Gate Operations', 'CRM Operations', 'Floor Workshop', 'Body Shop', 'Water Wash', 'Manager Operations', 'MD Analytics', 'Common Pages'];

export default function RolePrivilegesForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [designation, setDesignation] = useState('');
  const [selectedModule, setSelectedModule] = useState('Administration');
  const [saving, setSaving] = useState(false);

  // Grid permissions state
  const [privileges, setPrivileges] = useState(
    PERMISSION_ROWS.reduce((acc, _, index) => {
      acc[index] = { read: false, create: false, update: false, delete: false };
      return acc;
    }, {})
  );

  useEffect(() => {
    const savedPrivileges = JSON.parse(localStorage.getItem('dvsos_role_privileges') || '{}');
    if (isEdit) {
      const MOCK_ROLES_LIST = [
        { id: 1, designation: 'Super Admin' },
        { id: 2, designation: 'General Manager' },
        { id: 3, designation: 'Floor Supervisor' },
        { id: 4, designation: 'Gate Security Executive' },
        { id: 5, designation: 'CRM Officer' },
        { id: 6, designation: 'Body Shop Lead' },
        { id: 7, designation: 'Water Wash Lead' },
        { id: 8, designation: 'Managing Director' }
      ];
      const roleItem = MOCK_ROLES_LIST.find(r => String(r.id) === String(id));
      const name = roleItem ? roleItem.designation : 'General Manager';
      setDesignation(name);

      if (savedPrivileges[name]) {
        setPrivileges(savedPrivileges[name]);
      } else {
        // Fallback mock pre-population
        setPrivileges(
          PERMISSION_ROWS.reduce((acc, _, index) => {
            acc[index] = { read: true, create: index % 2 === 0, update: index % 3 === 0, delete: false };
            return acc;
          }, {})
        );
      }
    }
  }, [isEdit, id]);

  const handleCheckboxChange = (index, type) => {
    setPrivileges(prev => {
      const row = { ...prev[index] };
      row[type] = !row[type];
      return { ...prev, [index]: row };
    });
  };

  const handleSelectAllChange = (index) => {
    setPrivileges(prev => {
      const row = { ...prev[index] };
      const allChecked = row.read && row.create && row.update && row.delete;
      return {
        ...prev,
        [index]: {
          read: !allChecked,
          create: !allChecked,
          update: !allChecked,
          delete: !allChecked
        }
      };
    });
  };

  const handleSave = () => {
    if (!designation.trim()) {
      alert('Please enter a Role Name.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      // Save to localStorage
      const savedPrivileges = JSON.parse(localStorage.getItem('dvsos_role_privileges') || '{}');
      savedPrivileges[designation.trim()] = privileges;
      localStorage.setItem('dvsos_role_privileges', JSON.stringify(savedPrivileges));

      // Append new role to dvsos_roles_list
      let savedRoles = [];
      try {
        savedRoles = JSON.parse(localStorage.getItem('dvsos_roles_list') || '[]');
      } catch (e) {
        savedRoles = [];
      }
      // If savedRoles is empty, populate it with defaults first
      if (savedRoles.length === 0) {
        savedRoles = [
          { id: 1, designation: 'Super Admin', roleCode: 'SUPER_ADMIN', accessLevel: 'Full Access', active: true },
          { id: 2, designation: 'General Manager', roleCode: 'MANAGER', accessLevel: 'Custom Access', active: true },
          { id: 3, designation: 'Floor Supervisor', roleCode: 'FLOOR_SUPERVISOR', accessLevel: 'Custom Access', active: true },
          { id: 4, designation: 'Gate Security Executive', roleCode: 'GATE_SECURITY', accessLevel: 'Custom Access', active: true },
          { id: 5, designation: 'CRM Officer', roleCode: 'CRM_TEAM', accessLevel: 'Custom Access', active: true },
          { id: 6, designation: 'Body Shop Lead', roleCode: 'BODY_SHOP_SUPERVISOR', accessLevel: 'Custom Access', active: true },
          { id: 7, designation: 'Water Wash Lead', roleCode: 'WATER_WASH_TEAM', accessLevel: 'Custom Access', active: true },
          { id: 8, designation: 'Managing Director', roleCode: 'MD', accessLevel: 'Custom Access', active: true }
        ];
      }

      const exists = savedRoles.some(r => r.designation.toLowerCase() === designation.trim().toLowerCase());
      if (!exists) {
        const nextId = savedRoles.length > 0 ? Math.max(...savedRoles.map(r => r.id)) + 1 : 1;
        savedRoles.push({
          id: nextId,
          designation: designation.trim(),
          roleCode: designation.trim().toUpperCase().replace(/\s+/g, '_'),
          accessLevel: 'Custom Access',
          active: true
        });
      }
      localStorage.setItem('dvsos_roles_list', JSON.stringify(savedRoles));

      toastSuccess(`Role privileges for "${designation}" saved successfully!`);
      navigate(ROUTES.ADMIN_ROLES);
    }, 800);
  };

  // Filter permission rows by selected module
  const filteredRows = PERMISSION_ROWS
    .map((row, originalIdx) => ({ ...row, originalIdx }))
    .filter(row => !selectedModule || row.module === selectedModule);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit' : 'Add'} Role Privileges
        </Typography>
        <BackButton to={ROUTES.ADMIN_ROLES} label="Back to Role Privileges" />
      </Box>

      {/* Form Controls */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Input
              label="Role Name"
              required
              placeholder="Enter Role Name"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              disabled={isEdit}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2, width: '100%' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75 }}>
                Module <span style={{ color: '#E11D48' }}>*</span>
              </Typography>
              <Select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                fullWidth
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    bgcolor: '#FFFFFF'
                  }
                }}
              >
                <MenuItem value="">All Modules</MenuItem>
                {MODULES.map(m => (
                  <MenuItem key={m} value={m}>{m === 'Administration' ? 'Admin' : m}</MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Privileges Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                <TableCell sx={{ fontWeight: 600, color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Module Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Read</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Create</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Update</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Delete</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Select All</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => {
                const idx = row.originalIdx;
                const state = privileges[idx] || { read: false, create: false, update: false, delete: false };
                const allChecked = state.read && state.create && state.update && state.delete;
                return (
                  <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#334155' }}>
                      {row.subModule}
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox 
                        checked={state.read} 
                        onChange={() => handleCheckboxChange(idx, 'read')} 
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox 
                        checked={state.create} 
                        onChange={() => handleCheckboxChange(idx, 'create')} 
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox 
                        checked={state.update} 
                        onChange={() => handleCheckboxChange(idx, 'update')} 
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox 
                        checked={state.delete} 
                        onChange={() => handleCheckboxChange(idx, 'delete')} 
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox 
                        checked={allChecked} 
                        onChange={() => handleSelectAllChange(idx)} 
                        sx={{ color: '#94A3B8', '&.Mui-checked': { color: 'primary.main' } }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button
          variant="secondary"
          onClick={() => navigate(ROUTES.ADMIN_ROLES)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          isLoading={saving}
          onClick={handleSave}
        >
          {isEdit ? 'Save Changes' : 'Add Role Privileges'}
        </Button>
      </Box>
    </Box>
  );
}
