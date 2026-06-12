import { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/common/Button';
import { formatDateTime } from '../../utils/formatters';

const MOCK_DELIVERED = [
  { id: 'JC-0998', vehicle: 'TN 01 XY 1122', owner: 'Rahul K.', deliveredAt: '2024-06-11T16:30:00Z', billAmount: 3400, feedback: '5/5' },
  { id: 'JC-0995', vehicle: 'KA 03 AA 4455', owner: 'Sneha M.', deliveredAt: '2024-06-11T14:15:00Z', billAmount: 1800, feedback: '4/5' },
];

export default function DeliveredVehicles() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(MOCK_DELIVERED.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = MOCK_DELIVERED.slice(startIndex, startIndex + itemsPerPage);

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
        title="Delivered Vehicles"
        subtitle="Log of all vehicles handed over to customers"
        breadcrumbs={[{ label: 'Delivery' }, { label: 'Delivered' }]}
      />

      <div className="premium-card d-flex flex-column" style={{ minHeight: '300px' }}>
        <div className="table-responsive flex-grow-1">
          {MOCK_DELIVERED.length === 0 ? (
            <div className="p-5 text-center text-muted">No delivered vehicles</div>
          ) : (
            <Table striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Job Card</th>
                  <th>Vehicle</th>
                  <th>Owner</th>
                  <th>Delivered On</th>
                  <th>Final Bill</th>
                  <th>CSAT</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle"><strong style={{ color: 'var(--color-accent)' }}>{row.id}</strong></td>
                    <td className="align-middle"><code style={{ background: 'var(--color-bg-base)', padding: '2px 6px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>{row.vehicle}</code></td>
                    <td className="align-middle">{row.owner}</td>
                    <td className="align-middle">{formatDateTime(row.deliveredAt)}</td>
                    <td className="align-middle">₹{row.billAmount}</td>
                    <td className="align-middle"><strong>⭐ {row.feedback}</strong></td>
                    <td className="align-middle">
                      <Button size="sm" variant="ghost" leftIcon={FileText}>View Invoice</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, MOCK_DELIVERED.length)} of {MOCK_DELIVERED.length} entries
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
