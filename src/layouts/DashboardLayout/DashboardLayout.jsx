import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import useUIStore from '../../store/useUIStore';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className={[styles.layout, sidebarCollapsed ? styles.collapsed : ''].join(' ')}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
