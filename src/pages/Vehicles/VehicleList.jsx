import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';
import { Plus, Search, Filter } from 'lucide-react';
import { useVehicles } from '../../queries/useDataQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
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
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/vehicles/${row.id}`); }}>
            View
          </Button>
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/vehicles/${row.id}/history`); }}>
            History
          </Button>
        </div>
      ),
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const tableData = data?.data || [];
  const totalPages = Math.ceil(tableData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const STATUSES = ['', 'PENDING', 'IN_PROGRESS', 'BODY_SHOP', 'WATER_WASH', 'COMPLETED', 'DELAYED', 'DELIVERED'];

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <PageHeader
        title="Vehicle Management"
        subtitle={`${data?.total ?? 0} vehicles on record`}
        breadcrumbs={[{ label: 'Vehicles' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate('/gate-entry/new')}>
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

      <div className="premium-card d-flex flex-column" style={{ minHeight: '300px' }}>
        <div className="table-responsive flex-grow-1">
          {isLoading ? (
            <div className="p-5 text-center text-muted">Loading data...</div>
          ) : tableData.length === 0 ? (
            <div className="p-5 text-center text-muted">No vehicles found</div>
          ) : (
            <Table striped hover className="mb-0" style={{ cursor: 'pointer' }}>
              <thead className="table-light">
                <tr>
                  <th>Vehicle Number</th>
                  <th>Owner Name</th>
                  <th>Mobile</th>
                  <th>Make & Model</th>
                  <th>Type</th>
                  <th>Fuel</th>
                  <th>Status</th>
                  <th>Entry Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id} onClick={() => navigate(`/vehicles/${row.id}`)}>
                    <td className="align-middle">
                      <code className={styles.vehicleNum}>{row.vehicleNumber}</code>
                    </td>
                    <td className="align-middle">{row.ownerName || '—'}</td>
                    <td className="align-middle">{row.mobile || '—'}</td>
                    <td className="align-middle">{row.makeModel || '—'}</td>
                    <td className="align-middle">{row.type || '—'}</td>
                    <td className="align-middle">{row.fuelType || '—'}</td>
                    <td className="align-middle"><StatusBadge status={row.status} /></td>
                    <td className="align-middle">{formatDateTime(row.entryTime)}</td>
                    <td className="align-middle">
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/vehicles/${row.id}`); }}>
                          View
                        </Button>
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/vehicles/${row.id}/history`); }}>
                          History
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
        
        {!isLoading && totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, tableData.length)} of {tableData.length} entries
            </small>
            <Pagination className="mb-0" size="sm">
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {paginationItems}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
