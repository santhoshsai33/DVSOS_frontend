import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';
import DataTable from '../../components/common/DataTable';
import { Plus, Eye, Edit } from 'lucide-react';
import { useJobCards } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './JobCards.module.css';

const PRIORITY_COLORS = {
  LOW: '#10B981',
  NORMAL: '#3B82F6',
  HIGH: '#F59E0B',
  URGENT: '#EF4444',
};

export default function JobCardList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useJobCards({ search: debouncedSearch, status: statusFilter });

  const columns = [
    {
      header: 'Job Card #',
      accessor: 'id',
      render: (row) => (
        <span className={styles.jobId}>#{row.id}</span>
      ),
    },
    {
      header: 'Vehicle',
      render: (row) => (
        <code className={styles.vehicleNum}>{row.vehicleNumber}</code>
      ),
    },
    { header: 'Owner', accessor: 'ownerName' },
    { header: 'Service Type', accessor: 'serviceType' },
    {
      header: 'Priority',
      render: (row) => (
        <span style={{ color: PRIORITY_COLORS[row.priority || 'NORMAL'], fontWeight: 600, fontSize: '0.8rem' }}>
          ● {row.priority || 'NORMAL'}
        </span>
      ),
    },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Technician', accessor: 'technician', render: (row) => row.technician || <span className="text-muted">Unassigned</span> },
    { header: 'Est. Cost', render: (row) => formatCurrency(row.estimatedCost) },
    { header: 'Created', render: (row) => formatDateTime(row.createdAt) },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          <Button size="sm" variant="ghost" leftIcon={Eye} onClick={(e) => { e.stopPropagation(); navigate(`/job-cards/${row.id}`); }}>
            View
          </Button>
          <Button size="sm" variant="ghost" leftIcon={Edit} onClick={(e) => { e.stopPropagation(); navigate(`/job-cards/${row.id}/edit`); }}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const tableData = data?.data || [];

  return (
    <div>
      <PageHeader
        title="Job Cards"
        subtitle={`${data?.total ?? 0} total job cards`}
        breadcrumbs={[{ label: 'Job Cards' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate('/job-cards/create')}>
            Create Job Card
          </Button>
        }
      />

      <div className={styles.filterBar}>
        <SearchBar
          placeholder="Search vehicle, owner, job ID..."
          value={search}
          onChange={setSearch}
          className={styles.searchBox}
        />
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {['', 'PENDING', 'IN_PROGRESS', 'BODY_SHOP', 'WATER_WASH', 'COMPLETED', 'DELAYED'].map((s) => (
            <option key={s} value={s}>{s || 'All Statuses'}</option>
          ))}
        </select>
      </div>

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          onRowClick={(row) => navigate(`/job-cards/${row.id}`)}
          emptyMessage="No job cards found"
        />
      </div>
    </div>
  );
}
