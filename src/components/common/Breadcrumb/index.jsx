import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

// eslint-disable-next-line react/prop-types
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link to="/" className={styles.homeLink}>
            <Home size={13} />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <ChevronRight size={13} className={styles.separator} />
            {item.path && i < items.length - 1 ? (
              <Link to={item.path} className={styles.link}>{item.label}</Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
