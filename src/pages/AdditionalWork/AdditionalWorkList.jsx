import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AlertCircle, Plus, FileText, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { ROUTES } from '../../config/routes';
import { formatDateTime } from '../../utils/formatters';
import styles from './AdditionalWorkList.module.css';

const MOCK_REQUESTS = [
  { id: 'AW-001', vehicleNumber: 'TN 01 AB 1234', requestDate: new Date(Date.now() - 3600000).toISOString(), description: 'Brake pads worn out, needs replacement', estimatedCost: '2,500', status: 'PENDING_APPROVAL' },
  { id: 'AW-002', vehicleNumber: 'KA 05 XY 9876', requestDate: new Date(Date.now() - 86400000).toISOString(), description: 'Engine oil leak detected', estimatedCost: '4,000', status: 'APPROVED' },
];

export default function AdditionalWorkList() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Additional Work Requests"
        breadcrumbs={[{ label: 'Additional Work' }]}
        action={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.FLOOR_ADDITIONAL_WORK_NEW)}>
            New Request
          </Button>
        }
      />

      <div className={styles.panel}>
        <h4 className={styles.title}>Recent Requests</h4>

        {MOCK_REQUESTS.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <p>No additional work requests found.</p>
          </div>
        ) : (
          <div className={styles.requestList}>
            {MOCK_REQUESTS.map(req => (
              <div key={req.id} className={styles.requestCard}>
                <div className={styles.requestContent}>
                  <div className={`${styles.iconBox} ${req.status === 'APPROVED' ? styles.approved : styles.pending}`}>
                    {req.status === 'APPROVED' ? <CheckCircle2 size={24} color="#10B981" /> : <AlertCircle size={24} color="#F59E0B" />}
                  </div>
                  <div className={styles.requestDetails}>
                    <h5 className={styles.vehicleTitle}>{req.vehicleNumber} <span className={styles.requestId}>#{req.id}</span></h5>
                    <p className={styles.description}>{req.description}</p>
                    <div className={styles.meta}>
                      <span><strong>Requested:</strong> {formatDateTime(req.requestDate)}</span>
                      <span><strong>Est. Cost:</strong> ₹{req.estimatedCost}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.statusCell}>
                  <span className={`${styles.statusBadge} ${req.status === 'APPROVED' ? styles.approved : styles.pending}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}
