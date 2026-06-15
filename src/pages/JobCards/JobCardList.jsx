import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination, Dropdown } from 'react-bootstrap';
import DataTable from '../../components/common/DataTable';
import { Plus, Eye, Edit, MoreVertical, PlusCircle, MessageCircle } from 'lucide-react';
import { useJobCards } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import { ROUTES } from '../../config/routes';
import styles from './JobCards.module.css';

const PRIORITY_COLORS = {
  LOW: '#10B981',
  NORMAL: '#3B82F6',
  HIGH: '#F59E0B',
  URGENT: '#EF4444',
};

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
        <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
          <Dropdown.Toggle as={CustomToggle} id={`dropdown-action-${row.id}`} className={styles.dropdownToggleNoCaret} />
          <Dropdown.Menu
            style={{ padding: '6px', borderRadius: '10px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}
          >
            <Dropdown.Item
              onClick={() => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Eye size={15} style={{ color: 'var(--color-primary)' }} />
              <span>View</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <Edit size={15} style={{ color: 'var(--color-accent)' }} />
              <span>Edit</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => navigate(`${ROUTES.FLOOR_ADDITIONAL_WORK}?jobCardId=${row.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}
            >
              <PlusCircle size={15} style={{ color: 'var(--color-accent-2)' }} />
              <span>Add Additional Work</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                const message = `Hello ${row.ownerName || 'Customer'}, your vehicle service card #${row.id} estimate is ready. Please reply YES to approve work.`;
                window.open(`https://wa.me/91${row.ownerMobile || row.mobile || ''}?text=${encodeURIComponent(message)}`, '_blank');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#25D366' }}
            >
              <MessageCircle size={15} style={{ color: '#25D366' }} />
              <span>WhatsApp Resend</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  const tableData = data?.data || [];

  return (
    <div>
      <PageHeader
        title="Job Cards"
        breadcrumbs={[{ label: 'Job Cards' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.CRM_CREATE_JOB_CARD)}>
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
          onRowClick={(row) => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
          emptyMessage="No job cards found"
        />
      </div>
    </div>
  );
}
