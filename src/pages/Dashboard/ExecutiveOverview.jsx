import { Row, Col } from 'react-bootstrap';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Star, Clock, Users,
  Award, Target, RefreshCw
} from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/shared/PageHeader';
import { formatCurrency } from '../../utils/formatters';
import styles from './Dashboard.module.css';

const BRANCH_DATA = [
  { branch: 'Chennai – Main', revenue: 328000, target: 300000, jobs: 84, csat: 4.7, avgTAT: '3.2 hrs', onTime: 92 },
  { branch: 'Chennai – OMR', revenue: 215000, target: 250000, jobs: 56, csat: 4.4, avgTAT: '3.8 hrs', onTime: 85 },
  { branch: 'Bangalore', revenue: 184000, target: 200000, jobs: 48, csat: 4.6, avgTAT: '4.1 hrs', onTime: 88 },
];

const MONTHLY_TREND = [
  { month: 'Jan', revenue: 680000, target: 700000 },
  { month: 'Feb', revenue: 720000, target: 700000 },
  { month: 'Mar', revenue: 695000, target: 720000 },
  { month: 'Apr', revenue: 810000, target: 750000 },
  { month: 'May', revenue: 755000, target: 750000 },
  { month: 'Jun', revenue: 727000, target: 760000 },
];

const RADAR_DATA = [
  { subject: 'Revenue', A: 88, fullMark: 100 },
  { subject: 'CSAT', A: 94, fullMark: 100 },
  { subject: 'On-Time', A: 88, fullMark: 100 },
  { subject: 'Throughput', A: 76, fullMark: 100 },
  { subject: 'Efficiency', A: 82, fullMark: 100 },
];

function TrendIndicator({ value, target }) {
  const pct = ((value / target) * 100).toFixed(0);
  const isGood = value >= target;
  return (
    <span style={{ color: isGood ? '#10B981' : '#EF4444', fontSize: '0.78rem', fontWeight: 700 }}>
      {isGood ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {' '}{pct}% of target
    </span>
  );
}

export default function ExecutiveOverview() {
  const totalRevenue = BRANCH_DATA.reduce((s, b) => s + b.revenue, 0);
  const totalTarget = BRANCH_DATA.reduce((s, b) => s + b.target, 0);
  const avgCsat = (BRANCH_DATA.reduce((s, b) => s + b.csat, 0) / BRANCH_DATA.length).toFixed(1);
  const totalJobs = BRANCH_DATA.reduce((s, b) => s + b.jobs, 0);
  const avgOnTime = Math.round(BRANCH_DATA.reduce((s, b) => s + b.onTime, 0) / BRANCH_DATA.length);

  const kpis = [
    { label: 'Total Revenue (MTD)', value: formatCurrency(totalRevenue), icon: DollarSign, gradient: 'var(--gradient-primary)', sub: <TrendIndicator value={totalRevenue} target={totalTarget} /> },
    { label: 'Total Jobs (MTD)', value: totalJobs, icon: Target, gradient: 'var(--gradient-success)', sub: 'Across all branches' },
    { label: 'Avg CSAT Score', value: `${avgCsat} / 5.0`, icon: Star, gradient: 'var(--gradient-warning)', sub: 'Customer satisfaction index' },
    { label: 'On-Time Delivery', value: `${avgOnTime}%`, icon: Clock, gradient: 'var(--gradient-accent)', sub: 'Promised vs actual delivery' },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Executive Overview"
        subtitle="Multi-branch performance, revenue vs target and operational KPIs"
        breadcrumbs={[{ label: 'MD', path: '/md/dashboard' }, { label: 'Executive Overview' }]}
        actions={
          <Button variant="secondary" size="sm" leftIcon={RefreshCw}>
            Refresh
          </Button>
        }
      />

      {/* KPI Row */}
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
                    <span className={styles.kpiChange}>{kpi.sub}</span>
                  </div>
                </div>
                <div className={styles.kpiBg} style={{ background: kpi.gradient }} />
              </div>
            </Col>
          );
        })}
      </Row>

      <Row className="g-4 mb-4">
        {/* Monthly Revenue vs Target */}
        <Col xl={8}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Monthly Revenue vs Target</h5>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={MONTHLY_TREND} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [formatCurrency(v)]} contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="revenue" fill="#0F766E" radius={[4, 4, 0, 0]} name="Actual Revenue" />
                <Bar dataKey="target" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        {/* Performance Radar */}
        <Col xl={4}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h5 className={styles.chartTitle}>Performance Scorecard</h5>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
                <Radar name="Score" dataKey="A" stroke="#0F766E" fill="#0F766E" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* Branch-wise Breakdown */}
      <div className="premium-card">
        <div className="p-3 border-bottom">
          <h5 className="mb-0 fs-6 fw-bold d-flex align-items-center gap-2">
            <Award size={18} style={{ color: 'var(--color-primary)' }} />
            Branch-wise Performance
          </h5>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Branch</th>
                <th>Revenue (MTD)</th>
                <th>vs Target</th>
                <th>Total Jobs</th>
                <th>CSAT</th>
                <th>Avg TAT</th>
                <th>On-Time %</th>
              </tr>
            </thead>
            <tbody>
              {BRANCH_DATA.map((b, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.branch}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrency(b.revenue)}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, width: 80 }}>
                        <div style={{ height: '100%', width: `${Math.min((b.revenue / b.target) * 100, 100)}%`, background: b.revenue >= b.target ? '#10B981' : '#F59E0B', borderRadius: 3 }} />
                      </div>
                      <TrendIndicator value={b.revenue} target={b.target} />
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{b.jobs}</td>
                  <td>
                    <span style={{ color: b.csat >= 4.5 ? '#10B981' : '#F59E0B', fontWeight: 700 }}>
                      ⭐ {b.csat}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{b.avgTAT}</td>
                  <td>
                    <span style={{ color: b.onTime >= 90 ? '#10B981' : b.onTime >= 80 ? '#F59E0B' : '#EF4444', fontWeight: 700 }}>
                      {b.onTime}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
