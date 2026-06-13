import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Car, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { authSchema } from '../../validations/authSchema';
import RHFTextField from '../../components/form/RHFTextField';
import Button from '../../components/common/Button';
import { ROLES } from '../../constants/roles';
import { ROUTES } from '../../config/routes';
import { toastSuccess, toastError } from '../../notifications/toast';
import styles from './Auth.module.css';

const DEMO_ACCOUNTS = [
  { label: 'Gate Security', email: 'gate@dvsos.com', role: ROLES.GATE_SECURITY, color: '#10B981' },
  { label: 'CRM Team', email: 'crm@dvsos.com', role: ROLES.CRM_TEAM, color: '#3B82F6' },
  { label: 'Floor Supervisor', email: 'floor@dvsos.com', role: ROLES.FLOOR_SUPERVISOR, color: '#6366F1' },
  { label: 'Body Shop', email: 'body@dvsos.com', role: ROLES.BODY_SHOP_SUPERVISOR, color: '#EC4899' },
  { label: 'Water Wash', email: 'wash@dvsos.com', role: ROLES.WATER_WASH_TEAM, color: '#06B6D4' },
  { label: 'Manager', email: 'manager@dvsos.com', role: ROLES.MANAGER, color: '#F59E0B' },
  { label: 'MD', email: 'md@dvsos.com', role: ROLES.MD, color: '#8B5CF6' },
  { label: 'Super Admin', email: 'admin@dvsos.com', role: ROLES.SUPER_ADMIN, color: '#EF4444' },
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
  [ROLES.BODY_SHOP_SUPERVISOR]: ROUTES.BODY_SHOP_DASHBOARD,
  [ROLES.WATER_WASH_TEAM]: ROUTES.WATER_WASH_DASHBOARD,
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

  const fillDemo = (account) => {
    setValue('email', account.email);
    setValue('password', 'password123');
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.loginHeader}>
        <div className={styles.loginIcon}>
          <Car size={24} />
        </div>
        <div>
          <h2 className={styles.loginTitle}>Sign in to DVSOS</h2>
          <p className={styles.loginSubtitle}>Enter your credentials to access the platform</p>
        </div>
      </div>

      {/* Demo Accounts */}
      <div className={styles.demoSection}>
        <p className={styles.demoLabel}>Quick Demo Access</p>
        <div className={styles.demoGrid}>
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              className={styles.demoBtn}
              onClick={() => fillDemo(acc)}
              type="button"
              style={{ '--demo-color': acc.color }}
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider}><span>or sign in with credentials</span></div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
          >
            Sign In
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
