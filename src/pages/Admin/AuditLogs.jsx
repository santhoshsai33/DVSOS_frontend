import { useState, useMemo } from 'react';
import DataTable from '../../components/common/DataTable';
import { Eye } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { Box, Card, IconButton, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters';
import SearchBar from '../../components/common/SearchBar';
import DateFilter from '../../components/common/DateFilter';
import { useAuditLogs } from '../../queries/useAuditLogQueries';
import { exportAuditLogsExcelApi } from '../../api/auditLogApi';
import { useDebounce } from '../../hooks/useDebounce';
import ResetFiltersButton from '../../components/common/ResetFiltersButton';

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
  if (!str) return DARK_COLORS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return DARK_COLORS[Math.abs(hash) % DARK_COLORS.length];
}

export default function AuditLogs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data, isLoading, isError, error } = useAuditLogs({
    page,
    limit,
    search: debouncedSearch,
    fromDate,
    toDate
  });

  const auditLogsData = data?.data?.auditLogs || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleResetFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const columns = [
    {
      header: 'User',
      width: '16.66%',
      render: (row) => {
        const userName = row.performedBy?.fullName || 'System';
        const color = getHashColor(userName);
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
            {userName}
          </Box>
        );
      }
    },
    { header: 'Action', accessor: 'actionType', width: '16.66%' },
    {
      header: 'Table Name',
      width: '16.66%',
      render: (row) => row.tableName
    },
    { header: 'Record', accessor: 'recordName', width: '16.66%' },
    { header: 'Comments', accessor: 'comments', width: '16.66%' },
    {
      header: 'Timestamp',
      width: '16.66%',
      render: (row) => {
        const formatted = formatDateTime(row.performedAt);
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

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', md: 350 } }}>
          <SearchBar
            placeholder="Search audit logs..."
            value={search}
            onChange={(val) => { setSearch(val); setPage(1); }}
          />
        </Box>
        <DateFilter
          fromDate={fromDate}
          toDate={toDate}
          onChange={(type, val) => {
            if (type === 'from') setFromDate(val);
            if (type === 'to') setToDate(val);
            if (type === 'clear') { setFromDate(''); setToDate(''); }
            setPage(1);
          }}
          onExport={async () => {
            try {
              const params = {
                search: debouncedSearch,
                fromDate,
                toDate
              };

              const res = await exportAuditLogsExcelApi(params);
              const { downloadExcelFile } = await import('../../utils/excelExport');
              downloadExcelFile(res, 'Audit_Logs.xlsx');
            } catch (err) {
              console.error(err);
            }
          }}
        />
        <ResetFiltersButton onReset={handleResetFilters} />
      </Box>

      <Card sx={{ borderRadius: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <Typography color="error">Error loading audit logs: {error?.message}</Typography>
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={auditLogsData}
            serverSide={true}
            totalCount={meta.total}
            page={page - 1}
            rowsPerPage={limit}
            onPageChange={(newPage) => setPage(newPage + 1)}
            onRowsPerPageChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            emptyMessage="No audit logs found"
            onRowDoubleClick={(row) => {
              navigate(`/audit-logs/${row.id}`);
            }}
          />
        )}
      </Card>
    </Box>
  );
}
