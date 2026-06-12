import { Row, Col } from 'react-bootstrap';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, DollarSign, Star, RefreshCw } from 'lucide-react';
import { useMDDashboard } from '../../queries/useDashboardQueries';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import styles from './Dashboard.module.css';

export default function MDDashboard() {
  const { data, isLoading, refetch, isFetching } = useMDDashboard();

  if (isLoading) return <Loader fullPage text="Loading executive dashboard..." />;

  const kpis = [
    { label: 'Monthly Revenue', value: formatCurrency(data?.monthlyRevenue ?? 0), icon: DollarSign, gradient: 'var(--gradient-primary)', change: '+18% vs last month', positive: true },
    { label: 'Total Jobs Today', value: data?.totalVehiclesToday ?? 0, icon: TrendingUp, gradient: 'var(--gradient-success)', change: '+12% vs yesterday', positive: true },
    { label: 'Customer Satisfaction', value: `${data?.csat ?? 0}/5.0`, icon: Star, gradient: 'var(--gradient-warning)', change: 'Excellent rating', positive: true },
    { label: 'Avg Turnaround', value: data?.avgTurnaroundTime ?? '—', icon: Users, gradient: 'var(--gradient-accent)', change: '-0.3 hrs vs target', positive: true },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Executive Dashboard"
        subtitle="High-level operational and financial overview"
        actions={
          <Button variant="secondary" size="sm" leftIcon={RefreshCw} isLoading={isFetching} onClick={() => refetch()}>
            Refresh
          </Button>
        }
      />

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

      <Row className="g-4 mb-4">
        <Col xl={7}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Weekly Revenue Trend</h5>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data?.weeklyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [formatCurrency(v), 'Revenue']} contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xl={5}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Top Technicians</h5>
            </div>
            <div className="d-flex flex-column gap-3 mt-2">
              {(data?.topTechnicians || []).map((tech, i) => (
                <div key={i} className="d-flex align-items-center gap-3">
                  <div
                    style={{ width: 36, height: 36, borderRadius: '50%', background: ['#3B82F6', '#10B981', '#F59E0B'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{tech.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{tech.jobs} jobs</span>
                    </div>
                    <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${(tech.rating / 5) * 100}%`, background: ['#3B82F6', '#10B981', '#F59E0B'][i], borderRadius: 3 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B' }}>⭐ {tech.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={12}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Daily Jobs Comparison</h5>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.weeklyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="jobs" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Jobs Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}
