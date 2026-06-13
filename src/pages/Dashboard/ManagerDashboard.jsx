import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import DataTable from '../../components/common/DataTable';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Car, Clock, CheckCircle2, AlertTriangle, TrendingUp,
  Wrench, Paintbrush, Droplets, RefreshCw, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useManagerDashboard } from '../../queries/useDashboardQueries';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import useAuthStore from '../../store/useAuthStore';
import { ROUTES } from '../../config/routes';
import styles from './Dashboard.module.css';

const PIE_COLORS = ['#0F766E', '#B7791F', '#2563EB', '#B42318', '#6B7280'];

export default function ManagerDashboard() {
  const { data, isLoading, refetch, isFetching } = useManagerDashboard();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loader fullPage text="Loading dashboard..." />;

  const kpis = [
    {
      label: 'Vehicles Today',
      value: data?.totalVehiclesToday ?? 0,
      icon: Car,
      gradient: 'var(--gradient-primary)',
      change: '+12% vs yesterday',
      positive: true,
    },
    {
      label: 'Pending Approvals',
      value: data?.pendingApprovals ?? 0,
      icon: Clock,
      gradient: 'var(--gradient-warning)',
      change: '2 require urgent action',
      positive: false,
    },
    {
      label: 'Completed Jobs',
      value: data?.completedJobs ?? 0,
      icon: CheckCircle2,
      gradient: 'var(--gradient-success)',
      change: '+8% vs yesterday',
      positive: true,
    },
    {
      label: 'Delayed Vehicles',
      value: data?.delayedJobs ?? 0,
      icon: AlertTriangle,
      gradient: 'var(--gradient-danger)',
      change: '1 over 24 hrs',
      positive: false,
    },
  ];

  const queueCards = [
    { label: 'Mechanical', icon: Wrench, data: data?.queueSummary?.mechanical, path: ROUTES.FLOOR_MECHANICAL_QUEUE, color: '#0F766E' },
    { label: 'Body Shop', icon: Paintbrush, data: data?.queueSummary?.bodyShop, path: ROUTES.BODY_SHOP_QUEUE, color: '#B7791F' },
    { label: 'Water Wash', icon: Droplets, data: data?.queueSummary?.waterWash, path: ROUTES.WATER_WASH_QUEUE, color: '#2563EB' },
  ];

  const jobColumns = [
    { header: 'Vehicle No', accessor: 'vehicleNo', render: (row) => <strong style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{row.vehicleNo}</strong> },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Stage', accessor: 'stage' },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Time in Stage', accessor: 'timeInStage' },
  ];

  const recentJobs = data?.recentJobs || [];

  return (
    <div className={styles.page}>
      <PageHeader
        title={`Good ${new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, ${user?.name?.split(' ')[0] || 'Manager'} 👋`}
        subtitle="Here's your operations overview for today"
        actions={
          <div className="d-flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={RefreshCw} isLoading={isFetching} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" leftIcon={Plus} onClick={() => navigate(ROUTES.GATE_ENTRY)}>
              New Entry
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <Row className="g-4 mb-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Col xl={3} md={6} key={i}>
              <div className={styles.kpiCard}>
                <div className={styles.kpiContent}>
                  <div className={styles.kpiIconWrapper} style={{ background: kpi.gradient }}>
                    <Icon size={24} />
                  </div>
                  <div className={styles.kpiText}>
                    <p className={styles.kpiLabel}>{kpi.label}</p>
                    <h2 className={styles.kpiValue}>{kpi.value}</h2>
                    <span className={[styles.kpiChange, kpi.positive ? styles.positive : styles.negative].join(' ')}>
                      {kpi.positive ? <TrendingUp size={11} /> : <AlertTriangle size={11} />}
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={styles.kpiBg} style={{ background: kpi.gradient }} />
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        {/* Revenue Area Chart */}
        <Col xl={8}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Weekly Revenue & Jobs</h5>
              <span className={styles.chartMeta}>{formatCurrency(data?.revenueToday ?? 0)} today</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data?.weeklyRevenue || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v, name) => [name === 'revenue' ? formatCurrency(v) : v, name === 'revenue' ? 'Revenue' : 'Jobs']} contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} />
                <Area type="monotone" dataKey="jobs" stroke="#B7791F" strokeWidth={2} fill="none" dot={false} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>

        {/* Service Pie Chart */}
        <Col xl={4}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Service Breakdown</h5>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data?.serviceBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(data?.serviceBreakdown || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* Queue Summary */}
      {/* <Row className="g-4 mb-4">
        {queueCards.map((q) => {
          const Icon = q.icon;
          return (
            <Col md={4} key={q.label}>
              <div className={styles.queueCard} onClick={() => navigate(q.path)} style={{ '--q-color': q.color }}>
                <div className={styles.queueHeader}>
                  <div className={styles.queueIcon} style={{ background: q.color + '20', color: q.color }}>
                    <Icon size={20} />
                  </div>
                  <span className={styles.queueTitle}>{q.label} Queue</span>
                </div>
                <div className={styles.queueStats}>
                  <div className={styles.queueStat}>
                    <span className={styles.queueStatNum} style={{ color: '#B7791F' }}>{q.data?.pending ?? 0}</span>
                    <span className={styles.queueStatLabel}>Pending</span>
                  </div>
                  <div className={styles.queueStat}>
                    <span className={styles.queueStatNum} style={{ color: q.color }}>{q.data?.inProgress ?? 0}</span>
                    <span className={styles.queueStatLabel}>In Progress</span>
                  </div>
                  <div className={styles.queueStat}>
                    <span className={styles.queueStatNum} style={{ color: '#0F766E' }}>{q.data?.completed ?? 0}</span>
                    <span className={styles.queueStatLabel}>Done</span>
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row> */}

      {/* Recent Jobs Table */}
      <div className="premium-card d-flex flex-column">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fs-6 fw-bold">Active Jobs</h5>
          <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.JOB_CARDS)}>View All</Button>
        </div>
        <DataTable
          columns={jobColumns}
          data={recentJobs}
          onRowClick={(row) => navigate(`${ROUTES.JOB_CARDS}/${row.id}`)}
          emptyMessage="No active jobs found"
        />
      </div>
    </div>
  );
}
