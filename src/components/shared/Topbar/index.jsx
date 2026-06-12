import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User, Settings, Menu, PanelLeftClose, PanelLeft } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';
import useUIStore from '../../../store/useUIStore';
import { ROLE_LABELS } from '../../../constants/roles';
import { getInitials, avatarColor } from '../../../utils/helpers';
import styles from './Topbar.module.css';

const MOCK_NOTIFICATIONS = [
  { id: '1', text: 'New approval request from Rajan M.', time: '5 min ago', read: false },
  { id: '2', text: 'Vehicle TN 01 AB 1234 is ready for delivery', time: '12 min ago', read: false },
  { id: '3', text: 'Delayed vehicle alert: DL 04 RS 3344', time: '1 hr ago', read: true },
];

export default function Topbar() {
  const { user, role, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, setSidebarMobileOpen } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const pageTitle = location.pathname
    .split('/')
    .filter(Boolean)
    .map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' › ') || 'Dashboard';

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {/* Sidebar toggle — desktop */}
        <button
          className={[styles.iconBtn, styles.toggleBtn].join(' ')}
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>

        {/* Mobile hamburger */}
        <button
          className={[styles.iconBtn, styles.mobileMenuBtn].join(' ')}
          onClick={() => setSidebarMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

        <span className={styles.pageTitle}>{pageTitle}</span>
      </div>

      <div className={styles.right}>
        {/* Notifications */}
        <div className={styles.notifWrapper}>
          <button
            className={[styles.iconBtn, showNotif ? styles.active : ''].join(' ')}
            onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
          >
            <Bell size={20} />
            {unread > 0 && <span className={styles.badge}>{unread}</span>}
          </button>

          {showNotif && (
            <>
              <div className={styles.backdrop} onClick={() => setShowNotif(false)} />
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownTitle}>Notifications</span>
                  <button className={styles.markRead} onClick={markAllRead}>Mark all read</button>
                </div>
                <div className={styles.notifList}>
                  {notifications.map((n) => (
                    <div key={n.id} className={[styles.notifItem, !n.read ? styles.unread : ''].join(' ')}>
                      {!n.read && <span className={styles.notifDot} />}
                      <div className={styles.notifContent}>
                        <p className={styles.notifText}>{n.text}</p>
                        <span className={styles.notifTime}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className={styles.userWrapper}>
          <button
            className={[styles.userBtn, showUser ? styles.active : ''].join(' ')}
            onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
          >
            <div
              className={styles.userAvatar}
              style={{ background: avatarColor(user?.name) }}
            >
              {getInitials(user?.name || 'U')}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'User'}</span>
              <span className={styles.userRole}>{ROLE_LABELS[role] || role}</span>
            </div>
            <ChevronDown size={14} className={styles.userChevron} />
          </button>

          {showUser && (
            <>
              <div className={styles.backdrop} onClick={() => setShowUser(false)} />
              <div className={styles.userDropdown}>
                <button className={styles.userDropItem} onClick={() => { navigate('/settings'); setShowUser(false); }}>
                  <User size={15} /> Profile & Settings
                </button>
                <button className={styles.userDropItem} onClick={() => { navigate('/settings/password'); setShowUser(false); }}>
                  <Settings size={15} /> Change Password
                </button>
                <div className={styles.userDivider} />
                <button className={[styles.userDropItem, styles.logoutItem].join(' ')} onClick={handleLogout}>
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
