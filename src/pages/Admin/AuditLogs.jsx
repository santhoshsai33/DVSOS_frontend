import { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime } from '../../utils/formatters';

const MOCK_LOGS = [
  { id: 1, user: 'Admin User', action: 'Created User', entity: 'User', details: 'Added new floor supervisor: Rajan M.', timestamp: '2024-06-12T10:05:00Z' },
  { id: 2, user: 'System', action: 'Auto-Assign', entity: 'JobCard', details: 'Assigned JC-1033 to Mechanic Team A', timestamp: '2024-06-12T09:30:00Z' },
];

export default function AuditLogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(MOCK_LOGS.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = MOCK_LOGS.slice(startIndex, startIndex + itemsPerPage);

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
        title="Audit Logs"
        subtitle="System-wide action and security logs"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Audit Logs' }]}
      />
      <div className="premium-card d-flex flex-column" style={{ minHeight: '300px' }}>
        <div className="table-responsive flex-grow-1">
          {MOCK_LOGS.length === 0 ? (
            <div className="p-5 text-center text-muted">No audit logs found</div>
          ) : (
            <Table striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle">{formatDateTime(row.timestamp)}</td>
                    <td className="align-middle"><strong>{row.user}</strong></td>
                    <td className="align-middle">{row.action}</td>
                    <td className="align-middle">{row.entity}</td>
                    <td className="align-middle">{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, MOCK_LOGS.length)} of {MOCK_LOGS.length} entries
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
