import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, User, Settings as SettingsIcon, Menu as MenuIcon, PanelLeftClose, PanelLeft } from 'lucide-react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge, Avatar, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import useAuthStore from '../../../store/useAuthStore';
import useUIStore from '../../../store/useUIStore';
import { ROLE_LABELS } from '../../../constants/roles';
import { ROUTES } from '../../../config/routes';
import { getInitials, avatarColor } from '../../../utils/helpers';

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
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const pageTitle = location.pathname
    .split('/')
    .filter(Boolean)
    .map((s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(' / ') || 'Dashboard';

  return (
    <AppBar position="fixed" color="default" elevation={0} sx={{
      width: { lg: `calc(100% - ${sidebarCollapsed ? 80 : 260}px)` },
      ml: { lg: `${sidebarCollapsed ? 80 : 260}px` },
      borderBottom: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      transition: 'width 0.3s, margin-left 0.3s',
      zIndex: (theme) => theme.zIndex.drawer - 1
    }}>
      <Toolbar>
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setSidebarMobileOpen(true)}
          sx={{ mr: 2, display: { lg: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { xs: 'none', lg: 'flex' } }}
        >
          {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600, fontSize: '1.1rem' }}>
          {pageTitle}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={(e) => setNotifAnchorEl(e.currentTarget)}>
            <Badge badgeContent={unread} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={() => setNotifAnchorEl(null)}
            PaperProps={{ sx: { width: 320, mt: 1.5, borderRadius: 2 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={markAllRead}>
                Mark all read
              </Typography>
            </Box>
            <Divider />
            {notifications.map((n) => (
              <MenuItem key={n.id} sx={{ py: 1.5, px: 2, alignItems: 'flex-start', bgcolor: n.read ? 'transparent' : 'action.hover' }}>
                {!n.read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.8, mr: 1.5 }} />}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 500, color: 'text.primary', mb: 0.5, whiteSpace: 'normal' }}>
                    {n.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {n.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>

          <Box
            onClick={(e) => setUserAnchorEl(e.currentTarget)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              ml: 1,
              p: 0.5,
              pr: 1.5,
              borderRadius: 8,
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <Avatar sx={{ bgcolor: avatarColor(user?.name), width: 32, height: 32, fontSize: '0.875rem', mr: 1 }}>
              {getInitials(user?.name || 'U')}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {ROLE_LABELS[role] || role}
              </Typography>
            </Box>
            <ChevronDown size={14} style={{ marginLeft: 8, color: '#64748b' }} />
          </Box>

          <Menu
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={() => setUserAnchorEl(null)}
            PaperProps={{ sx: { width: 200, mt: 1.5, borderRadius: 2 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { navigate(ROUTES.PROFILE); setUserAnchorEl(null); }}>
              <ListItemIcon><User size={18} /></ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>

            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon sx={{ color: 'inherit' }}><LogOut size={18} /></ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
