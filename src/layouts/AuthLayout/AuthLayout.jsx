import { Outlet } from 'react-router-dom';
import { Car, Activity, ShieldCheck, PieChart, Layers } from 'lucide-react';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.layoutWrapper}>
      {/* Left Panel — Branding */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.logoIconWrapper}>
            <Car size={28} />
          </div>
          <h1 className={styles.brandTitle}>DVSOS</h1>
          <p className={styles.brandSubtitle}>
            Digital Vehicle Service Operations System. Engineered for high-performance service centers and workshops.
          </p>

          <div className={styles.featureList}>
            {[
              { icon: <Activity size={18} />, text: 'Real-time Operations Tracking' },
              { icon: <Layers size={18} />, text: 'Digital Job Card Management' },
              { icon: <ShieldCheck size={18} />, text: 'Streamlined Approvals' },
              { icon: <PieChart size={18} />, text: 'Advanced Analytics' },
            ].map((f, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <Outlet />
        </div>
        <p className={styles.copyright}>© {new Date().getFullYear()} DVSOS. All rights reserved.</p>
      </div>
    </div>
  );
}
