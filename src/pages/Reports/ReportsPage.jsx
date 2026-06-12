import { BarChart2, Download } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/common/Button';

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Generate and download operational reports"
        breadcrumbs={[{ label: 'Reports' }]}
      />
      <div className="bg-white rounded border p-5 text-center mt-4">
        <BarChart2 size={48} className="text-muted mb-3 opacity-50" />
        <h4 className="text-muted">Reports Module Configuration</h4>
        <p className="text-muted mb-4">Select a date range and report type to generate CSV exports.</p>
        
        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline" leftIcon={Download}>Download Daily Service Report</Button>
          <Button variant="outline" leftIcon={Download}>Download Revenue Summary</Button>
          <Button variant="outline" leftIcon={Download}>Download Technician Performance</Button>
        </div>
      </div>
    </div>
  );
}
