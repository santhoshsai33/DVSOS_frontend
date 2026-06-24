import { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { CheckCircle2, ArrowRight, Droplet } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import { toastSuccess } from '../../notifications/toast';

const MOCK_COMPLETED_JOBS = [
  {
    id: 'B-Q5',
    vehicleNumber: 'TN 33 PQ 7788',
    customerName: 'Vikram Rajan',
    phone: '+91 54321 09876',
    services: 'Body Repair + Paint',
    mechanic: 'Ravi B.',
    nextStage: 'Water Wash',
    status: 'Body Shop Completed',
  },
  {
    id: 'B-Q6',
    vehicleNumber: 'KA 02 AB 1234',
    customerName: 'Priya Sharma',
    phone: '+91 87654 32109',
    services: 'Full Body Repaint',
    mechanic: 'Suresh T.',
    nextStage: 'Water Wash',
    status: 'Body Shop Completed',
  },
];

export default function BodyShopWorkStatus() {
  const [jobs, setJobs] = useState(MOCK_COMPLETED_JOBS);
  const [search, setSearch] = useState('');

  const filteredJobs = jobs.filter(job => 
    job.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
    job.customerName.toLowerCase().includes(search.toLowerCase()) ||
    job.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleMoveToNextStage = (job) => {
    setJobs(jobs.filter(j => j.id !== job.id));
    toastSuccess(`Job #${job.id} moved to ${job.nextStage} Queue successfully.`);
  };

  const columns = [
    {
      header: 'VEHICLE NO.',
      render: (row) => (
        <Typography sx={{ color: '#3b82f6', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.875rem' }}>
          {row.vehicleNumber}
        </Typography>
      ),
    },
    {
      header: 'CUSTOMER',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{row.customerName}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.phone}</Typography>
        </Box>
      ),
    },
    {
      header: 'SERVICES',
      render: (row) => (
        <Typography sx={{ fontSize: '0.875rem', color: '#374151' }}>{row.services}</Typography>
      ),
    },
    {
      header: 'TECHNICIAN',
      render: (row) => (
        <Typography sx={{ fontSize: '0.875rem', color: '#374151', fontWeight: 600 }}>{row.mechanic}</Typography>
      ),
    },
    {
      header: 'NEXT STAGE',
      render: (row) => (
        <Chip
          icon={<Droplet size={14} />}
          label={row.nextStage}
          size="small"
          sx={{
            bgcolor: '#eff6ff',
            color: '#2563eb',
            border: `1px solid #bfdbfe`,
            fontWeight: 600,
            '& .MuiChip-icon': { color: 'inherit', ml: 1 }
          }}
        />
      ),
    },
    {
      header: 'ACTION',
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          rightIcon={ArrowRight}
          onClick={(e) => {
            e.stopPropagation();
            handleMoveToNextStage(row);
          }}
          sx={{
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Move to {row.nextStage}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F0F4FF', minHeight: '100%' }}>
      <PageHeader
        title="Work Status & Routing (Body Shop)"
        breadcrumbs={[{ label: 'Work Status' }]}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 0, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search vehicle, owner, job ID..."
            value={search}
            onChange={setSearch}
          />
        </Box>
      </Box>

      {/* Data Tables Row */}
      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB', height: '100%' }}>
            <CardContent sx={{ p: 3, pb: '24px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <CheckCircle2 size={20} color="#10B981" />
                <Typography variant="h6" fontWeight={800} sx={{ color: '#374151', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Completed Body Shop Jobs Awaiting Water Wash
                </Typography>
              </Box>

              <DataTable
                columns={columns}
                data={filteredJobs}
                emptyMessage="No completed jobs awaiting routing"
                showPagination={true}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
