import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertCircle,
  Bell,
  Building,
  Car,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Database,
  Droplets,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  Monitor,
  Package,
  Paintbrush,
  Plus,
  Settings,
  ShieldCheck,
  Truck,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Box, Typography, Divider, IconButton, useTheme, useMediaQuery } from '@mui/material';
import useAuthStore from '../../../store/useAuthStore';
import useUIStore from '../../../store/useUIStore';
import { buildSidebarMenus } from '../../../utils/authAccess';

const ICON_MAP = {
  AlertCircle,
  Bell,
  Building,
  Car,
  CheckSquare,
  ClipboardList,
  Clock,
  Database,
  Droplets,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  Monitor,
  Package,
  Paintbrush,
  Plus,
  Settings,
  ShieldCheck,
  Truck,
  User,
  Users,
  Wrench,
};

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isDesktopFlyout = useMediaQuery('(min-width: 1201px)');
  const { pathname } = useLocation();
  const { menus: allowedMenus } = useAuthStore();
  const { sidebarCollapsed, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const [expandedGroups, setExpandedGroups] = useState({});
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [flyoutTopOffset, setFlyoutTopOffset] = useState(0);
  const [flyoutHeight, setFlyoutHeight] = useState(375);

  const menus = buildSidebarMenus(allowedMenus, ICON_MAP);

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

  // Reset expanded groups when pathname changes to auto-close inactive dropdowns
  useEffect(() => {
    setExpandedGroups({});
  }, [pathname]);

  const toggleGroup = (label) => {
    setExpandedGroups((prev) => {
      const isCurrentlyExpanded = prev[label] !== undefined ? prev[label] : isGroupActive({ children: menus.find(m => m.label === label)?.children || [] });
      return {
        // Close all others, toggle the clicked one
        [label]: !isCurrentlyExpanded
      };
    });
  };

  const sidebarWidth = sidebarCollapsed && !isMobile ? 80 : 260;

  const renderMenuItem = (item, depth = 0, forceExpanded = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const groupActive = isGroupActive(item);
    const isExpanded = expandedGroups[item.label] !== undefined ? expandedGroups[item.label] : groupActive;
    const Icon = item.icon;
    const active = isActive(item.path);
    const isCollapsedState = !forceExpanded && sidebarCollapsed && !isMobile;

    if (hasChildren) {
      const isHovered = hoveredGroup === item.label;
      return (
        <Box
          key={item.label}
          onMouseEnter={(e) => {
            if (isDesktopFlyout) {
              setHoveredGroup(item.label);
              const rect = e.currentTarget.getBoundingClientRect();
              const viewportHeight = window.innerHeight;
              const itemHeight = 40;
              const padding = 16;
              const calculatedHeight = Math.max(375, Math.min(viewportHeight - 80, (item.children.length * itemHeight) + padding));
              setFlyoutHeight(calculatedHeight);
              let desiredViewportTop = rect.top;
              if (desiredViewportTop + calculatedHeight > viewportHeight - 40) {
                desiredViewportTop = viewportHeight - 40 - calculatedHeight;
              }
              if (desiredViewportTop < 40) {
                desiredViewportTop = 40;
              }
              setFlyoutTopOffset(desiredViewportTop - rect.top);
            }
          }}
          onMouseLeave={() => isDesktopFlyout && setHoveredGroup(null)}
          sx={{
            position: 'relative',
          }}
        >
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
            {!isCollapsedState && (
              isDesktopFlyout ? (
                <Box
                  sx={{
                    display: 'inline-flex',
                    transform: (isHovered || isExpanded) ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease-in-out',
                  }}
                >
                  <ChevronRight size={16} />
                </Box>
              ) : (
                isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              )
            )}
          </ListItemButton>

          {/* Mobile/Tablet view: collapse dropdown */}
          {!isDesktopFlyout ? (
            <Collapse in={isExpanded && !isCollapsedState} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child) => renderMenuItem(child, depth + 1))}
              </List>
            </Collapse>
          ) : (
            /* Desktop view: right-side hover flyout */
            <Box
              sx={{
                position: 'absolute',
                left: '100%',
                top: flyoutTopOffset,
                zIndex: theme.zIndex.drawer + 1,
                minWidth: 220,
                height: flyoutHeight,
                maxHeight: 'calc(100vh - 80px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollBehavior: 'smooth',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderRadius: '4px',
                py: 1,
                opacity: isHovered ? 1 : 0,
                visibility: isHovered ? 'visible' : 'hidden',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0px)',
                transition: 'opacity 250ms ease-in-out, transform 250ms ease-in-out, visibility 250ms ease-in-out, top 250ms ease-in-out',
                pointerEvents: isHovered ? 'auto' : 'none',
              }}
            >
              <List component="div" disablePadding>
                {item.children.map((child) => renderMenuItem(child, depth + 1, true))}
              </List>
            </Box>
          )}
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
            pl: isCollapsedState ? 'auto' : (isDesktopFlyout && depth > 0 ? 2 : (depth > 0 ? 4 : 2)),
            justifyContent: isCollapsedState ? 'center' : 'flex-start',
            bgcolor: active
              ? (depth > 0 ? 'rgba(26, 67, 77, 0.08)' : 'primary.main')
              : 'transparent',
            color: active
              ? (depth > 0 ? 'primary.main' : 'primary.contrastText')
              : 'inherit',
            '&:hover': {
              bgcolor: active
                ? (depth > 0 ? 'rgba(26, 67, 77, 0.08)' : 'primary.main')
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider', overflow: { xs: 'auto', lg: 'visible' } }}>
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
      <Box sx={{ flexGrow: 1, overflowY: { xs: 'auto', lg: 'visible' }, py: 2 }}>
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
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarWidth,
            height: '100vh',
            transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
            overflow: 'visible'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
