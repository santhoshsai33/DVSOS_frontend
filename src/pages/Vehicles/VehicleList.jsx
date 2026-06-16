import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Plus, Search, Filter, MoreVertical, Eye, Clock } from 'lucide-react';
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

const CustomToggle = React.forwardRef(({ children, onClick, ...props }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    {...props}
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      color: 'var(--color-text-secondary)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      transition: 'background 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
  >
    <MoreVertical size={18} />
  </button>
));

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
        <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
          <Dropdown.Toggle as={CustomToggle} id={`dropdown-action-${row.id}`} />
          <Dropdown.Menu
            style={{ padding: '6px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
          >
            <Dropdown.Item
              onClick={() => navigate(`${ROUTES.VEHICLES}/${row.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Eye size={15} style={{ color: 'var(--color-primary)' }} />
              <span>View Details</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => navigate(`${ROUTES.VEHICLES}/${row.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Clock size={15} style={{ color: 'var(--color-accent)' }} />
              <span>History</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
            className={`${styles.filterSelect} form-select`}
            style={{ width: 'auto', minWidth: '150px' }}
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
