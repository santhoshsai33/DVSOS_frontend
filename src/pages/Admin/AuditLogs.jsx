import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { ShieldCheck, Eye } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { Box, Card, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters';
import SearchBar from '../../components/common/SearchBar';

const DARK_COLORS = [
  '#1E40AF', // dark blue
  '#991B1B', // dark red
  '#3730A3', // dark indigo
  '#065F46', // dark emerald
  '#92400E', // dark amber
  '#5B21B6', // dark violet
  '#9D174D', // dark pink
  '#155E75', // dark cyan
  '#115E59', // dark teal
  '#9A3412', // dark orange
  '#166534'  // dark green
];

function getHashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return DARK_COLORS[Math.abs(hash) % DARK_COLORS.length];
}

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
    { 
      header: 'Timestamp', 
      render: (row) => {
        const formatted = formatDateTime(row.timestamp);
        const color = getHashColor(formatted);
        return (
          <Box
            component="span"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: '0.8rem',
              color: color,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap'
            }}
          >
            {formatted}
          </Box>
        );
      }
    },
    { 
      header: 'User', 
      render: (row) => {
        const color = getHashColor(row.user);
        return (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.25,
              py: 0.4,
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.02em',
              color: color,
              bgcolor: `${color}12`,
              border: `1px solid ${color}`,
              whiteSpace: 'nowrap'
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, mr: 1, flexShrink: 0 }} />
            {row.user}
          </Box>
        );
      }
    },
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
