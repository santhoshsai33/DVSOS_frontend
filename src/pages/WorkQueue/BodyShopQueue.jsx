import { useState } from 'react';
import { Clock, Paintbrush, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import styles from './WorkQueue.module.css';

const MOCK_BODY_SHOP = {
  PENDING: [
    { id: 'B1', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', makeModel: 'Mahindra XUV500', serviceType: 'Body Repair + Paint', priority: 'HIGH', waitTime: '3 hrs' },
    { id: 'B2', vehicleNumber: 'TN 05 CD 3322', ownerName: 'Murugan A.', makeModel: 'Maruti Ertiga', serviceType: 'Dent Removal', priority: 'NORMAL', waitTime: '1 hr' },
  ],
  IN_PROGRESS: [
    { id: 'B3', vehicleNumber: 'KA 11 PQ 6677', ownerName: 'Ravi S.', makeModel: 'Toyota Innova', serviceType: 'Full Body Repaint', priority: 'URGENT', technician: 'Body Team A', waitTime: '2 days in progress' },
  ],
  COMPLETED: [
    { id: 'B4', vehicleNumber: 'MH 08 XX 9900', ownerName: 'Srinivas R.', makeModel: 'Hyundai Venue', serviceType: 'Panel Beating', priority: 'NORMAL', technician: 'Body Team B', waitTime: 'Done in 4 hrs' },
  ],
};

const COLS = [
  { key: 'PENDING', label: 'Pending', icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Paintbrush, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
];

const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

function QueueCard({ item, status }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <code className={styles.vehicleNum}>{item.vehicleNumber}</code>
        <span className={styles.priority} style={{ color: PRIORITY_COLORS[item.priority || 'NORMAL'], background: PRIORITY_COLORS[item.priority || 'NORMAL'] + '15' }}>
          {item.priority || 'NORMAL'}
        </span>
      </div>
      <p className={styles.ownerName}>{item.ownerName}</p>
      <p className={styles.makeModel}>{item.makeModel}</p>
      <div className={styles.serviceTag}>{item.serviceType}</div>
      {item.technician && <div className={styles.techRow}>{item.technician}</div>}
      <div className={styles.cardFooter}>
        <span className={styles.waitTime}><Clock size={11} /> {item.waitTime}</span>
        {status === 'PENDING' && <Button size="sm" variant="primary" rightIcon={ArrowRight}>Start</Button>}
        {status === 'IN_PROGRESS' && <Button size="sm" variant="success" rightIcon={CheckCircle2}>Complete</Button>}
      </div>
    </div>
  );
}

export default function BodyShopQueue() {
  const [queue] = useState(MOCK_BODY_SHOP);

  return (
    <div>
      <PageHeader
        title="Body Shop Queue"
        subtitle="Manage body shop work and paint jobs"
        breadcrumbs={[{ label: 'Body Shop Queue' }]}
      />

      <div className={styles.summaryRow}>
        {COLS.map((col) => {
          const Icon = col.icon;
          return (
            <div key={col.key} className={styles.summaryCard} style={{ '--col-color': col.color }}>
              <Icon size={20} style={{ color: col.color }} />
              <div>
                <p className={styles.summaryLabel}>{col.label}</p>
                <p className={styles.summaryCount}>{queue[col.key]?.length || 0}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.board} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {COLS.map((col) => {
          const Icon = col.icon;
          const items = queue[col.key] || [];
          return (
            <div key={col.key} className={styles.column}>
              <div className={styles.columnHeader} style={{ borderColor: col.color }}>
                <div className={styles.columnTitle} style={{ color: col.color }}><Icon size={16} />{col.label}</div>
                <span className={styles.columnCount} style={{ background: col.color + '20', color: col.color }}>{items.length}</span>
              </div>
              <div className={styles.columnBody}>
                {items.map((item) => <QueueCard key={item.id} item={item} status={col.key} />)}
                {items.length === 0 && <div className={styles.emptyCol}>No items in {col.label.toLowerCase()}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
