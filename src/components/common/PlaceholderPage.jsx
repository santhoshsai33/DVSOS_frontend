import { Construction } from 'lucide-react';
import PageHeader from '../shared/PageHeader';
import EmptyState from './EmptyState';
import { Box, Card } from '@mui/material';

export default function PlaceholderPage({ title }) {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader title={title} breadcrumbs={[{ label: title }]} />
      <Card sx={{ borderRadius: 0, p: 4 }}>
        <EmptyState
          icon={Construction}
          title={`${title} coming online`}
          message="The route, navigation, permission boundary, and layout are ready. Connect API data and workflow actions here."
        />
      </Card>
    </Box>
  );
}

