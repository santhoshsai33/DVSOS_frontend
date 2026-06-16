import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { formatDateTime } from '../../utils/formatters';

const MOCK_LOGS = [
  { id: 1, user: 'Admin User', action: 'Created User', entity: 'User', details: 'Added new floor supervisor: Rajan M.', timestamp: '2024-06-12T10:05:00Z' },
  { id: 2, user: 'System', action: 'Auto-Assign', entity: 'JobCard', details: 'Assigned JC-1033 to Mechanic Team A', timestamp: '2024-06-12T09:30:00Z' },
];

export default function AuditLogs() {
  const columns = [
    { header: 'Timestamp', render: (row) => formatDateTime(row.timestamp) },
    { header: 'User', render: (row) => <strong>{row.user}</strong> },
    { header: 'Action', accessor: 'action' },
    { header: 'Entity', accessor: 'entity' },
    { header: 'Details', accessor: 'details' },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        breadcrumbs={[{ label: 'Settings' }, { label: 'Audit Logs' }]}
      />
      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={MOCK_LOGS}
          emptyMessage="No audit logs found"
        />
      </div>
    </div>
  );
}
