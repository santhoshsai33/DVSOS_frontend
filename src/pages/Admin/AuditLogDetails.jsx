import { useParams } from 'react-router-dom';
import { Box, Card, Typography, Grid, Divider } from '@mui/material';
import PageHeader from '../../components/shared/PageHeader';
import { ROUTES } from '../../config/routes';
import { formatDateTime } from '../../utils/formatters';

const MOCK_DETAILS = {
  1: {
    id: 101,
    audit_log_id: 1,
    field_name: 'role',
    old_value: 'null',
    new_value: 'FLOOR_SUPERVISOR',
    data_type: 'varchar',
    created_at: '2024-06-12T10:05:00Z'
  },
  2: {
    id: 102,
    audit_log_id: 2,
    field_name: 'mechanic_id',
    old_value: 'null',
    new_value: '45',
    data_type: 'bigint',
    created_at: '2024-06-12T09:30:00Z'
  }
};

export default function AuditLogDetails() {
  const { id } = useParams();

  // Simulated fetch
  const detail = MOCK_DETAILS[id] || MOCK_DETAILS[1];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Audit Log Details"
        breadcrumbs={[
          { label: 'Audit Logs', path: ROUTES.ADMIN_AUDIT_LOGS },
          { label: `Log #${detail.audit_log_id}` }
        ]}
      />
      <Card sx={{ borderRadius: 0, p: { xs: 2, md: 4 } }}>
        <Typography variant="h6" fontWeight={700} mb={3}>
          Record Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary" display="block">Detail ID</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary" display="block">Audit Log ID</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.audit_log_id}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary" display="block">Created At</Typography>
            <Typography variant="body1" fontWeight={600}>{formatDateTime(detail.created_at)}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary" display="block">Field Name</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.field_name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary" display="block">Data Type</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.data_type}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ bgcolor: 'error.50', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'error.100', height: '100%' }}>
              <Typography variant="caption" color="error.main" display="block" fontWeight={600} mb={1}>Old Value</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {detail.old_value}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ bgcolor: 'success.50', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'success.100', height: '100%' }}>
              <Typography variant="caption" color="success.main" display="block" fontWeight={600} mb={1}>New Value</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {detail.new_value}
              </Typography>
            </Box>
          </Grid>

        </Grid>
      </Card>
    </Box>
  );
}
