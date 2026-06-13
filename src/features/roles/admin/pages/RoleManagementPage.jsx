import { useState } from 'react';
import { ShieldCheck, Check, X, Save, Info } from 'lucide-react';
import Button from '../../../../components/common/Button';
import PageHeader from '../../../../components/shared/PageHeader';
import { toastSuccess } from '../../../../notifications/toast';
import { ROUTES } from '../../../../config/routes';

const ROLES_CONFIG = [
  { key: 'gate_security', label: 'Gate Security', color: '#3B82F6' },
  { key: 'crm_team', label: 'CRM Team', color: '#8B5CF6' },
  { key: 'floor_supervisor', label: 'Floor Supervisor', color: '#10B981' },
  { key: 'body_shop_supervisor', label: 'Body Shop Supervisor', color: '#F59E0B' },
  { key: 'water_wash_team', label: 'Water Wash Team', color: '#06B6D4' },
  { key: 'manager', label: 'Manager', color: '#0F766E' },
  { key: 'md', label: 'Managing Director', color: '#DC2626' },
];

const PERMISSIONS_CONFIG = [
  {
    group: 'Gate Operations',
    perms: [
      { key: 'perm_gate_entry', label: 'Record Vehicle Entry' },
      { key: 'perm_gate_exit', label: 'Record Vehicle Exit' },
      { key: 'perm_gate_view', label: 'View Gate Dashboard' },
    ],
  },
  {
    group: 'CRM & Job Cards',
    perms: [
      { key: 'perm_crm_view', label: 'View CRM Dashboard' },
      { key: 'perm_job_create', label: 'Create Job Card' },
      { key: 'perm_job_edit', label: 'Edit Job Card' },
      { key: 'perm_job_view', label: 'View Job Cards' },
      { key: 'perm_delivery_ready', label: 'View Delivery Ready' },
    ],
  },
  {
    group: 'Workshop Floor',
    perms: [
      { key: 'perm_floor_view', label: 'View Floor Dashboard' },
      { key: 'perm_assign_mechanic', label: 'Assign Mechanic' },
      { key: 'perm_body_shop', label: 'Body Shop Operations' },
      { key: 'perm_water_wash', label: 'Water Wash Operations' },
      { key: 'perm_additional_work', label: 'Raise Additional Work' },
    ],
  },
  {
    group: 'Management & Reports',
    perms: [
      { key: 'perm_mgr_dashboard', label: 'Manager Dashboard' },
      { key: 'perm_approvals', label: 'Approve Estimates' },
      { key: 'perm_reports', label: 'View Reports' },
      { key: 'perm_kpi', label: 'View KPI / MD Dashboard' },
    ],
  },
  {
    group: 'Administration',
    perms: [
      { key: 'perm_user_mgmt', label: 'User Management' },
      { key: 'perm_role_mgmt', label: 'Role Management' },
      { key: 'perm_service_items', label: 'Manage Service Items' },
      { key: 'perm_settings', label: 'System Settings' },
      { key: 'perm_audit_logs', label: 'View Audit Logs' },
    ],
  },
];

// Default matrix
const DEFAULT_MATRIX = {
  gate_security:       { perm_gate_entry: true, perm_gate_exit: true, perm_gate_view: true, perm_job_view: true },
  crm_team:           { perm_crm_view: true, perm_job_create: true, perm_job_edit: true, perm_job_view: true, perm_delivery_ready: true },
  floor_supervisor:   { perm_floor_view: true, perm_assign_mechanic: true, perm_additional_work: true, perm_job_view: true },
  body_shop_supervisor: { perm_body_shop: true, perm_floor_view: true, perm_job_view: true },
  water_wash_team:    { perm_water_wash: true, perm_job_view: true },
  manager:            { perm_gate_view: true, perm_crm_view: true, perm_job_view: true, perm_floor_view: true, perm_mgr_dashboard: true, perm_approvals: true, perm_reports: true, perm_delivery_ready: true },
  md:                 { perm_mgr_dashboard: true, perm_reports: true, perm_kpi: true, perm_approvals: true, perm_job_view: true },
};

function PermToggle({ enabled, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 32, height: 32, borderRadius: '8px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: enabled ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.08)',
        border: `1.5px solid ${enabled ? '#10B981' : '#FCA5A5'}`,
        transition: 'all 0.15s',
      }}
    >
      {enabled
        ? <Check size={15} style={{ color: '#10B981', strokeWidth: 2.5 }} />
        : <X size={15} style={{ color: '#EF4444', strokeWidth: 2 }} />
      }
    </div>
  );
}

export default function RoleManagementPage() {
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX);
  const [saving, setSaving] = useState(false);

  const togglePerm = (roleKey, permKey) => {
    setMatrix(prev => ({
      ...prev,
      [roleKey]: {
        ...(prev[roleKey] || {}),
        [permKey]: !(prev[roleKey]?.[permKey]),
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toastSuccess('Role permissions saved successfully!');
  };

  return (
    <div>
      <PageHeader
        title="Role Management"
        subtitle="Configure permissions for each role in the service center"
        breadcrumbs={[{ label: 'Admin', path: ROUTES.ADMIN_DASHBOARD }, { label: 'Role Management' }]}
        actions={
          <Button variant="primary" leftIcon={Save} isLoading={saving} onClick={handleSave}>
            Save Permissions
          </Button>
        }
      />

      <div style={{
        background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.83rem', color: '#1D4ED8'
      }}>
        <Info size={16} />
        Changes here affect what each role can see and do across the system. Toggle the checkboxes below and click Save.
      </div>

      <div className="premium-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          {/* Header Row — Roles */}
          <thead>
            <tr>
              <th style={{ padding: '1rem 1.25rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 180, position: 'sticky', left: 0, background: 'var(--color-bg-card)', zIndex: 2, borderBottom: '2px solid var(--color-border)' }}>
                Permission
              </th>
              {ROLES_CONFIG.map(role => (
                <th key={role.key} style={{ padding: '1rem 0.75rem', textAlign: 'center', borderBottom: '2px solid var(--color-border)', minWidth: 120 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: role.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={16} style={{ color: role.color }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: role.color, whiteSpace: 'nowrap' }}>{role.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS_CONFIG.map((group, gi) => (
              <>
                {/* Group Header */}
                <tr key={`group-${gi}`}>
                  <td
                    colSpan={ROLES_CONFIG.length + 1}
                    style={{
                      padding: '0.6rem 1.25rem', fontWeight: 700, fontSize: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      background: 'rgba(100,116,139,0.06)', color: 'var(--color-text-muted)',
                      borderTop: gi > 0 ? '1px solid var(--color-border)' : 'none',
                      position: 'sticky', left: 0,
                    }}
                  >
                    {group.group}
                  </td>
                </tr>
                {group.perms.map((perm, pi) => (
                  <tr
                    key={perm.key}
                    style={{ background: pi % 2 === 0 ? 'transparent' : 'rgba(100,116,139,0.02)' }}
                  >
                    <td style={{
                      padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: 500,
                      borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap',
                      position: 'sticky', left: 0, background: pi % 2 === 0 ? 'var(--color-bg-card)' : 'rgba(100,116,139,0.02)',
                    }}>
                      {perm.label}
                    </td>
                    {ROLES_CONFIG.map(role => (
                      <td key={role.key} style={{ textAlign: 'center', padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <PermToggle
                            enabled={!!(matrix[role.key]?.[perm.key])}
                            onChange={() => togglePerm(role.key, perm.key)}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
