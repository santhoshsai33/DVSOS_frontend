import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Car, Menu } from 'lucide-react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Box, Typography, Divider, IconButton, useTheme, useMediaQuery } from '@mui/material';
import useAuthStore from '../../../store/useAuthStore';
import useUIStore from '../../../store/useUIStore';
import { SIDEBAR_MENUS } from '../../../constants/menus';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { pathname } = useLocation();
  const { role } = useAuthStore();
  const { sidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const [expandedGroups, setExpandedGroups] = useState({});

  const designationName = roleToDesignationMap[role];
  const savedPrivileges = JSON.parse(localStorage.getItem('dvsos_role_privileges') || '{}');
  const rolePrivs = savedPrivileges[designationName];

  const hasReadPermission = (label) => {
    if (role === 'SUPER_ADMIN') return true;
    if (!rolePrivs) return true;
    const idx = PERMISSION_ROWS.findIndex(row => row.subModule === label);
    if (idx === -1) return true;
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

  const sidebarWidth = sidebarCollapsed && !isMobile ? 80 : 260;

  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const groupActive = isGroupActive(item);
    const isExpanded = expandedGroups[item.label] !== undefined ? expandedGroups[item.label] : groupActive;
    const Icon = item.icon;
    const active = isActive(item.path);
    const isCollapsedState = sidebarCollapsed && !isMobile;

    if (hasChildren) {
      return (
        <Box key={item.label}>
          <ListItemButton
            onClick={() => toggleGroup(item.label)}
            sx={{
              borderRadius: 0,
              mb: 0.5,
              mx: 1,
              bgcolor: groupActive ? 'primary.main' : 'transparent',
              color: groupActive ? 'primary.contrastText' : 'inherit',
              '&:hover': {
                bgcolor: groupActive ? 'primary.main' : 'action.hover',
              },
              justifyContent: isCollapsedState ? 'center' : 'flex-start',
            }}
          >
            {Icon && (
              <ListItemIcon sx={{ minWidth: isCollapsedState ? 0 : 40, color: 'inherit' }}>
                <Icon size={20} />
              </ListItemIcon>
            )}
            {!isCollapsedState && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: groupActive ? 600 : 500 }} />}
            {!isCollapsedState && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </ListItemButton>
          <Collapse in={isExpanded && !isCollapsedState} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem key={item.path || item.label} disablePadding sx={{ display: 'block', mb: 0.5, px: 1 }}>
        <ListItemButton
          component={Link}
          to={item.path || '#'}
          onClick={() => isMobile && setSidebarMobileOpen(false)}
          sx={{
            borderRadius: 0,
            pl: isCollapsedState ? 'auto' : (depth > 0 ? 4 : 2),
            justifyContent: isCollapsedState ? 'center' : 'flex-start',
            bgcolor: active
              ? (depth > 0 ? 'rgba(26, 67, 77, 0.08)' : 'primary.main')
              : 'transparent',
            color: active
              ? (depth > 0 ? 'primary.main' : 'primary.contrastText')
              : 'inherit',
            '&:hover': {
              bgcolor: active
                ? (depth > 0 ? 'rgba(26, 67, 77, 0.12)' : 'primary.dark')
                : 'action.hover',
            },
          }}
        >
          {Icon && (
            <ListItemIcon sx={{ minWidth: isCollapsedState ? 0 : 40, color: 'inherit' }}>
              <Icon size={depth > 0 ? 16 : 20} />
            </ListItemIcon>
          )}
          {!isCollapsedState && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: depth > 0 ? '0.875rem' : '0.95rem', fontWeight: active ? 600 : 500 }} />}
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' }}>
      {/* Brand */}
      <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: sidebarCollapsed && !isMobile ? 0 : 3, justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start' }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 0, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: sidebarCollapsed && !isMobile ? 0 : 1.5 }}>
          <Car size={18} />
        </Box>
        {(!sidebarCollapsed || isMobile) && (
          <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}>
            DVSOS
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Nav */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <List>
          {menus.map((item) => renderMenuItem(item))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { lg: sidebarWidth }, flexShrink: { lg: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={sidebarMobileOpen}
        onClose={() => setSidebarMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sidebarWidth, height: '100vh', transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }) },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
