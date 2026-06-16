import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { authSchema } from '../../validations/authSchema';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../config/routes';
import { toastSuccess, toastError } from '../../notifications/toast';
import styles from './Auth.module.css';

const DEMO_ACCOUNTS = [
  { label: 'Gate Security', email: 'gate@dvsos.com', role: ROLES.GATE_SECURITY },
  { label: 'CRM Team', email: 'crm@dvsos.com', role: ROLES.CRM_TEAM },
  { label: 'Floor Supervisor', email: 'floor@dvsos.com', role: ROLES.FLOOR_SUPERVISOR },
  { label: 'Body Shop', email: 'body@dvsos.com', role: ROLES.BODY_SHOP_SUPERVISOR },
  { label: 'Water Wash', email: 'wash@dvsos.com', role: ROLES.WATER_WASH_TEAM },
  { label: 'Manager', email: 'manager@dvsos.com', role: ROLES.MANAGER },
  { label: 'Managing Director', email: 'md@dvsos.com', role: ROLES.MD },
  { label: 'Super Admin', email: 'admin@dvsos.com', role: ROLES.SUPER_ADMIN },
];

const ROLE_EMAIL_MAP = {
  'gate@dvsos.com': ROLES.GATE_SECURITY,
  'crm@dvsos.com': ROLES.CRM_TEAM,
  'floor@dvsos.com': ROLES.FLOOR_SUPERVISOR,
  'body@dvsos.com': ROLES.BODY_SHOP_SUPERVISOR,
  'wash@dvsos.com': ROLES.WATER_WASH_TEAM,
  'manager@dvsos.com': ROLES.MANAGER,
  'md@dvsos.com': ROLES.MD,
  'admin@dvsos.com': ROLES.SUPER_ADMIN,
};

const ROLE_REDIRECTS = {
  [ROLES.GATE_SECURITY]: ROUTES.GATE_DASHBOARD,
  [ROLES.CRM_TEAM]: ROUTES.CRM_DASHBOARD,
  [ROLES.FLOOR_SUPERVISOR]: ROUTES.FLOOR_DASHBOARD,
  [ROLES.BODY_SHOP_SUPERVISOR]: ROUTES.BODY_SHOP_QUEUE,
  [ROLES.WATER_WASH_TEAM]: ROUTES.WATER_WASH_QUEUE,
  [ROLES.MANAGER]: ROUTES.MANAGER_DASHBOARD,
  [ROLES.MD]: ROUTES.MD_DASHBOARD,
  [ROLES.SUPER_ADMIN]: ROUTES.ADMIN_DASHBOARD,
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const methods = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '' },
  });

  const { setValue } = methods;

  const onSubmit = async (data) => {
    try {
      const role = ROLE_EMAIL_MAP[data.email.toLowerCase()] || ROLES.MANAGER;
      const mockToken = 'dvsos-mock-jwt-' + Date.now();
      const mockUser = {
        id: '1',
        name: data.email.split('@')[0].replace(/\b\w/g, (c) => c.toUpperCase()),
        email: data.email,
      };
      login(mockUser, role, mockToken);
      toastSuccess(`Welcome back, ${mockUser.name}!`);
      navigate(ROLE_REDIRECTS[role] || ROUTES.MANAGER_DASHBOARD);
    } catch {
      toastError('Login failed. Please check your credentials.');
    }
  };

  const handleDemoSelect = (e) => {
    const selectedEmail = e.target.value;
    if (selectedEmail) {
      setValue('email', selectedEmail);
      setValue('password', 'password123');
    } else {
      setValue('email', '');
      setValue('password', '');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.loginHeader}>
        <h2 className={styles.loginTitle}>Welcome Back</h2>
        <p className={styles.loginSubtitle}>Sign in to your account to continue</p>
      </div>

      {/* Demo Accounts Dropdown */}
      <div className={styles.demoSection}>
        <select className={styles.demoSelect} onChange={handleDemoSelect} defaultValue="">
          <option value="" disabled>Quick Demo Sign In...</option>
          {DEMO_ACCOUNTS.map((acc) => (
            <option key={acc.role} value={acc.email}>
              Log in as {acc.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.divider}>Or sign in with email</div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className={styles.formWrapper}>
          <RHFTextField
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            required
          />
          <RHFTextField
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
            required
          />
          <div className={styles.forgotRow}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={methods.formState.isSubmitting}
            rightIcon={ArrowRight}
            style={{ padding: '0.8rem', fontSize: '1rem', borderRadius: '8px' }}
          >
            Sign In
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
