import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Pagination } from 'react-bootstrap';
import { Plus, Calendar } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime } from '../../utils/formatters';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './GateEntry.module.css';

// Mock data
const MOCK_ENTRIES = [
  { id: '1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', mobile: '9876543210', makeModel: 'Hyundai i20', serviceType: 'General Service', status: 'IN_PROGRESS', entryTime: '2024-06-12T08:00:00Z', entryBy: 'Gate Guard A' },
  { id: '2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', mobile: '9876543211', makeModel: 'Maruti Swift', serviceType: 'Oil Change', status: 'PENDING', entryTime: '2024-06-12T09:15:00Z', entryBy: 'Gate Guard A' },
  { id: '3', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', mobile: '9876543212', makeModel: 'Honda City', serviceType: 'Body Repair', status: 'COMPLETED', entryTime: '2024-06-12T07:30:00Z', entryBy: 'Gate Guard B' },
  { id: '4', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', mobile: '9876543213', makeModel: 'Toyota Fortuner', serviceType: 'Engine Repair', status: 'DELAYED', entryTime: '2024-06-11T10:00:00Z', entryBy: 'Gate Guard A' },
  { id: '5', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', mobile: '9876543214', makeModel: 'Mahindra XUV500', serviceType: 'General Service', status: 'BODY_SHOP', entryTime: '2024-06-12T08:45:00Z', entryBy: 'Gate Guard B' },
];

export default function GateEntryList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const debSearch = useDebounce(search, 300);

  const filtered = MOCK_ENTRIES.filter(
    (e) =>
      !debSearch ||
      e.vehicleNumber.toLowerCase().includes(debSearch.toLowerCase()) ||
      e.ownerName.toLowerCase().includes(debSearch.toLowerCase()) ||
      e.mobile.includes(debSearch)
  );

  const columns = [
    {
      header: 'Vehicle Number',
      render: (row) => <code className={styles.vehicleNum}>{row.vehicleNumber}</code>,
    },
    { header: 'Owner Name', accessor: 'ownerName' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Make & Model', accessor: 'makeModel' },
    { header: 'Service Type', accessor: 'serviceType' },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Entry Time', render: (row) => formatDateTime(row.entryTime) },
    { header: 'Entry By', accessor: 'entryBy' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

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
        title="Gate Entries"
        subtitle={`${filtered.length} entries today`}
        breadcrumbs={[{ label: 'Gate Entry' }]}
        actions={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate('/gate-entry/new')}>
            New Entry
          </Button>
        }
      />

      <div className={styles.filterBar}>
        <SearchBar
          placeholder="Search by vehicle number, owner, mobile..."
          value={search}
          onChange={setSearch}
          className={styles.searchBox}
        />
        <Button variant="secondary" size="sm" leftIcon={Calendar}>
          Today
        </Button>
      </div>

      <div className="bg-white rounded border overflow-hidden d-flex flex-column" style={{ minHeight: '300px' }}>
        <div className="table-responsive flex-grow-1">
          {filtered.length === 0 ? (
            <div className="p-5 text-center text-muted">No gate entries found</div>
          ) : (
            <Table striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Vehicle Number</th>
                  <th>Owner Name</th>
                  <th>Mobile</th>
                  <th>Make & Model</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Entry Time</th>
                  <th>Entry By</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle"><code className={styles.vehicleNum}>{row.vehicleNumber}</code></td>
                    <td className="align-middle">{row.ownerName}</td>
                    <td className="align-middle">{row.mobile}</td>
                    <td className="align-middle">{row.makeModel}</td>
                    <td className="align-middle">{row.serviceType}</td>
                    <td className="align-middle"><StatusBadge status={row.status} /></td>
                    <td className="align-middle">{formatDateTime(row.entryTime)}</td>
                    <td className="align-middle">{row.entryBy}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries
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
