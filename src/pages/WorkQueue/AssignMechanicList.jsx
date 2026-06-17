import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Printer, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/shared/PageHeader';
import { toastSuccess, toastInfo } from '../../notifications/toast';
import { formatDateTime } from '../../utils/formatters';
import styles from './WorkQueue.module.css';
import { ROUTES } from '../../config/routes';

const PENDING_JOBS = [
  { id: 'Q1', vehicleNumber: 'TN 01 AB 1234', ownerName: 'Ramesh Kumar', makeModel: 'Hyundai i20', serviceType: 'General Service', priority: 'HIGH', waitTime: '1 hr 20 min', deliveryDate: new Date(Date.now() + 2 * 3600000).toISOString(), requiredServices: ['Water Wash'] },
  { id: 'Q2', vehicleNumber: 'KA 05 XY 9876', ownerName: 'Priya Singh', makeModel: 'Maruti Swift', serviceType: 'Oil Change', priority: 'NORMAL', waitTime: '45 min', deliveryDate: new Date(Date.now() + 4 * 3600000).toISOString(), requiredServices: [] },
  { id: 'Q3', vehicleNumber: 'AP 16 ZZ 7700', ownerName: 'Kiran Reddy', makeModel: 'Tata Nexon', serviceType: 'Brake Service', priority: 'URGENT', waitTime: '10 min', deliveryDate: new Date(Date.now() + 1 * 3600000).toISOString(), requiredServices: ['Body Shop'] },
];

const MECHANICS = ['Rajan M.', 'Vikram S.', 'Anand P.', 'Suresh K.'];
const PRIORITY_COLORS = { LOW: '#10B981', NORMAL: '#3B82F6', HIGH: '#F59E0B', URGENT: '#EF4444' };

export default function AssignMechanicList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(PENDING_JOBS);
  const [assignModal, setAssignModal] = useState({ isOpen: false, item: null });
  const [selectedMechanic, setSelectedMechanic] = useState('');

  const handleAssignClick = (item) => {
    setAssignModal({ isOpen: true, item });
    setSelectedMechanic('');
  };

  const handleConfirmAssign = () => {
    if (!selectedMechanic) {
      toastInfo('Please select a mechanic');
      return;
    }

    setJobs(jobs.filter(j => j.id !== assignModal.item.id));
    setAssignModal({ isOpen: false, item: null });

    toastSuccess(`Assigned to ${selectedMechanic}. Job Card sent to printer!`);

    setTimeout(() => {
      toastInfo('Job Card printed successfully. Please attach it to the vehicle.');
    }, 1500);
  };

  return (
    <div>
      <PageHeader
        title="Assign Mechanic"
        subtitle="Allocate mechanics to pending job cards"
        breadcrumbs={[{ label: 'Assign Mechanic' }]}
      />

      <div className="surface-card mt-3">
        <h4 className="heading-md mb-3">Pending Allocation</h4>
        
        {jobs.length === 0 ? (
          <div className="p-4 text-center text-muted">
            <User size={48} className="icon-faded mb-4" />
            <p>No jobs pending allocation.</p>
          </div>
        ) : (
          <div className="grid-auto-fill">
            {jobs.map(item => (
              <div key={item.id} className={`${styles.card} m-0 border shadow-sm`}>
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
                
                <div className={`${styles.deliveryAlert} my-2`}>
                  <AlertTriangle size={12} /> Expected: {formatDateTime(item.deliveryDate)}
                </div>
                
                <div className={styles.serviceTag}>{item.serviceType}</div>
                
                <div className={`${styles.cardFooter} mt-4`}>
                  <span className={styles.waitTime}>
                    <Clock size={11} /> Waited: {item.waitTime}
                  </span>
                  <Button size="sm" variant="primary" rightIcon={ArrowRight} onClick={() => handleAssignClick(item)}>
                    Assign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        show={assignModal.isOpen}
        onHide={() => setAssignModal({ isOpen: false, item: null })}
        title="Assign Mechanic & Print Card"
        confirmLabel="Assign & Print"
        onConfirm={handleConfirmAssign}
        confirmIcon={Printer}
      >
        {assignModal.item && (
          <div className="d-flex flex-column gap-3">
            <div className={`${styles.card} m-0 border-0 shadow-none pb-4`}>
              <p><strong>Job Card:</strong> #{assignModal.item.id}</p>
              <p><strong>Vehicle:</strong> {assignModal.item.vehicleNumber} ({assignModal.item.makeModel})</p>
              <p><strong>Service:</strong> {assignModal.item.serviceType}</p>
              <p><strong>Expected Delivery:</strong> {formatDateTime(assignModal.item.deliveryDate)}</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Select Mechanic
              </label>
              <select
                className="form-control"
                value={selectedMechanic}
                onChange={(e) => setSelectedMechanic(e.target.value)}
              >
                <option value="">-- Choose Mechanic --</option>
                {MECHANICS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            
            <div className="help-text mt-2">
              <Printer size={12} /> Assigning will automatically print a hard copy of the job card.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
