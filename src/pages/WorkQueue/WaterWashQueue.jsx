import { useState } from 'react';
import { Clock, Droplets, CheckCircle2, Truck, ArrowRight, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { toastSuccess } from '../../notifications/toast';
import { formatDateTime } from '../../utils/formatters';
import styles from './WorkQueue.module.css';

const INITIAL_WATER_WASH = {
  PENDING: [
    { id: 'W1', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', makeModel: 'Tata Nexon', serviceType: 'Premium Wash', priority: 'HIGH', waitTime: '30 min', stageEnteredAt: new Date(Date.now() - 1 * 3600000).toISOString() }, // Overdue
    { id: 'W2', vehicleNumber: 'TN 05 AB 1122', ownerName: 'Saranya K.', makeModel: 'Honda Amaze', serviceType: 'Basic Wash', priority: 'NORMAL', waitTime: '15 min', stageEnteredAt: new Date(Date.now() - 0.2 * 3600000).toISOString() },
    { id: 'W3', vehicleNumber: 'KL 08 XY 5544', ownerName: 'Mohan D.', makeModel: 'Maruti Dzire', serviceType: 'Interior Cleaning', priority: 'NORMAL', waitTime: '45 min', stageEnteredAt: new Date(Date.now() - 0.5 * 3600000).toISOString() },
  ],
  IN_PROGRESS: [
    { id: 'W4', vehicleNumber: 'TN 11 GG 2211', ownerName: 'Babu S.', makeModel: 'Honda Jazz', serviceType: 'Full Detail Wash', priority: 'NORMAL', technician: 'Wash Team A', waitTime: '20 min left', stageEnteredAt: new Date(Date.now() - 1.5 * 3600000).toISOString() }, // Overdue
  ],
  COMPLETED: [
    { id: 'W5', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', makeModel: 'Honda City', serviceType: 'Basic Wash', priority: 'NORMAL', technician: 'Wash Team B', waitTime: 'Done in 25 min', stageEnteredAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  ],
};

const COLS = [
  { key: 'PENDING', label: 'Pending', icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', limitHours: 0.5 },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Droplets, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.08)', limitHours: 1 },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', limitHours: Infinity },
];

const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

export default function WaterWashQueue() {
  const [queue, setQueue] = useState(INITIAL_WATER_WASH);

  const isOverdue = (dateString, limitHours) => {
    if (!dateString || limitHours === Infinity) return false;
    const diffHours = (new Date() - new Date(dateString)) / (1000 * 60 * 60);
    return diffHours > limitHours;
  };

  const moveItem = (itemId, fromCol, toCol) => {
    setQueue(prev => {
      const itemToMove = prev[fromCol].find(i => i.id === itemId);
      if (!itemToMove) return prev;
      
      const updatedItem = { ...itemToMove, stageEnteredAt: new Date().toISOString() };
      const newFrom = prev[fromCol].filter(i => i.id !== itemId);
      const newTo = [...prev[toCol], updatedItem];
      
      return { ...prev, [fromCol]: newFrom, [toCol]: newTo };
    });
  };

  const handleStart = (item) => {
    moveItem(item.id, 'PENDING', 'IN_PROGRESS');
    toastSuccess(`Water wash started for ${item.vehicleNumber}`);
  };

  const handleComplete = (item) => {
    moveItem(item.id, 'IN_PROGRESS', 'COMPLETED');
    toastSuccess(`Vehicle is clean and ready. CRM Team has been notified for customer delivery!`);
  };

  const WashCard = ({ item, status, limitHours }) => {
    const overdue = isOverdue(item.stageEnteredAt, limitHours);
    
    return (
      <div className={`${styles.card} ${overdue ? styles.cardOverdue : ''}`}>
        <div className={styles.cardHeader}>
          <code className={styles.vehicleNum}>{item.vehicleNumber}</code>
          <span className={styles.priority} style={{ color: PRIORITY_COLORS[item.priority || 'NORMAL'], background: PRIORITY_COLORS[item.priority || 'NORMAL'] + '15' }}>
            {item.priority}
          </span>
        </div>
        <p className={styles.ownerName}>{item.ownerName}</p>
        <p className={styles.makeModel}>{item.makeModel}</p>
        
        {overdue && (
          <div className={styles.deliveryAlert}>
            <AlertTriangle size={12} /> SLA Breached!
          </div>
        )}
        
        <div className={styles.serviceTag}>{item.serviceType}</div>
        {item.technician && <div className={styles.techRow}>{item.technician}</div>}
        
        <div className={styles.cardFooter}>
          <span className={styles.waitTime} title={`Entered stage: ${formatDateTime(item.stageEnteredAt)}`}>
            <Clock size={11} /> {overdue ? 'Overdue' : item.waitTime}
          </span>
          {status === 'PENDING' && <Button size="sm" variant="primary" rightIcon={ArrowRight} onClick={() => handleStart(item)}>Start</Button>}
          {status === 'IN_PROGRESS' && <Button size="sm" variant="success" rightIcon={CheckCircle2} onClick={() => handleComplete(item)}>Complete</Button>}
          {status === 'COMPLETED' && <Button size="sm" variant="outline" leftIcon={Truck} disabled>Ready</Button>}
        </div>
      </div>
    );
  };

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
            <div key={col.key} className={styles.summaryCard} style={{ '--col-color': col.color, '--col-bg': col.bg }}>
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
                {items.map((item) => <WashCard key={item.id} item={item} status={col.key} limitHours={col.limitHours} />)}
                {items.length === 0 && <div className={styles.emptyCol}>No items in {col.label.toLowerCase()}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
