import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import { toastSuccess } from '../../../../notifications/toast';
import { ROUTES } from '../../../../config/routes';

const PERMISSION_ROWS = [
  { module: 'Administration', subModule: 'Admin Dashboard' },
  { module: 'Administration', subModule: 'User Management' },
  { module: 'Administration', subModule: 'Role Management' },
  { module: 'Administration', subModule: 'Service Items' },
  { module: 'Administration', subModule: 'System Settings' },
  { module: 'Administration', subModule: 'Audit Logs' },
  { module: 'Gate Operations', subModule: 'Gate Dashboard' },
  { module: 'Gate Operations', subModule: 'Vehicle Entry' },
  { module: 'CRM Operations', subModule: 'CRM Dashboard' },
  { module: 'CRM Operations', subModule: 'Pending Approvals' },
  { module: 'CRM Operations', subModule: 'Delivery Ready' },
  { module: 'Floor Workshop', subModule: 'Floor Dashboard' },
  { module: 'Floor Workshop', subModule: 'Mechanical Queue' },
  { module: 'Floor Workshop', subModule: 'Assign Mechanic' },
  { module: 'Floor Workshop', subModule: 'Additional Work' },
  { module: 'Body Shop', subModule: 'Body Shop Queue' },
  { module: 'Water Wash', subModule: 'Water Wash Queue' },
  { module: 'Manager Operations', subModule: 'Manager Dashboard' },
  { module: 'Manager Operations', subModule: 'Operations Overview' },
  { module: 'Manager Operations', subModule: 'Delayed Jobs' },
  { module: 'Manager Operations', subModule: 'Reports' },
  { module: 'MD Analytics', subModule: 'MD Dashboard' },
  { module: 'MD Analytics', subModule: 'Executive Overview' },
  { module: 'MD Analytics', subModule: 'Performance Report' },
  { module: 'MD Analytics', subModule: 'Service KPI' },
  { module: 'Common Pages', subModule: 'Customers' },
  { module: 'Common Pages', subModule: 'Vehicles' },
  { module: 'Common Pages', subModule: 'Job Cards' },
  { module: 'Common Pages', subModule: 'Notifications' }
];

const DESIGNATIONS = ['Super Admin', 'General Manager', 'Floor Supervisor', 'Gate Security Executive', 'CRM Officer', 'Body Shop Lead', 'Water Wash Lead', 'Managing Director'];
const ROLES = ['SUPER_ADMIN', 'MANAGER', 'FLOOR_SUPERVISOR', 'GATE_SECURITY', 'CRM_TEAM', 'BODY_SHOP_SUPERVISOR', 'WATER_WASH_TEAM', 'MD'];

export default function RolePrivilegesForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);

  // Grid permissions state
  const [privileges, setPrivileges] = useState(
    PERMISSION_ROWS.reduce((acc, _, index) => {
      acc[index] = { read: false, create: false, update: false, delete: false };
      return acc;
    }, {})
  );

  useEffect(() => {
    if (isEdit) {
      // Mock pre-populating details
      setDesignation('General Manager');
      setRole('MANAGER');
      setPrivileges(
        PERMISSION_ROWS.reduce((acc, _, index) => {
          acc[index] = { read: true, create: index % 2 === 0, update: index % 3 === 0, delete: false };
          return acc;
        }, {})
      );
    }
  }, [isEdit]);

  const handleCheckboxChange = (index, type) => {
    setPrivileges(prev => {
      const row = { ...prev[index] };
      row[type] = !row[type];
      return { ...prev, [index]: row };
    });
  };

  const handleSelectAllChange = (index) => {
    setPrivileges(prev => {
      const row = { ...prev[index] };
      const allChecked = row.read && row.create && row.update && row.delete;
      return {
        ...prev,
        [index]: {
          read: !allChecked,
          create: !allChecked,
          update: !allChecked,
          delete: !allChecked
        }
      };
    });
  };

  const handleSave = () => {
    if (!designation || !role) {
      alert('Please select Designation and Role.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toastSuccess(`Role privileges for "${designation}" saved successfully!`);
      navigate(ROUTES.ADMIN_ROLES);
    }, 800);
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', padding: '1.5rem 0' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <h4 className="fw-bold m-0" style={{ color: '#2D3748', fontSize: '1.25rem' }}>
          {isEdit ? 'Edit' : 'Add'} Role Privileges
        </h4>
        <button
          onClick={() => navigate(ROUTES.ADMIN_ROLES)}
          style={{
            background: 'none',
            border: 'none',
            color: '#4A5568',
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back to Role Privileges
        </button>
      </div>

      <div className="container-fluid px-3">
        {/* Dropdowns selection row */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '12px' }}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small text-muted">
                Designation <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                style={{ fontSize: '0.9rem', padding: '0.6rem' }}
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                disabled={isEdit}
              >
                <option value="">Select Designation</option>
                {DESIGNATIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small text-muted">
                Role <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                style={{ fontSize: '0.9rem', padding: '0.6rem' }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isEdit}
              >
                <option value="">Select Role</option>
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Privileges Table */}
        <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#E2E8F0', borderBottom: '2px solid #CBD5E0' }}>
                  <th style={{ padding: '1rem', color: '#4A5568', fontWeight: 600, fontSize: '0.82rem' }}>Module Name</th>
                  <th style={{ padding: '1rem', color: '#4A5568', fontWeight: 600, fontSize: '0.82rem', textAlign: 'center' }}>Read</th>
                  <th style={{ padding: '1rem', color: '#4A5568', fontWeight: 600, fontSize: '0.82rem', textAlign: 'center' }}>Create</th>
                  <th style={{ padding: '1rem', color: '#4A5568', fontWeight: 600, fontSize: '0.82rem', textAlign: 'center' }}>Update</th>
                  <th style={{ padding: '1rem', color: '#4A5568', fontWeight: 600, fontSize: '0.82rem', textAlign: 'center' }}>Delete</th>
                  <th style={{ padding: '1rem', color: '#4A5568', fontWeight: 600, fontSize: '0.82rem', textAlign: 'center' }}>Select All</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSION_ROWS.map((row, idx) => {
                  const state = privileges[idx] || { read: false, create: false, update: false, delete: false };
                  const allChecked = state.read && state.create && state.update && state.delete;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #EDF2F7' }}>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#2D3748' }}>
                        {row.subModule}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ cursor: 'pointer', scale: '1.1' }}
                          checked={state.read}
                          onChange={() => handleCheckboxChange(idx, 'read')}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ cursor: 'pointer', scale: '1.1' }}
                          checked={state.create}
                          onChange={() => handleCheckboxChange(idx, 'create')}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ cursor: 'pointer', scale: '1.1' }}
                          checked={state.update}
                          onChange={() => handleCheckboxChange(idx, 'update')}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ cursor: 'pointer', scale: '1.1' }}
                          checked={state.delete}
                          onChange={() => handleCheckboxChange(idx, 'delete')}
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          style={{ cursor: 'pointer', scale: '1.1' }}
                          checked={allChecked}
                          onChange={() => handleSelectAllChange(idx)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="d-flex justify-content-end gap-3 mt-4 px-2">
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.ADMIN_ROLES)}
            style={{
              background: '#FFFFFF',
              color: '#4A5568',
              border: '1px solid #CBD5E0',
              padding: '0.6rem 1.75rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            isLoading={saving}
            onClick={handleSave}
            style={{
              background: '#FD7E14',
              borderColor: '#FD7E14',
              color: '#FFFFFF',
              padding: '0.6rem 1.75rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
