import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AlertCircle, Plus, FileText, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { ROUTES } from '../../config/routes';
import { formatDateTime } from '../../utils/formatters';
import styles from '../WorkQueue/WorkQueue.module.css';

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
        subtitle="Manage and track extra work required for vehicles in service"
        breadcrumbs={[{ label: 'Additional Work' }]}
        action={
          <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.FLOOR_ADDITIONAL_WORK_NEW)}>
            New Request
          </Button>
        }
      />

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '1.5rem', marginTop: '1.5rem' }}>
        <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text)' }}>Recent Requests</h4>
        
        {MOCK_REQUESTS.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No additional work requests found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {MOCK_REQUESTS.map(req => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: req.status === 'APPROVED' ? '#10B98115' : '#F59E0B15', padding: '0.75rem', borderRadius: '8px' }}>
                    {req.status === 'APPROVED' ? <CheckCircle2 size={24} color="#10B981" /> : <AlertCircle size={24} color="#F59E0B" />}
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '1rem' }}>{req.vehicleNumber} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>#{req.id}</span></h5>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{req.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <span><strong>Requested:</strong> {formatDateTime(req.requestDate)}</span>
                      <span><strong>Est. Cost:</strong> ₹{req.estimatedCost}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '99px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: req.status === 'APPROVED' ? '#10B98115' : '#F59E0B15',
                    color: req.status === 'APPROVED' ? '#10B981' : '#F59E0B'
                  }}>
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
