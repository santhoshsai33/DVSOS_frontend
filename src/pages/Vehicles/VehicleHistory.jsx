import { useParams } from 'react-router-dom';
import { FileText, Calendar, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import styles from './Vehicles.module.css';

const MOCK_HISTORY = [
  {
    id: 'JC-1001',
    date: '2024-05-15',
    services: ['General Service', 'Oil Change'],
    cost: 4500,
    status: 'COMPLETED',
    approvals: ['Brake Pad Replacement approved via WhatsApp'],
  },
  {
    id: 'JC-0842',
    date: '2023-11-20',
    services: ['Body Repair', 'Paint Work'],
    cost: 12000,
    status: 'COMPLETED',
    approvals: [],
  }
];

export default function VehicleHistory() {
  const { id } = useParams();

  return (
    <div>
      <PageHeader
        title={`Service History`}
        subtitle={`Viewing history for vehicle ${id || 'TN 01 AB 1234'}`}
        breadcrumbs={[{ label: 'Vehicles', path: '/vehicles' }, { label: 'History' }]}
      />

      <div className="d-flex flex-column gap-4">
        {MOCK_HISTORY.map((job, index) => (
          <div key={index} className={styles.historyCard}>
            <div className={styles.historyHeader}>
              <div className="d-flex align-items-center gap-3">
                <FileText size={20} className="text-primary" />
                <span className={styles.jobId}>{job.id}</span>
              </div>
              <StatusBadge status={job.status} />
            </div>
            
            <div className={styles.historyBody}>
              <div className={styles.historyRow}>
                <span className={styles.historyLabel}><Calendar size={14} /> Date</span>
                <span>{job.date}</span>
              </div>
              <div className={styles.historyRow}>
                <span className={styles.historyLabel}><FileText size={14} /> Services</span>
                <span>{job.services.join(', ')}</span>
              </div>
              <div className={styles.historyRow}>
                <span className={styles.historyLabel}>Cost</span>
                <span className={styles.historyCost}>₹{job.cost}</span>
              </div>
              {job.approvals.length > 0 && (
                <div className={styles.historyApprovals}>
                  <strong><CheckCircle size={14} className="text-success me-1" /> Approvals:</strong>
                  <ul>
                    {job.approvals.map((app, i) => <li key={i}>{app}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.historyFooter}>
              <Button size="sm" variant="outline">View Full Job Card</Button>
              <Button size="sm" variant="outline">View Photos</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
