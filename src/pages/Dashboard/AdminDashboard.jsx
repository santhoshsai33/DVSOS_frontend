import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie
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

const MOCK_STAGE_DIST = [
  { stage: 'Gate Entry', count: 1, color: '#3B82F6' },
  { stage: 'Job Card', count: 0, color: '#8B5CF6' },
  { stage: 'Approval', count: 1, color: '#F59E0B' },
  { stage: 'Mechanical', count: 1, color: '#EF4444' },
  { stage: 'Body Shop', count: 1, color: '#10B981' },
  { stage: 'Water Wash', count: 1, color: '#06B6D4' },
  { stage: 'Ready', count: 1, color: '#22C55E' },
];

const MOCK_VEHICLE_STATUS = [
  { registration: 'TN38AK4521', owner: 'Anand Krishnamurthy', stage: 'MECHANICAL', status: 'ON TRACK' },
  { registration: 'TN45BJ2233', owner: 'Priya Venkatesh', stage: 'APPROVAL', status: 'ON TRACK' },
  { registration: 'TN22CD8899', owner: 'Murugan Pillai', stage: 'BODY SHOP', status: 'DELAYED' },
  { registration: 'TN01EF5567', owner: 'Lakshmi Sundaram', stage: 'WATER WASH', status: 'ON TRACK' },
  { registration: 'TN57GH1122', owner: 'Vijay Annamalai', stage: 'GATE ENTRY', status: 'ON TRACK' },
  { registration: 'TN33PQ9900', owner: 'Sathish Mohan', stage: 'READY', status: 'ON TRACK' },
];

const STAGE_STYLES = {
  'GATE ENTRY': { color: '#7C3AED', bg: '#F3E8FF' },
  'JOB CARD': { color: '#9333EA', bg: '#F3E8FF' },
  'APPROVAL': { color: '#D97706', bg: '#FEF3C7' },
  'MECHANICAL': { color: '#EF4444', bg: '#FEE2E2' },
  'BODY SHOP': { color: '#0F766E', bg: '#CCFBF1' },
  'WATER WASH': { color: '#2563EB', bg: '#DBEAFE' },
  'READY': { color: '#059669', bg: '#D1FAE5' },
};

const STATUS_STYLES = {
  'ON TRACK': { color: '#059669', bg: '#D1FAE5' },
  'DELAYED': { color: '#EF4444', bg: '#FEE2E2' },
};

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
    <div className={styles.page} >
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

      {/* Stage Distribution Chart */}
      <div className="premium-card mb-4" style={{ borderRadius: '14px', border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', padding: '24px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold" style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>Stage Distribution</h5>
          <div className="d-flex align-items-center gap-3">
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#0284C7',
              backgroundColor: '#E0F2FE',
              padding: '4px 10px',
              borderRadius: '9999px',
              letterSpacing: '0.05em'
            }}>
              LIVE
            </span>
          </div>
        </div>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_STAGE_DIST} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="stage" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} ticks={[0, 0.25, 0.5, 0.75, 1]} domain={[0, 1]} />
              <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', fontSize: '13px' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28}>
                {MOCK_STAGE_DIST.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vehicle Status Summary */}
      <div
        className="premium-card mb-4"
        style={{
          borderRadius: '14px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h5
          className="mb-4 fw-bold"
          style={{
            fontSize: '18px',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.01em'
          }}
        >
          Vehicle Status Summary
        </h5>

        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0" style={{ color: 'var(--color-text-secondary)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', paddingBottom: '12px', textTransform: 'uppercase' }}>Registration</th>
                <th style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', paddingBottom: '12px', textTransform: 'uppercase' }}>Owner</th>
                <th style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', paddingBottom: '12px', textTransform: 'uppercase' }}>Stage</th>
                <th style={{ color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', paddingBottom: '12px', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VEHICLE_STATUS.map((item, index) => {
                const stageStyle = STAGE_STYLES[item.stage] || { color: 'var(--color-text-primary)', bg: 'var(--color-divider)' };
                const statusStyle = STATUS_STYLES[item.status] || { color: 'var(--color-text-primary)', bg: 'var(--color-divider)' };
                return (
                  <tr key={index} style={{ borderBottom: index < MOCK_VEHICLE_STATUS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <td style={{ color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '14px', padding: '16px 0' }}>{item.registration}</td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '14px', padding: '16px 0' }}>{item.owner}</td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{
                        color: stageStyle.color,
                        backgroundColor: stageStyle.bg,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        display: 'inline-block'
                      }}>
                        {item.stage}
                      </span>
                    </td>
                    <td style={{ padding: '16px 0' }}>
                      <span style={{
                        color: statusStyle.color,
                        backgroundColor: statusStyle.bg,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        display: 'inline-block'
                      }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
