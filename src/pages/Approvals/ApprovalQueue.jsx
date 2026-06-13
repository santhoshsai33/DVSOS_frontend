import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { useApprovals } from '../../queries/useDataQueries';
import { useApproveRequest, useRejectRequest } from '../../mutations/useDataMutations';
import { approvalActionSchema } from '../../validations/approvalSchema';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/shared/PageHeader';
import RHFTextarea from '../../components/form/RHFTextarea';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import styles from './Approvals.module.css';

const TABS = [
  { key: 'PENDING', label: 'Pending', icon: Clock },
  { key: 'APPROVED', label: 'Approved', icon: CheckCircle2 },
  { key: 'REJECTED', label: 'Rejected', icon: XCircle },
];

export default function ApprovalQueue() {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject'

  const { data, isLoading } = useApprovals({ status: activeTab === 'ALL' ? undefined : activeTab });
  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  const methods = useForm({
    resolver: zodResolver(approvalActionSchema),
    defaultValues: { remarks: '' },
  });

  const openAction = (approval, type) => {
    setSelectedApproval(approval);
    setActionType(type);
    methods.reset();
  };

  const closeModal = () => {
    setSelectedApproval(null);
    setActionType(null);
  };

  const onAction = async (formData) => {
    if (!selectedApproval) return;
    try {
      if (actionType === 'approve') {
        await approveMutation.mutateAsync({ id: selectedApproval.id, data: formData });
      } else {
        await rejectMutation.mutateAsync({ id: selectedApproval.id, data: formData });
      }
      closeModal();
    } catch {
      // Error handled by mutation
    }
  };

  const filteredData = (data?.data || []).filter((item) => item.status === activeTab);

  const columns = [
    {
      header: 'Approval #',
      accessor: 'id',
      render: (row) => <span className={styles.approvalId}>#{row.id}</span>,
    },
    {
      header: 'Job Card',
      accessor: 'jobCardId',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.jobCardId}</span>,
    },
    {
      header: 'Vehicle',
      accessor: 'vehicleNumber',
      render: (row) => <code className={styles.vehicleNum}>{row.vehicleNumber}</code>,
    },
    { header: 'Customer', accessor: 'customerName' },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => <span style={{ fontSize: '0.8rem' }}>{row.type?.replace(/_/g, ' ')}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => <span style={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.description}</span>,
    },
    {
      header: 'Est. Cost',
      render: (row) => <strong>{formatCurrency(row.estimatedCost)}</strong>,
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Requested',
      render: (row) => formatDateTime(row.createdAt),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="d-flex gap-1">
          {row.status === 'PENDING' && (
            <>
              <Button size="sm" variant="success" leftIcon={CheckCircle2} onClick={(e) => { e.stopPropagation(); openAction(row, 'approve'); }}>
                Approve
              </Button>
              <Button size="sm" variant="danger" leftIcon={XCircle} onClick={(e) => { e.stopPropagation(); openAction(row, 'reject'); }}>
                Reject
              </Button>
            </>
          )}
          {row.status !== 'PENDING' && (
            <Button size="sm" variant="ghost" leftIcon={Eye}>View</Button>
          )}
        </div>
      ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const pendingCount = (data?.data || []).filter((d) => d.status === 'PENDING').length;

  return (
    <div>
      <PageHeader
        title="Customer Approvals"
        subtitle="Review and action approval requests from the workshop"
        breadcrumbs={[{ label: 'Approvals' }]}
      />

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={[styles.tab, activeTab === tab.key ? styles.tabActive : ''].join(' ')}
              onClick={() => handleTabChange(tab.key)}
            >
              <Icon size={15} />
              {tab.label}
              {tab.key === 'PENDING' && pendingCount > 0 && (
                <span className={styles.tabBadge}>{pendingCount}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="premium-card d-flex flex-column">
        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          emptyMessage={`No ${activeTab.toLowerCase()} approvals found`}
        />
      </div>

      {/* Approve/Reject Modal */}
      <Modal
        show={!!selectedApproval}
        onHide={closeModal}
        title={actionType === 'approve' ? '✅ Approve Request' : '❌ Reject Request'}
        confirmLabel={actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        confirmVariant={actionType === 'approve' ? 'success' : 'danger'}
        onConfirm={methods.handleSubmit(onAction)}
        isConfirming={approveMutation.isPending || rejectMutation.isPending}
      >
        {selectedApproval && (
          <div>
            <div className={styles.approvalDetail}>
              <div className={styles.approvalDetailRow}>
                <span>Vehicle:</span> <strong>{selectedApproval.vehicleNumber}</strong>
              </div>
              <div className={styles.approvalDetailRow}>
                <span>Description:</span> <span>{selectedApproval.description}</span>
              </div>
              <div className={styles.approvalDetailRow}>
                <span>Estimated Cost:</span> <strong>{formatCurrency(selectedApproval.estimatedCost)}</strong>
              </div>
            </div>
            <FormProvider {...methods}>
              <RHFTextarea
                name="remarks"
                label="Remarks *"
                placeholder={actionType === 'approve' ? 'Add approval remarks...' : 'Reason for rejection...'}
                rows={3}
                required
              />
            </FormProvider>
          </div>
        )}
      </Modal>
    </div>
  );
}
