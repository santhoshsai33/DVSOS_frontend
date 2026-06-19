import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../../components/shared/Sidebar';
import Topbar from '../../components/shared/Topbar';
import useUIStore from '../../store/useUIStore';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();
  const sidebarWidth = sidebarCollapsed ? 80 : 260;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.3s',
          height: '100vh',
        }}
      >
        <Topbar />
        <Box component="main" sx={{ flexGrow: 1, pb: { xs: 2, md: 3 }, pt: 8, overflowY: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
