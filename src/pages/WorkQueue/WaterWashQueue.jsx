import { useState } from 'react';
import { Clock, Droplets, CheckCircle2, Truck, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import styles from './WorkQueue.module.css';

const MOCK_WATER_WASH = {
  PENDING: [
    { id: 'W1', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', makeModel: 'Tata Nexon', serviceType: 'Premium Wash', priority: 'HIGH', waitTime: '30 min' },
    { id: 'W2', vehicleNumber: 'TN 05 AB 1122', ownerName: 'Saranya K.', makeModel: 'Honda Amaze', serviceType: 'Basic Wash', priority: 'NORMAL', waitTime: '15 min' },
    { id: 'W3', vehicleNumber: 'KL 08 XY 5544', ownerName: 'Mohan D.', makeModel: 'Maruti Dzire', serviceType: 'Interior Cleaning', priority: 'NORMAL', waitTime: '45 min' },
  ],
  IN_PROGRESS: [
    { id: 'W4', vehicleNumber: 'TN 11 GG 2211', ownerName: 'Babu S.', makeModel: 'Honda Jazz', serviceType: 'Full Detail Wash', priority: 'NORMAL', technician: 'Wash Team A', waitTime: '20 min left' },
  ],
  COMPLETED: [
    { id: 'W5', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', makeModel: 'Honda City', serviceType: 'Basic Wash', priority: 'NORMAL', technician: 'Wash Team B', waitTime: 'Done in 25 min' },
    { id: 'W6', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', makeModel: 'Maruti Swift', serviceType: 'Premium Wash', priority: 'LOW', technician: 'Wash Team A', waitTime: 'Done in 35 min' },
  ],
};

const COLS = [
  { key: 'PENDING', label: 'Pending', icon: Clock, color: '#F59E0B' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Droplets, color: '#06B6D4' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: '#10B981' },
];

const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

function WashCard({ item, status }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <code className={styles.vehicleNum}>{item.vehicleNumber}</code>
        <span className={styles.priority} style={{ color: PRIORITY_COLORS[item.priority || 'NORMAL'], background: PRIORITY_COLORS[item.priority || 'NORMAL'] + '15' }}>
          {item.priority}
        </span>
      </div>
      <p className={styles.ownerName}>{item.ownerName}</p>
      <p className={styles.makeModel}>{item.makeModel}</p>
      <div className={styles.serviceTag}>{item.serviceType}</div>
      {item.technician && <div className={styles.techRow}>{item.technician}</div>}
      <div className={styles.cardFooter}>
        <span className={styles.waitTime}><Clock size={11} /> {item.waitTime}</span>
        {status === 'PENDING' && <Button size="sm" variant="primary" rightIcon={ArrowRight}>Start Wash</Button>}
        {status === 'IN_PROGRESS' && <Button size="sm" variant="success" rightIcon={CheckCircle2}>Complete</Button>}
        {status === 'COMPLETED' && <Button size="sm" variant="outline" leftIcon={Truck}>Ready</Button>}
      </div>
    </div>
  );
}

export default function WaterWashQueue() {
  const [queue] = useState(MOCK_WATER_WASH);

  return (
    <div>
      <PageHeader
        title="Water Wash Queue"
        subtitle="Manage vehicle washing and detailing queue"
        breadcrumbs={[{ label: 'Water Wash Queue' }]}
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
        {/* Ready for Delivery summary */}
        <div className={styles.summaryCard} style={{ '--col-color': '#10B981', background: 'rgba(16, 185, 129, 0.06)' }}>
          <Truck size={20} style={{ color: '#10B981' }} />
          <div>
            <p className={styles.summaryLabel}>Ready for Delivery</p>
            <p className={styles.summaryCount}>{queue.COMPLETED?.length || 0}</p>
          </div>
        </div>
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
                {items.map((item) => <WashCard key={item.id} item={item} status={col.key} />)}
                {items.length === 0 && <div className={styles.emptyCol}>No items in {col.label.toLowerCase()}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
