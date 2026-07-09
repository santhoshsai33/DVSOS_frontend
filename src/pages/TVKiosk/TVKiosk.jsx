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
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: `2px solid ${color}`, gap: 0.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 0.6vw, 8px)', minWidth: 0 }}>
      <Icon sx={{ color, fontSize: 'clamp(1rem, 1.3vw, 1.5rem)' }} />
      <Typography fontWeight="bold" color={color} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 'clamp(0.7rem, 0.9vw, 1.1rem)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {title}
      </Typography>
    </Box>
    <Chip label={count} size="small" sx={{ bgcolor: color, color: 'white', fontWeight: 'bold', fontSize: 'clamp(0.65rem, 0.8vw, 0.85rem)', height: 'clamp(18px, 1.5vw, 24px)', minWidth: 'clamp(18px, 1.5vw, 24px)' }} />
  </Box>
);

const JobCard = ({ job, color, isReady }) => (
  <Paper
    elevation={1}
    sx={{
      p: 'clamp(8px, 1.2vw, 16px)',
      mb: 'clamp(8px, 1.2vw, 16px)',
      borderRadius: 2,
      borderLeft: `6px solid ${color}`,
      borderLeftWidth: 'clamp(4px, 0.5vw, 8px)',
      bgcolor: isReady ? '#e8f5e9' : 'white',
      border: isReady ? `2px solid ${color}` : undefined,
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(6px, 1vw, 12px)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
      <Typography fontWeight="bold" sx={{ letterSpacing: 0.5, fontSize: 'clamp(0.85rem, 1.1vw, 1.25rem)', whiteSpace: 'nowrap' }}>
        {job.vehicleNumber}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: '55%', textAlign: 'right', lineHeight: 1.2, fontSize: 'clamp(0.65rem, 0.8vw, 0.875rem)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {job.vehicleInfo}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography color="text.secondary" sx={{ fontSize: 'clamp(0.6rem, 0.75vw, 0.8rem)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {job.id}
        </Typography>
        <Typography fontWeight="bold" color="text.primary" sx={{ fontSize: 'clamp(0.65rem, 0.8vw, 0.875rem)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {job.customerName}
        </Typography>
      </Box>
      <Typography fontWeight="bold" color={color} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 'clamp(0.65rem, 0.8vw, 0.875rem)', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
    { id: 'READY_FOR_DELIVERY', title: 'Delivery', icon: CheckCircle, color: '#10B981' }
  ];

  const getJobsForColumn = (colId) => jobs.filter(j => j.column === colId);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F3F4F6', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', px: 'clamp(16px, 3vw, 32px)', py: 'clamp(8px, 1.5vw, 16px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 16px)' }}>
          <Box sx={{ bgcolor: '#3B82F6', p: 'clamp(4px, 0.8vw, 8px)', borderRadius: 2, display: 'flex' }}>
            <DirectionsCar sx={{ color: 'white', fontSize: 'clamp(1.2rem, 2vw, 2rem)' }} />
          </Box>
          <Box>
            <Typography fontWeight="900" color="#1E3A8A" sx={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', lineHeight: 1.2 }}>DVSOS Live Status</Typography>
            <Typography fontWeight="bold" color="#60A5FA" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', fontSize: 'clamp(0.55rem, 0.75vw, 0.75rem)' }}>
              Vehicle Service Operations Center
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 24px)' }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography color="text.secondary" fontWeight="bold" sx={{ fontSize: 'clamp(0.55rem, 0.75vw, 0.75rem)' }}>
              {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </Typography>
            <Typography fontWeight="bold" color="#111827" sx={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)', lineHeight: 1.2 }}>
              {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </Typography>
          </Box>
          <IconButton onClick={toggleFullscreen} sx={{ bgcolor: '#F3F4F6', p: 'clamp(4px, 0.8vw, 8px)' }}>
            {isFullscreen ? <FullscreenExit sx={{ fontSize: 'clamp(1rem, 1.5vw, 1.5rem)' }} /> : <Fullscreen sx={{ fontSize: 'clamp(1rem, 1.5vw, 1.5rem)' }} />}
          </IconButton>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#FEE2E2', color: '#EF4444', borderRadius: 2, px: 'clamp(8px, 1.5vw, 16px)', py: 'clamp(4px, 0.8vw, 8px)', gap: 0.5 }}>
            <Typography variant="button" fontWeight="bold" sx={{ fontSize: 'clamp(0.7rem, 0.9vw, 0.875rem)' }}>Exit</Typography>
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 'clamp(12px, 2.5vw, 32px)', flex: 1, overflow: 'hidden' }}>
        <Grid container spacing={'clamp(12px, 2.5vw, 32px)'} sx={{ height: '100%' }}>
          {columns.map(col => {
            const colJobs = getJobsForColumn(col.id);
            return (
              <Grid item xs={12} sm={6} md={3} key={col.id} sx={{ height: '100%' }}>
                <Paper sx={{ height: '100%', p: 'clamp(12px, 2vw, 24px)', borderRadius: 3, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
                  <ColumnHeader title={col.title} icon={col.icon} count={colJobs.length} color={col.color} />
                  <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 3 } }}>
                    {colJobs.map(job => (
                      <JobCard key={job.rawId} job={job} color={col.color} isReady={col.id === 'READY_FOR_DELIVERY'} />
                    ))}
                    {colJobs.length === 0 && (
                      <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4, fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)' }}>
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
