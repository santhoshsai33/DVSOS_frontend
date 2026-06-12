import { Layers, AlertTriangle, Play, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { Row, Col } from 'react-bootstrap';
import styles from '../Dashboard/Dashboard.module.css';

export default function OperationsDashboard() {
  return (
    <div className={styles.page}>
      <PageHeader
        title="Live Operations Monitoring"
        subtitle="Floor-wide real-time operations overview"
        breadcrumbs={[{ label: 'Operations Monitoring' }]}
      />

      <Row className="g-4 mb-4">
        <Col md={3}>
          <div className={styles.kpiCard} style={{ '--kpi-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', background: 'var(--kpi-gradient)' }}>
            <div className={styles.kpiContent}>
              <div className={styles.kpiText}>
                <p className={styles.kpiLabel} style={{ color: '#fff', opacity: 0.8 }}>Gate Pending</p>
                <h2 className={styles.kpiValue} style={{ color: '#fff' }}>12</h2>
              </div>
              <Layers size={32} style={{ color: '#fff', opacity: 0.5 }} />
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className={styles.kpiCard} style={{ '--kpi-gradient': 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', background: 'var(--kpi-gradient)' }}>
            <div className={styles.kpiContent}>
              <div className={styles.kpiText}>
                <p className={styles.kpiLabel} style={{ color: '#fff', opacity: 0.8 }}>In Mechanical</p>
                <h2 className={styles.kpiValue} style={{ color: '#fff' }}>8</h2>
              </div>
              <Play size={32} style={{ color: '#fff', opacity: 0.5 }} />
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className={styles.kpiCard} style={{ '--kpi-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)', background: 'var(--kpi-gradient)' }}>
            <div className={styles.kpiContent}>
              <div className={styles.kpiText}>
                <p className={styles.kpiLabel} style={{ color: '#fff', opacity: 0.8 }}>In Body Shop</p>
                <h2 className={styles.kpiValue} style={{ color: '#fff' }}>4</h2>
              </div>
              <Layers size={32} style={{ color: '#fff', opacity: 0.5 }} />
            </div>
          </div>
        </Col>
        <Col md={3}>
          <div className={styles.kpiCard} style={{ '--kpi-gradient': 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', background: 'var(--kpi-gradient)' }}>
            <div className={styles.kpiContent}>
              <div className={styles.kpiText}>
                <p className={styles.kpiLabel} style={{ color: '#fff', opacity: 0.8 }}>In Water Wash</p>
                <h2 className={styles.kpiValue} style={{ color: '#fff' }}>5</h2>
              </div>
              <Layers size={32} style={{ color: '#fff', opacity: 0.5 }} />
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <div className={styles.chartCard} style={{ minHeight: '300px' }}>
            <div className={styles.chartHeader}>
               <h5 className={styles.chartTitle}><AlertTriangle className="text-danger me-2" size={18} /> Delayed Vehicles</h5>
            </div>
            <div className="p-3 text-muted text-center mt-5">
              No vehicles are currently delayed past their SLA.
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className={styles.chartCard} style={{ minHeight: '300px' }}>
            <div className={styles.chartHeader}>
               <h5 className={styles.chartTitle}><CheckCircle className="text-success me-2" size={18} /> Recently Completed</h5>
            </div>
            <div className="p-3">
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <strong>TN 02 CD 5566</strong>
                <span className="text-muted small">10 mins ago</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <strong>KL 10 EE 4433</strong>
                <span className="text-muted small">35 mins ago</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
