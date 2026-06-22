import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock, Car } from 'lucide-react';
import { Box, Grid, Card, Typography, Divider } from '@mui/material';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/common/Button';
import { ROUTES } from '../../config/routes';

// Mock service history for customers
const MOCK_SERVICE_HISTORY = {
  '1': [
    { jobCardId: 'JC-1001', vehicle: 'TN 58 AB 1234 (Swift)', date: '2026-05-12', service: 'Oil Change, Brake Pad Replacement', cost: 3000, status: 'Completed' },
    { jobCardId: 'JC-1002', vehicle: 'TN 58 AB 1234 (Swift)', date: '2026-03-22', service: 'General Service', cost: 2500, status: 'Completed' }
  ],
  '2': [
    { jobCardId: 'JC-1003', vehicle: 'TN 57 XY 9876 (i20)', date: '2026-06-02', service: 'Premium Water Wash', cost: 600, status: 'Completed' }
  ],
  '3': [
    { jobCardId: 'JC-1004', vehicle: 'TN 59 MM 5555 (Innova)', date: '2026-06-10', service: 'Interior Detailing, AC Servicing', cost: 3000, status: 'Completed' },
    { jobCardId: 'JC-1005', vehicle: 'TN 59 MM 5555 (Innova)', date: '2026-04-18', service: 'Body Dent & Paint', cost: 12000, status: 'Completed' }
  ],
  '4': []
};

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dvsos_customers') || '[]');
      const found = saved.find(c => String(c.id) === String(id));
      setCustomer(found || null);
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  if (!customer) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Customer not found</Typography>
        <Button variant="primary" sx={{ mt: 3 }} onClick={() => navigate(ROUTES.CUSTOMERS)}>
          Back to Directory
        </Button>
      </Box>
    );
  }

  const history = MOCK_SERVICE_HISTORY[customer.id] || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Customer Profile"
        breadcrumbs={[{ label: 'Customers', path: ROUTES.CUSTOMERS }, { label: customer.name }]}
        actions={
          <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.CUSTOMERS)}>
            Back to Directory
          </Button>
        }
      />

      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, p: 4, height: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                color: '#fff', fontSize: '2rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2, boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)'
              }}>
                {customer.name.charAt(0)}
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{customer.name}</Typography>
              <Typography variant="caption" sx={{
                px: 1.5, py: 0.5, borderRadius: 8, fontWeight: 600, border: '1px solid',
                bgcolor: customer.status === 'ACTIVE' ? 'success.light' : 'error.light',
                color: customer.status === 'ACTIVE' ? 'success.main' : 'error.main',
                borderColor: customer.status === 'ACTIVE' ? 'success.light' : 'error.light'
              }}>
                {customer.status}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Mail size={18} color="#6b7280" />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>Email Address</Typography>
                  <Typography variant="body2" fontWeight={600}>{customer.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone size={18} color="#6b7280" />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>Mobile Number</Typography>
                  <Typography variant="body2" fontWeight={600}>{customer.mobile}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MapPin size={18} color="#6b7280" />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>Address</Typography>
                  <Typography variant="body2" fontWeight={600}>{customer.address || '-'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Calendar size={18} color="#6b7280" />
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>Total Service Visits</Typography>
                  <Typography variant="body2" fontWeight={600}>{customer.visits || 0} visits</Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Service History */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 1, p: 4, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
              <Clock size={18} color="#0d9488" /> Service History & Job Cards
            </Typography>

            {history.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Car size={36} color="#9ca3af" style={{ marginBottom: 8, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary">No past service visits recorded for this customer.</Typography>
              </Box>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <Box component="th" sx={{ p: 2, fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', textAlign: 'left' }}>Job Card</Box>
                      <Box component="th" sx={{ p: 2, fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', textAlign: 'left' }}>Vehicle</Box>
                      <Box component="th" sx={{ p: 2, fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', textAlign: 'left' }}>Date</Box>
                      <Box component="th" sx={{ p: 2, fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', textAlign: 'left' }}>Services Rendered</Box>
                      <Box component="th" sx={{ p: 2, fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', textAlign: 'left' }}>Total Cost</Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {history.map((h, i) => (
                      <Box component="tr" key={i} sx={{ borderBottom: i < history.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                        <Box component="td" sx={{ p: 2 }}>
                          <Typography variant="body2" fontWeight={600} color="primary.main">{h.jobCardId}</Typography>
                        </Box>
                        <Box component="td" sx={{ p: 2 }}>
                          <Typography variant="body2" fontWeight={500}>{h.vehicle}</Typography>
                        </Box>
                        <Box component="td" sx={{ p: 2 }}>
                          <Typography variant="caption" color="text.secondary">{h.date}</Typography>
                        </Box>
                        <Box component="td" sx={{ p: 2 }}>
                          <Typography variant="body2">{h.service}</Typography>
                        </Box>
                        <Box component="td" sx={{ p: 2 }}>
                          <Typography variant="body2" fontWeight={600}>₹{h.cost.toLocaleString('en-IN')}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
