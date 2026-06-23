import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import loginPageImage from '../../assets/img/login-page-image.png';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { xs: 'center', md: 'flex-end' },
        minHeight: '100vh',
        bgcolor: '#EDECF2',
        backgroundImage: `url(${loginPageImage})`,
        backgroundSize: { xs: 'cover', lg: 'contain' },
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500,
            bgcolor: 'background.paper',
            borderRadius: '25px',
            p: { xs: 4, md: 6 },
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          }}
        >
          <Outlet />
          <Typography sx={{ mt: 4, color: '#2563eb', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} DVSOS. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
