import { useState } from 'react';
import { Clock, Wrench, CheckCircle2, User, ArrowRight, Printer, AlertTriangle, Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { Box } from '@mui/material';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/shared/PageHeader';
import { toastSuccess, toastInfo } from '../../notifications/toast';
import { formatDateTime } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import styles from './WorkQueue.module.css';

// Mock queue data with deliveryDate and subsequent stages
const INITIAL_QUEUE = {
  PENDING: [
    { id: 'Q1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', makeModel: 'Hyundai i20', serviceType: 'General Service', priority: 'HIGH', waitTime: '1 hr 20 min', deliveryDate: new Date(Date.now() + 2 * 3600000).toISOString(), requiredServices: ['Water Wash'] },
    { id: 'Q2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', makeModel: 'Maruti Swift', serviceType: 'Oil Change', priority: 'NORMAL', waitTime: '45 min', deliveryDate: new Date(Date.now() + 4 * 3600000).toISOString(), requiredServices: [] },
    { id: 'Q3', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', makeModel: 'Tata Nexon', serviceType: 'Brake Service', priority: 'URGENT', waitTime: '10 min', deliveryDate: new Date(Date.now() + 1 * 3600000).toISOString(), requiredServices: ['Body Shop'] },
  ],
  ASSIGNED: [
    { id: 'Q4', vehicleNumber: 'MH 12 PQ 4567', ownerName: 'Arun Patel', makeModel: 'Honda City', serviceType: 'Engine Repair', priority: 'HIGH', technician: 'Rajan M.', waitTime: '2 hrs', deliveryDate: new Date(Date.now() + 5 * 3600000).toISOString(), requiredServices: [] },
  ],
  IN_PROGRESS: [
    { id: 'Q5', vehicleNumber: 'DL 04 RS 3344', ownerName: 'Suresh Nair', makeModel: 'Toyota Fortuner', serviceType: 'Engine Repair', priority: 'URGENT', technician: 'Anand P.', waitTime: '4 hrs 10 min', deliveryDate: new Date(Date.now() + 0.5 * 3600000).toISOString(), requiredServices: ['Water Wash'] },
    { id: 'Q6', vehicleNumber: 'TN 09 LM 8899', ownerName: 'Deepa Menon', makeModel: 'Mahindra XUV500', serviceType: 'Full Inspection', priority: 'NORMAL', technician: 'Vikram S.', waitTime: '1 hr 5 min', deliveryDate: new Date(Date.now() + 24 * 3600000).toISOString(), requiredServices: [] },
  ],
  COMPLETED: [
    { id: 'Q7', vehicleNumber: 'TN 02 CD 5566', ownerName: 'Vinoth Kumar', makeModel: 'Hyundai Creta', serviceType: 'Oil Change', priority: 'NORMAL', technician: 'Rajan M.', waitTime: 'Done in 1.5 hrs', deliveryDate: new Date(Date.now() - 2 * 3600000).toISOString(), requiredServices: [] },
  ],
};

const COLS = [
  { key: 'PENDING', label: 'Pending', icon: Clock, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
  { key: 'ASSIGNED', label: 'Assigned', icon: User, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Wrench, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
];

const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

export default function MechanicalQueue() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  
  // Sort function: URGENT first, then closest delivery time
  const sortJobs = (jobs) => {
    const priorityWeight = { URGENT: 4, HIGH: 3, NORMAL: 2, LOW: 1 };
    return [...jobs].sort((a, b) => {
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return new Date(a.deliveryDate) - new Date(b.deliveryDate);
    });
  };

  const moveItem = (itemId, fromCol, toCol, updates = {}) => {
    setQueue(prev => {
      const itemToMove = prev[fromCol].find(i => i.id === itemId);
      if (!itemToMove) return prev;
      
      const updatedItem = { ...itemToMove, ...updates };
      const newFrom = prev[fromCol].filter(i => i.id !== itemId);
      const newTo = sortJobs([...prev[toCol], updatedItem]);
      
      return { ...prev, [fromCol]: newFrom, [toCol]: newTo };
    });
  };

  const handleStart = (item) => {
    moveItem(item.id, 'ASSIGNED', 'IN_PROGRESS');
    toastSuccess(`Work started for ${item.vehicleNumber}`);
  };

  const handleComplete = (item) => {
    moveItem(item.id, 'IN_PROGRESS', 'COMPLETED');
    
    // Check if handoff is needed
    if (item.requiredServices?.includes('Water Wash')) {
      toastSuccess(`Mechanical complete. Vehicle auto-moved to Water Wash Queue.`);
    } else if (item.requiredServices?.includes('Body Shop')) {
      toastSuccess(`Mechanical complete. Vehicle auto-moved to Body Shop Queue.`);
    } else {
      toastSuccess(`Work completed for ${item.vehicleNumber}. Ready for delivery check.`);
    }
  };

  const QueueCard = ({ item, status }) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <VehicleNumberPlate vehicleNumber={item.vehicleNumber} size="sm" />
        <span
          className={`${styles.priority} priority-${(item.priority || 'NORMAL').toLowerCase()}`}
        >
          {item.priority || 'NORMAL'}
        </span>
      </div>
      <p className={styles.ownerName}>{item.ownerName}</p>
      <p className={styles.makeModel}>{item.makeModel}</p>
      
      {status === 'PENDING' && (
        <div className={styles.deliveryAlert}>
          <AlertTriangle size={12} /> Expected: {formatDateTime(item.deliveryDate)}
        </div>
      )}
      
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
          <div className="text-muted text-sm">Awaiting Assignment</div>
        )}
        {status === 'ASSIGNED' && (
          <Button size="sm" variant="primary" rightIcon={ArrowRight} onClick={() => handleStart(item)}>
            Start
          </Button>
        )}
        {status === 'IN_PROGRESS' && (
          <div className="d-flex gap-2">
            <Button size="sm" variant="outline" leftIcon={Plus}
              onClick={() => navigate(ROUTES.FLOOR_ADDITIONAL_WORK)}
              className="border-warning text-warning text-xs"
            >
              Add Work
            </Button>
            <Button size="sm" variant="success" rightIcon={CheckCircle2} onClick={() => handleComplete(item)}>
              Complete
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
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
            <div key={col.key} className={`${styles.summaryCard} status-${col.key.toLowerCase().replace('_', '-')}`}>
              <Icon size={20} className={`text-${col.key.toLowerCase().replace('_', '-')}`} />
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
          // Ensure sorted representation
          const items = col.key === 'PENDING' ? sortJobs(queue[col.key]) : queue[col.key] || [];
          
          return (
            <div key={col.key} className={styles.column}>
              <div className={`${styles.columnHeader} border-${col.key.toLowerCase().replace('_', '-')}`}>
                <div className={`${styles.columnTitle} text-${col.key.toLowerCase().replace('_', '-')}`}>
                  <Icon size={16} />
                  {col.label}
                </div>
                <span className={`${styles.columnCount} bg-${col.key.toLowerCase().replace('_', '-')}-20 text-${col.key.toLowerCase().replace('_', '-')}`}>
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
    </Box>
  );
}
