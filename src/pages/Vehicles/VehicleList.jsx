import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useVehicles } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROUTES } from '../../config/routes';
import styles from './Vehicles.module.css';

export default function VehicleList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useVehicles({ search: debouncedSearch, status: statusFilter });

  const columns = [
    {
      header: 'Vehicle Number',
      accessor: 'vehicleNumber',
      render: (row) => (
        <code className={styles.vehicleNum}>{row.vehicleNumber}</code>
      ),
    },
    { header: 'Owner Name', accessor: 'ownerName' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Make & Model', accessor: 'makeModel' },
    { header: 'Type', accessor: 'type' },
    { header: 'Fuel', accessor: 'fuelType' },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Entry Time',
      accessor: 'entryTime',
      render: (row) => formatDateTime(row.entryTime),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`${ROUTES.VEHICLES}/${row.id}`); }}>
            View
          </Button>
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`${ROUTES.VEHICLES}/${row.id}`); }}>
            History
          </Button>
        </div>
      ),
    },
  ];

  const tableData = data?.data || [];
  const STATUSES = ['', 'PENDING', 'IN_PROGRESS', 'BODY_SHOP', 'WATER_WASH', 'COMPLETED', 'DELAYED', 'DELIVERED'];

  return (
    <div>
      <PageHeader
        title="Vehicle Management"
        breadcrumbs={[{ label: 'Vehicles' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.GATE_ENTRY)}>
            New Entry
          </Button>
        }
      />

      {/* Filters */}
      <div className={styles.filterBar}>
        <SearchBar
          placeholder="Search vehicle number, owner, mobile..."
          value={search}
          onChange={setSearch}
          className={styles.searchBox}
        />
        <div className="d-flex align-items-center gap-2">
          <Filter size={16} style={{ color: 'var(--color-text-muted)' }} />
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s || 'All Statuses'}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          onRowClick={(row) => navigate(`${ROUTES.VEHICLES}/${row.id}`)}
          emptyMessage="No vehicles found"
        />
      </div>
    </div>
  );
}
