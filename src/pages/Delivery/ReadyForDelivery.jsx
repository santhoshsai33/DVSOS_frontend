import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { Truck, PhoneCall, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/common/Button';
import { toastSuccess } from '../../notifications/toast';
import styles from '../JobCards/JobCards.module.css';

const MOCK_READY = [
  { id: 'JC-1033', vehicle: 'TN 02 CD 5566', owner: 'Vinoth Kumar', mobile: '9876543210', completedAt: '2 hrs ago', billAmount: 4500 },
  { id: 'JC-1035', vehicle: 'KL 10 EE 4433', owner: 'Anitha R.', mobile: '9876543211', completedAt: '30 mins ago', billAmount: 1200 },
];

export default function ReadyForDelivery() {
  const handleNotify = () => toastSuccess('Customer notified for pickup via WhatsApp');
  const handleDeliver = () => toastSuccess('Vehicle marked as delivered');

  const columns = [
    {
      header: 'Job Card',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--color-accent)' }}>{row.id}</strong>,
    },
    {
      header: 'Vehicle',
      accessor: 'vehicle',
      render: (row) => <code className={styles.vehicleNum}>{row.vehicle}</code>,
    },
    { header: 'Owner', accessor: 'owner' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Ready Since', accessor: 'completedAt' },
    { header: 'Final Bill', render: (row) => `₹${row.billAmount}` },
    {
      header: 'Actions',
      render: () => (
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline" leftIcon={PhoneCall} onClick={handleNotify}>Notify</Button>
          <Button size="sm" variant="success" leftIcon={CheckCircle2} onClick={handleDeliver}>Deliver</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ready For Delivery"
        breadcrumbs={[{ label: 'Delivery' }, { label: 'Ready for Pickup' }]}
        actions={<Button variant="primary" leftIcon={Truck}>View Delivery Queue</Button>}
      />

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={MOCK_READY}
          emptyMessage="No vehicles ready for delivery"
        />
      </div>
    </div>
  );
}
