import { Outlet } from 'react-router-dom';
import { Box, Typography, Stack, useTheme } from '@mui/material';
import { Car, Activity, ShieldCheck, PieChart, Layers } from 'lucide-react';

export default function AuthLayout() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Left Panel — Branding */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          p: 8,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)`,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
              mb: 4,
            }}
          >
            <Car size={28} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
            DVSOS
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 6, fontSize: '1.1rem' }}>
            Digital Vehicle Service Operations System. Engineered for high-performance service centers and workshops.
          </Typography>

          <Stack spacing={3}>
            {[
              { icon: <Activity size={18} />, text: 'Real-time Operations Tracking' },
              { icon: <Layers size={18} />, text: 'Digital Job Card Management' },
              { icon: <ShieldCheck size={18} />, text: 'Streamlined Approvals' },
              { icon: <PieChart size={18} />, text: 'Advanced Analytics' },
            ].map((f, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </Box>
                <Typography sx={{ fontSize: '0.95rem', color: '#e2e8f0', fontWeight: 500 }}>
                  {f.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Right Panel — Auth Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f1f5f9',
          p: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 440,
            bgcolor: 'background.paper',
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            boxShadow: theme.shadows[3],
            border: '1px solid #e2e8f0',
          }}
        >
          <Outlet />
        </Box>
        <Typography sx={{ mt: 4, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
          © {new Date().getFullYear()} DVSOS. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
