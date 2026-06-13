import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
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
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--color-accent)' }}>{row.id}</strong>,
    },
    {
      header: 'Vehicle',
      accessor: 'vehicle',
      render: (row) => <code style={{ background: 'var(--color-bg-base)', padding: '2px 6px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>{row.vehicle}</code>,
    },
    { header: 'Description', accessor: 'desc' },
    { header: 'Est. Cost', render: (row) => `₹${row.cost}` },
    { header: 'Requested At', render: (row) => formatDateTime(row.requestedAt) },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

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
        <DataTable
          columns={columns}
          data={MOCK_APPROVALS}
          emptyMessage="No approvals found"
        />
      </div>
    </div>
  );
}
