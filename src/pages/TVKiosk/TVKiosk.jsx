import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, IconButton, Chip } from '@mui/material';
import { Fullscreen, FullscreenExit, DirectionsCar, Build, InvertColors, CheckCircle, DirectionsCarFilled } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTvKioskDashboard } from '../../queries/useDashboardQueries';
import { useSocket, SOCKET_EVENTS } from '../../hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';

const formatWaitTime = (minutes) => {
  if (!minutes) return 'Just now';
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hrs`;
};

const ColumnHeader = ({ title, icon: Icon, count, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: `2px solid ${color}` }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Icon sx={{ color }} />
      <Typography variant="subtitle1" fontWeight="bold" color={color} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
        {title}
      </Typography>
    </Box>
    <Chip label={count} size="small" sx={{ bgcolor: color, color: 'white', fontWeight: 'bold' }} />
  </Box>
);

const JobCard = ({ job, color, isReady }) => (
  <Paper
    elevation={1}
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 2,
      borderLeft: `6px solid ${color}`,
      bgcolor: isReady ? '#e8f5e9' : 'white',
      border: isReady ? `2px solid ${color}` : undefined,
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
        {job.vehicleNumber}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '40%', textAlign: 'right', lineHeight: 1.2 }}>
        {job.vehicleInfo}
      </Typography>
    </Box>
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2" color="text.secondary">
          {job.id}
        </Typography>
        <Typography variant="body2" fontWeight="bold" color="text.primary">
          {job.customerName}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight="bold" color={color} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {isReady ? 'Ready' : formatWaitTime(job.waitMinutes)}
      </Typography>
    </Box>
  </Paper>
);

const TVKiosk = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: rawJobs, refetch } = useTvKioskDashboard();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const jobs = Array.isArray(rawJobs?.data || rawJobs) ? (rawJobs?.data || rawJobs || []) : [];

  const { socket } = useSocket({
    jobCardStatusChanged: (data) => {
      console.log('Live update received:', data);
      refetch(); // Instantly fetch fresh data when socket pings
    }
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const columns = [
    { id: 'MECHANICAL', title: 'Mechanical', icon: Build, color: '#3B82F6' },
    { id: 'BODY_SHOP', title: 'Body Shop', icon: DirectionsCarFilled, color: '#F59E0B' },
    { id: 'WATER_WASH', title: 'Water Wash', icon: InvertColors, color: '#06B6D4' },
    { id: 'READY_FOR_DELIVERY', title: 'Ready For Delivery', icon: CheckCircle, color: '#10B981' }
  ];

  const getJobsForColumn = (colId) => jobs.filter(j => j.column === colId);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F3F4F6', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ bgcolor: '#3B82F6', p: 1, borderRadius: 2, display: 'flex' }}>
            <DirectionsCar sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="900" color="#1E3A8A">DVSOS Live Status</Typography>
            <Typography variant="caption" fontWeight="bold" color="#60A5FA" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
              Vehicle Service Operations Center
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="#111827">
              {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </Typography>
          </Box>
          <IconButton onClick={toggleFullscreen} sx={{ bgcolor: '#F3F4F6' }}>
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#FEE2E2', color: '#EF4444', borderRadius: 2, px: 2, gap: 1 }}>
            <Typography variant="button" fontWeight="bold">Exit</Typography>
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 4, flex: 1, overflow: 'hidden' }}>
        <Grid container spacing={4} sx={{ height: '100%' }}>
          {columns.map(col => {
            const colJobs = getJobsForColumn(col.id);
            return (
              <Grid item xs={12} sm={6} md={3} key={col.id} sx={{ height: '100%' }}>
                <Paper sx={{ height: '100%', p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
                  <ColumnHeader title={col.title} icon={col.icon} count={colJobs.length} color={col.color} />
                  <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 3 } }}>
                    {colJobs.map(job => (
                      <JobCard key={job.rawId} job={job} color={col.color} isReady={col.id === 'READY_FOR_DELIVERY'} />
                    ))}
                    {colJobs.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                        No vehicles in this stage
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default TVKiosk;
