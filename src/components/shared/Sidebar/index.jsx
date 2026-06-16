import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Car, X } from 'lucide-react';
import useAuthStore from '../../../store/useAuthStore';
import useUIStore from '../../../store/useUIStore';
import { SIDEBAR_MENUS } from '../../../constants/menus';
import { ROLE_LABELS } from '../../../constants/roles';
import { getInitials, avatarColor } from '../../../utils/helpers';
import styles from './Sidebar.module.css';

const PERMISSION_ROWS = [
  { module: 'Administration', subModule: 'Admin Dashboard' },
  { module: 'Administration', subModule: 'User Management' },
  { module: 'Administration', subModule: 'Role Management' },
  { module: 'Administration', subModule: 'Service Items' },
  { module: 'Administration', subModule: 'System Settings' },
  { module: 'Administration', subModule: 'Audit Logs' },
  { module: 'Gate Operations', subModule: 'Gate Dashboard' },
  { module: 'Gate Operations', subModule: 'Vehicle Entry' },
  { module: 'CRM Operations', subModule: 'CRM Dashboard' },
  { module: 'CRM Operations', subModule: 'Pending Approvals' },
  { module: 'CRM Operations', subModule: 'Delivery Ready' },
  { module: 'Floor Workshop', subModule: 'Floor Dashboard' },
  { module: 'Floor Workshop', subModule: 'Assign Mechanic' },
  { module: 'Floor Workshop', subModule: 'Additional Work' },
  { module: 'Body Shop', subModule: 'Body Shop Queue' },
  { module: 'Water Wash', subModule: 'Water Wash Queue' },
  { module: 'Manager Operations', subModule: 'Manager Dashboard' },
  { module: 'Manager Operations', subModule: 'Operations Overview' },
  { module: 'Manager Operations', subModule: 'Delayed Jobs' },
  { module: 'Manager Operations', subModule: 'Reports' },
  { module: 'MD Analytics', subModule: 'MD Dashboard' },
  { module: 'MD Analytics', subModule: 'Executive Overview' },
  { module: 'MD Analytics', subModule: 'Performance Report' },
  { module: 'MD Analytics', subModule: 'Service KPI' },
  { module: 'Common Pages', subModule: 'Customers' },
  { module: 'Common Pages', subModule: 'Vehicles' },
  { module: 'Common Pages', subModule: 'Job Cards' },
  { module: 'Common Pages', subModule: 'Notifications' }
];

const roleToDesignationMap = {
  SUPER_ADMIN: 'Super Admin',
  MANAGER: 'General Manager',
  FLOOR_SUPERVISOR: 'Floor Supervisor',
  GATE_SECURITY: 'Gate Security Executive',
  CRM_TEAM: 'CRM Officer',
  BODY_SHOP_SUPERVISOR: 'Body Shop Lead',
  WATER_WASH_TEAM: 'Water Wash Lead',
  MD: 'Managing Director'
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const { role, user } = useAuthStore();
  const { sidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const [expandedGroups, setExpandedGroups] = useState({});

  const designationName = roleToDesignationMap[role];
  const savedPrivileges = JSON.parse(localStorage.getItem('dvsos_role_privileges') || '{}');
  const rolePrivs = savedPrivileges[designationName];

  // Helper to check if a submodule has read permission
  const hasReadPermission = (label) => {
    if (role === 'SUPER_ADMIN') return true; // Always show all menus for Admin
    if (!rolePrivs) return true; // If no privileges configured yet, default to showing
    const idx = PERMISSION_ROWS.findIndex(row => row.subModule === label);
    if (idx === -1) return true; // Default show if not in list
    return !!rolePrivs[idx]?.read;
  };

  const filterMenu = (items) => {
    return items
      .map(item => {
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterMenu(item.children);
          if (filteredChildren.length === 0) return null;
          return { ...item, children: filteredChildren };
        }
        return hasReadPermission(item.label) ? item : null;
      })
      .filter(Boolean);
  };

  const menus = filterMenu(SIDEBAR_MENUS[role] || SIDEBAR_MENUS['MANAGER'] || []);

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
          <p className={styles.footerText}>2026 DVSOS</p>
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
