import { useState } from 'react';
import { Clock, Wrench, CheckCircle2, User, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import PageHeader from '../../components/shared/PageHeader';
import styles from './WorkQueue.module.css';

// Mock queue data
const MOCK_QUEUE = {
  PENDING: [
    { id: 'Q1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', makeModel: 'Hyundai i20', serviceType: 'General Service', priority: 'HIGH', waitTime: '1 hr 20 min' },
    { id: 'Q2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', makeModel: 'Maruti Swift', serviceType: 'Oil Change', priority: 'NORMAL', waitTime: '45 min' },
    { id: 'Q3', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', makeModel: 'Tata Nexon', serviceType: 'Brake Service', priority: 'URGENT', waitTime: '10 min' },
  ],
  ASSIGNED: [
    { id: 'Q4', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', makeModel: 'Honda City', serviceType: 'Engine Repair', priority: 'HIGH', technician: 'Rajan M.', waitTime: '2 hrs' },
  ],
  IN_PROGRESS: [
    { id: 'Q5', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', makeModel: 'Toyota Fortuner', serviceType: 'Engine Repair', priority: 'URGENT', technician: 'Anand P.', waitTime: '4 hrs 10 min' },
    { id: 'Q6', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', makeModel: 'Mahindra XUV500', serviceType: 'Full Inspection', priority: 'NORMAL', technician: 'Vikram S.', waitTime: '1 hr 5 min' },
  ],
  COMPLETED: [
    { id: 'Q7', vehicleNumber: 'TN 02 CD 5566', ownerName: 'Vinoth Kumar', makeModel: 'Hyundai Creta', serviceType: 'Oil Change', priority: 'NORMAL', technician: 'Rajan M.', waitTime: 'Done in 1.5 hrs' },
    { id: 'Q8', vehicleNumber: 'KL 10 EE 4433', ownerName: 'Anitha R.', makeModel: 'Maruti Baleno', serviceType: 'AC Service', priority: 'LOW', technician: 'Vikram S.', waitTime: 'Done in 2 hrs' },
    { id: 'Q9', vehicleNumber: 'TN 11 GG 2211', ownerName: 'Babu S.', makeModel: 'Honda Jazz', serviceType: 'Brake Service', priority: 'NORMAL', technician: 'Anand P.', waitTime: 'Done in 45 min' },
  ],
};

const COLS = [
  { key: 'PENDING', label: 'Pending', icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
  { key: 'ASSIGNED', label: 'Assigned', icon: User, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Wrench, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
];

const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

function QueueCard({ item, status }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <code className={styles.vehicleNum}>{item.vehicleNumber}</code>
        <span
          className={styles.priority}
          style={{ color: PRIORITY_COLORS[item.priority || 'NORMAL'], background: PRIORITY_COLORS[item.priority || 'NORMAL'] + '15' }}
        >
          {item.priority || 'NORMAL'}
        </span>
      </div>
      <p className={styles.ownerName}>{item.ownerName}</p>
      <p className={styles.makeModel}>{item.makeModel}</p>
      <div className={styles.serviceTag}>{item.serviceType}</div>
      {item.technician && (
        <div className={styles.techRow}>
          <User size={12} />
          {item.technician}
        </div>
      )}
      <div className={styles.cardFooter}>
        <span className={styles.waitTime}>
          <Clock size={11} /> {item.waitTime}
        </span>
        {status === 'PENDING' && (
          <Button size="sm" variant="outline" rightIcon={ArrowRight}>
            Assign
          </Button>
        )}
        {status === 'ASSIGNED' && (
          <Button size="sm" variant="primary" rightIcon={ArrowRight}>
            Start
          </Button>
        )}
        {status === 'IN_PROGRESS' && (
          <Button size="sm" variant="success" rightIcon={CheckCircle2}>
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}

export default function MechanicalQueue() {
  const [queue] = useState(MOCK_QUEUE);

  return (
    <div>
      <PageHeader
        title="Mechanical Queue"
        subtitle="Manage mechanical work assignments and track progress"
        breadcrumbs={[{ label: 'Mechanical Queue' }]}
      />

      {/* Summary Stats */}
      <div className={styles.summaryRow}>
        {COLS.map((col) => {
          const Icon = col.icon;
          const count = queue[col.key]?.length || 0;
          return (
            <div key={col.key} className={styles.summaryCard} style={{ '--col-color': col.color, '--col-bg': col.bg }}>
              <Icon size={20} style={{ color: col.color }} />
              <div>
                <p className={styles.summaryLabel}>{col.label}</p>
                <p className={styles.summaryCount}>{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className={styles.board}>
        {COLS.map((col) => {
          const Icon = col.icon;
          const items = queue[col.key] || [];
          return (
            <div key={col.key} className={styles.column}>
              <div className={styles.columnHeader} style={{ borderColor: col.color }}>
                <div className={styles.columnTitle} style={{ color: col.color }}>
                  <Icon size={16} />
                  {col.label}
                </div>
                <span className={styles.columnCount} style={{ background: col.color + '20', color: col.color }}>
                  {items.length}
                </span>
              </div>
              <div className={styles.columnBody}>
                {items.map((item) => (
                  <QueueCard key={item.id} item={item} status={col.key} />
                ))}
                {items.length === 0 && (
                  <div className={styles.emptyCol}>No items in {col.label.toLowerCase()}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
