import { Grid, Box, Typography, Card, CardContent, Select } from '@mui/material';
import {
  Users, Crown, Building, MapPin, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';
import { useUsers } from '../../queries/useDataQueries';
import DataTable from '../../components/common/DataTable';
import { toastSuccess } from '../../notifications/toast';
import RHFSwitch from '../../components/form/RHFSwitch';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Data sources
  const { masterServiceCenters, locations, updateServiceCenter } = useMasterDataStore();
  const { data: usersData } = useUsers();

  const usersList = usersData?.data?.users || (Array.isArray(usersData?.data) ? usersData.data : []);

  // Calculations
  const totalServiceCenters = masterServiceCenters.length;
  const totalLocations = locations.length;
  const totalUsers = usersList.length;
  const activeServiceCenters = masterServiceCenters;

  // Get unique roles from users to simulate total roles
  const uniqueRoles = new Set(usersList.map(u => u.role)).size;

  const handleStatusChange = (id, newStatus) => {
    updateServiceCenter(id, { status: newStatus });
    toastSuccess('Service Center status updated successfully!');
  };

  const columns = [
    {
      header: 'Service Center Name',
      accessor: 'name',
      render: (row) => <Typography variant="body2" fontWeight={600} color="#1E293B">{row.name}</Typography>
    },
    {
      header: 'Contact Number',
      accessor: 'contactNumber'
    },
    {
      header: 'Email',
      accessor: 'email'
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
    }
  ];

  const kpis = [
    {
      label: 'Service Centers',
      value: totalServiceCenters,
      icon: Building,
      color: '#1a434d',
      action: () => navigate(ROUTES.ADMIN_SERVICE_CENTERS),
    },
    {
      label: 'Locations',
      value: totalLocations,
      icon: MapPin,
      color: '#2dd4bf',
      action: () => navigate(ROUTES.ADMIN_LOCATIONS),
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: '#13323a',
      action: () => navigate(ROUTES.ADMIN_USERS),
    },
    {
      label: 'System Roles',
      value: uniqueRoles,
      icon: ShieldCheck,
      color: '#0ea5e9',
      action: () => navigate(ROUTES.ADMIN_ROLES),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F6F9', minHeight: '100%' }}>

      {/* Top Banner */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4,
        bgcolor: '#FFFFFF', p: 3, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        border: '1px solid #E5E7EB'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(45, 212, 191, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a434d' }}>
            <Crown size={24} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#000" sx={{ lineHeight: 1.2 }}>
              Super Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Overview of Master Data, Service Centers, and Platform Users
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* KPI Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  borderTop: `4px solid ${kpi.color}`,
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',

                }}
                onClick={kpi.action}
              >
                <CardContent sx={{ p: 3, pb: '45px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h3" fontWeight={800} sx={{ color: kpi.color, mb: 1 }}>
                        {kpi.value}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" fontWeight={600}>
                        {kpi.label}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Simplified Data Tables Row */}
      <Grid container spacing={3}>
        {/* Recent Service Centers */}
        <Grid item xs={12} md={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB', height: '100%' }}>
            <CardContent sx={{ p: 3, pb: '24px !important' }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
                Service Centers
              </Typography>
              <DataTable
                columns={columns}
                data={activeServiceCenters || []}
                emptyMessage="No active service centers found"
                showPagination={false}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
