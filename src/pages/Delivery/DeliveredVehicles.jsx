import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/common/Button';
import { formatDateTime } from '../../utils/formatters';

const MOCK_DELIVERED = [
  { id: 'JC-0998', vehicle: 'TN 01 XY 1122', owner: 'Rahul K.', deliveredAt: '2024-06-11T16:30:00Z', billAmount: 3400, feedback: '5/5' },
  { id: 'JC-0995', vehicle: 'KA 03 AA 4455', owner: 'Sneha M.', deliveredAt: '2024-06-11T14:15:00Z', billAmount: 1800, feedback: '4/5' },
];

export default function DeliveredVehicles() {
  const columns = [
    {
      header: 'Job Card',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--color-accent)' }}>{row.id}</strong>,
    },
    {
      header: 'Vehicle',
      accessor: 'vehicle',
      render: (row) => <code style={{ background: 'var(--color-bg-base)', padding: '2px 6px', border: '1px solid var(--color-border)', borderRadius: '4px' }}>{row.vehicle}</code>,
    },
    { header: 'Owner', accessor: 'owner' },
    { header: 'Delivered On', render: (row) => formatDateTime(row.deliveredAt) },
    { header: 'Final Bill', render: (row) => `₹${row.billAmount}` },
    { header: 'CSAT', render: (row) => <strong>⭐ {row.feedback}</strong> },
    {
      header: 'Actions',
      render: () => <Button size="sm" variant="ghost" leftIcon={FileText}>View Invoice</Button>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Delivered Vehicles"
        subtitle="Log of all vehicles handed over to customers"
        breadcrumbs={[{ label: 'Delivery' }, { label: 'Delivered' }]}
      />

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={MOCK_DELIVERED}
          emptyMessage="No delivered vehicles"
        />
      </div>
    </div>
  );
}
