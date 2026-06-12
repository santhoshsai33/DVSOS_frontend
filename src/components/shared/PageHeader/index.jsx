import Breadcrumb from '../../common/Breadcrumb';
import styles from './PageHeader.module.css';

// eslint-disable-next-line react/prop-types
export default function PageHeader({ title, subtitle, breadcrumbs = [], actions }) {
  return (
    <div className={styles.header}>
      {breadcrumbs.length > 0 && (
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
      <div className={styles.row}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}
