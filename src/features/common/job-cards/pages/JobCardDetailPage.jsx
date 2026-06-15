import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { ArrowLeft, Car, User, Shield, FileText, AlertTriangle, PlusCircle } from 'lucide-react';
import { useJobCard } from '../../../../queries/useDataQueries';
import StatusBadge from '../../../../components/common/StatusBadge';
import Loader from '../../../../components/common/Loader';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import { formatDateTime, formatCurrency } from '../../../../utils/formatters';
import { ROUTES } from '../../../../config/routes';

export default function JobCardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: jobCard, isLoading } = useJobCard(id);

  if (isLoading) {
    return <Loader fullPage text="Loading job card details..." />;
  }

  if (!jobCard) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
        <AlertTriangle size={48} style={{ color: 'var(--color-danger)', marginBottom: '16px' }} />
        <h4 style={{ fontWeight: 700, fontSize: '20px', color: '#152326' }}>Job Card Not Found</h4>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          The job card with ID "{id}" could not be located in our records.
        </p>
        <Button variant="primary" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.JOB_CARDS)}>
          Back to List
        </Button>
      </div>
    );
  }

  // Calculate dummy invoice summary values
  const defaultServices = jobCard.services || [];
  const taxRate = 18; // Default mock tax
  const subtotal = jobCard.estimatedCost / (1 + taxRate / 100);

  const additionalServices = jobCard.additionalServices || [
    { name: 'Wheel Alignment & Balancing', price: 1200, status: 'APPROVED', date: jobCard.createdAt },
    { name: 'Rear Bumper Touch-up', price: 2500, status: 'PENDING', date: jobCard.createdAt }
  ];

  const approvedAdditionalTotal = additionalServices
    .filter(s => s.status === 'APPROVED')
    .reduce((sum, s) => sum + s.price, 0);

  const totalSubtotal = subtotal + approvedAdditionalTotal;
  const totalTaxAmount = totalSubtotal * (taxRate / 100);
  const totalGrandTotal = totalSubtotal + totalTaxAmount;

  return (
    <div style={{ minHeight: '100%', padding: '24px 30px' }}>
      {/* Page Header */}
      <PageHeader
        title={`Job Card: #${jobCard.id}`}
        subtitle={`Created on ${formatDateTime(jobCard.createdAt)}`}
        breadcrumbs={[{ label: 'Job Cards', path: ROUTES.JOB_CARDS }, { label: 'View Details' }]}
        actions={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" leftIcon={ArrowLeft} onClick={() => navigate(ROUTES.JOB_CARDS)}>
              Back
            </Button>
          </div>
        }
      />

      <Row className="g-4">
        {/* Left Column: Information details */}
        <Col lg={8}>
          {/* Main Info Blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Customer & Vehicle Info */}
            <Card style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <Card.Header style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', padding: '16px 20px' }}>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#152326', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={18} style={{ color: 'var(--color-primary)' }} />
                  Vehicle & Owner Details
                </h5>
              </Card.Header>
              <Card.Body style={{ padding: '24px' }}>
                <Row className="g-3">
                  <Col md={6}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Owner Name</div>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#152326', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={15} style={{ color: 'var(--color-text-secondary)' }} />
                      {jobCard.ownerName}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Mobile Number</div>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#152326' }}>
                      {jobCard.ownerMobile || jobCard.mobile || '—'}
                    </div>
                  </Col>
                  <Col md={6} style={{ borderTop: '1px solid var(--color-divider)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Registration Number</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-primary)' }}>
                      {jobCard.vehicleNumber}
                    </div>
                  </Col>
                  <Col md={6} style={{ borderTop: '1px solid var(--color-divider)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Service Category</div>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#152326' }}>
                      {jobCard.serviceType?.replace('_', ' ') || '—'}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Selected Work Items */}
            <Card style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <Card.Header style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', padding: '16px 20px' }}>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#152326', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                  Selected Services
                </h5>
              </Card.Header>
              <Card.Body style={{ padding: '0px' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(18, 52, 59, 0.02)', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'left', color: 'var(--color-text-secondary)' }}>Service Description</th>
                        <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'right', color: 'var(--color-text-secondary)', width: '120px' }}>Quantity</th>
                        <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'right', color: 'var(--color-text-secondary)', width: '150px' }}>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {defaultServices.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ padding: '24px', textAlign: 'center', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                            No service items registered.
                          </td>
                        </tr>
                      ) : (
                        defaultServices.map((serviceName, index) => (
                          <tr key={index} style={{ borderBottom: index < defaultServices.length - 1 ? '1px solid var(--color-divider)' : 'none' }}>
                            <td style={{ padding: '14px 20px', fontWeight: 500, color: '#152326' }}>{serviceName}</td>
                            <td style={{ padding: '14px 20px', textAlign: 'right', color: 'var(--color-text-secondary)' }}>x1</td>
                            <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: '#152326' }}>
                              {formatCurrency(index === 0 ? subtotal * 0.6 : subtotal * 0.4 / (defaultServices.length - 1 || 1))}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>

            {/* Additional Work & Services */}
            <Card style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <Card.Header style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', padding: '16px 20px' }}>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#152326', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={18} style={{ color: 'var(--color-primary)' }} />
                  Additional Work & Services
                </h5>
              </Card.Header>
              <Card.Body style={{ padding: '0px' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(18, 52, 59, 0.02)', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'left', color: 'var(--color-text-secondary)' }}>Service Description</th>
                        <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'center', color: 'var(--color-text-secondary)', width: '120px' }}>Status</th>
                        <th style={{ padding: '12px 20px', fontWeight: 600, textAlign: 'right', color: 'var(--color-text-secondary)', width: '150px' }}>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalServices.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ padding: '24px', textAlign: 'center', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                            No additional services registered.
                          </td>
                        </tr>
                      ) : (
                        additionalServices.map((service, index) => (
                          <tr key={index} style={{ borderBottom: index < additionalServices.length - 1 ? '1px solid var(--color-divider)' : 'none' }}>
                            <td style={{ padding: '14px 20px', fontWeight: 500, color: '#152326' }}>{service.name}</td>
                            <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                              <StatusBadge status={service.status} />
                            </td>
                            <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600, color: '#152326' }}>
                              {formatCurrency(service.price)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>

            {/* Complaints / Notes */}
            <Card style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <Card.Header style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', padding: '16px 20px' }}>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#152326', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} style={{ color: 'var(--color-primary)' }} />
                  Additional Notes & Complaints
                </h5>
              </Card.Header>
              <Card.Body style={{ padding: '20px' }}>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0, fontStyle: jobCard.notes ? 'normal' : 'italic' }}>
                  {jobCard.notes || 'No notes or special instructions provided by the customer.'}
                </p>
              </Card.Body>
            </Card>

          </div>
        </Col>

        {/* Right Column: Invoice stats */}
        <Col lg={4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '80px' }}>

            {/* Status & Estimate Overview */}
            <Card style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <Card.Header style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#152326' }}>Estimate Summary</h5>
                <StatusBadge status={jobCard.status} />
              </Card.Header>
              <Card.Body style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    <span>Base Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {approvedAdditionalTotal > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                      <span>Additional Work (Approved)</span>
                      <span>{formatCurrency(approvedAdditionalTotal)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    <span>Tax (18%)</span>
                    <span>{formatCurrency(totalTaxAmount)}</span>
                  </div>
                  <div style={{ borderTop: '1px dashed var(--color-border)', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: 'var(--color-accent)' }}>
                    <span>Grand Total</span>
                    <span>{formatCurrency(totalGrandTotal)}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

          </div>
        </Col>
      </Row>
    </div>
  );
}
