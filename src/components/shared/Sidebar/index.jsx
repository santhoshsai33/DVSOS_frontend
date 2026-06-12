import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Car, X } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';
import useUIStore from '../../../store/useUIStore';
import { SIDEBAR_MENUS } from '../../../constants/menus';
import { ROLE_LABELS } from '../../../constants/roles';
import { getInitials, avatarColor } from '../../../utils/helpers';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { role, user } = useAuthStore();
  const { sidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const [expandedGroups, setExpandedGroups] = useState({});

  const menus = SIDEBAR_MENUS[role] || SIDEBAR_MENUS['MANAGER'] || [];

  const isActive = (path) => {
    if (!path) return false;
    const cleanPath = path.split('?')[0];
    if (cleanPath === '/dashboard' && pathname === '/dashboard') return true;
    if (cleanPath !== '/dashboard') return pathname.startsWith(cleanPath);
    return false;
  };

  const isGroupActive = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.path));
  };

  const toggleGroup = (label) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const initColor = avatarColor(user?.name);
  const initials = getInitials(user?.name || role || 'U');

  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const groupActive = isGroupActive(item);
    const isExpanded = expandedGroups[item.label] !== undefined
      ? expandedGroups[item.label]
      : groupActive;
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <li key={item.label} className={styles.menuGroup}>
          <button
            className={[
              styles.groupToggle,
              groupActive ? styles.groupActive : '',
              sidebarCollapsed ? styles.collapsed : '',
            ].join(' ')}
            onClick={() => toggleGroup(item.label)}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className={styles.itemInner}>
              {Icon && <Icon size={18} className={styles.menuIcon} />}
              {!sidebarCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
            </span>
            {!sidebarCollapsed && (
              isExpanded
                ? <ChevronDown size={14} className={styles.chevron} />
                : <ChevronRight size={14} className={styles.chevron} />
            )}
          </button>
          {isExpanded && !sidebarCollapsed && (
            <ul className={styles.subMenu}>
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    }

    const active = isActive(item.path);
    const ItemIcon = item.icon;

    return (
      <li key={item.path || item.label}>
        <Link
          to={item.path || '#'}
          className={[
            styles.menuItem,
            active ? styles.active : '',
            depth > 0 ? styles.subItem : '',
            sidebarCollapsed ? styles.collapsed : '',
          ].join(' ')}
          onClick={() => setSidebarMobileOpen(false)}
          title={sidebarCollapsed ? item.label : undefined}
        >
          {ItemIcon && <ItemIcon size={depth > 0 ? 15 : 18} className={styles.menuIcon} />}
          {!sidebarCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
          {active && !sidebarCollapsed && <span className={styles.activePip} />}
        </Link>
      </li>
    );
  };

  const sidebarContent = (
    <aside
      className={[
        styles.sidebar,
        sidebarCollapsed ? styles.collapsed : '',
      ].join(' ')}
    >
      {/* Logo & Brand */}
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <Car size={20} />
        </div>
        {!sidebarCollapsed && (
          <div className={styles.brandText}>
            <span className={styles.brandName}>DVSOS</span>
            <span className={styles.brandTagline}>Service Platform</span>
          </div>
        )}
      </div>

      {/* User Profile */}
      {/* <div className={[styles.profile, sidebarCollapsed ? styles.profileCollapsed : ''].join(' ')}>
        <div
          className={styles.avatar}
          style={{ background: initColor }}
        >
          {initials}
        </div>
        {!sidebarCollapsed && (
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{user?.name || 'User'}</span>
            <span className={styles.profileRole}>{ROLE_LABELS[role] || role}</span>
          </div>
        )}
      </div> */}

      <div className={styles.divider} />

      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {menus.map((item) => renderMenuItem(item))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        {!sidebarCollapsed && (
          <p className={styles.footerText}>© 2024 DVSOS</p>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={styles.desktopWrapper}>{sidebarContent}</div>

      {/* Mobile Overlay */}
      {sidebarMobileOpen && (
        <div className={styles.overlay} onClick={() => setSidebarMobileOpen(false)}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSidebarMobileOpen(false)}>
              <X size={20} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
