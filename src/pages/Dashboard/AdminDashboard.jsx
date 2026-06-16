import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, Database, Settings, ShieldCheck, Activity,
  Plus, RefreshCw, TrendingUp, AlertTriangle, Edit, Trash2,
  Car, Wrench, Hammer, Droplets, Briefcase, Crown, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { ROUTES } from '../../config/routes';
import { ROLE_LABELS } from '../../constants/roles';
import styles from './Dashboard.module.css';

const MOCK_STATS = {
  totalUsers: 24,
  totalServices: 38,
  activeRoles: 7,
  auditLogsToday: 142,
};

const MOCK_ROLE_DIST = [
  { role: 'Gate Security', count: 3 },
  { role: 'CRM Team', count: 5 },
  { role: 'Floor Supervisor', count: 2 },
  { role: 'Body Shop Sup.', count: 2 },
  { role: 'Water Wash', count: 3 },
  { role: 'Manager', count: 4 },
  { role: 'MD', count: 1 },
];

const RECENT_ACTIVITY = [
  { id: 1, action: 'New User Created', user: 'Super Admin', detail: 'Rajan M. added as Floor Supervisor', time: '10 min ago', type: 'create' },
  { id: 2, action: 'Service Item Added', user: 'Super Admin', detail: 'Ceramic Coating – ₹4,500', time: '45 min ago', type: 'create' },
  { id: 3, action: 'Role Updated', user: 'Super Admin', detail: 'Water Wash team permissions modified', time: '2 hrs ago', type: 'update' },
  { id: 4, action: 'Company Settings Saved', user: 'Super Admin', detail: 'Tax rate updated to 18%', time: '3 hrs ago', type: 'update' },
  { id: 5, action: 'User Deactivated', user: 'Super Admin', detail: 'Priya S. – CRM Team', time: 'Yesterday', type: 'delete' },
];

const ACTION_COLORS = { create: '#10B981', update: '#3B82F6', delete: '#EF4444' };

const DEPARTMENT_PORTALS = [
  { label: 'Gate Security', icon: Car, path: ROUTES.GATE_DASHBOARD, color: '#10B981', desc: 'Vehicles Entry, Exit & Sync passes' },
  { label: 'CRM Operations', icon: Users, path: ROUTES.CRM_DASHBOARD, color: '#3B82F6', desc: 'Job cards, Estimates & WhatsApp approval' },
  { label: 'Floor Workshop', icon: Wrench, path: ROUTES.FLOOR_DASHBOARD, color: '#6366F1', desc: 'Mechanic allocations & floor work status' },
  { label: 'Body Shop', icon: Hammer, path: ROUTES.BODY_SHOP_DASHBOARD, color: '#EC4899', desc: 'Denting, painting & repair queues' },
  { label: 'Water Wash', icon: Droplets, path: ROUTES.WATER_WASH_DASHBOARD, color: '#06B6D4', desc: 'Wash queues & completion flows' },
  { label: 'Management', icon: Briefcase, path: ROUTES.MANAGER_DASHBOARD, color: '#F59E0B', desc: 'Approvals & general operational reports' },
  { label: 'MD Analytics', icon: Crown, path: ROUTES.MD_DASHBOARD, color: '#8B5CF6', desc: 'Revenue, performance & KPI metrics' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const kpis = [
    {
      label: 'Total Users',
      value: MOCK_STATS.totalUsers,
      icon: Users,
      gradient: 'var(--gradient-primary)',
      change: '+2 added this week',
      positive: true,
      action: () => navigate(ROUTES.ADMIN_USERS),
    },
    {
      label: 'Master Services',
      value: MOCK_STATS.totalServices,
      icon: Database,
      gradient: 'var(--gradient-success)',
      change: '+3 added this month',
      positive: true,
      action: () => navigate(ROUTES.ADMIN_SERVICE_ITEMS),
    },
    {
      label: 'Active Roles',
      value: MOCK_STATS.activeRoles,
      icon: ShieldCheck,
      gradient: 'var(--gradient-accent)',
      change: 'All roles configured',
      positive: true,
      action: () => navigate(ROUTES.ADMIN_ROLES),
    },
    {
      label: "Today's Audit Logs",
      value: MOCK_STATS.auditLogsToday,
      icon: Activity,
      gradient: 'var(--gradient-warning)',
      change: 'Last action 10 min ago',
      positive: true,
      action: () => navigate(ROUTES.ADMIN_AUDIT_LOGS),
    },
  ];

  const quickActions = [
    { label: 'Add New User', icon: Plus, path: ROUTES.ADMIN_USER_NEW, color: '#3B82F6' },
    { label: 'Manage Services', icon: Database, path: ROUTES.ADMIN_SERVICE_ITEMS, color: '#10B981' },
    { label: 'Role Permissions', icon: ShieldCheck, path: ROUTES.ADMIN_ROLES, color: '#8B5CF6' },
    { label: 'System Settings', icon: Settings, path: ROUTES.ADMIN_SETTINGS, color: '#F59E0B' },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="System Administration"
        subtitle="Manage users, roles, service catalog and system configuration"
        actions={
          <Button variant="secondary" size="sm" leftIcon={RefreshCw} isLoading={refreshing} onClick={handleRefresh}>
            Refresh
          </Button>
        }
      />

      {/* KPI Cards */}
      <Row className="g-4 mb-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Col xl={3} md={6} key={i}>
              <div className={styles.kpiCard} onClick={kpi.action} style={{ cursor: 'pointer' }}>
                <div className={styles.kpiContent}>
                  <div className={styles.kpiIconWrapper} style={{ background: kpi.gradient }}>
                    <Icon size={24} />
                  </div>
                  <div className={styles.kpiText}>
                    <p className={styles.kpiLabel}>{kpi.label}</p>
                    <h2 className={styles.kpiValue}>{kpi.value}</h2>
                    <span className={[styles.kpiChange, kpi.positive ? styles.positive : styles.negative].join(' ')}>
                      <TrendingUp size={11} /> {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={styles.kpiBg} style={{ background: kpi.gradient }} />
              </div>
            </Col>
          );
        })}
      </Row>

      <Row className="g-4 mb-4">
        {/* Role Distribution Chart */}
        <Col xl={7}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Users by Role</h5>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.ADMIN_USERS)}>
                View All
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MOCK_ROLE_DIST} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        {/* Quick Actions */}
        <Col xl={5}>
          <div className={styles.chartCard} style={{ height: '100%' }}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Quick Actions</h5>
            </div>
            <div className="d-flex flex-column gap-3 mt-2">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.label}
                    onClick={() => navigate(a.path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.875rem 1rem', borderRadius: '10px',
                      border: '1.5px solid var(--color-border)',
                      cursor: 'pointer', transition: 'all 0.18s',
                      background: 'var(--color-bg-card)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = a.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '8px', background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} style={{ color: a.color }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Activity */}
      <div className="premium-card">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fs-6 fw-bold">Recent Admin Activity</h5>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.ADMIN_AUDIT_LOGS)}>
            Full Audit Log
          </Button>
        </div>
        <div>
          {RECENT_ACTIVITY.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1.25rem',
                borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: ACTION_COLORS[item.type],
                boxShadow: `0 0 0 3px ${ACTION_COLORS[item.type]}25`,
              }} />
              <div className="flex-grow-1">
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.action}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.detail}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
