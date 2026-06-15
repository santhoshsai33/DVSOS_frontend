import { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { toastSuccess } from '../../../../notifications/toast';
import styles from '../../../../pages/GateEntry/GateEntry.module.css';

export default function GateEntryUpdate({ vehicle, onBack }) {
  const [entryDate, setEntryDate] = useState(vehicle?.entryTime ? vehicle.entryTime.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [entryTime, setEntryTime] = useState(vehicle?.entryTime ? vehicle.entryTime.split('T')[1].slice(0, 5) : new Date().toTimeString().split(' ')[0].slice(0, 5));
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toastSuccess(`Vehicle ${vehicle.vehicleNumber} entry details updated successfully!`);
    onBack();
  };

  if (!vehicle) return null;

  return (
    <div style={{ background: '#fff', minHeight: '100%', padding: '2rem 2.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.3rem', color: '#152326' }}>
          Update Entry Log Details
        </h4>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6B7280', fontSize: '0.875rem', fontWeight: 500,
            padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Back to List
        </button>
      </div>

      <Form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>Vehicle Details</div>
          <div style={{ fontWeight: 700, color: '#152326', fontSize: '1.05rem', marginTop: 2 }}>{vehicle.vehicleNumber}</div>
          <div style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: 2 }}>{vehicle.makeModel} • {vehicle.ownerName}</div>
        </div>

        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                Vehicle Entry Date *
              </Form.Label>
              <Form.Control
                type="date"
                required
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>
                Vehicle Entry Time *
              </Form.Label>
              <Form.Control
                type="time"
                required
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>
          </Col>
        </Row>

        <div style={{ borderTop: '1px solid #E2E5DC', margin: '1.5rem 0' }} />

        {/* Upload Images */}
        <p style={{ fontWeight: 600, fontSize: '1rem', color: '#152326', marginBottom: '1.25rem' }}>
          Upload Vehicle Images
        </p>
        <div className={styles.imageUploadArea} style={{ position: 'relative' }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              opacity: 0, cursor: 'pointer'
            }}
          />
          <Upload size={32} className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            {images.length > 0 ? `${images.length} files selected` : <>Drag & drop vehicle images or <span>browse</span></>}
          </p>
          <p className={styles.uploadHint}>Supports JPG, PNG up to 10MB each</p>
        </div>

        {images.length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {images.map((file, idx) => (
              <div key={idx} style={{ padding: '0.25rem 0.5rem', background: '#E2E5DC', borderRadius: '4px', fontSize: '0.75rem', color: '#152326' }}>
                {file.name}
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{
          borderTop: '1px solid #E2E5DC',
          marginTop: '3rem', paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
        }}>
          <Button variant="secondary" type="button" onClick={onBack}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={Save}>
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
}
