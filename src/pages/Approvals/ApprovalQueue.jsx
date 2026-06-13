import { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>
    );
  }

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
        <div className="table-responsive flex-grow-1">
          {isLoading ? (
            <div className="p-5 text-center text-muted">Loading data...</div>
          ) : filteredData.length === 0 ? (
            <div className="p-5 text-center text-muted">No {activeTab.toLowerCase()} approvals found</div>
          ) : (
            <Table striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Approval #</th>
                  <th>Job Card</th>
                  <th>Vehicle</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Est. Cost</th>
                  <th>Status</th>
                  <th>Requested</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle"><span className={styles.approvalId}>#{row.id}</span></td>
                    <td className="align-middle"><span style={{ fontWeight: 600 }}>{row.jobCardId}</span></td>
                    <td className="align-middle"><code className={styles.vehicleNum}>{row.vehicleNumber}</code></td>
                    <td className="align-middle">{row.customerName}</td>
                    <td className="align-middle"><span style={{ fontSize: '0.8rem' }}>{row.type?.replace(/_/g, ' ')}</span></td>
                    <td className="align-middle"><span style={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.description}</span></td>
                    <td className="align-middle"><strong>{formatCurrency(row.estimatedCost)}</strong></td>
                    <td className="align-middle"><StatusBadge status={row.status} /></td>
                    <td className="align-middle">{formatDateTime(row.createdAt)}</td>
                    <td className="align-middle">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center bg-light">
            <small className="text-muted">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </small>
            <Pagination className="mb-0" size="sm">
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {paginationItems}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
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
