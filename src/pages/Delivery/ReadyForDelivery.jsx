import { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { Truck, PhoneCall, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';

const MOCK_READY = [
  { id: 'JC-1033', vehicle: 'TN 02 CD 5566', owner: 'Vinoth Kumar', mobile: '9876543210', completedAt: '2 hrs ago', billAmount: 4500 },
  { id: 'JC-1035', vehicle: 'KL 10 EE 4433', owner: 'Anitha R.', mobile: '9876543211', completedAt: '30 mins ago', billAmount: 1200 },
];

export default function ReadyForDelivery() {
  const handleNotify = () => toastSuccess('Customer notified for pickup via WhatsApp');
  const handleDeliver = () => toastSuccess('Vehicle marked as delivered');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(MOCK_READY.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = MOCK_READY.slice(startIndex, startIndex + itemsPerPage);

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
        title="Ready For Delivery"
        subtitle="Manage vehicles that have completed all service stages and are awaiting customer pickup"
        breadcrumbs={[{ label: 'Delivery' }, { label: 'Ready for Pickup' }]}
        actions={<Button variant="primary" leftIcon={Truck}>View Delivery Queue</Button>}
      />

      <div className="premium-card d-flex flex-column" style={{ minHeight: '300px' }}>
        <div className="table-responsive flex-grow-1">
          {MOCK_READY.length === 0 ? (
            <div className="p-5 text-center text-muted">No vehicles ready for delivery</div>
          ) : (
            <Table striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Job Card</th>
                  <th>Vehicle</th>
                  <th>Owner</th>
                  <th>Mobile</th>
                  <th>Ready Since</th>
                  <th>Final Bill</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle"><strong style={{ color: 'var(--color-accent)' }}>{row.id}</strong></td>
                    <td className="align-middle"><code style={{ background: 'var(--color-bg-base)', padding: '2px 6px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>{row.vehicle}</code></td>
                    <td className="align-middle">{row.owner}</td>
                    <td className="align-middle">{row.mobile}</td>
                    <td className="align-middle">{row.completedAt}</td>
                    <td className="align-middle">₹{row.billAmount}</td>
                    <td className="align-middle">
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="outline" leftIcon={PhoneCall} onClick={handleNotify}>Notify</Button>
                        <Button size="sm" variant="success" leftIcon={CheckCircle2} onClick={handleDeliver}>Deliver</Button>
                      </div>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, MOCK_READY.length)} of {MOCK_READY.length} entries
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
