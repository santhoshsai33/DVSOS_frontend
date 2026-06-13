import { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { formatDateTime } from '../../utils/formatters';

const MOCK_APPROVALS = [
  { id: 'AW-001', vehicle: 'TN 01 AB 1234', desc: 'Brake Pad Replacement', cost: 2500, status: 'PENDING', requestedAt: '2024-06-12T10:00:00Z' },
  { id: 'AW-002', vehicle: 'KA 05 XY 9876', desc: 'Wiper Blade Change', cost: 800, status: 'APPROVED', requestedAt: '2024-06-12T09:15:00Z' },
  { id: 'AW-003', vehicle: 'AP 16 ZZ 7700', desc: 'AC Gas Topup', cost: 1200, status: 'REJECTED', requestedAt: '2024-06-11T16:30:00Z' },
];

export default function ApprovalStatus() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(MOCK_APPROVALS.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = MOCK_APPROVALS.slice(startIndex, startIndex + itemsPerPage);

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
        title="WhatsApp Approval Status"
        subtitle="Track customer responses to additional work requests"
        breadcrumbs={[{ label: 'Additional Work' }, { label: 'Approval Status' }]}
        actions={
          <Button variant="secondary" leftIcon={RefreshCw} size="sm">Refresh Sync</Button>
        }
      />

      <div className="d-flex gap-3 mb-4">
        <div className="flex-fill premium-card p-3 d-flex align-items-center gap-3">
          <Clock size={24} className="text-warning" />
          <div>
            <div className="text-muted small fw-bold text-uppercase">Pending Reply</div>
            <div className="fs-4 fw-bolder text-warning">1</div>
          </div>
        </div>
        <div className="flex-fill premium-card p-3 d-flex align-items-center gap-3">
          <CheckCircle2 size={24} className="text-success" />
          <div>
            <div className="text-muted small fw-bold text-uppercase">Approved</div>
            <div className="fs-4 fw-bolder text-success">1</div>
          </div>
        </div>
        <div className="flex-fill premium-card p-3 d-flex align-items-center gap-3">
          <XCircle size={24} className="text-danger" />
          <div>
            <div className="text-muted small fw-bold text-uppercase">Rejected</div>
            <div className="fs-4 fw-bolder text-danger">1</div>
          </div>
        </div>
      </div>

      <div className="premium-card d-flex flex-column">
        <div className="table-responsive flex-grow-1">
          {MOCK_APPROVALS.length === 0 ? (
            <div className="p-5 text-center text-muted">No approvals found</div>
          ) : (
            <Table striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Vehicle</th>
                  <th>Description</th>
                  <th>Est. Cost</th>
                  <th>Requested At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle"><strong style={{ color: 'var(--color-accent)' }}>{row.id}</strong></td>
                    <td className="align-middle"><code style={{ background: 'var(--color-bg-base)', padding: '2px 6px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>{row.vehicle}</code></td>
                    <td className="align-middle">{row.desc}</td>
                    <td className="align-middle">₹{row.cost}</td>
                    <td className="align-middle">{formatDateTime(row.requestedAt)}</td>
                    <td className="align-middle"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, MOCK_APPROVALS.length)} of {MOCK_APPROVALS.length} entries
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
