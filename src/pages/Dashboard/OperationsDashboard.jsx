import { Layers, AlertTriangle, Play, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';

export default function OperationsDashboard() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Live Operations Monitoring"
        subtitle="Floor-wide real-time operations overview"
        breadcrumbs={[{ label: 'Operations Monitoring' }]}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>Gate Pending</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>12</Typography>
              </Box>
              <Layers size={40} className="opacity-50" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', color: 'white', borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>In Mechanical</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>8</Typography>
              </Box>
              <Play size={40} className="opacity-50" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', color: 'white', borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>In Body Shop</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>4</Typography>
              </Box>
              <Layers size={40} className="opacity-50" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', color: 'white', borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500 }}>In Water Wash</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>5</Typography>
              </Box>
              <Layers size={40} className="opacity-50" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 300, borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <AlertTriangle size={20} color="#EF4444" className="mr-2" />
                <Typography variant="h6" fontWeight={700}>Delayed Vehicles</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
                <Typography color="text.secondary" align="center">
                  No vehicles are currently delayed past their SLA.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: 300, borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CheckCircle size={20} color="#10B981" className="mr-2" />
                <Typography variant="h6" fontWeight={700}>Recently Completed</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography fontWeight={600}>TN 02 CD 5566</Typography>
                  <Typography variant="body2" color="text.secondary">10 mins ago</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 2, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography fontWeight={600}>KL 10 EE 4433</Typography>
                  <Typography variant="body2" color="text.secondary">35 mins ago</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
