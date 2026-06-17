import { LogIn, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Box } from '@mui/material';
import DataTable from '../../../../components/common/DataTable';
import StatusBadge from '../../../../components/common/StatusBadge';
import VehicleNumberPlate from '../../../../components/common/VehicleNumberPlate';
import PageHeader from '../../../../components/shared/PageHeader';
import { formatDateTime } from '../../../../utils/formatters';
import styles from '../../../../pages/GateEntry/GateEntry.module.css';

// Mock data
const MOCK_ENTRIES = [
  { id: '1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', mobile: '9876543210', makeModel: 'Hyundai i20', serviceType: 'General Service', status: 'IN_PROGRESS', entryTime: '2024-06-12T08:00:00Z', entryBy: 'Gate Guard A' },
  { id: '2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', mobile: '9876543211', makeModel: 'Maruti Swift', serviceType: 'Oil Change', status: 'PENDING', entryTime: '2024-06-12T09:15:00Z', entryBy: 'Gate Guard A' },
  { id: '3', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', mobile: '9876543212', makeModel: 'Honda City', serviceType: 'Body Repair', status: 'COMPLETED', entryTime: '2024-06-12T07:30:00Z', entryBy: 'Gate Guard B' },
  { id: '4', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', mobile: '9876543213', makeModel: 'Toyota Fortuner', serviceType: 'Engine Repair', status: 'DELAYED', entryTime: '2024-06-11T10:00:00Z', entryBy: 'Gate Guard A' },
  { id: '5', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', mobile: '9876543214', makeModel: 'Mahindra XUV500', serviceType: 'General Service', status: 'BODY_SHOP', entryTime: '2024-06-12T08:45:00Z', entryBy: 'Gate Guard B' },
];

export default function GateDashboardPage() {
  // Show only 3 most recent entries on dashboard
  const displayData = MOCK_ENTRIES.slice(0, 3);

  const columns = [
    {
      header: 'Vehicle Number',
      sortable: false,
      render: (row) => <code className={styles.vehicleNum}>{row.vehicleNumber}</code>,
    },
    { header: 'Owner Name', accessor: 'ownerName', sortable: false },
    { header: 'Mobile', accessor: 'mobile', sortable: false },
    { header: 'Make & Model', accessor: 'makeModel', sortable: false },
    { header: 'Status', sortable: false, render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Gate Dashboard"
        breadcrumbs={[{ label: 'Gate Entry' }]}
      />

      {/* Today's Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Vehicles In Today', value: MOCK_ENTRIES.length, icon: LogIn, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
          { label: 'In Progress', value: MOCK_ENTRIES.filter(e => e.status === 'IN_PROGRESS').length, icon: Clock, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
          { label: 'Completed', value: MOCK_ENTRIES.filter(e => e.status === 'COMPLETED').length, icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
          { label: 'Delayed', value: MOCK_ENTRIES.filter(e => e.status === 'DELAYED').length, icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ background: stat.bg, border: `1.5px solid ${stat.color}25`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: stat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: 2 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={displayData}
          emptyMessage="No gate entries found"
          showPagination={false}
        />
      </div>
    </Box>
  );
}
