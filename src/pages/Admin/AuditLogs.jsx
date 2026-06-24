import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { ShieldCheck, Eye } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { Box, Card, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters';
import SearchBar from '../../components/common/SearchBar';

const MOCK_LOGS = [
  { id: 1, user: 'Admin User', action: 'Created User', entity: 'User', details: 'Added new floor supervisor: Rajan M.', timestamp: '2024-06-12T10:05:00Z' },
  { id: 2, user: 'System', action: 'Auto-Assign', entity: 'JobCard', details: 'Assigned JC-1033 to Mechanic Team A', timestamp: '2024-06-12T09:30:00Z' },
];

export default function AuditLogs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredLogs = MOCK_LOGS.filter(log =>
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.entity.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'Timestamp', render: (row) => formatDateTime(row.timestamp) },
    { header: 'User', render: (row) => <strong>{row.user}</strong> },
    { header: 'Action', accessor: 'action' },
    { header: 'Entity', accessor: 'entity' },
    { header: 'Details', accessor: 'details' },
    {
      header: 'Actions',
      render: (row) => (
        <IconButton
          size="small"
          onClick={() => navigate(`/audit-logs/${row.id}`)}
          sx={{ color: 'primary.main', bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' }, width: 32, height: 32 }}
        >
          <Eye size={16} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Audit Logs"
        breadcrumbs={[{ label: 'Audit Logs' }]}
      />

      <Box sx={{ mb: 3, width: { xs: '100%', md: 350 } }}>
        <SearchBar
          placeholder="Search audit logs..."
          value={search}
          onChange={setSearch}
        />
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        <DataTable
          columns={columns}
          data={filteredLogs}
          emptyMessage="No audit logs found"
        />
      </Card>
    </Box>
  );
}
