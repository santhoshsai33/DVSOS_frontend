import { Outlet } from 'react-router-dom';
import { Car } from 'lucide-react';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.container}>
      {/* Left Panel — Branding */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.logoMark}>
            <Car size={40} />
          </div>
          <h1 className={styles.brandTitle}>DVSOS</h1>
          <p className={styles.brandSubtitle}>Digital Vehicle Service Operations System</p>

          <div className={styles.features}>
            {[
              { icon: '🚗', text: 'Real-time Vehicle Tracking' },
              { icon: '📋', text: 'Digital Job Card Management' },
              { icon: '✅', text: 'Streamlined Approval Workflows' },
              { icon: '📊', text: 'Advanced Analytics & Reports' },
              { icon: '🔄', text: 'Multi-Stage Service Queues' },
            ].map((f) => (
              <div key={f.text} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.brandFooter}>
          <p>Trusted by leading automotive service centers</p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <Outlet />
        </div>
        <p className={styles.copyright}>© 2024 DVSOS. All rights reserved.</p>
      </div>
    </div>
  );
}
