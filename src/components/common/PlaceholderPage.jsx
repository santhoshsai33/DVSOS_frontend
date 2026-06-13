import { Construction } from 'lucide-react';
import PageHeader from '../shared/PageHeader';
import EmptyState from './EmptyState';

export default function PlaceholderPage({ title, subtitle = 'This module is scaffolded for backend integration.' }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} breadcrumbs={[{ label: title }]} />
      <div className="premium-card p-4">
        <EmptyState
          icon={Construction}
          title={`${title} coming online`}
          message="The route, navigation, permission boundary, and layout are ready. Connect API data and workflow actions here."
        />
      </div>
    </div>
  );
}

