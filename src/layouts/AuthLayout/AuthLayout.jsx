import { Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Car, Activity, ShieldCheck, PieChart, Layers } from 'lucide-react';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <Container fluid className="p-0 vh-100">
      <Row className="g-0 h-100">
        {/* Left Panel — Branding (50% Split) */}
        <Col md={6} className={styles.brandPanel}>
          <div className={styles.brandContent}>
            <div className={styles.logoMark}>
              <Car size={36} color="white" />
            </div>
            <h1 className={styles.brandTitle}>DVSOS</h1>
            <p className={styles.brandSubtitle}>Digital Vehicle Service Operations System</p>

            <div className={styles.features}>
              {[
                { icon: <Activity size={20} />, text: 'Real-time Operations Tracking' },
                { icon: <Layers size={20} />, text: 'Digital Job Card Management' },
                { icon: <ShieldCheck size={20} />, text: 'Streamlined Approvals' },
                { icon: <PieChart size={20} />, text: 'Advanced Analytics' },
              ].map((f, i) => (
                <div key={i} className={styles.featureItem}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <span className={styles.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.brandFooter}>
            <p>Engineered for high-performance service centers.</p>
          </div>
        </Col>

        {/* Right Panel — Auth Form (50% Split) */}
        <Col md={6} className={styles.formPanel}>
          <div className={styles.formCard}>
            <Outlet />
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} DVSOS. All rights reserved.</p>
        </Col>
      </Row>
    </Container>
  );
}
