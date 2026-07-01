import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Box, Typography, Stack, IconButton, InputAdornment } from '@mui/material';
import useAuthStore from '../../store/useAuthStore';
import { authSchema } from '../../validations/authSchema';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import { ROLES, mapSlugToRole } from '../../constants/roles';
import { ROUTES } from '../../config/routes';
import { toastSuccess, toastError } from '../../notifications/toast';
import { loginApi } from '../../api/authApi';



const ROLE_EMAIL_MAP = {
  // 'gate@dvsos.com': ROLES.GATE_SECURITY,
  // 'crm@dvsos.com': ROLES.CRM_TEAM,
  'floor@dvsos.com': ROLES.FLOOR_SUPERVISOR,
  'body@dvsos.com': ROLES.BODY_SHOP_SUPERVISOR,
  'wash@dvsos.com': ROLES.WATER_WASH_TEAM,
  'manager@dvsos.com': ROLES.MANAGER,
  'md@dvsos.com': ROLES.MD,
  'admin@dvsos.com': ROLES.SUPER_ADMIN,
};

const ROLE_REDIRECTS = {
  // [ROLES.GATE_SECURITY]: ROUTES.GATE_DASHBOARD,
  // [ROLES.CRM_TEAM]: ROUTES.CRM_DASHBOARD,
  [ROLES.FLOOR_SUPERVISOR]: ROUTES.FLOOR_DASHBOARD,
  [ROLES.BODY_SHOP_SUPERVISOR]: ROUTES.BODY_SHOP_QUEUE,
  [ROLES.WATER_WASH_TEAM]: ROUTES.WATER_WASH_DASHBOARD,
  [ROLES.MANAGER]: ROUTES.MANAGER_DASHBOARD,
  [ROLES.MD]: ROUTES.MD_DASHBOARD,
  [ROLES.SUPER_ADMIN]: ROUTES.ADMIN_DASHBOARD,
};

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROLE_REDIRECTS[role]);
    }
  }, [isAuthenticated, role, navigate]);

  const methods = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  const { setValue } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        emailId: data.email,
        password: data.password
      };
      const response = await loginApi(payload);

      if (response?.success) {
        const { token, user, redirectPath } = response.data;
        const role = mapSlugToRole(user?.role?.slug);

        if (role === ROLES.GATE_SECURITY || role === ROLES.CRM_TEAM) {
          toastError('Web access denied. Please use the mobile application.');
          return;
        }

        login(user, role, token);
        // toastSuccess(response.message || `Welcome back, ${user.fullName || 'User'}!`);
        navigate(ROLE_REDIRECTS[role] || redirectPath || ROUTES.MANAGER_DASHBOARD);
      } else {
        toastError(response?.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'Login failed. Please check your credentials.';
      toastError(errorMessage);
    }
  };


  return (
    <Box>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          DVSOS
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your account to continue
        </Typography>
      </Box>


      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <RHFTextField name="email" label="Email Address" placeholder="Enter your email" type="email" required />
            <RHFTextField
              name="password"
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end"> <IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} edge="end" onClick={() => setShowPassword((current) => !current)} onMouseDown={(event) => event.preventDefault()} >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <Typography component={Link} to="/forgot-password" variant="body2" sx={{ color: 'primary.main', fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, }} >
                Forgot password?
              </Typography>
            </Box>

            <Button type="submit" variant="primary" fullWidth isLoading={methods.formState.isSubmitting} rightIcon={ArrowRight} size="lg" >
              Sign In
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
}
