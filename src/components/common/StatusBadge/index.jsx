import { STATUS_LABELS, STATUS_VARIANTS } from '../../../constants/statuses';
import styles from './StatusBadge.module.css';

// eslint-disable-next-line react/prop-types
export default function StatusBadge({ status, size = 'md' }) {
  const label = STATUS_LABELS[status] || status;
  const variant = STATUS_VARIANTS[status] || 'secondary';

  return (
    <span className={[styles.badge, styles[variant], styles[size]].join(' ')}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}
