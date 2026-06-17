import { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import {
  Users, Crown, Building, MapPin, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import useMasterDataStore from '../../store/useMasterDataStore';
import { useUsers } from '../../queries/useDataQueries';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Data sources
  const { masterServiceCenters, locations } = useMasterDataStore();
  const { data: usersData } = useUsers();

  const usersList = usersData?.data || [];

  // Calculations
  const totalServiceCenters = masterServiceCenters.length;
  const totalLocations = locations.length;
  const totalUsers = usersList.length;

  // Get unique roles from users to simulate total roles
  const uniqueRoles = new Set(usersList.map(u => u.role)).size;

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
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }
                }}
                onClick={kpi.action}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h3" fontWeight={800} sx={{ color: kpi.color, mb: 1 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    {kpi.label}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
                Active Service Centers
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', py: 1.5, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, borderBottom: 'none' }}>Name</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', py: 1.5, borderBottom: 'none' }}>Contact</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', py: 1.5, borderTopRightRadius: 8, borderBottomRightRadius: 8, borderBottom: 'none' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {masterServiceCenters.slice(0, 5).map((center) => (
                      <TableRow key={center.id} sx={{ '& td': { borderBottom: '1px solid #F1F5F9', py: 2 } }}>
                        <TableCell sx={{ fontWeight: 600, color: '#1E293B' }}>{center.name}</TableCell>
                        <TableCell sx={{ fontWeight: 500, color: '#475569' }}>{center.contactNumber}</TableCell>
                        <TableCell>
                          <Chip
                            label={center.status}
                            size="small"
                            sx={{ bgcolor: center.status === 'ACTIVE' ? '#D1FAE5' : '#FEE2E2', color: center.status === 'ACTIVE' ? '#059669' : '#EF4444', fontWeight: 700, borderRadius: 1 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {masterServiceCenters.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>No service centers available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
