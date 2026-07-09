import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { AlertCircle, CheckCircle2, Clock, FileText, Plus, SearchX, XCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/shared/PageHeader';
import { ROUTES } from '../../config/routes';
import { getAdditionalWorkRequestsApi } from '../../api/jobCardApi';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import styles from './AdditionalWorkList.module.css';
import { usePermissions } from '../../hooks/usePermissions';

const normalizePayload = (payload) => payload?.data || payload || {};

const getStatusCode = (request) => String(request?.statusCode || request?.status?.code || '').toUpperCase();

const getStatusLabel = (request) => {
  const statusCode = getStatusCode(request);
  if (statusCode === 'PENDING') return 'Pending Approval';
  if (statusCode === 'APPROVED') return 'Approved';
  if (statusCode === 'REJECTED') return 'Rejected';
  return request?.statusName || statusCode || 'Pending';
};

const getStatusClass = (request) => {
  const statusCode = getStatusCode(request);
  if (statusCode === 'APPROVED') return styles.approved;
  if (statusCode === 'REJECTED') return styles.rejected;
  return styles.pending;
};

const getStatusIcon = (request) => {
  const statusCode = getStatusCode(request);
  if (statusCode === 'APPROVED') return <CheckCircle2 size={24} color="#059669" />;
  if (statusCode === 'REJECTED') return <XCircle size={24} color="#DC2626" />;
  return <AlertCircle size={24} color="#D97706" />;
};

const getServiceNames = (request) => {
  const services = Array.isArray(request?.services) ? request.services : [];
  return services.map((service) => service.serviceName || service.name).filter(Boolean).join(', ');
};

export function AdditionalWorkRequestListScreen({
  title = 'Additional Work Requests',
  category = 'mechanical',
  createRoute = ROUTES.FLOOR_ADDITIONAL_WORK_NEW,
  permissionPath = '/additional-work'
}) {
  const navigate = useNavigate();
  const { canCreate } = usePermissions();
  const canCreateAdditionalWork = canCreate(permissionPath);
  const { data: payload, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['additional-work-requests', category],
    queryFn: () => getAdditionalWorkRequestsApi({ category }),
    staleTime: 20000
  });
  const data = normalizePayload(payload);
  const requests = useMemo(() => {
    return Array.isArray(data?.requests) ? data.requests : [];
  }, [data?.requests]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader
        title={title}
        breadcrumbs={[{ label: 'Additional Work' }]}
        // actions={canCreateAdditionalWork ? (
        //   <Button variant="primary" leftIcon={Plus} onClick={() => navigate(createRoute)}>
        //     New Request
        //   </Button>
        // ) : null}
      />

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h4 className={styles.title}>Recent Requests</h4>
            <p className={styles.subtitle}>One card represents one customer approval batch.</p>
          </div>
          <Button variant="secondary" size="sm" leftIcon={Clock} onClick={() => refetch()} disabled={isFetching}>
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <Loader text="Loading additional work requests..." />
        ) : isError ? (
          <div className={styles.emptyState}>
            <SearchX size={48} className={styles.emptyIcon} />
            <p>Unable to load additional work requests.</p>
          </div>
        ) : requests.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} className={styles.emptyIcon} />
            <p>No additional work requests found.</p>
          </div>
        ) : (
          <div className={styles.requestList}>
            {requests.map((request) => {
              const statusClass = getStatusClass(request);
              const serviceNames = getServiceNames(request);

              return (
                <div key={request.approvalId || request.id} className={styles.requestCard}>
                  <div className={styles.requestContent}>
                    <div className={`${styles.iconBox} ${statusClass}`}>
                      {getStatusIcon(request)}
                    </div>
                    <div className={styles.requestDetails}>
                      <h5 className={styles.vehicleTitle}>
                        {request.vehicleNumber || 'Vehicle'} <span className={styles.requestId}>#{request.approvalCode || request.approvalId}</span>
                      </h5>
                      <div className={styles.jobLine}>
                        <span>{request.jobCardNo || `Job Card ${request.jobCardId}`}</span>
                        {request.customerName && <span>{request.customerName}</span>}
                        {request.makeModel && <span>{request.makeModel}</span>}
                      </div>
                      <p className={styles.description}>{request.description || 'Additional work requested'}</p>
                      <div className={styles.serviceFlow}>
                        <span className={styles.parentService}>{request.linkedServiceLabel || 'Original service'}</span>
                        <span className={styles.arrow}>-&gt;</span>
                        <span className={styles.additionalServices}>{serviceNames || 'Additional work'}</span>
                      </div>
                      <div className={styles.meta}>
                        <span><strong>Requested:</strong> {formatDateTime(request.requestedAt)}</span>
                        <span><strong>Amount:</strong> {formatCurrency(request.totalAmount || 0)}</span>
                        {request.respondedAt && <span><strong>Responded:</strong> {formatDateTime(request.respondedAt)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className={styles.statusCell}>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      {getStatusLabel(request)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Box>
  );
}

export default function AdditionalWorkList() {
  return <AdditionalWorkRequestListScreen />;
}
