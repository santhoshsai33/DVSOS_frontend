import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const tableData = data?.data || [];
  const totalPages = Math.ceil(tableData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = tableData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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

      <div className="bg-white rounded border overflow-hidden d-flex flex-column" style={{ minHeight: '300px' }}>
        <div className="table-responsive flex-grow-1">
          {isLoading ? (
            <div className="p-5 text-center text-muted">Loading data...</div>
          ) : tableData.length === 0 ? (
            <div className="p-5 text-center text-muted">No job cards found</div>
          ) : (
            <Table striped hover className="mb-0" style={{ cursor: 'pointer' }}>
              <thead className="table-light">
                <tr>
                  <th>Job Card #</th>
                  <th>Vehicle</th>
                  <th>Owner</th>
                  <th>Service Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Technician</th>
                  <th>Est. Cost</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id} onClick={() => navigate(`/job-cards/${row.id}`)}>
                    <td className="align-middle"><span className={styles.jobId}>#{row.id}</span></td>
                    <td className="align-middle"><code className={styles.vehicleNum}>{row.vehicleNumber}</code></td>
                    <td className="align-middle">{row.ownerName}</td>
                    <td className="align-middle">{row.serviceType}</td>
                    <td className="align-middle">
                      <span style={{ color: PRIORITY_COLORS[row.priority || 'NORMAL'], fontWeight: 600, fontSize: '0.8rem' }}>
                        ● {row.priority || 'NORMAL'}
                      </span>
                    </td>
                    <td className="align-middle"><StatusBadge status={row.status} /></td>
                    <td className="align-middle">{row.technician || <span className="text-muted">Unassigned</span>}</td>
                    <td className="align-middle">{formatCurrency(row.estimatedCost)}</td>
                    <td className="align-middle">{formatDateTime(row.createdAt)}</td>
                    <td className="align-middle">
                      <div className="d-flex gap-1">
                        <Button size="sm" variant="ghost" leftIcon={Eye} onClick={(e) => { e.stopPropagation(); navigate(`/job-cards/${row.id}`); }}>
                          View
                        </Button>
                        <Button size="sm" variant="ghost" leftIcon={Edit} onClick={(e) => { e.stopPropagation(); navigate(`/job-cards/${row.id}/edit`); }}>
                          Edit
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
