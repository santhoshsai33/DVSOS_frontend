import { useState } from 'react';
import { Clock, Paintbrush, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import { Box } from '@mui/material';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import PageHeader from '../../components/shared/PageHeader';
import { toastSuccess } from '../../notifications/toast';
import { formatDateTime } from '../../utils/formatters';
import styles from './WorkQueue.module.css';

const INITIAL_BODY_SHOP = {
  PENDING: [
    { id: 'B1', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', makeModel: 'Mahindra XUV500', serviceType: 'Body Repair + Paint', priority: 'HIGH', waitTime: '3 hrs', stageEnteredAt: new Date(Date.now() - 4 * 3600000).toISOString() }, // Overdue
    { id: 'B2', vehicleNumber: 'TN 05 CD 3322', ownerName: 'Murugan A.', makeModel: 'Maruti Ertiga', serviceType: 'Dent Removal', priority: 'NORMAL', waitTime: '1 hr', stageEnteredAt: new Date(Date.now() - 0.5 * 3600000).toISOString() },
  ],
  IN_PROGRESS: [
    { id: 'B3', vehicleNumber: 'KA 11 PQ 6677', ownerName: 'Ravi S.', makeModel: 'Toyota Innova', serviceType: 'Full Body Repaint', priority: 'URGENT', technician: 'Body Team A', subStage: 'Painting', waitTime: '2 days in progress', stageEnteredAt: new Date(Date.now() - 48 * 3600000).toISOString() }, // Overdue
  ],
  COMPLETED: [
    { id: 'B4', vehicleNumber: 'MH 08 XX 9900', ownerName: 'Srinivas R.', makeModel: 'Hyundai Venue', serviceType: 'Panel Beating', priority: 'NORMAL', technician: 'Body Team B', waitTime: 'Done in 4 hrs', stageEnteredAt: new Date(Date.now() - 1 * 3600000).toISOString() },
  ],
};

const COLS = [
  { key: 'PENDING', label: 'Pending', icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', limitHours: 2 },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Paintbrush, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', limitHours: 24 },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', limitHours: Infinity },
];

const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

export default function BodyShopQueue() {
  const [queue, setQueue] = useState(INITIAL_BODY_SHOP);

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

  const updateSubStage = (itemId, newStage) => {
    setQueue(prev => {
      const newInProgress = prev.IN_PROGRESS.map(item => 
        item.id === itemId ? { ...item, subStage: newStage } : item
      );
      return { ...prev, IN_PROGRESS: newInProgress };
    });
  };

  const handleStart = (item) => {
    moveItem(item.id, 'PENDING', 'IN_PROGRESS');
    toastSuccess(`Body shop work started for ${item.vehicleNumber}`);
  };

  const handleComplete = (item) => {
    moveItem(item.id, 'IN_PROGRESS', 'COMPLETED');
    toastSuccess(`Body shop complete. Vehicle auto-moved to Water Wash Queue.`);
  };

  const QueueCard = ({ item, status, limitHours }) => {
    const overdue = isOverdue(item.stageEnteredAt, limitHours);
    
    return (
      <div className={`${styles.card} ${overdue ? styles.cardOverdue : ''}`}>
        <div className={styles.cardHeader}>
        <VehicleNumberPlate vehicleNumber={item.vehicleNumber} size="sm" />
          <span className={`${styles.priority} priority-${(item.priority || 'NORMAL').toLowerCase()}`}>
            {item.priority || 'NORMAL'}
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
          {status === 'IN_PROGRESS' && (
            <div className="d-flex align-center gap-2">
              <select 
                value={item.subStage || 'Tinkering'} 
                onChange={(e) => updateSubStage(item.id, e.target.value)}
                className="form-select text-xs py-1 px-2"
              >
                <option value="Tinkering">Tinkering</option>
                <option value="Painting">Painting</option>
                <option value="Polishing">Polishing</option>
                <option value="Final Check">Final Check</option>
              </select>
              <Button size="sm" variant="success" rightIcon={CheckCircle2} onClick={() => handleComplete(item)}>Complete</Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Body Shop Queue"
        subtitle="Manage body shop work and paint jobs"
        breadcrumbs={[{ label: 'Body Shop Queue' }]}
      />

      <div className={styles.summaryRow}>
        {COLS.map((col) => {
          const Icon = col.icon;
          return (
            <div key={col.key} className={`${styles.summaryCard} status-${col.key.toLowerCase().replace('_', '-')}`}>
              <Icon size={20} className={`text-${col.key.toLowerCase().replace('_', '-')}`} />
              <div>
                <p className={styles.summaryLabel}>{col.label}</p>
                <p className={styles.summaryCount}>{queue[col.key]?.length || 0}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${styles.board} grid-3-cols`}>
        {COLS.map((col) => {
          const Icon = col.icon;
          const items = queue[col.key] || [];
          return (
            <div key={col.key} className={styles.column}>
              <div className={`${styles.columnHeader} border-${col.key.toLowerCase().replace('_', '-')}`}>
                <div className={`${styles.columnTitle} text-${col.key.toLowerCase().replace('_', '-')}`}><Icon size={16} />{col.label}</div>
                <span className={`${styles.columnCount} bg-${col.key.toLowerCase().replace('_', '-')}-20 text-${col.key.toLowerCase().replace('_', '-')}`}>{items.length}</span>
              </div>
              <div className={styles.columnBody}>
                {items.map((item) => <QueueCard key={item.id} item={item} status={col.key} limitHours={col.limitHours} />)}
                {items.length === 0 && <div className={styles.emptyCol}>No items in {col.label.toLowerCase()}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
}
