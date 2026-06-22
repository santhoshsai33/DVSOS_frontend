import { useState } from 'react';
import { WifiOff, RefreshCw, Upload, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/common/DataTable';
import { formatDateTime } from '../../utils/formatters';
import { toastSuccess, toastInfo } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';

const MOCK_PENDING = [
  { id: 'PE-001', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', serviceType: 'General Service', capturedAt: new Date(Date.now() - 25 * 60000).toISOString(), status: 'PENDING_SYNC', reason: 'No internet at time of entry' },
  { id: 'PE-002', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', serviceType: 'Oil Change', capturedAt: new Date(Date.now() - 50 * 60000).toISOString(), status: 'PENDING_SYNC', reason: 'Server timeout during submission' },
  { id: 'PE-003', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', serviceType: 'Brake Service', capturedAt: new Date(Date.now() - 80 * 60000).toISOString(), status: 'SYNCED', reason: '' },
];

export default function PendingSyncPage() {
  const [entries, setEntries] = useState(MOCK_PENDING);
  const [syncing, setSyncing] = useState(false);

  const pending = entries.filter(e => e.status === 'PENDING_SYNC');
  const synced = entries.filter(e => e.status === 'SYNCED');

  const handleSyncAll = async () => {
    setSyncing(true);
    toastInfo('Uploading offline entries to server...');
    await new Promise((r) => setTimeout(r, 1800));
    setEntries(prev => prev.map(e => ({ ...e, status: 'SYNCED', reason: '' })));
    setSyncing(false);
    toastSuccess(`${pending.length} entries synced successfully!`);
  };

  const handleSyncOne = async (id) => {
    toastInfo('Syncing entry...');
    await new Promise((r) => setTimeout(r, 800));
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'SYNCED', reason: '' } : e));
    toastSuccess('Entry synced successfully!');
  };

  const columns = [
    { header: 'Entry ID', render: (row) => <code style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{row.id}</code> },
    {
      header: 'Vehicle',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700 }}>{row.vehicleNumber}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{row.ownerName}</div>
        </div>
      ),
    },
    { header: 'Service', accessor: 'serviceType' },
    { header: 'Captured At', render: (row) => <span style={{ fontSize: '0.82rem' }}>{formatDateTime(row.capturedAt)}</span> },
    {
      header: 'Status',
      render: (row) => (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontWeight: 700, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px',
          background: row.status === 'SYNCED' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          color: row.status === 'SYNCED' ? '#10B981' : '#EF4444',
        }}>
          {row.status === 'SYNCED' ? <CheckCircle2 size={11} /> : <WifiOff size={11} />}
          {row.status === 'SYNCED' ? 'Synced' : 'Pending Sync'}
        </span>
      ),
    },
    {
      header: 'Action',
      render: (row) =>
        row.status === 'PENDING_SYNC' ? (
          <Button size="sm" variant="outline" leftIcon={Upload} onClick={() => handleSyncOne(row.id)}>
            Sync
          </Button>
        ) : (
          <span style={{ fontSize: '0.78rem', color: '#10B981' }}>✓ Done</span>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pending Sync"
        subtitle="Offline entries captured when internet was unavailable"
        breadcrumbs={[{ label: 'Gate', path: ROUTES.GATE_DASHBOARD }, { label: 'Pending Sync' }]}
        actions={
          pending.length > 0 ? (
            <Button variant="primary" leftIcon={Upload} isLoading={syncing} onClick={handleSyncAll}>
              Sync All ({pending.length})
            </Button>
          ) : null
        }
      />

      {/* Status Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Pending Sync', value: pending.length, icon: WifiOff, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
          { label: 'Synced Today', value: synced.length, icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Total Offline Entries', value: entries.length, icon: Clock, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.color}25`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Icon size={24} style={{ color: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {pending.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(16,185,129,0.05)', border: '1.5px solid rgba(16,185,129,0.2)', borderRadius: '12px', marginBottom: '1.25rem' }}>
          <CheckCircle2 size={36} style={{ color: '#10B981', marginBottom: '0.75rem' }} />
          <h6 style={{ color: '#10B981', fontWeight: 700 }}>All entries are synced!</h6>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>No offline records are pending upload.</p>
        </div>
      )}

      <div className="premium-card">
        <DataTable
          columns={columns}
          data={entries}
          emptyMessage="No offline entries found"
        />
      </div>
    </div>
  );
}
