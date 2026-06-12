import { TrendingUp } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';

export default function KPIDashboard() {
  return (
    <div>
      <PageHeader
        title="KPI Dashboard"
        subtitle="High level performance indicators and service center efficiency"
        breadcrumbs={[{ label: 'KPI Dashboard' }]}
      />
      <div className="premium-card p-5 text-center mt-4">
        <TrendingUp size={48} className="text-muted mb-3 opacity-50" />
        <h4 className="text-muted">KPI Analytics Module</h4>
        <p className="text-muted mb-4">Detailed metrics on mechanic efficiency, bay utilization, and turnaround times will appear here.</p>
      </div>
    </div>
  );
}
